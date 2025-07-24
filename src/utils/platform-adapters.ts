/**
 * @file platform-adapters.ts
 * @description Platform-specific adapters for storage, crypto, and network operations.
 * Provides a unified interface for platform-specific functionality across web, Next.js, and React Native.
 * @module utils/platform-adapters
 * @author D-Sports Engineering Team
 * @version 1.0.0
 * @since 2025-07-23
 */

import { PlatformAdapter } from '../types';
import {
  createPlatformAdapter,
  createCustomPlatformAdapter,
  getDefaultPlatformAdapter as getFactoryDefaultAdapter
} from './platform-adapter-factory';
import { BrowserCryptoAdapter, FallbackCryptoAdapter } from './crypto-adapter';

/**
 * Legacy platform adapters - kept for backward compatibility
 * New code should use the factory pattern instead
 */

/**
 * Creates a web platform adapter with dynamic imports.
 * This is the recommended way to create a platform adapter for web environments.
 * 
 * @async
 * @function
 * @returns {Promise<PlatformAdapter>} A platform adapter for web environments
 * 
 * @example
 * ```typescript
 * // Create a web platform adapter
 * const adapter = await createWebPlatformAdapter();
 * 
 * // Use the adapter
 * await adapter.storage.setItem('key', 'value');
 * ```
 */
export async function createWebPlatformAdapter(): Promise<PlatformAdapter> {
  return createCustomPlatformAdapter('web');
}

/**
 * Creates a Next.js platform adapter with dynamic imports.
 * This is the recommended way to create a platform adapter for Next.js environments.
 * 
 * @async
 * @function
 * @returns {Promise<PlatformAdapter>} A platform adapter for Next.js environments
 * 
 * @example
 * ```typescript
 * // Create a Next.js platform adapter
 * const adapter = await createNextjsPlatformAdapter();
 * 
 * // Use the adapter
 * await adapter.storage.setItem('key', 'value');
 * ```
 */
export async function createNextjsPlatformAdapter(): Promise<PlatformAdapter> {
  return createCustomPlatformAdapter('nextjs');
}

/**
 * Creates a React Native platform adapter with dynamic imports.
 * This is the recommended way to create a platform adapter for React Native environments.
 * 
 * @async
 * @function
 * @returns {Promise<PlatformAdapter>} A platform adapter for React Native environments
 * 
 * @example
 * ```typescript
 * // Create a React Native platform adapter
 * const adapter = await createReactNativePlatformAdapter();
 * 
 * // Use the adapter
 * await adapter.storage.setItem('key', 'value');
 * ```
 */
export async function createReactNativePlatformAdapter(): Promise<PlatformAdapter> {
  return createCustomPlatformAdapter('react-native');
}

// Placeholder adapters for synchronous compatibility
// These will be replaced with proper implementations when used asynchronously

// Web/Next.js Platform Adapter (synchronous fallback)
export const webPlatformAdapter: PlatformAdapter = {
  platform: 'web',
  storage: {
    getItem: async (key: string) => {
      console.warn('Using synchronous adapter. Please migrate to async factory pattern.');
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem: async (key: string, value: string) => {
      console.warn('Using synchronous adapter. Please migrate to async factory pattern.');
      try {
        localStorage.setItem(key, value);
      } catch {
        // Ignore storage errors
      }
    },
    removeItem: async (key: string) => {
      console.warn('Using synchronous adapter. Please migrate to async factory pattern.');
      try {
        localStorage.removeItem(key);
      } catch {
        // Ignore storage errors
      }
    }
  },
  crypto: {
    generateRandomBytes: (size: number) => {
      console.warn('Using synchronous adapter. Please migrate to async factory pattern.');
      
      try {
        // Use our browser crypto adapter
        const cryptoAdapter = new BrowserCryptoAdapter();
        return cryptoAdapter.getRandomValues(size);
      } catch (error) {
        console.warn('Browser crypto not available:', error);
        // Fallback to insecure implementation
        const fallbackAdapter = new FallbackCryptoAdapter();
        return fallbackAdapter.getRandomValues(size);
      }
    },
    sha256: async (data: Uint8Array) => {
      console.warn('Using synchronous adapter. Please migrate to async factory pattern.');
      
      // Try to use Web Crypto API if available
      if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
        try {
          const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
          return new Uint8Array(hashBuffer);
        } catch {
          // Fall through to fallback
        }
      }
      
      // Fallback implementation (not secure!)
      const hash = new Uint8Array(32); // SHA-256 is 32 bytes
      let h = 0;
      for (let i = 0; i < data.length; i++) {
        h = ((h << 5) - h) + data[i];
        h |= 0;
      }
      for (let i = 0; i < 32; i++) {
        hash[i] = (h + i * 16) & 0xFF;
      }
      return hash;
    }
  },
  network: {
    fetch: async (url: string, options?: any) => {
      console.warn('Using synchronous adapter. Please migrate to async factory pattern.');
      return fetch(url, options);
    },
    isNetworkAvailable: async () => {
      console.warn('Using synchronous adapter. Please migrate to async factory pattern.');
      try {
        await fetch('data:text/plain,');
        return true;
      } catch {
        return false;
      }
    }
  }
};

