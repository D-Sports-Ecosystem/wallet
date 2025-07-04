import React, { ReactNode } from 'react';
import { DSportsWallet } from '../../core/wallet';
import { WalletUIContextType, WalletUIContextProps, UserSession, TokenBalance, NFTAsset, GameInventoryItem, CreateWalletConfig, ImportWalletConfig, ToastProps, ModalProps } from '../types';
import { WalletAccount, WalletTheme } from '../../types';
import { useAuth, useNavigation, useServerActions, usePlatform, useWalletActions, type AuthHookConfig, type NavigationHookConfig, type ServerActionsHookConfig, type PlatformHookConfig, type WalletActionsHookConfig } from '../hooks';
export interface WalletUIProviderProps {
    children: ReactNode;
    wallet: DSportsWallet;
    theme?: WalletTheme;
    session?: UserSession;
    fetchTokens?: () => Promise<TokenBalance[]>;
    fetchNFTs?: () => Promise<NFTAsset[]>;
    fetchInventory?: () => Promise<GameInventoryItem[]>;
    createWallet?: (config: CreateWalletConfig) => Promise<WalletAccount>;
    importWallet?: (config: ImportWalletConfig) => Promise<WalletAccount>;
    showToast?: (props: Omit<ToastProps, 'onClose'>) => void;
    showModal?: (content: ReactNode, props?: Partial<ModalProps>) => void;
    closeModal?: () => void;
    createUserWallet?: (args: any) => Promise<void>;
    authConfig?: AuthHookConfig;
    navigationConfig?: NavigationHookConfig;
    serverActionsConfig?: ServerActionsHookConfig;
    platformConfig?: PlatformHookConfig;
    walletActionsConfig?: WalletActionsHookConfig;
    useCustomAuth?: typeof useAuth;
    useCustomNavigation?: typeof useNavigation;
    useCustomServerActions?: typeof useServerActions;
    useCustomPlatform?: typeof usePlatform;
    useCustomWalletActions?: typeof useWalletActions;
}
export declare const WalletUIProvider: React.FC<WalletUIProviderProps>;
export declare const useWalletUI: () => WalletUIContextType;
export declare const useWalletUIContext: () => WalletUIContextProps;
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