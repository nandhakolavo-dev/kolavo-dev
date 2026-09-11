#!/usr/bin/env python3
"""Sunting halaman dengan penggantian bertarget, atomik, dan swa-diagnosa.

    python3 Redesign/kit/edit.py [berkas.html] <<'JSON'

Tanpa nama berkas: menyunting ReDesign_Kolavo_3.html, satu-satunya berkas kerja.
v1, v2, dan Masuk beku — lihat CLAUDE.md.
    [{"cari": "teks lama", "ganti": "teks baru"},
     {"cari": "x", "ganti": "y", "n": 4}]
    JSON

Kenapa ada: tiga pemborosan yang berulang saat menyunting manual —
  1. cwd bergeser sehingga path relatif gagal  -> path selalu diselesaikan dari root repo
  2. anchor meleset, butuh grep terpisah lalu ulang -> kegagalan langsung menampilkan kandidat
  3. berkas separuh tersunting saat satu edit gagal -> semua atau tidak sama sekali
Setelah berhasil, audit statis otomatis dijalankan.
"""
import json, pathlib, re, subprocess, sys

KIT = pathlib.Path(__file__).resolve().parent
arg = [a for a in sys.argv[1:] if not a.startswith('-')]
F = pathlib.Path(arg[0]).resolve() if arg else (KIT.parent / 'ReDesign_Kolavo_3.html').resolve()
if not F.exists(): sys.exit(f'tidak ada: {F}')

edits = json.load(sys.stdin)
teks = F.read_text()
asli = teks

def petunjuk(cari):
    """tunjukkan di mana kira-kira anchor-nya, supaya tak perlu grep terpisah"""
    for n in (60, 40, 24, 14):
        cuplik = cari[:n].strip()
        if len(cuplik) < 8: break
        posisi = [m.start() for m in re.finditer(re.escape(cuplik), asli)]
        if posisi:
            out = [f'      cocok sebagian pada {len(posisi)} tempat dengan {n} karakter pertama:']
            for p in posisi[:4]:
                baris = asli.count('\n', 0, p) + 1
                awal = asli.rfind('\n', 0, p) + 1
                out.append(f'        baris {baris}: {asli[awal:asli.find(chr(10), p)][:110]}')
            return '\n'.join(out)
    return '      tidak ada kecocokan sebagian — anchor mungkin sudah berubah total'

gagal = []
for i, e in enumerate(edits, 1):
    cari, ganti, n = e['cari'], e['ganti'], e.get('n', 1)
    ada = teks.count(cari)
    if ada != n:
        gagal.append(f'  [{i}] ditemukan {ada}x, diharapkan {n}x\n'
                     f'      cari: {cari[:80]!r}\n{petunjuk(cari)}')
        continue
    teks = teks.replace(cari, ganti)

if gagal:
    print('BATAL — tidak ada yang ditulis. Kegagalan:\n' + '\n'.join(gagal))
    sys.exit(1)

F.write_text(teks)
selisih = len(teks) - len(asli)
print(f'{F.name}: {len(edits)} suntingan diterapkan · {selisih:+d} byte · {F.stat().st_size//1024} KB\n')

# Modul di src/ adalah potongan — mengaudit fragmen memberi peringatan palsu
# (CSS-nya ada di modul lain, HTML-nya di modul lain). Audit dijalankan pada
# berkas terbangun yang utuh lewat bundle.py.
if F.resolve().parent.name == 'src':
    print('Modul src/ disunting. Rakit + audit berkas utuh:  python3 Redesign/kit/bundle.py')
else:
    subprocess.run([sys.executable, str(KIT / 'audit.py'), str(F)])
