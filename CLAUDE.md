# Kolavo

Produk: community platform Indonesia. Basecamp digital + pendampingan pengurus.
Pelanggan: pendiri/pengurus komunitas (organisasi, asosiasi, ikatan alumni, himpunan).

Peta lengkap seluruh repo (bisnis, produk, riset, EPIC per fitur, RIIM) ada di
**`brain/README.md`** — berkas ini fokus pada instruksi kerja teknis di `Redesign/`.

## Satu-satunya sumber kebenaran desain

**Sumber yang disunting: `Redesign/src/`** — 21 modul per-fitur. Dirakit jadi
`Redesign/ReDesign_Kolavo_3.html` (berkas terbangun, satu-satunya yang dipublish
ke Artifact). **Sunting modul di `src/`, bukan berkas terbangun langsung.**
Rincian token, komponen, aset, dan keputusan: **`Redesign/REFERENCE.md`**.

**Kenapa src/ + bundle:** Artifact hanya menjalankan SATU berkas HTML
self-contained (CSP blokir aset luar, router antar-layar butuh satu DOM). Jadi
keluarannya tetap satu berkas — tapi sumbernya dipecah per fitur supaya tiap
suntingan menyentuh satu modul kecil, hemat konteks. `bundle.py` merakit tanpa
transformasi: keluaran byte-identik dengan gabungan potongannya.

**Berkas beku — jangan disunting lagi:**

| Berkas | Status |
|---|---|
| `archive/ReDesign_Kolavo_1.html` | arsip, sebelum brand line "basecamp" |
| `archive/ReDesign_Kolavo_2.html` | arsip homepage, sumber kit diekstrak dulu |
| `archive/ReDesign_Kolavo_Masuk.html` | arsip pembanding modal masuk |

Kalau ada perubahan menyeluruh (misal menghapus sebuah kata dari "seluruh web"),
**terapkan di v3 saja** lalu catat di `REFERENCE.md`. Jangan merambat ke arsip —
mengubahnya memalsukan catatan sejarah, dan tidak ada yang membacanya sebagai produk.

`kit/` sekarang beku bersama v2. **Jangan jalankan `kit/extract.py`** — ia menarik
dari v2 dan akan menimpa kit dengan pola lama. Kalau butuh komponen baru, tulis
langsung di v3.

**Satu prototipe = satu berkas.** Layar dibuat sebagai `<div class="scr" id="scr…">`
yang saling menggantikan lewat router kecil, bukan berkas HTML terpisah yang saling
menaut — Artifact tidak bisa menaut antarberkas secara relatif, dan berkas kembar
berarti tiap perbaikan dikerjakan dua kali.

**Jangan bikin dokumen alasan desain dalam bentuk HTML.** Alasan cukup disampaikan di
percakapan dan dicatat di `REFERENCE.md`.

## Cara kerja di repo ini

**Sunting modul di `src/` lewat `kit/edit.py`, lalu rakit dengan `kit/bundle.py`.**
Jangan baca berkas terbangun utuh dan jangan sunting manual. Alur per suntingan:

```bash
python3 Redesign/kit/peta.py --src              # modul mana untuk fitur apa
python3 Redesign/kit/edit.py src/<modul> <<'JSON'
[{"cari": "teks lama", "ganti": "teks baru"}]
JSON
python3 Redesign/kit/bundle.py                  # rakit src/ -> berkas + audit
python3 Redesign/kit/bundle.py --check          # konfirmasi sinkron sebelum publish
```

`edit.py` atomik (satu edit gagal = tidak ada yang ditulis), path diselesaikan dari
root repo, dan kalau anchor meleset ia langsung menampilkan baris kandidatnya. Saat
menyunting modul `src/`, audit fragmen dilewati (fragmen tak bisa diaudit sendiri —
CSS/HTML-nya tersebar); audit lengkap jalan di `bundle.py`.

`ReDesign_Kolavo_3.html` (357 KB, ~½ base64) adalah **keluaran**, bukan sumber.
Kalau seseorang telanjur menyuntingnya langsung, `python3 Redesign/kit/split.py`
memecahnya ulang ke `src/`; `split.py` lalu `bundle.py --check` harus 'identik'.

**Orientasi dulu, jangan membaca berkas.**
`python3 Redesign/kit/peta.py --src` mencetak modul per-fitur + perannya.
`python3 Redesign/kit/peta.py` (tanpa `--src`) mencetak peta berkas terbangun:
layar, bagian, blok skrip, API global `window.Kolavo*`, dan seluruh id.

**Verifikasi berlapis, dari yang termurah.**
0. `python3 Redesign/kit/peta.py` — struktur masih utuh? Jumlah layar dan bagian
   berubah tanpa disengaja itu pernah terjadi: satu bagian hilang diam-diam di
   tengah rangkaian suntingan, dan baru ketahuan jauh belakangan.
1. `python3 Redesign/kit/audit.py` — statis, tanpa browser. Menangkap enam kelas bug
   yang benar-benar pernah terjadi di sini: token ganda, warna harfiah di blok tema,
   `[hidden]` yang ditimpa `display`, kelas hantu salah ketik, dua kelas berebut
   properti sama di satu elemen. Punya uji regresi sendiri.
