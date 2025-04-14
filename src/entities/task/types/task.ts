export enum TaskPriority {
    Low = 'low',
    Medium = 'medium',
    High = 'high'
}

export interface Task {
    id: number,
    title: string
    description?: string
    completed: boolean
    priority: TaskPriority
    subtasks?: Subtask[]
    dateCreate?: string
}

export interface Subtask {
    id: number,
    title: string
    completed: boolean
}

export const priorityLabels: Record<TaskPriority, string> = {
    [TaskPriority.Low]: 'Низкий',
    [TaskPriority.Medium]: 'Средний',
    [TaskPriority.High]: 'Высокий'
};