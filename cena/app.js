import { calcPrice } from './calc.js';
import { GROUPS, UNITS, preset } from './niches.js';
import { CURRENCIES, DEFAULT_CURRENCY, scale, nice, roundUp, formatMoney, formatNum } from './money.js';
import { detectLang, applyTexts, renderSwitcher, share } from '../assets/js/i18n.js';

const lang = detectLang();
const L = await import(`./lang/${lang}.js?v=6`);
const T = L.ui;
const MONEY = ['income', 'current', 'rent', 'transport', 'staff', 'other', 'fees', 'materials'];
const FIELDS = [...MONEY, 'days', 'hours', 'duration', 'volume', 'idle'];
const ALL = GROUPS.flatMap((g) => g.items);
const params = new URLSearchParams(location.search);
const $ = (id) => document.getElementById(id);
const state = { group: 0, niche: null, mode: 'schedule', tax: 10, custom: false,
  cur: CURRENCIES[params.get('cur')] ? params.get('cur') : DEFAULT_CURRENCY[lang] };

const nicheName = (it) => (L.niches ? L.niches[ALL.indexOf(it)] : it[0]);
const groupName = (i) => (L.groups ? L.groups[i] : GROUPS[i].name);
const forms = (u) => (L.units ? L.units[u] : UNITS[u]);            // [«на 1 …», «сколько …»]
const unitLabel = (u) => (L.units ? L.units[u][0] : u);
const money = (x) => formatMoney(x, state.cur, lang);
const contactOnly = () => !(lang === 'ru' && state.cur === 'BYN');  // цены пакетов – только для РБ

function chip(text, on, data) {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'chip' + (on ? ' on' : ''); b.textContent = text;
  Object.assign(b.dataset, data);
  return b;
}

function drawChips() {
  const q = $('search').value.trim().toLowerCase();
  $('groups').replaceChildren(...GROUPS.map((g, i) => chip(groupName(i), !q && i === state.group, { g: i })),
    chip(T.custom, !q && state.group === -1, { g: -1 }));
  const list = q ? ALL.filter((it) => nicheName(it).toLowerCase().includes(q) || it[0].toLowerCase().includes(q)).slice(0, 14)
    : state.group >= 0 ? GROUPS[state.group].items : [];
  $('niches').replaceChildren(...list.map((it) => chip(nicheName(it), it === state.niche, { n: ALL.indexOf(it) })));
  if (q && !list.length) $('niches').replaceChildren(Object.assign(document.createElement('p'), { className: 'muted', textContent: T.notFound }));
}

function drawCurrency() {
  $('currencies').replaceChildren(...Object.keys(CURRENCIES).map((c) => chip(c, c === state.cur, { cur: c })));
  document.querySelectorAll('.suffix:not(#taxCustomBox)').forEach((s) => { s.dataset.s = CURRENCIES[state.cur].sym; });
  const taxes = CURRENCIES[state.cur].taxes;
  if (!state.custom && !taxes.some(([, v]) => v === state.tax)) state.tax = taxes[0][1];
  $('taxes').replaceChildren(...taxes.map(([key, v]) => chip(T[key], !state.custom && v === state.tax, { tax: v })),
    chip(T.taxCustom, state.custom, { tax: 'custom' }));
  $('taxCustomBox').classList.toggle('hidden', !state.custom);
  drawOffer();
}

function drawOffer() {
  const contact = contactOnly();
  $('offerLead').textContent = contact ? T.offerContact : T.offerPrices;
  $('prices').classList.toggle('hidden', contact);
  if (!contact) $('prices').replaceChildren(...[[T.price1, 150], [T.price2, 450], [T.price3, 850]].map(([t, n]) => {
    const li = document.createElement('li');
    li.append(Object.assign(document.createElement('span'), { textContent: t }), Object.assign(document.createElement('b'), { textContent: T.from(n) }));
    return li;
  }));
  const tg = lang === 'ru' ? 'https://t.me/natallia_assistant_bot?start=price' : 'https://t.me/NatalliaVas';
  $('offerCta').textContent = contact ? T.offerWrite : T.offerCta;
  $('offerCta').href = tg; $('lossCta').href = tg;
}

function setUnit(unit) {
  if (!UNITS[unit]) unit = 'услуга';
  $('unit').value = unit;
  const [acc, gen] = forms(unit);
  $('materialsLbl').textContent = T.materials(acc);
  $('durationLbl').textContent = T.duration(acc);
  $('volumeLbl').textContent = T.volume(gen);
}

function setMode(mode) {
  state.mode = mode;
  document.querySelectorAll('#modes button').forEach((b) => b.classList.toggle('on', b.dataset.mode === mode));
  $('schedule').classList.toggle('hidden', mode !== 'schedule');
  $('volumeBox').classList.toggle('hidden', mode !== 'volume');
}

function pick(item) {
  state.niche = item;
  const p = preset(item);
  FIELDS.forEach((f) => { if (f !== 'current') $(f).value = MONEY.includes(f) ? scale(p[f], state.cur) : p[f]; });
  $('name').value = item ? nicheName(item) : '';
  setUnit(p.unit); setMode(p.mode); drawChips(); render();
}

