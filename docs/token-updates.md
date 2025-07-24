# Token Updates Documentation

This document provides a comprehensive overview of the token update mechanism in the @d-sports/wallet project.

## Overview

The @d-sports/wallet project includes a token update system that ensures token data is kept up-to-date with the latest market information. This document explains how token updates work and how to use the token update API.

## Token Update Architecture

### Update Mechanism

The token update system uses a combination of scheduled updates and on-demand updates to ensure token data is always current.

```typescript
/**
 * Token update mechanism
 * 
 * 1. Scheduled updates: Token data is automatically updated at regular intervals
 * 2. On-demand updates: Token data can be manually updated when needed
 * 3. Event-based updates: Token data is updated in response to certain events
 */
```

### Update Sources

Token data is updated from multiple sources to ensure accuracy and reliability.

```typescript
/**
 * Token update sources
 * 
 * 1. CoinMarketCap API: Primary source for token price and market data
 * 2. Blockchain APIs: Source for on-chain token balances and transactions
 * 3. Custom APIs: Source for project-specific token data
 */
```

## Token Update API

### Core Functions

```typescript
/**
 * Updates token data from external sources
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
 * Schedules automatic token data updates
 * 
 * @function scheduleTokenUpdates
 * @param {number} [intervalMs=300000] - Update interval in milliseconds (default: 5 minutes)
 * @returns {Function} Function to cancel scheduled updates
 * 
 * @example
 * ```typescript
 * // Schedule token updates every 10 minutes
 * const cancelUpdates = scheduleTokenUpdates(10 * 60 * 1000);
 * 
 * // Later, cancel scheduled updates
 * cancelUpdates();
 * ```
 */
export function scheduleTokenUpdates(intervalMs?: number): () => void;

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

/**
 * Gets the timestamp of the last token data update
 * 
 * @function getLastUpdateTime
 * @returns {Date | null} Timestamp of the last update or null if never updated
 * 
 * @example
 * ```typescript
 * // Get the timestamp of the last token data update
 * const lastUpdate = getLastUpdateTime();
 * if (lastUpdate) {
 *   console.log(`Last updated: ${lastUpdate.toLocaleString()}`);
 * } else {
 *   console.log('Never updated');
 * }
 * ```
 */
export function getLastUpdateTime(): Date | null;
```

## Token Update Service

The token update service provides higher-level functionality for managing token updates.

```typescript
/**
 * Token update service
 * 
 * @class TokenUpdateService
 */
export class TokenUpdateService {
  /**
   * Creates a new TokenUpdateService instance
   * 
   * @constructor
   * @param {TokenUpdateOptions} [options] - Token update options
   * 
   * @example
   * ```typescript
   * const updateService = new TokenUpdateService({
   *   updateInterval: 10 * 60 * 1000, // 10 minutes
   *   maxRetries: 3,
   *   retryDelay: 5000 // 5 seconds
   * });
   * ```
   */
  constructor(options?: TokenUpdateOptions);
  
  /**
   * Starts automatic token updates
   * 
   * @method start
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // Start automatic token updates
   * updateService.start();
   * ```
   */
  start(): void;
  
  /**
   * Stops automatic token updates
   * 
   * @method stop
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // Stop automatic token updates
   * updateService.stop();
   * ```
   */
  stop(): void;
  
  /**
   * Updates token data immediately
   * 
   * @method updateNow
   * @async
   * @returns {Promise<void>} Promise that resolves when the update is complete
   * 
   * @example
   * ```typescript
   * // Update token data immediately
   * await updateService.updateNow();
   * console.log('Token data updated');
   * ```
   */
  async updateNow(): Promise<void>;
  
  /**
   * Gets the update status
   * 
   * @method getStatus
   * @returns {TokenUpdateStatus} Current update status
   * 
   * @example
   * ```typescript
   * // Get the current update status
   * const status = updateService.getStatus();
   * console.log(`Update status: ${status.state}`);
   * console.log(`Last update: ${status.lastUpdate}`);
   * console.log(`Next update: ${status.nextUpdate}`);
   * ```
   */
  getStatus(): TokenUpdateStatus;
  
  /**
   * Subscribes to update events
   * 
   * @method subscribe
   * @param {TokenUpdateEventHandler} handler - Event handler function
   * @returns {Function} Function to unsubscribe
   * 
   * @example
   * ```typescript
   * // Subscribe to update events
   * const unsubscribe = updateService.subscribe((event) => {
   *   console.log(`Update event: ${event.type}`);
   *   if (event.type === 'error') {
   *     console.error('Update error:', event.error);
   *   }
   * });
   * 
   * // Later, unsubscribe
   * unsubscribe();
   * ```
   */
  subscribe(handler: TokenUpdateEventHandler): () => void;
}
```

## Token Update Events

The token update system emits events that can be used to react to updates.

```typescript
/**
 * Token update event types
 * 
 * @enum {string}
 * @readonly
 */
export enum TokenUpdateEventType {
  /**
   * Update started
   */
  START = 'start',
  
  /**
   * Update completed successfully
   */
  COMPLETE = 'complete',
  
  /**
   * Update failed
   */
  ERROR = 'error',
  
  /**
   * Update scheduled
   */
  SCHEDULED = 'scheduled',
  
  /**
   * Update canceled
   */
  CANCELED = 'canceled'
}

