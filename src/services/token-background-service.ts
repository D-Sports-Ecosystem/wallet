/**
 * @file token-background-service.ts
 * @description Background service for token data synchronization.
 * Manages token updates when the application is in the background.
 * @module services/token-background-service
 * @author D-Sports Engineering Team
 * @version 1.0.0
 * @since 2025-07-23
 */

import { tokenUpdateService, TokenUpdateConfig } from './token-update-service';
import { tokenSyncService } from '../utils/token-sync';

/**
 * Configuration for the token background service.
 * Controls how the service behaves when the application is in the background.
 */
export interface TokenBackgroundServiceConfig {
  /**
   * Whether to enable the background service
   * @default true
   */
  enabled?: boolean;
  
  /**
   * Whether to use web workers for background processing (if available)
   * @default true
   */
  useWebWorkers?: boolean;
  
  /**
   * Whether to sync with the server even when the app is in the background
   * @default false
   */
  backgroundSync?: boolean;
  
  /**
   * Minimum refresh interval in milliseconds when the app is in the background
   * @default 900000 (15 minutes)
   */
  backgroundRefreshInterval?: number;
  
  /**
   * Maximum number of consecutive failures before disabling background sync
   * @default 3
   */
  maxFailures?: number;
  
  /**
   * Token update configuration
   */
  updateConfig?: TokenUpdateConfig;
}

/**
 * Background service for token data synchronization.
 * Manages token updates when the application is in the background using Web Workers.
 * Implements the Singleton pattern to ensure only one instance exists.
 * 
 * @class
 * 
 * @example
 * ```typescript
 * // Get the default token background service
 * const service = tokenBackgroundService;
 * 
 * // Configure the service
 * service.updateConfig({
 *   backgroundSync: true,
 *   backgroundRefreshInterval: 300000, // 5 minutes
 *   updateConfig: {
 *     symbols: ['BTC', 'ETH', 'SOL']
 *   }
 * });
 * 
 * // Start the service
 * service.start();
 * 
 * // Force an immediate sync
 * service.forceSync();
 * ```
 */
export class TokenBackgroundService {
  /**
   * Singleton instance of the TokenBackgroundService
   * @private
   * @static
   * @type {TokenBackgroundService}
   */
  private static instance: TokenBackgroundService;
  
  /**
   * Service configuration with all required fields
   * @private
   * @type {Required<TokenBackgroundServiceConfig>}
   */
  private config: Required<TokenBackgroundServiceConfig>;
  
  /**
   * Web Worker for background processing
   * @private
   * @type {Worker | null}
   */
  private worker: Worker | null = null;
  
  /**
   * Flag indicating whether the service is active
   * @private
   * @type {boolean}
   */
  private isActive: boolean = false;
  
  /**
   * Count of consecutive synchronization failures
   * @private
   * @type {number}
   */
  private failureCount: number = 0;
  
  /**
   * Timestamp of the last successful synchronization
   * @private
   * @type {number}
   */
  private lastSyncTime: number = 0;
  
  /**
   * Event handler for visibility change events
   * @private
   * @type {() => void}
   */
  private visibilityChangeHandler: () => void;
  
  /**
   * Private constructor to enforce the Singleton pattern.
   * Initializes the service with the provided configuration.
   * 
   * @private
   * @constructor
   * @param {TokenBackgroundServiceConfig} [config={}] - Service configuration options
   */
  private constructor(config: TokenBackgroundServiceConfig = {}) {
    // Set default configuration
    this.config = {
      enabled: config.enabled ?? true,
      useWebWorkers: config.useWebWorkers ?? true,
      backgroundSync: config.backgroundSync ?? false,
      backgroundRefreshInterval: config.backgroundRefreshInterval ?? 900000, // 15 minutes
      maxFailures: config.maxFailures ?? 3,
      updateConfig: config.updateConfig ?? {},
    };
    
    // Initialize visibility change handler
    this.visibilityChangeHandler = this.handleVisibilityChange.bind(this);
    
    // Start the service if enabled
    if (this.config.enabled) {
      this.start();
    }
  }
  
  /**
   * Gets the singleton instance of TokenBackgroundService.
   * Creates a new instance if one doesn't exist yet.
   * 
   * @public
   * @static
   * @param {TokenBackgroundServiceConfig} [config] - Optional configuration for the service
   * @returns {TokenBackgroundService} The singleton instance
   * 
   * @example
   * ```typescript
   * // Get the default instance
   * const service = TokenBackgroundService.getInstance();
   * 
   * // Get the instance with custom configuration
   * const customService = TokenBackgroundService.getInstance({
   *   backgroundSync: true,
   *   backgroundRefreshInterval: 300000 // 5 minutes
   * });
   * ```
   */
  public static getInstance(config?: TokenBackgroundServiceConfig): TokenBackgroundService {
    if (!TokenBackgroundService.instance) {
      TokenBackgroundService.instance = new TokenBackgroundService(config);
    } else if (config) {
      // Update configuration if provided
      TokenBackgroundService.instance.updateConfig(config);
    }
    return TokenBackgroundService.instance;
  }
  
