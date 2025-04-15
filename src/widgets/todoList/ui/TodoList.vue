<template>
  <div class="todo-list-container">
    <div class="flex flex-col gap-6">
      <add-task @open-modal="$emit('open-modal')" />
      <task-filter-component class="todo-list__filter" />
    </div>
    <div
      v-if="filteredTasks.length > 0"
      class="task-list"
    >
      <task-component
        v-for="task in paginatedTasks"
        :key="task.id"
        :task="task"
        @edit="handleEditTask"
        @delete="handleDeleteTask"
        @toggle-completed="handleToggleCompleted"
        @toggle-subtask="handleToggleSubtask"
      />
    </div>
    <div
      v-else
      class="empty-state"
    >
      <p v-if="tasks.length > 0">{{ $t('tasks.empty.noFilteredTasks') }}</p>
      <p v-else>{{ $t('tasks.empty.noTasks') }}</p>
    </div>

    <div
      v-if="totalPages > 1"
      class="pagination-container"
    >
      <div class="pagination-controls">
        <label class="pagination-select">
          {{ $t('tasks.pagination.itemsPerPage') }}
          <select
            v-model="itemsPerPage"
            @change="handleItemsPerPageChange"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </label>

        <pagination-component
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-change="handlePageChange"
        />
      </div>
      <div class="pagination-info">
        {{ $t('tasks.pagination.page') }} {{ currentPage }}
        {{ $t('tasks.pagination.of') }} {{ totalPages }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTaskListStore } from '@widgets/todoList';
import { computed, watch } from 'vue';
import { type Task } from '@entities/task';
import { TaskComponent } from '@entities/task';
import { TaskFilterComponent, useTaskFilter } from '@features/taskFilter';
import {PaginationComponent, useToast} from '@shared/index.ts';
import {AddTask} from "@features/addTask";
import {useI18n} from "vue-i18n";

const {success} = useToast();
const {t} = useI18n();

const tasksListStore = useTaskListStore();
const taskFilterStore = useTaskFilter();

const tasks = computed<Task[]>(() => tasksListStore.getTasks());
const currentPage = computed<number>(
  () => tasksListStore.pagination.currentPage,
);
const itemsPerPage = computed<number>(
  () => tasksListStore.pagination.itemsPerPage,
);
const totalPages = computed<number>(() => {
  const filteredCount = filteredTasks.value.length;
  return Math.ceil(filteredCount / itemsPerPage.value) || 1;
});

const filteredTasks = computed<Task[]>(() => {
  return taskFilterStore.applyFilters(tasks.value);
});

const paginatedTasks = computed<Task[]>(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return filteredTasks.value.slice(startIndex, endIndex);
});

watch(
  filteredTasks,
  (newFilteredTasks) => {
    const maxPage =
      Math.ceil(newFilteredTasks.length / itemsPerPage.value) || 1;
    if (currentPage.value > maxPage) {
      handlePageChange(maxPage);
    }
  },
  { deep: true },
);

const emit = defineEmits<{
  (e: 'open-modal'): void;
  (e: 'edit-task', task: Task): void;
  (e: 'delete-task', taskId: number): void;
}>();

const handleEditTask = (task: Task) => {
  emit('edit-task', task);
};

const handleDeleteTask = (taskId: number) => {
  emit('delete-task', taskId);
};

const handleToggleCompleted = (task: Task) => {
  if (task.completed) {
    success(t('tasks.taskCompleted'));
  }

  tasksListStore.updateTask(task);
};

const handleToggleSubtask = (subtaskId: number, taskId: number) => {
  const task = tasks.value.find((t) => t.id === taskId);
  if (task && task.subtasks) {
    const updatedSubtasks = task.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st,
    );

    tasksListStore.updateTask({
      ...task,
      subtasks: updatedSubtasks,
    });
  }
};

const handlePageChange = (page: number) => {
  tasksListStore.setCurrentPage(page);
};

const handleItemsPerPageChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const value = parseInt(target.value, 10);
  tasksListStore.setItemsPerPage(value);
};
</script>

<style lang="scss" scoped>
@import '@styles/variables.scss';

.todo-list-container {
  padding: $spacing-lg;
  max-width: 800px;
  margin: 0 auto;
}

.todo-list__filter {
  margin-bottom: $spacing-xl;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.empty-state {
  text-align: center;
  padding: $spacing-xl;
  background-color: $color-bg-light;
  border-radius: $border-radius-medium;
  margin-top: $spacing-lg;
  color: $color-text-light;
}

.pagination-container {
  margin-top: $spacing-xl;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-md;
}

.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-lg;
  flex-wrap: wrap;
}

.pagination-select {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  font-size: 14px;
  color: $color-text-secondary;

  select {
    padding: $spacing-xs $spacing-sm;
    border: 1px solid $color-border;
    border-radius: $border-radius-small;
    background-color: $color-bg-light;
    font-size: 14px;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: $color-primary;
    }
  }
}

.pagination-info {
  font-size: 14px;
  color: $color-text-secondary;
}
</style>
