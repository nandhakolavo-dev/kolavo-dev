# Kolavo ReDesign — Acuan

Titik masuk untuk eksplorasi berikutnya. Baca ini dulu sebelum membuat layar baru,
supaya tidak menurunkan ulang token dari Figma atau menebak-nebak keputusan lama.

## Sumber kebenaran

| | |
|---|---|
| **Sumber yang disunting** | `src/` — 21 modul per-fitur. **Ini yang kamu sunting.** Peta: `python3 Redesign/kit/peta.py --src` |
| **Berkas terbangun** | `ReDesign_Kolavo_3.html` — dirakit dari `src/`, satu-satunya yang dipublish ke Artifact. **Jangan disunting langsung** (kalau telanjur, rekonsiliasi lewat `kit/split.py`) |
| **Alat** | `kit/split.py` pecah→src · `kit/bundle.py` rakit src→berkas · `kit/peta.py [--src]` peta · `kit/audit.py` audit · `kit/edit.py` penyuntingan |
| **Arsip — beku** | `archive/ReDesign_Kolavo_2.html` homepage · `archive/ReDesign_Kolavo_1.html` pra-basecamp · `archive/ReDesign_Kolavo_Masuk.html` pembanding modal · `kit/*.css` `kit/*.js` `kit/*.html` |

**Kenapa src/ + bundle, bukan satu berkas mentah:** Artifact hanya menjalankan
SATU berkas HTML self-contained (CSP blokir aset luar, router antar-layar butuh
satu DOM). Jadi *keluarannya* tetap satu berkas — tapi *sumbernya* dipecah per
fitur supaya tiap suntingan cuma menyentuh satu modul kecil, hemat konteks.
`bundle.py` merakit tanpa transformasi apa pun: keluaran byte-identik dengan
gabungan potongannya (dibuktikan lewat sha256 round-trip). Ganti warna/token
sekali di `src/10-styles.html`, semua layar ikut — tidak ada duplikasi CSS.

**Arsip tidak lagi disunting.** Perubahan menyeluruh diterapkan di `src/` saja. Kata
"Gratis" sempat dihapus juga dari v2, Masuk, dan kit sebelum aturan ini berlaku —
itu perambatan terakhir. `kit/extract.py` **jangan dijalankan lagi**: ia menarik dari
v2 dan akan menimpa kit dengan pola lama.

## Melanjutkan di sesi baru

```bash
python3 Redesign/kit/peta.py --src   # modul mana untuk fitur apa (mulai di sini)
python3 Redesign/kit/peta.py         # layar, bagian, blok skrip, API global, id
```

Jangan membaca `ReDesign_Kolavo_3.html` utuh — 357 KB, sekitar setengahnya base64.
Alur kerja per suntingan:

1. `kit/peta.py --src` — cari modul yang memuat fitur yang mau diubah.
2. `kit/edit.py src/<modul>` — sunting modul itu saja (audit fragmen dilewati;
   fragmen tak bisa diaudit sendiri karena CSS/HTML-nya tersebar).
3. `kit/bundle.py` — rakit `src/` → berkas terbangun, audit otomatis jalan di sini.
4. `kit/bundle.py --check` — konfirmasi berkas terbangun sinkron dengan `src/`
   sebelum publish.

Kalau seseorang menyunting berkas terbangun langsung (bukan lewat `src/`):
`kit/split.py` merekonsiliasi dengan memecah ulang. `split.py` lalu
`bundle.py --check` harus selalu 'identik' — kalau tidak, ada penanda struktur
(`<style>`, `<div class="scr">`, blok `<script>`) yang berpindah; perbarui daftar
di `split.py` sebelum melanjutkan.

## Menambah layar baru

**Sebagai modul baru di `src/`, dirakit ke `ReDesign_Kolavo_3.html`.** `kit/new-page.py`
sudah dimatikan (ia membuat berkas terpisah yang menaut — tak jalan di Artifact).

Empat langkah:

1. Markup: berkas `src/30-layer-scrNama.html` berisi `<div class="scr" id="scrNama"
   hidden>…</div>` dengan penutup bertanda `<!-- /scrNama -->`. Daftarkan di
   `src/manifest.txt` pada posisi yang benar (setelah layar lain, sebelum `40-footer`).
2. Daftarkan di `const LAYAR` pada `src/50-js-runtime-router.html`.
   Kalau layarnya butuh akun, tambahkan juga ke `perluMasuk`.
3. Navigasi: `data-ke="scrNama"` pada tombol mana pun. Tambah `data-anchor="id"`
   kalau perlu menggulir ke bagian tertentu setelah pindah.
4. Kalau ada elemen yang di-toggle dengan `[hidden]` dan kelasnya menyetel
   `display`, tambahkan kelas itu ke daftar `.btn[hidden],.scr[hidden],…` di
   `src/10-styles.html`.
5. `kit/bundle.py` — rakit dan audit.


Semua CSS dan aset ditanam inline. Ini bukan pilihan gaya: CSP pada Artifact memblokir
aset dari host luar, jadi berkas terpisah tidak akan termuat.

## Token — diambil dari page Design System di Figma

Bukan tebakan dari screenshot. Diekstrak lewat Figma REST API dari komponen `Button`.

| | Nilai |
|---|---|
| Font | **Poppins** 400/500/600 · Roboto 500 khusus tombol Google |
| Primary | `#2D6BE4` · hover `#0045CD` · disabled `#E3E3E3` + teks `#9CA3AF` |
| Aksen | `#FF683D` |
| Netral | `#222222` · `#6B7280` · `#9CA3AF` · garis `#EFEFEF` |
| Radius | tombol & chip **100** (pill penuh) · kartu **13** · modal **32** |
| Tinggi tombol | L 52 · M 48 · S 40 · XS 32 |
| Skala teks | body 400/14 · 400/16 · label 500/12 · judul 600/18–32 |
| Gap layout | 4 · 8 · 10 · 12 · 16 |

Dark mode lengkap. Setiap warna wajib lewat token — jangan pernah menulis warna
harfiah di dalam blok `@media` atau `[data-theme]`, itu bikin halaman tak terbaca
di salah satu tema.

## Komponen tersedia

`.btn` (+`.secondary` `.outline` `.md` `.sm` `.xs` `.lead`) · `.chip` · `.tag` ·
`.av` + `.av.photo` · `.panel` (daftar anggota) · `.ccard` (kartu komunitas) ·
`.hcard` (kartu komunitas ringkas untuk hero) · `.search` dengan pemilih lokasi
di dalamnya · `.locpanel` · `.empty` (keadaan kosong) · `.lgn` (modal masuk) ·
`.gbtn` (tombol Google gaya resmi) · `.ba` (tata letak sebelum/sesudah)

## Aset tertanam

| Berkas | Isi |
|---|---|
| `assets/logo-kolavo.png` | dipotong dari render Figma, agak lembut di layar retina — **ganti dengan SVG** kalau sempat |
| `assets/logos/*.jpg` | 4 logo komunitas asli, diunduh dari kolavo.app |
| `assets/logos/*-tile.jpg` | versi 128×128 siap pakai untuk kartu |
| `assets/photos/*.png` | 4 foto profil hasil AI (Rani, Bagas, Ayu, Fajar) |
| `assets/photos/*-avatar.jpg` | versi 176×176 terpotong lingkaran |
| `assets/photos/PROMPT.md` | prompt yang menghasilkan foto-foto itu — pakai lagi kalau butuh persona baru |

Warna aksen tiap kartu komunitas diambil dari warna dominan logonya
(`--acc` sebagai triplet RGB), meniru pola kartu di kolavo.app.

## Arsitektur pesan

| Tingkat | Isi | Letak |
|---|---|---|
| Brand line | **Basecamp digital komunitasmu** | eyebrow di atas H1, brand line di footer |
| Hero headline | **Kenal anggota komunitas, sebelum ketemu orangnya** | H1, boleh berganti tiap modul rilis |
| Argumen | **Karena tak kenal, maka tak kolab** | kicker bagian WAG |

Kata `komunitas` di H1 berotasi ke organisasi / asosiasi / ikatan alumni / himpunan.
Kata rotasi **wajib** jatuh di akhir frasa tanpa imbuhan, kalau tidak gramatikanya rusak.

## Konvensi berkas

**Satu prototipe = satu berkas.** Layar dibuat sebagai `<div class="scr" id="scr…">`
yang saling menggantikan lewat router kecil di kaki berkas, bukan sebagai berkas HTML
terpisah yang saling menaut. Alasannya bukan cuma rapi: Artifact tidak bisa menaut
antarberkas secara relatif, dan berkas terpisah berarti setiap perbaikan harus
diterapkan dua kali. Layar lengkapi profil sempat hidup di dua berkas, dan tiga
perbaikan berturut-turut (panel pratinjau, pemilih tanggal, lebar kolom) harus
dikerjakan dobel sebelum digabung.

**Alasan desain tidak dibuat sebagai halaman HTML.** Cukup di percakapan dan di berkas
ini. Halaman "apa yang berubah" pernah dibuat lalu dihapus — dokumentasi di tengah
prototipe merusak ilusinya, dan isinya jadi ikut basi tiap kali desainnya berubah.

### Alasan tiap keputusan di layar lengkapi profil

Dibandingkan `/profile/edit` kolavo.app sekarang:

1. **Data Google dipakai, bukan diminta ulang.** Form aslinya mulai dari semua kolom
   kosong; nama tetap harus diketik walau Google sudah mengirimkannya. Tiga kolom hilang
   dari form tanpa kehilangan satu data pun.
2. **Privat dan publik dipisah jadi dua blok.** Aslinya nomor WhatsApp dan kota berdiri
   sejajar dalam satu daftar, tanpa tanda mana yang tampil ke anggota lain.
3. **Satu janji privasi, bukan lima.** "Hanya ditampilkan ke admin komunitas kamu" muncul
   tiga kali dan "Info ini tidak akan dipublikasikan" dua kali di form aslinya.
4. **Kolom yang diminta nyambung ke janji produk.** Tujuh kolom wajib aslinya, tak satu pun
   muncul di direktori. Pekerjaan dan bio ditambahkan sebagai opsional.
5. **Satu kolom, dibatasi 720px.** Delapan kolom berderet selebar layar bikin panjangnya
   terasa tanpa ujung.
6. **Satu nama untuk satu aksi.** Aslinya empat: "Update Profil", "Perbarui Profil",
   "Ubah Profil", "Edit Profil".
7. **Pemicunya disebut.** Modal "Kamu belum dikenali" tidak menyebut kenapa sekarang, dan
   copy-nya menghakimi.
8. **Tanggal lahir: kalender yang bisa dilompati.** Lihat butir tanggal lahir di bawah.
9. **Progres kelihatan dan bisa ditinggal.** Aslinya satu tombol "Simpan" di ujung; kalau
   validasi gagal, tujuh kolom harus disisir mana yang merah.

## Keputusan yang sudah diambil

- **Tombol utama hero = "Cari komunitasku"**, bukan "Buat Halaman Komunitas".
  Business plan menyebut pengurus sebagai pelanggan, tapi keputusan diambil dengan
  alasan homepage lebih dulu dilihat pengunjung umum.
- **Pencarian punya keadaan kosong yang mengarahkan**, bukan buntu — dengan 4 komunitas
  terdaftar, mayoritas pencarian memang gagal.
- **Modal masuk copy-nya mengikuti niat pemicunya** — tiga varian, bukan satu untuk semua.
- **`/profile/edit` kolavo.app direkonstruksi dari bundle klien, bukan dari login.**
  Kolom wajibnya tujuh: `fullName` `birthDate` `gender` `whatsapp` `country` `province` `city`
  (`email` terisi dari Google dan dikunci). Semua dimulai kosong — nama dan foto dari
  Google tidak dipakai. Empat nama berbeda dipakai untuk satu aksi: "Update Profil" (h2),
  "Perbarui Profil" (modal *Kamu belum dikenali*), "Ubah Profil" (halaman profil),
  "Edit Profil" (breadcrumb). Rute yang ada: `/` `/create` `/profile` `/profile/edit`
  `/:komunitas` + `join-membership` `members` `members/:userId` `membership-settings` `edit`.
  Nav bawah 3 tab: Komunitas / Buat Halaman / Akun.

- **"Angkatan" bukan kolom platform — itu pertanyaan milik komunitas.** Dikonfirmasi
  dari bundle kolavo.app: di `/membership-settings` pengurus menyusun sendiri formulir
  pendaftarannya. Bawaannya dua kartu — `nickname` ("Nama Panggilan", `required`+`locked`,
  selalu ada) dan `cohort-year` yang **judulnya kosong**, dengan "Contoh: Tahun Angkatan"
  cuma sebagai placeholder. Pengurus mengetik judul dan pertanyaannya sendiri, menambah
  kartu sebanyak yang perlu (`custom-*`), mengatur urutan, dan menyalakan "Wajib Diisi?"
  per kartu. Jadi ikatan alumni menulis "Tahun Lulus", organisasi bisa "Tahun Pengukuhan",
  asosiasi lain lagi — dan `nickname` berbunyi "di komunitas ini", artinya jawabannya
  melekat ke keanggotaan, bukan ke profil orangnya.

  Konsekuensi buat desain: **profil global hanya boleh berisi yang melekat ke orangnya**
  (identitas, kontak, domisili, pekerjaan/keahlian, bio). Apa pun yang berbeda antar
  komunitas harus lewat formulir pengurus. Prototipe sempat salah di sini — "Angkatan"
  dipasang sebagai kolom global dengan dropdown 46 tahun, yang cuma masuk akal buat
  ikatan alumni. Sudah diperbaiki: tiap `.ccard` membawa `data-tanya`, dan layar lengkapi
  profil merender blok "Pertanyaan dari pengurus" dari situ. Jawabannya jadi tag di
  daftar anggota dan tampil di bawah komunitasnya di layar profil — bukan di tag profil.

- **Warna tema itu ketetapan pengurus saat komunitas dibuat, bukan pilihan pengunjung.**
  Karena itu tidak ada pemilih warna di tampilan anggota — prototipe sempat memasangnya
  lalu dilepas. Tiap komunitas dipetakan ke satu warna, diambil dari warna dominan
  logonya (pola `--acc` yang sudah dipakai kartu): forpastara `#FD8A0D`, iapnj `#30AEE0`,
  iasman52 `#DB462E`, ppiju `#31D9A5`. Temanya terlihat di tombol, kotak angka
  (latar ber-tint + angka berwarna), dan batang komposisi.

