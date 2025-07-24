/**
 * @file wagmi.ts
 * @description Wagmi connector implementation for D-Sports wallet integration.
 * Provides wallet connection capabilities with Wagmi compatibility.
 * @module connectors/wagmi
 * @author D-Sports Engineering Team
 * @version 1.0.0
 * @since 2025-07-23
 */

import { EventEmitter } from '../utils/event-emitter';
import { 
  WalletConnector, 
  ConnectorData, 
  ConnectorEvents, 
  WagmiConnectorOptions, 
  Chain,
  SocialLoginResult,
  SocialProvider
} from '../types';
import { CustomSocialLoginProvider } from '../providers/custom-social-login';

/**
 * Configuration interface for the D-Sports Wagmi connector.
 * Extends the standard Wagmi connector options with D-Sports specific features.
 * 
 * @interface
 * @extends {WagmiConnectorOptions}
 * @property {CustomSocialLoginProvider} [customSocialLoginProvider] - Optional social login provider for OAuth-based wallet connections
 */
export interface DSportsWagmiConnectorConfig extends WagmiConnectorOptions {
  customSocialLoginProvider?: CustomSocialLoginProvider;
}

/**
 * D-Sports Wagmi connector implementation.
 * Provides wallet connection capabilities with Wagmi compatibility,
 * including social login integration.
 * 
 * @class
 * @implements {WalletConnector}
 * 
 * @example
 * ```typescript
 * // Create a Wagmi connector
 * const connector = new DSportsWagmiConnector({
 *   chains: [
 *     { id: 1, name: 'Ethereum', network: 'ethereum' }
 *   ],
 *   customSocialLoginProvider: socialLoginProvider
 * });
 * 
 * // Connect to the wallet
 * const account = await connector.connect();
 * console.log(`Connected to: ${account.address}`);
 * ```
 */
export class DSportsWagmiConnector implements WalletConnector {
  /**
   * Unique identifier for the connector
   * @public
   * @readonly
   * @type {string}
   */
  public readonly id = 'dsports-wallet';
  
  /**
   * Display name for the connector
   * @public
   * @readonly
   * @type {string}
   */
  public readonly name = 'D-Sports Wallet';
  
  /**
   * Indicates if the connector is ready to use
   * @public
   * @readonly
   * @type {boolean}
   */
  public readonly ready = true;
  
  /**
   * Base64 encoded SVG icon for the connector
   * @public
   * @readonly
   * @type {string}
   */
  public readonly icon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMTIiIGZpbGw9IiM2MzY2RjEiLz4KPHBhdGggZD0iTTI0IDEySDM2VjM2SDI0VjEyWiIgZmlsbD0iI0Y5RkJGRiIvPgo8cGF0aCBkPSJNMTIgMTJIMjRWMjRIMTJWMTJaIiBmaWxsPSIjRjlGQkZGIi8+CjxwYXRoIGQ9Ik0xMiAyNEgyNFYzNkgxMlYyNFoiIGZpbGw9IiNGOUZCRkYiLz4KPC9zdmc+';

  /**
   * Configuration options for the connector
   * @private
   * @type {DSportsWagmiConnectorConfig}
   */
  private config: DSportsWagmiConnectorConfig;
  
  /**
   * Ethereum provider instance
   * @private
   * @type {any}
   */
  private provider?: any;
  
  /**
   * Connected wallet address
   * @private
   * @type {string}
   */
  private account?: string;
  
  /**
   * Connected chain ID
   * @private
   * @type {number}
   */
  private chainId?: number;
  
  /**
   * Connection status flag
   * @private
   * @type {boolean}
   */
  private isConnected = false;
  
  /**
   * Social login provider for OAuth-based wallet connections
   * @private
   * @type {CustomSocialLoginProvider}
   */
  private customSocialLoginProvider?: CustomSocialLoginProvider;
  
  /**
   * Event emitter for connector events
   * @private
   * @type {EventEmitter}
   */
  private eventEmitter = new EventEmitter<{
    connect: ConnectorData;
    disconnect: void;
    change: ConnectorData;
    error: Error;
    message: { type: string; data?: any };
  }>();

