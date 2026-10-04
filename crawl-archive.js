// Standalone archive crawler — walks each blog's sitemap.xml to find its full
// post history (RSS only exposes the last ~5-20 posts; sitemaps cover
// everything). Run with: node crawl-archive.js [blogName substring]
//
// Safe to re-run: upserts by URL, so it's fine to stop and resume, or to
// re-run periodically to pick up newly-published posts.
const { BLOGS } = require('./blogs.js');
const { isRoundup, itemBelongsToFeed, cleanRecipeUrl, decodeHtml, isMixedBucketCategory } = require('./server.js');
const { batchUpsertRecipes, batchUpsertRestRecipes, batchUpdateImages, isRestCovered, getRestSyncedAt, setRestSynced, setCrawlState, pruneRemovedBlogs, client } = require('./archive-db.js');

const UA = { 'User-Agent': 'Mozilla/5.0 (compatible; MiseEnScrollBot/1.0)', 'Accept': 'application/xml,text/xml,*/*' };
const FETCH_TIMEOUT = 15000;
const DELAY_BETWEEN_REQUESTS = 400; // ms — be polite, this is a lot of requests over time

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchText(url) {
  const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(FETCH_TIMEOUT) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

// Turns a URL slug into a readable title as a fallback — sitemaps don't
// carry post titles, only URL/lastmod/image. WordPress slugs are near-always
// a direct slugification of the real title, so this is usually accurate.
function titleFromSlug(url) {
  try {
    const path = new URL(url).pathname.replace(/\/+$/, '');
    const rawSlug = decodeURIComponent(path.split('/').filter(Boolean).pop() || '');
    // Some sites' sitemaps include literal static pages (foo.html, foo.php)
    // rather than clean WordPress-style directory slugs — strip the
    // extension so it doesn't leak into the generated title.
    const slug = rawSlug.replace(/\.(html?|php|aspx?)$/i, '');
    return slug
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .map(w => w.length > 2 || /^[0-9]/.test(w) ? w.charAt(0).toUpperCase() + w.slice(1) : w)
      .join(' ');
  } catch { return url; }
}

// Extracts <url>...</url> blocks from a sitemap urlset, pulling loc/lastmod/
// first image. Regex-based rather than a full XML parser — sitemap.xml is a
// simple, regular format and this avoids adding an XML-namespace-aware
// dependency just for this.
function parseUrlset(xml) {
  const entries = [];
  const blocks = xml.match(/<url>[\s\S]*?<\/url>/g) || [];
  for (const block of blocks) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim();
    if (!loc) continue;
    const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]?.trim() || null;
    const image = block.match(/<image:loc>([^<]+)<\/image:loc>/)?.[1]?.trim() || null;
    entries.push({ loc, lastmod, image });
  }
  return entries;
}

// Some blogs' sitemaps carry non-recipe alternate versions of the same post
// as their own indexable URLs: AMP "Web Stories" summaries (/web-stories/…),
// video-embed pages (/videos/…), and, for multilingual blogs (e.g. Hebbars
// Kitchen), the identical recipe re-published under a language-code path
// (/hi/…, /kn/…). None of these are a distinct recipe — they're the same
// content under a different URL — but URL-based dedup elsewhere can't catch
// them since the URLs are genuinely different. Confirmed by auditing the
// archive DB: Hebbars Kitchen alone had every recipe tripled (English +
// Hindi + Kannada paths), ~1,400 extra rows; six other blogs' /web-stories/
// and /videos/ paths accounted for several hundred more.
// WordPress custom-taxonomy archive pages (e.g. /diet/keto/, /occasion/
// christmas/) sometimes end up in a "post" sitemap alongside real recipes —
// isPostSitemap() below only filters by sitemap FILE name (category-sitemap,
// tag-sitemap, etc.), so a taxonomy under a different name slips through as
// an individual URL. These aren't recipes — they're listing pages with a
// one-or-two-word derived title ("Keto", "Christmas") and no actual content.
// Matched by an exact first-path-segment name, not a substring, so a real
// recipe slug that happens to start with one of these words (unlikely, but
// e.g. "diet-friendly-lasagna") is never affected.
// Two-level /<base>/<term>/ URLs under these bases are listing/index pages, not
// posts. Found by grouping unenriched archive rows by first path segment
// (31 groups, ~660 rows). Deliberately NOT here: "recipes" — Wholesome Yum, Jo
// Cooks and Once Upon a Chef keep real recipes at /recipes/<slug>/.
const TAXONOMY_SEGMENTS = new Set([
  'cook-method', 'course', 'courses', 'cuisine', 'cuisines', 'diet', 'dietary', 'special-diet', 'ingredient',
  'season', 'occasion', 'category', 'tag', 'method', 'recipe-method', 'recipe-type', 'recipe-length',
  'recipe-course', 'recipe-category', 'recipe-collection', 'cook-time', 'prep', 'collection', 'collections',
  'featured-group', 'groups', 'everyday', 'inspiration', 'topic', 'topics', 'glossary', 'recommendation',
  'recommendations', 'shop', 'product-category', 'download', 'downloads', 'challenge', 'book', 'books',
  'guides', 'travel', 'korean-drama',
]);

