import { DSportsWallet } from '../../core/wallet';
import { WalletConfig, WalletConnector, ConnectorData } from '../../types';
import { webPlatformAdapter } from '../../utils/platform-adapters';

// Mock connector for testing
class MockWalletConnector implements WalletConnector {
  public readonly id = 'mock-wallet';
  public readonly name = 'Mock Wallet';
  public readonly ready = true;
  public readonly icon = 'mock-icon';

  private listeners: Map<string, Function[]> = new Map();
  private mockAccount = '0x1234567890123456789012345678901234567890';
  private mockChainId = 1;
  private connected = false;

  async connect(): Promise<ConnectorData> {
    this.connected = true;
    const data: ConnectorData = {
      account: this.mockAccount,
      chain: { id: this.mockChainId },
      provider: {}
    };
    
    this.emit('connect', data);
    return data;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    this.emit('disconnect');
  }

  async getAccount(): Promise<string> {
    if (!this.connected) throw new Error('Not connected');
    return this.mockAccount;
  }

  async getChainId(): Promise<number> {
    if (!this.connected) throw new Error('Not connected');
    return this.mockChainId;
  }

  async getProvider(): Promise<any> {
    if (!this.connected) throw new Error('Not connected');
    return { isMetaMask: true };
  }

  async getSigner(): Promise<any> {
    if (!this.connected) throw new Error('Not connected');
    return {
      getAddress: () => this.mockAccount,
      signMessage: (message: string) => `signed:${message}`,
      sendTransaction: (tx: any) => ({ hash: '0x123...' })
    };
  }

  async isAuthorized(): Promise<boolean> {
    return this.connected;
  }

  async switchChain(chainId: number): Promise<void> {
    if (!this.connected) throw new Error('Not connected');
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

  // Mock-specific methods for testing
  setAccount(account: string): void {
    this.mockAccount = account;
  }

  setChainId(chainId: number): void {
    this.mockChainId = chainId;
  }

  isConnected(): boolean {
    return this.connected;
  }
}

// Mock wallet store factory
export function createMockWalletStore() {
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
      },
      {
        id: 137,
        name: 'Polygon',
        network: 'matic',
        nativeCurrency: { name: 'Matic', symbol: 'MATIC', decimals: 18 },
        rpcUrls: {
          default: { http: ['https://polygon.example.com'] },
          public: { http: ['https://polygon.example.com'] }
        }
      }
    ]
  };

  const wallet = new DSportsWallet(mockConfig, webPlatformAdapter);
  const mockConnector = new MockWalletConnector();
  wallet.addConnector(mockConnector);

  return {
    wallet,
    mockConnector,
    config: mockConfig
  };
}

// Mock data factories
export const mockTokenBalances = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    balance: '1.5',
    decimals: 18,
    value: '3000.00',
    price: '2000.00',
    logoUri: 'https://example.com/eth.png'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    balance: '100.0',
    decimals: 6,
    value: '100.00',
    price: '1.00',
    contractAddress: '0xa0b86a33e6b96f9c455c07b77f27d0a7e5b16aab',
    logoUri: 'https://example.com/usdc.png'
  }
];

export const mockNFTAssets = [
  {
    id: 'nft-1',
    name: 'Cool NFT #1',
    description: 'A very cool NFT',
    image: 'https://example.com/nft1.png',
    collection: 'Cool Collection',
    contractAddress: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
    tokenId: '1',
    attributes: [
      { trait_type: 'Background', value: 'Blue' },
      { trait_type: 'Eyes', value: 'Laser' }
    ]
  },
  {
    id: 'nft-2',
    name: 'Awesome NFT #2',
    description: 'An awesome NFT',
    image: 'https://example.com/nft2.png',
    collection: 'Awesome Collection',
    contractAddress: '0x60e4d786628fea6478f785a6d7e704777c86a7c6',
    tokenId: '2',
    attributes: [
      { trait_type: 'Hat', value: 'Cap' },
      { trait_type: 'Mouth', value: 'Smile' }
    ]
  }
];

