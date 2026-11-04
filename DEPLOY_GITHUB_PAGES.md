# PANDUAN DEPLOY & UJI MANUAL CHROME ANDROID — PUTUKA v4.7.2-PUTUKA-CAMFIX

## 1. File yang Perlu Diperbarui di Branch GitHub Pages
Unggah file terbaru dari paket `PUTUKA-GITHUB-PAGES-FINAL.zip` ke root branch GitHub Pages Anda:
- `index.html` (wajib diperbarui — berisi perbaikan kamera `v4.7.2-PUTUKA-CAMFIX`)
- `sw.js` (wajib diperbarui — berisi cache version `micro-ledger-pwa-v4.7.2-putuka-camfix-20261104` agar PWA di Android mengambil `index.html` baru)
- `manifest.json` dan file ikon root (`favicon.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-512-maskable.png`, `app-icon-original.png`) tetap berada di root.

## 2. Langkah Verifikasi Kamera di Chrome Android
1. Setelah commit ke GitHub Pages selesai dipublikasikan (1–2 menit), buka PUTUKA di **Chrome Android** dan lakukan **Refresh** halaman 1–2 kali.
2. Cek di **Pengaturan → Tentang Aplikasi** bahwa versi telah berubah menjadi `Build v4.7.2-PUTUKA-CAMFIX`.
3. Buka tab **AI Workout** dan ketuk **Mulai Kamera Workout**:
   - Pastikan tampilan kamera kini memiliki sudut pandang (*field of view*) normal dan luas (`object-fit: contain`) sehingga seluruh tubuh lebih mudah terlihat tanpa harus mundur jauh.
   - Pastikan kerangka hijau MoveNet tetap tepat mengikuti sendi tubuh pada kamera depan (mirror) maupun kamera belakang, baik pada mode biasa maupun **Fullscreen**.
4. Buka **Pengaturan → Perangkat & Izin** pada baris **5. Feed Kamera & Fit Layar** untuk melihat resolusi aktual stream kamera perangkat Anda (mis. `480×640 (contain) ✓`).
