/**
 * @file wallet.ts
 * @description Core wallet functionality for the D-Sports wallet system. Provides wallet connection,
 * management, and event handling capabilities across multiple platforms.
 * @module core/wallet
 * @author D-Sports Engineering Team
 * @version 1.0.0
 * @since 2025-07-23
 */

import { EventEmitter } from '../utils/event-emitter';
import { 
  WalletConfig, 
  WalletState, 
  WalletAccount, 
  WalletConnector, 
  WalletEventMap, 
  WalletError,
  PlatformAdapter 
} from '../types';

/**
 * Main wallet class that manages wallet connections, state, and events.
 * This class serves as the primary entry point for wallet interactions in the D-Sports ecosystem.
 * 
 * @class
 * @extends EventEmitter<WalletEventMap>
 * 
 * @example
 * ```typescript
 * // Create a new wallet instance
 * const adapter = new WebPlatformAdapter();
 * const wallet = new DSportsWallet({
 *   appName: 'D-Sports App',
 *   chainId: 1,
 * }, adapter);
 * 
 * // Add connectors
 * wallet.addConnector(new RainbowKitConnector());
 * 
 * // Connect to a wallet
 * await wallet.connect('rainbow-kit');
 * ```
 */
export class DSportsWallet extends EventEmitter<WalletEventMap> {
  /**
   * Configuration options for the wallet
   * @private
   * @type {WalletConfig}
   */
  private config: WalletConfig;
  
  /**
   * Current wallet state including connection status and account information
   * @private
   * @type {WalletState}
   */
  private state: WalletState;
  
  /**
   * Map of available wallet connectors
   * @private
   * @type {Map<string, WalletConnector>}
   */
  private connectors: Map<string, WalletConnector> = new Map();
  
  /**
   * Platform-specific adapter for storage and other platform capabilities
   * @private
   * @type {PlatformAdapter}
   */
  private adapter: PlatformAdapter;
  
  /**
   * Currently active wallet connector
   * @private
   * @type {WalletConnector | undefined}
   */
  private currentConnector?: WalletConnector;

  /**
   * Creates a new DSportsWallet instance.
   * 
   * @constructor
   * @param {WalletConfig} config - Configuration options for the wallet
   * @param {PlatformAdapter} adapter - Platform-specific adapter for storage and other capabilities
   * 
   * @example
   * ```typescript
   * const adapter = new WebPlatformAdapter();
   * const wallet = new DSportsWallet({
   *   appName: 'D-Sports App',
   *   chainId: 1,
   * }, adapter);
   * ```
   */
  constructor(config: WalletConfig, adapter: PlatformAdapter) {
    super();
    this.config = config;
    this.adapter = adapter;
    this.state = {
      isConnecting: false,
      isReconnecting: false,
      isDisconnected: true,
    };
    
    this.initialize();
  }

  /**
   * Initializes the wallet by attempting to reconnect to a previously connected wallet.
   * This method is called automatically during construction.
   * 
   * @private
   * @async
   * @returns {Promise<void>}
   */
  private async initialize() {
    // Try to reconnect to previously connected wallet
    const lastConnector = await this.adapter.storage.getItem('dsports-wallet-connector');
    if (lastConnector) {
      this.state.isReconnecting = true;
      try {
        await this.reconnect(lastConnector);
      } catch (error) {
        console.warn('Failed to reconnect to previous wallet:', error);
      }
      this.state.isReconnecting = false;
    }
  }

  /**
   * Adds a wallet connector to the available connectors list and sets up event listeners.
   * 
   * @public
   * @param {WalletConnector} connector - The wallet connector to add
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // Add a Rainbow Kit connector
   * wallet.addConnector(new RainbowKitConnector());
   * 
   * // Add a Wagmi connector
   * wallet.addConnector(new WagmiConnector());
   * ```
   */
  public addConnector(connector: WalletConnector) {
    this.connectors.set(connector.id, connector);
    
    // Set up event listeners
    connector.on('connect', (data) => {
      this.handleConnect(connector, data);
    });
    
    connector.on('disconnect', () => {
      this.handleDisconnect();
    });
    
    connector.on('change', (data) => {
      this.handleChange(data);
    });
    
    connector.on('error', (error) => {
      this.handleError(error);
    });
  }

