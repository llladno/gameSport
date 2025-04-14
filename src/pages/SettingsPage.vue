<template>
  <div class="settings-page">
    <h1 class="settings-page__title">{{ t('settings.title') }}</h1>
    <settings-panel />
  </div>
</template>

<script setup lang="ts">
import {SettingsPanel} from '@shared/index';
</script>

<style lang="scss" scoped>
@import '../app/assets/variables.scss';

.settings-page {
  padding: $spacing-xl;
  
  &__title {
    font-size: 32px;
    margin-bottom: $spacing-xl;
    color: $color-text-primary;
    text-align: center;
  }
}
</style>