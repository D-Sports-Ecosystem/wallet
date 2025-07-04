export { DSportsWallet } from './core/wallet';
export { CustomSocialLoginProvider } from './providers/custom-social-login';
export { DSportsOAuthService, createQuickStartSocialLogin, validateSocialLoginConfig } from './providers/dsports-oauth-service';
export { DSportsRainbowKitConnector, createDSportsRainbowKitConnector } from './connectors/rainbow-kit';
export { DSportsWagmiConnector, createDSportsWagmiConnector, dsportsWagmiConnector } from './connectors/wagmi';
export { webPlatformAdapter, nextjsPlatformAdapter, reactNativePlatformAdapter, getDefaultPlatformAdapter } from './utils/platform-adapters';
export { EventEmitter } from './utils/event-emitter';
export * from './types';
import { DSportsWallet } from './core/wallet';
import { DSportsRainbowKitConnector } from './connectors/rainbow-kit';
import { DSportsWagmiConnector } from './connectors/wagmi';
import { DSportsWalletOptions, RainbowKitConnectorOptions, WagmiConnectorOptions } from './types';
export declare function createDSportsWallet(options: DSportsWalletOptions): DSportsWallet;
export declare function createDSportsWalletQuickStart(options: Omit<DSportsWalletOptions, 'socialLogin'>): DSportsWallet;
export declare function createDSportsRainbowKitConnectorUniversal(options: RainbowKitConnectorOptions): () => {
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
export declare function createDSportsWagmiConnectorUniversal(options: WagmiConnectorOptions): DSportsWagmiConnector;
export declare function dsportsWagmiConnectorUniversal(options: WagmiConnectorOptions): () => {
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
    onConnect: (data: import("./types").ConnectorData) => void;
    onDisconnect: () => void;
};
export declare const mainnet: {
    id: number;
    name: string;
    network: string;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    rpcUrls: {
        default: {
            http: string[];
        };
        public: {
            http: string[];
        };
    };
    blockExplorers: {
        default: {
            name: string;
            url: string;
        };
    };
};
export declare const goerli: {
    id: number;
    name: string;
    network: string;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    rpcUrls: {
        default: {
            http: string[];
        };
        public: {
            http: string[];
        };
    };
    blockExplorers: {
        default: {
            name: string;
            url: string;
        };
    };
    testnet: boolean;
};
export declare const polygon: {
    id: number;
    name: string;
    network: string;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    rpcUrls: {
        default: {
            http: string[];
        };
        public: {
            http: string[];
        };
    };
    blockExplorers: {
        default: {
            name: string;
            url: string;
        };
    };
};
export declare const version = "1.0.0";
//# sourceMappingURL=index.d.ts.map