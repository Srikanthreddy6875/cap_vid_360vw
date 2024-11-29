const CACHE_NAME = 'static-cache-v1';
const urlsToCache = [
  './index.html',
  './video_360_style.css',
  './video_360.js',
  './2160256939.mp4',
];

// Install event
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install event triggered.');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Error during caching:', error);
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate event triggered.');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  console.log('[Service Worker] Fetching:', event.request.url);
  if (event.request.url.includes('.mp4')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request).then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
