import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet } from '@reown/appkit/networks';
import { QueryClient } from '@tanstack/react-query';

// Get projectId from environment variable
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  console.warn(
    'WalletConnect projectId not found. Please set VITE_WALLETCONNECT_PROJECT_ID in your .env.local file.'
  );
}

// Create query client
export const queryClient = new QueryClient();

// App metadata
const metadata = {
  name: 'ETH Checksum',
  description: 'Ethereum address checksum converter',
  url: window.location.origin,
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

// Create wagmi adapter
const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet],
  projectId: projectId || '',
});

// Export wagmi config
export const wagmiConfig = wagmiAdapter.wagmiConfig;

// Initialize AppKit
createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet],
  projectId: projectId || '',
  metadata,
  features: {
    analytics: false,
  },
});
