// SQLite archive (hosted on Turso/libSQL) of every recipe we can find through each blog's sitemap. RSS only lists the
// newest 5 to 20 posts, while sitemaps cover the whole history. It lives on Turso instead of a local file so it survives
// Render's ephemeral disk, and local crawls and the deployed server read and write the same database.
const { createClient } = require('@libsql/client');

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:archive.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// The FTS index covers title, blog, excerpt, categories and tags. Excerpt and categories come from each blog's WordPress
// REST API (see crawl-archive.js). A sitemap only gives a URL, so the title is a guess from the slug.
const FTS_STATEMENTS = [
  `CREATE VIRTUAL TABLE IF NOT EXISTS recipes_fts USING fts5(
    title, blog, excerpt, categories, tags, content='recipes', content_rowid='id'
  )`,
  `CREATE TRIGGER IF NOT EXISTS recipes_ai AFTER INSERT ON recipes BEGIN
    INSERT INTO recipes_fts(rowid, title, blog, excerpt, categories, tags) VALUES (new.id, new.title, new.blog, new.excerpt, new.categories, new.tags);
  END`,
  `CREATE TRIGGER IF NOT EXISTS recipes_ad AFTER DELETE ON recipes BEGIN
    INSERT INTO recipes_fts(recipes_fts, rowid, title, blog, excerpt, categories, tags) VALUES('delete', old.id, old.title, old.blog, old.excerpt, old.categories, old.tags);
  END`,
  `CREATE TRIGGER IF NOT EXISTS recipes_au AFTER UPDATE OF title, blog, excerpt, categories, tags ON recipes BEGIN
    INSERT INTO recipes_fts(recipes_fts, rowid, title, blog, excerpt, categories, tags) VALUES('delete', old.id, old.title, old.blog, old.excerpt, old.categories, old.tags);
    INSERT INTO recipes_fts(rowid, title, blog, excerpt, categories, tags) VALUES (new.id, new.title, new.blog, new.excerpt, new.categories, new.tags);
  END`,
];