function isAlternateFormatUrl(url) {
  try {
    const path = new URL(url).pathname;
    if (/\/(web-stories|videos)\//i.test(path)) return true;
    const segs = path.split('/').filter(Boolean);
    if (/^[a-z]{2}$/i.test(segs[0] || '')) return true; // language-code path prefix
    // Exactly /taxonomy/term/ is the archive page itself (e.g. /diet/keto/).
    // Some blogs (Jo Cooks) also use a taxonomy word as part of a REAL
    // recipe's permalink (/course/desserts-2/some-actual-recipe/) — that has
    // a 3rd segment, so it's excluded from this check on purpose.
    if (segs.length === 2 && TAXONOMY_SEGMENTS.has(segs[0].toLowerCase())) return true;
    return false;
  } catch { return false; }
}

// --- WordPress REST enrichment -------------------------------------------
// Sitemaps only give a URL (the title is guessed from the slug), so archive
// rows had nothing but a title to match filter chips against. Most of these
// blogs are WordPress, whose public REST API returns the real title, excerpt,
// categories/tags and publish date, 100 posts per request (~1,200 requests for
// the whole archive vs ~100K page fetches). Blogs that don't expose it (or
// challenge bots) simply keep their sitemap-only rows.
const REST_UA = 'MiseEnScrollBot/1.0 (+https://mise-en-scroll.onrender.com)';
const REST_DELAY = 500;
const REST_MAX_PAGES = 400;

async function restGet(url) {
  let res;
  for (let attempt = 0; attempt < 3; attempt++) {
    res = await fetch(url, { headers: { 'User-Agent': REST_UA, Accept: 'application/json' }, signal: AbortSignal.timeout(25000) });
    if (res.status !== 429 && res.status < 500) return res;
    await sleep(2000 * (attempt + 1));
  }
  return res;
}

async function fetchTermMap(origin, taxonomy, maxPages) {
  const map = new Map();
  for (let page = 1; page <= maxPages; page++) {
    await sleep(REST_DELAY);
    const res = await restGet(`${origin}/wp-json/wp/v2/${taxonomy}?per_page=100&page=${page}&orderby=count&order=desc&_fields=id,name`);
    if (!res.ok) break;
    const rows = await res.json();
    for (const t of rows) map.set(t.id, decodeHtml(String(t.name || '')).trim());
    if (page >= (parseInt(res.headers.get('x-wp-totalpages')) || 1)) break;
  }
  return map;
}

const stripTags = h => String(h || '').replace(/<[^>]*>/g, ' ');
// A lone surrogate (e.g. from cutting an emoji in half) is invalid text that
// Turso rejects with an HTTP 400 for the whole batch.
const wellFormed = t => String(t).replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '');
function cleanExcerpt(html) {
  const text = decodeHtml(stripTags(html))
    .replace(/\s+/g, ' ')
    .replace(/\s*The post .{0,200}? appeared first on .*$/i, '')
    .replace(/\s*(Read more|Continue reading|Get the recipe)\W*$/i, '')
    .trim();
  return wellFormed(Array.from(text).slice(0, 220).join(''));
}

