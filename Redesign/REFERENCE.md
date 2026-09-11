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

## Yang belum terverifikasi

- Setelah berhasil masuk lewat Google, apakah pengguna dikembalikan ke aksi yang tadi
  dituju. Kalau dilempar ke homepage, seluruh copy kontekstual di modal jadi sia-sia.
- "Di sekitar saya" masih diperagakan sebagai Jakarta Utara, belum geolocation asli,
  dan belum ada penanganan kalau izin lokasi ditolak.
- Radius kartu komunitas 13 (Design System) sementara kolavo.app memakai 20.
- Harga langganan di business plan masih `XXXX`, jadi kata "Gratis" di halaman
  belum punya dasar jangka panjang.
