/* ════════════════════════════════════════
   main.js  |  Portfolio — Наталья  v2
   ════════════════════════════════════════ */
'use strict';

/* ── helpers ── */
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
function esc(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

/* ════════════════════
   LANGUAGE
════════════════════ */
let lang = 'ru';

function applyLang(l) {
  lang = l;
  $$('[data-ru]').forEach(el => { if (el.dataset[l]) el.textContent = el.dataset[l]; });
  $('#langToggle').textContent = l === 'ru' ? 'EN' : 'RU';
  // update document title
  document.title = l === 'ru' ? 'НАТАЛЬЯ — AI Expert & Prompt Engineer' : 'NATALIA — AI Expert & Prompt Engineer';
  renderPortfolio();
  renderReviews();
  // filter button text
  $$('.filter-btn').forEach(b => { if (b.dataset[l]) b.textContent = b.dataset[l]; });
}

$('#langToggle').addEventListener('click', () => applyLang(lang === 'ru' ? 'en' : 'ru'));

/* ════════════════════
   NAVIGATION
════════════════════ */
const burger  = $('#burger');
const navList = $('#navList');
const header  = $('#header');

burger.addEventListener('click', () => {
  const open = navList.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});
$$('#navList a').forEach(a => a.addEventListener('click', () => {
  navList.classList.remove('open');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}));

// header scroll class
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ════════════════════
   SMOOTH SCROLL
════════════════════ */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = $(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ════════════════════
   CUSTOM CURSOR
════════════════════ */
(function() {
  const dot  = $('.cursor');
  const ring = $('.cursor-ring');
  if (!dot || window.matchMedia('(pointer:coarse)').matches) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx - 4.5}px, ${my - 4.5}px)`;
  }, { passive: true });

  // ring follows with lag
  (function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx - 19}px, ${ry - 19}px)`;
    requestAnimationFrame(animateRing);
  })();

  document.addEventListener('mouseleave', () => dot.classList.add('is-hidden'));
  document.addEventListener('mouseenter', () => dot.classList.remove('is-hidden'));

  function addHover(sel) {
    $$(sel).forEach(el => {
      el.addEventListener('mouseenter', () => { dot.classList.add('is-link'); ring.classList.add('is-link'); });
      el.addEventListener('mouseleave', () => { dot.classList.remove('is-link'); ring.classList.remove('is-link'); });
    });
  }
  addHover('a, button, .pcard, .social-link');
})();

