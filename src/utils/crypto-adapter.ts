/**
 * Cross-platform crypto adapter
 * Provides a unified interface for cryptographic operations across different platforms
 */

import { Platform } from '../types';

/**
 * Interface for cryptographic operations
 */
export interface CryptoAdapter {
  /**
   * Generate random bytes
   * @param size Number of bytes to generate
   * @returns Uint8Array of random bytes
   */
  getRandomValues(size: number): Uint8Array;
  
  /**
   * Generate a random UUID
   * @returns A random UUID string
   */
  randomUUID(): string;
}

/**
 * Browser-based crypto adapter using Web Crypto API
 */
export class BrowserCryptoAdapter implements CryptoAdapter {
  getRandomValues(size: number): Uint8Array {
    const array = new Uint8Array(size);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array);
    } else if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(array);
    } else {
      throw new Error('Web Crypto API is not available');
    }
    return array;
  }
  
  randomUUID(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    } else if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    } else {
      // Fallback implementation for browsers without randomUUID
      const bytes = this.getRandomValues(16);
      // Set version (4) and variant (RFC4122)
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      
      // Convert to hex string with proper UUID format
      return [
        bytes.slice(0, 4).reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), ''),
        bytes.slice(4, 6).reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), ''),
        bytes.slice(6, 8).reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), ''),
        bytes.slice(8, 10).reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), ''),
        bytes.slice(10, 16).reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), ''),
      ].join('-');
    }
  }
}

/**
 * Node.js crypto adapter
 * This will be dynamically imported only in Node.js environments
 */
export class NodeCryptoAdapter implements CryptoAdapter {
  private nodeCrypto: any;
  
  constructor(nodeCrypto: any) {
    this.nodeCrypto = nodeCrypto;
  }
  
  getRandomValues(size: number): Uint8Array {
    const buffer = this.nodeCrypto.randomBytes(size);
    return new Uint8Array(buffer);
  }
  
  randomUUID(): string {
    return this.nodeCrypto.randomUUID();
  }
}

/**
 * Memory-based fallback crypto adapter
 * WARNING: This is NOT cryptographically secure and should only be used as a last resort
 */
export class FallbackCryptoAdapter implements CryptoAdapter {
  getRandomValues(size: number): Uint8Array {
    console.warn('Using insecure random number generator');
    const array = new Uint8Array(size);
    for (let i = 0; i < size; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  }
  
  randomUUID(): string {
    console.warn('Using insecure UUID generator');
    const bytes = this.getRandomValues(16);
    // Set version (4) and variant (RFC4122)
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    
    // Convert to hex string with proper UUID format
    return [
      bytes.slice(0, 4).reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), ''),
      bytes.slice(4, 6).reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), ''),
      bytes.slice(6, 8).reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), ''),
      bytes.slice(8, 10).reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), ''),
      bytes.slice(10, 16).reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), ''),
    ].join('-');
  }
}

/**
 * Create a crypto adapter based on the platform
 */
export async function createCryptoAdapter(platform: Platform): Promise<CryptoAdapter> {
  // Try browser crypto first
  try {
    return new BrowserCryptoAdapter();
  } catch (error) {
    console.warn('Browser crypto not available:', error);
  }
  
  // Try Node.js crypto if not in browser
  if (platform === 'nextjs' && typeof window === 'undefined' && typeof process !== 'undefined') {
    try {
      // Only try to import crypto in a server-side Node.js environment
      // This import will be excluded from browser bundles by Rollup
      if (process.versions && process.versions.node) {
        const nodeCrypto = await import(/* webpackIgnore: true */ 'crypto').catch(() => null);
        if (nodeCrypto) {
          return new NodeCryptoAdapter(nodeCrypto);
        }
      }
    } catch (error) {
      console.warn('Node.js crypto not available:', error);
    }
  }
  
  // Fallback to insecure implementation
  console.warn('Using fallback (insecure) crypto implementation');
  return new FallbackCryptoAdapter();
}

// Singleton instance
let cryptoAdapter: CryptoAdapter | null = null;

/**
 * Get the crypto adapter instance
 */
export async function getCryptoAdapter(platform: Platform): Promise<CryptoAdapter> {
  if (!cryptoAdapter) {
    cryptoAdapter = await createCryptoAdapter(platform);
  }
  return cryptoAdapter;
}