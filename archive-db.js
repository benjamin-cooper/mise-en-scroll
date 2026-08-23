// SQLite archive of every recipe we can find via each blog's sitemap, going
// far beyond what each blog's RSS feed exposes (RSS is "what's new", usually
// just the last 5-20 posts; sitemaps cover the blog's full history).
const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'archive.db');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS recipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT UNIQUE NOT NULL,
  blog TEXT NOT NULL,
  blog_color TEXT,
  title TEXT NOT NULL,
  image TEXT,
  date TEXT
);
CREATE INDEX IF NOT EXISTS idx_recipes_blog ON recipes(blog);
CREATE INDEX IF NOT EXISTS idx_recipes_date ON recipes(date DESC);

CREATE VIRTUAL TABLE IF NOT EXISTS recipes_fts USING fts5(
  title, blog, content='recipes', content_rowid='id'
);

CREATE TRIGGER IF NOT EXISTS recipes_ai AFTER INSERT ON recipes BEGIN
  INSERT INTO recipes_fts(rowid, title, blog) VALUES (new.id, new.title, new.blog);
END;
CREATE TRIGGER IF NOT EXISTS recipes_ad AFTER DELETE ON recipes BEGIN
  INSERT INTO recipes_fts(recipes_fts, rowid, title, blog) VALUES('delete', old.id, old.title, old.blog);
END;
CREATE TRIGGER IF NOT EXISTS recipes_au AFTER UPDATE ON recipes BEGIN
  INSERT INTO recipes_fts(recipes_fts, rowid, title, blog) VALUES('delete', old.id, old.title, old.blog);
  INSERT INTO recipes_fts(rowid, title, blog) VALUES (new.id, new.title, new.blog);
END;

CREATE TABLE IF NOT EXISTS crawl_state (
  blog TEXT PRIMARY KEY,
  last_crawled_at TEXT,
  url_count INTEGER DEFAULT 0,
  status TEXT
);
`);

const upsertRecipe = db.prepare(`
  INSERT INTO recipes (url, blog, blog_color, title, image, date)
  VALUES (@url, @blog, @blog_color, @title, @image, @date)
  ON CONFLICT(url) DO UPDATE SET
    title = excluded.title,
    image = COALESCE(excluded.image, recipes.image),
    date = COALESCE(excluded.date, recipes.date)
`);

const setCrawlState = db.prepare(`
  INSERT INTO crawl_state (blog, last_crawled_at, url_count, status)
  VALUES (@blog, @last_crawled_at, @url_count, @status)
  ON CONFLICT(blog) DO UPDATE SET
    last_crawled_at = excluded.last_crawled_at,
    url_count = excluded.url_count,
    status = excluded.status
`);

module.exports = { db, upsertRecipe, setCrawlState };
