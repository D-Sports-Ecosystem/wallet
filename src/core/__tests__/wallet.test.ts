import { DSportsWallet } from '../wallet';
import { webPlatformAdapter } from '../../utils/platform-adapters';
import { WalletConfig, WalletConnector, ConnectorData } from '../../types';

// Mock connector for testing
class MockConnector implements WalletConnector {
  public readonly id = 'mock-connector';
  public readonly name = 'Mock Connector';
  public readonly ready = true;
  public readonly icon = 'mock-icon';

  private listeners: Map<string, Function[]> = new Map();
  private mockAccount = '0x1234567890123456789012345678901234567890';
  private mockChainId = 1;

  async connect(): Promise<ConnectorData> {
    const data: ConnectorData = {
      account: this.mockAccount,
      chain: { id: this.mockChainId },
      provider: {}
    };
    
    // Emit connect event
    this.emit('connect', data);
    return data;
  }

  async disconnect(): Promise<void> {
    this.emit('disconnect');
  }

  async getAccount(): Promise<string> {
    return this.mockAccount;
  }

  async getChainId(): Promise<number> {
    return this.mockChainId;
  }

  async getProvider(): Promise<any> {
    return {};
  }

  async getSigner(): Promise<any> {
    return {
      getAddress: () => this.mockAccount,
      signMessage: (message: string) => `signed:${message}`
    };
  }

  async isAuthorized(): Promise<boolean> {
    return true;
  }

  async switchChain(chainId: number): Promise<void> {
    this.mockChainId = chainId;
    this.emit('change', {
      account: this.mockAccount,
      chain: { id: chainId },
      provider: {}
    });
  }

  on(event: string, listener: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }

  off(event: string, listener: Function): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(listener => listener(data));
    }
  }
}

describe('DSportsWallet', () => {
  let wallet: DSportsWallet;
  let mockConnector: MockConnector;
  
  const mockConfig: WalletConfig = {
    appName: 'Test App',
    projectId: 'test-project',
    chains: [
      {
        id: 1,
        name: 'Ethereum',
        network: 'homestead',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: {
          default: { http: ['https://eth.example.com'] },
          public: { http: ['https://eth.example.com'] }
        }
      }
    ]
  };

  beforeEach(() => {
    wallet = new DSportsWallet(mockConfig, webPlatformAdapter);
    mockConnector = new MockConnector();
    wallet.addConnector(mockConnector);
  });

  describe('Initialization', () => {
    it('should initialize with correct state', () => {
      const state = wallet.getState();
      expect(state.isConnecting).toBe(false);
      expect(state.isReconnecting).toBe(false);
      expect(state.isDisconnected).toBe(true);
      expect(state.account).toBeUndefined();
    });

    it('should add connectors correctly', () => {
      const connectors = wallet.getConnectors();
      expect(connectors).toHaveLength(1);
      expect(connectors[0].id).toBe('mock-connector');
    });

    it('should get connector by id', () => {
      const connector = wallet.getConnector('mock-connector');
      expect(connector).toBe(mockConnector);
    });
  });

  describe('Connection', () => {
    it('should connect to wallet successfully', async () => {
      const account = await wallet.connect('mock-connector');
      
      expect(account.address).toBe('0x1234567890123456789012345678901234567890');
      expect(account.chainId).toBe(1);
      expect(account.isConnected).toBe(true);
      expect(account.connector).toBe('mock-connector');
    });

    it('should throw error when connecting to non-existent connector', async () => {
      await expect(wallet.connect('non-existent')).rejects.toThrow('Connector non-existent not found');
    });

    it('should return connected state after connection', async () => {
      await wallet.connect('mock-connector');
      
      expect(wallet.isConnected()).toBe(true);
      const account = wallet.getAccount();
      expect(account?.address).toBe('0x1234567890123456789012345678901234567890');
    });
  });

  describe('Disconnection', () => {
    it('should disconnect wallet successfully', async () => {
      await wallet.connect('mock-connector');
      expect(wallet.isConnected()).toBe(true);

      await wallet.disconnect();
      expect(wallet.isConnected()).toBe(false);
      expect(wallet.getAccount()).toBeUndefined();
    });
  });

  describe('Chain Switching', () => {
    it('should switch chain successfully', async () => {
      await wallet.connect('mock-connector');
      await wallet.switchChain(137);
      
      const account = wallet.getAccount();
      expect(account?.chainId).toBe(137);
    });

    it('should throw error when switching chain without connection', async () => {
      await expect(wallet.switchChain(137)).rejects.toThrow('No connector connected');
    });
  });

  describe('Events', () => {
    it('should emit connect event', (done) => {
      wallet.on('connect', (account) => {
        expect(account.address).toBe('0x1234567890123456789012345678901234567890');
        done();
      });

      wallet.connect('mock-connector');
    });

    it('should emit disconnect event', (done) => {
      wallet.on('disconnect', () => {
        done();
      });

      wallet.connect('mock-connector').then(() => {
        wallet.disconnect();
      });
    });

    it('should emit chainChanged event', (done) => {
      wallet.on('chainChanged', (chainId) => {
        expect(chainId).toBe(137);
        done();
      });

      wallet.connect('mock-connector').then(() => {
        wallet.switchChain(137);
      });
    });
  });

  describe('State Management', () => {
    it('should maintain correct state during connection flow', async () => {
      // Initial state
      expect(wallet.getState().isDisconnected).toBe(true);

      // After connection
      const account = await wallet.connect('mock-connector');
      const state = wallet.getState();
      expect(state.isConnecting).toBe(false);
      expect(state.isDisconnected).toBe(false);
      expect(state.account).toBeDefined();
      expect(account.address).toBe('0x1234567890123456789012345678901234567890');
    });
  });
}); 