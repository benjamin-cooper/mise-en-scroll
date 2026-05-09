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
  { name: 'Brian Lagerstrom',      feed: 'https://www.brianlagerstrom.com/recipes?format=rss', color: '#2c2c2c' },
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
  // --- New additions ---
  { name: 'I Am A Food Blog',      feed: 'https://iamafoodblog.com/feed/',                  color: '#d4526e' },
  { name: "Leite's Culinaria",     feed: 'https://leitesculinaria.com/feed',                color: '#2e6b4f' },
  { name: 'Culinary Hill',         feed: 'https://www.culinaryhill.com/feed/',               color: '#c07830' },
  { name: 'Salt & Lavender',       feed: 'https://www.saltandlavender.com/feed/',            color: '#8b5e8a' },
  { name: 'No Recipes',            feed: 'https://norecipes.com/feed/',                      color: '#2a6496' },
  { name: "Swasthi's Recipes",     feed: 'https://www.indianhealthyrecipes.com/feed/',       color: '#c0692b' },
  { name: 'Chili Pepper Madness',  feed: 'https://www.chilipeppermadness.com/feed/',         color: '#c0211a' },
  { name: 'Foolproof Living',      feed: 'https://foolproofliving.com/feed/',                color: '#5a8a6a' },
  // --- Low Sodium / Heart-Healthy ---
  { name: 'Sodium Girl',          feed: 'https://www.sodiumgirl.com/feed/',                  color: '#e05080' },
  { name: 'Forks Over Knives',    feed: 'https://www.forksoverknives.com/feed/',             color: '#4a8a3a' },
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
  // Product trivia / "did you know" editorial (common on The Kitchn)
  /\b(secret|hidden)\s+(feature|function|button|compartment|setting|trick)\b/i, // "The Secret Feature on Kikkoman..."
  /\bsecret\s+\w+\s+on\s+\w/i,                                         // "The Secret X on Y Bottles"
  /\b(did\s+you\s+know|fun\s+fact)\b/i,                                 // trivia posts
  /\bthe\s+one\s+(thing|mistake|trick|rule|secret|reason)\b/i,          // "The One Thing You Should Always..."
  /\byou('ve)?\s+(been\s+doing|never\s+knew|didn'?t\s+know|always\s+wondered)\b/i, // "You've Been Doing X Wrong"
  /\b(doing|making|using|storing|eating|cooking)\s+[\w\s]{2,30}wrong\b/i, // "You've Been Making Scrambled Eggs Wrong"
  // Subtitle editorial questions: "Topic: Does X Count?", "Spirits: Is This Real?"
  /:\s*(does|is|are|should|can|will|would|has|have|did)\s.+\?$/i,
  // Industry news: distillery/brewery closures, acquisitions
  /\b(closes?|closing|closed|shut\s+down)\b.{0,30}\b(distillery|brewery|winery|bar|restaurant|cafe)\b/i,
  /\b(distillery|brewery|winery)\b.{0,30}\b(closes?|closing|closed|news|acquired|sold)\b/i,
  // Interactive / promo posts
  /\bmatchmaker\b/i,                                                    // "Easter Lamb Matchmaker!"
  /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s+things?\b/i, // "Tuesday Things."
  /\b\w+day\s+things?\b/i,                                             // catches variations like "Weekday Things"
  // Spirits / drinks editorial (Alcademics, Punch)
  /\btasting\s+notes?\b/i,                                              // "Tasting Notes: X"
  /\b(spirits?|whiskey|whisky|bourbon|gin|rum|vodka|tequila|mezcal|beer|wine)\b.{0,25}\b(review|tasting|notes?)\b/i,
  /^review\b/i,                                                         // title starts with "Review:"
  /\bthe\s+history\s+of\b/i,                                           // "The History of Bourbon"
  /\bguide\s+to\b/i,                                                   // "A Guide to Natural Wine"
  // X vs Y comparisons — always editorial, never a recipe title
  /\bvs\.?\s+\w/i,                                                     // "Tamari vs Soy Sauce", "Butter vs Oil"
  // Educational / tips (The Kitchn style)
  /\bthe\s+difference\s+between\b/i,                                   // "The Difference Between X and Y"
  /\beverything\s+you\s+(need\s+to\s+)?know\s+(about|on)\b/i,         // "Everything You Need to Know About X"
  /\bwhat\s+is\s+(a\s+|an\s+)?\w[\w\s]{1,20}\?/i,                    // "What Is a Tagine?"
  /\bhow\s+to\s+(store|clean|organize|choose|buy|pick|select|sharpen|care\s+for|get\s+rid\s+of)\b/i,
  /\b(pantry|kitchen)\s+(staples?|essentials?|must.?haves?|basics?)\b/i, // pantry/kitchen essentials lists
  // Taste tests and comparative reviews
  /\b(we|i)\s+(tried|tested|tasted)\s+(every|all|\d+)\b/i,            // "We Tried Every Hot Sauce", "I Tested 10 Butters"
  /\bwe\s+made\s+.{3,35}\s+\d+\s+(different\s+)?ways?\b/i,           // "We Made Pasta 6 Different Ways"
  // Clickbait
  /\byou\s+won'?t\s+believe\b/i,
  /\bgoing\s+viral\b/i,
  /\bthe\s+internet\s+(is\s+)?(obsessed|loves?|can'?t\s+stop)\b/i,
  /\beveryone\s+is\s+(making|talking\s+about|obsessed\s+with)\b/i,
  /\b(changed|will\s+change)\s+(my|your|our)\s+(life|world|everything)\b/i, // "This Changed My Life"
  /\bwhat\s+happens\s+when\s+you\b/i,                                 // experiment/editorial
  /\bthe\s+real\s+reason\s+(why\s+)?\w/i,                             // "The Real Reason Your Cake Falls Flat"
  /\bhere'?s?\s+why\s+(you\s+should|we|i)\b/i,                        // "Here's Why You Should..."
  /\b(so\s+)?i\s+ate\s+.{3,30}\s+(for\s+a?\s*\d+|for\s+(a\s+)?(week|month|year|day))\b/i, // "I Ate X for a Week"
  /\bmy\s+honest\s+(review|opinion|thoughts?)\b/i,                    // "My Honest Review of X"
  /\bworth\s+(it|the\s+hype|buying|trying)\b/i,                       // "Is X Worth the Hype?"
  /\bis\s+it\s+worth\b/i,
  // Shopping / product launch / deals (The Kitchn publishes heavily)
  /\b\d+\s+(best|top)\b/i,                                             // "The 32 Best..." (number before best)
  /\bdeals?\s+to\s+shop\b/i,                                          // "32 Best Kitchen Deals to Shop"
  /,\s*and\s+more\.?\s*$/i,                                           // "...from Williams Sonoma, Momofuku, and More"
  /\bnew\s+collection\b/i,                                            // "Dollar General's New Collection"
  /\bnewest\s+(pieces?|products?|items?|collection|arrivals?|line)\b/i, // "Le Creuset's Newest Pieces"
  /\bfrozen\s+(pizza|meal|food|dinner|entree)s?\b/i,                  // frozen product reviews
  /\bperfect\s+in\s+a\s+pinch\b/i,
  /\b\w+'?s\s+(trick|tip|hack|secret)\s+(for|to)\b/i,                // "Martha Stewart's Trick for Making..."
  /\b\d+x\s+more\b/i,                                                 // "100x More Tasty"
  /\bwe\s+asked\b.{5,60}\band\s+they\b/i,                             // "We Asked 3 Grandmas...and They All Said"
  /\bthey\s+all\s+said\b/i,                                           // "...and They All Said the Same Thing"
  /^this\s+and\s+that\b/i,                                            // "This and That" lifestyle catch-all
  // Beauty / fashion / lifestyle shopping (How Sweet Eats, etc.)
  /\b(sephora|ulta|nordstrom|net.a.porter|revolve|anthropologie)\b/i,
  /\b(beauty|skincare|makeup|fragrance|perfume|moisturizer|serum|foundation)\b.{0,30}\b(sale|haul|favorites?|picks?|finds?)\b/i,
  /\b(sale|haul|favorites?|picks?|finds?)\b.{0,30}\b(beauty|skincare|makeup|fashion|style|outfit)\b/i,
  /\bspring\s+sale\b/i,
  /\b(outfit|wardrobe|clothing|clothes)\b/i,                         // non-food lifestyle content
  /\b(fashion|style)\s+(haul|finds?|picks?|favorites?|inspo|inspiration|post)\b/i,
  // Q&A / interview editorial
  /^we\s+asked\b/i,                                  // "We Asked: What's Your Best Advice..."
  // Travel / lifestyle content
  /\bthings\s+to\s+do\b/i,                           // "Things To Do in the South of France"
  // Awards / industry recognition
  /\bnominees?\s+(for|of)\b/i,                        // "Final Nominees for Best New Bartenders"
  /\bintroducing\s+the\s+(final|new|latest|top)\b/i, // "Introducing the Final Nominees..."
  /\bbest\s+new\s+(bartenders?|chefs?|sommeliers?|distillers?)\b/i,
  // Gift guides
  /\bgifts?\s+(for|ideas?|guide)\b/i,                // "Gifts for Mom", "Gift Ideas for Dad"
  /\b\d+\s+\w[\w\s]{0,20}gifts?\b/i,                // "10 Cocktail Gifts Mom Will..."
  /\bgifts?\s+(mom|dad|him|her|them|anyone|every|the\s+cook|the\s+baker|the\s+host)\b/i,
  /\bgift\s+list\b/i,
  /\bwhat\s+to\s+(get|buy|give)\b/i,                 // "What to Get the Cook in Your Life"
  // Survey / research questions (not recipes)
  /^how\s+(?!to\s)\w+\s+(are|is|do|does)\b/i,       // "How Confident Are Americans..."
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

// Cache feed results for 1 hour to avoid hammering feeds on every load
const feedCache = new Map(); // blogName -> { recipes, fetchedAt }
const CACHE_TTL = 60 * 60 * 1000; // 1 hour
const CACHE_FILE = path.join(__dirname, '.feed-cache.json');

// Persist cache to disk so Render restarts don't cold-start every blog
let _persistTimer = null;
function persistFeedCache() {
  clearTimeout(_persistTimer);
  _persistTimer = setTimeout(() => {
    const data = {};
    feedCache.forEach((v, k) => { data[k] = v; });
    fs.writeFile(CACHE_FILE, JSON.stringify(data), () => {});
  }, 2000);
}

// Load persisted cache on startup
try {
  const raw = fs.readFileSync(CACHE_FILE, 'utf8');
  const data = JSON.parse(raw);
  for (const [name, entry] of Object.entries(data)) feedCache.set(name, entry);
  console.log(`Feed cache loaded from disk (${feedCache.size} entries)`);
} catch {}

// Try to extract totalTime in minutes from JSON-LD embedded in RSS content
function extractCookTimeMinutes(item) {
  const html = item.contentEncoded || item.content || '';
  if (!html) return null;
  try {
    const m = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
    if (!m) return null;
    const json = JSON.parse(m[1]);
    const schemas = Array.isArray(json) ? json : (json['@graph'] ? json['@graph'] : [json]);
    for (const s of schemas) {
      const t = s['@type'];
      if (t === 'Recipe' || (Array.isArray(t) && t.includes('Recipe'))) {
        const dur = s.totalTime || s.cookTime;
        if (!dur) return null;
        const d = dur.match(/PT(?:(\d+)H)?(?:(\d+)M)?/i);
        if (d) return (parseInt(d[1] || 0) * 60) + parseInt(d[2] || 0);
      }
    }
  } catch {}
  return null;
}

async function fetchBlogFeed(blog) {
  const cached = feedCache.get(blog.name);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) return cached.recipes;

  const feed = await parser.parseURL(blog.feed);
  const recipes = feed.items.filter(item => !isRoundup(item.title, item.link)).slice(0, 8).map((item) => {
    const categories = (item.categories || []).map(c =>
      typeof c === 'string' ? c : (c._ || c['#text'] || '')
    ).filter(Boolean);
    const searchText = [item.title || '', ...categories, item.contentSnippet || ''].join(' ').toLowerCase();
    const cookTimeMinutes = extractCookTimeMinutes(item);
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
      ...(cookTimeMinutes !== null ? { cookTimeMinutes } : {}),
    };
  });

  feedCache.set(blog.name, { recipes, fetchedAt: Date.now() });
  persistFeedCache();
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

    // Parse nutrition facts if available
    const n = recipeData.nutrition || {};
    const cleanNum = s => s ? String(s).match(/[\d.]+/)?.[0] : null;
    const nutrition = {};
    if (cleanNum(n.calories))           nutrition.calories = cleanNum(n.calories);
    if (cleanNum(n.proteinContent))     nutrition.protein  = cleanNum(n.proteinContent);
    if (cleanNum(n.carbohydrateContent))nutrition.carbs    = cleanNum(n.carbohydrateContent);
    if (cleanNum(n.fatContent))         nutrition.fat      = cleanNum(n.fatContent);
    if (cleanNum(n.fiberContent))       nutrition.fiber    = cleanNum(n.fiberContent);
    if (cleanNum(n.sodiumContent))      nutrition.sodium   = cleanNum(n.sodiumContent);

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
      nutrition: Object.keys(nutrition).length ? nutrition : null,
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

