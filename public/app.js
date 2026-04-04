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
    { label: 'Mediterranean', icon: '🫒', keywords: ['hummus', 'falafel', 'greek', 'mediterranean', 'shakshuka', 'gyro', 'tzatziki', 'pita', 'couscous', 'moroccan', 'harissa', 'tabbouleh', 'kebab', 'baba ganoush', 'spanakopita', 'za\'atar', 'sumac'] },
    { label: 'Indian',        icon: '🍛', keywords: ['curry', 'tikka', 'masala', 'dal', 'naan', 'biryani', 'saag', 'paneer', 'tandoori', 'chutney', 'samosa', 'korma', 'vindaloo', 'palak', 'aloo', 'indian', 'chana', 'raita', 'dosa'] },
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
  selected: null,        // { url, preview }
  detail: null,          // full recipe from /api/recipe
  detailLoading: false,
  detailError: null,
  loading: true,
  // Search API state
  searchMode: false,   // true when using Google API results
  searchResults: [],
  searchTotal: 0,
  searchLoading: false,
  searchNextStart: null,
};

// --- API ---
const api = {
  blogs:     ()         => fetch('/api/blogs').then(r => r.json()),
  recipes:   ()         => fetch('/api/recipes').then(r => r.json()),
  recipesStream: (onBatch) => new Promise((resolve) => {
    const es = new EventSource('/api/recipes/stream');
    es.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === 'batch') onBatch(msg.recipes);
      if (msg.type === 'done') { es.close(); resolve(); }
    };
    es.onerror = () => { es.close(); resolve(); };
  }),
  recipe:    (url)      => fetch(`/api/recipe?url=${encodeURIComponent(url)}`).then(r => r.json()),
  search:    (q, page)  => fetch(`/api/search?q=${encodeURIComponent(q)}&page=${page || 1}`).then(r => r.json()),
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
function urlId(url) {
  try { return btoa(url); } catch { return btoa(encodeURIComponent(url)); }
}
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
    { vals: state.cuisineFilters, group: 'cuisine' },
    { vals: state.proteinFilters, group: 'protein' },
    { vals: state.timeFilters,    group: 'time'    },
    { vals: state.mealFilters,    group: 'meal'    },
  ];
  for (const { vals, group } of filterMap) {
    for (const val of vals) {
      const f = FILTERS[group].find(f => f.label === val);
      if (f) parts.push(f.keywords[0]);
    }
  }
  if (!parts.some(p => p.includes('recipe'))) parts.push('recipe');
  return parts.join(' ');
}

let searchDebounceTimer = null;
async function triggerSearch(start = 1) {
  // Filters alone use local RSS data — only a text search query hits the API
  if (!state.searchQuery.trim()) {
    state.searchMode = false;
    state.searchResults = [];
    renderApp();
    return;
  }

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
    return true;
  });
}

function hasActiveFilters() {
  return !!(state.searchQuery || state.cuisineFilters.length || state.proteinFilters.length || state.timeFilters.length || state.mealFilters.length || state.filter);
}

