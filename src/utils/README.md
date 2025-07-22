# Platform Adapters

This directory contains platform adapter implementations for different environments (web, Next.js, React Native).

## Platform Adapter Factory Pattern

The platform adapter factory pattern is used to create platform-specific adapters at runtime, using dynamic imports to ensure that Node.js modules are not bundled in browser builds.

### Usage

```typescript
import { getDefaultPlatformAdapterAsync } from './platform-adapters';

async function myFunction() {
  // Get the default platform adapter for the current environment
  const adapter = await getDefaultPlatformAdapterAsync();
  
  // Use the adapter
  const data = await adapter.storage.getItem('my-key');
  
  // Generate random bytes
  const randomBytes = adapter.crypto.generateRandomBytes(32);
  
  // Make network requests
  const response = await adapter.network.fetch('https://api.example.com/data');
}
```

### Creating Custom Adapters

You can also create custom adapters for specific use cases:

```typescript
import { createCustomPlatformAdapter } from './platform-adapter-factory';

async function myFunction() {
  // Create a custom adapter for a specific platform
  const adapter = await createCustomPlatformAdapter('web', {
    useMemoryStorage: true,
    useInsecureCrypto: false
  });
  
  // Use the adapter
  // ...
}
```

### Legacy Synchronous Adapters

For backward compatibility, synchronous adapters are still available, but they are deprecated and will be removed in a future version:

```typescript
import { webPlatformAdapter, nextjsPlatformAdapter, reactNativePlatformAdapter } from './platform-adapters';

// Use synchronous adapters (not recommended)
const data = await webPlatformAdapter.storage.getItem('my-key');
```

## Platform Detection

The platform adapter factory uses runtime platform detection to determine the current environment:

- `web`: Browser environment
- `nextjs`: Next.js environment (client or server)
- `react-native`: React Native environment

## Feature Detection

The platform adapter factory also uses feature detection to determine which APIs are available:

- `hasLocalStorage`: Whether localStorage is available
- `hasWebCrypto`: Whether Web Crypto API is available
- `hasAsyncStorage`: Whether React Native AsyncStorage is available
- `hasNodeCrypto`: Whether Node.js crypto module is available
- `hasNodeFs`: Whether Node.js fs module is available
- `hasNodeFetch`: Whether node-fetch module is available

## Fallback Implementations

The platform adapter factory provides fallback implementations for missing features:

- Storage: Falls back to memory storage if localStorage or AsyncStorage is not available
- Crypto: Falls back to a basic implementation if Web Crypto API or Node.js crypto is not available

## Browser-Compatible Crypto Adapter

The SDK now includes a browser-compatible crypto adapter that works across all platforms:

```typescript
import { createCryptoAdapter } from './crypto-adapter';

// Create a crypto adapter for the current platform
const crypto = await createCryptoAdapter('web'); // or 'nextjs', 'react-native'

// Generate random bytes
const randomBytes = crypto.generateRandomBytes(32);

// Calculate SHA-256 hash
const hash = await crypto.sha256(data);
```

See [crypto-adapter.md](./crypto-adapter.md) for detailed documentation.
- Network: Falls back to an error-throwing implementation if fetch is not available