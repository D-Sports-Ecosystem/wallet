import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { DSportsWallet } from '../../../core/wallet';
import { WalletUIProvider, useWalletUI, useWalletUIContext, useWallet, useWalletData } from '../../context/WalletUIProvider';
import { WalletConfig, WalletConnector, ConnectorData, WalletAccount } from '../../../types';
import { webPlatformAdapter } from '../../../utils/platform-adapters';

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

// Test component that uses the context
const TestComponent: React.FC = () => {
  const { connect, disconnect, isLoading, error, walletStore } = useWalletUI();
  
  return (
    <div>
      <div data-testid="connection-status">
        {walletStore.isConnected ? 'Connected' : 'Disconnected'}
      </div>
      <div data-testid="loading-status">
        {isLoading ? 'Loading' : 'Not Loading'}
      </div>
      <div data-testid="account-address">
        {walletStore.account?.address || 'No Address'}
      </div>
      {error && <div data-testid="error">{error.message}</div>}
      <button 
        data-testid="connect-button" 
        onClick={() => connect('mock-connector')}
      >
        Connect
      </button>
      <button 
        data-testid="disconnect-button" 
        onClick={disconnect}
      >
        Disconnect
      </button>
    </div>
  );
};

// Test component for useWalletUIContext hook
const ContextTestComponent: React.FC = () => {
  const { walletStore, session } = useWalletUIContext();
  
  return (
    <div>
      <div data-testid="wallet-connected">
        {walletStore.isConnected ? 'Connected' : 'Disconnected'}
      </div>
      <div data-testid="session-id">
        {session?.id || 'No Session'}
      </div>
    </div>
  );
};

// Test component for useWallet hook
const WalletTestComponent: React.FC = () => {
  const { wallet, isConnected, isConnecting, connect, disconnect, error } = useWallet();
  
  return (
    <div>
      <div data-testid="wallet-connected">
        {isConnected ? 'Connected' : 'Disconnected'}
      </div>
      <div data-testid="wallet-connecting">
        {isConnecting ? 'Connecting' : 'Not Connecting'}
      </div>
      <div data-testid="wallet-address">
        {wallet?.address || 'No Address'}
      </div>
      {error && <div data-testid="wallet-error">{error.message}</div>}
      <button 
        data-testid="wallet-connect" 
        onClick={() => connect('mock-connector')}
      >
        Connect
      </button>
      <button 
        data-testid="wallet-disconnect" 
        onClick={disconnect}
      >
        Disconnect
      </button>
    </div>
  );
};

// Test component for useWalletData hook
const WalletDataTestComponent: React.FC = () => {
  const { 
    tokens, 
    nfts, 
    inventory, 
    isLoading, 
    error, 
    refreshTokens, 
    refreshNFTs, 
    refreshInventory 
  } = useWalletData();
  
  return (
    <div>
      <div data-testid="tokens-count">{tokens.length}</div>
      <div data-testid="nfts-count">{nfts.length}</div>
      <div data-testid="inventory-count">{inventory.length}</div>
      <div data-testid="data-loading">{isLoading ? 'Loading' : 'Not Loading'}</div>
      {error && <div data-testid="data-error">{error.message}</div>}
      <button data-testid="refresh-tokens" onClick={refreshTokens}>
        Refresh Tokens
      </button>
      <button data-testid="refresh-nfts" onClick={refreshNFTs}>
        Refresh NFTs
      </button>
      <button data-testid="refresh-inventory" onClick={refreshInventory}>
        Refresh Inventory
      </button>
    </div>
  );
};

