// Демо «Свободные окна»: услуга → время → подтверждение. Ничего никуда не отправляет.
(function () {
  const SERVICES = [
    ["Маникюр с покрытием", 40, 90], ["Педикюр", 50, 90], ["Брови: ламинирование", 25, 60],
    ["Ресницы: ламинирование", 30, 60], ["Чистка лица", 55, 90], ["Массаж", 45, 60], ["Шугаринг", 12, 30]
  ];
  const TIMES = ["10:00", "11:30", "13:00", "15:30", "17:00", "18:30"];
  const DAYS = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];
  const svcBox = document.getElementById("svc");
  const daysBox = document.getElementById("days");
  const conf = document.getElementById("confirm");
  let svc = 0;

  // Детерминированная «занятость», чтобы сетка выглядела живой и не прыгала между перерисовками
  const busy = (d, t) => ((d * 7 + t * 3 + svc * 5) % 5) < 2;

  SERVICES.forEach(([name, price], i) => {
    const b = chip(name + " · " + price + " р.");
    if (i === 0) b.classList.add("on");
    b.onclick = () => {
      svc = i;
      svcBox.querySelectorAll(".chip").forEach((c) => c.classList.remove("on"));
      b.classList.add("on");
      conf.classList.remove("show");
      drawDays();
    };
    svcBox.append(b);
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
      TIMES.forEach((t, ti) => {
        const b = chip(t);
        if (busy(d, ti)) b.disabled = true;
        else b.onclick = () => pick(label, t, b);
        col.append(b);
      });
      daysBox.append(col);
    }
  }

  function pick(day, time, btn) {
    daysBox.querySelectorAll(".chip").forEach((c) => c.classList.remove("on"));
    btn.classList.add("on");
    const [name, price, min] = SERVICES[svc];
    conf.innerHTML =
      "✅ <b>Вы записаны:</b> " + name + ", " + day + " в " + time + " (" + min + " мин, " + price + " р.).<br>" +
      "Накануне в это же время придёт напоминание в Telegram или Viber.<br>" +
      '<small class="muted">В демо запись никуда не уходит. В настоящей версии она сразу падает мастеру в Telegram, а время закрывается для других.</small>';
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