// --- Render ---
function renderApp() {
  document.getElementById('app').innerHTML = `
    ${renderHeader()}
    ${renderFilters()}
    ${renderSearchSection()}
    <div class="grid-section">
      ${renderContent()}
    </div>
    ${renderDrawer()}
  `;
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

function renderFilters() { return ''; }

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
      <div class="blog-picker-dropdown" id="blog-picker-dropdown" hidden>
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
  const anyActive = state.cuisineFilters.length || state.proteinFilters.length || state.timeFilters.length || state.mealFilters.length;
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
            <input class="search-input" type="text" placeholder="Search recipes…"
                   data-action="search" value="${escHtml(state.searchQuery)}" autocomplete="off">
            ${state.searchQuery ? `<button class="search-clear" data-action="search-clear" aria-label="Clear search">✕</button>` : ''}
          </div>
        </div>
        <div class="tag-filters">
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
            <span class="tag-label">Meal</span>
            ${FILTERS.meal.map(f => `
              <button class="tag-chip ${state.mealFilters.includes(f.label) ? 'is-active' : ''}"
                      data-action="meal" data-value="${f.label}">
                ${f.icon} ${f.label}
              </button>
            `).join('')}
          </div>
        </div>
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
        ${state.searchNextStart ? `
          <div class="load-more-wrap">
            <button class="btn btn-secondary load-more" data-action="load-more" ${state.searchLoading ? 'disabled' : ''}>
              ${state.searchLoading ? 'Loading…' : 'Load more'}
            </button>
          </div>
        ` : ''}
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
      ${countNote}
      <div class="grid">
        ${recipes.map(renderCard).join('')}
      </div>
    </div>
  `;
}

function renderCard(r) {
  return `
    <article class="card" data-action="card" data-url="${r.url}">
      <div class="card-image ${!r.image ? 'no-image' : ''}">
        ${r.image ? `<img src="${r.image}" alt="${escHtml(r.title)}" loading="lazy"
          onerror="this.closest('.card-image').classList.add('no-image');this.remove()">` : ''}
        <div class="card-image-placeholder">🍴</div>
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
    body = `<div class="drawer-loading"><div class="spinner"></div><p>Loading recipe…</p></div>`;
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

// --- Events ---
document.addEventListener('click', async (e) => {
  const overlay = document.getElementById('drawer-overlay');
  if (overlay?.classList.contains('is-open') && e.target === overlay) {
    closeDrawer(); return;
  }

  // Close blog picker if clicking outside
  const picker = document.getElementById('blog-picker-dropdown');
  if (picker && !picker.hidden && !e.target.closest('.blog-picker-wrap')) {
    picker.hidden = true;
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
    const dropdown = document.getElementById('blog-picker-dropdown');
    if (dropdown) dropdown.hidden = !dropdown.hidden;
    return;
  }

  if (action === 'filter') {
    state.filter = el.dataset.blog || null;
    const dropdown = document.getElementById('blog-picker-dropdown');
    if (dropdown) dropdown.hidden = true;
    renderApp();
  }

  if (action === 'cuisine') {
    const v = el.dataset.value;
    state.cuisineFilters = state.cuisineFilters.includes(v) ? state.cuisineFilters.filter(x => x !== v) : [...state.cuisineFilters, v];
    triggerSearch();
  }

  if (action === 'protein') {
    const v = el.dataset.value;
    state.proteinFilters = state.proteinFilters.includes(v) ? state.proteinFilters.filter(x => x !== v) : [...state.proteinFilters, v];
    triggerSearch();
  }

  if (action === 'time') {
    const v = el.dataset.value;
    state.timeFilters = state.timeFilters.includes(v) ? state.timeFilters.filter(x => x !== v) : [...state.timeFilters, v];
    triggerSearch();
  }

  if (action === 'meal') {
    const v = el.dataset.value;
    state.mealFilters = state.mealFilters.includes(v) ? state.mealFilters.filter(x => x !== v) : [...state.mealFilters, v];
    triggerSearch();
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
    triggerSearch();
  }

  if (action === 'clear-all-filters') {
    state.searchQuery = '';
    state.cuisineFilters = [];
    state.proteinFilters = [];
    state.timeFilters = [];
    state.mealFilters = [];
    state.filter = null;
    state.searchMode = false;
    state.searchResults = [];
    renderApp();
  }

  if (action === 'load-more') {
    if (state.searchNextStart) triggerSearch(state.searchNextStart);
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
  if (e.key === 'Escape' && state.selected) closeDrawer();
});

function closeDrawer() {
  state.selected = null;
  state.detail = null;
  state.detailError = null;
  renderApp();
}

// --- Init ---
async function init() {
  state.favorites = loadFavs();
  BLOGS = await api.blogs();
  renderApp();

  // Stream recipes in as each blog loads — renders progressively
  await api.recipesStream((batch) => {
    state.recipes = [...state.recipes, ...batch]
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    if (state.loading) {
      state.loading = false;
    }
    if (!state.searchMode) renderApp();
  });

  state.loading = false;
  if (!state.searchMode) renderApp();
}

init();
