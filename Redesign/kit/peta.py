#!/usr/bin/env python3
"""Peta struktur prototipe — orientasi tanpa membaca berkasnya.

    python3 Redesign/kit/peta.py [berkas.html]

Kenapa ada: ReDesign_Kolavo_3.html 285 KB dan ~50% aset base64. Membacanya
utuh menghabiskan konteks tanpa guna, tapi menyuntingnya lewat kit/edit.py
butuh tahu ada layar apa, id apa, dan fungsi global apa. Skrip ini menjawab
itu dalam satu perintah murah.

Sekaligus penjaga: kalau jumlah layar atau bagian berubah tanpa disengaja —
pernah terjadi, satu bagian hilang diam-diam saat rangkaian suntingan —
peta ini langsung memperlihatkannya.
"""
import pathlib, re, sys

AKAR = pathlib.Path(__file__).resolve().parent.parent

# --src: peta modul per-fitur, memberitahu modul mana yang disunting untuk apa
if '--src' in sys.argv:
    SRC = AKAR / 'src'
    man = SRC / 'manifest.txt'
    if not man.exists(): sys.exit('src/ belum ada. Jalankan: python3 Redesign/kit/split.py')
    peran = {
        '00-preamble': 'doctype, meta, <title>, <head>',
        '10-styles': 'SELURUH token + komponen CSS (satu sumber, ubah warna/token di sini)',
        '20-nav': 'bilah nav + menu akun',
        '30-layer-scrBeranda': 'markup hero WAG + direktori komunitas',
        '30-layer-scrLengkapi': 'markup form lengkapi profil',
        '30-layer-scrProfil': 'markup profil pengguna',
        '30-layer-scrKomunitas': 'markup halaman komunitas',
        '30-layer-scrAnggota': 'markup detail satu anggota',
        '30-layer-scrBuat': 'markup buat halaman komunitas',
        '40-footer': 'footer + brand line',
        '50-js-direktori-filter': 'JS pencarian/penyaringan direktori',
        '50-js-pemilih-lokasi': 'JS pemilih lokasi bertingkat',
        '50-js-modal-masuk': 'JS modal masuk Google + copy per-niat',
        '50-js-lengkapi-profil': 'JS perilaku layar lengkapi profil',
        '50-js-notifikasi': 'JS lonceng notifikasi pengguna di nav',
        '50-js-onboarding': 'JS modal stepper onboarding anggota baru (Advance)',
        '50-js-runtime-router': 'JS keadaan + router + sambungan antar layar',
        '50-js-pemilih-tanggal': 'JS kalender tanggal lahir',
        '50-js-sunting-identitas': 'JS sunting identitas Google',
        '50-js-layar-komunitas': 'JS layar komunitas (terbesar: agregat, daftar, kenalan)',
        '50-js-tema-komunitas': 'JS warna tema per komunitas',
        '50-js-layar-buat': 'JS layar buat halaman',
        '90-tail': '</body></html>',
    }
    print('== src/ · modul per-fitur ==')
    print('Sunting satu modul lewat kit/edit.py, lalu rakit: kit/bundle.py\n')
    for baris in man.read_text().splitlines():
        b = baris.strip()
        if not b or b.startswith('#'): continue
        f = SRC / b
        kb = f.stat().st_size / 1024 if f.exists() else 0
        nama = b[:-5] if b.endswith('.html') else b
        print(f'  {nama:26} {kb:6.1f} KB  {peran.get(nama, "")}')
    sys.exit(0)

F = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 and not sys.argv[1].startswith('-') else AKAR / 'ReDesign_Kolavo_3.html'
if not F.is_absolute(): F = (AKAR / F) if (AKAR / F).exists() else F.resolve()
if not F.exists(): sys.exit(f'tidak ada: {F}')

t = F.read_text()
baris = t.split('\n')
def no(idx): return t.count('\n', 0, idx) + 1

print(f'== {F.name} · {F.stat().st_size // 1024} KB · {len(baris)} baris ==\n')

# ---------- layar ----------
print('LAYAR')
for m in re.finditer(r'<div class="scr" id="(\w+)"([^>]*)>', t):
    awal = no(m.start())
    tanda = ' (tampil awal)' if 'hidden' not in m.group(2) else ''
    akhir = t.find(f'/{m.group(1)} -->', m.end())
    print(f'  {m.group(1):<14} baris {awal}{tanda}')
    # bagian di dalamnya
    potong = t[m.end(): akhir if akhir > 0 else len(t)]
    judul = []
    for h in re.finditer(r'<h[123][^>]*>([^<]{2,60})</h[123]>', potong):
        s = h.group(1).strip()
        if s and s not in judul:
            judul.append(s)
    for s in judul:
        print(f'       · {s}')

# ---------- bagian beranda ----------
print('\nBAGIAN BERANDA')
for m in re.finditer(r'<section id="(\w+)"', t):
    print(f'  #{m.group(1):<13} baris {no(m.start())}')

# ---------- blok skrip ----------
print('\nBLOK SKRIP')
for m in re.finditer(r'<script>\s*/\*([\s\S]{0,900}?)\*/', t):
    # baris pertama komentar yang benar-benar kalimat, bukan garis pembatas
    nama = '(tanpa judul)'
    for baris_k in m.group(1).split('\n'):
        s = baris_k.strip().lstrip('*= ').strip()
        if len(s) > 6 and not set(s) <= set('=- '):
            nama = s.rstrip('.')
            break
    print(f'  baris {no(m.start()):<6} {nama[:72]}')

# ---------- API global ----------
print('\nAPI GLOBAL (window.*)')
for m in sorted(set(re.findall(r'window\.(Kolavo\w+)\s*=', t))):
    print(f'  {m}')

# ---------- id yang dipakai JS ----------
ids = sorted(set(re.findall(r'id="([\w-]+)"', t)))
print(f'\nID: {len(ids)}')
for i in range(0, len(ids), 6):
    print('  ' + '  '.join(f'{x:<18}' for x in ids[i:i+6]).rstrip())
