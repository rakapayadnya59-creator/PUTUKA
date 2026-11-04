# PANDUAN DEPLOYMENT GITHUB PAGES & INSTALASI PWA ANDROID — PUTUKA (`v4.7.0-PUTUKA-FINAL-20261104`)

Dokumen ini berisi langkah manual terstruktur untuk mempublikasikan paket `PUTUKA-GITHUB-PAGES-FINAL.zip` ke repositori **GitHub Pages** (baik pada domain root `username.github.io` maupun project site `username.github.io/nama-repo/`), cara menginstal PWA di Chrome Android, serta prosedur pembaruan (*update*) dan *rollback* yang aman.

---

## 1. Persiapan & Ekstraksi Paket

1. Unduh file **`PUTUKA-GITHUB-PAGES-FINAL.zip`** lalu ekstrak di komputer atau perangkat Anda.
2. Pastikan di tingkat terluar hasil ekstraksi (**root**) langsung terdapat file berikut (jangan membungkusnya di dalam sub-folder tambahan):
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `offline.html`
   - `.nojekyll`
   - `icons/` (`favicon.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-512-maskable.png`)
   - `assets/branding/source/app-icon-original.png`
3. **Penting (Keamanan & Kebersihan Repository)**:
   - Hapus file lama yang tidak lagi digunakan di repositori jika sebelumnya ada file duplikat seperti `index (1).html`, `manifest.webmanifest` lama yang berbeda isi, atau `app-192.png` / `app-512.png` di root.
   - Jangan pernah mengunggah file cadangan pribadi (`cadangan-micro-ledger-*.json`) atau kredensial rahasia ke repositori publik.

---

## 2. Langkah Unggah & Konfigurasi GitHub Pages

1. Buka repositori GitHub proyek Anda (misalnya branch `main` di root `/`).
2. Unggah seluruh file dan folder dari hasil ekstraksi `PUTUKA-GITHUB-PAGES-FINAL.zip` langsung ke **root** repositori, lalu lakukan **Commit changes**.
3. Buka tab **Settings** pada repositori GitHub ➔ pilih menu **Pages** di panel kiri.
4. Pada bagian **Build and deployment**:
   - **Source**: pilih `Deploy from a branch`.
   - **Branch**: pilih `main` (atau branch utama Anda) dan folder `/ (root)`, lalu klik **Save**.
5. Tunggu sekitar 1–2 menit hingga workflow *pages-build-deployment* selesai dan menampilkan URL publik HTTPS (contoh: `https://username.github.io/nama-repo/`).
6. Keberadaan file `.nojekyll` di root memastikan GitHub Pages menyajikan seluruh folder dan aset statis apa adanya tanpa pemrosesan Jekyll.

---

## 3. Verifikasi & Instalasi PWA pada Chrome Android

1. Buka URL HTTPS GitHub Pages Anda menggunakan **Google Chrome di Android**.
2. Buka tab **Pengaturan** (ikon roda gigi di kanan bawah) ➔ pilih **6. Tentang Aplikasi**:
   - Pastikan versi tertulis **`PUTUKA Final Release • Build v4.7.0-PUTUKA-FINAL-20261104`**.
   - Pastikan indikator **1. Manifest Valid** dan **2. SW Registered** berwarna hijau (`✓`).
3. Ketuk menu titik tiga Chrome di pojok kanan atas ➔ pilih **Tambahkan ke layar utama** (*Add to Home screen*) atau **Instal aplikasi** (*Install app*), atau gunakan tombol **Instal Aplikasi ke Layar Utama (PWA)** di halaman *Tentang Aplikasi*.
4. Setelah ikon **PUTUKA** muncul di layar utama Android:
   - Buka aplikasi dari ikon tersebut.
   - Pastikan hanya muncul *native launch screen* bawaan Android/Chrome (latar `#05070b` + ikon resmi PUTUKA) dan langsung masuk ke aplikasi tanpa *double splash screen*.

---

## 4. Prosedur Update Versi Baru Tanpa Kehilangan Data Lokal

1. Seluruh data transaksi keuangan, riwayat workout, ceklis harian, jadwal, dan streak disimpan di penyimpanan lokal browser/PWA (`localStorage` & `IndexedDB`) pada origin domain GitHub Pages Anda.
2. Saat build baru diunggah ke GitHub Pages, `sw.js` menggunakan identifier cache baru (`micro-ledger-pwa-v4.7.0-putuka-final-20261104`).
3. Untuk menerapkan pembaruan pada PWA yang sudah terinstal di Android:
   - **Jangan menghapus data situs / Clear Storage** jika Anda tidak ingin menghapus data lokal.
   - Cukup buka aplikasi saat terhubung ke internet (Service Worker baru akan mengunduh `index.html` terbaru dan menjalankan `skipWaiting()` + menghapus cache `micro-ledger-pwa-*` versi lama secara otomatis), lalu **tutup dan buka kembali (reopen)** aplikasi atau lakukan *pull-to-refresh*.
4. Sebagai langkah pengamanan tambahan sebelum melakukan update besar, Anda selalu dapat mengunduh file cadangan melalui **Pengaturan ➔ 4. Data & Cadangan ➔ Ekspor Cadangan Penuh (.json)**.
