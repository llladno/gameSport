import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Theme, applyTheme, getTheme } from '../theme';
import { setLocale, getLocale } from '@shared/i18n';
import type { Locale } from '@shared/i18n';

export const useSettingsStore = defineStore('settingsStore', () => {
  const theme = ref<Theme>(getTheme());
  const locale = ref<Locale>(getLocale());

  const setTheme = (newTheme: Theme): void => {
    theme.value = newTheme;
    applyTheme(newTheme);
  };

  const changeLocale = (newLocale: Locale): void => {
    locale.value = newLocale;
    setLocale(newLocale);
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
