import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTaskFilter } from '@features/taskFilter';
import { TaskPriority } from '@entities/task';
import type { Task } from '@entities/task';

describe('TaskFilterStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should set and reset filter options', () => {
    const filterStore = useTaskFilter();

    expect(filterStore.filterOptions.search).toBe('');
    expect(filterStore.filterOptions.showCompleted).toBe(true);
    expect(filterStore.filterOptions.priorities).toHaveLength(3);

    filterStore.setSearchQuery('test query');
    filterStore.toggleCompletedVisibility(false);
    filterStore.togglePriorityFilter(TaskPriority.Low);

    expect(filterStore.filterOptions.search).toBe('test query');
    expect(filterStore.filterOptions.showCompleted).toBe(false);
    expect(filterStore.filterOptions.priorities).toHaveLength(2);

    filterStore.resetFilters();

    expect(filterStore.filterOptions.search).toBe('');
    expect(filterStore.filterOptions.showCompleted).toBe(true);
    expect(filterStore.filterOptions.priorities).toHaveLength(3);
  });

  it('should correctly filter tasks', () => {
    const filterStore = useTaskFilter();

    const tasks: Task[] = [
      {
        id: 1,
        title: 'Low Task',
        completed: false,
        priority: TaskPriority.Low,
      },
      {
        id: 2,
        title: 'Medium Task',
        completed: true,
        priority: TaskPriority.Medium,
      },
      {
        id: 3,
        title: 'High Task',
        completed: false,
        priority: TaskPriority.High,
      },
    ];

    filterStore.setSearchQuery('Medium');
    expect(filterStore.applyFilters(tasks)).toHaveLength(1);
    expect(filterStore.applyFilters(tasks)[0].id).toBe(2);

    filterStore.setSearchQuery('');
    filterStore.toggleCompletedVisibility(false);
    expect(filterStore.applyFilters(tasks)).toHaveLength(2);

    filterStore.resetFilters();
    filterStore.togglePriorityFilter(TaskPriority.Medium);
    filterStore.togglePriorityFilter(TaskPriority.Low);
    expect(filterStore.applyFilters(tasks)).toHaveLength(1);
    expect(filterStore.applyFilters(tasks)[0].priority).toBe(TaskPriority.High);
  });
});
