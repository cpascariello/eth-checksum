/**
 * Aleph Cloud Configuration
 *
 * Aleph Cloud is a decentralized storage and compute network that allows
 * storing data (like user preferences or login records) without requiring
 * a centralized backend. Data is stored in "aggregates" - key-value pairs
 * associated with a wallet address.
 *
 * Learn more: https://docs.aleph.im/
 */

/**
 * Channel identifier for organizing our data on Aleph.
 * Think of channels like namespaces - they help group related aggregates
 * and make it easier to query data for a specific application.
 */
export const ALEPH_CHANNEL = 'ETH_CHECKSUM';

/**
 * The key used to store login aggregates.
 * Each wallet address can have multiple aggregates with different keys.
 * We use 'login' to track whether a user has signed in before.
 */
export const ALEPH_AGGREGATE_KEY = 'login';

/**
 * Ethereum Mainnet chain ID in hex format.
 * Aleph signatures must be on mainnet for data persistence and verification.
 */
export const ETH_MAINNET_CHAIN_ID = '0x1';
