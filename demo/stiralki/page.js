// Демо-визитка мастера: список поломок -> форма заявки -> превью сообщения мастеру. Без сервера.
(function () {
  const FAULTS = [
    ["Не включается", "от 35 р."],
    ["Не сливает воду", "от 40 р."],
    ["Не отжимает", "от 40 р."],
    ["Не греет воду", "от 50 р."],
    ["Шумит, стучит при отжиме", "от 70 р."],
    ["Протекает", "от 40 р."],
    ["Ошибка на дисплее", "от 35 р."],
    ["Другое", "после диагностики"],
  ];
  const $ = (id) => document.getElementById(id);
  const grid = $("faults");
  const select = $("fault");

  FAULTS.forEach(([name, price], i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "fault";
    b.innerHTML = "<b></b><span></span>";
    b.querySelector("b").textContent = name;
    b.querySelector("span").textContent = price;
    b.onclick = () => {
      select.value = i;
      sync();
      $("zayavka").scrollIntoView({ behavior: "smooth" });
      $("brand").focus({ preventScroll: true });
    };
    grid.append(b);
    select.add(new Option(name, i));
  });

  function sync() {
    const [name, price] = FAULTS[select.value];
    grid.querySelectorAll(".fault").forEach((b, i) => b.classList.toggle("on", i == select.value));
    $("pFault").textContent = name.toLowerCase();
    $("pPrice").textContent = price;
    if ($("brand").value) $("pBrand").textContent = $("brand").value;
    if ($("phone").value) $("pPhone").textContent = $("phone").value;
  }
  select.onchange = sync;
  $("brand").oninput = sync;
  $("phone").oninput = sync;
  select.value = 1;
  sync();

  function toast(text) {
    const t = $("toast");
    t.textContent = text;
    t.style.display = "block";
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => (t.style.display = "none"), 3500);
  }

  $("form").onsubmit = (e) => {
    e.preventDefault();
    const d = new Date();
    $("pTime").textContent = d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0");
    sync();
    toast("Готово! В рабочей версии заявка сразу придёт мастеру – смотрите превью справа.");
  };

  document.querySelectorAll("[data-demo]").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      toast(a.dataset.demo === "call"
        ? "В рабочей версии кнопка сразу звонит на ваш номер."
        : "В рабочей версии откроется ваш чат в Viber.");
    })
  );
})();
