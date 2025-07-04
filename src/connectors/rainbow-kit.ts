import { EventEmitter } from '../utils/event-emitter';
import { 
  WalletConnector, 
  ConnectorData, 
  ConnectorEvents, 
  RainbowKitConnectorOptions, 
  Chain,
  SocialLoginResult,
  SocialProvider
} from '../types';
import { CustomSocialLoginProvider } from '../providers/custom-social-login';

export interface DSportsRainbowKitConnectorConfig extends RainbowKitConnectorOptions {
  customSocialLoginProvider?: CustomSocialLoginProvider;
}

export class DSportsRainbowKitConnector implements WalletConnector {
  public readonly id = 'dsports-wallet';
  public readonly name = 'D-Sports Wallet';
  public readonly ready = true;
  public readonly icon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMTIiIGZpbGw9IiM2MzY2RjEiLz4KPHBhdGggZD0iTTI0IDEySDM2VjM2SDI0VjEyWiIgZmlsbD0iI0Y5RkJGRiIvPgo8cGF0aCBkPSJNMTIgMTJIMjRWMjRIMTJWMTJaIiBmaWxsPSIjRjlGQkZGIi8+CjxwYXRoIGQ9Ik0xMiAyNEgyNFYzNkgxMlYyNFoiIGZpbGw9IiNGOUZCRkYiLz4KPC9zdmc+';

  private config: DSportsRainbowKitConnectorConfig;
  private provider?: any;
  private account?: string;
  private chainId?: number;
  private isConnected = false;
  private customSocialLoginProvider?: CustomSocialLoginProvider;
  private eventEmitter = new EventEmitter<{
    connect: ConnectorData;
    disconnect: void;
    change: ConnectorData;
    error: Error;
    message: { type: string; data?: any };
  }>();

  constructor(config: DSportsRainbowKitConnectorConfig) {
    this.config = config;
    this.customSocialLoginProvider = config.customSocialLoginProvider;
  }

  on<K extends keyof ConnectorEvents>(event: K, listener: ConnectorEvents[K]): void {
    this.eventEmitter.on(event, listener as any);
  }

  off<K extends keyof ConnectorEvents>(event: K, listener: ConnectorEvents[K]): void {
    this.eventEmitter.off(event, listener as any);
  }

