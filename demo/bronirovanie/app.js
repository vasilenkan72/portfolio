// Логика шаблона: каталог, расчёт цены, проверка занятости, бронь, календарь хозяина.
// Все данные берутся из window.SITE (config.js) и window.T (i18n.js).
(function () {
  "use strict";
  const S = window.SITE;
  const state = { lang: "ru", unit: S.units[0].id };
  const $ = (id) => document.getElementById(id);

  const t = (k) => T[state.lang][k] ?? T.ru[k] ?? k;
  const L = (obj) => obj[state.lang] || obj.ru;
  const money = (n) => Math.round(n).toLocaleString("ru-RU") + " " + S.currency;
  const unit = () => S.units.find((u) => u.id === state.unit) || S.units[0];

  // Даты храним как строки YYYY-MM-DD в местном времени
  const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const iso = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const dayIndex = (d) => Math.round((d - today()) / 86400000);

  function isHigh(d) {
    const p = S.pricing, md = (d.getMonth() + 1) * 100 + d.getDate();
    const [from, to] = p.highDates.map((s) => +s.replace("-", ""));
    return p.highMonths.includes(d.getMonth() + 1) || md >= from || md <= to;
  }

  function quote() {
    const u = unit(), p = S.pricing;
    const a = parse($("cIn").value), b = parse($("cOut").value);
    const nights = Math.round((b - a) / 86400000);
    if (!(nights > 0)) return { error: t("bad_dates") };
    let rent = 0, weekend = 0, high = false;
    for (let i = 0; i < nights; i++) {
      const d = addDays(a, i);
      let price = u.price;
      if (isHigh(d)) { price *= p.high; high = true; }
      const wd = d.getDay();
      if (wd === 5 || wd === 6) { weekend += price * (p.weekend - 1); price *= p.weekend; }
      rent += price;
    }
    const start = dayIndex(a);
    const busy = u.busy.some(([s, len]) => start < s + len && s < start + nights);
    const guests = +$("cGuests").value;
    const discount = nights >= p.longStay.nights ? rent * p.longStay.discount : 0;
    const extras = S.extras.filter((e) => $("x_" + e.id)?.checked).map((e) => {
      const k = e.per === "night" ? nights : e.per === "guestNight" ? nights * guests : 1;
      return { name: L(e.name), sum: e.price * k };
    });
    const total = rent - discount + extras.reduce((s, e) => s + e.sum, 0);
    return { nights, rent, weekend, discount, extras, total, high, busy, small: guests > u.guests };
  }

  function renderUnits() {
    const g = +$("sGuests").value;
    $("units").innerHTML = S.units.map((u) => `
      <article class="unit${u.id === state.unit ? " active" : ""}">
        <div class="unit-art" style="--art:${u.art}">${u.tag ? `<span class="tag">${t(u.tag)}</span>` : ""}<span>${u.icon}</span></div>
        <div class="unit-body">
          <h3>${L(u.name)}</h3>
          <p>${L(u.about)}</p>
          <p class="specs">${t("up_to")} ${u.guests} ${t("guests_w")}${g > u.guests ? ` · <b>${t("too_small")}</b>` : ""}</p>
          <div class="unit-foot"><div class="from"><b>${u.price}</b><span>${t("per_night")}</span></div>
          <button class="pick" data-pick="${u.id}">${t("pick")}</button></div>
        </div>
      </article>`).join("");
    $("sUnit").innerHTML = S.units.map((u) => `<option value="${u.id}"${u.id === state.unit ? " selected" : ""}>${L(u.name)}</option>`).join("");
  }

  function renderExtras() {
    const was = {};
    S.extras.forEach((e) => { was[e.id] = $("x_" + e.id)?.checked; });
    const per = { stay: "per_stay", night: "per_night_x", guestNight: "per_gn" };
    $("extras").innerHTML = S.extras.map((e) => `
      <label class="extra"><span><input type="checkbox" id="x_${e.id}"${was[e.id] ? " checked" : ""}> ${L(e.name)}</span>
      <small>${e.price} ${S.currency} ${t(per[e.per])}</small></label>`).join("");
  }

  function renderBill() {
    const u = unit(), q = quote();
    $("cIcon").textContent = u.icon;
    $("cIcon").style.setProperty("--art", u.art);
    $("cName").textContent = L(u.name);
    $("cAbout").textContent = `${t("up_to")} ${u.guests} ${t("guests_w")} · ${L(u.about)}`;
    const warn = q.error || (q.busy && t("busy")) || (q.small && t("too_small"));
    $("warn").textContent = warn || "";
    $("warn").hidden = !warn;
    $("book").disabled = !!warn;
    if (q.error) { $("bill").innerHTML = ""; $("total").textContent = "–"; $("prepay").textContent = ""; return; }
    $("season").textContent = t(q.high ? "season_high" : "season_low");
    const rows = [[`${t("b_rent")} · ${q.nights} ${t("nights")}`, q.rent]];
    if (q.weekend) rows.push([t("b_weekend"), q.weekend, "sub"]);
    if (q.discount) rows.push([t("b_discount"), -q.discount]);
    q.extras.forEach((e) => rows.push([e.name, e.sum]));
    $("bill").innerHTML = rows.map(([l, v, cls]) =>
      `<div class="row ${cls || ""}"><span>${l}</span><b>${v < 0 ? "−" : ""}${money(Math.abs(v))}</b></div>`).join("");
    $("total").textContent = money(q.total);
    $("prepay").textContent = t("prepay_note").replace("{sum}", money(q.total * S.pricing.prepay));
  }

  function renderOwner() {
    const days = 14, types = ["paid", "pre"];
    const head = Array.from({ length: days }, (_, i) => `<span>${addDays(today(), i).getDate()}</span>`).join("");
    $("gantt").innerHTML = `<div class="g-label"></div><div class="g-days">${head}</div>` + S.units.map((u) => {
      const blocks = u.busy.flatMap(([s, len], i) => {
        const b = [`<i class="${types[i % 2]}" style="left:${s / days * 100}%;width:${len / days * 100}%"></i>`];
        if (s + len < days) b.push(`<i class="clean" style="left:${(s + len) / days * 100}%;width:${1 / days * 100}%"></i>`);
        return b;
      }).join("");
      return `<div class="g-label">${u.icon} ${L(u.name)}</div><div class="g-track">${blocks}</div>`;
    }).join("");
  }

  function renderLists() {
    $("reviews").innerHTML = REVIEWS.map((r) =>
      `<div class="card"><div class="stars">★★★★★</div><p class="quote">«${r[state.lang]}»</p><p class="who">${r.name} · ${t("reviews_note")}</p></div>`).join("");
    $("steps").innerHTML = [1, 2, 3, 4].map((i) =>
      `<div class="card"><span class="num">0${i}</span><h3>${t("st" + i + "_h")}</h3><p>${t("st" + i + "_p")}</p></div>`).join("");
    $("faq").innerHTML = [1, 2, 3, 4].map((i) =>
      `<details class="qa"${i === 1 ? " open" : ""}><summary>${t("faq" + i + "_q")}</summary><p>${t("faq" + i + "_a")}</p></details>`).join("");
  }

  function renderAll() {
    document.documentElement.lang = state.lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.innerHTML = t(el.dataset.i18n); });
    document.querySelectorAll("[data-ph]").forEach((el) => { el.placeholder = t(el.dataset.ph); });
    document.querySelectorAll(".brand-name").forEach((el) => { el.textContent = L(S.brand); });
    document.querySelector(".mark").textContent = S.mark;
    renderUnits(); renderExtras(); renderBill(); renderOwner(); renderLists();
  }

  function selectUnit(id, scroll) {
    state.unit = id;
    renderUnits(); renderBill();
    if (scroll) $("calc").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function initDates() {
    // По умолчанию – ближайшие выходные: пятница и 2 ночи
    let fri = addDays(today(), (5 - today().getDay() + 7) % 7 || 7);
    const min = iso(today());
    [["sIn", fri], ["cIn", fri], ["sOut", addDays(fri, 2)], ["cOut", addDays(fri, 2)]].forEach(([id, d]) => {
      $(id).value = iso(d); $(id).min = min;
    });
    $("sGuests").value = $("cGuests").value = "2";
  }

  function initModal() {
    const m = $("modal");
    $("book").onclick = () => {
      const q = quote();
      $("mSummary").textContent = `${L(unit().name)} · ${$("cIn").value} – ${$("cOut").value} · ${money(q.total)}`;
      $("mForm").hidden = false; $("mDone").hidden = true; m.hidden = false;
    };
    $("mForm").onsubmit = (e) => {
      e.preventDefault();
      if (!$("mName").value.trim() || !$("mPhone").value.trim()) { $("mErr").textContent = t("m_need"); return; }
      $("mErr").textContent = "";
      $("mForm").hidden = true; $("mDone").hidden = false; $("mDone").textContent = t("m_done");
    };
    m.onclick = (e) => { if (e.target === m || e.target.dataset.close !== undefined) m.hidden = true; };
  }

  document.addEventListener("DOMContentLoaded", () => {
    initDates();
    document.querySelectorAll(".langs button").forEach((b) => b.onclick = () => {
      state.lang = b.dataset.lang;
      document.querySelectorAll(".langs button").forEach((x) => x.setAttribute("aria-pressed", x === b));
      renderAll();
    });
    $("units").onclick = (e) => { const b = e.target.closest("[data-pick]"); if (b) selectUnit(b.dataset.pick, true); };
    $("extras").onchange = renderBill;
    ["cIn", "cOut", "cGuests"].forEach((id) => $(id).onchange = renderBill);
    $("sGuests").onchange = renderUnits;
    $("sUnit").onchange = (e) => selectUnit(e.target.value);
    $("search").onsubmit = (e) => {
      e.preventDefault();
      $("cIn").value = $("sIn").value; $("cOut").value = $("sOut").value; $("cGuests").value = $("sGuests").value;
      selectUnit($("sUnit").value, true);
    };
    initModal();
    renderAll();
  });
})();
