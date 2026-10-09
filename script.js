/* Arbound Website v0.2 — no external libraries, trackers or network calls. */
(function(){
  'use strict';
  const toggle = document.querySelector('.nav-toggle');
  const navigation = document.querySelector('.primary-nav');
  if (toggle && navigation) {
    function closeMenu() {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
      navigation.classList.remove('is-open');
    }
    toggle.addEventListener('click', function(){
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      navigation.classList.toggle('is-open', open);
    });
    navigation.querySelectorAll('a').forEach(function(link){link.addEventListener('click',closeMenu);});
    document.addEventListener('keydown',function(event){if (event.key === 'Escape') closeMenu();});
    document.addEventListener('click',function(event){
      if (!navigation.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    // Initialize connected routes before attaching observer; otherwise browser
    // can reveal the path before stroke-dashoffset is assigned.
    document.querySelectorAll('[data-draw-path]').forEach(function(path){
      const length = path.getTotalLength();
      path.style.strokeDasharray = String(length);
      path.style.strokeDashoffset = String(length);
    });
    document.body.classList.add('js-motion');
    const observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        if (entry.target.hasAttribute('data-draw-path')) {
          // requestAnimationFrame ensures initial dash is painted before drawing.
          requestAnimationFrame(function(){ entry.target.style.strokeDashoffset = '0'; });
        }
        observer.unobserve(entry.target);
      });
    }, {threshold:.08,rootMargin:'0px 0px -38px 0px'});
    document.querySelectorAll('[data-reveal], [data-line], [data-draw-path]').forEach(function(el){observer.observe(el);});
  }
})();
