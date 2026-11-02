# CHANGELOG — PUTUKA TAHAP 2 (`v4.2.0-PUTUKA-T2`)

## [v4.2.0-PUTUKA-T2] — UI/UX Polish, Interaction Quality, Performance & Regression Safety

### Added
- **Bottom Navigation Sliding Active Indicator (`#nav-active-pill`)**: Kapsul indikator aktif berbasis GPU (`translate3d(calc(var(--active-tab-idx, 0) * 100%), 0, 0)`) dengan garis aksen spekular atas (`#nav-active-pill-inner::before`) yang bergerak mulus mengikuti tab aktif.
- **Lightweight View & Subpage Entrance Transition (`.putuka-view-enter`)**: Animasi masuk `180ms` (`opacity` + `translate3d(0, 5px, 0)`) saat berpindah antar tab utama maupun saat membuka sub-halaman di dalam Pengaturan.
- **Hardware Back (`popstate`) & `Escape` Key Navigation (`App.handleBackOrDismiss`)**: Menutup modal/sidebar yang sedang terbuka terlebih dahulu, atau mengembalikan tampilan dari sub-halaman Pengaturan ke menu utama Pengaturan / Buku Besar secara konsisten.
- **Anti-Spam Toast Deduplication (`App.showToast`)**: Mencegah penumpukan toast identik saat tombol ditekan cepat berulang kali dengan memperbarui durasi toast aktif yang sama dan membatasi tumpukan maksimum hingga 2 toast.
- **Progressive Disclosure Accordions (`<details class="putuka-disclosure">`)**: Merapikan penjelasan teknis panjang pada Subpage 4 (*Data & Cadangan*) dan Subpage 6 (*Tentang Aplikasi*) agar tampilan lebih bersih dan mudah dipindai tanpa menghilangkan informasi penting.
- **Full `prefers-reduced-motion: reduce` & `:focus-visible` Support**: Mematikan animasi non-esensial secara otomatis ketika pengaturan aksesibilitas *Reduce Motion* perangkat aktif, serta menambahkan cincin fokus `:focus-visible` yang jelas.
- **Canonical High-Contrast PUTUKA Icon Set (`icons/*`)**: Menghasilkan set ikon kanonis `favicon.png` (64×64), `apple-touch-icon.png` (180×180), `icon-192.png` (192×192 `any`), `icon-512.png` (512×512 `any`), dan `icon-512-maskable.png` (512×512 `maskable` dengan *safe-zone* W3C 80%).

### Fixed
- **Subpage 6 Diagnostic Numbering**: Memperbaiki duplikasi nomor `7. Mode Installed / Standalone` menjadi `8. Mode Installed / Standalone`.
- **Scroll Preservation on Active Tab Tap**: Mengetuk ulang tab navigasi bawah yang sudah aktif tidak lagi memicu ulang animasi masuk atau mereset posisi gulir halaman.
- **Service Worker Cache Version Separation**: Memperbarui `CACHE_NAME` pada `sw.js` menjadi `micro-ledger-pwa-v4.2.0-putuka-t2` sehingga aset dari Tahap 1 tidak tertahan di cache lama.

### Preserved (Zero Regression)
- Seluruh penghapusan splash screen HTML custom dari Tahap 1 (`#app-splash-overlay`, `#app-splash-artwork`, `SplashEngine`, dan delay 4,2 detik tetap bersih 100%).
- Seluruh fitur Buku Besar, AI Workout MoveNet, Jadwal Harian, Ekspor Kalender `.ics`, Profil Pengguna, Kustomisasi Tampilan Liquid Glass, Ekspor/Impor JSON Simetris dengan Rollback, Sinkronisasi Cloud Firestore, dan Reset Data Permanen (`RKRKRK`).
