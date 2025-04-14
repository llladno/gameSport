import { defineStore } from 'pinia';
import type { Task } from '../types/task.ts';

export const useTaskStore = defineStore('taskStore', () => {
  const addTask = (task: Task) => {
    const tasks = localStorage.getItem('tasks');

    const tasksList = tasks ? JSON.parse(tasks) : [];
    tasksList.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasksList));
  };

  return {
    addTask,
  };
});
