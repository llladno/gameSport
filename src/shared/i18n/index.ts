import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import ru from './locales/ru.json';

export type Locale = 'en' | 'ru';

export const defaultLocale: Locale = 'ru';

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || defaultLocale,
  fallbackLocale: defaultLocale,
  messages: {
    en,
    ru,
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
