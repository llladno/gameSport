<template>
  <div>
    <task-modal-component 
      v-model="isModalOpen" 
      :mode="modalMode" 
      :task="currentTask"
      @edit-task="handleEditTask"
    />
    <add-task @open-modal="openAddModal" />
    <todo-list 
      @edit-task="openEditModal"
      @delete-task="handleDeleteTask"
    />
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {TaskModalComponent} from "@widgets/taskModal";
import {AddTask} from "@features/addTask/index";
import {TodoList} from "@widgets/todoList";
import type {Task} from "@entities/task";
import {useTaskListStore} from "@widgets/todoList/models/TaskListStore";
import { ModalMode} from "@widgets/taskModal";

const isModalOpen = ref(false);
const modalMode = ref<ModalMode>(ModalMode.Add);
const currentTask = ref<Task | null>(null);
const taskListStore = useTaskListStore();

const openAddModal = () => {
  modalMode.value = ModalMode.Add;
  currentTask.value = null;
  isModalOpen.value = true;
}

const openEditModal = (task: Task) => {
  modalMode.value = ModalMode.Edit;
  currentTask.value = { ...task };
  isModalOpen.value = true;
}

const handleEditTask = (task: Task) => {
  taskListStore.updateTask(task);
  isModalOpen.value = false;
}

const handleDeleteTask = (taskId: number) => {
  taskListStore.deleteTask(taskId);
}
</script>