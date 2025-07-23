# @d-sports/wallet

> **⚠️ IMPORTANT: IN PROGRESS - This package is currently being updated to fix build issues. Please use with caution.**

<!-- TOC -->
- [✨ Features](#-features)
- [🚀 Installation](#-installation)
  - [Platform-specific Dependencies](#platform-specific-dependencies)
- [🏃‍♂️ Quick Start](#️-quick-start)
  - [🚀 Super Quick Start (5 minutes)](#-super-quick-start-5-minutes)
  - [Production Setup](#production-setup)
  - [Next.js](#nextjs)
  - [React Native](#react-native)
- [📚 Usage Examples](#-usage-examples)
  - [Basic Wallet Connection](#basic-wallet-connection)
  - [Custom Social Login](#custom-social-login)
  - [Rainbow Kit Integration](#rainbow-kit-integration)
  - [Wagmi Integration](#wagmi-integration)
- [🔧 API Reference](#-api-reference)
  - [DSportsWallet](#dsportswallet)
    - [Constructor Options](#constructor-options)
    - [Methods](#methods)
    - [Events](#events)
  - [React Hooks](#react-hooks)
    - [useDSportsWallet](#usedsportswallet)
    - [useSocialLogin](#usesociallogin)
- [⚙️ Configuration](#️-configuration)
  - [Custom Social Login Configuration](#custom-social-login-configuration)
  - [Supported Social Providers](#supported-social-providers)
  - [Setting Up OAuth Applications](#setting-up-oauth-applications)
    - [Google OAuth Setup](#google-oauth-setup)
    - [Facebook OAuth Setup](#facebook-oauth-setup)
    - [Twitter OAuth Setup](#twitter-oauth-setup)
  - [Theme Configuration](#theme-configuration)
  - [OAuth Callback Page](#oauth-callback-page)
  - [Deep Linking (React Native)](#deep-linking-react-native)
- [💰 Cost Comparison](#-cost-comparison)
- [🛠️ Development](#️-development)
  - [Setup](#setup)
  - [Build](#build)
  - [Test](#test)
  - [Development Scripts](#development-scripts)
- [📦 Package Structure](#-package-structure)
- [🔒 Security Features](#-security-features)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🙏 Acknowledgments](#-acknowledgments)
- [🔄 Quick Start → Production Migration](#-quick-start--production-migration)
  - [Development to Production Path](#development-to-production-path)
  - [D-Sports OAuth Service](#d-sports-oauth-service)
<!-- /TOC -->

A powerful, multi-platform wallet SDK for React, Next.js, and React Native applications with **free, custom social login** and support for Rainbow Kit and Wagmi. 100% D-Sports branded with no vendor dependencies.

## ✨ Features

- 🌐 **Multi-platform support**: Works with React, Next.js, and React Native
- 🔐 **Custom social login**: FREE OAuth integration with Google, Facebook, Twitter, Discord, GitHub, and Apple
- 🏆 **D-Sports branded**: Fully customizable, no vendor lock-in
- 🌈 **Rainbow Kit compatible**: Easy integration with Rainbow Kit's wallet connection UI
- ⚡ **Wagmi compatible**: Full support for Wagmi v1 and v2
- 🎨 **Customizable UI**: Flexible theming and styling options
- 🔒 **Secure storage**: Platform-specific secure storage solutions
- 📱 **Mobile-first**: Deep linking and mobile-optimized experience
- 🔄 **Auto-reconnection**: Persistent wallet connections across sessions
- 💰 **Zero cost**: No per-user fees or external dependencies
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
# No additional dependencies required!
```

**For React Native:**

```bash
npm install react-native-keychain react-native-url-polyfill
```

## 🏃‍♂️ Quick Start

### 🚀 Super Quick Start (5 minutes)

Get started immediately with **D-Sports managed OAuth credentials** - no OAuth setup required!

```typescript
import { createDSportsWalletQuickStart, mainnet, polygon } from '@d-sports/wallet';

// 🎉 ONE LINE SETUP - No OAuth configuration needed!
const wallet = createDSportsWalletQuickStart({
  projectId: 'your-project-id',
  chains: [mainnet, polygon],
  metadata: {
    name: 'My Awesome App',
    description: 'Built with D-Sports Wallet',
    url: 'https://my-app.com',
    icons: ['https://my-app.com/icon.png']
  }
});

// Connect with social login (Google, Facebook, Twitter, Discord, GitHub ready!)
await wallet.connect({ socialLogin: true });

console.log('🎊 Wallet connected with zero OAuth setup!');
```

**Perfect for:**

- 🧪 **Prototyping** and proof of concepts
- 👨‍💻 **Development** and testing
- 🎓 **Learning** and tutorials
- 🏁 **Getting started** quickly

### Production Setup

For production apps, set up your own OAuth applications:

### Next.js

```typescript
import { createDSportsWallet } from '@d-sports/wallet/nextjs';

// Create wallet instance
const wallet = createDSportsWallet({
  projectId: 'your-project-id',
  chains: [/* your chains */],
  environment: 'production', // Validates production config
  socialLogin: {
    appSecret: 'your-app-secret', // For deterministic key generation
    redirectUri: 'https://your-app.com/auth/callback',
    providers: {
      google: {
        clientId: 'your-google-client-id',
      },
      facebook: {
        clientId: 'your-facebook-app-id',
      },
      twitter: {
        clientId: 'your-twitter-client-id',
      },
      discord: {
        clientId: 'your-discord-client-id',
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
  socialLogin: {
    appSecret: 'your-app-secret',
    redirectUri: 'dsports://auth/callback', // Deep link for mobile
    providers: {
      google: {
        clientId: 'your-google-client-id',
      },
      apple: {
        clientId: 'your-apple-client-id',
      },
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

### Custom Social Login

```typescript
import { createDSportsWallet, CustomSocialLoginProvider } from '@d-sports/wallet';

const wallet = createDSportsWallet({
  projectId: 'your-project-id',
  chains: [/* your chains */],
  socialLogin: {
    appSecret: 'your-unique-app-secret', // Used for deterministic key generation
    redirectUri: 'https://your-app.com/auth/callback',
    providers: {
      google: {
        clientId: 'your-google-oauth-client-id',
      },
      facebook: {
        clientId: 'your-facebook-app-id',
      },
      twitter: {
        clientId: 'your-twitter-oauth-client-id',
      },
      discord: {
        clientId: 'your-discord-oauth-client-id',
      },
      github: {
        clientId: 'your-github-oauth-client-id',
      },
    },
  },
});

// Connect with social login
await wallet.connect({ socialLogin: true });

// Get social login provider
const socialProvider = wallet.getConnector('dsports-wallet').customSocialLoginProvider;

// Login with specific provider
const result = await socialProvider.login('google');
console.log('Social login result:', result);

// Get wallet from social login
const ethersWallet = await socialProvider.getWalletFromSocial(result);
console.log('Generated wallet address:', ethersWallet.address);
```

### Rainbow Kit Integration

```typescript
import { createDSportsRainbowKitConnector } from '@d-sports/wallet';

const connector = createDSportsRainbowKitConnector({
  chains: [/* your chains */],
  projectId: 'your-project-id',
  appName: 'My App',
  socialLogin: {
    appSecret: 'your-app-secret',
    redirectUri: 'https://your-app.com/auth/callback',
    providers: {
      google: {
        clientId: 'your-google-client-id',
      },
      facebook: {
        clientId: 'your-facebook-client-id',
      },
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
  socialLogin: {
    appSecret: 'your-app-secret',
    redirectUri: 'https://your-app.com/auth/callback',
    providers: {
      google: {
        clientId: 'your-google-client-id',
      },
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
  socialLogin?: CustomSocialLoginConfig;
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

- `connect(config?: { socialLogin?: boolean }): Promise<WalletAccount>`
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
} = useSocialLogin(customSocialLoginProvider);
```

## ⚙️ Configuration

### Custom Social Login Configuration

```typescript
interface CustomSocialLoginConfig {
  appSecret?: string; // Used for deterministic wallet generation
  redirectUri?: string; // OAuth callback URL
  providers: {
    [key in SocialProvider]?: {
      clientId: string;
      clientSecret?: string; // For backend token exchange
    };
  };
}
```

### Supported Social Providers

- **Google** (`google`): OAuth 2.0
- **Facebook** (`facebook`): Facebook Login
- **Twitter** (`twitter`): OAuth 2.0
- **Discord** (`discord`): OAuth 2.0
- **GitHub** (`github`): OAuth 2.0
- **Apple** (`apple`): Sign in with Apple

### Setting Up OAuth Applications

#### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins
6. Copy the **Client ID**

#### Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Set up Facebook Login
4. Add your domain to valid OAuth redirect URIs
5. Copy the **App ID**

#### Twitter OAuth Setup

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app
3. Set up OAuth 2.0
4. Configure callback URLs
5. Copy the **Client ID**

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

### OAuth Callback Page

Create a callback page at your `redirectUri` to handle OAuth responses:

```html
<!DOCTYPE html>
<html>
<head>
  <title>D-Sports Authentication</title>
  <style>
    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
    .loading { color: #666; }
    .logo { width: 64px; height: 64px; margin: 20px auto; }
  </style>
</head>
<body>
  <div class="logo">🏆</div>
  <h2>D-Sports Authentication</h2>
  <p class="loading">Processing your login...</p>
  <script>
    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    
    if (error) {
      window.parent.postMessage({
        type: 'OAUTH_ERROR',
        error: error
      }, window.location.origin);
    } else if (code) {
      // Exchange code for user data (implement your backend logic)
      window.parent.postMessage({
        type: 'OAUTH_SUCCESS',
        payload: {
          code,
          user: {
            id: 'user-id-from-your-backend',
            email: 'user@example.com',
            name: 'User Name',
            avatar: 'https://example.com/avatar.jpg'
          },
          token: 'access-token-from-your-backend',
          expiresAt: Date.now() + 3600000
        }
      }, window.location.origin);
    }
  </script>
</body>
</html>
```

### Deep Linking (React Native)

```typescript
import { handleDeepLink } from '@d-sports/wallet/react-native';

// Handle deep link
handleDeepLink('dsports://wallet/connect?connector=dsports-wallet', wallet);
```

## 💰 Cost Comparison

| Provider | Cost | Lock-in | Branding |
|----------|------|---------|----------|
| **@d-sports/wallet** | **FREE** | ❌ None | 🏆 Full D-Sports |
| Web3Auth | $0.05/MAU | ✅ Yes | 🔒 Limited |
| Magic | $0.02/MAU | ✅ Yes | 🔒 Limited |
| Privy | $0.05/MAU | ✅ Yes | 🔒 Limited |

## 🛠️ Development

### Setup

```bash
git clone https://github.com/D-Sports-Ecosystem/wallet.git
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

```sh
@d-sports/wallet/
├── core              # Core wallet functionality
├── nextjs            # Next.js specific exports
├── react-native      # React Native specific exports
├── custom-social-login # Custom social login provider
└── types             # TypeScript type definitions
```

## 🔒 Security Features

- **Deterministic Key Generation**: Wallets are generated deterministically from social login data
- **Secure Storage**: Platform-specific secure storage (localStorage, AsyncStorage, Keychain)
- **No Private Key Transmission**: Keys are generated locally, never sent to servers
- **Custom App Secret**: Use your own secret for additional security
- **OAuth Best Practices**: Follows OAuth 2.0 security guidelines

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [ethers.js](https://ethers.org/) for Ethereum interactions
- [Rainbow Kit](https://www.rainbowkit.com/) for wallet connection UI
- [Wagmi](https://wagmi.sh/) for React hooks for Ethereum
- [Rollup](https://rollupjs.org/) for module bundling

---

**Made with ❤️ by the D-Sports team** - A free, open-source alternative to expensive wallet providers.

## 🔄 Quick Start → Production Migration

### Development to Production Path

1. **Start with Quick Start** (5 minutes):

   ```typescript
   const wallet = createDSportsWalletQuickStart({
     projectId: 'your-project-id',
     chains: [mainnet, polygon]
   });
   ```

2. **Create Your OAuth Apps** (30 minutes):
   - [Google OAuth Setup](#google-oauth-setup)
   - [Facebook OAuth Setup](#facebook-oauth-setup)
   - [Twitter OAuth Setup](#twitter-oauth-setup)

3. **Switch to Production Config**:

   ```typescript
   const wallet = createDSportsWallet({
     projectId: 'your-project-id',
     chains: [mainnet, polygon],
     environment: 'production', // Validates config
     socialLogin: {
       appSecret: 'your-production-secret',
       redirectUri: 'https://your-app.com/auth/callback',
       providers: {
         google: { clientId: 'your-google-client-id' },
         facebook: { clientId: 'your-facebook-app-id' },
         // ... other providers
       }
     }
   });
   ```

### D-Sports OAuth Service

D-Sports provides **managed OAuth credentials** for instant development:

```typescript
import { DSportsOAuthService, createQuickStartSocialLogin } from '@d-sports/wallet';

// Get managed credentials
const managed = DSportsOAuthService.getManagedCredentials({ 
  environment: 'development' 
});

// Quick start config (auto-generated)
const quickStartConfig = createQuickStartSocialLogin();

// Validate production config
const productionConfig = validateSocialLoginConfig(myConfig, 'production');
```

**Managed OAuth includes:**

- ✅ **Google** - Ready to use
- ✅ **Facebook** - Ready to use  
- ✅ **Twitter** - Ready to use
- ✅ **Discord** - Ready to use
- ✅ **GitHub** - Ready to use
- ⚠️ **Apple** - Requires individual setup

**Benefits:**

- 🚀 **Instant setup** - No OAuth configuration
- 🛡️ **Production warnings** - Automatic validation
- 🔄 **Easy migration** - Same API, different config
- 📚 **Perfect for demos** - Show features immediately
