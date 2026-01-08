import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings } from '../types';
import { DEFAULT_SETTINGS } from '../types';

function getInitialTheme(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem('theme');
  if (stored) return stored === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

interface SettingsState {
  // Settings
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  resetToDefaults: () => void;

  // Theme (separate from settings for now, can be merged into settings later)
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
  toggleTheme: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: { ...DEFAULT_SETTINGS },

      updateSetting: (key, value) =>
        set((state) => ({
          settings: { ...state.settings, [key]: value },
        })),

      resetToDefaults: () =>
        set({ settings: { ...DEFAULT_SETTINGS } }),

      isDark: getInitialTheme(),

      setIsDark: (isDark) => {
        document.documentElement.classList.toggle('dark', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        set({ isDark });
      },

      toggleTheme: () =>
        set((state) => {
          const newIsDark = !state.isDark;
          document.documentElement.classList.toggle('dark', newIsDark);
          localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
          return { isDark: newIsDark };
        }),
    }),
    {
      name: 'eth-checksum-settings',
      partialize: (state) => ({
        settings: state.settings,
        // isDark is handled separately via localStorage for backwards compatibility
      }),
    }
  )
);

// Initialize theme on module load
if (typeof window !== 'undefined') {
  const isDark = getInitialTheme();
  document.documentElement.classList.toggle('dark', isDark);
}
