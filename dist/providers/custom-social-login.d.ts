import { EventEmitter } from '../utils/event-emitter';
import { CustomSocialLoginConfig, SocialProvider, SocialLoginResult, PlatformAdapter } from '../types';
import { ethers } from 'ethers';
export interface CustomSocialLoginEventMap {
    'loginSuccess': SocialLoginResult;
    'loginError': Error;
    'loginStart': {
        provider: SocialProvider;
    };
    'logout': void;
}
export declare class CustomSocialLoginProvider extends EventEmitter<CustomSocialLoginEventMap> {
    private config;
    private adapter;
    private popup?;
    constructor(config: CustomSocialLoginConfig, adapter: PlatformAdapter);
    login(provider: SocialProvider): Promise<SocialLoginResult>;
    private loginWeb;
    private loginReactNative;
    private buildAuthUrl;
    private generateState;
    private generateWalletFromSocial;
    logout(): Promise<void>;
    getStoredUser(): Promise<SocialLoginResult | null>;
    getWalletFromSocial(socialResult: SocialLoginResult): Promise<ethers.Wallet>;
    private storeLoginResult;
    private clearStoredData;
    static handleOAuthCallback(url: string): void;
}
export declare const OAuthCallbackPage = "\n<!DOCTYPE html>\n<html>\n<head>\n  <title>D-Sports Authentication</title>\n  <style>\n    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }\n    .loading { color: #666; }\n    .logo { width: 64px; height: 64px; margin: 20px auto; }\n  </style>\n</head>\n<body>\n  <div class=\"logo\">\uD83C\uDFC6</div>\n  <h2>D-Sports Authentication</h2>\n  <p class=\"loading\">Processing your login...</p>\n  <script>\n    // Handle OAuth callback\n    const urlParams = new URLSearchParams(window.location.search);\n    const code = urlParams.get('code');\n    const error = urlParams.get('error');\n    \n    if (error) {\n      window.parent.postMessage({\n        type: 'OAUTH_ERROR',\n        error: error\n      }, window.location.origin);\n    } else if (code) {\n      // In a real implementation, you'd exchange the code for a token on your backend\n      // For demo purposes, we'll simulate the user data\n      window.parent.postMessage({\n        type: 'OAUTH_SUCCESS',\n        payload: {\n          code,\n          user: {\n            id: 'user-' + Math.random().toString(36).substring(7),\n            email: 'user@example.com',\n            name: 'D-Sports User',\n            avatar: 'https://ui-avatars.com/api/?name=DS&background=6366f1&color=fff'\n          },\n          token: 'dsports-token-' + Math.random().toString(36).substring(7),\n          expiresAt: Date.now() + 3600000\n        }\n      }, window.location.origin);\n    }\n  </script>\n</body>\n</html>\n";
//# sourceMappingURL=custom-social-login.d.ts.map