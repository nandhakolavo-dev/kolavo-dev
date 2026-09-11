#!/usr/bin/env python3
"""Pecah ReDesign_Kolavo_3.html menjadi modul-modul fitur di src/.

    python3 Redesign/kit/split.py            # pecah, tulis src/, verifikasi
    python3 Redesign/kit/split.py --dry      # tampilkan rencana potong, jangan tulis

Kenapa ada: sekali pakai untuk membangun src/ dari berkas terbangun, ATAU untuk
merekonsiliasi kalau seseorang menyunting berkas terbangun langsung (bukan lewat
src/). Batas potongnya sama persis dengan yang dirakit bundle.py, jadi
    split.py  lalu  bundle.py --check
selalu 'identik'. Kalau tidak, ada penanda struktur yang berubah — itu sinyal,
bukan kesalahan skrip.

Batas potong (semua di batas byte, tak ada teks yang dibuang atau ditambah):
  00-preamble          awal berkas .. <style>
  10-styles            <style> .. </style>
  20-nav               </style> .. <div class="scr" id="scrBeranda">
  30-layer-<scr*>      tiap markup layar, berurutan sampai <footer>
  40-footer            <footer> .. akhir footer (sebelum <script> pertama)
  50-js-<nama>         tiap blok <script>, diberi nama dari komentar kepalanya
  90-tail              setelah </script> terakhir .. akhir berkas
"""
import pathlib, re, sys

AKAR = pathlib.Path(__file__).resolve().parent.parent
SRC = AKAR / 'src'
OUT = AKAR / 'ReDesign_Kolavo_3.html'

LAYAR = ['scrBeranda', 'scrLengkapi', 'scrProfil', 'scrKomunitas', 'scrAnggota', 'scrBuat']
# label blok skrip, berurutan sesuai kemunculannya di berkas
JS = ['direktori-filter', 'pemilih-lokasi', 'modal-masuk', 'lengkapi-profil',
      'runtime-router', 'pemilih-tanggal', 'sunting-identitas', 'layar-komunitas',
      'tema-komunitas', 'layar-buat']


def batas(t):
    """kembalikan daftar (byte_awal, nama) terurut."""
    c = []
    c.append((0, '00-preamble'))
    c.append((re.search(r'<style>', t).start(), '10-styles'))
    c.append((re.search(r'</style>', t).end(), '20-nav'))
    for name in LAYAR:
        m = re.search(r'<div class="scr" id="' + name + r'"', t)
        if not m:
            sys.exit(f'layar hilang dari berkas: {name} — struktur berubah, split dibatalkan')
        c.append((m.start(), '30-layer-' + name))
    c.append((re.search(r'<footer', t).start(), '40-footer'))
    sm = list(re.finditer(r'<script>', t))
    if len(sm) != len(JS):
        sys.exit(f'jumlah blok skrip {len(sm)} ≠ {len(JS)} yang dikenal — '
                 f'perbarui daftar JS di split.py sebelum memecah')
    for m, lab in zip(sm, JS):
        c.append((m.start(), '50-js-' + lab))
    c.append((t.rfind('</script>') + len('</script>'), '90-tail'))
    c.sort()
    return c


def main():
    dry = '--dry' in sys.argv
    if not OUT.exists():
        sys.exit(f'tidak ada: {OUT}')
    t = OUT.read_text()
    c = batas(t)
    segs = []
    for i, (b, name) in enumerate(c):
        e = c[i + 1][0] if i + 1 < len(c) else len(t)
        segs.append((name + '.html', b, e))

    # jaring pengaman: gabungan potongan harus == sumber, byte demi byte
    if ''.join(t[b:e] for _, b, e in segs) != t:
        sys.exit('GAGAL: gabungan potongan tidak sama dengan sumber — split dibatalkan')

    if dry:
        print(f'{"modul":28} {"byte":>8} {"len":>8}')
        for name, b, e in segs:
            print(f'{name:28} {b:8} {e-b:8}')
        print('\n--dry: tidak ada yang ditulis.')
        return

    SRC.mkdir(exist_ok=True)
    for name, b, e in segs:
        (SRC / name).write_text(t[b:e])
    (SRC / 'manifest.txt').write_text(
        '# Urutan perakitan bundle.py — JANGAN ubah urutan tanpa alasan.\n'
        "# Baris diawali '#' diabaikan. Satu berkas per baris, dirakit dari atas ke bawah.\n"
        + '\n'.join(n for n, _, _ in segs) + '\n')
    print(f'src/: {len(segs)} modul ditulis dari {OUT.name} ({len(t)} byte).')
    print('Verifikasi: python3 Redesign/kit/bundle.py --check')


if __name__ == '__main__':
    main()
