# Network Adapter

The Network Adapter provides a unified interface for making network requests across different platforms (browser, Node.js, and React Native).

## Features

- Platform-agnostic network interface
- Automatic detection of available fetch implementations
- Polyfill support for older browsers
- Proper error handling for network failures
- Timeout support for all network requests
- Network availability detection

## Usage

### Basic Usage

```typescript
import { createNetworkAdapter } from './network-adapter';

async function fetchData() {
  // Create a network adapter for the current platform
  const adapter = await createNetworkAdapter('web');
  
  // Use the adapter to make network requests
  const response = await adapter.fetch('https://api.example.com/data');
  const data = await response.json();
  
  // Check if network is available
  const isNetworkAvailable = await adapter.isNetworkAvailable();
  
  return data;
}
```

### With Options

```typescript
import { createNetworkAdapter } from './network-adapter';

async function fetchWithOptions() {
  // Create a network adapter with custom options
  const adapter = await createNetworkAdapter('web', {
    timeout: 5000, // 5 second timeout
    useInsecureFallback: false // Don't use fallback if fetch is not available
  });
  
  // Make a POST request with headers
  const response = await adapter.fetch('https://api.example.com/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ key: 'value' })
  });
  
  return response.json();
}
```

### With Custom Fetch Implementation

```typescript
import { createNetworkAdapter } from './network-adapter';

async function fetchWithCustomImplementation() {
  // Create a network adapter with a custom fetch implementation
  const adapter = await createNetworkAdapter('web', {
    customFetch: myCustomFetchFunction
  });
  
  // Use the adapter with the custom implementation
  const response = await adapter.fetch('https://api.example.com/data');
  
  return response.json();
}
```

## Platform Support

### Browser

In browser environments, the adapter uses the native `fetch` API. For older browsers that don't support `fetch`, it attempts to load the `whatwg-fetch` polyfill if available.

### Node.js

In Node.js environments, the adapter uses the `node-fetch` package. This is dynamically imported to ensure it's not included in browser bundles.

### React Native

In React Native environments, the adapter uses the global `fetch` function provided by React Native.

## Error Handling

The adapter provides improved error handling compared to the native `fetch` API:

- Timeout errors are properly detected and reported
- Network connectivity issues are clearly identified
- Appropriate error messages are provided for different failure scenarios

## Network Availability Detection

The `isNetworkAvailable` method allows you to check if the network is available before making requests:

```typescript
const adapter = await createNetworkAdapter('web');
const isAvailable = await adapter.isNetworkAvailable();

if (isAvailable) {
  // Make network requests
} else {
  // Handle offline scenario
}
```