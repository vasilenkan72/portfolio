/* ============================================================
   data.js – Данные портфолио Натальи Василенко
   ============================================================ */

const SKILLS = [
  { name: 'Claude AI',           category: 'ai' },
  { name: 'Gemini API',          category: 'ai' },
  { name: 'ChatGPT / GPT-4',    category: 'ai' },
  { name: 'Prompt Engineering',  category: 'ai' },
  { name: 'Telegram Bot API',    category: 'dev' },
  { name: 'HTML / CSS',          category: 'dev' },
  { name: 'JavaScript',          category: 'dev' },
  { name: 'Python',              category: 'dev' },
  { name: 'Make (Integromat)',   category: 'tools' },
  { name: 'n8n',                 category: 'tools' },
  { name: 'Claude Code',         category: 'tools' },
  { name: 'VS Code',             category: 'tools' },
  { name: 'GitHub',              category: 'tools' },
  { name: 'Figma',               category: 'design' },
  { name: 'Midjourney',          category: 'design' },
  { name: 'Canva Pro',           category: 'design' },
];

const PROJECTS = [
  {
    id: 1,
    category: 'app',
    title: { ru: 'Astroline Mini App', en: 'Astroline Mini App' },
    description: {
      ru: 'ИИ-экосистема для астропсихологической платформы: Telegram-бот и Mini App с анализом переписок, хорарными ответами и чат-сессиями с ИИ-психологом. Разработала под ключ – от технической части до автомаркетинга.',
      en: 'AI ecosystem for an astropsychology platform: Telegram bot and Mini App with correspondence analysis, horary answers, and chat sessions with an AI psychologist. Built end-to-end – from technical setup to automated marketing.',
    },
    tech: ['Claude AI', 'Gemini API', 'Python', 'Telegram Mini App'],
    link: 'https://t.me/astroline_application_bot',
    page: 'cases/astroline.html',
    image: 'assets/img/cases/astroline/cover-sm.webp',
  },
  {
    id: 2,
    category: 'bot',
    title: { ru: 'ASTRA – контент-агент', en: 'ASTRA – Content Agent' },
    description: {
      ru: 'ИИ-агент ведёт канал Astroline: план на неделю, тексты для Telegram, Instagram, Facebook и Threads, фирменные карусели и публикация в 10:00. Владелец только одобряет.',
      en: 'An AI agent runs the Astroline channel: a weekly plan, posts for Telegram, Instagram, Facebook and Threads, branded carousels and publishing at 10:00. The owner only approves.',
    },
    tech: ['Gemini API', 'Python', 'PostgreSQL', 'Railway'],
    link: 'https://t.me/astroline_page',
    page: 'cases/astra.html',
    image: 'assets/img/cases/astra/cover-sm.webp',
  },
  {
    id: 3,
    category: 'bot',
    title: { ru: 'Velvet Night Jazz Agent', en: 'Velvet Night Jazz Agent' },
    description: {
      ru: 'Контент-агент для YouTube-канала Velvet Night Jazz. Автоматически генерирует описания, теги и Telegram-посты на основе ИИ – экономит 4+ часа ручной работы в неделю.',
      en: 'Content agent for the Velvet Night Jazz YouTube channel. Auto-generates descriptions, tags, and Telegram posts using AI – saving 4+ hours of manual work per week.',
    },
    tech: ['Gemini API', 'Claude AI', 'Python'],
    link: '#',
    image: null,
  },
  {
    id: 4,
    category: 'web',
    title: { ru: 'AI Relationship Analyzer', en: 'AI Relationship Analyzer' },
    description: {
      ru: 'Веб-приложение для анализа совместимости двух людей с помощью ИИ. Чистый JS + Gemini API без бэкенда – молниеносная загрузка и полная конфиденциальность данных.',
      en: 'Web app for compatibility analysis using AI. Pure JS + Gemini API with no backend – lightning-fast and fully private.',
    },
    tech: ['JavaScript', 'Gemini API', 'HTML/CSS'],
    link: 'https://github.com/vasilenkan72/ai-relationship-analyzer',
    image: null,
  },
  {
    id: 5,
    category: 'presentation',
    title: { ru: '105 лет солидарности', en: '105 Years of Solidarity' },
    description: {
      ru: 'Классный час к 105-летию Белорусского профсоюза работников образования и науки: таймлайн истории, цифры, блок для молодёжи и интерактивная игра «Верю – не верю».',
      en: 'Class-hour deck for the 105th anniversary of the Belarusian trade union of education and science workers: history timeline, key numbers, a youth block and an interactive quiz.',
    },
    tech: ['35 слайдов', 'Claude + NotebookLM', 'Русский'],
    page: 'cases/solidarity.html',
    slides: { dir: 'assets/img/cases/solidarity', pick: [1, 6, 15, 29] },
  },
  {
    id: 6,
    category: 'presentation',
    title: { ru: 'Маркетинговая стратегия Bi-Oil', en: 'Bi-Oil Marketing Strategy' },
    description: {
      ru: 'Проект для клиента: стратегия продвижения средства для ухода за кожей на рынке Чехии: сегменты аудитории, пирамида УТП, каналы и идеи контента с целевыми метриками.',
      en: 'Go-to-market strategy for a skincare oil in Czechia: audience segments, USP pyramid, channels and content ideas with target metrics.',
    },
    tech: ['8 слайдов', 'ChatGPT + Gamma', 'Чешский'],
    page: 'cases/bioil-strategy.html',
    slides: { dir: 'assets/img/cases/bioil-strategy', pick: [1, 2, 4, 5] },
  },
  {
    id: 7,
    category: 'presentation',
    title: { ru: 'Анализ конкурентов Bi-Oil', en: 'Bi-Oil Competitor Analysis' },
    description: {
      ru: 'Проект для клиента: JTBD-сравнение с Palmers, Mixa и Bioderma, пирамида конкурентных позиций и разбор коммуникации брендов Blistex и Batiste с рекомендациями.',
      en: 'JTBD comparison with Palmers, Mixa and Bioderma, competitive positioning and a breakdown of Blistex and Batiste communication with recommendations.',
    },
    tech: ['8 слайдов', 'ChatGPT + Gamma', 'Чешский'],
    page: 'cases/bioil-competitors.html',
    slides: { dir: 'assets/img/cases/bioil-competitors', pick: [1, 2, 3, 6] },
  },
];

