import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTaskFilter } from '@features/taskFilter';
import { useTaskListStore } from '@widgets/todoList';
import { TaskPriority } from '@entities/task';
import type { Task } from '@entities/task';

describe('TaskFilterStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should filter tasks correctly', () => {
    const filterStore = useTaskFilter();

    const tasks: Task[] = [
      { id: 1, title: 'Task Low', completed: false, priority: TaskPriority.Low },
      { id: 2, title: 'Task Medium', completed: true, priority: TaskPriority.Medium },
      { id: 3, title: 'Task High', completed: false, priority: TaskPriority.High }
    ];

    filterStore.setSearchQuery('Medium');
    expect(filterStore.applyFilters(tasks)).toHaveLength(1);

    filterStore.setSearchQuery('');
    filterStore.toggleCompletedVisibility(false);
    expect(filterStore.applyFilters(tasks)).toHaveLength(2);

    filterStore.resetFilters();
    filterStore.togglePriorityFilter(TaskPriority.Low);
    expect(filterStore.applyFilters(tasks).map(t => t.id)).toEqual([2, 3]);
  });
});

describe('TaskListStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());

    const mockStorage: Record<string, string> = {};
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(key =>
      mockStorage[key] || null
    );
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
      mockStorage[key] = String(value);
    });

    vi.spyOn(Date.prototype, 'toISOString').mockReturnValue('2023-01-01T12:00:00.000Z');
    vi.spyOn(global.Date, 'now').mockReturnValue(123456789);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should manage tasks correctly', () => {
    const taskStore = useTaskListStore();

    const task = taskStore.addTask({
      title: 'Test Task',
      priority: TaskPriority.Medium
    });
    expect(task.id).toBe(123456789);
    expect(taskStore.getTasks()).toHaveLength(1);

    taskStore.updateTask({
      id: task.id,
      completed: true
    });
    const updatedTask = taskStore.getTasks()[0];
    expect(updatedTask.completed).toBe(true);

    taskStore.deleteTask(task.id);
    expect(taskStore.getTasks()).toHaveLength(0);
  });
});