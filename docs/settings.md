# Settings & State Management

## Store Location

`src/store/settings.ts` - Single Zustand store for all app state.

## Current Settings

Defined in `src/types/index.ts`:

```typescript
interface Settings {
  squareCount: number;           // Number of decorative squares
  squareStep: number;            // Base spacing between squares
  squareStepIncrement: number;   // Spacing acceleration
  squareRotation: number;        // Mouse rotation multiplier
  parallaxMultiplier: number;    // Mouse parallax multiplier
  squareColorFamily: TailwindColorFamily;  // e.g., 'neutral', 'blue'
  squareColorStep: TailwindColorStep;      // e.g., 400, 500
}
```

## Adding a New Setting

### 1. Add to types (`src/types/index.ts`)

```typescript
// Add to DEFAULT_SETTINGS
export const DEFAULT_SETTINGS = {
  // ... existing
  myNewSetting: 'default-value',
} as const;

// Add to Settings interface
export interface Settings {
  // ... existing
  myNewSetting: string;
}
```

### 2. Use in component

```typescript
const { settings, updateSetting } = useSettingsStore();
const { myNewSetting } = settings;

// Update:
updateSetting('myNewSetting', newValue);
```

### 3. Add UI control in SettingsPanel

Add inside a `CollapsibleSection` in `src/components/SettingsPanel.tsx`.

## Migration (for breaking changes)

When changing setting structure, update `src/store/settings.ts`:

```typescript
persist(
  (set) => ({ /* ... */ }),
  {
    name: 'eth-checksum-settings',
    version: 2,  // Increment version
    migrate: (persistedState, version) => {
      if (version === 1) {
        // Transform old format to new
        const state = persistedState as OldStateType;
        return {
          ...state,
          settings: transformSettings(state.settings),
        };
      }
      return persistedState;
    },
  }
)
```

## Store API

```typescript
const {
  // Settings
  settings,                    // Current settings object
  updateSetting(key, value),   // Update single setting
  resetToDefaults(),           // Reset all to defaults

  // Theme
  isDark,                      // Current theme
  setIsDark(boolean),          // Set theme
  toggleTheme(),               // Toggle theme

  // Panel
  isSettingsPanelOpen,         // Panel visibility
  toggleSettingsPanel(),       // Toggle panel
} = useSettingsStore();
```

## Persistence

- Settings: localStorage key `eth-checksum-settings`
- Theme: localStorage key `theme` (separate for backwards compatibility)
- Panel state: Not persisted
