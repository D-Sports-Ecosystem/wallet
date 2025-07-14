import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DSportsWallet } from '../../core/wallet';
import { 
  WalletUIContextType, 
  WalletUIContextProps,
  WalletStoreType,
  InventoryItem,
  UserSession, 
  TokenBalance, 
  NFTAsset, 
  GameInventoryItem,
  CreateWalletConfig,
  ImportWalletConfig,
  ToastProps,
  ModalProps
} from '../types';
import { 
  WalletAccount, 
  WalletTheme,
  WalletConnector 
} from '../../types';
import {
  useAuth,
  useNavigation,
  useServerActions,
  usePlatform,
  useWalletActions,
  type AuthHookConfig,
  type NavigationHookConfig,
  type ServerActionsHookConfig,
  type PlatformHookConfig,
  type WalletActionsHookConfig,
} from '../hooks';

// Create the context
const WalletUIContext = createContext<WalletUIContextType | undefined>(undefined);

// Default implementations that can be overridden
const defaultImplementations = {
  fetchTokens: async (): Promise<TokenBalance[]> => {
    // Default implementation - returns empty array
    // Host applications should provide their own implementation
    console.warn('fetchTokens not implemented. Please provide your own implementation via WalletUIProvider.');
    return [];
  },

  fetchNFTs: async (): Promise<NFTAsset[]> => {
    // Default implementation - returns empty array
    console.warn('fetchNFTs not implemented. Please provide your own implementation via WalletUIProvider.');
    return [];
  },

  fetchInventory: async (): Promise<GameInventoryItem[]> => {
    // Default implementation - returns empty array
    console.warn('fetchInventory not implemented. Please provide your own implementation via WalletUIProvider.');
    return [];
  },

  createWallet: async (config: CreateWalletConfig): Promise<WalletAccount> => {
    // Default implementation - throws error
    console.error('createWallet not implemented. Please provide your own implementation via WalletUIProvider.');
    throw new Error('createWallet not implemented');
  },

  importWallet: async (config: ImportWalletConfig): Promise<WalletAccount> => {
    // Default implementation - throws error
    console.error('importWallet not implemented. Please provide your own implementation via WalletUIProvider.');
    throw new Error('importWallet not implemented');
  },

  showToast: (props: Omit<ToastProps, 'onClose'>) => {
    // Default implementation - console log
    console.log(`Toast: [${props.type || 'info'}] ${props.message}`);
  },

  showModal: (content: ReactNode, props?: Partial<ModalProps>) => {
    // Default implementation - console log
    console.log('Modal requested:', { content, props });
  },

  closeModal: () => {
    // Default implementation - console log
    console.log('Close modal requested');
  }
};

/**
 * Props for the WalletUIProvider component.
 * 
 * This interface defines all the configuration options available for customizing
 * the wallet UI behavior, including hook overrides, data fetching functions,
 * and UI state management.
 */
export interface WalletUIProviderProps {
  /** React children to render within the provider context */
  children: ReactNode;
  
  /** The DSportsWallet instance to use for wallet operations */
  wallet: DSportsWallet;
  
  /** Optional theme configuration for customizing the UI appearance */
  theme?: WalletTheme;
  
  /** Optional user session data including wallet and user information */
  session?: UserSession;
  
  // Optional overrides for default implementations
  
  /** 
   * Custom function to fetch token balances.
   * Should return an array of TokenBalance objects.
   * If not provided, a default implementation that returns empty array will be used.
   */
  fetchTokens?: () => Promise<TokenBalance[]>;
  
  /** 
   * Custom function to fetch NFT assets.
   * Should return an array of NFTAsset objects.
   * If not provided, a default implementation that returns empty array will be used.
   */
  fetchNFTs?: () => Promise<NFTAsset[]>;
  
  /** 
   * Custom function to fetch game inventory items.
   * Should return an array of GameInventoryItem objects.
   * If not provided, a default implementation that returns empty array will be used.
   */
  fetchInventory?: () => Promise<GameInventoryItem[]>;
  
  /** 
   * Custom function to create a new wallet.
   * Should return a WalletAccount object.
   * If not provided, a default implementation that throws an error will be used.
   */
  createWallet?: (config: CreateWalletConfig) => Promise<WalletAccount>;
  
  /** 
   * Custom function to import an existing wallet.
   * Should return a WalletAccount object.
   * If not provided, a default implementation that throws an error will be used.
   */
  importWallet?: (config: ImportWalletConfig) => Promise<WalletAccount>;
  
