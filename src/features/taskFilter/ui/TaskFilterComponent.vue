<template>
  <div class="task-filter">
    <div class="task-filter__search">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="$t('tasks.filter.search')"
        class="task-filter__search-input"
        @input="handleSearchChange"
      />
    </div>

    <div class="task-filter__options">
      <div class="task-filter__checkbox-group">
        <input
          id="show-completed"
          v-model="showCompleted"
          type="checkbox"
          class="task-filter__checkbox"
          @change="handleShowCompletedChange"
        />
        <label
          for="show-completed"
          class="task-filter__label"
        >
          {{ $t('tasks.filter.showCompleted') }}
        </label>
      </div>

      <div class="task-filter__priority-filters">
        <span class="task-filter__label"
          >{{ $t('tasks.priority.title') }}:</span
        >
        <div class="task-filter__priority-buttons">
          <button
            v-for="priority in priorityOptions"
            :key="priority"
            :class="[
              'task-filter__priority-btn',
              `task-filter__priority-btn--${priority}`,
              { active: isActivePriority(priority) },
            ]"
            @click="togglePriority(priority)"
          >
            {{ $t(`tasks.priority.${priority}`) }}
          </button>
        </div>
      </div>

      <button
        class="task-filter__reset-btn"
        @click="resetAllFilters"
      >
        {{ $t('tasks.filter.reset') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { TaskPriority } from '@entities/task';
import { useTaskFilter } from '@features/taskFilter';
import type { TaskFilterOptions } from '../types/TaskFilter';
const taskFilterStore = useTaskFilter();

const searchQuery = ref<string>('');
const showCompleted = ref<boolean>(true);
const priorityFilters = ref<TaskPriority[]>([
  TaskPriority.Low,
  TaskPriority.Medium,
  TaskPriority.High,
]);

const priorityOptions = [
  TaskPriority.Low,
  TaskPriority.Medium,
  TaskPriority.High,
];

const filterOptions = computed<TaskFilterOptions>(
  () => taskFilterStore.getFilterOptions,
);

onMounted(() => {
  searchQuery.value = filterOptions.value.search;
  showCompleted.value = filterOptions.value.showCompleted;
  priorityFilters.value = [...filterOptions.value.priorities];
});

const handleSearchChange = (): void => {
  taskFilterStore.setSearchQuery(searchQuery.value);
};

const handleShowCompletedChange = (): void => {
  taskFilterStore.toggleCompletedVisibility(showCompleted.value);
};

const togglePriority = (priority: TaskPriority): void => {
  taskFilterStore.togglePriorityFilter(priority);
  priorityFilters.value = [...filterOptions.value.priorities];
};

const isActivePriority = (priority: TaskPriority): boolean => {
  return filterOptions.value.priorities.includes(priority);
};

const resetAllFilters = (): void => {
  taskFilterStore.resetFilters();
  searchQuery.value = filterOptions.value.search;
  showCompleted.value = filterOptions.value.showCompleted;
  priorityFilters.value = [...filterOptions.value.priorities];
};

watch(
  filterOptions,
  (newOptions) => {
    searchQuery.value = newOptions.search;
    showCompleted.value = newOptions.showCompleted;
    priorityFilters.value = [...newOptions.priorities];
  },
  { deep: true },
);
</script>

<style lang="scss" scoped>
@import '@styles/variables.scss';

.task-filter {
  background-color: $color-white;
  border-radius: $border-radius-medium;
  padding: $spacing-lg;
  margin-bottom: $spacing-lg;
  box-shadow: $shadow-base;

  &__search {
    margin-bottom: $spacing-md;

    &-input {
      width: 100%;
      padding: $spacing-md;
      border: 1px solid $color-border;
      border-radius: $border-radius-small;
      font-size: 14px;
      transition: $transition-base;

      &:focus {
        outline: none;
        border-color: $color-primary;
        box-shadow: 0 0 0 2px rgba($color-primary, 0.1);
      }

      &::placeholder {
        color: $color-text-lighter;
      }
    }
  }

  &__options {
    @include flex(column, flex-start, stretch, $spacing-md);
  }

  &__checkbox-group {
    @include flex(row, flex-start, center);
  }

  &__checkbox {
    margin-right: $spacing-sm;
    cursor: pointer;
  }

  &__label {
    font-size: 14px;
    color: $color-text-secondary;
  }

  &__priority-filters {
    @include flex(column, flex-start, flex-start, $spacing-sm);
    margin-top: $spacing-sm;

    .task-filter__label {
      margin-bottom: $spacing-xs;
    }
  }

  &__priority-buttons {
    @include flex(row, flex-start, center, $spacing-sm);
    flex-wrap: wrap;
  }

  &__priority-btn {
    padding: $spacing-xs $spacing-md;
    border: none;
    border-radius: $border-radius-large;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: $transition-base;
    opacity: 0.6;

    &--low {
      background-color: $color-bg-priority-low;
      color: $color-primary;
    }

    &--medium {
      background-color: $color-bg-priority-medium;
      color: $color-warning;
    }

    &--high {
      background-color: $color-bg-priority-high;
      color: $color-danger;
    }

    &.active {
      opacity: 1;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
  }

  &__reset-btn {
    align-self: flex-end;
    margin-top: $spacing-sm;
    padding: $spacing-sm $spacing-lg;
    background-color: transparent;
    border: 1px solid $color-border;
    border-radius: $border-radius-small;
    color: $color-text-secondary;
    font-size: 13px;
    cursor: pointer;
    transition: $transition-base;

    &:hover {
      background-color: $color-bg-lighter;
    }
  }
}
</style>