  /**
   * Creates a new DSportsWagmiConnector instance.
   * 
   * @constructor
   * @param {DSportsWagmiConnectorConfig} config - Configuration options for the connector
   * 
   * @example
   * ```typescript
   * const connector = new DSportsWagmiConnector({
   *   chains: [
   *     { id: 1, name: 'Ethereum', network: 'ethereum' }
   *   ]
   * });
   * ```
   */
  constructor(config: DSportsWagmiConnectorConfig) {
    this.config = config;
    this.customSocialLoginProvider = config.customSocialLoginProvider;
  }

  /**
   * Registers an event listener for connector events.
   * 
   * @public
   * @template K
   * @param {K} event - The event name to listen for
   * @param {ConnectorEvents[K]} listener - The event listener function
   * @returns {void}
   * 
   * @example
   * ```typescript
   * connector.on('connect', (data) => {
   *   console.log(`Connected to: ${data.account}`);
   * });
   * ```
   */
  on<K extends keyof ConnectorEvents>(event: K, listener: ConnectorEvents[K]): void {
    this.eventEmitter.on(event, listener as any);
  }

  /**
   * Removes an event listener for connector events.
   * 
   * @public
   * @template K
   * @param {K} event - The event name to remove listener from
   * @param {ConnectorEvents[K]} listener - The event listener function to remove
   * @returns {void}
   * 
   * @example
   * ```typescript
   * const handleConnect = (data) => {
   *   console.log(`Connected to: ${data.account}`);
   * };
   * 
   * // Add listener
   * connector.on('connect', handleConnect);
   * 
   * // Remove listener
   * connector.off('connect', handleConnect);
   * ```
   */
  off<K extends keyof ConnectorEvents>(event: K, listener: ConnectorEvents[K]): void {
    this.eventEmitter.off(event, listener as any);
  }

  async connect(config?: { chainId?: number; socialLogin?: boolean }): Promise<ConnectorData> {
    try {
      if (config?.socialLogin && this.customSocialLoginProvider) {
        return await this.connectWithSocialLogin();
      }

      // Check if there's a previous connection
      const storedAccount = localStorage.getItem('dsports-wagmi-account');
      const storedChainId = localStorage.getItem('dsports-wagmi-chainId');
      
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
      localStorage.setItem('dsports-wagmi-account', this.account);
      localStorage.setItem('dsports-wagmi-chainId', this.chainId.toString());

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
      localStorage.removeItem('dsports-wagmi-account');
      localStorage.removeItem('dsports-wagmi-chainId');

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
      // Create a mock provider for Wagmi
      this.provider = {
        request: async (args: any) => {
          switch (args.method) {
            case 'eth_requestAccounts':
              return [this.account];
            case 'eth_accounts':
              return this.account ? [this.account] : [];
            case 'eth_chainId':
              return `0x${this.chainId?.toString(16)}`;
            case 'eth_getBalance':
              return '0x1bc16d674ec80000'; // 2 ETH in wei
            case 'eth_sendTransaction':
              return `0x${'0'.repeat(64)}`; // Mock transaction hash
            case 'personal_sign':
              return `0x${'0'.repeat(130)}`; // Mock signature
            case 'eth_signTypedData_v4':
              return `0x${'0'.repeat(130)}`; // Mock typed data signature
            default:
              throw new Error(`Method ${args.method} not supported`);
          }
        },
        on: (event: string, handler: Function) => {
          this.on(event as any, handler as any);
        },
        removeListener: (event: string, handler: Function) => {
          this.off(event as any, handler as any);
        },
        // Wagmi-specific properties
        isConnected: () => this.isConnected,
        getNetwork: () => ({ chainId: this.chainId }),
        getSigner: () => this.getSigner()
      };
    }
    return this.provider;
  }

