/* ════════════════════════════════════════
   chat-script.js  |  тексты ассистента (фаза 1: сценарий без ИИ)
   Правьте тексты здесь, логика в chat.js.
   ════════════════════════════════════════ */
'use strict';

const CHAT_CONFIG = {
  contactFirst: false,  // true = сначала контакт, потом ответ; false = сначала полезный ответ
  endpoint: 'https://formspree.io/f/xqevpevr',
  telegram: 'https://t.me/NatalliaVas',
};

const CHAT_TEXT = {
  title:    { ru: 'Ассистент Натальи', en: 'Natallia’s assistant' },
  status:   { ru: 'Отвечает сразу', en: 'Replies instantly' },
  launcher: { ru: 'Обсудить проект', en: 'Discuss a project' },
  greeting: {
    ru: 'Здравствуйте! Я ассистент Натальи Василенко. Чтобы подобрать примеры работ и подготовить расчёт под ваш бизнес, выберите, какая задача перед вами:',
    en: 'Hello! I’m Natallia Vasilenko’s assistant. To pick relevant work examples and prepare an estimate for your business, choose your task:',
  },
  askContact: {
    ru: 'Чтобы Наталья подготовила точный расчёт под ваш проект, напишите, как к вам обращаться и ваш Telegram (@username) или телефон.',
    en: 'So Natallia can prepare an exact estimate, tell me your name and your Telegram (@username) or phone.',
  },
  askOther: {
    ru: 'Опишите ваш вопрос в паре предложений, а ниже оставьте контакт. Наталья ответит лично.',
    en: 'Describe your question in a couple of sentences and leave your contact below. Natallia will reply personally.',
  },
  thanks: {
    ru: 'Спасибо, {name}! Записала. Наталья свяжется с вами в течение дня. Если удобнее сразу, напишите ей в Telegram.',
    en: 'Thank you, {name}! Noted. Natallia will get back to you within a day. If you prefer, message her on Telegram right away.',
  },
  error: {
    ru: 'Не получилось отправить. Напишите Наталье напрямую в Telegram, она ответит.',
    en: 'Sending failed. Please message Natallia directly on Telegram.',
  },
  fields: {
    name:    { ru: 'Как к вам обращаться', en: 'Your name' },
    contact: { ru: 'Telegram (@username) или телефон', en: 'Telegram (@username) or phone' },
    note:    { ru: 'Коротко о задаче (необязательно)', en: 'About your task (optional)' },
    consent: { ru: 'Согласен(на) на обработку имени и контакта для ответа на запрос.', en: 'I consent to processing my name and contact to answer my request.' },
    policy:  { ru: 'Политика', en: 'Policy' },
    send:    { ru: 'Отправить', en: 'Send' },
    badContact: { ru: 'Укажите @username, телефон или email', en: 'Enter @username, phone or email' },
  },
  links: {
    works:    { ru: 'Посмотреть работы', en: 'See my work' },
    telegram: { ru: 'Написать в Telegram', en: 'Message on Telegram' },
  },
};

