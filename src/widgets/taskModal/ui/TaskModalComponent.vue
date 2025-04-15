<template>
  <modal-component
    v-model="isModalOpen"
    :title="modalTitle"
  >
    <form
      class="task-form"
      @submit.prevent="handleSubmit"
    >
      <div class="task-form__group">
        <label class="task-form__label">{{ $t('tasks.form.title') }}</label>
        <input
          v-model="taskForm.title"
          type="text"
          class="task-form__control"
        />
      </div>

      <div class="task-form__group">
        <label class="task-form__label">{{
          $t('tasks.form.description')
        }}</label>
        <textarea
          v-model="taskForm.description"
          class="task-form__control"
        />
      </div>

      <div class="task-form__group">
        <label class="task-form__label">{{ $t('tasks.form.priority') }}</label>
        <select
          v-model="taskForm.priority"
          class="task-form__control"
          required
        >
          <option :value="TaskPriority.Low">{{
            $t(`tasks.priority.${TaskPriority.Low}`)
          }}</option>
          <option :value="TaskPriority.Medium">{{
            $t(`tasks.priority.${TaskPriority.Medium}`)
          }}</option>
          <option :value="TaskPriority.High">{{
            $t(`tasks.priority.${TaskPriority.High}`)
          }}</option>
        </select>
      </div>

      <div
        v-if="mode === ModalMode.Edit"
        class="task-form__group"
      >
        <div class="task-form__checkbox-group">
          <input
            v-model="taskForm.completed"
            type="checkbox"
            class="task-form__checkbox"
          />
          <span class="task-form__text">{{ $t('tasks.form.completed') }}</span>
        </div>
      </div>

      <div
        v-if="mode === ModalMode.Edit"
        class="task-form__subtasks"
      >
        <template v-if="taskForm.subtasks && taskForm.subtasks.length > 0">
          <h4 class="task-form__section-title">{{ $t('tasks.subtasks') }}</h4>
          <div
            v-for="(subtask, index) in taskForm.subtasks"
            :key="subtask.id"
            class="task-form__subtask-item"
          >
            <input
              v-model="subtask.completed"
              type="checkbox"
              class="task-form__checkbox"
            />
            <input
              v-model="subtask.title"
              type="text"
              class="task-form__control"
            />
            <button-component
              type="button"
              :variant="ButtonVariant.Red"
              @click="removeSubtask(index)"
              >Удалить</button-component
            >
          </div>
        </template>

        <div class="task-form__add-subtask">
          <button-component
            type="button"
            class="task-form__btn task-form__btn--add"
            @click="showSubtaskForm = !showSubtaskForm"
          >
            {{
              showSubtaskForm
                ? $t('common.cancel')
                : $t('tasks.form.addSubtask')
            }}
          </button-component>

          <div
            v-if="showSubtaskForm"
            class="task-form__subtask-form"
          >
            <input
              v-model="newSubtask"
              type="text"
              :placeholder="$t('tasks.form.subtaskName')"
              class="task-form__control"
            />
            <button-component
              type="button"
              class="task-form__btn task-form__btn--add"
              @click="addSubtask"
              >{{ $t('tasks.submitAdd') }}</button-component
            >
          </div>
        </div>
      </div>

      <task-import-export-component
        :task="taskForm"
        :mode="mode"
        @update-task="updateTaskFromImport"
      />

      <div class="task-form__actions">
        <button-component
          :variant="ButtonVariant.Grey"
          type="button"
          @click="closeModal"
          >{{ $t('common.cancel') }}</button-component
        >
        <button-component type="submit">{{
          submitButtonText
        }}</button-component>
      </div>
    </form>
  </modal-component>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  ButtonComponent,
  ButtonVariant,
  ModalComponent,
  useToast,
} from '@shared/index.ts';
import type { Subtask, Task } from '@entities/task';
import { TaskPriority } from '@entities/task';
import { ModalMode, type Props } from '../types/TaskModal.ts';
import TaskImportExportComponent from './TaskImportExportComponent.vue';
import { useTaskListStore } from '@widgets/todoList';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const { success, warning } = useToast();

const props = withDefaults(defineProps<Props>(), {
  mode: ModalMode.Add,
});

const taskListStore = useTaskListStore();

const emit = defineEmits([
  'update:modelValue',
  'add-task',
  'edit-task',
  'delete-task',
]);

const isModalOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const modalTitle = computed<string>(() =>
  props.mode === ModalMode.Add ? t('tasks.add') : t('tasks.edit'),
);

const submitButtonText = computed<string>(() =>
  props.mode === ModalMode.Add ? t('tasks.submitAdd') : t('tasks.submitEdit'),
);

watch(isModalOpen, (newVal) => {
  if (!newVal) {
    taskForm.value = defaultTaskForm();
  }
});

const defaultTaskForm = (): Partial<Task> => ({
  title: '',
  description: '',
  completed: false,
  priority: TaskPriority.Medium,
  subtasks: [],
});

const taskForm = ref<Partial<Task>>(defaultTaskForm());
const showSubtaskForm = ref<boolean>(false);
const newSubtask = ref<string>('');

watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      taskForm.value = { ...newTask };
    } else {
      taskForm.value = defaultTaskForm();
    }
  },
  { immediate: true },
);

watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) {
      showSubtaskForm.value = false;
      newSubtask.value = '';
    }
  },
);

const addSubtask = (): void => {
  if (!newSubtask.value.trim()) return;

  if (!taskForm.value.subtasks) {
    taskForm.value.subtasks = [];
  }

  const newSubtaskObj: Subtask = {
    id: Date.now(),
    title: newSubtask.value,
    completed: false,
  };

  taskForm.value.subtasks.push(newSubtaskObj);
  newSubtask.value = '';
  showSubtaskForm.value = false;
};

const removeSubtask = (index: number): void => {
  taskForm.value.subtasks?.splice(index, 1);
};

const closeModal = (): void => {
  isModalOpen.value = false;
};

const handleSubmit = (): void => {
  if (!taskForm.value.title?.trim()) {
    warning(t('tasks.form.warning'));
    return;
  }

  if (props.mode === ModalMode.Add) {
    taskListStore.addTask({
      ...taskForm.value,
      id: Date.now(),
      completed: false,
      dateCreate: new Date().toISOString(),
    } as Task);
  } else {
    emit('edit-task', taskForm.value);
  }

  success(t('tasks.form.success'));
  closeModal();
};

const updateTaskFromImport = (importedTask: Partial<Task>): void => {
  taskForm.value = { ...importedTask };
};
</script>

<style lang="scss" scoped>
@import '@styles/variables.scss';

.task-form {
  @include flex(column, flex-start, stretch, $spacing-lg);
  width: 100%;

  &__group {
    @include flex(column, flex-start, stretch, $spacing-xs);
    margin-bottom: $spacing-md;
  }

  &__label {
    font-weight: 500;
    color: $color-text-primary;
    margin-bottom: $spacing-xs;
  }

  &__checkbox-group {
    @include flex(row, flex-start, center, $spacing-md);
  }

  &__text {
    color: $color-text-secondary;
  }

  &__control {
    width: 100%;
    padding: $spacing-md;
    border: 1px solid $color-border;
    border-radius: $border-radius-small;
    font-size: 14px;
    transition: $transition-base;
    background: $color-white;

    &:focus {
      outline: none;
      border-color: $color-primary;
      box-shadow: 0 0 0 2px rgba($color-primary, 0.1);
    }

    &::placeholder {
      color: $color-text-lighter;
    }

    textarea {
      min-height: 100px;
      resize: vertical;
    }
  }

  &__checkbox {
    width: auto;
    margin-right: $spacing-sm;
  }

  &__section-title {
    margin: 0 0 $spacing-md;
    font-size: 16px;
    font-weight: 600;
    color: $color-text-primary;
  }

  &__subtasks {
    margin: $spacing-lg 0;
    padding-top: $spacing-lg;
    border-top: 1px solid $color-border;
  }

  &__subtask-item {
    @include flex(row, flex-start, center, $spacing-sm);
    margin-bottom: $spacing-md;

    .task-form__control {
      flex: 1;
    }
  }

  &__add-subtask {
    margin-top: $spacing-lg;
  }

  &__subtask-form {
    @include flex(row, flex-start, center, $spacing-sm);
    margin-top: $spacing-md;

    .task-form__control {
      flex: 1;
    }
  }

  &__actions {
    @include flex(row, flex-end, center, $spacing-sm);
    margin-top: $spacing-xl;
  }
}
</style>
