# UI Components

## Overview

UI primitives follow shadcn/ui patterns but are manually added (not via CLI).
They use Radix UI headless components with Tailwind styling.

**Important:** Always check [shadcn/ui](https://ui.shadcn.com/docs/components) for existing components before creating custom ones. Copy and adapt their implementation to maintain consistency.

## Available UI Components

| Component | Location | Radix Primitive |
|-----------|----------|-----------------|
| Button | `src/components/ui/button.tsx` | `@radix-ui/react-slot` |
| Card | `src/components/ui/card.tsx` | None |
| Input | `src/components/ui/input.tsx` | None |
| Select | `src/components/ui/select.tsx` | `@radix-ui/react-select` |
| Slider | `src/components/ui/slider.tsx` | `@radix-ui/react-slider` |

## Adding a New UI Component

### 1. Install Radix primitive (if needed)

```bash
npm install @radix-ui/react-[component]
```

### 2. Create component file

Create `src/components/ui/[component].tsx` following shadcn patterns:

```tsx
import * as React from "react"
import * as ComponentPrimitive from "@radix-ui/react-[component]"
import { cn } from "@/lib/utils"

const Component = React.forwardRef<
  React.ComponentRef<typeof ComponentPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ComponentPrimitive.Root>
>(({ className, ...props }, ref) => (
  <ComponentPrimitive.Root
    ref={ref}
    className={cn("base-styles", className)}
    {...props}
  />
))
Component.displayName = ComponentPrimitive.Root.displayName

export { Component }
```

### 3. Use CSS variables for theming

Use semantic color classes that reference CSS variables:
- `bg-background`, `bg-foreground`
- `bg-primary`, `text-primary-foreground`
- `bg-muted`, `text-muted-foreground`
- `bg-accent`, `text-accent-foreground`
- `border-border`, `border-input`
- `ring-ring`

## cn() Helper

Located at `src/lib/utils.ts`:

```typescript
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
```

Combines conditional classes and resolves Tailwind conflicts.

## Button Variants

```tsx
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>

<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
```

## Select Usage

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

## Slider Usage

```tsx
import { Slider } from '@/components/ui/slider';

<Slider
  value={[value]}
  onValueChange={([v]) => setValue(v)}
  min={0}
  max={100}
  step={1}
/>
```
