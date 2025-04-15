import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import ru from './locales/ru.json';

export type Locale = 'en' | 'ru';

export const defaultLocale: Locale = 'ru';

console.log('Loading i18n with messages:', { en, ru });

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  runtimeOnly: false,
  allowComposition: true,
  locale: localStorage.getItem('locale') || defaultLocale,
  fallbackLocale: defaultLocale,
  messages: {
    en,
    ru,
  },
  missing: (locale: string, key: string) => {
    console.warn(`Missing translation key: ${key} for locale: ${locale}`);
    return key;
  },
});

export function setLocale(locale: Locale): void {
  i18n.global.locale.value = locale;
  localStorage.setItem('locale', locale);
  document.querySelector('html')?.setAttribute('lang', locale);
}

export function getLocale(): Locale {
  return i18n.global.locale.value as Locale;
}

export function t(key: string): string {
  return i18n.global.t(key) as string;
}

export default i18n;