- **13 warna tema diambil dari `/api/themes` kolavo.app.** Produknya
  memakainya lewat `Zf(t) => {"--primary": t.mainColor, "--secondary-foreground": t.mainColor}`
  sebagai `style` inline di `<main>`, dan tiap tema juga punya `degraded_color` (pastel muda)
  yang dipakai sebagai latar section. Daftar lengkapnya: `#0D7FFD #2D6BE4 #31D9A5 #30AEE0
  #30E04D #30D4E0 #4B0082 #895129 #CB30E0 #DB462E #E3269B #EBC81E #FD8A0D`.

  **Tidak bisa disalin mentah ke sini** karena halaman ini punya mode gelap sementara
  produknya tidak. `#4B0082` di atas `#0D1017` praktis tak terlihat, dan `degraded_color`
  pastel cuma benar di atas putih. Jadi warnanya diturunkan per tema: isian diangkat ke
  arah putih kalau luminansinya di bawah 90 dan mode gelap aktif, teks berwarna ditarik
  lebih jauh lagi, wash dihitung sebagai alpha dari warnanya sendiri (bukan `degraded_color`),
  dan `--btn-ink` dipilih hitam/putih menurut luminansi — situs live memakai putih di atas
  kuning `#EBC81E` dan kontrasnya tipis. Dihitung ulang lewat `MutationObserver` +
  `matchMedia` setiap tema terang/gelap berubah.

- **Halaman komunitas (`scrKomunitas`) menjual isi yang terkunci lewat angka agregat.**
  Aslinya di kolavo.app halaman ini sangat tipis: logo, nama, lokasi, satu kalimat
  deskripsi, tombol Gabung — komponen `k_({logoUrl, shortName, name, location,
  description, membershipStatus, onJoin})`. Tidak ada apa pun yang menunjukkan kenapa
  orang harus masuk, padahal justru daftar anggotanya yang jadi alasan.

  Jalan keluarnya: **komposisi tanpa identitas.** Sebaran pekerjaan dan domisili
  ditampilkan sebagai batang berhitung (Guru 3, Kontraktor 2, …) plus rentang angkatan
  dan jumlah kota. Angkanya menjual isinya, tapi tak satu pun nama terbuka — janji
  "daftar anggota cuma buat sesama anggota" tetap utuh. Daftar anggotanya sendiri
  ditampilkan sebagai baris kerangka berkabut (`--kabut`, token baru: putih di terang,
  warna kartu di gelap) dengan foto diburamkan `blur(7px)`.

  **Section Pengurus sempat ada lalu dilepas atas permintaan ("untuk sekarang").**
  Aturan CSS `.peng*` dan larik `pengurus` di data komunitas sengaja dibiarkan, jadi
  memasangnya lagi cukup mengembalikan satu `<section>` dan satu baris render di `gambar()`.

  Status keanggotaan mengikuti yang ada di produk: `Gabung` -> `Menunggu persetujuan`.
  Aslinya juga punya `Pendaftaran Belum Diterima` (ditolak, tidak bisa mengajukan ulang)
  yang belum dibuat di prototipe.

- **Keadaan diterima: `diajukan[kelas]` jadi `'anggota'`.** Yang berubah serentak —
  pil aksi (`Menunggu persetujuan` -> `Kamu anggota di sini`), daftar anggota
  (`#komKunci` diganti `#komBuka`), sub-judul daftar dan sub-judul Pengurus
  ("yang akan meninjau pendaftaranmu" -> "yang mengurus komunitas ini"), dan chip
  di layar profil (`Menunggu` -> `Anggota`). `Pendaftaran Belum Diterima` masih belum ada.

  **Daftar yang terbuka memakai komponen yang sama persis dengan panel di hero**
  (`.panel` / `.panel-bar` / `.panel-filters` / `.m` / `.tags`). Yang dijanjikan di
  beranda dan yang didapat setelah diterima harus satu benda, bukan dua desain yang
  mirip — kalau berbeda, hero jadi iklan yang tidak ditepati.

  **Chip saring disusun dari baris yang benar-benar ada, bukan dari agregat.** Chip
  dari agregat bisa menyaring jadi kosong, dan daftar kosong terbaca sebagai rusak.

- **Begitu diterima, penggunanya ikut jadi isi komunitas.** Satu baris paling atas
  bertanda `Kamu` (foto, pekerjaan, domisili, plus jawaban ke pengurus lewat
  `KolavoJawaban()` — jawaban melekat ke keanggotaan, jadi di sinilah tempatnya),
  jumlah naik satu di keempat tempat yang menyebutnya (kepala halaman, angka besar,
  bilah panel, chip di layar profil), dan komposisinya naik satu di keranjang yang
  cocok. Kalau salah satu tidak ikut, halamannya berselisih satu dengan dirinya
  sendiri dan itu terbaca sebagai bug, bukan sebagai pilihan.

  `samakan()` ada karena agregat menulis `Kab. Bekasi` sementara pemilih domisili
  menulis `Kabupaten Bekasi` — tanpa penyeragaman itu penggunanya selalu jatuh ke
  keranjang `Lainnya`.

  **Kartu di direktori beranda sengaja tidak ikut naik.** `dariKartu()` membaca
  jumlahnya dari DOM kartu; menaikkan angka di kartu berarti hitungannya bertambah
  lagi tiap kali halaman komunitasnya dibuka ulang.

- **Tombol "Setujui pendaftaran" ada di bilah demo, bukan di halaman.** Di produk
  keputusan ini datang dari orang lain, jadi tidak ada padanannya di layar pengguna.
  Ditaruh di bilah demo (warna hijau, beda dari tombol produk) supaya jelas itu alat
  prototipe, dan hanya muncul kalau ada pendaftaran yang menunggu.

- **Daftar anggotanya subset: 6 orang dari jumlah sebenarnya.** Kaki daftar
  mengakuinya terus terang ("Menampilkan 7 dari 23 anggota — sisanya belum dibuat di
  prototipe") daripada memalsukan 22 baris. Empat orang berfoto (Rani, Fajar, Ayu,
  Bagas) menjaga identitas yang sama lintas komunitas: Rani desainer produk Jakarta
  Selatan, Fajar kontraktor Jakarta Utara, Ayu apoteker Depok — sama dengan yang
  dipakai panel hero.

  **Bagas Prakoso adalah pengguna demonya sendiri**, jadi dia tidak dipasang lagi
  sebagai baris anggota. Tapi dia masih terdaftar sebagai *pengurus* di
  `l-forpastara` (Sekretaris) dan `l-ppiju` (Ketua) — artinya pengguna mendaftar ke
  komunitas yang mencantumkan namanya sendiri sebagai pengurus. Tabrakan lama,
  belum diputuskan mau dilepas dari mana.

