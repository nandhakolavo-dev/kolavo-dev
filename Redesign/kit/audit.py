#!/usr/bin/env python3
"""Pemeriksa statis. Menangkap kelas bug yang benar-benar terjadi di proyek ini,
tanpa membuka browser dan tanpa screenshot.

    python3 Redesign/kit/audit.py [berkas.html]
"""
import pathlib, re, sys, collections

F = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else
                 pathlib.Path(__file__).parent.parent / 'ReDesign_Kolavo_3.html')
src = F.read_text()
style = '\n'.join(re.findall(r'<style>(.*?)</style>', src, re.S))
body = re.sub(r'<style>.*?</style>|<script>.*?</script>', '', src, flags=re.S)
temuan = []
def lapor(kode, pesan): temuan.append((kode, pesan))

# aturan CSS: (selector, isi) — data URI dibuang dulu supaya regex tidak tersedak
bersih = re.sub(r'url\("data:[^"]*"\)', 'url(ASET)', style)
RULES = [(m.group(1).strip(), m.group(2))
         for m in re.finditer(r'([^{}]+)\{([^{}]*)\}', bersih)]

# ---------- A. token ganda ----------
prop = collections.defaultdict(list)
ROOT = re.compile(r'^:root(\s*:not\([^)]*\))?(\[data-theme[^\]]*\])?$')
for sel, isi in RULES:
    if not ROOT.match(sel.strip()):      # variabel lingkup komponen itu wajar berulang
        continue
    for m in re.finditer(r'(--[\w-]+)\s*:', isi):
        prop[m.group(1)].append(sel)
for p, sels in prop.items():
    if len(sels) > 3:
        lapor('A', f'{p} didefinisikan {len(sels)}x — biasanya cuma 3 (terang, media gelap, [data-theme]). '
                   f'Blok: {", ".join(dict.fromkeys(sels))[:90]}')

# ---------- B. warna harfiah di dalam blok tema ----------
def blok_seimbang(t, i):
    d = 0
    for m in re.finditer(r'[{}]', t[i:]):
        d += 1 if m.group() == '{' else -1
        if d == 0: return t[i:i + m.end()]
    return ''
tema = []
for m in re.finditer(r'@media[^{]*prefers-color-scheme[^{]*(?=\{)|:root\[data-theme[^{]*(?=\{)', bersih):
    tema.append(blok_seimbang(bersih, m.end()))
def deklarasi(blok):
    """pasangan (selector, deklarasi) di dalam satu blok tema —
       termasuk deklarasi yang menempel langsung pada selector temanya"""
    blok = blok.strip()
    if blok.startswith('{'): blok = blok[1:-1]        # buang kurung terluar
    hasil = [(r.group(1), r.group(2)) for r in re.finditer(r'([^{}]+)\{([^{}]*)\}', blok)]
    langsung = re.sub(r'\{[^{}]*\}', '', blok)          # sisakan deklarasi tingkat atas
    hasil.append(('(langsung pada blok tema)', langsung))
    return hasil
for blok in tema:
    for sel, isi in deklarasi(blok):
        for d in re.finditer(r'(?<!-)\b(color|background|background-color|border-color|fill|stroke)\s*:\s*([^;]+)', isi):
            nilai = d.group(2)
            if re.search(r'#[0-9a-fA-F]{3,8}|rgba?\(', nilai) and 'var(' not in nilai:
                lapor('B', f'warna harfiah di blok tema: {sel.strip()[:40]} → {d.group(1)}:{nilai.strip()[:30]}')

# ---------- C. [hidden] yang ditimpa display ----------
punya_display = {}
for sel, isi in RULES:
    m = re.search(r'(?<!-)\bdisplay\s*:\s*([\w-]+)', isi)
    if m and m.group(1) != 'none':
        for k in re.findall(r'\.([\w-]+)', sel):
            if '[hidden]' not in sel: punya_display.setdefault(k, m.group(1))
aman = {k for sel, _ in RULES if '[hidden]' in sel for k in re.findall(r'\.([\w-]+)', sel)}
for m in re.finditer(r'<[^>]*\bclass="([^"]+)"[^>]*(?<![-\w])hidden(?![-\w=])|<[^>]*(?<![-\w])hidden(?![-\w=])[^>]*\bclass="([^"]+)"', body):
    for k in ((m.group(1) or m.group(2) or '')).split():
        if k in punya_display and k not in aman:
            lapor('C', f'.{k} menyetel display:{punya_display[k]} tapi elemennya pakai atribut hidden — '
                       f'hidden akan diabaikan. Tambahkan .{k}[hidden]{{display:none}}')

# ---------- D. kelas dipakai di HTML tapi tak pernah didefinisikan ----------
didefinisikan = {k for sel, _ in RULES for k in re.findall(r'\.([\w-]+)', sel)}
dipakai = collections.Counter()
for m in re.finditer(r'class="([^"]+)"', body):
    for k in m.group(1).split():
        if not k.startswith('{'): dipakai[k] += 1
hantu = [k for k in dipakai if k not in didefinisikan]
if hantu:
    lapor('D', f'kelas dipakai tapi tak ada aturannya (kemungkinan salah ketik): {", ".join(sorted(hantu)[:10])}')

# ---------- E. dua kelas di satu elemen berebut properti yang sama ----------
milik = collections.defaultdict(dict)
for sel, isi in RULES:
    s = sel.strip()
    if re.fullmatch(r'\.[\w-]+', s):
        for d in re.finditer(r'(?<![\w-])(padding|margin|display|position)\s*:', isi):
            milik[s[1:]][d.group(1)] = True
for m in re.finditer(r'class="([^"]+)"', body):
    ks = [k for k in m.group(1).split() if k in milik]
    for i in range(len(ks)):
        for j in range(i+1, len(ks)):
            sama = set(milik[ks[i]]) & set(milik[ks[j]])
            for p in sama:
                lapor('E', f'.{ks[i]} dan .{ks[j]} sama-sama menyetel {p} pada elemen yang sama — '
                           f'yang belakangan di stylesheet menang, sering tak disengaja')

# ---------- ringkasan keadaan ----------
print(f'== {F.name} · {F.stat().st_size//1024} KB ==')
print(f'   section={len(re.findall(r"<section", body))} '
      f'kartu-komunitas={body.count("ccard c-")} '
      f'pemicu-masuk={len(re.findall(r"data-login=", body))} '
      f'aset-tertanam={style.count("data:image/jpeg")+style.count("data:image/png")} '
      f'aturan-css={len(RULES)}')
h1 = re.search(r'<h1[^>]*>(.*?)</h1>', body, re.S)
if h1: print(f'   h1: {re.sub(r"<[^>]+>", "", h1.group(1)).strip()[:70]}')

if not temuan:
    print('   bersih — tidak ada temuan')
else:
    print()
    unik = list(dict.fromkeys(temuan))
    for kode, pesan in unik:
        print(f'   [{kode}] {pesan}')
    print(f'\n   {len(unik)} temuan')
sys.exit(0)
