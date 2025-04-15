<template>
  <header class="flex gap-4 h-10 items-center px-4 md:px-10">
    <link-component
      class="header-link"
      to="/"
      >{{ $t('header.tasks') }}</link-component
    >
    <link-component
      class="header-link"
      to="/settings"
      >{{ $t('header.settings') }}</link-component
    >
    <link-component
      class="header-link"
      to="/about"
      >{{ $t('header.about') }}</link-component
    >
  </header>
</template>

<script setup lang="ts">
import { LinkComponent } from '@shared/index.ts';
</script>

<style scoped lang="scss">
@import '@styles/variables';
.header-link {
  height: 100%;
  display: flex;
  align-items: center;
  transition: 0.2s ease-in-out;
  padding: 0 5px;
  font-size: 14px;
  
  @media (min-width: 768px) {
    font-size: 16px;
  }

  &:hover {
    background: $color-primary-hover;
    color: $color-white;
  }

  &:active {
    background: $color-primary-active;
  }
}
</style>