  /**
   * Updates the service configuration.
   * Restarts the service if the enabled state changes.
   * 
   * @public
   * @param {Partial<TokenBackgroundServiceConfig>} config - New configuration options
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // Update the background refresh interval
   * service.updateConfig({ backgroundRefreshInterval: 300000 });
   * 
   * // Enable background sync
   * service.updateConfig({ backgroundSync: true });
   * 
   * // Update token update configuration
   * service.updateConfig({
   *   updateConfig: {
   *     symbols: ['BTC', 'ETH', 'SOL'],
   *     currency: 'EUR'
   *   }
   * });
   * ```
   */
  public updateConfig(config: Partial<TokenBackgroundServiceConfig>): void {
    const wasEnabled = this.config.enabled;
    
    // Update configuration
    if (config.enabled !== undefined) this.config.enabled = config.enabled;
    if (config.useWebWorkers !== undefined) this.config.useWebWorkers = config.useWebWorkers;
    if (config.backgroundSync !== undefined) this.config.backgroundSync = config.backgroundSync;
    if (config.backgroundRefreshInterval !== undefined) this.config.backgroundRefreshInterval = config.backgroundRefreshInterval;
    if (config.maxFailures !== undefined) this.config.maxFailures = config.maxFailures;
    if (config.updateConfig !== undefined) {
      this.config.updateConfig = {
        ...this.config.updateConfig,
        ...config.updateConfig,
      };
      
      // Update token update service configuration
      tokenUpdateService.updateConfig(this.config.updateConfig);
    }
    
    // Restart the service if enabled state changed
    if (wasEnabled !== this.config.enabled) {
      if (this.config.enabled) {
        this.start();
      } else {
        this.stop();
      }
    }
  }
  
