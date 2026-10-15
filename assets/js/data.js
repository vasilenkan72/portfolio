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
    category: 'bot',
    title: { ru: 'Astroline Mini App', en: 'Astroline Mini App' },
    description: {
      ru: 'ИИ-экосистема для астропсихологической платформы: Telegram-бот и Mini App с анализом переписок, хорарными ответами и чат-сессиями с ИИ-психологом. Разработала под ключ – от технической части до автомаркетинга.',
      en: 'AI ecosystem for an astropsychology platform: Telegram bot and Mini App with correspondence analysis, horary answers, and chat sessions with an AI psychologist. Built end-to-end – from technical setup to automated marketing.',
    },
    tech: ['Claude AI', 'Gemini API', 'Python', 'Telegram Mini App'],
    link: 'https://t.me/astroline_application_bot',
    image: null,
  },
  {
    id: 2,
    category: 'bot',
    title: { ru: 'ASTRA – Контент-агент', en: 'ASTRA – Content Agent' },
    description: {
      ru: 'ИИ-агент генерирует контент-план и готовые посты для 4 соцсетей (Telegram, Instagram, Facebook, Threads) и автоматически публикует их по расписанию через Metricool. Один запуск – неделя контента.',
      en: 'AI agent that generates a content plan and ready-made posts for 4 social networks (Telegram, Instagram, Facebook, Threads) and auto-publishes them on schedule via Metricool. One run – a full week of content.',
    },
    tech: ['Gemini API', 'Python', 'Metricool', 'Railway'],
    link: 'https://t.me/astraline_astra_bot',
    image: null,
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
    tech: ['35 слайдов', 'PowerPoint', 'Русский'],
    page: 'cases/solidarity.html',
    slides: { dir: 'assets/img/cases/solidarity', pick: [1, 6, 15, 29] },
  },
  {
    id: 6,
    category: 'presentation',
    title: { ru: 'Маркетинговая стратегия Bi-Oil', en: 'Bi-Oil Marketing Strategy' },
    description: {
      ru: 'Стратегия продвижения средства для ухода за кожей на рынке Чехии: сегменты аудитории, пирамида УТП, каналы и идеи контента с целевыми метриками.',
      en: 'Go-to-market strategy for a skincare oil in Czechia: audience segments, USP pyramid, channels and content ideas with target metrics.',
    },
    tech: ['8 слайдов', 'Gamma', 'Чешский'],
    page: 'cases/bioil-strategy.html',
    slides: { dir: 'assets/img/cases/bioil-strategy', pick: [1, 2, 4, 5] },
  },
  {
    id: 7,
    category: 'presentation',
    title: { ru: 'Анализ конкурентов Bi-Oil', en: 'Bi-Oil Competitor Analysis' },
    description: {
      ru: 'JTBD-сравнение с Palmers, Mixa и Bioderma, пирамида конкурентных позиций и разбор коммуникации брендов Blistex и Batiste с рекомендациями.',
      en: 'JTBD comparison with Palmers, Mixa and Bioderma, competitive positioning and a breakdown of Blistex and Batiste communication with recommendations.',
    },
    tech: ['8 слайдов', 'Gamma', 'Чешский'],
    page: 'cases/bioil-competitors.html',
    slides: { dir: 'assets/img/cases/bioil-competitors', pick: [1, 2, 3, 6] },
  },
];

const REVIEWS = [
  {
    text: {
      ru: 'Наталья создала бота, который реально работает. Никакого копипаста – всё под нашу задачу. Советую!',
      en: 'Natalia built a bot that actually works. No copy-paste – everything tailored to our needs. Highly recommend!',
    },
    author: 'Мария К.',
    role: { ru: 'Владелец интернет-магазина', en: 'E-commerce owner' },
  },
  {
    text: {
      ru: 'Промпт для GPT-саппорта сократил время ответа в 3 раза. Профессиональный подход, чёткие сроки.',
      en: 'The GPT support prompt cut response time by 3x. Professional approach, clear deadlines.',
    },
    author: 'Дмитрий Р.',
    role: { ru: 'IT-директор', en: 'CTO' },
  },
  {
    text: {
      ru: 'Сайт готов за 2 дня – красиво, быстро, адаптивно. Наталья сама предложила улучшения, которые я не заметила.',
      en: "Site ready in 2 days – beautiful, fast, responsive. Natalia suggested improvements I hadn't even noticed.",
    },
    author: 'Анна В.',
    role: { ru: 'Предприниматель', en: 'Entrepreneur' },
  },
];

/* ЧЕРНОВИК: цены взяты из пресетов ROI-калькулятора (500 / 1 500 / 3 000 BYN).
   Состав пакетов и сроки нужно подтвердить у Натальи. */
const SERVICES = [
  {
    name:  { ru: 'Старт',  en: 'Start' },
    price: 500,
    desc:  { ru: 'Telegram-бот или ИИ-ассистент для одной задачи', en: 'Telegram bot or AI assistant for one task' },
    items: {
      ru: ['Ответы на частые вопросы по вашей базе знаний', 'Сбор заявок с передачей вам в Telegram', 'Настройка, запуск и инструкция'],
      en: ['Answers to FAQs from your knowledge base', 'Lead capture forwarded to your Telegram', 'Setup, launch and a how-to guide'],
    },
    term:  { ru: 'от 5 дней', en: 'from 5 days' },
  },
  {
    name:  { ru: 'Стандарт', en: 'Standard' },
    price: 1500,
    desc:  { ru: 'ИИ-агент под конкретный бизнес-процесс', en: 'AI agent for a specific business process' },
    items: {
      ru: ['Квалификация лидов или расчёт стоимости', 'Интеграция с CRM, таблицами или сайтом', 'Сценарии под ваш бизнес', '2 недели поддержки после запуска'],
      en: ['Lead qualification or cost estimates', 'Integration with CRM, sheets or your site', 'Scenarios built for your business', '2 weeks of support after launch'],
    },
    term:  { ru: 'от 2 недель', en: 'from 2 weeks' },
  },
  {
    name:  { ru: 'Комплекс', en: 'Complex' },
    price: 3000,
    desc:  { ru: 'Система из нескольких агентов под ключ', en: 'Turnkey multi-agent system' },
    items: {
      ru: ['Агенты для продаж, поддержки и контента', 'Telegram Mini App или сайт', 'Интеграции с вашими сервисами', 'Обучение команды'],
      en: ['Agents for sales, support and content', 'Telegram Mini App or website', 'Integrations with your services', 'Team training'],
    },
    term:  { ru: 'от 4 недель', en: 'from 4 weeks' },
  },
];
