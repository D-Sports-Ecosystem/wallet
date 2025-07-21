import { tokenUpdateService, TokenUpdateConfig } from './token-update-service';
import { tokenSyncService } from '../utils/token-sync';

/**
 * Configuration for the token background service
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
 * Background service for token data synchronization
 */
export class TokenBackgroundService {
  private static instance: TokenBackgroundService;
  private config: Required<TokenBackgroundServiceConfig>;
  private worker: Worker | null = null;
  private isActive: boolean = false;
  private failureCount: number = 0;
  private lastSyncTime: number = 0;
  private visibilityChangeHandler: () => void;
  
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
   * Get the singleton instance of TokenBackgroundService
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
   * Update the service configuration
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
   * Start the background service
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
   * Stop the background service
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
   * Initialize web worker for background processing
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
   * Handle visibility change events for background sync
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
   * Perform background synchronization
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
   * Check if the background service is active
   */
  public isRunning(): boolean {
    return this.isActive;
  }
  
  /**
   * Force an immediate synchronization
   */
  public async forceSync(): Promise<void> {
    return this.performBackgroundSync();
  }
}

// Export singleton instance
export const tokenBackgroundService = TokenBackgroundService.getInstance();

// Export a function to create a custom token background service
export function createTokenBackgroundService(config: TokenBackgroundServiceConfig): TokenBackgroundService {
  return TokenBackgroundService.getInstance(config);
}