  async getSigner(): Promise<any> {
    const provider = await this.getProvider();
    return {
      getAddress: () => this.getAccount(),
      getChainId: () => this.getChainId(),
      signMessage: (message: string) => provider.request({
        method: 'personal_sign',
        params: [message, this.account]
      }),
      signTransaction: (transaction: any) => {
        return Promise.resolve(`0x${'0'.repeat(130)}`);
      },
      sendTransaction: (transaction: any) => {
        return Promise.resolve({
          hash: `0x${'0'.repeat(64)}`,
          wait: () => Promise.resolve({
            blockHash: `0x${'0'.repeat(64)}`,
            blockNumber: 12345,
            transactionHash: `0x${'0'.repeat(64)}`,
            status: 1
          })
        });
      }
    };
  }

  async isAuthorized(): Promise<boolean> {
    const storedAccount = localStorage.getItem('dsports-wagmi-account');
    return !!storedAccount;
  }

  async switchChain(chainId: number): Promise<void> {
    const chain = this.config.chains.find(c => c.id === chainId);
    if (!chain) {
      throw new Error(`Chain ${chainId} not configured`);
    }

    this.chainId = chainId;
    localStorage.setItem('dsports-wagmi-chainId', chainId.toString());

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
    localStorage.setItem('dsports-wagmi-account', this.account);
    localStorage.setItem('dsports-wagmi-chainId', this.chainId.toString());

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
    const data = `${socialResult.provider}-${socialResult.user.id}-wagmi`;
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

// Wagmi connector factory
export function createDSportsWagmiConnector(config: DSportsWagmiConnectorConfig) {
  return new DSportsWagmiConnector(config);
}

// Wagmi v2 compatible connector
export function dsportsWagmiConnector(config: DSportsWagmiConnectorConfig) {
  return () => ({
    id: 'dsports-wallet',
    name: 'D-Sports Wallet',
    type: 'dsports-wallet',
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMTIiIGZpbGw9IiM2MzY2RjEiLz4KPHBhdGggZD0iTTI0IDEySDM2VjM2SDI0VjEyWiIgZmlsbD0iI0Y5RkJGRiIvPgo8cGF0aCBkPSJNMTIgMTJIMjRWMjRIMTJWMTJaIiBmaWxsPSIjRjlGQkZGIi8+CjxwYXRoIGQ9Ik0xMiAyNEgyNFYzNkgxMlYyNFoiIGZpbGw9IiNGOUZCRkYiLz4KPC9zdmc+',
         connect: async (connectConfig?: { chainId?: number }) => {
       const connector = new DSportsWagmiConnector(config);
       const data = await connector.connect(connectConfig);
       return {
         accounts: [data.account] as `0x${string}`[],
         chainId: data.chain?.id || 1
       };
     },
    disconnect: async () => {
      // Disconnect logic
    },
    getAccounts: async () => {
      const connector = new DSportsWagmiConnector(config);
      const account = await connector.getAccount();
      return [account] as `0x${string}`[];
    },
    getChainId: async () => {
      const connector = new DSportsWagmiConnector(config);
      return await connector.getChainId();
    },
    getProvider: async () => {
      const connector = new DSportsWagmiConnector(config);
      return await connector.getProvider();
    },
    isAuthorized: async () => {
      const connector = new DSportsWagmiConnector(config);
      return await connector.isAuthorized();
    },
    switchChain: async (chainId: number) => {
      const connector = new DSportsWagmiConnector(config);
      await connector.switchChain(chainId);
      return {
        id: chainId,
        name: config.chains.find(c => c.id === chainId)?.name || 'Unknown',
        network: config.chains.find(c => c.id === chainId)?.network || 'unknown',
        nativeCurrency: config.chains.find(c => c.id === chainId)?.nativeCurrency || {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18
        },
        rpcUrls: config.chains.find(c => c.id === chainId)?.rpcUrls || {
          default: { http: ['https://rpc.example.com'] },
          public: { http: ['https://rpc.example.com'] }
        }
      };
    },
    onAccountsChanged: (accounts: string[]) => {
      // Handle accounts changed
    },
    onChainChanged: (chainId: number) => {
      // Handle chain changed
    },
    onConnect: (data: ConnectorData) => {
      // Handle connect
    },
    onDisconnect: () => {
      // Handle disconnect
    }
  });
} 