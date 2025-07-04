import { EventEmitter } from '../utils/event-emitter';
import { 
  CustomSocialLoginConfig, 
  SocialProvider, 
  SocialLoginResult, 
  PlatformAdapter 
} from '../types';
import { ethers } from 'ethers';

export interface CustomSocialLoginEventMap {
  'loginSuccess': SocialLoginResult;
  'loginError': Error;
  'loginStart': { provider: SocialProvider };
  'logout': void;
}

export class CustomSocialLoginProvider extends EventEmitter<CustomSocialLoginEventMap> {
  private config: CustomSocialLoginConfig;
  private adapter: PlatformAdapter;
  private popup?: Window;

  constructor(config: CustomSocialLoginConfig, adapter: PlatformAdapter) {
    super();
    this.config = config;
    this.adapter = adapter;
  }

  public async login(provider: SocialProvider): Promise<SocialLoginResult> {
    this.emit('loginStart', { provider });

    try {
      let authResult;
      
      if (this.adapter.platform === 'react-native') {
        authResult = await this.loginReactNative(provider);
      } else {
        authResult = await this.loginWeb(provider);
      }

      // Generate deterministic wallet from social login data
      const walletData = await this.generateWalletFromSocial(authResult);
      
      const result: SocialLoginResult = {
        provider,
        user: authResult.user,
        token: authResult.token,
        expiresAt: authResult.expiresAt,
        walletAddress: walletData.address,
        privateKey: walletData.privateKey // Store securely
      };

      // Store the result securely
      await this.storeLoginResult(result);
      this.emit('loginSuccess', result);
      
      return result;
    } catch (error) {
      this.emit('loginError', error as Error);
      throw error;
    }
  }

