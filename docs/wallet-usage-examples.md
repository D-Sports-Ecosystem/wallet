# D-Sports Wallet Usage Patterns

This document provides examples of common usage patterns for the D-Sports wallet system.

## Basic Wallet Setup and Connection

```typescript
import { DSportsWallet } from './wallet';
import { WebPlatformAdapter } from '../utils/platform-adapters';
import { RainbowKitConnector } from '../connectors/rainbow-kit';
import { WagmiConnector } from '../connectors/wagmi';

// Create a platform adapter for the current environment
const adapter = new WebPlatformAdapter();

// Create a wallet instance with configuration
const wallet = new DSportsWallet({
  appName: 'D-Sports App',
  chainId: 1, // Ethereum Mainnet
  supportedChainIds: [1, 137, 56], // Ethereum, Polygon, BSC
}, adapter);

// Add wallet connectors
wallet.addConnector(new RainbowKitConnector());
wallet.addConnector(new WagmiConnector());

// Connect to a wallet
async function connectWallet() {
  try {
    const account = await wallet.connect('rainbow-kit');
    console.log(`Connected to wallet: ${account.address}`);
    return account;
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    throw error;
  }
}

// Disconnect from a wallet
async function disconnectWallet() {
  try {
    await wallet.disconnect();
    console.log('Wallet disconnected');
  } catch (error) {
    console.error('Failed to disconnect wallet:', error);
    throw error;
  }
}
```

## Event Handling

```typescript
// Set up event listeners
wallet.on('connect', (account) => {
  console.log(`Wallet connected: ${account.address}`);
  console.log(`Chain ID: ${account.chainId}`);
});

wallet.on('disconnect', () => {
  console.log('Wallet disconnected');
});

wallet.on('chainChanged', (chainId) => {
  console.log(`Chain changed to: ${chainId}`);
});

wallet.on('accountsChanged', (accounts) => {
  console.log(`Account changed to: ${accounts[0]}`);
});

wallet.on('error', (error) => {
  console.error('Wallet error:', error.message);
});
```

## Chain Switching

```typescript
// Switch to a different blockchain network
async function switchChain(chainId: number) {
  try {
    await wallet.switchChain(chainId);
    console.log(`Switched to chain ID: ${chainId}`);
  } catch (error) {
    console.error('Failed to switch chain:', error);
    throw error;
  }
}

// Example: Switch to Polygon (chain ID 137)
switchChain(137);
```

## State Management

```typescript
// Get the current wallet state
function getWalletState() {
  const state = wallet.getState();
  console.log('Wallet state:', state);
  
  if (state.isConnecting) {
    console.log('Wallet is connecting...');
  } else if (state.isDisconnected) {
    console.log('No wallet connected');
  } else {
    console.log(`Connected to wallet: ${state.account?.address}`);
    console.log(`Chain ID: ${state.account?.chainId}`);
  }
  
  return state;
}

// Check if a wallet is connected
function checkConnection() {
  const isConnected = wallet.isConnected();
  console.log(`Wallet connected: ${isConnected}`);
  
  if (isConnected) {
    const account = wallet.getAccount();
    console.log(`Address: ${account?.address}`);
  }
  
  return isConnected;
}
```

## Integration with Zustand Store