/* ════════════════════
   MAGNETIC BUTTONS
════════════════════ */
function initMagnetic() {
  $$('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width  / 2;
      const y = e.clientY - r.top  - r.height / 2;
      el.style.transform = `translate(${x * .28}px, ${y * .28}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform .5s cubic-bezier(.4,0,.2,1)';
      setTimeout(() => el.style.transition = '', 500);
    });
  });
}

/* ════════════════════
   3-D CARD TILT
════════════════════ */
function initTilt() {
  $$('.pcard').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - .5;
      const y = (e.clientY - r.top)  / r.height - .5;
      card.style.transform = `perspective(700px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg) translateZ(12px)`;
      card.style.transition = 'transform .05s';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .55s cubic-bezier(.4,0,.2,1), border-color .3s, box-shadow .3s';
    });
  });
}

/* ════════════════════
   SCROLL REVEAL (Motion.dev)
════════════════════ */
function initReveal() {
  if (!window.Motion) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('visible');
        obs.unobserve(e.target);
        $$('.stat-num', e.target.closest('.about__visual') || e.target)
          .forEach(n => animateCounter(n));
      });
    }, { threshold: 0.12 });
    $$('.reveal-up, .reveal-fade').forEach(el => obs.observe(el));
    return;
  }

  const { inView, animate } = window.Motion;

  $$('.reveal-up').forEach(el => {
    if (el.dataset.motionBound) return;
    el.dataset.motionBound = '1';
    const delay = parseFloat(getComputedStyle(el).getPropertyValue('--d')) || 0;
    const stop = inView(el, () => {
      animate(el, { opacity: [0, 1], y: [32, 0] }, {
        duration: 0.7, delay, easing: [0.22, 1, 0.36, 1]
      });
      $$('.stat-num', el.closest('.about__visual') || el)
        .forEach(n => animateCounter(n));
      stop();
    }, { amount: 0.1 });
  });

  $$('.reveal-fade').forEach(el => {
    if (el.dataset.motionBound) return;
    el.dataset.motionBound = '1';
    const delay = parseFloat(getComputedStyle(el).getPropertyValue('--d')) || 0;
    const stop = inView(el, () => {
      animate(el, { opacity: [0, 1] }, { duration: 0.9, delay, easing: 'ease-out' });
      stop();
    }, { amount: 0.1 });
  });
}

/* ════════════════════
   PARALLAX (Motion.dev)
════════════════════ */
function initParallax() {
  if (!window.Motion) return;
  const { scroll, animate } = window.Motion;
  const hero = $('#hero');
  if (!hero) return;
  const o1 = $('.orb-1'), o2 = $('.orb-2'), o3 = $('.orb-3');
  const opts = { target: hero, offset: ['start start', 'end start'] };
  if (o1) scroll(animate(o1, { y: [0, -120] }), opts);
  if (o2) scroll(animate(o2, { y: [0,   80] }), opts);
  if (o3) scroll(animate(o3, { y: [0,  -60] }), opts);
}

/* ════════════════════
   COUNTER ANIMATION
════════════════════ */
function animateCounter(el) {
  if (el.dataset.counted) return;
  el.dataset.counted = '1';
  const target   = parseInt(el.dataset.target || '0');
  const suffix   = el.dataset.suffix || '';
  const duration = 1600;
  let   start;

  function step(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    const e = 1 - Math.pow(1 - p, 3); // cubic ease-out
    el.textContent = Math.floor(e * target) + (p >= 1 ? suffix : '');
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// Also trigger counter when about section comes into view
(function() {
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      $$('.stat-num').forEach(animateCounter);
      obs.disconnect();
    }
  }, { threshold: 0.3 });
  const aboutSection = $('#about');
  if (aboutSection) obs.observe(aboutSection);
})();

/* ════════════════════
   TYPEWRITER EFFECT
════════════════════ */
(function initTyped() {
  const el = $('#typedText');
  if (!el) return;

  const texts = {
    ru: 'Создаю ИИ-агентов и веб-решения, которые работают',
    en: 'I build AI agents and web solutions that actually work',
  };

  let idx = 0;
  let deleting = false;
  let current = '';
  const speed = { type: 42, delete: 22, pause: 2200, start: 800 };

  function type() {
    const full = texts[lang];
    if (!deleting) {
      current = full.slice(0, idx + 1);
      idx++;
      if (idx === full.length) {
        deleting = true;
        setTimeout(type, speed.pause);
        return;
      }
    } else {
      current = full.slice(0, idx - 1);
      idx--;
      if (idx === 0) {
        deleting = false;
        setTimeout(type, speed.start);
        return;
      }
    }
    el.textContent = current;
    setTimeout(type, deleting ? speed.delete : speed.type);
  }

  setTimeout(type, speed.start);
})();

/* ════════════════════
   SKILLS MARQUEE
════════════════════ */
function renderMarquee() {
  const t1 = $('#marqueeTrack1');
  const t2 = $('#marqueeTrack2');
  if (!t1 || !t2) return;

  // split skills into two rows
  const half = Math.ceil(SKILLS.length / 2);
  const row1 = SKILLS.slice(0, half);
  const row2 = SKILLS.slice(half);

  const makeItems = arr => arr.map(s => `
    <span class="marquee-item is-${esc(s.category)}">
      <span class="marquee-dot"></span>
      ${esc(s.name)}
    </span>
  `).join('');

  // duplicate for seamless loop
  const html1 = makeItems(row1).repeat(2);
  const html2 = makeItems(row2).repeat(2);
  t1.innerHTML = html1;
  t2.innerHTML = html2;
}

/* ════════════════════
   PORTFOLIO
════════════════════ */
let activeFilter = 'all';

function renderPortfolio() {
  const grid = $('#portfolioGrid');
  if (!grid) return;

  const list = activeFilter === 'all' ? PROJECTS : PROJECTS.filter(p => p.category === activeFilter);

  if (!list.length) {
    grid.innerHTML = `<p style="color:var(--muted);grid-column:1/-1;padding:40px 0;">${
      lang === 'ru' ? 'Пока нет работ в этой категории.' : 'No works in this category yet.'
    }</p>`;
    return;
  }

  grid.innerHTML = list.map(p => {
    const title   = esc(p.title[lang]);
    const desc    = esc(p.description[lang]);
    const hasLink = p.link && p.link !== '#';
    const botSVG = `<svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:var(--lime)"><rect x="9" y="19" width="34" height="24" rx="9" stroke="currentColor" stroke-width="1.8"/><circle cx="18" cy="30" r="3.5" fill="currentColor"/><circle cx="34" cy="30" r="3.5" fill="currentColor"/><path d="M20 38 Q26 42 32 38" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/><line x1="26" y1="19" x2="26" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="26" cy="11" r="3" fill="currentColor"/><line x1="9" y1="31" x2="5" y2="31" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="43" y1="31" x2="47" y2="31" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
    const webSVG = `<svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:var(--lime)"><circle cx="26" cy="26" r="18" stroke="currentColor" stroke-width="1.8"/><ellipse cx="26" cy="26" rx="8" ry="18" stroke="currentColor" stroke-width="1.8"/><line x1="8" y1="26" x2="44" y2="26" stroke="currentColor" stroke-width="1.8"/><path d="M10 19 Q26 23 42 19" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M10 33 Q26 29 42 33" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>`;
    const icon = p.category === 'bot' ? botSVG : webSVG;

    return `
      <article class="pcard reveal-up">
        <div class="pcard__img">
          ${p.image
            ? `<img src="${esc(p.image)}" alt="${title}" loading="lazy">`
            : `<div class="pcard__placeholder">${icon}</div>`}
          ${hasLink ? `
            <div class="pcard__overlay">
              <a href="${esc(p.link)}" target="_blank" rel="noopener" class="pcard__open">
                ${lang === 'ru' ? 'Открыть' : 'Open'} →
              </a>
            </div>` : ''}
        </div>
        <div class="pcard__body">
          <h3 class="pcard__title">${title}</h3>
          <p class="pcard__desc">${desc}</p>
          <div class="pcard__tech">
            ${p.tech.map(t => `<span class="tech-tag">${esc(t)}</span>`).join('')}
          </div>
        </div>
      </article>`;
  }).join('');

  // re-init interactions on new cards
  setTimeout(() => { initReveal(); initTilt(); initMagnetic(); }, 40);
}

