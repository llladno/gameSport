# GameSport - Менеджер задач

Веб-приложение для управления задачами с возможностью фильтрации, сортировки и организации задач по приоритетам.
Задача TODO для импорта [task-1744696804527.json](https://github.com/user-attachments/files/19753755/task-1744696804527.json)
## Функциональность

- 🔍 Поиск задач
- ✅ Отметка задач как выполненных
- 🎯 Фильтрация по приоритетам (Низкий, Средний, Высокий)
- 🌓 Тёмная и светлая темы
- 🌐 Многоязычный интерфейс (Русский, Английский)
- 📂 Импорт/экспорт задач в формате JSON
- 📱 Адаптивный дизайн для различных устройств
- 📋 Подзадачи с отдельными статусами выполнения
- 📊 Пагинация для удобного просмотра большого количества задач

## Технический стек

### Frontend

- Vue 3 (Composition API)
- TypeScript
- Pinia (управление состоянием)
- Vue Router
- Vue-i18n (интернационализация)
- Tailwind CSS

### Инструменты разработки

- Vite
- ESLint
- Vitest (тестирование)

## Архитектура

### Общая структура

Проект организован с использованием модульной архитектуры, основанной на принципах Feature-Sliced Design (FSD). Эта методология позволяет создавать масштабируемые и поддерживаемые приложения с четкими границами между модулями.

```
src/
├── app/           # Инициализация приложения, глобальные стили и роутер
├── entities/      # Основные сущности (Task)
├── features/      # Функциональные модули
│   ├── addTask/   # Добавление задач
│   ├── taskFilter/# Фильтрация задач
├── pages/         # Страницы приложения
├── shared/        # Общие компоненты, утилиты, локализация
├── widgets/       # Составные компоненты
    ├── taskModal/ # Модальное окно для работы с задачами
    ├── todoList/  # Список задач с фильтрацией и пагинацией
```

### Слои архитектуры

Архитектура разделена на слои с четкими зависимостями:

1. **app** — корневой слой приложения:

   - Инициализация и конфигурация приложения
   - Подключение глобальных стилей и темы
   - Настройка Vue Router и основных провайдеров
   - Точка входа в приложение

2. **entities** — бизнес-сущности:

   - Модель данных Task со всеми типами
   - Базовый компонент для отображения задачи
   - Минимальная бизнес-логика работы с сущностями

3. **features** — пользовательские функции:

   - Модули, реализующие конкретные функциональные возможности
   - Изолированные компоненты с собственным состоянием
   - Каждая функция расположена в отдельной директории

4. **widgets** — составные интерфейсы:

   - Композиция из нескольких фич и/или entities
   - Компоненты, которые объединяют несколько функций
   - Реализация более сложных сценариев взаимодействия

5. **pages** — страницы приложения:

   - Компоновка widgets, features и entities на странице
   - Роутинг и навигация между страницами
   - Минимальная логика, в основном композиция компонентов

6. **shared** — переиспользуемый код:
   - UI-компоненты общего назначения
   - Утилиты и хелперы
   - Константы, типы и интерфейсы
   - Сервисы для работы с API и хранилищем

### Внутренняя структура модулей

Каждый модуль (feature, entity, widget) имеет стандартную структуру:

```
module/
├── ui/             # Компоненты представления
├── model/          # Бизнес-логика (Pinia store)
├── types/          # TypeScript типы и интерфейсы
├── lib/            # Вспомогательные функции
├── constants/      # Константы
└── index.ts        # Публичный API модуля
```

### Управление состоянием

В проекте используется Pinia для управления состоянием с разделением на:

1. **Глобальное состояние** — данные, доступные всему приложению (задачи, настройки)
2. **Локальное состояние компонентов** — внутреннее состояние UI-компонентов
3. **Хранилища фич** — изолированное состояние для конкретных функций

### Технические аспекты

1. **TypeScript** используется для типизации всего кода
2. **Vue Composition API** для компонентного дизайна
3. **ESLint** и **Prettier** для поддержания единого стиля кода
4. **Vitest** для модульного тестирования
5. **Tailwind CSS** для стилизации компонентов
6. **Vue-i18n** для локализации интерфейса

## Установка и запуск

### Предварительные требования

- Node.js (версия 16.x или выше)
- npm или yarn

### Установка зависимостей

```bash
npm install
# или
yarn
```

### Запуск в режиме разработки

```bash
npm run dev
# или
yarn dev
```

### Сборка для производства

```bash
npm run build
# или
yarn build
```

### Запуск тестов

```bash
npm run test
# или
yarn test
```

## Тестирование

Проект покрыт юнит-тестами с использованием Vitest. Тесты охватывают:

- TaskFilterStore - фильтрация задач
- TaskListStore - работа с задачами (создание, редактирование, удаление)
- TaskFilterComponent - компонент фильтрации
- TaskModalComponent - модальное окно создания/редактирования задач

## Хранение данных

Приложение использует localStorage для сохранения:

- Списка задач
- Настроек пагинации
- Настроек пользователя (язык, тема)

## Локализация

Поддерживаемые языки:

- Русский (по умолчанию)
- Английский

Локализационные строки находятся в `src/shared/i18n/locales/`.

## Темы

Приложение поддерживает:

- Светлую тему
- Тёмную тему
- Системную тему (определяется настройками системы)

## Структура задачи

```typescript
interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: TaskPriority; // 'low', 'medium', 'high'
  subtasks?: Subtask[];
  dateCreate?: string;
}

interface Subtask {
  id: number;
  title: string;
  completed: boolean;
}
```


