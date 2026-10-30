import { scoreQuiz } from './score.js';
import { detectLang, applyTexts, renderSwitcher, share } from '../assets/js/i18n.js';

const lang = detectLang();
const { ui: T, QUESTIONS, LEVELS } = await import(`./lang/${lang}.js?v=5`);
const $ = (id) => document.getElementById(id);
let answers = [];

function show(id) {
  ['intro', 'quiz', 'result'].forEach((s) => $(s).classList.toggle('hidden', s !== id));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function ask() {
  const n = answers.length;
  if (n === QUESTIONS.length) return finish();
  const item = QUESTIONS[n];
  $('step').textContent = T.step(n + 1, QUESTIONS.length);
  $('bar').style.width = `${(n / QUESTIONS.length) * 100}%`;
  $('question').textContent = item.q;
  $('answers').replaceChildren(...item.a.map((text, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'answer'; b.textContent = text;
    b.addEventListener('click', () => { answers.push(i); ask(); });
    return b;
  }));
  $('back').classList.toggle('hidden', n === 0);
}

function finish() {
  const r = scoreQuiz(answers, QUESTIONS, LEVELS);
  $('score').textContent = r.score;
  $('level').textContent = r.level.title;
  $('levelText').textContent = r.level.text;
  $('tipsTitle').textContent = T.tips(r.tips.length);
  $('tips').replaceChildren(...(r.tips.length ? r.tips : [T.allDone])
    .map((t) => Object.assign(document.createElement('li'), { textContent: t })));
  show('result');
}

function drawOffer() {
  $('offerLead').textContent = T.offerPrices;
  $('offerLead').classList.toggle('hidden', !T.offerPrices);
  $('prices').classList.toggle('hidden', !T.prices.length);
  $('prices').replaceChildren(...T.prices.map(([t, p]) => {
    const li = document.createElement('li');
    li.append(Object.assign(document.createElement('span'), { textContent: t }), Object.assign(document.createElement('b'), { textContent: p }));
    return li;
  }));
  // русскоязычных ведём в бота-ассистента, остальных – сразу в личку Натальи
  $('cta').href = lang === 'ru' ? 'https://t.me/natallia_assistant_bot?start=quiz' : 'https://t.me/natallia_vasilenka';
}

applyTexts(T);
renderSwitcher($('langs'), lang);
$('navCalc').href = `../cena/?lang=${lang}`;
drawOffer();
$('go').addEventListener('click', () => { answers = []; show('quiz'); ask(); });
$('back').addEventListener('click', () => { answers.pop(); ask(); });
$('again').addEventListener('click', () => { answers = []; show('quiz'); ask(); });
$('share').addEventListener('click', () => {
  const url = `${location.origin}${location.pathname}?lang=${lang}`;
  share({ title: T.shareTitle, text: T.shareText($('score').textContent), url, copiedEl: $('copied'), promptLabel: T.promptLabel });
});
