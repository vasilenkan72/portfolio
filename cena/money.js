// Валюты калькулятора. k – во сколько раз ориентиры ниш (заданы в BYN) умножаются для этой валюты:
// это не биржевой курс, а грубая поправка на уровень цен страны (маникюр 40 р. ≈ 1600 ₽ ≈ 40 € ≈ 120 zł ≈ 600 Kč).
// Человек всё равно вводит свои цифры – значения только для старта.

export const CURRENCIES = {
  BYN: { sym: 'р.', k: 1, taxes: [['taxNpdBy', 10], ['taxUsnBy', 6], ['taxNone', 0]] },
  RUB: { sym: '₽', k: 40, taxes: [['taxNpdRu4', 4], ['taxNpdRu6', 6], ['taxUsnRu', 6], ['taxNone', 0]] },
  EUR: { sym: '€', k: 1, taxes: [['taxNone', 0]] },
  PLN: { sym: 'zł', k: 3, taxes: [['taxNone', 0]] },
  CZK: { sym: 'Kč', k: 15, taxes: [['taxNone', 0]] },
};
export const DEFAULT_CURRENCY = { ru: 'BYN', pl: 'PLN', cs: 'CZK', de: 'EUR', en: 'EUR' };
const LOCALE = { ru: 'ru-RU', pl: 'pl-PL', cs: 'cs-CZ', de: 'de-DE', en: 'en-GB' };

// Ориентир из BYN в выбранную валюту, округлённый до «человеческого» числа
export function scale(value, cur) {
  return nice(value * CURRENCIES[cur].k);
}

export function nice(x) {
  if (!(x > 0)) return 0;
  const step = x < 20 ? 0.5 : x < 200 ? 5 : x < 2000 ? 10 : x < 20000 ? 100 : 500;
  return Math.max(step, Math.round(x / step) * step);
}

// Цена вверх до «красивой»: шаг растёт вместе с суммой
export function roundUp(x) {
  const step = x < 10 ? 0.5 : x < 30 ? 1 : x < 300 ? 5 : x < 3000 ? 10 : 50;
  return Math.ceil(x / step) * step;
}

export function formatMoney(x, cur, lang) {
  const digits = Math.abs(x) < 10 && Math.round(x) !== x ? 2 : 0;
  const num = (Math.round(x * 100) / 100).toLocaleString(LOCALE[lang] || 'ru-RU', { maximumFractionDigits: digits });
  return `${num} ${CURRENCIES[cur].sym}`;
}

export function formatNum(x, lang) {
  return Math.round(x).toLocaleString(LOCALE[lang] || 'ru-RU');
}
