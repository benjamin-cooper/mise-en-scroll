// Standalone archive crawler — walks each blog's sitemap.xml to find its full
// post history (RSS only exposes the last ~5-20 posts; sitemaps cover
// everything). Run with: node crawl-archive.js [blogName substring]
//
// Safe to re-run: upserts by URL, so it's fine to stop and resume, or to
// re-run periodically to pick up newly-published posts.
const { BLOGS } = require('./blogs.js');
const { isRoundup, itemBelongsToFeed, cleanRecipeUrl } = require('./server.js');
const { batchUpsertRecipes, setCrawlState, client } = require('./archive-db.js');

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

async function main() {
  const filter = process.argv[2];
  const targets = filter ? BLOGS.filter(b => b.name.toLowerCase().includes(filter.toLowerCase())) : BLOGS;
  console.log(`Crawling ${targets.length} blog(s)...\n`);

  let done = 0;
  const results = [];
  for (const blog of targets) {
    try {
      const r = await crawlBlog(blog);
      results.push(r);
      done++;
      console.log(`[${done}/${targets.length}] ${r.blog}: ${r.status} (${r.count} recipes)`);
    } catch (err) {
      results.push({ blog: blog.name, count: 0, status: 'error' });
      done++;
      console.log(`[${done}/${targets.length}] ${blog.name}: ERROR ${err.message}`);
    }
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
