/**
 * @file rainbow-kit.ts
 * @description Rainbow Kit connector implementation for D-Sports wallet integration.
 * Provides wallet connection capabilities with Rainbow Kit compatibility.
 * @module connectors/rainbow-kit
 * @author D-Sports Engineering Team
 * @version 1.0.0
 * @since 2025-07-23
 */

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

/**
 * Configuration interface for the D-Sports Rainbow Kit connector.
 * Extends the standard Rainbow Kit connector options with D-Sports specific features.
 * 
 * @interface
 * @extends {RainbowKitConnectorOptions}
 * @property {CustomSocialLoginProvider} [customSocialLoginProvider] - Optional social login provider for OAuth-based wallet connections
 */
export interface DSportsRainbowKitConnectorConfig extends RainbowKitConnectorOptions {
  customSocialLoginProvider?: CustomSocialLoginProvider;
}

/**
 * D-Sports Rainbow Kit connector implementation.
 * Provides wallet connection capabilities with Rainbow Kit compatibility,
 * including social login integration.
 * 
 * @class
 * @implements {WalletConnector}
 * 
 * @example
 * ```typescript
 * // Create a Rainbow Kit connector
 * const connector = new DSportsRainbowKitConnector({
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
export class DSportsRainbowKitConnector implements WalletConnector {
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
   * @type {DSportsRainbowKitConnectorConfig}
   */
  private config: DSportsRainbowKitConnectorConfig;
  
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
   * Creates a new DSportsRainbowKitConnector instance.
   * 
   * @constructor
   * @param {DSportsRainbowKitConnectorConfig} config - Configuration options for the connector
   * 
   * @example
   * ```typescript
   * const connector = new DSportsRainbowKitConnector({
   *   chains: [
   *     { id: 1, name: 'Ethereum', network: 'ethereum' }
   *   ]
   * });
   * ```
   */
  constructor(config: DSportsRainbowKitConnectorConfig) {
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

  /**
   * Connects to a wallet using the Rainbow Kit connector.
   * Supports both standard wallet connection and social login.
   * 
   * @public
   * @async
   * @param {Object} [config] - Connection configuration options
   * @param {number} [config.chainId] - Optional chain ID to connect to
   * @param {boolean} [config.socialLogin] - Whether to use social login for connection
   * @returns {Promise<ConnectorData>} Connection data including account and chain information
   * @throws {Error} If connection fails
   * 
   * @example
   * ```typescript
   * // Connect to default chain
   * const data = await connector.connect();
   * console.log(`Connected to: ${data.account}`);
   * 
   * // Connect to specific chain
   * const data = await connector.connect({ chainId: 137 });
   * console.log(`Connected to Polygon: ${data.account}`);
   * 
   * // Connect with social login
   * const data = await connector.connect({ socialLogin: true });
   * console.log(`Connected with social login: ${data.account}`);
   * ```
   */
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

  /**
   * Disconnects from the currently connected wallet.
   * Clears all connection data and emits a disconnect event.
   * 
   * @public
   * @async
   * @returns {Promise<void>}
   * @throws {Error} If disconnection fails
   * 
   * @example
   * ```typescript
   * // Disconnect from wallet
   * await connector.disconnect();
   * console.log('Wallet disconnected');
   * ```
   */
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

  /**
   * Gets the currently connected wallet address.
   * 
   * @public
   * @async
   * @returns {Promise<string>} The connected wallet address
   * @throws {Error} If no wallet is connected
   * 
   * @example
   * ```typescript
   * try {
   *   const address = await connector.getAccount();
   *   console.log(`Connected address: ${address}`);
   * } catch (error) {
   *   console.error('No wallet connected');
   * }
   * ```
   */
  async getAccount(): Promise<string> {
    if (!this.account) {
      throw new Error('No account connected');
    }
    return this.account;
  }

  /**
   * Gets the currently connected chain ID.
   * 
   * @public
   * @async
   * @returns {Promise<number>} The connected chain ID
   * @throws {Error} If no chain is connected
   * 
   * @example
   * ```typescript
   * try {
   *   const chainId = await connector.getChainId();
   *   console.log(`Connected to chain: ${chainId}`);
   * } catch (error) {
   *   console.error('No chain connected');
   * }
   * ```
   */
  async getChainId(): Promise<number> {
    if (!this.chainId) {
      throw new Error('No chain connected');
    }
    return this.chainId;
  }

  /**
   * Gets the Ethereum provider instance.
   * Creates a mock provider if one doesn't exist yet.
   * 
   * @public
   * @async
   * @returns {Promise<any>} The Ethereum provider instance
   * 
   * @example
   * ```typescript
   * const provider = await connector.getProvider();
   * const accounts = await provider.request({ method: 'eth_accounts' });
   * console.log(`Accounts: ${accounts}`);
   * ```
   */
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

  /**
   * Gets a signer instance for the connected wallet.
   * 
   * @public
   * @async
   * @returns {Promise<any>} The signer instance
   * 
   * @example
   * ```typescript
   * const signer = await connector.getSigner();
   * const address = await signer.getAddress();
   * const signature = await signer.signMessage('Hello, D-Sports!');
   * console.log(`Signature: ${signature}`);
   * ```
   */
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

  /**
   * Checks if the wallet is already authorized.
   * 
   * @public
   * @async
   * @returns {Promise<boolean>} True if the wallet is authorized, false otherwise
   * 
   * @example
   * ```typescript
   * const isAuthorized = await connector.isAuthorized();
   * if (isAuthorized) {
   *   console.log('Wallet is already authorized');
   * } else {
   *   console.log('Wallet needs to be connected');
   * }
   * ```
   */
  async isAuthorized(): Promise<boolean> {
    const storedAccount = localStorage.getItem('dsports-wallet-account');
    return !!storedAccount;
  }

  /**
   * Switches the connected wallet to a different blockchain network.
   * 
   * @public
   * @async
   * @param {number} chainId - The chain ID to switch to
   * @returns {Promise<void>}
   * @throws {Error} If the chain is not configured or switching fails
   * 
   * @example
   * ```typescript
   * try {
   *   // Switch to Polygon (chain ID 137)
   *   await connector.switchChain(137);
   *   console.log('Switched to Polygon');
   * } catch (error) {
   *   console.error('Failed to switch chain:', error);
   * }
   * ```
   */
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

  /**
   * Connects to a wallet using social login.
   * 
   * @private
   * @async
   * @returns {Promise<ConnectorData>} Connection data including account and chain information
   * @throws {Error} If social login provider is not configured or login fails
   */
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

  /**
   * Prompts the user to choose a social login provider.
   * In a real implementation, this would show a modal or UI prompt.
   * 
   * @private
   * @async
   * @returns {Promise<SocialProvider>} The selected social provider
   */
  private async promptSocialProvider(): Promise<SocialProvider> {
    // In a real implementation, this would show a modal or prompt
    // For now, we'll default to Google
    return 'google';
  }

  /**
   * Generates a deterministic Ethereum address from social login information.
   * 
   * @private
   * @param {SocialLoginResult} socialResult - The social login result
   * @returns {string} The generated Ethereum address
   */
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

  /**
   * Generates a random Ethereum address for mock wallet connections.
   * 
   * @private
   * @returns {string} The generated Ethereum address
   */
  private generateMockAddress(): string {
    // Generate a random mock address
    const randomBytes = new Uint8Array(20);
    crypto.getRandomValues(randomBytes);
    return '0x' + Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
}

/**
 * Factory function to create a Rainbow Kit compatible connector.
 * This function returns a connector configuration that can be used with Rainbow Kit.
 * 
 * @function
 * @param {DSportsRainbowKitConnectorConfig} config - Configuration options for the connector
 * @returns {Function} A function that returns the connector configuration
 * 
 * @example
 * ```typescript
 * import { createDSportsRainbowKitConnector } from '@d-sports/wallet/connectors';
 * import { connectorsForWallets } from '@rainbow-me/rainbowkit';
 * 
 * const dsportsWallet = createDSportsRainbowKitConnector({
 *   chains: [
 *     { id: 1, name: 'Ethereum', network: 'ethereum' }
 *   ],
 *   customSocialLoginProvider: socialLoginProvider
 * });
 * 
 * const connectors = connectorsForWallets([
 *   {
 *     groupName: 'Recommended',
 *     wallets: [dsportsWallet]
 *   }
 * ]);
 * ```
 */
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