'use client';

import * as React from 'react';

export type Language = 'ru' | 'en';

/**
 * Все тексты лендинга в обоих языках.
 * Ключ → [ru, en].
 */
export const translations = {
  ru: {
    // Header
    'nav.conditions': 'Условия',
    'nav.calc': 'Калькулятор',
    'nav.how': 'Как работает',
    'nav.tech': 'Для разработчиков',
    'nav.faq': 'FAQ',
    'header.connect': 'Подключить',
    'header.langLabel': 'RU / EN',

    // Hero
    'hero.badge': 'P2P-процессинг для iGaming',
    'hero.titlePre': 'P2P-процессинг для',
    'hero.titleAccent': 'казино',
    'hero.titlePost': 'и ставок',
    'hero.subtitle': 'Карты РФ + СБП. Ставка от 10%. Выплаты мгновенно. Расчёт в USDT TRC-20.',
    'hero.ctaPrimary': 'Подключить',
    'hero.ctaSecondary': 'Узнать условия',
    'hero.tag1': '0% чарджбэк',
    'hero.tag2': '3-5 мин зачисление',
    'hero.tag3': 'USDT TRC-20',
    'hero.chartTitle': 'Конверсия за сутки',
    'hero.chartValue': '+28.4%',
    'hero.live': 'Live',
    'hero.avgCheck': 'Средний чек',
    'hero.avgCheckValue': '12 850 ₽',
    'hero.avgCheckDelta': '↗ 8%',
    'hero.successP2P': 'Успешных P2P',
    'hero.successValue': '99.2%',

    // Conditions
    'conditions.title': 'Что мы предлагаем',
    'conditions.subtitle': 'Готовая инфраструктура для приёма и выплаты средств в iGaming и платёжных сервисах.',

    // Solutions
    'solutions.title': 'Решения для вашего бизнеса',
    'solutions.subtitle': 'Gambling-решения под ваш бизнес-модель и активный рост трафика.',

    // How
    'how.title': 'Как начать работу',
    'how.subtitle': 'Простой путь от заявки до полного доступа и роста оборотов.',

    // Tech
    'tech.title': 'Почему SorsPay',
    'tech.subtitle': 'Инфраструктура, которая работает в режимах высокой нагрузки и росте объёмов.',
    'tech.point1': 'Мгновенная обработка — P2P-автокаскад',
    'tech.point2': 'Личный менеджер 24/7 в Telegram',
    'tech.point3': 'Полная админ-панель с логами операций',
    'tech.buyer': 'Buyer',
    'tech.engine': 'SorsPay Engine',
    'tech.merchant': 'Merchant',

    // Calculator
    'calc.title': 'Калькулятор',
    'calc.subtitle': 'Оценка базовой ставки при заданном месячном обороте.',
    'calc.volumeLabel': 'Месячный оборот',
    'calc.volumeMln': 'млн ₽',
    'calc.minRange': '1 млн ₽',
    'calc.maxRange': '100 млн ₽',
    'calc.yourRate': 'Ваша ставка',
    'calc.note': 'Базовая ставка 12%. Для объёмов свыше 100 млн ₽/мес — индивидуальный тариф.',

    // FAQ
    'faq.title': 'FAQ',
    'faq.subtitle': 'Вопросы, которые задают чаще всего при старте процесса.',

    // Form / lead
    'form.badge': 'Подключение без бюрократии',
    'form.title': 'Начните принимать платежи сегодня',
    'form.subtitle': 'Оставьте заявку — ответим в Telegram в течение 15 минут',
    'form.projectName': 'Название проекта',
    'form.projectNamePlaceholder': 'SorsPay Casino',
    'form.site': 'Сайт или Telegram-бот',
    'form.sitePlaceholder': 'site.ru / @bot',
    'form.projectType': 'Тип проекта',
    'form.projectTypePlaceholder': 'Выберите тип',
    'form.volume': 'Ожидаемый оборот',
    'form.volumePlaceholder': 'Выберите объём',
    'form.telegram': 'Ваш Telegram для связи',
    'form.telegramPlaceholder': '@yourhandle',
    'form.submit': 'Отправить заявку',
    'form.submitting': 'Отправляем...',
    'form.errorTelegram': 'Telegram должен начинаться с @',
    'form.thanksTitle': 'Спасибо!',
    'form.thanksText': 'Свяжемся в TG за 15 минут.',
    'form.thanksBody': 'Ваша заявка принята. Мы свяжемся с вами в Telegram в кратчайшие сроки.',
    'form.close': 'Закрыть',
    'form.errorToast': 'Ошибка отправки. Напишите нам в TG: @SorsPay',

    // Footer
    'footer.description': 'P2P-процессинг для цифровых бизнесов и iGaming-проектов.',
    'footer.product': 'ПРОДУКТ',
    'footer.company': 'КОМПАНИЯ',
    'footer.support': 'ПОДДЕРЖКА',
    'footer.legal': 'ЮР. ИНФО',
    'footer.copyright': '© 2026 SorsPay. Все права защищены.',
    'footer.tagline': 'Работаем по РФ. USDT TRC-20. 0% чарджбэк.',
  },
  en: {
    // Header
    'nav.conditions': 'Features',
    'nav.calc': 'Calculator',
    'nav.how': 'How it works',
    'nav.tech': 'For developers',
    'nav.faq': 'FAQ',
    'header.connect': 'Get started',
    'header.langLabel': 'RU / EN',

    // Hero
    'hero.badge': 'P2P processing for iGaming',
    'hero.titlePre': 'P2P processing for',
    'hero.titleAccent': 'casinos',
    'hero.titlePost': 'and betting',
    'hero.subtitle': 'RU cards + SBP. Rates from 10%. Instant payouts. Settled in USDT TRC-20.',
    'hero.ctaPrimary': 'Get started',
    'hero.ctaSecondary': 'See terms',
    'hero.tag1': '0% chargeback',
    'hero.tag2': '3-5 min credit',
    'hero.tag3': 'USDT TRC-20',
    'hero.chartTitle': 'Daily conversion',
    'hero.chartValue': '+28.4%',
    'hero.live': 'Live',
    'hero.avgCheck': 'Average ticket',
    'hero.avgCheckValue': '12 850 ₽',
    'hero.avgCheckDelta': '↗ 8%',
    'hero.successP2P': 'Successful P2P',
    'hero.successValue': '99.2%',

    // Conditions
    'conditions.title': 'What we offer',
    'conditions.subtitle': 'Ready-made infrastructure for accepting and paying out funds in iGaming and payment services.',

    // Solutions
    'solutions.title': 'Solutions for your business',
    'solutions.subtitle': 'Gambling solutions tailored to your business model and rapid traffic growth.',

    // How
    'how.title': 'How to get started',
    'how.subtitle': 'A simple path from application to full access and growing volume.',

    // Tech
    'tech.title': 'Why SorsPay',
    'tech.subtitle': 'Infrastructure built to run under heavy load and growing volumes.',
    'tech.point1': 'Instant processing — P2P auto-cascade',
    'tech.point2': 'Personal manager 24/7 on Telegram',
    'tech.point3': 'Full admin panel with transaction logs',
    'tech.buyer': 'Buyer',
    'tech.engine': 'SorsPay Engine',
    'tech.merchant': 'Merchant',

    // Calculator
    'calc.title': 'Calculator',
    'calc.subtitle': 'Estimate the base rate for a given monthly turnover.',
    'calc.volumeLabel': 'Monthly turnover',
    'calc.volumeMln': 'M ₽',
    'calc.minRange': '1 M ₽',
    'calc.maxRange': '100 M ₽',
    'calc.yourRate': 'Your rate',
    'calc.note': 'Base rate is 12%. For volumes above 100 M ₽/month — individual pricing.',

    // FAQ
    'faq.title': 'FAQ',
    'faq.subtitle': 'Questions asked most often when starting the process.',

    // Form / lead
    'form.badge': 'Onboarding without red tape',
    'form.title': 'Start accepting payments today',
    'form.subtitle': 'Submit a request — we will reply on Telegram within 15 minutes',
    'form.projectName': 'Project name',
    'form.projectNamePlaceholder': 'SorsPay Casino',
    'form.site': 'Website or Telegram bot',
    'form.sitePlaceholder': 'site.com / @bot',
    'form.projectType': 'Project type',
    'form.projectTypePlaceholder': 'Choose a type',
    'form.volume': 'Expected turnover',
    'form.volumePlaceholder': 'Choose a volume',
    'form.telegram': 'Your Telegram for contact',
    'form.telegramPlaceholder': '@yourhandle',
    'form.submit': 'Submit request',
    'form.submitting': 'Sending...',
    'form.errorTelegram': 'Telegram must start with @',
    'form.thanksTitle': 'Thank you!',
    'form.thanksText': 'We will reach out on Telegram within 15 minutes.',
    'form.thanksBody': 'Your request has been received. We will contact you on Telegram shortly.',
    'form.close': 'Close',
    'form.errorToast': 'Sending failed. Message us on TG: @SorsPay',

    // Footer
    'footer.description': 'P2P processing for digital businesses and iGaming projects.',
    'footer.product': 'PRODUCT',
    'footer.company': 'COMPANY',
    'footer.support': 'SUPPORT',
    'footer.legal': 'LEGAL',
    'footer.copyright': '© 2026 SorsPay. All rights reserved.',
    'footer.tagline': 'Operating in RU. USDT TRC-20. 0% chargeback.',
  },
} as const;

export type TranslationKey = keyof (typeof translations)['ru'];

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'sorspay_lang';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = React.useState<Language>('ru');

  // Читаем сохранённый язык при загрузке.
  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'ru' || stored === 'en') {
        setLanguageState(stored);
      }
    } catch {
      /* localStorage недоступен — остаёмся на ru */
    }
  }, []);

  const setLanguage = React.useCallback((next: Language) => {
    setLanguageState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* игнорируем ошибки хранилища */
    }
  }, []);

  const toggleLanguage = React.useCallback(() => {
    setLanguageState((prev) => {
      const next: Language = prev === 'ru' ? 'en' : 'ru';
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* игнорируем */
      }
      return next;
    });
  }, []);

  const t = React.useCallback(
    (key: TranslationKey) => {
      const table = translations[language] ?? translations.ru;
      return (table as Record<string, string>)[key] ?? (translations.ru as Record<string, string>)[key] ?? key;
    },
    [language]
  );

  const value = React.useMemo(
    () => ({ language, setLanguage, toggleLanguage, t }),
    [language, setLanguage, toggleLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useTranslation() {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
