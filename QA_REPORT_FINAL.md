# LAPORAN QA & AUDIT REGRESI — PUTUKA FINAL POLISH (v4.7.1)

- **Build Version**: `v4.7.1-PUTUKA-FINAL-POLISH`
- **Service Worker Cache**: `micro-ledger-pwa-v4.7.1-putuka-polish-20261104`
- **Target Branch / Deployment**: GitHub Pages (root repository / `/PUTUKA/` subpath)

## 1. Ringkasan Penyelesaian 3 Prioritas Utama

### Prioritas A — Camera Fit di Dalam Frame Portrait 9:16
- **Akar Masalah Sebelumnya (`v4.7.0`)**: `#workout-video` dan `#workout-canvas` menggunakan `object-fit: contain`. Pada perangkat Android (Chrome Android), sensor kamera depan/belakang umumnya mengirimkan stream berasio `3:4` (`480×640` / `720×960`) atau `4:3` (`640×480`), sehingga di dalam panggung portrait `9:16` muncul area kosong hitam (*letterbox*) di bagian atas dan bawah yang membuat tampilan live camera terlihat mengecil di tengah frame.
- **Solusi Teknis (`v4.7.1`)**:
  1. Mengubah `#workout-video, #workout-canvas` menjadi `object-fit: cover !important; object-position: center center !important; width: 100% !important; height: 100% !important;`.
  2. Memperluas `max-width` `#workout-camera-stage` pada layar portrait mobile dari `min(340px, calc(100vw - 1.5rem))` menjadi `min(400px, calc(100vw - 1.25rem))` agar bidang 9:16 memanfaatkan lebar layar ponsel modern secara proporsional.
  3. Menyempurnakan urutan fallback `requestCameraStreamWithFallback()` agar Tier 1 (`720×1280`, `aspectRatio: 9/16`) dan Tier 2 (`aspectRatio: 9/16` dengan `facingMode`) meminta rasio portrait langsung ke HAL kamera Android.
  4. **Penyelarasan Koordinat 1:1 Video & Skeleton MoveNet**: Karena `<video id="workout-video">` disembunyikan (`.hidden`) dan `WorkoutEngine.renderLoop()` menggambar frame video (`ctx.drawImage(video, 0, 0, vw, vh)`) sekaligus titik/garis kerangka pose MoveNet (`this.processPoseAndDraw(ctx, poses[0], vw, vh)`) ke **satu bitmap `<canvas id="workout-canvas">` yang sama (`vw × vh`)**, penerapan `object-fit: cover` pada `<canvas>` menskalakan gambar kamera dan kerangka pose secara serempak tanpa pergeseran koordinat (*zero coordinate drift*).

### Prioritas B — Humanisasi Teks Antarmuka (UI Copy)
- **Header Ceklis Harian**: Mengubah `"Ceklis Harian MVP"` menjadi `"Ceklis Harian"`.
- **Pembersihan Label Zona Waktu Teknis**: Menyembunyikan badge `#chk-timezone-badge` (`"Asia/Makassar"` / `"Zona Lokal"`) dari header Ceklis Harian dan menghapus akhiran teknis `"• Zona: Asia/Makassar"` pada subteks streak (`#chk-streak-subtext`), sementara fungsi internal `ChecklistEngine.getUserTimezone()`, `ChecklistEngine.getLocalDateString()`, dan `StreakEngine` tetap menggunakan tanggal dan zona waktu lokal perangkat secara utuh.
- **Perapian Istilah Teknis di Seluruh Modul**:
  - `"Riwayat Mutasi Terbaru"` → `"Riwayat Transaksi Terbaru"`
  - `"Modul Sensor Kamera AI"` → `"Kamera AI Workout Siap"`
  - `"Aktifkan Sensor Kamera"` → `"Mulai Kamera Workout"`
  - `"Otorisasi Sensor Kamera & AI"` → `"Izin Akses Kamera Workout"`
  - `"Kalman 1D Stabilizer"` → `"Pelacak Postur Akurat"`
  - `"Viewport Determinism & Chrome Bar"` → `"Penyesuaian Layar Mobile"`
  - `"Local-First, Kontrak Simetris, Rollback & Anti-Resurrection"` → `"Data tersimpan aman di perangkat dan siap dicadangkan kapan saja"`
  - `"TOMBSTONE DELETE"` → `"RIWAYAT DIHAPUS"`
  - `"Tugas Aktif Selesai: X/Y (× Tidak Ada: Z dikecualikan)"` → `"Tugas selesai: X dari Y"`

