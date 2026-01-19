# Aleph Cloud Integration

## Overview

[Aleph Cloud](https://aleph.cloud/) is a decentralized storage and compute network. We use it to track first-time wallet connections without requiring a centralized backend.

**Why Aleph?**
- No backend required - data lives on the decentralized network
- Data is tied to wallet addresses - perfect for wallet-based auth
- Read operations are free (no signature needed)
- Write operations require a wallet signature (proves ownership)

## File Structure

```
src/
├── config/aleph.ts          # Constants (channel, keys, chain ID)
├── services/aleph.ts        # Aleph SDK integration
└── hooks/useAlephLogin.ts   # React hook for login flow
```

### config/aleph.ts

Configuration constants:

| Constant | Value | Purpose |
|----------|-------|---------|
| `ALEPH_CHANNEL` | `'ETH_CHECKSUM'` | Namespace for our app's data |
| `ALEPH_AGGREGATE_KEY` | `'login'` | Key for login aggregates |
| `ETH_MAINNET_CHAIN_ID` | `'0x1'` | Required chain for signing |

### services/aleph.ts

Two main functions:

- `checkLoginAggregate(address)` - Read operation, checks if user has signed before
- `createLoginAggregate(provider)` - Write operation, stores login record (requires signature)

### hooks/useAlephLogin.ts

React hook that orchestrates the login flow. Call it once in App.tsx.

## Integration Flow

```
1. User connects wallet
        ↓
2. useAlephLogin detects connection
        ↓
3. checkLoginAggregate(address) ← Free read operation
        ↓
4. If aggregate exists → Done (returning user)
   If not exists → Continue
        ↓
5. Show toast: "Welcome! Please sign..."
        ↓
6. User clicks "Sign"
        ↓
7. createLoginAggregate(provider) ← Triggers wallet popup
        ↓
8. Aggregate stored on Aleph network
        ↓
9. Future visits skip steps 5-8
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

## Adding More Aggregates

To store additional data (e.g., user preferences):

1. **Add a new key in config/aleph.ts:**
   ```ts
   export const ALEPH_PREFERENCES_KEY = 'preferences';
   ```

2. **Add service functions in services/aleph.ts:**
   ```ts
   export async function getPreferences(address: string) {
     const client = new AlephHttpClient();
     try {
       return await client.fetchAggregate(address, ALEPH_PREFERENCES_KEY);
     } catch {
       return null;
     }
   }

   export async function savePreferences(provider: Provider, data: object) {
     // Similar to createLoginAggregate but with different key/content
     // ...
     await client.createAggregate({
       key: ALEPH_PREFERENCES_KEY,
       content: data,
       channel: ALEPH_CHANNEL,
     });
   }
   ```

3. **Create a hook if needed:**
   ```ts
   export function useAlephPreferences() {
     // Similar pattern to useAlephLogin
   }
   ```

## Resources

- [Aleph Documentation](https://docs.aleph.cloud/)
- [Aggregates Guide](https://docs.aleph.cloud/guides/messages/aggregate/)
- [SDK Reference](https://docs.aleph.cloud/tools/aleph-sdk-ts/)
