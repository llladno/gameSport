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
  background: variables.$color-primary;
  color: variables.$color-white;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

  &:hover {
    background-color: variables.$color-primary-hover;
    color: #fff;
  }

  &:active {
    background-color: variables.$color-primary-active;
    color: #fff;
  }


  &--grey {
    background-color: variables.$color-white;
    color: variables.$color-primary;

    &:hover {
      background-color: variables.$color-primary-hover;
      color: #fff;
    }

    &:active {
      background-color: variables.$color-primary-active;
      color: #fff;
    }
  }

  &--red {
    background-color: variables.$color-danger;
    color: variables.$color-white;

    &:hover {
      background-color: variables.$color-danger-hover;
    }

    &:active {
      background-color: variables.$color-danger-active;
    }
  }
}
</style>