import { calcPrice, roundUp } from './calc.js';
import { GROUPS, UNITS, preset } from './niches.js';

const FIELDS = ['income', 'current', 'rent', 'transport', 'staff', 'other', 'fees', 'materials', 'days', 'hours', 'duration', 'volume', 'idle'];
const ALL = GROUPS.flatMap((g) => g.items);
const $ = (id) => document.getElementById(id);
const money = (x) => (Math.round(x * 100) / 100).toLocaleString('ru-RU', { maximumFractionDigits: x < 10 ? 2 : 0 }) + ' р.';
const state = { group: 0, niche: null, mode: 'schedule', tax: 10 };

function chip(text, on, data) {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'chip' + (on ? ' on' : ''); b.textContent = text;
  Object.assign(b.dataset, data);
  return b;
}

function drawChips() {
  const q = $('search').value.trim().toLowerCase();
  $('groups').replaceChildren(...GROUPS.map((g, i) => chip(g.name, !q && i === state.group, { g: i })),
    chip('+ Своя услуга', !q && state.group === -1, { g: -1 }));
  const list = q ? ALL.filter((it) => it[0].toLowerCase().includes(q)).slice(0, 14)
    : state.group >= 0 ? GROUPS[state.group].items : [];
  $('niches').replaceChildren(...list.map((it) => chip(it[0], it === state.niche, { n: ALL.indexOf(it) })));
  if (q && !list.length) $('niches').replaceChildren(Object.assign(document.createElement('p'),
    { className: 'muted', textContent: 'Не нашли? Нажмите «+ Своя услуга» и впишите название.' }));
}

function setUnit(unit) {
  if (!UNITS[unit]) unit = 'услуга';
  $('unit').value = unit;
  document.querySelectorAll('.u').forEach((s) => { s.textContent = UNITS[unit][+s.dataset.f]; });
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
  FIELDS.forEach((f) => { if (f !== 'current') $(f).value = p[f]; });
  $('name').value = item ? item[0] : '';
  setUnit(p.unit);
  setMode(p.mode);
  drawChips();
  render();
}

function render() {
  const p = { mode: state.mode, tax: state.tax };
  FIELDS.forEach((f) => { p[f] = Math.max(0, parseFloat($(f).value) || 0); });
  const [acc, gen] = UNITS[$('unit').value];
  $('idleVal').textContent = p.idle + '%';
  const r = calcPrice(p);
  if (!r) {
    $('price').textContent = '–'; $('stickyPrice').textContent = '–';
    $('hour').textContent = 'Проверьте загрузку: объём или график должны быть больше нуля.';
    return;
  }
  const price = roundUp(r.price);
  $('resTitle').textContent = `Минимальная цена за 1 ${acc}`;
  $('price').textContent = money(price);
  $('stickyPrice').textContent = `${money(price)} за ${acc}`;
  $('hour').textContent = r.hourPrice ? `Это ${money(r.hourPrice)} за час работы` : `${$('name').value || 'Ваша услуга'}`;
  $('clients').textContent = Math.round(r.done).toLocaleString('ru-RU');
  $('clientsLabel').textContent = `${gen} в месяц нужно продать`;
  $('week').textContent = Math.round(r.perWeek).toLocaleString('ru-RU');
  $('revenue').textContent = money(r.revenue);
  $('taxSum').textContent = money(r.taxSum);
  $('loss').textContent = p.idle > 0
    ? `Простои и пустые окна (${p.idle}%) стоят вам около ${money(r.idleLoss)} в месяц: это время уже было в графике, но не оплачено.` : '';

  const gap = $('gap');
  gap.classList.toggle('hidden', r.gap === undefined);
  if (r.gap > 0.5) gap.textContent = `Сейчас вы берёте на ${money(r.gap)} меньше. При вашей цене на руках остаётся ${money(r.currentNet)} вместо ${money(p.income)}.`;
  else if (r.gap !== undefined) gap.textContent = 'Ваша цена покрывает расходы и нужный доход.';
}

async function share() {
  const url = location.origin + location.pathname + (state.niche ? '?s=' + encodeURIComponent(state.niche[0]) : '');
  const text = 'Посчитай, сколько на самом деле должна стоить твоя услуга. Бесплатный калькулятор:';
  if (navigator.share) {
    try { await navigator.share({ title: 'Калькулятор цены услуги', text, url }); } catch (e) { /* закрыли окно */ }
    return;
  }
  try { await navigator.clipboard.writeText(`${text} ${url}`); $('copied').classList.remove('hidden'); }
  catch (e) { prompt('Скопируйте ссылку:', url); }
}

$('unit').replaceChildren(...Object.keys(UNITS).map((u) => Object.assign(document.createElement('option'), { value: u, textContent: u })));
$('groups').addEventListener('click', (e) => {
  const g = e.target.dataset.g;
  if (g === undefined) return;
  $('search').value = '';
  state.group = +g;
  if (state.group === -1) { state.niche = null; $('name').value = ''; $('name').focus(); }
  drawChips();
});
$('niches').addEventListener('click', (e) => { if (e.target.dataset.n) pick(ALL[+e.target.dataset.n]); });
$('search').addEventListener('input', drawChips);
$('name').addEventListener('input', () => { if (state.niche && $('name').value !== state.niche[0]) { state.niche = null; drawChips(); } });
$('unit').addEventListener('change', () => { setUnit($('unit').value); render(); });
$('modes').addEventListener('click', (e) => { if (e.target.dataset.mode) { setMode(e.target.dataset.mode); render(); } });
$('taxes').addEventListener('click', (e) => {
  if (e.target.dataset.tax === undefined) return;
  state.tax = +e.target.dataset.tax;
  document.querySelectorAll('#taxes .chip').forEach((c) => c.classList.toggle('on', c === e.target));
  render();
});
$('form').addEventListener('input', render);
$('share').addEventListener('click', share);
// Плашка с ценой прячется, когда результат на экране или уже пролистан
new IntersectionObserver(([e]) => $('sticky').classList.toggle('off', e.isIntersecting || e.boundingClientRect.top < 0)).observe($('result'));

const wanted = new URLSearchParams(location.search).get('s');
const start = ALL.find((it) => it[0] === wanted) || ALL[0];
state.group = GROUPS.findIndex((g) => g.items.includes(start));
document.querySelector('#taxes .chip').classList.add('on');
pick(start);
