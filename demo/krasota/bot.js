// Сценарий бота студии для ../concierge.js
window.BOT = {
  title: "Студия «Мята»", subtitle: "Ассистент записи · отвечает сразу",
  greet: "Здравствуйте! Я помощник студии «Мята». Запишу вас, подскажу цены и свободное время.",
  start: "menu",
  nodes: {
    menu: { text: "Что вас интересует?", options: [
      { label: "Записаться", next: "book" },
      { label: "Цены", next: "price" },
      { label: "У меня код со Сливок", next: "promo" },
      { label: "Посмотреть работы", next: "works" } ] },
    price: { text: "Маникюр с покрытием – 40 р.\nПедикюр – 50 р.\nБрови или ресницы – от 25 р.\nЧистка лица – 55 р.\nМассаж – 45 р./час\nШугаринг – от 12 р.", options: [
      { label: "Записаться", next: "book" }, { label: "Назад", next: "menu" } ] },
    works: { text: "В настоящем боте здесь подборка свежих работ мастера: 5–10 фото по выбранной услуге, с ценой под каждой.", options: [
      { label: "Записаться", next: "book" }, { label: "Назад", next: "menu" } ] },
    promo: { text: "Отлично! Код МЯТА20 принят: скидка 20% закреплена за вашей записью. Выберем услугу?", options: [
      { label: "Да, записаться", set: { promo: "МЯТА20" }, next: "book" } ] },
    book: { text: "На какую услугу?", options: [
      { label: "Маникюр", set: { svc: "маникюр" }, next: "time" },
      { label: "Брови / ресницы", set: { svc: "брови и ресницы" }, next: "time" },
      { label: "Уход за лицом", set: { svc: "уход за лицом" }, next: "time" },
      { label: "Массаж", set: { svc: "массаж" }, next: "time" } ] },
    time: { text: "Ближайшие свободные окна:", options: [
      { label: "Завтра, 13:00", set: { slot: "завтра, 13:00" }, next: "remind" },
      { label: "Пт, 17:00", set: { slot: "пт, 17:00" }, next: "remind" },
      { label: "Сб, 11:00", set: { slot: "сб, 11:00" }, next: "remind" } ] },
    remind: { text: "Куда прислать напоминание накануне?", options: [
      { label: "Telegram", set: { ch: "Telegram" }, next: "done" },
      { label: "Viber", set: { ch: "Viber" }, next: "done" } ] },
    done: { text: (s) => `Готово! Записала вас: ${s.svc}, ${s.slot}${s.promo ? ", со скидкой по коду " + s.promo : ""}.\nНакануне пришлю напоминание в ${s.ch}.\n\n(В демо запись никуда не уходит. В настоящем боте она сразу падает мастеру в Telegram, а время закрывается для других.)`,
      options: [{ label: "В начало", next: "menu" }] }
  }
};
