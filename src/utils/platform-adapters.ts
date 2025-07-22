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

// Create web platform adapter with dynamic imports
export async function createWebPlatformAdapter(): Promise<PlatformAdapter> {
  return createCustomPlatformAdapter('web');
}

// Create Next.js platform adapter with dynamic imports
export async function createNextjsPlatformAdapter(): Promise<PlatformAdapter> {
  return createCustomPlatformAdapter('nextjs');
}

// Create React Native platform adapter with dynamic imports
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
        const AsyncStorage = await import('@react-native-async-storage/async-storage')
          .then(module => module.default)
          .catch(() => null);
        
        if (AsyncStorage) {
          return await AsyncStorage.getItem(key);
        }
        return null;
      } catch {
        return null;
      }
    },
    setItem: async (key: string, value: string) => {
      console.warn('Using synchronous adapter. Please migrate to async factory pattern.');
      try {
        const AsyncStorage = await import('@react-native-async-storage/async-storage')
          .then(module => module.default)
          .catch(() => null);
        
        if (AsyncStorage) {
          await AsyncStorage.setItem(key, value);
        }
      } catch {
        // Ignore storage errors
      }
    },
    removeItem: async (key: string) => {
      console.warn('Using synchronous adapter. Please migrate to async factory pattern.');
      try {
        const AsyncStorage = await import('@react-native-async-storage/async-storage')
          .then(module => module.default)
          .catch(() => null);
        
        if (AsyncStorage) {
          await AsyncStorage.removeItem(key);
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

// Auto-detect platform adapter (synchronous version for backward compatibility)
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
    if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
      return reactNativePlatformAdapter;
    }
    return nextjsPlatformAdapter; // Default to Next.js for server-side
  }
}

// Async version of getDefaultPlatformAdapter (recommended)
export async function getDefaultPlatformAdapterAsync(): Promise<PlatformAdapter> {
  return getFactoryDefaultAdapter();
}