<script setup lang="ts">
import HeaderWidget from '@widgets/header/HeaderWidget.vue';
</script>

<template>
  <header-widget />
  <main class="mx-4 p-4">
    <router-view></router-view>
  </main>
</template>

<style scoped></style>
