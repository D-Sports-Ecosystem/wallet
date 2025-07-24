/**
 * @file token-update-service.ts
 * @description Service for managing token data updates and caching.
 * Provides automatic refresh of token data at configurable intervals.
 * @module services/token-update-service
 * @author D-Sports Engineering Team
 * @version 1.0.0
 * @since 2025-07-23
 */

import { tokenService, TokenInfo } from './token-service';
import { apiAdapter } from '../utils/platform-adapter';

export interface TokenUpdateConfig {
  /**
   * Refresh interval in milliseconds
   * @default 300000 (5 minutes)
   */
  refreshInterval?: number;
  
  /**
   * Cache TTL in milliseconds
   * @default 300000 (5 minutes)
   */
  cacheTTL?: number;
  
  /**
   * Token symbols to track
   * @default ['BTC', 'ETH', 'MATIC', 'USDC', 'BNB']
   */
  symbols?: string[];
  
  /**
   * Currency for price conversion
   * @default 'USD'
   */
  currency?: string;
  
  /**
   * Callback function to execute when token data is updated
   */
  onUpdate?: (tokens: TokenInfo[]) => void;
  
  /**
   * Callback function to execute when an error occurs
   */
  onError?: (error: Error) => void;
  
  /**
   * Whether to automatically start the update service
   * @default true
   */
  autoStart?: boolean;
}

/**
 * Service for managing token data updates and caching.
 * Implements the Singleton pattern to ensure only one instance exists.
 * 
 * @class
 * 
 * @example
 * ```typescript
 * // Get the default token update service
 * const service = tokenUpdateService;
 * 
 * // Configure the service
 * service.updateConfig({
 *   refreshInterval: 60000, // 1 minute
 *   symbols: ['BTC', 'ETH', 'SOL'],
 *   onUpdate: (tokens) => console.log('Tokens updated:', tokens)
 * });
 * 
 * // Start the service
 * service.start();
 * 
 * // Force an immediate update
 * service.forceUpdate().then(tokens => {
 *   console.log('Tokens:', tokens);
 * });
 * ```
 */
export class TokenUpdateService {
  /**
   * Singleton instance of the TokenUpdateService
   * @private
   * @static
   * @type {TokenUpdateService}
   */
  private static instance: TokenUpdateService;
  
  /**
   * Service configuration with all required fields
   * @private
   * @type {Required<TokenUpdateConfig>}
   */
  private config: Required<TokenUpdateConfig>;
  
  /**
   * Interval timer ID for periodic updates
   * @private
   * @type {NodeJS.Timeout | null}
   */
  private intervalId: NodeJS.Timeout | null = null;
  
  /**
   * Timestamp of the last successful update
   * @private
   * @type {Date | null}
   */
  private lastUpdated: Date | null = null;
  
  /**
   * Flag indicating whether an update is in progress
   * @private
   * @type {boolean}
   */
  private isUpdating: boolean = false;
  
  /**
   * Cached token data
   * @private
   * @type {TokenInfo[]}
   */
  private tokens: TokenInfo[] = [];
  
  /**
   * Private constructor to enforce the Singleton pattern.
   * Initializes the service with the provided configuration.
   * 
   * @private
   * @constructor
   * @param {TokenUpdateConfig} [config={}] - Service configuration options
   */
  private constructor(config: TokenUpdateConfig = {}) {
    // Set default configuration
    const isTestEnvironment = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
    this.config = {
      refreshInterval: config.refreshInterval ?? 300000, // 5 minutes
      cacheTTL: config.cacheTTL ?? 300000, // 5 minutes
      symbols: config.symbols ?? ['BTC', 'ETH', 'MATIC', 'USDC', 'BNB'],
      currency: config.currency ?? 'USD',
      onUpdate: config.onUpdate ?? (() => {}),
      onError: config.onError ?? ((error) => console.error('Token update error:', error)),
      autoStart: config.autoStart ?? (!isTestEnvironment), // Don't auto-start in test environment
    };
    
    // Configure the API adapter cache TTL
    apiAdapter.setCacheTTL(this.config.cacheTTL);
    
    // Start the update service if autoStart is enabled
    if (this.config.autoStart) {
      this.start();
    }
  }
  
