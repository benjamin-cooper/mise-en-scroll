require('dotenv').config();
const express = require('express');
const RSSParser = require('rss-parser');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');
const Anthropic = require('@anthropic-ai/sdk');

const SERPER_API_KEY = process.env.SERPER_API_KEY;
// Lazy — don't instantiate at startup so a missing key doesn't crash the server
let _anthropic = null;
function getAnthropic() {
  if (!_anthropic) _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _anthropic;
}

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

// Serve sw.js with an injected cache version derived from asset mtimes.
// Source is read once at startup (and re-read if the version changes) so
// we never block the event loop with synchronous file I/O on each request.
let _swCached = { version: null, src: null };
function getSwSource() {
  const swPath = path.join(__dirname, 'public', 'sw.js');
  const assets = ['app.js', 'style.css'].map(f => path.join(__dirname, 'public', f));
  const version = assets.reduce((acc, f) => {
    try { return acc + fs.statSync(f).mtimeMs; } catch { return acc; }
  }, 0).toString(36);
  if (version !== _swCached.version) {
    const raw = fs.readFileSync(swPath, 'utf8');
    _swCached = { version, src: raw.replace('mise-en-scroll-v1', `mise-en-scroll-${version}`) };
  }
  return _swCached.src;
}
app.get('/sw.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Cache-Control', 'no-cache');
  res.send(getSwSource());
});

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
  { name: 'The Mediterranean Dish',feed: 'https://www.themediterraneandish.com/feed/',      color: '#2a7a9b' },
  { name: 'Dishing Out Health',    feed: 'https://dishingouthealth.com/feed/',              color: '#3a8a5a' },
  { name: 'The Food Charlatan',    feed: 'https://thefoodcharlatan.com/feed/',              color: '#c04a2a' },
  { name: 'Foxes Love Lemons',     feed: 'https://www.foxeslovelemons.com/feed/',           color: '#d4920a' },
  { name: 'Alexandra Cooks',       feed: 'https://alexandracooks.com/feed/',                color: '#5a7a5a' },
  { name: 'Averie Cooks',          feed: 'https://www.averiecooks.com/feed/',               color: '#d4607a' },
  { name: 'Inspired Taste',        feed: 'https://www.inspiredtaste.net/feed/',             color: '#e8922a' },
  { name: 'Sweet Peas and Saffron',feed: 'https://sweetpeasandsaffron.com/feed/',           color: '#f0a030' },
  // --- Asian specialists ---
  { name: 'The Woks of Life',      feed: 'https://thewoksoflife.com/feed/',                 color: '#c0300a' },
  { name: 'Just One Cookbook',     feed: 'https://www.justonecookbook.com/feed/',           color: '#c0607a' },
  { name: 'Maangchi',              feed: 'https://www.maangchi.com/feed',                   color: '#3060b0' },
  { name: 'Rasa Malaysia',         feed: 'https://rasamalaysia.com/feed/',                  color: '#c07020' },
  { name: "Omnivore's Cookbook",   feed: 'https://omnivorescookbook.com/feed/',             color: '#20908a' },
  { name: 'Hot Thai Kitchen',      feed: 'https://hot-thai-kitchen.com/feed/',              color: '#2a9a3a' },
  // --- General (continued) ---
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
  // --- Asian (continued) ---
  { name: 'My Korean Kitchen',     feed: 'https://mykoreankitchen.com/feed/',               color: '#c0300a' },
  { name: 'Pickled Plum',          feed: 'https://pickledplum.com/feed/',                   color: '#8e44ad' },
  // --- Indian ---
  { name: 'Veg Recipes of India',  feed: 'https://www.vegrecipesofindia.com/feed/',         color: '#f39c12' },
  { name: 'Spice Up the Curry',    feed: 'https://www.spiceupthecurry.com/feed/',           color: '#e74c3c' },
  { name: "Manjula's Kitchen",     feed: 'https://www.manjulaskitchen.com/feed/',           color: '#9b59b6' },
  { name: 'Piping Pot Curry',      feed: 'https://pipingpotcurry.com/feed/',                color: '#e74c3c' },
  { name: "Hebbars Kitchen",       feed: 'https://hebbarskitchen.com/feed/',                color: '#c0392b' },
  { name: 'Spice Cravings',        feed: 'https://spicecravings.com/feed/',                 color: '#e67e22' },
  // --- Greek / Mediterranean ---
  { name: "Dimitra's Dishes",      feed: 'https://www.dimitrasdishes.com/feed/',            color: '#1a6b9a' },
  // --- Mexican / Latin ---
  { name: 'Mexico in My Kitchen',  feed: 'https://www.mexicoinmykitchen.com/feed/',         color: '#27ae60' },
  { name: "Laylita's Recipes",     feed: 'https://laylita.com/recipes/feed/',               color: '#e67e22' },
  { name: 'Isabel Eats',           feed: 'https://www.isabeleats.com/feed/',                color: '#c75b2e' },
  // --- Middle Eastern ---
  { name: 'Give Recipe',           feed: 'https://giverecipe.com/feed/',                    color: '#c0392b' },
  { name: "Ozlem's Turkish Table", feed: 'https://ozlemsturkishtable.com/feed/',             color: '#e67e22' },
  { name: 'Tori Avey',             feed: 'https://toriavey.com/feed/',                      color: '#8e44ad' },
  { name: 'Feel Good Foodie',      feed: 'https://feelgoodfoodie.net/feed/',                color: '#27ae60' },
  { name: 'Zaatar and Zaytoun',    feed: 'https://zaatarandzaytoun.com/feed/',              color: '#2ecc71' },
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
  // --- Baking ---
  { name: "Sally's Baking Addiction", feed: 'https://sallysbakingaddiction.com/feed/',      color: '#c0607a' },
  { name: 'Handle the Heat',       feed: 'https://handletheheat.com/feed/',                 color: '#e05a2b' },
  { name: 'Beyond Frosting',       feed: 'https://beyondfrosting.com/feed/',                color: '#d4608a' },
  { name: 'The Vanilla Bean Blog', feed: 'https://www.thevanillabeanblog.com/feed/',        color: '#c8a050' },
  { name: 'Joy the Baker',         feed: 'https://joythebaker.com/feed/',                   color: '#e8702a' },
  // --- Plant-forward / Seasonal ---
  { name: 'The First Mess',        feed: 'https://thefirstmess.com/feed/',                  color: '#4a8a5a' },
  { name: 'Naturally Ella',        feed: 'https://naturallyella.com/feed/',                 color: '#5a9a3a' },
  // --- Comfort Food / Sourdough ---
  { name: 'Everyday Homemade',     feed: 'https://enwnutrition.com/feed/',                  color: '#b87333' },
  // --- Drinks / Cocktails ---
  { name: 'Punch',                 feed: 'https://punchdrink.com/feed/',                    color: '#313131' },
  { name: 'Cocktail Contessa',     feed: 'https://www.cocktailcontessa.com/feed/',          color: '#186F85' },
  { name: 'Alcademics',            feed: 'https://alcademics.com/feed/',                    color: '#558866' },
  // --- Italian ---
  { name: 'An Italian in my Kitchen', feed: 'https://anitalianinmykitchen.com/feed/',       color: '#c8102e' },
  { name: 'Memorie di Angelina',   feed: 'https://memoriediangelina.com/feed/',             color: '#2e7d32' },
  { name: 'Italian Food Forever',  feed: 'https://italianfoodforever.com/feed/',            color: '#1565c0' },
  // --- Eastern European ---
  { name: "Valentina's Corner",    feed: 'https://valentinascorner.com/feed/',              color: '#7b1fa2' },
  { name: 'Eating European',       feed: 'https://eatingeuropean.com/feed/',                color: '#e65100' },
  // --- Nordic / Scandinavian ---
  { name: 'Nordic Kitchen Stories',feed: 'https://www.nordickitchenstories.co.uk/feed/',    color: '#558b2f' },
  // --- General (large) ---
  { name: 'The Kitchn',            feed: 'https://feeds.feedburner.com/thekitchn',          color: '#e53935' },
];

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
  const m = str.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/i);
  if (!m) return null;
  const h = parseInt(m[1] || 0);
  const min = parseInt(m[2] || 0);
  const sec = parseInt(m[3] || 0);
  if (h && min) return `${h}h ${min}m`;
  if (h) return `${h}h`;
  if (min) return `${min}m`;
  if (sec) return `${sec}s`;
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
  /\bthe\s+best\s+(?:\w+\s+){0,3}\w+s\b(?!\s+recipe)/i, // "The Best Potato Salads", "The Best Simple Weeknight Dinners"
  /\btested\s+by\s+experts?\b/i,                      // "Tested By Experts"
  /\(20\d\d\)/,                                       // "(2026)" — gear/product roundups with year
  /\bfor\s+\w+,\s*\w+.*?,\s*and\b/i,                 // "for Picnics, Potlucks, and Meal Prep"
  /\b(gear|equipment|gadget|appliance|knife|pan|pot|blender|kettle|air\s*fryer).*(review|guide|best|tested)\b/i,
  /\b(review|guide|best|tested).*(gear|equipment|gadget|appliance|knife|pan|pot|blender|kettle|air\s*fryer)\b/i,
  /\bI\s+tested\s+the\b/i,                            // "I Tested the Multicooker..."
  /\bhere'?s?\s+my\s+verdict\b/i,                     // "Here's My Verdict"
  /\bhas\s+\w+\s+separate\b/i,                        // "Has Five Separate Hot Sauces"
  /\bwhat\s+to\s+(eat|cook|make)\s+(in|this|for|now)\b/i, // "What to Eat in April"
  /\bin\s+(january|february|march|april|may|june|july|august|september|october|november|december)\b/i, // seasonal guides
  /\bour\s+(favorite|favourite|top|best|go.to)\s+\w/i,   // "Our Favorite Chicken Dishes"
  /\byou\s+(need\s+to\s+try|must\s+try|should\s+make)\b/i, // "Recipes You Need to Try"
  /\b(every|all)\s+\w+\s+(need|should|must)\b/i,          // "Every Cook Needs This"
  /\bwhy\s+(i|we|you)\s+(love|make|always)\b/i,           // "Why I Always Have This"
  /\b(obsessed|addicted)\s+with\b/i,                      // lifestyle post style
  /\bmy\s+(go.to|tried\s+and\s+true|all.time\s+favorite)\b/i, // "My Go-To Dinner Party Dishes"
  /\bweeknight\s+(dinner\s+)?ideas?\b/i,                  // "Weeknight Dinner Ideas"
  /\b(spring|summer|fall|winter|autumn)\s+(recipes?|dinners?|meals?|produce|eats?)\b(?!.*:)/i, // "Spring Recipes" roundup (not "Spring Pasta: recipe")
  /\b\d+\s+(ways?|ideas?)\s+to\b/i,                       // "5 Ways to Use Leftover Chicken"
  // Promotional / engagement posts
  /\b(cooking|recipe|baking|meal)\s+challenge\b/i,        // "April Cooking Challenge"
  /\bgiveaway\b/i,                                         // giveaway posts
  /\b(cook|make)\s+and\s+review\b/i,                      // "Cook and Review This"
  /\balmanac\b/i,                                          // "The Bakehouse Almanac, April 2026"
  /,\s*(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}/i, // "Title, April 2026"
  /\bfor\s+under\s+\$\d+\b/i,                             // "Easter Dinner for Under $40"
  /\bat\s+(walmart|target|costco|aldi|kroger|trader\s+joe'?s|whole\s+foods|sam'?s\s+club)\b/i, // shopping-guide posts
  /\b(aldi|costco|trader\s+joe'?s?|whole\s+foods)\b.{0,30}\b(shortcut|find|buy|haul|steal|deal|score|pick)\b/i, // "Aldi Dinner Shortcut"
  /\bthis\s+\$\d+\s+\w+\s+(shortcut|find|buy|deal|score)\b/i, // "This $4 Aldi Dinner Shortcut"
  /\bdinner\s+shortcut\b/i,                                    // generic dinner shortcut posts
  /\bfavorite\b.{0,25}\brecipes\b/i,                      // "My Favorite Easter Brunch Recipes…"
  /\bnotes\s+from\b/i,                                     // "Notes From An Estranged Sister"
  /^(is|are|was|were|did|do|does|have|has|can|will|should|would)\s/i, // yes/no question titles (never recipes)
  /\bnever\s+\w+.*\bagain\b/i,                             // "Never Buy Free-Range Eggs Again"
  /\bwhy\s+(i|we)('(ll|ve|m|d|re)|m)?\s/i,                // "Why I'll Never…", "Why We Always…"
  /\bthe\s+truth\s+about\b/i,                              // "The Truth About X" editorial posts
  /\b(stop|quit|give\s+up)\s+(buying|ordering|eating|using|making)\b/i, // "Stop Buying X"
  // Editorial / feature / lifestyle series
  /\bbehind.the.scenes\b/i,                                             // "A Behind-the-Scenes Look at..."
  /\bbar\s+program\b/i,                                                 // "Chicago's Most Exciting New Bar Program"
  /^i\s+finally\b/i,                                                    // "I Finally Stopped Using K-Cups..."
  /\bvol\.?\s*\d+\b/i,                                                  // "A Week In The Life, Vol 14." — recurring series
  /\bweek\s+in\s+(my\s+|the\s+)?life\b/i,                              // "A Week In The Life"
  /\bday\s+in\s+(my\s+|the\s+)?life\b/i,                               // "A Day In The Life"
  /\b(brilliant|genius|clever)\s+(find|hack|trick|solution|discovery)\b/i, // "Thanks to This Brilliant Find"
  /\b(new|exciting|hottest?|must.visit)\s+(bar|restaurant|spot|place)\b/i, // bar/restaurant features
  /\bbar\s+(scene|guide|hop)\b/i,                                       // bar scene guides
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
      excerpt: item.contentSnippet ? decodeHtml(item.contentSnippet.slice(0, 140).trim()) + '…' : '',
      categories,
      searchText,
    };
  });

  feedCache.set(blog.name, { recipes, fetchedAt: Date.now() });
  return recipes;
}

