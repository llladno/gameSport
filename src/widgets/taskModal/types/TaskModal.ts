import type { Task } from '@entities/task';

export interface Props {
  modelValue: boolean;
  mode: ModalMode;
  task?: Task | null;
}

export enum ModalMode {
  Add = 'add',
  Edit = 'edit',
}

export interface ImportExportProps {
  task: Partial<Task>;
  mode: ModalMode;
}