  /**
   * Removes a wallet connector from the available connectors list.
   * 
   * @public
   * @param {string} id - The ID of the connector to remove
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // Remove a connector
   * wallet.removeConnector('rainbow-kit');
   * ```
   */
  public removeConnector(id: string) {
    this.connectors.delete(id);
  }

  /**
   * Returns an array of all available wallet connectors.
   * 
   * @public
   * @returns {WalletConnector[]} Array of available wallet connectors
   * 
   * @example
   * ```typescript
   * // Get all available connectors
   * const connectors = wallet.getConnectors();
   * console.log(`Available connectors: ${connectors.length}`);
   * ```
   */
  public getConnectors(): WalletConnector[] {
    return Array.from(this.connectors.values());
  }

  /**
   * Returns a specific wallet connector by ID.
   * 
   * @public
   * @param {string} id - The ID of the connector to retrieve
   * @returns {WalletConnector | undefined} The requested connector or undefined if not found
   * 
   * @example
   * ```typescript
   * // Get a specific connector
   * const connector = wallet.getConnector('rainbow-kit');
   * if (connector) {
   *   console.log(`Found connector: ${connector.id}`);
   * }
   * ```
   */
  public getConnector(id: string): WalletConnector | undefined {
    return this.connectors.get(id);
  }

  /**
   * Connects to a wallet using the specified connector.
   * 
   * @public
   * @async
   * @param {string} connectorId - The ID of the connector to use
   * @param {any} [config] - Optional configuration for the connector
   * @returns {Promise<WalletAccount>} The connected wallet account
   * @throws {Error} If the connector is not found or connection fails
   * 
   * @example
   * ```typescript
   * try {
   *   // Connect to a wallet using Rainbow Kit
   *   const account = await wallet.connect('rainbow-kit');
   *   console.log(`Connected to wallet: ${account.address}`);
   * } catch (error) {
   *   console.error('Failed to connect:', error);
   * }
   * ```
   */
  public async connect(connectorId: string, config?: any): Promise<WalletAccount> {
    const connector = this.connectors.get(connectorId);
    if (!connector) {
      throw new Error(`Connector ${connectorId} not found`);
    }

    this.state.isConnecting = true;
    this.state.pendingConnector = connectorId;

    try {
      const data = await connector.connect(config);
      this.currentConnector = connector;
      
      // Store the connector for reconnection
      await this.adapter.storage.setItem('dsports-wallet-connector', connectorId);
      
      return this.createAccount(data);
    } catch (error) {
      this.state.isConnecting = false;
      this.state.pendingConnector = undefined;
      throw error;
    }
  }

  /**
   * Disconnects from the currently connected wallet.
   * 
   * @public
   * @async
   * @returns {Promise<void>}
   * 
   * @example
   * ```typescript
   * // Disconnect from the current wallet
   * await wallet.disconnect();
   * console.log('Wallet disconnected');
   * ```
   */
  public async disconnect(): Promise<void> {
    if (this.currentConnector) {
      await this.currentConnector.disconnect();
      this.currentConnector = undefined;
    }
    
    await this.adapter.storage.removeItem('dsports-wallet-connector');
    this.handleDisconnect();
  }

  /**
   * Switches the connected wallet to a different blockchain network.
   * 
   * @public
   * @async
   * @param {number} chainId - The chain ID to switch to
   * @returns {Promise<void>}
   * @throws {Error} If no wallet is connected or the chain switch fails
   * 
   * @example
   * ```typescript
   * try {
   *   // Switch to Ethereum mainnet (chain ID 1)
   *   await wallet.switchChain(1);
   *   console.log('Switched to Ethereum mainnet');
   * } catch (error) {
   *   console.error('Failed to switch chain:', error);
   * }
   * ```
   */
  public async switchChain(chainId: number): Promise<void> {
    if (!this.currentConnector) {
      throw new Error('No connector connected');
    }

    await this.currentConnector.switchChain(chainId);
  }

  /**
   * Returns a copy of the current wallet state.
   * 
   * @public
   * @returns {WalletState} The current wallet state
   * 
   * @example
   * ```typescript
   * // Get the current wallet state
   * const state = wallet.getState();
   * console.log(`Connection status: ${state.isConnected ? 'Connected' : 'Disconnected'}`);
   * ```
   */
  public getState(): WalletState {
    return { ...this.state };
  }

