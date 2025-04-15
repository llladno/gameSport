import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import ru from './locales/ru.json';

export type Locale = 'en' | 'ru';

export const defaultLocale: Locale = 'ru';

const messages = {
  en: en,
  ru: ru,
};

console.log('Loading i18n with messages:', messages);
console.log('Russian translations sample:', messages.ru.header);

const savedLocale = localStorage.getItem('locale');
console.log('Saved locale:', savedLocale);

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  runtimeOnly: false,
  allowComposition: true,
  locale: savedLocale || defaultLocale,
  fallbackLocale: defaultLocale,
  messages,
  missing: (locale: string, key: string) => {
    console.warn(`Missing translation key: ${key} for locale: ${locale}`);
    // Попробуем получить перевод напрямую из объекта
    const translation = key
      .split('.')
      .reduce(
        (obj: any, k: string) => obj && obj[k],
        messages[locale as keyof typeof messages],
      );
    return translation || key;
  },
  sync: true,
  missingWarn: true,
  fallbackWarn: true,
});

// Добавляем проверку загруженных переводов
const currentLocale = localStorage.getItem('locale') || defaultLocale;
console.log(`Current locale: ${currentLocale}`);
console.log(
  `Translations for current locale:`,
  messages[currentLocale as keyof typeof messages],
);

export function setLocale(locale: Locale): void {
  i18n.global.locale.value = locale;
  localStorage.setItem('locale', locale);
  document.querySelector('html')?.setAttribute('lang', locale);

  // Проверяем доступность переводов после смены языка
  console.log(`Switched to locale: ${locale}`);
  console.log(`Available translations:`, messages[locale]);
}

export function getLocale(): Locale {
  const currentLocale = localStorage.getItem('locale') || defaultLocale;
  return currentLocale as Locale;
}

export function t(key: string): string {
  const translation = i18n.global.t(key);
  if (translation === key) {
    console.warn(`Translation not found for key: ${key}`);
  }
  return translation as string;
}

export default i18n;
