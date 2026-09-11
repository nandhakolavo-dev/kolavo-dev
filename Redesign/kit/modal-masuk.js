/* ---------- modal masuk ---------- */
(function(){
  const G = '<svg class="gmark" viewBox="0 0 48 48" aria-hidden="true">'+
    '<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>'+
    '<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>'+
    '<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>'+
    '<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>'+
    '</svg>';

  /* nama pendek per komunitas, dipakai di judul supaya tidak kepanjangan */
  const PENDEK = {'l-forpastara':'Forpastara','l-iapnj':'IA PNJ TIK',
                  'l-iasman52':'IA SMAN 52','l-ppiju':'PPI Jakarta Utara'};

  const lgn   = document.getElementById('lgn'),
        box   = lgn.querySelector('.lgn-box'),
        proof = document.getElementById('lgnProof'),
        head  = document.getElementById('lgnHead'),
        sub   = document.getElementById('lgnSub'),
        gbtn  = document.getElementById('lgnG'),
        note  = document.getElementById('lgnNote'),
        noteT = document.getElementById('lgnNoteTxt');
  let pemicu = null, timer = null, tutupTimer = null;

  function tiles(){
    const kelas = [...document.querySelectorAll('.ccard .logo-sq')]
      .map(e => [...e.classList].find(c => c.startsWith('l-')))
      .filter((c, i, a) => c && a.indexOf(c) === i).slice(0, 4);
    return '<div class="lgn-tiles">' + kelas.map(c => `<span class="logo-sq ${c}"></span>`).join('') + '</div>';
  }

  function isi(trigger, kartu){
    if(trigger === 'anggota' && kartu){
      const kelas  = [...kartu.querySelector('.logo-sq').classList].find(c => c.startsWith('l-')),
            nama   = kartu.querySelector('h3').textContent.trim(),
            jumlah = kartu.querySelector('.mem').textContent.trim(),   /* mis. "22 anggota" */
            stack  = kartu.querySelector('.stack').outerHTML;
      return {
        proof: stack,
        cap: nama,
        head: `Kenalan sama ${jumlah} ${PENDEK[kelas] || nama}`,
        sub: 'Daftar anggota cuma kebuka buat sesama anggota — seperti akun Instagram yang di-private. Masuk dulu buat lihat siapa saja di dalamnya.'
      };
    }
    if(trigger === 'pengurus'){
      return {
        proof: tiles(),
        cap: 'Pengurus komunitas ini sudah bikin halamannya',
        head: 'Masuk dulu buat bikin halaman komunitasmu',
        sub: 'Bikin halaman cuma butuh beberapa menit. Kamu tetap yang menentukan siapa yang boleh gabung.'
      };
    }
    return {
      proof: tiles(),
      cap: 'Komunitas yang sudah punya halaman di Kolavo',
      head: 'Masuk dulu, yuk!',
      sub: 'Setelah masuk, kamu bisa mengenal anggota komunitasmu sebelum ketemu orangnya.'
    };
  }

  function buka(trigger, kartu, el){
    clearTimeout(tutupTimer);          /* batalkan sisa animasi tutup sebelumnya */
    const v = isi(trigger, kartu);
    proof.innerHTML = v.proof + `<div class="lgn-cap">${v.cap}</div>`;
    head.textContent = v.head;
    sub.textContent  = v.sub;
    reset();
    pemicu = el || null;
    lgn.hidden = false;
    document.body.classList.add("lgn-open");
    requestAnimationFrame(() => lgn.classList.add('on'));
    /* cadangan: rAF tidak jalan kalau tab sedang tidak terlihat */
    setTimeout(() => lgn.classList.add('on'), 60);
    document.documentElement.style.overflow = 'hidden';
    document.getElementById('lgnX').focus({preventScroll:true});
  }

  function reset(){
    clearTimeout(timer);
    gbtn.disabled = false;
    gbtn.innerHTML = G + ' Lanjutkan dengan Google';
    note.hidden = true;
  }

  function tutup(){
    lgn.classList.remove('on');
    document.documentElement.style.overflow = '';
    document.body.classList.remove("lgn-open");
    tutupTimer = setTimeout(() => { lgn.hidden = true; reset(); }, 170);
    if(pemicu) pemicu.focus({preventScroll:true});
  }

  /* pemicu: nav "Masuk", "Lihat" di kartu, "Buat Halaman Komunitas" */
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-login]');
    if(!t) return;
    e.preventDefault();
    buka(t.dataset.login, t.closest('.ccard'), t);
  });

  document.getElementById('lgnX').addEventListener('click', tutup);
  document.getElementById('lgnScrim').addEventListener('click', tutup);

  document.addEventListener('keydown', e => {
    if(lgn.hidden) return;
    if(e.key === 'Escape'){ tutup(); return; }
    if(e.key !== 'Tab') return;
    /* fokus keyboard dikunci di dalam modal selama terbuka */
    const f = [...box.querySelectorAll('button:not([disabled]), a[href]')];
    if(!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    else if(!box.contains(document.activeElement)){ e.preventDefault(); first.focus(); }
  });

  /* demo state memuat — prototipe, tidak benar-benar ke Google */
  gbtn.addEventListener('click', () => {
    gbtn.disabled = true;
    gbtn.innerHTML = '<span class="gspin"></span> Menghubungkan ke Google…';
    note.hidden = true;
    timer = setTimeout(() => {
      gbtn.disabled = false;
      gbtn.innerHTML = G + ' Lanjutkan dengan Google';
      noteT.textContent = 'Ini prototipe — tombolnya belum benar-benar tersambung ke Google. Di produk, state memuat ini yang tampil sambil menunggu jendela Google terbuka.';
      note.hidden = false;
    }, 1400);
  });
})();
