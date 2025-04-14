import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Task } from '@entities/task';
import { TaskPriority } from '@entities/task';

interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
}

export const useTaskListStore = defineStore('taskListStore', () => {
  const tasks = ref<Task[]>([]);
  const pagination = ref<PaginationState>({
    currentPage: 1,
    itemsPerPage: 5,
  });

  const initTasks = () => {
    try {
      const storedTasks = localStorage.getItem('tasks');
      tasks.value = JSON.parse(storedTasks ?? '[]');

      const storedPagination = localStorage.getItem('tasksPagination');
      if (storedPagination) {
        pagination.value = JSON.parse(storedPagination);
      }
    } catch (e) {
      console.error('Ошибка при загрузке данных из localStorage:', e);
      tasks.value = [];
    }
  };

  initTasks();

  const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks.value));
  };

  const savePagination = () => {
    localStorage.setItem('tasksPagination', JSON.stringify(pagination.value));
  };

  const getTasks = (): Task[] => {
    return tasks.value;
  };

  const getPaginatedTasks = computed(() => {
    const startIndex =
      (pagination.value.currentPage - 1) * pagination.value.itemsPerPage;
    const endIndex = startIndex + pagination.value.itemsPerPage;
    return tasks.value.slice(startIndex, endIndex);
  });

  const getTotalPages = computed(() => {
    return Math.ceil(tasks.value.length / pagination.value.itemsPerPage);
  });

  const setCurrentPage = (page: number) => {
    pagination.value.currentPage = page;
    savePagination();
  };

  const setItemsPerPage = (itemsPerPage: number) => {
    pagination.value.itemsPerPage = itemsPerPage;

    const maxPage = Math.max(1, Math.ceil(tasks.value.length / itemsPerPage));
    if (pagination.value.currentPage > maxPage) {
      pagination.value.currentPage = maxPage;
    }
    savePagination();
  };

  const addTask = (task: Partial<Task>) => {
    const newTask: Task = {
      id: Date.now(),
      title: task.title || '',
      description: task.description || '',
      completed: task.completed || false,
      priority: task.priority || TaskPriority.Medium,
      dateCreate: new Date().toISOString(),
      subtasks: task.subtasks || [],
    };

    tasks.value.push(newTask);
    saveTasks();
    return newTask;
  };

  const updateTask = (updatedTask: Partial<Task>) => {
    if (!updatedTask.id) return null;

    const index = tasks.value.findIndex(
      (task: Task) => task.id === updatedTask.id,
    );
    if (index === -1) return null;

    tasks.value[index] = { ...tasks.value[index], ...updatedTask };
    saveTasks();
    return tasks.value[index];
  };

  const deleteTask = (taskId: number) => {
    const index = tasks.value.findIndex((task: Task) => task.id === taskId);
    if (index === -1) return false;

    tasks.value.splice(index, 1);
    saveTasks();

    const maxPage = Math.max(
      1,
      Math.ceil((tasks.value.length - 1) / pagination.value.itemsPerPage),
    );
    if (pagination.value.currentPage > maxPage) {
      pagination.value.currentPage = maxPage;
      savePagination();
    }

    return true;
  };

  return {
    getTasks,
    getPaginatedTasks,
    getTotalPages,
    pagination,
    setCurrentPage,
    setItemsPerPage,
    addTask,
    updateTask,
    deleteTask,
  };
});
