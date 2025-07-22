import { PlatformAdapter, Platform } from "../types";

/**
 * Platform detection utilities
 */
export function detectPlatform(): Platform {
  // Check if we're in a browser environment
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    // Check if we're in Next.js
    if (typeof (window as any).__NEXT_DATA__ !== "undefined") {
      return "nextjs";
    }
    return "web";
  }

  // Check if we're in React Native
  // Use a safer check that doesn't rely on deprecated navigator.product
  if (
    typeof global !== "undefined" &&
    ((global as any).__REACT_NATIVE_MAJOR_VERSION ||
      (global as any).ReactNative ||
      (typeof navigator !== "undefined" &&
        // The following is deprecated but kept for backward compatibility
        (navigator as any).product === "ReactNative"))
  ) {
    return "react-native";
  }

  // Default to Next.js for server-side (most likely a Next.js server)
  return "nextjs";
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
  if (typeof window !== "undefined") {
    // Check for localStorage
    try {
      features.hasLocalStorage = window.localStorage !== undefined;
    } catch {
      features.hasLocalStorage = false;
    }

    // Check for Web Crypto API
    try {
      features.hasWebCrypto =
        window.crypto !== undefined && window.crypto.subtle !== undefined;
    } catch {
      features.hasWebCrypto = false;
    }
  }

  // React Native features
  try {
    // Use dynamic import with a variable to prevent direct static analysis
    const storageModuleName = "@react-native-" + "async-storage/async-storage";

    try {
      const AsyncStorage = await import(
        /* webpackIgnore: true */ storageModuleName
      )
        .then((module) => module.default)
        .catch(() => null);
      features.hasAsyncStorage = AsyncStorage !== null;
    } catch {
      features.hasAsyncStorage = false;
    }
  } catch {
    features.hasAsyncStorage = false;
  }

  // Node.js features
  if (typeof window === "undefined") {
    try {
      // Only try to import crypto in a Node.js environment
      await import("crypto")
        .then(() => {
          features.hasNodeCrypto = true;
        })
        .catch(() => {
          features.hasNodeCrypto = false;
        });
    } catch {
      features.hasNodeCrypto = false;
    }

    try {
      // Only try to import fs in a Node.js environment
      await import("fs")
        .then(() => {
          features.hasNodeFs = true;
        })
        .catch(() => {
          features.hasNodeFs = false;
        });
    } catch {
      features.hasNodeFs = false;
    }
  } else {
    features.hasNodeCrypto = false;
    features.hasNodeFs = false;
  }

  try {
    await import("node-fetch")
      .then(() => {
        features.hasNodeFetch = true;
      })
      .catch(() => {
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
import { createStorageAdapter as createStorageAdapterImpl } from "./storage-adapter";

async function createStorageAdapterWithFeatures(
  platform: Platform,
  features: PlatformFeatures
) {
  // Use the storage adapter factory with appropriate options based on detected features
  return createStorageAdapterImpl(platform);
}

/**
 * Crypto adapter implementations
 */
import { createCryptoAdapter as createCryptoAdapterImpl, CryptoAdapter } from "./crypto-adapter";

// Wrapper class to adapt CryptoAdapter to PlatformAdapter.crypto interface
class PlatformCryptoAdapter {
  private adapter: CryptoAdapter;
  
  constructor(adapter: CryptoAdapter) {
    this.adapter = adapter;
  }
  
  generateRandomBytes(size: number): Uint8Array {
    return this.adapter.getRandomValues(size);
  }
  
  async sha256(data: Uint8Array): Promise<Uint8Array> {
    // Use Web Crypto API if available
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      try {
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
        return new Uint8Array(hashBuffer);
      } catch (error) {
        console.warn('Web Crypto subtle digest failed:', error);
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
}

async function createCryptoAdapter(
  platform: Platform,
  features: PlatformFeatures
) {
  // Pass platform to the crypto adapter factory
  const cryptoAdapter = await createCryptoAdapterImpl(platform);
  return new PlatformCryptoAdapter(cryptoAdapter);
}

/**
 * Network adapter implementations
 */
import { createNetworkAdapter as createNetworkAdapterImpl } from "./network-adapter";

async function createNetworkAdapter(
  platform: Platform,
  features: PlatformFeatures
) {
  // Pass platform to the network adapter factory
  return createNetworkAdapterImpl(platform);
}

/**
 * Create a platform adapter based on the current environment
 */
export async function createPlatformAdapter(): Promise<PlatformAdapter> {
  const platform = detectPlatform();
  const features = await detectFeatures();

  // Create adapters with fallbacks
  const storage = await createStorageAdapterWithFeatures(platform, features);
  const crypto = await createCryptoAdapter(platform, features);
  const network = await createNetworkAdapter(platform, features);

  return {
    platform,
    storage,
    crypto,
    network,
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
  const storage = await createStorageAdapterWithFeatures(
    customPlatform,
    features
  );
  const crypto = await createCryptoAdapter(customPlatform, features);
  const network = await createNetworkAdapter(customPlatform, features);

  return {
    platform: customPlatform,
    storage,
    crypto,
    network,
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