  /** 
   * Custom function to display toast notifications.
   * If not provided, messages will be logged to console.
   */
  showToast?: (props: Omit<ToastProps, 'onClose'>) => void;
  
  /** 
   * Custom function to show modal dialogs.
   * If not provided, modal requests will be logged to console.
   */
  showModal?: (content: ReactNode, props?: Partial<ModalProps>) => void;
  
  /** 
   * Custom function to close modal dialogs.
   * If not provided, close requests will be logged to console.
   */
  closeModal?: () => void;
  
  /** 
   * Additional function for creating user wallets.
   * This is for compatibility with specific application interfaces.
   */
  createUserWallet?: (args: any) => Promise<void>;
  
  // Hook configurations - allow host apps to customize hook behavior
  
  /** Configuration options for the authentication hook */
  authConfig?: AuthHookConfig;
  
  /** Configuration options for the navigation hook */
  navigationConfig?: NavigationHookConfig;
  
  /** Configuration options for the server actions hook */
  serverActionsConfig?: ServerActionsHookConfig;
  
  /** Configuration options for the platform features hook */
  platformConfig?: PlatformHookConfig;
  
  /** Configuration options for the wallet actions hook */
  walletActionsConfig?: WalletActionsHookConfig;
  
  // Hook overrides - allow host apps to completely replace hook implementations
  
  /** Custom authentication hook implementation */
  useCustomAuth?: typeof useAuth;
  
  /** Custom navigation hook implementation */
  useCustomNavigation?: typeof useNavigation;
  
  /** Custom server actions hook implementation */
  useCustomServerActions?: typeof useServerActions;
  
  /** Custom platform features hook implementation */
  useCustomPlatform?: typeof usePlatform;
  
  /** Custom wallet actions hook implementation */
  useCustomWalletActions?: typeof useWalletActions;
}

/**
 * WalletUIProvider - The main context provider for the D-Sports Wallet UI components.
 * 
 * This component provides a comprehensive context for wallet operations, user sessions,
 * theming, and injectable hooks. It serves as the foundation for all wallet UI components
 * and allows for extensive customization through dependency injection.
 * 
 * @example
 * ```tsx
 * import { WalletUIProvider, WalletDashboard } from '@d-sports/wallet';
 * 
 * function App() {
 *   return (
 *     <WalletUIProvider 
 *       wallet={wallet}
 *       session={userSession}
 *       fetchTokens={async () => {
 *         const response = await fetch('/api/tokens');
 *         return response.json();
 *       }}
 *     >
 *       <WalletDashboard />
 *     </WalletUIProvider>
 *   );
 * }
 * ```
 * 
 * @param props - Configuration props for the provider
 * @returns A React context provider that wraps children with wallet functionality
 */
