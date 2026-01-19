import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings, TailwindColorFamily, TailwindColorStep } from '../types';
import { DEFAULT_SETTINGS, TAILWIND_COLOR_FAMILIES } from '../types';

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

  // Settings Panel (not persisted)
  isSettingsPanelOpen: boolean;
  toggleSettingsPanel: () => void;
}

// Old settings interface for migration
interface OldSettings {
  squareCount?: number;
  squareStep?: number;
  squareStepIncrement?: number;
  squareRotation?: number;
  parallaxMultiplier?: number;
  squareColor?: string;
  squareColorFamily?: TailwindColorFamily;
  squareColorStep?: TailwindColorStep;
}

// Migration function to convert old squareColor to new format
function migrateSettings(oldSettings: OldSettings): Settings {
  const settings: Settings = {
    squareCount: oldSettings.squareCount ?? DEFAULT_SETTINGS.squareCount,
    squareStep: oldSettings.squareStep ?? DEFAULT_SETTINGS.squareStep,
    squareStepIncrement: oldSettings.squareStepIncrement ?? DEFAULT_SETTINGS.squareStepIncrement,
    squareRotation: oldSettings.squareRotation ?? DEFAULT_SETTINGS.squareRotation,
    parallaxMultiplier: oldSettings.parallaxMultiplier ?? DEFAULT_SETTINGS.parallaxMultiplier,
    squareColorFamily: DEFAULT_SETTINGS.squareColorFamily,
    squareColorStep: DEFAULT_SETTINGS.squareColorStep,
  };

  // If already migrated, use existing values
  if (oldSettings.squareColorFamily && oldSettings.squareColorStep !== undefined) {
    settings.squareColorFamily = oldSettings.squareColorFamily;
    settings.squareColorStep = oldSettings.squareColorStep;
  }
  // Migrate from old squareColor format
  else if (oldSettings.squareColor) {
    const oldColor = oldSettings.squareColor;
    // Check if the old color exists in Tailwind families
    if (TAILWIND_COLOR_FAMILIES.includes(oldColor as TailwindColorFamily)) {
      settings.squareColorFamily = oldColor as TailwindColorFamily;
    }
    // Default step for migrated colors
    settings.squareColorStep = 400;
  }

  return settings;
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

      isSettingsPanelOpen: false,
      toggleSettingsPanel: () =>
        set((state) => ({ isSettingsPanelOpen: !state.isSettingsPanelOpen })),
    }),
    {
      name: 'eth-checksum-settings',
      version: 1,
      partialize: (state) => ({
        settings: state.settings,
        // isDark is handled separately via localStorage for backwards compatibility
      }),
      migrate: (persistedState: unknown, version: number) => {
        if (version === 0) {
          // Version 0: old format with squareColor
          const state = persistedState as { settings?: OldSettings };
          if (state.settings) {
            return {
              ...state,
              settings: migrateSettings(state.settings),
            };
          }
        }
        return persistedState as { settings: Settings };
      },
    }
  )
);

// Initialize theme on module load
if (typeof window !== 'undefined') {
  const isDark = getInitialTheme();
  document.documentElement.classList.toggle('dark', isDark);
}
