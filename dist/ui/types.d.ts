import { ReactNode } from 'react';
import { WalletAccount, WalletState, WalletConnector, Chain, SocialLoginResult, SocialProvider, WalletTheme } from '../types';
export interface BaseComponentProps {
    className?: string;
    children?: ReactNode;
    theme?: WalletTheme;
}
export interface UserSession {
    user?: {
        id: string;
        email?: string;
        name?: string;
        avatar?: string;
    };
    wallet?: WalletAccount;
    isAuthenticated: boolean;
    socialLoginResult?: SocialLoginResult;
}
export interface WalletContextType {
    wallet?: WalletAccount;
    state: WalletState;
    connectors: WalletConnector[];
    isConnected: boolean;
    isConnecting: boolean;
    connect: (connectorId: string, config?: any) => Promise<WalletAccount>;
    disconnect: () => Promise<void>;
    switchChain: (chainId: number) => Promise<void>;
    error?: Error;
}
export interface TokenBalance {
    symbol: string;
    name: string;
    balance: string;
    decimals: number;
    contractAddress?: string;
    logoUri?: string;
    value?: string;
    price?: string;
}
export interface NFTAsset {
    id: string;
    name: string;
    description?: string;
    image: string;
    collection: string;
    contractAddress: string;
    tokenId: string;
    attributes?: Array<{
        trait_type: string;
        value: string | number;
    }>;
}
export interface GameInventoryItem {
    id: string;
    name: string;
    description?: string;
    image: string;
    game: string;
    category: string;
    rarity?: string;
    level?: number;
    attributes?: Record<string, any>;
    isEquipped?: boolean;
    isTransferable?: boolean;
}
export interface WalletOverviewCardProps extends BaseComponentProps {
    session?: UserSession;
    totalBalance?: string;
    totalBalanceUSD?: string;
    tokenCount?: number;
    nftCount?: number;
    onViewTokens?: () => void;
    onViewNFTs?: () => void;
    onViewInventory?: () => void;
    isLoading?: boolean;
}
export interface TokenTabProps extends BaseComponentProps {
    tokens: TokenBalance[];
    isLoading?: boolean;
    onRefresh?: () => void;
    onTokenClick?: (token: TokenBalance) => void;
    onSend?: (token: TokenBalance) => void;
    onReceive?: (token: TokenBalance) => void;
    onSwap?: (token: TokenBalance) => void;
}
export interface CollectiblesTabProps extends BaseComponentProps {
    nfts: NFTAsset[];
    isLoading?: boolean;
    onRefresh?: () => void;
    onNFTClick?: (nft: NFTAsset) => void;
    onSend?: (nft: NFTAsset) => void;
    onViewDetails?: (nft: NFTAsset) => void;
}
export interface InventoryTabProps extends BaseComponentProps {
    items: GameInventoryItem[];
    isLoading?: boolean;
    onRefresh?: () => void;
    onItemClick?: (item: GameInventoryItem) => void;
    onEquip?: (item: GameInventoryItem) => void;
    onUnequip?: (item: GameInventoryItem) => void;
    onTransfer?: (item: GameInventoryItem) => void;
    fetchInventory?: () => Promise<GameInventoryItem[]>;
}
export interface CreateWalletFlowProps extends BaseComponentProps {
    onCreateWallet?: (config: CreateWalletConfig) => Promise<void>;
    onCancel?: () => void;
    onComplete?: (wallet: WalletAccount) => void;
    supportedMethods?: ('social' | 'web3' | 'email')[];
    socialProviders?: SocialProvider[];
    isLoading?: boolean;
}
export interface ImportWalletFlowProps extends BaseComponentProps {
    onImportWallet?: (config: ImportWalletConfig) => Promise<void>;
    onCancel?: () => void;
    onComplete?: (wallet: WalletAccount) => void;
    supportedMethods?: ('seed' | 'private-key' | 'keystore')[];
    isLoading?: boolean;
}
export interface DashboardProps extends BaseComponentProps {
    session?: UserSession;
    onCreateWallet?: (config: CreateWalletConfig) => Promise<void>;
    onImportWallet?: (config: ImportWalletConfig) => Promise<void>;
    onConnectWallet?: (connectorId: string) => Promise<void>;
    onDisconnect?: () => Promise<void>;
    onSwitchChain?: (chainId: number) => Promise<void>;
    fetchTokens?: () => Promise<TokenBalance[]>;
    fetchNFTs?: () => Promise<NFTAsset[]>;
    fetchInventory?: () => Promise<GameInventoryItem[]>;
    supportedChains?: Chain[];
    showCreateWallet?: boolean;
    showImportWallet?: boolean;
    defaultTab?: 'tokens' | 'collectibles' | 'inventory';
}
export interface CreateWalletConfig {
    method: 'social' | 'web3' | 'email';
    provider?: SocialProvider;
    email?: string;
    password?: string;
    connectorId?: string;
}
export interface ImportWalletConfig {
    method: 'seed' | 'private-key' | 'keystore';
    seedPhrase?: string;
    privateKey?: string;
    keystore?: string;
    password?: string;
}
export interface AnimatedContainerProps extends BaseComponentProps {
    variant?: 'fade' | 'slide' | 'scale' | 'bounce';
    duration?: number;
    delay?: number;
    isVisible?: boolean;
    onAnimationComplete?: () => void;
}
export interface LoadingStateProps extends BaseComponentProps {
    variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
    size?: 'small' | 'medium' | 'large';
    text?: string;
    overlay?: boolean;
}
export interface EmptyStateProps extends BaseComponentProps {
    title: string;
    description?: string;
    icon?: ReactNode;
    action?: {
        label: string;
        onClick: () => void;
    };
    variant?: 'default' | 'search' | 'error' | 'wallet';
}
export interface ModalProps extends BaseComponentProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    size?: 'small' | 'medium' | 'large' | 'fullscreen';
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
    showCloseButton?: boolean;
    footer?: ReactNode;
}
export interface ToastProps extends BaseComponentProps {
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    onClose?: () => void;
    action?: {
        label: string;
        onClick: () => void;
    };
}
export interface ButtonProps extends BaseComponentProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'small' | 'medium' | 'large';
    isLoading?: boolean;
    isDisabled?: boolean;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    icon?: ReactNode;
    iconPosition?: 'left' | 'right';
}
export interface WalletStoreType {
    isConnected: boolean;
    isConnecting: boolean;
    account?: WalletAccount;
    state: WalletState;
    connect: (connectorId: string, config?: any) => Promise<WalletAccount>;
    disconnect: () => Promise<void>;
    switchChain: (chainId: number) => Promise<void>;
    error?: Error;
}
export type InventoryItem = GameInventoryItem;
export interface WalletUIContextProps {
    walletStore: WalletStoreType;
    session?: {
        id: string;
    } | null;
    createUserWallet?: (args: any) => Promise<void>;
    fetchInventory?: () => Promise<InventoryItem[]>;
}
export interface WalletUIContextType {
    connect: (connectorId: string, config?: any) => Promise<WalletAccount>;
    disconnect: () => Promise<void>;
    switchChain: (chainId: number) => Promise<void>;
    createWallet: (config: CreateWalletConfig) => Promise<WalletAccount>;
    importWallet: (config: ImportWalletConfig) => Promise<WalletAccount>;
    fetchTokens: () => Promise<TokenBalance[]>;
    fetchNFTs: () => Promise<NFTAsset[]>;
    fetchInventory: () => Promise<GameInventoryItem[]>;
    session?: UserSession;
    theme?: WalletTheme;
    isLoading: boolean;
    error?: Error;
    showToast: (props: Omit<ToastProps, 'onClose'>) => void;
    showModal: (content: ReactNode, props?: Partial<ModalProps>) => void;
    closeModal: () => void;
    walletStore: WalletStoreType;
    createUserWallet?: (args: any) => Promise<void>;
    hooks: {
        auth: any;
        navigation: any;
        serverActions: any;
        platform: any;
        walletActions: any;
    };
}
export interface UseWalletReturn extends WalletContextType {
    createWallet: (config: CreateWalletConfig) => Promise<WalletAccount>;
    importWallet: (config: ImportWalletConfig) => Promise<WalletAccount>;
}
export interface UseTokensReturn {
    tokens: TokenBalance[];
    isLoading: boolean;
    error?: Error;
    refresh: () => Promise<void>;
    getTokenBalance: (symbol: string) => TokenBalance | undefined;
    getTotalValue: () => string;
}
export interface UseNFTsReturn {
    nfts: NFTAsset[];
    isLoading: boolean;
    error?: Error;
    refresh: () => Promise<void>;
    getNFTsByCollection: (collection: string) => NFTAsset[];
    getTotalCount: () => number;
}
export interface UseInventoryReturn {
    items: GameInventoryItem[];
    isLoading: boolean;
    error?: Error;
    refresh: () => Promise<void>;
    getItemsByGame: (game: string) => GameInventoryItem[];
    getEquippedItems: () => GameInventoryItem[];
    equipItem: (item: GameInventoryItem) => Promise<void>;
    unequipItem: (item: GameInventoryItem) => Promise<void>;
}
//# sourceMappingURL=types.d.ts.map