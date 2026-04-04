require('dotenv').config();
const express = require('express');
const RSSParser = require('rss-parser');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');

const SERPER_API_KEY = process.env.SERPER_API_KEY;

const app = express();
const parser = new RSSParser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
      ['content:encoded', 'contentEncoded'],
    ],
  },
  timeout: 10000,
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const BLOGS = [
  // --- General / American ---
  { name: 'Half Baked Harvest',    feed: 'https://www.halfbakedharvest.com/feed/',        color: '#b8620a' },
  { name: 'The Modern Proper',     feed: 'https://themodernproper.com/feed',               color: '#5c7a4e' },
  { name: 'Budget Bytes',          feed: 'https://www.budgetbytes.com/feed/',               color: '#c0392b' },
  { name: 'Pinch of Yum',          feed: 'https://pinchofyum.com/feed',                    color: '#7b5ea7' },
  { name: 'Smitten Kitchen',       feed: 'https://smittenkitchen.com/feed/',                color: '#2471a3' },
  { name: 'Minimalist Baker',      feed: 'https://minimalistbaker.com/feed/',               color: '#c0803e' },
  { name: 'Serious Eats',          feed: 'https://www.seriouseats.com/feeds/all.rss.xml',  color: '#e74c3c' },
  { name: 'Damn Delicious',        feed: 'https://damndelicious.net/feed/',                 color: '#d63584' },
  { name: 'Cookie and Kate',       feed: 'https://cookieandkate.com/feed/',                color: '#e8a020' },
  { name: 'Skinnytaste',           feed: 'https://www.skinnytaste.com/feed/',               color: '#27ae60' },
  { name: 'Ambitious Kitchen',     feed: 'https://www.ambitiouskitchen.com/feed/',          color: '#9b59b6' },
  { name: 'Cafe Delites',          feed: 'https://cafedelites.com/feed/',                   color: '#16a085' },
  { name: 'Once Upon a Chef',      feed: 'https://www.onceuponachef.com/feed',              color: '#1a5276' },
  { name: 'Well Plated',           feed: 'https://www.wellplated.com/feed/',                color: '#6d9a70' },
  { name: 'The Recipe Critic',     feed: 'https://therecipecritic.com/feed/',               color: '#c0572b' },
  { name: "Natasha's Kitchen",     feed: 'https://natashaskitchen.com/feed/',               color: '#c0396b' },
  { name: 'Spend With Pennies',    feed: 'https://www.spendwithpennies.com/feed/',          color: '#a04020' },
  { name: 'The Chunky Chef',       feed: 'https://www.thechunkychef.com/feed/',             color: '#5d3a1a' },
  { name: 'Gimme Some Oven',       feed: 'https://www.gimmesomeoven.com/feed/',             color: '#c8961a' },
  { name: 'Two Peas & Their Pod',  feed: 'https://www.twopeasandtheirpod.com/feed/',        color: '#4a8c3f' },
  { name: 'The Cozy Cook',         feed: 'https://thecozycook.com/feed/',                   color: '#9b4f2a' },
  { name: 'Jo Cooks',              feed: 'https://www.jocooks.com/feed/',                   color: '#6b7c2a' },
  { name: 'Feasting at Home',      feed: 'https://www.feastingathome.com/feed/',            color: '#3a7a6a' },
  { name: 'Plays Well With Butter',feed: 'https://playswellwithbutter.com/feed/',           color: '#b8860b' },
  { name: 'Wholesome Yum',         feed: 'https://www.wholesomeyum.com/feed/',              color: '#2e7d5a' },
  { name: 'Carlsbad Cravings',     feed: 'https://carlsbadcravings.com/feed/',              color: '#b0306a' },
  { name: 'Host the Toast',        feed: 'https://hostthetoast.com/feed/',                  color: '#c53a2a' },
  { name: 'The Mediterranean Dish',feed: 'https://www.themediterraneandish.com/feed/',      color: '#2a7a9b' },
  { name: 'Dishing Out Health',    feed: 'https://dishingouthealth.com/feed/',              color: '#3a8a5a' },
  { name: 'The Food Charlatan',    feed: 'https://thefoodcharlatan.com/feed/',              color: '#c04a2a' },
  { name: 'Foxes Love Lemons',     feed: 'https://www.foxeslovelemons.com/feed/',           color: '#d4920a' },
  // --- Asian specialists ---
  { name: 'The Woks of Life',      feed: 'https://thewoksoflife.com/feed/',                 color: '#c0300a' },
  { name: 'Just One Cookbook',     feed: 'https://www.justonecookbook.com/feed/',           color: '#c0607a' },
  { name: 'Maangchi',              feed: 'https://www.maangchi.com/feed',                   color: '#3060b0' },
  { name: 'Rasa Malaysia',         feed: 'https://rasamalaysia.com/feed/',                  color: '#c07020' },
  { name: "Omnivore's Cookbook",   feed: 'https://omnivorescookbook.com/feed/',             color: '#20908a' },
  { name: 'Hot Thai Kitchen',      feed: 'https://hot-thai-kitchen.com/feed/',              color: '#2a9a3a' },
  // --- More general ---
  { name: 'RecipeTin Eats',        feed: 'https://www.recipetineats.com/feed/',             color: '#c0392b' },
  { name: 'How Sweet Eats',        feed: 'https://www.howsweeteats.com/feed/',              color: '#e91e8c' },
  { name: 'A Couple Cooks',        feed: 'https://www.acouplecooks.com/feed/',              color: '#2e86ab' },
  { name: 'Love and Lemons',       feed: 'https://www.loveandlemons.com/feed/',             color: '#e8b84b' },
  { name: 'Cooking Classy',        feed: 'https://www.cookingclassy.com/feed/',             color: '#9b3a2a' },
  { name: 'Tastes Better From Scratch', feed: 'https://tastesbetterfromscratch.com/feed/', color: '#3a7a4a' },
  { name: 'The Stay At Home Chef', feed: 'https://thestayathomechef.com/feed/',             color: '#8b4513' },
  { name: 'Dinner at the Zoo',     feed: 'https://www.dinneratthezoo.com/feed/',            color: '#e67e22' },
  { name: 'Kevin Is Cooking',      feed: 'https://keviniscooking.com/feed/',                color: '#2980b9' },
  { name: 'Little Spice Jar',      feed: 'https://littlespicejar.com/feed/',                color: '#c0392b' },
  { name: 'Creme de la Crumb',     feed: 'https://www.lecremedelacrumb.com/feed/',          color: '#d4a017' },
  { name: 'Fifteen Spatulas',      feed: 'https://www.fifteenspatulas.com/feed/',           color: '#c0607a' },
  { name: 'Downshiftology',        feed: 'https://downshiftology.com/feed/',                color: '#8a5a2a' },
  { name: 'The Defined Dish',      feed: 'https://thedefineddish.com/feed/',                color: '#6a4a8a' },
  // --- Asian specialists ---
  { name: 'My Korean Kitchen',     feed: 'https://mykoreankitchen.com/feed/',               color: '#c0300a' },
  { name: 'Pickled Plum',          feed: 'https://pickledplum.com/feed/',                   color: '#8e44ad' },
  { name: 'Viet World Kitchen',    feed: 'https://www.vietworldkitchen.com/blog/atom.xml',  color: '#27ae60' },
  { name: 'Christie at Home',      feed: 'https://christieathome.com/feed/',                color: '#e84393' },
  // --- Indian ---
  { name: 'Veg Recipes of India',  feed: 'https://www.vegrecipesofindia.com/feed/',         color: '#f39c12' },
  { name: 'Spice Up the Curry',    feed: 'https://www.spiceupthecurry.com/feed/',           color: '#e74c3c' },
  { name: "Manjula's Kitchen",     feed: 'https://www.manjulaskitchen.com/feed/',           color: '#9b59b6' },
  { name: 'Piping Pot Curry',      feed: 'https://pipingpotcurry.com/feed/',                color: '#e74c3c' },
  { name: "Hebbars Kitchen",       feed: 'https://hebbarskitchen.com/feed/',                color: '#c0392b' },
  { name: 'Spice Cravings',        feed: 'https://spicecravings.com/feed/',                 color: '#e67e22' },
  // --- Greek / Mediterranean ---
  { name: 'My Greek Dish',         feed: 'https://mygreekdish.com/feed/',                   color: '#2980b9' },
  { name: 'Souvlaki For The Soul', feed: 'https://souvlakiforthesoul.com/feed/',            color: '#27ae60' },
  { name: 'Kalofagas',             feed: 'https://kalofagas.ca/feed/',                      color: '#2c3e50' },
  // --- Mexican / Latin ---
  { name: 'Mexico in My Kitchen',  feed: 'https://www.mexicoinmykitchen.com/feed/',         color: '#27ae60' },
  { name: "Laylita's Recipes",     feed: 'https://laylita.com/recipes/feed/',               color: '#e67e22' },
  // --- Middle Eastern ---
  { name: 'Maureen Abood',         feed: 'https://maureenabood.com/feed/',                  color: '#2ecc71' },
  { name: 'Give Recipe',           feed: 'https://giverecipe.com/feed/',                    color: '#c0392b' },
  { name: "Ozlem's Turkish Table", feed: 'https://ozlemsturkishtable.com/feed/',             color: '#e67e22' },
  { name: 'Tori Avey',             feed: 'https://toriavey.com/feed/',                      color: '#8e44ad' },
  { name: 'Cleobuttera',           feed: 'https://cleobuttera.com/feed/',                   color: '#c0906a' },
  { name: 'Feel Good Foodie',      feed: 'https://feelgoodfoodie.net/feed/',                color: '#27ae60' },
  { name: 'Zaatar and Zaytoun',    feed: 'https://zaatarandzaytoun.com/feed/',              color: '#2ecc71' },
  { name: 'Persian Mama',          feed: 'https://persianmama.com/feed/',                   color: '#9b59b6' },
  // --- African / Caribbean ---
  { name: 'Immaculate Bites',      feed: 'https://www.africanbites.com/feed/',              color: '#c0392b' },
  { name: "Chef Lola's Kitchen",   feed: 'https://cheflolaskitchen.com/feed/',              color: '#e74c3c' },
  // --- Filipino ---
  { name: 'Panlasang Pinoy',       feed: 'https://panlasangpinoy.com/feed/',                color: '#2471a3' },
  { name: 'Kawaling Pinoy',        feed: 'https://www.kawalingpinoy.com/feed/',             color: '#1abc9c' },
  // --- French / European ---
  { name: 'David Lebovitz',        feed: 'https://www.davidlebovitz.com/feed/',             color: '#2c3e50' },
  // --- BBQ / Southern ---
  { name: 'Hey Grill Hey',         feed: 'https://heygrillhey.com/feed/',                   color: '#c0392b' },
  { name: 'Sam the Cooking Guy',   feed: 'https://www.samthecookingguy.com/recipes?format=rss', color: '#1a1a2e' },
  // --- Modern / Creative ---
  { name: 'Justine Snacks',        feed: 'https://justinesnacks.com/feed/',                 color: '#e84393' },
  { name: 'Molly Baz',             feed: 'https://mollybaz.com/feed/',                      color: '#e8b84b' },
];

