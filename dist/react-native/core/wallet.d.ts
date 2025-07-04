import { EventEmitter } from '../utils/event-emitter';
import { WalletConfig, WalletState, WalletAccount, WalletConnector, WalletEventMap, PlatformAdapter } from '../types';
export declare class DSportsWallet extends EventEmitter<WalletEventMap> {
    private config;
    private state;
    private connectors;
    private adapter;
    private currentConnector?;
    constructor(config: WalletConfig, adapter: PlatformAdapter);
    private initialize;
    addConnector(connector: WalletConnector): void;
    removeConnector(id: string): void;
    getConnectors(): WalletConnector[];
    getConnector(id: string): WalletConnector | undefined;
    connect(connectorId: string, config?: any): Promise<WalletAccount>;
    disconnect(): Promise<void>;
    switchChain(chainId: number): Promise<void>;
    getState(): WalletState;
    getAccount(): WalletAccount | undefined;
    isConnected(): boolean;
    private reconnect;
    private handleConnect;
    private handleDisconnect;
    private handleChange;
    private handleError;
    private createAccount;
}
//# sourceMappingURL=wallet.d.ts.map