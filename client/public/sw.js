// Version 3 - Self-Destructing Service Worker
// This version clears ALL caches and unregisters itself to fix white screen issues

const CACHE_VERSION = 'v3';

// On install - clear everything and skip waiting
self.addEventListener('install', (event) => {
  console.log('SW v3: Installing and clearing all caches...');
  self.skipWaiting();
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('SW v3: Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// On activate - take control and clear caches again
self.addEventListener('activate', (event) => {
  console.log('SW v3: Activating and taking control...');
  
  event.waitUntil(
    Promise.all([
      // Clear all caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('SW v3: Clearing cache on activate:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }),
      // Take control immediately
      self.clients.claim()
    ])
  );
});

// On fetch - ALWAYS go to network, never use cache
self.addEventListener('fetch', (event) => {
  // Only handle same-origin GET requests
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;
  
  // Always fetch from network
  event.respondWith(
    fetch(event.request, { cache: 'no-store' })
      .catch(() => {
        // Only use cache as absolute last resort for offline
        return caches.match(event.request);
      })
  );
});

// Listen for skip waiting message
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
