<template>
  <div class="todo-list-container">
    <task-filter-component class="todo-list__filter" />
    <div v-if="filteredTasks.length > 0" class="task-list">
      <task-component 
        v-for="task in filteredTasks" 
        :key="task.id" 
        :task="task"
        @edit="handleEditTask"
        @delete="handleDeleteTask"
        @toggle-completed="handleToggleCompleted"
        @toggle-subtask="handleToggleSubtask"
      />
    </div>
    <div v-else class="empty-state">
      <p v-if="tasks.length > 0">Нет задач, соответствующих фильтрам</p>
      <p v-else>Нет задач. Добавьте новую задачу!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTaskListStore } from "@widgets/todoList";
import { computed } from "vue";
import { type Task } from "@entities/task";
import { TaskComponent } from "@entities/task";
import { TaskFilterComponent, useTaskFilter } from "@features/taskFilter";

const tasksListStore = useTaskListStore();
const taskFilterStore = useTaskFilter();

const tasks = computed<Task[]>(() => tasksListStore.getTasks());

const filteredTasks = computed<Task[]>(() => {
  return taskFilterStore.applyFilters(tasks.value);
});

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

<style lang="scss" scoped>
@import "@styles/variables.scss";

.todo-list-container {
  padding: $spacing-lg;
  max-width: 800px;
  margin: 0 auto;
}

.todo-list__filter {
  margin-bottom: $spacing-xl;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.empty-state {
  text-align: center;
  padding: $spacing-xl;
  background-color: $color-bg-light;
  border-radius: $border-radius-medium;
  margin-top: $spacing-lg;
  color: $color-text-light;
}
</style>