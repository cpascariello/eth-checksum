/**
 * Aleph Login Hook
 *
 * This hook integrates Aleph Cloud to track first-time wallet connections.
 * When a user connects their wallet, we check if they've signed in before
 * by looking up their "login aggregate" on the Aleph network.
 *
 * Integration flow:
 * 1. User connects wallet via WalletConnect/wagmi
 * 2. We check Aleph for an existing login aggregate (free, no signature)
 * 3. If no aggregate exists, prompt user to sign a message
 * 4. On signature, create an aggregate to record their visit
 * 5. Future connections skip the signature (aggregate already exists)
 *
 * This provides a decentralized "first visit" tracking without a backend.
 *
 * Aleph Docs: https://docs.aleph.im/guides/messages/aggregate/
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { toast } from 'sonner';
import { checkLoginAggregate, createLoginAggregate, WrongChainError } from '../services/aleph';

// Module-level state to prevent React Strict Mode double-execution
let processingAddress: string | null = null;
const processedAddresses = new Set<string>();

/**
 * Hook to track first-time wallet connections via Aleph Cloud aggregates.
 * Shows a toast prompting the user to sign a message on first connection.
 */
export function useAlephLogin() {
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const [pendingSign, setPendingSign] = useState(false);
  const toastShownRef = useRef(false);

  // Perform the actual signing - triggered by pendingSign state
  useEffect(() => {
    if (!pendingSign || !address || !connector) return;

    const performSign = async () => {
      try {
        // Get the provider from the connector
        const provider = await connector.getProvider();

        if (!provider) {
          throw new Error('No provider available');
        }

        // Use the SDK to create the aggregate (handles signing internally)
        const success = await createLoginAggregate(provider as { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> });

        if (success) {
          // Only dismiss welcome toast on success
          toast.dismiss(`aleph-welcome-${address}`);
          processedAddresses.add(address);
          toast.success('Welcome! Your visit has been recorded.', { id: `aleph-success-${address}` });
          processingAddress = null;
          toastShownRef.current = false;
        }
      } catch (error) {
        // Handle specific error types
        if (error instanceof WrongChainError) {
          // Keep the welcome toast - user can try again after switching chains
          toast.error('Please switch to Ethereum mainnet and try again.', {
            id: `aleph-error-${address}`,
            duration: 5000,
          });
        } else if (error instanceof Error &&
            (error.message.includes('rejected') || error.message.includes('denied') || error.message.includes('User rejected'))) {
          toast.dismiss(`aleph-welcome-${address}`);
          toast.error('Signature rejected.', { id: `aleph-error-${address}` });
          processingAddress = null;
          toastShownRef.current = false;
        } else {
          toast.dismiss(`aleph-welcome-${address}`);
          toast.error('Signing failed. Please try reconnecting.', { id: `aleph-error-${address}` });
          processingAddress = null;
          toastShownRef.current = false;
        }
      } finally {
        setPendingSign(false);
      }
    };

    performSign();
  }, [pendingSign, address, connector]);

  // Handle the sign button click - just set the flag
  const handleSignClick = useCallback(() => {
    setPendingSign(true);
  }, []);

  const handleDismiss = useCallback(() => {
    // Disconnect the wallet
    disconnect();
    processingAddress = null;
    toastShownRef.current = false;
  }, [disconnect]);

  // Check if user needs to sign on connection
  useEffect(() => {
    async function handleLogin() {
      // Skip if not connected, no address, or no connector
      if (!isConnected || !address || !connector) {
        return;
      }

      // Skip if already processing this address or already processed
      if (processingAddress === address || processedAddresses.has(address)) {
        return;
      }

      // Skip if toast already shown in this component instance
      if (toastShownRef.current) {
        return;
      }

      // Mark as processing immediately (synchronous, before any await)
      processingAddress = address;
      toastShownRef.current = true;

      // Wait for WalletConnect session to stabilize
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Double-check we're still connected and still processing this address
      if (!isConnected || !address || processingAddress !== address) {
        return;
      }

      try {
        // Check if login aggregate already exists
        const exists = await checkLoginAggregate(address);

        if (exists) {
          processedAddresses.add(address);
          processingAddress = null;
          toastShownRef.current = false;
          return;
        }

        // Show toast with sign option (using stable ID to prevent duplicates)
        toast(
          'Welcome! Please sign a message to verify your first visit.',
          {
            id: `aleph-welcome-${address}`,
            duration: Infinity,
            closeButton: true,
            action: {
              label: 'Sign',
              onClick: handleSignClick,
            },
            onDismiss: handleDismiss,
          }
        );
      } catch {
        processingAddress = null;
        toastShownRef.current = false;
      }
    }

    handleLogin();
  }, [isConnected, address, connector, handleSignClick, handleDismiss]);

  // Cleanup toast on disconnect
  useEffect(() => {
    if (!isConnected && address) {
      toast.dismiss(`aleph-welcome-${address}`);
      setPendingSign(false);
      toastShownRef.current = false;
    }
  }, [isConnected, address]);
}
