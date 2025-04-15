import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import ru from './locales/ru.json';

export type Locale = 'en' | 'ru';

export const defaultLocale: Locale = 'ru';

const messages = {
  en: en,
  ru: ru,
};

const savedLocale = localStorage.getItem('locale');

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  runtimeOnly: false,
  allowComposition: true,
  locale: savedLocale || defaultLocale,
  fallbackLocale: defaultLocale,
  messages,
  sync: true,
  missingWarn: true,
  fallbackWarn: true,
});

export function setLocale(locale: Locale): void {
  i18n.global.locale.value = locale;
  localStorage.setItem('locale', locale);
  document.querySelector('html')?.setAttribute('lang', locale);
}

export function getLocale(): Locale {
  const currentLocale = localStorage.getItem('locale') || defaultLocale;
  return currentLocale as Locale;
}

export function t(key: string): string {
  const translation = i18n.global.t(key);
  return translation as string;
}

export default i18n;
