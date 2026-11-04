/**
 * Service Worker — PUTUKA (Micro Ledger, AI Workout, Ceklis Harian & Streak Engine)
 * Final Release Build ID: v4.7.0-PUTUKA-FINAL-20261104
 * Cache Namespace: micro-ledger-pwa-v4.7.0-putuka-final-20261104
 * Relative Sub-path Safe (GitHub Pages Project Site /<repo>/ & Root Hosting Compatible)
 *
 * Precache Scope:
 * - Pre-caches Core Local App Shell (./, ./index.html, ./offline.html, ./manifest.json, ./icons/*).
 * - External CDN scripts (Tailwind, Google Fonts, TensorFlow/MoveNet) and Firebase Firestore API streams
 *   are not pre-cached in the local install transaction so a network hiccup never aborts SW installation.
 * - Activate step deletes only older 'micro-ledger-pwa-*' caches and never touches other apps on the same origin.
 */

const CACHE_NAME = 'micro-ledger-pwa-v4.7.0-putuka-final-20261104';

const CORE_ASSETS = [
  './',
  './index.html',
  './offline.html',
  './manifest.json',
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
          // Individual asset failure does not abort core shell installation
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

  // Never intercept Firebase Firestore / Google Identity / Auth API requests
  if (
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('identitytoolkit.googleapis.com') ||
    url.hostname.includes('securetoken.googleapis.com')
  ) {
    return;
  }

  // HTML Navigation Requests: Network-First -> Cached ./index.html -> Cached ./offline.html
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
            '<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PUTUKA Offline</title></head><body style="background:#05070b;color:#f8fafc;font-family:sans-serif;padding:2rem;text-align:center;"><h1>Mode Offline</h1><p>Buka kembali halaman utama setelah koneksi tersedia.</p></body></html>',
            { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        })
    );
    return;
  }

  // Same-Origin Static Assets (Manifest, Icons, Local Assets): Stale-While-Revalidate
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(req);
        const networkPromise = fetch(req)
          .then((networkRes) => {
            if (networkRes && networkRes.ok) {
              cache.put(req, networkRes.clone()).catch(() => {});
            }
            return networkRes;
          })
          .catch(() => cached);
        return cached || networkPromise;
      })
    );
  }
});
