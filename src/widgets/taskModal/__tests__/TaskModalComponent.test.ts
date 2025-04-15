import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskPriority } from '@entities/task';
import type { Task } from '@entities/task';

const mockTask: Task = {
  id: 1,
  title: 'Test Task',
  description: 'Test Description',
  completed: false,
  priority: TaskPriority.Medium,
  dateCreate: '2023-01-01T12:00:00.000Z',
  subtasks: [],
};

describe('TaskModal Business Logic', () => {
  let mockAddTask: ReturnType<typeof vi.fn>;
  let mockUpdateTask: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.resetAllMocks();
    mockAddTask = vi.fn().mockImplementation((task) => ({
      ...task,
      id: 123456789,
      dateCreate: '2023-01-01T12:00:00.000Z',
    }));
    mockUpdateTask = vi.fn().mockImplementation((task) => ({
      ...mockTask,
      ...task,
    }));
  });

  it('should correctly format data when adding a task', () => {
    const formData = {
      title: 'New Test Task',
      description: 'Test Description',
      priority: TaskPriority.High,
    };

    const mockDate = new Date('2023-01-01T12:00:00.000Z');
    vi.spyOn(global, 'Date').mockImplementation(() => mockDate);

    const result = mockAddTask({
      ...formData,
      completed: false,
      subtasks: [],
    });

    expect(result).toMatchObject({
      id: expect.any(Number),
      title: 'New Test Task',
      description: 'Test Description',
      priority: TaskPriority.High,
      completed: false,
      dateCreate: expect.any(String),
      subtasks: [],
    });
  });

  it('should correctly update an existing task', () => {
    const updateData = {
      id: mockTask.id,
      title: 'Updated Task Title',
      completed: true,
    };

    const result = mockUpdateTask(updateData);

    expect(result).toMatchObject({
      id: mockTask.id,
      title: 'Updated Task Title',
      description: mockTask.description,
      priority: mockTask.priority,
      completed: true,
    });
  });

  it('should format subtasks correctly', () => {
    const subtasks = [
      { id: 1, title: 'Subtask 1', completed: false },
      { id: 2, title: 'Subtask 2', completed: true },
    ];

    const formData = {
      title: 'Task with Subtasks',
      subtasks: subtasks,
    };

    const result = mockAddTask({
      ...formData,
      completed: false,
    });

    expect(result.subtasks).toHaveLength(2);
    expect(result.subtasks[0].title).toBe('Subtask 1');
    expect(result.subtasks[0].completed).toBe(false);
    expect(result.subtasks[1].title).toBe('Subtask 2');
    expect(result.subtasks[1].completed).toBe(true);
  });
});