// Upgrades a database created before excerpt and categories existed. Safe to run repeatedly. An FTS table can't be altered,
// so it and its triggers are dropped and rebuilt from the recipes table in one batch.
async function migrateEnrichmentColumns() {
  const cols = (await client.execute('PRAGMA table_info(recipes)')).rows.map(r => r.name);
  if (!cols.includes('excerpt')) {
    await client.batch([
      'ALTER TABLE recipes ADD COLUMN excerpt TEXT',
      'ALTER TABLE recipes ADD COLUMN categories TEXT',
      'ALTER TABLE recipes ADD COLUMN tags TEXT',
      'ALTER TABLE recipes ADD COLUMN rest INTEGER DEFAULT 0',
      'DROP TRIGGER IF EXISTS recipes_ai',
      'DROP TRIGGER IF EXISTS recipes_ad',
      'DROP TRIGGER IF EXISTS recipes_au',
      'DROP TABLE IF EXISTS recipes_fts',
      ...FTS_STATEMENTS,
      `INSERT INTO recipes_fts(recipes_fts) VALUES('rebuild')`,
    ], 'write');
  }
  // Tags are kept apart from categories. Blogs use tags for ingredients ("cream of mushroom soup", "chicken broth"), which made
  // filter chips match dishes that merely contain an ingredient. Categories drive the chips, and tags are only searched by
  // typed query. The FTS table is rebuilt for this too.
  const cols2 = (await client.execute('PRAGMA table_info(recipes)')).rows.map(r => r.name);
  if (!cols2.includes('tags')) {
    await client.batch([
      'ALTER TABLE recipes ADD COLUMN tags TEXT',
      'DROP TRIGGER IF EXISTS recipes_ai',
      'DROP TRIGGER IF EXISTS recipes_ad',
      'DROP TRIGGER IF EXISTS recipes_au',
      'DROP TABLE IF EXISTS recipes_fts',
      ...FTS_STATEMENTS,
      `INSERT INTO recipes_fts(recipes_fts) VALUES('rebuild')`,
    ], 'write');
  }
  // Ingredient lists (read from each recipe card) power search by ingredients. They get their own FTS table so the main
  // title and excerpt index and its ranking stay as they were. NULL means not looked at yet, and '' means the page was
  // checked and has no ingredient list.
  const cols3 = (await client.execute('PRAGMA table_info(recipes)')).rows.map(r => r.name);
  if (!cols3.includes('ingredients')) await client.execute('ALTER TABLE recipes ADD COLUMN ingredients TEXT');
  const au = (await client.execute("SELECT sql FROM sqlite_master WHERE type='trigger' AND name='recipes_au'")).rows[0];
  const stmts = [];
  if (au && !/UPDATE OF/i.test(au.sql)) stmts.push('DROP TRIGGER recipes_au', FTS_STATEMENTS[3]);
  stmts.push(
    `CREATE VIRTUAL TABLE IF NOT EXISTS recipes_ing USING fts5(ingredients, content='recipes', content_rowid='id')`,
    `CREATE TRIGGER IF NOT EXISTS recipes_ing_ai AFTER INSERT ON recipes WHEN new.ingredients IS NOT NULL BEGIN
      INSERT INTO recipes_ing(rowid, ingredients) VALUES (new.id, new.ingredients);
    END`,
    `CREATE TRIGGER IF NOT EXISTS recipes_ing_ad AFTER DELETE ON recipes WHEN old.ingredients IS NOT NULL BEGIN
      INSERT INTO recipes_ing(recipes_ing, rowid, ingredients) VALUES('delete', old.id, old.ingredients);
    END`,
    `CREATE TRIGGER IF NOT EXISTS recipes_ing_au AFTER UPDATE OF ingredients ON recipes BEGIN
      INSERT INTO recipes_ing(recipes_ing, rowid, ingredients) SELECT 'delete', old.id, old.ingredients WHERE old.ingredients IS NOT NULL;
      INSERT INTO recipes_ing(rowid, ingredients) SELECT new.id, new.ingredients WHERE new.ingredients IS NOT NULL;
    END`,
  );
  await client.batch(stmts, 'write');
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
    tags TEXT,
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

// Batched version. The crawler handles hundreds of URLs per sitemap file, and one round trip per recipe would take far too
// long at this size. client.batch() sends them all in one round trip.
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

// Upserts rows from a blog's WordPress REST API, which has the real title, excerpt, categories and publish date.
// Sets rest=1 so later sitemap crawls, which only know a slug title and a lastmod, don't overwrite them.
async function batchUpsertRestRecipes(rows) {
  await ready;
  if (!rows.length) return;
  return client.batch(rows.map(r => ({
    sql: `INSERT INTO recipes (url, blog, blog_color, title, image, date, excerpt, categories, tags, rest)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
          ON CONFLICT(url) DO UPDATE SET
            title = excluded.title,
            date = COALESCE(excluded.date, recipes.date),
            image = COALESCE(recipes.image, excluded.image),
            excerpt = excluded.excerpt,
            categories = excluded.categories,
            tags = excluded.tags,
            rest = 1`,
    args: [r.url, r.blog, r.blog_color || null, r.title, r.image || null, r.date || null, r.excerpt || '', JSON.stringify(r.categories || []), JSON.stringify(r.tags || [])],
  })), 'write');
}

// For blogs whose posts come from the REST API, the sitemap is only useful for the <image:loc> thumbnails REST doesn't give.
// This fills in a missing image on rows that already exist and never inserts, so pages REST skipped on purpose
// (roundups, guides) can't creep back in.
async function batchUpdateImages(rows) {
  await ready;
  if (!rows.length) return;
  return client.batch(rows.map(r => ({
    sql: 'UPDATE recipes SET image = ? WHERE url = ? AND image IS NULL',
    args: [r.image, r.url],
  })), 'write');
}

// Ingredient lists: NULL = unknown, '' = page checked and has none (never retried).
async function batchSetIngredients(rows) {
  await ready;
  if (!rows.length) return;
  return client.batch(rows.map(r => ({
    sql: 'UPDATE recipes SET ingredients = ? WHERE url = ?',
    args: [r.ingredients, r.url],
  })), 'write');
}

// Oldest still-unknown REST row and how many are unknown, lets the ingredient pass resume.
async function ingredientBacklog(blog) {
  await ready;
  const r = await client.execute({ sql: 'SELECT MIN(date) AS d, COUNT(*) AS n FROM recipes WHERE blog = ? AND ingredients IS NULL AND rest = 1 AND date IS NOT NULL', args: [blog] });
  return { oldest: r.rows[0].d || null, count: r.rows[0].n || 0 };
}

async function urlsMissingIngredients(blog, limit) {
  await ready;
  const r = await client.execute({ sql: 'SELECT url FROM recipes WHERE blog = ? AND ingredients IS NULL ORDER BY date DESC LIMIT ?', args: [blog, limit] });
  return r.rows.map(x => x.url);
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

// Deletes every archived recipe (and crawl_state row) for blogs no longer in blogs.js. Dropping a blog from the config only
// stops future crawls. Its old rows would otherwise keep showing up in Archive browsing and keyword search.
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

module.exports = { client, ready, batchSetIngredients, ingredientBacklog, urlsMissingIngredients, upsertRecipe, batchUpsertRecipes, batchUpsertRestRecipes, batchUpdateImages, isRestCovered, getRestSyncedAt, setRestSynced, setCrawlState, pruneRemovedBlogs };
