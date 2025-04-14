<template>
  <router-link :to="to" class="link">
    <slot />
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
  color: variables.$color-primary;
  cursor: pointer;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: variables.$color-primary-hover;
  }
}
</style>