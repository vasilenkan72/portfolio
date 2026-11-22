// Подсчёт: доля каждой роли среди ответов, сумма ровно 100% (метод наибольшего остатка).
// Лидер – роль с наибольшим числом ответов; при ничьей побеждает ответ на последний вопрос.

export function scoreKviz(answers, roleCount = 4) {
  const counts = Array(roleCount).fill(0);
  answers.forEach((a) => { counts[a] += 1; });
  const total = answers.length || 1;
  const raw = counts.map((c) => (c / total) * 100);
  const pct = raw.map(Math.floor);
  let rest = 100 - pct.reduce((s, p) => s + p, 0);
  raw.map((r, i) => ({ i, frac: r - Math.floor(r) }))
    .sort((x, y) => y.frac - x.frac || counts[y.i] - counts[x.i])
    .forEach(({ i }) => { if (rest > 0) { pct[i] += 1; rest -= 1; } });

  const max = Math.max(...counts);
  const tied = counts.map((c, i) => (c === max ? i : -1)).filter((i) => i >= 0);
  const last = answers[answers.length - 1];
  const leader = tied.includes(last) ? last : tied[0];
  const order = counts.map((_, i) => i).sort((x, y) => (x === leader ? -1 : y === leader ? 1 : pct[y] - pct[x]));
  return { pct, leader, order };
}
