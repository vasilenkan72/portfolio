// Подсчёт теста: балл 0–100 и до трёх советов – сначала по ответам «0 баллов», потом по «1»
const POINTS = [2, 1, 0];

export function scoreQuiz(list, questions, levels) {
  const score = Math.round((list.reduce((s, a) => s + POINTS[a], 0) / (questions.length * 2)) * 100);
  const weak = list.map((a, i) => ({ i, p: POINTS[a] })).filter((x) => x.p < 2).sort((x, y) => x.p - y.p || x.i - y.i);
  return { score, level: levels.find((l) => score >= l.min), tips: weak.slice(0, 3).map((x) => questions[x.i].tip) };
}
