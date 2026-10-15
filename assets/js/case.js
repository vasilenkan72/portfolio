/* ════════════════════════════════════════
   case.js  |  slide lightbox for case pages
   Any element with [data-slide="N"] opens slide N (1-based).
   Slides: data-slides="path/prefix" + data-count on .lightbox
   ════════════════════════════════════════ */
'use strict';
(function () {
  const box = document.querySelector('.lightbox');
  if (!box) return;
  const img     = box.querySelector('.lightbox__stage img');
  const counter = box.querySelector('.lightbox__count');
  const base    = box.dataset.slides;
  const count   = parseInt(box.dataset.count, 10);
  const src     = n => `${base}/s${String(n).padStart(2, '0')}.webp`;
  let current = 1;
  let lastFocus = null;

  function show(n) {
    current = (n - 1 + count) % count + 1;
    img.src = src(current);
    img.alt = `Слайд ${current} из ${count}`;
    counter.textContent = `${current} / ${count}`;
    new Image().src = src(current % count + 1); // preload next
  }
  function open(n) {
    lastFocus = document.activeElement;
    show(n);
    box.classList.add('open');
    document.body.style.overflow = 'hidden';
    box.querySelector('.lightbox__close').focus();
  }
  function close() {
    box.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll('[data-slide]').forEach(el =>
    el.addEventListener('click', () => open(parseInt(el.dataset.slide, 10))));
  box.querySelector('.lightbox__close').addEventListener('click', close);
  box.querySelector('.lightbox__prev').addEventListener('click', () => show(current - 1));
  box.querySelector('.lightbox__next').addEventListener('click', () => show(current + 1));

  document.addEventListener('keydown', e => {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  // swipe on touch screens
  let x0 = null;
  box.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    x0 = null;
  });
})();
