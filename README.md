# Mise en Scroll

A recipe discovery app that aggregates the latest posts from 83 food blogs into a single, filterable feed — plus full-archive search powered by Serper.dev.

![Mise en Scroll](https://img.shields.io/badge/node-%3E%3D18-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue)

## What it does

- **Live feed** — streams the latest recipes from 83 blogs simultaneously, rendering cards as each feed loads
- **Filters** — narrow by cuisine, protein, cook time, and meal type; filter clicks search the full archive via Serper.dev
- **Archive search** — search the full history of all blogs (not just recent posts) using the search bar
- **Recipe drawer** — click any card to see ingredients, instructions, cook times, and servings pulled directly from the recipe page
- **Favorites** — save recipes locally (stored in your browser, private to you)
- **Roundup filtering** — automatically hides listicles, meal plans, gear reviews, and lifestyle posts so you only see actual recipes

## Blogs

### General / American
| Blog | Blog |
|------|------|
| Half Baked Harvest | The Modern Proper |
| Budget Bytes | Pinch of Yum |
| Smitten Kitchen | Minimalist Baker |
| Serious Eats | Damn Delicious |
| Cookie and Kate | Skinnytaste |
| Ambitious Kitchen | Cafe Delites |
| Once Upon a Chef | Well Plated |
| The Recipe Critic | Natasha's Kitchen |
| Spend With Pennies | The Chunky Chef |
| Gimme Some Oven | Two Peas & Their Pod |
| The Cozy Cook | Jo Cooks |
| Feasting at Home | Plays Well With Butter |
| Wholesome Yum | Carlsbad Cravings |
| Host the Toast | The Mediterranean Dish |
| Dishing Out Health | The Food Charlatan |
| Foxes Love Lemons | RecipeTin Eats |
| How Sweet Eats | A Couple Cooks |
| Love and Lemons | Cooking Classy |
| Tastes Better From Scratch | The Stay At Home Chef |
| Dinner at the Zoo | Kevin Is Cooking |
| Little Spice Jar | Creme de la Crumb |
| Fifteen Spatulas | Downshiftology |
| The Defined Dish | Sam the Cooking Guy |
| Justine Snacks | Molly Baz |

### Asian
| Blog | Cuisine Focus |
|------|--------------|
| The Woks of Life | Chinese |
| Omnivore's Cookbook | Chinese |
| Just One Cookbook | Japanese |
| Maangchi | Korean |
| My Korean Kitchen | Korean |
| Hot Thai Kitchen | Thai |
| Rasa Malaysia | Malaysian / Southeast Asian |
| Pickled Plum | Japanese / Asian fusion |
| Viet World Kitchen | Vietnamese |
| Christie at Home | Korean / Asian fusion |

### Indian
| Blog |
|------|
| Veg Recipes of India |
| Spice Up the Curry |
| Manjula's Kitchen |
| Piping Pot Curry |
| Hebbars Kitchen |
| Spice Cravings |

### Greek / Mediterranean
| Blog |
|------|
| My Greek Dish |
| Souvlaki For The Soul |
| Kalofagas |

### Mexican / Latin
| Blog |
|------|
| Mexico in My Kitchen |
| Laylita's Recipes |

### Middle Eastern
| Blog | Focus |
|------|-------|
| Maureen Abood | Lebanese |
| Give Recipe | Turkish |
| Ozlem's Turkish Table | Turkish |
| Tori Avey | Israeli / Jewish |
| Cleobuttera | Egyptian / Levantine |
| Feel Good Foodie | Lebanese / Arabic |
| Zaatar and Zaytoun | Palestinian |
| Persian Mama | Persian / Iranian |

### African / Caribbean
| Blog |
|------|
| Immaculate Bites |
| Chef Lola's Kitchen |

### Filipino
| Blog |
|------|
| Panlasang Pinoy |
| Kawaling Pinoy |

### French / European
| Blog |
|------|
| David Lebovitz |

### BBQ / Southern
| Blog |
|------|
| Hey Grill Hey |

## Filters

Clicking any filter chip searches the full blog archive via Serper.dev.

| Category | Options |
|----------|---------|
| **Cuisine** | Italian, Mexican, Chinese, Japanese, Korean, Thai, Vietnamese, Mediterranean, Indian, Middle Eastern, Filipino, African, American |
| **Protein** | Chicken, Beef, Pork, Seafood, Lamb, Vegetarian, Other |
| **Time** | Quick (≤30m), ~1 Hour, Slow Cooker, 2+ Hours |
| **Meal** | Breakfast, Lunch, Dinner, Dessert, Snack/Side, Drinks |

Multiple filters can be selected at once (OR logic within each category).

## Tech stack

- **Backend** — Node.js / Express
- **RSS parsing** — `rss-parser` with `media:content`, `media:thumbnail`, `content:encoded` support
- **Recipe extraction** — JSON-LD Schema.org parsing via `cheerio`; fallbacks for WP Recipe Maker, Tasty Recipes, Mediavine Create
- **Search** — Serper.dev (Google results, 2,500 free queries/month)
- **Streaming** — Server-Sent Events so recipes appear as each feed loads
- **Caching** — in-memory feed cache (1 hour TTL) so repeat page loads are instant
- **Frontend** — vanilla JS, no framework
- **Favorites** — stored in `localStorage` (browser-local, private per device)

## Setup

### Prerequisites
- Node.js 18+
- A [Serper.dev](https://serper.dev) account (free tier: 2,500 searches/month)

### Install

```bash
git clone https://github.com/benjamin-cooper/mise-en-scroll.git
cd mise-en-scroll
npm install
```

### Configure

Create a `.env` file in the project root:

```
SERPER_API_KEY=your_serper_api_key_here
```

### Run

```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

### Railway (recommended)

1. Push to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub repo
3. Select `mise-en-scroll`
4. Add `SERPER_API_KEY` in the Variables tab
5. Click Generate Domain in the Settings tab

### Render

1. Go to [render.com](https://render.com) → New Web Service → connect repo
2. Start command: `node server.js`
3. Add `SERPER_API_KEY` in the Environment tab

## License

MIT
