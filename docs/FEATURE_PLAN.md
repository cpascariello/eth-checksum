# ETH Checksummer Architecture Assessment & Refactoring Plan

> **Scope for current branch**: Phase 1 (Refactoring) only. Phases 2-4 saved for future implementation.

## Current State

The codebase is **clean but deliberately simple** - a single 215-line `App.tsx` with:
- 7 `useState` hooks (no centralized state management)
- Zero component hierarchy (everything in one file)
- No persistence abstraction (only localStorage for theme)
- No testing framework

This works for a single-purpose tool but **won't scale** for the proposed features.

## Feature Readiness Assessment

| Feature | Ready? | Effort | Key Blockers |
|---------|--------|--------|--------------|
| Settings Sliders | 60% | Low | Component extraction needed |
| Profile System | 20% | High | Need state management + persistence layer |
| Profile Sharing | 5% | Very High | Need backend or blockchain infrastructure |
| WalletConnect | 10% | Very High | Need provider architecture + wagmi/viem |

## Recommended Refactoring

### Phase 1: Foundation (CURRENT SCOPE)

**Branch**: `refactor/component-extraction`

#### Step 0: Create branch and save plan
```bash
git checkout -b refactor/component-extraction
```
- Save this plan as `docs/FEATURE_PLAN.md` in the repo

#### Step 1: Install Zustand
```bash
npm install zustand
```

#### Step 2: Create type definitions
Create `src/types/index.ts`:
```typescript
export const COLORS = ['neutral', 'red', 'orange', 'yellow', 'emerald', 'blue', 'fuchsia', 'rose'] as const;
export type ColorName = typeof COLORS[number];

export interface Settings {
  squareCount: number;
  squareStep: number;
  squareStepIncrement: number;
  squareRotation: number;
  parallaxMultiplier: number;
  squareColor: ColorName;
  isDark: boolean;
}

export interface Profile {
  id: string;
  name: string;
  settings: Settings;
  createdAt: number;
}
```

#### Step 3: Create Zustand store
Create `src/store/settings.ts`:
- Export `useSettingsStore` with settings state
- Include actions: `updateSetting`, `resetToDefaults`
- Persist to localStorage with Zustand middleware

#### Step 4: Extract components
| Component | Responsibility |
|-----------|----------------|
| `DecorativeSquares.tsx` | Animated background squares |
| `ColorPicker.tsx` | Color selection circles |
| `ThemeToggle.tsx` | Dark/light mode switch |
| `ChecksumForm.tsx` | Input, validation, result display |

#### Step 5: Refactor App.tsx
- Import extracted components
- Use Zustand store instead of useState for settings
- Keep App.tsx as layout orchestrator only

#### Verification
- `npm run build` passes
- `npm run dev` - all existing functionality works identically
- Settings persist across page refresh (localStorage via Zustand)

---

## Future Phases (Not in current scope)

### Phase 2: Settings Panel + Profiles

1. Build `<SettingsPanel>` with sliders for each constant
2. Implement profile CRUD operations
3. Add persistence abstraction (localStorage now, API-ready later)

### Phase 3: Profile Sharing via URL Params

Encode settings directly in URL for instant sharing:
- Use `URLSearchParams` to serialize/deserialize settings
- Compress if needed (base64 or similar)
- Parse on page load, apply to settings store
- Share button generates copyable URL

### Phase 4: Wallet + Aleph Cloud Integration

**Dependencies to add:**
```bash
npm install @aleph-sdk/client @aleph-sdk/ethereum wagmi viem @tanstack/react-query
```

**Integration approach:**
1. Use wagmi for wallet connection (MetaMask, WalletConnect, etc.)
2. Use `@aleph-sdk/ethereum` with `getAccountFromProvider()` to get Aleph account
3. Store profiles as **Aggregates** (key-value, amendable):
   ```typescript
   await client.createAggregate({
     key: 'eth-checksum-profile',
     content: { settings, metadata, timestamp },
     address: account.address
   })
   ```
4. Retrieve with `fetchAggregate(address, 'eth-checksum-profile')`
5. Aggregates can be updated (unlike Posts which are immutable)

**Wallet features:**
- Connect/disconnect wallet
- Auto-fill connected address for checksumming
- Sign and store profile settings on Aleph Cloud
- Amend profile metadata over time
- Optionally load profiles from any wallet address

## Proposed File Structure

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── types/
│   └── index.ts              # Settings, Profile interfaces
├── store/
│   ├── settings.ts           # Zustand settings store
│   └── profiles.ts           # Zustand profiles store
├── components/
│   ├── ChecksumForm.tsx
│   ├── SettingsPanel.tsx
│   ├── DecorativeSquares.tsx
│   ├── ColorPicker.tsx
│   ├── ThemeToggle.tsx
│   └── WalletButton.tsx      # Connect/disconnect wallet
├── hooks/
│   ├── useChecksum.ts
│   └── useAlephProfile.ts    # Aleph Cloud profile operations
├── lib/
│   ├── aleph.ts              # Aleph client setup
│   └── url-params.ts         # URL-based sharing utilities
└── wagmi.config.ts           # Wagmi wallet configuration
```

## Recommendation

**Yes, refactor before adding features.** The current single-file architecture will become unmaintainable with these additions. The refactoring effort is modest and pays dividends immediately.

**Implementation order:**
1. Extract components + add Zustand (foundation)
2. Build settings panel with sliders (quick win, visible progress)
3. Add local profile system with localStorage
4. Add URL-based sharing (simple, no dependencies)
5. Add wagmi + Aleph Cloud integration (wallet connection + decentralized storage)

## Verification

After each phase:
- Run `npm run build` to ensure no TypeScript errors
- Run `npm run dev` and manually test:
  - Phase 1: All existing functionality works after refactor
  - Phase 2: Sliders update squares in real-time
  - Phase 3: Profiles save/load from localStorage
  - Phase 4: Shared URLs restore settings correctly
  - Phase 5: Wallet connects, profile saves to Aleph, can be retrieved
