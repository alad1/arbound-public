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

(function(){
  const form=document.getElementById('inquiry-form');
  if(!form)return;
  const status=document.getElementById('inquiry-status');
  const submit=form.querySelector('button[type="submit"]');
  const business=document.querySelector('.business-strip a.button');
  fetch('/api/contact',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(data=>{
    if(data&&data.available===true){
      form.hidden=false;
      if(business)business.href='#inquiries';
    }
  }).catch(()=>{});
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    if(submit.disabled)return;
    submit.disabled=true;
    status.textContent='Sending your inquiry…';
    try{
      const payload=Object.fromEntries(new FormData(form));
      const r=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const data=await r.json();
      if(!r.ok||!data.ok)throw Error('send failed');
      form.reset();
      status.textContent='Thank you. Your inquiry has been submitted.';
    }catch{
      status.textContent='Your inquiry could not be submitted. Please email commercial@arboundgroup.com directly or try again later.';
    }finally{submit.disabled=false;}
  });
})();