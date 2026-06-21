/* ============================================================
   data.js — Данные портфолио Натальи Василенко
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
      ru: 'ИИ-экосистема для астропсихологической платформы: Telegram-бот и Mini App с анализом переписок, хорарными ответами и чат-сессиями с ИИ-психологом. Разработала под ключ — от технической части до автомаркетинга.',
      en: 'AI ecosystem for an astropsychology platform: Telegram bot and Mini App with correspondence analysis, horary answers, and chat sessions with an AI psychologist. Built end-to-end — from technical setup to automated marketing.',
    },
    tech: ['Claude AI', 'Gemini API', 'Python', 'Telegram Mini App'],
    link: 'https://t.me/astroline_application_bot',
    image: null,
  },
  {
    id: 2,
    category: 'bot',
    title: { ru: 'ASTRA — Контент-агент', en: 'ASTRA — Content Agent' },
    description: {
      ru: 'ИИ-агент генерирует контент-план и готовые посты для 4 соцсетей (Telegram, Instagram, Facebook, Threads) и автоматически публикует их по расписанию через Metricool. Один запуск — неделя контента.',
      en: 'AI agent that generates a content plan and ready-made posts for 4 social networks (Telegram, Instagram, Facebook, Threads) and auto-publishes them on schedule via Metricool. One run — a full week of content.',
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
      ru: 'Контент-агент для YouTube-канала Velvet Night Jazz. Автоматически генерирует описания, теги и Telegram-посты на основе ИИ — экономит 4+ часа ручной работы в неделю.',
      en: 'Content agent for the Velvet Night Jazz YouTube channel. Auto-generates descriptions, tags, and Telegram posts using AI — saving 4+ hours of manual work per week.',
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
      ru: 'Веб-приложение для анализа совместимости двух людей с помощью ИИ. Чистый JS + Gemini API без бэкенда — молниеносная загрузка и полная конфиденциальность данных.',
      en: 'Web app for compatibility analysis using AI. Pure JS + Gemini API with no backend — lightning-fast and fully private.',
    },
    tech: ['JavaScript', 'Gemini API', 'HTML/CSS'],
    link: 'https://github.com/vasilenkan72/ai-relationship-analyzer',
    image: null,
  },
];

const REVIEWS = [
  {
    text: {
      ru: 'Наталья создала бота, который реально работает. Никакого копипаста — всё под нашу задачу. Советую!',
      en: 'Natalia built a bot that actually works. No copy-paste — everything tailored to our needs. Highly recommend!',
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
      ru: 'Сайт готов за 2 дня — красиво, быстро, адаптивно. Наталья сама предложила улучшения, которые я не заметила.',
      en: "Site ready in 2 days — beautiful, fast, responsive. Natalia suggested improvements I hadn't even noticed.",
    },
    author: 'Анна В.',
    role: { ru: 'Предприниматель', en: 'Entrepreneur' },
  },
];
