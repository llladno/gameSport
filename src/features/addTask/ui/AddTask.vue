<template>
  <button-component @click="$emit('openModal')">+</button-component>
</template>

<script setup lang="ts">
import {ButtonComponent} from "@shared/index.ts";

defineEmits(['openModal']);
</script>
<style scoped>

</style>