```typescript
import { useWalletStore } from './stores/wallet-store';

// Add a wallet to the store
function addWalletToStore(address: string, label?: string) {
  useWalletStore.getState().addWallet({
    address,
    label,
    color: '#ff5500', // Optional color
    icon: '💼', // Optional icon
  });
}

// Remove a wallet from the store
function removeWalletFromStore(address: string) {
  useWalletStore.getState().removeWallet(address);
}

// Update wallet metadata
function updateWalletMetadata(address: string, label: string, color: string, icon: string) {
  useWalletStore.getState().updateWalletMeta(address, {
    label,
    color,
    icon,
  });
}

// React component example
function WalletComponent() {
  const { address, wallets, addWallet, removeWallet } = useWalletStore();
  
  return (
    <div>
      <h2>Wallet Management</h2>
      <p>Active wallet: {address || 'None'}</p>
      <h3>Your Wallets ({wallets.length})</h3>
      <ul>
        {wallets.map((wallet) => (
          <li key={wallet.address}>
            {wallet.label || wallet.address.substring(0, 8) + '...'}
            <button onClick={() => removeWallet(wallet.address)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Error Handling

```typescript
// Connect with proper error handling
async function safeConnect(connectorId: string) {
  try {
    const account = await wallet.connect(connectorId);
    return account;
  } catch (error) {
    // Handle specific error types
    if (error.message.includes('User rejected')) {
      console.log('User rejected the connection request');
      // Handle user rejection
    } else if (error.message.includes('Chain not supported')) {
      console.log('Chain not supported, switching to supported chain');
      // Handle chain switching
    } else {
      console.error('Unknown error during connection:', error);
      // Handle generic errors
    }
    throw error;
  }
}
```

## Multi-Wallet Support

```typescript
// Connect multiple wallets sequentially
async function connectMultipleWallets() {
  const accounts = [];
  
  try {
    // Connect first wallet
    const account1 = await wallet.connect('rainbow-kit');
    accounts.push(account1);
    
    // Disconnect and connect second wallet
    await wallet.disconnect();
    const account2 = await wallet.connect('wagmi');
    accounts.push(account2);
    
    return accounts;
  } catch (error) {
    console.error('Failed to connect multiple wallets:', error);
    throw error;
  }
}

// Get all available connectors
function listAvailableConnectors() {
  const connectors = wallet.getConnectors();
  console.log(`Available connectors: ${connectors.length}`);
  
  connectors.forEach((connector) => {
    console.log(`- ${connector.id}: ${connector.name}`);
  });
  
  return connectors;
}
```

## Platform-Specific Adapters

```typescript
// Web platform
import { WebPlatformAdapter } from '../utils/platform-adapters';
const webAdapter = new WebPlatformAdapter();
const webWallet = new DSportsWallet(config, webAdapter);

// Next.js platform
import { NextPlatformAdapter } from '../utils/platform-adapters';
const nextAdapter = new NextPlatformAdapter();
const nextWallet = new DSportsWallet(config, nextAdapter);

// React Native platform
import { ReactNativePlatformAdapter } from '../utils/platform-adapters';
const rnAdapter = new ReactNativePlatformAdapter();
const rnWallet = new DSportsWallet(config, rnAdapter);
```

## Factory Pattern Usage

```typescript
import { createDSportsWallet } from './wallet-factory';

// Create a wallet with default settings
const wallet = createDSportsWallet({
  appName: 'D-Sports App',
});

// Create a wallet with quick start settings for development
import { createDSportsWalletQuickStart } from './wallet-factory';
const devWallet = createDSportsWalletQuickStart();
```

## Complete Application Example

```typescript
import { DSportsWallet } from './wallet';
import { WebPlatformAdapter } from '../utils/platform-adapters';
import { RainbowKitConnector } from '../connectors/rainbow-kit';
import { useWalletStore } from './stores/wallet-store';

// Initialize wallet
const adapter = new WebPlatformAdapter();
const wallet = new DSportsWallet({
  appName: 'D-Sports App',
  chainId: 1,
}, adapter);

// Add connectors
wallet.addConnector(new RainbowKitConnector());

// Set up event listeners
wallet.on('connect', (account) => {
  console.log(`Connected: ${account.address}`);
  // Add to wallet store
  useWalletStore.getState().addWallet({
    address: account.address,
    label: `Wallet ${useWalletStore.getState().wallets.length + 1}`,
  });
});

wallet.on('disconnect', () => {
  console.log('Disconnected');
  useWalletStore.getState().disconnectWallet();
});

// Connect function
async function connectWallet() {
  if (wallet.isConnected()) {
    console.log('Already connected');
    return wallet.getAccount();
  }
  
  try {
    return await wallet.connect('rainbow-kit');
  } catch (error) {
    console.error('Connection failed:', error);
    throw error;
  }
}

// Disconnect function
async function disconnectWallet() {
  if (!wallet.isConnected()) {
    console.log('Not connected');
    return;
  }
  
  try {
    await wallet.disconnect();
  } catch (error) {
    console.error('Disconnection failed:', error);
    throw error;
  }
}

// Export for use in application
export {
  wallet,
  connectWallet,
  disconnectWallet,
};
```