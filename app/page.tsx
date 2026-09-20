'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowRight,
  Bitcoin,
  Bolt,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  FileText,
  Gamepad2,
  Globe2,
  KeyRound,
  Link2,
  Mail,
  Menu,
  Repeat2,
  Send,
  ShieldCheck,
  Sparkles,
  Trophy,
  Wallet,
  Zap,
  X,
} from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useTranslation, type TranslationKey } from '@/lib/i18n';
import { sendLeadToTelegram } from '@/lib/send-lead';

const telegramUrl = 'https://t.me/SorsPay';
const supportEmail = 'support@sorspay.cc';

const navItems: { key: TranslationKey; href: string }[] = [
  { key: 'nav.conditions', href: '#conditions' },
  { key: 'nav.calc', href: '#calc' },
  { key: 'nav.how', href: '#how' },
  { key: 'nav.tech', href: '#tech' },
  { key: 'nav.faq', href: '#faq' },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

/**
 * Ставка: чем больше оборот, тем меньше %. Базовая 12% при 1 млн ₽,
 * минимум 9% на 100+ млн ₽. Формула ТЗ:
 * rate = clamp(12 - 3 * log10(volume / 1_000_000) / log10(100), 9, 12)
 */
function calcRate(volumeMillions: number) {
  const raw = 12 - (3 * Math.log10(volumeMillions)) / Math.log10(100);
  return Math.min(12, Math.max(9, raw));
}

function pick(label: string, language: 'ru' | 'en') {
  if (!label.includes('|')) return label;
  const [ru, en] = label.split('|');
  return language === 'en' ? en : ru;
}

const conditions = [
  { titleKey: 'cond.geo.title', descKey: 'cond.geo.desc', icon: Globe2 },
  { titleKey: 'cond.payin.title', descKey: 'cond.payin.desc', icon: Wallet },
  { titleKey: 'cond.limit.title', descKey: 'cond.limit.desc', icon: CircleDollarSign },
  { titleKey: 'cond.rate.title', descKey: 'cond.rate.desc', icon: PercentTag },
  { titleKey: 'cond.payout.title', descKey: 'cond.payout.desc', icon: Zap },
  { titleKey: 'cond.chargeback.title', descKey: 'cond.chargeback.desc', icon: ShieldCheck },
  { titleKey: 'cond.api.title', descKey: 'cond.api.desc', icon: KeyRound },
  { titleKey: 'cond.support.title', descKey: 'cond.support.desc', icon: BriefcaseBusiness },
] as const;

const conditionsData = {
  ru: {
    'cond.geo.title': 'Гео',
    'cond.geo.desc': 'Карты РФ, СБП и P2P-каналы в одном потоке.',
    'cond.payin.title': 'Pay-In + Pay-Out',
    'cond.payin.desc': 'Всё под одним процессингом и логами.',
    'cond.limit.title': 'Стартовый лимит',
    'cond.limit.desc': 'До $50k/день на старте с ростом по объёму.',
    'cond.rate.title': 'Ставка от 10%',
    'cond.rate.desc': 'Прозрачные тарифы без скрытых сборов.',
    'cond.payout.title': 'Мгновенные выплаты',
    'cond.payout.desc': 'Средства на выходе в течение минуты.',
    'cond.chargeback.title': '0% чарджбэк',
    'cond.chargeback.desc': 'Система риска и мониторинг платежей в реальном времени.',
    'cond.api.title': 'API + вебхуки',
    'cond.api.desc': 'Подключение через API, webhook-и и структуру логов.',
    'cond.support.title': 'Поддержка 24/7',
    'cond.support.desc': 'Менеджер по интеграции всегда на связи.',
  },
  en: {
    'cond.geo.title': 'Coverage',
    'cond.geo.desc': 'RU cards, SBP and P2P channels in a single flow.',
    'cond.payin.title': 'Pay-In + Pay-Out',
    'cond.payin.desc': 'Everything under one processing engine and logs.',
    'cond.limit.title': 'Starting limit',
    'cond.limit.desc': 'Up to $50k/day at launch, growing with volume.',
    'cond.rate.title': 'Rates from 10%',
    'cond.rate.desc': 'Transparent pricing with no hidden fees.',
    'cond.payout.title': 'Instant payouts',
    'cond.payout.desc': 'Funds paid out within a minute.',
    'cond.chargeback.title': '0% chargeback',
    'cond.chargeback.desc': 'Risk engine and real-time payment monitoring.',
    'cond.api.title': 'API + webhooks',
    'cond.api.desc': 'Integration via API, webhooks and structured logs.',
    'cond.support.title': '24/7 support',
    'cond.support.desc': 'Your integration manager is always available.',
  },
};

const solutions = [
  { titleKey: 'sol.gaming.title', descKey: 'sol.gaming.desc', tags: ['Pay-In', 'Pay-Out', 'Мгновенно|Instant'], icon: Gamepad2 },
  { titleKey: 'sol.bookmaker.title', descKey: 'sol.bookmaker.desc', tags: ['Live', 'Логи|Logs', 'API'], icon: Trophy },
  { titleKey: 'sol.crypto.title', descKey: 'sol.crypto.desc', tags: ['USDT', 'P2P', 'OTC'], icon: Bitcoin },
  { titleKey: 'sol.exchange.title', descKey: 'sol.exchange.desc', tags: ['Резерв|Reserve', 'Скорость|Speed', 'Гибкость|Flexible'], icon: Repeat2 },
] as const;

const solutionsData = {
  ru: {
    'sol.gaming.title': 'iGaming & Казино',
    'sol.gaming.desc': 'Приём ставок, пополнения и быстрые выплаты игрокам.',
    'sol.bookmaker.title': 'Букмекерские компании',
    'sol.bookmaker.desc': 'Депозиты и выплаты без задержек в пиковые часы.',
    'sol.crypto.title':'Крипто-площадки & OTC',
    'sol.crypto.desc': 'Режимы для биткоин-операций и офлайн обмена.',
    'sol.exchange.title': 'Обменники и сервисы',
    'sol.exchange.desc': 'Гибкие лимиты для платёжных продуктов и каскадных схем.',
  },
  en: {
    'sol.gaming.title': 'iGaming & Casinos',
    'sol.gaming.desc': 'Bet acceptance, top-ups and fast player payouts.',
    'sol.bookmaker.title': 'Bookmakers',
    'sol.bookmaker.desc': 'Deposits and payouts without delays at peak hours.',
    'sol.crypto.title': 'Crypto platforms & OTC',
    'sol.crypto.desc': 'Modes for bitcoin operations and offline exchange.',
    'sol.exchange.title': 'Exchangers & services',
    'sol.exchange.desc': 'Flexible limits for payment products and cascading schemes.',
  },
};

const steps = [
  { number: '01', titleKey: 'step.1.title', descKey: 'step.1.desc', icon: FileText },
  { number: '02', titleKey: 'step.2.title', descKey: 'step.2.desc', icon: KeyRound },
  { number: '03', titleKey: 'step.3.title', descKey: 'step.3.desc', icon: Sparkles },
  { number: '04', titleKey: 'step.4.title', descKey: 'step.4.desc', icon: Building2 },
] as const;

const stepsData = {
  ru: {
    'step.1.title': 'Оставляете заявку',
    'step.1.desc': 'Заполните форму и менеджер свяжется за 15 минут.',
    'step.2.title': 'Подключаем API',
    'step.2.desc': 'Интеграция и настройка логики в течение рабочего дня.',
    'step.3.title': 'Тестовый период',
    'step.3.desc': 'Проверяем поток и запускаем лимит до $5k/день.',
    'step.4.title': 'Полный доступ',
    'step.4.desc': 'Расширяем лимиты до $50k+ и масштабируем под рост.',
  },
  en: {
    'step.1.title': 'Submit a request',
    'step.1.desc': 'Fill in the form and a manager will reach out in 15 minutes.',
    'step.2.title': 'We connect the API',
    'step.2.desc': 'Integration and logic setup within one business day.',
    'step.3.title': 'Trial period',
    'step.3.desc': 'We test the flow and launch a limit up to $5k/day.',
    'step.4.title': 'Full access',
    'step.4.desc': 'We raise limits to $50k+ and scale with your growth.',
  },
};

const techPointKeys: TranslationKey[] = ['tech.point1', 'tech.point2', 'tech.point3'];

const faqs = [
  { qKey: 'faq.1.q', aKey: 'faq.1.a' },
  { qKey: 'faq.2.q', aKey: 'faq.2.a' },
  { qKey: 'faq.3.q', aKey: 'faq.3.a' },
  { qKey: 'faq.4.q', aKey: 'faq.4.a' },
  { qKey: 'faq.5.q', aKey: 'faq.5.a' },
  { qKey: 'faq.6.q', aKey: 'faq.6.a' },
  { qKey: 'faq.7.q', aKey: 'faq.7.a' },
  { qKey: 'faq.8.q', aKey: 'faq.8.a' },
] as const;

const faqData = {
  ru: {
    'faq.1.q': 'Какой минимальный объём для подключения?',
    'faq.1.a': 'Стартовый лимит до $50,000 USDT в день. По мере работы расширяем до любых сумм.',
    'faq.2.q': 'Как быстро подключаете?',
    'faq.2.a': 'Онбординг занимает 1 рабочий день, включая интеграцию по API. Личный менеджер сопровождает на всех этапах.',
    'faq.3.q': 'Что с чарджбэками?',
    'faq.3.a': '0% чарджбэк. P2P-переводы между физлицами не отменяются банком.',
    'faq.4.q': 'В какой валюте расчёт?',
    'faq.4.a': 'Рубли от клиента → USDT TRC-20 на ваш кошелёк. Конвертация по фиксированному курсу.',
    'faq.5.q': 'Нужен ли ИП/О?',
    'faq.5.a': 'Нет. Мы работаем с проектами без юридического лица. KYC минимальный: подтверждение личности владельца.',
    'faq.6.q': 'Есть ли гарант?',
    'faq.6.a': 'Да, работаем через гаранта Bits.media по договорённости. Снимает 100% рисков первой сделки.',
    'faq.7.q': 'Какой лимит на старте?',
    'faq.7.a': 'До $50,000 USDT в день на одного мерчанта. Расширяем по итогам работы.',
    'faq.8.q': 'Что если клиент не оплатил?',
    'faq.8.a': 'Заявка автоматически закрывается через 15 минут. Деньги не списываются.',
  },
  en: {
    'faq.1.q': 'What is the minimum volume to get started?',
    'faq.1.a': 'A starting limit of up to $50,000 USDT per day. As you work with us we expand it to any amount.',
    'faq.2.q': 'How fast is onboarding?',
    'faq.2.a': 'Onboarding takes 1 business day, including API integration. A personal manager supports you at every step.',
    'faq.3.q': 'What about chargebacks?',
    'faq.3.a': '0% chargeback. P2P transfers between individuals cannot be reversed by the bank.',
    'faq.4.q': 'What currency is settlement in?',
    'faq.4.a': 'Rubles from the client → USDT TRC-20 to your wallet. Conversion at a fixed rate.',
    'faq.5.q': 'Do I need a legal entity?',
    'faq.5.a': 'No. We work with projects without a legal entity. KYC is minimal: confirmation of the owner\u2019s identity.',
    'faq.6.q': 'Is there an escrow?',
    'faq.6.a': 'Yes, we work through the Bits.media escrow by agreement. It removes 100% of first-deal risk.',
    'faq.7.q': 'What is the starting limit?',
    'faq.7.a': 'Up to $50,000 USDT per day per merchant. We expand it based on results.',
    'faq.8.q': 'What if the client does not pay?',
    'faq.8.a': 'The request is automatically closed after 15 minutes. No funds are charged.',
  },
};

const footerColumns = [
  {
    titleKey: 'footer.product' as TranslationKey,
    items: [
      { label: 'Pay-In', href: '#conditions' },
      { label: 'Pay-Out', href: '#conditions' },
      { label: 'API', href: '#tech' },
      { label: 'Webhooks', href: '#tech' },
      { label: 'Калькулятор|Calculator', href: '#calc' },
      { label: 'Условия|Terms', href: '#conditions' },
    ],
  },
  {
    titleKey: 'footer.company' as TranslationKey,
    items: [
      { label: 'О нас|About us', href: '#' },
      { label: 'Решения|Solutions', href: '#solutions' },
      { label: 'Клиенты|Clients', href: '#' },
      { label: 'Блог|Blog', href: '#' },
      { label: 'Кейсы|Case studies', href: '#' },
      { label: 'Контакты|Contacts', href: '#' },
    ],
  },
  {
    titleKey: 'footer.support' as TranslationKey,
    items: [
      { label: '@SorsPay (TG)', href: telegramUrl, external: true },
      { label: `Email: ${supportEmail}`, href: `mailto:${supportEmail}`, external: true },
      { label: 'FAQ', href: '#faq' },
      { label: 'Документация|Documentation', href: '#' },
      { label: 'Статус|Status', href: '#' },
    ],
  },
  {
    titleKey: 'footer.legal' as TranslationKey,
    items: [
      { label: 'Публичная оферта|Public offer', href: '#' },
      { label: 'Правила|Rules', href: '#' },
      { label: 'AML/KYC', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Cookies', href: '#' },
    ],
  },
];
// orphanОО?`



function PercentTag(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M8 8h.01M16 16h.01M8 16l8-8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7" cy="7" r="3" />
      <circle cx="17" cy="17" r="3" />
    </svg>
  );
}

function LanguageSwitch() {
  const { language, setLanguage } = useTranslation();
  return (
    <div className="hidden items-center rounded-xl border-white/10 bg-white/3 p-0.5 text-xs font-medium sm:inline-flex">
      {(['ru', 'en'] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLanguage(code)}
          aria-pressed={language === code}
          className={`rounded-lg px-2.5 py-1.5 uppercase transition ${
            language === code ? 'bg-white/10 text-white' : 'text-text-muted hover:text-text-primary'
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

/** Декоративный фон секции заявки: сетка, узлы, blockchain-линии. */
function FormBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(139,92,246,0.18),_transparent_45%),radial-gradient(circle_at_80%_70%,_rgba(6,182,212,0.14),_transparent_45%)] opacity-70" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:44px_44px] opacity-[0.12] [mask-image:radial-gradient(circle_at_center,black_30%,transparent_80%)]" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.14]" xmlns="http://www.w3.org/2000/svg">
        <line x1="8%" y1="18%" x2="34%" y2="42%" stroke="#8b5cf6" strokeWidth="1" />
        <line x1="34%" y1="42%" x2="64%" y2="26%" stroke="#06b6d4" strokeWidth="1" />
        <line x1="64%" y1="26%" x2="90%" y2="48%" stroke="#8b5cf6" strokeWidth="1" />
        <line x1="20%" y1="78%" x2="52%" y2="62%" stroke="#06b6d4" strokeWidth="1" />
        <line x1="52%" y1="62%" x2="82%" y2="84%" stroke="#8b5cf6" strokeWidth="1" />
        <circle cx="8%" cy="18%" r="4" fill="#8b5cf6" />
        <circle cx="34%" cy="42%" r="5" fill="#06b6d4" />
        <circle cx="64%" cy="26%" r="4" fill="#8b5cf6" />
        <circle cx="90%" cy="48%" r="5" fill="#06b6d4" />
        <circle cx="20%" cy="78%" r="4" fill="#06b6d4" />
        <circle cx="52%" cy="62%" r="5" fill="#8b5cf6" />
        <circle cx="82%" cy="84%" r="4" fill="#8b5cf6" />
      </svg>
      <CreditCard className="absolute right-[8%] top-[16%] h-24 w-24 text-violet-400 opacity-[0.10] blur-[1px]" />
      <Link2 className="absolute bottom-[14%] left-[10%] h-20 w-20 text-cyan-300 opacity-[0.10] blur-[1px]" />
      <Bitcoin className="absolute bottom-[22%] right-[16%] h-20 w-20 text-violet-300 opacity-[0.08] blur-[1px]" />
      <Send className="absolute left-[42%] top-[10%] h-16 w-16 text-cyan-200 opacity-[0.08] blur-[1px]" />
      <div className="absolute -left-24 top-1/3 h-56 w-56 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-cyan-500/15 blur-3xl" />
    </div>
  );
}

function SectionIntro({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-10 text-center md:mb-12">
      {eyebrow ? <p className="mb-3 text-xs uppercase tracking-[0.22em] text-text-muted">{eyebrow}</p> : null}
      <h2 className="text-3xl font-semibold tracking-[-0.05em] text-text-primary md:text-5xl">{title}</h2>
      {subtitle ? <p className="mx-auto mt-4 max-w-2xl text-base text-text-muted md:text-lg">{subtitle}</p> : null}
    </div>
  );
}

export default function Page() {
  const { language, t } = useTranslation();

  const [chartData, setChartData] = useState([
    { name: '00:00', value: 68 },
    { name: '04:00', value: 72 },
    { name: '08:00', value: 78 },
    { name: '12:00', value: 88 },
    { name: '16:00', value: 84 },
    { name: '20:00', value: 96 },
  ]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState([42]);
  const volume = sliderValue[0];
  const rate = calcRate(volume);

  const [formData, setFormData] = useState({
    projectName: '',
    site: '',
    projectType: 'casino',
    volume: '5-20',
    telegram: '',
  });

  const isFormValid =
    formData.projectName.trim().length > 0 &&
    formData.site.trim().length > 0 &&
    formData.projectType.trim().length > 0 &&
    formData.volume.trim().length > 0 &&
    formData.telegram.trim().startsWith('@') &&
    formData.telegram.trim().length > 1;

  const data = language === 'en' ? conditionsData.en : conditionsData.ru;
  const solData = language === 'en' ? solutionsData.en : solutionsData.ru;
  const stepData = language === 'en' ? stepsData.en : stepsData.ru;
  const faqText = language === 'en' ? faqData.en : faqData.ru;

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prev) => {
        const next = [...prev];
        const last = next[next.length - 1]?.value ?? 75;
        const newValue = Math.max(56, Math.min(118, last + Math.round((Math.random() - 0.45) * 16)));
        const nextEntry = {
          name: `${String(next.length + 1).padStart(2, '0')}:00`,
          value: newValue,
        };
        return [...next.slice(1), nextEntry];
      });

    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  const areaGradient = useMemo(
    () => ({
      id: 'chartFill',
      stop1: '#8b5cf6',
      stop2: '#06b6d4',
    }),
    []
  );

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  if (!isFormValid || isSubmitting) return;

  setIsSubmitting(true);
  try {
    await sendLeadToTelegram({
      projectName: formData.projectName.trim(),
      site: formData.site.trim(),
      projectType: formData.projectType,
      volume: formData.volume,
      telegram: formData.telegram.trim(),
    });

    setIsModalOpen(true);
    setFormData({ projectName: '', site: '', projectType: 'casino', volume: '5-20', telegram: '' });
  } catch (err) {
    console.error('Lead send failed:', err);
    setToast('Не удалось отправить. Напишите нам в TG: @SorsPay');
  } finally {
    setIsSubmitting(false);
  }
}
  return (
    <main className="relative overflow-x-hidden text-text-primary">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
        <img
          src="/favicon.png"
          alt="SorsPay"
          className="h-9 w-9 rounded-lg object-cover ring-1 ring-white/10"
        />
            <div>
              <div className="text-lg font-semibold tracking-[-0.04em] text-text-primary">SorsPay</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-text-muted">P2P Processing</div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-text-muted md:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition-colors hover:text-text-primary">
                {t(item.key)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitch />
            <Button asChild size="default" className="hidden sm:inline-flex">
              <a href={telegramUrl} target="_blank" rel="noreferrer">
                {t('header.connect')}
              </a>
            </Button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/3 text-text-primary md:hidden"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {isMenuOpen ? (
          <div className="border-t border-white/10 bg-background/90 px-4 py-4 backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-2 py-2 text-text-muted transition hover:bg-white/5 hover:text-text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t(item.key)}
                </a>
              ))}
              <Button asChild className="mt-2 w-full">
                <a href={telegramUrl} target="_blank" rel="noreferrer">
                  {t('header.connect')}
                </a>
              </Button>
            </div>
          </div>
        ) : null}
      </header>

      <section className="mx-auto flex min-h-[100vh] max-w-[1280px] flex-col px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-14">
        <div className="grid items-center gap-8 lg:grid-cols-[1.5fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-[760px]"
          >
            <Badge variant="accent" className="mb-6 inline-flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]" />
              P2P-процессинг для iGaming
            </Badge>

            <h1 className="text-[2.7rem] font-semibold leading-[0.95] tracking-[-0.07em] text-text-primary sm:text-[4rem] lg:text-[4.5rem] xl:text-[5rem]">
              {t('hero.titlePre')} <span className="text-gradient">{t('hero.titleAccent')}</span> {t('hero.titlePost')}
            </h1>

            <p className="mt-6 max-w-[640px] text-lg text-text-muted md:text-[1.12rem]">
              {t('hero.subtitle')}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="gap-2">
                <a href={telegramUrl} target="_blank" rel="noreferrer">
                  {t('hero.ctaPrimary')} <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="ghost" size="lg" className="gap-2">
                <a href={telegramUrl} target="_blank" rel="noreferrer">
                  {t('hero.ctaSecondary')} <ChevronRight className="h-4 w-4" />
                </a>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {[t('hero.tag1'), t('hero.tag2'), t('hero.tag3')].map((item) => (
                <div key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-text-muted">
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-r from-accent-1/25 via-accent-2/10 to-transparent blur-3xl" />
            <div className="relative rounded-[28px] border border-border/80 bg-[#0f1017]/80 p-4 shadow-[0_0_50px_rgba(139,92,246,0.16)] backdrop-blur-xl sm:p-5">
              <div className="mb-4 flex items-center justify-between px-2">
                <div>
                  <div className="text-sm text-text-muted">{t('hero.chartTitle')}</div>
                  <div className="mt-1 text-2xl font-semibold text-text-primary">{t('hero.chartValue')}</div>
                </div>
                <Badge variant="success">{t('hero.live')}</Badge>
              </div>

              <div className="h-[280px] w-full rounded-2xl border border-white/[0.06] bg-white/[0.03] p-2 shadow-[0_0_35px_rgba(139,92,246,0.12)]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id={areaGradient.id} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={areaGradient.stop1} stopOpacity={0.7} />
                        <stop offset="95%" stopColor={areaGradient.stop2} stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#8b8b95', fontSize: 11 }} />
                    <YAxis hide domain={[50, 120]} />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(15,15,20,0.96)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        color: '#f5f5f7',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="url(#chartFill)"
                      strokeWidth={3}
                      fill="url(#chartFill)"
                      activeDot={{ r: 5, fill: '#06b6d4', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-5 grid gap-3 border-t border-white/[0.08] pt-5 sm:grid-cols-2">
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-text-muted">{t('hero.avgCheck')}</p>
                  <div className="mt-2 flex items-end gap-2">
                    <span className="text-xl font-semibold text-text-primary">{t('hero.avgCheckValue')}</span>
                    <span className="mb-1 text-xs text-emerald-300">{t('hero.avgCheckDelta')}</span>
                  </div>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-text-muted">{t('hero.successP2P')}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xl font-semibold text-text-primary">{t('hero.successValue')}</span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="conditions" className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8">
        <SectionIntro eyebrow={t('nav.conditions')} title={t('conditions.title')} subtitle={t('conditions.subtitle')} />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {conditions.map(({ titleKey, descKey, icon: Icon }, index) => (
            <motion.div
              key={titleKey}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
              className="group rounded-[24px] border border-white/[0.08] bg-white/[0.02] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-[0_0_28px_rgba(139,92,246,0.16)] hover:bg-white/[0.03]"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-1/20 to-accent-2/20 text-accent-2 ring-1 ring-white/10">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-medium text-white/90">{data[titleKey]}</h3>
              <p className="mt-3 text-sm leading-6 text-white/60">{data[descKey]}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="solutions" className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8">
        <SectionIntro eyebrow={t('solutions.subtitle')} title={t('solutions.title')} />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {solutions.map(({ titleKey, descKey, tags, icon: Icon }, index) => (
            <motion.div
              key={titleKey}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="group rounded-[24px] border border-white/[0.08] bg-white/[0.02] p-5 transition-all duration-300 hover:-translate-y-2 hover:border-violet-500/40 hover:shadow-[0_0_28px_rgba(139,92,246,0.16)] hover:bg-white/[0.03]"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-1/20 to-accent-2/20 text-accent-1 ring-1 ring-white/10 group-hover:text-accent-2">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-medium text-white/90">{solData[titleKey]}</h3>
              <p className="mt-3 text-sm leading-6 text-white/60">{solData[descKey]}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="default" className="bg-white/5 text-[10px] uppercase tracking-[0.12em] text-white/60">
                    {tag}
                  </Badge>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="how" className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8">
        <SectionIntro eyebrow={t('nav.how')} title={t('how.title')} subtitle={t('how.subtitle')} />

        <div className="grid gap-4 lg:grid-cols-4">
          {steps.map(({ number, titleKey, descKey, icon: Icon }, index) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="rounded-[24px] border border-border bg-white/[0.02] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-[0_0_28px_rgba(139,92,246,0.16)]"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="text-4xl font-semibold tracking-[-0.06em] text-gradient">{number}</div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-1/20 to-accent-2/20 text-accent-2">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-xl font-medium text-white/90">{stepData[titleKey]}</h3>
              <p className="mt-3 text-sm leading-6 text-white/60">{stepData[descKey]}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="tech" className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8">
        <SectionIntro eyebrow="SorsPay Engine" title={t('tech.title')} subtitle={t('tech.subtitle')} />

        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {techPointKeys.map((key) => (
              <div key={key} className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 backdrop-blur transition hover:border-violet-500/40">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                <p className="text-base text-white/90">{t(key)}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-[28px] border border-border bg-[#101118] p-6 shadow-[0_0_50px_rgba(6,182,212,0.08)]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.16),_transparent_42%)]" />
            <div className="relative">
              <div className="mb-8 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-text-muted">
                <span>{t('tech.buyer')}</span>
                <span>{t('tech.engine')}</span>
                <span>{t('tech.merchant')}</span>
              </div>

              <div className="relative mx-auto flex max-w-[620px] items-center justify-between gap-4 px-3 py-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-text-primary">
                  <Wallet className="h-6 w-6 text-accent-1" />
                </div>
                <div className="flex-1">
                  <div className="relative h-1 rounded-full bg-gradient-to-r from-accent-1 via-violet-400 to-accent-2">
                    <motion.div
                      className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-accent-2 shadow-[0_0_20px_rgba(6,182,212,0.75)]"
                      animate={{ x: ['0%', '100%', '120%', '0%'] }}
                      transition={{ duration: 4, ease: 'linear', repeat: Infinity }}
                      style={{ width: '18px', height: '18px' }}
                    />
                  </div>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-text-primary">
                  <Bolt className="h-6 w-6 text-accent-2" />
                </div>
                <div className="flex-1">
                  <div className="relative h-1 rounded-full bg-gradient-to-r from-accent-2 via-cyan-400 to-accent-1">
                    <motion.div
                      className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-accent-1 shadow-[0_0_20px_rgba(139,92,246,0.75)]"
                      animate={{ x: ['0%', '100%', '130%', '0%'] }}
                      transition={{ duration: 4.8, ease: 'linear', repeat: Infinity, delay: 1 }}
                      style={{ width: '18px', height: '18px' }}
                    />
                  </div>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-text-primary">
                  <BriefcaseBusiness className="h-6 w-6 text-accent-1" />
                </div>
              </div>

              <div className="mt-8 grid gap-3 md:grid-cols-3">
                {['Buyer', 'SorsPay Engine', 'Merchant'].map((node, idx) => (
                  <div key={node} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-center text-sm text-text-muted">
                    <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-text-muted">{idx + 1}</span>
                    {node}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="calc" className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8">
        <SectionIntro eyebrow={t('nav.calc')} title={t('calc.title')} subtitle={t('calc.subtitle')} />

        <div className="rounded-[28px] border border-border bg-white/[0.02] p-5 backdrop-blur-xl md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr] lg:items-center">
            <div>
              <div className="mb-3 flex items-center justify-between text-sm text-text-muted">
                <span>{t('calc.volumeLabel')}</span>
                <span className="font-medium text-text-primary">{sliderValue[0]} {t('calc.volumeMln')}</span>
              </div>
              <Slider value={sliderValue} onValueChange={setSliderValue} max={100} min={1} step={1} className="mb-4" />
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>{t('calc.minRange')}</span>
                <span>{t('calc.maxRange')}</span>
              </div>
            </div>

            <Card className="!rounded-[22px] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm text-text-muted">{t('calc.yourRate')}</p>
              <div className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-gradient">
                {rate.toFixed(1)}%
              </div>
              <div className="mt-4 h-px bg-white/10" />
              <p className="mt-4 text-sm leading-6 text-white/60">{t('calc.note')}</p>
            </Card>
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8">
        <SectionIntro eyebrow="FAQ" title={t('faq.title')} subtitle={t('faq.subtitle')} />

        <Accordion type="single" collapsible className="mx-auto max-w-4xl space-y-3">
          {faqs.map((item) => (
            <AccordionItem
              key={item.qKey}
              value={item.qKey} className="rounded-2xl border border-border bg-surface/60 px-4 transition-all duration-300 hover:border-violet-500/40 hover:bg-white/[0.03]">
              <AccordionTrigger className="group gap-4 text-left text-lg text-white/90">
                {faqText[item.qKey]}
              </AccordionTrigger>
              <AccordionContent className="text-white/60">{faqText[item.aKey]}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[32px] border-white/[0.08] bg-[linear-gradient(135deg,#0a0a1f_0%,#1a0a2e_50%,#0a0a0f_100%)] shadow-[0_0_60px_rgba(139,92,246,0.12)] px-5 py-10 md:px-8 md:py-12">
          <FormBackdrop />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.18em] text-text-muted">
                <Sparkles className="h-4 w-4 text-accent-2" />
                {t('form.badge')}
              </div>
              <h2 className="text-3xl font-semibold tracking-[-0.06em] text-white md:text-5xl">
                {t('form.title')}
              </h2>
              <p className="mt-4 text-base text-white/60 md:text-lg">{t('form.subtitle')}</p>
              <div className="mt-6 flex-wrap gap-3 text-xs text-white/50">
                <span className="inline-flex items-center gap-2 rounded-full border-white/[0.08] bg-white/[0.03] px-3 py-2">
                  <Send className="h-3.5 w-3.5 text-accent-2" /> @SorsPay
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border-white/[0.08] bg-white/[0.03] px-3 py-2">
                  <Mail className="h-3.5 w-3.5 text-accent-2" /> {supportEmail}
                </span>
              </div>
              </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-[26px] border-white/[0.1] bg-white/[0.03] p-5 shadow-[0_0_45px_rgba(139,92,246,0.12)] backdrop-blur-xl md:p-6"
            >
              <div>
                <label className="mb-2 block text-sm text-white/60">{t('form.projectName')}</label>
                <Input
                  value={formData.projectName}
                  onChange={(e) => handleChange('projectName', e.target.value)}
                  placeholder={t('form.projectNamePlaceholder')}
                  className="bg-white text-black placeholder:text-gray-500 border-gray-300"
                />
              </div>
                <div>
                  <label className="mb-2 block text-sm text-white/60">{t('form.site')}</label>
                  <Input
                  value={formData.site}
                  onChange={(e) => handleChange('site', e.target.value)}
                  placeholder={t('form.sitePlaceholder')}
                  className="bg-white text-black placeholder:text-gray-500 border-gray-300"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/60">{t('form.projectType')}</label>
                  <Select value={formData.projectType} onValueChange={(value) => handleChange('projectType', value)}>
                    <SelectTrigger className="bg-white text-black border-gray-300">
                     <SelectValue placeholder={t('form.projectTypePlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casino">{pick('Казино|Casino', language)}</SelectItem>
                      <SelectItem value="bookmaker">{pick('БК|Bookmaker', language)}</SelectItem>
                      <SelectItem value="exchange">{pick('Обменник|Exchanger', language)}</SelectItem>
                      <SelectItem value="other">{pick('Другое|Other', language)}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/60">{t('form.volume')}</label>
                <Select value={formData.volume} onValueChange={(value) => handleChange('volume', value)}>
                  <SelectTrigger className="bg-white text-black border-gray-300">
                    <SelectValue placeholder={t('form.volumePlaceholder')} />
                  </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<5">{pick('до 5 млн ₽/мес|< 5 M ₽/mo', language)}</SelectItem>
                      <SelectItem value="5-20">{pick('5-20 млн ₽/мес|5-20 M ₽/mo', language)}</SelectItem>
                      <SelectItem value="20-100">{pick('20-100 млн ₽/мес|20-100 M ₽/mo', language)}</SelectItem>
                      <SelectItem value="100+">{pick('100+ млн ₽/мес|100+ M ₽/mo', language)}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              <div>
                <label className="mb-2 block text-sm text-white/60">{t('form.telegram')}</label>
                <Input
                  value={formData.telegram}
                  onChange={(e) => handleChange('telegram', e.target.value)}
                  placeholder={t('form.telegramPlaceholder')}
                  className="bg-white text-black placeholder:text-gray-500 border-gray-300"
                />
                {formData.telegram.length > 0 && !formData.telegram.trim().startsWith('@') ? (
                  <p className="mt-2 text-xs text-rose-300">{t('form.errorTelegram')}</p>
                ) : null}
              </div>

              <Button type="submit" disabled={!isFormValid || isSubmitting} className="mt-5 w-full justify-center !text-base">
                {isSubmitting ? t('form.submitting') : t('form.submit')}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#0b0d12]">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.7fr_0.7fr_0.7fr_0.8fr] lg:px-8">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <img
                src="/favicon.png"
                alt="SorsPay"
                className="h-9 w-9 rounded-lg object-cover ring-1 ring-white/10"
               />
              <div className="text-xl font-semibold">SorsPay</div>
            </div>
            <p className="max-w-xs text-sm leading-6 text-white/60">{t('footer.description')}</p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={telegramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Telegram"
                className="flex h-9 w-9 items-center justify-center rounded-xl border-white/[0.1] bg-white/[0.03] text-white/70 transition hover:border-violet-500/40 hover:text-white"
              >
                <Send className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${supportEmail}`}
                aria-label="Email"
                className="flex h-9 w-9 items-center justify-center rounded-xl border-white/[0.1] bg-white/[0.03] text-white/70 transition hover:border-violet-500/40 hover:text-white"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.titleKey}>
              <h3 className="mb-4 text-sm uppercase tracking-[0.18em] text-white/50">{t(column.titleKey)}</h3>
              <ul className="space-y-3 text-sm text-white/60">
                {column.items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noreferrer' : undefined}
                      className="transition hover:text-white/90"
                    >
                      {pick(item.label, language)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-4 border-t border-white/10 px-4 py-5 text-sm text-white/50 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-4">
            <span>{t('footer.copyright')}</span>
            <span className="hidden text-white/25 sm:inline">•</span>
            <span>{t('footer.tagline')}</span>
          </div>
          <div className="flex items-center gap-4">
            <a href={telegramUrl} target="_blank" rel="noreferrer" className="transition hover:text-white/90">
              @SorsPay
            </a>
            <a href={`mailto:${supportEmail}`} className="transition hover:text-white/90">
              {supportEmail}
            </a>
          </div>
        </div>
      </footer>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">{t('form.thanksTitle')}</DialogTitle>
            <DialogDescription>{t('form.thanksText')}</DialogDescription>
          </DialogHeader>
          <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
            {t('form.thanksBody')}
          </div>
          <Button onClick={() => setIsModalOpen(false)} className="mt-5 w-full">
            {t('form.close')}
          </Button>
        </DialogContent>
      </Dialog>

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-md -translate-x-1/2">
          <div className="flex items-center gap-3 rounded-2xl border-rose-500/30 bg-[#1a0f14]/95 px-4 py-3 text-sm text-rose-200 shadow-[0_0_35px_rgba(244,63,94,0.2)] backdrop-blur-xl">
            <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-rose-400" />
            <span className="flex-1">{toast}</span>
            <button type="button" onClick={() => setToast(null)} aria-label="Close" className="opacity-70 transition hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
