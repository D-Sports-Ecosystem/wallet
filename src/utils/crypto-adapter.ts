import { Platform } from '../types';

/**
 * Interface for crypto operations across different platforms
 */
export interface CryptoAdapter {
  /**
   * Generate cryptographically secure random bytes
   * @param size Number of bytes to generate
   * @returns Uint8Array containing random bytes
   */
  generateRandomBytes: (size: number) => Uint8Array;
  
  /**
   * Calculate SHA-256 hash of data
   * @param data Data to hash
   * @returns Promise resolving to Uint8Array containing hash
   */
  sha256: (data: Uint8Array) => Promise<Uint8Array>;
}

/**
 * Feature detection for crypto capabilities
 */
export function detectCryptoFeatures(): {
  hasWebCrypto: boolean;
  hasNodeCrypto: boolean;
} {
  const features = {
    hasWebCrypto: false,
    hasNodeCrypto: false
  };
  
  // Check for Web Crypto API
  if (typeof window !== 'undefined') {
    try {
      features.hasWebCrypto = window.crypto !== undefined && 
                             window.crypto.subtle !== undefined;
    } catch {
      features.hasWebCrypto = false;
    }
  }
  
  // We'll check for Node.js crypto at runtime when needed
  // This avoids bundling issues with the crypto module
  
  return features;
}

/**
 * Web Crypto API implementation
 */
export function createWebCryptoAdapter(): CryptoAdapter {
  return {
    generateRandomBytes: (size: number) => {
      const array = new Uint8Array(size);
      crypto.getRandomValues(array);
      return array;
    },
    sha256: async (data: Uint8Array) => {
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      return new Uint8Array(hashBuffer);
    }
  };
}

/**
 * Node.js crypto implementation (loaded dynamically)
 */
export async function createNodeCryptoAdapter(): Promise<CryptoAdapter | null> {
  try {
    // Dynamic import to avoid bundling issues
    const nodeCrypto = await import('crypto').catch(() => null);
    
    if (!nodeCrypto) {
      return null;
    }
    
    return {
      generateRandomBytes: (size: number) => {
        const buffer = nodeCrypto.randomBytes(size);
        return new Uint8Array(buffer);
      },
      sha256: async (data: Uint8Array) => {
        const hash = nodeCrypto.createHash('sha256');
        hash.update(Buffer.from(data));
        return new Uint8Array(hash.digest());
      }
    };
  } catch {
    return null;
  }
}

/**
 * Fallback implementation using basic algorithms
 * Note: This is NOT cryptographically secure and should only be used as a last resort
 */
export function createFallbackCryptoAdapter(): CryptoAdapter {
  console.warn('Using insecure crypto fallback - NOT RECOMMENDED FOR PRODUCTION');
  
  return {
    generateRandomBytes: (size: number) => {
      const array = new Uint8Array(size);
      for (let i = 0; i < size; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    },
    sha256: async (data: Uint8Array) => {
      // Simple non-cryptographic hash function
      // In a real implementation, you would use a JS SHA-256 implementation
      const hash = new Uint8Array(32); // SHA-256 is 32 bytes
      let h = 0;
      for (let i = 0; i < data.length; i++) {
        h = ((h << 5) - h) + data[i];
        h |= 0;
      }
      // Fill the hash with some derived values (NOT a real SHA-256)
      for (let i = 0; i < 32; i++) {
        hash[i] = (h + i * 16) & 0xFF;
      }
      return hash;
    }
  };
}

/**
 * Create the appropriate crypto adapter based on platform and available features
 */
export async function createCryptoAdapter(
  platform: Platform,
  options: {
    useInsecureCrypto?: boolean;
  } = {}
): Promise<CryptoAdapter> {
  // If insecure crypto is explicitly requested, use the fallback
  if (options.useInsecureCrypto) {
    return createFallbackCryptoAdapter();
  }
  
  const features = detectCryptoFeatures();
  
  // For web and Next.js, prefer Web Crypto API
  if ((platform === 'web' || platform === 'nextjs') && features.hasWebCrypto) {
    return createWebCryptoAdapter();
  }
  
  // For Node.js or Next.js server-side, try Node.js crypto
  if (platform === 'nextjs' || typeof window === 'undefined') {
    const nodeCryptoAdapter = await createNodeCryptoAdapter();
    if (nodeCryptoAdapter) {
      return nodeCryptoAdapter;
    }
  }
  
  // For React Native, we could add a React Native specific implementation here
  // For now, we'll use Web Crypto if available, or fallback
  
  // If Web Crypto is available as a fallback for any platform, use it
  if (features.hasWebCrypto) {
    return createWebCryptoAdapter();
  }
  
  // Last resort: use the insecure fallback
  return createFallbackCryptoAdapter();
}