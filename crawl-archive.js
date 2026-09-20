// Standalone archive crawler — walks each blog's sitemap.xml to find its full
// post history (RSS only exposes the last ~5-20 posts; sitemaps cover
// everything). Run with: node crawl-archive.js [blogName substring]
//
// Safe to re-run: upserts by URL, so it's fine to stop and resume, or to
// re-run periodically to pick up newly-published posts.
const { BLOGS } = require('./blogs.js');
const { isRoundup, itemBelongsToFeed, cleanRecipeUrl } = require('./server.js');
const { batchUpsertRecipes, setCrawlState, pruneRemovedBlogs, client } = require('./archive-db.js');

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
const TAXONOMY_SEGMENTS = new Set(['cook-method', 'course', 'cuisine', 'diet', 'ingredient', 'season', 'occasion', 'category', 'tag', 'method']);

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
      await batchUpsertRecipes(toUpsert.slice(i, i + BATCH_CHUNK_SIZE));
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

async function crawlPool(targets) {
  let idx = 0, done = 0;
  const results = new Array(targets.length);
  async function worker() {
    while (idx < targets.length) {
      const i = idx++;
      const blog = targets[i];
      try {
        results[i] = await crawlBlog(blog);
      } catch (err) {
        results[i] = { blog: blog.name, count: 0, status: 'error' };
      }
      done++;
      console.log(`[${done}/${targets.length}] ${results[i].blog}: ${results[i].status} (${results[i].count} recipes)`);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, targets.length) }, worker));
  return results;
}

async function main() {
  const filter = process.argv[2];
  const targets = filter ? BLOGS.filter(b => b.name.toLowerCase().includes(filter.toLowerCase())) : BLOGS;
  console.log(`Crawling ${targets.length} blog(s)...\n`);

  const results = await crawlPool(targets);

  // Only prune on a full, unfiltered run — a `node crawl-archive.js someBlog`
  // partial run only looked at one blog and has no business judging every
  // other blog in the archive as "removed".
  if (!filter) {
    const pruned = await pruneRemovedBlogs(BLOGS.map(b => b.name));
    if (pruned.length) console.log(`\nPruned ${pruned.length} blog(s) no longer in blogs.js: ${pruned.join(', ')}`);
  }

  const countResult = await client.execute('SELECT COUNT(*) AS c FROM recipes');
  const totalRecipes = countResult.rows[0].c;
  const ok = results.filter(r => r.status === 'ok').length;
  const noSitemap = results.filter(r => r.status === 'no_sitemap').length;
  const errors = results.filter(r => r.status === 'error').length;
  console.log(`\nDone. ${ok} crawled, ${noSitemap} had no discoverable sitemap, ${errors} errored.`);
  console.log(`Archive now has ${totalRecipes} total recipes.`);
}

main();
