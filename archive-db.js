// SQLite (via Turso/libSQL) archive of every recipe we can find via each
// blog's sitemap, going far beyond what each blog's RSS feed exposes (RSS is
// "what's new", usually just the last 5-20 posts; sitemaps cover the blog's
// full history). Hosted on Turso rather than a local file so the data
// survives Render's ephemeral disk and stays in sync between local crawls
// and the deployed server — both read/write the same remote database.
const { createClient } = require('@libsql/client');

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:archive.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// The FTS index covers title + blog + excerpt + categories. Excerpt and
// categories come from each blog's WordPress REST API (see crawl-archive.js);
// sitemaps alone only give a URL, from which the title is guessed.
const FTS_STATEMENTS = [
  `CREATE VIRTUAL TABLE IF NOT EXISTS recipes_fts USING fts5(
    title, blog, excerpt, categories, content='recipes', content_rowid='id'
  )`,
  `CREATE TRIGGER IF NOT EXISTS recipes_ai AFTER INSERT ON recipes BEGIN
    INSERT INTO recipes_fts(rowid, title, blog, excerpt, categories) VALUES (new.id, new.title, new.blog, new.excerpt, new.categories);
  END`,
  `CREATE TRIGGER IF NOT EXISTS recipes_ad AFTER DELETE ON recipes BEGIN
    INSERT INTO recipes_fts(recipes_fts, rowid, title, blog, excerpt, categories) VALUES('delete', old.id, old.title, old.blog, old.excerpt, old.categories);
  END`,
  `CREATE TRIGGER IF NOT EXISTS recipes_au AFTER UPDATE ON recipes BEGIN
    INSERT INTO recipes_fts(recipes_fts, rowid, title, blog, excerpt, categories) VALUES('delete', old.id, old.title, old.blog, old.excerpt, old.categories);
    INSERT INTO recipes_fts(rowid, title, blog, excerpt, categories) VALUES (new.id, new.title, new.blog, new.excerpt, new.categories);
  END`,
];

// Upgrades a database created before excerpt/categories existed. Idempotent:
// does nothing once the columns are there. The FTS table can't be altered, so
// it (and its triggers) are dropped and rebuilt from the recipes table in a
// single atomic batch.
async function migrateEnrichmentColumns() {
  const cols = (await client.execute('PRAGMA table_info(recipes)')).rows.map(r => r.name);
  if (!cols.includes('excerpt')) {
    await client.batch([
      'ALTER TABLE recipes ADD COLUMN excerpt TEXT',
      'ALTER TABLE recipes ADD COLUMN categories TEXT',
      'ALTER TABLE recipes ADD COLUMN rest INTEGER DEFAULT 0',
      'DROP TRIGGER IF EXISTS recipes_ai',
      'DROP TRIGGER IF EXISTS recipes_ad',
      'DROP TRIGGER IF EXISTS recipes_au',
      'DROP TABLE IF EXISTS recipes_fts',
      ...FTS_STATEMENTS,
      `INSERT INTO recipes_fts(recipes_fts) VALUES('rebuild')`,
    ], 'write');
  }
  const stateCols = (await client.execute('PRAGMA table_info(crawl_state)')).rows.map(r => r.name);
  if (!stateCols.includes('rest_synced_at')) {
    await client.batch([
      'ALTER TABLE crawl_state ADD COLUMN rest_synced_at TEXT',
      'ALTER TABLE crawl_state ADD COLUMN rest_count INTEGER DEFAULT 0',
    ], 'write');
  }
}

const ready = client.batch([
  `CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT UNIQUE NOT NULL,
    blog TEXT NOT NULL,
    blog_color TEXT,
    title TEXT NOT NULL,
    image TEXT,
    date TEXT,
    excerpt TEXT,
    categories TEXT,
    rest INTEGER DEFAULT 0
  )`,
  `CREATE INDEX IF NOT EXISTS idx_recipes_blog ON recipes(blog)`,
  `CREATE INDEX IF NOT EXISTS idx_recipes_date ON recipes(date DESC)`,
  ...FTS_STATEMENTS,
  `CREATE TABLE IF NOT EXISTS crawl_state (
    blog TEXT PRIMARY KEY,
    last_crawled_at TEXT,
    url_count INTEGER DEFAULT 0,
    status TEXT,
    rest_synced_at TEXT,
    rest_count INTEGER DEFAULT 0
  )`,
], 'write').then(migrateEnrichmentColumns).catch(err => {
  console.error('archive-db schema init failed:', err.message);
  throw err;
});

async function upsertRecipe({ url, blog, blog_color, title, image, date }) {
  await ready;
  return client.execute({
    sql: `INSERT INTO recipes (url, blog, blog_color, title, image, date)
          VALUES (?, ?, ?, ?, ?, ?)
          ON CONFLICT(url) DO UPDATE SET
            title = CASE WHEN recipes.rest = 1 THEN recipes.title ELSE excluded.title END,
            image = COALESCE(excluded.image, recipes.image),
            date = CASE WHEN recipes.rest = 1 THEN recipes.date ELSE COALESCE(excluded.date, recipes.date) END`,
    args: [url, blog, blog_color || null, title, image || null, date || null],
  });
}

