const CACHE_VERSION = 'saanufox-v3-mainnet';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/assets/generated/pwa-icon-192.dim_192x192.png',
  '/assets/generated/pwa-icon-512.dim_512x512.png',
  '/assets/generated/apple-touch-icon.dim_180x180.png',
  '/assets/generated/hero-banner.dim_1920x400.png',
  '/assets/generated/video-thumb-1.dim_400x225.png',
  '/assets/generated/video-thumb-2.dim_400x225.png',
  '/assets/generated/video-thumb-3.dim_400x225.png',
  '/assets/generated/video-thumb-4.dim_400x225.png',
  '/assets/generated/video-thumb-5.dim_400x225.png',
  '/assets/generated/video-thumb-6.dim_400x225.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing v3-mainnet...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating v3-mainnet...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.startsWith('saanufox-') && cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip Internet Identity and IC mainnet URLs
  if (
    url.hostname.includes('identity.ic0.app') ||
    url.hostname.includes('identity.internetcomputer.org') ||
    url.hostname.includes('ic0.app') ||
    url.hostname.includes('icp0.io') ||
    url.hostname.includes('raw.icp0.io') ||
    url.pathname.includes('/.well-known/') ||
    request.url.includes('canister')
  ) {
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => {
          return caches.match('/offline.html');
        })
    );
    return;
  }

  // Cache-first strategy for static assets
  if (
    request.destination === 'image' ||
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          // Cache successful responses
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Network-first for API calls
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});
