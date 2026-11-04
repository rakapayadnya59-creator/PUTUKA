/**
 * PUTUKA — Production Service Worker (GitHub Pages Root & Subpath Safe)
 * Build: v4.7.2-PUTUKA-CAMFIX
 * Canonical Asset Layout: Root-level icons (./favicon.png, ./apple-touch-icon.png, ./icon-192.png, ./icon-512.png, ./icon-512-maskable.png)
 */

const CACHE_NAME = 'micro-ledger-pwa-v4.7.2-putuka-camfix-20261104';

const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './favicon.png',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png'
];

const CDN_HOSTS = [
  'cdn.tailwindcss.com',
  'cdn.jsdelivr.net',
  'www.gstatic.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      for (const relUrl of CORE_ASSETS) {
        try {
          const req = new Request(relUrl, { cache: 'reload' });
          const res = await fetch(req);
          if (res && res.ok) {
            await cache.put(relUrl, res.clone());
          }
        } catch (err) {
          console.warn('[PUTUKA SW] Precache skipped for:', relUrl, err);
        }
      }
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key.startsWith('micro-ledger-pwa-')) {
            return caches.delete(key);
          }
          return Promise.resolve();
        })
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data.type === 'GET_SW_STATUS' && event.ports && event.ports[0]) {
    event.ports[0].postMessage({
      status: 'active',
      cacheName: CACHE_NAME,
      coreAssets: CORE_ASSETS
    });
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  if (
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('identitytoolkit.googleapis.com') ||
    url.hostname.includes('securetoken.googleapis.com')
  ) {
    return;
  }

  if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      (async () => {
        try {
          const networkResp = await fetch(request);
          if (networkResp && networkResp.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put('./index.html', networkResp.clone());
          }
          return networkResp;
        } catch (err) {
          const cache = await caches.open(CACHE_NAME);
          const cachedIndex = (await cache.match('./index.html')) || (await cache.match('./'));
          if (cachedIndex) return cachedIndex;
          return new Response(
            '<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PUTUKA Offline</title></head><body style="background:#05070c;color:#f8fafc;font-family:sans-serif;padding:2rem;text-align:center;"><h2>PUTUKA Sedang Offline</h2><p>Muat ulang halaman saat koneksi tersedia.</p></body></html>',
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        }
      })()
    );
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request);
        const fetchPromise = fetch(request)
          .then((netResp) => {
            if (netResp && netResp.ok) {
              cache.put(request, netResp.clone());
            }
            return netResp;
          })
          .catch(() => null);

        if (cached) {
          event.waitUntil(fetchPromise);
          return cached;
        }
        const netResp = await fetchPromise;
        if (netResp) return netResp;
        return new Response('', { status: 504, statusText: 'Offline' });
      })()
    );
    return;
  }

  if (CDN_HOSTS.some((h) => url.hostname === h || url.hostname.endsWith('.' + h))) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request);
        if (cached) {
          event.waitUntil(
            fetch(request)
              .then((netResp) => {
                if (netResp && (netResp.ok || netResp.type === 'opaque')) {
                  cache.put(request, netResp.clone());
                }
              })
              .catch(() => {})
          );
          return cached;
        }
        try {
          const netResp = await fetch(request);
          if (netResp && (netResp.ok || netResp.type === 'opaque')) {
            cache.put(request, netResp.clone());
          }
          return netResp;
        } catch (err) {
          return new Response('', { status: 504, statusText: 'CDN Offline' });
        }
      })()
    );
  }
});
