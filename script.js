(function(){
  'use strict';
  const toggle=document.querySelector('.nav-toggle');
  const nav=document.querySelector('.primary-nav');
  if(toggle&&nav){
    const close=()=>{toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');nav.classList.remove('is-open');};
    toggle.addEventListener('click',()=>{
      const open=toggle.getAttribute('aria-expanded')!=='true';
      toggle.setAttribute('aria-expanded',String(open));
      toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');
      nav.classList.toggle('is-open',open);
    });
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  }
  const year=document.getElementById('year');
  if(year)year.textContent=String(new Date().getFullYear());
})();