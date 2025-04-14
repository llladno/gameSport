<template>
  <router-link :to="to" class="link">
    <slot></slot>
  </router-link>
</template>

<script setup lang="ts">
defineProps<{
  to: string
}>()
</script>

<style scoped lang="scss">
@use "@styles/variables";

.link {
  text-decoration: none;
  color: variables.$primary-color;
  cursor: pointer;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: variables.$primary-color-hover;
  }
}
</style>