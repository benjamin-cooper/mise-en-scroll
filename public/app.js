// Cuisine, protein, and time keyword definitions
const FILTERS = {
  cuisine: [
    { label: 'Italian',       icon: '🍝', keywords: ['pasta', 'pizza', 'lasagna', 'risotto', 'gnocchi', 'carbonara', 'parmesan', 'pesto', 'linguine', 'fettuccine', 'italian', 'bolognese', 'tiramisu', 'ravioli', 'cannelloni', 'arrabbiata', 'bruschetta', 'focaccia', 'calzone', 'cacio e pepe', 'amatriciana'] },
    { label: 'Mexican',       icon: '🌮', keywords: ['taco', 'burrito', 'enchilada', 'quesadilla', 'salsa', 'guacamole', 'carnitas', 'fajita', 'tortilla', 'mexican', 'tamale', 'elote', 'pozole', 'mole', 'ceviche', 'chipotle', 'birria', 'chile verde', 'chiles rellenos'] },
    { label: 'Chinese',       icon: '🥟', keywords: ['chinese', 'stir fry', 'stir-fry', 'wok', 'dim sum', 'kung pao', 'mapo', 'fried rice', 'dumpling', 'wonton', 'szechuan', 'sichuan', 'cantonese', 'char siu', 'lo mein', 'chow mein', 'hot pot', 'bok choy', 'hoisin', 'five spice'] },
    { label: 'Japanese',      icon: '🍱', keywords: ['japanese', 'ramen', 'sushi', 'miso', 'teriyaki', 'tempura', 'udon', 'soba', 'tonkatsu', 'katsu', 'donburi', 'onigiri', 'yakitori', 'gyoza', 'okonomiyaki', 'dashi', 'matcha', 'sake', 'rice bowl'] },
    { label: 'Korean',        icon: '🥘', keywords: ['korean', 'bibimbap', 'bulgogi', 'kimchi', 'gochujang', 'japchae', 'banchan', 'galbi', 'dakgalbi', 'sundubu', 'doenjang', 'pajeon', 'tteok', 'doenjang jjigae', 'army stew'] },
    { label: 'Thai',          icon: '🌿', keywords: ['thai', 'pad thai', 'green curry', 'red curry', 'massaman', 'larb', 'tom yum', 'som tum', 'satay', 'pad see ew', 'khao', 'nam prik', 'yellow curry'] },
    { label: 'Vietnamese',    icon: '🍲', keywords: ['vietnamese', 'pho', 'banh mi', 'banh', 'bun bo', 'spring roll', 'fresh roll', 'bo kho', 'com tam', 'canh chua', 'bun thit', 'chả giò'] },
    { label: 'Mediterranean', icon: '🫒', keywords: ['greek', 'mediterranean', 'shakshuka', 'gyro', 'tzatziki', 'spanakopita', 'moussaka', 'turkish', 'pide', 'borek', 'meze', 'dolma', 'lahmacun', 'baklava', 'couscous', 'moroccan', 'harissa', 'chermoula', 'tagine'] },
    { label: 'Middle Eastern', icon: '🧆', keywords: ['middle eastern', 'lebanese', 'arabic', 'persian', 'iranian', 'israeli', 'jewish', 'falafel', 'hummus', 'shawarma', 'pita', 'tahini', 'za\'atar', 'sumac', 'tabbouleh', 'baba ganoush', 'fattoush', 'kibbeh', 'kabsa', 'mujaddara', 'musakhan', 'ghormeh', 'fesenjan', 'kebab'] },
    { label: 'Indian',        icon: '🍛', keywords: ['curry', 'tikka', 'masala', 'dal', 'naan', 'biryani', 'saag', 'paneer', 'tandoori', 'chutney', 'samosa', 'korma', 'vindaloo', 'palak', 'aloo', 'indian', 'chana', 'raita', 'dosa'] },
    { label: 'Filipino',      icon: '🍚', keywords: ['filipino', 'adobo', 'sinigang', 'kare-kare', 'lechon', 'pancit', 'lumpia', 'sisig', 'tinola', 'pinakbet', 'pinoy', 'kaldereta', 'mechado', 'menudo', 'afritada'] },
    { label: 'African',       icon: '🌍', keywords: ['nigerian', 'ethiopian', 'jollof', 'egusi', 'suya', 'injera', 'berbere', 'peri peri', 'piri piri', 'west african', 'ghanaian', 'senegalese', 'akara', 'moi moi', 'ogbono', 'pepper soup', 'ofe'] },
    { label: 'American',      icon: '🍔', keywords: ['burger', 'bbq', 'mac and cheese', 'meatloaf', 'pot roast', 'biscuit', 'cornbread', 'chili', 'wings', 'ribs', 'coleslaw', 'pulled pork', 'sloppy', 'casserole', 'ranch', 'buffalo', 'mashed potato', 'gravy'] },
    { label: 'Caribbean',       icon: '🌴', keywords: ['caribbean', 'jamaican', 'trinidadian', 'haitian', 'cuban', 'puerto rican', 'jerk', 'plantain', 'rice and peas', 'callaloo', 'roti', 'curry goat', 'oxtail', 'ackee', 'saltfish', 'doubles'] },
    { label: 'Eastern European', icon: '🥣', keywords: ['polish', 'czech', 'hungarian', 'ukrainian', 'romanian', 'russian', 'serbian', 'eastern european', 'pierogi', 'borscht', 'schnitzel', 'goulash', 'kielbasa', 'sauerkraut', 'stroganoff', 'cabbage roll', 'perogies'] },
  ],
  protein: [
    { label: 'Chicken',    icon: '🍗', keywords: ['chicken', 'poultry'] },
    { label: 'Beef',       icon: '🥩', keywords: ['beef', 'steak', 'brisket', 'burger', 'meatball', 'ground beef', 'pot roast', 'short rib', 'flank', 'chuck', 'sirloin', 'ribeye', 'prime rib'] },
    { label: 'Pork',       icon: '🥓', keywords: ['pork', 'bacon', 'ham', 'prosciutto', 'pancetta', 'sausage', 'carnitas', 'ribs', 'tenderloin', 'chorizo'] },
    { label: 'Seafood',    icon: '🐟', keywords: ['salmon', 'shrimp', 'fish', 'tuna', 'cod', 'halibut', 'crab', 'lobster', 'scallop', 'seafood', 'tilapia', 'mahi', 'clam', 'mussel', 'oyster', 'trout', 'bass', 'snapper', 'anchovy'] },
    { label: 'Lamb',       icon: '🍖', keywords: ['lamb', 'mutton', 'rack of lamb', 'leg of lamb'] },
    { label: 'Vegetarian', icon: '🥦', keywords: ['vegetarian', 'vegan', 'tofu', 'lentil', 'chickpea', 'tempeh', 'mushroom', 'cauliflower', 'eggplant', 'veggie', 'plant-based', 'meatless', 'butternut', 'squash', 'zucchini'] },
    { label: 'Other',      icon: '🍳', keywords: ['egg', 'eggs', 'turkey', 'duck', 'venison', 'bison', 'rabbit', 'quail', 'goat', 'offal', 'liver', 'oxtail', 'bone broth', 'bone-in'] },
  ],
  time: [
    { label: 'Quick (≤30m)', icon: '⚡', keywords: ['quick', '15 minute', '15-minute', '20 minute', '20-minute', '30 minute', '30-minute', 'weeknight', 'speedy', 'fast ', 'in a hurry', 'easy weeknight'] },
    { label: '~1 Hour',      icon: '🕐', keywords: ['45 minute', '45-minute', 'one hour', 'one-hour', '60 minute', 'sheet pan', 'sheet-pan', 'one pan', 'one-pan', 'one pot', 'one-pot', 'skillet'] },
    { label: '2+ Hours',     icon: '⏳', keywords: ['2 hour', '2-hour', '3 hour', '3-hour', 'overnight', 'all day', 'sunday roast', 'all-day', 'long braise', 'low and slow', 'oven braised'] },
  ],
  method: [
    { label: 'Air Fryer',   icon: '💨', keywords: ['air fryer', 'air-fryer', 'air fry', 'air fried'] },
    { label: 'Baked',       icon: '🫓', keywords: ['baked', 'bake', 'roasted', 'oven-baked', 'sheet pan', 'sheet-pan'] },
    { label: 'Grilled',     icon: '🔥', keywords: ['grilled', 'grill', 'grilling', 'bbq', 'barbecue', 'charred', 'smoked'] },
    { label: 'Instant Pot', icon: '⚡', keywords: ['instant pot', 'pressure cooker', 'pressure cook', 'instant-pot'] },
    { label: 'No-Cook',     icon: '🥗', keywords: ['no-cook', 'no cook', 'no-bake', 'no bake', 'raw', 'refrigerator', 'icebox'] },
    { label: 'Slow Cooker', icon: '🫕', keywords: ['slow cooker', 'crockpot', 'crock pot', 'crock-pot', 'slow-cooked', 'slow cook', 'braised', 'low and slow'] },
  ],
  meal: [
    { label: 'Breakfast',  icon: '🥞', keywords: ['breakfast', 'pancake', 'waffle', 'french toast', 'omelette', 'omelet', 'frittata', 'granola', 'muffin', 'scone', 'brunch', 'benedict', 'overnight oats', 'smoothie bowl', 'morning'] },
    { label: 'Lunch',      icon: '🥗', keywords: ['sandwich', 'wrap', 'grain bowl', 'lunch', 'salad', 'soup'] },
    { label: 'Dinner',     icon: '🍽️', keywords: ['dinner', 'supper', 'weeknight', 'roast', 'entrée', 'entree', 'main course', 'main dish'] },
    { label: 'Dessert',    icon: '🍰', keywords: ['cake', 'cookie', 'brownie', 'dessert', 'pie', 'tart', 'ice cream', 'pudding', 'cheesecake', 'cupcake', 'frosting', 'fudge', 'mousse', 'tiramisu', 'gelato', 'sorbet', 'crisp', 'cobbler', 'biscotti', 'macaron', 'donut', 'doughnut', 'pastry', 'éclair', 'custard', 'creme brulee', 'biscuit'] },
    { label: 'Snack/Side', icon: '🥨', keywords: ['snack', 'appetizer', 'side dish', 'dip', 'starter', 'finger food', 'small plate', 'nibble', 'chips', 'hummus', 'salsa', 'guacamole', 'bruschetta', 'crostini'] },
    { label: 'Drinks',    icon: '🥤', keywords: ['cocktail', 'mocktail', 'smoothie', 'juice', 'lemonade', 'iced tea', 'drink', 'beverage', 'shake', 'margarita', 'sangria', 'punch', 'spritz', 'agua fresca', 'latte', 'cold brew', 'shrub', 'syrup'] },
  ],
  dietary: [
    { label: 'Vegan',       icon: '🌱', keywords: ['vegan', 'plant-based', 'plant based', 'dairy-free egg-free'] },
    { label: 'Vegetarian',  icon: '🥦', keywords: ['vegetarian', 'meatless', 'no meat', 'veggie'] },
    { label: 'Gluten-Free', icon: '🌾', keywords: ['gluten-free', 'gluten free', 'gf recipe', 'celiac', 'coeliac'] },
    { label: 'Dairy-Free',  icon: '🥛', keywords: ['dairy-free', 'dairy free', 'non-dairy', 'lactose-free', 'lactose free'] },
    { label: 'Keto',        icon: '🥑', keywords: ['keto', 'ketogenic', 'low-carb', 'low carb', 'keto-friendly'] },
    { label: 'Paleo',       icon: '🍖', keywords: ['paleo', 'primal', 'whole30', 'grain-free', 'grain free'] },
  ],
};