export const WalletUIProvider: React.FC<WalletUIProviderProps> = ({
  children,
  wallet,
  theme,
  session,
  fetchTokens = defaultImplementations.fetchTokens,
  fetchNFTs = defaultImplementations.fetchNFTs,
  fetchInventory = defaultImplementations.fetchInventory,
  createWallet = defaultImplementations.createWallet,
  importWallet = defaultImplementations.importWallet,
  showToast = defaultImplementations.showToast,
  showModal = defaultImplementations.showModal,
  closeModal = defaultImplementations.closeModal,
  createUserWallet,
  
  // Hook configurations
  authConfig = {},
  navigationConfig = {},
  serverActionsConfig = {},
  platformConfig = {},
  walletActionsConfig = {},
  
  // Hook overrides
  useCustomAuth,
  useCustomNavigation,
  useCustomServerActions,
  useCustomPlatform,
  useCustomWalletActions,
}) => {
  const [walletState, setWalletState] = useState(() => {
    try {
      return wallet?.getState() || {
        isConnecting: false,
        isReconnecting: false,
        isDisconnected: true,
      };
    } catch {
      return {
        isConnecting: false,
        isReconnecting: false,
        isDisconnected: true,
      };
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  // Listen to wallet state changes
  useEffect(() => {
    if (!wallet) return;

    const handleStateChange = () => {
      try {
        setWalletState(wallet.getState());
      } catch (err) {
        console.warn('Error getting wallet state:', err);
      }
    };

    const handleError = (err: Error) => {
      setError(err);
    };

    try {
      if (typeof wallet.on === 'function') {
        wallet.on('connect', handleStateChange);
        wallet.on('disconnect', handleStateChange);
        wallet.on('accountsChanged', handleStateChange);
        wallet.on('chainChanged', handleStateChange);
        wallet.on('error', handleError);
      }
    } catch (err) {
      console.warn('Error setting up wallet listeners:', err);
    }

    return () => {
      try {
        if (typeof wallet.off === 'function') {
          wallet.off('connect', handleStateChange);
          wallet.off('disconnect', handleStateChange);
          wallet.off('accountsChanged', handleStateChange);
          wallet.off('chainChanged', handleStateChange);
          wallet.off('error', handleError);
        }
      } catch (err) {
        console.warn('Error cleaning up wallet listeners:', err);
      }
    };
  }, [wallet]);

  // Enhanced wallet functions with loading states
  const enhancedConnect = async (connectorId: string, config?: any): Promise<WalletAccount> => {
    setIsLoading(true);
    setError(undefined);
    try {
      const account = await wallet.connect(connectorId, config);
      return account;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const enhancedDisconnect = async (): Promise<void> => {
    setIsLoading(true);
    setError(undefined);
    try {
      await wallet.disconnect();
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const enhancedSwitchChain = async (chainId: number): Promise<void> => {
    setIsLoading(true);
    setError(undefined);
    try {
      await wallet.switchChain(chainId);
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const enhancedCreateWallet = async (config: CreateWalletConfig): Promise<WalletAccount> => {
    setIsLoading(true);
    setError(undefined);
    try {
      const account = await createWallet(config);
      return account;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const enhancedImportWallet = async (config: ImportWalletConfig): Promise<WalletAccount> => {
    setIsLoading(true);
    setError(undefined);
    try {
      const account = await importWallet(config);
      return account;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Create walletStore that mimics useWalletStore return type
  const walletStore: WalletStoreType = {
    isConnected: !!walletState.account?.isConnected,
    isConnecting: isLoading || walletState.isConnecting,
    account: walletState.account,
    state: walletState,
    connect: enhancedConnect,
    disconnect: enhancedDisconnect,
    switchChain: enhancedSwitchChain,
    error,
  };

  // Transform session to match requested interface
  const transformedSession = session?.user ? { id: session.user.id } : null;

  // Simple default hooks implementation
  const defaultHooks = {
    auth: { session: null, isLoading: false, error: null, actions: {} },
    navigation: { isReady: false, state: { pathname: '/' }, actions: {} },
    serverActions: { isLoading: false, actions: {} },
    platform: { features: {}, actions: {} },
    walletActions: { isLoading: false, connectedAccount: null, actions: {} },
  };

  const contextValue: WalletUIContextType = {
    // Wallet functions
    connect: enhancedConnect,
    disconnect: enhancedDisconnect,
    switchChain: enhancedSwitchChain,
    
    // Wallet creation/import
    createWallet: enhancedCreateWallet,
    importWallet: enhancedImportWallet,
    
    // Data fetching
    fetchTokens,
    fetchNFTs,
    fetchInventory,
    
    // Session management
    session,
    
    // UI state
    theme,
    isLoading,
    error,
    
    // Notifications
    showToast,
    
    // Modal management
    showModal,
    closeModal,
    
    // Additional props for the requested interface
    walletStore,
    createUserWallet,
    
    // Injectable hooks - exposed for advanced usage
    hooks: defaultHooks,
  };

  return (
    <WalletUIContext.Provider value={contextValue}>
      {children}
    </WalletUIContext.Provider>
  );
};

/**
 * Hook to access the full wallet UI context.
 * 
 * This is the primary hook for accessing all wallet UI functionality including
 * wallet operations, data fetching, theming, and injectable hooks.
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { 
 *     connect, 
 *     disconnect, 
 *     fetchTokens, 
 *     showToast,
 *     session,
 *     theme 
 *   } = useWalletUI();
 *   
 *   const handleConnect = async () => {
 *     try {
 *       await connect('metamask');
 *       showToast({ message: 'Connected successfully!', type: 'success' });
 *     } catch (error) {
 *       showToast({ message: 'Connection failed', type: 'error' });
 *     }
 *   };
 *   
 *   return <button onClick={handleConnect}>Connect Wallet</button>;
 * }
 * ```
 * 
 * @throws {Error} When used outside of WalletUIProvider
 * @returns The complete wallet UI context object
 */
export const useWalletUI = (): WalletUIContextType => {
  const context = useContext(WalletUIContext);
  if (context === undefined) {
    throw new Error('useWalletUI must be used within a WalletUIProvider');
  }
  return context;
};

/**
 * Hook to access a simplified wallet UI context interface.
 * 
 * This hook provides a streamlined interface for accessing wallet store,
 * session data, and core functionality with a more specific type contract.
 * 
 * @example
 * ```tsx
 * function WalletInfo() {
 *   const { walletStore, session } = useWalletUIContext();
 *   
 *   if (!walletStore.isConnected) {
 *     return <div>Wallet not connected</div>;
 *   }
 *   
 *   return (
 *     <div>
 *       <p>User: {session?.id}</p>
 *       <p>Address: {walletStore.account?.address}</p>
 *     </div>
 *   );
 * }
 * ```
 * 
 * @returns Simplified wallet UI context with specific interface
 */
export const useWalletUIContext = (): WalletUIContextProps => {
  const context = useWalletUI();
  
  // Transform session to match requested interface
  const transformedSession = context.session?.user ? { id: context.session.user.id } : null;
  
  return {
    walletStore: context.walletStore,
    session: transformedSession,
    createUserWallet: context.createUserWallet,
    fetchInventory: context.fetchInventory as (() => Promise<InventoryItem[]>) | undefined,
  };
};

/**
 * Hook for wallet-specific operations and state.
 * 
 * This hook provides focused access to wallet connection state, operations,
 * and error handling without the full context overhead.
 * 
 * @example
 * ```tsx
 * function WalletControls() {
 *   const { 
 *     wallet, 
 *     isConnected, 
 *     isConnecting, 
 *     connect, 
 *     disconnect, 
 *     error 
 *   } = useWallet();
 *   
 *   if (isConnecting) {
 *     return <div>Connecting...</div>;
 *   }
 *   
 *   if (error) {
 *     return <div>Error: {error.message}</div>;
 *   }
 *   
 *   return (
 *     <div>
 *       {isConnected ? (
 *         <button onClick={disconnect}>Disconnect</button>
 *       ) : (
 *         <button onClick={() => connect('metamask')}>Connect</button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 * 
 * @returns Object containing wallet state and operations
 */
export const useWallet = () => {
  const context = useWalletUI();
  const wallet = context.session?.wallet;
  
  return {
    wallet,
    isConnected: !!wallet?.isConnected,
    isConnecting: context.isLoading,
    connect: context.connect,
    disconnect: context.disconnect,
    switchChain: context.switchChain,
    createWallet: context.createWallet,
    importWallet: context.importWallet,
    error: context.error,
  };
};

/**
 * Hook for managing wallet data (tokens, NFTs, inventory) with loading states.
 * 
 * This hook provides state management for wallet data fetching operations
 * including loading states, error handling, and refresh functionality.
 * 
 * @example
 * ```tsx
 * function TokenList() {
 *   const { 
 *     tokens, 
 *     isLoading, 
 *     error, 
 *     refreshTokens 
 *   } = useWalletData();
 *   
 *   if (isLoading) {
 *     return <div>Loading tokens...</div>;
 *   }
 *   
 *   if (error) {
 *     return (
 *       <div>
 *         Error loading tokens: {error.message}
 *         <button onClick={refreshTokens}>Retry</button>
 *       </div>
 *     );
 *   }
 *   
 *   return (
 *     <div>
 *       {tokens.map(token => (
 *         <div key={token.symbol}>
 *           {token.balance} {token.symbol}
 *         </div>
 *       ))}
 *       <button onClick={refreshTokens}>Refresh</button>
 *     </div>
 *   );
 * }
 * ```
 * 
 * @returns Object containing wallet data, loading states, and refresh functions
 */
export const useWalletData = () => {
  const context = useWalletUI();
  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [nfts, setNFTs] = useState<NFTAsset[]>([]);
  const [inventory, setInventory] = useState<GameInventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  const refreshTokens = async () => {
    setIsLoading(true);
    setError(undefined);
    try {
      const fetchedTokens = await context.fetchTokens();
      setTokens(fetchedTokens);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshNFTs = async () => {
    setIsLoading(true);
    setError(undefined);
    try {
      const fetchedNFTs = await context.fetchNFTs();
      setNFTs(fetchedNFTs);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshInventory = async () => {
    setIsLoading(true);
    setError(undefined);
    try {
      const fetchedInventory = await context.fetchInventory();
      setInventory(fetchedInventory);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAll = async () => {
    setIsLoading(true);
    setError(undefined);
    try {
      const [fetchedTokens, fetchedNFTs, fetchedInventory] = await Promise.all([
        context.fetchTokens(),
        context.fetchNFTs(),
        context.fetchInventory(),
      ]);
      setTokens(fetchedTokens);
      setNFTs(fetchedNFTs);
      setInventory(fetchedInventory);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    tokens,
    nfts,
    inventory,
    isLoading,
    error,
    refreshTokens,
    refreshNFTs,
    refreshInventory,
    refreshAll,
  };
};

export default WalletUIProvider;
