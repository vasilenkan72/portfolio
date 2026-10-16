/* ════════════════════════════════════════
   main.js  |  Portfolio – Наталья  v3 (DESIGN.md)
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
  document.documentElement.lang = l;
  document.title = l === 'ru' ? 'Наталья Василенко – AI Expert & Prompt Engineer' : 'Natallia Vasilenko – AI Expert & Prompt Engineer';
  renderPortfolio();
  renderServices();
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
   PORTFOLIO
════════════════════ */
let activeFilter = 'all';

function renderPortfolio() {
  const grid = $('#portfolioGrid');
  if (!grid) return;

  const list = activeFilter === 'all' ? PROJECTS : PROJECTS.filter(p => p.category === activeFilter);

  if (!list.length) {
    grid.innerHTML = `<p class="pcard__type" style="grid-column:1/-1;padding:40px 0;">${
      lang === 'ru' ? 'Пока нет работ в этой категории.' : 'No works in this category yet.'
    }</p>`;
    return;
  }

  const TYPES = {
    bot: { ru: 'ИИ-бот · агент', en: 'AI bot · agent' },
    web: { ru: 'Веб-приложение', en: 'Web app' },
    presentation: { ru: 'Презентация', en: 'Presentation' },
  };

  grid.innerHTML = list.map(p => {
    const title   = esc(p.title[lang]);
    const desc    = esc(p.description[lang]);
    const type    = esc((TYPES[p.category] || TYPES.web)[lang]);
    const hasLink = p.link && p.link !== '#';
    const href    = p.page || (hasLink ? p.link : null);
    const isCase  = Boolean(p.page);
    const preview = p.slides
      ? `<div class="pcard__slides">${p.slides.pick.map(n =>
          `<img src="${esc(p.slides.dir)}/s${String(n).padStart(2, '0')}-sm.webp" alt="" loading="lazy" width="640" height="360">`).join('')}</div>`
      : p.image
        ? `<img src="${esc(p.image)}" alt="${title}" loading="lazy">`
        : `<div class="pcard__placeholder">${type}</div>`;

    return `
      <article class="pcard reveal-up">
        <div class="pcard__img">
          ${preview}
        </div>
        <div class="pcard__body">
          <h3 class="pcard__title">${title}</h3>
          <p class="pcard__type">${type}</p>
          <p class="pcard__desc">${desc}</p>
          <div class="pcard__tech">
            ${p.tech.map(t => `<span class="tech-tag">${esc(t)}</span>`).join('')}
          </div>
        </div>
        ${href ? `
          <a href="${esc(href)}" ${isCase ? '' : 'target="_blank" rel="noopener"'} class="pcard__link link-arrow">
            ${isCase ? (lang === 'ru' ? 'Смотреть кейс' : 'View case') : (lang === 'ru' ? 'Смотреть проект' : 'View project')} <span class="arrow">→</span>
          </a>` : ''}
      </article>`;
  }).join('');

  // re-init interactions on new cards
  setTimeout(() => initReveal(), 40);
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
   SERVICES
════════════════════ */
function renderServices() {
  const grid = $('#servicesGrid');
  if (!grid || typeof SERVICES === 'undefined') return;
  const fmt = n => new Intl.NumberFormat('ru-RU').format(n);
  grid.innerHTML = SERVICES.map(s => `
    <article class="scard reveal-up">
      <h3 class="scard__name">${esc(s.name[lang])}</h3>
      <p class="scard__price"><small>${lang === 'ru' ? 'от' : 'from'}</small> ${fmt(s.price)} <small>BYN</small></p>
      <p class="scard__desc">${esc(s.desc[lang])}</p>
      <ul class="scard__list">${s.items[lang].map(i => `<li>${esc(i)}</li>`).join('')}</ul>
      <p class="scard__meta">${lang === 'ru' ? 'Срок' : 'Timeline'}: ${esc(s.term[lang])}</p>
    </article>`).join('');
  setTimeout(() => initReveal(), 40);
}

/* ════════════════════
   REVIEWS
════════════════════ */
function renderReviews() {
  const grid = $('#reviewsGrid');
  if (!grid) return;
  grid.innerHTML = REVIEWS.map(r => `
    <article class="rcard reveal-up${r.photo ? ' rcard--featured' : ''}">
      ${r.photo ? `<img class="rcard__photo" src="${esc(r.photo)}" alt="${esc(r.author)}" loading="lazy" width="1200" height="875">` : ''}
      <div class="rcard__content">
        <p class="rcard__text">${esc(r.text[lang])}</p>
        <div class="rcard__author">
          ${r.avatar ? `<img class="rcard__avatar" src="${esc(r.avatar)}" alt="" loading="lazy" width="48" height="48">` : ''}
          <div>
            <span class="rcard__name">${esc(r.author)}</span>
            <span class="rcard__role">${esc(r.role[lang])}</span>
          </div>
        </div>
        ${r.link ? `<a href="${esc(r.link)}" class="link-arrow rcard__link">${lang === 'ru' ? 'Смотреть кейс' : 'View case'} <span class="arrow">→</span></a>` : ''}
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
  const consent = $('#f-consent');
  if (!form) return;

  const syncConsent = () => { btn.disabled = !consent.checked; };
  consent.addEventListener('change', syncConsent);
  syncConsent();

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
      syncConsent();
      btn.textContent = btn.dataset[lang] || btn.dataset.ru;
    }
  });
})();

/* ════════════════════
   INIT
════════════════════ */
renderPortfolio();
renderReviews();
initReveal();
renderServices();
