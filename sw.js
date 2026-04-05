const CACHE_NAME = 'kj-kcal-pwa-v6';
const APP_SHELL = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/startup-1290x2796.png',
  '/startup-1179x2556.png',
  '/startup-1170x2532.png',
  '/startup-1284x2778.png',
  '/startup-1242x2688.png',
  '/startup-828x1792.png',
  '/startup-1125x2436.png',
  '/startup-750x1334.png',
  '/startup-640x1136.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);
  const isSameOrigin = requestUrl.origin === self.location.origin;
  const isNavigationRequest =
    event.request.mode === 'navigate' ||
    (isSameOrigin && (requestUrl.pathname === '/' || requestUrl.pathname === '/index.html'));

  if (isNavigationRequest) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put('/index.html', responseClone).catch(() => undefined);
          });
          return networkResponse;
        })
        .catch(() => caches.match(event.request).then((response) => response ?? caches.match('/index.html'))),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone).catch(() => undefined);
          });
          return networkResponse;
        })
        .catch(() => Response.error());
    }),
  );
});
