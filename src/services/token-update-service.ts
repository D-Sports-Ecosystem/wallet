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

export class TokenUpdateService {
  private static instance: TokenUpdateService;
  private config: Required<TokenUpdateConfig>;
  private intervalId: NodeJS.Timeout | null = null;
  private lastUpdated: Date | null = null;
  private isUpdating: boolean = false;
  private tokens: TokenInfo[] = [];
  
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
   * Get the singleton instance of TokenUpdateService
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
   * Update the service configuration
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
   * Start the token update service
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
   * Stop the token update service
   */
  public stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
  /**
   * Check if the update service is running
   */
  public isRunning(): boolean {
    return this.intervalId !== null;
  }
  
  /**
   * Get the last updated timestamp
   */
  public getLastUpdated(): Date | null {
    return this.lastUpdated;
  }
  
  /**
   * Get the current token data
   */
  public getTokens(): TokenInfo[] {
    return this.tokens;
  }
  
  /**
   * Force an immediate token data update
   */
  public async forceUpdate(): Promise<TokenInfo[]> {
    return this.updateTokenData(true);
  }
  
  /**
   * Clear the token cache
   */
  public clearCache(): void {
    apiAdapter.clearCache();
  }
  
  /**
   * Update token data
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

// Export singleton instance
export const tokenUpdateService = TokenUpdateService.getInstance();

// Export a function to create a custom token update service
export function createTokenUpdateService(config: TokenUpdateConfig): TokenUpdateService {
  return TokenUpdateService.getInstance(config);
}