2. Pengukuran DOM lewat `javascript_tool` — posisi, ukuran, `getComputedStyle`,
   overflow horizontal. Untuk hal yang tak terlihat dari sumber.
3. Screenshot — hanya kalau perlu menilai *enak dilihat*, bukan *tidak rusak*.

**Kenapa bukan screenshot dulu.**
Screenshot adalah biaya terbesar dan paling sering sia-sia — tab browser di sesi ini
sering berstatus `hidden`, sehingga `requestAnimationFrame` mati dan hasilnya kosong
atau beku di tengah animasi. Pakai `javascript_tool` untuk mengukur:
posisi, ukuran, `getComputedStyle`, jumlah elemen, ada/tidaknya overflow horizontal.
Bug nyata yang tertangkap cara ini: padding nav tertimpa `.nav-in`, tombol tersembunyi
yang tetap tampil karena `display:grid` menimpa `[hidden]`, kolom 372 vs 501 px.

Screenshot hanya di titik penting — saat perlu menilai *enak dilihat*, bukan *tidak rusak*.

**Batasi screenshot dan riset browser per permintaan.** Satu-dua tangkapan yang langsung
menjawab pertanyaan sudah cukup — jangan mengulang di tiap breakpoint kecuali user
secara eksplisit minta variasi itu. **Tema gelap belum perlu dicek lewat screenshot
selama prototyping** — `kit/audit.py` sudah menangkap warna harfiah di blok tema secara
statis dan murah; jalankan itu, jangan buka `resize_window(colorScheme:"dark")` kecuali
user memintanya secara eksplisit atau memang sedang memburu bug tema tertentu.
Gabungkan klik-isi-submit dalam satu `browser_batch`, bukan satu panggilan per langkah.
Saat riset referensi live (kolavo.app dkk.), pakai `get_page_text` dulu; `read_page`
(pohon aksesibilitas, bisa puluhan ribu token sekali panggil) hanya kalau butuh `ref`
elemen buat diklik dan tidak ketemu lewat `find`.

**Publikasi Artifact: jangan `diff`/`cat` isi lama waktu ditolak "belum dilihat versi
live".** Berkas lokal `ReDesign_Kolavo_3.html` satu-satunya sumber kebenaran di
proyek ini — tidak ada yang menyuntingnya selain lewat `kit/edit.py`. Kalau tool
Artifact menolak publish dengan alasan itu, baca secukupnya dari berkas tersimpan yang
ditunjukkannya supaya lolos syarat "sudah dilihat", lalu publish ulang berkas lokal
apa adanya — tidak perlu membandingkan baris demi baris. Isi berkas tersimpan itu
dibungkus wrapper `frame-runtime` yang besar dan tidak informatif; men-`diff`-kannya
cuma memboroskan konteks.

**Jangan turunkan ulang token dari Figma.** Sudah ada di `REFERENCE.md`.
Token Figma sudah dicabut; datanya tidak bisa ditarik lagi tanpa token baru.

**Jangan pakai foto orang sungguhan.** Foto anggota asli ada di kolavo.app, tapi
tidak boleh masuk mockup tanpa izin. Yang dipakai: 4 foto hasil AI di
`Redesign/assets/photos/`. Prompt-nya tersimpan di `assets/photos/PROMPT.md`
kalau butuh persona baru.

**Semua CSS dan aset wajib inline.** CSP pada Artifact memblokir host luar, jadi
berkas CSS terpisah tidak akan termuat. Google Fonts satu-satunya pengecualian.

## Token inti

Poppins · primary `#2D6BE4` hover `#0045CD` · aksen `#FF683D` ·
netral `#222222` `#6B7280` `#9CA3AF` garis `#EFEFEF` ·
radius: tombol 100 (pill), kartu 13, modal 32 · tinggi tombol 52/48/40/32

Dark mode wajib lewat token. Jangan pernah menulis warna harfiah di dalam blok
`@media` atau `[data-theme]` — itu bikin halaman tak terbaca di salah satu tema.

## Arsitektur pesan

- Brand line: **Basecamp digital komunitasmu** (eyebrow + footer)
- Hero: **Kenal anggota komunitas, sebelum ketemu orangnya** (kata terakhir berotasi
  ke organisasi/asosiasi/ikatan alumni/himpunan — wajib di akhir frasa, tanpa imbuhan)
- Argumen: **Karena tak kenal, maka tak kolab** (kicker bagian WAG)

## Konteks bisnis

`brain/bisnis/Business Plan.md`. Yang mempengaruhi desain: pelanggan adalah pengurus;
kompetitor sesungguhnya Google + WhatsApp + Zoom (gratis, tanpa kurva belajar);
pendampingan komunitas adalah satu-satunya kolom yang hampir kosong di tabel kompetisi;
entry strategy 2 tahun pertama lewat 5–10 komunitas kurasi, bukan pencarian publik.
Harga masih `XXXX`. Kata **"Gratis" sudah dihapus dari semua halaman aktif** (v2, v3,
Masuk, dan kit) atas permintaan — platformnya belum tentu gratis, jadi menjanjikannya
sekarang berisiko. `archive/ReDesign_Kolavo_1.html` sengaja dibiarkan sebagai arsip.
Jangan tulis ulang kata itu tanpa keputusan harga.
