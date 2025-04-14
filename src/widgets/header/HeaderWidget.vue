<template>
  <header class="flex gap-2">
    <link-component to="/">Todo List</link-component>
    <link-component to="/settings">Settings</link-component>
    <link-component to="/about">About</link-component>
  </header>
</template>

<script setup lang="ts">
import { LinkComponent } from '@shared/index.ts';
</script>