async function enrichFromRest(blog) {
  const origin = new URL(blog.feed).origin;
  const since = process.argv.includes('--full') ? null : await getRestSyncedAt(blog.name);
  const after = since ? new Date(Date.parse(since) - 3 * 864e5).toISOString().replace(/\.\d+Z$/, '') : null;
  const listUrl = (base, page) => `${origin}/wp-json/wp/v2/${base}?per_page=100&page=${page}&orderby=date&order=desc&_fields=link,title,excerpt,date_gmt,categories,tags${after ? `&after=${after}` : ''}`;

  const first = await restGet(listUrl('posts', 1));
  if (!first.ok) return { status: 'unavailable', http: first.status, count: 0 };

  // Some blogs keep their actual recipes in a custom post type (Downshiftology
  // uses "recipes"), so crawl that alongside regular posts when it's exposed.
  const bases = ['posts'];
  try {
    await sleep(REST_DELAY);
    const typesRes = await restGet(`${origin}/wp-json/wp/v2/types`);
    if (typesRes.ok) {
      const types = await typesRes.json();
      for (const t of Object.values(types)) if (/^recipes?$/.test(t.slug) && t.rest_base) bases.push(t.rest_base);
    }
  } catch { /* posts alone is fine */ }

  let catMap = null, tagMap = null, count = 0;
  for (const base of bases) {
    const head = base === 'posts' ? first : await restGet(listUrl(base, 1));
    if (!head.ok) continue;
    const totalPages = Math.min(parseInt(head.headers.get('x-wp-totalpages')) || 1, REST_MAX_PAGES);
    let posts = await head.json();
    if (!Array.isArray(posts) || !posts.length) continue;
    if (!catMap) { catMap = await fetchTermMap(origin, 'categories', 10); tagMap = await fetchTermMap(origin, 'tags', 15); }

    for (let page = 1; page <= totalPages; page++) {
      if (page > 1) {
        await sleep(REST_DELAY);
        const res = await restGet(listUrl(base, page));
        // A failure here must not look like "finished": marking the blog synced
        // would make later incremental runs skip every older post we missed.
        if (!res.ok) throw new Error(`REST ${base} page ${page} failed with HTTP ${res.status}`);
        posts = await res.json();
        if (!Array.isArray(posts)) throw new Error(`REST ${base} page ${page} returned non-array`);
        if (!posts.length) break;
      }
      const rows = [];
      for (const p of posts) {
        const url = cleanRecipeUrl(p.link);
        if (!url || !itemBelongsToFeed(blog.feed, url) || isAlternateFormatUrl(url)) continue;
        const title = wellFormed(decodeHtml(stripTags(p.title && p.title.rendered)).replace(/\s+/g, ' ').trim());
        if (!title) continue;
        // Categories are the blog's curated groupings ("Soups & Stews", "Mexican"); tags are
        // free-form and mostly ingredients. Kept apart so filter chips use only categories.
        const clean = names => [...new Set(names.filter(n => n && !/^uncategorized$/i.test(n)))].map(wellFormed);
        const categories = clean((p.categories || []).map(id => catMap.get(id))).filter(n => !isMixedBucketCategory(n)).slice(0, 14);
        const tags = clean((p.tags || []).map(id => tagMap.get(id))).slice(0, 24);
        if (isRoundup(title, url, categories)) continue;
        rows.push({
          url, blog: blog.name, blog_color: blog.color, title,
          date: p.date_gmt ? `${p.date_gmt}+00:00` : null,
          excerpt: cleanExcerpt(p.excerpt && p.excerpt.rendered), categories, tags,
        });
      }
      for (let i = 0; i < rows.length; i += BATCH_CHUNK_SIZE) await batchUpsertRestRecipes(rows.slice(i, i + BATCH_CHUNK_SIZE));
      count += rows.length;
    }
  }
  await setRestSynced(blog.name, count);
  return { status: 'ok', count };
}

function isSitemapIndex(xml) {
  return /<sitemapindex/i.test(xml);
}

// Child sitemap filenames worth walking — post/recipe content only. Skips
// page-sitemap, category-sitemap, author-sitemap, tag-sitemap, etc., which
// never contain individual post URLs.
function isPostSitemap(loc) {
  return /post-sitemap|recipe-sitemap|sitemap-posts?-post|blog-sitemap/i.test(loc)
    || !/page-sitemap|category-sitemap|author-sitemap|tag-sitemap|product-sitemap|attachment-sitemap/i.test(loc);
}