  /**
   * Gets the singleton instance of TokenUpdateService.
   * Creates a new instance if one doesn't exist yet.
   * 
   * @public
   * @static
   * @param {TokenUpdateConfig} [config] - Optional configuration for the service
   * @returns {TokenUpdateService} The singleton instance
   * 
   * @example
   * ```typescript
   * // Get the default instance
   * const service = TokenUpdateService.getInstance();
   * 
   * // Get the instance with custom configuration
   * const customService = TokenUpdateService.getInstance({
   *   refreshInterval: 60000,
   *   symbols: ['BTC', 'ETH']
   * });
   * ```
   */
  public static getInstance(config?: TokenUpdateConfig): TokenUpdateService {
    if (!TokenUpdateService.instance) {
      TokenUpdateService.instance = new TokenUpdateService(config);
    } else if (config) {
      // Update configuration if provided
      TokenUpdateService.instance.updateConfig(config);
    }
    return TokenUpdateService.instance;
  }
  
  /**
   * Updates the service configuration.
   * Stops and restarts the service if it was running.
   * 
   * @public
   * @param {Partial<TokenUpdateConfig>} config - New configuration options
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // Update the refresh interval
   * service.updateConfig({ refreshInterval: 60000 });
   * 
   * // Update multiple configuration options
   * service.updateConfig({
   *   symbols: ['BTC', 'ETH', 'SOL'],
   *   currency: 'EUR',
   *   onUpdate: (tokens) => console.log('Tokens updated:', tokens)
   * });
   * ```
   */
  public updateConfig(config: Partial<TokenUpdateConfig>): void {
    const wasRunning = this.isRunning();
    
    // Stop the service if it's running
    if (wasRunning) {
      this.stop();
    }
    
    // Update configuration
    if (config.refreshInterval !== undefined) this.config.refreshInterval = config.refreshInterval;
    if (config.cacheTTL !== undefined) {
      this.config.cacheTTL = config.cacheTTL;
      apiAdapter.setCacheTTL(config.cacheTTL);
    }
    if (config.symbols !== undefined) this.config.symbols = config.symbols;
    if (config.currency !== undefined) this.config.currency = config.currency;
    if (config.onUpdate !== undefined) this.config.onUpdate = config.onUpdate;
    if (config.onError !== undefined) this.config.onError = config.onError;
    
    // Restart the service if it was running
    if (wasRunning) {
      this.start();
    }
  }
  
  /**
   * Starts the token update service.
   * Performs an initial update and sets up periodic updates.
   * 
   * @public
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // Start the token update service
   * service.start();
   * ```
   */
  public start(): void {
    if (this.intervalId !== null) {
      // Service is already running
      return;
    }
    
    // Perform an initial update
    this.updateTokenData();
    
    // Set up the interval for periodic updates
    this.intervalId = setInterval(() => {
      this.updateTokenData();
    }, this.config.refreshInterval);
  }
  
  /**
   * Stops the token update service.
   * Clears the update interval.
   * 
   * @public
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // Stop the token update service
   * service.stop();
   * ```
   */
  public stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
  /**
   * Checks if the update service is running.
   * 
   * @public
   * @returns {boolean} True if the service is running, false otherwise
   * 
   * @example
   * ```typescript
   * // Check if the service is running
   * if (service.isRunning()) {
   *   console.log('Service is running');
   * } else {
   *   console.log('Service is stopped');
   * }
   * ```
   */
  public isRunning(): boolean {
    return this.intervalId !== null;
  }
  
