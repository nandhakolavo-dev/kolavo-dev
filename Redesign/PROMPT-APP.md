# Prompt revisi — Pisah Landing Page vs Kolavo App

Jalankan berurutan, satu prompt per giliran: **"Jalankan A2 dari `Redesign/PROMPT-APP.md`"**.

**Tujuan:** landing page (`scrBeranda`) jadi halaman jualan untuk calon pengurus.
Anggota & pengurus yang sudah punya akun masuk lewat **pintu app** — halaman login
penuh — lalu memakai app bernavigasi ikon ala Facebook web. Tautan/QR undangan
langsung ke login → setelah masuk mendarat di profil komunitas pengundangnya.
Semua fitur lama tetap ada, hanya dipindah rumahnya.

---

## A0 · Aturan main (tempel sekali di awal sesi)

```
Konteks tetap sesi ini:
- Tetap SATU berkas (ReDesign_Kolavo_4.html). "Kolavo App" = kumpulan layar baru
  di router yang sama, bukan berkas terpisah.
- Sunting hanya Redesign/src/ lewat kit/edit.py. Jangan baca berkas terbangun.
  Orientasi pakai kit/peta.py --src, baca modul secukupnya (grep/sed -n), bukan utuh.
- Penutup tiap prompt: bundle.py → peta.py (cek jumlah layar sesuai yang
  disebut prompt) → audit.py → 1 pengukuran DOM via javascript_tool → publish
  Artifact → catat keputusan di REFERENCE.md → commit. Maks 1 screenshot.
- Pakai token & komponen yang sudah ada. Dark mode lewat token saja.
- Nama `window.KolavoApp` SUDAH dipakai sebagai objek keadaan — jangan ditimpa.
  Mode baru disimpan sebagai App.mode = 'landing' | 'app'.
- Jangan hapus fitur lama. Kalau sebuah fitur pindah tempat, pindahkan, jangan tulis ulang.
```

## Urutan & ketergantungan

| # | Prompt | Butuh | Modul utama |
|---|---|---|---|
| A1 | Dua mode di router (landing vs app) | — | `50-js-runtime-router`, `20-nav`, `40-footer` |
| A2 | Halaman login penuh `scrMasuk` | A1 | baru `30-layer-scrMasuk`, `50-js-modal-masuk`, `10-styles`, `manifest.txt` |
| A3 | Nav app ala Facebook (ikon) | A1 | `20-nav`, `10-styles`, `50-js-runtime-router`, `50-js-notifikasi` |
| A4 | Isi tab app: Komunitas · Profil · Dashboard | A3 | baru `30-layer-scrApp`, `50-js-direktori-filter`, `50-js-dashboard-pengurus` |
| A5a | QR di samping tautan bagikan yang sudah ada | — (boleh paling awal) | baru `50-js-qr`, `50-js-layar-komunitas`, `50-js-layar-buat`, `10-styles` |
| A5b | Buka tautan/QR → login → profil komunitas | A2, A4, A5a | `50-js-modal-masuk`, `50-js-runtime-router`, `50-js-layar-komunitas` |
| A6 | Rapikan landing jadi halaman jualan | A2 | `30-layer-scrBeranda`, `20-nav`, `40-footer` |
| A7 | Uji regresi fitur lama + dokumentasi | A1–A6 | `REFERENCE.md`, `CLAUDE.md` |

A3 dan A6 tidak saling sentuh selain `20-nav` — kerjakan A3 dulu supaya nav app selesai sebelum nav landing dipangkas.

---

### A1 · Dua mode di router
1. Tambah `App.mode`. `scrBeranda` = mode landing; semua layar lain = mode app.
2. Nav & footer mengikuti mode (kelas di `<body>`, mis. `body.m-app`). Untuk sekarang
   mode app boleh masih memakai nav lama — isinya diganti di A3.
3. Di mode app, footer landing disembunyikan.
4. Belum ada perubahan visual di landing.
**Lolos:** `peta.py` jumlah layar tetap 7; pindah `KolavoKe('scrProfil')` → `body` berkelas mode app.

