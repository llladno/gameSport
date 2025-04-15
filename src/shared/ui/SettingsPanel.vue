<template>
  <div class="settings-panel">
    <h2 class="settings-panel__title">{{ t('settings.title') }}</h2>

    <div class="settings-panel__section">
      <h3 class="settings-panel__section-title">{{
        t('settings.theme.title')
      }}</h3>
      <div class="flex gap-3">
        <button
          v-for="themeOption in themeOptions"
          :key="themeOption.value"
          :class="[
            'settings-panel__theme-btn',
            currentTheme === themeOption.value &&
              'settings-panel__theme-btn--active',
          ]"
          @click="setTheme(themeOption.value)"
        >
          {{ t(`settings.theme.${themeOption.value}`) }}
        </button>
      </div>
    </div>

    <div class="settings-panel__section">
      <h3 class="settings-panel__section-title">{{
        t('settings.language.title')
      }}</h3>
      <div class="flex gap-3">
        <button
          v-for="langOption in languageOptions"
          :key="langOption.code"
          :class="[
            'settings-panel__language-btn',
            currentLocale === langOption.code &&
              'settings-panel__language-btn--active',
          ]"
          @click="setLocale(langOption.code)"
        >
          {{ langOption.name }}
        </button>
      </div>
    </div>

    <div class="settings-panel__actions">
      <button
        class="settings-panel__reset-btn"
        @click="resetAllSettings"
      >
        {{ t('settings.resetSettings') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useSettingsStore } from '@app/stores/settingsStore.ts';
import { Theme } from '@app/theme';
import type { Locale } from '@shared/i18n';
import { computed } from 'vue';
import { useToast } from '@shared/composables/useToast.ts';

const { t, locale } = useI18n();
const { success } = useToast();
const settingsStore = useSettingsStore();

const currentTheme = computed<string>(() => settingsStore.theme);

const themeOptions = [
  { value: Theme.Light, label: 'light' },
  { value: Theme.Dark, label: 'dark' },
  { value: Theme.System, label: 'system' },
];

const setTheme = (theme: Theme): void => {
  settingsStore.setTheme(theme);
};

const currentLocale = computed<string>(() => locale.value);

const languageOptions = [
  { code: 'ru' as Locale, name: 'Русский' },
  { code: 'en' as Locale, name: 'English' },
];

const setLocale = (newLocale: Locale): void => {
  locale.value = newLocale;
  settingsStore.changeLocale(newLocale);
  success(t('settings.success'));
};

const resetAllSettings = (): void => {
  settingsStore.resetSettings();
  success(t('settings.success'));
};
</script>

<style lang="scss" scoped>
@import '../../app/assets/variables.scss';

.settings-panel {
  background-color: $color-white;
  border-radius: $border-radius-medium;
  padding: $spacing-xl;
  box-shadow: $shadow-base;
  max-width: 800px;
  margin: 0 auto;

  &__title {
    font-size: 24px;
    margin-top: 0;
    margin-bottom: $spacing-xl;
    color: $color-text-primary;
  }

  &__section {
    margin-bottom: $spacing-xl;
    padding-bottom: $spacing-lg;
    border-bottom: 1px solid $color-border;

    &:last-child {
      border-bottom: none;
    }
  }

  &__section-title {
    font-size: 18px;
    margin-top: 0;
    margin-bottom: $spacing-lg;
    color: $color-text-primary;
  }

  &__theme-btn {
    padding: $spacing-md $spacing-lg;
    border: 1px solid $color-border;
    background-color: transparent;
    border-radius: $border-radius-small;
    font-size: 14px;
    cursor: pointer;
    transition: $transition-base;
    color: $color-text-secondary;

    &:hover {
      background-color: $color-bg-lighter;
    }

    &--active {
      border-color: $color-primary;
      color: $color-primary;
      font-weight: 500;
    }
  }

  &__language-btn {
    padding: $spacing-md $spacing-lg;
    border: 1px solid $color-border;
    background-color: transparent;
    border-radius: $border-radius-small;
    font-size: 14px;
    cursor: pointer;
    transition: $transition-base;
    color: $color-text-secondary;

    &:hover {
      background-color: $color-bg-lighter;
    }

    &--active {
      border-color: $color-primary;
      color: $color-primary;
      font-weight: 500;
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    margin-top: $spacing-xl;
  }

  &__reset-btn {
    padding: $spacing-md $spacing-lg;
    background-color: transparent;
    border: 1px solid $color-danger;
    color: $color-danger;
    border-radius: $border-radius-small;
    font-size: 14px;
    cursor: pointer;
    transition: $transition-base;

    &:hover {
      background-color: $color-danger;
      color: white;
    }
  }
}
</style>