  /**
   * Gets the timestamp of the last successful update.
   * 
   * @public
   * @returns {Date | null} The last update timestamp or null if no update has occurred
   * 
   * @example
   * ```typescript
   * // Get the last update timestamp
   * const lastUpdated = service.getLastUpdated();
   * if (lastUpdated) {
   *   console.log(`Last updated: ${lastUpdated.toLocaleString()}`);
   * } else {
   *   console.log('No updates yet');
   * }
   * ```
   */
  public getLastUpdated(): Date | null {
    return this.lastUpdated;
  }
  
  /**
   * Gets the current token data.
   * 
   * @public
   * @returns {TokenInfo[]} Array of token information
   * 
   * @example
   * ```typescript
   * // Get the current token data
   * const tokens = service.getTokens();
   * console.log(`Found ${tokens.length} tokens`);
   * tokens.forEach(token => {
   *   console.log(`${token.name}: ${token.price} ${token.currency}`);
   * });
   * ```
   */
  public getTokens(): TokenInfo[] {
    return this.tokens;
  }
  
  /**
   * Forces an immediate token data update.
   * Bypasses the update prevention for concurrent updates.
   * 
   * @public
   * @async
   * @returns {Promise<TokenInfo[]>} Promise resolving to the updated token data
   * 
   * @example
   * ```typescript
   * // Force an immediate update
   * service.forceUpdate().then(tokens => {
   *   console.log('Tokens updated:', tokens);
   * }).catch(error => {
   *   console.error('Update failed:', error);
   * });
   * ```
   */
  public async forceUpdate(): Promise<TokenInfo[]> {
    return this.updateTokenData(true);
  }
  
  /**
   * Clears the token cache.
   * Forces fresh data to be fetched on the next update.
   * 
   * @public
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // Clear the token cache
   * service.clearCache();
   * ```
   */
  public clearCache(): void {
    apiAdapter.clearCache();
  }
  
  /**
   * Updates token data by fetching from the token service.
   * Prevents concurrent updates unless forced.
   * 
   * @private
   * @async
   * @param {boolean} [force=false] - Whether to force an update even if one is already in progress
   * @returns {Promise<TokenInfo[]>} Promise resolving to the updated token data
   */
  private async updateTokenData(force: boolean = false): Promise<TokenInfo[]> {
    // Prevent concurrent updates
    if (this.isUpdating && !force) {
      return this.tokens;
    }
    
    try {
      this.isUpdating = true;
      
      // Fetch token data
      const tokens = await tokenService.fetchTokenData(
        this.config.symbols,
        this.config.currency
      );
      
      // Update tokens and last updated timestamp
      this.tokens = tokens;
      this.lastUpdated = new Date();
      
      // Call the onUpdate callback
      this.config.onUpdate(tokens);
      
      return tokens;
    } catch (error) {
      // Call the onError callback
      const err = error instanceof Error ? error : new Error('Unknown error during token update');
      this.config.onError(err);
      throw err;
    } finally {
      this.isUpdating = false;
    }
  }
}

/**
 * Singleton instance of the TokenUpdateService.
 * Use this for most applications.
 * 
 * @constant
 * @type {TokenUpdateService}
 * 
 * @example
 * ```typescript
 * // Import the singleton instance
 * import { tokenUpdateService } from './token-update-service';
 * 
 * // Configure and use the service
 * tokenUpdateService.updateConfig({ refreshInterval: 60000 });
 * tokenUpdateService.start();
 * ```
 */
export const tokenUpdateService = TokenUpdateService.getInstance();

/**
 * Creates a custom token update service with the specified configuration.
 * This is a convenience function that uses the singleton pattern internally.
 * 
 * @function
 * @param {TokenUpdateConfig} config - Configuration for the token update service
 * @returns {TokenUpdateService} The configured token update service
 * 
 * @example
 * ```typescript
 * // Create a custom token update service
 * const service = createTokenUpdateService({
 *   refreshInterval: 60000,
 *   symbols: ['BTC', 'ETH', 'SOL'],
 *   currency: 'EUR'
 * });
 * 
 * // Start the service
 * service.start();
 * ```
 */
export function createTokenUpdateService(config: TokenUpdateConfig): TokenUpdateService {
  return TokenUpdateService.getInstance(config);
}