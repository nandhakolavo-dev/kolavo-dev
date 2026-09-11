(function(){
  var data = {
    "Indonesia": {
      "DKI Jakarta": ["Jakarta Utara","Jakarta Selatan","Jakarta Pusat","Jakarta Barat","Jakarta Timur"],
      "Jawa Barat": ["Kabupaten Bekasi","Kota Bekasi","Depok","Bogor","Bandung"],
      "DI Yogyakarta": ["Kota Yogyakarta","Sleman","Bantul"]
    },
    "Malaysia": {
      "Selangor": ["Shah Alam","Petaling Jaya","Ampang"],
      "Wilayah Persekutuan Kuala Lumpur": ["Bukit Bintang","Cheras"]
    },
    "United States of America": {
      "California": ["Los Angeles","San Francisco"],
      "New York": ["New York","Buffalo"]
    }
  };

  var btn=document.getElementById('locbtn'), panel=document.getElementById('locpanel'),
      label=document.getElementById('loclabel'), clear=document.getElementById('locclear'),
      near=document.getElementById('locnear'), apply=document.getElementById('locapply'),
      reset=document.getElementById('locreset'),
      negara=document.getElementById('fNegara'), provinsi=document.getElementById('fProvinsi'),
      kota=document.getElementById('fKota'),
      hProv=document.getElementById('hProvinsi'), hKota=document.getElementById('hKota');
  if(!btn) return;

  function fill(sel, items, placeholder){
    sel.innerHTML = '';
    var o = document.createElement('option'); o.value=''; o.textContent=placeholder; sel.appendChild(o);
    items.forEach(function(v){ var x=document.createElement('option'); x.value=v; x.textContent=v; sel.appendChild(x); });
  }
  fill(negara, Object.keys(data), 'Pilih negara');

  function lock(sel, hint, msg){
    sel.disabled = true; sel.innerHTML = '<option value="">'+msg+'</option>'; hint.hidden = false;
  }
  function refresh(){
    apply.disabled = !negara.value;
  }

  negara.addEventListener('change', function(){
    near.classList.remove('on');
    if(negara.value){
      fill(provinsi, Object.keys(data[negara.value]), 'Semua provinsi');
      provinsi.disabled = false; hProv.hidden = true;
    } else { lock(provinsi, hProv, 'Pilih negara dulu'); }
    lock(kota, hKota, 'Pilih provinsi dulu');
    refresh();
  });

  provinsi.addEventListener('change', function(){
    if(provinsi.value){
      fill(kota, data[negara.value][provinsi.value], 'Semua kota/kabupaten');
      kota.disabled = false; hKota.hidden = true;
    } else { lock(kota, hKota, 'Pilih provinsi dulu'); }
    refresh();
  });
  kota.addEventListener('change', refresh);

  function open(v){
    panel.classList.toggle('open', v);
    btn.setAttribute('aria-expanded', v ? 'true' : 'false');
  }
  btn.addEventListener('click', function(e){ e.stopPropagation(); open(!panel.classList.contains('open')); });
  panel.addEventListener('click', function(e){ e.stopPropagation(); });
  document.addEventListener('click', function(){ open(false); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') open(false); });

  function setLabel(text, active){
    label.textContent = text;
    if(!active) btn.removeAttribute('title');
    btn.classList.toggle('active', active);
    clear.hidden = !active;
  }

  near.addEventListener('click', function(){
    near.classList.add('on');
    negara.value=''; lock(provinsi,hProv,'Pilih negara dulu'); lock(kota,hKota,'Pilih provinsi dulu');
    setLabel('Di sekitar saya', true);
    apply.disabled = true;
    if(window.kolavoSetLokasi) window.kolavoSetLokasi({sekitar:true});
    open(false);
  });

  apply.addEventListener('click', function(){
    var parts = [kota.value, provinsi.value, negara.value].filter(Boolean);
    setLabel(parts[0], true);              // yang paling spesifik
    btn.title = parts.join(', ');          // rincian lengkap saat di-hover
    if(window.kolavoSetLokasi) window.kolavoSetLokasi({
      negara: negara.value, provinsi: provinsi.value, kota: kota.value
    });
    open(false);
  });

  function doReset(){
    near.classList.remove('on');
    negara.value=''; lock(provinsi,hProv,'Pilih negara dulu'); lock(kota,hKota,'Pilih provinsi dulu');
    apply.disabled = true;
    setLabel('Semua lokasi', false);
    if(window.kolavoSetLokasi) window.kolavoSetLokasi({});
  }
  window.kolavoResetLokasi = doReset;
  reset.addEventListener('click', function(){ doReset(); open(false); });
  clear.addEventListener('click', function(e){ e.stopPropagation(); doReset(); });
})();
