import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Theme, applyTheme, getTheme } from '../theme';
import { setLocale, getLocale } from '@shared/i18n';
import type { Locale } from '@shared/i18n';
import { useI18n } from 'vue-i18n';

export const useSettingsStore = defineStore('settingsStore', () => {
  const theme = ref<Theme>(getTheme());
  const locale = ref<Locale>(getLocale());
  const { locale: i18nLocale } = useI18n();

  const setTheme = (newTheme: Theme): void => {
    theme.value = newTheme;
    applyTheme(newTheme);
  };

  const changeLocale = (newLocale: Locale): void => {
    locale.value = newLocale;
    i18nLocale.value = newLocale;
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const resetSettings = (): void => {
    setTheme(Theme.System);
    changeLocale('ru');
  };

  return {
    theme,
    locale,
    setTheme,
    changeLocale,
    resetSettings,
  };
});
