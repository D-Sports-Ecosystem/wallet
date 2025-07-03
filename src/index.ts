// Core wallet functionality
export { DSportsWallet } from './core/wallet';
export { SocialLoginProvider } from './providers/social-login';

// Connectors
export { 
  DSportsRainbowKitConnector, 
  createDSportsRainbowKitConnector 
} from './connectors/rainbow-kit';
export { 
  DSportsWagmiConnector, 
  createDSportsWagmiConnector, 
  dsportsWagmiConnector 
} from './connectors/wagmi';

// Platform adapters
export { 
  webPlatformAdapter, 
  nextjsPlatformAdapter, 
  reactNativePlatformAdapter, 
  getDefaultPlatformAdapter 
} from './utils/platform-adapters';

// Event emitter utility
export { EventEmitter } from './utils/event-emitter';

// All types
export * from './types';

// Factory functions for easy setup
import { DSportsWallet } from './core/wallet';
import { SocialLoginProvider } from './providers/social-login';
import { DSportsRainbowKitConnector, createDSportsRainbowKitConnector } from './connectors/rainbow-kit';
import { DSportsWagmiConnector, createDSportsWagmiConnector, dsportsWagmiConnector } from './connectors/wagmi';
import { getDefaultPlatformAdapter } from './utils/platform-adapters';
import { 
  WalletConfig, 
  DSportsWalletOptions, 
  RainbowKitConnectorOptions, 
  WagmiConnectorOptions 
} from './types';

// Universal wallet factory (auto-detects platform)
export function createDSportsWallet(options: DSportsWalletOptions): DSportsWallet {
  const config: WalletConfig = {
    appName: options.metadata?.name || 'D-Sports App',
    appUrl: options.metadata?.url,
    appIcon: options.metadata?.icons?.[0],
    appDescription: options.metadata?.description,
    projectId: options.projectId,
    chains: options.chains,
    socialLogin: options.socialLogin,
    theme: options.theme
  };

  const platformAdapter = getDefaultPlatformAdapter();
  const wallet = new DSportsWallet(config, platformAdapter);

  // Add social login provider if configured
  if (options.socialLogin) {
    const socialProvider = new SocialLoginProvider(options.socialLogin, platformAdapter);
    
    // Create connectors with social login
    const rainbowKitConnector = new DSportsRainbowKitConnector({
      chains: options.chains,
      projectId: options.projectId,
      appName: config.appName,
      appIcon: config.appIcon,
      appDescription: config.appDescription,
      appUrl: config.appUrl,
      socialLogin: options.socialLogin,
      socialLoginProvider: socialProvider
    });

    const wagmiConnector = new DSportsWagmiConnector({
      chains: options.chains,
      projectId: options.projectId,
      metadata: options.metadata,
      socialLogin: options.socialLogin,
      socialLoginProvider: socialProvider
    });

    wallet.addConnector(rainbowKitConnector);
    wallet.addConnector(wagmiConnector);
  } else {
    // Create connectors without social login
    const rainbowKitConnector = new DSportsRainbowKitConnector({
      chains: options.chains,
      projectId: options.projectId,
      appName: config.appName,
      appIcon: config.appIcon,
      appDescription: config.appDescription,
      appUrl: config.appUrl
    });

    const wagmiConnector = new DSportsWagmiConnector({
      chains: options.chains,
      projectId: options.projectId,
      metadata: options.metadata
    });

    wallet.addConnector(rainbowKitConnector);
    wallet.addConnector(wagmiConnector);
  }

  return wallet;
}

// Universal Rainbow Kit connector factory
export function createUniversalRainbowKitConnector(options: RainbowKitConnectorOptions) {
  const platformAdapter = getDefaultPlatformAdapter();
  const socialProvider = options.socialLogin ? 
    new SocialLoginProvider(options.socialLogin, platformAdapter) : 
    undefined;

  return createDSportsRainbowKitConnector({
    ...options,
    socialLoginProvider: socialProvider
  });
}

// Universal Wagmi connector factory
export function createUniversalWagmiConnector(options: WagmiConnectorOptions) {
  const platformAdapter = getDefaultPlatformAdapter();
  const socialProvider = options.socialLogin ? 
    new SocialLoginProvider(options.socialLogin, platformAdapter) : 
    undefined;

  return createDSportsWagmiConnector({
    ...options,
    socialLoginProvider: socialProvider
  });
}

// Universal Wagmi v2 connector
export function universalWagmiConnector(options: WagmiConnectorOptions) {
  const platformAdapter = getDefaultPlatformAdapter();
  const socialProvider = options.socialLogin ? 
    new SocialLoginProvider(options.socialLogin, platformAdapter) : 
    undefined;

  return dsportsWagmiConnector({
    ...options,
    socialLoginProvider: socialProvider
  });
}

// Common chains
export const mainnet = {
  id: 1,
  name: 'Ethereum',
  network: 'homestead',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://eth-mainnet.g.alchemy.com/v2/demo'] },
    public: { http: ['https://eth-mainnet.g.alchemy.com/v2/demo'] }
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://etherscan.io' }
  }
};

export const goerli = {
  id: 5,
  name: 'Goerli',
  network: 'goerli',
  nativeCurrency: { name: 'Goerli Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://eth-goerli.g.alchemy.com/v2/demo'] },
    public: { http: ['https://eth-goerli.g.alchemy.com/v2/demo'] }
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://goerli.etherscan.io' }
  },
  testnet: true
};

export const sepolia = {
  id: 11155111,
  name: 'Sepolia',
  network: 'sepolia',
  nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://eth-sepolia.g.alchemy.com/v2/demo'] },
    public: { http: ['https://eth-sepolia.g.alchemy.com/v2/demo'] }
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' }
  },
  testnet: true
};

export const polygon = {
  id: 137,
  name: 'Polygon',
  network: 'matic',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://polygon-rpc.com'] },
    public: { http: ['https://polygon-rpc.com'] }
  },
  blockExplorers: {
    default: { name: 'PolygonScan', url: 'https://polygonscan.com' }
  }
};

export const bsc = {
  id: 56,
  name: 'BNB Smart Chain',
  network: 'bsc',
  nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://bsc-dataseed.binance.org'] },
    public: { http: ['https://bsc-dataseed.binance.org'] }
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://bscscan.com' }
  }
};

// Version
export const version = '1.0.0'; 