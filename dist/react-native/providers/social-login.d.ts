import { EventEmitter } from '../utils/event-emitter';
import { SocialLoginConfig, SocialProvider, SocialLoginResult, PlatformAdapter } from '../types';
export interface SocialLoginEventMap {
    'loginSuccess': SocialLoginResult;
    'loginError': Error;
    'loginStart': {
        provider: SocialProvider;
    };
}
export declare class SocialLoginProvider extends EventEmitter<SocialLoginEventMap> {
    private config;
    private adapter;
    private popupWindow?;
    constructor(config: SocialLoginConfig, adapter: PlatformAdapter);
    login(provider: SocialProvider): Promise<SocialLoginResult>;
    logout(): Promise<void>;
    getStoredUser(): Promise<SocialLoginResult | null>;
    private performLogin;
    private buildAuthUrl;
    private performWebLogin;
    private performMobileLogin;
    private exchangeCodeForToken;
    private storeLoginResult;
    private generateState;
}
//# sourceMappingURL=social-login.d.ts.map