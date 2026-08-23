// Master list of food blogs this app aggregates. Extracted from server.js
// so both the live server and the standalone archive crawler (crawl-archive.js)
// can share the same source of truth without server.js's Express app booting.
const BLOGS = [
  // --- General / American ---
  { name: 'Half Baked Harvest',    feed: 'https://www.halfbakedharvest.com/feed/',        color: '#b8620a' },
  { name: 'The Modern Proper',     feed: 'https://themodernproper.com/feed',               color: '#5c7a4e' },
  { name: 'Budget Bytes',          feed: 'https://www.budgetbytes.com/feed/',               color: '#c0392b' },
  { name: 'Pinch of Yum',          feed: 'https://pinchofyum.com/feed',                    color: '#7b5ea7' },
  { name: 'Smitten Kitchen',       feed: 'https://smittenkitchen.com/feed/',                color: '#2471a3' },
  { name: 'Minimalist Baker',      feed: 'https://minimalistbaker.com/feed/',               color: '#c0803e' },
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
  // --- Vietnamese ---
  // --- SE Asian ---
  { name: 'Roti n Rice',           feed: 'https://rotinrice.com/feed/',                    color: '#c07840' },
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
  { name: "Laylita's Recipes",     feed: 'https://laylita.com/recipes/feed/',               color: '#e67e22' },
  { name: 'Isabel Eats',           feed: 'https://www.isabeleats.com/feed/',                color: '#c75b2e' },
  { name: 'Mexican Please',        feed: 'https://www.mexicanplease.com/feed',              color: '#c0392b' },
  { name: 'Mexican Food Journal',  feed: 'https://mexicanfoodjournal.com/feed',             color: '#27ae60' },
  { name: 'My Colombian Recipes',  feed: 'https://www.mycolombianrecipes.com/feed/',        color: '#f4c430' },
  { name: 'Easy and Delish',       feed: 'https://www.easyanddelish.com/feed',              color: '#16a085' },
  { name: 'Spanish Sabores',       feed: 'https://www.spanishsabores.com/feed',             color: '#d35400' },
  { name: 'Spain on a Fork',       feed: 'https://spainonafork.com/feed',                   color: '#e67e22' },
  // --- Middle Eastern ---
  { name: 'Give Recipe',           feed: 'https://giverecipe.com/feed/',                    color: '#c0392b' },
  { name: "Ozlem's Turkish Table", feed: 'https://ozlemsturkishtable.com/feed/',             color: '#e67e22' },
  { name: 'Tori Avey',             feed: 'https://toriavey.com/feed/',                      color: '#8e44ad' },
  { name: 'Feel Good Foodie',      feed: 'https://feelgoodfoodie.net/feed/',                color: '#27ae60' },
  { name: 'Zaatar and Zaytoun',    feed: 'https://zaatarandzaytoun.com/feed/',              color: '#2ecc71' },
  // --- African / Caribbean ---
  { name: 'Immaculate Bites',      feed: 'https://www.africanbites.com/feed/',              color: '#c0392b' },
  { name: "Chef Lola's Kitchen",   feed: 'https://cheflolaskitchen.com/feed/',              color: '#e74c3c' },
  { name: 'Caribbean Pot',         feed: 'https://caribbeanpot.com/feed',                   color: '#f39c12' },
  { name: 'Cooking with Ria',      feed: 'https://www.cookingwithria.com/feed',             color: '#1abc9c' },
  { name: 'Simply Trini Cooking',  feed: 'https://www.simplytrinicooking.com/feed',         color: '#e74c3c' },
  // --- Filipino ---
  { name: 'Panlasang Pinoy',       feed: 'https://panlasangpinoy.com/feed/',                color: '#2471a3' },
  { name: 'Kawaling Pinoy',        feed: 'https://www.kawalingpinoy.com/feed/',             color: '#1abc9c' },
  // --- French / European ---
  { name: 'David Lebovitz',        feed: 'https://www.davidlebovitz.com/feed/',             color: '#2c3e50' },
  // --- BBQ / Southern ---
  { name: 'Hey Grill Hey',         feed: 'https://heygrillhey.com/feed/',                   color: '#c0392b' },
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
  { name: 'Cocktail Contessa',     feed: 'https://www.cocktailcontessa.com/feed/',          color: '#186F85' },
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
  // --- Bread / Sourdough ---
  { name: 'The Perfect Loaf',    feed: 'https://www.theperfectloaf.com/feed/',         color: '#c8a050' },
  // --- Vegan ---
  { name: 'Oh She Glows',        feed: 'https://ohsheglows.com/feed/',                 color: '#7ab648' },
  { name: 'Vegan Richa',         feed: 'https://www.veganricha.com/feed/',             color: '#c0392b' },
  // --- Creative / Personal ---
  { name: 'Molly Yeh',           feed: 'https://www.mynameisyeh.com/blog?format=rss',  color: '#e8b84b' },
  { name: 'Cloudy Kitchen',      feed: 'https://cloudykitchen.com/feed/',              color: '#6c8ebf' },
  // --- Asian fusion ---
  { name: 'Christie at Home',    feed: 'https://christieathome.com/feed/',             color: '#e05a2b' },
  // --- World cuisines ---
  { name: '196 Flavors',         feed: 'https://www.196flavors.com/feed/',             color: '#2e7d32' },
  // --- Cocktails ---
  { name: 'Jeffrey Morgenthaler',feed: 'https://jeffreymorgenthaler.com/feed/',        color: '#1a237e' },
  // --- Flavor / Indian-American ---
  { name: 'Nik Sharma',          feed: 'https://nicksharma.substack.com/feed',         color: '#5d4037' },
];

module.exports = { BLOGS };
