import React, { useState, useEffect } from 'react';
import { DSportsWallet } from '../core/wallet';
import { CustomSocialLoginProvider } from '../providers/custom-social-login';
import { DSportsRainbowKitConnector, createDSportsRainbowKitConnector } from '../connectors/rainbow-kit';
import { DSportsWagmiConnector, createDSportsWagmiConnector, dsportsWagmiConnector } from '../connectors/wagmi';
import { nextjsPlatformAdapter, getDefaultPlatformAdapterAsync } from '../utils/platform-adapters';
import { 
  WalletConfig, 
  DSportsWalletOptions, 
  RainbowKitConnectorOptions, 
  WagmiConnectorOptions,
  Chain
} from '../types';

// Next.js specific wallet factory
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

  const wallet = new DSportsWallet(config, nextjsPlatformAdapter);

  // Add social login provider if configured
  if (options.socialLogin) {
    const socialProvider = new CustomSocialLoginProvider(options.socialLogin, nextjsPlatformAdapter);
    
    // Create connectors with social login
    const rainbowKitConnector = new DSportsRainbowKitConnector({
      chains: options.chains,
      projectId: options.projectId,
      appName: config.appName,
      appIcon: config.appIcon,
      appDescription: config.appDescription,
      appUrl: config.appUrl,
      socialLogin: options.socialLogin,
      customSocialLoginProvider: socialProvider
    });

    const wagmiConnector = new DSportsWagmiConnector({
      chains: options.chains,
      projectId: options.projectId,
      metadata: options.metadata,
      socialLogin: options.socialLogin,
      customSocialLoginProvider: socialProvider
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

// Next.js specific Rainbow Kit connector factory
export function createDSportsRainbowKitConnectorForNextjs(options: RainbowKitConnectorOptions) {
  const socialProvider = options.socialLogin ? 
    new CustomSocialLoginProvider(options.socialLogin, nextjsPlatformAdapter) : 
    undefined;

  return createDSportsRainbowKitConnector({
    ...options,
    customSocialLoginProvider: socialProvider
  });
}

// Next.js specific Wagmi connector factory
export function createDSportsWagmiConnectorForNextjs(options: WagmiConnectorOptions) {
  const socialProvider = options.socialLogin ? 
    new CustomSocialLoginProvider(options.socialLogin, nextjsPlatformAdapter) : 
    undefined;

  return createDSportsWagmiConnector({
    ...options,
    customSocialLoginProvider: socialProvider
  });
}

// Next.js specific Wagmi v2 connector
export function dsportsWagmiConnectorForNextjs(options: WagmiConnectorOptions) {
  const socialProvider = options.socialLogin ? 
    new CustomSocialLoginProvider(options.socialLogin, nextjsPlatformAdapter) : 
    undefined;

  return dsportsWagmiConnector({
    ...options,
    customSocialLoginProvider: socialProvider
  });
}

// Next.js Hooks
export function useDSportsWallet(wallet: DSportsWallet) {
  const [state, setState] = useState(wallet.getState());

  useEffect(() => {
    const handleStateChange = () => {
      setState(wallet.getState());
    };

    wallet.on('connect', handleStateChange);
    wallet.on('disconnect', handleStateChange);
    wallet.on('accountsChanged', handleStateChange);
    wallet.on('chainChanged', handleStateChange);
    wallet.on('error', handleStateChange);

    return () => {
      wallet.removeAllListeners();
    };
  }, [wallet]);

  return {
    ...state,
    connect: wallet.connect.bind(wallet),
    disconnect: wallet.disconnect.bind(wallet),
    switchChain: wallet.switchChain.bind(wallet),
    isConnected: wallet.isConnected.bind(wallet)
  };
}

// Next.js Social Login Hook
export function useSocialLogin(socialProvider: CustomSocialLoginProvider) {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check for stored user on mount
    socialProvider.getStoredUser().then(result => {
      if (result && result.expiresAt > Date.now()) {
        setUser(result as any);
      }
    });
  }, [socialProvider]);

  const login = async (provider: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await socialProvider.login(provider as any);
      setUser(result as any);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await socialProvider.logout();
      setUser(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    error,
    login,
    logout
  };
}

// Next.js specific utilities
export function withDSportsWallet<T extends object>(
  Component: React.ComponentType<T>,
  walletOptions: DSportsWalletOptions
) {
  return function WrappedComponent(props: T) {
    const wallet = createDSportsWallet(walletOptions);
    return React.createElement(Component, { ...props, wallet });
  };
}

// Re-export common types and utilities
export * from '../types';
export * from '../core/wallet';
export * from '../providers/custom-social-login';
export { nextjsPlatformAdapter };

// Next.js specific imports are at the top of the file

// Common chains for Next.js
export const mainnet: Chain = {
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

export const goerli: Chain = {
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

export const sepolia: Chain = {
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

// UI Components (conditionally exported for Next.js)
// These are conditionally loaded to prevent server-side rendering issues
let uiComponents: any = {};
let tokenComponents: any = {};
let walletUIComponents: any = {};

if (typeof window !== 'undefined') {
  // Only load UI components on the client side
  try {
    uiComponents = require('../components/ui');
    tokenComponents = {
      TokenUpdateStatus: require('../components/token-update-status').TokenUpdateStatus,
      TokenUpdateConfigComponent: require('../components/token-update-config').TokenUpdateConfig,
    };
    walletUIComponents = {
      WalletModal: require('../wallet-modal').WalletModal,
      WalletPage: require('../wallet-page').default,
    };
  } catch (error) {
    console.warn("UI components not available:", error);
  }
}

// Export UI components conditionally
export const {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} = uiComponents;

export const { TokenUpdateStatus, TokenUpdateConfigComponent } = tokenComponents;
export const { WalletModal, WalletPage } = walletUIComponents;
