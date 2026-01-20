/**
 * Aleph Cloud Service
 *
 * This module handles communication with Aleph Cloud's decentralized network.
 * We use Aleph "aggregates" to store user profile data (settings) - essentially
 * key-value pairs that are associated with a wallet address and persisted on the network.
 *
 * Aggregates are ideal for this use case because:
 * - No backend required - data lives on the decentralized network
 * - Data is tied to wallet addresses - perfect for wallet-based auth
 * - Read operations are free (no signature needed)
 * - Write operations require a wallet signature (proves ownership)
 *
 * Learn more: https://docs.aleph.cloud/guides/messages/aggregate/
 */

// SDK packages overview:
// - @aleph-sdk/client: Core HTTP client for reading/writing to Aleph network
// - @aleph-sdk/ethereum: Ethereum account wrapper for signing messages
// - @aleph-sdk/evm: Wallet adapter to bridge browser wallets to SDK
import { AlephHttpClient, AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import { ETHAccount } from '@aleph-sdk/ethereum';
import { JsonRPCWallet } from '@aleph-sdk/evm';

// IMPORTANT: The Aleph SDK requires ethers v5, not v6.
// If you're using wagmi/viem (which use ethers v6 internally), you need
// to install ethers v5 separately: npm install ethers5@npm:ethers@^5.7.2
// Then import from 'ethers5' instead of 'ethers'.
import { providers } from 'ethers5';

import { ALEPH_CHANNEL, ALEPH_AGGREGATE_KEY, ETH_MAINNET_CHAIN_ID } from '../config/aleph';
import type { ProfileData, Settings } from '../types';

/**
 * Custom error thrown when user is on the wrong chain.
 * Aleph aggregates must be signed on Ethereum mainnet to ensure
 * the signature is valid and the data persists correctly.
 */
export class WrongChainError extends Error {
  constructor() {
    super('Please switch to Ethereum mainnet to sign.');
    this.name = 'WrongChainError';
  }
}

/**
 * Fetch profile data for the given address.
 *
 * This is a READ operation - it doesn't require a wallet signature.
 * We use the unauthenticated AlephHttpClient since we're just fetching data.
 *
 * @param address - The wallet address to fetch profile for
 * @returns ProfileData if exists, null otherwise
 */
export async function fetchProfile(address: string): Promise<ProfileData | null> {
  // Unauthenticated client - read operations are free and don't need signing
  const client = new AlephHttpClient();
  try {
    // fetchAggregate retrieves the stored key-value data for this address
    const data = await client.fetchAggregate(address, ALEPH_AGGREGATE_KEY);
    // Validate that it's a valid profile (has version field)
    if (data && typeof data === 'object' && 'version' in data) {
      return data as ProfileData;
    }
    return null;
  } catch {
    // If aggregate doesn't exist, Aleph throws an error - treat as "not found"
    return null;
  }
}

/**
 * Save profile data for the connected wallet using Aleph SDK.
 *
 * This is a WRITE operation - requires the user to sign a message with their wallet.
 * The flow is:
 * 1. Verify user is on Ethereum mainnet (required for valid signatures)
 * 2. Wrap the browser wallet provider with ethers5 and Aleph SDK adapters
 * 3. Create an authenticated client that can sign messages
 * 4. Store the aggregate (this triggers the wallet signature popup)
 *
 * @param provider - The wallet provider from wagmi/WalletConnect
 * @param settings - The settings to save
 * @param isDark - Whether dark mode is enabled
 * @returns true if profile was saved successfully
 */
export async function saveProfile(
  provider: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> },
  settings: Settings,
  isDark: boolean
): Promise<boolean> {
  // Step 1: Chain validation - must be on mainnet for Aleph signatures
  const currentChainId = await provider.request({ method: 'eth_chainId' }) as string;
  if (currentChainId !== ETH_MAINNET_CHAIN_ID) {
    throw new WrongChainError();
  }

  // Step 2: Wrap the provider with ethers5 Web3Provider
  // This bridges wagmi's provider to the ethers v5 format that Aleph SDK expects
  const web3Provider = new providers.Web3Provider(provider as providers.ExternalProvider);

  // Step 3: Create Aleph SDK wallet wrapper
  // JsonRPCWallet adapts the ethers provider to Aleph's wallet interface
  const wallet = new JsonRPCWallet(web3Provider);
  await wallet.connect();

  if (!wallet.address) {
    throw new Error('Failed to get wallet address');
  }

  // Step 4: Create an Ethereum account for signing Aleph messages
  // ETHAccount wraps the wallet to provide Aleph-compatible signing
  const account = new ETHAccount(wallet, wallet.address);

  // Step 5: Create authenticated client
  // Unlike AlephHttpClient, this can sign and write data to the network
  const client = new AuthenticatedAlephHttpClient(account);

  // Step 6: Create the profile data
  const profileData: ProfileData = {
    version: 1,
    updatedAt: Date.now(),
    settings: {
      squareCount: settings.squareCount,
      squareStep: settings.squareStep,
      squareStepIncrement: settings.squareStepIncrement,
      squareRotation: settings.squareRotation,
      parallaxMultiplier: settings.parallaxMultiplier,
      squareColorFamily: settings.squareColorFamily,
      squareColorStep: settings.squareColorStep,
      randomColors: settings.randomColors,
    },
    isDark,
  };

  // Step 7: Create the aggregate
  // This will prompt the user to sign a message in their wallet
  // The signed message proves ownership and is stored on the Aleph network
  await client.createAggregate({
    key: ALEPH_AGGREGATE_KEY,    // Unique key for this type of data
    content: profileData,        // The actual data to store
    channel: ALEPH_CHANNEL,      // Groups our app's data together
  });

  return true;
}