- **Apa yang sebenarnya dilihat anggota di kolavo.app** (dicek 29 Agustus 2026 lewat
  sesi login sungguhan, komunitas IKAPUNIJA TIK, 10 anggota):

  - kepala halaman sama dengan versi publik, tombol Gabung diganti
    **"Edit Data Pendaftaran"**;
  - **"Cari Tahu Di Sini 👇🏻"** — sebaris chip besar berisi *nilai jawaban* anggota atas
    pertanyaan pengurus, semua pertanyaan tercampur datar tanpa keterangan:
    `Teknik Informatika` `2010` `IT AeU` `Multimedia` `2009` `2014` … termasuk yang
    berantakan (`Tmj`, `Lupa wkwkwk`);
  - klik satu chip → modal **"Program Studi Teknik Informatika · 7 Anggota"** dengan
    pengalih **"Lihat Berdasarkan: [Tahun Angkatan] [Kelas]"**, pengurut "Terbanyak",
    dan batang berhitung (2010 → 5, 2009 → 2). Judul modal menempelkan `judul`
    pertanyaannya di depan nilai chip-nya;
  - batangnya tidak bisa diklik lebih dalam — modal itu buntu.

  **Daftar anggota bernama ada, di halaman terpisah.** Angka "10 Anggota" itu tombol
  menuju `/:komunitas/members` ("Anggota IKAPUNIJA TIK", remah roti *Daftar Anggota*).
  Isinya kisi kartu tegak 5 kolom: **foto besar di atas**, nama panggilan di bawahnya,
  lalu tag jawaban pertanyaan pengurus. Penyaringnya sebaris kategori —
  `Semua | Tahun Angkatan | Program Studi | Kelas` — yaitu judul pertanyaannya, bukan
  nilainya. Klik satu kartu → `/:komunitas/members/:id`.

  **Detail anggota** berisi, berurutan dari atas: foto besar, nama panggilan, nama
  lengkap, nomor WhatsApp, kota, tag jawaban, lalu **"Riwayat Persetujuan"** (catatan
  keputusan pengurus, tanggal bergabung, disetujui oleh siapa), lalu **"Daftar
  Komunitas"** — kartu komunitas lain yang diikuti orang itu beserta perannya.

  **Profil di live tidak menyimpan pekerjaan, keahlian, atau bio.** `/profile/edit`
  hanya punya: foto, nama lengkap, tanggal lahir, jenis kelamin, nomor WhatsApp,
  e-mail, dan negara/provinsi/kota. Jadi seluruh bekal "orang ini siapa" yang terlihat
  sesama anggota = foto + nama panggilan + kota + jawaban pertanyaan pengurus. Kolom
  `kerja` dan `bio` di layar Lengkapi Profil v3 adalah tambahan v3, bukan cerminan live.

  Di layar profil, live memakai **dua** chip per komunitas — peran (`Member`/`Admin`)
  dan status (`Diterima`/`Diterbitkan`) — dengan saringan Semua/Admin/Menunggu/**Ditolak**.
  Jadi keadaan ditolak memang ada di produk, tinggal belum dibuat di prototipe.

  **Keputusan: v3 membuka nama di halaman komunitasnya sendiri**, tidak di halaman
  terpisah seperti live (diputuskan 29 Agustus 2026). Sebabnya bukan lagi "live tidak
  punya" — live punya — melainkan letaknya: di live daftar bernama disembunyikan di
  balik angka yang tidak terlihat seperti tautan, sementara yang menyambut anggota di
  halaman komunitas justru modal agregat yang buntu. Yang paling berharga jadi paling
  susah ditemukan.

  Dua hal dari live yang diambil:
  1. **"Edit Data Pendaftaran"** jadi aksi anggota di `#komAksi`. Formulir pertanyaannya
     dibuka lagi dalam keadaan terisi (`jawabanTersimpan` per kelas komunitas, karena
     `gambarTanya()` membangun ulang kolomnya dan menghapus isinya), tombol kirimnya
     berganti jadi "Simpan perubahan", dan menyimpan tidak mengembalikan status ke
     `menunggu`.
  2. **"Lihat berdasarkan"** — sumbu penelusuran `Keahlian / Angkatan / Domisili`,
     baris chip nilainya menyesuaikan. Di live sumbunya ada di dalam modal dan nilainya
     tercampur datar di halaman, sehingga `2010` dan `Teknik Informatika` terbaca
     sejenis; di sini sumbunya dinaikkan ke daftarnya dan diberi label.

  Baris sendiri ikut tersaring di sumbu Angkatan lewat tahun yang dicomot dari jawaban
  (`/\b(?:19|20)\d{2}\b/`), dan domisilinya dipetakan ke ejaan agregat lewat `samakan()` —
  tanpa itu chip domisili memajang `Kab. Bekasi` dan `Kabupaten Bekasi` berdampingan
  seolah dua tempat berbeda.

- **Pertanyaan pengurus pindah dari layar profil ke langkah gabung.** Di kolavo.app
  `/:komunitas/join-membership` memang terpisah dari `/profile/edit`, dan itu benar:
  jawabannya melekat ke keanggotaan, bukan ke orangnya. Prototipe sempat menggabungnya
  ke layar lengkapi profil demi memperpendek alur pertama, tapi jadi salah begitu ada
  pengguna yang profilnya sudah lengkap lalu membuka komunitas kedua — pertanyaannya
  tidak akan pernah ditanyakan. Progres di layar profil kembali murni 5 langkah.

- **Halaman komunitas publik; gerbangnya di tombol Gabung, bukan di "Lihat".** Sama
  seperti kolavo.app, yang `/IKAMADU`-nya bisa dibuka tanpa akun. Orang boleh menjelajah
  isi komunitas dulu — angka, komposisi, pengurus — dan modal masuk baru muncul waktu
  benar-benar mau gabung. Tombol Gabung punya tiga keadaan: belum masuk -> modal masuk;
  sudah masuk tapi profil draft -> layar lengkapi profil; profil lengkap -> formulir
  pertanyaan pengurus.

  Niat dan kartu pemicunya disimpan sebagai nilai di skrip modal (`pemicuNiat`,
  `pemicuKartu`), bukan dibaca ulang dari atribut DOM — tombol Gabung tidak punya
  `data-login` dan tidak berada di dalam `.ccard`, jadi pembacaan lewat DOM diam-diam
  jatuh ke varian copy umum.

- **Copy halaman ditulis dari sudut pandang pengguna, bukan penjelasan desain.** Prototipe
  ini jadi acuan development, jadi kalimat yang menerangkan *kenapa desainnya begitu*
  dibuang: "Angkanya terbuka, orangnya belum…" -> "Gambaran siapa saja yang ada di
  komunitas ini.", dan "Bagian ini terbuka buat siapa pun" dihapus dari bagian Pengurus.

- **Layar profil punya penanda halaman.** Tiga layar saling menggantikan di satu berkas,
  jadi tanpa label tidak ada yang memberitahu pengguna sedang di mana — nav tidak berubah
  antar layar. Ditaruh sebagai baris kecil "Profil saya" beruppercase di atas kartu, bukan
  sebagai heading, supaya nama orangnya tetap jadi `h1` di halamannya sendiri.

- **Keadaan kosong "Komunitas saya" memakai komponen `.empty` dari kit**, bukan satu
  kalimat dengan tautan teks — tautan teks di dasar halaman terlalu mudah terlewat,
  padahal di titik itu justru profilnya sudah lengkap dan yang kurang tinggal komunitasnya.
  Dua tombol: cari komunitas, atau bikin halaman sendiri kalau pengurusnya belum.

- **Kartu identitas Google punya keadaan sunting.** "Ganti" tadinya satu kata untuk tiga
  hal yang berbeda perlakuannya. Sekarang klik "Ganti" membuka kartu jadi form: foto
  bisa diganti (dibaca lewat `FileReader` jadi data URL — tanpa jaringan, dan dipasang ke
  semua `.p-bagas` di halaman supaya nav, kartu, dan layar profil ikut berubah), nama
  bisa diubah, e-mail **tidak** bisa dan alasannya ditulis di tempat: terikat ke akun
  Google, gantinya lewat keluar-masuk akun lain. Ada "Balikin foto Google" kalau sudah
  telanjur menaruh foto sendiri; Batal membuang pratinjau yang belum disimpan.

- **Layar lengkapi profil (di dalam `ReDesign_Kolavo_3.html`).** Tiga blok berlabel siapa yang
  bisa melihat (dari Google · cuma pengurus · dilihat sesama anggota), bilah progres yang
  jumlah langkahnya ikut komunitas tujuan, dan tanggal lahir jadi satu kolom dengan
  kalender pop-up. **Kalendernya memakai menu bulan + tahun di kepalanya**, bukan panah
  bulan-per-bulan — itu inti masalahnya, bukan kalendernya. Sempat dibuat tiga menu pilih
  (tgl/bln/thn) lalu dikembalikan ke kalender atas permintaan; nilainya disimpan di satu
  `input[type=hidden]#lahir` berformat `YYYY-MM-DD`, jadi validasi cukup memeriksa satu kolom.
  Panel pratinjau kartu anggota sempat ada di kolom kanan lalu **dihapus atas permintaan** —
  layarnya kini satu kolom 720px, form saja. Pekerjaan dan bio ditambahkan sebagai
  **opsional** — tujuh kolom wajib yang sekarang tak satu pun muncul di direktori,
  padahal itu janji produknya. (Angkatan **tidak** ikut: itu milik komunitas, lihat butir di atas.)
  Akun contoh: Bagas Prakoso (persona AI yang sudah ada), bukan orang sungguhan.

- **`ReDesign_Kolavo_3.html` melipat argumen WAG ke dalam hero.** H1 jadi dua kalimat
  sejajar ("Di WAG cuma ada nomornya. Di Kolavo ada orangnya."), visual hero jadi
  kartu WAG bertumpuk di belakang panel daftar anggota, dan section "Karena tak kenal,
  maka tak kolab" dihapus. Konsekuensinya: rotator kata di H1 hilang, ukuran H1 turun
  ke `clamp(28px,3.4vw,40px)` supaya tiap kalimat muat satu baris, kolom hero jadi
  1.15fr/.85fr, dan dua kolom baru menyala di 1060px. Kicker "Karena tak kenal, maka
  tak kolab" belum punya rumah baru. CSS yang jadi mati di v3 (`.ticks` `.ck` `.hstack`
  `.hcard` `.ba` `.arrow` `.rot`) sengaja dibiarkan supaya section itu gampang dipasang lagi.
- **Dua section pernah dibuat lalu dihapus**: cerita pendiri dan pendampingan komunitas.
  Ada di riwayat versi Artifact kalau mau dipasang lagi.

- **Layar kelima: `scrAnggota`, detail satu orang.** Dibuka dari klik baris di daftar
  anggota terbuka (peran, tidak ada `data-login` — pola yang sama dengan tombol
  Gabung). Urutannya sengaja dibalik dari kolavo.app:

  1. foto + nama + **satu baris pekerjaan** (di live tempat ini diisi nomor
     WhatsApp + nama lengkap — dua hal administratif, bukan alasan orang membuka
     profil sesama anggota)
  2. tag keahlian/domisili/angkatan, lalu bio kalau ada
  3. **"Juga di komunitas"** — dinaikkan dari dasar halaman di live. Komunitas lain
     yang diikuti orang itu beserta perannya adalah keterangan sosial yang
     sungguhan, sekaligus lingkar penemuan komunitas berikutnya
  4. satu baris kecil yang bilang WhatsApp dan nama lengkap tetap dikunci ke
     pengurus — halaman ini buat kenal, bukan buat menghubungi

  **"Riwayat Persetujuan" (blok terbesar di live) sengaja tidak dibawa.** Itu arsip
  administratif buat pengurus, bukan buat sesama anggota yang sedang menimbang orang.

  **`ORANG` — bekal "sekarang ngapain" — melekat ke nama, terpisah dari data per
  komunitas.** kolavo.app tidak punya kolom ini sama sekali: `/profile/edit` di sana
  cuma menyimpan foto, nama, tanggal lahir, jenis kelamin, WhatsApp, e-mail, kota.
  Tanpa satu baris "sekarang ngapain", daftar anggota bernama pun cuma jadi daftar
  kontak — foto besar menjawab "aku kenal orang ini", bukan "orang ini layak dikenal".
  Baris milik pengguna sendiri tidak diambil dari `ORANG` — dibaca langsung dari
  isian profilnya (`dasar.aku`), supaya yang tampil persis yang dia isi.

  **Tabrakan nama Bagas Prakoso (dicatat sebelumnya) sudah dibereskan**, bukan
  didiamkan lagi: dia dilepas dari daftar pengurus `l-forpastara` dan `l-ppiju`
  (diganti Rizal Hakim dan Dedi Kurniawan, tanpa foto — cuma 4 wajah AI yang boleh
  dipakai), supaya membuka profil sendiri tidak lagi memperlihatkan dirinya sebagai
  Ketua di komunitas yang tidak pernah dia daftari.

- **Daftar anggota jadi kisi kartu, bukan baris menyambung** (diputuskan 30 Agustus
  2026, atas permintaan "lebih menarik seperti media sosial"). Perubahannya murni CSS
  — `#bukaList` jadi `display:grid` (1 kolom di layar sempit, 2 kolom di ≥640px), dan
  tiap `.m` yang tadinya baris beraris-batas-bawah sekarang kartu sendiri: border penuh,
  radius 13, bayangan + naik 1px + border biru saat hover. Markup dan JS-nya tidak
  disentuh — `bukaList`/`.m`/klik-untuk-buka semuanya tetap sama seperti sebelum
  perubahan ini, karena kartunya sudah membawa hierarki yang benar (nama + pekerjaan,
  bukan foto raksasa); yang kurang cuma rasa "bisa dijelajah", bukan urutan informasinya.
  Baris `KAMU` ditandai lewat `:has(.aku)` — border hijau, bukan kelas tambahan dari JS.

  Warna hover ikut tema komunitas (`--blue` dipetakan ulang per komunitas oleh
  `KolavoTema`), jadi kartu di komunitas beraksen oranye akan menyala oranye saat
  disorot, bukan biru — bukan bug, itu sistem tema yang sudah ada.

- **"Juga di komunitas" (di `scrAnggota`) diverifikasi ulang lewat live** (30 Agustus
  2026), membuktikan section itu memang ada di produk untuk anggota mana pun — dicoba
  di profil "Ica" (bukan akun sendiri), muncul "Daftar Komunitas: IKAPUNIJA TIK —
  Member". Tapi profil Yunandha sendiri, yang di `/profile`-nya terdaftar di **dua**
  komunitas (IKAPUNIJA TIK sebagai Member, Komunitas Pengguna AI Indonesia sebagai
  Admin), di halaman `/members/:id`-nya cuma menunjukkan **satu** — kemungkinan karena
  yang ditampilkan cuma keanggotaan yang dia ikuti, bukan halaman yang dia kelola
  (statusnya beda: "Diterima" vs "Diterbitkan"). Data demo live-nya kebetulan tipis,
  jadi prototipe v3 (Ayu Lestari tampil di dua komunitas sekaligus dengan peran
  berbeda) justru lebih memperagakan fiturnya ketimbang live saat ini.

- **Detail anggota menyusul data live, dan kontaknya dikunci di balik kenalan**
  (diputuskan 30 Agustus 2026). Yang tadinya belum dibawa dari kolavo.app sekarang ada:
  **nama lengkap** (`KONTAK[nama].full`), **baris meta** berisi kota + bendera dan
  "Anggota sejak <bulan tahun>" (`s` di tiap catatan anggota per komunitas — tanggal
  bergabung melekat ke keanggotaan, bukan ke orangnya, jadi orang yang sama bisa punya
  tanggal berbeda di dua komunitas), dan **nomor WhatsApp**. Domisili pindah dari tag
  ke baris meta, mengikuti live — sebelumnya tampil dua kali.

  **Yang tetap tidak dibawa:** "Catatan Keputusan" dan "Disetujui Oleh" dari blok
  Riwayat Persetujuan. Keduanya catatan kerja pengurus ("admin kenal dengan Kak
  Nandha") dan tidak ada urusannya dengan sesama anggota yang sedang menimbang orang.
  Hanya tanggal bergabungnya yang naik, karena itu keterangan sosial, bukan arsip.

  **Nomor WhatsApp kebuka lewat persetujuan dua arah, bukan dipajang.** kolavo.app
  memajang nomor ke semua sesama anggota, padahal `/profile/edit`-nya sendiri menulis
  "Nomor WhatsApp — hanya ditampilkan ke admin komunitas kamu": halamannya melanggar
  janjinya sendiri. Di v3 `App.kenalan[nama]` punya dua nilai, `'menunggu'` dan
  `'terhubung'`; alurnya Ajak kenalan -> (pihak sana menerima) -> nomor kebuka
  dua-duanya + tombol "Chat di WhatsApp". Tombol demo **"Terima ajakan kenalan"**
  memerankan pihak seberang, sekelas dengan "Setujui pendaftaran" — sama-sama
  keputusan orang lain yang tidak punya padanan di layar pengguna.

  Ini sekaligus jawaban kenapa halaman anggota Kolavo bukan daftar kontak: di WAG
  nomor semua orang otomatis kelihatan begitu kamu masuk grup; di sini orangnya yang
  memutuskan. Blok kenalan tidak muncul di profil sendiri.

  **Nomor di `KONTAK` semuanya karangan** (pola `08xx-xxxx-<angkatan>`). Jangan pernah
  menaruh nomor sungguhan di prototipe — sama alasannya dengan larangan foto asli.

  Belum diputuskan: apakah percakapannya tetap dilempar ke WhatsApp (seperti sekarang)
  atau Kolavo punya chat sendiri. Sekarang tombolnya cuma memunculkan toast bahwa di
  produk ia membuka WhatsApp.

  **Di profil sendiri, section komunitasnya berganti maksud.** `komunitasOrang()`
  menyisir `DATA`, dan penggunanya memang tidak ada di situ — keanggotaannya tumbuh
  saat prototipe dipakai, tersimpan di `App.diajukan`. Karena itu ada
  `komunitasAku()` yang membacanya dari sana, dan judulnya ikut berganti:

  | | judul | isi |
  |---|---|---|
  | orang lain | "Juga di komunitas" | komunitas lain, yang sedang dibuka disembunyikan |
  | diri sendiri | "Komunitas saya" | semua, termasuk yang sedang dibuka dan yang masih `menunggu` |

  Komunitas yang sedang dibuka disembunyikan di profil orang lain karena sudah jelas
  dia anggota di sini — itu sebabnya kamu melihatnya dari daftar ini. Di profil sendiri
  justru sebaliknya: yang dicari "aku ada di mana saja", bukan "selain di sini dia di
  mana". Yang masih `menunggu` ikut tampil dengan peran "Menunggu persetujuan", jadi
  halaman ini juga jadi tempat melihat lamaran yang belum dijawab.

- **Layar keenam: `scrBuat`, buat halaman komunitas** (dibuat 30 Agustus 2026). Sampai
  sekarang niat `pengurus` buntu: modal masuk menjanjikan "bikin halaman komunitasmu",
  lalu layar lengkapi profil bertombol "Simpan & lanjut bikin halaman" — dan berakhir
  di layar profil. Sekarang berakhir di layarnya sendiri.

  Tiga hal ditanyakan di sini yang di kolavo.app tidak ada di `/create`:

  1. **Warna tema.** Sudah diputuskan sebelumnya bahwa warna itu ketetapan pengurus saat
     komunitas dibuat, dan karena itu tidak ada pemilihnya di tampilan anggota. Kalau
     tidak ditanyakan di sini, tidak ada tempat lain yang boleh menanyakannya. Tigabelas
     petak, dan warnanya langsung dipakai di layar itu juga — tombol, nomor kartu,
     petak logo — jadi pratinjaunya tidak perlu panel sendiri. (Panel pratinjau di kolom
     kanan sudah pernah dihapus atas permintaan di layar lengkapi profil; aturan yang
     sama berlaku di sini: satu kolom 720px, form saja.)
  2. **Formulir pendaftaran.** Di produk ia hidup terpisah di `/membership-settings`,
     dan kartu bawaannya **berjudul kosong** — "Contoh: Tahun Angkatan" cuma placeholder,
     pengurus ditinggal menebak. Padahal bentuk komunitasnya sudah ditanyakan beberapa
     kolom di atas: ikatan alumni -> "Tahun Lulus", organisasi -> "Tahun Pengukuhan",
     asosiasi -> "Tahun Bergabung", himpunan -> "Angkatan". Judulnya terisi sendiri dan
     ikut berubah selama belum diketik ulang. Kartu `nickname` terkunci seperti di produk.
     Batasnya lima pertanyaan, dan alasannya ditulis di tempat.
  3. **Alamat halaman.** Yang benar-benar dipakai pengurus sesudah ini cuma satu link,
     jadi link itu ditunjukkan sejak dibuat. Singkatannya diturunkan dari nama dengan
     aturan yang sama seperti komunitas asli — kata pendek dan kata berangka dibiarkan
     utuh, kata panjang tinggal huruf depannya. "Ikatan Alumni PNJ" -> `iapnj`,
     "Purna Paskibraka Indonesia Jakarta Utara" -> `ppiju`, "Ikatan Alumni SMAN 52" ->
     `iasman52`. Tiga dari empat slug yang sudah ada keluar sendiri dari aturan ini.

  **Keluaran `tanya` bentuknya sama persis dengan `data-tanya` di kartu direktori.**
  Formulir yang barusan disusun pengurus dan formulir yang dilihat calon anggota memang
  benda yang sama — kalau bentuknya beda, layar ini cuma pura-pura.

  **Keadaan selesai menggantikan formulirnya di layar yang sama**, bukan layar ketujuh.
  Isinya cuma yang dibutuhkan sesudah ini: kartu komunitasnya, linknya + Salin, dua
  langkah berikutnya, dan tombol menyebar ke grup. Tombol WhatsApp menyalin teks lalu
  memunculkan toast bahwa di produk ia membuka WhatsApp — sama seperti tombol chat di
  detail anggota, dan sama seperti "Ajak pengurusmu bikin halaman" di beranda, yang juga
  menyalin: prototipe ini jalan di iframe ber-sandbox tempat membuka jendela baru diblokir.

  **Komunitas buatan sendiri masuk ke "Komunitas saya" di layar profil** dengan chip
  `Pengurus` (`window.KolavoDibuatItem()`, dibaca `isiProfil()`). Keadaan kosong `.empty`
  jadi tidak muncul lagi begitu ada satu — dan tombol "Bikin halaman komunitas" di
  keadaan kosong itu sekarang menuju `scrBuat`, bukan balik ke `#pengurus` di beranda.

  **Yang belum dibuat: halaman komunitas yang baru dibuat belum bisa dibuka.**
  `scrKomunitas` digerakkan agregat per kelas (`DATA['l-…']`) dan komunitas umur nol
  tidak punya satu pun — komposisi kosong, daftar anggota kosong, angka nol. Itu
  pertanyaan desain tersendiri (halaman yang seluruh jualannya angka, di hari pertama
  angkanya nol), bukan sekadar pekerjaan sambungan. Keadaan selesai mengakuinya terus
  terang, pola yang sama dengan kaki daftar anggota ("7 dari 23 — sisanya belum dibuat
  di prototipe"). `komunitasAku()` di `scrAnggota` juga belum membacanya, karena
  `namaKelas()` tidak punya kelas buat komunitas baru.

- **Skrip warna tema jadi bisa mewarnai lebih dari satu elemen.** Dulu `terapkan()`
  menulis langsung ke `#scrKomunitas`. Sekarang ada `warnai(sasaran, hex)` dan sebuah
  daftar `{el, hex}`; `KolavoTema(kelas)` mengisi baris untuk halaman komunitas,
  `KolavoWarnai(el, hex)` untuk layar buat halaman. Turunan gelap/terangnya tetap satu —
  menyalinnya jadi dua akan berselisih diam-diam di mode gelap, dan justru turunan
  itulah bagian yang rumit.

- **`data-login` tidak lagi membuka modal kalau sudah masuk.** Pengguna yang profilnya
  sudah beres lalu menekan "Buat Halaman Komunitas" di beranda tadinya disodori modal
  Google untuk kedua kalinya — jalan buntu, karena akunnya sudah ada. Sekarang
  `KolavoMasuk()` dipanggil langsung dan alurnya diteruskan ke layar tujuannya.

- **Daftar wilayah dipakai bersama.** `window.KolavoWilayah` dibuka dari skrip domisili
  layar lengkapi profil. Dua daftar terpisah berarti "Kota Depok" di satu layar dan
  "Depok" di layar lain, dan `samakan()` sudah pernah dibuat gara-gara masalah itu.

- **Dashboard Advance (awalnya bernama Sekretariat), dibuka lewat toggle Esensial | Advance**
  (label kiri semula "Simpel", diganti "Esensial" supaya tampilan bawaan tidak terdengar seperti versi potongan)
  (dibuat 14 September 2026, direvisi hari yang sama). Toggle ada di atas navigasi
  `scrKelola`. **Esensial** = dashboard yang sudah ada, tampil persis seperti sebelumnya
  (baris tab horizontal, empat tab). **Advance** = lima panel tambahan di kolom samping,
  menjawab satu kendala administratif yang *tercatat*, bukan dikarang:

  | panel | kendala | sumber |
  |---|---|---|
  | Meja kerja | pengurus sukarela telat meninjau, tak ada pengingat | protokol riset (contoh kasus "admin sering terlambat memeriksa formulir") |
  | Cocokkan data | pendaftar menumpuk, disetujui satu-satu; database lama sudah ada di spreadsheet | BP Membership Intelligence (auto-approve CSV) · feedback 7 Agustus 2026 |
  | Rapikan jawaban | jawaban sama beda tulisan → tag ganda, sebaran anggota salah | User Testing 18 Juli 2026 no. 4, 6, 7 |
  | Akses pengurus | data di akun pribadi satu orang; siapa boleh lihat data sensitif | BP kepengurusan berjenjang · protokol riset |
  | Serah terima | data & akses hilang tiap ganti pengurus | BP fitur Pergantian Kepengurusan · riset (regenerasi) |

  Catatan jujur: `Riset Memahami Kebutuhan Community Builder.docx` masih berupa
  *protokol* — kalimat yang dikutip adalah contoh pengisian, belum temuan wawancara.
  Validasikan dulu sebelum dianggap bukti.

  **Langganan melekat ke komunitas, bukan ke akun.** Ini jawaban atas "bisa dibagi ke
  pengurus lain": semua pengurus yang diundang memakai langganan yang sama dengan akun
  Google-nya sendiri, dan langganan tidak ikut pergi saat kepengurusan berganti —
  sehingga Serah terima dan Akses pengurus saling mengunci. Harga di modal `Rp XXXX /
  anggota / bulan, minimal 50 anggota` mengikuti Pricing Strategy di BP apa adanya.

  **Jabatan ≠ akses dashboard.** Diangkat jadi pengurus (tab Kepengurusan) membuat
  orang tampil di halaman komunitas; memegang dashboard diberikan terpisah di Akses
  pengurus, dengan tiga hak (Penuh / Data anggota / Lihat saja). Hak menyetujui
  pendaftaran tetap mengikuti *peninjau pendaftaran* — tidak digandakan ke matriks hak.

  **Toggle, bukan tab terkunci** (revisi atas permintaan). Versi pertama menaruh tab
  berbayar bergembok di samping tab dasar; diganti toggle supaya dashboard simpel tetap
  bersih. Memilih Advance tanpa langganan memunculkan pop up langganan dan toggle
  *tidak* pindah sampai Berlangganan ditekan ("Tetap di Esensial" menutupnya). Sesudah
  berlangganan toggle bebas dipindah; kembali ke Esensial tidak mematikan langganan, dan
  tab Advance yang sedang terbuka jatuh ke Permintaan gabung. Nama di UI mengikuti
  sebutan user ("advance"), bukan "Sekretariat" — modulnya tetap `50-js-sekretariat`.
  Ajakan juga muncul di panel Permintaan saat antrean ≥ 4 (`#sekNudge`, tombolnya
  memilih Advance). Seed pendaftar ditambah tiga (Rina, Bayu, Galih — inisial, tanpa
  foto) dengan umur 5–8 hari supaya antreannya terasa menumpuk.

  **Teknis.** Modul baru `src/50-js-sekretariat.html` menempel ke
  `KolavoDashboard` lewat dua kait: `D.onBangun` (reset keadaan per komunitas) dan
  `D.onGambar` (gambar ulang). Menerima dipusatkan jadi `D.terima(r, {catatan, id,
  otomatis})` — dipakai kartu permintaan dan penerimaan massal, jadi nomor anggota dan
  riwayat tidak punya dua jalur. `pilihTab` sekarang generik lewat `data-panel`;
  tampilan dipegang `D.mode` ('simple' | 'advance') dan kelas `#scrKelola.mode-adv`.
  Hanya di Advance navigasi jadi kolom samping di ≥900px (dua kelompok: Kelola /
  Advance); di Esensial dan layar sempit tetap baris tab. `.kl-row` sekarang boleh turun baris supaya tombol
  aksi tidak meremas nama di 375px.

  Data di Rapikan jawaban (kolom Jurusan untuk alumni/himpunan, Cabang untuk bentuk
  lain) dan database 214 baris adalah contoh — ditulis begitu di layarnya.

  **Revisi P1 (19 Sep 2026, `PROMPT-REVISI.md`) — kerangka menu dirombak.** Tabel di
  atas sebagian sudah usang:
  - Urutan grup: **Advance di atas Kelola**.
  - "Meja kerja" → **Dashboard** (`data-tab="dasbor"`). Blok "Perlu diurus"/"Sudah
    beres" dihapus; yang tersisa angka ringkas, rangkuman mingguan, rekap. Statistik
    pertumbuhan menyusul di P2.
  - **Cocokkan data dihapus seluruhnya**: tab, panel, simulasi terima otomatis, kolom
    `db` di seed pendaftar, CSS `.sek-unggah/.sek-file/.sek-map/.sek-grup/.sek-cek`,
    dan ajakannya di nudge. Nudge kini hanya muncul di Esensial.
  - Menu bersub-menu: **Setting** (Advance) = Akun · Notifikasi · Tagihan (kerangka,
    isi di P3) · Akses pengurus. **Kepengurusan** (Kelola) = Struktur Kepengurusan ·
    Serah terima (Advance saja). "Kelola langganan" di bilah paket membuka Tagihan.
  - Pola sub-menu: tombol induk `.kl-induk[data-induk]` + `.kl-subnav[data-grup]`. Di
    kolom samping induk membuka-tutup grupnya; grup yang memuat tab aktif selalu
    terbuka. Di baris tab (layar sempit) induk disembunyikan dan sub-menunya jadi tab
    biasa; di Esensial kebalikannya — induk Kepengurusan yang tampil, sub-menunya
    tersembunyi. Induk disembunyikan lewat selektor atribut `[data-induk]`, bukan
    kelas, supaya audit tidak menandai `.kl-tab` vs `.kl-induk` berebut `display`.

  **Revisi P2 — isi Dashboard.** Empat angka pertumbuhan minggu ini (pengunjung profil,
  pendaftar, diterima, ditolak) + dua angka akses (dokumen komunitas, alat komunikasi),
  masing-masing dengan ▲/▼ % dari minggu lalu. Satu grafik garis dengan dua pilihan
  data — *Anggota* (pendaftar/diterima/ditolak) dan *Kunjungan & akses* — bukan satu
  grafik dua sumbu. Rentang 4/12 minggu, crosshair + tooltip, nilai terakhir di ujung
  garis, tabel di `<details>`. Unduh rekap = CSV 12 minggu (Blob, sisi klien).
  - Data 12 minggu adalah contoh (`SERI` di `50-js-sekretariat`); diterima/ditolak
    minggu ini ikut bertambah dari keputusan di Riwayat prototipe.
  - Token baru `--viz-1/2/3` (biru, oranye, hijau) di ketiga blok tema, divalidasi
    `dataviz/validate_palette.js`: lolos terang & gelap. Pasangan hijau–oranye mepet
    untuk protan (ΔE 6,4), jadi seri oranye digambar putus-putus.
  - Grafik digambar ulang sesuai lebar wadah (teks tetap 11px di layar sempit).
    Panel tersembunyi lebarnya 0, jadi ada tiga jalur gambar ulang: ResizeObserver,
    `setTimeout` sesudah `gambarSemua`, dan klik tab Dashboard. ResizeObserver saja
    tidak cukup di tab browser yang `hidden`.
  - Viewer Artifact memblokir tautan Blob/`download`. Artifact dipublish dengan
    kapabilitas `downloads`; tombol memakai `claude.use('downloads').save()` (viewer
    mengonfirmasi), dan jatuh ke tautan Blob biasa kalau berkas dibuka langsung.
    Republish berikutnya **jangan** mengirim `capabilities` kosong — itu mencabutnya.
  - Kelas tabel rincian di Dashboard bernama `.sek-rinci*`, bukan `.sek-tabel*` —
    nama itu sudah dipakai tabel Siapa boleh apa (P2 sempat bentrok, dibetulkan di P3).
  - Blok "Rekap untuk rapat (PDF)" dan empat angka lama (anggota, menunggu, terlama,
    pemegang dashboard) diganti; rangkuman mingguan ke WhatsApp dipertahankan.

  **Revisi P3 — Setting.**
  - **Akun**: ganti email pemilik dua langkah (email baru → kode 6 angka; prototipe
    menerima kode apa pun). Email lama di penerima notifikasi dan email tagihan ikut
    diganti. Pindah kepemilikan tetap lewat Serah terima (ada tautannya).
  - **Notifikasi**: empat jenis aktivitas dengan sakelar + penerima maksimal 3 email.
    Di 3, kolom dan tombol tambah dinonaktifkan; penerima terakhir tak bisa dihapus.
  - **Tagihan**: paket (harga tetap `XXXX`), alamat penagihan (lihat/ubah), metode
    pembayaran VA / QRIS / kartu — **tanpa kolom nomor kartu**; data kartu diisi di
    halaman penyedia pembayaran. Riwayat tagihan contoh.
  - **Akses pengurus — model hak berubah: dari per orang (Penuh / Data anggota /
    Lihat saja) ke per JABATAN.** Tabel Siapa boleh apa = baris hak × kolom jabatan,
    berisi centang; perubahan ditandai (sel oranye) dan baru berlaku setelah Simpan.
    Tiap orang tinggal Beri akses / Cabut; baris menampilkan "Boleh: …" dari jabatannya.
    Undangan memilih jabatan, bukan level. Daftar jabatan satu sumber: `D.jabatan`
    (`50-js-dashboard-pengurus`), dipakai P4 untuk jabatan kustom; jabatan tanpa hak
    awal di `HAK_AWAL` mendapat "Lihat Dashboard" saja.

  **Revisi P4 — Kepengurusan.**
  - **Struktur Kepengurusan** (Advance) diberi bagian *Jabatan di komunitas ini*:
    chip semua jabatan (kustom berwarna biru) + kolom "+ Jabatan kustom" (Enter juga
    menambah). Jabatan kustom ditolak kalau namanya sudah ada (tak peka huruf besar,
    termasuk "Community Builder"), dan hanya bisa dihapus selama belum dipegang
    siapa pun. Jabatan baru langsung muncul di pemilih jabatan dan sebagai kolom di
    tabel Siapa boleh apa (hak awal: Lihat Dashboard). Daftar dikembalikan ke enam
    jabatan bawaan (`JABATAN_AWAL`) saat komunitas lain dibangun.
  - **Serah terima → Sejarah kepengurusan**: tiap periode satu `<details>` (tahun,
    ketua, jumlah pengurus) yang dibuka untuk melihat pemegang tiap jabatan. Periode
    sekarang dibaca langsung dari susunan pengurus dan terbuka secara bawaan; periode
    terjadwal muncul setelah serah terima dijadwalkan; dua periode lama adalah contoh
    (`SEJARAH_LAMA`, nama rekaan).
  - Kelas pilihan metode pembayaran P3 diganti jadi `.sek-bayar*` — `.sek-pilih`
    sudah dipakai radio "Pengurus lama setelahnya" di Serah terima dan aturannya
    saling menimpa. Audit tidak menangkap ini karena kelasnya sama, bukan dua kelas
    berbeda: sebelum menamai kelas baru, `grep` dulu di `10-styles`.

  **Revisi P5 — Info komunitas & pembeda paket di halaman komunitas.**
  - **Konten premium hanya diisi di dashboard, grup Advance → menu *Info komunitas***
    (pengumuman ≤200 karakter, tautan grup komunikasi, peraturan, dokumen; semua
    opsional, tautan wajib `https://`). Disimpan di `KolavoApp.dibuat.info`. Form Buat
    halaman tidak disentuh.
  - **Pembeda paket** di `#komInfo` (satu fungsi `gambarInfo`, cabang per paket):
    Advance = pengumuman + tombol tautan yang terisi saja; Esensial = tidak ada panel.
    Pemilik Esensial melihat kartu ajakan "Tambahkan pengumuman… dengan paket
    Advance" (pengunjung/anggota tidak); pemilik Advance dengan info kosong melihat
    "Info komunitas masih kosong". Komunitas sendiri jadi premium saat `sekAktif`.
    Direktori: Forpastara & IA SMAN 52 = Advance (data `INFO`), IA PNJ & PPI JU = Esensial.
  - **Keputusan akses tautan**: Grup WhatsApp dan dokumen *terkunci* untuk non-anggota
    ("Kebuka setelah kamu jadi anggota"), sejalan dengan daftar anggota yang tertutup;
    peraturan terbuka untuk semua karena calon anggota perlu membacanya dulu. Status
    terkunci ditandai atribut `data-kunci` (bukan kelas `.kunci` — itu sudah dipakai
    panel daftar anggota yang terkunci).
  - **Bagikan tautan** di `#komAksi` untuk semua paket dan semua peran (kecuali mode
    contoh): `navigator.share`, cadangan salin ke clipboard + toast, cadangan terakhir
    toast berisi alamatnya. Alamat `kolavo.app/k/<slug>`.
  - **Nama panggilan**: daftar anggota dan halaman detail menampilkan panggilan
    (`pg`, atau kata pertama nama). Nama lengkap hanya di tampilan pengurus (halaman
    pemilik): di baris daftar (`.nm-full`) dan "Nama lengkap: …" di detail.
    Sebelumnya `agFull` tampil ke semua anggota. Dashboard kini menyimpan `full`.
  - **Lengkapi profil**: *Akun media sosial* opsional — baris platform + nama akun,
    maksimal 5, baris kosong tidak disimpan. Dibaca lewat `KolavoSosmed()`; belum
    ditampilkan di mana pun.

  **Revisi P6 — Jawaban pendaftar & Template email.**
  - Grup Advance kini: Dashboard · Info komunitas · **Jawaban pendaftar ▾** (Tinjau
    jawaban · Kelompokkan · Rapikan tulisan) · **Template email** · Setting ▾.
    "Rapikan jawaban" lama dipindah jadi sub-menu *Rapikan tulisan* (isi tak berubah);
    hak `rapi` di Siapa boleh apa kini berlabel "Kelola jawaban pendaftar & template email".
  - **Tinjau jawaban**: kartu per orang (menunggu + sudah anggota, saring 3 segmen)
    berisi Pekerjaan, Domisili, dan pertanyaan teks pengurus; label kelompok tampil di
    samping jawaban. Dashboard kini menyimpan `jawaban` anggota saat diterima.
  - **Kelompokkan**: pilih kolom → buat kelompok → petakan tiap jawaban unik lewat
    dropdown (langsung berlaku, tercatat di jejak). "Isi usulan" (khusus Pekerjaan)
    mengisi dari aturan kata kunci `USUL_KERJA`, hanya saat ditekan. Kelompok yang
    masih dipakai tak bisa dihapus. Disimpan di `D.kelompok`; `D.kelompokOrang(nama)`
    dan `D.kelompokSumbu()` dipakai halaman komunitas: di halaman pemilik muncul sumbu
    saring baru "Kelompok pekerjaan" dst. P8 memakai hal yang sama untuk kenalan.
  - **Template email**: Diterima | Ditolak, subjek + isi, chip variabel `{nama}`
    (panggilan) `{nama_lengkap}` `{komunitas}` `{tautan}` dan `{alasan}` (khusus
    ditolak, dari catatan penolakan) disisipkan di posisi kursor kolom terakhir yang
    difokus. Pratinjau langsung memakai pendaftar pertama di antrean; variabel yang
    terisi ditandai. Sakelar kirim otomatis per jenis, Simpan/Batalkan/Kembalikan ke
    bawaan, "Kirim uji" (toast). **Belum tersambung ke API email** — tertulis di layar.
  - `TMPL_AWAL` didefinisikan setelah `reset()` dipanggil saat modul dimuat, jadi
    template diisi malas di `gambarEmail` (menghindari TDZ `const`).

  **Revisi P7 — Pengaturan onboarding** (grup Advance, di bawah Info komunitas).
  - Sakelar utama + lima langkah, tiap langkah punya sakelar dan isi: (1) Sambutan —
    judul, kata pengantar, penanda tangan (bawaan: nama + jabatan pemilik); (2) Kenalan
    dengan komunitas — sejarah, visi, misi; (3) Peraturan — ringkasan per baris;
    (4) Dokumen & alat komunikasi — keterangan; (5) Kenalan dengan anggota lain —
    cocokkan berdasarkan pekerjaan / domisili / kelompok jawaban, pengurus sebagai
    cadangan. Isi bawaan contoh supaya pratinjau tidak kosong.
  - **Tersimpan otomatis** tiap ketikan (beda dari Info komunitas yang pakai Simpan) —
    banyak kolom, dan langkah yang tak lengkap tetap sah. Tercatat di jejak hanya
    untuk sakelar.
  - Tautan peraturan, grup, dan dokumen **tidak diketik ulang**: langkah 3–4 membaca
    `D.kom.info`; kalau kosong tampil "Belum diisi" + tombol ke Info komunitas.
  - Semua langkah mati → peringatan + Pratinjau nonaktif. Sakelar utama mati → daftar
    langkah redup dan tak bisa disunting.
  - Konfigurasi di `D.kom.onboarding` (= `KolavoApp.dibuat.onboarding`), dibaca lewat
    `window.KolavoOnboarding()`. Tombol Pratinjau memanggil `KolavoBukaOnboarding`
    (dibuat di P8); sebelum ada, toast.

  **Revisi P8 — Notifikasi & modal onboarding (sisi anggota).** Dua modul baru:
  `50-js-notifikasi` dan `50-js-onboarding` (manifest setelah `50-js-layar-komunitas`;
  sengaja dipisah supaya modul komunitas tidak makin besar).
  - **Lonceng notifikasi** di nav, tampil bersama menu akun saat sudah masuk
    (`gambarNav` di router). Badge oranye = belum dibaca; panel berisi daftar +
    "Tandai semua dibaca"; di ≤600px panelnya `fixed` selebar layar. Kabar yang masuk:
    permintaan gabung terkirim, pendaftaran diterima (untuk Advance: "Buka halamannya
    untuk perkenalan singkat dari pengurus"), ajakan kenalan diterima. Klik membuka
    komunitas / profil anggotanya. Disimpan di `KolavoApp.notif`, ditambah lewat
    `KolavoNotifTambah()`. Notifikasi berlaku di dua paket.
  - **Modal onboarding** (kerangka `.lgn`, radius 32, `#obModal` di layer
    `scrKomunitas`): muncul ~350 ms setelah halaman komunitas digambar, hanya jika
    komunitasnya Advance, penggunanya sudah anggota, onboarding aktif, dan belum pernah
    dilihat (`KolavoApp.onboardDilihat[kelas]`). Langkah mati dilewati; penanda langkah
    di atas, Lewati / Kembali / Lanjut → Selesai di bawah. Lewati, ×, Esc, dan Selesai
    sama-sama menandai "sudah dilihat". Anggota bisa membukanya lagi lewat tautan
    "Buka lagi perkenalan komunitas" di panel info.
  - Komunitas direktori memakai konfigurasi contoh (`cfgContoh`, pengirim = pengurus
    pertamanya) + tautan dari `INFO`. Komunitas sendiri memakai konfigurasi P7 — tapi
    pemiliknya tidak pernah mendapat onboarding; ia melihatnya lewat **Pratinjau**
    (lencana "Pratinjau pengurus", tidak menandai dilihat, profil tidak dibuka).
  - **Langkah kenalan**: chip saring "Sama pekerjaan · X" / "Sama domisili · Y" /
    "Sama kelompok · Z" (kelompok hanya untuk komunitas yang punya `D.kelompok`),
    masing-masing dengan jumlah; hanya chip yang ada hasilnya yang tampil. Maks. 6
    kartu + "Lihat profil". Tanpa kecocokan → kartu pengurus. Profil pengguna dibaca
    lewat `KolavoProfilKu()` (pekerjaan termasuk "Lainnya — tulis sendiri").
  - **Regresi P5 dibetulkan**: judul detail anggota kini nama panggilan, jadi tombol
    kenalan membaca kunci orangnya dari `#agNm[data-nm]`, bukan dari teks judul.

- **Revisi lanjutan R1 — ikon dashboard & arah angka** (2026-09-19):
  - Satu set ikon bersama di modul baru `src/50-js-ikon.html` (dirakit tepat setelah
    footer, sebelum skrip lain): `window.KolavoIkon(nama, kelas)` → `<svg>` stroke 1.75
    currentColor; markup `<i data-ic="nama"></i>` diisi otomatis (`KolavoIkonIsi(akar)`
    untuk HTML yang digambar belakangan). Modul lain jangan menyalin path — tambah
    nama baru di sini. Catatan: daftar `JS` di `kit/split.py` sudah tertinggal sejak
    modul notifikasi/onboarding; jangan andalkan split.py tanpa memperbaruinya.
  - Menu dashboard pengurus: tiap `.kl-tab` diberi `.kl-tab-ic` 18px (sub 16px).
  - Kartu angka Dashboard Advance: ikon 32px di kanan angka (`.sek-stat-ic`), selisih
    mingguan jadi pil `.sek-delta.naik` (hijau `--green`) / `.turun` (merah `--red`)
    dengan panah ikon. Warna mengikuti arah angka apa adanya, termasuk "ditolak" naik
    = hijau (sesuai permintaan). Data contoh: pengunjung 88→81 dan dokumen 31→28
    supaya keadaan turun terlihat.

- **Revisi lanjutan R2 — jabatan bebas & catatan keputusan wajib** (2026-09-19):
  - "Jabatan di komunitas ini": SEMUA jabatan (termasuk Ketua/Wakil Ketua bawaan)
    punya tombol ganti nama (pensil, sunting di tempat, Enter/Esc) dan hapus (sampah).
    Hapus jabatan berpemegang → konfirmasi di chip; pemegangnya pindah ke jabatan
    pertama yang tersisa. Minimal satu jabatan tersisa (tombol hapus hilang).
    Ganti nama/hapus memanggil `D.onJabatanGanti(lama, baru|null)`; Sekretariat
    memindahkan kunci hak akses (`S.hak`/`S.hakDraf`) supaya centang tidak hilang.
    `JABATAN_AWAL` kini hanya dipakai untuk reset saat komunitas lain dibangun.
    Periode lama di Serah terima tetap memakai nama jabatan saat itu (catatan sejarah).
  - Permintaan gabung: catatan keputusan **wajib** (tanda bintang merah `*`, maks. 140
    karakter); Setujui/Tolak `disabled` sampai catatan terisi, handler juga menjaga.
  - Riwayat: tiap entri punya kotak "Catatan keputusan" (garis kiri hijau/merah
    sesuai hasil). Riwayat diisi 2 keputusan contoh saat dashboard dibangun.

- **Revisi lanjutan R3 — pengingat mingguan & sampel alasan bergabung** (2026-09-19):
  - Setting › Notifikasi: "Pendaftar menunggu 3 hari" diganti **Pengingat pendaftar**.
    Saat aktif, muncul chip hari Sen–Min (boleh lebih dari satu, minimal satu,
    bawaan Senin) + pilihan jam (bawaan 09.00) + ringkasan ("Tiap Senin & Kamis,
    pukul 09.00 WIB"; 5 hari kerja → "Tiap hari kerja", 7 → "Setiap hari").
    Keadaan: `S.notif.hari` (angka `getDay`, 0 = Minggu) dan `S.notif.jam`.
  - Tinjau jawaban: tiap pendaftar contoh punya `alasan` panjang yang sengaja
    beragam (mengajar sukarela, karier, usaha katering, balas budi beasiswa, reuni,
    riset UMKM, plus dua jawaban asal "Info lowongan." / "ikut aja"). `jawabanFor`
    memakainya untuk pertanyaan teks yang judul/isinya cocok
    `/gabung|alasan|kenapa|mengapa|motivasi/i`; pertanyaan lain tetap memakai `teks`.
    Jadi sampel ini hanya muncul kalau komunitas memang menanyakan alasan bergabung.
    Pendaftar contoh bertambah dari 6 jadi 8 (Dimas, Yoga).
  - Formulir Buat komunitas kini punya pertanyaan kedua bawaan: **Alasan Bergabung —
    "Kenapa kamu ingin bergabung di komunitas ini?"** (teks, tidak wajib, bisa diubah/
    dihapus). Jadi sampel alasan di atas langsung muncul di komunitas baru.
  - Kartu Permintaan gabung: jawaban > 40 karakter (`.kl-jawab-row.panjang`) ditaruh di
    bawah pertanyaannya dan rata kiri; jawaban pendek (tahun dsb.) tetap sejajar kanan.

- **Revisi lanjutan R4 — tombol ikon di halaman komunitas** (2026-09-19):
  - "Bagikan tautan" dan "Edit Data Pendaftaran" (anggota) kini tombol ikon bulat
    44px `.btn-ikon` (garis `--blue`, jadi ikut warna tema komunitas) dengan
    `aria-label` + tooltip CSS dari `data-tip`. Keduanya satu baris dengan aksi utama
    (`.kom-aksi-baris`: status/tombol utama melebar, ikon di kanan), jadi tetap
    terlihat di header. `gambarAksi()` = `isiAksi()` + baris ikon, sehingga panggilan
    ulang setelah menyimpan data pendaftaran tidak lagi menghilangkan tombol bagikan.
    Pratinjau pengurus tidak menampilkan baris ikon. `#komEdit` tetap id yang sama.

- **Revisi lanjutan R5 — onboarding lebih lega, stepper berikon, alur notifikasi** (2026-09-19):
  - Modal onboarding 760px (padding 34/40), badan min. 280px, judul 26px, teks 15.5px.
    Tanda tangan sambutan (`.ob-ttd`, "— Nama, Jabatan") rata kanan.
  - Stepper: tiap langkah punya ikon `KolavoIkon` (tangan, bendera, akses, jawaban,
    orang) dalam lingkaran 44px, label di bawahnya; garis progres `.ob-step-isi` di
    belakang ikon terisi sampai langkah kini. Garis digambar di posisi langkah lama
    (`iLalu`) lalu digeser dengan `setTimeout` 30 ms — bukan rAF, supaya tetap jalan
    di tab tersembunyi — sehingga terlihat berjalan saat Lanjut/Kembali.
    Titik berjalan `.ob-titik` di kaki modal (sejajar Kembali/Lanjut) **dihapus**
    atas permintaan — dobel dengan stepper di atas; kaki kini: Lewati · spasi · tombol.
  - Teks contoh panjang (sambutan 2 paragraf, sejarah, visi, 3 misi, 5 aturan,
    keterangan alat 2 paragraf) satu sumber: `window.KolavoObTeksContoh(nama, desc)`
    di modul onboarding; dipakai komunitas direktori dan isi awal editor dashboard.
    Batas editor dinaikkan (pengantar 800, sejarah 800, visi 400, misi 800, alat 600),
    textarea 5 baris.
  - P12/P1: Peraturan jadi ala TnC — 9 bagian bernomor (tentang, identitas, etika,
    informasi, promosi, privasi, kegiatan & iuran, sanksi, perubahan), 23 poin.
    Format isian: baris diawali `# ` = judul bagian (`.ob-lbl`), baris lain = poin
    (`.ob-poin`) milik bagian di atasnya. Batas editor aturan 600 → 3000.
  - P12/P2: gerbang persetujuan di langkah Peraturan. Isi dibungkus `.ob-gulir`
    (max-height 46vh; di layar 800px ≈ 367px dari isi ±1200px). Centang
    `[data-ob-setuju]` disabled sampai digulir ke bawah (toleransi 8px; isi yang
    tidak meluap langsung boleh), petunjuk `[data-ob-petunjuk]` hilang saat itu.
    Lanjut disabled sampai dicentang. Lewati TIDAK dirender sebelum/di langkah
    Peraturan — baru muncul di langkah sesudahnya setelah setuju; kalau langkah
    Peraturan dimatikan pengurus, Lewati tampil seperti biasa. Status disimpan di
    `ctx.bacaSampai`/`ctx.setuju` (bertahan saat Kembali/Lanjut). Deteksi gulir lewat
    listener `scroll` capture di modal + `cekGulir()` sesudah render dan sesudah
    modal tampil (clientHeight 0 saat modal masih hidden → dilewati).
  - P12/P3: peraturan wajib disetujui. `App().aturanSetuju[kelas]` diisi saat centang
    (bukan di pratinjau). `tutup()` hanya mengisi `onboardDilihat` kalau sudah setuju
    atau langkah Peraturan mati; kalau belum, toast "Perkenalan akan muncul lagi…".
    `KolavoCekOnboarding` membuka lagi selama peraturan wajib tapi belum disetujui.
    ✕/Esc tetap bisa menutup (sengaja — mengunci modal terasa memaksa). Buka ulang
    setelah setuju: centang sudah terisi, gulir tidak perlu diulang.
  - Langkah Kenalan: "Lihat profil" diganti **Ajak kenalan** langsung di kartu
    (`window.KolavoAjakKenalan(nama)` di modul komunitas); modal tetap terbuka dan
    kartunya berubah jadi "Ajakan terkirim" / "Terhubung". Kartu pengurus (saat tak
    ada kecocokan) juga bisa diajak. Di pratinjau pengurus tidak mengirim ajakan.
  - Notifikasi: klik kini benar-benar pindah ke halaman komunitas
    (`KolavoLihatKomunitas`, sebelumnya `KolavoBukaKomunitas` hanya menggambar).
    "Pendaftaranmu diterima" di komunitas Advance langsung membuka onboarding, juga
    kalau sudah pernah dilihat (`KolavoOnboardingTerbuka()` mencegah dobel buka).

- **Revisi P9 — tanda status kenalan di daftar anggota** (2026-09-19, direvisi):
  - Tiap kartu di `#bukaList` diberi **ikon bulat** `.kn-ic` di kolom kanan (kartu jadi
    grid 3 kolom lewat `:has(> .kn-ic)`): orang+plus garis putus oranye = *belum*,
    orang+jam netral = *menunggu*, orang+centang hijau = *sudah kenal*. Labelnya lewat
    `title` + `aria-label`, bukan teks — permintaan user (awalnya chip berteks).
    Baris sendiri (`o.aku`) tanpa ikon. Hijau, bukan primary, supaya sama dengan blok
    "Kalian sudah kenalan" di detail anggota.
  - `#bukaKenal` di atas sumbu: **cincin progres** SVG 64px (r=26, dashoffset) mengelilingi
    ikon (sama dengan notifikasi "menerima ajakan kenalanmu", garis 1.5) + "X/Y", di sampingnya "Sudah kenal X dari Y anggota" + ajakan, lalu chip saring.
    Y = baris lain di daftar. Menggantikan bar garis (permintaan user).
  - Chip saring **Belum kenalan · n** (`#bukaBelum`) bisa digabung dengan chip nilai sumbu
    (`hanyaBelum` + `bidangKini`); hilang saat semua sudah diajak.
  - Helper `window.KolavoStatusKenal(nama)` → `'belum'|'menunggu'|'terhubung'`, dipakai P10.
  - Hanya tampil saat daftar terbuka (anggota/pemilik).
  - **Jumlah anggota = isi daftar.** Kartu direktori dulu menulis 22/9/17/20 anggota padahal
    seed tiap komunitas 6 orang, dan agregat profesi/domisili ditulis tangan untuk angka itu.
    Sekarang keempat kartu "6 anggota", dan `profesi`, `kota`, `angkatan` di `DATA`
    **diturunkan dari `anggota`** saat modul dimuat (`hitung()`); literalnya dihapus.
    Setelah diterima, kepala halaman jadi 7 (6 + kamu). Hero WAG ("22 anggota") tidak
    disentuh — itu ilustrasi, bukan komunitas di direktori.
- **Revisi P10 — feed "Kabar komunitas" (premium Advance)** (2026-09-19). Modul baru
  `50-js-feed` (manifest sesudah `50-js-onboarding`). Urutan halaman: `#komInfo` (pengumuman +
  tautan) → `#komStat` (anggota · kota · bidang · angkatan, dipindah ke sini atas permintaan)
  → "Siapa saja yang ada di dalam" (agregat) → `#komFeed` → Daftar anggota.
  - **Paket**: `KolavoFeedBoleh(kelas)` — direktori ber-`data-premium="1"` (Forpastara,
    IA SMAN 52) atau `l-dibuat` saat `D.sekAktif`. Esensial: tidak ada feed dan tidak ada
    sambutan (`KolavoFeedTambah` mengembalikan `false`); pemilik Esensial melihat satu
    kartu ajakan `.kom-info-ajak` (tombol `data-info-advance`, pintu yang sama dengan Info
    komunitas). Advance yang baru aktif mulai dengan feed kosong — tidak ada sambutan mundur.
  - **Data**: `KolavoApp.feed[kelas]`, API `KolavoFeedTambah(kelas, post)` /
    `KolavoFeed(kelas)`. Seed malas (`feedSeed`) hanya dua komunitas Advance: 2 sambutan
    (anggota yang paling akhir bergabung, waktunya dari bulan `s`) + 1 broadcast Ketua.
  - **Tampilan — kotak khusus, timeline ala Path** (revisi atas permintaan user: "box
    khusus… layaknya chat / model feed Path"). `.panel.fd-box`: kepala (ikon toa + "Kabar
    komunitas" + "N kabar"), isi `.fd-gulir` bergulir sendiri (maks 440px), kaki "Kabar ini
    cuma kelihatan sama sesama anggota". Di dalamnya `ol.fd-tl`: satu garis vertikal, tiap
    momen = simpul bulat 40px di garis + baris meta + **gelembung chat** (sudut kiri atas
    lancip). Broadcast: simpul = foto pengurus, meta = nama · pil jabatan · waktu
    (· Disematkan), gelembung putih (bergaris oranye kalau disematkan). Sambutan: simpul =
    ikon hijau, meta "{panggilan} bergabung ke komunitas", gelembung hijau lembut berisi
    foto + "Selamat datang, …!" + pekerjaan · domisili + tombol **Ajak kenalan** (ikon
    `KolavoIkonKenal` dari P9) atau status Menunggu/Sudah kenal. Sambutan sehari berurutan
    digabung ("N anggota baru bergabung", foto bertumpuk, tombol ke daftar). Sambutan diri
    sendiri: "Kamu"/"kamu", tanpa tombol. Terbaru di atas (bukan di bawah seperti chat),
    disematkan paling atas; 8 unit lalu "Lihat kabar sebelumnya (n)". Terkunci & kosong
    tampil di dalam kotak yang sama.
  - **Pemicu**: `terima()` di dashboard (`l-dibuat`, termasuk terima massal) dan
    `KolavoSetujui` (demo, diri sendiri).
  - **Akses**: anggota & pemilik melihat isi; pengunjung komunitas Advance melihat kartu
    terkunci `data-kunci`.
  - Sambungan baru di `50-js-layar-komunitas`: `KolavoKomKini()`, `KolavoAjakKenal(nama)`,
    `KolavoIkonKenal(st)`, dan `segarKenal()` — ajakan dari feed, dari detail anggota,
    atau terima demo sama-sama menyegarkan cincin, ikon daftar, dan feed.
- **Revisi P11 — menu Broadcast** (grup Advance, di bawah Info komunitas; 2026-09-19).
  Panel `#klPanelBroadcast` di `50-js-sekretariat` (`gambarBroadcast`), ikon baru `toa`.
  - **Form**: isi ≤500 karakter + penghitung, tautan opsional (`URL_OK`, pesan merah kalau
    tidak diawali https://, tombol Kirim nonaktif), sakelar *Sematkan di atas feed* dan
    *Kirim juga ke notifikasi anggota*. Draf di `S.bc`, tidak digambar ulang saat mengetik
    (fokus aman) — `segarkanBc()` cuma memperbarui penghitung, pratinjau, dan tombol.
  - **Pratinjau** memakai komponen timeline feed yang sama (`KolavoFeedPratinjau`), kolom
    kanan ≥900px, bertumpuk di layar sempit. Penulis = pemilik + `D.jabatanAku()` + fotonya.
  - **Kirim** → `KolavoFeedTambah('l-dibuat', …)`, jejak, toast. Notifikasi anggota **belum
    tersambung**: sengaja tidak memanggil `KolavoNotifTambah`, karena lonceng di prototipe
    milik pengirim sendiri — cukup toast "Mode demo".
  - **Riwayat broadcast**: disematkan dulu lalu terbaru; aksi Sematkan/Lepas sematan dan
    Hapus (konfirmasi sebaris, `btn xs hapus`). Hanya satu yang disematkan — API baru di
    `50-js-feed`: `KolavoFeedSemat`, `KolavoFeedHapus`, `KolavoFeedKapan`; kiriman bersemat
    melepas sematan lama.
  - **Hak**: baris *Kirim broadcast ke feed* di Siapa boleh apa; bawaan Ketua, Wakil Ketua,
    Sekretaris, Humas. Masuk daftar fitur pop up langganan (`URUT`).
  - **Pintu masuk** `KolavoBukaBroadcast()`: kartu ajakan feed pemilik Esensial ("Lihat
    Advance" → pop up langganan → langsung ke tab Broadcast setelah aktif) dan tombol
    *Tulis broadcast* di feed kosong milik pemilik Advance.
- **Revisi P13 — pop up langganan Advance dilebarkan** (2026-09-19). `.sek-box` 520 → 880px,
  isi jadi grid `.sek-modal-grid`: daftar fitur (kiri) · harga + tombol bertumpuk (kanan,
  `.sek-modal-samping`). Di 1280×800 muat tanpa scroll. ≤768px kembali satu kolom 520px.
  Tombol di kolom kanan wajib `flex:none`, karena `flex:1` bawaan membuat tingginya kolaps
  saat arah flex kolom.
- **Revisi P14 — nama panggilan komunitas** (2026-09-19). Kolom opsional `#bkAlias` (maks. 30)
  di layar Buat tepat di bawah nama resmi → disimpan sebagai `alias` di data komunitas
  (buat, pratinjau, sunting). Tampil sebagai `#komAlias` (`.kom-alias`, 15px `--ink-2`) di
  ATAS `#komNm` (revisi: semula di bawah); kosong → `hidden`, tanpa sisa jarak. Kartu direktori memakai `data-alias`;
  IA SMAN 52 sengaja dibiarkan tanpa alias sebagai contoh kondisi kosong. Ini berbeda dari
  "Nama Panggilan" anggota (pertanyaan `nickname`).
- **Revisi P15 — perkenalan singkat pengurus** (2026-09-19).
  - **Data**: `D.pengurus[].perkenalan` (maks. 280) → agregat `pengurus[].kenal`. Kunci `k`
    TIDAK dipakai karena sudah berarti "kerja" di data anggota. Contoh terisi: Ayu (Forpastara),
    Rani (IA PNJ), Fajar (IA SMAN 52); Rizal dan Dedi sengaja kosong.
  - **Sunting**: dashboard → Struktur Kepengurusan. Tombol *Tulis/Ubah perkenalan* per baris
    pengurus (Advance) dan per peninjau yang juga pengurus (Esensial). Editor `.kl-kenal-ed`
    (textarea + hitungan/280, Simpan/Batal) muncul tepat di bawah barisnya, cuplikan 2 baris
    `.kl-kenal-cuplik` tampil di baris. State `D.kenalFor`; membuka *Ubah jabatan* menutupnya.
  - **Tampil**: kartu pengurus di halaman komunitas jadi `<button class="peng-i" data-peng>`,
    klik → pop up `#pengModal` (kerangka `.lgn`, `.peng-box` 420px): avatar 88px, nama,
    jabatan · komunitas, kotak "Perkenalan singkat". Kosong → "Belum ada perkenalan." redup.
    Tutup lewat ×, scrim, atau Esc. Teks pengurus di-escape (`esc`) karena ditulis pengguna.
- **Revisi P16 — kartu peninjau: media sosial + pertanyaan dinamis** (2026-09-19).
  - **Pertanyaan dinamis**: dulu `r.jawaban` dihitung sekali di `bangun()`, jadi kartu membeku
    pada pertanyaan saat dashboard dibuat. Sekarang jawaban disimpan per id pertanyaan
    (`r.jwb`), dan `r.jawaban`/`r.tags` jadi getter (`denganJawaban`) yang merakit ulang dari
    `pertanyaanPengurus()` = `D.kom.tanya` tanpa `nickname`. Judul diganti, urutan diubah, atau
    pertanyaan dihapus di layar Buat (sunting, id tetap) → kartu, Tinjau jawaban, dan tag ikut.
    Pertanyaan yang ditambah setelah orangnya mendaftar → "— pertanyaan baru, belum dijawab"
    (`.kl-jawab-kosong`) dan tidak jadi tag. Diekspos `window.KolavoPertanyaanPengurus()` —
    dipakai P17 (sumbu persebaran).
  - **Media sosial**: `r.sosmed` (bentuk `{platform, akun}`, sama dengan `KolavoSosmed()`) tampil
    sebagai baris "Media sosial" di Data profil, berupa chip tautan `.kl-sosmed-i` (tab baru).
    Kosong → baris tidak ada. Contoh: 6 dari 8 pendaftar punya akun; Bayu dan Yoga tidak.
  - Saat diterima, `D.mem[].jawaban` menyalin jawaban saat itu (potret, bukan getter).
- **Revisi P17 — persebaran anggota + pemilih sumbu** (2026-09-19).
  - **Halaman komunitas**: dua blok tetap `#aggProfesi`/`#aggKota` diganti wadah `#aggWadah`,
    digambar `gambarAgg([{nama, data}])`. Esensial dan komunitas contoh: pekerjaan + domisili
    (seperti sebelumnya). Komunitas sendiri yang Advance-nya aktif: dari `KolavoSumbuPersebaran()`.
  - **Dashboard**: sub-menu *Persebaran* (`data-tab="sebaran"`, ikon `sebaran`) di bawah
    Jawaban pendaftar, dengan panel `#klPanelSebaran`. Karena ber-`data-sek`, sub-menu ini tidak
    ada di Esensial. Kandidat: pekerjaan, domisili, tiap pertanyaan pengurus
    (`KolavoPertanyaanPengurus`, P16). Nilai memakai label Kelompokkan kalau ada. Centang
    (maks. 4, min. 1) dan tombol naik/turun langsung berlaku; pratinjau batang di panel.
  - **Otomatis** (`S.sebaran === null`): pekerjaan + domisili + satu pertanyaan dengan jawaban
    berbeda terbanyak (≥2) yang bisa dikelompokkan, yaitu bertipe tahun, rata-rata jawaban ≤30
    karakter, atau sudah dikelompokkan. Jawaban panjang ditandai "kelompokkan dulu" dan tidak
    dipilih otomatis. Suntingan pertama berangkat dari pilihan otomatis yang sedang tampil;
    *Kembalikan ke otomatis* mengembalikannya ke null.
  - Per sumbu: 5 teratas, sisanya + yang belum menjawab masuk "Lainnya".

- **Revisi R6a — peraturan cukup teks, tanpa berkas** (2026-09-19):
  - Tidak ada lagi berkas peraturan untuk diunggah/diunduh. Kolom "Tautan peraturan
    komunitas" dihapus dari Info komunitas (`INFO_KOSONG` kini pengumuman/wa/dokumen),
    `obTautan('Berkas peraturan')` dihapus dari editor Onboarding, tombol "Unduh
    peraturan lengkap" dihapus dari modal, URL `.pdf` dihapus dari data `INFO` contoh.
  - Satu-satunya sumber teks: editor Onboarding › Peraturan (`langkah.aturan.ringkas`,
    format `#` = judul bagian). Teks kosong → "Pengurus belum menulis peraturan."
  - Item "Peraturan komunitas" di panel info halaman komunitas sementara tidak tampil
    (tak ada URL); digantikan pop up baca-saja di R6b.

- **Revisi R6b — pop up peraturan di halaman komunitas** (2026-09-19):
  - Panel info: item "Peraturan komunitas" (ikon perisai) → "Baca peraturan", tampil
    kalau teks peraturan ada, terbuka untuk siapa pun (termasuk pengunjung). Panel info
    kini dianggap berisi juga kalau hanya ada teks peraturan.
  - Klik → `window.KolavoBukaPeraturan()`: modal onboarding yang sama dalam mode
    `ctx.mode = 'peraturan'` — judul, nama komunitas, isi (renderer `isiAturan()`
    yang juga dipakai langkah Peraturan), tombol Tutup/×/Esc. Tanpa stepper, titik,
    Lewati/Kembali/Lanjut, dan centang setuju. Tidak menandai onboarding dilihat dan
    tidak mengubah `aturanSetuju`.
  - Sumber teks: `window.KolavoTeksPeraturan()` → konfigurasi onboarding komunitas itu
    (`l-dibuat` → editor dashboard; direktori Advance → `kom.onboarding` atau teks
    contoh), tetap dibaca walau langkah Peraturan onboarding dimatikan.

### PDP1–PDP3: persetujuan TnC & Kebijakan Privasi saat membuat profil

Rencana lengkap tujuh tahap ada di `Redesign/PROMPT-PDP.md`; yang di bawah sudah jadi.

- **Naskah** — modul baru `src/50-js-legal.html`, `window.KolavoLegal`:
  `versi`, `berlaku`, `judul`, `tnc` (11 bagian), `privasi` (12 bagian). Format teks
  sama dengan peraturan komunitas (`# ` = judul bagian) supaya satu kebiasaan saja
  yang perlu diingat. Urutan bagian Kebijakan Privasi mengikuti Pasal 21 UU 27/2022:
  identitas pengendali, jenis data, tujuan, dasar hukum, penerima, retensi, hak
  subjek data — jangan dipotong sebagian, urutannya yang memenuhi syarat.
  Identitas pengendali masih placeholder `privasi@kolavo.app`, menunggu badan hukum.
- **Pop up baca-saja** — `window.KolavoBukaLegal('tnc'|'privasi')`, kerangka `.lgn`
  `#lglModal` di `40-footer.html`. Meniru `KolavoBukaPeraturan` tapi punya renderer
  sendiri: naskah digambar sebagai paragraf (`.lgl-h` / `.lgl-p`), bukan daftar
  bercentang seperti peraturan komunitas — ini dokumen, bukan daftar aturan.
  Satu pendengar `[data-legal]` melayani seluruh pemicu (footer, modal masuk,
  blok persetujuan), jadi pemicu baru cukup menambah atribut.
- **Blok persetujuan** di `scrLengkapi`, sebelum `#galat`: dua centang yang
  **sengaja dipisah** — `#setujuLegal` (wajib, menggerbangi
  `#kirim` lewat `periksa()`) dan `#setujuKabar` (opsional, tidak pernah tercentang dari
  sananya). Menggabungkan keduanya jadi satu centang membuat persetujuannya tidak sah:
  UU PDP menuntut persetujuan spesifik per tujuan.
- **Jejak persetujuan** — `App.persetujuan = { legal, versi, kabar, waktu }` disimpan saat
  kirim berhasil. Versinya ikut dicatat karena akuntabilitas pengendali data menuntut
  bisa dibuktikan orang menyetujui naskah yang mana, bukan sekadar bahwa dia menyetujui.
- Tautan "Kebijakan Privasi · Ketentuan Layanan" di `.lgn-trust` (modal masuk, markupnya
  ada di **ekor `50-js-pemilih-lokasi.html`**, bukan di `50-js-modal-masuk.html`) dan
  "Privasi" di footer sebelumnya `href="#0"` / `<span>` mati — sekarang keduanya membuka
  pop up yang sama.
- Ringkasan transparansi tiga baris ("Yang kami simpan / Siapa yang bisa lihat / Hak
  kamu") sempat ada di atas centang, lalu **dihapus atas permintaan** — cukup centangnya
  saja. Naskah lengkapnya tetap satu klik jauhnya lewat tautan di bawah centang, jadi
  syarat "diberi tahu sebelum menyetujui" tetap terpenuhi tanpa menambah panjang form.
  Kelas `.lgl-ringkas` ikut dibuang; blok persetujuan sekarang berdiri sendiri tanpa
  pembungkus `.blk`, dengan `margin-top:20px` supaya iramanya sama dengan section lain.
- Pil `Opsional` aslinya hanya hidup di `.f-lbl .opt`; di dalam kotak persetujuan
  latarnya dibalik ke `--card` supaya tidak lebur dengan `--bg-alt` kotaknya.

## Yang belum terverifikasi

- Setelah berhasil masuk lewat Google, apakah pengguna dikembalikan ke aksi yang tadi
  dituju. Kalau dilempar ke homepage, seluruh copy kontekstual di modal jadi sia-sia.
- "Di sekitar saya" masih diperagakan sebagai Jakarta Utara, belum geolocation asli,
  dan belum ada penanganan kalau izin lokasi ditolak.
- Radius kartu komunitas 13 (Design System) sementara kolavo.app memakai 20.
- Harga langganan di business plan masih `XXXX`, jadi kata "Gratis" di halaman
  belum punya dasar jangka panjang.
- Naskah TnC & Kebijakan Privasi adalah rancangan produk, **belum ditinjau penasihat
  hukum**, dan identitas pengendali data (badan hukum, alamat, narahubung) masih
  placeholder. Jangan dipakai di produksi sebelum keduanya beres.
- Advance: apakah pengurus mau membayar untuk lima panel ini, dan panel mana yang
  paling dicari — belum pernah ditanyakan ke 5–10 komunitas kurasi. BP sendiri
  memisahkan pergantian kepengurusan sebagai biaya per penggunaan, bukan langganan.


---

## V4 — dari "Feedback Redesign Kolavo Prototype V3" (3 Okt 2026)

V3 dibekukan: `archive/ReDesign_Kolavo_3.html` + `archive/src-v3/`. `src/` dan seluruh kit
sekarang merakit `ReDesign_Kolavo_4.html` (Artifact baru, URL terpisah dari V3).

**Homepage.** Hero WAG-vs-Kolavo dicabut karena prospek mengira Kolavo aplikasi chat.
Hero baru menjual profil komunitas (kartu `.hp-kartu`: persebaran pekerjaan + pendidikan +
pengurus). Bagian baru `#untuk` (tiga pilar per peran) dan `#harga` (Esensial, Advance,
kalkulator `50-js-harga`, kredit kenalan). Semua angka masih `Rp XXXX`.

**Profil pengguna.** Pendidikan (`#didik`, `#didikDi`); memberi & mengambil jadi dua kolom
(`#beri` + `#bio`); "Komunitas saya" berstatus Anggota bisa diklik; menu akun menaut ke
`#pfKomunitas` dan `#pfAkun` di satu layar profil (tidak dipisah); kredit kenalan
(`App.kredit`) dibeli di Pengaturan akun atau di profil anggota, dan menjadi syarat
terbukanya kontak setelah kenalan diterima.

**Halaman komunitas.** Bagian Pengurus tampil untuk semua pengunjung dan naik ke atas Daftar
anggota; Esensial hanya Community Creator, Advance susunan penuh. Persebaran dapat sumbu
Pendidikan (`didikAgg`, proporsi contoh). Pemilik dapat tombol "Sunting halaman komunitas"
dan "Ubah" di pengumuman (→ Info komunitas). Sambutan onboarding memakai foto ketua.
Feed "Kabar komunitas" menjadi "Anggota baru": hanya sambutan otomatis.

**Form Buat.** Tipe jawaban `angka`; nomor anggota default `manual` ("Format sendiri").

**Dashboard.** Esensial: tab Riwayat dilebur ke Anggota (`.kl-putus` per baris + daftar
ditolak), tab Kepengurusan jadi "Peninjau". Advance: Broadcast, Serah terima, Rangkuman
WhatsApp, dan notifikasi "Anggota keluar" dicabut dari UI (kode panel Broadcast/Serah
dibiarkan, tinggal kembalikan tab + `URUT`). Notifikasi pendaftaran digabung: pemicu jumlah
pendaftar (min. 10) atau satu hari per minggu; "Keputusan pengurus lain" mingguan. Akses
pengurus: pratinjau email undangan + baris hak tetap "lihat Struktur & tulis perkenalan
sendiri". Istilah "Community Builder" → "Community Creator".

**Belum diputuskan:** angka harga; apakah Esensial ditagih per anggota; standar format
nomor anggota.

**Revisi hero V4.** Judul jadi "Komunitas berkualitas terlihat dari orang-orangnya." (pilar 1:
kualitas komunitas dinilai dari anggotanya); sub kedua memuat pilar 2 dan 3. Visual kembali
ke susunan bertumpuk V3 (`.hba`): kartu "Di media sosial: kegiatannya" miring di belakang,
panel "Di Kolavo: orang-orangnya" di depan, keping `.hp-keping` "Satu profil, 3 komunitas".
Foto postingan sengaja placeholder gradien — tidak ada foto kegiatan sungguhan.

**Revisi visual hero V4 (2).** Kartu postingan media sosial dicabut. Tiga lapis sekarang:
profil komunitas (belakang, miring: logo, nama, pengurus) · persebaran anggota (depan: karier
+ pendidikan) · profil anggota (`.hp-keping`, kiri bawah: foto, tag pekerjaan/pendidikan/
domisili, "satu profil dipakai di 3 komunitas").

**Revisi hero V4 (3) — "belum menjual".** Judul diganti dari pernyataan ke ajakan yang
memuji pembacanya: "Tunjukkan orang-orang hebat di balik komunitasmu." (kata terakhir
berotasi, `50-js-hero`). Satu paragraf manfaat + tiga poin bercentang (`.hero-poin`) di bawah
CTA. Visual: sampul gradien + lencana terverifikasi + tumpukan wajah di kartu komunitas;
angka besar 86/14/9 (`.hp-angka`) dan batang tiga warna (biru karier, oranye pendidikan,
hijau domisili) di panel depan; kartu profil anggota dan keping "Ajakan kenalan diterima"
melayang pelan (`@keyframes hpApung`, mati di reduced-motion).

**Revisi hero V4 (4) — seimbang + persuasif.** Judul "Kenali anggotamu. Kenalkan
komunitasmu." (tiga baris tetap; kata berotasi di baris ketiga). Kalimat membanggakan
("orang-orang hebat", "banggakan") dicabut; paragraf sekarang menjelaskan cara mulai dan dua
kegunaannya. Kolom hero 1fr 1fr; visual dipendekkan (blok Domisili dan kutipan di kartu
anggota dicabut) supaya tingginya setara kolom teks (~550 vs ~590 px di lebar 1280).

**Bagian `#untuk` dirapikan + bug padding section (6 Okt 2026).** `section{padding:78px 0}`
tidak pernah terbaca browser sejak V3: ada `}` nyasar tepat di atasnya (sisa blok hero lama),
jadi semua bagian beranda menempel tanpa jarak. `}` dibuang dan aturannya dibatasi ke
`#scrBeranda > section` — kalau dihidupkan global, panel dashboard, form, dan `.kom-sec`
ikut mendapat padding 78px. Kepala `#untuk` dirata-tengahkan (`.sec-tengah`); tiga kartu
memakai `grid-template-rows:subgrid` supaya ikon, label, judul, uraian, dan daftar sejajar
antar-kartu; daftar dipisah garis tipis. Judul dan lede ditulis ulang untuk pengurus.

**`#direktori` jadi etalase untuk pengurus (6 Okt 2026).** Beranda sekarang bicara ke
pengurus, jadi bagian ini memamerkan komunitas yang sudah punya halaman, bukan mengajak
anggota mencari komunitasnya: kicker "Sudah ada di Kolavo", judul "Lihat komunitas yang sudah
punya halamannya.", kepala rata tengah. Keadaan kosong menawarkan "Buat Halaman Komunitas";
tombol "Ajak pengurusmu bikin halaman" dicabut (handler di `50-js-direktori-filter` dijaga
`if(invite)`). CTA kedua hero jadi "Lihat komunitas di Kolavo". Jalur anggota mencari
komunitas tetap ada lewat keadaan kosong di layar Profil.

**`#pengurus` disamakan + jarak antar bagian (6 Okt 2026).** Kartu `.band` dua kolom diganti
pola yang sama dengan bagian lain: kepala rata tengah (kicker "Cara mulai"), empat langkah
sebagai kartu sejajar (`.langkah`), lalu ajakan (`.sec-cta`) dan catatan privasi satu baris
(`.sec-catatan`). Kepala `#harga` ikut dirata-tengahkan. Latar berselang: `#untuk` abu,
`#direktori` putih, `#pengurus` abu, `#harga` putih. Jarak disamakan: tiap bagian padding
78px atas-bawah, kepala -> isi 44px di keempat bagian (sebelumnya 44/28/44/34) lewat
`.sec-tengah{margin-bottom:44px}`.

**Koreksi `#pengurus` (6 Okt 2026).** Susunan empat kartu rata tengah dibatalkan atas
permintaan: bagian ini kembali ke format `.band` dua kolom dari V3 (teks, catatan privasi,
dan ajakan di kiri; daftar langkah `.steps` di kanan). Yang dipertahankan dari revisi: isi
baru (kicker "Cara mulai", judul "Empat langkah, halaman komunitasmu siap.", empat langkah
yang dipendekkan) dan latar `sec-alt`. Kelas `.langkah*`, `.sec-cta`, `.sec-catatan` dihapus.

**`#pengurus` + tangkapan layar profil (6 Okt 2026).** Kolom kanan `.band` sekarang berisi
tiruan tangkapan layar profil komunitas dalam bingkai browser (`.ss`, memakai ulang komponen
hero `.hp-*`); empat langkah pindah ke kolom kiri di bawah pengantar. Sengaja bukan gambar
bitmap: ikut tema gelap, tajam di semua ukuran, dan tidak menambah base64. Judul jadi "Empat
langkah, profil komunitasmu siap."; catatan privasi jadi keterangan di bawah tangkapan layar.

**`#pengurus` versi akhir (6 Okt 2026).** Setelah mencoba `.band` dua kolom + tangkapan layar,
bagian ini kembali ke empat kartu langkah rata tengah (`.langkah`), sekarang tiap kartu punya
gambar kecil di atasnya (`.lk-gbr`): form nama komunitas, link yang disalin, kartu pendaftar
dengan tombol Setujui/Tolak, dan ringkasan persebaran. Semuanya tiruan UI dari komponen
(`aria-hidden`), bukan bitmap. Kelas `.ss*` dihapus; `.band`/`.steps` tidak lagi dipakai di beranda.

**Bagian `#harga` direvisi (6 Okt 2026).** Keputusan harga pertama: Esensial gratis untuk 1
peninjau + 20 anggota (kata "Gratis" kembali dipakai, khusus untuk ini). Blok "Untuk anggota"
(kredit kenalan) dan subjudul "Untuk komunitas" dicabut dari beranda; kredit kenalan masih ada
di Pengaturan akun dan profil anggota. Advance tetap Rp XXXX / anggota / bulan, kalkulator
tetap mulai 50. BELUM diselaraskan: dashboard Esensial masih mengizinkan lebih dari satu
peninjau dan tanpa batas 20 anggota.

**Aturan harga Advance terpasang di `#harga` (6 Okt 2026).** Tiga kartu: Esensial (hijau,
FREE), Advance (biru, Rp 199 — awalnya Rp 1.191, diubah 14 Okt 2026), Big Organization (oranye, "Hubungi kami"). Kalkulator
(`50-js-harga`, `window.KolavoHarga`) punya tiga masukan — anggota 30–1.000 per 10, peninjau,
durasi 1/6/12 bulan/2 tahun — dan merinci biaya anggota, peninjau, per bulan, diskon, total.
Aturan + uji angka: `PROMPT-HARGA.md`.

## Pisah landing vs Kolavo App (14 Okt 2026) — rencana: `PROMPT-APP.md`

- **A1 · dua mode di router.** `KolavoApp.mode` = `'landing'` (hanya `scrBeranda`) atau
  `'app'` (semua layar lain), ditulis di `gambar()` setiap pindah layar, dan dipantulkan ke
  `body.m-app`. Nav/footer membaca kelas ini, tidak memeriksa id layar satu per satu.
  Footer jualan disembunyikan di mode app (`body.m-app footer{display:none}`). Nav app belum
  berubah — isinya diganti di A3. Nama `window.KolavoApp` tetap objek keadaan; "Kolavo App"
  sebagai produk tidak punya objek global sendiri.
- **A2 · halaman masuk penuh `scrMasuk`** (`30-layer-scrMasuk`, layar ke-8). Tanpa nav
  (`body.m-masuk`), satu kartu tengah, isi diisi `KolavoIsiMasuk(niat, kartu)` di
  `50-js-modal-masuk` — memakai `isi()` & tombol Google yang sama dengan modal, bukan salinan.
  Varian `nav` ("Masuk ke Kolavo") dan `undangan` (kartu `.msk-kom` komunitas pengundang;
  router memilihnya bila `App.undangan` berisi kartu `.ccard`). Sesudah masuk, undangan
  diperlakukan seperti Gabung (`niat 'anggota'`). Penjaga router: layar `perluMasuk` →
  `scrMasuk` + ingat `App.tujuan`; `KolavoMasuk` dan simpan Lengkapi meneruskan ke
  `App.tujuan`. Sudah masuk lalu ke `scrMasuk` → diteruskan ke tujuan/profil. Modal masuk
  lama tetap untuk pemicu di landing & tombol Gabung (diputuskan di A6).
  Catatan: `peta.py` hanya mengenali `<div class="scr" id=…>` persis — kelas tambahan
  layar ditaruh di pembungkus dalam.
- **A3 · nav Kolavo App** (`20-nav` `#navTab` + `#navCari`). Tiga tab ikon — Komunitas
  (`orang`), Profil (`profil`, baru), Dashboard (`kelompok`) — di tengah bar (absolut 50%),
  tab aktif biru + garis bawah 3px, label hanya untuk pembaca layar. Tampil bila mode app
  **dan** sudah masuk (`body.m-tab`, `tabNav()` di router); tab aktif dihitung dari layar
  (`TAB` di router), bukan klik terakhir. Mode app menyembunyikan tautan jualan (Harga,
  Halaman Komunitas). < 768px: tab jadi bilah bawah 60px + safe-area, label 11px tampil,
  bar atas tinggal logo + lonceng + avatar; demo & toast naik di atasnya. Tombol cari
  pil di ≥1181px, ikon bulat di bawahnya. Sementara Komunitas & Cari menuju "Komunitas
  saya" di profil — A4 mengganti dengan `scrApp`. Dashboard ikut penjaga lama (`scrBuat`
  bila belum punya komunitas) sampai A4.
  Sekalian: `.nav-in` kini hanya `padding-top/bottom` (temuan audit `.shell` vs `.nav-in`
  beres), dan **meta viewport ditambahkan** di `00-preamble` — sebelumnya tidak ada,
  sehingga di HP sungguhan halaman dirender selebar 980px.
- **A4 · isi tab app.** Dua layar baru (total 10):
  - `scrApp` (tab Komunitas, beranda sesudah masuk — default `KolavoMasuk`, simpan Lengkapi,
    dan `scrMasuk`): **Komunitasku** (`#appKu`, dari `KolavoKomunitasKu()` — satu sumber
    dengan daftar di Profil lewat `itemIkut()` di router) + **Jelajahi komunitas publik**:
    blok cari/filter/kartu landing **dipindah utuh** ke sini, id `#direktori` dipertahankan
    (feed, notifikasi, layar komunitas membaca `#direktori .ccard`). Tombol kartu kini
    `data-gabung-kartu` "Minta gabung" → buka komunitasnya + langsung buka formulir gabung;
    label mengikuti status (Menunggu / Buka). Landing kehilangan bagian direktori sampai A6
    (etalase); tombol hero "Lihat komunitas" → `scrApp` (minta masuk). Remah "Komunitas" di
    `scrKomunitas`/`scrAnggota` → `scrApp`.
  - `scrDasbor` (tab Dashboard, terbuka untuk semua): daftar komunitas yang dikelola —
    `App.dibuat` (lencana Pembuat/Diarsipkan) dan `App.diangkat` (contoh IA SMAN 52 ·
    Sekretaris, dinyalakan tombol demo **Angkat saya jadi pengurus**, hanya tampil di
    layar ini lewat `body[data-layar]`). Kosong → ajakan Buat komunitas. Dashboard komunitas
    orang lain **belum disimulasikan** (toast) karena mesin dashboard hanya memegang satu
    komunitas buatan. `scrKelola` tanpa komunitas → `scrDasbor` (dulu `scrBuat`); remah
    `scrKelola` diawali "Dashboard ›". Pemilih komunitas di dalam `scrKelola` ditunda sampai
    ada lebih dari satu dashboard nyata.
  - Modul baru `50-js-app` (`KolavoGambarApp`), dipanggil router saat dua layar ini digambar.
- **A5a · popup Bagikan + QR** (modul baru `50-js-qr`, setelah `50-js-ikon`).
  `KolavoQR(teks, judul?)` → SVG: pembuat QR inline (mode byte, koreksi galat M, versi 1–6
  ≤ 106 byte, mask dipilih lewat skor penalti). Terverifikasi dengan `BarcodeDetector`
  Chrome untuk URL 24–100 karakter (versi 2–6): semua terbaca persis. `KolavoBagikan(nama,
  url)` membuka popup: QR, nama komunitas, tautan + Salin, **Unduh QR** (berkas SVG berisi
  nama di bawah QR, siap cetak; lewat kapabilitas `downloads` bila ada, cadangan tautan Blob
  + toast yang tidak menjanjikan berhasil), **Bagikan…** bila `navigator.share` ada.
  Dipakai: tombol bagikan di halaman komunitas (`bagikan()`), dan tombol baru **Tampilkan
  QR** di layar sukses Buat. Warna QR hitam/putih ditulis di SVG (bukan token tema) karena
  harus sama di kedua tema; prompt sempat menyebut `--qr-fg/--qr-bg`, tidak diperlukan.
  Tautan layar sukses diseragamkan ke `kolavo.app/k/<slug>` (sebelumnya `kolavo.app/<slug>`,
  beda dengan halaman komunitas).
- **A5b · tautan/QR undangan.** `KolavoBukaTautan(kartu)` (50-js-app) mensimulasikan
  `kolavo.app/k/<slug>` dibuka: belum masuk → `App.undangan = kartu` → `scrMasuk` varian
  undangan → sesudah masuk diperlakukan sebagai niat `anggota` → `scrLengkapi` (lede
  menyebut komunitasnya) bila profil belum lengkap → `scrKomunitas` dengan tombol Gabung
  (onboarding Advance seperti biasa); sudah masuk → langsung `scrKomunitas`; sudah anggota →
  halaman menampilkan "Kamu anggota di sini". Pemicu prototipe: tombol demo **Buka tautan
  undangan**, hanya di landing & `scrMasuk`, bergiliran antar 4 komunitas contoh.