// Next.js Platform Adapter (synchronous fallback)
export const nextjsPlatformAdapter: PlatformAdapter = {
  platform: 'nextjs',
  storage: {
    getItem: async (key: string) => {
      console.warn('Using synchronous adapter. Please migrate to async factory pattern.');
      try {
        if (typeof window !== 'undefined') {
          return localStorage.getItem(key);
        }
        return null;
      } catch {
        return null;
      }
    },
    setItem: async (key: string, value: string) => {
      console.warn('Using synchronous adapter. Please migrate to async factory pattern.');
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(key, value);
        }
      } catch {
        // Ignore storage errors
      }
    },
    removeItem: async (key: string) => {
      console.warn('Using synchronous adapter. Please migrate to async factory pattern.');
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(key);
        }
      } catch {
        // Ignore storage errors
      }
    }
  },
  crypto: {
    generateRandomBytes: (size: number) => {
      console.warn('Using synchronous adapter. Please migrate to async factory pattern.');
      
      try {
        // Use our browser crypto adapter
        const cryptoAdapter = new BrowserCryptoAdapter();
        return cryptoAdapter.getRandomValues(size);
      } catch (error) {
        console.warn('Browser crypto not available:', error);
        // Fallback to insecure implementation
        const fallbackAdapter = new FallbackCryptoAdapter();
        return fallbackAdapter.getRandomValues(size);
      }
    },
    sha256: async (data: Uint8Array) => {
      console.warn('Using synchronous adapter. Please migrate to async factory pattern.');
      
      // Client-side: Use Web Crypto API if available
      if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
        try {
          const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
          return new Uint8Array(hashBuffer);
        } catch {
          // Fall through to fallback
        }
      }
      
      // Fallback implementation (not secure!)
      console.warn('Using insecure SHA-256 implementation');
      const hash = new Uint8Array(32); // SHA-256 is 32 bytes
      let h = 0;
      for (let i = 0; i < data.length; i++) {
        h = ((h << 5) - h) + data[i];
        h |= 0;
      }
      for (let i = 0; i < 32; i++) {
        hash[i] = (h + i * 16) & 0xFF;
      }
      return hash;
    }
  },
  network: {
    fetch: async (url: string, options?: any) => {
      console.warn('Using synchronous adapter. Please migrate to async factory pattern.');
      if (typeof window !== 'undefined') {
        return fetch(url, options);
      } else {
        // Server-side fetch (Node.js)
        try {
          const nodeFetch = await import('node-fetch').catch(() => null);
          if (nodeFetch && nodeFetch.default) {
            return nodeFetch.default(url, options) as any;
          }
        } catch (error) {
          // Continue to error
        }
        throw new Error('Fetch not available in this environment');
      }
    },
    isNetworkAvailable: async () => {
      console.warn('Using synchronous adapter. Please migrate to async factory pattern.');
      try {
        if (typeof window !== 'undefined') {
          await fetch('data:text/plain,');
        } else {
          const nodeFetch = await import('node-fetch').catch(() => null);
          if (nodeFetch && nodeFetch.default) {
            await nodeFetch.default('https://www.google.com', { method: 'HEAD' });
          } else {
            return false;
          }
        }
        return true;
      } catch {
        return false;
      }
    }
  }
};

