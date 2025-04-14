<template>
  <div class="pagination">
    <button
      class="pagination__button"
      :disabled="currentPage === 1"
      @click="onPageChange(1)"
    >
      <<
    </button>
    <button
      class="pagination__button"
      :disabled="currentPage === 1"
      @click="onPageChange(currentPage - 1)"
    >
      <
    </button>

    <template
      v-for="pageNumber in displayedPages"
      :key="pageNumber"
    >
      <button
        v-if="pageNumber !== '...'"
        :class="[
          'pagination__button',
          currentPage === pageNumber && 'pagination__button--active',
        ]"
        @click="onPageChange(Number(pageNumber))"
      >
        {{ pageNumber }}
      </button>
      <span
        v-else
        class="pagination__ellipsis"
        >...</span
      >
    </template>

    <button
      class="pagination__button"
      :disabled="currentPage === totalPages"
      @click="onPageChange(currentPage + 1)"
    >
      >
    </button>
    <button
      class="pagination__button"
      :disabled="currentPage === totalPages"
      @click="onPageChange(totalPages)"
    >
      >>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps, watch } from 'vue';

const props = defineProps<{
  currentPage: number;
  totalPages: number;
}>();

const emit = defineEmits<{
  (e: 'page-change', page: number): void;
}>();

const displayedPages = computed(() => {
  const { currentPage, totalPages } = props;
  const pages: (number | string)[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    if (currentPage <= 4) {
      pages.push(2, 3, 4);
    } else {
      pages.push('...');
    }

    if (currentPage > 4 && currentPage < totalPages - 3) {
      pages.push(currentPage - 1, currentPage, currentPage + 1);
    }

    if (currentPage >= totalPages - 3) {
      pages.push(totalPages - 3, totalPages - 2, totalPages - 1);
    } else {
      pages.push('...');
    }

    pages.push(totalPages);
  }

  return pages;
});

const onPageChange = (page: number) => {
  if (page !== props.currentPage) {
    emit('page-change', page);
  }
};

watch(
  () => props.totalPages,
  (newTotalPages) => {
    if (props.currentPage > newTotalPages && newTotalPages > 0) {
      emit('page-change', newTotalPages);
    }
  },
);
</script>

<style lang="scss" scoped>
@import '@styles/variables.scss';

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: $spacing-lg 0;
  gap: $spacing-xs;

  &__button {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 32px;
    height: 32px;
    padding: 0 $spacing-sm;
    border: 1px solid $color-border;
    border-radius: $border-radius-small;
    background-color: $color-bg-light;
    color: $color-text-primary;
    font-size: 14px;
    cursor: pointer;
    transition: $transition-base;

    &:hover:not(:disabled) {
      background-color: $color-bg-lighter;
      border-color: $color-primary;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &--active {
      background-color: $color-primary;
      color: white;
      border-color: $color-primary;

      &:hover {
        background-color: $color-primary;
      }
    }
  }

  &__ellipsis {
    padding: 0 $spacing-sm;
    color: $color-text-secondary;
  }
}
</style>