### A2 · Halaman login penuh `scrMasuk`
1. Layar baru `scrMasuk`: satu kolom tengah, logo, judul, tombol **Masuk dengan Google**
   (pakai ulang logika `50-js-modal-masuk`, bukan salinan), tautan TnC/Privasi yang sudah ada.
2. Dua varian: **biasa** ("Masuk ke Kolavo") dan **undangan** (kartu kecil komunitas
   pengundang di atas tombol: logo, nama, jumlah anggota, "Kamu diundang bergabung").
3. Setelah masuk: profil belum lengkap → `scrLengkapi`; sudah lengkap → tujuan
   (`App.tujuan`, default tab Komunitas).
4. Modal masuk lama tetap ada untuk pemicu di landing (A6 yang memutuskan dipakai atau tidak).
5. Semua layar `perluMasuk` diarahkan ke `scrMasuk`, bukan modal.
**Lolos:** 8 layar; buka layar terlindung tanpa masuk → `scrMasuk` tampil, modal tidak.

### A3 · Nav app ala Facebook web
1. Bar atas mode app: kiri logo + cari; tengah **3 ikon tab** Komunitas (beranda app) ·
   Profil · Dashboard; kanan lonceng notifikasi (pakai ulang) + avatar menu akun (pakai ulang).
2. Tab aktif: ikon berwarna primary + garis bawah 3px; tab lain netral `#6B7280`. Tooltip nama tab.
3. Ketiga ikon tampil untuk **semua** user. Isi Dashboard yang membedakan (A4).
4. Lebar < 768px: ikon tengah pindah ke **bilah bawah** (bottom tab), bar atas tinggal logo + notif + avatar.
5. Ikon dari `50-js-ikon`; tambah yang kurang di sana.
**Lolos:** di 375px tidak ada overflow horizontal; bottom tab 3 ikon untuk semua user.

### A4 · Isi tab app (memindah, bukan membuat ulang)
- **Komunitas** (beranda app, `scrApp`): dua bagian.
  1. **Komunitasku** — komunitas yang diikuti, kartu → `scrKomunitas`. Status pengajuan
     yang masih ditinjau ditandai "Menunggu persetujuan".
  2. **Jelajahi komunitas publik** — direktori + filter yang sekarang di landing dipindah ke
     sini; tiap kartu punya tombol **Minta gabung** (alur gabung/onboarding Advance yang ada).
  Feed tetap di dalam masing-masing `scrKomunitas`, tidak digabung.
- **Profil**: `scrProfil` yang ada.
- **Dashboard** (terbuka untuk semua): daftar **komunitas yang kamu kelola** — yang kamu
  buat sendiri (lencana "Pembuat") dan yang mengangkatmu jadi pengurus (lencana jabatan).
  Pilih satu → `scrKelola` komunitas itu; di dalam `scrKelola` ada pemilih komunitas untuk
  pindah tanpa kembali. Belum mengelola apa pun → keadaan kosong + tombol **Buat komunitas**
  (→ `scrBuat`). Tombol Buat komunitas juga ada di bawah daftar. Semua menu dashboard lama
  (Advance, Kelola, Sekretariat, Onboarding, dst.) tidak berubah.
- `scrKomunitas`, `scrAnggota`, `scrBuat`, `scrLengkapi` tetap layar sendiri di bawah nav app.
**Lolos:** 9 layar; tiap ikon nav membuka layar yang benar; user tanpa komunitas kelolaan
melihat keadaan kosong; `KolavoBukaDashboard` tetap jalan.

### A5a · QR untuk tautan bagikan
Sekarang tautan dibagikan di dua tempat: `bagikan()` di `50-js-layar-komunitas`
(`navigator.share`/salin, `kolavo.app/k/<slug>`) dan tombol `bkSalin` di layar sukses
`50-js-layar-buat`. Keduanya diganti membuka **satu popup Bagikan** yang sama:
1. Tautan + tombol **Salin** (logika salin yang ada), tombol **Bagikan…** bila `navigator.share` ada.
2. **QR asli yang bisa dipindai**, dibuat oleh pembuat QR inline kecil di modul baru
   `50-js-qr` (`window.KolavoQR(teks) → SVG`; mode byte, koreksi galat M, versi otomatis
   cukup untuk URL ≤ 80 karakter). Tanpa pustaka luar — CSP. Logo Kolavo kecil di tengah boleh
   kalau koreksi galat dinaikkan ke Q/H.
