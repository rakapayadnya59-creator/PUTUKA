/**
 * Service Worker — Micro Ledger & AI Workout PWA (PUTUKA Tahap 2)
 * Build Version: micro-ledger-pwa-v4.2.0-putuka-t2
 * Relative Sub-path Safe (GitHub Pages & Root Hosting Compatible)
 *
 * Strategy:
 * - Pre-caches Core App Shell (./, ./index.html, ./offline.html, ./manifest.json, ./manifest.webmanifest, ./icons/*).
 * - Navigation requests: Network-first with automatic fallback to cached ./index.html, then ./offline.html.
 * - Static same-origin assets: Stale-While-Revalidate for instant load + background freshness.
 * - Cleans up all older micro-ledger-pwa-* caches on activate so stale assets never persist.
 */

const CACHE_NAME = 'micro-ledger-pwa-v4.2.0-putuka-t2';

const CORE_ASSETS = [
  './',
  './index.html',
  './offline.html',
  './manifest.json',
  './manifest.webmanifest',
  './icons/favicon.png',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const asset of CORE_ASSETS) {
        try {
          const response = await fetch(asset, { cache: 'reload' });
          if (response && response.ok) {
            await cache.put(asset, response.clone());
          }
        } catch (_) {
          // Continue pre-caching remaining core shell files even if one optional file is unreachable
        }
      }
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key.startsWith('micro-ledger-pwa-')) {
            return caches.delete(key);
          }
          return Promise.resolve();
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Never intercept Firebase Firestore / Google Identity / Auth API mutations or streams
  if (
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('identitytoolkit.googleapis.com') ||
    url.hostname.includes('securetoken.googleapis.com')
  ) {
    return;
  }

  // HTML Navigation Requests: Network-First -> Cached App Shell (index.html) -> Cached offline.html
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.ok && url.origin === self.location.origin) {
            const copy = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', copy)).catch(() => {});
          }
          return networkRes;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          const cachedIndex =
            (await cache.match('./index.html')) ||
            (await cache.match('index.html')) ||
            (await cache.match('./'));
          if (cachedIndex) return cachedIndex;

          const cachedOffline =
            (await cache.match('./offline.html')) ||
            (await cache.match('offline.html'));
          if (cachedOffline) return cachedOffline;

          return new Response(
            '<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><title>Offline</title></head><body style="background:#070a10;color:#f8fafc;font-family:sans-serif;padding:2rem;text-align:center;"><h1>Mode Offline</h1><p>Buka kembali halaman utama setelah koneksi tersedia.</p></body></html>',
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        })
    );
    return;
  }

  // Same-origin static assets: Stale-While-Revalidate
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cachedRes) => {
        const networkFetch = fetch(req)
          .then((networkRes) => {
            if (networkRes && networkRes.ok) {
              const copy = networkRes.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
            }
            return networkRes;
          })
          .catch(() => cachedRes);
        return cachedRes || networkFetch;
      })
    );
  }
});
