/* ════════════════════════════════════════
   chat.js  |  ассистент: выбор задачи → полезный ответ → контакт → Formspree
   Тексты и порядок шагов: chat-script.js
   Uses globals from main.js: lang, esc
   ════════════════════════════════════════ */
'use strict';
(function () {
  const T = key => (CHAT_TEXT[key] || {})[lang] || (CHAT_TEXT[key] || {}).ru || '';
  const F = key => CHAT_TEXT.fields[key][lang] || CHAT_TEXT.fields[key].ru;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── markup ── */
  const launcher = document.createElement('button');
  launcher.type = 'button';
  launcher.className = 'chat-launcher';
  launcher.setAttribute('data-chat-open', '');

  const panel = document.createElement('section');
  panel.className = 'chat';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'false');
  panel.hidden = true;
  panel.innerHTML = `
    <header class="chat__head">
      <span class="chat__dot" aria-hidden="true"></span>
      <div class="chat__who"><strong class="chat__title"></strong><span class="chat__status"></span></div>
      <button type="button" class="chat__close" aria-label="Закрыть чат">×</button>
    </header>
    <div class="chat__body">
      <div class="chat__log" aria-live="polite"></div>
      <div class="chat__actions"></div>
    </div>`;
  document.body.append(launcher, panel);

  const log     = panel.querySelector('.chat__log');
  const actions = panel.querySelector('.chat__actions');
  const body    = panel.querySelector('.chat__body');
  const toBottom = () => requestAnimationFrame(() => { body.scrollTop = body.scrollHeight; });
  new MutationObserver(toBottom).observe(body, { childList: true, subtree: true });
  let started = false;
  let lastFocus = null;
  let topic = null;

  function labels() {
    launcher.innerHTML = `<span class="chat-launcher__icon" aria-hidden="true">✦</span>${esc(T('launcher'))}`;
    panel.setAttribute('aria-label', T('title'));
    panel.querySelector('.chat__title').textContent = T('title');
    panel.querySelector('.chat__status').textContent = T('status');
  }

  /* ── messages ── */
  function bubble(html, who) {
    const el = document.createElement('div');
    el.className = `chat__msg chat__msg--${who}`;
    el.innerHTML = html;
    log.append(el);
    return el;
  }
  async function bot(text, extraHtml = '') {
    const dots = bubble('<span class="chat__typing"><i></i><i></i><i></i></span>', 'bot');
    await wait(reduced ? 0 : Math.min(400 + text.length * 8, 1400));
    dots.innerHTML = `<p>${esc(text)}</p>${extraHtml}`;
  }
  const user = text => bubble(`<p>${esc(text)}</p>`, 'user');

  function caseLinks(t) {
    if (!t.cases.length) return '';
    return `<div class="chat__links">${t.cases.map(c =>
      `<a href="${esc(c.href)}" class="link-arrow">${esc(c[lang] || c.ru)} <span class="arrow">→</span></a>`).join('')}</div>`;
  }

  /* ── steps ── */
  function showTopics() {
    actions.innerHTML = `<div class="chat__options">${CHAT_TOPICS.map(t =>
      `<button type="button" class="chat__option" data-topic="${t.id}">${t.icon} ${esc(t.label[lang])}</button>`).join('')}</div>`;
    actions.querySelector('button').focus({ preventScroll: true });
  }

  async function pickTopic(id) {
    topic = CHAT_TOPICS.find(t => t.id === id);
    actions.innerHTML = '';
    user(`${topic.icon} ${topic.label[lang]}`);
    if (!topic.answer) { await bot(T('askOther')); return showForm(true); }
    if (CHAT_CONFIG.contactFirst) { await bot(T('askContact')); return showForm(false); }
    await bot(topic.answer[lang], caseLinks(topic));
    await priceGuide(topic.id);
    await bot(T('askContact'));
    showForm(false);
  }

  /* ── prices from data.js ── */
  const P = CHAT_PRICE;
  const money = n => new Intl.NumberFormat('ru-RU').format(n);
  const from = () => (lang === 'ru' ? 'от' : 'from');
  async function priceGuide(topicId) {
    const rows = PRICES.filter(r => r.topic === topicId);
    if (!rows.length) return;
    const lines = rows.map(r => `– ${r.name[lang]}: ${from()} ${money(r.price)} BYN, ${r.term[lang]}`).join('\n');
    const roiLink = topicId === 'agent'
      ? `<div class="chat__links"><button type="button" class="link-arrow chat__inline" data-chat-open="roi">${esc(P.roiLink[lang])} <span class="arrow">→</span></button></div>`
      : '';
    await bot(`${P.guide[lang]}\n${lines}`, roiLink);
  }

  function showForm(noteRequired) {
    actions.innerHTML = `
      <form class="chat__form" novalidate>
        <input name="name" required autocomplete="name" placeholder="${esc(F('name'))}" aria-label="${esc(F('name'))}">
        <input name="contact" required autocomplete="tel" placeholder="${esc(F('contact'))}" aria-label="${esc(F('contact'))}">
        <textarea name="note" rows="2" ${noteRequired ? 'required' : ''} placeholder="${esc(F('note'))}" aria-label="${esc(F('note'))}"></textarea>
        <label class="chat__consent"><input type="checkbox" name="consent" required>
          <span>${esc(F('consent'))} <a href="privacy.html" target="_blank">${esc(F('policy'))}</a></span></label>
        <p class="chat__err" role="alert" hidden></p>
        <button type="submit" class="btn btn-primary" disabled>${esc(F('send'))}</button>
      </form>`;
    const form = actions.querySelector('form');
    const btn  = form.querySelector('button');
    const sync = () => { btn.disabled = !form.consent.checked; };
    form.consent.addEventListener('change', sync);
    form.addEventListener('submit', e => { e.preventDefault(); send(form); });
    form.name.focus({ preventScroll: true });
  }

  const validContact = v =>
    /^@?[A-Za-z][\w]{3,31}$/.test(v) || v.replace(/\D/g, '').length >= 7 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  async function send(form) {
    const name = form.name.value.trim(), contact = form.contact.value.trim(), note = form.note.value.trim();
    const err = form.querySelector('.chat__err');
    if (!name || !validContact(contact) || (form.note.required && !note)) {
      err.textContent = !validContact(contact) ? F('badContact') : F('name');
      err.hidden = false;
      return;
    }
    form.querySelector('button').disabled = true;
    user(`${name}, ${contact}${note ? `\n${note}` : ''}`);
    actions.innerHTML = '';
    let ok = false;
    try {
      const res = await fetch(CHAT_CONFIG.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ source: 'chat', topic: topic.label.ru, name, contact, note, estimate: ['roi', 'price'].includes(topic.id) ? roi.summary : '', consent: 'yes' }),
      });
      ok = res.ok;
    } catch { ok = false; }

    const tg = `<div class="chat__links"><a href="${CHAT_CONFIG.telegram}" target="_blank" rel="noopener" class="link-arrow">${esc(CHAT_TEXT.links.telegram[lang])} <span class="arrow">→</span></a></div>`;
    if (!ok) return bot(T('error'), tg);
    if (CHAT_CONFIG.contactFirst && topic.answer) await bot(topic.answer[lang], caseLinks(topic));
    await bot(T('thanks').replace('{name}', name), tg);
  }

  /* ── benefit estimate (button «Рассчитать выгоду») ── */
  const R = CHAT_ROI;
  const roi = { step: 0, data: {} };
  const fmt = n => new Intl.NumberFormat(lang === 'ru' ? 'ru-RU' : 'en-US').format(Math.round(n));
  const plural = (n, [one, two, five]) => {
    if (lang !== 'ru') return n === 1 ? one : two;
    const m10 = n % 10, m100 = n % 100;
    if (m100 >= 11 && m100 <= 14) return five;
    return m10 === 1 ? one : (m10 >= 2 && m10 <= 4 ? two : five);
  };
  function roiChoices() {
    const st = R.steps[roi.step];
    actions.innerHTML = `<div class="chat__options">${st.options.map((o, i) =>
      `<button type="button" class="chat__option" data-roi="${i}">${esc(o[lang])}</button>`).join('')}</div>`;
    actions.querySelector('button').focus({ preventScroll: true });
  }
  async function startRoi() {
    roi.step = 0; roi.data = {};
    actions.innerHTML = '';
    await bot(R.intro[lang]);
    roiChoices();
  }
  async function pickRoi(i) {
    const st = R.steps[roi.step], o = st.options[i];
    roi.data[st.key] = o.v;
    actions.innerHTML = '';
    user(o[lang]);
    roi.step++;
    if (roi.step < R.steps.length) { await bot(R.steps[roi.step].ask[lang]); return roiChoices(); }
    const { emp, salary, routine } = roi.data;
    const loss = emp * salary * routine, save = loss * 0.8;
    const months = Math.max(1, Math.ceil(R.implementCost / save));
    const text = R.result[lang].replace('{loss}', fmt(loss)).replace('{save}', fmt(save))
      .replace('{year}', fmt(save * 12)).replace('{payback}', `${months} ${plural(months, R.months[lang])}`);
    await bot(text);
    await bot(R.note[lang]);
    topic = { id: 'roi', icon: '📈', label: { ru: 'Расчёт выгоды ИИ-агента', en: 'AI agent benefit estimate' }, answer: null, cases: [] };
    roi.summary = `Сотрудников ~${emp}, зарплата ~${salary} BYN, рутина ~${Math.round(routine * 100)}%. Экономия ~${Math.round(save)} BYN/мес, окупаемость ~${months} мес.`;
    await bot(T('askContact'));
    showForm(false);
  }

  /* ── price quiz (button «Рассчитать стоимость») ── */
  const quiz = { group: null, row: null };
  function choices(items, attr) {
    actions.innerHTML = `<div class="chat__options">${items.map((label, i) =>
      `<button type="button" class="chat__option" data-${attr}="${i}">${esc(label)}</button>`).join('')}</div>`;
    actions.querySelector('button').focus({ preventScroll: true });
  }
  async function startPrice() {
    quiz.group = quiz.row = null;
    actions.innerHTML = '';
    await bot(P.intro[lang]);
    choices(PRICE_GROUPS.map(g => g.title[lang]), 'pgroup');
  }
  async function pickGroup(i) {
    quiz.group = PRICE_GROUPS[i];
    actions.innerHTML = '';
    user(quiz.group.title[lang]);
    const rows = PRICES.filter(r => r.topic === quiz.group.topic);
    if (rows.length === 1) return pickRow(0, true);
    await bot(P.variant[lang]);
    choices(rows.map(r => `${r.name[lang]} · ${from()} ${money(r.price)}`), 'prow');
  }
  async function pickRow(i, silent) {
    quiz.row = PRICES.filter(r => r.topic === quiz.group.topic)[i];
    actions.innerHTML = '';
    if (!silent) user(quiz.row.name[lang]);
    if (P.supportTopics.includes(quiz.group.topic)) {
      await bot(P.support[lang]);
      return choices([P.yes[lang], P.no[lang]], 'psupport');
    }
    finishPrice(false);
  }
  async function finishPrice(support) {
    actions.innerHTML = '';
    const r = quiz.row;
    let text = P.result[lang].replace('{name}', r.name[lang]).replace('{price}', money(r.price)).replace('{term}', r.term[lang]);
    if (support) text += P.withSupport[lang].replace('{price}', money(PRICE_SUPPORT.price));
    await bot(text);
    await bot(P.note[lang]);
    topic = { id: 'price', icon: '💰', label: { ru: `Расчёт стоимости: ${r.name.ru}`, en: `Price estimate: ${r.name.en}` }, answer: null, cases: [] };
    roi.summary = `${r.name.ru}: от ${r.price} BYN, ${r.term.ru}${support ? `; поддержка от ${PRICE_SUPPORT.price} BYN/мес` : ''}`;
    await bot(T('askContact'));
    showForm(false);
  }

  /* ── open / close ── */
  async function open(mode) {
    lastFocus = document.activeElement;
    panel.hidden = false;
    document.body.classList.add('chat-open');
    labels();
    if (mode === 'roi') { started = true; return startRoi(); }
    if (mode === 'price') { started = true; return startPrice(); }
    if (!started) { started = true; await bot(T('greeting')); showTopics(); }
    else panel.querySelector('.chat__close').focus({ preventScroll: true });
  }
  function close() {
    panel.hidden = true;
    document.body.classList.remove('chat-open');
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }

  document.addEventListener('click', e => {
    const opener = e.target.closest('[data-chat-open]');
    if (opener) { e.preventDefault(); open(opener.dataset.chatOpen); return; }
    const opt = e.target.closest('.chat__option');
    if (opt && opt.dataset.roi !== undefined) return pickRoi(+opt.dataset.roi);
    if (opt && opt.dataset.pgroup !== undefined) return pickGroup(+opt.dataset.pgroup);
    if (opt && opt.dataset.prow !== undefined) return pickRow(+opt.dataset.prow);
    if (opt && opt.dataset.psupport !== undefined) return finishPrice(opt.dataset.psupport === '0');
    if (opt) return pickTopic(opt.dataset.topic);
    if (e.target.closest('.chat__close')) return close();
    const link = e.target.closest('.chat__links a[href^="#"]');
    if (link) close();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) close(); });

  // launcher appears only after the hero, so the screen never shows two coral buttons
  const hero = document.getElementById('hero');
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => launcher.classList.toggle('is-visible', !en.isIntersecting),
      { threshold: 0.1 }).observe(hero);
  } else launcher.classList.add('is-visible');

  labels();
  document.getElementById('langToggle')?.addEventListener('click', labels);
})();
