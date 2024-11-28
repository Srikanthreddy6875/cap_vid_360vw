const CACHE_NAME = 'static-cache-v1';
const urlsToCache = [
  './index.html',
  './video_360_style.css',
  './video_360.js',
  './2160256939.mp4', // Replace with the correct file paths
];

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

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
