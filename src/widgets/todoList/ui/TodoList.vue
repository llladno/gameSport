<template>
  <div class="todo-list-container" id="todo-list-container">
    <div v-if="tasks && tasks.length > 0" class="task-list" id="task-list">
      <task-component 
        v-for="task in tasks" 
        :key="task.id" 
        :task="task"
        @edit="handleEditTask"
        @delete="handleDeleteTask"
        @toggle-completed="handleToggleCompleted"
        @toggle-subtask="handleToggleSubtask"
      />
    </div>
    <div v-else class="empty-state" id="empty-tasks-state">
      <p>Нет задач. Добавьте новую задачу!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useTaskListStore} from "@widgets/todoList";
import {computed} from "vue";
import {type Task} from "@entities/task";
import {TaskComponent} from "@entities/task";

const tasksListStore = useTaskListStore();
const tasks = computed<Task[]>(() => tasksListStore.getTasks());

const emit = defineEmits<{
  (e: 'edit-task', task: Task): void
  (e: 'delete-task', taskId: number): void
}>();

const handleEditTask = (task: Task) => {
  console.log('Edit task:', task);
  emit('edit-task', task);
};

const handleDeleteTask = (taskId: number) => {
  console.log('Delete task with ID:', taskId);
  emit('delete-task', taskId);
};

const handleToggleCompleted = (task: Task) => {
  console.log('Toggle completed:', task);
  tasksListStore.updateTask(task);
};

const handleToggleSubtask = (subtaskId: number, taskId: number) => {
  console.log('Toggle subtask:', subtaskId, 'in task:', taskId);
  // Логика обновления подзадачи
  const task = tasks.value.find(t => t.id === taskId);
  if (task && task.subtasks) {
    const updatedSubtasks = task.subtasks.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    
    tasksListStore.updateTask({
      ...task,
      subtasks: updatedSubtasks
    });
  }
};
</script>

<style scoped>
.todo-list-container {
  padding: 16px;
  max-width: 800px;
  margin: 0 auto;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-state {
  text-align: center;
  padding: 32px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-top: 24px;
  color: #888;
}
</style>