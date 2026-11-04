# PUTUKA — Micro Ledger, AI Workout, Ceklis Harian & Streak Engine

**Build ID Final:** `v4.7.0-PUTUKA-FINAL-20261104`  
**Target Deployment:** GitHub Pages (Root Domain maupun Project Subpath `/<nama-repo>/`)  
**Status Rilis:** `RELEASE CANDIDATE — Static & Headless QA Verified (R-01..R-10 PASS; R-11 Menunggu Verifikasi Fisik Chrome Android)`

---

## 1. Ringkasan Aplikasi & Fitur Utama (Release Freeze)

PUTUKA adalah Progressive Web App (PWA) mobile-first bergaya *iOS Liquid Glass* yang mengintegrasikan empat modul utama dalam satu aplikasi mandiri:

1. **Buku Besar Keuangan Mikro (`#view-ledger`)**:
   - Pencatatan pemasukan & pengeluaran instan, filter kategori di sidebar, analitik rasio tabungan mingguan/bulanan (`#report-modal`), serta kartu ringkasan cepat Ceklis Harian, Jadwal Workout, dan Streak.
2. **AI Workout 9:16 & Jadwal Latihan Terpadu (`#view-workout`)**:
   - Pelacak repetisi *Push-up* dan *Sit-up* berbasis visi komputer **TensorFlow.js MoveNet SinglePose Lightning** pada bingkai kamera portrait **9:16** (`#workout-camera-stage`) dengan penyelarasan koordinat 1:1 (`object-fit: contain`), tombol **Fullscreen** + fallback aman, dan penguncian cermin (*Mirror Lock*).
   - **Jadwal & Target Mingguan (`#workout-schedule-workspace`)** terintegrasi di bagian bawah halaman AI Workout yang dapat di-scroll tanpa menyalakan kamera secara paksa.
3. **Ceklis Harian Mandiri (`#view-checklist`)**:
   - Manajemen multi-daftar dan item tugas dengan jadwal berulang ISO (`daily`, `weekdays` Senin–Minggu, `once`), navigasi lintas tanggal, 4 status harian (`✓ Selesai`, `— Belum`, `× Tidak Ada Tugas`, `Kosong`), catatan per tanggal, dan pengarsipan aman.
4. **Streak Engine, Streak Recovery (5/7), & Milestone (7/30/100/365)**:
   - Perhitungan streak harian idempotent berbasis aktivitas nyata yang tersimpan (`Keuangan > 0`, `Workout > 0 poin`, atau `Ceklis berstatus ✓ Selesai`) mengikuti tanggal lokal & zona waktu IANA pengguna.
   - Evaluasi *lapse* dinamis terhadap tanggal lokal hari ini (`Unignited` hari 1–2, `Ignited` mulai hari ke-3).
   - **Streak Recovery 5/7**: 1 entitlement token diperoleh dari minimal 5/7 hari aktivitas nyata pada minggu kalender ISO (Senin–Minggu) yang telah selesai (saldo maksimum `1` token). Digunakan secara manual melalui dialog konfirmasi untuk memulihkan tepat 1 hari kosong terisolasi di antara dua hari aktivitas nyata (ditandai jelas sebagai `"Dipulihkan"`).
   - **Milestone Permanen**: Penghargaan visual pada `7`, `30`, `100`, dan `365` hari (`streak_7`, `streak_30`, `streak_100`, `streak_365`) dengan atribusi jujur (`includesRecovery`).
5. **Pengaturan, Cadangan Simetris, Rollback, & Reset Data (`#view-settings`)**:
   - Kustomisasi tema gelap/terang & wallpaper, diagnostik kamera/PWA, pengingat kalender `.ics`, ekspor/impor JSON simetris dengan *pre-import rollback snapshot* wajib, sinkronisasi opsional Firebase Firestore, serta **Reset Data Permanen** dengan konfirmasi case-sensitive `RKRKRK`.

---

## 2. Struktur Paket Root-Ready GitHub Pages

```text
PUTUKA-GITHUB-PAGES-FINAL.zip
├── index.html
├── manifest.json
├── sw.js
├── offline.html
├── .nojekyll
├── README.md
├── DEPLOY_GITHUB_PAGES.md
├── QA_REPORT_FINAL.md
├── BUILD_INFO.txt
├── CHANGELOG_FINAL.md
├── icons/
│   ├── favicon.png
│   ├── apple-touch-icon.png
│   ├── icon-192.png
│   ├── icon-512.png
│   └── icon-512-maskable.png
└── assets/
    └── branding/
        └── source/
            └── app-icon-original.png
```

---

## 3. Cakupan Offline vs Ketergantungan Jaringan

* **Bekerja Offline (Setelah Kunjungan Pertama / Precache Service Worker Aktif)**:
  - Seluruh App Shell lokal (`./index.html`, `./offline.html`, `./manifest.json`, `./icons/*`).
  - Pencatatan & riwayat Buku Besar Keuangan, Ceklis Harian, Jadwal Workout, perhitungan Streak, Recovery 5/7, Milestone, Pengaturan Profil/Tampilan, unduhan `.ics`, serta Ekspor/Impor JSON lokal.
  - Fallback utilitas tata letak inti telah dibundel di dalam `<style>` pada `index.html` sehingga struktur halaman dan modal tetap aman meskipun CDN eksternal lambat atau tidak terjangkau.
* **Memerlukan Jaringan Internet (Jika Belum Tersimpan pada HTTP Cache Browser)**:
  - Pemanggilan awal pustaka CDN eksternal: Tailwind CSS CDN (`cdn.tailwindcss.com`), Google Fonts (`Inter`), serta model visi komputer **TensorFlow.js & MoveNet** (`cdn.jsdelivr.net`).
  - Sinkronisasi lintas perangkat melalui **Firebase Firestore** (apabila dikonfigurasi).

> **Catatan Penting Mengenai Instalasi PWA Android vs APK Native:**  
> Menginstal aplikasi melalui menu **Install app / Tambahkan ke Layar Utama** pada Chrome Android menginstal **PWA (WebAPK)** yang membentuk *native launch screen* dari `manifest.json` (`background_color: #05070b`, `icons`, dan `name`). Paket ini **bukan** file `.apk` native mandiri. Pembuatan APK native memerlukan proyek pembungkus Android/Trusted Web Activity (TWA) terpisah.
