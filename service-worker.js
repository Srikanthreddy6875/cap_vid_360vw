const CACHE_NAME = 'static-cache-v1';
const urlsToCache = [
  './index.html',
  './video_360_style.css',
  './video_360.js',
  './2160256939.mp4', 
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

// Fetch event: Cache video files and handle dynamic requests
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('.mp4')) {
    // Handle video file requests
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse; // Serve from cache if available
        }
        return fetch(event.request).then((response) => {
          // Check if response is valid and complete
          if (
            response.status === 200 &&
            response.type === 'basic' // Ensure it's a valid response
          ) {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, response.clone()); // Cache the complete response
              return response;
            });
          }
          return response; // Return the response without caching if invalid
        });
      })
    );
  } else {
    // Handle other resources with Cache First strategy
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
