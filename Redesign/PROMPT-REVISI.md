# Prompt revisi Kolavo — urutan eksekusi

Jalankan berurutan, satu prompt per giliran. Cukup ketik: **"Jalankan P3 dari `Redesign/PROMPT-REVISI.md`"**.

**Penutup baku (berlaku untuk tiap prompt):**
Alur standar CLAUDE.md: `edit.py` → `bundle.py` → `peta.py` + `audit.py` → satu pengukuran DOM → publish Artifact. Maksimal 1 screenshot. Catat keputusan di `REFERENCE.md`. Jangan membaca berkas terbangun. Commit sesudah tiap prompt lolos.

| # | Prompt | Butuh selesai dulu | Kenapa di urutan ini |
|---|---|---|---|
| P1 | Kerangka menu dashboard | — | Semua menu baru butuh tempat |
| P2 | Isi Dashboard (statistik) | P1 | Mengisi halaman "Dashboard" hasil rename |
| P3 | Setting | P1 | Kerangka sub-menu dari P1 |
| P4 | Kepengurusan | P3 | Jabatan kustom masuk ke checklist Akses (P3) |
| P5 | Info komunitas + pembeda paket | P1 | Sumber tautan untuk P7/P8 |
| P6 | Jawaban pendaftar + template email | P1 | Kelompok jawaban dipakai pencocokan P8 |
| P7 | Pengaturan onboarding | P5 | Membaca tautan dari Info komunitas |
| P8 | Notifikasi + modal onboarding anggota | P5, P6, P7 | Konsumen semua data di atas |

---

## Fase 1 · Dashboard pengurus

### P1 · Rombak kerangka menu (struktur saja, belum ada isi baru)
Modul: `30-layer-scrKelola`, `50-js-sekretariat`, `50-js-dashboard-pengurus`, `10-styles`
1. Grup menu **Advance** pindah ke atas **Kelola**.
2. "Meja kerja" → **"Dashboard"** di semua tempat.
3. Hapus seluruh blok "Perlu diurus" dari Dashboard.
4. Hapus menu **"Cocokkan data"** beserta semua rujukannya di layar lain, termasuk CSS/JS yatim. Setelah selesai, `grep -i cocok` harus 0.
5. Tambah menu **Setting** (Advance) dengan sub-menu Akun / Notifikasi / Tagihan / Akses pengurus. Untuk sekarang kerangka saja. "Akses pengurus" dipindah ke dalamnya.
6. **Kepengurusan** jadi menu bersub-menu: *Struktur Kepengurusan* (isi Kepengurusan yang sekarang) + *Serah terima* (dipindah dari Advance).

Hanya memindah dan menghapus; isi halaman lain belum diubah.

### P2 · Isi Dashboard: statistik pertumbuhan anggota
Modul: `50-js-sekretariat`, `10-styles`
- Kartu angka: pengunjung profil komunitas, pendaftar, diterima, ditolak. Tiap kartu dengan selisih ▲/▼ % dibanding minggu lalu.
- Kartu akses: jumlah orang yang membuka **Dokumen komunitas** dan **Alat komunikasi** (WA).
- Grafik garis SVG inline untuk membandingkan seri, dengan pemilih rentang 4/12 minggu. Warna lewat token, tanpa library luar.
- Tombol **Unduh rekap** → CSV dari data dummy (Blob, sisi klien).

### P3 · Setting
Modul: `50-js-sekretariat`, `10-styles`
- **Akun**: ganti email pemilik, dengan langkah konfirmasi.
- **Notifikasi**: toggle per jenis aktivitas (misalnya pendaftaran baru) + daftar email pengurus penerima, **maksimal 3**. Tombol tambah nonaktif kalau sudah 3.
- **Tagihan**: alamat penagihan + metode pembayaran (hanya tampilan, tanpa input nomor kartu sungguhan).
- **Akses pengurus**: tabel "Siapa boleh apa" jadi checklist yang bisa disunting per jabatan, dengan tombol simpan. Daftar jabatan dibaca dari satu sumber (dipakai P4).

### P4 · Kepengurusan
Modul: `50-js-sekretariat`, `50-js-dashboard-pengurus`
- Struktur Kepengurusan: tombol **+ Jabatan kustom**. Jabatan baru otomatis muncul di checklist Akses pengurus (P3).
- Serah terima: riwayat per periode (tahun) yang menampilkan **siapa saja pengurusnya** per jabatan, bisa dibuka-tutup.

## Fase 2 · Sumber data

### P5 · Profil komunitas: pembeda Esensial vs Advance + data anggota
Modul: `50-js-sekretariat` (menu Advance), `30-layer-scrKomunitas`, `50-js-layar-komunitas`, `30-layer-scrLengkapi`, `50-js-lengkapi-profil`, `10-styles`

