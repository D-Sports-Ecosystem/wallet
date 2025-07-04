import { PlatformAdapter } from '../types';

// Web/Next.js Platform Adapter
export const webPlatformAdapter: PlatformAdapter = {
  platform: 'web',
  storage: {
    getItem: async (key: string) => {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem: async (key: string, value: string) => {
      try {
        localStorage.setItem(key, value);
      } catch {
        // Ignore storage errors
      }
    },
    removeItem: async (key: string) => {
      try {
        localStorage.removeItem(key);
      } catch {
        // Ignore storage errors
      }
    }
  },
  crypto: {
    generateRandomBytes: (size: number) => {
      const array = new Uint8Array(size);
      crypto.getRandomValues(array);
      return array;
    },
    sha256: async (data: Uint8Array) => {
      const hashBuffer = await crypto.subtle.digest('SHA-256', data as BufferSource);
      return new Uint8Array(hashBuffer);
    }
  },
  network: {
    fetch: async (url: string, options?: any) => {
      return fetch(url, options);
    }
  }
};

// Next.js Platform Adapter
export const nextjsPlatformAdapter: PlatformAdapter = {
  platform: 'nextjs',
  storage: {
    getItem: async (key: string) => {
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
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(key, value);
        }
      } catch {
        // Ignore storage errors
      }
    },
    removeItem: async (key: string) => {
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
      const array = new Uint8Array(size);
      if (typeof window !== 'undefined' && window.crypto) {
        crypto.getRandomValues(array);
      } else {
        // Fallback for server-side
        for (let i = 0; i < size; i++) {
          array[i] = Math.floor(Math.random() * 256);
        }
      }
      return array;
    },
    sha256: async (data: Uint8Array) => {
      if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
        const hashBuffer = await crypto.subtle.digest('SHA-256', data as BufferSource);
        return new Uint8Array(hashBuffer);
      } else {
        // Fallback for server-side (simplified)
        const crypto = require('crypto');
        const hash = crypto.createHash('sha256');
        hash.update(data);
        return new Uint8Array(hash.digest());
      }
    }
  },
  network: {
    fetch: async (url: string, options?: any) => {
      if (typeof window !== 'undefined') {
        return fetch(url, options);
      } else {
        // Server-side fetch (Node.js)
        const { default: fetch } = await import('node-fetch');
        return fetch(url, options) as any;
      }
    }
  }
};

// React Native Platform Adapter
export const reactNativePlatformAdapter: PlatformAdapter = {
  platform: 'react-native',
  storage: {
    getItem: async (key: string) => {
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        return await AsyncStorage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem: async (key: string, value: string) => {
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.setItem(key, value);
      } catch {
        // Ignore storage errors
      }
    },
    removeItem: async (key: string) => {
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.removeItem(key);
      } catch {
        // Ignore storage errors
      }
    }
  },
  crypto: {
    generateRandomBytes: (size: number) => {
      const array = new Uint8Array(size);
      try {
        // Use React Native's crypto polyfill
        const crypto = require('crypto');
        const bytes = crypto.randomBytes(size);
        for (let i = 0; i < size; i++) {
          array[i] = bytes[i];
        }
      } catch {
        // Fallback to Math.random
        for (let i = 0; i < size; i++) {
          array[i] = Math.floor(Math.random() * 256);
        }
      }
      return array;
    },
    sha256: async (data: Uint8Array) => {
      try {
        const crypto = require('crypto');
        const hash = crypto.createHash('sha256');
        hash.update(data);
        return new Uint8Array(hash.digest());
      } catch {
        // Fallback implementation
        throw new Error('SHA-256 not available in this environment');
      }
    }
  },
  network: {
    fetch: async (url: string, options?: any) => {
      return fetch(url, options);
    }
  }
};

// Auto-detect platform adapter
export function getDefaultPlatformAdapter(): PlatformAdapter {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return reactNativePlatformAdapter;
  }

  if (typeof window !== 'undefined') {
    // We are in a browser environment (either plain web or Next.js client side)
    return webPlatformAdapter;
  }

  // If no window and not React Native, we're likely in a Node.js environment (Next.js server)
  return nextjsPlatformAdapter;
}
