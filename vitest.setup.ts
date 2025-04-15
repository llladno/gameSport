import { config } from '@vue/test-utils';
import { vi } from 'vitest';

const mockI18n = {
  global: {
    locale: { value: 'ru' },
    t: (key: string) => key,
  },
  install: vi.fn(),
};

vi.mock('vue-i18n', () => {
  return {
    createI18n: () => mockI18n,
    useI18n: () => ({
      t: (key: string) => key,
      locale: { value: 'ru' },
    }),
  };
});

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

vi.mock('vue-toastification', () => ({
  default: {
    install: vi.fn(),
  },
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  }),
}));

vi.mock('@shared/i18n', () => {
  return {
    default: mockI18n,
    i18n: mockI18n,
    setLocale: vi.fn(),
    getLocale: () => 'ru',
    t: (key: string) => key,
    defaultLocale: 'ru',
  };
});

config.global.mocks = {
  $t: (key: string) => key,
  $i18n: {
    locale: 'ru',
    t: (key: string) => key,
  },
};

config.global.stubs = {
  'button-component': true,
  'modal-component': true,
};
