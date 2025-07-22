import { PlatformAdapter, Platform } from '../types';

/**
 * Platform detection utilities
 */
export function detectPlatform(): Platform {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // Check if we're in Next.js
    if (typeof (window as any).__NEXT_DATA__ !== 'undefined') {
      return 'nextjs';
    }
    return 'web';
  }
  
  // Check if we're in React Native
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return 'react-native';
  }
  
  // Default to Next.js for server-side (most likely a Next.js server)
  return 'nextjs';
}

/**
 * Feature detection utilities
 */
export interface PlatformFeatures {
  hasLocalStorage: boolean;
  hasWebCrypto: boolean;
  hasAsyncStorage: boolean;
  hasNodeCrypto: boolean;
  hasNodeFs: boolean;
  hasNodeFetch: boolean;
}

export async function detectFeatures(): Promise<PlatformFeatures> {
  const features: PlatformFeatures = {
    hasLocalStorage: false,
    hasWebCrypto: false,
    hasAsyncStorage: false,
    hasNodeCrypto: false,
    hasNodeFs: false,
    hasNodeFetch: false,
  };
  
  // Browser features
  if (typeof window !== 'undefined') {
    // Check for localStorage
    try {
      features.hasLocalStorage = window.localStorage !== undefined;
    } catch {
      features.hasLocalStorage = false;
    }
    
    // Check for Web Crypto API
    try {
      features.hasWebCrypto = window.crypto !== undefined && 
                             window.crypto.subtle !== undefined;
    } catch {
      features.hasWebCrypto = false;
    }
  }
  
  // React Native features
  try {
    const AsyncStorage = await import('@react-native-async-storage/async-storage')
      .then(module => module.default)
      .catch(() => null);
    features.hasAsyncStorage = AsyncStorage !== null;
  } catch {
    features.hasAsyncStorage = false;
  }
  
  // Node.js features
  try {
    await import('crypto').then(() => {
      features.hasNodeCrypto = true;
    }).catch(() => {
      features.hasNodeCrypto = false;
    });
  } catch {
    features.hasNodeCrypto = false;
  }
  
  try {
    await import('fs').then(() => {
      features.hasNodeFs = true;
    }).catch(() => {
      features.hasNodeFs = false;
    });
  } catch {
    features.hasNodeFs = false;
  }
  
  try {
    await import('node-fetch').then(() => {
      features.hasNodeFetch = true;
    }).catch(() => {
      features.hasNodeFetch = false;
    });
  } catch {
    features.hasNodeFetch = false;
  }
  
  return features;
}

/**
 * Storage adapter implementations
 */
import { createStorageAdapter } from './storage-adapter';

async function createStorageAdapter(platform: Platform, features: PlatformFeatures) {
  // Use the new storage adapter factory
  return createStorageAdapter(platform);
}

/**
 * Crypto adapter implementations
 */
import { createCryptoAdapter as createCryptoAdapterImpl } from './crypto-adapter';

async function createCryptoAdapter(platform: Platform, features: PlatformFeatures) {
  return createCryptoAdapterImpl(platform, {
    useInsecureCrypto: !(features.hasWebCrypto || features.hasNodeCrypto)
  });
}

/**
 * Network adapter implementations
 */
import { createNetworkAdapter as createNetworkAdapterImpl } from './network-adapter';

async function createNetworkAdapter(platform: Platform, features: PlatformFeatures) {
  return createNetworkAdapterImpl(platform, {
    useInsecureFallback: false, // Set to true only for testing
    timeout: 30000 // Default timeout of 30 seconds
  });
}

/**
 * Create a platform adapter based on the current environment
 */
export async function createPlatformAdapter(): Promise<PlatformAdapter> {
  const platform = detectPlatform();
  const features = await detectFeatures();
  
  // Create adapters with fallbacks
  const storage = await createStorageAdapter(platform, features);
  const crypto = await createCryptoAdapter(platform, features);
  const network = await createNetworkAdapter(platform, features);
  
  return {
    platform,
    storage,
    crypto,
    network
  };
}

/**
 * Create a platform adapter with specific configuration
 */
export async function createCustomPlatformAdapter(
  customPlatform: Platform,
  options: {
    useMemoryStorage?: boolean;
    useInsecureCrypto?: boolean;
  } = {}
): Promise<PlatformAdapter> {
  const features = await detectFeatures();
  
  // Override features based on options
  if (options.useMemoryStorage) {
    features.hasLocalStorage = false;
    features.hasAsyncStorage = false;
  }
  
  if (options.useInsecureCrypto) {
    features.hasWebCrypto = false;
    features.hasNodeCrypto = false;
  }
  
  // Create adapters with fallbacks
  const storage = await createStorageAdapter(customPlatform, features);
  const crypto = await createCryptoAdapter(customPlatform, features);
  const network = await createNetworkAdapter(customPlatform, features);
  
  return {
    platform: customPlatform,
    storage,
    crypto,
    network
  };
}

// Singleton instance for common use
let defaultAdapter: PlatformAdapter | null = null;

/**
 * Get the default platform adapter (creates it if it doesn't exist)
 */
export async function getDefaultPlatformAdapter(): Promise<PlatformAdapter> {
  if (!defaultAdapter) {
    defaultAdapter = await createPlatformAdapter();
  }
  return defaultAdapter;
}