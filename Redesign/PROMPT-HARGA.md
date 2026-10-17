# PROMPT — Aturan harga Advance di bagian `#harga` (V4)

Status: **sudah dieksekusi di beranda (6 Okt 2026; tarif dasar diubah ke Rp 199 pada 14 Okt 2026)**. Keputusan ada di bagian paling bawah.
Belum dikerjakan: panel Tagihan dashboard dan batas Esensial di dashboard.

## Lingkup

Hanya beranda: `src/30-layer-scrBeranda.html` (bagian `#harga`), `src/50-js-harga.html`
(kalkulator), `src/10-styles.html` (blok "harga"). Jangan sentuh panel Tagihan di
`50-js-sekretariat.html` — itu tahap terpisah.

Alur: `kit/edit.py` → `kit/bundle.py` → `bundle.py --check` → publish Artifact yang sama.
Verifikasi lewat `javascript_tool` (angka kalkulator), satu screenshot di akhir.

## Aturan harga

**Esensial — FREE.** Sampai 20 anggota, 1 peninjau. (Sudah terpasang.)

**Advance — anggota.**
- Jumlah anggota ditagih per kelipatan 10, mulai 30, maksimal 1.000.
  `n = ceil(anggota / 10) × 10`
- Semua anggota ditagih, bukan hanya tambahannya: `biaya_anggota = n × tarif(n)`
- Tarif turun Rp 0,13 tiap tambahan 10 anggota sejak 30 (diubah 17 Okt 2026; dulu 0,04167):
  `tarif(n) = 199 − ((n − 30) / 10 × 0,13)`  → Rp 186,39 di 1.000 anggota.

**Advance — peninjau.**
- Peninjau pertama Rp 15.000/bulan, tiap peninjau tambahan Rp 3.000/bulan.
  `biaya_peninjau = 15.000 + 3.000 × (peninjau − 1)`

**Diskon durasi (pembelian pertama).**
- 1–5 bulan: 0% · 6–12 bulan: 5% · langsung 2 tahun (24 bulan): 10%
- Pilihan di kalkulator: 1 bulan, 6 bulan, 12 bulan, 2 tahun.
- `total = (biaya_anggota + biaya_peninjau) × bulan × (1 − diskon)`

**Di atas 1.000 anggota — paket Big Organization.** Tidak bisa dibeli langsung; tombol "Hubungi kami".
Juga untuk komunitas yang butuh konsultasi pengembangan komunitas, berapa pun anggotanya.

## Perubahan UI

1. **Kartu Advance:** ganti "Rp XXXX · per anggota / bulan" dengan "Rp 199 · per
   anggota / bulan", tambah baris "Peninjau mulai Rp 15.000 / bulan".
2. **Kartu ketiga** (nama paket: lihat keputusan 2): "Di atas 1.000 anggota, atau butuh
   pendampingan" + tombol "Hubungi kami". Kisi kartu jadi tiga kolom; warna aksen oranye
   supaya beda dari Esensial (hijau) dan Advance (biru).
3. **Kalkulator** — tiga masukan, hasil dihitung langsung:
   - Anggota: slider 30–1.000, langkah 10
   - Peninjau: stepper, minimal 1
   - Durasi: pilihan 1 / 6 / 12 / 24 bulan
   - Hasil: tarif per anggota, biaya anggota, biaya peninjau, total per bulan, diskon,
     total dibayar. Format `Rp 1.234.567` (`toLocaleString('id-ID')`), dibulatkan ke rupiah.
   - Slider mentok di 1.000 → tampilkan ajakan ke paket ketiga.
4. Hapus teks "Minimal 50 anggota ditagihkan" dan semua `Rp XXXX` di bagian ini.

## Uji angka (lolos, lewat `window.KolavoHarga(anggota, peninjau, bulan)`)

| Masukan | Hasil |
|---|---|
| 30 anggota, 1 peninjau, 1 bulan | 30 × 199 + 15.000 = **Rp 20.970** |
| 21 anggota (dibulatkan ke 30) | **Rp 20.970** |
| 40 anggota, 3 peninjau, 1 bulan | 40 × 198,96 + 21.000 = **Rp 28.958** |
| 40 anggota, 1 peninjau, 6 bulan | 22.958,33 × 6 × 0,95 = **Rp 130.862** |
| 40 anggota, 1 peninjau, 12 bulan | 22.958,33 × 12 × 0,95 = **Rp 261.725** |
| 40 anggota, 1 peninjau, 2 tahun | 22.958,33 × 24 × 0,90 = **Rp 495.900** |
| 1.000 anggota, 1 peninjau, 1 bulan | 1.000 × 194,96 + 15.000 = **Rp 209.958** |

## Keputusan (6 Okt 2026)

1. Penurunan tarif dalam **rupiah**, dihitung sejak 30 anggota — mengikuti rumus sheet.
   (Catatan awal menyebut "di atas 40"; rumus yang dipakai.)
2. Nama paket ketiga: **Big Organization**.
4. **14 Okt 2026:** tarif dasar Advance Rp 1.191 → **Rp 199** per anggota per bulan.
   Penurunan per 10 anggota kini Rp 0,13 (17 Okt 2026).
3. Diskon 10% untuk **langsung berlangganan 2 tahun**. Durasi 13–23 bulan tidak ditawarkan;
   di kode jatuh ke 5%.

## Masih terbuka

- Diskon hanya untuk pembelian pertama — perlakuan saat perpanjangan belum diputuskan.
- Panel Tagihan dashboard masih "Rp XXXX, minimal 50 anggota".
- Dashboard Esensial belum membatasi 1 peninjau dan 20 anggota.
- Tombol "Hubungi kami" baru memunculkan toast; belum ada formulir kontak.

## Jangan

- Jangan ubah Esensial, hero, atau bagian lain.
- Jangan tampilkan kredit kenalan di bagian ini.
- Jangan tulis warna harfiah; pakai token.
