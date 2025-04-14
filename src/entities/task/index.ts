import TaskComponent from './ui/TaskComponent.vue';
import type { Task, Subtask } from './types/task.ts';
import { priorityLabels, TaskPriority } from './types/task.ts';
import { useTaskStore } from './model/TaskStore.ts';

export { TaskComponent, useTaskStore, priorityLabels, TaskPriority };

export type { Task, Subtask };