// Batched version — the crawler processes hundreds of URLs per sitemap file;
// one client.execute() per row would mean one network round-trip per recipe,
// which at archive scale (hundreds of thousands of rows) would take far too
// long. client.batch() sends every statement in one round-trip instead.
async function batchUpsertRecipes(recipes) {
  await ready;
  if (!recipes.length) return;
  const statements = recipes.map(({ url, blog, blog_color, title, image, date }) => ({
    sql: `INSERT INTO recipes (url, blog, blog_color, title, image, date)
          VALUES (?, ?, ?, ?, ?, ?)
          ON CONFLICT(url) DO UPDATE SET
            title = CASE WHEN recipes.rest = 1 THEN recipes.title ELSE excluded.title END,
            image = COALESCE(excluded.image, recipes.image),
            date = CASE WHEN recipes.rest = 1 THEN recipes.date ELSE COALESCE(excluded.date, recipes.date) END`,
    args: [url, blog, blog_color || null, title, image || null, date || null],
  }));
  return client.batch(statements, 'write');
}

async function setCrawlState({ blog, last_crawled_at, url_count, status }) {
  await ready;
  return client.execute({
    sql: `INSERT INTO crawl_state (blog, last_crawled_at, url_count, status)
          VALUES (?, ?, ?, ?)
          ON CONFLICT(blog) DO UPDATE SET
            last_crawled_at = excluded.last_crawled_at,
            url_count = excluded.url_count,
            status = excluded.status`,
    args: [blog, last_crawled_at, url_count || 0, status],
  });
}

// Upserts rows sourced from a blog's WordPress REST API: real title, excerpt,
// categories and publish date. Marks rest=1 so later sitemap crawls (which
// only know a slug-derived title and a lastmod) don't overwrite them.
async function batchUpsertRestRecipes(rows) {
  await ready;
  if (!rows.length) return;
  return client.batch(rows.map(r => ({
    sql: `INSERT INTO recipes (url, blog, blog_color, title, image, date, excerpt, categories, rest)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
          ON CONFLICT(url) DO UPDATE SET
            title = excluded.title,
            date = COALESCE(excluded.date, recipes.date),
            excerpt = excluded.excerpt,
            categories = excluded.categories,
            rest = 1`,
    args: [r.url, r.blog, r.blog_color || null, r.title, r.image || null, r.date || null, r.excerpt || '', JSON.stringify(r.categories || [])],
  })), 'write');
}

// For blogs whose posts come from the REST API, the sitemap is only useful for
// the <image:loc> thumbnails REST doesn't provide. Fills in a missing image on
// rows that already exist; never inserts, so sitemap-only entries that REST
// deliberately skipped (roundups, pages, guides) can't creep back in.
async function batchUpdateImages(rows) {
  await ready;
  if (!rows.length) return;
  return client.batch(rows.map(r => ({
    sql: 'UPDATE recipes SET image = ? WHERE url = ? AND image IS NULL',
    args: [r.image, r.url],
  })), 'write');
}

async function isRestCovered(blog) {
  await ready;
  const r = await client.execute({ sql: 'SELECT rest_count FROM crawl_state WHERE blog = ?', args: [blog] });
  return (r.rows[0]?.rest_count || 0) > 0;
}

async function getRestSyncedAt(blog) {
  await ready;
  const r = await client.execute({ sql: 'SELECT rest_synced_at FROM crawl_state WHERE blog = ?', args: [blog] });
  return r.rows[0]?.rest_synced_at || null;
}

async function setRestSynced(blog, count) {
  await ready;
  return client.execute({
    sql: `INSERT INTO crawl_state (blog, rest_synced_at, rest_count) VALUES (?, ?, ?)
          ON CONFLICT(blog) DO UPDATE SET rest_synced_at = excluded.rest_synced_at,
            rest_count = COALESCE(crawl_state.rest_count, 0) + excluded.rest_count`,
    args: [blog, new Date().toISOString(), count],
  });
}

// Deletes every archived recipe (and crawl_state row) for a blog that's no
// longer in blogs.js. Removing a blog from the config only stops future
// crawls — rows already upserted here would otherwise linger forever and
// keep surfacing in Archive browsing and Discover's archive-backed keyword
// search, even though the blog was deliberately dropped (inactive, dead
// feed, or bot-blocked so its images can never show).
async function pruneRemovedBlogs(activeBlogNames) {
  await ready;
  const activeSet = new Set(activeBlogNames);
  const { rows } = await client.execute('SELECT DISTINCT blog FROM recipes');
  const stale = rows.map(r => r.blog).filter(b => !activeSet.has(b));
  for (const blog of stale) {
    await client.execute({ sql: 'DELETE FROM recipes WHERE blog = ?', args: [blog] });
    await client.execute({ sql: 'DELETE FROM crawl_state WHERE blog = ?', args: [blog] });
  }
  return stale;
}

module.exports = { client, ready, upsertRecipe, batchUpsertRecipes, batchUpsertRestRecipes, batchUpdateImages, isRestCovered, getRestSyncedAt, setRestSynced, setCrawlState, pruneRemovedBlogs };
