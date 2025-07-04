import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Dashboard from '../../components/Dashboard';
import { DashboardProps, UserSession, TokenBalance, NFTAsset, GameInventoryItem } from '../../types';

// Mock the atomic components
jest.mock('../../atoms/LoadingState', () => {
  return function LoadingState({ text }: any) {
    return <div data-testid="loading-state">{text || 'Loading...'}</div>;
  };
});

jest.mock('../../atoms/EmptyState', () => {
  return function EmptyState({ title, description }: any) {
    return (
      <div data-testid="empty-state">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    );
  };
});

jest.mock('../../atoms/Modal', () => {
  return function Modal({ isOpen, children, title, onClose }: any) {
    if (!isOpen) return null;
    return (
      <div data-testid="modal">
        <div data-testid="modal-title">{title}</div>
        <button data-testid="modal-close" onClick={onClose}>Close</button>
        {children}
      </div>
    );
  };
});

jest.mock('../../atoms/AnimatedContainer', () => {
  return function AnimatedContainer({ children }: any) {
    return <div data-testid="animated-container">{children}</div>;
  };
});

// Mock the component imports
jest.mock('../../components/WalletOverviewCard', () => {
  return function WalletOverviewCard({ 
    session, 
    totalBalance, 
    totalBalanceUSD, 
    tokenCount, 
    nftCount,
    onViewTokens,
    onViewNFTs,
    onViewInventory 
  }: any) {
    return (
      <div data-testid="wallet-overview-card">
        <div data-testid="total-balance">{totalBalance}</div>
        <div data-testid="total-balance-usd">{totalBalanceUSD}</div>
        <div data-testid="token-count">{tokenCount}</div>
        <div data-testid="nft-count">{nftCount}</div>
        <button data-testid="view-tokens" onClick={onViewTokens}>View Tokens</button>
        <button data-testid="view-nfts" onClick={onViewNFTs}>View NFTs</button>
        <button data-testid="view-inventory" onClick={onViewInventory}>View Inventory</button>
      </div>
    );
  };
});

jest.mock('../../components/TokenTab', () => {
  return function TokenTab({ tokens, isLoading, onRefresh }: any) {
    return (
      <div data-testid="token-tab">
        <div data-testid="token-count">{tokens.length}</div>
        {isLoading && <div data-testid="tokens-loading">Loading tokens...</div>}
        <button data-testid="refresh-tokens" onClick={onRefresh}>Refresh</button>
        {tokens.map((token: any, index: number) => (
          <div key={index} data-testid={`token-${token.symbol}`}>
            {token.symbol}: {token.balance}
          </div>
        ))}
      </div>
    );
  };
});

jest.mock('../../components/CollectiblesTab', () => {
  return function CollectiblesTab({ nfts, isLoading, onRefresh }: any) {
    return (
      <div data-testid="collectibles-tab">
        <div data-testid="nft-count">{nfts.length}</div>
        {isLoading && <div data-testid="nfts-loading">Loading NFTs...</div>}
        <button data-testid="refresh-nfts" onClick={onRefresh}>Refresh</button>
        {nfts.map((nft: any, index: number) => (
          <div key={index} data-testid={`nft-${nft.id}`}>
            {nft.name}
          </div>
        ))}
      </div>
    );
  };
});

jest.mock('../../components/InventoryTab', () => {
  return function InventoryTab({ items, isLoading, onRefresh }: any) {
    return (
      <div data-testid="inventory-tab">
        <div data-testid="inventory-count">{items.length}</div>
        {isLoading && <div data-testid="inventory-loading">Loading inventory...</div>}
        <button data-testid="refresh-inventory" onClick={onRefresh}>Refresh</button>
        {items.map((item: any, index: number) => (
          <div key={index} data-testid={`inventory-${item.id}`}>
            {item.name}
          </div>
        ))}
      </div>
    );
  };
});

jest.mock('../../components/CreateWalletFlow', () => {
  return function CreateWalletFlow({ onCreateWallet, onCancel, onComplete }: any) {
    return (
      <div data-testid="create-wallet-flow">
        <button 
          data-testid="create-wallet-submit"
          onClick={() => onCreateWallet({ method: 'web3' })}
        >
          Create Wallet
        </button>
        <button data-testid="create-wallet-cancel" onClick={onCancel}>Cancel</button>
        <button data-testid="create-wallet-complete" onClick={onComplete}>Complete</button>
      </div>
    );
  };
});

