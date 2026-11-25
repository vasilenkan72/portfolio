// Демо «Сколько стоит занятие»: предмет → цель → формат → длительность → ориентир цены. Ничего никуда не отправляет.
(function () {
  // Базовая цена за 60 минут, BYN (ориентир по объявлениям репетиторов Гродно, ноябрь 2026)
  const SUBJECTS = [["Английский", 28], ["Математика", 25], ["Физика", 28], ["Русский язык", 24], ["Начальные классы", 20], ["Подготовка к школе", 22]];
  const GOALS = [["Школьная программа", 1], ["Подтянуть оценки", 1], ["ЦЭ / ЦТ", 1.3], ["Разговорный (взрослые)", 1.1]];
  const FORMATS = [["Онлайн", -2], ["В кабинете", 0], ["С выездом к ученику", 6]];
  const LENGTHS = [["45 минут", 0.8], ["60 минут", 1], ["90 минут", 1.45]];
  const state = { s: 0, g: 0, f: 1, l: 1 };
  const out = document.getElementById("calc-out");

  group("calc-subj", SUBJECTS, "s");
  group("calc-goal", GOALS, "g");
  group("calc-form", FORMATS, "f");
  group("calc-len", LENGTHS, "l");
  draw();

  function group(id, list, key) {
    const box = document.getElementById(id);
    list.forEach(([name], i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip" + (state[key] === i ? " on" : "");
      b.textContent = name;
      b.onclick = () => {
        state[key] = i;
        box.querySelectorAll(".chip").forEach((c) => c.classList.remove("on"));
        b.classList.add("on");
        draw();
      };
      box.append(b);
    });
  }

  function draw() {
    const base = SUBJECTS[state.s][1] * GOALS[state.g][1] + FORMATS[state.f][1];
    const price = base * LENGTHS[state.l][1];
    const lo = Math.round(price * 0.9), hi = Math.round(price * 1.1);
    out.innerHTML =
      '<div class="calc-sum">' + lo + "–" + hi + ' р.</div><div class="muted">за занятие, ' + LENGTHS[state.l][0] +
      ". Точную цену назовёт преподаватель после пробного.</div>" +
      '<div class="trial">🎁 Первое занятие 30 минут – бесплатно</div>' +
      '<a href="#okna" class="btn">Записаться на пробное</a>';
  }
})();
