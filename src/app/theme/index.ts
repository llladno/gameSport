export enum Theme {
  Light = 'light',
  Dark = 'dark',
  System = 'system'
}

export const availableThemes = [
  Theme.Light,
  Theme.Dark,
  Theme.System
];

export const defaultTheme = Theme.System;

export function getSystemTheme(): Theme.Light | Theme.Dark {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? Theme.Dark
    : Theme.Light;
}

export function getCurrentTheme(): Theme.Light | Theme.Dark {
  const savedTheme = localStorage.getItem('theme') as Theme || defaultTheme;
  
  if (savedTheme === Theme.System) {
    return getSystemTheme();
  }
  
  return savedTheme as Theme.Light | Theme.Dark;
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  const currentTheme = theme === Theme.System ? getSystemTheme() : theme;
  
  localStorage.setItem('theme', theme);
  
  root.classList.remove(Theme.Light, Theme.Dark);
  
  root.classList.add(currentTheme);
  
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute(
      'content',
      currentTheme === Theme.Dark ? '#1f1f1f' : '#ffffff'
    );
  }
}

export function initTheme(): void {
  const savedTheme = localStorage.getItem('theme') as Theme || defaultTheme;
  applyTheme(savedTheme);
  
  if (savedTheme === Theme.System) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      applyTheme(Theme.System);
    });
  }
}

export function getTheme(): Theme {
  return localStorage.getItem('theme') as Theme || defaultTheme;
}