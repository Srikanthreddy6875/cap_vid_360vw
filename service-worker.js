const CACHE_NAME = 'static-cache-v1';
const urlsToCache = [
  './index.html',
  './video_360_style.css',
  './video_360.js',
  './2160256939.mp4', // Replace with the correct file path for your video
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
  // If it's a video or other dynamic resource, use a different strategy
  if (event.request.url.includes('.mp4')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // If video is found in cache, return it, otherwise fetch from network
        return cachedResponse || fetch(event.request).then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone()); // Save response to cache
            return response;
          });
        });
      })
    );
  } else {
    // For other resources, fallback to default cache strategy (Cache First)
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
