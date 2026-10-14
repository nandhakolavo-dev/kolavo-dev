# Prompt revisi — Menu Home di Kolavo App

Jalankan berurutan, satu prompt per giliran: **"Jalankan H1 dari `Redesign/PROMPT-HOME.md`"**.

**Tujuan:** nav app jadi **Home · Komunitas · Dashboard**. Profil keluar dari nav (cukup
lewat avatar di header). Pembagian peran:
- **Home** = *apa yang baru & apa yang perlu kamu lakukan* di semua komunitasmu.
- **Komunitas** = *di mana*: Komunitasku + Jelajahi (tetap seperti sekarang).
- **Dashboard** = alat pengurus (tetap).

Membalik keputusan A4 "tidak ada feed gabungan": feed gabungan kini ada, **di Home saja,
baca-saja**. Menulis, menyematkan, dan menghapus tetap di halaman komunitasnya.

---

## H0 · Aturan main (tempel sekali di awal sesi)

```
Sama dengan A0 di PROMPT-APP.md: sunting src/ lewat kit/edit.py → bundle.py → peta.py →
audit.py → 1 pengukuran DOM → publish Artifact → catat di REFERENCE.md → commit.
Maks 1 screenshot per prompt. Muat ulang browser lokal dengan ?v=N (cache pernah menipu).
Pakai ulang data & fungsi yang ada: KolavoFeed, KolavoStatusKenal/KolavoAjakKenalan/
KolavoTerimaKenalan, KolavoKomunitasKu, KolavoDashboard, KolavoNotifTambah. Jangan bikin
salinan data contoh baru.
```

## Urutan

| # | Prompt | Butuh | Modul utama |
|---|---|---|---|
| H1 | Kerangka: tab Home, Profil keluar dari nav | — | baru `30-layer-scrHome`, `20-nav`, `50-js-runtime-router`, `50-js-ikon`, `10-styles`, `manifest.txt` |
| H2 | Perlu tindakanmu + Kabar dari komunitasmu | H1 | `50-js-app` (atau baru `50-js-home`), `50-js-feed`, `10-styles` |
| H3 | Orang yang mungkin kamu kenal + uji regresi | H2 | `50-js-onboarding` (ekspor pencocokan), `50-js-home`, `REFERENCE.md`, `CLAUDE.md` |

---

### H1 · Kerangka tab Home
1. Layar baru `scrHome` (perluMasuk; layar ke-11). Untuk sementara isinya judul "Home" +
   tiga wadah kosong berid: `#homeAksi`, `#homeKabar`, `#homeKenal`.
2. Nav `#navTab`: **Home** (ikon baru `rumah` di `50-js-ikon`) · **Komunitas** · **Dashboard**.
   Tab Profil dihapus. Bilah bawah HP tetap 3 ikon.
3. Router: tujuan bawaan sesudah masuk / simpan Lengkapi / `scrMasuk` → `scrHome` (bukan
   `scrApp`). Peta `TAB`: `scrHome → home`; `scrProfil` dan `scrLengkapi` tidak menyalakan
   tab mana pun (dibuka dari avatar).
4. Menu avatar tetap: Profil saya · Komunitas saya · Pengaturan akun · Keluar. "Komunitas
   saya" diarahkan ke tab Komunitas, bukan ke bagian di profil.
5. Alur tautan/QR undangan (`KolavoBukaTautan`) tidak berubah: tetap mendarat di profil
   komunitasnya, bukan Home.
**Lolos:** 11 layar; tab aktif benar di Home/Komunitas/Dashboard; Profil tidak menyalakan
tab; 375px tanpa luapan; `KolavoBukaTautan` masih ke `scrKomunitas`.

### H2 · Perlu tindakanmu + Kabar dari komunitasmu
1. **Perlu tindakanmu** (`#homeAksi`): kartu ringkas, masing-masing **hanya muncul bila ada
   isinya**, satu tombol aksi per kartu:
   - Ajakan kenalan masuk → Terima / Tolak (fungsi kenalan yang ada).
   - Pendaftar menunggu persetujuan, per komunitas yang kamu kelola dan kamu peninjaunya →
     "Tinjau" membuka `KolavoBukaDashboard('minta', kom)`.
   - Pengajuan gabungmu yang masih menunggu → informasi saja (tanpa tombol).
   - Profil belum lengkap → "Lengkapi profil".
   Semua kosong → satu baris tenang "Tidak ada yang perlu kamu lakukan sekarang."
2. **Kabar dari komunitasmu** (`#homeKabar`): gabungan `KolavoFeed(kelas)` dari komunitas
   yang kamu **ikuti sebagai anggota yang sudah diterima** (bukan yang masih menunggu).
   Tiap kabar: logo + nama komunitas (klik → halaman komunitas), isi, waktu. Yang disematkan
   di atas, sisanya terbaru dulu. Chip saring: Semua · per komunitas. Maks 10 + "Lihat lainnya".
   Baca-saja.
3. **Keadaan kosong:** belum diterima di komunitas mana pun → Home berisi ajakan "Cari
   komunitas" (→ tab Komunitas, kolom cari) dan "Punya tautan undangan dari pengurus? Buka
   tautannya untuk langsung bergabung."
**Lolos:** setelah disetujui di Forpastara (tombol demo), kabarnya muncul di Home; semat di
halaman komunitas → naik ke atas di Home; ajakan kenalan diterima dari Home → kartunya
hilang; pengurus dengan pendaftar → kartu "Tinjau" membuka dashboard komunitas yang benar.

### H3 · Orang yang mungkin kamu kenal + regresi
1. Keluarkan pencocokan kenalan di `50-js-onboarding` (`isiKenalan`) jadi fungsi bersama
   `window.KolavoCocokkan(aku, daftarOrang)` → urutan + alasan ("Sama-sama Apoteker",
   "Sama-sama di Depok"). Onboarding memakai fungsi yang sama (perilakunya tidak berubah).
2. `#homeKenal`: maks 5 orang dari semua komunitas yang kamu ikuti, kecuali dirimu dan yang
   sudah terhubung/menunggu. Tiap orang: foto/inisial, nama panggilan, alasan cocok, nama
   komunitas, tombol **Ajak kenalan**. Nama lengkap tidak tampil (data pribadi).
3. Tata letak: desktop 2 kolom (Aksi + Kabar di kiri, Kenalan di kanan, kolom kanan
   menempel saat digulir); < 1024px satu kolom dengan Kenalan di antara Aksi dan Kabar.
4. Uji regresi singkat (ukur, bukan screenshot): alur masuk → Home, onboarding kenalan masih
   sama, tab Komunitas & Dashboard utuh. Perbarui `REFERENCE.md` dan bagian "Dua pintu" di
   `CLAUDE.md` (nav jadi Home · Komunitas · Dashboard).
**Lolos:** urutan saran sama antara Home dan onboarding untuk orang yang sama; ajak dari Home
→ status "menunggu" juga di halaman komunitas; 1 screenshot desktop Home.

---

## Keputusan yang dipakai (ubah di sini kalau berbeda)
- Feed gabungan **baca-saja**; aksi feed tetap di halaman komunitas.
- Hanya komunitas yang sudah **menerima**-mu yang masuk Kabar.
- Tautan/QR undangan tetap mendarat di profil komunitasnya, bukan Home.
- Profil hanya lewat avatar header; tidak ada tab Profil di HP maupun desktop.
