# LAPORAN QA & ROOT-CAUSE FIX KAMERA — PUTUKA (v4.7.2-PUTUKA-CAMFIX)

- **Build Version**: `v4.7.2-PUTUKA-CAMFIX`
- **Service Worker Cache**: `micro-ledger-pwa-v4.7.2-putuka-camfix-20261104`
- **Target Deployment**: GitHub Pages (root repository / `/PUTUKA/` subpath)

## 1. Analisis Akar Masalah (*Root-Cause Analysis*) Mengapa Kamera Terlihat Sangat Zoom

1. **Penyebab #1 — CSS `object-fit: cover !important` pada `#workout-video` dan `#workout-canvas`**:
   - Sensor kamera ponsel Android pada umumnya menghasilkan stream optik asli berasio **`3:4` portrait** (`480×640` atau `720×960`) atau **`4:3` landscape** (`640×480`).
   - Saat stream `3:4` (`0.75`) atau `4:3` (`1.3333`) dirender ke dalam panggung portrait `9:16` (`0.5625`) dengan `object-fit: cover`, browser memperbesar (*magnify*) gambar hingga memenuhi tinggi `16` lalu **memotong sisi kiri dan kanan sebesar 25% (pada stream 3:4) hingga 58% (pada stream 4:3)**. Akibatnya sudut pandang (*field of view*) menyempit drastis dan tubuh pengguna tampak sangat dekat/zoom.
2. **Penyebab #2 — Constraint `getUserMedia` yang Memaksakan `aspectRatio: 9/16` & `720×1280`**:
   - Pada Chrome Android (WebRTC / Camera2 HAL), permintaan `aspectRatio: { ideal: 9 / 16 }` dengan `width: 720, height: 1280` memicu WebRTC *video adapter* (`resizeMode: "crop-and-scale"`) untuk memotong sensor optik 4:3 secara digital menjadi 9:16 bahkan sebelum frame diterima oleh elemen `<video>`.

## 2. Solusi Teknis yang Diterapkan (`v4.7.2-PUTUKA-CAMFIX`)

1. **Pengembalian ke `object-fit: contain` dengan Kotak & Transformasi Identik**:
   - `#workout-video, #workout-canvas` dikembalikan ke `object-fit: contain !important; object-position: center center !important; width: 100% !important; height: 100% !important; transform: none !important;`.
   - Seluruh bidang tangkapan sensor kamera (100% FOV) tampil utuh di dalam panggung 9:16 tanpa pemotongan piksel sedikit pun. Ruang hitam (*letterbox/pillarbox*) di tepi frame menjadi latar alami di dalam panggung `#05070c` sehingga seluruh tubuh jauh lebih mudah masuk ke dalam layar saat workout.
   - Ukuran panggung `#workout-camera-stage` dipertahankan persis pada rasio portrait `9:16` (`max-width: min(340px, calc(100vw - 1.5rem)) !important; aspect-ratio: 9 / 16 !important;`) beserta fitur Fullscreen.
2. **Constraint Kamera Natural Tanpa Pemaksaan Rasio 9:16 & Tanpa Digital Zoom**:
   - `WorkoutEngine.requestCameraStreamWithFallback()` diperbarui agar **tidak** memaksakan `aspectRatio: 9/16` atau `720×1280`:
     - **Tier 1**: `{ video: { facingMode: { ideal: targetFacing }, resizeMode: { ideal: 'none' }, width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 30, max: 30 } }, audio: false }` (meminta stream sensor asli tanpa *crop-and-scale* WebRTC).
     - **Tier 2**: `{ video: { facingMode: { ideal: targetFacing } }, audio: false }`.
     - **Tier 3**: `{ video: { facingMode: targetFacing }, audio: false }`.
     - **Tier 4**: `{ video: true, audio: false }`.
   - Menambahkan `WorkoutEngine.ensureNaturalWideTrackFov(stream)` yang memeriksa `track.getCapabilities().zoom` dan `track.getSettings().zoom`: bila driver kamera menginisialisasi zoom di atas batas minimum (`> 1.0`), otomatis dinormalisasi ke `minZoom` (`1.0x`) tanpa pernah menambahkan zoom digital.
3. **Audit Dimensi Feed Kamera Aktif (`WorkoutEngine.auditActiveCameraFeed()`)**:
   - Mengaudit secara otomatis `video.videoWidth`, `video.videoHeight`, `MediaStreamTrack.getSettings()`, `canvas.width`, `canvas.height`, kesamaan ukuran bitmap (`bitmapDimensionsIdentical`), `object-fit`, serta geometri area tampilan (`displayedContentBox`) setiap kali stream aktif atau berubah resolusi, dan menampilkannya pada baris ke-5 panel **Pengaturan → Perangkat & Izin** (`#dev-status-cam-feed`).
4. **Penyelarasan 1:1 Video, Canvas, Skeleton MoveNet, Mirror Mode, dan Poin**:
   - Karena `renderLoop()` menyamakan `canvas.width = video.videoWidth` dan `canvas.height = video.videoHeight` lalu menggambar frame video sekaligus titik/garis pose MoveNet ke bitmap `<canvas>` yang sama sebelum ditampilkan dengan `object-fit: contain`, posisi kerangka MoveNet selalu sejajar 1:1 dengan tubuh pengguna pada rasio kamera apa pun (`3:4`, `4:3`, `9:16`, `1:1`, `16:9`) dan pada mode kamera depan (`mirrorMode: true`) maupun belakang (`mirrorMode: false`).

