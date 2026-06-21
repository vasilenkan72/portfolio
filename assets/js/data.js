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
    title: { ru: 'Support Bot', en: 'Support Bot' },
    description: {
      ru: 'Автономный ИИ-агент для астрологической платформы Astroline. Закрывает 80% обращений без оператора — FAQ, поддержка 24/7 и умная маршрутизация запросов на базе Claude AI.',
      en: 'Autonomous AI agent for the Astroline astrology platform. Resolves 80% of inquiries without an operator — FAQ, 24/7 support, and smart request routing powered by Claude AI.',
    },
    tech: ['Claude AI', 'Telegram API', 'Python'],
    link: '#',
    image: null,
  },
  {
    id: 2,
    category: 'bot',
    title: { ru: 'LeadBot', en: 'LeadBot' },
    description: {
      ru: 'Интеллектуальный лид-квалификатор для бизнеса. Ведёт диалог с клиентом, собирает ключевые данные и автоматически отправляет готовую заявку в CRM через Make. Работает в Telegram 24/7.',
      en: 'Intelligent lead qualifier for business. Engages clients in dialogue, collects key data, and automatically sends completed requests to CRM via Make. Runs in Telegram 24/7.',
    },
    tech: ['Gemini API', 'Telegram Bot API', 'Make'],
    link: '#',
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