3. Tombol **Unduh QR** (PNG lewat canvas; kalau unduhan diblokir sandbox → toast "Tahan
   gambar untuk menyimpan"). Nama komunitas tertulis di bawah QR supaya siap dicetak.
4. Warna QR tetap hitam di atas putih di kedua tema (pengecualian kontras, tulis lewat token
   khusus `--qr-fg/--qr-bg`, bukan harfiah di blok tema).
**Lolos:** `audit.py` bersih; `KolavoQR('https://kolavo.app/k/tes')` mengembalikan SVG;
satu screenshot popup lalu pindai pakai kamera HP oleh user.

### A5b · Buka tautan/QR → login → profil komunitas
1. Pemicu demo kecil **"Simulasikan buka tautan undangan"** di landing & `scrMasuk`
   (khusus prototipe, berlabel jelas) → set `App.undangan` → `scrMasuk` varian undangan.
2. Setelah masuk: lengkapi profil bila perlu → langsung `scrKomunitas` komunitas tsb dengan
   tombol Gabung/pengajuan yang sudah ada (onboarding Advance tetap terpicu seperti sekarang).
   Sudah anggota → langsung profil komunitas tanpa langkah gabung.
**Lolos:** urutan `scrMasuk → scrLengkapi → scrKomunitas` terukur lewat `KolavoKe`; komunitas
yang terbuka = komunitas pada tautan.

### A6 · Landing jadi halaman jualan
1. Nav landing: logo · Fitur · Harga · Untuk siapa · tombol **Masuk** (→ `scrMasuk`) +
   **Buat komunitas** (→ `scrMasuk` dengan tujuan `scrBuat`).
2. Bagian direktori komunitas di landing dipangkas jadi etalase (maks 3–4 kartu contoh,
   klik → `scrMasuk`), karena direktori lengkap sudah pindah ke tab Komunitas (A4).
   Profil komunitas publik dari tautan/QR tetap bisa dilihat sesudah login (A5b).
3. Hero, tiga pilar, harga, footer tetap. Semua CTA yang dulu membuka modal masuk → `scrMasuk`.
**Lolos:** tidak ada `acct-*` / notif di nav landing; bagian landing berkurang hanya bagian direktori yang dipangkas.

### A7 · Uji regresi + dokumentasi
1. Daftar periksa (ukur via `javascript_tool`, bukan screenshot): masuk Google · lengkapi
   profil + pemilih lokasi/tanggal · bagikan + QR · feed (tulis, semat, hapus) · kenalan (ajak, terima) ·
   notifikasi · buat halaman komunitas · arsip/hapus · semua menu dashboard · onboarding
   stepper · peraturan baca-saja · TnC/Privasi · kalkulator harga.
2. Perbarui `REFERENCE.md` (mode, layar baru, nav app) dan komentar router + bagian
   "Satu prototipe = satu berkas" di `CLAUDE.md` bila perlu.
3. 1 screenshot desktop app tab Komunitas + 1 mobile bottom tab — satu-satunya screenshot di fase ini.

---

## Keputusan (14 Okt 2026)

1. **Dashboard terbuka untuk semua.** Isinya daftar komunitas yang dikelola (buatan sendiri
   atau diangkat pengurus); pilih satu untuk masuk ke dashboard-nya. Kosong → ajakan buat komunitas.
2. **Tab Komunitas = beranda app:** komunitas yang diikuti + komunitas publik dengan tombol
   Minta gabung. Tidak ada feed gabungan; feed tetap per komunitas. Nav jadi 3 ikon.
3. **Login:** Google SSO saja.
4. **QR:** ditambahkan di samping tautan bagikan yang sudah ada (A5a), QR asli yang bisa dipindai.