/**
 * Token update event
 * 
 * @interface TokenUpdateEvent
 * @property {TokenUpdateEventType} type - Event type
 * @property {Date} timestamp - Event timestamp
 * @property {Error} [error] - Error if event type is ERROR
 * @property {Date} [nextUpdate] - Next scheduled update if event type is SCHEDULED
 */
export interface TokenUpdateEvent {
  type: TokenUpdateEventType;
  timestamp: Date;
  error?: Error;
  nextUpdate?: Date;
}

/**
 * Token update event handler
 * 
 * @callback TokenUpdateEventHandler
 * @param {TokenUpdateEvent} event - Update event
 * @returns {void}
 */
export type TokenUpdateEventHandler = (event: TokenUpdateEvent) => void;
```

## Token Update Hooks

The token update hooks provide React integration for the token update system.

```typescript
/**
 * Hook for managing token updates
 * 
 * @function useTokenUpdates
 * @param {TokenUpdateOptions} [options] - Token update options
 * @returns {Object} Token update methods and state
 * @returns {Function} updateNow - Function to update tokens immediately
 * @returns {Function} startUpdates - Function to start automatic updates
 * @returns {Function} stopUpdates - Function to stop automatic updates
 * @returns {TokenUpdateStatus} status - Current update status
 * @returns {boolean} isUpdating - Whether an update is in progress
 * @returns {Error | null} error - Last update error or null
 * 
 * @example
 * ```tsx
 * function TokenDashboard() {
 *   const {
 *     updateNow,
 *     startUpdates,
 *     stopUpdates,
 *     status,
 *     isUpdating,
 *     error
 *   } = useTokenUpdates({ updateInterval: 5 * 60 * 1000 });
 *   
 *   useEffect(() => {
 *     // Start automatic updates when component mounts
 *     startUpdates();
 *     
 *     // Stop automatic updates when component unmounts
 *     return () => stopUpdates();
 *   }, [startUpdates, stopUpdates]);
 *   
 *   return (
 *     <div>
 *       <button onClick={updateNow} disabled={isUpdating}>
 *         {isUpdating ? 'Updating...' : 'Update Now'}
 *       </button>
 *       <p>Last update: {status.lastUpdate?.toLocaleString() || 'Never'}</p>
 *       <p>Next update: {status.nextUpdate?.toLocaleString() || 'Not scheduled'}</p>
 *       {error && <p className="error">Error: {error.message}</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useTokenUpdates(options?: TokenUpdateOptions): {
  updateNow: () => Promise<void>;
  startUpdates: () => void;
  stopUpdates: () => void;
  status: TokenUpdateStatus;
  isUpdating: boolean;
  error: Error | null;
};
```

## Token Update Configuration

The token update system can be configured to meet specific requirements.

```typescript
/**
 * Token update options
 * 
 * @interface TokenUpdateOptions
 * @property {number} [updateInterval=300000] - Update interval in milliseconds (default: 5 minutes)
 * @property {number} [maxRetries=3] - Maximum number of retry attempts for failed updates
 * @property {number} [retryDelay=5000] - Delay between retry attempts in milliseconds (default: 5 seconds)
 * @property {boolean} [autoStart=false] - Whether to start automatic updates immediately
 * @property {string[]} [symbols] - Specific token symbols to update (default: all tokens)
 * @property {string} [currency="USD"] - Currency for token prices (default: USD)
 */
export interface TokenUpdateOptions {
  updateInterval?: number;
  maxRetries?: number;
  retryDelay?: number;
  autoStart?: boolean;
  symbols?: string[];
  currency?: string;
}

/**
 * Token update status
 * 
 * @interface TokenUpdateStatus
 * @property {TokenUpdateState} state - Current update state
 * @property {Date | null} lastUpdate - Timestamp of the last update or null if never updated
 * @property {Date | null} nextUpdate - Timestamp of the next scheduled update or null if not scheduled
 * @property {number} updateCount - Number of successful updates
 * @property {number} errorCount - Number of failed updates
 * @property {Error | null} lastError - Last update error or null
 */
export interface TokenUpdateStatus {
  state: TokenUpdateState;
  lastUpdate: Date | null;
  nextUpdate: Date | null;
  updateCount: number;
  errorCount: number;
  lastError: Error | null;
}

/**
 * Token update state
 * 
 * @enum {string}
 * @readonly
 */
export enum TokenUpdateState {
  /**
   * Idle state (no updates in progress or scheduled)
   */
  IDLE = 'idle',
  
  /**
   * Update in progress
   */
  UPDATING = 'updating',
  
  /**
   * Updates scheduled
   */
  SCHEDULED = 'scheduled',
  
  /**
   * Update error
   */
  ERROR = 'error'
}
```

## Token Update Script

The token update system includes a script for updating token data from the command line.

```typescript
/**
 * Token update script
 * 
 * This script updates token data from the command line.
 * 
 * Usage:
 * ```
 * node scripts/update-token-data.js [options]
 * ```
 * 
 * Options:
 * --symbols, -s: Comma-separated list of token symbols to update (default: all tokens)
 * --currency, -c: Currency for token prices (default: USD)
 * --output, -o: Output file for updated token data (default: data/token-data.ts)
 * --format, -f: Output format (json or ts, default: ts)
 * --verbose, -v: Enable verbose output
 */
```

## Conclusion

The token update system in the @d-sports/wallet project provides a robust, flexible way to keep token data up-to-date. By using a combination of scheduled updates, on-demand updates, and event-based updates, it ensures that token data is always current while minimizing API calls and resource usage.