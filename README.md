# PUTUKA — Micro Ledger & AI Workout PWA (Tahap 2 Final)
**Build Version**: `v4.2.0-PUTUKA-T2`  
**Service Worker Cache**: `micro-ledger-pwa-v4.2.0-putuka-t2`

## Struktur Paket Root-Ready
Seluruh berkas di dalam paket ini siap diunggah langsung ke root repositori GitHub Pages, Netlify, Vercel, Firebase Hosting, atau server statis HTTPS tanpa perlu mengubah struktur folder:
- `index.html` — Aplikasi utama Single-Page PWA (Buku Besar, AI Workout, Jadwal, Pengaturan, Sinkronisasi Cloud, & Reset Data).
- `manifest.json` — Konfigurasi Web App Manifest dengan jalur relatif root (`./`) dan pemisahan ikon `any` vs `maskable`.
- `sw.js` — Service Worker (`micro-ledger-pwa-v4.2.0-putuka-t2`) dengan strategi *Network-First* untuk navigasi dan *Stale-While-Revalidate* untuk aset statis.
- `offline.html` — Halaman fallback offline mandiri.
- Ikon PWA disimpan di root repository: `favicon.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-512-maskable.png`.
- `LAPORAN_TAHAP_2_PUTUKA.md` — Laporan teknis, penjelasan *App Icon vs Native Splash Screen*, dan hasil verifikasi 20 poin.
- `CHANGELOG_TAHAP_2_PUTUKA.md` — Riwayat perubahan Tahap 2.
- `BUILD_INFO.txt` — Informasi versi dan daftar checksum SHA-256 setiap file.
