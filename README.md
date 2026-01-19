# ETH Checksum

An Ethereum address checksum converter built with React 19, TypeScript, Vite, and Tailwind CSS v4.

## Features

- Convert Ethereum addresses to EIP-55 checksummed format
- WalletConnect integration for connecting wallets
- Decentralized login tracking via Aleph Cloud
- Dark/light theme toggle with system preference detection
- Customizable decorative squares with parallax effects

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

This app uses Aleph Cloud for decentralized login tracking. The implementation is thoroughly documented with inline comments—these source files are the primary learning resource:

- [`src/config/aleph.ts`](src/config/aleph.ts) - Configuration and constants
- [`src/services/aleph.ts`](src/services/aleph.ts) - SDK integration
- [`src/hooks/useAlephLogin.ts`](src/hooks/useAlephLogin.ts) - React hook with flow documentation

See also: [`docs/aleph.md`](docs/aleph.md) for architecture overview.
