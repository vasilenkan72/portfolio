// Расчёт честной цены услуги. Чистая функция: страница и тесты зовут одно и то же.
// Налог считается с выручки (так работают НПД и УСН), материалы – на каждую выполненную единицу.
// Загрузка: mode 'schedule' – по графику (дни × часы ÷ длительность), 'volume' – сколько единиц в месяц.

export function calcPrice(p) {
  const slots = p.mode === 'volume' ? p.volume : (p.days * p.hours) / p.duration;
  const done = slots * (1 - p.idle / 100);                  // реально оплаченные единицы с учётом простоев
  if (!(done > 0) || p.tax >= 100) return null;

  const tax = p.tax / 100;
  const fixed = p.rent + p.transport + p.staff + p.other + p.fees;
  const costs = fixed + p.materials * done;
  const revenue = (p.income + costs) / (1 - tax);           // выручка, после которой на руках остаётся income
  const price = revenue / done;
  const result = {
    slots, done, price, revenue, costs,
    hourPrice: p.mode === 'volume' ? null : price / p.duration,
    taxSum: revenue * tax,
    perWeek: done / 4.33,                                   // в месяце ~4,33 недели
    idleLoss: (slots - done) * price,                        // сколько стоят простои и пустые окна в месяц
  };

  if (p.current > 0) {                                      // что на руках при нынешней цене
    result.currentNet = p.current * done * (1 - tax) - costs;
    result.gap = price - p.current;
  }
  return result;
}