export const mockGameInventoryItems = [
  {
    id: 'sword-1',
    name: 'Dragon Slayer Sword',
    description: 'A legendary sword forged in dragon fire',
    image: 'https://example.com/sword.png',
    game: 'Fantasy RPG',
    category: 'weapon',
    rarity: 'legendary',
    level: 50,
    attributes: {
      attack: 150,
      durability: 100,
      enchantment: 'fire'
    },
    isEquipped: true,
    isTransferable: true
  },
  {
    id: 'armor-1',
    name: 'Mystic Armor',
    description: 'Armor imbued with magical properties',
    image: 'https://example.com/armor.png',
    game: 'Fantasy RPG',
    category: 'armor',
    rarity: 'epic',
    level: 45,
    attributes: {
      defense: 120,
      durability: 95,
      enchantment: 'protection'
    },
    isEquipped: false,
    isTransferable: true
  }
];

export const mockUserSession = {
  user: {
    id: 'user-123',
    email: 'user@example.com',
    name: 'Test User',
    avatar: 'https://example.com/avatar.png'
  },
  wallet: {
    address: '0x1234567890123456789012345678901234567890',
    chainId: 1,
    isConnected: true,
    connector: 'mock-wallet'
  },
  isAuthenticated: true,
  socialLoginResult: {
    provider: 'google',
    token: 'mock-token',
    user: {
      id: 'google-123',
      email: 'user@example.com',
      name: 'Test User'
    }
  }
};

describe('Wallet Store Mocking', () => {
  let mockStore: ReturnType<typeof createMockWalletStore>;

  beforeEach(() => {
    mockStore = createMockWalletStore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Mock Wallet Creation', () => {
    it('should create a wallet with mock configuration', () => {
      expect(mockStore.wallet).toBeDefined();
      expect(mockStore.mockConnector).toBeDefined();
      expect(mockStore.config.appName).toBe('Test App');
      expect(mockStore.config.chains).toHaveLength(2);
    });

    it('should have mock connector available', () => {
      const connectors = mockStore.wallet.getConnectors();
      expect(connectors).toHaveLength(1);
      expect(connectors[0].id).toBe('mock-wallet');
      expect(connectors[0].name).toBe('Mock Wallet');
    });
  });

  describe('Wallet Connection Flow', () => {
    it('should connect to mock wallet successfully', async () => {
      const account = await mockStore.wallet.connect('mock-wallet');
      
      expect(account.address).toBe('0x1234567890123456789012345678901234567890');
      expect(account.chainId).toBe(1);
      expect(account.isConnected).toBe(true);
      expect(account.connector).toBe('mock-wallet');
    });

    it('should handle wallet state changes', async () => {
      const stateChanges: any[] = [];
      
      mockStore.wallet.on('connect', (account) => {
        stateChanges.push({ type: 'connect', account });
      });

      mockStore.wallet.on('disconnect', () => {
        stateChanges.push({ type: 'disconnect' });
      });

      // Connect
      await mockStore.wallet.connect('mock-wallet');
      expect(stateChanges).toHaveLength(1);
      expect(stateChanges[0].type).toBe('connect');

      // Disconnect
      await mockStore.wallet.disconnect();
      expect(stateChanges.length).toBeGreaterThanOrEqual(1);
      // Just check that at least one disconnect event was received
      const disconnectEvents = stateChanges.filter(change => change.type === 'disconnect');
      expect(disconnectEvents.length).toBeGreaterThanOrEqual(1);
    });

    it('should switch chains correctly', async () => {
      await mockStore.wallet.connect('mock-wallet');
      
      const chainChanges: number[] = [];
      mockStore.wallet.on('chainChanged', (chainId) => {
        chainChanges.push(chainId);
      });

      await mockStore.wallet.switchChain(137);
      expect(chainChanges).toContain(137);

      const account = mockStore.wallet.getAccount();
      expect(account?.chainId).toBe(137);
    });
  });

  describe('Error Handling', () => {
    it('should handle connection errors', async () => {
      await expect(mockStore.wallet.connect('non-existent')).rejects.toThrow(
        'Connector non-existent not found'
      );
    });

    it('should handle operations when not connected', async () => {
      await expect(mockStore.wallet.switchChain(137)).rejects.toThrow(
        'No connector connected'
      );
    });
  });

  describe('Mock Connector Functionality', () => {
    it('should support mock-specific operations', async () => {
      // Change mock account
      mockStore.mockConnector.setAccount('0xnewaddress');
      await mockStore.wallet.connect('mock-wallet');
      
      const account = mockStore.wallet.getAccount();
      expect(account?.address).toBe('0xnewaddress');
    });

    it('should track connection state', async () => {
      expect(mockStore.mockConnector.isConnected()).toBe(false);
      
      await mockStore.wallet.connect('mock-wallet');
      expect(mockStore.mockConnector.isConnected()).toBe(true);
      
      await mockStore.wallet.disconnect();
      expect(mockStore.mockConnector.isConnected()).toBe(false);
    });
  });
});

