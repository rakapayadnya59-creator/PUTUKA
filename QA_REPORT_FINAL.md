# LAPORAN QA FINAL & BUKTI AUDIT — PUTUKA (`v4.7.0-PUTUKA-FINAL-20261104`)

**Tanggal Pengujian:** `2026-11-04`  
**Build ID:** `v4.7.0-PUTUKA-FINAL-20261104`  
**Environment Uji Otomatis:** Headless Chromium `155.0.8059.79` (Linux x86_64 Sandbox VM), Node.js Syntax Checker, Python 3.12 (`Pillow`, `numpy`, `zipfile`, `check_web_app.py`)  
**Viewport yang Diuji:** `320×568`, `360×640`, `390×844`, `412×915`, dan `844×390` (Landscape)  
**Status Rilis:** `RELEASE CANDIDATE — Seluruh Gate G0..G5 & Matriks Otomatis R-01..R-10 PASS | R-11 NOT TESTED (Membutuhkan Perangkat Fisik Android)`

---

## 1. Status Eksekusi Gate Rilis (G0 – G5)

| Gate | Deskripsi Gate | Status | Ringkasan Bukti Aktual |
| :--- | :--- | :--- | :--- |
| **G0 — Source** | Ambil HTML Tahap 4 aktual & gambar ikon original pengguna | **PASS** | Source `index.html` Tahap 4 (`714.661 bytes`, `12.308 baris`) dan gambar ikon asli pengguna (`243614.png`, `1000×1000`, `128.203 bytes`) tersedia dan terverifikasi. |
| **G1 — Audit** | Verifikasi perbaikan P0, Streak Recovery 5/7, Milestone, data, & regresi terhadap kode | **PASS** | Seluruh klaim Tahap 4 diaudit baris demi baris terhadap source; ditambahkan 2 patch pengerasan rilis (`future_date_not_allowed` / `leading_gap` & mutex konkurensi `spendRecoveryToken` + sinkronisasi Build ID di About). |
| **G2 — Branding** | Arsipkan gambar original byte-for-byte & buat varian ikon tanpa crop/distorsi | **PASS** | File asli diarsipkan byte-for-byte di `assets/branding/source/app-icon-original.png` (SHA-256 identik `49d4cc0dfcac4f7321292be372382429a96336f0b1974c85a5d13fe6909aac60`). Varian `192`, `512`, `180`, `64`, dan `512-maskable` (radius artwork maks `199,40 px <= 204,80 px` safe zone 40%) diverifikasi secara matematis & visual. |
| **G3 — Package** | Susun satu struktur root GitHub Pages, manifest, service worker, aset, dokumentasi | **PASS** | Seluruh 15 file disusun di root arsip tanpa folder pembungkus tambahan, seluruh path relatif `./...` cocok 100%, tidak ada file duplikat atau file sampah. |
| **G4 — QA** | Jalankan validasi statis, fungsional Headless Chromium, recovery edge cases, & ZIP integrity | **PASS** | `check_web_app.py` (`0 errors, 0 warnings`), `node --check sw.js` (`OK`), `R-01` s/d `R-10` **PASS**, `R-11` dicatat jujur sebagai **NOT TESTED**. |
| **G5 — Handoff** | Serahkan satu ZIP final kanonis `PUTUKA-GITHUB-PAGES-FINAL.zip` beserta hash & panduan | **PASS** | `PUTUKA-GITHUB-PAGES-FINAL.zip` lulus `zipfile.testzip()` & `unzip -t`, lengkap dengan SHA-256 tiap file dan SHA-256 ZIP final. |

---

## 2. Matriks QA Wajib (`R-01` s/d `R-11`)

