# Token Fetching Documentation

This document provides a comprehensive overview of the token fetching mechanism in the @d-sports/wallet project.

## Overview

The @d-sports/wallet project includes a robust token fetching system that retrieves token data from various sources, caches it for performance, and provides a consistent API for accessing token information across different platforms.

## Token Fetching Architecture

### Platform-Agnostic Design

The token fetching system is designed to work across different platforms (Web, Next.js, React Native) by using platform adapters.

```typescript
/**
 * Platform-agnostic token fetcher
 * 
 * This module dynamically loads the appropriate token fetcher implementation
 * based on the detected platform (browser or server).
 */
```

### Token Data Structure

```typescript
/**
 * Token information interface
 * 
 * @interface TokenInfo
 * @property {string} name - Token name (e.g., "Bitcoin")
 * @property {string} symbol - Token symbol (e.g., "BTC")
 * @property {string} network - Token network (e.g., "Ethereum")
 * @property {string} amount - Formatted token amount with symbol (e.g., "0.5 BTC")
 * @property {string} value - Formatted token value in fiat (e.g., "$20,000")
 * @property {Object} change - Token price change information
 * @property {string} change.positive - Formatted positive change (e.g., "+5.2%")
 * @property {string} change.negative - Formatted negative change (e.g., "-3.1%")
 * @property {string} icon - Token icon representation
 * @property {string} bgColor - Background color for token UI elements
 * @property {string} balance - Raw token balance
 * @property {string} address - Token contract address
 * @property {number} price - Current token price in fiat
 * @property {number} percentChange24h - 24-hour price change percentage
 * @property {number} marketCap - Token market capitalization
 * @property {string} lastUpdated - ISO timestamp of last update
 * @property {Transaction[]} transactions - Recent token transactions
 */
export interface TokenInfo {
  name: string;
  symbol: string;
  network: string;
  amount: string;
  value: string;
  change: {
    positive: string;
    negative: string;
  };
  icon: string;
  bgColor: string;
  balance: string;
  address: string;
  price: number;
  percentChange24h: number;
  marketCap: number;
  lastUpdated: string;
  transactions: Transaction[];
}
```

## Token Fetching API

### Core Functions

```typescript
/**
 * Updates token data from external sources
 * 
 * This function fetches the latest token data from external APIs and updates
 * the local cache. It automatically initializes the token fetcher if needed.
 * 
 * @function updateTokenData
 * @async
 * @returns {Promise<void>} Promise that resolves when the update is complete
 * 
 * @example
 * ```typescript
 * // Update token data from external sources
 * await updateTokenData();
 * console.log('Token data updated successfully');
 * ```
 */
export async function updateTokenData(): Promise<void>;

/**
 * Retrieves all token data from the local cache
 * 
 * @function getTokenData
 * @returns {TokenInfo[]} Array of token information objects
 * 
 * @example
 * ```typescript
 * // Get all token data
 * const tokens = getTokenData();
 * console.log(`Found ${tokens.length} tokens`);
 * ```
 */
export function getTokenData(): TokenInfo[];

/**
 * Retrieves a specific token by its symbol
 * 
 * @function getTokenBySymbol
 * @param {string} symbol - The token symbol to search for (e.g., "BTC")
 * @returns {TokenInfo | undefined} The matching token or undefined if not found
 * 
 * @example
 * ```typescript
 * // Get Bitcoin token data
 * const bitcoin = getTokenBySymbol("BTC");
 * if (bitcoin) {
 *   console.log(`Bitcoin price: ${bitcoin.price}`);
 * }
 * ```
 */
export function getTokenBySymbol(symbol: string): TokenInfo | undefined;

/**
 * Retrieves all unique token symbols
 * 
 * @function getAllTokenSymbols
 * @returns {string[]} Array of unique token symbols
 * 
 * @example
 * ```typescript
 * // Get all unique token symbols
 * const symbols = getAllTokenSymbols();
 * console.log(`Supported tokens: ${symbols.join(', ')}`);
 * ```
 */
export function getAllTokenSymbols(): string[];

/**
 * Retrieves tokens by network
 * 
 * @function getTokensByNetwork
 * @param {string} network - The network name to filter by (e.g., "Ethereum")
 * @returns {TokenInfo[]} Array of tokens on the specified network
 * 
 * @example
 * ```typescript
 * // Get all tokens on the Ethereum network
 * const ethereumTokens = getTokensByNetwork("Ethereum");
 * console.log(`Found ${ethereumTokens.length} tokens on Ethereum`);
 * ```
 */
export function getTokensByNetwork(network: string): TokenInfo[];

/**
 * Clears the token data cache
 * 
 * @function clearTokenData
 * @returns {void}
 * 
 * @example
 * ```typescript
 * // Clear token data cache
 * clearTokenData();
 * console.log('Token data cache cleared');
 * ```
 */
export function clearTokenData(): void;

/**
 * Retrieves the timestamp of the last token data update
 * 
 * @function getLastUpdated
 * @returns {Date | null} The timestamp of the last update or null if never updated
 * 
 * @example
 * ```typescript
 * // Get last update timestamp
 * const lastUpdated = getLastUpdated();
 * if (lastUpdated) {
 *   console.log(`Last updated: ${lastUpdated.toLocaleString()}`);
 * }
 * ```
 */
export function getLastUpdated(): Date | null;

/**
 * Checks if token data is stale based on the specified maximum age
 * 
 * @function isTokenDataStale
 * @param {number} [maxAgeMinutes=5] - Maximum age in minutes before data is considered stale
 * @returns {boolean} True if data is stale or not available, false otherwise
 * 
 * @example
 * ```typescript
 * // Check if token data is stale (older than 10 minutes)
 * if (isTokenDataStale(10)) {
 *   console.log('Token data is stale, updating...');
 *   await updateTokenData();
 * }
 * ```
 */
export function isTokenDataStale(maxAgeMinutes?: number): boolean;
```

