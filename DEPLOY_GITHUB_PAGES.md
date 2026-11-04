# PANDUAN DEPLOY & UJI MANUAL CHROME ANDROID — PUTUKA v4.7.1

## 1. Struktur File Root Kanonis (Root Repository)
Pastikan seluruh file hasil ekstraksi `PUTUKA-GITHUB-PAGES-FINAL.zip` berada langsung di root branch yang menjadi sumber GitHub Pages:
- `index.html`
- `manifest.json`
- `sw.js`
- `favicon.png` (64×64)
- `apple-touch-icon.png` (180×180)
- `icon-192.png` (192×192, `purpose: "any"`)
- `icon-512.png` (512×512, `purpose: "any"`)
- `icon-512-maskable.png` (512×512, `purpose: "maskable"`)
- `app-icon-original.png` (1000×1000, arsip sumber original)
- `.nojekyll`

## 2. Langkah Pembaruan PWA di Chrome Android
1. Unggah dan commit file `index.html`, `manifest.json`, dan `sw.js` terbaru ke branch utama GitHub Pages di GitHub, lalu tunggu sekitar 1–2 menit hingga GitHub Pages selesai mempublikasikan build terbaru.
2. Buka aplikasi PUTUKA atau halaman GitHub Pages PUTUKA di **Chrome Android**, lalu lakukan **muat ulang halaman (Refresh)** satu atau dua kali agar Service Worker `micro-ledger-pwa-v4.7.1-putuka-polish-20261104` aktif dan mengambil alih halaman.
3. Buka tab **Ceklis Harian** dan pastikan:
   - Header menampilkan **"Ceklis Harian"** (bukan lagi `"Ceklis Harian MVP"`).
   - Tidak ada lagi badge **"Asia/Makassar"** atau **"Zona Lokal"** yang mengganggu di samping judul atau subteks streak.
4. Buka tab **AI Workout** dan ketuk **Mulai Kamera Workout**:
   - Pastikan gambar kamera langsung memenuhi seluruh bidang frame portrait **9:16** secara penuh (`object-fit: cover`) tanpa bar hitam tebal di atas/bawah.
   - Pastikan titik dan garis hijau pendeteksi postur mengikuti tubuh secara presisi pada mode kamera depan maupun belakang, baik dalam tampilan biasa maupun **Fullscreen**.
5. Buka tab **Pengaturan → Tentang Aplikasi** untuk memastikan versi menampilkan `Build v4.7.1-PUTUKA-FINAL-POLISH` dan seluruh status diagnostik PWA berwarna hijau (`✓`).
