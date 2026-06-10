const CACHE_NAME = 'poketools-v6-core';
const DATA_CACHE = 'poketools-v6-data';
const IMAGE_CACHE = 'poketools-v6-images';

const ASSETS = [
    './',
    './index.html',
    'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => Promise.all(
            keys.map((key) => {
                if (key !== CACHE_NAME && key !== DATA_CACHE && key !== IMAGE_CACHE) {
                    return caches.delete(key);
                }
            })
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    const url = new URL(e.request.url);

    // 1. Images: Cache First, Fallback to Network (allow opaque for CDN)
    if (url.pathname.endsWith('.png') || url.href.includes('sprites')) {
        e.respondWith(
            caches.open(IMAGE_CACHE).then(cache => {
                return cache.match(e.request).then(cachedResponse => {
                    return cachedResponse || fetch(e.request, { mode: 'no-cors' }).then(networkResponse => {
                        cache.put(e.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            })
        );
        return;
    }

    // 2. Data APIs: Stale-While-Revalidate (Fastest feel)
    if (url.href.includes('pokeapi.co')) {
        e.respondWith(
            caches.open(DATA_CACHE).then(cache => {
                return cache.match(e.request).then(cachedResponse => {
                    const fetchPromise = fetch(e.request).then(networkResponse => {
                        cache.put(e.request, networkResponse.clone());
                        return networkResponse;
                    }).catch(() => cachedResponse); // If offline, return cache
                    return cachedResponse || fetchPromise;
                });
            })
        );
        return;
    }

    // 3. App Shell
    e.respondWith(
        caches.match(e.request).then(response => response || fetch(e.request))
    );
});