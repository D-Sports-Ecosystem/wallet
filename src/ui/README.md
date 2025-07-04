# D-Sports Wallet UI Components

A comprehensive set of reusable React components for building wallet interfaces that work seamlessly across web, Next.js, and React Native platforms.

## 📦 Installation

```bash
npm install @d-sports/wallet
```

### Peer Dependencies

Install the required peer dependencies based on your platform:

**For Web/Next.js:**
```bash
npm install react react-dom tailwindcss
```

**For React Native:**
```bash
npm install react react-native react-native-keychain react-native-url-polyfill
```

### Tailwind CSS Setup

Add the package's paths to your `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@d-sports/wallet/dist/**/*.{js,ts,jsx,tsx}', // Add this line
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 🚀 Quick Start

### Basic Setup with WalletUIProvider + WalletDashboard

```tsx
import { WalletUIProvider, WalletDashboard } from '@d-sports/wallet';
import { createDSportsWallet } from '@d-sports/wallet/nextjs'; // or '/react-native'

// Create wallet instance
const wallet = createDSportsWallet({
  projectId: 'your-project-id',
  chains: [1, 137], // Ethereum, Polygon
});

// Sample user session
const userSession = {
  user: { id: 'user123', email: 'user@example.com' },
  wallet: { address: '0x...', isConnected: true }
};

function App() {
  return (
    <WalletUIProvider 
      wallet={wallet}
      session={userSession}
      fetchTokens={async () => {
        // Your token fetching logic
        const response = await fetch('/api/tokens');
        return response.json();
      }}
      fetchNFTs={async () => {
        // Your NFT fetching logic
        const response = await fetch('/api/nfts');
        return response.json();
      }}
      fetchInventory={async () => {
        // Your inventory fetching logic
        const response = await fetch('/api/inventory');
        return response.json();
      }}
    >
      <WalletDashboard />
    </WalletUIProvider>
  );
}
```

## 🏗️ Architecture

The UI component library is designed with dependency injection in mind, allowing host applications to provide their own implementations while offering sensible defaults.

### Key Principles

- **Platform Agnostic**: Components don't import Next.js or platform-specific modules
- **Dependency Injection**: All external dependencies are injected through props or context
- **Theme Support**: Comprehensive theming system for consistent branding
- **Accessibility**: Built with accessibility best practices
- **Performance**: Optimized with animations and lazy loading
- **Tree Shaking**: Icon libraries (`@radix-ui/react-icons`, `lucide-react`) are tree-shakeable - only imported icons will be included in your bundle

## 📦 Components

### Core Components

#### `Dashboard`
The main wallet dashboard component that orchestrates all other components.

```tsx
import { Dashboard, WalletUIProvider } from '@d-sports/wallet';

<WalletUIProvider 
  wallet={dsportsWallet}
  session={userSession}
  fetchTokens={fetchTokensFromAPI}
  fetchNFTs={fetchNFTsFromAPI}
  fetchInventory={fetchInventoryFromAPI}
>
  <Dashboard />
</WalletUIProvider>
```

#### `WalletOverviewCard`
Displays wallet overview with balance, user info, and quick stats.

#### `TokenTab`, `CollectiblesTab`, `InventoryTab`
Individual tab components for displaying different asset types.

#### `CreateWalletFlow`, `ImportWalletFlow`
Multi-step flows for wallet creation and import.

### Atomic Components

#### `AnimatedContainer`
Provides smooth animations for component transitions.

```tsx
<AnimatedContainer variant="fade" duration={300}>
  <YourContent />
</AnimatedContainer>
```

#### `LoadingState`
Flexible loading component with multiple variants.

```tsx
<LoadingState variant="spinner" size="large" text="Loading..." />
```

#### `EmptyState`
User-friendly empty state with customizable actions.

```tsx
<EmptyState
  title="No Items Found"
  description="Try adding some items"
  action={{ label: "Add Item", onClick: handleAdd }}
/>
```

#### `Modal`
Full-featured modal component with keyboard support.

```tsx
<Modal isOpen={isOpen} onClose={onClose} title="Modal Title">
  <ModalContent />
</Modal>
```

## 🎨 Theming

Components support comprehensive theming through the `WalletTheme` interface:

```tsx
const customTheme = {
  colors: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    background: '#F7F9FC',
    text: '#2D3748',
    border: '#E2E8F0',
  },
  borderRadius: 12,
  fontFamily: 'Inter, sans-serif',
};

<WalletUIProvider theme={customTheme}>
  <Dashboard />
</WalletUIProvider>
```

