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
    { label: 'Slow Cooker',  icon: '🫕', keywords: ['slow cooker', 'crockpot', 'crock pot', 'crock-pot', 'slow-cooked', 'slow cook', 'braised', 'low and slow'] },
    { label: '2+ Hours',     icon: '⏳', keywords: ['2 hour', '2-hour', '3 hour', '3-hour', 'overnight', 'all day', 'sunday roast', 'all-day', 'long braise', 'low and slow', 'oven braised'] },
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
  ingredientMode: false, // true when searching by ingredients
  blogPickerOpen: false,
};

// --- API ---
const api = {
  blogs:     ()         => fetch('/api/blogs').then(r => r.json()),
  recipesStream: (onBatch) => new Promise((resolve) => {
    const es = new EventSource('/api/recipes/stream');
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

// --- Helpers ---
function isFav(url)       { return state.favorites.some(f => f.url === url); }
function formatDate(str)  { if (!str) return ''; return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
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
let _savedScrollY = 0;
let _prevDrawerOpen = false;
let _infiniteScrollObserver = null;
async function triggerSearch(start = 1) {
  // Ingredient mode — sends raw ingredient text to AI-powered endpoint
  if (state.ingredientMode) {
    const ingredients = state.searchQuery.trim();
    if (!ingredients) {
      state.searchMode = false;
      state.searchResults = [];
      renderApp();
      return;
    }
    state.searchMode = true;
    state.searchLoading = true;
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

  state.searchMode = true;
  state.searchLoading = true;
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
  } finally {
    state.searchLoading = false;
    renderApp();
  }
}

// --- Filter logic ---
function applyFilters(recipes) {
  return recipes.filter(r => {
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
      const kws = state.timeFilters.flatMap(label => FILTERS.time.find(f => f.label === label)?.keywords || []);
      if (!kws.some(kw => full.includes(kw))) return false;
    }
    if (state.mealFilters.length) {
      const kws = state.mealFilters.flatMap(label => FILTERS.meal.find(f => f.label === label)?.keywords || []);
      if (!kws.some(kw => full.includes(kw))) return false;
    }
    if (state.dietaryFilters.length) {
      const kws = state.dietaryFilters.flatMap(label => FILTERS.dietary.find(f => f.label === label)?.keywords || []);
      if (!kws.some(kw => full.includes(kw))) return false;
    }
    return true;
  });
}

function hasActiveFilters() {
  return !!(state.searchQuery || state.cuisineFilters.length || state.proteinFilters.length || state.timeFilters.length || state.mealFilters.length || state.dietaryFilters.length || state.filter);
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
    ${renderSearchSection()}
    <div class="grid-section">
      ${renderContent()}
    </div>
    ${renderDrawer()}
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
  const sentinel = document.getElementById('infinite-scroll-sentinel');
  if (!sentinel) return;
  _infiniteScrollObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && state.searchNextStart && !state.searchLoading) {
      triggerSearch(state.searchNextStart);
    }
  }, { rootMargin: '300px' });
  _infiniteScrollObserver.observe(sentinel);
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
        </nav>
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
                   placeholder="${state.ingredientMode ? 'e.g. chicken, lemon, capers…' : 'Search recipes…'}"
                   data-action="search" value="${escHtml(state.searchQuery)}" autocomplete="off">
            ${state.searchQuery ? `<button class="search-clear" data-action="search-clear" aria-label="Clear search">✕</button>` : ''}
          </div>
          <button class="ingredient-toggle ${state.ingredientMode ? 'is-active' : ''}"
                  data-action="toggle-ingredient-mode"
                  title="${state.ingredientMode ? 'Switch to keyword search' : 'Search by ingredients you have'}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.4V20a2 2 0 0 1-4 0V9.4C8.8 8.8 8 7.5 8 6a4 4 0 0 1 4-4z"/>
            </svg>
          </button>
        </div>

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
    </div>
  `;
}

function renderContent() {
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
            <p>No recipes found. Try different filters or search terms.</p>
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

  const count = recipes.length;
  const total = base.length;
  const countNote = hasActiveFilters() && count < total
    ? `<p class="result-count">Showing ${count} of ${total} recent recipes</p>`
    : '';

  return `
    <div class="container">
      <div id="discover-content">
        ${countNote}
        <div class="grid">
          ${recipes.map(renderCard).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderCard(r) {
  const noImg = !r.image;
  const c = r.blogColor || '#c75b2e';
  return `
    <article class="card" data-action="card" data-url="${r.url}">
      <div class="card-image ${noImg ? 'no-image' : ''}" ${noImg ? `style="--blog-color:${c}"` : ''}>
        ${r.image ? `<img src="${r.image}" alt="${escHtml(r.title)}" loading="lazy"
          onerror="var p=this.closest('.card-image');p.classList.add('no-image');p.style.setProperty('--blog-color','${c}');p.innerHTML='<div class=\\'card-no-image\\'><span class=\\'card-no-image-initial\\'>${escHtml(r.blog.charAt(0))}</span></div>'">` : ''}
        ${noImg ? `<div class="card-no-image">
          <span class="card-no-image-initial">${escHtml(r.blog.charAt(0))}</span>
        </div>` : ''}
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
    body = `
      ${d.description ? `<p class="drawer-description">${escHtml(d.description)}</p>` : ''}
      ${timeChips(d)}
      ${d.ingredients?.length ? `
        <section class="recipe-section">
          <h3>Ingredients</h3>
          <ul class="ingredients">
            ${d.ingredients.map(i => `<li>${escHtml(i)}</li>`).join('')}
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

  const filterStateKey = { cuisine: 'cuisineFilters', protein: 'proteinFilters', time: 'timeFilters', meal: 'mealFilters', dietary: 'dietaryFilters' }[action];
  if (filterStateKey) {
    const v = el.dataset.value;
    state[filterStateKey] = state[filterStateKey].includes(v) ? state[filterStateKey].filter(x => x !== v) : [...state[filterStateKey], v];
    if (state.ingredientMode) { state.ingredientMode = false; state.searchQuery = ''; }
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => triggerSearch(), 300);
  }

  if (action === 'share') {
    const url = state.selected?.url;
    const title = state.selected?.preview?.title;
    if (!url) return;
    if (navigator.share) {
      navigator.share({ title: title || 'Recipe', url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => showToast('Link copied!')).catch(() => showToast('Could not copy link'));
    }
  }

  if (action === 'toggle-ingredient-mode') {
    state.ingredientMode = !state.ingredientMode;
    state.searchQuery = '';
    state.searchMode = false;
    state.searchResults = [];
    renderApp();
    setTimeout(() => document.querySelector('[data-action="search"]')?.focus(), 50);
  }

  if (action === 'search-clear') {
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
    triggerSearch();
  }

  if (action === 'clear-all-filters') {
    state.searchQuery = '';
    state.cuisineFilters = [];
    state.proteinFilters = [];
    state.timeFilters = [];
    state.mealFilters = [];
    state.dietaryFilters = [];
    state.filter = null;
    state.searchMode = false;
    state.searchResults = [];
    renderApp();
  }

  if (action === 'close') { closeDrawer(); }

  if (action === 'card') {
    const url = el.dataset.url;
    const pool = [...state.recipes, ...state.favorites, ...state.searchResults];
    const preview = pool.find(r => r.url === url);
    if (!preview) return;

    state.selected = { url, preview };
    state.detail = null;
    state.detailLoading = true;
    state.detailError = null;
    renderApp();

    try {
      const data = await api.recipe(url);
      if (data.error) throw new Error(data.error);
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
    });
    state.favorites = loadFavs();
    renderApp();
  }

  if (action === 'unsave') {
    if (!state.selected) return;
    removeFav(state.selected.url);
    state.favorites = loadFavs();
    renderApp();
  }
});

// Search input — debounce API search, preserve focus
document.addEventListener('input', (e) => {
  if (e.target.dataset.action !== 'search') return;
  state.searchQuery = e.target.value;
  const cursor = e.target.selectionStart;
  renderApp();
  const input = document.querySelector('[data-action="search"]');
  if (input) { input.focus(); input.setSelectionRange(cursor, cursor); }

  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => triggerSearch(), 600);
});

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

function closeDrawer() {
  state.selected = null;
  state.detail = null;
  state.detailError = null;
  renderApp();
}

// Lightweight update — only re-renders the card grid, leaving the rest of the
// page (header, search bar, filters, blog picker) completely untouched.
function refreshDiscoverContent() {
  const el = document.getElementById('discover-content');
  if (!el) return;
  const base = state.recipes;
  const recipes = applyFilters(base);
  const countNote = hasActiveFilters() && recipes.length < base.length
    ? `<p class="result-count">Showing ${recipes.length} of ${base.length} recent recipes</p>` : '';
  el.innerHTML = `${countNote}<div class="grid">${recipes.map(renderCard).join('')}</div>`;
}

// --- Init ---
async function init() {
  state.favorites = loadFavs();
  BLOGS = await api.blogs();
  renderApp();

  // Stream recipes in as each blog loads — renders progressively.
  // First batch does a full renderApp() to paint the shell; subsequent batches
  // only update the card grid so the blog picker and filters stay untouched.
  await api.recipesStream((batch) => {
    state.recipes = [...state.recipes, ...batch]
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    if (state.loading) {
      state.loading = false;
      if (!state.searchMode && !state.selected) renderApp();
    } else if (!state.searchMode && !state.selected) {
      refreshDiscoverContent();
    }
  });

  state.loading = false;
  if (!state.searchMode && !state.selected) renderApp();
}

init();
