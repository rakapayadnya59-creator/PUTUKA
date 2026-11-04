# CHANGELOG — PUTUKA v4.7.1-PUTUKA-FINAL-POLISH

## Perubahan pada `v4.7.1-PUTUKA-FINAL-POLISH`
1. **Prioritas A — Perbaikan Camera Fit di Dalam Frame 9:16 (`index.html`)**:
   - Mengubah aturan CSS `#workout-video, #workout-canvas` dari `object-fit: contain` menjadi `object-fit: cover !important; object-position: center center !important; width: 100% !important; height: 100% !important;` sehingga gambar live camera memenuhi seluruh bidang portrait 9:16 tanpa menyisakan bar hitam atas/bawah pada stream kamera mobile `3:4` atau `4:3`.
   - Memperluas batas lebar maksimum `#workout-camera-stage` pada layar portrait mobile menjadi `min(400px, calc(100vw - 1.25rem))` agar proporsi frame kamera lebih lega di layar ponsel Android modern.
   - Memperbarui urutan fallback `WorkoutEngine.requestCameraStreamWithFallback()` agar memprioritaskan `aspectRatio: { ideal: 9 / 16 }` pada Tier 1 dan Tier 2 sebelum fallback generik.
2. **Prioritas B — Humanisasi Teks Antarmuka (`index.html`)**:
   - Mengganti judul `"Ceklis Harian MVP"` menjadi `"Ceklis Harian"`.
   - Menyembunyikan badge `#chk-timezone-badge` (`"Asia/Makassar"` / `"Zona Lokal"`) dari tampilan header Ceklis Harian serta menghapus akhiran `"• Zona: Asia/Makassar"` pada `#chk-streak-subtext`, sambil mempertahankan logika tanggal dan zona waktu lokal di balik layar.
   - Mengganti istilah teknis/audit (`"Riwayat Mutasi Terbaru"`, `"Modul Sensor Kamera AI"`, `"Otorisasi Sensor Kamera & AI"`, `"Kalman 1D Stabilizer"`, `"Viewport Determinism & Chrome Bar"`, `"TOMBSTONE DELETE"`, dll.) menjadi kalimat antarmuka pengguna berbahasa Indonesia yang natural.
3. **Prioritas C — Penyelarasan Path Aset Kanonis Root & Service Worker (`index.html`, `manifest.json`, `sw.js`, `PUTUKA-GITHUB-PAGES-FINAL.zip`)**:
   - Menyelaraskan seluruh path ikon ke level root (`./favicon.png`, `./apple-touch-icon.png`, `./icon-192.png`, `./icon-512.png`, `./icon-512-maskable.png`) sesuai struktur repository branch utama GitHub Pages.
   - Memperbarui `CACHE_NAME` di `sw.js` menjadi `micro-ledger-pwa-v4.7.1-putuka-polish-20261104` dengan `CORE_ASSETS` yang menunjuk langsung ke aset root.