  /**
   * Returns the currently connected wallet account, if any.
   * 
   * @public
   * @returns {WalletAccount | undefined} The connected wallet account or undefined if not connected
   * 
   * @example
   * ```typescript
   * // Get the connected account
   * const account = wallet.getAccount();
   * if (account) {
   *   console.log(`Connected to: ${account.address}`);
   * } else {
   *   console.log('No wallet connected');
   * }
   * ```
   */
  public getAccount(): WalletAccount | undefined {
    return this.state.account;
  }

  /**
   * Checks if a wallet is currently connected.
   * 
   * @public
   * @returns {boolean} True if a wallet is connected, false otherwise
   * 
   * @example
   * ```typescript
   * // Check if a wallet is connected
   * if (wallet.isConnected()) {
   *   console.log('Wallet is connected');
   * } else {
   *   console.log('No wallet connected');
   * }
   * ```
   */
  public isConnected(): boolean {
    return !!this.state.account?.isConnected;
  }

  /**
   * Attempts to reconnect to a previously connected wallet.
   * 
   * @private
   * @async
   * @param {string} connectorId - The ID of the connector to reconnect with
   * @returns {Promise<void>}
   * 
   * @example
   * ```typescript
   * // This is called internally during initialization
   * await wallet.reconnect('rainbow-kit');
   * ```
   */
  private async reconnect(connectorId: string): Promise<void> {
    const connector = this.connectors.get(connectorId);
    if (!connector) {
      return;
    }

    try {
      const isAuthorized = await connector.isAuthorized();
      if (isAuthorized) {
        const account = await connector.getAccount();
        const chainId = await connector.getChainId();
        
        this.currentConnector = connector;
        this.state.account = {
          address: account,
          chainId,
          isConnected: true,
          connector: connectorId,
        };
        this.state.isDisconnected = false;
        
        this.emit('connect', this.state.account);
      }
    } catch (error) {
      // Ignore reconnection errors
    }
  }

  /**
   * Handles the connect event from a wallet connector.
   * 
   * @private
   * @param {WalletConnector} connector - The connector that emitted the event
   * @param {any} data - Connection data from the connector
   * @returns {void}
   */
  private handleConnect(connector: WalletConnector, data: any) {
    this.state.isConnecting = false;
    this.state.pendingConnector = undefined;
    this.state.isDisconnected = false;
    
    this.state.account = this.createAccount(data);
    this.emit('connect', this.state.account);
  }

  /**
   * Handles the disconnect event from a wallet connector.
   * 
   * @private
   * @returns {void}
   */
  private handleDisconnect() {
    this.state.account = undefined;
    this.state.isConnecting = false;
    this.state.isReconnecting = false;
    this.state.isDisconnected = true;
    this.state.pendingConnector = undefined;
    this.state.error = undefined;
    
    this.emit('disconnect');
  }

  /**
   * Handles state change events from a wallet connector.
   * 
   * @private
   * @param {any} data - Change data from the connector
   * @returns {void}
   */
  private handleChange(data: any) {
    if (data.account && this.state.account) {
      this.state.account.address = data.account;
      this.emit('accountsChanged', [data.account]);
    }
    
    if (data.chain && this.state.account) {
      this.state.account.chainId = data.chain.id;
      this.emit('chainChanged', data.chain.id);
    }
  }

  /**
   * Handles error events from a wallet connector.
   * 
   * @private
   * @param {Error} error - Error from the connector
   * @returns {void}
   */
  private handleError(error: Error) {
    const walletError: WalletError = {
      name: error.name,
      message: error.message,
      code: 'WALLET_ERROR',
      details: error,
    };
    
    this.state.error = walletError;
    this.emit('error', walletError);
  }

  /**
   * Creates a wallet account object from connector data.
   * 
   * @private
   * @param {any} data - Account data from the connector
   * @returns {WalletAccount} The created wallet account
   */
  private createAccount(data: any): WalletAccount {
    return {
      address: data.account || '',
      chainId: data.chain?.id || 1,
      isConnected: true,
      connector: this.currentConnector?.id,
    };
  }
} 