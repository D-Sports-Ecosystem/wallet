/**
 * @file token-fetcher.ts
 * @description Platform-agnostic token data fetching utility
 * @module utils/token-fetcher
 * @author D-Sports Engineering Team
 * @version 1.0.0
 * @since 2025-07-23
 */

import { TokenInfo } from "../services/token-service";

/**
 * Detects if the code is running in a browser environment
 *
 * @function isBrowser
 * @returns {boolean} True if running in a browser environment, false otherwise
 */
function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

/**
 * Module reference for the platform-specific token fetcher implementation
 * This is dynamically loaded based on the runtime environment
 */
let tokenModule: any = null;

/**
 * Function type for updating token data from external sources
 *
 * @typedef {Function} UpdateTokenDataFn
 * @returns {Promise<void>} Promise that resolves when the update is complete
 */
type UpdateTokenDataFn = () => Promise<void>;

/**
 * Function type for retrieving all token data
 *
 * @typedef {Function} GetTokenDataFn
 * @returns {TokenInfo[]} Array of token information objects
 */
type GetTokenDataFn = () => TokenInfo[];

/**
 * Function type for retrieving a specific token by its symbol
 *
 * @typedef {Function} GetTokenBySymbolFn
 * @param {string} symbol - The token symbol to search for (e.g., "BTC")
 * @returns {TokenInfo | undefined} The matching token or undefined if not found
 */
type GetTokenBySymbolFn = (symbol: string) => TokenInfo | undefined;

/**
 * Function type for retrieving all unique token symbols
 *
 * @typedef {Function} GetAllTokenSymbolsFn
 * @returns {string[]} Array of unique token symbols
 */
type GetAllTokenSymbolsFn = () => string[];

/**
 * Function type for retrieving tokens by network
 *
 * @typedef {Function} GetTokensByNetworkFn
 * @param {string} network - The network name to filter by (e.g., "Ethereum")
 * @returns {TokenInfo[]} Array of tokens on the specified network
 */
type GetTokensByNetworkFn = (network: string) => TokenInfo[];

/**
 * Function type for clearing token data cache
 *
 * @typedef {Function} ClearTokenDataFn
 * @returns {void}
 */
type ClearTokenDataFn = () => void;

/**
 * Function type for retrieving the last update timestamp
 *
 * @typedef {Function} GetLastUpdatedFn
 * @returns {Date | null} The timestamp of the last update or null if never updated
 */
type GetLastUpdatedFn = () => Date | null;

/**
 * Function type for checking if token data is stale
 *
 * @typedef {Function} IsTokenDataStaleFn
 * @param {number} [maxAgeMinutes=5] - Maximum age in minutes before data is considered stale
 * @returns {boolean} True if data is stale or not available, false otherwise
 */
type IsTokenDataStaleFn = (maxAgeMinutes?: number) => boolean;

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
export let updateTokenData: UpdateTokenDataFn = async () => {
  await initializeTokenFetcher();
  return updateTokenData();
};

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
export let getTokenData: GetTokenDataFn = () => {
  if (!tokenModule) {
    console.warn("Token fetcher not initialized yet");
    return [];
  }
  return tokenModule.getTokenData();
};

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
 *   console.log(`Bitcoin price: $${bitcoin.price}`);
 * }
 * ```
 */
export let getTokenBySymbol: GetTokenBySymbolFn = (symbol: string) => {
  if (!tokenModule) {
    console.warn("Token fetcher not initialized yet");
    return undefined;
  }
  return tokenModule.getTokenBySymbol(symbol);
};

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
export let getAllTokenSymbols: GetAllTokenSymbolsFn = () => {
  if (!tokenModule) {
    console.warn("Token fetcher not initialized yet");
    return [];
  }
  return tokenModule.getAllTokenSymbols();
};

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
export let getTokensByNetwork: GetTokensByNetworkFn = (network: string) => {
  if (!tokenModule) {
    console.warn("Token fetcher not initialized yet");
    return [];
  }
  return tokenModule.getTokensByNetwork(network);
};

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
export let clearTokenData: ClearTokenDataFn = () => {
  if (!tokenModule) {
    console.warn("Token fetcher not initialized yet");
    return;
  }
  return tokenModule.clearTokenData();
};

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
export let getLastUpdated: GetLastUpdatedFn = () => {
  if (!tokenModule) {
    console.warn("Token fetcher not initialized yet");
    return null;
  }
  return tokenModule.getLastUpdated();
};

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
export let isTokenDataStale: IsTokenDataStaleFn = (
  maxAgeMinutes: number = 5
) => {
  if (!tokenModule) {
    console.warn("Token fetcher not initialized yet");
    return true;
  }
  return tokenModule.isTokenDataStale(maxAgeMinutes);
};

/**
 * Initializes the appropriate token fetcher implementation based on the environment
 *
 * This function dynamically imports either the browser or server token fetcher
 * implementation based on the detected environment. It updates the exported
 * function references to use the loaded module's implementations.
 *
 * If initialization fails, fallback implementations are provided that return
 * empty data and log warnings.
 *
 * @function initializeTokenFetcher
 * @async
 * @private
 * @returns {Promise<void>} Promise that resolves when initialization is complete
 *
 * @example
 * ```typescript
 * // This is called automatically, but can be manually triggered if needed
 * await initializeTokenFetcher();
 * ```
 */
async function initializeTokenFetcher() {
  try {
    console.log(
      `Token fetcher initializing for ${
        isBrowser() ? "browser" : "server"
      } environment`
    );

    // Dynamically import the appropriate implementation based on environment
    if (isBrowser()) {
      tokenModule = await import("./browser-token-fetcher").catch(() => null);
    } else {
      tokenModule = await import("./server-token-fetcher").catch(() => null);
    }

    if (!tokenModule) {
      throw new Error("Failed to load platform-specific token fetcher module");
    }

    // Update function references to use the loaded module
    updateTokenData = tokenModule.updateTokenData;
    getTokenData = tokenModule.getTokenData;
    getTokenBySymbol = tokenModule.getTokenBySymbol;
    getAllTokenSymbols = tokenModule.getAllTokenSymbols;
    getTokensByNetwork = tokenModule.getTokensByNetwork;
    clearTokenData = tokenModule.clearTokenData;
    getLastUpdated = tokenModule.getLastUpdated;
    isTokenDataStale = tokenModule.isTokenDataStale;

    console.log("Token fetcher initialized successfully");
  } catch (error) {
    console.warn(
      "Using fallback token fetcher implementations:",
      (error as Error).message
    );

    // Provide fallback implementations that return empty data
    updateTokenData = async () => {
      console.warn("Token fetcher not initialized - using fallback");
    };
    getTokenData = () => {
      console.warn("Token fetcher not initialized - returning empty array");
      return [];
    };
    getTokenBySymbol = () => {
      console.warn("Token fetcher not initialized - returning undefined");
      return undefined;
    };
    getAllTokenSymbols = () => {
      console.warn("Token fetcher not initialized - returning empty array");
      return [];
    };
    getTokensByNetwork = () => {
      console.warn("Token fetcher not initialized - returning empty array");
      return [];
    };
    clearTokenData = () => {
      console.warn("Token fetcher not initialized - no-op");
    };
    getLastUpdated = () => {
      console.warn("Token fetcher not initialized - returning null");
      return null;
    };
    isTokenDataStale = () => {
      console.warn("Token fetcher not initialized - returning true");
      return true;
    };
  }
}

// Initialize immediately to ensure token fetcher is ready when imported
initializeTokenFetcher().catch((error) =>
  console.error("Failed to initialize token fetcher:", error)
);
