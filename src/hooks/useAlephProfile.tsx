/**
 * Aleph Profile Hook
 *
 * This hook integrates Aleph Cloud to store and sync user settings.
 * When a user connects their wallet, we check if they have a profile
 * stored on the Aleph network and load their settings.
 *
 * Integration flow:
 * 1. User connects wallet via WalletConnect/wagmi
 * 2. We check Aleph for an existing profile (free, no signature)
 * 3. If profile exists, load settings and apply to store
 * 4. If no profile exists, prompt user to save current settings
 * 5. User can manually save settings anytime via "Save to Cloud" button
 *
 * This provides decentralized settings sync without a backend.
 *
 * Aleph Docs: https://docs.aleph.cloud/guides/messages/aggregate/
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';
import { ExternalLink } from 'lucide-react';
import { fetchProfile, saveProfile, WrongChainError } from '../services/aleph';
import { useSettingsStore } from '../store/settings';

// Module-level state to prevent React Strict Mode double-execution
let processingAddress: string | null = null;
const processedAddresses = new Set<string>();

/**
 * Hook to manage user profile via Aleph Cloud aggregates.
 * Automatically loads settings on connect and provides save functionality.
 */
export function useAlephProfile() {
  const { address, isConnected, connector } = useAccount();
  const { settings, isDark, applyProfileSettings } = useSettingsStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const toastShownRef = useRef(false);
  const prevAddressRef = useRef<string | undefined>(undefined);

  /**
   * Save current settings to cloud.
   * Called from the SettingsPanel "Save to Cloud" button.
   */
  const saveToCloud = useCallback(async () => {
    if (!connector || isSaving) return false;

    setIsSaving(true);
    try {
      const provider = await connector.getProvider();
      if (!provider) {
        throw new Error('No provider available');
      }

      const success = await saveProfile(
        provider as { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> },
        settings,
        isDark
      );

      if (success) {
        setHasProfile(true);
        toast.success('Settings saved to Aleph Cloud!', {
          duration: 4000,
          action: (
            <button
              onClick={() => window.open(
                `https://explorer.aleph.cloud/messages?showAdvancedFilters=1&channels=ETH_CHECKSUM&type=AGGREGATE&page=1&sender=${address}`,
                '_blank'
              )}
              className="inline-flex items-center"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
          ),
        });
        return true;
      }
      return false;
    } catch (error) {
      if (error instanceof WrongChainError) {
        toast.error('Please switch to Ethereum mainnet to save.');
      } else if (
        error instanceof Error &&
        (error.message.includes('rejected') ||
          error.message.includes('denied') ||
          error.message.includes('User rejected'))
      ) {
        toast.error('Signature rejected.');
      } else {
        toast.error('Failed to save settings.');
      }
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [connector, isSaving, settings, isDark, address]);

  /**
   * Handle the initial save prompt for first-time users.
   */
  const handleInitialSave = useCallback(async () => {
    const success = await saveToCloud();
    if (success && address) {
      toast.dismiss(`aleph-welcome-${address}`);
      processedAddresses.add(address);
      processingAddress = null;
      toastShownRef.current = false;
    }
  }, [saveToCloud, address]);

  const handleDismiss = useCallback(() => {
    if (address) {
      processedAddresses.add(address);
    }
    processingAddress = null;
    toastShownRef.current = false;
  }, [address]);

  // Check for profile on connection
  useEffect(() => {
    async function handleConnect() {
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
      setIsLoading(true);

      // Wait for WalletConnect session to stabilize
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Double-check we're still connected and still processing this address
      if (!isConnected || !address || processingAddress !== address) {
        setIsLoading(false);
        return;
      }

      try {
        // Check if profile exists
        const profile = await fetchProfile(address);

        if (profile) {
          // Profile found - load settings
          applyProfileSettings(profile);
          setHasProfile(true);
          processedAddresses.add(address);
          processingAddress = null;
          toastShownRef.current = false;
          toast.success('Settings loaded from Aleph Cloud!', {
            duration: 4000,
            action: (
              <button
                onClick={() => window.open(
                  `https://explorer.aleph.cloud/messages?showAdvancedFilters=1&channels=ETH_CHECKSUM&type=AGGREGATE&page=1&sender=${address}`,
                  '_blank'
                )}
                className="inline-flex items-center"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            ),
          });
        } else {
          // No profile - prompt to save current settings
          setHasProfile(false);
          toast(
            'Save your settings to Aleph Cloud?',
            {
              id: `aleph-welcome-${address}`,
              duration: Infinity,
              closeButton: true,
              action: {
                label: 'Save',
                onClick: handleInitialSave,
              },
              onDismiss: handleDismiss,
            }
          );
        }
      } catch {
        processingAddress = null;
        toastShownRef.current = false;
      } finally {
        setIsLoading(false);
      }
    }

    handleConnect();
  }, [isConnected, address, connector, applyProfileSettings, handleInitialSave, handleDismiss]);

  // Track address for cleanup
  useEffect(() => {
    if (address) {
      prevAddressRef.current = address;
    }
  }, [address]);

  // Cleanup on disconnect
  useEffect(() => {
    if (!isConnected && prevAddressRef.current) {
      const prevAddress = prevAddressRef.current;
      toast.dismiss(`aleph-welcome-${prevAddress}`);
      toastShownRef.current = false;
      setHasProfile(false);
      processedAddresses.delete(prevAddress);  // Allow re-fetch on reconnect
      prevAddressRef.current = undefined;
    }
  }, [isConnected]);

  return {
    isSaving,
    isLoading,
    hasProfile,
    saveToCloud,
  };
}