const FAVORITES_FILE = path.join(__dirname, 'favorites.json');

function loadFavorites() {
  try {
    if (!fs.existsSync(FAVORITES_FILE)) return [];
    return JSON.parse(fs.readFileSync(FAVORITES_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function saveFavorites(favs) {
  fs.writeFileSync(FAVORITES_FILE, JSON.stringify(favs, null, 2));
}

function decodeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function extractImage(item) {
  // media:content — prefer largest
  if (item.mediaContent) {
    const mcs = Array.isArray(item.mediaContent) ? item.mediaContent : [item.mediaContent];
    const best = mcs
      .filter(mc => mc?.$?.url)
      .sort((a, b) => parseInt(b.$?.width || 0) - parseInt(a.$?.width || 0))[0];
    if (best) return best.$.url;
  }
  // media:thumbnail
  if (item.mediaThumbnail?.$?.url) return item.mediaThumbnail.$.url;
  // og:image in content:encoded
  const html = item.contentEncoded || item.content || '';
  const ogMatch = html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/) ||
                  html.match(/content=["']([^"']+)["'][^>]+property=["']og:image["']/);
  if (ogMatch) return ogMatch[1];
  // enclosure
  if (item.enclosure?.url && /\.(jpg|jpeg|png|webp)/i.test(item.enclosure.url)) return item.enclosure.url;
  // first <img> — prefer ones with width > 300
  const imgMatches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)];
  for (const m of imgMatches) {
    const widthMatch = m[0].match(/width=["']?(\d+)/);
    if (!widthMatch || parseInt(widthMatch[1]) > 300) return m[1];
  }
  return null;
}

function parseISO8601Duration(str) {
  if (!str) return null;
  const m = str.match(/PT(?:(\d+)H)?(?:(\d+)M)?/i);
  if (!m) return null;
  const h = parseInt(m[1] || 0);
  const min = parseInt(m[2] || 0);
  if (h && min) return `${h}h ${min}m`;
  if (h) return `${h}h`;
  if (min) return `${min}m`;
  return null;
}

const ROUNDUP_PATTERNS = [
  /^\d+\s+\w/i,                          // "14 Leftover Ham Recipes", "25 Best..."
  /\b(best|top)\s+\d+\b/i,               // "Best 10 Recipes"
  /\bround.?up\b/i,
  /\bmeal\s+plan\b/i,
  /\bweekly\s+menu\b/i,
  /\bthis\s+week('s)?\s+recipe/i,
  /\bfavorite\s+recipes\b/i,
  /\brecipes?\s+to\s+(try|make)\b/i,
  /\b(gift\s+guide|holiday\s+guide)\b/i,
  /\bhow\s+to\s+(stock|build|make)\s+a\b/i,
  /\beveryone\s+will\s+love\b/i,
  /\bthis\s+week'?s?\s+recipes?\b/i,
  /\brecipes?\s+for\s+(easter|christmas|thanksgiving|halloween|the\s+holidays?)\b/i,
  /\b\d+\s+\w+\s+recipes?\b/i,           // "20 Chicken Recipes", "14 Leftover Ham Recipes"
  /\b(leftover|make.ahead|freezer).+recipes?\b/i,
  // Lifestyle / non-recipe posts
  /\bcurrently\s+crush/i,                // "Currently Crushing On"
  /\bwhat\s+i('m|\s+am)\s+(eating|cooking|making|loving)\b/i,
  /\bweekend\s+(reading|links|eats|update|recap)\b/i,
  /\bfavorite\s+things\b/i,
  /\bnine\s+favorite\s+things\b/i,
  /\bthings\s+i('m|\s+am)\s+loving\b/i,
  /\bmonth\s+in\s+review\b/i,
  /\bcooking\s+(lately|this\s+week)\b/i,
  /\bwhat'?s?\s+(new|on\s+my|in\s+my)\b/i,
  /\bfriday\s+(faves|favorites|links|finds)\b/i,
  /\b(amazon|shop|shopping)\s+(haul|finds|picks|faves)\b/i,
  /\b(travel|trip|visit)\s+to\b/i,
  /\brecap\b/i,
  /\bnewsletter\b/i,
  /\(plus\b/i,                                        // "(Plus the Sides I Always Bring With Them)"
  /\bthe\s+best\s+\w+s\b(?!\s+recipe)/i,             // "The Best Potato Salads"
  /\btested\s+by\s+experts?\b/i,                      // "Tested By Experts"
  /\(20\d\d\)/,                                       // "(2026)" — gear/product roundups with year
  /\bfor\s+\w+,\s*\w+.*?,\s*and\b/i,                 // "for Picnics, Potlucks, and Meal Prep"
  /\b(gear|equipment|gadget|appliance|knife|pan|pot|blender|kettle|air\s*fryer).*(review|guide|best|tested)\b/i,
  /\b(review|guide|best|tested).*(gear|equipment|gadget|appliance|knife|pan|pot|blender|kettle|air\s*fryer)\b/i,
  /\bI\s+tested\s+the\b/i,                            // "I Tested the Multicooker..."
  /\bhere'?s?\s+my\s+verdict\b/i,                     // "Here's My Verdict"
  /\bhas\s+\w+\s+separate\b/i,                        // "Has Five Separate Hot Sauces"
];

function isRoundup(title = '', url = '') {
  if (ROUNDUP_PATTERNS.some(p => p.test(title))) return true;
  // Filter homepage/category URLs
  if (url) {
    try {
      const path = new URL(url).pathname.replace(/\/$/, '');
      const segments = path.split('/').filter(Boolean);
      if (segments.length === 0) return true;                                        // homepage
      if (segments.some(s => /^(category|tag|tags|cuisine|blog|posts?|archive)$/i.test(s))) return true; // category/tag path
      if (segments.length === 1 && /-(recipes?|dinners?|meals?|ideas?)$/.test(segments[0])) return true; // /chicken-recipes/
    } catch {}
  }
  // Filter site-title style titles: "Blog Name | Tagline" or "Recipes | Site Name"
  if (/^[^|]{3,60}\|\s*.{3,60}$/.test(title) && /recipes?|kitchen|cook|food|eat/i.test(title)) return true;
  // Filter "Over 30 / More than X" roundup titles
  if (/^(over|more\s+than)\s+\d+/i.test(title)) return true;
  return false;
}

// Fallback HTML scraper for common WordPress recipe plugins
function scrapeRecipeHtml($) {
  // WP Recipe Maker (wprm) — most common
  if ($('.wprm-recipe').length) {
    return {
      name: $('.wprm-recipe-name').text(),
      description: $('.wprm-recipe-summary').text(),
      prepTime: $('.wprm-recipe-prep_time-container').text().replace(/[^0-9hms ]/g, '').trim() || null,
      cookTime: $('.wprm-recipe-cook_time-container').text().replace(/[^0-9hms ]/g, '').trim() || null,
      totalTime: $('.wprm-recipe-total_time-container').text().replace(/[^0-9hms ]/g, '').trim() || null,
      recipeYield: $('.wprm-recipe-servings').text().trim() || null,
      recipeIngredient: $('.wprm-recipe-ingredient').map((_, el) => $(el).text().trim()).get(),
      recipeInstructions: $('.wprm-recipe-instruction-text').map((_, el) => $(el).text().trim()).get(),
    };
  }
  // Tasty Recipes
  if ($('.tasty-recipes').length) {
    return {
      name: $('.tasty-recipes-title').text(),
      description: $('.tasty-recipes-description').text(),
      recipeYield: $('.tasty-recipes-yield').text().replace(/[^0-9]/g, '') || null,
      recipeIngredient: $('.tasty-recipes-ingredients li').map((_, el) => $(el).text().trim()).get(),
      recipeInstructions: $('.tasty-recipes-instructions li').map((_, el) => $(el).text().trim()).get(),
    };
  }
  // Mediavine Create
  if ($('.mv-create-card').length) {
    return {
      name: $('.mv-create-title').text(),
      description: $('.mv-create-description').text(),
      recipeIngredient: $('.mv-create-ingredients li').map((_, el) => $(el).text().trim()).get(),
      recipeInstructions: $('.mv-create-instructions li').map((_, el) => $(el).text().trim()).get(),
    };
  }
  // Generic fallback — look for ingredient/instruction lists
  const ingredients = $('[class*="ingredient"] li, [class*="ingredients"] li').map((_, el) => $(el).text().trim()).get();
  const instructions = $('[class*="instruction"] li, [class*="directions"] li, [class*="steps"] li').map((_, el) => $(el).text().trim()).get();
  if (ingredients.length || instructions.length) {
    return {
      name: $('h1').first().text().trim(),
      description: $('meta[name="description"]').attr('content') || '',
      recipeIngredient: ingredients,
      recipeInstructions: instructions,
    };
  }
  return null;
}

// --- Routes ---

app.get('/api/blogs', (req, res) => {
  res.json(BLOGS.map(({ name, color }) => ({ name, color })));
});

// Cache feed results for 1 hour to avoid hammering 65 feeds on every load
const feedCache = new Map(); // blogName -> { recipes, fetchedAt }
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

async function fetchBlogFeed(blog) {
  const cached = feedCache.get(blog.name);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) return cached.recipes;

  const feed = await parser.parseURL(blog.feed);
  const recipes = feed.items.filter(item => !isRoundup(item.title, item.link)).slice(0, 8).map((item) => {
    const categories = (item.categories || []).map(c =>
      typeof c === 'string' ? c : (c._ || c['#text'] || '')
    ).filter(Boolean);
    const searchText = [item.title || '', ...categories, item.contentSnippet || ''].join(' ').toLowerCase();
    return {
      id: Buffer.from(item.link || item.guid || '').toString('base64'),
      title: decodeHtml(item.title?.trim()),
      url: item.link,
      date: item.pubDate || item.isoDate,
      image: extractImage(item),
      blog: blog.name,
      blogColor: blog.color,
      excerpt: decodeHtml(item.contentSnippet?.slice(0, 140).trim()) + '…' || '',
      categories,
      searchText,
    };
  });

  // For items missing images, try fetching og:image from the page
  const missing = recipes.filter(r => !r.image);
  if (missing.length) {
    await Promise.allSettled(missing.map(async (r) => {
      try {
        const res = await fetch(r.url, {
          headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'text/html' },
          signal: AbortSignal.timeout(6000),
        });
        const html = await res.text();
        const m = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/) ||
                  html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/);
        if (m?.[1]) r.image = m[1];
      } catch {}
    }));
  }

  feedCache.set(blog.name, { recipes, fetchedAt: Date.now() });
  return recipes;
}

// Fetch up to `concurrency` feeds at a time to avoid overwhelming the server
async function fetchAllFeeds(concurrency = 10) {
  const results = [];
  for (let i = 0; i < BLOGS.length; i += concurrency) {
    const batch = BLOGS.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(batch.map(fetchBlogFeed));
    results.push(...batchResults);
  }
  return results;
}

// Stream recipes via SSE so the client renders as each blog loads
app.get('/api/recipes/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const send = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);

  await Promise.allSettled(
    BLOGS.map(async (blog) => {
      try {
        const recipes = await fetchBlogFeed(blog);
        send({ type: 'batch', recipes });
      } catch {}
    })
  );

  send({ type: 'done' });
  res.end();
});

// Keep the original endpoint for cache hits (returns instantly if cached)
app.get('/api/recipes', async (req, res) => {
  const results = await fetchAllFeeds(10);
  const recipes = results
    .filter((r) => r.status === 'fulfilled')
    .flatMap((r) => r.value)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(recipes);
});

app.get('/api/recipe', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'url is required' });

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    const $ = cheerio.load(html);

    let recipeData = null;
    $('script[type="application/ld+json"]').each((_, el) => {
      if (recipeData) return;
      try {
        const json = JSON.parse($(el).html());
        const schemas = Array.isArray(json) ? json : (json['@graph'] ? json['@graph'] : [json]);
        for (const s of schemas) {
          const type = s['@type'];
          if (type === 'Recipe' || (Array.isArray(type) && type.includes('Recipe'))) {
            recipeData = s;
            break;
          }
        }
      } catch {}
    });

    // Always grab og:image as the best quality image available
    const ogImage = $('meta[property="og:image"]').attr('content') ||
                    $('meta[name="og:image"]').attr('content') || null;

    if (!recipeData) {
      // Fallback: try common WordPress recipe plugin HTML structures
      recipeData = scrapeRecipeHtml($);
    }

    if (!recipeData) {
      return res.status(422).json({ error: 'No structured recipe data found on this page.' });
    }

    const img = recipeData.image;
    const schemaImage = typeof img === 'string' ? img : Array.isArray(img) ? img[0] : img?.url;
    const image = ogImage || schemaImage;

    res.json({
      name: decodeHtml(recipeData.name),
      description: decodeHtml(recipeData.description),
      image,
      prepTime: parseISO8601Duration(recipeData.prepTime),
      cookTime: parseISO8601Duration(recipeData.cookTime),
      totalTime: parseISO8601Duration(recipeData.totalTime),
      servings: Array.isArray(recipeData.recipeYield)
        ? recipeData.recipeYield[0]
        : recipeData.recipeYield,
      ingredients: (recipeData.recipeIngredient || []).map(decodeHtml),
      instructions: (recipeData.recipeInstructions || []).map((s) =>
        decodeHtml(typeof s === 'string' ? s : s.text || '')
      ).filter(Boolean),
      category: recipeData.recipeCategory,
      cuisine: recipeData.recipeCuisine,
      url,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serper.dev search — searches across all blogs
app.get('/api/search', async (req, res) => {
  const { q, page = 1 } = req.query;
  if (!q) return res.status(400).json({ error: 'q is required' });
  if (!SERPER_API_KEY) return res.status(503).json({ error: 'Search API not configured.' });

  // Build site: query to restrict to known blogs
  const domains = BLOGS.map(b => {
    try { return new URL(b.feed).hostname.replace(/^www\./, ''); } catch { return null; }
  }).filter(Boolean);
  const siteQuery = domains.map(d => `site:${d}`).join(' OR ');
  const fullQuery = `${q} (${siteQuery})`;

  try {
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: { 'X-API-KEY': SERPER_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: fullQuery, num: 10, page: parseInt(page) }),
      signal: AbortSignal.timeout(10000),
    });
    const data = await response.json();

    if (data.error) return res.status(502).json({ error: data.error });

    // Build a URL→image lookup from the RSS cache (free, instant)
    const cacheImageMap = new Map();
    for (const { recipes } of feedCache.values()) {
      for (const r of recipes) {
        if (r.url && r.image) cacheImageMap.set(r.url, r.image);
      }
    }

    const results = (data.organic || []).filter(item => !isRoundup(item.title, item.link)).map(item => {
      const blog = BLOGS.find(b => {
        const domain = b.feed.replace(/https?:\/\/(www\.)?/, '').split('/')[0];
        return item.link.includes(domain);
      });
      return {
        id: Buffer.from(item.link).toString('base64'),
        title: item.title,
        url: item.link,
        image: cacheImageMap.get(item.link) || null,
        blog: blog?.name || item.displayLink || item.link,
        blogColor: blog?.color || '#888',
        excerpt: item.snippet,
        date: null,
        searchText: (item.title + ' ' + item.snippet).toLowerCase(),
        categories: [],
      };
    });

    // Fetch og:image for results still missing images
    const missing = results.filter(r => !r.image);
    if (missing.length) {
      await Promise.allSettled(missing.map(async (r) => {
        try {
          const res = await fetch(r.url, {
            headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'text/html' },
            signal: AbortSignal.timeout(5000),
          });
          const html = await res.text();
          const m = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/) ||
                    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/);
          if (m?.[1]) r.image = m[1];
        } catch {}
      }));
    }

    res.json({
      results,
      totalResults: data.searchInformation?.totalResults || results.length,
      nextStart: results.length === 10 ? parseInt(page) + 1 : null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/favorites', (req, res) => res.json(loadFavorites()));

app.post('/api/favorites', (req, res) => {
  const favs = loadFavorites();
  if (!favs.find((f) => f.url === req.body.url)) {
    favs.unshift(req.body);
    saveFavorites(favs);
  }
  res.json({ ok: true });
});

app.delete('/api/favorites/:id', (req, res) => {
  const favs = loadFavorites().filter(
    (f) => Buffer.from(f.url).toString('base64') !== req.params.id
  );
  saveFavorites(favs);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n  Recipe Finder → http://localhost:${PORT}\n`);
});
