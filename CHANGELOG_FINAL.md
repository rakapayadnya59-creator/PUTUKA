# CHANGELOG FINAL — PUTUKA (`v4.7.0-PUTUKA-FINAL-20261104`)

Dokumen ini mencatat perubahan spesifik pada **Tahap Final Expert Release (`v4.7.0-PUTUKA-FINAL-20261104`)** dibandingkan source **Tahap 4 (`v4.6.0-PUTUKA-TAHAP-4`)** beserta alasan setiap patch.

---

## [v4.7.0-PUTUKA-FINAL-20261104] — 2026-11-04 (Release Freeze, Brand Asset Integration & GitHub Pages Packaging)

### 1. Patch Minimal pada `index.html` (Dibandingkan Source Tahap 4 `v4.6.0`)
1. **Penolakan Eksplisit Tanggal Masa Depan & Leading Gap pada `StreakEngine.inspectRecoveryEligibility` (`REC-02` Hardening)**:
   - *Alasan*: Memenuhi syarat uji matriks halaman 3 & 7 (*"Tolak gap di awal/akhir riwayat tanpa aktivitas sesudahnya, dua hari kosong berturut-turut, tanggal masa depan, tanggal sudah dipulihkan, atau klaim kedua pada tanggal yang sama"*).
   - *Perubahan*: Menambahkan pemeriksaan eksplisit `if (targetGapDate > todayLocal)` yang mengembalikan `reasonCode: 'future_date_not_allowed'`, pemeriksaan `targetGapDate === todayLocal` (`reasonCode: 'no_activity_after_gap'`), serta pemeriksaan gap di awal riwayat sebelum aktivitas pertama (`reasonCode: 'leading_gap_no_prior_activity'`).
2. **Guard Atomisitas, Klik Ganda, & Konflik Multi-Tab/Multi-Perangkat pada `StreakEngine.spendRecoveryToken` & `sanitizeStateObject` (`REC-02` / `REC-03` Concurrency)**:
   - *Alasan*: Memastikan satu entitlement token tidak pernah dapat dipakai dua kali akibat klik ganda cepat, dua tab terbuka bersamaan, atau penggabungan (*merge*) dua perangkat offline yang sama-sama mencoba memakai token yang sama.
   - *Perubahan*: Menambahkan mutex `_isSpendingToken`, rekonsiliasi `localStorage` terbaru tepat sebelum commit `spendRecoveryToken`, serta pengurutan deterministik berdasarkan `(spentAt, gapDate)` pada `sanitizeStateObject` saat memvalidasi keunikan `usedTokenIds`.
3. **Sinkronisasi Build Identifier Final & Dokumentasi Offline Jujur pada Panel `#settings-panel-about`**:
   - *Alasan*: Menyelaraskan teks versi di halaman *Tentang Aplikasi* yang sebelumnya masih bertuliskan `v4.2.0-PUTUKA-T2` menjadi `v4.7.0-PUTUKA-FINAL-20261104`, memperbaiki referensi `background_color` menjadi `#05070b` sesuai `manifest.json`, dan merinci secara jujur fitur yang *offline-ready* vs dependensi jaringan eksternal.
4. **Konsolidasi Manifest Kanonis Tunggal (`./manifest.json`)**:
   - *Alasan*: Menghindari duplikasi dua file manifest (`manifest.json` dan `manifest.webmanifest`) di paket rilis final sesuai aturan *anti-file-ganda* Bagian 4 PDF.

### 2. Integrasi Aset Ikon Original Pengguna (Gate G2)
- Mengarsipkan file gambar ikon asli yang diunggah pengguna (`243614.png`, `1000×1000`, `128.203 bytes`, SHA-256: `49d4cc0dfcac4f7321292be372382429a96336f0b1974c85a5d13fe6909aac60`) secara **byte-for-byte tanpa perubahan** di `assets/branding/source/app-icon-original.png`.
- Menghasilkan varian ikon `purpose: "any"` (`icons/icon-512.png` `512×512`, `icons/icon-192.png` `192×192`, `icons/apple-touch-icon.png` `180×180`, `icons/favicon.png` `64×64`) melalui *proportional contain resampling* (`LANCZOS`) tanpa crop, tanpa stretch, dan tanpa manipulasi warna/komposisi.
- Menghasilkan varian `icons/icon-512-maskable.png` (`512×512`, `purpose: "maskable"`) dengan menempatkan keseluruhan gambar `1000×1000` yang diskalakan proporsional ke `316×316` tepat di tengah kanvas `#000000` (`512×512`) sehingga jarak terjauh piksel artwork dari pusat `(256, 256)` adalah **`199,40 px`**, berada sepenuhnya di dalam lingkaran *safe zone* maskable beradius 40% (**`204,80 px`**) tanpa memotong bagian mana pun dari artwork.

### 3. Pembaruan `manifest.json` & `sw.js` (Gate G3)
- Memperbarui `CACHE_NAME` pada `sw.js` menjadi `'micro-ledger-pwa-v4.7.0-putuka-final-20261104'` dan menyelaraskan `CORE_ASSETS` agar hanya memuat file yang benar-benar ada di paket root-ready.
- Menambahkan `.nojekyll` di root paket untuk kompatibilitas penuh GitHub Pages.