### Prioritas C — Audit Path Aset Kanonis & Regresi PWA
- **Akar Masalah Sebelumnya**: Pada repository GitHub branch utama GitHub Pages, file ikon (`favicon.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-512-maskable.png`, `app-icon-original.png`) ditempatkan langsung di **root** sejajar dengan `index.html`, sedangkan referensi lama menunjuk ke `./icons/...`.
- **Solusi Kanonis (`v4.7.1`)**:
  - Menetapkan satu struktur path kanonis berbasis **root** (`./favicon.png`, `./apple-touch-icon.png`, `./icon-192.png`, `./icon-512.png`, `./icon-512-maskable.png`) secara konsisten di `index.html`, `manifest.json`, `sw.js` (`CORE_ASSETS`), dan struktur root `PUTUKA-GITHUB-PAGES-FINAL.zip`.
  - Menghapus ketergantungan ke `offline.html` eksternal dan menyelaraskan indikator diagnostik ke-6 pada `PWAEngine` untuk memverifikasi keberadaan `manifest.json` dan `icon-192.png` di Cache Storage.

## 2. Matriks QA (`PASS` / `FAIL` / `NOT TESTED`)

| ID | Area Pengujian | Hasil | Bukti Verifikasi |
|---|---|---|---|
| **QA-01** | Frame Kamera 9:16 Portrait & `object-fit: cover` | **PASS** | `#workout-camera-stage` rasio `0.5625` (`9:16`) di `320×568` (`250×444`), `360×800` (`336×597`), `390×844` (`366×651`), `412×915` (`388×690`), `844×390` (`250×444`); `#workout-video` & `#workout-canvas` `object-fit: cover`, mengisi 100% frame tanpa bar hitam atas/bawah. |
| **QA-02** | Penyelarasan Skeleton MoveNet & Perhitungan Repetisi | **PASS** | Video dan skeleton digambar ke bitmap `<canvas>` yang sama (`vw × vh`); simulasi siklus Push-up pada stream `480×640` (`3:4`) di dalam stage `9:16` menghitung `+1 Poin` (`repCount === 1`) secara akurat. |
| **QA-03** | Tombol Fullscreen Kamera & Fallback | **PASS** | `#btn-fullscreen-camera` memanggil Fullscreen API pada `#workout-camera-stage` dengan rasio 9:16 terjaga dan menampilkan pesan ramah bila browser tidak mendukung. |
| **QA-04** | Kartu Izin Kamera (`#workout-placeholder`) di Dalam Frame | **PASS** | `placeholderInsideStage: true` pada seluruh 5 ukuran viewport uji (`320px` s.d. `844px`), tanpa elemen keluar dari frame. |
| **QA-05** | Header Ceklis Harian (`"Ceklis Harian"` & Tanpa `"Asia/Makassar"`) | **PASS** | `zeroCeklisHarianMVP: true`, `zeroAsiaMakassarVisible: true`, `zeroZonaLokalVisible: true`; fungsi internal `getUserTimezone()` & `getLocalDateString()` tetap aktif. |
| **QA-06** | Humanisasi Teks UI Seluruh Modul | **PASS** | Seluruh label teknis/jargon telah diganti dengan bahasa Indonesia yang natural dan ringkas di Dashboard, Buku Besar, AI Workout, Ceklis Harian, dan Pengaturan. |
| **QA-07** | Konsistensi Path Aset Root (`index.html`, `manifest.json`, `sw.js`, ZIP) | **PASS** | Seluruh 10 endpoint aset root mengembalikan `HTTP 200` pada simulasi subpath `/PUTUKA/`; `zero_legacy_icons_subfolder_refs: true`. |
| **QA-08** | Regresi Navigasi, Ceklis 4-Status, Streak, Recovery 5/7, Milestone, Ekspor/Impor, Reset Data | **PASS** | `bukaCeklisOk: true`, `aturJadwalOk: true` (tanpa auto-start kamera), `streakTodayQualified: true`, `exportOk: true`, `resetGuardOk: true`, `js_errors: []`. |
| **QA-09** | Kamera Fisik & Instalasi WebAPK pada Perangkat Android Nyata | **NOT TESTED** | Sandbox VM tidak memiliki kamera fisik atau perangkat Android fisik; langkah uji manual Chrome Android disertakan di bawah. |
