# @d-sports/wallet

A comprehensive wallet package with Rainbow Kit and Wagmi connectors, supporting both Next.js and React Native with social login functionality.

## ✨ Features

- 🎯 **Multi-platform Support**: Works seamlessly with Next.js and React Native
- 🌈 **Rainbow Kit Integration**: Drop-in connector for Rainbow Kit
- ⚡ **Wagmi Support**: Compatible with Wagmi v1 and v2
- 🔐 **Social Login**: Built-in OAuth support (Google, Facebook, Apple, Twitter, Discord, GitHub)
- 🎨 **Customizable Themes**: Fully customizable UI themes
- 🔄 **Auto-reconnection**: Automatic wallet reconnection on app restart
- 🛡️ **Type Safe**: Full TypeScript support with comprehensive type definitions
- 📱 **Mobile Ready**: Deep linking and secure storage for React Native

## 📦 Installation

```bash
npm install @d-sports/wallet
# or
yarn add @d-sports/wallet
# or
pnpm add @d-sports/wallet
```

### Peer Dependencies

```bash
npm install react react-dom
```

For React Native, also install:
```bash
npm install react-native @react-native-async-storage/async-storage react-native-keychain react-native-url-polyfill
```

## 🚀 Quick Start

### Next.js Setup

```typescript
// pages/_app.tsx or app/layout.tsx
import { createDSportsWallet, mainnet, polygon } from '@d-sports/wallet/nextjs';

const wallet = createDSportsWallet({
  projectId: 'your-walletconnect-project-id',
  chains: [mainnet, polygon],
  metadata: {
    name: 'My D-Sports App',
    description: 'An awesome dApp',
    url: 'https://mydapp.com',
    icons: ['https://mydapp.com/icon.png']
  },
  socialLogin: {
    providers: ['google', 'facebook', 'apple'],
    clientIds: {
      google: 'your-google-client-id',
      facebook: 'your-facebook-app-id',
      apple: 'your-apple-client-id'
    }
  }
});

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} wallet={wallet} />;
}
```

### React Native Setup

```typescript
// App.tsx
import { createDSportsWallet, mainnet, polygon, setupURLPolyfill } from '@d-sports/wallet/react-native';

// Required for URL parsing in React Native
setupURLPolyfill();

const wallet = createDSportsWallet({
  projectId: 'your-walletconnect-project-id',
  chains: [mainnet, polygon],
  metadata: {
    name: 'My D-Sports App',
    description: 'An awesome mobile dApp',
    url: 'https://mydapp.com',
    icons: ['https://mydapp.com/icon.png']
  },
  socialLogin: {
    providers: ['google', 'apple'],
    clientIds: {
      google: 'your-google-client-id',
      apple: 'your-apple-client-id'
    }
  }
});

export default function App() {
  return <YourAppComponent wallet={wallet} />;
}
```

## 💡 Usage Examples

### Basic Wallet Connection

```typescript
import { useDSportsWallet } from '@d-sports/wallet/nextjs';

function WalletButton({ wallet }) {
  const { 
    account, 
    isConnecting, 
    isConnected, 
    connect, 
    disconnect 
  } = useDSportsWallet(wallet);

  if (isConnected) {
    return (
      <div>
        <p>Connected: {account?.address}</p>
        <button onClick={disconnect}>Disconnect</button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => connect('dsports-wallet')} 
      disabled={isConnecting}
    >
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}
```

### Social Login

```typescript
import { useSocialLogin, SocialLoginProvider } from '@d-sports/wallet/nextjs';

function SocialLoginButton({ socialProvider }) {
  const { user, isLoading, login, logout } = useSocialLogin(socialProvider);

  if (user) {
    return (
      <div>
        <p>Welcome, {user.user.name}!</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => login('google')} 
      disabled={isLoading}
    >
      {isLoading ? 'Signing in...' : 'Sign in with Google'}
    </button>
  );
}
```

### Rainbow Kit Integration

```typescript
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { createDSportsRainbowKitConnectorForNextjs } from '@d-sports/wallet/nextjs';

const dsportsConnector = createDSportsRainbowKitConnectorForNextjs({
  chains: [mainnet, polygon],
  projectId: 'your-project-id',
  appName: 'My App',
  socialLogin: {
    providers: ['google', 'facebook'],
    clientIds: {
      google: 'your-google-client-id',
      facebook: 'your-facebook-app-id'
    }
  }
});

const { connectors } = getDefaultWallets({
  appName: 'My App',
  projectId: 'your-project-id',
  chains: [mainnet, polygon],
  connectors: [dsportsConnector]
});
```