// filter
$('#filterBtns').addEventListener('click', e => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  $$('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeFilter = btn.dataset.filter;
  renderPortfolio();
});

/* ════════════════════
   REVIEWS
════════════════════ */
function renderReviews() {
  const grid = $('#reviewsGrid');
  if (!grid) return;
  grid.innerHTML = REVIEWS.map(r => `
    <article class="rcard reveal-up">
      <div class="rcard__q">"</div>
      <p class="rcard__text">${esc(r.text[lang])}</p>
      <div>
        <span class="rcard__name">${esc(r.author)}</span>
        <span class="rcard__role">${esc(r.role[lang])}</span>
      </div>
    </article>`).join('');
  setTimeout(() => initReveal(), 40);
}

/* ════════════════════
   CONTACT FORM
════════════════════ */
(function() {
  const form = $('#contactForm');
  const btn  = $('#submitBtn');
  const ok   = $('#formOk');
  const err  = $('#formErr');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    btn.disabled = true;
    btn.textContent = lang === 'ru' ? 'Отправляю...' : 'Sending...';
    ok.classList.add('hidden');
    err.classList.add('hidden');

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        form.reset();
        ok.textContent = ok.dataset[lang] || ok.dataset.ru;
        ok.classList.remove('hidden');
      } else throw new Error();
    } catch {
      err.textContent = err.dataset[lang] || err.dataset.ru;
      err.classList.remove('hidden');
    } finally {
      btn.disabled = false;
      btn.textContent = btn.dataset[lang] || btn.dataset.ru;
    }
  });
})();