  async connect(config?: { chainId?: number; socialLogin?: boolean }): Promise<ConnectorData> {
    try {
      if (config?.socialLogin && this.customSocialLoginProvider) {
        return await this.connectWithSocialLogin();
      }

      // Check if there's a previous connection
      const storedAccount = localStorage.getItem('dsports-wallet-account');
      const storedChainId = localStorage.getItem('dsports-wallet-chainId');
      
      if (storedAccount && storedChainId) {
        this.account = storedAccount;
        this.chainId = parseInt(storedChainId);
        this.isConnected = true;
        
        const connectorData: ConnectorData = {
          account: this.account,
          chain: { id: this.chainId },
          provider: this.provider
        };
        
        this.eventEmitter.emit('connect', connectorData);
        return connectorData;
      }

      // For new connections, create a mock wallet
      this.account = this.generateMockAddress();
      this.chainId = config?.chainId || this.config.chains[0]?.id || 1;
      this.isConnected = true;

      // Store the connection
      localStorage.setItem('dsports-wallet-account', this.account);
      localStorage.setItem('dsports-wallet-chainId', this.chainId.toString());

      const connectorData: ConnectorData = {
        account: this.account,
        chain: { id: this.chainId },
        provider: this.provider
      };

      this.eventEmitter.emit('connect', connectorData);
      return connectorData;
    } catch (error) {
      this.eventEmitter.emit('error', error as Error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      this.account = undefined;
      this.chainId = undefined;
      this.isConnected = false;
      this.provider = undefined;

      // Clear stored data
      localStorage.removeItem('dsports-wallet-account');
      localStorage.removeItem('dsports-wallet-chainId');

      this.eventEmitter.emit('disconnect');
    } catch (error) {
      this.eventEmitter.emit('error', error as Error);
      throw error;
    }
  }

  async getAccount(): Promise<string> {
    if (!this.account) {
      throw new Error('No account connected');
    }
    return this.account;
  }

  async getChainId(): Promise<number> {
    if (!this.chainId) {
      throw new Error('No chain connected');
    }
    return this.chainId;
  }

  async getProvider(): Promise<any> {
    if (!this.provider) {
      // Create a mock provider for demonstration
      this.provider = {
        request: async (args: any) => {
          switch (args.method) {
            case 'eth_requestAccounts':
              return [this.account];
            case 'eth_accounts':
              return this.account ? [this.account] : [];
            case 'eth_chainId':
              return `0x${this.chainId?.toString(16)}`;
            case 'personal_sign':
              return `0x${'0'.repeat(130)}`; // Mock signature
            default:
              throw new Error(`Method ${args.method} not supported`);
          }
        },
        on: (event: string, handler: Function) => {
          this.on(event as any, handler as any);
        },
        removeListener: (event: string, handler: Function) => {
          this.off(event as any, handler as any);
        }
      };
    }
    return this.provider;
  }

  async getSigner(): Promise<any> {
    const provider = await this.getProvider();
    return {
      getAddress: () => this.getAccount(),
      signMessage: (message: string) => provider.request({
        method: 'personal_sign',
        params: [message, this.account]
      }),
      signTransaction: (transaction: any) => {
        // Mock transaction signing
        return Promise.resolve(`0x${'0'.repeat(130)}`);
      }
    };
  }

  async isAuthorized(): Promise<boolean> {
    const storedAccount = localStorage.getItem('dsports-wallet-account');
    return !!storedAccount;
  }

  async switchChain(chainId: number): Promise<void> {
    const chain = this.config.chains.find(c => c.id === chainId);
    if (!chain) {
      throw new Error(`Chain ${chainId} not configured`);
    }

    this.chainId = chainId;
    localStorage.setItem('dsports-wallet-chainId', chainId.toString());

    this.eventEmitter.emit('change', {
      account: this.account,
      chain: { id: chainId },
      provider: this.provider
    });
  }

  private async connectWithSocialLogin(): Promise<ConnectorData> {
    if (!this.customSocialLoginProvider) {
      throw new Error('Custom social login provider not configured');
    }

    // Check if user is already logged in
    let socialResult = await this.customSocialLoginProvider.getStoredUser();
    
    if (!socialResult || socialResult.expiresAt < Date.now()) {
      // Prompt user to choose social login provider
      const provider = await this.promptSocialProvider();
      socialResult = await this.customSocialLoginProvider.login(provider);
    }

    // Use wallet address from social login result
    this.account = socialResult.walletAddress || this.generateAddressFromSocialLogin(socialResult);
    this.chainId = this.config.chains[0]?.id || 1;
    this.isConnected = true;

    // Store the connection
    localStorage.setItem('dsports-wallet-account', this.account);
    localStorage.setItem('dsports-wallet-chainId', this.chainId.toString());

    const connectorData: ConnectorData = {
      account: this.account,
      chain: { id: this.chainId },
      provider: this.provider
    };

    this.eventEmitter.emit('connect', connectorData);
    return connectorData;
  }

  private async promptSocialProvider(): Promise<SocialProvider> {
    // In a real implementation, this would show a modal or prompt
    // For now, we'll default to Google
    return 'google';
  }

  private generateAddressFromSocialLogin(socialResult: SocialLoginResult): string {
    // Generate a deterministic address based on social login info
    const data = `${socialResult.provider}-${socialResult.user.id}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Convert to a hex address (this is a mock implementation)
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `0x${hex}${'0'.repeat(32)}`;
  }

  private generateMockAddress(): string {
    // Generate a random mock address
    const randomBytes = new Uint8Array(20);
    crypto.getRandomValues(randomBytes);
    return '0x' + Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
}

// Rainbow Kit connector factory
export function createDSportsRainbowKitConnector(config: DSportsRainbowKitConnectorConfig) {
  return () => ({
    id: 'dsports-wallet',
    name: 'D-Sports Wallet',
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMTIiIGZpbGw9IiM2MzY2RjEiLz4KPHBhdGggZD0iTTI0IDEySDM2VjM2SDI0VjEyWiIgZmlsbD0iI0Y5RkJGRiIvPgo8cGF0aCBkPSJNMTIgMTJIMjRWMjRIMTJWMTJaIiBmaWxsPSIjRjlGQkZGIi8+CjxwYXRoIGQ9Ik0xMiAyNEgyNFYzNkgxMlYyNFoiIGZpbGw9IiNGOUZCRkYiLz4KPC9zdmc+',
    iconBackground: '#6366F1',
    createConnector: () => {
      const connector = new DSportsRainbowKitConnector(config);
      
      return {
        connector,
        mobile: {
          getUri: async () => {
            // Return deep link for mobile wallet
            return `dsports://wallet/connect`;
          }
        }
      };
    }
  });
} 