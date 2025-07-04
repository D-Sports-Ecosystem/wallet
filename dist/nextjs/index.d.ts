import React from 'react';
import { DSportsWallet } from '../core/wallet';
import { CustomSocialLoginProvider } from '../providers/custom-social-login';
import { DSportsRainbowKitConnector } from '../connectors/rainbow-kit';
import { DSportsWagmiConnector } from '../connectors/wagmi';
import { nextjsPlatformAdapter } from '../utils/platform-adapters';
import { DSportsWalletOptions, RainbowKitConnectorOptions, WagmiConnectorOptions, Chain } from '../types';
export declare function createDSportsWallet(options: DSportsWalletOptions): DSportsWallet;
export declare function createDSportsRainbowKitConnectorForNextjs(options: RainbowKitConnectorOptions): () => {
    id: string;
    name: string;
    iconUrl: string;
    iconBackground: string;
    createConnector: () => {
        connector: DSportsRainbowKitConnector;
        mobile: {
            getUri: () => Promise<string>;
        };
    };
};
export declare function createDSportsWagmiConnectorForNextjs(options: WagmiConnectorOptions): DSportsWagmiConnector;
export declare function dsportsWagmiConnectorForNextjs(options: WagmiConnectorOptions): () => {
    id: string;
    name: string;
    type: string;
    icon: string;
    connect: (connectConfig?: {
        chainId?: number;
    }) => Promise<{
        accounts: `0x${string}`[];
        chainId: number;
    }>;
    disconnect: () => Promise<void>;
    getAccounts: () => Promise<`0x${string}`[]>;
    getChainId: () => Promise<number>;
    getProvider: () => Promise<any>;
    isAuthorized: () => Promise<boolean>;
    switchChain: (chainId: number) => Promise<{
        id: number;
        name: string;
        network: string;
        nativeCurrency: {
            decimals: number;
            name: string;
            symbol: string;
        };
        rpcUrls: {
            default: {
                http: string[];
                webSocket?: string[];
            };
            public: {
                http: string[];
                webSocket?: string[];
            };
        };
    }>;
    onAccountsChanged: (accounts: string[]) => void;
    onChainChanged: (chainId: number) => void;
    onConnect: (data: import("../types").ConnectorData) => void;
    onDisconnect: () => void;
};
export declare function useDSportsWallet(wallet: DSportsWallet): {
    connect: (connectorId: string, config?: any) => Promise<import("../types").WalletAccount>;
    disconnect: () => Promise<void>;
    switchChain: (chainId: number) => Promise<void>;
    isConnected: () => boolean;
    account?: import("../types").WalletAccount;
    isConnecting: boolean;
    isReconnecting: boolean;
    isDisconnected: boolean;
    pendingConnector?: string;
    error?: Error;
};
export declare function useSocialLogin(socialProvider: CustomSocialLoginProvider): {
    user: null;
    isLoading: boolean;
    error: Error | null;
    login: (provider: string) => Promise<import("../types").SocialLoginResult>;
    logout: () => Promise<void>;
};
export declare function withDSportsWallet<T extends object>(Component: React.ComponentType<T>, walletOptions: DSportsWalletOptions): (props: T) => React.ReactElement<T, string | React.JSXElementConstructor<any>>;
export * from '../types';
export * from '../core/wallet';
export * from '../providers/custom-social-login';
export { nextjsPlatformAdapter };
export declare const mainnet: Chain;
export declare const goerli: Chain;
export declare const sepolia: Chain;
export * from '../ui';
//# sourceMappingURL=index.d.ts.map