describe('WalletUIProvider', () => {
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

  const mockSession = {
    user: {
      id: 'test-user-123',
      email: 'test@example.com',
      name: 'Test User'
    },
    isAuthenticated: true
  };

  beforeEach(() => {
    wallet = new DSportsWallet(mockConfig, webPlatformAdapter);
    mockConnector = new MockConnector();
    wallet.addConnector(mockConnector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Context Provider Setup', () => {
    it('should provide wallet UI context to children', () => {
      render(
        <WalletUIProvider wallet={wallet}>
          <TestComponent />
        </WalletUIProvider>
      );

      expect(screen.getByTestId('connection-status')).toHaveTextContent('Disconnected');
      expect(screen.getByTestId('loading-status')).toHaveTextContent('Not Loading');
      expect(screen.getByTestId('account-address')).toHaveTextContent('No Address');
    });

    it('should throw error when useWalletUI is used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useWalletUI must be used within a WalletUIProvider');

      consoleSpy.mockRestore();
    });

    it('should provide session data to context', () => {
      render(
        <WalletUIProvider wallet={wallet} session={mockSession}>
          <ContextTestComponent />
        </WalletUIProvider>
      );

      expect(screen.getByTestId('session-id')).toHaveTextContent('test-user-123');
    });
  });

  describe('Wallet Connection', () => {
    it('should handle wallet connection through context', async () => {
      render(
        <WalletUIProvider wallet={wallet}>
          <TestComponent />
        </WalletUIProvider>
      );

      const connectButton = screen.getByTestId('connect-button');
      
      await act(async () => {
        fireEvent.click(connectButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('connection-status')).toHaveTextContent('Connected');
        expect(screen.getByTestId('account-address')).toHaveTextContent('0x1234567890123456789012345678901234567890');
      });
    });

    it('should handle wallet disconnection through context', async () => {
      render(
        <WalletUIProvider wallet={wallet}>
          <TestComponent />
        </WalletUIProvider>
      );

      // Connect first
      const connectButton = screen.getByTestId('connect-button');
      await act(async () => {
        fireEvent.click(connectButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('connection-status')).toHaveTextContent('Connected');
      });

      // Then disconnect
      const disconnectButton = screen.getByTestId('disconnect-button');
      await act(async () => {
        fireEvent.click(disconnectButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('connection-status')).toHaveTextContent('Disconnected');
        expect(screen.getByTestId('account-address')).toHaveTextContent('No Address');
      });
    });

    it('should show loading state during connection', async () => {
      // Mock a delayed connection
      const delayedConnector = new MockConnector();
      const originalConnect = delayedConnector.connect;
      delayedConnector.connect = jest.fn().mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return originalConnect.call(delayedConnector);
      });
      
      wallet.addConnector(delayedConnector);

      render(
        <WalletUIProvider wallet={wallet}>
          <TestComponent />
        </WalletUIProvider>
      );

      const connectButton = screen.getByTestId('connect-button');
      
      act(() => {
        fireEvent.click(connectButton);
      });

      // Should show loading state
      expect(screen.getByTestId('loading-status')).toHaveTextContent('Loading');

      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('Not Loading');
        expect(screen.getByTestId('connection-status')).toHaveTextContent('Connected');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle connection errors', async () => {
      const errorConnector = new MockConnector();
      errorConnector.connect = jest.fn().mockRejectedValue(new Error('Connection failed'));
      wallet.addConnector(errorConnector);

      render(
        <WalletUIProvider wallet={wallet}>
          <TestComponent />
        </WalletUIProvider>
      );

      const connectButton = screen.getByTestId('connect-button');
      
      await act(async () => {
        fireEvent.click(connectButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Connection failed');
      });
    });
  });

  describe('Custom Functions', () => {
    it('should use custom fetchTokens function', async () => {
      const mockTokens = [
        { symbol: 'ETH', name: 'Ethereum', balance: '1.5', decimals: 18 },
        { symbol: 'USDC', name: 'USD Coin', balance: '100', decimals: 6 }
      ];

      const fetchTokens = jest.fn().mockResolvedValue(mockTokens);

      render(
        <WalletUIProvider wallet={wallet} fetchTokens={fetchTokens}>
          <WalletDataTestComponent />
        </WalletUIProvider>
      );

      const refreshButton = screen.getByTestId('refresh-tokens');
      
      await act(async () => {
        fireEvent.click(refreshButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('tokens-count')).toHaveTextContent('2');
        expect(fetchTokens).toHaveBeenCalled();
      });
    });

    it('should use custom fetchNFTs function', async () => {
      const mockNFTs = [
        { 
          id: '1', 
          name: 'Test NFT', 
          image: 'test.jpg', 
          collection: 'Test Collection',
          contractAddress: '0xtest',
          tokenId: '1'
        }
      ];

      const fetchNFTs = jest.fn().mockResolvedValue(mockNFTs);

      render(
        <WalletUIProvider wallet={wallet} fetchNFTs={fetchNFTs}>
          <WalletDataTestComponent />
        </WalletUIProvider>
      );

      const refreshButton = screen.getByTestId('refresh-nfts');
      
      await act(async () => {
        fireEvent.click(refreshButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('nfts-count')).toHaveTextContent('1');
        expect(fetchNFTs).toHaveBeenCalled();
      });
    });

    it('should handle toast notifications', () => {
      const showToast = jest.fn();

      const ToastTestComponent = () => {
        const { showToast: contextShowToast } = useWalletUI();
        
        return (
          <button 
            data-testid="show-toast"
            onClick={() => contextShowToast({ message: 'Test toast', type: 'success' })}
          >
            Show Toast
          </button>
        );
      };

      render(
        <WalletUIProvider wallet={wallet} showToast={showToast}>
          <ToastTestComponent />
        </WalletUIProvider>
      );

      const toastButton = screen.getByTestId('show-toast');
      fireEvent.click(toastButton);

      expect(showToast).toHaveBeenCalledWith({
        message: 'Test toast',
        type: 'success'
      });
    });
  });

  describe('useWallet Hook', () => {
    it('should provide wallet-specific functionality', () => {
      render(
        <WalletUIProvider wallet={wallet} session={mockSession}>
          <WalletTestComponent />
        </WalletUIProvider>
      );

      expect(screen.getByTestId('wallet-connected')).toHaveTextContent('Disconnected');
      expect(screen.getByTestId('wallet-connecting')).toHaveTextContent('Not Connecting');
      expect(screen.getByTestId('wallet-address')).toHaveTextContent('No Address');
    });

    it('should handle wallet connection through useWallet hook', async () => {
      render(
        <WalletUIProvider wallet={wallet}>
          <WalletTestComponent />
        </WalletUIProvider>
      );

      const connectButton = screen.getByTestId('wallet-connect');
      
      await act(async () => {
        fireEvent.click(connectButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('wallet-connected')).toHaveTextContent('Connected');
      });
    });
  });

  describe('useWalletData Hook', () => {
    it('should manage data fetching state correctly', async () => {
      const fetchTokens = jest.fn().mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
        return [{ symbol: 'ETH', name: 'Ethereum', balance: '1.0', decimals: 18 }];
      });

      render(
        <WalletUIProvider wallet={wallet} fetchTokens={fetchTokens}>
          <WalletDataTestComponent />
        </WalletUIProvider>
      );

      const refreshButton = screen.getByTestId('refresh-tokens');
      
      act(() => {
        fireEvent.click(refreshButton);
      });

      expect(screen.getByTestId('data-loading')).toHaveTextContent('Loading');

      await waitFor(() => {
        expect(screen.getByTestId('data-loading')).toHaveTextContent('Not Loading');
        expect(screen.getByTestId('tokens-count')).toHaveTextContent('1');
      });
    });

    it('should handle data fetching errors', async () => {
      const fetchTokens = jest.fn().mockRejectedValue(new Error('Fetch failed'));

      render(
        <WalletUIProvider wallet={wallet} fetchTokens={fetchTokens}>
          <WalletDataTestComponent />
        </WalletUIProvider>
      );

      const refreshButton = screen.getByTestId('refresh-tokens');
      
      await act(async () => {
        fireEvent.click(refreshButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('data-error')).toHaveTextContent('Fetch failed');
      });
    });
  });

  describe('State Synchronization', () => {
    it('should sync wallet state changes with context', async () => {
      render(
        <WalletUIProvider wallet={wallet}>
          <TestComponent />
        </WalletUIProvider>
      );

      // Connect via context
      const connectButton = screen.getByTestId('connect-button');
      await act(async () => {
        fireEvent.click(connectButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('connection-status')).toHaveTextContent('Connected');
      });

      // Disconnect directly via wallet (simulating external change)
      await act(async () => {
        await wallet.disconnect();
      });

      await waitFor(() => {
        expect(screen.getByTestId('connection-status')).toHaveTextContent('Disconnected');
      });
    });
  });

  describe('Theme Integration', () => {
    it('should provide theme through context', () => {
      const mockTheme = {
        colors: {
          primary: '#007AFF',
          background: '#FFFFFF',
          text: '#000000'
        },
        borderRadius: '8px',
        fontFamily: 'Inter, sans-serif'
      };

      const ThemeTestComponent = () => {
        const { theme } = useWalletUI();
        
        return (
          <div data-testid="theme-primary">
            {theme?.colors?.primary || 'No Theme'}
          </div>
        );
      };

      render(
        <WalletUIProvider wallet={wallet} theme={mockTheme}>
          <ThemeTestComponent />
        </WalletUIProvider>
      );

      expect(screen.getByTestId('theme-primary')).toHaveTextContent('#007AFF');
    });
  });
});
