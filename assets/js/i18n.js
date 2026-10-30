// Общий переключатель языка для лид-магнитов (/cena/, /proverka/).
// Язык: ?lang=… → сохранённый выбор → язык браузера → ru. Тексты страницы – в элементах с data-t="ключ".

export const LANGS = ['ru', 'pl', 'cs', 'de', 'en'];

export function detectLang() {
  const q = new URLSearchParams(location.search).get('lang');
  if (LANGS.includes(q)) return q;
  try { const saved = localStorage.getItem('lm-lang'); if (LANGS.includes(saved)) return saved; } catch (e) { /* нет доступа */ }
  const nav = (navigator.language || 'ru').slice(0, 2).toLowerCase();
  if (nav === 'be' || nav === 'uk') return 'ru';
  return LANGS.includes(nav) ? nav : 'ru';
}

// Подставляет тексты: data-t → textContent, data-t-ph → placeholder, data-t-aria → aria-label
export function applyTexts(ui) {
  document.querySelectorAll('[data-t]').forEach((el) => { if (ui[el.dataset.t] !== undefined) el.textContent = ui[el.dataset.t]; });
  document.querySelectorAll('[data-t-ph]').forEach((el) => { if (ui[el.dataset.tPh] !== undefined) el.placeholder = ui[el.dataset.tPh]; });
  if (ui.title) document.title = ui.title;
  document.documentElement.lang = ui.lang || 'ru';
}

// Рисует переключатель RU · PL · CS · DE · EN; выбор меняет ?lang и перезагружает страницу
export function renderSwitcher(box, current) {
  box.replaceChildren(...LANGS.map((l) => {
    const a = document.createElement('a');
    a.textContent = l.toUpperCase();
    a.className = 'lang' + (l === current ? ' on' : '');
    const url = new URL(location.href);
    url.searchParams.set('lang', l);
    a.href = url.pathname + url.search;
    a.addEventListener('click', () => { try { localStorage.setItem('lm-lang', l); } catch (e) { /* нет доступа */ } });
    return a;
  }));
}

export async function share({ title, text, url, copiedEl, promptLabel }) {
  if (navigator.share) {
    try { await navigator.share({ title, text, url }); } catch (e) { /* закрыли окно */ }
    return;
  }
  try { await navigator.clipboard.writeText(`${text} ${url}`); copiedEl.classList.remove('hidden'); }
  catch (e) { prompt(promptLabel, url); }
}
