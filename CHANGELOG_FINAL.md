# CHANGELOG — PUTUKA v4.7.2-PUTUKA-CAMFIX

## Perubahan pada `v4.7.2-PUTUKA-CAMFIX` (Final Camera Root-Cause Fix)
1. **Pengembalian `#workout-video` & `#workout-canvas` ke `object-fit: contain` (`index.html`)**:
   - Mengganti `object-fit: cover !important` menjadi `object-fit: contain !important; object-position: center center !important; transform: none !important;` agar 100% bidang pandang (*field of view*) kamera tampil utuh tanpa terpotong di sisi kiri/kanan.
   - Mengembalikan batas lebar maksimum `#workout-camera-stage` ke ukuran proporsional `min(340px, calc(100vw - 1.5rem)) !important` dengan rasio tetap `9:16` dan fitur Fullscreen utuh.
2. **Pencegahan Crop Sensor di `requestCameraStreamWithFallback()` & Reset Zoom (`index.html`)**:
   - Menghapus pemaksaan `aspectRatio: { ideal: 9 / 16 }` dan `width: 720, height: 1280` yang menyebabkan WebRTC/Camera2 memotong sensor 4:3 secara digital.
   - Meminta `resizeMode: { ideal: 'none' }` dengan resolusi sensor natural pada Tier 1 serta menyediakan fallback bertingkat (`facingMode` ideal → `facingMode` langsung → `video: true`).
   - Menambahkan `ensureNaturalWideTrackFov(stream)` untuk memastikan zoom kamera berada pada nilai minimum natural (`1.0x`) bila didukung perangkat.
3. **Audit Feed Kamera Aktif (`WorkoutEngine.auditActiveCameraFeed()`)**:
   - Merekam `video.videoWidth`, `video.videoHeight`, `MediaStreamTrack.getSettings()`, dimensi `<canvas>`, serta kotak area tampilan (`displayedContentBox`) dan menampilkannya pada panel **Pengaturan → Perangkat & Izin** (`#dev-status-cam-feed`).
4. **Pembaruan Versi Cache Service Worker (`sw.js`)**:
   - Memperbarui `CACHE_NAME` ke `micro-ledger-pwa-v4.7.2-putuka-camfix-20261104`.