async function discoverSitemapUrls(blog) {
  const origin = new URL(blog.feed).origin;
  const candidates = [`${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`, `${origin}/wp-sitemap.xml`];
  for (const candidate of candidates) {
    try {
      const xml = await fetchText(candidate);
      if (!/<sitemapindex|<urlset/i.test(xml)) continue;
      return { rootXml: xml, rootUrl: candidate };
    } catch { /* try next candidate */ }
  }
  return null;
}

// Turso batches are sent as one round-trip, but very large batches (a busy
// blog's sitemap file can hold 700+ URLs) are chunked to stay comfortably
// under any single-batch size limit.
const BATCH_CHUNK_SIZE = 200;

async function crawlBlog(blog) {
  const root = await discoverSitemapUrls(blog);
  if (!root) {
    await setCrawlState({ blog: blog.name, last_crawled_at: new Date().toISOString(), url_count: 0, status: 'no_sitemap' });
    return { blog: blog.name, count: 0, status: 'no_sitemap' };
  }

  let childSitemaps = [root.rootUrl];
  if (isSitemapIndex(root.rootXml)) {
    const locs = [...root.rootXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
    childSitemaps = locs.filter(isPostSitemap);
    if (childSitemaps.length === 0) childSitemaps = locs; // fallback: walk everything
  }

  const restCovered = await isRestCovered(blog.name);
  let total = 0;
  for (const sitemapUrl of childSitemaps) {
    let xml;
    if (sitemapUrl === root.rootUrl && !isSitemapIndex(root.rootXml)) {
      xml = root.rootXml; // already have it, it was a direct urlset
    } else {
      await sleep(DELAY_BETWEEN_REQUESTS);
      try { xml = await fetchText(sitemapUrl); } catch { continue; }
    }
    const entries = parseUrlset(xml);
    const toUpsert = [];
    for (const entry of entries) {
      const cleanUrl = cleanRecipeUrl(entry.loc);
      if (!itemBelongsToFeed(blog.feed, cleanUrl)) continue;
      if (isAlternateFormatUrl(cleanUrl)) continue;
      const title = titleFromSlug(cleanUrl);
      if (!title || isRoundup(title, cleanUrl, [])) continue;
      toUpsert.push({ url: cleanUrl, blog: blog.name, blog_color: blog.color, title, image: entry.image, date: entry.lastmod });
    }
    for (let i = 0; i < toUpsert.length; i += BATCH_CHUNK_SIZE) {
      const chunk = toUpsert.slice(i, i + BATCH_CHUNK_SIZE);
      if (restCovered) await batchUpdateImages(chunk.filter(r => r.image).map(r => ({ url: r.url, image: r.image })));
      else await batchUpsertRecipes(chunk);
    }
    total += toUpsert.length;
  }

  await setCrawlState({ blog: blog.name, last_crawled_at: new Date().toISOString(), url_count: total, status: 'ok' });
  return { blog: blog.name, count: total, status: 'ok' };
}

// Blogs used to be crawled one at a time. At 121 blogs, a handful of slow or
// hanging hosts (each retrying up to 3 sitemap-discovery URLs at a 15s
// timeout, then N child sitemaps at another 15s each) was enough to blow
// past the GitHub Action's 90-minute budget — the run always started over
// from blog #0, so it silently never reached blogs past roughly #50 every
// single week. Different blogs are different hosts, so crawling several at
// once doesn't hammer any one site — the per-blog DELAY_BETWEEN_REQUESTS
// politeness pause still applies within a single blog's own sitemap fetches.
const CONCURRENCY = 8;

async function crawlPool(targets, { restOnly = false } = {}) {
  let idx = 0, done = 0;
  const results = new Array(targets.length);
  async function worker() {
    while (idx < targets.length) {
      const i = idx++;
      const blog = targets[i];
      // REST first: it supplies the real titles/excerpts/categories, and once a
      // blog has REST data the sitemap pass only fills in images (see
      // crawlBlog), so the order decides whether sitemap-only junk gets inserted.
      let rest;
      try {
        rest = await enrichFromRest(blog);
      } catch (err) {
        rest = { status: 'error', count: 0, error: err.message };
      }
      try {
        results[i] = restOnly ? { blog: blog.name, count: 0, status: 'skipped' } : await crawlBlog(blog);
      } catch (err) {
        results[i] = { blog: blog.name, count: 0, status: 'error' };
      }
      results[i].rest = rest;
      done++;
      const r = results[i];
      console.log(`[${done}/${targets.length}] ${r.blog}: sitemap ${r.status} (${r.count}) | rest ${r.rest.status}${r.rest.http ? ' ' + r.rest.http : ''}${r.rest.error ? ' ' + r.rest.error : ''} (${r.rest.count})`);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, targets.length) }, worker));
  return results;
}