jest.mock('../../components/ImportWalletFlow', () => {
  return function ImportWalletFlow({ onImportWallet, onCancel, onComplete }: any) {
    return (
      <div data-testid="import-wallet-flow">
        <button 
          data-testid="import-wallet-submit"
          onClick={() => onImportWallet({ method: 'seed', seedPhrase: 'test seed' })}
        >
          Import Wallet
        </button>
        <button data-testid="import-wallet-cancel" onClick={onCancel}>Cancel</button>
        <button data-testid="import-wallet-complete" onClick={onComplete}>Complete</button>
      </div>
    );
  };
});

describe('Dashboard Component', () => {
  const mockTokens: TokenBalance[] = [
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: '1.5',
      decimals: 18,
      value: '3000.00'
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      balance: '100',
      decimals: 6,
      value: '100.00'
    }
  ];

  const mockNFTs: NFTAsset[] = [
    {
      id: '1',
      name: 'Test NFT 1',
      image: 'test1.jpg',
      collection: 'Test Collection',
      contractAddress: '0xtest1',
      tokenId: '1'
    },
    {
      id: '2',
      name: 'Test NFT 2',
      image: 'test2.jpg',
      collection: 'Test Collection',
      contractAddress: '0xtest2',
      tokenId: '2'
    }
  ];

  const mockInventory: GameInventoryItem[] = [
    {
      id: '1',
      name: 'Magic Sword',
      image: 'sword.jpg',
      game: 'RPG Game',
      category: 'weapon',
      rarity: 'legendary'
    },
    {
      id: '2',
      name: 'Shield of Protection',
      image: 'shield.jpg',
      game: 'RPG Game',
      category: 'armor',
      rarity: 'epic'
    }
  ];

  const mockSessionWithWallet: UserSession = {
    user: {
      id: 'test-user-123',
      email: 'test@example.com',
      name: 'Test User'
    },
    wallet: {
      address: '0x1234567890123456789012345678901234567890',
      chainId: 1,
      isConnected: true,
      connector: 'mock-connector'
    },
    isAuthenticated: true
  };

  const mockSessionWithoutWallet: UserSession = {
    user: {
      id: 'test-user-123',
      email: 'test@example.com',
      name: 'Test User'
    },
    isAuthenticated: true
  };

  const defaultProps: Partial<DashboardProps> = {
    fetchTokens: jest.fn().mockResolvedValue(mockTokens),
    fetchNFTs: jest.fn().mockResolvedValue(mockNFTs),
    fetchInventory: jest.fn().mockResolvedValue(mockInventory),
    onCreateWallet: jest.fn(),
    onImportWallet: jest.fn(),
    onDisconnect: jest.fn(),
    supportedChains: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Wallet Not Connected State', () => {
    it('should render welcome state when no wallet is connected', () => {
      render(<Dashboard {...defaultProps} session={mockSessionWithoutWallet} />);

      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      expect(screen.getByText('Welcome to Your Wallet')).toBeInTheDocument();
      expect(screen.getByText('Get started by creating a new wallet or importing an existing one.')).toBeInTheDocument();
    });

    it('should show create and import wallet buttons when enabled', () => {
      render(
        <Dashboard 
          {...defaultProps} 
          session={mockSessionWithoutWallet}
          showCreateWallet={true}
          showImportWallet={true}
        />
      );

      expect(screen.getByText('Create New Wallet')).toBeInTheDocument();
      expect(screen.getByText('Import Existing Wallet')).toBeInTheDocument();
    });

    it('should hide create wallet button when disabled', () => {
      render(
        <Dashboard 
          {...defaultProps} 
          session={mockSessionWithoutWallet}
          showCreateWallet={false}
          showImportWallet={true}
        />
      );

      expect(screen.queryByText('Create New Wallet')).not.toBeInTheDocument();
      expect(screen.getByText('Import Existing Wallet')).toBeInTheDocument();
    });

    it('should hide import wallet button when disabled', () => {
      render(
        <Dashboard 
          {...defaultProps} 
          session={mockSessionWithoutWallet}
          showCreateWallet={true}
          showImportWallet={false}
        />
      );

      expect(screen.getByText('Create New Wallet')).toBeInTheDocument();
      expect(screen.queryByText('Import Existing Wallet')).not.toBeInTheDocument();
    });
  });

  describe('Wallet Connected State', () => {
    it('should render wallet overview when wallet is connected', () => {
      render(<Dashboard {...defaultProps} session={mockSessionWithWallet} />);

      expect(screen.getByTestId('wallet-overview-card')).toBeInTheDocument();
      expect(screen.getByText('Refresh Data')).toBeInTheDocument();
      expect(screen.getByText('Disconnect')).toBeInTheDocument();
    });

    it('should display correct tab navigation', () => {
      render(<Dashboard {...defaultProps} session={mockSessionWithWallet} />);

      expect(screen.getByText('Tokens')).toBeInTheDocument();
      expect(screen.getByText('Collectibles')).toBeInTheDocument();
      expect(screen.getByText('Inventory')).toBeInTheDocument();
    });

    it('should default to tokens tab', () => {
      render(<Dashboard {...defaultProps} session={mockSessionWithWallet} />);

      expect(screen.getByTestId('token-tab')).toBeInTheDocument();
      expect(screen.queryByTestId('collectibles-tab')).not.toBeInTheDocument();
      expect(screen.queryByTestId('inventory-tab')).not.toBeInTheDocument();
    });

    it('should switch to collectibles tab when clicked', () => {
      render(<Dashboard {...defaultProps} session={mockSessionWithWallet} />);

      const collectiblesButton = screen.getByText('Collectibles');
      fireEvent.click(collectiblesButton);

      expect(screen.queryByTestId('token-tab')).not.toBeInTheDocument();
      expect(screen.getByTestId('collectibles-tab')).toBeInTheDocument();
      expect(screen.queryByTestId('inventory-tab')).not.toBeInTheDocument();
    });

    it('should switch to inventory tab when clicked', () => {
      render(<Dashboard {...defaultProps} session={mockSessionWithWallet} />);

      const inventoryButton = screen.getByText('Inventory');
      fireEvent.click(inventoryButton);

      expect(screen.queryByTestId('token-tab')).not.toBeInTheDocument();
      expect(screen.queryByTestId('collectibles-tab')).not.toBeInTheDocument();
      expect(screen.getByTestId('inventory-tab')).toBeInTheDocument();
    });

    it('should use custom default tab', () => {
      render(
        <Dashboard 
          {...defaultProps} 
          session={mockSessionWithWallet}
          defaultTab="collectibles"
        />
      );

      expect(screen.queryByTestId('token-tab')).not.toBeInTheDocument();
      expect(screen.getByTestId('collectibles-tab')).toBeInTheDocument();
      expect(screen.queryByTestId('inventory-tab')).not.toBeInTheDocument();
    });
  });

  describe('Data Loading and Display', () => {
    it('should load and display data when wallet is connected', async () => {
      const fetchTokens = jest.fn().mockResolvedValue(mockTokens);
      const fetchNFTs = jest.fn().mockResolvedValue(mockNFTs);
      const fetchInventory = jest.fn().mockResolvedValue(mockInventory);

      render(
        <Dashboard 
          {...defaultProps}
          session={mockSessionWithWallet}
          fetchTokens={fetchTokens}
          fetchNFTs={fetchNFTs}
          fetchInventory={fetchInventory}
        />
      );

      // Wait for data to load
      await waitFor(() => {
        expect(fetchTokens).toHaveBeenCalled();
        expect(fetchNFTs).toHaveBeenCalled();
        expect(fetchInventory).toHaveBeenCalled();
      });
    });

    it('should refresh data when refresh button is clicked', async () => {
      const fetchTokens = jest.fn().mockResolvedValue(mockTokens);

      render(
        <Dashboard 
          {...defaultProps}
          session={mockSessionWithWallet}
          fetchTokens={fetchTokens}
        />
      );

      // Wait for initial load
      await waitFor(() => {
        expect(fetchTokens).toHaveBeenCalledTimes(1);
      });

      // Click refresh
      const refreshButton = screen.getByText('Refresh Data');
      await act(async () => {
        fireEvent.click(refreshButton);
      });

      await waitFor(() => {
        expect(fetchTokens).toHaveBeenCalledTimes(2);
      });
    });

    it('should handle data loading errors gracefully', async () => {
      const fetchTokens = jest.fn().mockRejectedValue(new Error('Failed to fetch'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <Dashboard 
          {...defaultProps}
          session={mockSessionWithWallet}
          fetchTokens={fetchTokens}
        />
      );

      await waitFor(() => {
        expect(fetchTokens).toHaveBeenCalled();
      });

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText('Failed to load tokens')).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Modal Interactions', () => {
    it('should open create wallet modal when button is clicked', () => {
      render(<Dashboard {...defaultProps} session={mockSessionWithoutWallet} />);

      const createButton = screen.getByText('Create New Wallet');
      fireEvent.click(createButton);

      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByTestId('modal-title')).toHaveTextContent('Create New Wallet');
      expect(screen.getByTestId('create-wallet-flow')).toBeInTheDocument();
    });

    it('should open import wallet modal when button is clicked', () => {
      render(<Dashboard {...defaultProps} session={mockSessionWithoutWallet} />);

      const importButton = screen.getByText('Import Existing Wallet');
      fireEvent.click(importButton);

      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByTestId('modal-title')).toHaveTextContent('Import Wallet');
      expect(screen.getByTestId('import-wallet-flow')).toBeInTheDocument();
    });

    it('should close modal when close button is clicked', () => {
      render(<Dashboard {...defaultProps} session={mockSessionWithoutWallet} />);

      // Open modal
      const createButton = screen.getByText('Create New Wallet');
      fireEvent.click(createButton);

      expect(screen.getByTestId('modal')).toBeInTheDocument();

      // Close modal
      const closeButton = screen.getByTestId('modal-close');
      fireEvent.click(closeButton);

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('should handle wallet creation through modal', async () => {
      const onCreateWallet = jest.fn().mockResolvedValue(undefined);

      render(
        <Dashboard 
          {...defaultProps} 
          session={mockSessionWithoutWallet}
          onCreateWallet={onCreateWallet}
        />
      );

      // Open modal
      const createButton = screen.getByText('Create New Wallet');
      fireEvent.click(createButton);

      // Submit creation
      const submitButton = screen.getByTestId('create-wallet-submit');
      await act(async () => {
        fireEvent.click(submitButton);
      });

      expect(onCreateWallet).toHaveBeenCalledWith({ method: 'web3' });
    });

    it('should handle wallet import through modal', async () => {
      const onImportWallet = jest.fn().mockResolvedValue(undefined);

      render(
        <Dashboard 
          {...defaultProps} 
          session={mockSessionWithoutWallet}
          onImportWallet={onImportWallet}
        />
      );

      // Open modal
      const importButton = screen.getByText('Import Existing Wallet');
      fireEvent.click(importButton);

      // Submit import
      const submitButton = screen.getByTestId('import-wallet-submit');
      await act(async () => {
        fireEvent.click(submitButton);
      });

      expect(onImportWallet).toHaveBeenCalledWith({ 
        method: 'seed', 
        seedPhrase: 'test seed' 
      });
    });
  });

  describe('Wallet Actions', () => {
    it('should handle disconnect when disconnect button is clicked', async () => {
      const onDisconnect = jest.fn().mockResolvedValue(undefined);

      render(
        <Dashboard 
          {...defaultProps}
          session={mockSessionWithWallet}
          onDisconnect={onDisconnect}
        />
      );

      const disconnectButton = screen.getByText('Disconnect');
      await act(async () => {
        fireEvent.click(disconnectButton);
      });

      expect(onDisconnect).toHaveBeenCalled();
    });
  });

  describe('Theme Integration', () => {
    it('should apply theme styles when provided', () => {
      const theme = {
        colors: {
          primary: '#007AFF',
          background: '#FFFFFF',
          text: '#000000'
        },
        borderRadius: '8px',
        fontFamily: 'Inter, sans-serif'
      };

      render(
        <Dashboard 
          {...defaultProps}
          session={mockSessionWithWallet}
          theme={theme}
        />
      );

      const container = screen.getByText('D-Sports Wallet').closest('.wallet-dashboard');
      expect(container).toHaveStyle(`font-family: ${theme.fontFamily}`);
    });
  });

  describe('Overview Card Integration', () => {
    it('should switch tabs when overview card buttons are clicked', async () => {
      render(<Dashboard {...defaultProps} session={mockSessionWithWallet} />);

      // Should start on tokens tab
      expect(screen.getByTestId('token-tab')).toBeInTheDocument();

      // Click view NFTs from overview card
      const viewNFTsButton = screen.getByTestId('view-nfts');
      fireEvent.click(viewNFTsButton);

      expect(screen.queryByTestId('token-tab')).not.toBeInTheDocument();
      expect(screen.getByTestId('collectibles-tab')).toBeInTheDocument();

      // Click view inventory from overview card
      const viewInventoryButton = screen.getByTestId('view-inventory');
      fireEvent.click(viewInventoryButton);

      expect(screen.queryByTestId('collectibles-tab')).not.toBeInTheDocument();
      expect(screen.getByTestId('inventory-tab')).toBeInTheDocument();
    });
  });

  describe('Error Display', () => {
    it('should show error notification when data fetching fails', async () => {
      const fetchTokens = jest.fn().mockRejectedValue(new Error('Network error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <Dashboard 
          {...defaultProps}
          session={mockSessionWithWallet}
          fetchTokens={fetchTokens}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Failed to load tokens')).toBeInTheDocument();
      });

      // Should be able to dismiss error
      const dismissButton = screen.getByText('×');
      fireEvent.click(dismissButton);

      expect(screen.queryByText('Failed to load tokens')).not.toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });
});
