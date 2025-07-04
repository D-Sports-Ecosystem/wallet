# @d-sports/wallet

A powerful, multi-platform wallet SDK for React, Next.js, and React Native applications with seamless Web3Auth integration and support for Rainbow Kit and Wagmi.

## ✨ Features

- 🌐 **Multi-platform support**: Works with React, Next.js, and React Native
- 🔐 **Web3Auth integration**: Secure social login with Google, Facebook, Twitter, Discord, and more
- 🌈 **Rainbow Kit compatible**: Easy integration with Rainbow Kit's wallet connection UI
- ⚡ **Wagmi compatible**: Full support for Wagmi v1 and v2
- 🎨 **Customizable UI**: Flexible theming and styling options
- 🔒 **Secure storage**: Platform-specific secure storage solutions
- 📱 **Mobile-first**: Deep linking and mobile-optimized experience
- 🔄 **Auto-reconnection**: Persistent wallet connections across sessions
- 🎯 **TypeScript**: Full TypeScript support with comprehensive type definitions

## 🚀 Installation

```bash
npm install @d-sports/wallet
# or
yarn add @d-sports/wallet
# or
bun add @d-sports/wallet
```

### Platform-specific Dependencies

**For Next.js/React:**
```bash
npm install @web3auth/modal @web3auth/base @web3auth/ethereum-provider @web3auth/openlogin-adapter
```

**For React Native:**
```bash
npm install @web3auth/no-modal @web3auth/base @web3auth/ethereum-provider @web3auth/openlogin-adapter
npm install react-native-keychain react-native-url-polyfill
```

## 🏃‍♂️ Quick Start

### Next.js

```typescript
import { createDSportsWallet } from '@d-sports/wallet/nextjs';

// Create wallet instance
const wallet = createDSportsWallet({
  projectId: 'your-project-id',
  chains: [/* your chains */],
  web3Auth: {
    clientId: 'your-web3auth-client-id',
    web3AuthNetwork: 'testnet', // or 'mainnet'
    chainConfig: {
      chainNamespace: 'eip155',
      chainId: '0x1', // Ethereum mainnet
      rpcTarget: 'https://mainnet.infura.io/v3/your-infura-key',
      displayName: 'Ethereum Mainnet',
      blockExplorer: 'https://etherscan.io',
      ticker: 'ETH',
      tickerName: 'Ethereum',
    },
    loginConfig: {
      google: {
        verifier: 'your-google-verifier',
        typeOfLogin: 'google',
        clientId: 'your-google-client-id',
      },
      facebook: {
        verifier: 'your-facebook-verifier',
        typeOfLogin: 'facebook',
        clientId: 'your-facebook-client-id',
      },
    },
  },
});

// Connect wallet
await wallet.connect();
```

### React Native

```typescript
import { createDSportsWallet, setupURLPolyfill } from '@d-sports/wallet/react-native';

// Setup URL polyfill (required for React Native)
setupURLPolyfill();

// Create wallet instance
const wallet = createDSportsWallet({
  projectId: 'your-project-id',
  chains: [/* your chains */],
  web3Auth: {
    clientId: 'your-web3auth-client-id',
    web3AuthNetwork: 'testnet',
    chainConfig: {
      chainNamespace: 'eip155',
      chainId: '0x89', // Polygon mainnet
      rpcTarget: 'https://polygon-rpc.com',
      displayName: 'Polygon',
      blockExplorer: 'https://polygonscan.com',
      ticker: 'MATIC',
      tickerName: 'Polygon',
    },
  },
});

// Connect wallet
await wallet.connect();
```

## 📚 Usage Examples

### Basic Wallet Connection

```typescript
import { createDSportsWallet } from '@d-sports/wallet';

const wallet = createDSportsWallet({
  projectId: 'your-project-id',
  chains: [
    {
      id: 1,
      name: 'Ethereum',
      network: 'homestead',
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      rpcUrls: {
        default: { http: ['https://mainnet.infura.io/v3/your-key'] },
        public: { http: ['https://mainnet.infura.io/v3/your-key'] }
      }
    }
  ]
});

// Connect to wallet
const account = await wallet.connect();
console.log('Connected account:', account);

// Get wallet state
const state = wallet.getState();
console.log('Wallet state:', state);

// Switch chain
await wallet.switchChain(137); // Polygon

// Disconnect
await wallet.disconnect();
```

### Web3Auth Social Login

```typescript
import { createDSportsWallet } from '@d-sports/wallet';
import { Web3AuthProvider } from '@d-sports/wallet/web3auth';

const wallet = createDSportsWallet({
  projectId: 'your-project-id',
  chains: [/* your chains */],
  web3Auth: {
    clientId: 'your-web3auth-client-id',
    web3AuthNetwork: 'testnet',
    chainConfig: {
      chainNamespace: 'eip155',
      chainId: '0x1',
      rpcTarget: 'https://mainnet.infura.io/v3/your-key',
      displayName: 'Ethereum',
      blockExplorer: 'https://etherscan.io',
      ticker: 'ETH',
      tickerName: 'Ethereum',
    },
    loginConfig: {
      google: {
        verifier: 'your-google-verifier',
        typeOfLogin: 'google',
        clientId: 'your-google-client-id',
      },
      facebook: {
        verifier: 'your-facebook-verifier', 
        typeOfLogin: 'facebook',
        clientId: 'your-facebook-client-id',
      },
    },
  },
});

// Connect with social login
await wallet.connect();

// Get Web3Auth provider
const provider = wallet.getConnector('dsports-wallet');
const web3AuthProvider = provider.getProvider();

// Get user info
const userInfo = await web3AuthProvider.getUserInfo();
console.log('User info:', userInfo);
```

