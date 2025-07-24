/**
 * @file event-emitter.ts
 * @description Type-safe event emitter implementation for handling events and listeners.
 * Provides a simple pub/sub pattern with strong TypeScript typing.
 * @module utils/event-emitter
 * @author D-Sports Engineering Team
 * @version 1.0.0
 * @since 2025-07-23
 */

/**
 * Type-safe event emitter class that allows subscribing to and emitting events.
 * Uses TypeScript generics to ensure type safety for event data.
 * 
 * @class
 * @template T - Record type mapping event names to their data types
 * 
 * @example
 * ```typescript
 * // Define event map
 * interface MyEvents {
 *   'connect': { address: string };
 *   'disconnect': void;
 *   'error': Error;
 * }
 * 
 * // Create event emitter
 * const emitter = new EventEmitter<MyEvents>();
 * 
 * // Add event listener
 * emitter.on('connect', (data) => {
 *   console.log(`Connected to: ${data.address}`);
 * });
 * 
 * // Emit event
 * emitter.emit('connect', { address: '0x123...' });
 * ```
 */
export class EventEmitter<T extends Record<string, any>> {
  /**
   * Map of event names to sets of listener functions
   * @private
   * @type {Map<keyof T, Set<Function>>}
   */
  private events: Map<keyof T, Set<Function>> = new Map();

  /**
   * Registers an event listener for the specified event.
   * 
   * @template K - Event name type (keyof T)
   * @param {K} event - The event name to listen for
   * @param {function} listener - The callback function to execute when the event is emitted
   * @returns {void}
   * 
   * @example
   * ```typescript
   * emitter.on('connect', (data) => {
   *   console.log(`Connected to: ${data.address}`);
   * });
   * ```
   */
  on<K extends keyof T>(event: K, listener: (data: T[K]) => void): void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(listener);
  }

  /**
   * Removes an event listener for the specified event.
   * 
   * @template K - Event name type (keyof T)
   * @param {K} event - The event name to remove the listener from
   * @param {function} listener - The callback function to remove
   * @returns {void}
   * 
   * @example
   * ```typescript
   * const handleConnect = (data) => {
   *   console.log(`Connected to: ${data.address}`);
   * };
   * 
   * // Add listener
   * emitter.on('connect', handleConnect);
   * 
   * // Remove listener
   * emitter.off('connect', handleConnect);
   * ```
   */
  off<K extends keyof T>(event: K, listener: (data: T[K]) => void): void {
    const listeners = this.events.get(event);
    if (listeners) {
      listeners.delete(listener);
      if (listeners.size === 0) {
        this.events.delete(event);
      }
    }
  }

  /**
   * Emits an event with optional data, triggering all registered listeners.
   * 
   * @template K - Event name type (keyof T)
   * @param {K} event - The event name to emit
   * @param {T[K]} [data] - Optional data to pass to the listeners
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // Emit event with data
   * emitter.emit('connect', { address: '0x123...' });
   * 
   * // Emit event without data
   * emitter.emit('disconnect');
   * ```
   */
  emit<K extends keyof T>(event: K, data?: T[K]): void {
    const listeners = this.events.get(event);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }

  /**
   * Removes all listeners for a specific event, or all events if no event is specified.
   * 
   * @template K - Event name type (keyof T)
   * @param {K} [event] - Optional event name to remove all listeners for
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // Remove all listeners for 'connect' event
   * emitter.removeAllListeners('connect');
   * 
   * // Remove all listeners for all events
   * emitter.removeAllListeners();
   * ```
   */
  removeAllListeners<K extends keyof T>(event?: K): void {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }
} 