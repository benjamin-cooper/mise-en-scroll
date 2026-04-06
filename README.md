# Mise en Scroll

A recipe discovery app that aggregates the latest posts from 97 food blogs into a single, filterable feed — plus full-archive search powered by Serper.dev.

![Mise en Scroll](https://img.shields.io/badge/node-%3E%3D18-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue)

## What it does

- **Live feed** — streams the latest recipes from 97 blogs simultaneously, rendering cards as each feed loads
- **Filters** — narrow by cuisine, protein, cook time, cooking method, meal type, and dietary preference; filter clicks search the full archive via Serper.dev
- **Archive search** — search the full history of all blogs (not just recent posts) using the search bar
- **Ingredient search** — toggle ingredient mode to describe what's in your fridge; Claude AI converts your list into a smart search query
- **Recipe drawer** — click any card to see ingredients, instructions, cook times, and servings pulled directly from the recipe page
- **Saved** — bookmark recipes to a dedicated Saved tab (stored in your browser, private to you)
- **Search history** — recent searches appear as chips below the search bar for one-tap re-use
- **Filter persistence** — active filters are remembered across page reloads
- **Refresh feed** — load newer posts without a full page reload; shows when the feed was last updated
- **Share** — share any recipe via the native share sheet on mobile or copy-to-clipboard on desktop
- **Roundup filtering** — automatically hides listicles, meal plans, gear reviews, and lifestyle posts so you only see actual recipes
- **PWA** — installable on iOS and Android via "Add to Home Screen"

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
| The Mediterranean Dish | Dishing Out Health |
| The Food Charlatan | Foxes Love Lemons |
| RecipeTin Eats | How Sweet Eats |
| A Couple Cooks | Love and Lemons |
| Cooking Classy | Tastes Better From Scratch |
| The Stay At Home Chef | Dinner at the Zoo |
| Kevin Is Cooking | Little Spice Jar |
| Creme de la Crumb | Fifteen Spatulas |
| Downshiftology | The Defined Dish |
| Sam the Cooking Guy | Justine Snacks |
| Alexandra Cooks | Averie Cooks |
| Inspired Taste | Sweet Peas and Saffron |
| The Kitchn | |

### Asian
| Blog | Cuisine Focus |
|------|--------------|
| The Woks of Life | Chinese |
| Omnivore's Cookbook | Chinese |
| Just One Cookbook | Japanese |
| Pickled Plum | Japanese / Asian fusion |
| Maangchi | Korean |
| My Korean Kitchen | Korean |
| Hot Thai Kitchen | Thai |
| Rasa Malaysia | Malaysian / Southeast Asian |

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
| Dimitra's Dishes |

### Mexican / Latin
| Blog |
|------|
| Mexico in My Kitchen |
| Laylita's Recipes |
| Isabel Eats |

### Middle Eastern
| Blog | Focus |
|------|-------|
| Give Recipe | Turkish |
| Ozlem's Turkish Table | Turkish |
| Tori Avey | Israeli / Jewish |
| Feel Good Foodie | Lebanese / Arabic |
| Zaatar and Zaytoun | Palestinian |

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

### Baking
| Blog |
|------|
| Sally's Baking Addiction |
| Handle the Heat |
| Beyond Frosting |
| The Vanilla Bean Blog |
| Joy the Baker |

### Plant-forward / Seasonal
| Blog |
|------|
| The First Mess |
| Naturally Ella |

### Comfort Food / Sourdough
| Blog |
|------|
| Everyday Homemade |

### Italian
| Blog |
|------|
| An Italian in my Kitchen |
| Memorie di Angelina |
| Italian Food Forever |

### Eastern European
| Blog |
|------|
| Valentina's Corner |
| Eating European |

### Nordic / Scandinavian
| Blog |
|------|
| Nordic Kitchen Stories |

### Drinks / Cocktails
| Blog |
|------|
| Punch |
| Cocktail Contessa |
| Alcademics |

### French / European
| Blog |
|------|
| David Lebovitz |

### BBQ / Southern
| Blog |
|------|
| Hey Grill Hey |
| Sam the Cooking Guy |

## Filters

Clicking any filter chip searches the full blog archive via Serper.dev.

| Category | Options |
|----------|---------|
| **Meal** | Breakfast, Lunch, Dinner, Dessert, Snack/Side, Drinks |
| **Cuisine** | African, American, Caribbean, Chinese, Eastern European, Filipino, Indian, Italian, Japanese, Korean, Mediterranean, Mexican, Middle Eastern, Thai, Vietnamese |
| **Protein** | Beef, Chicken, Lamb, Other, Pork, Seafood, Vegetarian |
| **Time** | Quick (≤30m), ~1 Hour, 2+ Hours |
| **Method** | Air Fryer, Baked, Grilled, Instant Pot, No-Cook, Slow Cooker |
| **Dietary** | Dairy-Free, Gluten-Free, Keto, Paleo, Vegan, Vegetarian |

Multiple filters can be selected at once (OR logic within each category).

## Tech stack

- **Backend** — Node.js / Express
- **RSS parsing** — `rss-parser` with `media:content`, `media:thumbnail`, `content:encoded` support
- **Recipe extraction** — JSON-LD Schema.org parsing via `cheerio`; fallbacks for WP Recipe Maker, Tasty Recipes, Mediavine Create
- **Search** — Serper.dev (Google results, 2,500 free queries/month)
- **Ingredient AI** — Claude Haiku converts fridge-contents descriptions into optimised search queries
- **Streaming** — Server-Sent Events so recipes appear as each feed loads
- **Caching** — in-memory feed cache (1 hour TTL) so repeat page loads are instant
- **Frontend** — vanilla JS, no framework
- **Saved** — bookmarked recipes stored in `localStorage` (browser-local, private per device)
- **PWA** — `manifest.json` + PNG icons (192×192, 512×512) + service worker with auto-versioned cache; installable on iOS/Android via Add to Home Screen

## Setup

### Prerequisites
- Node.js 18+
- A [Serper.dev](https://serper.dev) account (free tier: 2,500 searches/month)
- An [Anthropic](https://console.anthropic.com) API key (for ingredient search)

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
ANTHROPIC_API_KEY=your_anthropic_api_key_here
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

### Render (recommended)

1. Push to GitHub
2. Go to [render.com](https://render.com) → New Web Service → connect repo
3. Start command: `node server.js`
4. Add `SERPER_API_KEY` and `ANTHROPIC_API_KEY` in the Environment tab
5. Click Save Changes — Render will deploy automatically on every push

### Railway

1. Push to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub repo
3. Select your repo
4. Add `SERPER_API_KEY` and `ANTHROPIC_API_KEY` in the Variables tab
5. Click Generate Domain in the Settings tab

## License

MIT
