// Квиз «ИИ-сканер бизнеса»: вопрос 1 выбирает ветку, дальше 5 вопросов ветки.
// В бота уходит только итог: k_<ветка 1–4>_<лидер a–d> и kz_<ветка> (кнопка «Хочу такой квиз»).
import { WHO, BRANCHES } from './branches.js';
import { CARDS, OFFER, HEALTH_NOTE } from './cards.js';
import { scoreKviz } from './score.js';

const BOT = 'https://t.me/natallia_assistant_bot?start=';
const TOTAL = 6;
const $ = (id) => document.getElementById(id);
let branch = null;
let answers = [];

function show(id) {
  ['intro', 'quiz', 'result'].forEach((s) => $(s).classList.toggle('hidden', s !== id));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function el(tag, props = {}, ...kids) {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...kids);
  return node;
}

function render(step, question, options, onPick) {
  $('step').textContent = `Вопрос ${step} из ${TOTAL}`;
  $('bar').style.width = `${((step - 1) / TOTAL) * 100}%`;
  $('question').textContent = question;
  $('answers').replaceChildren(...options.map((text, i) => {
    const b = el('button', { type: 'button', className: 'answer' }, el('b', { textContent: 'ABCD'[i] }), text);
    b.addEventListener('click', () => onPick(i));
    return b;
  }));
  $('back').classList.toggle('hidden', step === 1);
}

function ask() {
  if (branch === null) {
    render(1, WHO, BRANCHES.map((b) => b.who), (i) => { branch = i; ask(); });
    return;
  }
  const qs = BRANCHES[branch].questions;
  if (answers.length === qs.length) { finish(); return; }
  const [q, a] = qs[answers.length];
  render(answers.length + 2, q, a, (i) => { answers.push(i); ask(); });
}

function finish() {
  const { roles } = BRANCHES[branch];
  const { pct, leader, order } = scoreKviz(answers, roles.length);
  const card = CARDS[branch][leader];
  const name = (i) => `${roles[i][0]} ${roles[i][1]}`;

  $('bars').replaceChildren(...order.flatMap((i) => [
    el('div', { className: `bar-row${i === leader ? ' lead' : ''}` }, el('span', { textContent: name(i) }), el('span', { textContent: `${pct[i]}%` })),
    el('div', { className: 'bar' }, el('i', { style: `width:${pct[i]}%` })),
  ]));
  $('leadName').textContent = name(leader);
  $('leadWhy').textContent = card.why;
  $('leadDoes').replaceChildren(...card.does.map((t) => el('li', { textContent: t })));
  $('leadPrice').textContent = card.price;
  $('health').textContent = HEALTH_NOTE;
  $('health').classList.toggle('hidden', branch !== 3);
  $('others').replaceChildren(...order.filter((i) => i !== leader).map((i) =>
    el('p', {}, el('b', { textContent: `${name(i)} · ${pct[i]}%` }), el('br'), CARDS[branch][i].why)));
  $('offerText').textContent = OFFER[branch];
  $('cta').href = `${BOT}k_${branch + 1}_${'abcd'[leader]}`;
  $('kz').href = `${BOT}kz_${branch + 1}`;
  $('bar').style.width = '100%';
  show('result');
}

$('go').addEventListener('click', () => { show('quiz'); ask(); });
$('back').addEventListener('click', () => {
  if (answers.length) answers.pop(); else branch = null;
  ask();
});
$('again').addEventListener('click', () => { branch = null; answers = []; show('intro'); });
$('share').addEventListener('click', async () => {
  const url = location.href.split('#')[0].split('?')[0];
  try {
    if (navigator.share) { await navigator.share({ title: 'ИИ-сканер бизнеса', url }); return; }
    await navigator.clipboard.writeText(url);
    $('copied').classList.remove('hidden');
  } catch { /* человек закрыл окно «поделиться» – ничего не делаем */ }
});
