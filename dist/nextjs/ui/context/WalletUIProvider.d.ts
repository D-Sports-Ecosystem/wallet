import React, { ReactNode } from 'react';
import { DSportsWallet } from '../../core/wallet';
import { WalletUIContextType, WalletUIContextProps, UserSession, TokenBalance, NFTAsset, GameInventoryItem, CreateWalletConfig, ImportWalletConfig, ToastProps, ModalProps } from '../types';
import { WalletAccount, WalletTheme } from '../../types';
import { useAuth, useNavigation, useServerActions, usePlatform, useWalletActions, type AuthHookConfig, type NavigationHookConfig, type ServerActionsHookConfig, type PlatformHookConfig, type WalletActionsHookConfig } from '../hooks';
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
export declare const WalletUIProvider: React.FC<WalletUIProviderProps>;
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
export declare const useWalletUI: () => WalletUIContextType;
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
export declare const useWalletUIContext: () => WalletUIContextProps;
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
export declare const useWallet: () => {
    wallet: WalletAccount | undefined;
    isConnected: boolean;
    isConnecting: boolean;
    connect: (connectorId: string, config?: any) => Promise<WalletAccount>;
    disconnect: () => Promise<void>;
    switchChain: (chainId: number) => Promise<void>;
    createWallet: (config: CreateWalletConfig) => Promise<WalletAccount>;
    importWallet: (config: ImportWalletConfig) => Promise<WalletAccount>;
    error: Error | undefined;
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
export declare const useWalletData: () => {
    tokens: TokenBalance[];
    nfts: NFTAsset[];
    inventory: GameInventoryItem[];
    isLoading: boolean;
    error: Error | undefined;
    refreshTokens: () => Promise<void>;
    refreshNFTs: () => Promise<void>;
    refreshInventory: () => Promise<void>;
    refreshAll: () => Promise<void>;
};
export default WalletUIProvider;
//# sourceMappingURL=WalletUIProvider.d.ts.map