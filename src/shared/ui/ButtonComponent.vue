<template>
  <button :class="['button', `button--${variant}`]"><slot></slot></button>
</template>
<script setup lang="ts">
import type {ButtonVariant} from "@shared/types/button.ts";

defineProps<{
  variant?: ButtonVariant
}>()
</script>
<style scoped lang="scss">
@use '@styles/variables';

.button {
  padding: 7px 15px;
  border-radius: 5px;
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


  &--grey {
    background-color: variables.$default-white;
    color: variables.$primary-color;

    &:hover {
      background-color: variables.$primary-color-hover;
      color: #fff;
    }

    &:active {
      background-color: variables.$primary-color-active;
      color: #fff;
    }
  }

  &--red {
    background-color: variables.$color-danger;
    color: variables.$color-white;

    &:hover {
      background-color: darken(variables.$color-danger, 10%);
    }

    &:active {
      background-color: darken(variables.$color-danger, 20%);
    }
  }
}
</style>