const REVIEWS = [
  {
    text: {
      ru: 'Презентация прошла на УРА! Несмотря на серьёзную тему о профсоюзах, дети слушали с интересом. Спасибо большое!',
      en: 'The presentation was a huge success! Despite the serious topic of trade unions, the kids listened with interest. Thank you so much!',
    },
    author: 'Наталья Богатырева',
    photo: 'assets/img/reviews/bogatyreva.webp',
    role: { ru: 'Педагог · презентация «105 лет солидарности»', en: 'Teacher · “105 Years of Solidarity” deck' },
    link: 'cases/solidarity.html',
  },
  {
    text: {
      ru: 'Самым полезным оказались JTBD-анализ и детальная проработка болей целевой аудитории: это дало железобетонное понимание продукта и рынка. Проект был подготовлен мощный, и это избавило от страха оказаться некомпетентной. Работа, на которую я сама потратила бы куда больше времени, энергии и сил, была готова за достаточно короткий срок. Несомненно, буду обращаться и в дальнейшем.',
      en: 'The most useful parts were the JTBD analysis and the detailed work on the target audience’s pain points: it gave me a rock-solid understanding of the product and the market. The project was powerful and took away my fear of looking incompetent. Work that would have cost me much more time, energy and effort was ready in a short time. I will definitely come back.',
    },
    author: 'Мария',
    avatar: 'assets/img/reviews/maria.webp',
    role: { ru: 'Маркетинговый проект Bi-Oil', en: 'Bi-Oil marketing project' },
    link: 'cases/bioil-competitors.html',
  },];

/* ПРАЙС (утверждён Натальей 16.10.2026, цены «от», BYN).
   Один источник для блока «Услуги и цены», ответов ассистента и квиза «Рассчитать стоимость».
   topic = id темы ассистента из chat-script.js. */
const PRICE_GROUPS = [
  { topic: 'analysis',     title: { ru: 'Анализ', en: 'Analysis' } },
  { topic: 'presentation', title: { ru: 'Презентации', en: 'Presentations' } },
  { topic: 'site',         title: { ru: 'Сайты', en: 'Websites' } },
  { topic: 'agent',        title: { ru: 'Боты и ИИ-агенты', en: 'Bots & AI agents' } },
  { topic: 'webapp',       title: { ru: 'Приложения', en: 'Apps' } },
];

