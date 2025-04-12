<template>
  <button class="button">Button</button>
</template>
<script setup lang="ts">

</script>
<style scoped lang="scss">
@use '@/app/assets/variables.scss';

.button {
  padding: 5px 15px;
  border-radius: 5px;
  border: 1px solid #000;
  background: variables.$primary-color;
  color: variables.$default-white;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

  &:hover {
    background-color: variables.$primary-color-hover;
    color: #fff;
  }

  &:active {
    background-color: variables.$primary-color-active;
    color: #fff;
  }
}
</style>