# Mise en Scroll

A recipe reader for 123 food blogs. It pulls each blog's newest posts into one feed, and searches their full back catalogs too. Four of the sites have no RSS feed, so they only show up in search.

![node](https://img.shields.io/badge/node-%3E%3D18-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue)

## What it does

- Streams the latest recipes from 119 blogs at once and draws each card as its feed arrives.
- Filters by meal, cuisine, protein, time, method and diet. Filters apply to the live feed right away and to every blog's archive as you scroll.
- Searches every blog's whole history from the search bar, not just recent posts.
- Searches by ingredient. Switch to ingredient mode, list what's in your fridge, and it finds recipes whose ingredient lists contain all of it.
- Opens any card in a drawer with the ingredients, steps, times and servings read from the recipe page.
- Saves recipes, plans a week of meals and builds a shopping list grouped by grocery aisle. Everything is stored in your browser.
- Hides roundups, meal plans, gear reviews and shopping posts so the feed is mostly actual recipes.
- Installs on a phone from the browser's "Add to Home Screen".

## Blogs

There are 123 blogs, listed in `blogs.js`, which is the source of truth for everything below. I dropped some that went quiet for good, had a permanently broken feed, or blocked even image fetches: Ambitious Kitchen, Roti n Rice, The First Mess, Memorie di Angelina, Maangchi, Laylita's Recipes, Brian Lagerstrom, Swasthi's Recipes, Pinch of Yum, Oh She Glows and a few others.

### General / American
| Blog | Blog |
|------|------|
| Half Baked Harvest | Budget Bytes |
| Smitten Kitchen | Minimalist Baker |
| Damn Delicious | Cookie and Kate |
| Skinnytaste | Cafe Delites |
| Once Upon a Chef | Well Plated |
| The Recipe Critic | Natasha's Kitchen |
| Spend With Pennies | The Chunky Chef |
| Gimme Some Oven | Two Peas & Their Pod |
| The Cozy Cook | Jo Cooks |
| Feasting at Home | Plays Well With Butter |
| Wholesome Yum | Carlsbad Cravings |
| The Mediterranean Dish | Dishing Out Health |
| The Food Charlatan | Foxes Love Lemons |
| Alexandra Cooks | Averie Cooks |
| Inspired Taste | Sweet Peas and Saffron |
| RecipeTin Eats | How Sweet Eats |
| A Couple Cooks | Love and Lemons |
| Cooking Classy | Tastes Better From Scratch |
| The Stay At Home Chef | Dinner at the Zoo |
| Kevin Is Cooking | Little Spice Jar |
| Creme de la Crumb | Downshiftology |
| The Defined Dish | Justine Snacks |
| I Am A Food Blog | Culinary Hill |
| Salt & Lavender | Chili Pepper Madness |
| Foolproof Living | Ian Fujimoto |
| What To Cook |  |

### Asian
| Blog | Cuisine Focus |
|------|--------------|
| The Woks of Life | Chinese |
| Omnivore's Cookbook | Chinese |
| Just One Cookbook | Japanese |
| Pickled Plum | Japanese / Asian fusion |
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
| Isabel Eats |
| Mexican Please |
| Mexican Food Journal |
| My Colombian Recipes |
| Easy and Delish |
| Spain on a Fork |

### Middle Eastern
| Blog | Focus |
|------|-------|
| Give Recipe | Turkish |
| Ozlem's Turkish Table | Turkish |
| Zaatar and Zaytoun | Palestinian |

### African / Caribbean
| Blog |
|------|
| Immaculate Bites |
| Chef Lola's Kitchen |
| Caribbean Pot |
| Cooking with Ria |

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
| Terrence Bakes |

### Comfort Food
| Blog |
|------|
| Everyday Homemade |

### Italian
| Blog |
|------|
| An Italian in my Kitchen |
| Italian Food Forever |

### Eastern European
| Blog |
|------|
| Valentina's Corner |
| Eating European |

### Drinks / Cocktails
| Blog |
|------|
| Cocktail Contessa |
| Jeffrey Morgenthaler |

### French / European
| Blog |
|------|
| David Lebovitz |

### BBQ / Southern
| Blog |
|------|
| Hey Grill Hey |

### Vegan
| Blog |
|------|
| Vegan Richa |
| Rainbow Plant Life |

### Chef / Personality Sites
| Blog |
|------|
| Chef Jean-Pierre |
| Chef Billy Parisi |
| Jessica Gavin |
| Sip and Feast |
| Preppy Kitchen |
| Alison Roman |
| Tiffy Cooks |
| Marion's Kitchen |
| Bigger Bolder Baking |
| The Modern Nonna |
| Emmymade |
| Kitchen Nostalgia |
| Sweet Potato Soul |
| Lazy Cat Kitchen |
| Sugar Spun Run |
| Cafe Hailee |
| Mind Over Munch |
| Erren's Kitchen |
| Fit Foodie Finds |
| Eating Bird Food |
| Dessert for Two |

### Search-only (no RSS feed; archive search and filters only)
| Blog |
|------|
| Jamie Oliver |
| Sam the Cooking Guy |
| Hungry Girl |
| Made With Lau |

### Bread / Sourdough
| Blog |
|------|
| The Perfect Loaf |

## Filters

Filters narrow the live feed instantly and also search the archive. In the archive they match on title, excerpt and categories. About 8% of archived posts come from blogs that block or don't offer WordPress's REST API, and those only have a title to match. Filters combine with typed words and the blog picker. Choices within a group are OR, and groups are AND.

| Group | Options |
|-------|---------|
| Meal | Breakfast, Lunch, Dinner, Dessert, Snack/Side, Drinks |
| Cuisine | African, American, British & Irish, Caribbean, Chinese, Eastern European, Filipino, French, Indian, Italian, Japanese, Korean, Latin American, Mediterranean, Mexican, Middle Eastern, SE Asian, Spanish, Thai, Vietnamese |
| Protein | Beef, Chicken, Lamb, Other, Pork, Seafood, Vegetarian |
| Time | Quick (30 min or less), ~1 Hour, 2+ Hours |
| Method | Air Fryer, Baked, Grilled, Instant Pot, No-Cook, Slow Cooker |
| Diet | Dairy-Free, Gluten-Free, Keto, Paleo, Vegan, Vegetarian |

## How it's built

The server is Node and Express and the frontend is plain JavaScript with no framework.

- The live feed comes from each blog's RSS, parsed with `rss-parser`, and reaches the browser as server-sent events. Feeds are cached in memory for an hour.
- Recipe cards are read from the page's JSON-LD, with fallbacks for WP Recipe Maker, Tasty Recipes and Mediavine Create, and a heading-based reader for pages with neither.
- The archive is SQLite on Turso (`@libsql/client`) with FTS5 search. `crawl-archive.js` gets every URL from each blog's sitemap, then fills in titles, excerpts, categories and dates from the WordPress REST API. A GitHub Action runs it every Monday.
- Ingredient search uses a second index of ingredient lists, read from the recipe card in the REST response, or from the page for sites without one. Claude Haiku 5.5 turns what you type into ingredient names. Serper web search tops up the results when very few recipes match.
- Calories and macros come from CalorieNinjas when a blog doesn't publish nutrition.
- It works as a PWA, with a manifest, icons and a service worker.

## Setup

You need Node 18 or newer, plus API keys for [Serper](https://serper.dev), [Anthropic](https://console.anthropic.com) and [CalorieNinjas](https://calorieninjas.com/api), and a [Turso](https://turso.tech) database for the archive.

```bash
git clone https://github.com/benjamin-cooper/mise-en-scroll.git
cd mise-en-scroll
npm install
```

Create a `.env` file in the project root:

```
SERPER_API_KEY=
ANTHROPIC_API_KEY=
CALORIENINJAS_API_KEY=
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
```

Then start it:

```bash
npm run dev    # restarts on file changes
npm start      # production
```

and open [http://localhost:3000](http://localhost:3000). To fill the archive, run `node crawl-archive.js`, then `node crawl-archive.js --ingredients` for the ingredient lists.

## Deploying

I run it on Render with the start command `node server.js` and the keys above set as environment variables. Railway works the same way.

## License

MIT
