import { defineStore } from 'pinia'
import { ref } from 'vue'

// Определяем тип TaskPriority локально, чтобы избежать проблем с импортом
enum TaskPriority {
    Low = 'low',
    Medium = 'medium',
    High = 'high'
}

// Определяем интерфейс Task локально, чтобы избежать проблем с импортом
interface Subtask {
    id: number,
    title: string,
    completed: boolean
}

interface Task {
    id: number,
    title: string,
    description?: string,
    completed: boolean,
    priority: TaskPriority,
    subtasks?: Subtask[],
    dateCreate?: string
}

export const useTaskListStore = defineStore('taskListStore', () => {
    const tasks = ref<Task[]>([])

    // Инициализация задач из localStorage при создании хранилища
    const initTasks = () => {
        try {
            const storedTasks = localStorage.getItem('tasks')
            tasks.value = JSON.parse(storedTasks ?? '[]')
        } catch (e) {
            console.error('Ошибка при загрузке задач из localStorage:', e)
            tasks.value = []
        }
    }

    // Вызов инициализации сразу
    initTasks()

    // Сохранение задач в localStorage
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks.value))
    }

    // Получение всех задач
    const getTasks = () => {
        return tasks.value
    }

    // Добавление новой задачи
    const addTask = (task: Partial<Task>) => {
        const newTask: Task = {
            id: Date.now(),
            title: task.title || '',
            description: task.description || '',
            completed: task.completed || false,
            priority: task.priority || TaskPriority.Medium,
            dateCreate: new Date().toISOString(),
            subtasks: task.subtasks || []
        }
        
        tasks.value.push(newTask)
        saveTasks()
        return newTask
    }

    // Обновление существующей задачи
    const updateTask = (updatedTask: Partial<Task>) => {
        if (!updatedTask.id) return null
        
        const index = tasks.value.findIndex((task: Task) => task.id === updatedTask.id)
        if (index === -1) return null
        
        tasks.value[index] = { ...tasks.value[index], ...updatedTask }
        saveTasks()
        return tasks.value[index]
    }

    // Удаление задачи по ID
    const deleteTask = (taskId: number) => {
        const index = tasks.value.findIndex((task: Task) => task.id === taskId)
        if (index === -1) return false
        
        tasks.value.splice(index, 1)
        saveTasks()
        return true
    }

    return {
        getTasks,
        addTask,
        updateTask,
        deleteTask
    }
})