describe('Mock Data Factories', () => {
  describe('Token Balances', () => {
    it('should provide valid token balance data', () => {
      expect(mockTokenBalances).toHaveLength(2);
      
      const ethToken = mockTokenBalances[0];
      expect(ethToken.symbol).toBe('ETH');
      expect(ethToken.decimals).toBe(18);
      expect(parseFloat(ethToken.balance)).toBeGreaterThan(0);
      expect(parseFloat(ethToken.value!)).toBeGreaterThan(0);
    });

    it('should include contract addresses for ERC-20 tokens', () => {
      const usdcToken = mockTokenBalances.find(token => token.symbol === 'USDC');
      expect(usdcToken?.contractAddress).toBeDefined();
      expect(usdcToken?.contractAddress).toMatch(/^0x[a-fA-F0-9]{40}$/);
    });
  });

  describe('NFT Assets', () => {
    it('should provide valid NFT data', () => {
      expect(mockNFTAssets).toHaveLength(2);
      
      const nft = mockNFTAssets[0];
      expect(nft.id).toBeDefined();
      expect(nft.name).toBeDefined();
      expect(nft.contractAddress).toMatch(/^0x[a-fA-F0-9]{40}$/);
      expect(nft.tokenId).toBeDefined();
      expect(nft.attributes).toBeInstanceOf(Array);
    });
  });

  describe('Game Inventory Items', () => {
    it('should provide valid game inventory data', () => {
      expect(mockGameInventoryItems).toHaveLength(2);
      
      const item = mockGameInventoryItems[0];
      expect(item.id).toBeDefined();
      expect(item.name).toBeDefined();
      expect(item.game).toBeDefined();
      expect(item.category).toBeDefined();
      expect(item.rarity).toBeDefined();
      expect(typeof item.isTransferable).toBe('boolean');
    });

    it('should include game-specific attributes', () => {
      const sword = mockGameInventoryItems.find(item => item.category === 'weapon');
      expect(sword?.attributes).toBeDefined();
      expect(sword?.attributes.attack).toBeGreaterThan(0);
      expect(sword?.level).toBeGreaterThan(0);
    });
  });

  describe('User Session', () => {
    it('should provide valid user session data', () => {
      expect(mockUserSession.user.id).toBeDefined();
      expect(mockUserSession.isAuthenticated).toBe(true);
      expect(mockUserSession.wallet?.address).toMatch(/^0x[a-fA-F0-9]{40}$/);
      expect(mockUserSession.socialLoginResult).toBeDefined();
    });
  });
});

describe('Integration Testing Helpers', () => {
  it('should create consistent mock data for testing', () => {
    const store1 = createMockWalletStore();
    const store2 = createMockWalletStore();
    
    // Both stores should have the same configuration
    expect(store1.config.appName).toBe(store2.config.appName);
    expect(store1.config.chains.length).toBe(store2.config.chains.length);
    
    // But should be separate instances
    expect(store1.wallet).not.toBe(store2.wallet);
    expect(store1.mockConnector).not.toBe(store2.mockConnector);
  });

  it('should support async operations in tests', async () => {
    const mockStore = createMockWalletStore();
    
    // Test async data fetching simulation
    const fetchTokens = jest.fn().mockResolvedValue(mockTokenBalances);
    const fetchNFTs = jest.fn().mockResolvedValue(mockNFTAssets);
    const fetchInventory = jest.fn().mockResolvedValue(mockGameInventoryItems);
    
    const [tokens, nfts, inventory] = await Promise.all([
      fetchTokens(),
      fetchNFTs(),
      fetchInventory()
    ]);
    
    expect(tokens).toEqual(mockTokenBalances);
    expect(nfts).toEqual(mockNFTAssets);
    expect(inventory).toEqual(mockGameInventoryItems);
    expect(fetchTokens).toHaveBeenCalledTimes(1);
    expect(fetchNFTs).toHaveBeenCalledTimes(1);
    expect(fetchInventory).toHaveBeenCalledTimes(1);
  });
});
