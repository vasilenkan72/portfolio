// Бот-консьерж по сценарию: без ИИ и без сервера, сценарий задаётся в window.BOT на странице.
// Узел сценария: { text: строка или функция(state), options: [{ label, set, next }], file: { label, next } }
(function () {
  const cfg = window.BOT;
  const state = {};
  let started = false;

  const fab = el("button", "bot-fab", "💬");
  fab.setAttribute("aria-label", "Открыть чат");
  const box = el("div", "bot");
  box.innerHTML =
    '<div class="bot-head"><div><b></b><small></small></div>' +
    '<button class="bot-close" aria-label="Закрыть">×</button></div>' +
    '<div class="bot-log"></div><div class="bot-opts"></div>';
  box.querySelector("b").textContent = cfg.title;
  box.querySelector("small").textContent = cfg.subtitle;
  const log = box.querySelector(".bot-log");
  const opts = box.querySelector(".bot-opts");
  document.body.append(fab, box);

  fab.onclick = () => toggle();
  box.querySelector(".bot-close").onclick = () => toggle(false);
  // Любая кнопка с data-bot на странице открывает чат, data-bot="узел" сразу ведёт в нужную ветку
  document.querySelectorAll("[data-bot]").forEach((b) =>
    b.addEventListener("click", (e) => {
      e.preventDefault();
      toggle(true, b.dataset.bot || null);
    })
  );

  function toggle(open = !box.classList.contains("open"), node = null) {
    box.classList.toggle("open", open);
    if (!open) return;
    if (!started) { started = true; say(cfg.greet); }
    if (node) { show(node); } else if (!opts.children.length) { show(cfg.start); }
  }

  function show(id) {
    const node = cfg.nodes[id];
    opts.innerHTML = "";
    setTimeout(() => {
      say(typeof node.text === "function" ? node.text(state) : node.text);
      (node.options || []).forEach((o) => {
        const b = el("button", "", o.label);
        b.onclick = () => {
          Object.assign(state, o.set || {});
          say(o.label, "out");
          show(o.next || cfg.start);
        };
        opts.append(b);
      });
      if (node.file) {
        // Демо загрузки фото: файл никуда не отправляется, показываем только имя
        const lab = el("label", "", node.file.label);
        const inp = document.createElement("input");
        inp.type = "file";
        inp.accept = "image/*";
        inp.onchange = () => {
          if (!inp.files[0]) return;
          state.photo = inp.files[0].name;
          say("📎 " + state.photo, "out");
          show(node.file.next);
        };
        lab.append(inp);
        opts.append(lab);
      }
    }, 350);
  }

  function say(text, side = "in") {
    log.append(el("div", "msg " + side, text));
    log.scrollTop = log.scrollHeight;
  }

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }
})();