const PRICES = [
  { topic: 'analysis', price: 250,
    name: { ru: 'Экспресс-аудит сайта', en: 'Express website audit' }, term: { ru: '2–3 дня', en: '2–3 days' } },
  { topic: 'analysis', price: 600,
    name: { ru: 'Аудит + анализ конкурентов (JTBD)', en: 'Audit + competitor analysis (JTBD)' }, term: { ru: '5 дней', en: '5 days' } },
  { topic: 'presentation', price: 400,
    name: { ru: 'Презентация до 15 слайдов', en: 'Presentation up to 15 slides' }, term: { ru: '2–3 дня', en: '2–3 days' } },
  { topic: 'presentation', price: 800,
    name: { ru: 'Стратегическая презентация с исследованием', en: 'Strategy deck with research' }, term: { ru: 'от 3 дней', en: 'from 3 days' } },
  { topic: 'site', price: 800,
    name: { ru: 'Лендинг с текстами и формой', en: 'Landing page with copy and form' }, term: { ru: '7–10 дней', en: '7–10 days' } },
  { topic: 'agent', price: 600,
    name: { ru: 'Telegram-бот для заявок / FAQ', en: 'Telegram bot for leads / FAQ' }, term: { ru: '5–7 дней', en: '5–7 days' } },
  { topic: 'agent', price: 1200,
    name: { ru: 'ИИ-ассистент с базой знаний', en: 'AI assistant with knowledge base' }, term: { ru: '2 недели', en: '2 weeks' } },
  { topic: 'agent', price: 2000,
    name: { ru: 'ИИ-агент под процесс, с интеграциями', en: 'AI agent for a process, with integrations' }, term: { ru: 'от 3 недель', en: 'from 3 weeks' } },
  { topic: 'webapp', price: 2500,
    name: { ru: 'Telegram Mini App', en: 'Telegram Mini App' }, term: { ru: 'от 3 недель', en: 'from 3 weeks' } },
];

const PRICE_SUPPORT = { price: 100,
  name: { ru: 'Поддержка и абонплата ИИ', en: 'Support and AI subscription' }, unit: { ru: 'в месяц', en: 'per month' } };

/* Частые вопросы. {price:Название} подставляет цену из PRICES, чтобы FAQ не расходился с прайсом. */
const FAQ = [
  {
    q: { ru: 'Чем вы занимаетесь?', en: 'What do you do?' },
    a: {
      ru: 'Моя специализация – автоматизация продаж и маркетинга с помощью ИИ: анализ сайта и конкурентов, маркетинговая стратегия, когда продажи просели и нужен план роста, сайты и лендинги, воронки продаж в мессенджерах, Telegram-приложения и ИИ-агенты, которые отвечают клиентам 24/7.',
      en: 'I specialise in automating sales and marketing with AI: website and competitor audits, a marketing strategy when sales dip and you need a growth plan, websites and landing pages, messenger sales funnels, Telegram apps and AI agents that answer clients 24/7.',
    },
  },
  {
    q: { ru: 'Сколько это стоит?', en: 'How much does it cost?' },
    a: {
      ru: 'Ориентиры такие: экспресс-аудит сайта {price:Экспресс-аудит сайта}, лендинг {price:Лендинг с текстами и формой}, Telegram-бот {price:Telegram-бот для заявок / FAQ}, ИИ-агент {price:ИИ-агент под процесс, с интеграциями}. Точную сумму называю после короткого брифа. Ориентир под вашу задачу можно посчитать прямо здесь.',
      en: 'Guide prices: express website audit {price:Экспресс-аудит сайта}, landing page {price:Лендинг с текстами и формой}, Telegram bot {price:Telegram-бот для заявок / FAQ}, AI agent {price:ИИ-агент под процесс, с интеграциями}. I give an exact quote after a short brief. You can estimate your task right here.',
    },
    action: { mode: 'price', ru: 'Рассчитать стоимость', en: 'Get a price estimate' },
  },
  {
    q: { ru: 'Какие сроки?', en: 'How long does it take?' },
    a: {
      ru: 'Аудит 2–3 дня, лендинг 7–10 дней, Telegram-бот 5–7 дней. Стратегию и анализ конкурентов для клиента я сделала за 1 день.',
      en: 'An audit takes 2–3 days, a landing page 7–10 days, a Telegram bot 5–7 days. A strategy and competitor analysis for a client took me 1 day.',
    },
  },
  {
    q: { ru: 'Как начать работу?', en: 'How do we start?' },
    a: {
      ru: 'Напишите мне в Telegram @natallia_vasilenka, задайте вопрос ИИ-ассистенту @natallia_assistant_bot (отвечает 24/7) или оставьте заявку в форме ниже. Расскажите о задаче, и я предложу 2–3 варианта решения с ценами. Это ни к чему не обязывает.',
      en: 'Message me on Telegram @natallia_vasilenka, ask my AI assistant @natallia_assistant_bot (24/7) or leave a request in the form below. Tell me about your task and I will suggest 2–3 options with prices. No obligation.',
    },
    action: { mode: '', ru: 'Обсудить проект', en: 'Discuss a project' },
  },
];
