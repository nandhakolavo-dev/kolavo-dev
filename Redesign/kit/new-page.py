#!/usr/bin/env python3
"""Rakit halaman baru dari Kolavo Design Kit.

    python3 kit/new-page.py "Judul Halaman" keluaran.html [--parts nav,footer,modal] [--js modal-masuk,rotator-kata]

Semua CSS dan aset ditanam inline supaya hasilnya bisa langsung dipublikasikan
sebagai Artifact (CSP-nya memblokir aset dari host luar).
"""
import argparse, pathlib, sys

KIT = pathlib.Path(__file__).parent
FONT = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
        '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
        'family=Poppins:wght@400;500;600;700&family=Roboto:wght@500&display=swap">')

def baca(nama):
    f = KIT / nama
    if not f.exists():
        sys.exit(f"kit: berkas '{nama}' tidak ada di {KIT}")
    return f.read_text()

def main():
    if '--saya-tahu-satu-berkas' not in sys.argv:
        sys.exit(
            "new-page.py dimatikan.\n\n"
            "Alat ini membuat berkas HTML terpisah. Aturan repo ini sekarang satu\n"
            "prototipe = satu berkas: layar baru ditambahkan ke dalam\n"
            "ReDesign_Kolavo_3.html sebagai <div class=\"scr\" id=\"scr…\">, karena\n"
            "Artifact tidak bisa menaut antarberkas dan berkas kembar berarti tiap\n"
            "perbaikan dikerjakan dua kali.\n\n"
            "Langkahnya ada di Redesign/REFERENCE.md -> \"Menambah layar baru\".\n\n"
            "Kalau benar-benar perlu: tambahkan --saya-tahu-satu-berkas")
    sys.argv = [x for x in sys.argv if x != '--saya-tahu-satu-berkas']

    ap = argparse.ArgumentParser()
    ap.add_argument('judul')
    ap.add_argument('keluaran')
    ap.add_argument('--parts', default='nav,footer',
                    help='markup dari kit: nav, footer, modal (default: nav,footer)')
    ap.add_argument('--js', default='',
                    help='perilaku: rotator-kata, direktori-filter, pemilih-lokasi, modal-masuk')
    ap.add_argument('--no-assets', action='store_true',
                    help='lewati aset base64 (~140 KB) kalau halaman tidak butuh logo/foto')
    a = ap.parse_args()

    css = [baca('tokens.css'), baca('components.css')]
    if not a.no_assets:
        css.append(baca('assets.css'))

    peta = {'nav':'nav.html', 'footer':'footer.html', 'modal':'modal-masuk.html'}
    parts = [peta[p.strip()] for p in a.parts.split(',') if p.strip()]

    js = [baca(f'{n.strip()}.js') for n in a.js.split(',') if n.strip()]

    out = [f'<meta charset="utf-8">',
           f'<meta name="viewport" content="width=device-width,initial-scale=1">',
           f'<title>{a.judul}</title>', FONT, '',
           '<style>', *css, '</style>', '']
    for p in parts:
        if p != 'footer.html':
            out += [baca(p), '']
    out += ['<main>', '  <!-- isi halaman di sini -->', '</main>', '']
    if 'footer.html' in parts:
        out += [baca('footer.html'), '']
    for j in js:
        out += ['<script>', j, '</script>', '']

    pathlib.Path(a.keluaran).write_text('\n'.join(out))
    kb = pathlib.Path(a.keluaran).stat().st_size // 1024
    print(f'{a.keluaran} dibuat · {kb} KB · parts={a.parts} js={a.js or "-"}')

main()