## 🔌 Dependency Injection

The `WalletUIProvider` accepts various function props to handle external operations:

```tsx
<WalletUIProvider
  wallet={dsportsWallet}
  session={userSession}
  theme={customTheme}
  
  // Data fetching functions
  fetchTokens={async () => {
    const response = await fetch('/api/tokens');
    return response.json();
  }}
  
  fetchNFTs={async () => {
    const response = await fetch('/api/nfts');
    return response.json();
  }}
  
  fetchInventory={async () => {
    const response = await fetch('/api/inventory');
    return response.json();
  }}
  
  // Wallet operations
  createWallet={async (config) => {
    // Custom wallet creation logic
  }}
  
  importWallet={async (config) => {
    // Custom wallet import logic
  }}
  
  // UI feedback
  showToast={(props) => {
    // Custom toast implementation
    toast.show(props.message, { type: props.type });
  }}
  
  showModal={(content, props) => {
    // Custom modal implementation
    modalService.show(content, props);
  }}
>
  <Dashboard />
</WalletUIProvider>
```

## 🪝 Overriding Hooks

The library provides injectable hooks that can be completely customized to fit your application's architecture. This allows you to integrate your own authentication, navigation, server actions, platform features, and wallet operations.

### Available Hooks

- **`useAuth`**: Authentication and session management
- **`useNavigation`**: Routing and navigation
- **`useServerActions`**: API calls and server-side operations
- **`usePlatform`**: Platform-specific features (clipboard, notifications, etc.)
- **`useWalletActions`**: Wallet-specific operations

### Hook Configuration

You can configure hooks by passing config objects:

```tsx
<WalletUIProvider
  wallet={wallet}
  // Configure existing hooks
  authConfig={{
    autoRefresh: true,
    onSessionChange: (session) => console.log('Session changed:', session)
  }}
  serverActionsConfig={{
    baseURL: 'https://api.yourdomain.com',
    defaultHeaders: { 'Authorization': `Bearer ${token}` },
    timeout: 10000
  }}
  platformConfig={{
    fallbackToMock: true,
    onFeatureUnavailable: (feature) => console.warn(`${feature} not available`)
  }}
>
  <WalletDashboard />
</WalletUIProvider>
```

### Complete Hook Override

For complete control, you can replace the default hook implementations:

```tsx
import { 
  WalletUIProvider, 
  WalletDashboard,
  type AuthHookConfig,
  type ServerActionsHookConfig 
} from '@d-sports/wallet';

// Custom auth hook implementation
const useCustomAuth = (config: AuthHookConfig) => {
  const [session, setSession] = useState(null);
  
  return {
    session,
    signIn: async (credentials) => {
      // Your custom sign-in logic
      const response = await myAuthService.signIn(credentials);
      setSession(response.session);
      return response.session;
    },
    signOut: async () => {
      // Your custom sign-out logic
      await myAuthService.signOut();
      setSession(null);
    },
    signUp: async (userData) => {
      // Your custom sign-up logic
      const response = await myAuthService.signUp(userData);
      setSession(response.session);
      return response.session;
    },
    refreshSession: async () => {
      // Your custom session refresh logic
      const response = await myAuthService.refreshSession();
      setSession(response.session);
      return response.session;
    }
  };
};

// Custom server actions hook
const useCustomServerActions = (config: ServerActionsHookConfig) => {
  return {
    createWallet: async (walletConfig) => {
      return await myApiService.createWallet(walletConfig);
    },
    importWallet: async (importConfig) => {
      return await myApiService.importWallet(importConfig);
    },
    fetchTokens: async (walletAddress) => {
      return await myApiService.getTokenBalances(walletAddress);
    },
    fetchNFTs: async (walletAddress) => {
      return await myApiService.getNFTs(walletAddress);
    },
    fetchInventory: async (userId) => {
      return await myGameService.getInventory(userId);
    },
    sendTransaction: async (txData) => {
      return await myApiService.sendTransaction(txData);
    },
    getWalletBalance: async (walletAddress) => {
      return await myApiService.getBalance(walletAddress);
    }
  };
};

// Usage with custom hooks
function App() {
  return (
    <WalletUIProvider
      wallet={wallet}
      session={userSession}
      
      // Override specific hooks
      useCustomAuth={useCustomAuth}
      useCustomServerActions={useCustomServerActions}
      
      // You can still configure other hooks normally
      platformConfig={{ fallbackToMock: true }}
    >
      <WalletDashboard />
    </WalletUIProvider>
  );
}
```