| ID | Area | Status | Bukti Pengujian Aktual |
| :--- | :--- | :--- | :--- |
| **R-01** | **Source integrity** | **PASS** | Dibangun langsung dari source aktual Tahap 4 (`index.html.v4_6_tahap4_baseline`, `714.661 bytes`, `12.308 baris`) tanpa rekonstruksi dari laporan. |
| **R-02** | **Syntax & DOM** | **PASS** | `check_web_app.py` lulus `OK: no issues found` (`0` error, `0` warning, `0` removed features); `node --check sw.js` lulus; `354` elemen ber-ID unik (`0` duplicate ID); `0` runtime console/page error. |
| **R-03** | **P0 regression** | **PASS** | Diuji di 5 viewport (`320×568`, `360×640`, `390×844`, `412×915`, `844×390`): `#workout-placeholder` terkunci 100% di dalam stage 9:16 (`ratio = 0.5625`, `contained = true`, `noHorizOverflow = true`); `#report-modal` tertutup rapat (`visibility = 'hidden'`, `pointerEvents = 'none'`); klik `Atur Jadwal` menuju `#workout-schedule-workspace` (`wkScrollTop = 768`, `schedTop = 284`, `stickyBottom = 275`), `noAncestorScroll = true`, kamera tidak menyala otomatis (`camCalled = false`), dan alias `switchMode('schedule')` menuju jadwal di Workout (`aliasOk = true`). |
| **R-04** | **Feature freeze** | **PASS** | Tambah transaksi Buku Besar (`txAdded = true`), ubah status Ceklis Harian (`chkDone = true`), simpan target Jadwal Workout (`schedSaved = true`), serta pergantian tema Light/Dark (`lightApplied = true`, `darkApplied = true`) berjalan normal. |
| **R-05** | **Streak rules & Recovery** | **PASS** | Lulus seluruh test case minimum halaman 7: (1) **5/7**: `4/7 = 0 token`, `5/7 = 1 token`, `7/7 saat saldo 1 = tetap 1 token (capped_max_balance)`, minggu belum selesai tidak dievaluasi (`incompleteWeekNotEvaluated = true`), batas minggu ISO lintas tahun `2026-12-28..2027-01-03` valid (`isoWeekBoundaryCrossYearOk = true`); (2) **Gap recovery**: 1 gap terisolasi diterima (`claim1Ok = true`), tanpa aktivitas sesudah ditolak (`no_activity_after_gap`), leading gap ditolak (`leading_gap_no_prior_activity`), 2 hari kosong berturut-turut ditolak (`multi_day_gap`), tanggal masa depan ditolak (`future_date_not_allowed`), klaim kedua pada tanggal sama ditolak (`already_recovered`); (3) **Milestone**: `streak_7` terbuka sekali & permanen setelah lapse, `includesRecovery = true` saat mencakup `2026-11-03`; (4) **Timezone**: `Asia/Makassar` pukul `23:59` (`2026-11-04`) vs `00:01` (`2026-11-05`) akurat meskipun UTC masih tanggal 4 (`timezoneMidnightOk = true`); (5) **Concurrency**: konflik pemakaian token yang sama dari dua snapshot hanya mempertahankan 1 pemakaian sah (`singleSpendSurvived = true`). |
| **R-06** | **Persistence** | **PASS** | Reload, ekspor/impor payload, merge snapshot, dan Reset Data dengan konfirmasi `RKRKRK` (`resetStatus = 'complete'`, `resetClean = true`) berjalan tanpa merusak atau menggandakan record. |
| **R-07** | **Icon assets** | **PASS** | File asli `243614.png` disimpan byte-for-byte di `assets/branding/source/app-icon-original.png` (`1000×1000`, SHA-256 `49d4cc0dfcac4f7321292be372382429a96336f0b1974c85a5d13fe6909aac60`). Varian `icon-192.png` (`192×192`), `icon-512.png` (`512×512`), `apple-touch-icon.png` (`180×180`), `favicon.png` (`64×64`) dibuat tanpa crop/stretch. Varian `icon-512-maskable.png` (`512×512`) menempatkan seluruh artwork di dalam radius `199,40 px` (`<= 204,80 px` safe zone 40%) di atas latar `#000000`. |
| **R-08** | **Path integrity** | **PASS** | Seluruh referensi di `index.html` (`./manifest.json`, `./icons/favicon.png`, `./icons/apple-touch-icon.png`, `./sw.js`), `manifest.json` (`./`, `./icons/icon-192.png`, `./icons/icon-512.png`, `./icons/icon-512-maskable.png`), dan `sw.js` (`CORE_ASSETS`) menggunakan relative path `./...` yang valid untuk subpath GitHub Pages dan seluruh targetnya tersedia di dalam ZIP. |
| **R-09** | **PWA shell** | **PASS** | `manifest.json` valid JSON dengan `display: "standalone"`, `start_url: "./"`, `scope: "./"`, `theme_color: "#05070b"`, `background_color: "#05070b"`; `sw.js` valid dengan `CACHE_NAME = 'micro-ledger-pwa-v4.7.0-putuka-final-20261104'` dan fallback navigasi ke `./index.html` lalu `./offline.html`. Batasan dependensi CDN eksternal didokumentasikan secara jujur. |
| **R-10** | **ZIP integrity** | **PASS** | Satu arsip kanonis `PUTUKA-GITHUB-PAGES-FINAL.zip` dengan `index.html` langsung di root, `0` file duplikat, `0` nested ZIP, `0` data pribadi/rahasia, dan lulus uji `zipfile.testzip()` serta `unzip -t`. |
| **R-11** | **Android device** | **NOT TESTED** | Pengujian fisik langsung pada Chrome Android (instalasi WebAPK, izin kamera fisik perangkat nyata, sensor orientasi fullscreen, dan siklus update SW live di ponsel) belum dijalankan di dalam sandbox VM dan wajib diverifikasi pada perangkat Android fisik menggunakan langkah pada `DEPLOY_GITHUB_PAGES.md`. |

---

## 3. Audit Keamanan, Privasi, & Batasan Lingkungan

1. **Keamanan & Anti-XSS**: Pemindaian source dan arsip memastikan tidak ada API private key, service-account key, token rahasia, data transaksi pengguna, maupun nama pribadi di dalam kode atau paket ZIP. Render data dinamis pada Ceklis Harian, Jadwal, dan Streak menggunakan manipulasi DOM aman (`createElement` & `textContent`).
2. **Firebase Firestore Rules (`NOT VERIFIED` terhadap Live Cloud Project)**: Kode klien menggunakan path Firestore `artifacts/{appId}/users/{userId}/(transactions|workouts|settings/*)` termasuk `settings/streak_engine`, namun karena proyek Firebase live pengguna berada di luar lingkungan build ini, konfigurasi *Firestore Security Rules* pada konsol Firebase pengguna ditandai **NOT VERIFIED** (pastikan aturan akses membatasi baca/tulis hanya untuk `request.auth != null && request.auth.uid == userId`).
