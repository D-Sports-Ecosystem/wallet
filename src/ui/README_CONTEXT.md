# Context-Driven Wallet UI Components

This directory contains both traditional prop-based components and new context-driven components that use the `WalletUIContext` for a cleaner, more maintainable architecture.

## Overview

The context-driven approach provides several benefits:

1. **Reduced Prop Drilling**: Components can access wallet state and functions directly from context
2. **Consistent State Management**: All components share the same wallet state through context
3. **Simplified Component APIs**: Components need fewer props as they get data from context
4. **Better Separation of Concerns**: Business logic is centralized in the context provider

## Core Interface

The new `WalletUIContextProps` interface provides:

```typescript
interface WalletUIContextProps {
  walletStore: ReturnType<typeof useWalletStore>;
  session?: { id: string } | null;
  createUserWallet?: (args: {...}) => Promise<void>;
  fetchInventory?: () => Promise<InventoryItem[]>;
}
```

### WalletStore

The `walletStore` provides wallet functionality equivalent to a `useWalletStore` hook:

```typescript
interface WalletStoreType {
  isConnected: boolean;
  isConnecting: boolean;
  account?: WalletAccount;
  state: WalletState;
  connect: (connectorId: string, config?: any) => Promise<WalletAccount>;
  disconnect: () => Promise<void>;
  switchChain: (chainId: number) => Promise<void>;
  error?: Error;
}
```

### Session

Simple session interface with user ID:

```typescript
session?: { id: string } | null;
```

### Functions

- `createUserWallet`: Custom wallet creation function for app-specific logic
- `fetchInventory`: Function to fetch game inventory items

## Components

### Context-Driven Components

These components use the context instead of requiring props:

- `ContextDrivenDashboard` - Full wallet dashboard using context
- `ContextDrivenTokenTab` - Token list component using context

### Traditional Components

Existing prop-based components are still available:

- `Dashboard` - Original prop-based dashboard
- `TokenTab` - Original prop-based token tab
- All other existing components

## Usage

### Basic Setup

```tsx
import { 
  WalletUIProvider, 
  ContextDrivenDashboard,
  useWalletUIContext 
} from '@d-sports/wallet/ui';

// Create your wallet instance
const wallet = createDSportsWallet(config);

// Implement your custom functions
const createUserWallet = async (args) => {
  // Your wallet creation logic
  console.log('Creating wallet with', args);
};

const fetchInventory = async () => {
  // Your inventory fetching logic
  const response = await fetch('/api/inventory');
  return response.json();
};

// Wrap your app with the provider
function App() {
  return (
    <WalletUIProvider
      wallet={wallet}
      session={{ user: { id: 'user-123' } }}
      createUserWallet={createUserWallet}
      fetchInventory={fetchInventory}
    >
      {/* Use context-driven components */}
      <ContextDrivenDashboard />
    </WalletUIProvider>
  );
}
```

### Using the Context Hook

```tsx
import { useWalletUIContext } from '@d-sports/wallet/ui';

function MyComponent() {
  const { walletStore, session, createUserWallet, fetchInventory } = useWalletUIContext();

  const handleConnect = async () => {
    await walletStore.connect('dsports-wallet');
  };

  const handleCreateWallet = async () => {
    if (createUserWallet) {
      await createUserWallet({ method: 'social', provider: 'google' });
    }
  };

  return (
    <div>
      <p>Connected: {walletStore.isConnected ? 'Yes' : 'No'}</p>
      <p>User: {session?.id}</p>
      <button onClick={handleConnect}>Connect</button>
      <button onClick={handleCreateWallet}>Create Wallet</button>
    </div>
  );
}
```

### Custom Data Providers

You can provide custom implementations for data fetching:

```tsx
<WalletUIProvider
  wallet={wallet}
  fetchTokens={async () => {
    // Custom token fetching logic
    const response = await fetch('/api/tokens');
    return response.json();
  }}
  fetchNFTs={async () => {
    // Custom NFT fetching logic
    const response = await fetch('/api/nfts');
    return response.json();
  }}
  fetchInventory={async () => {
    // Custom inventory fetching logic
    const response = await fetch('/api/inventory');
    return response.json();
  }}
>
  <ContextDrivenDashboard />
</WalletUIProvider>
```

## Migration Guide

### From Prop-Based to Context-Driven

**Before (Prop-based):**
```tsx
<Dashboard
  session={session}
  onCreateWallet={handleCreateWallet}
  onImportWallet={handleImportWallet}
  fetchTokens={fetchTokens}
  fetchNFTs={fetchNFTs}
  fetchInventory={fetchInventory}
  theme={theme}
/>
```

**After (Context-driven):**
```tsx
<WalletUIProvider
  wallet={wallet}
  session={session}
  createUserWallet={handleCreateWallet}
  fetchTokens={fetchTokens}
  fetchNFTs={fetchNFTs}
  fetchInventory={fetchInventory}
  theme={theme}
>
  <ContextDrivenDashboard />
</WalletUIProvider>
```

### Accessing Context in Custom Components

```tsx
function CustomWalletButton() {
  const { walletStore } = useWalletUIContext();

  if (walletStore.isConnected) {
    return <button onClick={walletStore.disconnect}>Disconnect</button>;
  }

  return <button onClick={() => walletStore.connect('dsports-wallet')}>Connect</button>;
}
```

## Examples

See `src/ui/examples/ContextExample.tsx` for a complete working example that demonstrates:

- Setting up the provider with custom functions
- Using context-driven components
- Creating custom components that use the context
- Implementing `createUserWallet` and `fetchInventory`

## Benefits of the Context Approach

1. **Cleaner Component APIs**: Components don't need to pass through many props
2. **Centralized State**: All wallet state is managed in one place
3. **Better Testing**: Mock the context provider instead of individual props
4. **Consistent Experience**: All components automatically stay in sync
5. **Easier Maintenance**: Changes to wallet logic only need to be made in one place

## Compatibility

- Context-driven components work alongside existing prop-based components
- You can gradually migrate to the context approach
- All existing APIs remain unchanged for backward compatibility