// Mirrors server BLOGS (name + color only, for filter pills)
let BLOGS = [];

const state = {
  view: 'discover',
  recipes: [],
  favorites: [],
  filter: null,          // blog filter
  searchQuery: '',
  cuisineFilters: [],
  proteinFilters: [],
  timeFilters: [],
  mealFilters: [],
  dietaryFilters: [],
  methodFilters: [],
  selected: null,        // { url, preview }
  detail: null,          // full recipe from /api/recipe
  detailLoading: false,
  detailError: null,
  loading: true,
  openFilterDropdown: null, // mobile filter panel: 'cuisine' | 'protein' | 'time' | 'meal' | null
  // Search API state
  searchMode: false,   // true when using Google API results
  searchResults: [],
  searchTotal: 0,
  searchLoading: false,
  searchNextStart: null,
  searchError: null,
  ingredientMode: false, // true when searching by ingredients
  blogPickerOpen: false,
  feedLastLoaded: null,
  feedRefreshing: false,
  streamingMore: false,   // true while SSE stream is active after first batch
  discoverRenderLimit: 60, // virtualized card window
  recentSearches: [],
  // Drawer servings scaler
  scaleFactor: 1,
  // Meal planner
  mealPlan: {},           // { 'Monday': { Breakfast: recipe|null, Lunch: recipe|null, Dinner: recipe|null } }
  mealPlanPickerOpen: false,
  mealPlanPickDay: null,  // day currently chosen in the in-drawer picker
};

// --- API ---
const api = {
  blogs:     ()         => fetch('/api/blogs').then(r => r.json()),
  recipesStream: (onBatch, fresh = false) => new Promise((resolve) => {
    const es = new EventSource(`/api/recipes/stream${fresh ? '?fresh=1' : ''}`);
    es.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === 'batch') onBatch(msg.recipes);
      if (msg.type === 'done') { es.close(); resolve(); }
    };
    es.onerror = () => { es.close(); resolve(); };
  }),
  recipe:           (url)               => fetch(`/api/recipe?url=${encodeURIComponent(url)}`).then(r => r.json()),
  search:           (q, page)           => fetch(`/api/search?q=${encodeURIComponent(q)}&page=${page || 1}`).then(r => r.json()),
  ingredientSearch: (ingredients, page) => fetch(`/api/ingredient-search?ingredients=${encodeURIComponent(ingredients)}&page=${page || 1}`).then(r => r.json()),
};

// --- Theme (localStorage) ---
const THEME_KEY = 'mise-en-scroll-theme';
function loadThemePref() {
  try { return localStorage.getItem(THEME_KEY); } catch { return null; }
}
function applyThemePref(pref) {
  if (pref === 'dark')  document.documentElement.setAttribute('data-theme', 'dark');
  else if (pref === 'light') document.documentElement.setAttribute('data-theme', 'light');
  else document.documentElement.removeAttribute('data-theme');
}
function isDark() {
  const pref = loadThemePref();
  if (pref === 'dark')  return true;
  if (pref === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// --- Favorites (localStorage) ---
const FAV_KEY = 'mise-en-scroll-favs';
function loadFavs() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); } catch { return []; }
}
function saveFav(data) {
  const favs = loadFavs();
  if (!favs.find(f => f.url === data.url)) favs.unshift(data);
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
}
function removeFav(url) {
  localStorage.setItem(FAV_KEY, JSON.stringify(loadFavs().filter(f => f.url !== url)));
}
let _favSet = new Set();
function isFav(url) { return _favSet.has(url); }
function refreshFavorites() {
  state.favorites = loadFavs();
  _favSet = new Set(state.favorites.map(f => f.url));
}

// --- Filter persistence (localStorage) ---
const FILTERS_KEY = 'mise-en-scroll-filters';
function saveFilters() {
  clearTimeout(_saveFiltersTimer);
  _saveFiltersTimer = setTimeout(() => {
    try {
      localStorage.setItem(FILTERS_KEY, JSON.stringify({
        cuisine: state.cuisineFilters, protein: state.proteinFilters,
        time: state.timeFilters, meal: state.mealFilters, dietary: state.dietaryFilters,
        method: state.methodFilters,
      }));
    } catch {}
  }, 300);
}
function loadSavedFilters() {
  try { return JSON.parse(localStorage.getItem(FILTERS_KEY) || 'null'); } catch { return null; }
}

// --- Search history (localStorage) ---
const SEARCHES_KEY = 'mise-en-scroll-searches';
function saveSearchToHistory(q) {
  if (!q?.trim()) return;
  const updated = [q.trim(), ...state.recentSearches.filter(s => s !== q.trim())].slice(0, 5);
  state.recentSearches = updated;
  try { localStorage.setItem(SEARCHES_KEY, JSON.stringify(updated)); } catch {}
}
function loadSearchHistory() {
  try { return JSON.parse(localStorage.getItem(SEARCHES_KEY) || '[]'); } catch { return []; }
}

// --- Meal Planner (localStorage) ---
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const MEAL_SLOTS = ['Breakfast','Lunch','Dinner'];
const MEAL_PLAN_KEY = 'mise-en-scroll-meal-plan';
function loadMealPlan() {
  try { return JSON.parse(localStorage.getItem(MEAL_PLAN_KEY) || '{}'); } catch { return {}; }
}
function saveMealPlan() {
  try { localStorage.setItem(MEAL_PLAN_KEY, JSON.stringify(state.mealPlan)); } catch {}
}

