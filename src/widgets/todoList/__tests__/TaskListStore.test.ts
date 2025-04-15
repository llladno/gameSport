import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTaskListStore } from '@widgets/todoList';
import { TaskPriority } from '@entities/task';

describe('TaskListStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    
    const mockStorage: Record<string, string> = {};
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(key => 
      key in mockStorage ? mockStorage[key] : null
    );
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
      mockStorage[key] = String(value);
    });
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should add, update and delete tasks', () => {
    const taskStore = useTaskListStore();
    const mockDate = '2023-01-01T12:00:00.000Z';
    vi.spyOn(Date.prototype, 'toISOString').mockReturnValue(mockDate);
    vi.spyOn(global.Date, 'now').mockReturnValue(123456789);
    
    const task = taskStore.addTask({
      title: 'Test Task',
      description: 'Test Description',
      priority: TaskPriority.High,
    });
    
    expect(task.id).toBe(123456789);
    expect(task.title).toBe('Test Task');
    expect(task.completed).toBe(false);
    expect(localStorage.setItem).toHaveBeenCalled();
    
    const tasks = taskStore.getTasks();
    expect(tasks).toHaveLength(1);
    
    const updatedTask = taskStore.updateTask({
      id: task.id,
      title: 'Updated Task',
      completed: true,
    });
    
    expect(updatedTask).not.toBeNull();
    if (updatedTask) {
      expect(updatedTask.title).toBe('Updated Task');
      expect(updatedTask.completed).toBe(true);
      expect(updatedTask.description).toBe('Test Description');
    }
    
    const result = taskStore.deleteTask(task.id);
    expect(result).toBe(true);
    expect(taskStore.getTasks()).toHaveLength(0);
  });

  it('should handle non-existent tasks correctly', () => {
    const taskStore = useTaskListStore();
    
    const result1 = taskStore.updateTask({ id: 999, title: 'Non-existent' });
    expect(result1).toBeNull();
    
    const result2 = taskStore.deleteTask(999);
    expect(result2).toBe(false);
  });

  it('should handle pagination correctly', () => {
    const taskStore = useTaskListStore();
    
    for (let i = 1; i <= 7; i++) {
      taskStore.addTask({
        title: `Task ${i}`,
        priority: TaskPriority.Medium,
      });
    }
    
    expect(taskStore.pagination.itemsPerPage).toBe(5);
    expect(taskStore.pagination.currentPage).toBe(1);
    
    expect(taskStore.getTotalPages).toBe(2);
    
    let paginatedTasks = taskStore.getPaginatedTasks;
    expect(paginatedTasks).toHaveLength(5);
    expect(paginatedTasks[0].title).toBe('Task 1');
    expect(paginatedTasks[4].title).toBe('Task 5');
    
    taskStore.setCurrentPage(2);
    
    paginatedTasks = taskStore.getPaginatedTasks;
    expect(paginatedTasks).toHaveLength(2);
    expect(paginatedTasks[0].title).toBe('Task 6');
    expect(paginatedTasks[1].title).toBe('Task 7');
    
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'tasksPagination',
      expect.any(String)
    );
  });
}); 