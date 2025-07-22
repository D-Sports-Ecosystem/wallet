# Crypto Adapter

This module provides a cross-platform cryptographic adapter that works in browsers, Node.js, and React Native environments.

## Features

- Browser-compatible cryptographic operations using Web Crypto API
- Feature detection for Web Crypto API availability
- Fallback mechanisms for environments without Web Crypto API
- Unified interface for cryptographic operations across platforms

## Usage

### Basic Usage

```typescript
import { createCryptoAdapter } from './crypto-adapter';

async function example() {
  // Create a crypto adapter for the current platform
  const crypto = await createCryptoAdapter('web'); // or 'nextjs', 'react-native'
  
  // Generate random bytes
  const randomBytes = crypto.generateRandomBytes(32);
  console.log('Random bytes:', randomBytes);
  
  // Calculate SHA-256 hash
  const data = new TextEncoder().encode('Hello, world!');
  const hash = await crypto.sha256(data);
  console.log('SHA-256 hash:', hash);
}
```

### Feature Detection

```typescript
import { detectCryptoFeatures } from './crypto-adapter';

function checkFeatures() {
  const features = detectCryptoFeatures();
  
  if (features.hasWebCrypto) {
    console.log('Web Crypto API is available');
  } else {
    console.log('Web Crypto API is not available, using fallback');
  }
}
```

### Using Specific Implementations

```typescript
import { 
  createWebCryptoAdapter, 
  createFallbackCryptoAdapter 
} from './crypto-adapter';

// Use Web Crypto API directly (if available)
const webCrypto = createWebCryptoAdapter();

// Use fallback implementation (not secure for production)
const fallbackCrypto = createFallbackCryptoAdapter();
```

## API Reference

### `createCryptoAdapter(platform, options)`

Creates a crypto adapter for the specified platform with optional configuration.

- **Parameters**:
  - `platform`: `'web' | 'nextjs' | 'react-native'` - The target platform
  - `options`: (optional)
    - `useInsecureCrypto`: `boolean` - Force using the insecure fallback implementation

- **Returns**: `Promise<CryptoAdapter>` - A crypto adapter instance

### `detectCryptoFeatures()`

Detects available cryptographic features in the current environment.

- **Returns**: Object with the following properties:
  - `hasWebCrypto`: `boolean` - Whether Web Crypto API is available
  - `hasNodeCrypto`: `boolean` - Whether Node.js crypto module is available

### `createWebCryptoAdapter()`

Creates a crypto adapter that uses the Web Crypto API.

- **Returns**: `CryptoAdapter` - A crypto adapter instance

### `createFallbackCryptoAdapter()`

Creates a fallback crypto adapter that works in any environment (not secure for production).

- **Returns**: `CryptoAdapter` - A crypto adapter instance

## Interface

```typescript
interface CryptoAdapter {
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
```

## Security Considerations

- The fallback implementation is not cryptographically secure and should only be used for development or testing.
- For production use, ensure that either Web Crypto API or Node.js crypto module is available.
- When using in a browser environment, make sure to serve your application over HTTPS, as some browsers restrict Web Crypto API to secure contexts.