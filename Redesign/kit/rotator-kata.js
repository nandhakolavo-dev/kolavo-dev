(function(){
  var el=document.getElementById('rot');
  if(!el||window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var w=['komunitas','organisasi','asosiasi','ikatan alumni','himpunan'],i=0;
  setInterval(function(){
    el.style.opacity='0';
    setTimeout(function(){i=(i+1)%w.length;el.textContent=w[i];el.style.opacity='1';},300);
  },3000);
})();