// React Native Platform Adapter (synchronous fallback)
export const reactNativePlatformAdapter: PlatformAdapter = {
  platform: 'react-native',
  storage: {
    getItem: async (key: string) => {
      console.warn('Using synchronous adapter. Please migrate to async factory pattern.');
      try {
        // Use dynamic import with a variable to prevent direct static analysis
        // This will be properly excluded from browser bundles
        const storageModuleName = '@react-native-' + 'async-storage/async-storage';
        
        // Safely try to import AsyncStorage
        try {
          const AsyncStorage = await import(/* webpackIgnore: true */ storageModuleName)
            .then(module => module.default)
            .catch(() => null);
          
          if (AsyncStorage) {
            return await AsyncStorage.getItem(key);
          }
        } catch {
          // Silently fail if module is not available
        }
        return null;
      } catch {
        return null;
      }
    },
    setItem: async (key: string, value: string) => {
      console.warn('Using synchronous adapter. Please migrate to async factory pattern.');
      try {
        // Use dynamic import with a variable to prevent direct static analysis
        const storageModuleName = '@react-native-' + 'async-storage/async-storage';
        
        // Safely try to import AsyncStorage
        try {
          const AsyncStorage = await import(/* webpackIgnore: true */ storageModuleName)
            .then(module => module.default)
            .catch(() => null);
          
          if (AsyncStorage) {
            await AsyncStorage.setItem(key, value);
          }
        } catch {
          // Silently fail if module is not available
        }
      } catch {
        // Ignore storage errors
      }
    },
    removeItem: async (key: string) => {
      console.warn('Using synchronous adapter. Please migrate to async factory pattern.');
      try {
        // Use dynamic import with a variable to prevent direct static analysis
        const storageModuleName = '@react-native-' + 'async-storage/async-storage';
        
        // Safely try to import AsyncStorage
        try {
          const AsyncStorage = await import(/* webpackIgnore: true */ storageModuleName)
            .then(module => module.default)
            .catch(() => null);
          
          if (AsyncStorage) {
            await AsyncStorage.removeItem(key);
          }
        } catch {
          // Silently fail if module is not available
        }
      } catch {
        // Ignore storage errors
      }
    }
  },
  crypto: {
    generateRandomBytes: (size: number) => {
      console.warn('Using synchronous adapter. Please migrate to async factory pattern.');
      const array = new Uint8Array(size);
      
      // Try to use React Native's random number generator if available
      if (typeof global !== 'undefined' && global.crypto && global.crypto.getRandomValues) {
        try {
          global.crypto.getRandomValues(array);
          return array;
        } catch {
          // Fall through to fallback
        }
      }
      
      // Fallback to insecure random (should never happen in production)
      console.warn("Using insecure random number generator");
      for (let i = 0; i < size; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    },
    sha256: async (data: Uint8Array) => {
      console.warn('Using synchronous adapter. Please migrate to async factory pattern.');
      
      // Try to use React Native's crypto if available
      if (typeof global !== 'undefined' && global.crypto && global.crypto.subtle) {
        try {
          const hashBuffer = await global.crypto.subtle.digest('SHA-256', data);
          return new Uint8Array(hashBuffer);
        } catch {
          // Fall through to fallback
        }
      }
      
      // Fallback implementation (not secure!)
      console.warn('Using insecure SHA-256 implementation');
      const hash = new Uint8Array(32); // SHA-256 is 32 bytes
      let h = 0;
      for (let i = 0; i < data.length; i++) {
        h = ((h << 5) - h) + data[i];
        h |= 0;
      }
      for (let i = 0; i < 32; i++) {
        hash[i] = (h + i * 16) & 0xFF;
      }
      return hash;
    }
  },
  network: {
    fetch: async (url: string, options?: any) => {
      console.warn('Using synchronous adapter. Please migrate to async factory pattern.');
      return fetch(url, options);
    },
    isNetworkAvailable: async () => {
      console.warn('Using synchronous adapter. Please migrate to async factory pattern.');
      try {
        await fetch('https://www.google.com', { method: 'HEAD' });
        return true;
      } catch {
        return false;
      }
    }
  }
};

/**
 * Auto-detects and returns a platform adapter based on the current environment.
 * This is a synchronous version kept for backward compatibility.
 * 
 * @deprecated Use getDefaultPlatformAdapterAsync() instead
 * @function
 * @returns {PlatformAdapter} A platform adapter for the detected environment
 * 
 * @example
 * ```typescript
 * // Get a platform adapter for the current environment
 * const adapter = getDefaultPlatformAdapter();
 * 
 * // Use the adapter
 * await adapter.storage.setItem('key', 'value');
 * ```
 */
export function getDefaultPlatformAdapter(): PlatformAdapter {
  console.warn('Using synchronous getDefaultPlatformAdapter. Please migrate to async getDefaultPlatformAdapterAsync.');
  if (typeof window !== 'undefined') {
    // Check if we're in Next.js
    if (typeof (window as any).next !== 'undefined' || typeof process !== 'undefined' && process.env.NODE_ENV) {
      return nextjsPlatformAdapter;
    }
    return webPlatformAdapter;
  } else {
    // Check if we're in React Native
    // Use a safer check that doesn't rely on deprecated navigator.product
    if (typeof global !== 'undefined' && 
        ((global as any).__REACT_NATIVE_MAJOR_VERSION || 
         (global as any).ReactNative || 
         (typeof navigator !== 'undefined' && navigator.product === 'ReactNative'))) {
      return reactNativePlatformAdapter;
    }
    return nextjsPlatformAdapter; // Default to Next.js for server-side
  }
}

/**
 * Asynchronously auto-detects and returns a platform adapter based on the current environment.
 * This is the recommended way to get a platform adapter.
 * 
 * @async
 * @function
 * @returns {Promise<PlatformAdapter>} A platform adapter for the detected environment
 * 
 * @example
 * ```typescript
 * // Get a platform adapter for the current environment
 * const adapter = await getDefaultPlatformAdapterAsync();
 * 
 * // Use the adapter
 * await adapter.storage.setItem('key', 'value');
 * ```
 */
export async function getDefaultPlatformAdapterAsync(): Promise<PlatformAdapter> {
  return getFactoryDefaultAdapter();
}