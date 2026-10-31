// Данные бизнеса. Чтобы сделать сайт под нового клиента, меняется только этот файл и тексты в i18n.js.
// Цены в BYN за ночь. Занятость (busy) – смещение в днях от сегодня: [начало, ночей].
window.SITE = {
  brand: { ru: "Хутор «Ясный лес»", en: "Clear Forest Farmstead" },
  mark: "ЯЛ",
  currency: "BYN",
  contact: "https://t.me/NatalliaVas",

  units: [
    { id: "sosna", icon: "🌲", art: "#3E6B4F", guests: 4, price: 120, tag: "tag_popular", busy: [[3, 2], [11, 3]],
      name: { ru: "Домик «Сосна»", en: "Pine Cabin" },
      about: { ru: "2 комнаты, кухня, терраса с видом на лес", en: "2 rooms, kitchen, terrace facing the forest" } },
    { id: "olha", icon: "🏡", art: "#8A6A44", guests: 2, price: 95, tag: "tag_couple", busy: [[1, 3], [8, 2]],
      name: { ru: "Домик «Ольха»", en: "Alder Cabin" },
      about: { ru: "Для двоих: камин, большая кровать, тишина", en: "For two: fireplace, king bed, silence" } },
    { id: "dom", icon: "🏠", art: "#5B5F7A", guests: 8, price: 260, tag: null, busy: [[5, 2], [12, 2]],
      name: { ru: "Большой дом", en: "Family House" },
      about: { ru: "4 спальни, гостиная, мангал, баня рядом", en: "4 bedrooms, living room, grill, sauna next door" } },
    { id: "shater", icon: "⛺", art: "#B07A3A", guests: 2, price: 110, tag: "tag_season", busy: [[2, 1], [9, 4]],
      name: { ru: "Глэмпинг «Звёздный»", en: "Starry Glamping Tent" },
      about: { ru: "Шатёр с кроватью и прозрачной крышей", en: "A tent with a real bed and a see-through roof" } },
  ],

  // per: "stay" – за весь отдых, "night" – за ночь, "guestNight" – за гостя в сутки
  extras: [
    { id: "banya", price: 80, per: "stay", name: { ru: "Баня на дровах (3 часа)", en: "Wood-fired sauna (3 hours)" } },
    { id: "chan", price: 120, per: "stay", name: { ru: "Горячий чан под звёздами", en: "Outdoor hot tub" } },
    { id: "breakfast", price: 15, per: "guestNight", name: { ru: "Деревенский завтрак", en: "Farm breakfast" } },
    { id: "boat", price: 30, per: "night", name: { ru: "Лодка или SUP", en: "Boat or SUP board" } },
    { id: "dog", price: 20, per: "stay", name: { ru: "Можно с собакой", en: "Dog-friendly stay" } },
  ],

  pricing: {
    weekend: 1.2,          // ночи с пятницы и субботы
    high: 1.3,             // высокий сезон
    highMonths: [6, 7, 8], // июнь–август
    highDates: ["12-25", "01-08"], // новогодние праздники: с 25.12 по 08.01
    longStay: { nights: 3, discount: 0.1 },
    prepay: 0.3,           // предоплата при бронировании
  },
};
