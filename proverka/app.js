import { QUESTIONS, LEVELS } from './questions.js';

const $ = (id) => document.getElementById(id);
const POINTS = [2, 1, 0];
let answers = [];

// Балл 0–100 и до трёх советов: сначала по ответам «0», потом по «1»
export function scoreQuiz(list) {
  const score = Math.round((list.reduce((s, a) => s + POINTS[a], 0) / (QUESTIONS.length * 2)) * 100);
  const weak = list.map((a, i) => ({ i, p: POINTS[a] })).filter((x) => x.p < 2).sort((x, y) => x.p - y.p || x.i - y.i);
  return { score, level: LEVELS.find((l) => score >= l.min), tips: weak.slice(0, 3).map((x) => QUESTIONS[x.i].tip) };
}

function show(id) {
  ['intro', 'quiz', 'result'].forEach((s) => $(s).classList.toggle('hidden', s !== id));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function ask() {
  const n = answers.length;
  if (n === QUESTIONS.length) return finish();
  const item = QUESTIONS[n];
  $('step').textContent = `Вопрос ${n + 1} из ${QUESTIONS.length}`;
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
  const r = scoreQuiz(answers);
  $('score').textContent = r.score;
  $('level').textContent = r.level.title;
  $('levelText').textContent = r.level.text;
  const n = r.tips.length;
  $('tipsTitle').textContent = n === 0 ? 'Всё на месте' : n === 1 ? 'Ваш главный шаг' : `Ваши ${n} шага`;
  $('tips').replaceChildren(...(r.tips.length ? r.tips : ['Вы закрыли все базовые пункты. Следующий шаг – ИИ-агент, который отвечает клиентам и ведёт запись сам.'])
    .map((t) => Object.assign(document.createElement('li'), { textContent: t })));
  show('result');
}

async function share() {
  const url = location.origin + location.pathname;
  const text = 'Проверь за 2 минуты, находят ли тебя клиенты онлайн. У меня получилось ' + $('score').textContent + ' из 100:';
  if (navigator.share) {
    try { await navigator.share({ title: 'Тест: находят ли вас клиенты онлайн', text, url }); } catch (e) { /* закрыли окно */ }
    return;
  }
  try { await navigator.clipboard.writeText(`${text} ${url}`); $('copied').classList.remove('hidden'); }
  catch (e) { prompt('Скопируйте ссылку:', url); }
}

if (typeof document !== 'undefined' && $('go')) {
  $('go').addEventListener('click', () => { answers = []; show('quiz'); ask(); });
  $('back').addEventListener('click', () => { answers.pop(); ask(); });
  $('again').addEventListener('click', () => { answers = []; show('quiz'); ask(); });
  $('share').addEventListener('click', share);
}