function render() {
  const p = { mode: state.mode, tax: state.custom ? Math.min(99, parseFloat($('taxCustom').value) || 0) : state.tax };
  FIELDS.forEach((f) => { p[f] = Math.max(0, parseFloat($(f).value) || 0); });
  const [acc, gen] = forms($('unit').value);
  $('idleVal').textContent = p.idle + '%';
  const r = calcPrice(p);
  if (!r) { $('price').textContent = '–'; $('stickyPrice').textContent = '–'; $('hour').textContent = T.checkLoad; return; }
  const price = roundUp(r.price);
  const loss = (r.slots - r.done) * price;                 // от той же округлённой цены, что видит человек
  $('resTitle').textContent = T.resTitle(acc);
  $('price').textContent = money(price);
  $('stickyPrice').textContent = T.stickyFor(money(price), acc);
  $('hour').textContent = r.hourPrice ? T.perHour(money(r.hourPrice)) : ($('name').value || T.yourService);
  $('clients').textContent = formatNum(r.done, lang);
  $('clientsLabel').textContent = T.sold(gen);
  $('week').textContent = formatNum(r.perWeek, lang);
  $('revenue').textContent = money(r.revenue);
  $('taxSum').textContent = money(r.taxSum);
  if (lang === 'ru') {   // бот получает нишу и итог: p_<номер ниши или x>_<потери в месяц>_<валюта>
    const link = `https://t.me/natallia_assistant_bot?start=p_${state.niche ? ALL.indexOf(state.niche) : 'x'}_${Math.round(loss)}_${state.cur}`;
    $('lossCta').href = link; $('offerCta').href = link;
  }
  $('lossBox').classList.toggle('hidden', !(p.idle > 0));
  $('lossSum').textContent = money(loss);
  $('lossYear').textContent = T.lossYear(money(loss * 12));
  $('lossText').textContent = T.lossText(formatNum(r.slots, lang), formatNum(r.slots - r.done, lang), gen, money(price));
  const gap = $('gap');
  gap.classList.toggle('hidden', r.gap === undefined);
  gap.classList.toggle('ok', !(r.gap > 0.5));
  if (r.gap > 0.5) gap.textContent = T.gapLess(money(r.gap), money(r.currentNet), money(p.income));
  else if (r.gap !== undefined) gap.textContent = T.gapOk;
}

function setCurrency(cur) {
  const ratio = CURRENCIES[cur].k / CURRENCIES[state.cur].k;   // свои цифры человека пересчитываем, а не сбрасываем
  MONEY.forEach((f) => { if ($(f).value !== '') $(f).value = nice(parseFloat($(f).value) * ratio); });
  state.cur = cur;
  drawCurrency(); render();
}

applyTexts(T);
renderSwitcher($('langs'), lang);
$('navTest').href = `../proverka/?lang=${lang}`; $('offerTest').href = `../proverka/?lang=${lang}`;
$('unit').replaceChildren(...Object.keys(UNITS).map((u) => Object.assign(document.createElement('option'), { value: u, textContent: unitLabel(u) })));
$('groups').addEventListener('click', (e) => {
  const g = e.target.dataset.g;
  if (g === undefined) return;
  $('search').value = ''; state.group = +g;
  if (state.group === -1) { state.niche = null; $('name').value = ''; $('name').focus(); }
  drawChips();
});
$('niches').addEventListener('click', (e) => { if (e.target.dataset.n) pick(ALL[+e.target.dataset.n]); });
$('search').addEventListener('input', drawChips);
$('name').addEventListener('input', () => { if (state.niche && $('name').value !== nicheName(state.niche)) { state.niche = null; drawChips(); } });
$('unit').addEventListener('change', () => { setUnit($('unit').value); render(); });
$('modes').addEventListener('click', (e) => { if (e.target.dataset.mode) { setMode(e.target.dataset.mode); render(); } });
$('currencies').addEventListener('click', (e) => { if (e.target.dataset.cur && e.target.dataset.cur !== state.cur) setCurrency(e.target.dataset.cur); });
$('taxes').addEventListener('click', (e) => {
  const t = e.target.dataset.tax;
  if (t === undefined) return;
  state.custom = t === 'custom';
  if (!state.custom) state.tax = +t;
  drawCurrency(); render();
  if (state.custom) $('taxCustom').focus();
});
$('form').addEventListener('input', render);
$('share').addEventListener('click', () => {
  const url = new URL(location.origin + location.pathname);
  url.searchParams.set('lang', lang);
  if (state.niche) url.searchParams.set('s', state.niche[0]);
  share({ title: T.shareTitle, text: T.shareText, url: url.href, copiedEl: $('copied'), promptLabel: T.promptLabel });
});
// Плашка с ценой прячется, когда результат на экране или уже пролистан
new IntersectionObserver(([e]) => $('sticky').classList.toggle('off', e.isIntersecting || e.boundingClientRect.top < 0)).observe($('result'));

const start = ALL.find((it) => it[0] === params.get('s')) || ALL[0];
state.group = GROUPS.findIndex((g) => g.items.includes(start));
drawCurrency();
pick(start);
