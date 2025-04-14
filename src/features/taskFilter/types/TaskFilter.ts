import { TaskPriority } from '@entities/task';

export interface TaskFilterOptions {
  search: string;
  showCompleted: boolean;
  priorities: TaskPriority[];
}

export const initialFilterOptions: TaskFilterOptions = {
  search: '',
  showCompleted: true,
  priorities: [TaskPriority.Low, TaskPriority.Medium, TaskPriority.High],
};