// Stream recipes via SSE so the client renders as each blog loads.
// Limits concurrency to avoid overwhelming outbound connections on a cold cache.
app.get('/api/recipes/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  if (req.query.fresh === '1') feedCache.clear();

  let closed = false;
  req.on('close', () => { closed = true; });
  const send = (data) => { if (!closed && !res.writableEnded) res.write(`data: ${JSON.stringify(data)}\n\n`); };
  const CONCURRENCY = 10;

  for (let i = 0; i < BLOGS.length; i += CONCURRENCY) {
    if (closed) break;
    const batch = BLOGS.slice(i, i + CONCURRENCY);
    await Promise.allSettled(batch.map(async (blog) => {
      try {
        const recipes = await fetchBlogFeed(blog);
        send({ type: 'batch', recipes });
      } catch {}
    }));
  }

  send({ type: 'done' });
  if (!closed) res.end();
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

// Shared Serper search helper — used by both /api/search and /api/ingredient-search
async function runSerperSearch(q, page) {
  const domains = BLOGS.map(b => {
    try { return new URL(b.feed).hostname.replace(/^www\./, ''); } catch { return null; }
  }).filter(Boolean);

  const CHUNK = 40;
  const chunks = [];
  for (let i = 0; i < domains.length; i += CHUNK) chunks.push(domains.slice(i, i + CHUNK));

  const responses = await Promise.all(chunks.map(chunk => {
    const siteQuery = chunk.map(d => `site:${d}`).join(' OR ');
    return fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: { 'X-API-KEY': SERPER_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: `${q} (${siteQuery})`, num: 10, page: parseInt(page) }),
      signal: AbortSignal.timeout(10000),
    }).then(r => r.json()).catch(() => ({}));
  }));

  const seen = new Set();
  const allOrganic = [];
  let totalResults = 0;
  for (const data of responses) {
    if (data.error) continue;
    const t = parseInt(String(data.searchInformation?.totalResults || '').replace(/\D/g, '')) || 0;
    totalResults += t;
    for (const item of (data.organic || [])) {
      if (!seen.has(item.link)) { seen.add(item.link); allOrganic.push(item); }
    }
  }

  const cacheImageMap = new Map();
  for (const { recipes } of feedCache.values()) {
    for (const r of recipes) {
      if (r.url && r.image) cacheImageMap.set(r.url, r.image);
    }
  }

  const results = allOrganic.filter(item => !isRoundup(item.title, item.link)).map(item => {
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

  const missing = results.filter(r => !r.image);
  if (missing.length) {
    await Promise.allSettled(missing.map(async (r) => {
      try {
        const pageRes = await fetch(r.url, {
          headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'text/html' },
          signal: AbortSignal.timeout(5000),
        });
        const html = await pageRes.text();
        const m = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/) ||
                  html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/);
        if (m?.[1]) r.image = m[1];
      } catch {}
    }));
  }

  return { results, totalResults: totalResults || results.length, nextStart: allOrganic.length > 0 ? parseInt(page) + 1 : null };
}

// Serper.dev keyword search
app.get('/api/search', async (req, res) => {
  const { q, page = 1 } = req.query;
  if (!q) return res.status(400).json({ error: 'q is required' });
  if (!SERPER_API_KEY) return res.status(503).json({ error: 'Search API not configured.' });
  try {
    res.json(await runSerperSearch(q, page));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ingredient-based search — uses Haiku to convert ingredients into search terms
app.get('/api/ingredient-search', async (req, res) => {
  const { ingredients, page = 1 } = req.query;
  if (!ingredients) return res.status(400).json({ error: 'ingredients is required' });
  if (!SERPER_API_KEY) return res.status(503).json({ error: 'Search API not configured.' });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: 'AI search not configured. Add ANTHROPIC_API_KEY.' });
  try {
    const msg = await getAnthropic().messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 30,
      messages: [{
        role: 'user',
        content: `Convert this ingredient list into a short recipe search query of 3-5 words. Return ONLY the search terms, nothing else.\nIngredients: ${ingredients}`,
      }],
    });
    const terms = msg.content[0].text.trim();
    const q = /recipe/i.test(terms) ? terms : `${terms} recipe`;
    res.json(await runSerperSearch(q, page));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n  Recipe Finder → http://localhost:${PORT}\n`);
});
