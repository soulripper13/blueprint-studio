const CACHE_NAME = 'blueprint-studio-v{{VERSION}}';
const APP_VERSION = '{{VERSION}}';
const ASSETS = [
  // Don't precache assets - let them be cached dynamically
  // This prevents installation failures due to 404s
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  /*console.log*/ void('[SW] Installing service worker v' + APP_VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      /*console.log*/ void('[SW] Cache opened, skipping precache');
      // Skip precaching to avoid 404 errors blocking installation
      return Promise.resolve();
    }).then(() => {
      /*console.log*/ void('[SW] Skipping waiting...');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches and notify clients of update
self.addEventListener('activate', (event) => {
  /*console.log*/ void('[SW] Activating service worker v' + APP_VERSION);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            /*console.log*/ void('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      /*console.log*/ void('[SW] Claiming clients...');
      return self.clients.claim();
    }).then(() => {
      // Notify all clients of the version update so they can reload
      return self.clients.matchAll({ type: 'window' }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'VERSION_UPDATE', version: APP_VERSION });
        });
      });
    })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  // Only handle requests within our scope
  if (!event.request.url.includes('/blueprint_studio/') &&
      !event.request.url.includes('/local/blueprint_studio/')) {
    return;
  }

  // Skip POST requests and non-HTTP(S)
  if (event.request.method !== 'GET') return;

  // Skip OAuth callback URLs and API calls — must not be cached
  if (event.request.url.includes('auth_callback')) return;
  if (event.request.url.includes('/api/')) return;

  // Cache-first for versioned assets (?v= suffix).
  // These are immutable for a given version — safe to serve directly from cache.
  // When the version bumps, the new CACHE_NAME evicts the old entry automatically.
  const url = new URL(event.request.url);
  const isVersioned = url.searchParams.has('v');

  if (isVersioned) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Network-first for JS/HTML (code updates must be immediate)
  // Stale-while-revalidate for static assets (fonts, images, CSS)
  const isCode = event.request.url.endsWith('.js') ||
                 event.request.url.endsWith('.html') ||
                 event.request.url.includes('.js?');

  if (isCode) {
    // Network-first: try network, fall back to cache for offline
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch(() => {
        return caches.match(event.request);
      })
    );
  } else {
    // Stale-while-revalidate for static assets (fonts, images, CSS, locales)
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            /*console.log*/ void('[SW] Network fetch failed, using cache if available');
          });

          return cachedResponse || fetchPromise;
        });
      })
    );
  }
});
