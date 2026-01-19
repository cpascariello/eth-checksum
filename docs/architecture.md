# Architecture

## Overview

ETH Checksum is an Ethereum address checksum converter built with React 19, TypeScript, Vite, and Tailwind CSS v4.

## Directory Structure

```
src/
├── components/          # React components
│   ├── ui/              # Reusable UI primitives (shadcn-style)
│   └── *.tsx            # Feature components
├── config/              # Configuration (wagmi, Aleph)
├── hooks/               # Custom React hooks
├── lib/                 # Utilities (cn helper)
├── services/            # External service integrations (Aleph)
├── store/               # Zustand stores
├── types/               # TypeScript types and constants
├── App.tsx              # Main app component
├── main.tsx             # Entry point with providers
└── index.css            # Global styles, Tailwind imports
```

## Key Technologies

| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool, dev server |
| Tailwind CSS v4 | Styling |
| Zustand | State management |
| Radix UI | Headless UI primitives |
| ethers.js | Ethereum utilities |
| @reown/appkit + wagmi | Wallet connection |
| @aleph-sdk/* | Decentralized storage (login tracking) |

## Data Flow

```
main.tsx (providers: Wagmi, QueryClient)
    └── App.tsx (mouse tracking state, useAlephLogin hook)
            ├── SettingsPanel (reads/writes Zustand store)
            ├── DecorativeSquares (reads store + mouse position)
            └── ChecksumForm (ethers.js for conversion)

Aleph Login Flow:
    Wallet Connect → useAlephLogin hook
        → checkLoginAggregate (read from Aleph network)
        → if new user: toast prompt → createLoginAggregate (write to Aleph)
```

## State Management

All persistent state lives in Zustand store (`src/store/settings.ts`):
- Settings are persisted to localStorage
- Theme is persisted separately for backwards compatibility
- Panel open/close state is not persisted

## Styling Approach

- Tailwind CSS v4 with CSS variables for theming
- Dark mode via `.dark` class on `<html>`
- Component styles use `cn()` helper for conditional classes
- Colors reference CSS variables (e.g., `bg-background`, `text-foreground`)
