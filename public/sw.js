const CACHE = 'mise-en-scroll-v1';
const STATIC = ['/', '/app.js', '/style.css', '/manifest.json', '/icons/icon.svg', '/icons/icon-192.png', '/icons/icon-512.png'];

// Install: pre-cache the app shell, then activate immediately
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

// Activate: delete old caches, then notify open tabs if this was an upgrade
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => {
      const old = keys.filter(k => k !== CACHE);
      const isUpgrade = old.length > 0;
      return Promise.all(old.map(k => caches.delete(k))).then(() => {
        if (isUpgrade) {
          return self.clients.matchAll({ type: 'window' }).then(clients =>
            clients.forEach(c => c.postMessage({ type: 'sw-updated' }))
          );
        }
      });
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // API routes: network-first, fall back to cache for offline
  if (url.pathname.startsWith('/api/')) {
    // SSE stream can't be cached — let it pass through
    if (url.pathname === '/api/recipes/stream') return;
    e.respondWith(
      fetch(request)
        .then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(request, clone));
          }
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static assets: cache-first, update in background (stale-while-revalidate)
  e.respondWith(
    caches.open(CACHE).then(async (c) => {
      const cached = await c.match(request);
      const networkFetch = fetch(request).then(res => {
        if (res.ok) c.put(request, res.clone());
        return res;
      }).catch(() => null);
      return cached || await networkFetch;
    })
  );
});
