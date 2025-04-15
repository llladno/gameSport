<template>
  <div :class="['task-card', task.completed && 'completed']">
    <div class="task-card__content">
      <div class="task-card__header">
        <div class="task-card__checkbox-title">
          <input
            type="checkbox"
            class="task-card__checkbox"
            :checked="task.completed"
            @change="toggleCompleted"
          />
          <h3 class="task-card__title">{{ task.title }}</h3>
        </div>
        <div class="task-card__actions">
          <button
            class="task-card__btn task-card__btn--edit"
            @click="emit('edit', task)"
          >
            <span class="task-card__icon">✎</span>
          </button>
          <button
            class="task-card__btn task-card__btn--delete"
            @click="emit('delete', task.id)"
          >
            <span class="task-card__icon">✕</span>
          </button>
        </div>
      </div>

      <div class="task-card__meta">
        <span
          class="task-card__priority"
          :class="`task-card__priority--${task.priority}`"
        >
          {{ $t(`tasks.priority.${task.priority}`) }}
        </span>

        <div
          v-if="task.dateCreate"
          class="task-card__date"
        >
          {{ $t('tasks.created') }}: {{ formatDate(task.dateCreate) }}
        </div>
      </div>

      <p
        v-if="task.description"
        class="task-card__description"
        >{{ task.description }}</p
      >

      <div
        v-if="task.subtasks && task.subtasks.length > 0"
        class="task-card__subtasks"
      >
        <h4 class="task-card__subtasks-title">{{ $t('tasks.subtasks') }}:</h4>
        <ul class="task-card__subtasks-list">
          <li
            v-for="subtask in task.subtasks"
            :key="subtask.id"
            :class="['task-card__subtask', subtask.completed && 'completed']"
          >
            <input
              type="checkbox"
              class="task-card__subtask-checkbox"
              :checked="subtask.completed"
              @change="toggleSubtaskCompleted(subtask.id)"
            />
            <span class="task-card__subtask-title">{{ subtask.title }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '../types/task';

const props = defineProps<{ task: Task }>();
const emit = defineEmits<{
  (e: 'edit', task: Task): void;
  (e: 'delete', id: number): void;
  (e: 'toggle-completed', task: Task): void;
  (e: 'toggle-subtask', subtaskId: number, taskId: number): void;
}>();

const toggleCompleted = () => {
  emit('toggle-completed', {
    ...props.task,
    completed: !props.task.completed,
  });
};

const toggleSubtaskCompleted = (subtaskId: number) => {
  emit('toggle-subtask', subtaskId, props.task.id);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
</script>

<style lang="scss" scoped>
@import '@styles/variables.scss';

.task-card {
  background-color: $color-white;
  border-radius: $border-radius-medium;
  box-shadow: $shadow-base;
  padding: $spacing-lg;
  margin-bottom: $spacing-lg;
  transition: $transition-smooth;

  &.completed {
    background-color: $color-bg-light;
    border-left: 4px solid $color-success;
    opacity: 0.8;

    .task-card__title {
      text-decoration: line-through;
      color: $color-text-light;
    }
  }

  &__header {
    @include flex(row, space-between, center);
    margin-bottom: $spacing-sm;
  }

  &__checkbox-title {
    @include flex(row, flex-start, center, $spacing-md);
  }

  &__checkbox {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }

  &__title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: $color-text-primary;
  }

  &__actions {
    @include flex(row, flex-start, center, $spacing-sm);
  }

  &__btn {
    background: none;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: $border-radius-small;
    @include flex(row, center, center);
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: $color-bg-hover;
    }

    &--edit {
      color: $color-primary;
    }

    &--delete {
      color: $color-danger;
    }
  }

  &__icon {
    font-size: 16px;
  }

  &__meta {
    @include flex(row, space-between, center);
    margin-bottom: $spacing-md;
  }

  &__priority {
    padding: 3px $spacing-sm;
    border-radius: $border-radius-large;
    font-weight: 500;
    font-size: 12px;

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
  }

  &__date {
    color: $color-text-lighter;
    text-align: right;
    font-size: 12px;
  }

  &__description {
    margin: $spacing-sm 0;
    color: $color-text-secondary;
    font-size: 14px;
    line-height: 1.5;
  }

  &__subtasks {
    margin-top: $spacing-lg;
    border-top: 1px solid $color-border;
    padding-top: $spacing-md;
  }

  &__subtasks-title {
    margin: 0 0 $spacing-sm;
    font-size: 14px;
    color: $color-text-light;
  }

  &__subtasks-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__subtask {
    @include flex(row, flex-start, center, $spacing-sm);
    padding: 6px 0;
    color: $color-text-secondary;

    &.completed {
      .task-card__subtask-title {
        text-decoration: line-through;
        color: $color-text-light;
      }
    }
  }

  &__subtask-title {
    font-size: 14px;
  }
}
</style>
