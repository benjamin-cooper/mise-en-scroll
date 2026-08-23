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

const ready = client.batch([
  `CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT UNIQUE NOT NULL,
    blog TEXT NOT NULL,
    blog_color TEXT,
    title TEXT NOT NULL,
    image TEXT,
    date TEXT
  )`,
  `CREATE INDEX IF NOT EXISTS idx_recipes_blog ON recipes(blog)`,
  `CREATE INDEX IF NOT EXISTS idx_recipes_date ON recipes(date DESC)`,
  `CREATE VIRTUAL TABLE IF NOT EXISTS recipes_fts USING fts5(
    title, blog, content='recipes', content_rowid='id'
  )`,
  `CREATE TRIGGER IF NOT EXISTS recipes_ai AFTER INSERT ON recipes BEGIN
    INSERT INTO recipes_fts(rowid, title, blog) VALUES (new.id, new.title, new.blog);
  END`,
  `CREATE TRIGGER IF NOT EXISTS recipes_ad AFTER DELETE ON recipes BEGIN
    INSERT INTO recipes_fts(recipes_fts, rowid, title, blog) VALUES('delete', old.id, old.title, old.blog);
  END`,
  `CREATE TRIGGER IF NOT EXISTS recipes_au AFTER UPDATE ON recipes BEGIN
    INSERT INTO recipes_fts(recipes_fts, rowid, title, blog) VALUES('delete', old.id, old.title, old.blog);
    INSERT INTO recipes_fts(rowid, title, blog) VALUES (new.id, new.title, new.blog);
  END`,
  `CREATE TABLE IF NOT EXISTS crawl_state (
    blog TEXT PRIMARY KEY,
    last_crawled_at TEXT,
    url_count INTEGER DEFAULT 0,
    status TEXT
  )`,
], 'write').catch(err => {
  console.error('archive-db schema init failed:', err.message);
  throw err;
});

async function upsertRecipe({ url, blog, blog_color, title, image, date }) {
  await ready;
  return client.execute({
    sql: `INSERT INTO recipes (url, blog, blog_color, title, image, date)
          VALUES (?, ?, ?, ?, ?, ?)
          ON CONFLICT(url) DO UPDATE SET
            title = excluded.title,
            image = COALESCE(excluded.image, recipes.image),
            date = COALESCE(excluded.date, recipes.date)`,
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
            title = excluded.title,
            image = COALESCE(excluded.image, recipes.image),
            date = COALESCE(excluded.date, recipes.date)`,
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

module.exports = { client, ready, upsertRecipe, batchUpsertRecipes, setCrawlState };