**A. Menu Info komunitas (dashboard, grup Advance)**
- Menu baru **Info komunitas** di grup **Advance**, berisi kolom tautan **Grup komunikasi** (WA), **Peraturan komunitas** (bisa diunduh), **Dokumen komunitas**, dan teks **Pengumuman** (contoh: "Penerimaan anggota dilakukan setiap hari Senin").
- Satu objek state komunitas; P7/P8 membaca dari objek yang sama.
- Form Buat halaman **tidak** disentuh. Dashboard Esensial tidak punya menu ini.

**B. Pembeda profil Esensial vs Advance (halaman komunitas)**
Pakai flag `premium` yang sudah ada (`50-js-layar-komunitas`). Satu fungsi render dengan cabang per paket, bukan dua markup kembar.
- **Advance**: panel **Info komunitas** — blok Pengumuman di atas, lalu tiga tombol tautan berikon (Grup WA, Peraturan ⤓, Dokumen), plus lencana premium yang sudah ada. Tiap bagian hanya tampil kalau kolomnya terisi. Onboarding (P8) hanya berjalan di paket ini.
- **Esensial**: profil dasar saja (nama, deskripsi, lokasi, jumlah anggota, tombol gabung), tanpa panel Info komunitas dan tanpa ruang kosong bekasnya.
- **Pengurus Esensial** yang melihat halamannya sendiri mendapat kartu ajakan kecil: "Tambahkan pengumuman, peraturan, dan tautan grup WA dengan paket Advance". Tidak terlihat oleh pengunjung/anggota.
- Data dummy direktori memuat minimal satu komunitas per paket.

**C. Berlaku di dua paket**
- Tombol **Bagikan tautan**: `navigator.share`, cadangan salin ke clipboard + toast. Tampil untuk pengunjung, anggota, dan pengurus (tautan publik membantu menarik anggota organik).
- Daftar anggota menampilkan **nama panggilan**; nama lengkap hanya di tampilan pengurus.
- Lengkapi profil: daftar **akun media sosial** opsional (pilih platform + handle, baris bisa ditambah/dihapus).

**D. Catat di `REFERENCE.md`:** konten premium hanya diisi lewat grup Advance, profil Esensial tidak menampilkan panelnya, Bagikan tautan berlaku semua paket.

### P6 · Jawaban pendaftar + template email (grup Advance)
Modul: `50-js-dashboard-pengurus`, `50-js-sekretariat`
- Menu **Jawaban pendaftar**: tinjau ulang jawaban pertanyaan pendaftaran per anggota.
- Sub-fitur **Kelompokkan jawaban**: memetakan jawaban bebas ke label kelompok (misalnya "Karyawan swasta", "Wirausaha"). Label jadi atribut anggota yang dipakai filter daftar anggota dan pencocokan kenalan (P8).
- Menu **Template email**: sunting subjek + isi untuk *Diterima* dan *Ditolak*, dengan chip variabel `{nama}` `{komunitas}` + pratinjau langsung. Catatan "tersambung ke API email nanti"; tidak ada pengiriman sungguhan.

## Fase 3 · Onboarding

### P7 · Pengaturan Onboarding (grup Advance)
Modul: `50-js-sekretariat`, `10-styles`
- Menu **Onboarding** dengan toggle utama untuk menyalakan/mematikan seluruh fitur.
- Lima langkah, masing-masing punya toggle + konten yang bisa disunting:
  1. Sambutan + kata pengantar pengurus
  2. Sejarah singkat / tujuan / visi-misi
  3. Peraturan (tautan dari Info komunitas P5)
  4. Alat dokumen & komunikasi (tautan WA + dokumen dari Info komunitas P5)
  5. Kenalan dengan anggota yang mirip
- Langkah 3–4 tidak mengetik ulang tautan. Kalau kosong, tampilkan tautan "Isi dulu di Info komunitas".
- Simpan konfigurasi di satu objek state (misalnya `window.KolavoOnboarding`) yang dibaca P8. Tombol **Pratinjau** membuka modal P8.

### P8 · Sisi anggota premium: notifikasi + modal onboarding
Modul: `20-nav`, `50-js-runtime-router`, `50-js-layar-komunitas`, `10-styles`
- **Menu notifikasi** baru: lonceng di nav dengan badge + panel daftar. Isinya antara lain "Pendaftaranmu diterima di {komunitas}" sesudah bergabung.
- Pertama kali membuka halaman komunitas **Advance**, muncul **modal stepper** (radius 32) yang membaca konfigurasi P7. Langkah nonaktif dilewati; kalau fitur dimatikan atau komunitasnya Esensial, modal tidak muncul. Ada tombol Lewati / Kembali / Lanjut, dan status "sudah dilihat" disimpan per komunitas.
- Langkah terakhir: anggota yang cocok **profesi / domisili / kelompok jawaban (P6)**, dengan filter chip. Kalau belum ada yang cocok, tampilkan kartu **pengurus**.
