<template>
  <div class="import-export">
    <h4 class="import-export__section-title">{{
      $t('tasks.form.import.title')
    }}</h4>
    <div class="import-export__buttons">
      <button-component
        v-if="mode === ModalMode.Edit"
        type="button"
        :variant="ButtonVariant.Secondary"
        @click="exportToJson"
      >
        {{ $t('tasks.form.import.exportToJson') }}
      </button-component>

      <button-component
        type="button"
        :variant="ButtonVariant.Secondary"
        @click="showImportForm = !showImportForm"
      >
        {{
          showImportForm
            ? $t('tasks.form.import.cancelImport')
            : $t('tasks.form.import.importFromJson')
        }}
      </button-component>
    </div>

    <div
      v-if="showImportForm"
      class="import-export__import-form"
    >
      <div class="import-export__import-tabs">
        <div
          :class="[
            'import-export__import-tab',
            importTab === 'text' && 'import-export__import-tab--active',
          ]"
          @click="importTab = 'text'"
        >
          {{ $t('tasks.form.import.text') }}
        </div>
        <div
          :class="[
            'import-export__import-tab',
            importTab === 'file' && 'import-export__import-tab--active',
          ]"
          @click="importTab = 'file'"
        >
          {{ $t('tasks.form.import.file') }}
        </div>
      </div>

      <div
        v-if="importTab === 'text'"
        class="import-export__import-text"
      >
        <textarea
          v-model="importJsonData"
          class="import-export__control"
          :placeholder="$t('tasks.form.import.putJsonData')"
          rows="5"
        ></textarea>
      </div>

      <div
        v-if="importTab === 'file'"
        class="import-export__import-file"
      >
        <div class="import-export__file-upload">
          <input
            id="task-file-upload"
            ref="fileInput"
            type="file"
            class="import-export__file-input"
            accept=".json"
            @change="handleFileUpload"
          />
          <label
            for="task-file-upload"
            class="import-export__file-label"
          >
            {{ selectedFileName || $t('tasks.form.import.chooseFile') }}
          </label>
        </div>
      </div>

      <p
        v-if="importError"
        class="import-export__import-error"
        >{{ importError }}</p
      >

      <div class="import-export__import-actions">
        <button-component
          type="button"
          :variant="ButtonVariant.Secondary"
          :disabled="!isValidImportData"
          class="import-export__import-button"
          @click="handleImportButtonClick"
        >
          {{ $t('tasks.form.import.import') }}
        </button-component>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps, ref, watch } from 'vue';
import { ButtonComponent, ButtonVariant, useToast } from '@shared/index.ts';
import type { Task } from '@entities/task';
import { TaskPriority } from '@entities/task';
import { type ImportExportProps, ModalMode } from '../types/TaskModal';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const { success, error } = useToast();

const props = defineProps<ImportExportProps>();
const emit = defineEmits<{
  (e: 'update-task', task: Partial<Task>): void;
}>();

const showImportForm = ref<boolean>(false);
const importJsonData = ref<string>('');
const importError = ref<string>('');
const importTab = ref<'text' | 'file'>('text');
const selectedFileName = ref<string>('');
const fileInput = ref<HTMLInputElement | null>(null);

watch(
  () => showImportForm.value,
  (isOpen) => {
    if (!isOpen) {
      importJsonData.value = '';
      importError.value = '';
      selectedFileName.value = '';
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    }
  },
);

const exportToJson = (): void => {
  if (!props.task) return;

  const jsonData = JSON.stringify(props.task, null, 2);

  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const linkToDownload = document.createElement('a');

  linkToDownload.href = url;
  linkToDownload.download = `task-${props.task.id}.json`;
  document.body.appendChild(linkToDownload);
  linkToDownload.click();

  setTimeout(() => {
    document.body.removeChild(linkToDownload);
    URL.revokeObjectURL(url);
    success(t('tasks.form.import.exportSuccess'));
  }, 0);
};

const handleFileUpload = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (!files || files.length === 0) {
    selectedFileName.value = '';
    importJsonData.value = '';
    importError.value = '';
    return;
  }

  const file = files[0];
  selectedFileName.value = file.name;
  importError.value = '';

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      importJsonData.value = content;

      JSON.parse(content);
    } catch {
      importError.value = t('tasks.form.import.importError');
      importJsonData.value = '';
    }
  };
  reader.onerror = () => {
    importError.value = t('tasks.form.import.importError');
    importJsonData.value = '';
  };
  reader.readAsText(file);
};