// --- Ingredient scaling helpers ---
const UNICODE_FRACTIONS = { '½':0.5,'⅓':1/3,'⅔':2/3,'¼':0.25,'¾':0.75,'⅕':0.2,'⅖':0.4,'⅗':0.6,'⅘':0.8,'⅙':1/6,'⅚':5/6,'⅛':0.125,'⅜':0.375,'⅝':0.625,'⅞':0.875 };
const NICE_FRACS = [[3,4,'¾'],[2,3,'⅔'],[1,2,'½'],[1,3,'⅓'],[1,4,'¼']];
function toNiceFrac(n) {
  if (Number.isInteger(n)) return String(n);
  const w = Math.floor(n), f = n - w;
  for (const [num, den, sym] of NICE_FRACS) {
    if (Math.abs(f - num/den) < 0.04) return w > 0 ? `${w} ${sym}` : sym;
  }
  return String(Math.round(n * 100) / 100);
}
function scaleIngredient(text, factor) {
  if (factor === 1) return text;
  let t = text;
  for (const [f, v] of Object.entries(UNICODE_FRACTIONS)) t = t.replaceAll(f, v.toString());
  // Replace leading quantities: "1 1/2", "1/2", "3", "1.5" at word boundary
  return t.replace(/\b(\d+)\s+(\d+)\/(\d+)\b|\b(\d+)\/(\d+)\b|\b(\d*\.?\d+)\b/, (m, w, nf, df, n2, d2, dec) => {
    let val;
    if (w !== undefined)   val = parseInt(w) + parseInt(nf)/parseInt(df);
    else if (n2 !== undefined) val = parseInt(n2)/parseInt(d2);
    else val = parseFloat(dec);
    if (isNaN(val) || val === 0) return m;
    return toNiceFrac(val * factor);
  });
}

// --- Helpers ---
function formatDate(str)  { if (!str) return ''; return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
function formatTimeAgo(ts) {
  if (!ts) return '';
  const sec = Math.round((Date.now() - ts) / 1000);
  if (sec < 60) return 'just now';
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  return `${hr}h ago`;
}
function escHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function badge(name, color) {
  return `<span class="badge-blog" style="background:${color}18;color:${color};border-color:${color}44">${name}</span>`;
}
function timeChips(d) {
  const parts = [];
  if (d.prepTime)  parts.push(`<span>Prep: ${d.prepTime}</span>`);
  if (d.cookTime)  parts.push(`<span>Cook: ${d.cookTime}</span>`);
  if (d.totalTime) parts.push(`<span>Total: ${d.totalTime}</span>`);
  if (d.servings)  parts.push(`<span>Serves: ${d.servings}</span>`);
  return parts.length ? `<div class="time-chips">${parts.join('')}</div>` : '';
}

// --- Search query builder ---
function buildSearchQuery() {
  const parts = [];
  if (state.searchQuery.trim()) parts.push(state.searchQuery.trim());

  const filterMap = [
    { vals: state.cuisineFilters,  group: 'cuisine'  },
    { vals: state.proteinFilters,  group: 'protein'  },
    { vals: state.timeFilters,     group: 'time'     },
    { vals: state.mealFilters,     group: 'meal'     },
    { vals: state.dietaryFilters,  group: 'dietary'  },
    { vals: state.methodFilters,   group: 'method'   },
  ];
  for (const { vals, group } of filterMap) {
    for (const val of vals) {
      const f = FILTERS[group].find(f => f.label === val);
      if (f) parts.push(`(${f.keywords.join(' OR ')})`);
    }
  }
  if (!parts.some(p => p.includes('recipe'))) parts.push('recipe');
  return parts.join(' ');
}

let searchDebounceTimer = null;
let _saveFiltersTimer = null;
let _savedScrollY = 0;
let _prevDrawerOpen = false;
let _infiniteScrollObserver = null;
let _discoverScrollObserver = null;
// Hover-prefetch cache: url -> Promise<detail>
const _prefetchCache = new Map();
let _prefetchTimer = null;

// Sorted insertion streaming — each incoming batch is inserted into the grid at
// its correct date-sorted position rather than appending to the bottom or
// replacing the whole grid. Newest recipes always sort to the top; cards already
// on screen only shift if something newer than them arrives (and only those below
// the insertion point move). New cards fade in so the insertion feels smooth.
let _streamAppendedSet = new Set(); // URLs already in the DOM during streaming

function insertSortedStreamCards(batch) {
  if (state.searchMode || state.selected) return;
  const grid = document.querySelector('#discover-content .grid');
  if (!grid) return;
  if (_streamAppendedSet.size >= state.discoverRenderLimit) return;

  // Use the live DOM as the source of truth for what's already rendered.
  // _streamAppendedSet can fall out of sync when refreshDiscoverContent()
  // expands the virtual window (e.g. infinite scroll), inserting cards that
  // were never tracked by insertSortedStreamCards — leading to duplicates.
  const domUrls = new Set([...grid.querySelectorAll('.card[data-url]')].map(c => c.dataset.url));

  const toAdd = [...batch]
    .filter(r => !_streamAppendedSet.has(r.url) && !domUrls.has(r.url))
    .sort((a, b) => new Date(b.date) - new Date(a.date)) // newest first within batch
    .slice(0, state.discoverRenderLimit - _streamAppendedSet.size);
  if (!toAdd.length) return;

  // Snapshot card list once — avoids O(n²) querySelectorAll inside the loop.
  let cardList = [...grid.querySelectorAll('.card')];
  toAdd.forEach(recipe => {
    _streamAppendedSet.add(recipe.url);
    const recipeDate = new Date(recipe.date || 0);

    // Find the first existing card whose date is older — insert before it.
    let insertBefore = null;
    for (const card of cardList) {
      if (new Date(card.dataset.date || 0) < recipeDate) {
        insertBefore = card;
        break;
      }
    }

    if (insertBefore) {
      insertBefore.insertAdjacentHTML('beforebegin', renderCard(recipe));
      const inserted = insertBefore.previousElementSibling;
      inserted?.classList.add('card-entering');
      // Update snapshot: splice inserted card in before its reference
      const idx = cardList.indexOf(insertBefore);
      if (inserted) cardList.splice(idx, 0, inserted);
    } else {
      grid.insertAdjacentHTML('beforeend', renderCard(recipe));
      const inserted = grid.lastElementChild;
      inserted?.classList.add('card-entering');
      if (inserted) cardList.push(inserted);
    }
  });
}
async function triggerSearch(start = 1) {
  // In saved view, never hit the API — just re-render with local filtering
  if (state.view === 'favorites') { renderApp(); return; }

  // Ingredient mode — sends raw ingredient text to AI-powered endpoint
  if (state.ingredientMode) {
    const ingredients = state.searchQuery.trim();
    if (!ingredients) {
      state.searchMode = false;
      state.searchResults = [];
      renderApp();
      return;
    }
    if (start === 1) saveSearchToHistory(ingredients);
    state.searchMode = true;
    state.searchLoading = true;
    state.searchError = null;
    if (start === 1) state.searchResults = [];
    renderApp();
    try {
      const data = await api.ingredientSearch(ingredients, start);
      if (data.error) throw new Error(data.error);
      state.searchResults = start === 1 ? data.results : [...state.searchResults, ...data.results];
      state.searchTotal = data.totalResults;
      state.searchNextStart = data.nextStart;
    } catch (err) {
      console.error('Ingredient search failed:', err);
      state.searchError = err.message || 'Ingredient search failed. Please try again.';
    } finally {
      state.searchLoading = false;
      renderApp();
    }
    return;
  }

  // Keyword mode — standard Serper search
  const q = buildSearchQuery();
  if (!q.trim() || q.trim() === 'recipe') {
    state.searchMode = false;
    state.searchResults = [];
    renderApp();
    return;
  }

  if (start === 1 && state.searchQuery.trim()) saveSearchToHistory(state.searchQuery.trim());
  state.searchMode = true;
  state.searchLoading = true;
  state.searchError = null;
  if (start === 1) state.searchResults = [];
  renderApp();

  try {
    const data = await api.search(q, start);
    if (data.error) throw new Error(data.error);
    state.searchResults = start === 1 ? data.results : [...state.searchResults, ...data.results];
    state.searchTotal = data.totalResults;
    state.searchNextStart = data.nextStart;
  } catch (err) {
    console.error('Search failed:', err);
    state.searchError = err.message || 'Search failed. Please try again.';
  } finally {
    state.searchLoading = false;
    renderApp();
  }
}

// --- Filter logic ---
let _filterMemo = null;
function applyFilters(recipes) {
  const fp = [
    state.filter || '', state.searchQuery,
    state.cuisineFilters.join(), state.proteinFilters.join(),
    state.timeFilters.join(), state.mealFilters.join(),
    state.dietaryFilters.join(), state.methodFilters.join(),
  ].join('|');
  if (_filterMemo && _filterMemo.recipes === recipes && _filterMemo.fp === fp) return _filterMemo.result;
  const result = recipes.filter(r => {
    const full = r.searchText || (r.title + ' ' + r.excerpt).toLowerCase();

    if (state.filter && r.blog !== state.filter) return false;

    if (state.searchQuery.trim()) {
      if (!full.includes(state.searchQuery.trim().toLowerCase())) return false;
    }
    if (state.cuisineFilters.length) {
      const kws = state.cuisineFilters.flatMap(label => FILTERS.cuisine.find(f => f.label === label)?.keywords || []);
      if (!kws.some(kw => full.includes(kw))) return false;
    }
    if (state.proteinFilters.length) {
      const kws = state.proteinFilters.flatMap(label => FILTERS.protein.find(f => f.label === label)?.keywords || []);
      if (!kws.some(kw => full.includes(kw))) return false;
    }
    if (state.timeFilters.length) {
      if (r.cookTimeMinutes != null) {
        // Use actual cook time when the server extracted it from RSS JSON-LD
        const passes = state.timeFilters.some(label => {
          if (label === 'Quick (≤30m)') return r.cookTimeMinutes <= 30;
          if (label === '~1 Hour')      return r.cookTimeMinutes > 30 && r.cookTimeMinutes <= 75;
          if (label === '2+ Hours')     return r.cookTimeMinutes > 75;
          return false;
        });
        if (!passes) return false;
      } else {
        const kws = state.timeFilters.flatMap(label => FILTERS.time.find(f => f.label === label)?.keywords || []);
        if (!kws.some(kw => full.includes(kw))) return false;
      }
    }
    if (state.mealFilters.length) {
      const kws = state.mealFilters.flatMap(label => FILTERS.meal.find(f => f.label === label)?.keywords || []);
      if (!kws.some(kw => full.includes(kw))) return false;
    }
    if (state.dietaryFilters.length) {
      const kws = state.dietaryFilters.flatMap(label => FILTERS.dietary.find(f => f.label === label)?.keywords || []);
      if (!kws.some(kw => full.includes(kw))) return false;
    }
    if (state.methodFilters.length) {
      const kws = state.methodFilters.flatMap(label => FILTERS.method.find(f => f.label === label)?.keywords || []);
      if (!kws.some(kw => full.includes(kw))) return false;
    }
    return true;
  });
  _filterMemo = { recipes, fp, result };
  return result;
}

function hasActiveFilters() {
  return !!(state.searchQuery || state.cuisineFilters.length || state.proteinFilters.length || state.timeFilters.length || state.mealFilters.length || state.dietaryFilters.length || state.methodFilters.length || state.filter);
}

// --- Render ---
function renderApp() {
  const drawerNowOpen = !!state.selected;
  const drawerJustOpened = drawerNowOpen && !_prevDrawerOpen;

  if (drawerJustOpened) {
    _savedScrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
  } else if (!drawerNowOpen && _prevDrawerOpen) {
    document.body.style.overflow = '';
  } else if (!drawerNowOpen) {
    _savedScrollY = window.scrollY;
  }
  _prevDrawerOpen = drawerNowOpen;

  document.getElementById('app').innerHTML = `
    ${renderHeader()}
    ${state.view !== 'mealplan' ? renderSearchSection() : ''}
    <div class="grid-section">
      ${renderContent()}
    </div>
    ${renderDrawer()}
    <button class="back-to-top" id="back-to-top" data-action="back-to-top" aria-label="Back to top">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
    </button>
  `;

  if (!drawerNowOpen) {
    requestAnimationFrame(() => window.scrollTo(0, _savedScrollY));
  }
  if (drawerNowOpen) {
    setTimeout(() => {
      const drawer = document.getElementById('drawer');
      if (drawer && !drawer.contains(document.activeElement)) {
        document.querySelector('.drawer-close')?.focus();
      }
    }, 50);
  }

  setupInfiniteScroll();
}

function setupInfiniteScroll() {
  if (_infiniteScrollObserver) { _infiniteScrollObserver.disconnect(); _infiniteScrollObserver = null; }
  if (_discoverScrollObserver) { _discoverScrollObserver.disconnect(); _discoverScrollObserver = null; }

  const apiSentinel = document.getElementById('infinite-scroll-sentinel');
  if (apiSentinel) {
    _infiniteScrollObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && state.searchNextStart && !state.searchLoading) {
        triggerSearch(state.searchNextStart);
      }
    }, { rootMargin: '300px' });
    _infiniteScrollObserver.observe(apiSentinel);
  }

  const discoverSentinel = document.getElementById('discover-scroll-sentinel');
  if (discoverSentinel) {
    _discoverScrollObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        state.discoverRenderLimit += 30;
        refreshDiscoverContent();
      }
    }, { rootMargin: '400px' });
    _discoverScrollObserver.observe(discoverSentinel);
  }
}

