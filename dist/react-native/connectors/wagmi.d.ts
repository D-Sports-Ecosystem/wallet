import { WalletConnector, ConnectorData, ConnectorEvents, WagmiConnectorOptions } from '../types';
import { Web3AuthProvider } from '../providers/web3auth';
export interface DSportsWagmiConnectorConfig extends WagmiConnectorOptions {
    web3AuthProvider?: Web3AuthProvider;
}
export declare class DSportsWagmiConnector implements WalletConnector {
    readonly id = "dsports-wallet";
    readonly name = "D-Sports Wallet";
    readonly ready = true;
    readonly icon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMTIiIGZpbGw9IiM2MzY2RjEiLz4KPHBhdGggZD0iTTI0IDEySDM2VjM2SDI0VjEyWiIgZmlsbD0iI0Y5RkJGRiIvPgo8cGF0aCBkPSJNMTIgMTJIMjRWMjRIMTJWMTJaIiBmaWxsPSIjRjlGQkZGIi8+CjxwYXRoIGQ9Ik0xMiAyNEgyNFYzNkgxMlYyNFoiIGZpbGw9IiNGOUZCRkYiLz4KPC9zdmc+";
    private config;
    private provider?;
    private account?;
    private chainId?;
    private isConnected;
    private web3AuthProvider?;
    private eventEmitter;
    constructor(config: DSportsWagmiConnectorConfig);
    on<K extends keyof ConnectorEvents>(event: K, listener: ConnectorEvents[K]): void;
    off<K extends keyof ConnectorEvents>(event: K, listener: ConnectorEvents[K]): void;
    connect(config?: {
        chainId?: number;
        socialLogin?: boolean;
    }): Promise<ConnectorData>;
    disconnect(): Promise<void>;
    getAccount(): Promise<string>;
    getChainId(): Promise<number>;
    getProvider(): Promise<any>;
    getSigner(): Promise<any>;
    isAuthorized(): Promise<boolean>;
    switchChain(chainId: number): Promise<void>;
    private connectWithSocialLogin;
    private promptSocialProvider;
    private generateAddressFromSocialLogin;
    private generateMockAddress;
}
export declare function createDSportsWagmiConnector(config: DSportsWagmiConnectorConfig): DSportsWagmiConnector;
export declare function dsportsWagmiConnector(config: DSportsWagmiConnectorConfig): () => {
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
    onConnect: (data: ConnectorData) => void;
    onDisconnect: () => void;
};
//# sourceMappingURL=wagmi.d.ts.map