const validateImportedTask = (
  data: unknown,
): { isValid: boolean; error?: string } => {
  if (!data || typeof data !== 'object') {
    return { isValid: false, error: t('tasks.form.import.formatError') };
  }

  const task = data as Record<string, unknown>;

  if (!task.title) {
    return { isValid: false, error: t('tasks.form.import.formatError') };
  }

  if (task.title && typeof task.title !== 'string') {
    return { isValid: false, error: t('tasks.form.import.formatError') };
  }

  if (task.description !== undefined && typeof task.description !== 'string') {
    return { isValid: false, error: t('tasks.form.import.formatError') };
  }

  if (task.completed !== undefined && typeof task.completed !== 'boolean') {
    return {
      isValid: false,
      error: t('tasks.form.import.formatError'),
    };
  }

  if (task.priority !== undefined) {
    const validPriorities = [
      'low',
      'medium',
      'high',
      TaskPriority.Low,
      TaskPriority.Medium,
      TaskPriority.High,
    ];
    const priority = task.priority as string | number;
    if (!validPriorities.includes(priority as TaskPriority | string)) {
      return {
        isValid: false,
        error: t('tasks.form.import.formatError'),
      };
    }
  }

  if (task.subtasks !== undefined) {
    if (!Array.isArray(task.subtasks)) {
      return { isValid: false, error: t('tasks.form.import.formatError') };
    }

    for (const subtask of task.subtasks) {
      if (typeof subtask !== 'object' || subtask === null) {
        return {
          isValid: false,
          error: t('tasks.form.import.formatError'),
        };
      }

      const subtaskObj = subtask as Record<string, unknown>;

      if (!subtaskObj.title || typeof subtaskObj.title !== 'string') {
        return {
          isValid: false,
          error: t('tasks.form.import.formatError'),
        };
      }

      if (
        subtaskObj.completed !== undefined &&
        typeof subtaskObj.completed !== 'boolean'
      ) {
        return {
          isValid: false,
          error: t('tasks.form.import.formatError'),
        };
      }

      if (!subtaskObj.id) {
        return { isValid: false, error: t('tasks.form.import.formatError') };
      }
    }
  }

  return { isValid: true };
};

const isValidImportData = computed<boolean>(() => {
  return !!importJsonData.value && !importError.value;
});

const importFromJson = (): void => {
  if (!importJsonData.value || !importJsonData.value.trim()) {
    importError.value = 'Ошибка: JSON данные не могут быть пустыми';
    return;
  }

  try {
    const parsedData = JSON.parse(importJsonData.value);
    const validationResult = validateImportedTask(parsedData);

    if (!validationResult.isValid) {
      importError.value = `Ошибка: ${validationResult.error}`;
      return;
    }

    const taskId =
      props.mode === ModalMode.Add ? Date.now() : parsedData.id || Date.now();

    const updatedTaskForm = {
      ...parsedData,
      priority: parsedData.priority,
      id: taskId,
    };

    emit('update-task', updatedTaskForm);
    showImportForm.value = false;
    importJsonData.value = '';
    importError.value = '';

    if (fileInput.value) {
      fileInput.value.value = '';
    }
    selectedFileName.value = '';

    success(t('tasks.form.import.importSuccess'));
  } catch {
    error(t('tasks.form.import.importError'));
  }
};

const handleImportButtonClick = (): void => {
  if (!importJsonData.value || importError.value) {
    return;
  }

  importFromJson();
};
</script>

<style lang="scss" scoped>
@import '@styles/variables.scss';

.import-export {
  margin: $spacing-xl 0;
  padding: $spacing-lg 0;
  border-top: 1px solid $color-border;
  border-bottom: 1px solid $color-border;

  &__section-title {
    margin: 0 0 $spacing-md;
    font-size: 16px;
    font-weight: 600;
    color: $color-text-primary;
  }

  &__buttons {
    @include flex(row, flex-start, center, $spacing-sm);
    margin-bottom: $spacing-lg;
  }

  &__import-form {
    margin-top: $spacing-lg;
  }

  &__import-tabs {
    @include flex(row, flex-start, center);
    margin-bottom: $spacing-lg;
    border-bottom: 1px solid $color-border;
  }

  &__import-tab {
    padding: $spacing-sm $spacing-lg;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: $transition-base;

    &--active {
      border-bottom-color: $color-primary;
      color: $color-primary;
    }

    &:hover:not(&--active) {
      background-color: $color-bg-lighter;
    }
  }

  &__control {
    width: 100%;
    padding: $spacing-md;
    border: 1px solid $color-border;
    border-radius: $border-radius-small;
    font-size: 14px;
    transition: $transition-base;

    &:focus {
      outline: none;
      border-color: $color-primary;
      box-shadow: 0 0 0 2px rgba($color-primary, 0.1);
    }

    &::placeholder {
      color: $color-text-lighter;
    }
  }

  &__file-upload {
    position: relative;
    margin-bottom: $spacing-lg;
  }

  &__file-input {
    position: absolute;
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    z-index: -1;
  }

  &__file-label {
    @include flex(row, center, center);
    width: 100%;
    padding: $spacing-md;
    background-color: $color-bg-lighter;
    border: 1px dashed $color-border;
    border-radius: $border-radius-small;
    cursor: pointer;
    transition: $transition-base;
    font-weight: 500;
    color: $color-text-secondary;

    &:hover {
      background-color: $color-bg-blue-light;
      border-color: $color-primary;
      color: $color-primary;
    }

    &:before {
      content: '📂';
      margin-right: $spacing-md;
      font-size: 18px;
    }
  }

  &__import-error {
    color: $color-danger;
    font-size: 14px;
    margin: $spacing-sm 0;
  }

  &__import-actions {
    @include flex(row, flex-end, center);
    margin-top: $spacing-md;
  }

  &__import-button {
    position: relative;
    overflow: hidden;

    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.2);
      transition: $transition-smooth;
    }

    &:hover:after {
      left: 100%;
    }

    &:active {
      transform: scale(0.98);
    }

    &:not(:disabled) {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
