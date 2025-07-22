import { Platform } from '../types';

/**
 * Storage adapter interface for cross-platform storage operations
 */
export interface StorageAdapter {
  /**
   * Get an item from storage
   * @param key The key to retrieve
   * @returns The stored value or null if not found
   */
  getItem(key: string): Promise<string | null>;
  
  /**
   * Set an item in storage
   * @param key The key to store
   * @param value The value to store
   */
  setItem(key: string, value: string): Promise<void>;
  
  /**
   * Remove an item from storage
   * @param key The key to remove
   */
  removeItem(key: string): Promise<void>;
}

/**
 * Memory-based storage adapter that works in any environment
 */
export class MemoryStorageAdapter implements StorageAdapter {
  private storage = new Map<string, string>();
  
  async getItem(key: string): Promise<string | null> {
    return this.storage.get(key) || null;
  }
  
  async setItem(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }
  
  async removeItem(key: string): Promise<void> {
    this.storage.delete(key);
  }
}

/**
 * Browser localStorage adapter
 */
export class LocalStorageAdapter implements StorageAdapter {
  async getItem(key: string): Promise<string | null> {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  
  async setItem(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('Failed to write to localStorage:', error);
    }
  }
  
  async removeItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  }
}

/**
 * React Native AsyncStorage adapter
 */
export class AsyncStorageAdapter implements StorageAdapter {
  private asyncStorage: any;
  
  constructor(asyncStorage: any) {
    this.asyncStorage = asyncStorage;
  }
  
  async getItem(key: string): Promise<string | null> {
    try {
      return await this.asyncStorage.getItem(key);
    } catch (error) {
      console.warn('Failed to read from AsyncStorage:', error);
      return null;
    }
  }
  
  async setItem(key: string, value: string): Promise<void> {
    try {
      await this.asyncStorage.setItem(key, value);
    } catch (error) {
      console.warn('Failed to write to AsyncStorage:', error);
    }
  }
  
  async removeItem(key: string): Promise<void> {
    try {
      await this.asyncStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove from AsyncStorage:', error);
    }
  }
}

/**
 * Feature detection for storage capabilities
 */
export async function detectStorageFeatures(): Promise<{
  hasLocalStorage: boolean;
  hasAsyncStorage: boolean;
}> {
  const features = {
    hasLocalStorage: false,
    hasAsyncStorage: false,
  };
  
  // Check for localStorage
  if (typeof window !== 'undefined') {
    try {
      features.hasLocalStorage = window.localStorage !== undefined;
      // Verify localStorage actually works (private browsing can throw)
      if (features.hasLocalStorage) {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
      }
    } catch {
      features.hasLocalStorage = false;
    }
  }
  
  // Check for AsyncStorage
  try {
    const AsyncStorage = await importAsyncStorage();
    features.hasAsyncStorage = AsyncStorage !== null;
  } catch {
    features.hasAsyncStorage = false;
  }
  
  return features;
}

/**
 * Safely import AsyncStorage with fallback
 */
async function importAsyncStorage(): Promise<any> {
  try {
    // Use dynamic import with a variable to prevent direct static analysis
    const storageModuleName = '@react-native-' + 'async-storage/async-storage';
    
    return await import(/* webpackIgnore: true */ storageModuleName)
      .then(module => module.default)
      .catch(() => null);
  } catch {
    return null;
  }
}

/**
 * Create a storage adapter based on the platform and available features
 */
export async function createStorageAdapter(platform: Platform): Promise<StorageAdapter> {
  const features = await detectStorageFeatures();
  
  // React Native with AsyncStorage
  if (platform === 'react-native' && features.hasAsyncStorage) {
    try {
      const AsyncStorage = await importAsyncStorage();
      if (AsyncStorage) {
        return new AsyncStorageAdapter(AsyncStorage);
      }
    } catch (error) {
      console.warn('Failed to initialize AsyncStorage adapter:', error);
    }
  }
  
  // Browser or Next.js with localStorage
  if ((platform === 'web' || platform === 'nextjs') && features.hasLocalStorage) {
    return new LocalStorageAdapter();
  }
  
  // Memory fallback for any platform
  console.warn(`Using memory storage fallback for platform: ${platform}`);
  return new MemoryStorageAdapter();
}