### Wagmi Integration

```typescript
import { WagmiConfig, createConfig } from 'wagmi';
import { dsportsWagmiConnectorForNextjs } from '@d-sports/wallet/nextjs';

const dsportsConnector = dsportsWagmiConnectorForNextjs({
  chains: [mainnet, polygon],
  projectId: 'your-project-id',
  metadata: {
    name: 'My App',
    description: 'My awesome dApp',
    url: 'https://mydapp.com',
    icons: ['https://mydapp.com/icon.png']
  }
});

const config = createConfig({
  connectors: [dsportsConnector],
  // ... other wagmi config
});

function App() {
  return (
    <WagmiConfig config={config}>
      {/* Your app */}
    </WagmiConfig>
  );
}
```

## 🎨 Theming

```typescript
const wallet = createDSportsWallet({
  // ... other config
  theme: {
    colors: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
      background: '#FFFFFF',
      text: '#1F2937',
      border: '#E5E7EB'
    },
    borderRadius: 12,
    fontFamily: 'Inter, sans-serif'
  }
});
```

## 🔧 API Reference

### Core Classes

#### `DSportsWallet`

The main wallet class that manages connections and state.

```typescript
class DSportsWallet {
  constructor(config: WalletConfig, adapter: PlatformAdapter)
  
  // Methods
  addConnector(connector: WalletConnector): void
  connect(connectorId: string, config?: any): Promise<WalletAccount>
  disconnect(): Promise<void>
  switchChain(chainId: number): Promise<void>
  getState(): WalletState
  getAccount(): WalletAccount | undefined
  isConnected(): boolean
  
  // Events
  on(event: 'connect', listener: (account: WalletAccount) => void): void
  on(event: 'disconnect', listener: () => void): void
  on(event: 'accountsChanged', listener: (accounts: string[]) => void): void
  on(event: 'chainChanged', listener: (chainId: number) => void): void
}
```

#### `SocialLoginProvider`

Handles OAuth authentication with various providers.

```typescript
class SocialLoginProvider {
  constructor(config: SocialLoginConfig, adapter: PlatformAdapter)
  
  login(provider: SocialProvider): Promise<SocialLoginResult>
  logout(): Promise<void>
  getStoredUser(): Promise<SocialLoginResult | null>
}
```

### Hooks (Next.js/React)

#### `useDSportsWallet(wallet: DSportsWallet)`

React hook for wallet state management.

Returns:
- `account`: Current wallet account
- `isConnecting`: Connection loading state
- `isConnected`: Connection status
- `error`: Any connection errors
- `connect()`: Function to connect wallet
- `disconnect()`: Function to disconnect wallet
- `switchChain()`: Function to switch chains

#### `useSocialLogin(socialProvider: SocialLoginProvider)`

React hook for social login state management.

Returns:
- `user`: Current logged-in user
- `isLoading`: Login loading state
- `error`: Any login errors
- `login()`: Function to initiate login
- `logout()`: Function to logout

### Utilities

#### React Native Specific

```typescript
// Deep linking
handleDeepLink(url: string, wallet: DSportsWallet): Promise<any> | null

// Secure storage
storeSecureData(key: string, value: string): Promise<boolean>
getSecureData(key: string): Promise<string | null>
removeSecureData(key: string): Promise<boolean>

// URL polyfill setup
setupURLPolyfill(): void
```

## 📱 React Native Deep Linking

Add to your `android/app/src/main/AndroidManifest.xml`:

```xml
<intent-filter android:autoVerify="true">
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="dsports" />
</intent-filter>
```

Add to your `ios/YourApp/Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLName</key>
    <string>dsports</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>dsports</string>
    </array>
  </dict>
</array>
```

## 🔗 Supported Chains

Pre-configured chains available:

- `mainnet` - Ethereum Mainnet
- `goerli` - Goerli Testnet
- `sepolia` - Sepolia Testnet
- `polygon` - Polygon Mainnet
- `bsc` - BNB Smart Chain

## 🌐 Social Login Providers

Supported OAuth providers:

- Google (`google`)
- Facebook (`facebook`)
- Apple (`apple`)
- Twitter (`twitter`)
- Discord (`discord`)
- GitHub (`github`)

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Type check
npm run typecheck
```

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🆘 Support

- [Documentation](https://docs.d-sports.com/wallet)
- [GitHub Issues](https://github.com/d-sports/wallet/issues)
- [Discord Community](https://discord.gg/d-sports)

## 🔖 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and updates.

---

Made with ❤️ by the [D-Sports](https://d-sports.com) team