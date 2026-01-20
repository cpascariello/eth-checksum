# Aleph Cloud Integration

## Overview

[Aleph Cloud](https://aleph.cloud/) is a decentralized storage and compute network. We use it to store user settings (profiles) without requiring a centralized backend.

**Why Aleph?**
- No backend required - data lives on the decentralized network
- Data is tied to wallet addresses - perfect for wallet-based auth
- Read operations are free (no signature needed)
- Write operations require a wallet signature (proves ownership)

## File Structure

```
src/
├── config/aleph.ts           # Constants (channel, keys, chain ID)
├── services/aleph.ts         # Aleph SDK integration
└── hooks/useAlephProfile.tsx  # React hook for profile management
```

### config/aleph.ts

Configuration constants:

| Constant | Value | Purpose |
|----------|-------|---------|
| `ALEPH_CHANNEL` | `'ETH_CHECKSUM'` | Namespace for our app's data |
| `ALEPH_AGGREGATE_KEY` | `'eth_checksum_profile'` | Key for profile aggregates |
| `ETH_MAINNET_CHAIN_ID` | `'0x1'` | Required chain for signing |

### services/aleph.ts

Two main functions:

- `fetchProfile(address)` - Read operation, returns `ProfileData` if exists
- `saveProfile(provider, settings, isDark)` - Write operation, stores profile (requires signature)

### hooks/useAlephProfile.tsx

React hook that manages profile loading and saving:

```ts
const { isSaving, isLoading, hasProfile, saveToCloud } = useAlephProfile();
```

- `isSaving` - True while saving to cloud
- `isLoading` - True while checking for profile on connect
- `hasProfile` - True if user has a cloud profile
- `saveToCloud()` - Function to save current settings

## Profile Data Structure

```typescript
interface ProfileData {
  version: 1;
  updatedAt: number;  // Unix timestamp
  settings: {
    squareCount: number;
    squareStep: number;
    squareStepIncrement: number;
    squareRotation: number;
    parallaxMultiplier: number;
    squareColorFamily: TailwindColorFamily;
    squareColorStep: TailwindColorStep;
    randomColors: SquareColor[];
  };
  isDark: boolean;
}
```

## User Flows

### First-time User

```
1. User connects wallet
        ↓
2. useAlephProfile detects connection
        ↓
3. fetchProfile(address) ← Free read operation
        ↓
4. Profile not found
        ↓
5. Show toast: "Save your settings to Aleph Cloud?"
        ↓
6. User clicks "Save"
        ↓
7. saveProfile() ← Triggers wallet popup
        ↓
8. Profile stored on Aleph network
        ↓
9. Toast: "Settings saved to Aleph Cloud!"
```

### Returning User

```
1. User connects wallet
        ↓
2. fetchProfile(address) ← Free read operation
        ↓
3. Profile found
        ↓
4. applyProfileSettings() ← Load into store
        ↓
5. Toast: "Settings loaded from Aleph Cloud!"
```

### Manual Save

```
1. User clicks "Save to Cloud" button (in SettingsPanel)
        ↓
2. saveProfile() ← Triggers wallet popup
        ↓
3. Profile overwritten on Aleph network
        ↓
4. Toast: "Settings saved to Aleph Cloud!"
```

## SDK Packages

The Aleph integration uses three SDK packages:

| Package | Purpose |
|---------|---------|
| `@aleph-sdk/client` | HTTP client for reading/writing to Aleph network |
| `@aleph-sdk/ethereum` | Ethereum account wrapper for signing messages |
| `@aleph-sdk/evm` | Wallet adapter to bridge browser wallets to SDK |

### ethers v5 Requirement

The Aleph SDK requires ethers v5 (not v6). Since wagmi/viem use ethers v6 internally, we install ethers v5 separately:

```bash
npm install ethers5@npm:ethers@^5.7.2
```

Then import from `ethers5`:

```ts
import { providers } from 'ethers5';
```

## Error Handling

The hook handles several error cases:

- **Wrong chain**: Shows "Please switch to Ethereum mainnet to save."
- **Rejected signature**: Shows "Signature rejected."
- **Other errors**: Shows "Failed to save settings."

## Resources

- [Aleph Documentation](https://docs.aleph.cloud/)
- [Aggregates Guide](https://docs.aleph.cloud/guides/messages/aggregate/)
- [SDK Reference](https://docs.aleph.cloud/tools/aleph-sdk-ts/)
