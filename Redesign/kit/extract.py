#!/usr/bin/env python3
"""Bangun ulang kit dari halaman sumber.

    python3 kit/extract.py [../archive/ReDesign_Kolavo_2.html]

Sumber kebenaran ada di halaman itu, bukan di kit. Setiap kali halaman sumber
berubah, jalankan ini supaya kit ikut segar.
"""
import pathlib, re, sys

KIT = pathlib.Path(__file__).parent
if '--saya-tahu-kit-beku' not in sys.argv:
    sys.exit(
        "extract.py dimatikan.\n\n"
        "kit/ beku bersama ReDesign_Kolavo_2.html. Menjalankan ini menarik dari v2\n"
        "dan menimpa kit dengan pola lama — perubahan yang cuma ada di v3 hilang\n"
        "diam-diam, dan tidak ada yang membaca kit sampai halaman baru dibuat.\n\n"
        "Berkas kerja sekarang cuma ReDesign_Kolavo_3.html. Butuh komponen baru?\n"
        "Tulis langsung di sana. Lihat CLAUDE.md.\n\n"
        "Kalau benar-benar perlu: tambahkan --saya-tahu-kit-beku")
sys.argv = [a for a in sys.argv if a != '--saya-tahu-kit-beku']
SRC = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else KIT.parent / 'archive' / 'ReDesign_Kolavo_2.html')

def hdr(judul):
    return ("/* ============================================================\n"
            f"   Kolavo Design Kit — {judul}\n"
            f"   Diekstrak dari {SRC.name}. Jangan disunting langsung:\n"
            "   ubah di sumbernya lalu jalankan kit/extract.py lagi.\n"
            "   ============================================================ */\n")

src = SRC.read_text()
style = re.search(r'<style>(.*?)</style>', src, re.S).group(1)

# aturan yang memuat aset base64 berat dipisahkan dari komponen
aset, sisa_potong, pos = [], [], 0
for m in re.finditer(r'(^|\n)([^\n{}]+)\{([^{}]*)\}', style, re.S):
    if 'data:image/jpeg' in m.group(3) or 'data:image/png' in m.group(3):
        aset.append(f'{m.group(2).strip()}{{{m.group(3)}}}')
        sisa_potong.append(style[pos:m.start()]); pos = m.end()
sisa_potong.append(style[pos:])
sisa = ''.join(sisa_potong)

batas = sisa.index('/* ---------- tombol')
(KIT/'tokens.css').write_text(hdr('Token') + sisa[:batas].strip() + '\n')
(KIT/'components.css').write_text(hdr('Komponen') + sisa[batas:].strip() + '\n')
(KIT/'assets.css').write_text(hdr('Aset (data URI)') + '\n'.join(aset) + '\n')

def blok(awal, akhir):
    a = src.index(awal); return src[a:src.index(akhir, a) + len(akhir)].strip() + '\n'
(KIT/'nav.html').write_text(blok('<nav>', '</nav>'))
(KIT/'footer.html').write_text(blok('<footer>', '</footer>'))
(KIT/'modal-masuk.html').write_text(blok('<div class="lgn" id="lgn" hidden>', '\n</div>'))

# skrip dinamai dari isinya, bukan urutannya
tanda = {"getElementById('rot')": 'rotator-kata.js',
         "getElementById('q')":   'direktori-filter.js',
         '"Indonesia": {':        'pemilih-lokasi.js',
         'class="gmark"':         'modal-masuk.js'}
for js in re.findall(r'<script>(.*?)</script>', src, re.S):
    for t, nama in tanda.items():
        if t in js:
            (KIT/nama).write_text(js.strip() + '\n'); break

for f in sorted(KIT.iterdir()):
    if f.suffix in ('.css', '.html', '.js'):
        print(f'  {f.name:24} {f.stat().st_size//1024:>4} KB')
