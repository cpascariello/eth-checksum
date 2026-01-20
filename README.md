# ETH Checksum

An Ethereum address checksum converter built with React 19, TypeScript, Vite, and Tailwind CSS v4.

## Features

- Convert Ethereum addresses to EIP-55 checksummed format
- WalletConnect integration for connecting wallets
- Decentralized profile sync via Aleph Cloud
- Dark/light theme toggle with system preference detection
- Customizable decorative squares with parallax effects

---

> **📚 Aleph Cookbook** — This project serves as a practical guide for integrating [Aleph Cloud](https://aleph.cloud/) aggregates into a React + wagmi application. The source files are thoroughly documented with inline comments explaining every step. See the [Aleph Integration](#aleph-integration) section below.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Configuration

Create a `.env.local` file with your WalletConnect project ID:

```bash
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

Get a free project ID at [Reown Cloud](https://cloud.reown.com).

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Ethereum**: ethers.js, wagmi, @reown/appkit
- **Decentralized Storage**: Aleph SDK

## Aleph Integration

This app uses [Aleph Cloud](https://aleph.cloud/) for decentralized profile sync and serves as a **cookbook for Aleph aggregates**.

### What are Aleph Aggregates?

Aggregates are key-value stores tied to wallet addresses on Aleph's decentralized network. They're perfect for user settings because:

- **No backend required** — Data lives on the decentralized network
- **Wallet-based ownership** — Data is tied to addresses, perfect for Web3 auth
- **Free reads** — Fetching data doesn't require a signature
- **Signed writes** — Storing data requires a wallet signature (proves ownership)

### Learning Path

Read the source files in this order for the best learning experience:

| Order | File | What You'll Learn |
|-------|------|-------------------|
| 1 | [`src/config/aleph.ts`](src/config/aleph.ts) | Channels, keys, and chain requirements |
| 2 | [`src/services/aleph.ts`](src/services/aleph.ts) | SDK setup, read/write operations, ethers v5 adapter |
| 3 | [`src/hooks/useAlephProfile.tsx`](src/hooks/useAlephProfile.tsx) | React integration, connection flow, error handling |

### Key Implementation Details

**ethers v5 Requirement** — The Aleph SDK requires ethers v5, not v6. Since wagmi uses ethers v6 internally, install v5 separately:

```bash
npm install ethers5@npm:ethers@^5.7.2
```

Then import from `ethers5`:

```ts
import { providers } from 'ethers5';
```

**Chain Validation** — Signatures must be on Ethereum mainnet for data to persist correctly.

### See It Live

View real aggregate data from this app on the Aleph Explorer:

🔗 [ETH_CHECKSUM aggregates on Aleph Explorer](https://explorer.aleph.cloud/messages?showAdvancedFilters=1&channels=ETH_CHECKSUM&type=AGGREGATE&page=1)

### Further Reading

- [`docs/aleph.md`](docs/aleph.md) — Architecture overview and user flows
- [Aleph Aggregates Guide](https://docs.aleph.cloud/devhub/building-applications/messaging/object-types/aggregates.html) — Official documentation
- [Aleph SDK Reference](https://docs.aleph.cloud/devhub/sdks-and-tools/) — TypeScript SDK docs