/* ════════════════════
   ROI CALCULATOR
════════════════════ */
(function() {
  const modal     = $('#roiModal');
  if (!modal) return;
  const overlay   = $('#roiOverlay');
  const closeBtn  = $('#roiClose');
  const openBtn   = $('#openRoi');
  const empRange  = $('#roiEmp');
  const empVal    = $('#roiEmpVal');
  const salaryInp = $('#roiSalary');
  const routRange = $('#roiRoutine');
  const routVal   = $('#roiRoutineVal');
  const presets   = $$('.roi-preset');
  const outLoss   = $('#roiLoss');
  const outSave   = $('#roiSave');
  const outYear   = $('#roiYear');
  const outROI    = $('#roiROI');
  const payText   = $('#roiPaybackText');
  const ctaLink   = $('#roiCTA');

  let implementCost = 1500;

  function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    calculate();
  }
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  ctaLink.addEventListener('click', closeModal);

  presets.forEach(p => {
    p.addEventListener('click', () => {
      presets.forEach(x => x.classList.remove('active'));
      p.classList.add('active');
      implementCost = parseInt(p.dataset.cost);
      calculate();
    });
  });

  empRange.addEventListener('input',  () => { empVal.textContent  = empRange.value;        calculate(); });
  salaryInp.addEventListener('input', calculate);
  routRange.addEventListener('input', () => { routVal.textContent = routRange.value + '%'; calculate(); });

  function fmt(n) { return new Intl.NumberFormat('ru-RU').format(Math.round(n)); }

  function plural(n, one, two, five) {
    const m10 = n % 10, m100 = n % 100;
    if (m100 >= 11 && m100 <= 14) return five;
    if (m10 === 1) return one;
    if (m10 >= 2 && m10 <= 4) return two;
    return five;
  }

  function calculate() {
    const emp     = parseInt(empRange.value)    || 1;
    const salary  = parseFloat(salaryInp.value) || 0;
    const routine = parseInt(routRange.value)   / 100;

    const monthLoss = emp * salary * routine;
    const monthSave = monthLoss * 0.80;
    const yearSave  = monthSave * 12;
    const payback   = monthSave > 0 ? Math.ceil(implementCost / monthSave) : 0;
    const roi3      = yearSave  > 0 ? Math.round(((yearSave * 3 - implementCost) / implementCost) * 100) : 0;

    outLoss.textContent = salary > 0 ? fmt(monthLoss) + ' BYN' : '—';
    outSave.textContent = salary > 0 ? fmt(monthSave) + ' BYN' : '—';
    outYear.textContent = salary > 0 ? fmt(yearSave)  + ' BYN' : '—';
    outROI.textContent  = salary > 0 ? roi3 + '%'              : '—';

    payText.textContent = '';
    if (salary <= 0) {
      payText.textContent = 'Укажите зарплату сотрудников для расчёта';
    } else {
      const mo = plural(payback, 'месяц', 'месяца', 'месяцев');
      const strong = document.createElement('strong');
      strong.textContent = payback + ' ' + mo;
      payText.append('ИИ-агент окупится за ');
      payText.append(strong);
      payText.append(' и начнёт приносить чистую прибыль');
    }
  }

  calculate();
})();

/* ════════════════════
   INIT
════════════════════ */
renderMarquee();
renderPortfolio();
renderReviews();
initReveal();
initMagnetic();
initParallax();