### Accessing Injectable Hooks

You can access the configured hooks from within your components:

```tsx
import { useWalletUI } from '@d-sports/wallet';

function MyCustomComponent() {
  const { hooks } = useWalletUI();
  
  // Access the configured hooks
  const { signIn, signOut } = hooks.auth;
  const { push, back } = hooks.navigation;
  const { fetchTokens } = hooks.serverActions;
  const { copyToClipboard } = hooks.platform;
  
  const handleSignIn = async () => {
    await signIn({ email, password });
    push('/dashboard');
  };
  
  const handleCopyAddress = async () => {
    const success = await copyToClipboard(walletAddress);
    if (success) {
      showToast({ message: 'Address copied!', type: 'success' });
    }
  };
  
  return (
    <div>
      <button onClick={handleSignIn}>Sign In</button>
      <button onClick={handleCopyAddress}>Copy Address</button>
    </div>
  );
}
```

## 🪝 Hooks

### `useWalletUI()`
Access the full wallet UI context.

```tsx
const { 
  connect, 
  disconnect, 
  fetchTokens, 
  showToast,
  session,
  theme 
} = useWalletUI();
```

### `useWallet()`
Access wallet-specific functionality.

```tsx
const { 
  wallet, 
  isConnected, 
  connect, 
  disconnect,
  createWallet,
  importWallet 
} = useWallet();
```

### `useWalletData()`
Access and manage wallet data.

```tsx
const { 
  tokens, 
  nfts, 
  inventory,
  isLoading,
  refreshAll,
  refreshTokens 
} = useWalletData();
```

## 📱 Platform Support

### Web/Next.js Usage

```tsx
import { Dashboard, WalletUIProvider } from '@d-sports/wallet';
import { createDSportsWallet } from '@d-sports/wallet/nextjs';

const wallet = createDSportsWallet({
  projectId: 'your-project-id',
  chains: [mainnet, polygon],
});

function App() {
  return (
    <WalletUIProvider wallet={wallet}>
      <Dashboard />
    </WalletUIProvider>
  );
}
```

### React Native Usage

```tsx
import { Dashboard, WalletUIProvider } from '@d-sports/wallet';
import { createDSportsWallet } from '@d-sports/wallet/react-native';

const wallet = createDSportsWallet({
  projectId: 'your-project-id',
  chains: [mainnet, polygon],
});

function App() {
  return (
    <WalletUIProvider wallet={wallet}>
      <Dashboard />
    </WalletUIProvider>
  );
}
```

## 🎯 Customization Examples

### Custom Data Fetching

```tsx
const fetchTokensFromBlockchain = async () => {
  const provider = new ethers.providers.JsonRpcProvider();
  const wallet = session?.wallet;
  
  if (!wallet) return [];
  
  // Fetch token balances from multiple contracts
  const tokens = await Promise.all([
    getTokenBalance(provider, wallet.address, 'USDC'),
    getTokenBalance(provider, wallet.address, 'DAI'),
    // ... more tokens
  ]);
  
  return tokens.filter(token => parseFloat(token.balance) > 0);
};
```

### Custom Wallet Creation

```tsx
const handleCreateWallet = async (config) => {
  if (config.method === 'social') {
    // Use your own OAuth flow
    const socialAuth = await customSocialLogin(config.provider);
    const walletData = await createWalletFromSocial(socialAuth);
    return walletData;
  }
  
  if (config.method === 'web3') {
    // Connect to MetaMask or other Web3 wallets
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    return { address: await signer.getAddress() };
  }
};
```

### Custom Theme Implementation

```tsx
const gameTheme = {
  colors: {
    primary: '#00D2FF',
    secondary: '#FF0080',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    text: '#FFFFFF',
    border: 'rgba(255, 255, 255, 0.2)',
  },
  borderRadius: 16,
  fontFamily: 'Orbitron, monospace',
};
```

## 🔒 Security Considerations

- Components never store or handle private keys directly
- All sensitive operations are delegated to injected functions
- Support for secure storage through platform adapters
- Validation of wallet addresses and transaction data

## 🚀 Performance

- Lazy loading of heavy components
- Optimized re-renders with React.memo
- Efficient state management
- Smooth animations with hardware acceleration
- Image optimization and caching

## 🎮 Gaming-Specific Features