### Rainbow Kit Integration

```typescript
import { createDSportsRainbowKitConnector } from '@d-sports/wallet';

const connector = createDSportsRainbowKitConnector({
  chains: [/* your chains */],
  projectId: 'your-project-id',
  appName: 'My App',
  web3Auth: {
    clientId: 'your-web3auth-client-id',
    web3AuthNetwork: 'testnet',
    chainConfig: {
      chainNamespace: 'eip155',
      chainId: '0x1',
      rpcTarget: 'https://mainnet.infura.io/v3/your-key',
      displayName: 'Ethereum',
      blockExplorer: 'https://etherscan.io',
      ticker: 'ETH',
      tickerName: 'Ethereum',
    },
  },
});

// Use with Rainbow Kit
const connectors = [
  connector,
  // ... other connectors
];
```

### Wagmi Integration

```typescript
import { dsportsWagmiConnector } from '@d-sports/wallet';

const connector = dsportsWagmiConnector({
  chains: [/* your chains */],
  projectId: 'your-project-id',
  web3Auth: {
    clientId: 'your-web3auth-client-id',
    web3AuthNetwork: 'testnet',
    chainConfig: {
      chainNamespace: 'eip155',
      chainId: '0x1',
      rpcTarget: 'https://mainnet.infura.io/v3/your-key',
      displayName: 'Ethereum',
      blockExplorer: 'https://etherscan.io',
      ticker: 'ETH',
      tickerName: 'Ethereum',
    },
  },
});

// Use with Wagmi
const connectors = [
  connector,
  // ... other connectors
];
```

## 🔧 API Reference

### DSportsWallet

#### Constructor Options

```typescript
interface DSportsWalletOptions {
  projectId: string;
  chains: Chain[];
  web3Auth?: Web3AuthConfig;
  theme?: WalletTheme;
  metadata?: {
    name: string;
    description: string;
    url: string;
    icons: string[];
  };
}
```

#### Methods

- `connect(connectorId?: string): Promise<WalletAccount>`
- `disconnect(): Promise<void>`
- `switchChain(chainId: number): Promise<void>`
- `getState(): WalletState`
- `isConnected(): boolean`
- `getConnector(id: string): WalletConnector | undefined`
- `addConnector(connector: WalletConnector): void`
- `removeConnector(id: string): void`

#### Events

- `connect`: Emitted when wallet connects
- `disconnect`: Emitted when wallet disconnects
- `accountsChanged`: Emitted when accounts change
- `chainChanged`: Emitted when chain changes
- `error`: Emitted when an error occurs

### React Hooks

#### useDSportsWallet

```typescript
const {
  account,
  isConnecting,
  isReconnecting,
  isDisconnected,
  error,
  connect,
  disconnect,
  switchChain,
  isConnected
} = useDSportsWallet(wallet);
```

#### useSocialLogin

```typescript
const {
  user,
  isLoading,
  error,
  login,
  logout
} = useSocialLogin(web3AuthProvider);
```

## ⚙️ Configuration

### Web3Auth Configuration

```typescript
interface Web3AuthConfig {
  clientId: string;
  web3AuthNetwork?: 'mainnet' | 'testnet' | 'cyan' | 'aqua';
  chainConfig: {
    chainNamespace: string;
    chainId: string;
    rpcTarget: string;
    displayName: string;
    blockExplorer: string;
    ticker: string;
    tickerName: string;
  };
  uiConfig?: {
    theme?: 'light' | 'dark' | 'auto';
    loginMethodsOrder?: string[];
    appLogo?: string;
    modalZIndex?: string;
  };
  loginConfig?: {
    google?: LoginProvider;
    facebook?: LoginProvider;
    twitter?: LoginProvider;
    discord?: LoginProvider;
  };
}
```

### Theme Configuration

```typescript
interface WalletTheme {
  colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    text?: string;
    border?: string;
  };
  borderRadius?: number;
  fontFamily?: string;
}
```

### Deep Linking (React Native)

```typescript
import { handleDeepLink } from '@d-sports/wallet/react-native';

// Handle deep link
handleDeepLink('dsports://wallet/connect?connector=dsports-wallet', wallet);
```

## 🛠️ Development

### Setup

```bash
git clone https://github.com/d-sports/wallet.git
cd wallet
bun install
```

### Build

```bash
bun run build
```

### Test

```bash
bun test
```

### Development Scripts

- `bun run dev`: Start development mode
- `bun run build`: Build all packages
- `bun run build:core`: Build core package
- `bun run build:nextjs`: Build Next.js package
- `bun run build:react-native`: Build React Native package
- `bun run clean`: Clean build artifacts
- `bun run lint`: Run ESLint
- `bun run test`: Run tests
- `bun run test:watch`: Run tests in watch mode

## 📦 Package Structure

```
@d-sports/wallet/
├── core              # Core wallet functionality
├── nextjs            # Next.js specific exports
├── react-native      # React Native specific exports
├── web3auth          # Web3Auth provider
└── types             # TypeScript type definitions
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Web3Auth](https://web3auth.io/) for social login infrastructure
- [Rainbow Kit](https://www.rainbowkit.com/) for wallet connection UI
- [Wagmi](https://wagmi.sh/) for React hooks for Ethereum
- [Rollup](https://rollupjs.org/) for module bundling