/* Темы: label = кнопка, answer = полезный ответ, cases = ссылки на реальные работы */
const CHAT_TOPICS = [
  {
    id: 'analysis', icon: '📊',
    label: { ru: 'Анализ сайта / конкурентов', en: 'Website / competitor audit' },
    answer: {
      ru: 'Наталья разбирает сайт глазами клиента: понятен ли оффер с первого экрана, где теряются заявки, как вы выглядите рядом с конкурентами. Для конкурентов она использует метод JTBD: какую «работу» покупатель поручает продукту и какую эмоцию получает. Так было сделано исследование косметического бренда на рынке Чехии.',
      en: 'Natallia reviews your site through the customer’s eyes: is the offer clear on the first screen, where leads drop off, how you compare with competitors. For competitors she uses JTBD: what “job” the buyer hires the product for and what emotion they get. That’s how a cosmetics brand was researched for the Czech market.',
    },
    cases: [{ href: 'cases/bioil-competitors.html', ru: 'Кейс: JTBD-анализ конкурентов Bi-Oil', en: 'Case: Bi-Oil JTBD competitor analysis' }],
  },
  {
    id: 'site', icon: '🌐',
    label: { ru: 'Разработка сайта / Лендинг', en: 'Website / Landing page' },
    answer: {
      ru: 'Процесс такой: короткий бриф о вашем бизнесе, затем дизайн-система, вёрстка с адаптивом под телефон, форма заявок и публикация. Сайт, на котором вы сейчас находитесь, Наталья сделала сама именно по этому процессу.',
      en: 'The process: a short brief about your business, then a design system, responsive layout, a lead form and publishing. Natallia built the site you’re on right now with exactly this process.',
    },
    cases: [{ href: '#portfolio', ru: 'Все работы', en: 'All works' }],
  },
  {
    id: 'presentation', icon: '🎨',
    label: { ru: 'Презентация / КП', en: 'Presentation / Proposal' },
    answer: {
      ru: 'Наталья собирает структуру, тексты и дизайн. Маркетинговую стратегию и анализ конкурентов на 8 слайдов для клиента она сделала за 1 день, а презентация к 105-летию профсоюза на 35 слайдов прошла на классном часе «на ура».',
      en: 'Natallia builds the structure, copy and design. A marketing strategy and a competitor analysis (8 slides each) took her 1 day for a client, and a 35-slide deck for a trade union anniversary was a hit at a school class.',
    },
    cases: [
      { href: 'cases/solidarity.html', ru: 'Кейс: 105 лет солидарности', en: 'Case: 105 Years of Solidarity' },
      { href: 'cases/bioil-strategy.html', ru: 'Кейс: стратегия Bi-Oil', en: 'Case: Bi-Oil strategy' },
    ],
  },
  {
    id: 'webapp', icon: '💻',
    label: { ru: 'Веб-приложение', en: 'Web app' },
    answer: {
      ru: 'Наталья делает веб-приложения и Telegram Mini App: клиент открывает их прямо в мессенджере, без установки. Например, Astroline: бот и Mini App с ИИ-анализом и чат-сессиями.',
      en: 'Natallia builds web apps and Telegram Mini Apps that open right inside the messenger, no install needed. For example, Astroline: a bot and Mini App with AI analysis and chat sessions.',
    },
    cases: [{ href: '#portfolio', ru: 'Смотреть в портфолио', en: 'See in portfolio' }],
  },
  {
    id: 'agent', icon: '🤖',
    label: { ru: 'ИИ-агент / Автоматизация', en: 'AI agent / Automation' },
    answer: {
      ru: 'ИИ-агент берёт на себя повторяющуюся работу: отвечает клиентам в мессенджерах, собирает заявки, готовит контент. Контент-агент Натальи ASTRA, например, сам пишет посты для 4 соцсетей и публикует их по расписанию.',
      en: 'An AI agent takes over repetitive work: answers clients in messengers, collects leads, prepares content. Natallia’s content agent ASTRA, for example, writes posts for 4 social networks and publishes them on schedule.',
    },
    cases: [{ href: '#portfolio', ru: 'Смотреть агентов', en: 'See agents' }],
  },
  {
    id: 'other', icon: '💬',
    label: { ru: 'Другой вопрос', en: 'Other question' },
    answer: null,
    cases: [],
  },
];

/* Расчёт выгоды в диалоге (та же формула, что была в ROI-калькуляторе):
   рутина/мес = сотрудники × зарплата × доля рутины; агент забирает 80%;
   окупаемость считается для формата «Стандарт» (implementCost). */
