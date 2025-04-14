import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Task } from '@entities/task';
import { TaskPriority } from '@entities/task';
import { initialFilterOptions, type TaskFilterOptions } from '../types/TaskFilter';

export const useTaskFilter = defineStore('taskFilterStore', () => {
  const filterOptions = ref<TaskFilterOptions>({ ...initialFilterOptions });

  const setSearchQuery = (query: string):void => {
    filterOptions.value.search = query;
  };

  const toggleCompletedVisibility = (show: boolean):void => {
    filterOptions.value.showCompleted = show;
  };

  const togglePriorityFilter = (priority: TaskPriority):void => {
    if (filterOptions.value.priorities.includes(priority)) {
      filterOptions.value.priorities = filterOptions.value.priorities.filter(p => p !== priority);
    } else {
      filterOptions.value.priorities.push(priority);
    }
  };

  const resetFilters = ():void => {
    filterOptions.value = { ...initialFilterOptions };
  };

  const applyFilters = (tasks: Task[]): Task[] => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(filterOptions.value.search.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(filterOptions.value.search.toLowerCase()));
      
      const matchesCompletedFilter = filterOptions.value.showCompleted || !task.completed;
      
      const matchesPriorityFilter = filterOptions.value.priorities.includes(task.priority);

      return matchesSearch && matchesCompletedFilter && matchesPriorityFilter;
    });
  };

  const getFilterOptions = computed<TaskFilterOptions>(() => filterOptions.value);
  
  return {
    filterOptions,
    getFilterOptions,
    setSearchQuery,
    toggleCompletedVisibility,
    togglePriorityFilter,
    resetFilters,
    applyFilters
  };
}); 