  /**
   * Starts the background service.
   * Initializes the token update service, sets up visibility change listeners,
   * and initializes the web worker if supported.
   * 
   * @public
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // Start the background service
   * service.start();
   * ```
   */
  public start(): void {
    if (this.isActive) {
      return;
    }
    
    this.isActive = true;
    this.failureCount = 0;
    
    // Initialize token update service with our config
    tokenUpdateService.updateConfig(this.config.updateConfig);
    
    // Start token update service
    tokenUpdateService.start();
    
    // Set up visibility change listener for background sync
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.visibilityChangeHandler);
    }
    
    // Initialize web worker if supported and enabled
    this.initializeWorker();
    
    console.log('Token background service started');
  }
  
  /**
   * Stops the background service.
   * Stops the token update service, removes event listeners,
   * and terminates the web worker if active.
   * 
   * @public
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // Stop the background service
   * service.stop();
   * ```
   */
  public stop(): void {
    if (!this.isActive) {
      return;
    }
    
    this.isActive = false;
    
    // Stop token update service
    tokenUpdateService.stop();
    
    // Remove visibility change listener
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
    }
    
    // Terminate web worker if active
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    
    console.log('Token background service stopped');
  }
  
  /**
   * Initializes a web worker for background processing.
   * Creates a worker from a blob URL with inline code.
   * 
   * @private
   * @returns {void}
   */
  private initializeWorker(): void {
    // Only initialize worker if web workers are supported and enabled
    if (!this.config.useWebWorkers || typeof Worker === 'undefined') {
      return;
    }
    
    try {
      // Create a worker from a blob URL
      const workerCode = `
        let interval;
        let config = {
          refreshInterval: 300000,
          backgroundRefreshInterval: 900000,
          backgroundSync: false
        };
        
        // Handle messages from the main thread
        self.onmessage = function(e) {
          const { type, data } = e.data;
          
          switch (type) {
            case 'config':
              config = { ...config, ...data };
              break;
              
            case 'start':
              clearInterval(interval);
              interval = setInterval(() => {
                self.postMessage({ type: 'sync' });
              }, config.refreshInterval);
              break;
              
            case 'stop':
              clearInterval(interval);
              break;
              
            case 'background':
              // Adjust interval for background mode
              clearInterval(interval);
              if (config.backgroundSync) {
                interval = setInterval(() => {
                  self.postMessage({ type: 'sync' });
                }, config.backgroundRefreshInterval);
              }
              break;
              
            case 'foreground':
              // Restore normal interval
              clearInterval(interval);
              interval = setInterval(() => {
                self.postMessage({ type: 'sync' });
              }, config.refreshInterval);
              break;
          }
        };
      `;
      
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      this.worker = new Worker(URL.createObjectURL(blob));
      
      // Set up message handler
      this.worker.onmessage = (e) => {
        const { type } = e.data;
        
        if (type === 'sync') {
          this.performBackgroundSync();
        }
      };
      
      // Configure and start the worker
      this.worker.postMessage({
        type: 'config',
        data: {
          refreshInterval: this.config.updateConfig.refreshInterval || 300000,
          backgroundRefreshInterval: this.config.backgroundRefreshInterval,
          backgroundSync: this.config.backgroundSync,
        },
      });
      
      this.worker.postMessage({ type: 'start' });
      
      console.log('Token background service worker initialized');
    } catch (error) {
      console.error('Failed to initialize token background service worker:', error);
      this.worker = null;
    }
  }
  
  /**
   * Handles visibility change events for background sync.
   * Adjusts the sync interval based on whether the app is in the foreground or background.
   * 
   * @private
   * @returns {void}
   */
  private handleVisibilityChange(): void {
    if (!this.isActive || !this.worker) {
      return;
    }
    
    if (document.visibilityState === 'hidden') {
      // App is in the background
      this.worker.postMessage({ type: 'background' });
    } else {
      // App is in the foreground
      this.worker.postMessage({ type: 'foreground' });
      
      // Force a sync if it's been a while
      const now = Date.now();
      if (now - this.lastSyncTime > this.config.backgroundRefreshInterval) {
        this.performBackgroundSync();
      }
    }
  }
  
  /**
   * Performs background synchronization of token data.
   * Updates the last sync time and handles failures.
   * 
   * @private
   * @async
   * @returns {Promise<void>}
   */
  private async performBackgroundSync(): Promise<void> {
    if (!this.isActive) {
      return;
    }
    
    try {
      // Update last sync time
      this.lastSyncTime = Date.now();
      
      // Force an update using the token update service
      await tokenUpdateService.forceUpdate();
      
      // Reset failure count on success
      this.failureCount = 0;
    } catch (error) {
      console.error('Background token sync failed:', error);
      
      // Increment failure count
      this.failureCount++;
      
      // Disable background sync if too many failures
      if (this.failureCount >= this.config.maxFailures) {
        console.warn(`Disabling background sync after ${this.failureCount} consecutive failures`);
        this.config.backgroundSync = false;
        
        if (this.worker) {
          this.worker.postMessage({
            type: 'config',
            data: { backgroundSync: false },
          });
        }
      }
    }
  }
  
  /**
   * Checks if the background service is active.
   * 
   * @public
   * @returns {boolean} True if the service is active, false otherwise
   * 
   * @example
   * ```typescript
   * // Check if the service is running
   * if (service.isRunning()) {
   *   console.log('Background service is active');
   * } else {
   *   console.log('Background service is inactive');
   * }
   * ```
   */
  public isRunning(): boolean {
    return this.isActive;
  }
  
  /**
   * Forces an immediate synchronization of token data.
   * 
   * @public
   * @async
   * @returns {Promise<void>}
   * 
   * @example
   * ```typescript
   * // Force an immediate sync
   * service.forceSync().then(() => {
   *   console.log('Sync completed');
   * }).catch(error => {
   *   console.error('Sync failed:', error);
   * });
   * ```
   */
  public async forceSync(): Promise<void> {
    return this.performBackgroundSync();
  }
}

/**
 * Singleton instance of the TokenBackgroundService.
 * Use this for most applications.
 * 
 * @constant
 * @type {TokenBackgroundService}
 * 
 * @example
 * ```typescript
 * // Import the singleton instance
 * import { tokenBackgroundService } from './token-background-service';
 * 
 * // Configure and use the service
 * tokenBackgroundService.updateConfig({ backgroundSync: true });
 * tokenBackgroundService.start();
 * ```
 */
export const tokenBackgroundService = TokenBackgroundService.getInstance();

/**
 * Creates a custom token background service with the specified configuration.
 * This is a convenience function that uses the singleton pattern internally.
 * 
 * @function
 * @param {TokenBackgroundServiceConfig} config - Configuration for the token background service
 * @returns {TokenBackgroundService} The configured token background service
 * 
 * @example
 * ```typescript
 * // Create a custom token background service
 * const service = createTokenBackgroundService({
 *   backgroundSync: true,
 *   backgroundRefreshInterval: 300000, // 5 minutes
 *   updateConfig: {
 *     symbols: ['BTC', 'ETH', 'SOL']
 *   }
 * });
 * 
 * // Start the service
 * service.start();
 * ```
 */
export function createTokenBackgroundService(config: TokenBackgroundServiceConfig): TokenBackgroundService {
  return TokenBackgroundService.getInstance(config);
}