import React, { useState, useEffect } from 'react';
import { DSportsWallet } from '../core/wallet';
import { SocialLoginProvider } from '../providers/social-login';
import { DSportsRainbowKitConnector, createDSportsRainbowKitConnector } from '../connectors/rainbow-kit';
import { DSportsWagmiConnector, createDSportsWagmiConnector, dsportsWagmiConnector } from '../connectors/wagmi';
import { reactNativePlatformAdapter } from '../utils/platform-adapters';
import { 
  WalletConfig, 
  DSportsWalletOptions, 
  RainbowKitConnectorOptions, 
  WagmiConnectorOptions,
  Chain
} from '../types';

// React Native specific wallet factory
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

  const wallet = new DSportsWallet(config, reactNativePlatformAdapter);

  // Add social login provider if configured
  if (options.socialLogin) {
    const socialProvider = new SocialLoginProvider(options.socialLogin, reactNativePlatformAdapter);
    
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

// React Native specific Rainbow Kit connector factory
export function createDSportsRainbowKitConnectorForReactNative(options: RainbowKitConnectorOptions) {
  const socialProvider = options.socialLogin ? 
    new SocialLoginProvider(options.socialLogin, reactNativePlatformAdapter) : 
    undefined;

  return createDSportsRainbowKitConnector({
    ...options,
    socialLoginProvider: socialProvider
  });
}

// React Native specific Wagmi connector factory
export function createDSportsWagmiConnectorForReactNative(options: WagmiConnectorOptions) {
  const socialProvider = options.socialLogin ? 
    new SocialLoginProvider(options.socialLogin, reactNativePlatformAdapter) : 
    undefined;

  return createDSportsWagmiConnector({
    ...options,
    socialLoginProvider: socialProvider
  });
}

// React Native specific Wagmi v2 connector
export function dsportsWagmiConnectorForReactNative(options: WagmiConnectorOptions) {
  const socialProvider = options.socialLogin ? 
    new SocialLoginProvider(options.socialLogin, reactNativePlatformAdapter) : 
    undefined;

  return dsportsWagmiConnector({
    ...options,
    socialLoginProvider: socialProvider
  });
}

// React Native Hooks
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

// React Native Social Login Hook
export function useSocialLogin(socialProvider: SocialLoginProvider) {
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

// React Native specific utilities
export function withDSportsWallet<T extends object>(
  Component: React.ComponentType<T>,
  walletOptions: DSportsWalletOptions
) {
  return function WrappedComponent(props: T) {
    const wallet = createDSportsWallet(walletOptions);
    return React.createElement(Component, { ...props, wallet });
  };
}

// React Native Deep Linking utilities
export function handleDeepLink(url: string, wallet: DSportsWallet) {
  const parsedUrl = new URL(url);
  
  if (parsedUrl.protocol === 'dsports:' && parsedUrl.pathname === '/wallet/connect') {
    // Handle wallet connection deep link
    const params = new URLSearchParams(parsedUrl.search);
    const connectorId = params.get('connector');
    
    if (connectorId) {
      return wallet.connect(connectorId);
    }
  }
  
  return null;
}

// React Native Keychain utilities
export async function storeSecureData(key: string, value: string): Promise<boolean> {
  try {
    const Keychain = require('react-native-keychain');
    await Keychain.setInternetCredentials(key, key, value);
    return true;
  } catch {
    return false;
  }
}

export async function getSecureData(key: string): Promise<string | null> {
  try {
    const Keychain = require('react-native-keychain');
    const credentials = await Keychain.getInternetCredentials(key);
    return credentials ? credentials.password : null;
  } catch {
    return null;
  }
}

export async function removeSecureData(key: string): Promise<boolean> {
  try {
    const Keychain = require('react-native-keychain');
    await Keychain.resetInternetCredentials(key);
    return true;
  } catch {
    return false;
  }
}

// React Native URL polyfill setup
export function setupURLPolyfill() {
  try {
    require('react-native-url-polyfill/auto');
  } catch {
    // Polyfill not available, URL might not work properly
    console.warn('react-native-url-polyfill not available. URL parsing may not work correctly.');
  }
}

// Re-export common types and utilities
export * from '../types';
export * from '../core/wallet';
export * from '../providers/social-login';
export { reactNativePlatformAdapter };

// Common chains for React Native
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

export const polygon: Chain = {
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

export const bsc: Chain = {
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