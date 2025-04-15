<template>
  <div>
    <task-modal-component
      v-model="isModalOpen"
      :mode="modalMode"
      :task="currentTask"
      @edit-task="handleEditTask"
    />
    <todo-list
      @open-modal="openAddModal"
      @edit-task="openEditModal"
      @delete-task="handleDeleteTask"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { TaskModalComponent } from '@widgets/taskModal';
import { TodoList } from '@widgets/todoList';
import type { Task } from '@entities/task';
import { useTaskListStore } from '@widgets/todoList/models/TaskListStore';
import { ModalMode } from '@widgets/taskModal';
import { useToast } from '@shared/composables/useToast';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { success } = useToast();

const isModalOpen = ref(false);
const modalMode = ref<ModalMode>(ModalMode.Add);
const currentTask = ref<Task | null>(null);
const taskListStore = useTaskListStore();

const openAddModal = (): void => {
  modalMode.value = ModalMode.Add;
  currentTask.value = null;
  isModalOpen.value = true;
};

const openEditModal = (task: Task): void => {
  modalMode.value = ModalMode.Edit;
  currentTask.value = { ...task };
  isModalOpen.value = true;
};

const handleEditTask = (task: Task): void => {
  taskListStore.updateTask(task);
  isModalOpen.value = false;
};

const handleDeleteTask = (taskId: number): void => {
  taskListStore.deleteTask(taskId);
  success(t('tasks.taskDeleted'));
};
</script>
