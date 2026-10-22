# Kolavo — Brain

Titik masuk untuk berorientasi di seluruh proyek Kolavo — bukan hanya
`Redesign/`. Baca ini dulu kalau belum tahu dokumen apa ada di mana.

Kolavo: community platform Indonesia. Basecamp digital + pendampingan
pengurus. Pelanggan: pendiri/pengurus komunitas (organisasi, asosiasi,
ikatan alumni, himpunan).

## Peta repo

| Lokasi | Isi |
|---|---|
| `CLAUDE.md` (root) | instruksi kerja teknis untuk Claude Code — terutama alur menyunting `Redesign/` lewat `kit/edit.py`. Wajib dibaca sebelum menyunting apa pun di `Redesign/`. |
| `brain/` | dokumen inti proyek: bisnis, produk, riset (folder ini). |
| `Redesign/` | prototipe desain UI yang berjalan. Lihat bagian tersendiri di bawah. |
| `Q2/` | dokumen EPIC per fitur — requirement, sketsa, review — dari siklus kerja kuartal berjalan. Struktur & isi dibiarkan apa adanya. |
| `RIIM/` | proposal & materi riset untuk kompetisi RIIM 2026. |

## brain/

| Berkas | Isi |
|---|---|
| `bisnis/Business Plan.md` | model bisnis, pelanggan, kompetitor (Google + WhatsApp + Zoom), strategi entry 2 tahun pertama lewat 5–10 komunitas kurasi. Diringkas juga di `CLAUDE.md` bagian "Konteks bisnis" untuk hal yang mempengaruhi desain. |
| `produk/PRD Kolavo.docx` | requirement produk. |
| `riset/Riset Memahami Kebutuhan Community Builder.docx` | riset kebutuhan pendiri/pengurus komunitas. |

## Redesign/

Sumber kebenaran desain — lihat `Redesign/REFERENCE.md` untuk token, komponen,
aset, dan keputusan; `CLAUDE.md` untuk cara menyuntingnya (wajib lewat
`kit/edit.py`, jangan manual).

| Lokasi | Isi |
|---|---|
| `ReDesign_Kolavo_3.html` | **satu-satunya berkas yang disunting.** Prototipe berjalan, empat layar dalam satu berkas. |
| `REFERENCE.md` | acuan token desain, komponen, aset, dan keputusan lama — baca sebelum membuat layar baru. |
| `archive/` | tiga versi beku, jangan disunting: `ReDesign_Kolavo_1.html` (pra-basecamp), `ReDesign_Kolavo_2.html` (homepage, sumber kit diekstrak dulu), `ReDesign_Kolavo_Masuk.html` (pembanding modal masuk). |
| `kit/` | alat penyuntingan (`edit.py`, `peta.py`, `audit.py`) dan komponen yang pernah diekstrak dari v2 — beku bersama arsip, `extract.py` jangan dijalankan lagi. |
| `assets/` | `logo-kolavo-mask.png` (logo tanpa Beta), `logos/` (logo komunitas asli), `photos/` (4 foto profil hasil AI + prompt-nya). Sumber aset yang ditanam sebagai base64 di dalam HTML. |

## Q2/ — EPIC per fitur

Satu folder per EPIC, umumnya berisi beberapa versi dokumen requirement (V1,
V2, ...), review, dan sketsa/mockup gambar terkait.

| Folder | EPIC |
|---|---|
| `00 Archive/` | arsip: PRD v1, daftar fungsi komunitas, daftar anggota, daftar pengurus |
| `01 EPIC - Public Community Discovery/` | pencarian & penemuan komunitas publik (homepage) |
| `02 EPIC - Public Community Profile/` | halaman profil komunitas publik |
| `02.01 EPIC - Admin Community Profile/` | halaman profil komunitas versi pengurus |
| `03 EPIC - Public Community Member Distribution/` | sebaran anggota komunitas (bar chart, tag cloud) |
| `03.01 EPIC - Admin Community Membership/` | setup keanggotaan komunitas oleh pengurus |
| `04 EPIC - Community Membership Application and Approval/` | pengajuan & persetujuan keanggotaan |
| `04.01 EPIC - Admin Membership Application/` | pengajuan keanggotaan sisi admin |
| `05 EPIC - New Member Community Member Discovery/` | penemuan sesama anggota untuk anggota baru |
| `06 EPIC - Kolavo Design System/` | design system |
| `07 EPIC - Admin Community Member Discovery/` | direktori anggota sisi admin |
| `08 EPIC - User Profile Display/` | tampilan profil pengguna |
| `09 EPIC - User Profile Creation/` | pembuatan profil pengguna |
| `11 EPIC - User Authentication/` | autentikasi (modal masuk) |
| `12 EPIC - User Onboarding/` | onboarding pengguna baru |
| `13 EPIC - User Help Centre/` | pusat bantuan |
| `14 EPIC - Community Growth & Activation/` | pertumbuhan & aktivasi komunitas |

Tidak ada folder "10 EPIC" — celah penomoran ini sudah begitu di sumbernya,
bukan berkas yang hilang.

Berkas lepas di root `Q2/`: `EPIC Template.docx` / `Review Template.docx`
(templat kerja), `Kolvao V1.docx`, `Kolavo Messaging.docx`, `Kolavo Homepage
and Daftar Anggota Messaging.docx` (draft copywriting), dan
`Testing and Feedback/` (catatan pengujian dengan pengguna).

## RIIM/

Materi untuk proposal kompetisi RIIM 2026.

| Berkas | Isi |
|---|---|
| `Proposal RIIM KOLAVO 2026-final-rev (2).pdf` | proposal final |
| `Aspirasi RIIM Kompetisi 2026_....pdf` | pernyataan aspirasi kompetisi |
| `Dasar Prioritas Produk.pdf` | dasar penentuan prioritas produk |
| `Prioritas Fitur Untuk Diriset.pdf` | daftar fitur yang perlu diriset |
| `Deskripsi Singkat Kolavo.docx` | ringkasan produk |
| `Modul Kolavo.jpeg` | diagram modul produk |
| `RAB Produk Kolavo.xlsx` | rencana anggaran biaya |
