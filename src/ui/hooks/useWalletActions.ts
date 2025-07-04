import { useState, useCallback } from 'react';
import { WalletActionsHookConfig } from './types';

/**
 * Injectable wallet actions hook that abstracts wallet-specific operations.
 * Host applications can override this to use their own wallet implementation
 * (e.g., different wallet providers, custom wallet creation logic, etc.)
 */
export function useWalletActions(config: WalletActionsHookConfig = {}): {
  actions: {
    createUserWallet: (args: any) => Promise<any>;
    importUserWallet: (args: any) => Promise<any>;
    connectWallet: (connectorId: string, options?: any) => Promise<any>;
    disconnectWallet: () => Promise<void>;
    switchChain: (chainId: number) => Promise<void>;
    signMessage: (message: string) => Promise<string>;
    sendTransaction: (txData: any) => Promise<any>;
  };
  isLoading: boolean;
  error: Error | null;
  connectedAccount: any;
} {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [connectedAccount, setConnectedAccount] = useState<any>(null);

  // Default no-op implementations
  const defaultActions = {
    createUserWallet: async (args: any): Promise<any> => {
      console.warn('useWalletActions.createUserWallet not implemented. Please provide your own implementation.');
      
      // Demo implementation - returns mock wallet
      const mockWallet = {
        id: 'user-wallet-' + Date.now(),
        address: '0x' + Math.random().toString(16).substr(2, 40),
        type: args.method || 'social',
        provider: args.provider || 'demo',
        chainId: args.chainId || config.defaultChainId || 1,
        isConnected: true,
        createdAt: new Date().toISOString(),
        metadata: {
          name: args.name || 'Demo Wallet',
          description: 'A demo wallet created for testing',
        },
      };
      
      console.log('Demo: Creating user wallet with args:', args);
      console.log('Demo: Mock wallet created:', mockWallet);
      
      // Simulate wallet creation process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setConnectedAccount(mockWallet);
      config.onConnect?.(mockWallet);
      
      // Store in localStorage if enabled
      if (config.enableLocalStorage && typeof window !== 'undefined') {
        const storageKey = config.storageKey || 'dsports-wallet';
        localStorage.setItem(storageKey, JSON.stringify(mockWallet));
      }
      
      return mockWallet;
    },

    importUserWallet: async (args: any): Promise<any> => {
      console.warn('useWalletActions.importUserWallet not implemented. Please provide your own implementation.');
      
      // Demo implementation - returns mock imported wallet
      const mockWallet = {
        id: 'imported-wallet-' + Date.now(),
        address: '0x' + Math.random().toString(16).substr(2, 40),
        type: args.method || 'private-key',
        chainId: config.defaultChainId || 1,
        isConnected: true,
        importedAt: new Date().toISOString(),
        metadata: {
          name: 'Imported Wallet',
          description: 'A wallet imported from external source',
        },
      };
      
      console.log('Demo: Importing wallet with args:', args);
      console.log('Demo: Mock wallet imported:', mockWallet);
      
      // Simulate wallet import process
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setConnectedAccount(mockWallet);
      config.onConnect?.(mockWallet);
      
      // Store in localStorage if enabled
      if (config.enableLocalStorage && typeof window !== 'undefined') {
        const storageKey = config.storageKey || 'dsports-wallet';
        localStorage.setItem(storageKey, JSON.stringify(mockWallet));
      }
      
      return mockWallet;
    },

    connectWallet: async (connectorId: string, options?: any): Promise<any> => {
      console.warn('useWalletActions.connectWallet not implemented. Please provide your own implementation.');
      
      // Demo implementation - returns mock connected wallet
      const mockWallet = {
        id: 'connected-wallet-' + Date.now(),
        address: '0x' + Math.random().toString(16).substr(2, 40),
        connectorId,
        chainId: options?.chainId || config.defaultChainId || 1,
        isConnected: true,
        connectedAt: new Date().toISOString(),
        metadata: {
          name: `${connectorId} Wallet`,
          description: `Wallet connected via ${connectorId}`,
        },
      };
      
      console.log('Demo: Connecting wallet with connector:', connectorId, options);
      console.log('Demo: Mock wallet connected:', mockWallet);
      
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setConnectedAccount(mockWallet);
      config.onConnect?.(mockWallet);
      
      return mockWallet;
    },

    disconnectWallet: async (): Promise<void> => {
      console.warn('useWalletActions.disconnectWallet not implemented. Please provide your own implementation.');
      
      console.log('Demo: Disconnecting wallet');
      
      // Simulate disconnection process
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setConnectedAccount(null);
      config.onDisconnect?.();
      
      // Clear from localStorage if enabled
      if (config.enableLocalStorage && typeof window !== 'undefined') {
        const storageKey = config.storageKey || 'dsports-wallet';
        localStorage.removeItem(storageKey);
      }
    },

    switchChain: async (chainId: number): Promise<void> => {
      console.warn('useWalletActions.switchChain not implemented. Please provide your own implementation.');
      
      if (!connectedAccount) {
        throw new Error('No wallet connected');
      }
      
      // Check if chain is supported
      if (config.supportedChains && !config.supportedChains.includes(chainId)) {
        throw new Error(`Chain ${chainId} is not supported`);
      }
      
      console.log('Demo: Switching to chain:', chainId);
      
      // Simulate chain switch
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update connected account
      const updatedAccount = {
        ...connectedAccount,
        chainId,
        lastChainSwitch: new Date().toISOString(),
      };
      
      setConnectedAccount(updatedAccount);
      
      // Update localStorage if enabled
      if (config.enableLocalStorage && typeof window !== 'undefined') {
        const storageKey = config.storageKey || 'dsports-wallet';
        localStorage.setItem(storageKey, JSON.stringify(updatedAccount));
      }
    },

    signMessage: async (message: string): Promise<string> => {
      console.warn('useWalletActions.signMessage not implemented. Please provide your own implementation.');
      
      if (!connectedAccount) {
        throw new Error('No wallet connected');
      }
      
      console.log('Demo: Signing message:', message);
      
      // Simulate message signing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock signature
      const mockSignature = '0x' + Math.random().toString(16).substr(2, 128) + Math.random().toString(16).substr(2, 2);
      console.log('Demo: Mock signature:', mockSignature);
      
      return mockSignature;
    },

    sendTransaction: async (txData: any): Promise<any> => {
      console.warn('useWalletActions.sendTransaction not implemented. Please provide your own implementation.');
      
      if (!connectedAccount) {
        throw new Error('No wallet connected');
      }
      
      console.log('Demo: Sending transaction:', txData);
      
      // Simulate transaction sending
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Return mock transaction result
      const mockTx = {
        hash: '0x' + Math.random().toString(16).substr(2, 64),
        from: connectedAccount.address,
        to: txData.to,
        value: txData.value || '0x0',
        gasLimit: txData.gasLimit || '0x5208',
        gasPrice: txData.gasPrice || '0x9502f9000',
        nonce: Math.floor(Math.random() * 1000),
        status: 'pending',
        timestamp: new Date().toISOString(),
      };
      
      console.log('Demo: Mock transaction:', mockTx);
      
      return mockTx;
    },
  };

  // Enhanced actions with loading and error handling
  const enhancedActions = {
    createUserWallet: useCallback(async (args: any) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await defaultActions.createUserWallet(args);
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

    importUserWallet: useCallback(async (args: any) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await defaultActions.importUserWallet(args);
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

    connectWallet: useCallback(async (connectorId: string, options?: any) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await defaultActions.connectWallet(connectorId, options);
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

    disconnectWallet: useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
        await defaultActions.disconnectWallet();
      } catch (err) {
        const error = err as Error;
        setError(error);
        config.onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    }, []),

    switchChain: useCallback(async (chainId: number) => {
      setIsLoading(true);
      setError(null);
      try {
        await defaultActions.switchChain(chainId);
      } catch (err) {
        const error = err as Error;
        setError(error);
        config.onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    }, [connectedAccount]),

    signMessage: useCallback(async (message: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await defaultActions.signMessage(message);
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        config.onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    }, [connectedAccount]),

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
    }, [connectedAccount]),
  };

  return {
    actions: enhancedActions,
    isLoading,
    error,
    connectedAccount,
  };
}

/**
 * Factory function to create a custom useWalletActions hook with host-specific implementations
 */
export function createWalletActionsHook(
  customActions: Partial<ReturnType<typeof useWalletActions>['actions']>
) {
  return function useCustomWalletActions(config: WalletActionsHookConfig = {}) {
    const defaultHook = useWalletActions(config);
    
    // Override default actions with custom implementations
    const mergedActions = {
      ...defaultHook.actions,
      ...customActions,
    };

    return {
      ...defaultHook,
      actions: mergedActions,
    };
  };
}
