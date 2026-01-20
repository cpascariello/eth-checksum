# Components

## Component Map

| Component | Location | Purpose |
|-----------|----------|---------|
| `App` | `src/App.tsx` | Root component, mouse tracking |
| `ChecksumForm` | `src/components/ChecksumForm.tsx` | Address input/conversion |
| `SettingsPanel` | `src/components/SettingsPanel.tsx` | Sliding settings drawer |
| `DecorativeSquares` | `src/components/DecorativeSquares.tsx` | Animated border squares |
| `ColorDropdowns` | `src/components/ColorDropdowns.tsx` | Tailwind color picker + randomize buttons |
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

### Font Styling Pattern

JetBrains Mono is used throughout with varying weights:

| Weight | Class | Usage |
|--------|-------|-------|
| 100 | `font-thin` | Subtle footer text |
| 600 | `font-semibold` | Section headers |
| 800 | `font-extrabold` | Titles, primary buttons |

Usage examples:
```tsx
// Title (ChecksumForm)
<CardTitle className="text-2xl font-jetbrains-mono font-extrabold">

// Section header (SettingsPanel CollapsibleSection)
<button className="text-base font-jetbrains-mono font-semibold">

// Footer text (App.tsx)
<p className="text-xs font-jetbrains-mono font-thin">

// Monospace content (addresses, code)
<span className="font-mono">
```

The `font-jetbrains-mono` class explicitly uses JetBrains Mono, while `font-mono` uses the CSS variable (also JetBrains Mono).

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
│   ─────────────────────     │
│   [Random Color] [Randomize]│  <- Randomize buttons
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
- Per-square color support via `randomColors` array

All parameters come from Zustand settings store. When `randomColors` has entries, each square uses its corresponding color; otherwise falls back to the single color setting.

## Hooks

| Hook | Location | Purpose |
|------|----------|---------|
| `useAlephLogin` | `src/hooks/useAlephLogin.ts` | Tracks first-time wallet connections via Aleph Cloud |

### useAlephLogin

Integrates with Aleph Cloud to track first-time wallet connections without a backend.

**Flow:**
1. User connects wallet via WalletConnect/wagmi
2. Hook checks Aleph for existing login aggregate (free, no signature)
3. If no aggregate exists, shows toast prompting user to sign
4. On signature, creates aggregate on Aleph network
5. Future connections skip signature (aggregate already exists)

**Usage:**
```tsx
// In App.tsx - just call the hook at top level
import { useAlephLogin } from '@/hooks/useAlephLogin';

function App() {
  useAlephLogin(); // Handles everything automatically
  // ...
}
```

See [docs/aleph.md](aleph.md) for full Aleph integration details.

## Adding a New Component

1. Create file in `src/components/`
2. Use path alias: `import { x } from '@/...'`
3. For store access: `import { useSettingsStore } from '@/store/settings'`
4. For UI primitives: `import { Button } from '@/components/ui/button'`
