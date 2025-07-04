import { EventEmitter } from '../utils/event-emitter';
import { 
  Web3AuthConfig, 
  SocialProvider, 
  SocialLoginResult, 
  PlatformAdapter 
} from '../types';

// Web3Auth SDK imports (types only for now to avoid build issues)
export interface IWeb3Auth {
  init(): Promise<void>;
  connect(params?: { loginProvider?: string }): Promise<any>;
  logout(): Promise<void>;
  getUserInfo(): Promise<any>;
  provider: any;
  status: string;
  connected: boolean;
}

export interface Web3AuthEventMap {
  'loginSuccess': SocialLoginResult;
  'loginError': Error;
  'loginStart': { provider: SocialProvider };
  'logout': void;
}

export class Web3AuthProvider extends EventEmitter<Web3AuthEventMap> {
  private config: Web3AuthConfig;
  private adapter: PlatformAdapter;
  private web3auth?: IWeb3Auth;
  private isInitialized = false;

  constructor(config: Web3AuthConfig, adapter: PlatformAdapter) {
    super();
    this.config = config;
    this.adapter = adapter;
  }

  public async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // For web platforms
      if (this.adapter.platform === 'web' || this.adapter.platform === 'nextjs') {
        const { Web3Auth } = await import('@web3auth/modal');
        const { CHAIN_NAMESPACES } = await import('@web3auth/base');
        const { EthereumPrivateKeyProvider } = await import('@web3auth/ethereum-provider');
        const { OpenloginAdapter } = await import('@web3auth/openlogin-adapter');

        // Create Ethereum provider
        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: {
            chainConfig: {
              chainNamespace: CHAIN_NAMESPACES.EIP155,
              chainId: this.config.chainConfig.chainId,
              rpcTarget: this.config.chainConfig.rpcTarget,
              displayName: this.config.chainConfig.displayName,
              blockExplorerUrl: this.config.chainConfig.blockExplorer,
              ticker: this.config.chainConfig.ticker,
              tickerName: this.config.chainConfig.tickerName,
            }
          }
        });

        // Initialize Web3Auth
        this.web3auth = new Web3Auth({
          clientId: this.config.clientId,
          web3AuthNetwork: this.getWeb3AuthNetwork(),
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: this.config.chainConfig.chainId,
            rpcTarget: this.config.chainConfig.rpcTarget,
            displayName: this.config.chainConfig.displayName,
            blockExplorerUrl: this.config.chainConfig.blockExplorer,
            ticker: this.config.chainConfig.ticker,
            tickerName: this.config.chainConfig.tickerName,
          },
          privateKeyProvider,
          uiConfig: {
            appName: this.config.chainConfig.displayName,
            theme: {
              primary: this.config.uiConfig?.theme || 'auto'
            },
            logoLight: this.config.uiConfig?.appLogo,
            logoDark: this.config.uiConfig?.appLogo,
            defaultLanguage: 'en',
            mode: this.config.uiConfig?.theme || 'auto',
            modalZIndex: this.config.uiConfig?.modalZIndex || '99999'
          }
        });

        // Configure OpenLogin adapter for social logins
        const openloginAdapter = new OpenloginAdapter({
          loginSettings: {
            mfaLevel: 'optional'
          },
          adapterSettings: {
            uxMode: 'popup',
            whiteLabel: {
              appName: this.config.chainConfig.displayName,
              logoLight: this.config.uiConfig?.appLogo,
              logoDark: this.config.uiConfig?.appLogo,
              defaultLanguage: 'en',
              mode: this.config.uiConfig?.theme || 'auto'
            },
            loginConfig: this.config.loginConfig
          }
        });

        this.web3auth.configureAdapter(openloginAdapter);
        await this.web3auth.init();
        
      } else {
        // For React Native
        const { Web3Auth } = await import('@web3auth/no-modal');
        const { CHAIN_NAMESPACES } = await import('@web3auth/base');
        const { EthereumPrivateKeyProvider } = await import('@web3auth/ethereum-provider');
        const { OpenloginAdapter } = await import('@web3auth/openlogin-adapter');

        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: {
            chainConfig: {
              chainNamespace: CHAIN_NAMESPACES.EIP155,
              chainId: this.config.chainConfig.chainId,
              rpcTarget: this.config.chainConfig.rpcTarget,
              displayName: this.config.chainConfig.displayName,
              blockExplorerUrl: this.config.chainConfig.blockExplorer,
              ticker: this.config.chainConfig.ticker,
              tickerName: this.config.chainConfig.tickerName,
            }
          }
        });

        this.web3auth = new Web3Auth({
          clientId: this.config.clientId,
          web3AuthNetwork: this.getWeb3AuthNetwork(),
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: this.config.chainConfig.chainId,
            rpcTarget: this.config.chainConfig.rpcTarget,
            displayName: this.config.chainConfig.displayName,
            blockExplorerUrl: this.config.chainConfig.blockExplorer,
            ticker: this.config.chainConfig.ticker,
            tickerName: this.config.chainConfig.tickerName,
          },
          privateKeyProvider
        });

        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: {
            uxMode: 'redirect',
            loginConfig: this.config.loginConfig
          }
        });

        this.web3auth.configureAdapter(openloginAdapter);
        await this.web3auth.init();
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Web3Auth:', error);
      throw new Error(`Web3Auth initialization failed: ${error.message}`);
    }
  }

  public async login(provider?: SocialProvider): Promise<SocialLoginResult> {
    if (!this.isInitialized || !this.web3auth) {
      await this.init();
    }

    this.emit('loginStart', { provider: provider || 'google' });

    try {
      const web3authProvider = await this.web3auth!.connect({
        loginProvider: provider || 'google'
      });

      if (!web3authProvider) {
        throw new Error('Failed to connect to Web3Auth');
      }

      // Get user info
      const userInfo = await this.web3auth!.getUserInfo();
      
      const result: SocialLoginResult = {
        provider: provider || 'google',
        user: {
          id: userInfo.verifierId || userInfo.sub || 'unknown',
          email: userInfo.email,
          name: userInfo.name,
          avatar: userInfo.profileImage
        },
        token: userInfo.idToken || userInfo.accessToken || 'web3auth-token',
        expiresAt: Date.now() + 3600000 // 1 hour default
      };

      // Store the result
      await this.storeLoginResult(result);
      this.emit('loginSuccess', result);
      
      return result;
    } catch (error) {
      this.emit('loginError', error as Error);
      throw error;
    }
  }

  public async logout(): Promise<void> {
    if (!this.web3auth) {
      return;
    }

    try {
      await this.web3auth.logout();
      await this.clearStoredData();
      this.emit('logout');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  public async getStoredUser(): Promise<SocialLoginResult | null> {
    const token = await this.adapter.storage.getItem('dsports-web3auth-token');
    const userStr = await this.adapter.storage.getItem('dsports-web3auth-user');
    
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

  public getProvider(): any {
    return this.web3auth?.provider;
  }

  public isConnected(): boolean {
    return this.web3auth?.connected || false;
  }

  public getStatus(): string {
    return this.web3auth?.status || 'not_ready';
  }

  private async storeLoginResult(result: SocialLoginResult): Promise<void> {
    await this.adapter.storage.setItem('dsports-web3auth-token', result.token);
    await this.adapter.storage.setItem('dsports-web3auth-user', JSON.stringify({
      provider: result.provider,
      user: result.user,
      expiresAt: result.expiresAt
    }));
  }

  private async clearStoredData(): Promise<void> {
    await this.adapter.storage.removeItem('dsports-web3auth-token');
    await this.adapter.storage.removeItem('dsports-web3auth-user');
  }

  private getWeb3AuthNetwork(): string {
    const networkMap = {
      'mainnet': 'sapphire_mainnet',
      'testnet': 'sapphire_devnet', 
      'cyan': 'cyan',
      'aqua': 'aqua'
    };
    
    return networkMap[this.config.web3AuthNetwork || 'testnet'];
  }
} 