## Platform-Specific Implementations

### Browser Implementation

```typescript
/**
 * Browser-specific token fetcher implementation
 * 
 * This module implements the token fetching functionality for browser environments.
 * It uses browser-specific APIs for storage and network requests.
 */
```

### Server Implementation

```typescript
/**
 * Server-specific token fetcher implementation
 * 
 * This module implements the token fetching functionality for server environments.
 * It uses server-specific APIs for storage and network requests.
 */
```

## Token Service

The token service provides higher-level functionality for working with tokens.

```typescript
/**
 * Token service for fetching and managing token data
 * 
 * @class TokenService
 */
export class TokenService {
  /**
   * Fetch latest token data from external API
   * 
   * @method fetchTokenData
   * @param {string[]} symbols - Array of token symbols to fetch
   * @param {string} [currency="USD"] - Currency for price conversion
   * @returns {Promise<TokenInfo[]>} Promise with token data
   * 
   * @example
   * ```typescript
   * const tokens = await tokenService.fetchTokenData(['BTC', 'ETH']);
   * console.log(`Bitcoin price: ${tokens[0].price}`);
   * ```
   */
  async fetchTokenData(symbols: string[], currency: string = 'USD'): Promise<TokenInfo[]>;
  
  /**
   * Start automatic token data updates
   * 
   * @method startAutoUpdate
   * @param {number} [intervalMs=300000] - Update interval in milliseconds (default: 5 minutes)
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // Start auto-updating token data every 10 minutes
   * tokenService.startAutoUpdate(10 * 60 * 1000);
   * ```
   */
  startAutoUpdate(intervalMs: number = 5 * 60 * 1000): void;
  
  /**
   * Stop automatic token data updates
   * 
   * @method stopAutoUpdate
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // Stop auto-updating token data
   * tokenService.stopAutoUpdate();
   * ```
   */
  stopAutoUpdate(): void;
  
  /**
   * Manually refresh token data
   * 
   * @method refreshTokenData
   * @returns {Promise<TokenInfo[]>} Promise with updated token data
   * 
   * @example
   * ```typescript
   * // Manually refresh token data
   * const tokens = await tokenService.refreshTokenData();
   * console.log('Token data refreshed');
   * ```
   */
  async refreshTokenData(): Promise<TokenInfo[]>;
}
```

## Token Hooks

The token hooks provide React integration for the token fetching system.

```typescript
/**
 * Hook for accessing token data
 * 
 * @function useTokens
 * @returns {Object} Token data and methods
 * @returns {TokenInfo[]} tokens - Array of token information
 * @returns {boolean} isLoading - Whether tokens are being loaded
 * @returns {Error | null} error - Error if token loading failed
 * @returns {Function} refresh - Function to refresh token data
 * 
 * @example
 * ```tsx
 * function TokenList() {
 *   const { tokens, isLoading, error, refresh } = useTokens();
 *   
 *   if (isLoading) return <p>Loading...</p>;
 *   if (error) return <p>Error: {error.message}</p>;
 *   
 *   return (
 *     <div>
 *       <button onClick={refresh}>Refresh</button>
 *       <ul>
 *         {tokens.map(token => (
 *           <li key={token.symbol}>
 *             {token.name} ({token.symbol}): {token.value}
 *           </li>
 *         ))}
 *       </ul>
 *     </div>
 *   );
 * }
 * ```
 */
export function useTokens(): {
  tokens: TokenInfo[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
};

/**
 * Hook for accessing a specific token by symbol
 * 
 * @function useToken
 * @param {string} symbol - Token symbol to fetch
 * @returns {Object} Token data and methods
 * @returns {TokenInfo | undefined} token - Token information
 * @returns {boolean} isLoading - Whether the token is being loaded
 * @returns {Error | null} error - Error if token loading failed
 * @returns {Function} refresh - Function to refresh token data
 * 
 * @example
 * ```tsx
 * function BitcoinPrice() {
 *   const { token, isLoading, error } = useToken('BTC');
 *   
 *   if (isLoading) return <p>Loading...</p>;
 *   if (error) return <p>Error: {error.message}</p>;
 *   if (!token) return <p>Token not found</p>;
 *   
 *   return <p>Bitcoin price: {token.price}</p>;
 * }
 * ```
 */
export function useToken(symbol: string): {
  token: TokenInfo | undefined;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
};
```

## Token Data Caching

The token fetching system includes caching mechanisms to improve performance and reduce API calls.

```typescript
/**
 * Token data cache
 * 
 * This module implements caching for token data to improve performance and reduce API calls.
 * It uses different storage mechanisms based on the platform (localStorage for browsers,
 * file system for servers).
 */
```

## Error Handling

The token fetching system includes robust error handling to ensure the application continues to function even when token data cannot be fetched.

```typescript
/**
 * Error handling in token fetcher
 * 
 * The token fetcher includes fallback mechanisms for handling errors:
 * 1. If the API request fails, it returns cached data if available
 * 2. If no cached data is available, it returns placeholder data
 * 3. It logs errors for debugging purposes
 * 4. It retries failed requests with exponential backoff
 */
```

## Conclusion

The token fetching system in the @d-sports/wallet project provides a robust, platform-agnostic way to retrieve and manage token data. By using platform adapters and a consistent API, it ensures that token data is available across different platforms with minimal code duplication.