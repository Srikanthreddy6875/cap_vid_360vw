const CACHE_NAME = 'static-cache-v1';
const urlsToCache = [
  './index.html',
  './video_360_style.css',
  './video_360.js',
  './2160256939.mp4', // Ensure the file path is correct
];

// Install event: Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache).catch((error) => {
        console.error('Failed to cache some resources:', error);
      });
    })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
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

// Fetch event: Handle requests for video and other resources
self.addEventListener('fetch', (event) => {
  console.log('[Service Worker] Fetching:', event.request.url);

  if (event.request.url.includes('.mp4')) {
    // For video files, handle dynamically while avoiding partial response caching
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          console.log('Returning cached video:', event.request.url);
          return cachedResponse;
        }

        console.log('Fetching video from network:', event.request.url);
        return fetch(event.request).then((networkResponse) => {
          // Only cache complete responses (status 200 and no Content-Range)
          if (
            networkResponse.ok &&
            networkResponse.status === 200 &&
            !networkResponse.headers.get('content-range') // Ensure it's not a partial response
          ) {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              console.log('Video cached successfully:', event.request.url);
              return networkResponse;
            });
          }

          // If partial or invalid response, return network response without caching
          console.warn('Partial response, not caching:', event.request.url);
          return networkResponse;
        });
      })
    );
  } else {
    // Default caching strategy for non-video resources
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((networkResponse) => {
          if (networkResponse.ok) {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              console.log('Cached resource:', event.request.url);
              return networkResponse;
            });
          }
          return networkResponse;
        });
      })
    );
  }
});
