import { EventEmitter } from '../utils/event-emitter';
import { 
  SocialLoginConfig, 
  SocialProvider, 
  SocialLoginResult, 
  PlatformAdapter 
} from '../types';

export interface SocialLoginEventMap {
  'loginSuccess': SocialLoginResult;
  'loginError': Error;
  'loginStart': { provider: SocialProvider };
}

export class SocialLoginProvider extends EventEmitter<SocialLoginEventMap> {
  private config: SocialLoginConfig;
  private adapter: PlatformAdapter;
  private popupWindow?: Window | null;

  constructor(config: SocialLoginConfig, adapter: PlatformAdapter) {
    super();
    this.config = config;
    this.adapter = adapter;
  }

  public async login(provider: SocialProvider): Promise<SocialLoginResult> {
    if (!this.config.providers.includes(provider)) {
      throw new Error(`Provider ${provider} is not configured`);
    }

    const clientId = this.config.clientIds[provider];
    if (!clientId) {
      throw new Error(`Client ID for ${provider} is not configured`);
    }

    this.emit('loginStart', { provider });

    try {
      const result = await this.performLogin(provider, clientId);
      this.emit('loginSuccess', result);
      return result;
    } catch (error) {
      this.emit('loginError', error as Error);
      throw error;
    }
  }

  public async logout(): Promise<void> {
    // Clear any stored tokens
    await this.adapter.storage.removeItem('dsports-social-token');
    await this.adapter.storage.removeItem('dsports-social-user');
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
        expiresAt: user.expiresAt
      };
    } catch {
      return null;
    }
  }

  private async performLogin(provider: SocialProvider, clientId: string): Promise<SocialLoginResult> {
    const authUrl = this.buildAuthUrl(provider, clientId);
    
    if (this.adapter.platform === 'react-native') {
      return this.performMobileLogin(provider, authUrl);
    } else {
      return this.performWebLogin(provider, authUrl);
    }
  }

  private buildAuthUrl(provider: SocialProvider, clientId: string): string {
    const redirectUri = this.config.redirectUrl || `${window.location.origin}/auth/callback`;
    const baseUrls = {
      google: 'https://accounts.google.com/o/oauth2/v2/auth',
      facebook: 'https://www.facebook.com/v18.0/dialog/oauth',
      apple: 'https://appleid.apple.com/auth/authorize',
      twitter: 'https://twitter.com/i/oauth2/authorize',
      discord: 'https://discord.com/api/oauth2/authorize',
      github: 'https://github.com/login/oauth/authorize'
    };

    const scopes = {
      google: 'openid email profile',
      facebook: 'email public_profile',
      apple: 'email name',
      twitter: 'tweet.read users.read',
      discord: 'identify email',
      github: 'user:email'
    };

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: scopes[provider],
      state: this.generateState()
    });

    return `${baseUrls[provider]}?${params.toString()}`;
  }

  private async performWebLogin(provider: SocialProvider, authUrl: string): Promise<SocialLoginResult> {
    return new Promise((resolve, reject) => {
      const width = 500;
      const height = 600;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;

      this.popupWindow = window.open(
        authUrl,
        'social-login',
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
      );

      if (!this.popupWindow) {
        reject(new Error('Failed to open popup window'));
        return;
      }

      const checkClosed = setInterval(() => {
        if (this.popupWindow?.closed) {
          clearInterval(checkClosed);
          reject(new Error('Login cancelled by user'));
        }
      }, 1000);

      const messageListener = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) {
          return;
        }

        if (event.data.type === 'SOCIAL_LOGIN_SUCCESS') {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          this.popupWindow?.close();

          try {
            const result = await this.exchangeCodeForToken(provider, event.data.code);
            await this.storeLoginResult(result);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        } else if (event.data.type === 'SOCIAL_LOGIN_ERROR') {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          this.popupWindow?.close();
          reject(new Error(event.data.error));
        }
      };

      window.addEventListener('message', messageListener);
    });
  }

  private async performMobileLogin(provider: SocialProvider, authUrl: string): Promise<SocialLoginResult> {
    // For React Native, we'll use a different approach
    // This would typically involve platform-specific implementations
    throw new Error('Mobile login not implemented yet');
  }

  private async exchangeCodeForToken(provider: SocialProvider, code: string): Promise<SocialLoginResult> {
    // This would typically make a request to your backend to exchange the code for tokens
    // For now, we'll create a mock implementation
    const mockUser = {
      id: `mock-${Date.now()}`,
      email: `user@${provider}.com`,
      name: 'Mock User',
      avatar: `https://ui-avatars.com/api/?name=Mock+User&background=random`
    };

    return {
      provider,
      user: mockUser,
      token: `mock-token-${Date.now()}`,
      expiresAt: Date.now() + 3600000 // 1 hour
    };
  }

  private async storeLoginResult(result: SocialLoginResult): Promise<void> {
    await this.adapter.storage.setItem('dsports-social-token', result.token);
    await this.adapter.storage.setItem('dsports-social-user', JSON.stringify({
      provider: result.provider,
      user: result.user,
      expiresAt: result.expiresAt
    }));
  }

  private generateState(): string {
    const array = new Uint8Array(32);
    this.adapter.crypto.generateRandomBytes(32).forEach((byte, index) => {
      array[index] = byte;
    });
    return Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
} 