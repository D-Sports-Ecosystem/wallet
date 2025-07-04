import { EventEmitter } from '../utils/event-emitter';
import { Web3AuthConfig, SocialProvider, SocialLoginResult, PlatformAdapter } from '../types';
export interface IWeb3Auth {
    init(): Promise<void>;
    connect(params?: {
        loginProvider?: string;
    }): Promise<any>;
    logout(): Promise<void>;
    getUserInfo(): Promise<any>;
    provider: any;
    status: string;
    connected: boolean;
}
export interface Web3AuthEventMap {
    'loginSuccess': SocialLoginResult;
    'loginError': Error;
    'loginStart': {
        provider: SocialProvider;
    };
    'logout': void;
}
export declare class Web3AuthProvider extends EventEmitter<Web3AuthEventMap> {
    private config;
    private adapter;
    private web3auth?;
    private isInitialized;
    constructor(config: Web3AuthConfig, adapter: PlatformAdapter);
    init(): Promise<void>;
    login(provider?: SocialProvider): Promise<SocialLoginResult>;
    logout(): Promise<void>;
    getStoredUser(): Promise<SocialLoginResult | null>;
    getProvider(): any;
    isConnected(): boolean;
    getStatus(): string;
    private storeLoginResult;
    private clearStoredData;
    private getWeb3AuthNetwork;
}
//# sourceMappingURL=web3auth.d.ts.map