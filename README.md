# Kolavo

**Community platform Indonesia** — basecamp digital untuk komunitas (organisasi,
asosiasi, ikatan alumni, himpunan) plus pendampingan pengurus. Pelanggan utama:
pendiri & pengurus komunitas.

> _Basecamp digital komunitasmu._

Repositori ini berisi **dokumentasi produk, konteks bisnis, dan prototipe desain**
untuk membangun rilis pertama Kolavo menjadi situs live.

---

## ⚠️ Baca ini dulu — prototipe ≠ kode produksi

`Redesign/ReDesign_Kolavo_3.html` adalah **prototipe desain satu-berkas** (semua
layar dalam satu DOM, aset base64, router mini, tanpa backend). Bentuk satu-berkas
itu batasan alat prototipe, **bukan arsitektur produk**.

Perlakukan prototipe sebagai **spesifikasi perilaku & visual yang sudah divalidasi**
— bukan basis kode untuk dilanjutkan. Tim developer **membangun ulang** di framework
nyata (mis. React/Next.js) dengan:

- **PRD** → apa yang harus dibangun ([`brain/produk/PRD-Kolavo-v1.html`](brain/produk/PRD-Kolavo-v1.html))
- **Prototipe** → seperti apa hasilnya ([`Redesign/ReDesign_Kolavo_3.html`](Redesign/ReDesign_Kolavo_3.html))
- **REFERENCE** → token, komponen, dan alasan tiap keputusan ([`Redesign/REFERENCE.md`](Redesign/REFERENCE.md))

---

## Mulai dari mana

| Peran | Baca |
|---|---|
| **Semua** | PRD bagian 00–03 (ringkasan, masalah, tujuan) |
| **Product Manager** | PRD bagian 05–08 (lingkup, status, kebutuhan fungsional, alur) + **bagian 13 (keputusan yang harus diambil)** |
| **Developer** | PRD bagian 07–12 & 15 (kebutuhan fungsional, model data, keputusan terkunci, catatan teknis) + `Redesign/REFERENCE.md` |

Buka PRD: unduh lalu buka `brain/produk/PRD-Kolavo-v1.html` di browser.
Buka prototipe: buka `Redesign/ReDesign_Kolavo_3.html` di browser (langsung jalan,
tanpa server).

---

## Peta repositori

| Lokasi | Isi | Untuk dev? |
|---|---|---|
| `brain/produk/PRD-Kolavo-v1.html` | **PRD rilis pertama** — dokumen acuan utama | ✅ ya |
| `Redesign/ReDesign_Kolavo_3.html` | Prototipe desain berjalan (acuan visual + interaksi) | ✅ ya |
| `Redesign/src/` | Sumber prototipe, 21 modul per-fitur (lebih mudah dibaca) | ✅ ya |
| `Redesign/REFERENCE.md` | Token desain, komponen, dan alasan tiap keputusan | ✅ ya |
| `Redesign/assets/` | Logo, foto (AI), logo komunitas — sumber aset | ✅ ya |
| `brain/README.md` | Peta seluruh proyek | ✅ ya |
| `brain/bisnis/` | Business plan (model bisnis, kompetitor, harga, keuangan) | ⚠️ internal |
| `RIIM/` | Materi proposal kompetisi RIIM 2026 | ⚠️ internal |
| `Q2/` | Dokumen EPIC per fitur (requirement, review, sketsa) | 📎 referensi |
| `CLAUDE.md` | Instruksi kerja menyunting prototipe via `kit/` | 📎 opsional |

> **Sebelum push ke GitHub dengan akses developer:** folder bertanda ⚠️ berisi materi
> bisnis/kompetisi yang mungkin tidak perlu dibagikan ke tim developer. Pertimbangkan
> memindahkannya ke repo terpisah atau membatasi akses. Nothing di repo ini publik
> sampai kamu `git push` ke remote.

---

## Keputusan yang harus diambil sebelum sprint pertama