// In-memory cache for CalorieNinjas results (keyed by query string)
const nutritionCache = new Map(); // query -> nutrition object
const NUTRITION_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

async function callCalorieNinjas(query, apiKey, retries = 1) {
  const r = await fetch(
    `https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(query)}`,
    { headers: { 'X-Api-Key': apiKey }, signal: AbortSignal.timeout(10000) }
  );
  if (!r.ok) {
    if (r.status >= 500 && retries > 0) {
      // Wait 1.5s then retry once on server errors
      await new Promise(resolve => setTimeout(resolve, 1500));
      return callCalorieNinjas(query, apiKey, retries - 1);
    }
    console.warn(`CalorieNinjas ${r.status}`);
    return null;
  }
  return r.json();
}

// CalorieNinjas Nutrition Analysis — calculates nutrition from ingredient strings
app.post('/api/nutrition', async (req, res) => {
  const { ingredients, servings } = req.body;
  if (!Array.isArray(ingredients) || !ingredients.length) {
    return res.status(400).json({ error: 'ingredients array is required' });
  }
  const apiKey = process.env.CALORIENINJAS_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'Nutrition analysis not configured. Add CALORIENINJAS_API_KEY.' });
  }

  try {
    // Expand "1/4 tsp EACH onion powder, garlic powder, salt" into separate lines
    // so CalorieNinjas sees proper quantities for each item.
    function expandEach(ing) {
      const m = ing.match(/^([\d\s\/\-\.]+\s+(?:tsp|tbsp|tablespoons?|teaspoons?|cups?|oz|ounces?|pounds?|lbs?|g|grams?|ml)\b\.?)\s+EACH\s+(.+)$/i);
      if (!m) return [ing];
      const qty = m[1].trim();
      return m[2].split(',').map(s => `${qty} ${s.trim()}`).filter(s => s.trim());
    }

    // Normalise ranges like "4-6 cloves" → "5 cloves" (midpoint)
    function normaliseRange(ing) {
      return ing.replace(/\b(\d+)\s*[-–]\s*(\d+)\b/, (_, a, b) =>
        String(Math.round((parseInt(a) + parseInt(b)) / 2))
      );
    }

    // Convert "N (X oz.) can FOOD" → "<grams>g FOOD" before parens are stripped.
    // e.g. "1 (15.5 oz.) can pinto beans"     → "440g pinto beans"
    //      "2 (14.5 oz.) cans diced tomatoes"  → "822g diced tomatoes"
    // Without this, stripParens eats the oz measurement and leaves "1 can pinto beans",
    // which CalorieNinjas cannot parse and returns wildly inflated values for.
    // We convert to grams (not oz) because CalorieNinjas handles gram queries reliably
    // for legumes and other foods where oz-based lookups return wrong values.
    function extractCanSize(ing) {
      return ing.replace(
        /^(\d+(?:\.\d+)?)\s+\((\d+(?:\.\d+)?)\s*oz\.?\)\s+cans?\s+(.+)$/i,
        (_, count, ozPer, food) => {
          const grams = Math.round(+count * +ozPer * 28.35);
          return `${grams}g ${food}`;
        }
      );
    }

    // Strip parenthetical notes — "(drained)", "(+ ½ cup extra if needed)", "(divided)"
    // These confuse CalorieNinjas without adding nutritional value.
    // Handles nested parens like "(finely shredded (optional))" by iterating until stable,
    // then scrubbing any orphaned ( or ) that remain.
    function stripParens(ing) {
      let s = ing;
      let prev;
      do { prev = s; s = s.replace(/\([^)]*\)/g, ''); } while (s !== prev);
      return s.replace(/[()]/g, '').replace(/\s{2,}/g, ' ').trim();
    }

    // Convert unicode fractions to ASCII so CalorieNinjas parses quantities reliably
    const UNICODE_FRACS = { '½': '1/2', '⅓': '1/3', '⅔': '2/3', '¼': '1/4', '¾': '3/4', '⅛': '1/8', '⅜': '3/8', '⅝': '5/8', '⅞': '7/8' };
    function normaliseFractions(ing) {
      return ing.replace(/[½⅓⅔¼¾⅛⅜⅝⅞]/g, m => UNICODE_FRACS[m] || m);
    }

    // Convert ASCII fractions to decimals so CalorieNinjas parses them correctly.
    // Without this, "1/4 teaspoon salt" is unparseable and defaults to 100 g of salt
    // (≈39,000 mg sodium). "0.25 teaspoon salt" is understood correctly.
    // Handles mixed numbers too: "1 1/2 cups" → "1.5 cups".
    function decimalFractions(ing) {
      return ing
        .replace(/\b(\d+)\s+(\d+)\/(\d+)\b/g, (_, w, n, d) =>
          String(Math.round((+w + +n / +d) * 1000) / 1000))
        .replace(/\b(\d+)\/(\d+)\b/g, (_, n, d) =>
          String(Math.round(+n / +d * 1000) / 1000));
    }

    // Condiment bypass: calculate nutrition directly from USDA-accurate per-100g values
    // instead of sending to CalorieNinjas, whose condiment database has large errors
    // (e.g. oyster sauce reported at 2,754mg Na/100g vs actual ~1,300mg Na/100g).
    //
    // Also fixes CalorieNinjas's decimal-stripping bug: "0.25 tsp dark soy sauce" is
    // read as "25 tsp" → serving_size_g=400 → 21,615mg sodium. By calculating here,
    // we never send fractional condiment quantities to the API at all.
    //
    // g/tsp: density × 5ml/tsp. Tablespoon = 3× tsp.
    const CONDIMENT_G_PER_TSP = {
      'soy sauce': 6, 'light soy sauce': 6, 'dark soy sauce': 6,
      'tamari': 6, 'coconut aminos': 6, 'liquid aminos': 6,
      'fish sauce': 6, 'oyster sauce': 6, 'shrimp paste': 7,
      'hoisin sauce': 7, 'plum sauce': 7, 'chili garlic sauce': 7,
      'sambal oelek': 7, 'gochujang': 7, 'doubanjiang': 7,
      'mirin': 6, 'sake': 5, 'rice wine': 6, 'shaoxing wine': 5,
      'worcestershire sauce': 6, 'hot sauce': 5, 'sriracha': 5.5,
      'sesame oil': 4.5, 'chili oil': 4.5,
      'rice vinegar': 5, 'balsamic vinegar': 6,
      'apple cider vinegar': 5, 'white vinegar': 5, 'red wine vinegar': 5,
    };
    // Nutrition per 100g — USDA FoodData Central / standard references
    const CONDIMENT_PER_100G = {
      'soy sauce':            { cal: 53,  pro: 8.1,  fat: 0.1, carb: 4.9,  fib: 0,   na: 5500 },
      'light soy sauce':      { cal: 53,  pro: 8.1,  fat: 0.1, carb: 4.9,  fib: 0,   na: 5500 },
      'dark soy sauce':       { cal: 55,  pro: 7.0,  fat: 0.1, carb: 4.8,  fib: 0,   na: 4600 },
      'tamari':               { cal: 61,  pro: 10.9, fat: 0,   carb: 2.0,  fib: 0,   na: 4580 },
      'coconut aminos':       { cal: 60,  pro: 0,    fat: 0,   carb: 14,   fib: 0,   na: 700  },
      'liquid aminos':        { cal: 53,  pro: 8.1,  fat: 0.1, carb: 4.9,  fib: 0,   na: 5500 },
      'fish sauce':           { cal: 35,  pro: 5.0,  fat: 0,   carb: 3.7,  fib: 0,   na: 5690 },
      'oyster sauce':         { cal: 93,  pro: 2.7,  fat: 0.3, carb: 21,   fib: 0,   na: 1300 },
      'shrimp paste':         { cal: 180, pro: 21,   fat: 3,   carb: 14,   fib: 0,   na: 8800 },
      'hoisin sauce':         { cal: 220, pro: 4.0,  fat: 4.0, carb: 40,   fib: 3,   na: 2100 },
      'plum sauce':           { cal: 215, pro: 0.5,  fat: 0.1, carb: 53,   fib: 1,   na: 870  },
      'chili garlic sauce':   { cal: 60,  pro: 2,    fat: 1,   carb: 12,   fib: 2,   na: 2200 },
      'sambal oelek':         { cal: 35,  pro: 1.5,  fat: 0.5, carb: 7,    fib: 1.5, na: 2300 },
      'gochujang':            { cal: 190, pro: 5,    fat: 1,   carb: 40,   fib: 4,   na: 1800 },
      'doubanjiang':          { cal: 90,  pro: 5,    fat: 4,   carb: 9,    fib: 2,   na: 5100 },
      'mirin':                { cal: 255, pro: 0.5,  fat: 0,   carb: 54,   fib: 0,   na: 30   },
      'sake':                 { cal: 134, pro: 0.5,  fat: 0,   carb: 5,    fib: 0,   na: 5    },
      'rice wine':            { cal: 134, pro: 0.5,  fat: 0,   carb: 5,    fib: 0,   na: 5    },
      'shaoxing wine':        { cal: 134, pro: 0.5,  fat: 0,   carb: 5,    fib: 0,   na: 5    },
      'worcestershire sauce': { cal: 78,  pro: 0,    fat: 0,   carb: 20.4, fib: 0,   na: 2580 },
      'hot sauce':            { cal: 35,  pro: 1,    fat: 0,   carb: 7,    fib: 0,   na: 2200 },
      'sriracha':             { cal: 93,  pro: 1.6,  fat: 2.7, carb: 17,   fib: 0,   na: 2200 },
      'sesame oil':           { cal: 884, pro: 0,    fat: 100, carb: 0,    fib: 0,   na: 0    },
      'chili oil':            { cal: 884, pro: 0,    fat: 100, carb: 0,    fib: 0,   na: 0    },
      'rice vinegar':         { cal: 18,  pro: 0,    fat: 0,   carb: 0.9,  fib: 0,   na: 0    },
      'balsamic vinegar':     { cal: 88,  pro: 0.5,  fat: 0,   carb: 17.2, fib: 0,   na: 23   },
      'apple cider vinegar':  { cal: 21,  pro: 0,    fat: 0,   carb: 0.9,  fib: 0,   na: 5    },
      'white vinegar':        { cal: 18,  pro: 0,    fat: 0,   carb: 0,    fib: 0,   na: 2    },
      'red wine vinegar':     { cal: 19,  pro: 0.1,  fat: 0,   carb: 0.3,  fib: 0,   na: 8    },
    };

    // Convert condiment tsp/tbsp quantities to grams, then pull them OUT of the
    // CalorieNinjas query entirely — nutrition is calculated directly from CONDIMENT_PER_100G.
    const syntheticCondimentItems = [];
    function normaliseCondimentTsp(ing) {
      return ing.replace(
        /^(\d+(?:\.\d+)?)\s+(tsp\.?|teaspoons?|tbsp\.?|tablespoons?)\s+(.+)$/i,
        (match, qty, unit, food) => {
          const key = food.trim().toLowerCase().replace(/\s+/g, ' ');
          const gPerTsp = CONDIMENT_G_PER_TSP[key];
          if (!gPerTsp) return match;
          const gPerUnit = /tbsp|tablespoon/i.test(unit) ? gPerTsp * 3 : gPerTsp;
          const grams = Math.round(parseFloat(qty) * gPerUnit);
          return grams > 0 ? `${grams}g ${food.trim()}` : match;
        }
      );
    }
    // After the full pipeline runs, filter condiment items out of the query and
    // compute their nutrition locally. Called after processed[] is built.
    function extractCondimentItems(processedList) {
      return processedList.filter(ing => {
        const m = ing.match(/^(\d+(?:\.\d+)?)g\s+(.+)$/i);
        if (!m) return true; // not a gram-quantity item, keep in query
        const food = m[2].trim().toLowerCase();
        const n = CONDIMENT_PER_100G[food];
        if (!n) return true; // not a known condiment, keep in query
        const s = parseFloat(m[1]) / 100;
        syntheticCondimentItems.push({
          name: food, serving_size_g: parseFloat(m[1]),
          calories: n.cal * s, protein_g: n.pro * s,
          fat_total_g: n.fat * s, carbohydrates_total_g: n.carb * s,
          fiber_g: n.fib * s, sodium_mg: n.na * s,
        });
        return false; // remove from CalorieNinjas query
      });
    }

    // Strip trailing period from unit abbreviations so CalorieNinjas parses them correctly:
    // "28 oz. can tomatoes" → "28 oz can tomatoes"  (without this, "oz." is unrecognised
    // and CalorieNinjas treats the leading number as a count of "cans" → 28× overcount)
    function normaliseUnits(ing) {
      return ing
        .replace(/\b(oz|tbsp|tsp|cup|lb|lbs|g|ml)\./gi, '$1') // strip trailing period
        .replace(/\b(\d[\d\.]*\s*(?:oz|g|lb|lbs|pound|ounce|tbsp|tsp|cup|cups))\s+cans?\s+/gi, '$1 '); // "15 oz can beans" → "15 oz beans"
    }

    // Convert "X cups <dense ingredient>" → "<grams>g <ingredient>"
    // CalorieNinjas uses a food's standard serving size (often 1 tbsp) regardless of the
    // volume unit given, so "1 cup mayonnaise" returns 1 tbsp worth (~95 cal) instead of
    // ~1,440 cal. Converting to grams bypasses the serving-size lookup entirely.
    const CUP_GRAM_MAP = {
      // Fats & oils
      'mayonnaise': 232, 'mayo': 232,
      'butter': 227, 'unsalted butter': 227, 'salted butter': 227,
      'shortening': 205,
      'coconut oil': 218, 'olive oil': 216, 'vegetable oil': 218,
      'canola oil': 218, 'avocado oil': 218, 'sesame oil': 218,
      // Dairy / cream
      'heavy cream': 238, 'heavy whipping cream': 238, 'whipping cream': 238,
      'half and half': 242, 'half-and-half': 242,
      'sour cream': 230,
      'cream cheese': 232,
      'greek yogurt': 245, 'plain yogurt': 245, 'yogurt': 245,
      'ricotta': 246, 'ricotta cheese': 246,
      'cottage cheese': 226,
      // Nut butters & spreads
      'peanut butter': 258, 'almond butter': 250, 'cashew butter': 258,
      'sunflower butter': 245, 'tahini': 240, 'hummus': 246, 'nutella': 270,
      // Sweeteners (liquid)
      'honey': 340, 'maple syrup': 322, 'agave': 336, 'agave nectar': 336,
      'corn syrup': 328, 'molasses': 337,
      // Sweeteners (dry)
      'sugar': 200, 'granulated sugar': 200, 'white sugar': 200,
      'brown sugar': 220, 'powdered sugar': 120, 'confectioners sugar': 120,
      'powdered sugar': 120, 'coconut sugar': 200,
      // Flours & dry goods
      'flour': 120, 'all-purpose flour': 120, 'all purpose flour': 120,
      'bread flour': 127, 'whole wheat flour': 120, 'almond flour': 96,
      'oat flour': 92, 'coconut flour': 112, 'cornmeal': 138,
      'oats': 90, 'rolled oats': 90, 'quick oats': 85,
      // Chocolate & cocoa
      'cocoa powder': 85, 'chocolate chips': 168,
    };
    function normaliseCups(ing) {
      return ing.replace(/\b(\d[\d\.]*)\s+cups?\s+(.+)$/i, (match, qty, food) => {
        const q = parseFloat(qty);
        const key = food.trim().toLowerCase().replace(/\s+/g, ' ');
        // Known dense foods: convert to grams (most accurate)
        const gPerCup = CUP_GRAM_MAP[key];
        if (gPerCup) return `${Math.round(q * gPerCup)}g ${food.trim()}`;
        // Fractional cups (< 1): CalorieNinjas misreads "0.5" as "5", so convert to
        // tablespoons instead — whole-number tbsp quantities are parsed reliably.
        if (q > 0 && q < 1) {
          const tbsp = Math.round(q * 16);
          return `${tbsp} tablespoons ${food.trim()}`;
        }
        return match;
      });
    }

    // Collapse "1 tbsp + 1 tsp butter" → "1 tbsp butter" (take the larger unit)
    function collapseCompound(ing) {
      return ing.replace(/(\d[\d\s\/]*\s+\w+)\s*\+\s*[\d\s\/]+\s+\w+/g, '$1');
    }

    // Strip "or X" alternative ingredients — keep only the first option
    function stripOrAlternative(ing) {
      return ing.replace(/\s*,?\s+or\s+.+$/i, '');
    }

    // Strip trailing texture/temp/prep descriptors after comma: ", softened", ", drained and rinsed"
    function stripTrailingDescriptors(ing) {
      return ing.replace(/,\s*(softened|melted|room\s+temperature|cold|chilled|warmed?|beaten|whisked|sifted|toasted|divided|optional|drained|rinsed|patted\s+dry|squeezed\s+dry|cooked|thawed|peeled|seeded|cored|trimmed|halved|quartered|sliced|chopped|minced|grated|shredded|crumbled).*$/i, '').trim();
    }

    // Strip ingredients CalorieNinjas can't reliably calculate.
    // - Plain salt (any type, any quantity): CalorieNinjas defaults to 100g when it
    //   can't parse fractional/decimal quantities, inflating sodium by ~2,000mg/serving.
    //   Celery salt, soy sauce, fish sauce etc. are kept — they're measured flavour
    //   ingredients that CalorieNinjas handles correctly.
    // - Black/white/ground pepper: negligible nutrition, consistently overcounted.
    const STRIP_PATTERNS = [
      // All plain salt — any quantity, any type (but NOT celery/garlic/onion salt)
      /^[\d\.\s]*(?:tsp\.?|teaspoons?|tbsp\.?|tablespoons?|cups?)?\s*(?:kosher\s+|sea\s+|coarse\s+|table\s+|iodized\s+|pink\s+|fine\s+)?salt$/i,
      // Salt-and-pepper combos
      /^[\d\.\s]*(?:tsp\.?|teaspoons?|tbsp\.?|tablespoons?)?\s*salt\s+and\s+(black\s+)?pepper$/i,
      // All black / white / ground pepper (any quantity)
      /\b(?:black|white|freshly\s+ground)\s+pepper\b/i,
      /^[\d\.\s]*(?:tsp\.?|teaspoons?|tbsp\.?|tablespoons?)?\s*(?:freshly\s+)?ground\s+pepper$/i,
      // Baking soda & baking powder — very high sodium per 100g (~27,360mg and ~10,000mg).
      // Fractional quantities like "1/2 tsp" become "0.5 tsp" which CalorieNinjas can't
      // parse, defaulting to 100g and inflating sodium by tens of thousands of mg.
      /\bbaking\s+soda\b/i,
      /\bbaking\s+powder\b/i,
      // Vague / unquantified seasonings
      /\bto\s+taste$/i,
      /\bas\s+needed$/i,
      /\bas\s+desired$/i,
      /^(a\s+)?(pinch|dash|drizzle|splash|handful)\b/i,
    ];

    const processed = ingredients
      .flatMap(expandEach)
      .map(extractCanSize)
      .map(stripParens)
      .map(normaliseUnits)
      .map(normaliseFractions)
      .map(decimalFractions)
      .map(normaliseCondimentTsp)
      .map(normaliseCups)
      .map(normaliseRange)
      .map(collapseCompound)
      .map(stripOrAlternative)
      .map(stripTrailingDescriptors)
      .filter(ing => !STRIP_PATTERNS.some(p => p.test(ing.trim())))
      .filter(Boolean);

    // Strip condiments from the query; nutrition is computed via CONDIMENT_PER_100G
    const queryIngredients = extractCondimentItems(processed);

    // Build an ordered list of {food, grams} for post-hoc serving_size_g correction.
    // CalorieNinjas sometimes uses the wrong quantity internally (e.g. strips "0." from
    // "0.25 tsp" and reads it as "25 tsp"). We detect this via serving_size_g and rescale.
    //
    // An ordered list (not a map) is critical: a recipe can have the same food twice at
    // different quantities (e.g. "2 tsp dark soy sauce" + "0.25 tsp dark soy sauce").
    // CalorieNinjas returns items in query order, so we match them in order too.
    const gramIntentList = []; // [{food: string, grams: number}]
    queryIngredients.forEach(ing => {
      let m;
      m = ing.match(/^(\d+(?:\.\d+)?)g\s+(.+)$/i);
      if (m) { gramIntentList.push({ food: m[2].trim().toLowerCase(), grams: Math.round(parseFloat(m[1])) }); return; }
      m = ing.match(/^(\d+(?:\.\d+)?)\s+oz\.?\s+(.+)$/i);
      if (m) { gramIntentList.push({ food: m[2].trim().toLowerCase(), grams: Math.round(parseFloat(m[1]) * 28.35) }); }
    });

    // Join ingredients into one natural-language query string
    const query = queryIngredients.join(', ');

    // Return cached result if we have a recent one for this exact query
    const cached = nutritionCache.get(query);
    if (cached && Date.now() - cached.ts < NUTRITION_CACHE_TTL) {
      return res.json({ nutrition: cached.nutrition, servings: cached.servings, source: 'calorieninjas' });
    }

    const data = await callCalorieNinjas(query, apiKey);
    if (!data) return res.json({ nutrition: null });
    const rawItems = data.items || [];
    if (!rawItems.length) return res.json({ nutrition: null });

    // Scale items where CalorieNinjas used the wrong quantity.
    // When serving_size_g differs from our intended grams by >50%, the per-gram
    // nutrition values are still correct — we just need to rescale to the right total.
    // We match CalorieNinjas items to gramIntentList entries in order (first unused match)
    // so that two entries of the same food each get their own intended gram weight.
    const SCALE_THRESHOLD = 1.5;
    const usedIntentIndices = new Set();
    const items = rawItems.map(item => {
      const key = item.name.toLowerCase().trim();
      const matchIdx = gramIntentList.findIndex((x, i) => !usedIntentIndices.has(i) && x.food === key);
      if (matchIdx >= 0 && item.serving_size_g > 0) {
        usedIntentIndices.add(matchIdx);
        const intended = gramIntentList[matchIdx].grams;
        if (intended > 0) {
          const ratio = item.serving_size_g / intended;
          if (ratio > SCALE_THRESHOLD || ratio < 1 / SCALE_THRESHOLD) {
            const scale = intended / item.serving_size_g;
            return {
              ...item,
              calories:                  item.calories                  * scale,
              protein_g:                 item.protein_g                 * scale,
              fat_total_g:               item.fat_total_g               * scale,
              carbohydrates_total_g:     item.carbohydrates_total_g     * scale,
              fiber_g:                   item.fiber_g                   * scale,
              sodium_mg:                 item.sodium_mg                 * scale,
            };
          }
        }
      }
      return item;
    });

    // Merge CalorieNinjas items with locally-calculated condiment items
    const allItems = [...syntheticCondimentItems, ...items];

    console.log('[nutrition] query:', query);
    allItems.forEach(i => console.log(`[nutrition]  ${i.name}: ${i.calories.toFixed(1)}cal sodium=${i.sodium_mg.toFixed(0)}mg serving_size_g=${i.serving_size_g}`));

    // Sum totals across all ingredient items
    const sum = (key) => allItems.reduce((acc, item) => acc + (item[key] || 0), 0);

    // Parse servings robustly — "Serves 6", "6 servings", "8", etc.
    const yld = (() => {
      if (!servings) return null;
      const n = parseInt(String(servings).match(/\d+/)?.[0]);
      return (n > 0 && n <= 100) ? n : null;
    })();

    // If no servings were passed, estimate from calorie density:
    // total recipe calories / 500kcal per serving ≈ a rough serving count
    const totalCal = sum('calories');
    const estimatedYld = yld || Math.max(1, Math.round(totalCal / 500));

    const round1 = n => Math.round(n * 10) / 10;
    const perServing = (val) => round1(val / estimatedYld);

    const nutrition = {
      calories: String(Math.round(sum('calories') / estimatedYld)),
      protein:  String(perServing(sum('protein_g'))),
      carbs:    String(perServing(sum('carbohydrates_total_g'))),
      fat:      String(perServing(sum('fat_total_g'))),
      fiber:    String(perServing(sum('fiber_g'))),
      sodium:   String(Math.round(sum('sodium_mg') / estimatedYld)),
    };

    // Cache successful result for 24h so rerequests are instant
    nutritionCache.set(query, { nutrition, servings: estimatedYld, ts: Date.now() });

    res.json({ nutrition, servings: estimatedYld, source: 'calorieninjas' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n  Recipe Finder → http://localhost:${PORT}\n`);
});
