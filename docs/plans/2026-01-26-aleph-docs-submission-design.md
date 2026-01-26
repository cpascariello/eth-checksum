# Aleph Docs Submission Design

## Goal

Submit a PR to [aleph-im/aleph-cloud-docs](https://github.com/aleph-im/aleph-cloud-docs) adding an Aleph Aggregates tutorial to the devhub examples section. Primary goal is discoverability — developers browsing Aleph docs should find this as a learning resource.

## Changes

### 1. Replace `/docs/devhub/examples/index.md`

Replace the current content (which links to broken example pages) with the Aleph Aggregates Cookbook.

### 2. Remove broken subdirectories

Remove or simplify the broken example subdirectories:
- `defi/`
- `gaming/`
- `nft/`
- `web3-apps/`

## Page Content

### Title

"Aleph Aggregates Cookbook"

### Section 1: Introduction

Opening paragraph:

> Aggregates are key-value pairs stored on the Aleph network, associated with a wallet address. They're ideal for storing user preferences, settings, or any data that should persist across sessions without a centralized backend.

Why Aggregates:
- No backend required — data lives on the decentralized network
- Wallet-native — data is tied to addresses, perfect for wallet-based auth
- Free reads — fetching data requires no signature
- Signed writes — storing data proves ownership via wallet signature

What we'll build:
1. Check for existing user data when wallet connects
2. Load saved settings if profile exists
3. Prompt new users to save their current settings
4. Allow manual saves anytime

Live example: [eth-checksummer.stasho.xyz](https://eth-checksummer.stasho.xyz)
Source: [github.com/cpascariello/eth-checksum](https://github.com/cpascariello/eth-checksum)

### Section 2: Prerequisites

SDK Packages:

```bash
npm install @aleph-sdk/client @aleph-sdk/ethereum @aleph-sdk/evm
```

| Package | Purpose |
|---------|---------|
| `@aleph-sdk/client` | HTTP client for reading/writing to Aleph network |
| `@aleph-sdk/ethereum` | Ethereum account wrapper for signing messages |
| `@aleph-sdk/evm` | Wallet adapter to bridge browser wallets to SDK |

ethers v5 Requirement:

> The Aleph SDK requires ethers v5, not v6. If you're using wagmi/viem (which use ethers v6 internally), install ethers v5 separately:

```bash
npm install ethers5@npm:ethers@^5.7.2
```

Then import from `ethers5`:

```ts
import { providers } from 'ethers5';
```

Assumed knowledge:
- React with hooks
- Wallet connection via wagmi or similar
- Basic TypeScript

### Section 3: Configuration

```ts
// config/aleph.ts

/**
 * Channel identifier for organizing your data on Aleph.
 * Think of channels like namespaces - they group related aggregates
 * and make it easier to query data for a specific application.
 */
export const ALEPH_CHANNEL = 'YOUR_APP_NAME';

/**
 * The key used to store your aggregates.
 * Each wallet address can have multiple aggregates with different keys.
 */
export const ALEPH_AGGREGATE_KEY = 'your_app_profile';

/**
 * Ethereum Mainnet chain ID in hex format.
 * Aleph signatures must be on mainnet for data persistence.
 */
export const ETH_MAINNET_CHAIN_ID = '0x1';
```

Key concepts:
- **Channel** — Groups all your app's data together. Use a unique name for your app.
- **Aggregate key** — Identifies what type of data you're storing. One address can have multiple keys.
- **Chain ID** — Signatures must happen on Ethereum mainnet.

### Section 4: Reading Data

```ts
// services/aleph.ts

import { AlephHttpClient } from '@aleph-sdk/client';
import { ALEPH_AGGREGATE_KEY } from '../config/aleph';

interface ProfileData {
  version: number;
  updatedAt: number;
  settings: Record<string, unknown>;
}

/**
 * Fetch profile data for the given address.
 * This is a READ operation - no wallet signature needed.
 */
export async function fetchProfile(address: string): Promise<ProfileData | null> {
  const client = new AlephHttpClient();

  try {
    const data = await client.fetchAggregate(address, ALEPH_AGGREGATE_KEY);

    // Validate the response shape
    if (data && typeof data === 'object' && 'version' in data) {
      return data as ProfileData;
    }
    return null;
  } catch {
    // Aggregate doesn't exist - treat as "not found"
    return null;
  }
}
```

Key points:
- `AlephHttpClient` — Unauthenticated, for read-only operations
- `fetchAggregate(address, key)` — Returns the stored data or throws if not found
- Always validate the response shape before using it

### Section 5: Writing Data

```ts
// services/aleph.ts

import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { ETHAccount } from '@aleph-sdk/ethereum';
import { JsonRPCWallet } from '@aleph-sdk/evm';
import { providers } from 'ethers5';
import { ALEPH_CHANNEL, ALEPH_AGGREGATE_KEY, ETH_MAINNET_CHAIN_ID } from '../config/aleph';

export class WrongChainError extends Error {
  constructor() {
    super('Please switch to Ethereum mainnet to sign.');
    this.name = 'WrongChainError';
  }
}

/**
 * Save profile data for the connected wallet.
 * This is a WRITE operation - triggers wallet signature popup.
 */
export async function saveProfile(
  provider: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> },
  settings: Record<string, unknown>
): Promise<boolean> {
  // Step 1: Verify user is on mainnet
  const chainId = await provider.request({ method: 'eth_chainId' }) as string;
  if (chainId !== ETH_MAINNET_CHAIN_ID) {
    throw new WrongChainError();
  }

  // Step 2: Wrap provider with ethers5 (bridges wagmi to Aleph SDK)
  const web3Provider = new providers.Web3Provider(provider as providers.ExternalProvider);

  // Step 3: Create Aleph wallet wrapper
  const wallet = new JsonRPCWallet(web3Provider);
  await wallet.connect();

  if (!wallet.address) {
    throw new Error('Failed to get wallet address');
  }

  // Step 4: Create Ethereum account for signing
  const account = new ETHAccount(wallet, wallet.address);

  // Step 5: Create authenticated client
  const client = new AuthenticatedAlephHttpClient(account);

  // Step 6: Store the aggregate (triggers signature popup)
  await client.createAggregate({
    key: ALEPH_AGGREGATE_KEY,
    content: {
      version: 1,
      updatedAt: Date.now(),
      settings,
    },
    channel: ALEPH_CHANNEL,
  });

  return true;
}
```

The signature flow:
1. Validate chain (must be mainnet)
2. Wrap browser wallet → ethers5 → Aleph SDK adapters
3. Create authenticated client with signing capability
4. Call `createAggregate()` — this prompts the wallet popup

### Section 6: React Integration

```ts
// hooks/useAlephProfile.ts

import { useEffect, useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { fetchProfile, saveProfile, WrongChainError } from '../services/aleph';

export function useAlephProfile() {
  const { address, isConnected, connector } = useAccount();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  // Save current settings to cloud
  const saveToCloud = useCallback(async (settings: Record<string, unknown>) => {
    if (!connector || isSaving) return false;

    setIsSaving(true);
    try {
      const provider = await connector.getProvider();
      await saveProfile(provider, settings);
      setHasProfile(true);
      return true;
    } catch (error) {
      if (error instanceof WrongChainError) {
        // Handle wrong chain - prompt user to switch
      }
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [connector, isSaving]);

  // Check for existing profile on connect
  useEffect(() => {
    if (!isConnected || !address) return;

    setIsLoading(true);
    fetchProfile(address)
      .then((profile) => {
        if (profile) {
          setHasProfile(true);
          // Apply loaded settings to your app state
        }
      })
      .finally(() => setIsLoading(false));
  }, [isConnected, address]);

  return { isSaving, isLoading, hasProfile, saveToCloud };
}
```

Usage in components:

```tsx
function SettingsPanel() {
  const { isSaving, hasProfile, saveToCloud } = useAlephProfile();
  const settings = useMySettingsStore();

  return (
    <button
      onClick={() => saveToCloud(settings)}
      disabled={isSaving}
    >
      {isSaving ? 'Saving...' : hasProfile ? 'Update' : 'Save to Cloud'}
    </button>
  );
}
```

Key patterns:
- Load profile automatically when wallet connects
- Expose `saveToCloud` for manual saves
- Track loading/saving states for UI feedback
- Handle errors gracefully (wrong chain, rejected signature)

### Section 7: Reference Implementation

For a complete, production-ready example, see the ETH Checksum project:

- **Live demo:** [eth-checksummer.stasho.xyz](https://eth-checksummer.stasho.xyz)
- **Source code:** [github.com/cpascariello/eth-checksum](https://github.com/cpascariello/eth-checksum)

Key files to study:

| File | What it demonstrates |
|------|---------------------|
| `src/config/aleph.ts` | Configuration constants |
| `src/services/aleph.ts` | Read/write service functions |
| `src/hooks/useAlephProfile.tsx` | Full React integration with wagmi |

View your data on the Aleph Explorer:

```
https://explorer.aleph.cloud/messages?showAdvancedFilters=1&channels=YOUR_CHANNEL&type=AGGREGATE&sender=YOUR_ADDRESS
```

Resources:
- [Aleph SDK Documentation](https://docs.aleph.cloud/devhub/sdks-and-tools/)
- [Aggregates API Reference](https://docs.aleph.cloud/devhub/building-applications/messaging/object-types/aggregates.html)

## Implementation Steps

1. Fork `aleph-im/aleph-cloud-docs`
2. Replace `/docs/devhub/examples/index.md` with cookbook content
3. Remove or simplify broken subdirectories
4. Test locally with `npm run docs:dev`
5. Submit PR with clear description
