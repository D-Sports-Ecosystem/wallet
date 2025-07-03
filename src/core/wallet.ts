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

export class DSportsWallet extends EventEmitter<WalletEventMap> {
  private config: WalletConfig;
  private state: WalletState;
  private connectors: Map<string, WalletConnector> = new Map();
  private adapter: PlatformAdapter;
  private currentConnector?: WalletConnector;

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

  public removeConnector(id: string) {
    this.connectors.delete(id);
  }

  public getConnectors(): WalletConnector[] {
    return Array.from(this.connectors.values());
  }

  public getConnector(id: string): WalletConnector | undefined {
    return this.connectors.get(id);
  }

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

  public async disconnect(): Promise<void> {
    if (this.currentConnector) {
      await this.currentConnector.disconnect();
      this.currentConnector = undefined;
    }
    
    await this.adapter.storage.removeItem('dsports-wallet-connector');
    this.handleDisconnect();
  }

  public async switchChain(chainId: number): Promise<void> {
    if (!this.currentConnector) {
      throw new Error('No connector connected');
    }

    await this.currentConnector.switchChain(chainId);
  }

  public getState(): WalletState {
    return { ...this.state };
  }

  public getAccount(): WalletAccount | undefined {
    return this.state.account;
  }

  public isConnected(): boolean {
    return !!this.state.account?.isConnected;
  }

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

  private handleConnect(connector: WalletConnector, data: any) {
    this.state.isConnecting = false;
    this.state.pendingConnector = undefined;
    this.state.isDisconnected = false;
    
    this.state.account = this.createAccount(data);
    this.emit('connect', this.state.account);
  }

  private handleDisconnect() {
    this.state.account = undefined;
    this.state.isConnecting = false;
    this.state.isReconnecting = false;
    this.state.isDisconnected = true;
    this.state.pendingConnector = undefined;
    this.state.error = undefined;
    
    this.emit('disconnect');
  }

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

  private createAccount(data: any): WalletAccount {
    return {
      address: data.account || '',
      chainId: data.chain?.id || 1,
      isConnected: true,
      connector: this.currentConnector?.id,
    };
  }
} 