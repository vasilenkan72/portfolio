(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const CATALOG = [
    { name: 'Петли нижние', text: 'На раму и на створку, накладки белые и коричневые', img: 'hinge-frame.jpg', art: 'EL.K / FL.K' },
    { name: 'Засовы и приводы', text: 'Подбираются по высоте створки, от 510 до 2400 мм', img: 'drive-gam.jpg', art: 'GAM / XPO' },
    { name: 'Петли на створку', text: 'С регулировкой по высоте ±3 мм, заглушки и накладки', img: 'hinge-sash.jpg', art: 'FL.K' },
    { name: 'Ручки оконные', img: 'handle.svg', text: 'Белые, коричневые, с ключом – для детской безопасности', art: 'ручки' },
    { name: 'Ножницы', img: 'scissors.svg', text: 'Для откидывания на проветривание, 400–1400 мм', art: 'NO / XNO' },
    { name: 'Угловые передачи', img: 'corner.svg', text: 'Основные, узкие, с пошаговым проветриванием', art: 'XU / XUU' },
    { name: 'Зацепы и цапфы', img: 'keeper.svg', text: 'Периметральные и откидные, под разные профили', art: 'Z / XZSP' },
    { name: 'Опции и дверная фурнитура', img: 'options.svg', text: 'Микролифт, микровентиляция, балконная защёлка, ограничитель', art: 'PLS / BZ' }
  ];

  // ---------- Order list (persisted per viewer) ----------
  let list = [];
  try { list = JSON.parse(localStorage.getItem('orderList') || '[]'); } catch (e) { list = []; }
  const save = () => { try { localStorage.setItem('orderList', JSON.stringify(list)); } catch (e) {} };

  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2400);
  }
  function addItem(name, art) {
    const key = name + '|' + art;
    const found = list.find((i) => i.key === key);
    if (found) found.qty++; else list.push({ key, name, art, qty: 1 });
    save(); renderList(); toast('Добавлено: ' + name);
  }
  function renderList() {
    const n = list.reduce((s, i) => s + i.qty, 0);
    $$('[data-count]').forEach((el) => (el.textContent = n));
    const box = $('#listItems');
    if (!list.length) { box.innerHTML = '<p class="empty">Пока пусто. Добавляйте детали со схемы, подбора или каталога.</p>'; return; }
    box.innerHTML = list.map((i, idx) => `<div class="list-item"><span>${esc(i.name)} <span class="mono">${esc(i.art)}</span> × ${i.qty}</span><button aria-label="Убрать" data-del="${idx}">×</button></div>`).join('');
  }
  document.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    if (add) addItem(add.dataset.name, add.dataset.art);
    const del = e.target.closest('[data-del]');
    if (del) { list.splice(+del.dataset.del, 1); save(); renderList(); }
    if (e.target.closest('[data-open-list]')) $('#drawer').classList.add('open');
    const send = e.target.closest('[data-send]');
    if (send) sendList(send.dataset.send);
  });
  $('#closeList').addEventListener('click', () => $('#drawer').classList.remove('open'));

  async function sendList(where) {
    const lines = list.map((i) => `– ${i.name} ${i.art} × ${i.qty}`);
    const note = $('#listNote').value.trim();
    const text = ['Здравствуйте! Хочу заказать:', ...lines, note && 'Комментарий: ' + note].filter(Boolean).join('\n');
    try { await navigator.clipboard.writeText(text); toast('Текст скопирован – вставьте в чат'); } catch (e) { toast('Скопируйте список вручную'); }
    setTimeout(() => { location.href = where === 'viber' ? SHOP.viber : SHOP.telegram; }, 600);
  }

  // ---------- Symptom finder ----------
  $('#symList').innerHTML = SYMPTOMS.map((s) => `<button class="sym-btn" data-sym="${s.id}" aria-pressed="false"><span class="ico">${s.icon}</span><span>${esc(s.title)}</span></button>`).join('');
  $('#symList').addEventListener('click', (e) => {
    const b = e.target.closest('[data-sym]'); if (!b) return;
    $$('.sym-btn').forEach((x) => x.setAttribute('aria-pressed', x === b));
    const s = SYMPTOMS.find((x) => x.id === b.dataset.sym);
    const out = $('#symOut');
    out.innerHTML = `<span class="tag">Скорее всего нужно: ${esc(s.part)}</span><h3>${esc(s.title)}</h3><p>${esc(s.fix)}</p>
      <p style="margin-top:12px"><b>Что сфотографировать:</b></p><ol>${s.photo.map((p) => `<li>${esc(p)}</li>`).join('')}</ol>
      <div class="hero-cta"><a class="btn btn-accent" href="${SHOP.viber}">Отправить фото в Viber</a><a class="btn" href="${SHOP.telegram}">В Telegram</a></div>`;
    out.hidden = false;
    out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // ---------- Scheme hotspots ----------
  const NS = 'http://www.w3.org/2000/svg';
  SCHEME.forEach((p, i) => {
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'hot'); g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button');
    g.setAttribute('aria-label', p.name); g.dataset.id = p.id;
    g.innerHTML = `<circle cx="${p.x}" cy="${p.y}" r="13"></circle><text x="${p.x}" y="${p.y}">${i + 1}</text>`;
    $('#hots').appendChild(g);
  });
  function showPart(id) {
    const p = SCHEME.find((x) => x.id === id);
    $$('.hot').forEach((h) => h.classList.toggle('active', h.dataset.id === id));
    $('#schemeInfo').innerHTML = `<span class="mono art">${esc(p.art)}</span><h3 style="margin:4px 0 8px">${esc(p.name)}</h3><p>${esc(p.text)}</p>
      <div class="hero-cta" style="margin-top:16px"><button class="btn btn-accent btn-sm" data-add data-name="${esc(p.name)}" data-art="${esc(p.art)}">В список заказа</button><a class="btn btn-sm" href="${SHOP.viber}">Спросить цену</a></div>`;
  }
  $('#hots').addEventListener('click', (e) => { const g = e.target.closest('.hot'); if (g) showPart(g.dataset.id); });
  $('#hots').addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { const g = e.target.closest('.hot'); if (g) { e.preventDefault(); showPart(g.dataset.id); } } });

  // ---------- Size calculator ----------
  function pick(input, data, out, hint) {
    const v = parseInt(input.value, 10);
    if (!v) { out.innerHTML = `<p class="empty">${hint}</p>`; return; }
    const m = data.filter((d) => v >= d.min && v <= d.max);
    out.innerHTML = m.length ? m.map((d) => `<div class="res-row"><div><b>${esc(d.brand)}</b> ${esc(d.name)} <span class="mono">${esc(d.art)}</span><small>для ${d.min}–${d.max} мм · наличие уточняйте</small></div><button class="btn btn-sm" data-add data-name="${esc(d.brand + ' ' + d.name)}" data-art="${esc(d.art)}">+</button></div>`).join('')
      : '<p class="empty">Нестандартный размер – пришлите фото и размеры, подберём вручную.</p>';
  }
  $('#h').addEventListener('input', (e) => pick(e.target, DRIVES, $('#hRes'), 'Введите высоту – подберём засов (привод)'));
  $('#w').addEventListener('input', (e) => pick(e.target, SCISSORS, $('#wRes'), 'Введите ширину – подберём ножницы'));

  // ---------- Catalog ----------
  $('#catalogGrid').innerHTML = CATALOG.map((c) => `<article class="card cat-card">
    <div class="pic">${c.img ? `<img src="assets/img/${c.img}" alt="${esc(c.name)}" loading="lazy">` : '<span class="ph">фото скоро</span>'}</div>
    <h3>${esc(c.name)}</h3><p>${esc(c.text)}</p><span class="stock">● Узнать цену и наличие</span>
    <button class="btn btn-sm" data-add data-name="${esc(c.name)}" data-art="${esc(c.art)}">В список</button></article>`).join('');

  renderList();
})();
