#!/usr/bin/env python3
"""Rakit src/ per-fitur menjadi satu ReDesign_Kolavo_3.html yang utuh.

    python3 Redesign/kit/bundle.py            # rakit lalu audit
    python3 Redesign/kit/bundle.py --check    # rakit ke memori, bandingkan, JANGAN tulis

Kenapa ada: Artifact hanya bisa menjalankan SATU berkas HTML yang self-contained
(CSP memblokir aset luar, router antar-layar butuh satu DOM). Jadi sumbernya
dipecah per fitur di src/ supaya tiap suntingan cuma menyentuh satu modul kecil —
hemat konteks — tapi yang dipublish tetap satu berkas. bundle.py jembatannya.

Perakitan = penggabungan mentah src/<berkas> sesuai urutan di src/manifest.txt.
Tidak ada transformasi: keluaran byte-identik dengan gabungan potongannya.
Karena itu memisah lalu merakit ulang tidak pernah mengubah apa pun — split.py
memotong di batas yang sama.
"""
import pathlib, subprocess, sys

AKAR = pathlib.Path(__file__).resolve().parent.parent
SRC = AKAR / 'src'
OUT = AKAR / 'ReDesign_Kolavo_3.html'
MAN = SRC / 'manifest.txt'


def modul():
    if not MAN.exists():
        sys.exit(f'tidak ada manifest: {MAN}\nJalankan split.py dulu untuk membuat src/.')
    urut = []
    for baris in MAN.read_text().splitlines():
        b = baris.strip()
        if not b or b.startswith('#'):
            continue
        f = SRC / b
        if not f.exists():
            sys.exit(f'manifest menyebut berkas yang tak ada: {b}')
        urut.append(f)
    return urut


def rakit():
    return ''.join(f.read_text() for f in modul())


def main():
    cek = '--check' in sys.argv
    hasil = rakit()
    if cek:
        lama = OUT.read_text() if OUT.exists() else ''
        if hasil == lama:
            print(f'--check: identik ({len(hasil)} byte, {len(modul())} modul). Tidak ada yang perlu ditulis.')
        else:
            d = len(hasil) - len(lama)
            print(f'--check: BERBEDA dari berkas terbangun ({d:+d} byte). '
                  f'Jalankan tanpa --check untuk menulis.')
            sys.exit(1)
        return
    OUT.write_text(hasil)
    print(f'{OUT.name}: dirakit dari {len(modul())} modul · {len(hasil)} byte · {OUT.stat().st_size//1024} KB\n')
    subprocess.run([sys.executable, str(AKAR / 'kit' / 'audit.py'), str(OUT)])


if __name__ == '__main__':
    main()
