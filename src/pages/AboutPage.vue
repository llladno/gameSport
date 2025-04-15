<template>
  <div class="max-w-4xl mx-auto px-4 py-10">
    <h1 class="text-3xl font-bold text[--color-white] mb-6">{{
      $t('about.title')
    }}</h1>

    <div class="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 class="text-2xl font-semibold text[--color-white] mb-4">{{
        $t('about.projectName')
      }}</h2>
      <p class="text[--color-white mb-4">
        {{ $t('about.shortDescription') }}
        <br />
        {{ $t('about.version') }}: 1.0.0
      </p>
    </div>

    <div class="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 class="text-2xl font-semibold text[--color-white] mb-4">{{
        $t('about.techStack')
      }}</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <ul class="list-disc pl-5 text[--color-white] space-y-1">
            <li>Vue 3 (Composition API)</li>
            <li>TypeScript</li>
            <li>Pinia </li>
            <li>Vue Router</li>
            <li>Vue-i18n </li>
            <li>Tailwind CSS </li>
            <li>Vite </li>
            <li>ESLint </li>
            <li>Vitest </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bg-white shadow-md rounded-lg p-6">
      <h2 class="text-2xl font-semibold text[--color-white] mb-4">{{
        $t('about.testing')
      }}</h2>
      <p class="text[--color-white] mb-4">
        {{ $t('about.testDescription') }}
      </p>

      <ul class="list-disc pl-5 text[--color-white] space-y-1 mb-4">
        <li>{{ $t('about.components.taskFilterStore') }}</li>
        <li>{{ $t('about.components.taskListStore') }}</li>
        <li>{{ $t('about.components.taskFilterComponent') }}</li>
        <li>{{ $t('about.components.taskModalComponent') }}</li>
      </ul>

      <div class="bg-gray-50 rounded p-3 border border-gray-200">
        <p class="text-sm text-gray-500 font-mono">npx vitest run</p>
      </div>
    </div>
  </div>
</template>