function renderHeader() {
  return `
    <header class="header">
      <div class="container">
        <div class="header-logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
            <path d="M7 2v20"/>
            <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
          </svg>
          <span>Mise en Scroll</span>
        </div>
        <nav class="header-tabs">
          <button class="header-tab ${state.view === 'discover'  ? 'is-active' : ''}" data-action="tab" data-view="discover">Discover</button>
          <button class="header-tab ${state.view === 'favorites' ? 'is-active' : ''}" data-action="tab" data-view="favorites">
            Saved ${state.favorites.length ? `<span class="tab-count">${state.favorites.length}</span>` : ''}
          </button>
          <button class="header-tab ${state.view === 'mealplan' ? 'is-active' : ''}" data-action="tab" data-view="mealplan">
            Meal Plan
          </button>
        </nav>
        <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
          ${state.view === 'discover' && !state.loading && state.recipes.length ? `
            <button class="surprise-btn" data-action="surprise-me" title="Open a random recipe">
              🎲 <span>Surprise me</span>
            </button>
          ` : ''}
          <button class="theme-toggle" data-action="toggle-theme" aria-label="${isDark() ? 'Switch to light mode' : 'Switch to dark mode'}" title="${isDark() ? 'Switch to light mode' : 'Switch to dark mode'}">
            ${isDark()
              ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
              : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`
            }
          </button>
        </div>
      </div>
    </header>
  `;
}

function renderBlogPicker() {
  if (!BLOGS.length) return '';
  const active = state.filter;
  const activeBlog = active ? BLOGS.find(b => b.name === active) : null;
  const sorted = [...BLOGS].sort((a, b) => a.name.localeCompare(b.name));
  return `
    <div class="blog-picker-wrap">
      <button class="blog-picker-btn ${active ? 'is-active' : ''}"
              data-action="blog-picker-toggle"
              ${activeBlog ? `style="background:${activeBlog.color};border-color:${activeBlog.color};color:#fff"` : ''}>
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="opacity:.7"><path d="M4 6h16M4 12h10M4 18h6"/></svg>
        ${active ? escHtml(active) : 'All Blogs'}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="margin-left:2px;opacity:.6"><path d="M2 3.5l3 3 3-3"/></svg>
      </button>
      <div class="blog-picker-dropdown" id="blog-picker-dropdown" ${state.blogPickerOpen ? '' : 'hidden'}>
        <button class="blog-picker-item ${!active ? 'is-active' : ''}" data-action="filter" data-blog="">All Blogs</button>
        <div class="blog-picker-divider"></div>
        ${sorted.map(b => `
          <button class="blog-picker-item ${active === b.name ? 'is-active' : ''}"
                  data-action="filter" data-blog="${escHtml(b.name)}"
                  ${active === b.name ? `style="color:${b.color}"` : ''}>
            <span class="blog-picker-dot" style="background:${b.color}"></span>
            ${escHtml(b.name)}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function renderSearchSection() {
  const anyActive = state.cuisineFilters.length || state.proteinFilters.length || state.timeFilters.length || state.mealFilters.length || state.dietaryFilters.length;
  const chevron = `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 3.5l3 3 3-3"/></svg>`;

  const mobileCats = [
    { key: 'cuisine',  label: 'Cuisine',  filters: [...FILTERS.cuisine].sort((a, b) => a.label.localeCompare(b.label)), active: state.cuisineFilters },
    { key: 'meal',     label: 'Meal',     filters: FILTERS.meal,     active: state.mealFilters },
    { key: 'dietary',  label: 'Dietary',  filters: FILTERS.dietary,  active: state.dietaryFilters },
    { key: 'protein',  label: 'Protein',  filters: FILTERS.protein,  active: state.proteinFilters },
    { key: 'time',     label: 'Time',     filters: FILTERS.time,     active: state.timeFilters },
    { key: 'method',   label: 'Method',   filters: FILTERS.method,   active: state.methodFilters },
  ];
  const openCat = state.openFilterDropdown ? mobileCats.find(c => c.key === state.openFilterDropdown) : null;

  return `
    <div class="search-section">
      <div class="container">
        <div class="search-row">
          ${renderBlogPicker()}
          <div class="search-wrap">
            <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input class="search-input ${state.ingredientMode ? 'ingredient-mode' : ''}"
                   type="text"
                   placeholder="${state.view === 'favorites' ? 'Filter saved recipes…' : state.ingredientMode ? 'e.g. chicken, lemon, capers…' : 'Search recipes…'}"
                   data-action="search" value="${escHtml(state.searchQuery)}" autocomplete="off">
            ${state.searchQuery ? `<button class="search-clear" data-action="search-clear" aria-label="Clear search">✕</button>` : ''}
          </div>
          ${state.view !== 'favorites' ? `
          <button class="ingredient-toggle ${state.ingredientMode ? 'is-active' : ''}"
                  data-action="toggle-ingredient-mode"
                  title="${state.ingredientMode ? 'Switch to keyword search' : 'Search by ingredients you have'}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.4V20a2 2 0 0 1-4 0V9.4C8.8 8.8 8 7.5 8 6a4 4 0 0 1 4-4z"/>
            </svg>
            <span>By ingredients</span>
          </button>` : ''}
        </div>

        ${state.recentSearches.length && !state.searchQuery && !state.ingredientMode && state.view !== 'favorites' ? `
          <div class="recent-searches">
            <span class="recent-searches-label">Recent</span>
            ${state.recentSearches.map(s => `<button class="recent-search-chip" data-action="recent-search" data-query="${escHtml(s)}">${escHtml(s)}</button>`).join('')}
            <button class="recent-searches-clear" data-action="clear-search-history" aria-label="Clear history">Clear</button>
          </div>
        ` : ''}

        <!-- Desktop chip rows -->
        <div class="tag-filters desktop-filters">
          <div class="tag-group">
            <span class="tag-label">Cuisine</span>
            ${[...FILTERS.cuisine].sort((a, b) => a.label.localeCompare(b.label)).map(f => `
              <button class="tag-chip ${state.cuisineFilters.includes(f.label) ? 'is-active' : ''}"
                      data-action="cuisine" data-value="${f.label}">
                ${f.icon} ${f.label}
              </button>
            `).join('')}
          </div>
          <div class="tag-group">
            <span class="tag-label">Meal</span>
            ${FILTERS.meal.map(f => `
              <button class="tag-chip ${state.mealFilters.includes(f.label) ? 'is-active' : ''}"
                      data-action="meal" data-value="${f.label}">
                ${f.icon} ${f.label}
              </button>
            `).join('')}
          </div>
          <div class="tag-group">
            <span class="tag-label">Dietary</span>
            ${FILTERS.dietary.map(f => `
              <button class="tag-chip ${state.dietaryFilters.includes(f.label) ? 'is-active' : ''}"
                      data-action="dietary" data-value="${f.label}">
                ${f.icon} ${f.label}
              </button>
            `).join('')}
          </div>
          <div class="tag-group">
            <span class="tag-label">Protein</span>
            ${FILTERS.protein.map(f => `
              <button class="tag-chip ${state.proteinFilters.includes(f.label) ? 'is-active' : ''}"
                      data-action="protein" data-value="${f.label}">
                ${f.icon} ${f.label}
              </button>
            `).join('')}
          </div>
          <div class="tag-group">
            <span class="tag-label">Time</span>
            ${FILTERS.time.map(f => `
              <button class="tag-chip ${state.timeFilters.includes(f.label) ? 'is-active' : ''}"
                      data-action="time" data-value="${f.label}">
                ${f.icon} ${f.label}
              </button>
            `).join('')}
          </div>
          <div class="tag-group">
            <span class="tag-label">Method</span>
            ${FILTERS.method.map(f => `
              <button class="tag-chip ${state.methodFilters.includes(f.label) ? 'is-active' : ''}"
                      data-action="method" data-value="${f.label}">
                ${f.icon} ${f.label}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Mobile filter dropdown buttons -->
        <div class="mobile-filter-row">
          ${mobileCats.map(cat => `
            <button class="mobile-filter-btn ${cat.active.length ? 'is-active' : ''} ${state.openFilterDropdown === cat.key ? 'is-open' : ''}"
                    data-action="filter-dropdown-toggle" data-category="${cat.key}">
              <span>${cat.label}${cat.active.length ? ` <span class="mobile-filter-count">${cat.active.length}</span>` : ''}</span>
              ${chevron}
            </button>
          `).join('')}
        </div>
        ${openCat ? `
          <div class="mobile-filter-panel">
            ${openCat.filters.map(f => `
              <button class="tag-chip ${openCat.active.includes(f.label) ? 'is-active' : ''}"
                      data-action="${openCat.key}" data-value="${f.label}">
                ${f.icon} ${f.label}
              </button>
            `).join('')}
          </div>
        ` : ''}

        ${anyActive ? `<button class="clear-tags" data-action="clear-smart-filters">Clear filters</button>` : ''}
      </div>
      ${state.ingredientMode ? `
        <div class="ingredient-banner">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.4V20a2 2 0 0 1-4 0V9.4C8.8 8.8 8 7.5 8 6a4 4 0 0 1 4-4z"/></svg>
          <span>Ingredient mode — enter what's in your fridge, e.g. <em>chicken, lemon, garlic</em></span>
          <button class="ingredient-banner-close" data-action="toggle-ingredient-mode">✕</button>
        </div>
      ` : ''}
    </div>
  `;
}

function renderMealPlan() {
  const today = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()];
  return `
    <div class="container">
      <div class="meal-plan-grid">
        ${DAYS.map(day => {
          const slots = state.mealPlan[day] || {};
          const isToday = day === today;
          return `
            <div class="meal-plan-day ${isToday ? 'is-today' : ''}">
              <div class="meal-plan-day-header">
                <span class="meal-plan-day-name">${day.slice(0,3)}</span>
                ${isToday ? `<span class="meal-plan-today-badge">Today</span>` : ''}
              </div>
              ${MEAL_SLOTS.map(slot => {
                const recipe = slots[slot];
                return `
                  <div class="meal-plan-slot">
                    <span class="meal-plan-slot-label">${slot.charAt(0)}</span>
                    ${recipe ? `
                      <div class="meal-plan-recipe" data-action="card" data-url="${recipe.url}">
                        ${recipe.image ? `<img src="${recipe.image}" alt="" loading="lazy">` : `<div class="meal-plan-no-img" style="background:${recipe.blogColor}22;color:${recipe.blogColor}">${recipe.blog.charAt(0)}</div>`}
                        <span class="meal-plan-recipe-title">${escHtml(recipe.title)}</span>
                      </div>
                      <button class="meal-plan-remove" data-action="remove-from-plan" data-day="${day}" data-slot="${slot}" aria-label="Remove">✕</button>
                    ` : `
                      <div class="meal-plan-empty-slot">
                        <span class="meal-plan-empty-label">${slot}</span>
                      </div>
                    `}
                  </div>
                `;
              }).join('')}
            </div>
          `;
        }).join('')}
      </div>
      ${Object.values(state.mealPlan).every(d => !d || MEAL_SLOTS.every(s => !d[s])) ? `
        <div class="empty" style="padding:60px 20px">
          <div class="empty-icon">📅</div>
          <p>Your meal plan is empty. Open any recipe and tap <strong>Add to Plan</strong> to schedule it.</p>
        </div>
      ` : ''}
    </div>
  `;
}

function renderContent() {
  // --- Meal plan view ---
  if (state.view === 'mealplan') return renderMealPlan();

  // --- Search API mode ---
  if (state.view === 'discover' && state.searchMode) {
    if (state.searchLoading && !state.searchResults.length) {
      return `<div class="container"><div class="grid">${Array(9).fill(0).map(renderSkeleton).join('')}</div></div>`;
    }
    if (!state.searchResults.length && !state.searchLoading) {
      return `
        <div class="container">
          <div class="empty">
            <div class="empty-icon">🔍</div>
            <p>${state.searchError ? escHtml(state.searchError) : 'No recipes found. Try different filters or search terms.'}</p>
            <button class="btn btn-secondary" data-action="clear-all-filters" style="margin-top:16px">Clear all filters</button>
          </div>
        </div>
      `;
    }
    return `
      <div class="container">
        <p class="result-count">Archive search — ${state.searchTotal.toLocaleString()} results</p>
        <div class="grid">
          ${state.searchResults.map(renderCard).join('')}
        </div>
        ${state.searchNextStart ? `<div id="infinite-scroll-sentinel"></div>` : ''}
        ${state.searchLoading && state.searchResults.length ? `<div class="load-more-wrap"><div class="spinner"></div></div>` : ''}
      </div>
    `;
  }

  // --- RSS / favorites mode ---
  const base = state.view === 'discover' ? state.recipes : state.favorites;
  const recipes = applyFilters(base);

  if (state.loading && state.view === 'discover' && !state.recipes.length) {
    return `<div class="container"><div class="grid">${Array(9).fill(0).map(renderSkeleton).join('')}</div></div>`;
  }

  if (!recipes.length) {
    return `
      <div class="container">
        <div class="empty">
          <div class="empty-icon">${hasActiveFilters() ? '🔍' : '🍽️'}</div>
          <p>${hasActiveFilters()
            ? 'No recipes match your filters.'
            : state.view === 'favorites'
              ? 'No saved recipes yet. Browse and bookmark ones you love.'
              : 'No recipes found.'
          }</p>
          ${hasActiveFilters() ? `<button class="btn btn-secondary" data-action="clear-all-filters" style="margin-top:16px">Clear all filters</button>` : ''}
        </div>
      </div>
    `;
  }

  const allFiltered = recipes; // already filtered above
  const visible = allFiltered.slice(0, state.discoverRenderLimit);
  const hasMoreCards = allFiltered.length > state.discoverRenderLimit;

  const count = allFiltered.length;
  const total = base.length;
  const countNote = hasActiveFilters() && count < total
    ? `<p class="result-count">Showing ${count} of ${total} recent recipes</p>`
    : '';

  return `
    <div class="container">
      ${!state.loading && state.view === 'discover' ? `
        <div class="feed-meta-bar">
          <span class="feed-updated">${state.feedLastLoaded ? `Updated ${formatTimeAgo(state.feedLastLoaded)}` : ''}</span>
          <button class="feed-refresh-btn ${state.feedRefreshing ? 'is-loading' : ''}" data-action="refresh-feed" ${state.feedRefreshing ? 'disabled' : ''}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            ${state.feedRefreshing ? 'Refreshing…' : 'Refresh feed'}
          </button>
        </div>
      ` : ''}
      <div id="discover-content">
        ${countNote}
        <div class="grid">
          ${visible.map(renderCard).join('')}
        </div>
        ${hasMoreCards ? `<div id="discover-scroll-sentinel"></div>` : ''}
        ${state.streamingMore ? `<div class="stream-loading" aria-live="polite" aria-label="Loading more recipes"><span></span><span></span><span></span></div>` : ''}
      </div>
    </div>
  `;
}

function renderCard(r) {
  const noImg = !r.image;
  const c = r.blogColor || '#c75b2e';
  return `
    <article class="card" data-action="card" data-url="${r.url}" data-date="${r.date || ''}">
      <div class="card-image ${noImg ? 'no-image' : ''}" ${noImg ? `style="--blog-color:${c}"` : ''}>
        ${r.image ? `<img src="${r.image}" alt="${escHtml(r.title)}" loading="lazy"
          onerror="var p=this.closest('.card-image');p.classList.add('no-image');p.style.setProperty('--blog-color','${c}');p.innerHTML='<div class=\\'card-no-image\\'><span class=\\'card-no-image-initial\\'>${escHtml(r.blog.charAt(0))}</span></div>'">` : ''}
        ${noImg ? `<div class="card-no-image">
          <span class="card-no-image-initial">${escHtml(r.blog.charAt(0))}</span>
        </div>` : ''}
        <button class="card-save ${isFav(r.url) ? 'is-saved' : ''}" data-action="toggle-save" data-url="${r.url}" aria-label="${isFav(r.url) ? 'Remove from saved' : 'Save recipe'}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="${isFav(r.url) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        </button>
      </div>
      <div class="card-body">
        <div class="card-meta">
          ${badge(r.blog, r.blogColor)}
          <span class="card-date">${formatDate(r.date)}</span>
        </div>
        <h3 class="card-title">${escHtml(r.title)}</h3>
      </div>
    </article>
  `;
}

function renderSkeleton() {
  return `
    <div class="card skeleton">
      <div class="card-image"></div>
      <div class="card-body">
        <div class="skeleton-line short"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line medium"></div>
      </div>
    </div>
  `;
}

function renderDrawer() {
  if (!state.selected) {
    return '<div class="drawer-overlay" id="drawer-overlay"><div class="drawer" id="drawer"></div></div>';
  }
  const { url, preview } = state.selected;
  const d = state.detail;
  const fav = isFav(url);
  const image = d?.image || preview.image;

  let body = '';
  if (state.detailLoading) {
    body = `
      ${preview.excerpt ? `<p class="drawer-description">${escHtml(preview.excerpt)}</p>` : ''}
      <div class="drawer-loading"><div class="spinner"></div><p>Loading recipe…</p></div>
    `;
  } else if (state.detailError) {
    body = `
      <div class="drawer-error">
        <p>Couldn't load structured recipe data for this post.</p>
        <a href="${url}" target="_blank" rel="noopener" class="btn btn-secondary">View on ${escHtml(preview.blog)} →</a>
      </div>
    `;
  } else if (d) {
    // Servings scaler
    const baseServings = d.servings ? String(d.servings).replace(/[^\d.]/g, '') : null;
    const scaleOptions = [{ label: '½×', v: 0.5 }, { label: '1×', v: 1 }, { label: '2×', v: 2 }, { label: '3×', v: 3 }, { label: '4×', v: 4 }];
    const scalerHtml = d.ingredients?.length ? `
      <div class="servings-scaler">
        <span class="servings-scaler-label">Scale${baseServings ? ` (${Math.round(parseFloat(baseServings) * state.scaleFactor)} serves)` : ''}</span>
        <div class="servings-scaler-btns">
          ${scaleOptions.map(o => `<button class="scale-btn ${state.scaleFactor === o.v ? 'is-active' : ''}" data-action="scale-servings" data-factor="${o.v}">${o.label}</button>`).join('')}
        </div>
      </div>
    ` : '';

    // Add to Plan picker
    const addToPlanHtml = `
      <div class="add-to-plan-wrap">
        ${state.mealPlanPickerOpen ? `
          <div class="add-to-plan-picker">
            <div class="plan-picker-days">
              ${DAYS.map(day => `<button class="plan-day-btn ${state.mealPlanPickDay === day ? 'is-active' : ''}" data-action="plan-pick-day" data-day="${day}">${day.slice(0,3)}</button>`).join('')}
            </div>
            ${state.mealPlanPickDay ? `
              <div class="plan-picker-slots">
                ${MEAL_SLOTS.map(slot => {
                  const taken = state.mealPlan[state.mealPlanPickDay]?.[slot];
                  return `<button class="plan-slot-btn ${taken ? 'is-taken' : ''}" data-action="confirm-add-to-plan" data-day="${state.mealPlanPickDay}" data-slot="${slot}">
                    ${slot}${taken ? ' ✓' : ''}
                  </button>`;
                }).join('')}
              </div>
            ` : `<p class="plan-picker-hint">Pick a day above</p>`}
          </div>
        ` : `
          <button class="btn btn-plan" data-action="open-plan-picker">📅 Add to Meal Plan</button>
        `}
      </div>
    `;

    body = `
      ${d.description ? `<p class="drawer-description">${escHtml(d.description)}</p>` : ''}
      ${timeChips(d)}
      ${scalerHtml}
      ${d.ingredients?.length ? `
        <section class="recipe-section">
          <h3>Ingredients</h3>
          <ul class="ingredients">
            ${d.ingredients.map(i => `<li>${escHtml(scaleIngredient(i, state.scaleFactor))}</li>`).join('')}
          </ul>
        </section>
      ` : ''}
      ${d.instructions?.length ? `
        <section class="recipe-section">
          <h3>Instructions</h3>
          <ol class="instructions">
            ${d.instructions.map(s => `<li>${escHtml(s)}</li>`).join('')}
          </ol>
        </section>
      ` : ''}
      ${addToPlanHtml}
      <div class="drawer-actions">
        <button class="btn btn-primary ${fav ? 'is-saved' : ''}" data-action="${fav ? 'unsave' : 'save'}">
          ${fav ? 'Saved ✓' : 'Save Recipe'}
        </button>
        <a href="${url}" target="_blank" rel="noopener" class="btn btn-secondary">View Original →</a>
        <button class="btn btn-secondary" data-action="share">Share</button>
      </div>
    `;
  }

  return `
    <div class="drawer-overlay is-open" id="drawer-overlay">
      <aside class="drawer is-open" id="drawer">
        <button class="drawer-close" data-action="close" aria-label="Close">✕</button>
        ${image ? `<div class="drawer-hero"><img src="${image}" alt="${escHtml(preview.title)}"></div>` : ''}
        <div class="drawer-content">
          <div class="drawer-meta">${badge(preview.blog, preview.blogColor)}</div>
          <h2 class="drawer-title">${escHtml(preview.title)}</h2>
          ${body}
        </div>
      </aside>
    </div>
  `;
}

// --- Toast ---
function showToast(msg) {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.classList.add('toast-out'), 2000);
  setTimeout(() => el.remove(), 2350);
}

// --- Events ---
document.addEventListener('click', async (e) => {
  const overlay = document.getElementById('drawer-overlay');
  if (overlay?.classList.contains('is-open') && e.target === overlay) {
    closeDrawer(); return;
  }

  // Close blog picker if clicking outside
  if (state.blogPickerOpen && !e.target.closest('.blog-picker-wrap')) {
    state.blogPickerOpen = false;
  }

  // Close mobile filter panel if clicking outside
  if (state.openFilterDropdown && !e.target.closest('.mobile-filter-row') && !e.target.closest('.mobile-filter-panel')) {
    state.openFilterDropdown = null;
  }

  const el = e.target.closest('[data-action]');
  if (!el) return;
  const { action } = el.dataset;

  if (action === 'tab') {
    state.view = el.dataset.view;
    state.selected = null;
    state.detail = null;
    state.ingredientMode = false;
    state.discoverRenderLimit = 60;
    clearTimeout(searchDebounceTimer);
    renderApp();
  }

  if (action === 'blog-picker-toggle') {
    state.blogPickerOpen = !state.blogPickerOpen;
    renderApp();
    return;
  }

  if (action === 'filter-dropdown-toggle') {
    const cat = el.dataset.category;
    state.openFilterDropdown = state.openFilterDropdown === cat ? null : cat;
    renderApp();
    return;
  }

  if (action === 'filter') {
    state.filter = el.dataset.blog || null;
    state.blogPickerOpen = false;
    renderApp();
  }

  if (action === 'recent-search') {
    state.searchQuery = el.dataset.query;
    state.discoverRenderLimit = 60;
    triggerSearch();
    return;
  }

  if (action === 'clear-search-history') {
    state.recentSearches = [];
    try { localStorage.removeItem(SEARCHES_KEY); } catch {}
    renderApp();
    return;
  }

  const filterStateKey = { cuisine: 'cuisineFilters', protein: 'proteinFilters', time: 'timeFilters', meal: 'mealFilters', dietary: 'dietaryFilters', method: 'methodFilters' }[action];
  if (filterStateKey) {
    const v = el.dataset.value;
    state[filterStateKey] = state[filterStateKey].includes(v) ? state[filterStateKey].filter(x => x !== v) : [...state[filterStateKey], v];
    if (state.ingredientMode) { state.ingredientMode = false; state.searchQuery = ''; }
    state.discoverRenderLimit = 60;
    saveFilters();
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => triggerSearch(), 300);
  }

  if (action === 'share') {
    const url = state.selected?.url;
    const title = state.selected?.preview?.title;
    if (!url) return;
    if (navigator.share) {
      navigator.share({ title: title || 'Recipe', url }).catch(() => {});
    } else if (navigator.clipboard && location.protocol === 'https:') {
      navigator.clipboard.writeText(url).then(() => showToast('Link copied!')).catch(() => copyFallback(url));
    } else {
      copyFallback(url);
    }
  }

  if (action === 'refresh-feed') {
    if (state.feedRefreshing) return;
    state.recipes = [];
    state.loading = true;
    state.feedRefreshing = true;
    state.feedLastLoaded = null;
    state.streamingMore = false;
    renderApp();
    _streamAppendedSet.clear();
    await api.recipesStream((batch) => {
      state.recipes = [...new Map([...state.recipes, ...batch].map(r => [r.url, r])).values()].sort((a, b) => new Date(b.date) - new Date(a.date));
      if (state.loading) {
        state.loading = false;
        state.streamingMore = true;
        if (!state.searchMode && !state.selected) {
          renderApp();
          state.recipes.slice(0, state.discoverRenderLimit).forEach(r => _streamAppendedSet.add(r.url));
        }
      } else {
        insertSortedStreamCards(batch);
      }
    }, true);
    _streamAppendedSet.clear();
    state.feedRefreshing = false;
    state.streamingMore = false;
    state.loading = false;
    if (state.recipes.length) state.feedLastLoaded = Date.now();
    if (!state.searchMode && !state.selected) renderApp();
    return;
  }

  if (action === 'toggle-theme') {
    const next = isDark() ? 'light' : 'dark';
    try { localStorage.setItem(THEME_KEY, next); } catch {}
    applyThemePref(next);
    // Re-render header only to flip the sun/moon icon
    renderApp();
    return;
  }

  if (action === 'back-to-top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  if (action === 'surprise-me') {
    const pool = applyFilters(state.recipes);
    if (!pool.length) return;
    const r = pool[Math.floor(Math.random() * pool.length)];
    state.selected = { url: r.url, preview: r };
    state.detail = null;
    state.detailLoading = true;
    state.detailError = null;
    state.scaleFactor = 1;
    state.mealPlanPickerOpen = false;
    renderApp();
    try {
      const data = _prefetchCache.has(r.url) ? await _prefetchCache.get(r.url) : await api.recipe(r.url);
      if (data?.error) throw new Error(data.error);
      state.detail = data;
    } catch (err) {
      state.detailError = err.message || 'Failed to load recipe.';
    } finally {
      state.detailLoading = false;
      renderApp();
    }
    return;
  }

  if (action === 'scale-servings') {
    state.scaleFactor = parseFloat(el.dataset.factor);
    renderApp();
    return;
  }

  if (action === 'open-plan-picker') {
    state.mealPlanPickerOpen = true;
    state.mealPlanPickDay = null;
    renderApp();
    return;
  }

  if (action === 'plan-pick-day') {
    state.mealPlanPickDay = el.dataset.day;
    renderApp();
    return;
  }

  if (action === 'confirm-add-to-plan') {
    const { day, slot } = el.dataset;
    if (!state.selected) return;
    const p = state.selected.preview;
    if (!state.mealPlan[day]) state.mealPlan[day] = {};
    state.mealPlan[day][slot] = {
      url: state.selected.url,
      title: state.detail?.name || p.title,
      image: state.detail?.image || p.image,
      blog: p.blog,
      blogColor: p.blogColor,
    };
    saveMealPlan();
    state.mealPlanPickerOpen = false;
    state.mealPlanPickDay = null;
    showToast(`Added to ${day} ${slot.toLowerCase()}`);
    renderApp();
    return;
  }

  if (action === 'remove-from-plan') {
    const { day, slot } = el.dataset;
    if (state.mealPlan[day]) {
      state.mealPlan[day][slot] = null;
      saveMealPlan();
      renderApp();
    }
    return;
  }

  if (action === 'toggle-ingredient-mode') {
    clearTimeout(searchDebounceTimer);
    state.ingredientMode = !state.ingredientMode;
    state.searchQuery = '';
    state.searchMode = false;
    state.searchResults = [];
    state.searchTotal = 0;
    state.searchNextStart = null;
    state.searchError = null;
    renderApp();
    setTimeout(() => document.querySelector('[data-action="search"]')?.focus(), 50);
  }

  if (action === 'search-clear') {
    clearTimeout(searchDebounceTimer);
    state.searchQuery = '';
    triggerSearch();
    document.querySelector('[data-action="search"]')?.focus();
  }

  if (action === 'clear-smart-filters') {
    state.cuisineFilters = [];
    state.proteinFilters = [];
    state.timeFilters = [];
    state.mealFilters = [];
    state.dietaryFilters = [];
    state.methodFilters = [];
    state.discoverRenderLimit = 60;
    saveFilters();
    triggerSearch();
  }

  if (action === 'clear-all-filters') {
    clearTimeout(searchDebounceTimer);
    state.searchQuery = '';
    state.cuisineFilters = [];
    state.proteinFilters = [];
    state.timeFilters = [];
    state.mealFilters = [];
    state.dietaryFilters = [];
    state.methodFilters = [];
    state.filter = null;
    state.searchMode = false;
    state.searchResults = [];
    state.searchTotal = 0;
    state.searchNextStart = null;
    state.searchError = null;
    state.discoverRenderLimit = 60;
    saveFilters();
    renderApp();
  }

  if (action === 'toggle-save') {
    const url = el.dataset.url;
    if (isFav(url)) {
      removeFav(url);
    } else {
      const pool = [...state.recipes, ...state.favorites, ...state.searchResults];
      const r = pool.find(r => r.url === url);
      if (r) saveFav({ url: r.url, title: r.title, image: r.image, blog: r.blog, blogColor: r.blogColor, date: r.date, excerpt: r.excerpt });
    }
    refreshFavorites();
    if (state.view === 'favorites') renderApp();
    else refreshDiscoverContent();
    return;
  }

  if (action === 'close') { closeDrawer(); }

  if (action === 'card') {
    const url = el.dataset.url;
    const pool = [...state.recipes, ...state.favorites, ...state.searchResults,
      ...Object.values(state.mealPlan).flatMap(d => d ? Object.values(d).filter(Boolean) : [])];
    const preview = pool.find(r => r.url === url);
    if (!preview) return;

    state.selected = { url, preview };
    state.detail = null;
    state.detailLoading = true;
    state.detailError = null;
    state.scaleFactor = 1;
    state.mealPlanPickerOpen = false;
    state.mealPlanPickDay = null;
    renderApp();

    try {
      const data = _prefetchCache.has(url) ? await _prefetchCache.get(url) : await api.recipe(url);
      if (data?.error) throw new Error(data.error);
      state.detail = data;
    } catch (err) {
      state.detailError = err.message || 'Failed to load recipe.';
    } finally {
      state.detailLoading = false;
    }
    renderApp();
  }

  if (action === 'save') {
    if (!state.selected) return;
    const p = state.selected.preview;
    saveFav({
      url: state.selected.url,
      title: state.detail?.name || p.title,
      image: state.detail?.image || p.image,
      blog: p.blog,
      blogColor: p.blogColor,
      date: p.date,
      excerpt: p.excerpt || '',
    });
    refreshFavorites();
    renderApp();
  }

  if (action === 'unsave') {
    if (!state.selected) return;
    removeFav(state.selected.url);
    refreshFavorites();
    renderApp();
  }
});

// Search input — update state and debounce the API call.
// We do NOT call renderApp() here — doing so destroys and recreates the input
// element on every keystroke, causing focus loss after ~1 second of typing.
// The only visible UI change while typing is the clear (×) button, so we
// toggle that directly instead of a full re-render.
document.addEventListener('input', (e) => {
  if (e.target.dataset.action !== 'search') return;
  state.searchQuery = e.target.value;

  // Toggle clear button visibility in-place — no re-render needed.
  const clearBtn = document.querySelector('[data-action="search-clear"]');
  if (clearBtn) clearBtn.style.display = state.searchQuery ? '' : 'none';

  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => triggerSearch(), 400);
});

// Hover-prefetch on desktop — fetch recipe detail 150ms after hovering a card
// so the drawer opens instantly on click.
document.addEventListener('mouseover', (e) => {
  const card = e.target.closest('[data-action="card"]');
  if (!card) return;
  const url = card.dataset.url;
  if (!url || _prefetchCache.has(url)) return;
  clearTimeout(_prefetchTimer);
  _prefetchTimer = setTimeout(() => {
    if (!_prefetchCache.has(url)) {
      _prefetchCache.set(url, api.recipe(url).catch(() => null));
    }
  }, 150);
});

// Back-to-top button visibility — pure DOM toggle, no state re-render
window.addEventListener('scroll', () => {
  const btn = document.getElementById('back-to-top');
  if (btn) btn.classList.toggle('is-visible', window.scrollY > 400);
}, { passive: true });

// Service worker update toast
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (e) => {
    if (e.data?.type === 'sw-updated') {
      const toast = document.createElement('div');
      toast.className = 'toast sw-update-toast';
      toast.innerHTML = 'App updated — <button class="sw-reload-btn" onclick="location.reload()">reload</button>';
      document.body.appendChild(toast);
      // Don't auto-remove; let the user decide
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && state.selected) { closeDrawer(); return; }
  if (e.key === 'Tab' && state.selected) {
    const drawer = document.getElementById('drawer');
    if (!drawer) return;
    const focusable = [...drawer.querySelectorAll('button, a[href], input, [tabindex]:not([tabindex="-1"])')].filter(el => !el.disabled);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    // With one element, always trap focus back to it on Tab
    if (focusable.length === 1) { e.preventDefault(); first.focus(); return; }
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

function copyFallback(url) {
  try {
    const el = document.createElement('textarea');
    el.value = url;
    Object.assign(el.style, { position: 'fixed', opacity: '0', pointerEvents: 'none' });
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showToast('Link copied!');
  } catch {
    showToast('Could not copy link');
  }
}

function closeDrawer() {
  state.selected = null;
  state.detail = null;
  state.detailError = null;
  state.scaleFactor = 1;
  state.mealPlanPickerOpen = false;
  state.mealPlanPickDay = null;
  renderApp();
}

// Lightweight update — only re-renders the card grid, leaving the rest of the
// page (header, search bar, filters, blog picker) completely untouched.
function refreshDiscoverContent() {
  const el = document.getElementById('discover-content');
  if (!el) return;
  const base = state.view === 'favorites' ? state.favorites : state.recipes;
  const allFiltered = applyFilters(base);
  const visible = allFiltered.slice(0, state.discoverRenderLimit);
  const hasMoreCards = allFiltered.length > state.discoverRenderLimit;
  const countNote = hasActiveFilters() && allFiltered.length < base.length
    ? `<p class="result-count">Showing ${allFiltered.length} of ${base.length} recent recipes</p>` : '';
  const streamBar = state.streamingMore
    ? `<div class="stream-loading" aria-live="polite" aria-label="Loading more recipes"><span></span><span></span><span></span></div>` : '';
  el.innerHTML = `${countNote}<div class="grid">${visible.map(renderCard).join('')}</div>${hasMoreCards ? '<div id="discover-scroll-sentinel"></div>' : ''}${streamBar}`;
  setupInfiniteScroll();
}

// --- Init ---
async function init() {
  applyThemePref(loadThemePref()); // apply before first paint
  refreshFavorites();
  state.recentSearches = loadSearchHistory();
  state.mealPlan = loadMealPlan();
  const savedFilters = loadSavedFilters();
  if (savedFilters) {
    state.cuisineFilters = savedFilters.cuisine  || [];
    state.proteinFilters = savedFilters.protein  || [];
    state.timeFilters    = savedFilters.time     || [];
    state.mealFilters    = savedFilters.meal     || [];
    state.dietaryFilters = savedFilters.dietary  || [];
    state.methodFilters  = savedFilters.method   || [];
  }
  BLOGS = await api.blogs();
  renderApp();

  // Stream recipes in as each blog loads.
  // First batch: swap skeletons for real cards via renderApp(), track rendered URLs.
  // Subsequent batches: append new cards directly to the grid — no re-sort, no
  // full replacement — so existing cards never jump position mid-load.
  // Final render when stream finishes: one clean sorted renderApp().
  _streamAppendedSet.clear();
  await api.recipesStream((batch) => {
    state.recipes = [...new Map([...state.recipes, ...batch].map(r => [r.url, r])).values()]
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    if (state.loading) {
      state.loading = false;
      state.streamingMore = true;
      if (!state.searchMode && !state.selected) {
        renderApp();
        // Track what just rendered so insertSortedStreamCards skips them.
        state.recipes.slice(0, state.discoverRenderLimit).forEach(r => _streamAppendedSet.add(r.url));
      }
    } else {
      insertSortedStreamCards(batch);
    }
  });
  _streamAppendedSet.clear();
  state.streamingMore = false;
  state.feedLastLoaded = Date.now();
  if (!state.searchMode && !state.selected) renderApp();
}

init();
