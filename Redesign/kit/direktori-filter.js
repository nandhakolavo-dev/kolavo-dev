(function(){
  var q = document.getElementById('q');
  if(!q) return;
  var cards   = [].slice.call(document.querySelectorAll('.ccard')),
      chips   = [].slice.call(document.querySelectorAll('button.chip[data-bentuk]')),
      bar     = document.getElementById('resultbar'),
      empty   = document.getElementById('empty'),
      msg     = document.getElementById('emptymsg'),
      invite  = document.getElementById('emptyinvite'),
      resetAll= document.getElementById('emptyreset'),
      grid    = document.querySelector('#direktori .grid');

  var state = { teks:'', bentuk:'', negara:'', provinsi:'', kota:'', sekitar:false };
  // untuk mockup: "di sekitar saya" diperagakan sebagai Jakarta Utara
  var LOKASI_SAYA = { provinsi:'DKI Jakarta', kota:'Jakarta Utara' };

  function norm(t){ return (t||'').toLowerCase(); }

  function cocok(card){
    if(state.bentuk && card.dataset.bentuk !== state.bentuk) return false;
    if(state.teks){
      var hay = norm(card.textContent);
      if(hay.indexOf(norm(state.teks)) === -1) return false;
    }
    if(state.sekitar){
      if(card.dataset.kota !== LOKASI_SAYA.kota) return false;
    } else {
      if(state.negara   && card.dataset.negara   !== state.negara)   return false;
      if(state.provinsi && card.dataset.provinsi !== state.provinsi) return false;
      if(state.kota     && card.dataset.kota     !== state.kota)     return false;
    }
    return true;
  }

  function rangkumFilter(){
    var bits = [];
    if(state.teks)    bits.push('“' + state.teks + '”');
    if(state.bentuk)  bits.push('bentuk ' + state.bentuk);
    if(state.sekitar) bits.push('di sekitarmu');
    else {
      var loc = [state.kota, state.provinsi, state.negara].filter(Boolean);
      if(loc.length) bits.push('di ' + loc[0]);
    }
    return bits;
  }

  function render(){
    var tampil = 0;
    cards.forEach(function(c){
      var ok = cocok(c);
      c.hidden = !ok;
      if(ok) tampil++;
    });
    var kosong = tampil === 0;
    grid.hidden = kosong;
    bar.hidden  = kosong;
    empty.hidden = !kosong;
    if(!kosong){
      bar.innerHTML = 'Menampilkan <b>' + tampil + '</b> dari ' + cards.length + ' komunitas';
    } else {
      var bits = rangkumFilter();
      msg.innerHTML = bits.length
        ? 'Tidak ada komunitas yang cocok dengan ' + bits.join(' · ') + '.'
        : 'Belum ada komunitas yang bisa ditampilkan.';
    }
  }

  q.addEventListener('input', function(){ state.teks = q.value.trim(); render(); });

  chips.forEach(function(ch){
    ch.addEventListener('click', function(){
      chips.forEach(function(x){ x.classList.remove('on'); });
      ch.classList.add('on');
      state.bentuk = ch.dataset.bentuk;
      render();
    });
  });

  // dihubungkan ke pemilih lokasi
  window.kolavoSetLokasi = function(o){
    state.sekitar  = !!o.sekitar;
    state.negara   = o.negara   || '';
    state.provinsi = o.provinsi || '';
    state.kota     = o.kota     || '';
    render();
  };

  invite.addEventListener('click', function(){
    var teks = 'Halo pengurus! Yuk bikin halaman komunitas kita di Kolavo biar anggota bisa saling kenal: https://kolavo.app';
    var label = invite.textContent;
    function selesai(){
      invite.textContent = 'Link tersalin ✓';
      setTimeout(function(){ invite.textContent = label; }, 2200);
    }
    try {
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(teks).then(selesai, selesai);
      } else { selesai(); }
    } catch(e){ selesai(); }
  });

  resetAll.addEventListener('click', function(){
    q.value = '';
    state = { teks:'', bentuk:'', negara:'', provinsi:'', kota:'', sekitar:false };
    chips.forEach(function(x){ x.classList.toggle('on', x.dataset.bentuk === ''); });
    if(window.kolavoResetLokasi) window.kolavoResetLokasi();
    render();
  });

  render();
})();
