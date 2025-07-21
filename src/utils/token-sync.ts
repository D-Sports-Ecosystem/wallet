import { tokenUpdateService, TokenUpdateConfig } from '../services/token-update-service';
import { TokenInfo } from '../services/token-service';

/**
 * Configuration for token synchronization
 */
export interface TokenSyncConfig extends TokenUpdateConfig {
  /**
   * Storage key for persisting token data
   * @default 'dsports_token_cache'
   */
  storageKey?: string;
  
  /**
   * Whether to persist token data to storage
   * @default true
   */
  persistToStorage?: boolean;
  
  /**
   * Maximum age of cached data in milliseconds before forcing a refresh
   * @default 3600000 (1 hour)
   */
  maxCacheAge?: number;
}

/**
 * Token synchronization service for managing token data updates and persistence
 */
export class TokenSyncService {
  private static instance: TokenSyncService;
  private config: Required<TokenSyncConfig>;
  
  private constructor(config: TokenSyncConfig = {}) {
    // Set default configuration
    this.config = {
      refreshInterval: config.refreshInterval ?? 300000, // 5 minutes
      cacheTTL: config.cacheTTL ?? 300000, // 5 minutes
      symbols: config.symbols ?? ['BTC', 'ETH', 'MATIC', 'USDC', 'BNB'],
      currency: config.currency ?? 'USD',
      onUpdate: config.onUpdate ?? (() => {}),
      onError: config.onError ?? ((error) => console.error('Token sync error:', error)),
      autoStart: config.autoStart ?? true,
      storageKey: config.storageKey ?? 'dsports_token_cache',
      persistToStorage: config.persistToStorage ?? true,
      maxCacheAge: config.maxCacheAge ?? 3600000, // 1 hour
    };
    
    // Initialize token update service with our config
    tokenUpdateService.updateConfig({
      refreshInterval: this.config.refreshInterval,
      cacheTTL: this.config.cacheTTL,
      symbols: this.config.symbols,
      currency: this.config.currency,
      autoStart: false, // We'll start it manually after loading from storage
      onUpdate: (tokens) => {
        // Persist to storage if enabled
        if (this.config.persistToStorage) {
          this.saveToStorage(tokens);
        }
        
        // Call the original onUpdate callback
        this.config.onUpdate(tokens);
      },
      onError: this.config.onError,
    });
    
    // Load cached data from storage and start the service
    if (this.config.autoStart) {
      this.initialize();
    }
  }
  
  /**
   * Get the singleton instance of TokenSyncService
   */
  public static getInstance(config?: TokenSyncConfig): TokenSyncService {
    if (!TokenSyncService.instance) {
      TokenSyncService.instance = new TokenSyncService(config);
    } else if (config) {
      // Update configuration if provided
      TokenSyncService.instance.updateConfig(config);
    }
    return TokenSyncService.instance;
  }
  
  /**
   * Update the service configuration
   */
  public updateConfig(config: Partial<TokenSyncConfig>): void {
    const wasRunning = tokenUpdateService.isRunning();
    
    // Stop the service if it's running
    if (wasRunning) {
      tokenUpdateService.stop();
    }
    
    // Update configuration
    if (config.refreshInterval !== undefined) this.config.refreshInterval = config.refreshInterval;
    if (config.cacheTTL !== undefined) this.config.cacheTTL = config.cacheTTL;
    if (config.symbols !== undefined) this.config.symbols = config.symbols;
    if (config.currency !== undefined) this.config.currency = config.currency;
    if (config.onUpdate !== undefined) this.config.onUpdate = config.onUpdate;
    if (config.onError !== undefined) this.config.onError = config.onError;
    if (config.storageKey !== undefined) this.config.storageKey = config.storageKey;
    if (config.persistToStorage !== undefined) this.config.persistToStorage = config.persistToStorage;
    if (config.maxCacheAge !== undefined) this.config.maxCacheAge = config.maxCacheAge;
    
    // Update token update service configuration
    tokenUpdateService.updateConfig({
      refreshInterval: this.config.refreshInterval,
      cacheTTL: this.config.cacheTTL,
      symbols: this.config.symbols,
      currency: this.config.currency,
      onUpdate: (tokens) => {
        // Persist to storage if enabled
        if (this.config.persistToStorage) {
          this.saveToStorage(tokens);
        }
        
        // Call the original onUpdate callback
        this.config.onUpdate(tokens);
      },
      onError: this.config.onError,
    });
    
    // Restart the service if it was running
    if (wasRunning) {
      tokenUpdateService.start();
    }
  }
  
  /**
   * Initialize the service by loading cached data and starting updates
   */
  private initialize(): void {
    // Try to load cached data from storage
    const cachedData = this.loadFromStorage();
    
    if (cachedData) {
      // Use cached data if it's not too old
      const { tokens, timestamp } = cachedData;
      const age = Date.now() - timestamp;
      
      if (age < this.config.maxCacheAge) {
        // Call the onUpdate callback with cached data
        this.config.onUpdate(tokens);
      }
    }
    
    // Start the token update service
    tokenUpdateService.start();
  }
  
  /**
   * Save token data to storage
   */
  private saveToStorage(tokens: TokenInfo[]): void {
    try {
      const data = {
        tokens,
        timestamp: Date.now(),
      };
      
      // Use localStorage in browser environments
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(this.config.storageKey, JSON.stringify(data));
      }
      
      // Use AsyncStorage in React Native environments
      // This is handled by the platform adapter in a real implementation
    } catch (error) {
      console.error('Failed to save token data to storage:', error);
    }
  }
  
  /**
   * Load token data from storage
   */
  private loadFromStorage(): { tokens: TokenInfo[], timestamp: number } | null {
    try {
      // Use localStorage in browser environments
      if (typeof window !== 'undefined' && window.localStorage) {
        const data = window.localStorage.getItem(this.config.storageKey);
        if (data) {
          return JSON.parse(data);
        }
      }
      
      // Use AsyncStorage in React Native environments
      // This is handled by the platform adapter in a real implementation
      
      return null;
    } catch (error) {
      console.error('Failed to load token data from storage:', error);
      return null;
    }
  }
  
  /**
   * Start the token sync service
   */
  public start(): void {
    tokenUpdateService.start();
  }
  
  /**
   * Stop the token sync service
   */
  public stop(): void {
    tokenUpdateService.stop();
  }
  
  /**
   * Force an immediate token data update
   */
  public async forceUpdate(): Promise<TokenInfo[]> {
    return tokenUpdateService.forceUpdate();
  }
  
  /**
   * Clear the token cache from both memory and storage
   */
  public clearCache(): void {
    tokenUpdateService.clearCache();
    
    try {
      // Clear from localStorage in browser environments
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(this.config.storageKey);
      }
      
      // Clear from AsyncStorage in React Native environments
      // This is handled by the platform adapter in a real implementation
    } catch (error) {
      console.error('Failed to clear token cache from storage:', error);
    }
  }
}

// Export singleton instance
export const tokenSyncService = TokenSyncService.getInstance();

// Export a function to create a custom token sync service
export function createTokenSyncService(config: TokenSyncConfig): TokenSyncService {
  return TokenSyncService.getInstance(config);
}