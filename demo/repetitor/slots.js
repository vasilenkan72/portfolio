// Демо «Запись на пробное»: преподаватель → время → подтверждение. Ничего никуда не отправляет.
(function () {
  const TEACHERS = [["Ирина – английский", "английский"], ["Андрей – математика, физика", "математика"], ["Ольга – русский, начальные классы", "русский язык"]];
  const TIMES = ["14:30", "15:30", "16:30", "17:30", "18:30", "19:30"];
  const DAYS = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];
  const tBox = document.getElementById("teach");
  const daysBox = document.getElementById("days");
  const conf = document.getElementById("confirm");
  let t = 0;

  // Детерминированная «занятость», чтобы сетка выглядела живой и не прыгала между перерисовками
  const busy = (d, ti) => ((d * 5 + ti * 3 + t * 7) % 5) < 2;

  TEACHERS.forEach(([name], i) => {
    const b = chip(name);
    if (i === 0) b.classList.add("on");
    b.onclick = () => {
      t = i;
      tBox.querySelectorAll(".chip").forEach((c) => c.classList.remove("on"));
      b.classList.add("on");
      conf.classList.remove("show");
      drawDays();
    };
    tBox.append(b);
  });

  function drawDays() {
    daysBox.innerHTML = "";
    const start = new Date();
    for (let d = 1; d <= 5; d++) {
      const date = new Date(start.getTime() + d * 864e5);
      const label = DAYS[(date.getDay() + 6) % 7] + ", " + date.getDate() + "." + String(date.getMonth() + 1).padStart(2, "0");
      const col = document.createElement("div");
      col.className = "day";
      col.innerHTML = "<h4></h4>";
      col.querySelector("h4").textContent = label;
      TIMES.forEach((time, ti) => {
        const b = chip(time);
        if (busy(d, ti)) b.disabled = true;
        else b.onclick = () => pick(label, time, b);
        col.append(b);
      });
      daysBox.append(col);
    }
  }

  function pick(day, time, btn) {
    daysBox.querySelectorAll(".chip").forEach((c) => c.classList.remove("on"));
    btn.classList.add("on");
    conf.innerHTML =
      "✅ <b>Пробное занятие:</b> " + TEACHERS[t][1] + ", " + day + " в " + time + ", 30 минут, бесплатно.<br>" +
      "Накануне придёт напоминание в Telegram или Viber, а для онлайна – ссылка на занятие.<br>" +
      '<small class="muted">В демо запись никуда не уходит. В настоящей версии она сразу приходит преподавателю в Telegram, а время закрывается для других.</small>';
    conf.classList.add("show");
  }

  function chip(text) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = text;
    return b;
  }

  drawDays();
})();
