# Components

## Component Map

| Component | Location | Purpose |
|-----------|----------|---------|
| `App` | `src/App.tsx` | Root component, mouse tracking |
| `ChecksumForm` | `src/components/ChecksumForm.tsx` | Address input/conversion |
| `SettingsPanel` | `src/components/SettingsPanel.tsx` | Sliding settings drawer |
| `DecorativeSquares` | `src/components/DecorativeSquares.tsx` | Animated border squares |
| `ColorDropdowns` | `src/components/ColorDropdowns.tsx` | Tailwind color picker |
| `ThemeToggle` | `src/components/ThemeToggle.tsx` | Light/dark mode toggle |
| `WalletButton` | `src/components/WalletButton.tsx` | Wallet connect button |

## Component Patterns

### Store Usage
Components access Zustand store via hook:
```tsx
import { useSettingsStore } from '@/store/settings';

function MyComponent() {
  const { settings, updateSetting } = useSettingsStore();
  // ...
}
```

### Props Pattern
Components receive only what they need:
```tsx
interface DecorativeSquaresProps {
  mousePos: { x: number; y: number };
}
```

### Styling Pattern
Use Tailwind classes with `cn()` for conditionals:
```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  "base-classes",
  condition && "conditional-classes"
)} />
```

## SettingsPanel Structure

The settings panel uses custom components:
- `CollapsibleSection` - Animated fold/unfold sections
- `SliderWithMultipliers` - Slider with 1x/2x/5x/10x range buttons

Layout:
```
┌─────────────────────────────┐
│ [Wallet]          [Theme]   │  <- Top row
├─────────────────────────────┤
│ ▼ Square Color              │  <- CollapsibleSection
│   [Preview]                 │
│   [Family ▼] [Shade ▼]      │
├─────────────────────────────┤
│ ▼ Square Settings           │  <- CollapsibleSection
│   [Sliders...]              │
├─────────────────────────────┤
│ [Reset to Defaults]         │
└─────────────────────────────┘
```

## DecorativeSquares

Renders `squareCount` nested border squares with:
- Progressive opacity fade
- Mouse-based rotation and parallax
- Color from Tailwind palette (same in light/dark mode)

All parameters come from Zustand settings store.

## Adding a New Component

1. Create file in `src/components/`
2. Use path alias: `import { x } from '@/...'`
3. For store access: `import { useSettingsStore } from '@/store/settings'`
4. For UI primitives: `import { Button } from '@/components/ui/button'`