Ringkasan dari PRD bagian 13, diperbarui 25 Okt 2026 — bawa ke rapat kickoff.
PRD-nya sendiri (`brain/produk/PRD-Kolavo-v1.html`, 10 Sep 2026) belum ikut diperbarui.

**Sudah terjawab**

- ~~**Harga / model langganan**~~ — diputuskan 6–17 Okt 2026: Esensial **FREE** (20 anggota,
  1 peninjau) · Advance Rp 199/anggota/bulan (30–1.000) · Big Organization lewat "Hubungi kami".
  Rincian `Redesign/PROMPT-HARGA.md`; sudah ada di prototipe dan `Frontend/`.
- ~~**Detail autentikasi Google & redirect**~~ — `Frontend/` mengembalikan user ke halaman
  asal setelah login (`/masuk?next=…`, 25 Okt 2026). Sisa: perpanjangan token (lihat bawah).
- ~~**Radius kartu 13 vs 20**~~ — **13** (Design System), dipakai prototipe dan `Frontend/`.

**Masih terbuka (§13)**

- **Backend, database, hosting** — `Frontend/` masih memakai mock; deploy lewat Docker sudah
  dipilih, tapi stack backend, database, penyedia cloud dan region belum.
- **Keadaan pendaftaran "ditolak"** — sisi pengurus sudah ada di prototipe V4 (catatan di
  riwayat, template email *Ditolak*); tampilan untuk pendaftar dan aturan boleh mengajukan
  ulang belum. `Frontend/` baru mengenal status `active` dan `pending`.
- **Halaman komunitas umur nol** — halaman yang jualannya angka, di hari pertama angkanya nol.
  Belum ada keadaan awal; `Frontend/` hanya menampilkan teks kosong.
- **Chat: WhatsApp atau internal?** — prototipe masih memunculkan toast "di produk ini membuka WhatsApp".
- **Logo Kolavo SVG** — `Frontend/` masih memakai PNG sebagai mask.
- **Geolocation asli** — "Di sekitar saya" masih statis (Jakarta Utara); belum ada
  penanganan kalau izin lokasi ditolak.

**Pertanyaan terbuka lain** (di luar PRD §13)

- **Diskon saat perpanjangan** — diskon 5% / 10% berlaku untuk pembelian pertama; perlakuan
  saat perpanjangan belum diputuskan (`Redesign/PROMPT-HARGA.md`).
- **"Hubungi kami" Big Organization** — baru berupa toast; kanalnya (formulir, email,
  WhatsApp) belum ditentukan.
- **Legal / UU PDP** — naskah Syarat & Ketentuan dan Kebijakan Privasi belum ditinjau
  penasihat hukum; identitas pengendali data (badan hukum, alamat, narahubung) masih
  placeholder; menu "Data & privasi" untuk hak subjek data (Gelombang B di
  `Redesign/PROMPT-PDP.md`) belum dikerjakan.
- **Validasi Advance** — apakah pengurus mau membayar panel Advance belum ditanyakan ke
  5–10 komunitas kurasi; business plan memisahkan pergantian kepengurusan sebagai biaya
  per penggunaan, bukan langganan.
- **Perpanjangan sesi login** — token refresh belum dirancang; user ter-logout saat token
  habis (`Frontend/docs/adr/0003-bearer-token-behind-bff-cookie.md`).
- **Kontrak API** — `Frontend/docs/api/openapi.yaml` masih draf dari sisi frontend; perlu
  ditinjau tim backend sebelum mereka mulai.

---

## Token inti (ringkas)

Poppins · primary `#2D6BE4` (hover `#0045CD`) · aksen `#FF683D` ·
netral `#222222` `#6B7280` `#9CA3AF` · garis `#EFEFEF` ·
radius tombol 100 (pill) / kartu 13 / modal 32 · dark mode wajib lewat token.

Selengkapnya di [`Redesign/REFERENCE.md`](Redesign/REFERENCE.md).
