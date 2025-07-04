import { useState, useEffect, useCallback, useRef } from 'react';
import { ServerActions, ServerActionsHookConfig } from './types';

/**
 * Injectable server actions hook that abstracts API routes and server interactions.
 * Host applications can override this to use their own API implementation
 * (e.g., Next.js API routes, tRPC, GraphQL, REST APIs, etc.)
 */
export function useServerActions(config: ServerActionsHookConfig = {}): {
  actions: ServerActions;
  isLoading: boolean;
  error: Error | null;
  cache: Map<string, { data: any; timestamp: number }>;
  clearCache: () => void;
} {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const cacheRef = useRef(new Map<string, { data: any; timestamp: number }>());

  // Cache utilities
  const getCacheKey = (action: string, params: any) => {
    return `${action}:${JSON.stringify(params)}`;
  };

  const getCachedData = (key: string) => {
    if (!config.enableCaching) return null;
    
    const cached = cacheRef.current.get(key);
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > (config.cacheTimeout || 5 * 60 * 1000); // 5 minutes default
    if (isExpired) {
      cacheRef.current.delete(key);
      return null;
    }
    
    return cached.data;
  };

  const setCachedData = (key: string, data: any) => {
    if (!config.enableCaching) return;
    cacheRef.current.set(key, { data, timestamp: Date.now() });
  };

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  // Default fetch implementation
  const defaultFetch = async (endpoint: string, options: RequestInit = {}) => {
    const url = config.baseURL ? `${config.baseURL}${endpoint}` : endpoint;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.defaultHeaders,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, config.timeout || 10000); // 10 seconds default

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  };

  // Default no-op implementations
  const defaultActions: ServerActions = {
    createWallet: async (walletConfig: any): Promise<any> => {
      console.warn('useServerActions.createWallet not implemented. Please provide your own implementation.');
      
      // Demo implementation - returns mock wallet
      const mockWallet = {
        id: 'wallet-' + Date.now(),
        address: '0x' + Math.random().toString(16).substr(2, 40),
        type: walletConfig.method || 'social',
        chainId: walletConfig.chainId || 1,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      
      console.log('Demo: Would create wallet with config:', walletConfig);
      console.log('Demo: Mock wallet created:', mockWallet);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return mockWallet;
    },

    importWallet: async (importConfig: any): Promise<any> => {
      console.warn('useServerActions.importWallet not implemented. Please provide your own implementation.');
      
      // Demo implementation - returns mock imported wallet
      const mockWallet = {
        id: 'imported-wallet-' + Date.now(),
        address: '0x' + Math.random().toString(16).substr(2, 40),
        type: importConfig.method || 'private-key',
        chainId: 1,
        isActive: true,
        importedAt: new Date().toISOString(),
      };
      
      console.log('Demo: Would import wallet with config:', importConfig);
      console.log('Demo: Mock wallet imported:', mockWallet);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return mockWallet;
    },

    fetchTokens: async (walletAddress: string): Promise<any[]> => {
      console.warn('useServerActions.fetchTokens not implemented. Please provide your own implementation.');
      
      const cacheKey = getCacheKey('fetchTokens', { walletAddress });
      const cached = getCachedData(cacheKey);
      if (cached) {
        console.log('Demo: Returning cached tokens');
        return cached;
      }
      
      // Demo implementation - returns mock tokens
      const mockTokens = [
        {
          symbol: 'ETH',
          name: 'Ethereum',
          balance: (Math.random() * 10).toFixed(4),
          decimals: 18,
          value: (Math.random() * 10000).toFixed(2),
          price: (1500 + Math.random() * 500).toFixed(2),
          logoUri: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
        },
        {
          symbol: 'USDC',
          name: 'USD Coin',
          balance: (Math.random() * 1000).toFixed(2),
          decimals: 6,
          value: (Math.random() * 1000).toFixed(2),
          price: '1.00',
          logoUri: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
        },
      ];
      
      console.log('Demo: Fetching tokens for address:', walletAddress);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setCachedData(cacheKey, mockTokens);
      return mockTokens;
    },

    fetchNFTs: async (walletAddress: string): Promise<any[]> => {
      console.warn('useServerActions.fetchNFTs not implemented. Please provide your own implementation.');
      
      const cacheKey = getCacheKey('fetchNFTs', { walletAddress });
      const cached = getCachedData(cacheKey);
      if (cached) {
        console.log('Demo: Returning cached NFTs');
        return cached;
      }
      
      // Demo implementation - returns mock NFTs
      const mockNFTs = [
        {
          id: 'nft-' + Date.now(),
          name: 'Demo NFT #' + Math.floor(Math.random() * 1000),
          description: 'A demo NFT for testing purposes',
          image: `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 1000)}`,
          collection: 'Demo Collection',
          contractAddress: '0x' + Math.random().toString(16).substr(2, 40),
          tokenId: Math.floor(Math.random() * 10000).toString(),
          attributes: [
            { trait_type: 'Rarity', value: 'Rare' },
            { trait_type: 'Background', value: 'Blue' },
          ],
        },
      ];
      
      console.log('Demo: Fetching NFTs for address:', walletAddress);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setCachedData(cacheKey, mockNFTs);
      return mockNFTs;
    },

    fetchInventory: async (userId: string): Promise<any[]> => {
      console.warn('useServerActions.fetchInventory not implemented. Please provide your own implementation.');
      
      const cacheKey = getCacheKey('fetchInventory', { userId });
      const cached = getCachedData(cacheKey);
      if (cached) {
        console.log('Demo: Returning cached inventory');
        return cached;
      }
      
      // Demo implementation - returns mock inventory
      const mockInventory = [
        {
          id: 'item-' + Date.now(),
          name: 'Demo Sword',
          description: 'A powerful demo sword',
          image: `https://picsum.photos/200/200?random=${Math.floor(Math.random() * 1000)}`,
          game: 'Demo Game',
          category: 'Weapon',
          rarity: 'Epic',
          level: Math.floor(Math.random() * 50) + 1,
          attributes: {
            attack: Math.floor(Math.random() * 100) + 50,
            durability: Math.floor(Math.random() * 100) + 50,
          },
          isEquipped: Math.random() > 0.5,
          isTransferable: true,
        },
      ];
      
      console.log('Demo: Fetching inventory for user:', userId);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 900));
      
      setCachedData(cacheKey, mockInventory);
      return mockInventory;
    },

    sendTransaction: async (txData: any): Promise<any> => {
      console.warn('useServerActions.sendTransaction not implemented. Please provide your own implementation.');
      
      // Demo implementation - returns mock transaction
      const mockTx = {
        hash: '0x' + Math.random().toString(16).substr(2, 64),
        status: 'pending',
        blockNumber: null,
        gasUsed: Math.floor(Math.random() * 100000) + 21000,
        timestamp: new Date().toISOString(),
      };
      
      console.log('Demo: Sending transaction:', txData);
      console.log('Demo: Mock transaction:', mockTx);
      
      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return { ...mockTx, status: 'confirmed', blockNumber: Math.floor(Math.random() * 1000000) };
    },

    getWalletBalance: async (walletAddress: string): Promise<any> => {
      console.warn('useServerActions.getWalletBalance not implemented. Please provide your own implementation.');
      
      const cacheKey = getCacheKey('getWalletBalance', { walletAddress });
      const cached = getCachedData(cacheKey);
      if (cached) {
        console.log('Demo: Returning cached balance');
        return cached;
      }
      
      // Demo implementation - returns mock balance
      const mockBalance = {
        address: walletAddress,
        balance: (Math.random() * 10).toFixed(6),
        balanceUSD: (Math.random() * 10000).toFixed(2),
        lastUpdated: new Date().toISOString(),
      };
      
      console.log('Demo: Getting balance for address:', walletAddress);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setCachedData(cacheKey, mockBalance);
      return mockBalance;
    },
  };

  // Enhanced actions with loading and error handling
  const enhancedActions: ServerActions = {
    createWallet: useCallback(async (walletConfig: any) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await defaultActions.createWallet(walletConfig);
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        config.onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    }, []),

    importWallet: useCallback(async (importConfig: any) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await defaultActions.importWallet(importConfig);
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        config.onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    }, []),

    fetchTokens: useCallback(async (walletAddress: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await defaultActions.fetchTokens(walletAddress);
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        config.onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    }, []),

    fetchNFTs: useCallback(async (walletAddress: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await defaultActions.fetchNFTs(walletAddress);
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        config.onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    }, []),

    fetchInventory: useCallback(async (userId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await defaultActions.fetchInventory(userId);
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        config.onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    }, []),

    sendTransaction: useCallback(async (txData: any) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await defaultActions.sendTransaction(txData);
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        config.onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    }, []),

    getWalletBalance: useCallback(async (walletAddress: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await defaultActions.getWalletBalance(walletAddress);
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        config.onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    }, []),
  };

  return {
    actions: enhancedActions,
    isLoading,
    error,
    cache: cacheRef.current,
    clearCache,
  };
}

/**
 * Factory function to create a custom useServerActions hook with host-specific implementations
 */
export function createServerActionsHook(customActions: Partial<ServerActions>) {
  return function useCustomServerActions(config: ServerActionsHookConfig = {}) {
    const defaultHook = useServerActions(config);
    
    // Override default actions with custom implementations
    const mergedActions: ServerActions = {
      ...defaultHook.actions,
      ...customActions,
    };

    return {
      ...defaultHook,
      actions: mergedActions,
    };
  };
}