const CHAT_ROI = {
  implementCost: 1500,
  intro: {
    ru: 'Давайте прикинем, сколько вам может сэкономить ИИ-агент. Три коротких вопроса. Сколько сотрудников у вас заняты рутиной: ответы на однотипные вопросы, заявки, таблицы?',
    en: 'Let’s estimate how much an AI agent could save you. Three quick questions. How many employees handle routine work: repetitive questions, leads, spreadsheets?',
  },
  steps: [
    { key: 'emp', options: [
      { v: 2,  ru: '1–2', en: '1–2' }, { v: 4, ru: '3–5', en: '3–5' },
      { v: 8,  ru: '6–10', en: '6–10' }, { v: 12, ru: 'Больше 10', en: 'More than 10' } ] },
    { key: 'salary',
      ask: { ru: 'Какая средняя зарплата одного такого сотрудника в месяц?', en: 'What is the average monthly salary of one such employee?' },
      options: [
        { v: 800,  ru: 'До 1 000 BYN', en: 'Under 1,000 BYN' }, { v: 1500, ru: '1 000–2 000 BYN', en: '1,000–2,000 BYN' },
        { v: 2500, ru: '2 000–3 000 BYN', en: '2,000–3,000 BYN' }, { v: 3500, ru: 'Больше 3 000 BYN', en: 'Over 3,000 BYN' } ] },
    { key: 'routine',
      ask: { ru: 'Какую часть рабочего времени у них занимает рутина?', en: 'What share of their working time goes to routine?' },
      options: [
        { v: 0.2, ru: 'Около 20%', en: 'About 20%' }, { v: 0.4, ru: 'Около 40%', en: 'About 40%' },
        { v: 0.6, ru: 'Около 60%', en: 'About 60%' }, { v: 0.8, ru: 'Почти всё время', en: 'Almost all the time' } ] },
  ],
  result: {
    ru: 'Сейчас рутина обходится вам примерно в {loss} BYN в месяц. ИИ-агент может взять на себя до 80% этой работы: это около {save} BYN экономии в месяц и {year} BYN в год. Внедрение формата «Стандарт» окупится примерно за {payback}.',
    en: 'Routine currently costs you about {loss} BYN a month. An AI agent can take over up to 80% of it: roughly {save} BYN saved per month and {year} BYN per year. A “Standard” implementation would pay off in about {payback}.',
  },
  note: {
    ru: 'Это ориентир по средним значениям, а не обещание. Точную оценку Наталья даст после разбора ваших процессов.',
    en: 'This is a rough guide based on averages, not a promise. Natallia will give an exact estimate after reviewing your processes.',
  },
  months: { ru: ['месяц', 'месяца', 'месяцев'], en: ['month', 'months', 'months'] },
};

/* Квиз «Рассчитать стоимость»: цены берутся из PRICES (data.js) */
const CHAT_PRICE = {
  intro:   { ru: 'Подберём ориентир по стоимости. Что нужно сделать?', en: 'Let’s find a price guide. What do you need?' },
  variant: { ru: 'Какой вариант ближе к вашей задаче?', en: 'Which option is closest to your task?' },
  support: { ru: 'Нужна ли поддержка после запуска? Для ботов и ИИ это ещё и оплата нейросети.', en: 'Do you need support after launch? For bots and AI it also covers the AI model.' },
  yes:     { ru: 'Да, нужна', en: 'Yes' },
  no:      { ru: 'Нет, только запуск', en: 'No, launch only' },
  result:  { ru: 'Ориентир: «{name}» от {price} BYN, срок {term}.', en: 'Guide: “{name}” from {price} BYN, timeline {term}.' },
  withSupport: { ru: ' Плюс поддержка от {price} BYN в месяц.', en: ' Plus support from {price} BYN per month.' },
  note:    { ru: 'Точную стоимость Наталья назовёт после короткого брифа: она зависит от объёма и интеграций.', en: 'Natallia will give the exact price after a short brief: it depends on scope and integrations.' },
  guide:   { ru: 'Ориентир по цене:', en: 'Price guide:' },
  roiLink: { ru: 'Посчитать выгоду ИИ-агента', en: 'Estimate AI agent benefit' },
  supportTopics: ['site', 'agent', 'webapp'],
};