// Quiet blogs are kept on purpose; a blog is only treated as gone when its feed
// 404s/410s or its domain stops resolving. Bot blocks (403), timeouts and 5xx
// are NOT counted — those are transient or someone else's policy, not death.
async function checkBlogsAlive(blogs) {
  const dead = [];
  let i = 0;
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (i < blogs.length) {
      const b = blogs[i++];
      try {
        const res = await fetch(b.feed, { headers: { 'User-Agent': 'rss-parser' }, signal: AbortSignal.timeout(20000) });
        if (res.status === 404 || res.status === 410) dead.push(`${b.name} (HTTP ${res.status})`);
      } catch (err) {
        if ((err.cause && err.cause.code) === 'ENOTFOUND') dead.push(`${b.name} (domain no longer resolves)`);
      }
    }
  }));
  return dead;
}

async function main() {
  const args = process.argv.slice(2);
  const restOnly = args.includes('--rest-only');
  const filter = args.find(a => !a.startsWith('--'));
  const targets = filter ? BLOGS.filter(b => b.name.toLowerCase().includes(filter.toLowerCase())) : BLOGS;
  console.log(`Crawling ${targets.length} blog(s)${restOnly ? ' (REST only)' : ''}...\n`);

  const results = await crawlPool(targets, { restOnly });

  // Only prune on a full, unfiltered run — a `node crawl-archive.js someBlog`
  // partial run only looked at one blog and has no business judging every
  // other blog in the archive as "removed".
  if (!filter) {
    const pruned = await pruneRemovedBlogs(BLOGS.map(b => b.name));
    if (pruned.length) console.log(`\nPruned ${pruned.length} blog(s) no longer in blogs.js: ${pruned.join(', ')}`);
  }

  if (!filter) {
    const dead = await checkBlogsAlive(BLOGS);
    if (dead.length) {
      console.error(`\nDEAD BLOGS (remove from blogs.js): ${dead.join(', ')}`);
      process.exitCode = 1;
    }
  }

  const countResult = await client.execute('SELECT COUNT(*) AS c FROM recipes');
  const totalRecipes = countResult.rows[0].c;
  const ok = results.filter(r => r.status === 'ok').length;
  const noSitemap = results.filter(r => r.status === 'no_sitemap').length;
  const errors = results.filter(r => r.status === 'error').length;
  console.log(`\nDone. ${ok} crawled, ${noSitemap} had no discoverable sitemap, ${errors} errored.`);
  const restOk = results.filter(r => r.rest?.status === 'ok').length;
  console.log(`REST enrichment: ${restOk} blog(s) ok, ${results.length - restOk} unavailable/errored; ${results.reduce((a, r) => a + (r.rest?.count || 0), 0)} posts upserted.`);
  // Runs from CI come from datacenter IPs that Cloudflare may challenge, which
  // would make most blogs "unavailable" while the job still looked green. If a
  // full run couldn't reach most of the blogs, fail the job so it gets noticed.
  if (!filter && restOk < results.length * 0.6) {
    console.error(`\nERROR: REST enrichment reached only ${restOk}/${results.length} blogs (normally ~90 of 96). Likely bot-blocking of this runner's IP.`);
    process.exitCode = 1;
  }
  console.log(`Archive now has ${totalRecipes} total recipes.`);
}

if (require.main === module) main();
module.exports = { isAlternateFormatUrl };