- **Game Inventory Management**: Display and manage in-game items
- **NFT Integration**: Seamless NFT viewing and trading
- **Multi-Game Support**: Handle items from multiple games
- **Rarity System**: Visual representation of item rarity
- **Equipment Status**: Track equipped/unequipped items

## 🔄 Migration Guide

### Migrating from Previous Versions

If you're upgrading from an earlier version of the D-Sports Wallet UI library, here's what you need to know:

#### Breaking Changes in v1.0+

1. **Component Names**: `Dashboard` is now `WalletDashboard` for the context-driven version
2. **Hook Injection**: Injectable hooks are now configured through the provider
3. **Theme Structure**: Theme interface has been updated with more granular control

#### Step-by-Step Migration

**Before (v0.x):**
```tsx
import { WalletProvider, Dashboard } from '@d-sports/wallet';

function App() {
  return (
    <WalletProvider wallet={wallet}>
      <Dashboard 
        fetchTokens={fetchTokens}
        fetchNFTs={fetchNFTs}
      />
    </WalletProvider>
  );
}
```

**After (v1.0+):**
```tsx
import { WalletUIProvider, WalletDashboard } from '@d-sports/wallet';

function App() {
  return (
    <WalletUIProvider 
      wallet={wallet}
      fetchTokens={fetchTokens}
      fetchNFTs={fetchNFTs}
    >
      <WalletDashboard />
    </WalletUIProvider>
  );
}
```

#### Hook Migration

**Before:**
```tsx
// Custom hooks were imported separately
import { useCustomAuth } from './my-auth-hook';
```

**After:**
```tsx
// Inject hooks through the provider
<WalletUIProvider
  useCustomAuth={useMyCustomAuth}
  authConfig={{ autoRefresh: true }}
>
  <WalletDashboard />
</WalletUIProvider>
```

### New Features You Can Adopt

1. **Injectable Hooks**: Customize authentication, navigation, and server actions
2. **Enhanced Theming**: More granular theme control with CSS custom properties
3. **Tree Shaking**: Better bundle optimization for icon libraries
4. **TypeScript**: Improved type safety and IntelliSense support

## 📈 Analytics Integration

Components emit events that can be captured for analytics:

```tsx
const handleAnalytics = (event, data) => {
  analytics.track(event, data);
};

<WalletUIProvider 
  onWalletConnect={data => handleAnalytics('wallet_connect', data)}
  onTokenTransfer={data => handleAnalytics('token_transfer', data)}
  onNFTView={data => handleAnalytics('nft_view', data)}
>
  <WalletDashboard />
</WalletUIProvider>
```

## 🧪 Testing

Components are designed to be easily testable:

```tsx
import { render, screen } from '@testing-library/react';
import { WalletUIProvider, Dashboard } from '@d-sports/wallet';

const mockWallet = {
  getState: () => ({ isConnected: true }),
  // ... mock methods
};

test('renders dashboard', () => {
  render(
    <WalletUIProvider wallet={mockWallet}>
      <Dashboard />
    </WalletUIProvider>
  );
  
  expect(screen.getByText('D-Sports Wallet')).toBeInTheDocument();
});
```

## 🔧 Development

The UI components are built with:
- **TypeScript** for type safety
- **React** for component library
- **CSS-in-JS** for styling (no external dependencies)
- **ESM/CJS** dual package support
- **Tree shaking** support for optimal bundles

### Tree Shaking & Bundle Optimization

The library is optimized for tree shaking to ensure your bundle only includes the components you use:

**Icon Libraries**: The included icon libraries (`@radix-ui/react-icons`, `lucide-react`) are fully tree-shakeable. Only the icons you import will be included in your bundle:

```tsx
// ✅ Good - only imports the specific icon
import { WalletIcon } from 'lucide-react';
import { PersonIcon } from '@radix-ui/react-icons';

// ❌ Avoid - imports the entire library
import * as Icons from 'lucide-react';
```

**Component Imports**: Import only the components you need:

```tsx
// ✅ Optimal - tree-shakeable imports
import { WalletUIProvider, WalletDashboard } from '@d-sports/wallet';

// ✅ Also good - specific imports
import { TokenTab, LoadingState } from '@d-sports/wallet';

// ❌ Less optimal - imports everything
import * as WalletComponents from '@d-sports/wallet';
```

**Bundle Analysis**: The library provides separate entry points for different use cases:
- `/ui` - UI components only
- `/nextjs` - Next.js specific features
- `/react-native` - React Native specific features

This allows bundlers to exclude unused platform-specific code automatically.

## 📄 License

MIT License - see the LICENSE file for details.