  private async loginWeb(provider: SocialProvider): Promise<any> {
    const authUrl = this.buildAuthUrl(provider);
    
    return new Promise((resolve, reject) => {
      // Open popup for OAuth
      this.popup = window.open(
        authUrl,
        'dsports-oauth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      ) || undefined;

      if (!this.popup) {
        reject(new Error('Failed to open OAuth popup'));
        return;
      }

      // Listen for OAuth callback
      const messageHandler = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'OAUTH_SUCCESS') {
          window.removeEventListener('message', messageHandler);
          this.popup?.close();
          resolve(event.data.payload);
        } else if (event.data.type === 'OAUTH_ERROR') {
          window.removeEventListener('message', messageHandler);
          this.popup?.close();
          reject(new Error(event.data.error));
        }
      };

      window.addEventListener('message', messageHandler);

      // Handle popup close
      const checkClosed = setInterval(() => {
        if (this.popup?.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageHandler);
          reject(new Error('OAuth popup was closed'));
        }
      }, 1000);
    });
  }

  private async loginReactNative(provider: SocialProvider): Promise<any> {
    const authUrl = this.buildAuthUrl(provider);
    
    // For React Native, we would typically use:
    // - react-native-app-auth
    // - Expo AuthSession
    // - Custom deep linking
    
    // For now, let's implement a basic web-based flow
    // In a real implementation, you'd use proper native OAuth flows
    
    try {
      // Check if we can use web-based flow (e.g., in Expo web)
      if (typeof window !== 'undefined' && typeof window.open === 'function') {
        return await this.loginWeb(provider);
      }
      
      // Fallback: redirect to auth URL
      throw new Error('React Native OAuth not fully implemented. Use web-based flow or implement native OAuth.');
    } catch (error) {
      throw new Error(`React Native OAuth failed: ${(error as Error).message}`);
    }
  }

  private buildAuthUrl(provider: SocialProvider): string {
    const config = this.config.providers[provider];
    if (!config) {
      throw new Error(`Provider ${provider} not configured`);
    }

    const baseUrls = {
      google: 'https://accounts.google.com/oauth/v2/auth',
      facebook: 'https://www.facebook.com/v18.0/dialog/oauth',
      twitter: 'https://twitter.com/i/oauth2/authorize',
      discord: 'https://discord.com/api/oauth2/authorize',
      github: 'https://github.com/login/oauth/authorize',
      apple: 'https://appleid.apple.com/auth/authorize',
      email: '', // Email/passwordless handled separately
      sms: ''   // SMS handled separately
    };

    const scopes = {
      google: 'openid email profile',
      facebook: 'email public_profile',
      twitter: 'tweet.read users.read',
      discord: 'identify email',
      github: 'user:email',
      apple: 'name email',
      email: '',
      sms: ''
    };

    const redirectUri = this.config.redirectUri || `${window.location.origin}/auth/callback`;
    
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: scopes[provider],
      state: this.generateState()
    });

    return `${baseUrls[provider]}?${params.toString()}`;
  }

  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  private async generateWalletFromSocial(authResult: any): Promise<{address: string, privateKey: string}> {
    // Create deterministic seed from social login data
    const socialData = `${authResult.user.id}:${authResult.user.email}:${this.config.appSecret || 'dsports-default-secret'}`;
    
    // Use Web Crypto API for deterministic key derivation
    const encoder = new TextEncoder();
    const data = encoder.encode(socialData);
    
    // Generate deterministic hash
    const hashBuffer = await this.adapter.crypto.sha256(data);
    const privateKey = '0x' + Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Create wallet from private key
    const wallet = new ethers.Wallet(privateKey);
    
    return {
      address: wallet.address,
      privateKey: privateKey
    };
  }

  public async logout(): Promise<void> {
    try {
      await this.clearStoredData();
      this.emit('logout');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  public async getStoredUser(): Promise<SocialLoginResult | null> {
    const token = await this.adapter.storage.getItem('dsports-social-token');
    const userStr = await this.adapter.storage.getItem('dsports-social-user');
    
    if (!token || !userStr) {
      return null;
    }

    try {
      const user = JSON.parse(userStr);
      return {
        provider: user.provider,
        user: user.user,
        token,
        expiresAt: user.expiresAt,
        walletAddress: user.walletAddress,
        privateKey: user.privateKey
      };
    } catch {
      return null;
    }
  }

  public async getWalletFromSocial(socialResult: SocialLoginResult): Promise<ethers.Wallet> {
    if (socialResult.privateKey) {
      return new ethers.Wallet(socialResult.privateKey);
    }
    
    // Regenerate wallet from social data
    const walletData = await this.generateWalletFromSocial(socialResult);
    return new ethers.Wallet(walletData.privateKey);
  }

  private async storeLoginResult(result: SocialLoginResult): Promise<void> {
    await this.adapter.storage.setItem('dsports-social-token', result.token);
    await this.adapter.storage.setItem('dsports-social-user', JSON.stringify({
      provider: result.provider,
      user: result.user,
      expiresAt: result.expiresAt,
      walletAddress: result.walletAddress,
      privateKey: result.privateKey // Store encrypted in production
    }));
  }

  private async clearStoredData(): Promise<void> {
    await this.adapter.storage.removeItem('dsports-social-token');
    await this.adapter.storage.removeItem('dsports-social-user');
  }

  // OAuth callback handler for web platforms
  public static handleOAuthCallback(url: string): void {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    const state = urlParams.get('state');

    if (error) {
      window.parent.postMessage({
        type: 'OAUTH_ERROR',
        error: error
      }, window.location.origin);
      return;
    }

    if (code) {
      // Exchange code for token (this would typically be done on your backend)
      // For now, we'll simulate the token exchange
      window.parent.postMessage({
        type: 'OAUTH_SUCCESS',
        payload: {
          code,
          state,
          user: {
            id: 'mock-user-id',
            email: 'user@example.com',
            name: 'Mock User',
            avatar: 'https://example.com/avatar.jpg'
          },
          token: 'mock-access-token',
          expiresAt: Date.now() + 3600000 // 1 hour
        }
      }, window.location.origin);
    }
  }
}

// OAuth callback page helper
export const OAuthCallbackPage = `
<!DOCTYPE html>
<html>
<head>
  <title>D-Sports Authentication</title>
  <style>
    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
    .loading { color: #666; }
    .logo { width: 64px; height: 64px; margin: 20px auto; }
  </style>
</head>
<body>
  <div class="logo">🏆</div>
  <h2>D-Sports Authentication</h2>
  <p class="loading">Processing your login...</p>
  <script>
    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    
    if (error) {
      window.parent.postMessage({
        type: 'OAUTH_ERROR',
        error: error
      }, window.location.origin);
    } else if (code) {
      // In a real implementation, you'd exchange the code for a token on your backend
      // For demo purposes, we'll simulate the user data
      window.parent.postMessage({
        type: 'OAUTH_SUCCESS',
        payload: {
          code,
          user: {
            id: 'user-' + Math.random().toString(36).substring(7),
            email: 'user@example.com',
            name: 'D-Sports User',
            avatar: 'https://ui-avatars.com/api/?name=DS&background=6366f1&color=fff'
          },
          token: 'dsports-token-' + Math.random().toString(36).substring(7),
          expiresAt: Date.now() + 3600000
        }
      }, window.location.origin);
    }
  </script>
</body>
</html>
`; 