## 3. Hasil Pengujian Multi-Rasio Feed Kamera (Headless Chromium 155)

| Rasio & Resolusi Feed Uji | `videoWidth × videoHeight` | `canvasWidth × canvasHeight` | `object-fit` Video & Canvas | Kotak Tampilan (`displayedContentBox`) di Stage `338×602` | FOV Utuh (Tanpa Crop) | Skeleton & Repetisi Akurat |
|---|---|---|---|---|---|---|
| **3:4 Portrait** (Standar Android) | `480 × 640` (`0.7500`) | `480 × 640` | `contain` / `contain` | `338.00 × 450.67 px` (`offsetX: 0, offsetY: 75.88`) | **PASS (`true`)** | **PASS (`1 rep`, `0.0px drift`)** |
| **3:4 HD Portrait** | `720 × 960` (`0.7500`) | `720 × 960` | `contain` / `contain` | `338.00 × 450.67 px` (`offsetX: 0, offsetY: 75.88`) | **PASS (`true`)** | **PASS (`1 rep`, `0.0px drift`)** |
| **4:3 Landscape Sensor** | `640 × 480` (`1.3333`) | `640 × 480` | `contain` / `contain` | `338.00 × 253.50 px` (`offsetX: 0, offsetY: 174.47`) | **PASS (`true`)** | **PASS (`1 rep`, `0.0px drift`)** |
| **9:16 Portrait Native** | `720 × 1280` (`0.5625`) | `720 × 1280` | `contain` / `contain` | `338.00 × 600.89 px` (`offsetX: 0, offsetY: 0.77`) | **PASS (`true`)** | **PASS (`1 rep`, `0.0px drift`)** |
| **1:1 Square Sensor** | `640 × 640` (`1.0000`) | `640 × 640` | `contain` / `contain` | `338.00 × 338.00 px` (`offsetX: 0, offsetY: 132.22`) | **PASS (`true`)** | **PASS (`0.0px drift`)** |
| **16:9 Wide Sensor** | `1280 × 720` (`1.7778`) | `1280 × 720` | `contain` / `contain` | `338.00 × 190.12 px` (`offsetX: 0, offsetY: 206.16`) | **PASS (`true`)** | **PASS (`0.0px drift`)** |

## 4. Matriks QA (`PASS` / `FAIL` / `NOT TESTED`)

| ID | Area Pengujian | Hasil | Bukti Verifikasi |
|---|---|---|---|
| **QA-01** | Audit `videoWidth`, `videoHeight`, & `MediaStreamTrack.getSettings()` | **PASS** | `WorkoutEngine.auditActiveCameraFeed()` merekam dimensi video, canvas, `trackSettings` (`width`, `height`, `aspectRatio`, `frameRate`, `facingMode`, `resizeMode`, `zoom`), dan `displayedContentBox`. |
| **QA-02** | Pengembalian ke `object-fit: contain` (FOV Utuh Tanpa Crop) | **PASS** | `#workout-video` & `#workout-canvas` terukur `object-fit: contain`, `object-position: 50% 50%`, `transform: none` pada seluruh 6 rasio feed dan 5 ukuran layar (`320×568` s.d. `844×390`). |
| **QA-03** | Identitas Transformasi, Skala, Posisi & Kotak `<video>` dan `<canvas>` | **PASS** | `identicalVideoAndCanvasClientRect: true` dan `bitmapDimensionsIdentical: true` di seluruh pengujian. |
| **QA-04** | Akurasi Skeleton MoveNet, Mirror Mode, Repetisi & Poin | **PASS** | Simulasi Push-up (`3:4` mirror, `4:3` non-mirror, `9:16` mirror) dan Sit-up (`3:4` mirror) menghitung repetisi dan poin secara akurat dengan koordinat keypoint sejajar 1:1. |
| **QA-05** | Pertahanan Frame 9:16 Portrait & Fullscreen | **PASS** | `#workout-camera-stage` mempertahankan rasio `0.5625` (`9:16`) di seluruh viewport; Fullscreen beserta fallback tetap utuh. |
| **QA-06** | Fallback `getUserMedia` Tanpa Memaksa 9:16 & Tanpa Digital Zoom | **PASS** | `zeroForced916Crop: true`, `tier1RequestsResizeModeNone: true`, `zoomResetAppliedWhenZoomedIn: true`. |
| **QA-07** | Regresi Fitur Workout, Ceklis Harian, Streak, Keuangan & Path Aset Root | **PASS** | Seluruh modul lain dan path aset root (`./favicon.png`, `./icon-192.png`, `./icon-512.png`, dll.) tetap berfungsi tanpa error (`js_errors: []`). |
| **QA-08** | Pengujian Kamera Fisik pada Perangkat Android Nyata | **NOT TESTED** | Lingkungan pengujian tidak memiliki perangkat keras Android fisik; perlu diverifikasi langsung pada perangkat Chrome Android. |
