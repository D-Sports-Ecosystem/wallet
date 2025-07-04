import React, { useState, useEffect } from 'react';
import { DashboardProps, TokenBalance, NFTAsset, GameInventoryItem } from '../types';
import WalletOverviewCard from './WalletOverviewCard';
import TokenTab from './TokenTab';
import CollectiblesTab from './CollectiblesTab';
import InventoryTab from './InventoryTab';
import CreateWalletFlow from './CreateWalletFlow';
import ImportWalletFlow from './ImportWalletFlow';
import LoadingState from '../atoms/LoadingState';
import EmptyState from '../atoms/EmptyState';
import Modal from '../atoms/Modal';
import AnimatedContainer from '../atoms/AnimatedContainer';

/**
 * Dashboard - The main wallet dashboard component.
 * 
 * This component provides a comprehensive interface for managing wallet operations,
 * viewing assets (tokens, NFTs, inventory), and handling wallet creation/import flows.
 * It supports theming, data fetching, and various wallet operations.
 * 
 * @example
 * ```tsx
 * import { Dashboard } from '@d-sports/wallet';
 * 
 * function App() {
 *   return (
 *     <Dashboard
 *       session={userSession}
 *       onCreateWallet={handleCreateWallet}
 *       fetchTokens={fetchTokensFromAPI}
 *       fetchNFTs={fetchNFTsFromAPI}
 *       theme={customTheme}
 *     />
 *   );
 * }
 * ```
 * 
 * @param props - Configuration props for the dashboard
 * @returns A complete wallet dashboard interface
 */
const Dashboard: React.FC<DashboardProps> = ({
  session,
  onCreateWallet,
  onImportWallet,
  onConnectWallet,
  onDisconnect,
  onSwitchChain,
  fetchTokens,
  fetchNFTs,
  fetchInventory,
  supportedChains = [],
  showCreateWallet = true,
  showImportWallet = true,
  defaultTab = 'tokens',
  className = '',
  theme,
}) => {
  const [activeTab, setActiveTab] = useState<'tokens' | 'collectibles' | 'inventory'>(defaultTab);
  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [nfts, setNFTs] = useState<NFTAsset[]>([]);
  const [inventory, setInventory] = useState<GameInventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const containerStyles: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
    fontFamily: theme?.fontFamily,
    backgroundColor: theme?.colors?.background || '#FFF',
    minHeight: '100vh',
  };

  const headerStyles: React.CSSProperties = {
    marginBottom: '32px',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: '700',
    color: theme?.colors?.text || '#000',
    margin: '0 0 8px 0',
  };

  const subtitleStyles: React.CSSProperties = {
    fontSize: '18px',
    color: theme?.colors?.text ? `${theme.colors.text}70` : '#666',
    margin: '0',
  };

  const actionsContainerStyles: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    marginTop: '24px',
    flexWrap: 'wrap',
  };

  const buttonStyles: React.CSSProperties = {
    padding: '12px 24px',
    border: 'none',
    borderRadius: theme?.borderRadius || '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const primaryButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    backgroundColor: theme?.colors?.primary || '#007AFF',
    color: '#FFF',
  };

  const secondaryButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    backgroundColor: 'transparent',
    color: theme?.colors?.text || '#666',
    border: theme?.colors?.border ? `1px solid ${theme.colors.border}` : '1px solid #E5E5E7',
  };

  const dangerButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    backgroundColor: '#FF3B30',
    color: '#FFF',
  };

  const tabContainerStyles: React.CSSProperties = {
    marginTop: '32px',
  };

  const tabHeaderStyles: React.CSSProperties = {
    display: 'flex',
    borderBottom: theme?.colors?.border ? `1px solid ${theme.colors.border}` : '1px solid #E5E5E7',
    marginBottom: '24px',
  };

  const tabButtonStyles: React.CSSProperties = {
    padding: '12px 24px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    color: theme?.colors?.text ? `${theme.colors.text}60` : '#666',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s ease',
  };

  const activeTabButtonStyles: React.CSSProperties = {
    ...tabButtonStyles,
    color: theme?.colors?.primary || '#007AFF',
    borderBottomColor: theme?.colors?.primary || '#007AFF',
    fontWeight: '600',
  };

  const contentContainerStyles: React.CSSProperties = {
    minHeight: '400px',
  };

  // Calculate totals for overview card
  const totalBalance = tokens.reduce((sum, token) => {
    return sum + parseFloat(token.balance || '0');
  }, 0).toFixed(4);

  const totalBalanceUSD = tokens.reduce((sum, token) => {
    return sum + parseFloat(token.value || '0');
  }, 0).toFixed(2);

  const tokenCount = tokens.length;
  const nftCount = nfts.length;

  // Data fetching functions
  const loadTokens = async () => {
    if (!fetchTokens) return;
    try {
      setIsLoading(true);
      const fetchedTokens = await fetchTokens();
      setTokens(fetchedTokens);
    } catch (err) {
      setError('Failed to load tokens');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadNFTs = async () => {
    if (!fetchNFTs) return;
    try {
      setIsLoading(true);
      const fetchedNFTs = await fetchNFTs();
      setNFTs(fetchedNFTs);
    } catch (err) {
      setError('Failed to load NFTs');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadInventory = async () => {
    if (!fetchInventory) return;
    try {
      setIsLoading(true);
      const fetchedInventory = await fetchInventory();
      setInventory(fetchedInventory);
    } catch (err) {
      setError('Failed to load inventory');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllData = async () => {
    if (!session?.wallet) return;
    
    setIsLoading(true);
    try {
      const promises = [];
      if (fetchTokens) promises.push(fetchTokens());
      if (fetchNFTs) promises.push(fetchNFTs());
      if (fetchInventory) promises.push(fetchInventory());

      const results = await Promise.allSettled(promises);
      
      let index = 0;
      if (fetchTokens) {
        const tokensResult = results[index++];
        if (tokensResult.status === 'fulfilled') {
          setTokens(tokensResult.value as TokenBalance[]);
        }
      }
      if (fetchNFTs) {
        const nftsResult = results[index++];
        if (nftsResult.status === 'fulfilled') {
          setNFTs(nftsResult.value as NFTAsset[]);
        }
      }
      if (fetchInventory) {
        const inventoryResult = results[index++];
        if (inventoryResult.status === 'fulfilled') {
          setInventory(inventoryResult.value as GameInventoryItem[]);
        }
      }
    } catch (err) {
      setError('Failed to load wallet data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data when wallet connects
  useEffect(() => {
    if (session?.wallet) {
      loadAllData();
    }
  }, [session?.wallet]);

  // Tab handlers
  const handleTabChange = (tab: 'tokens' | 'collectibles' | 'inventory') => {
    setActiveTab(tab);
    // Load data for the active tab if not already loaded
    if (tab === 'tokens' && tokens.length === 0) {
      loadTokens();
    } else if (tab === 'collectibles' && nfts.length === 0) {
      loadNFTs();
    } else if (tab === 'inventory' && inventory.length === 0) {
      loadInventory();
    }
  };

  // Wallet action handlers
  const handleCreateWallet = async (config: any) => {
    try {
      if (onCreateWallet) {
        await onCreateWallet(config);
      }
      setShowCreateModal(false);
    } catch (err) {
      console.error('Failed to create wallet:', err);
      throw err;
    }
  };

  const handleImportWallet = async (config: any) => {
    try {
      if (onImportWallet) {
        await onImportWallet(config);
      }
      setShowImportModal(false);
    } catch (err) {
      console.error('Failed to import wallet:', err);
      throw err;
    }
  };

  const handleDisconnect = async () => {
    try {
      if (onDisconnect) {
        await onDisconnect();
      }
      // Clear data
      setTokens([]);
      setNFTs([]);
      setInventory([]);
    } catch (err) {
      console.error('Failed to disconnect:', err);
    }
  };

  // Render different states
  const renderNoWallet = () => (
    <AnimatedContainer variant="fade">
      <EmptyState
        title="Welcome to Your Wallet"
        description="Get started by creating a new wallet or importing an existing one."
        variant="wallet"
        theme={theme}
        icon={<span style={{ fontSize: '64px' }}>👛</span>}
      />
      <div style={actionsContainerStyles}>
        {showCreateWallet && (
          <button
            style={primaryButtonStyles}
            onClick={() => setShowCreateModal(true)}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            Create New Wallet
          </button>
        )}
        {showImportWallet && (
          <button
            style={secondaryButtonStyles}
            onClick={() => setShowImportModal(true)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme?.colors?.border ? `${theme.colors.border}20` : '#F0F0F0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Import Existing Wallet
          </button>
        )}
      </div>
    </AnimatedContainer>
  );

  const renderWalletContent = () => (
    <AnimatedContainer variant="fade">
      <WalletOverviewCard
        session={session}
        totalBalance={totalBalance}
        totalBalanceUSD={totalBalanceUSD}
        tokenCount={tokenCount}
        nftCount={nftCount}
        onViewTokens={() => handleTabChange('tokens')}
        onViewNFTs={() => handleTabChange('collectibles')}
        onViewInventory={() => handleTabChange('inventory')}
        isLoading={isLoading}
        theme={theme}
      />

      <div style={actionsContainerStyles}>
        <button
          style={secondaryButtonStyles}
          onClick={loadAllData}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme?.colors?.border ? `${theme.colors.border}20` : '#F0F0F0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Refresh Data
        </button>
        <button
          style={dangerButtonStyles}
          onClick={handleDisconnect}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          Disconnect
        </button>
      </div>

      <div style={tabContainerStyles}>
        <div style={tabHeaderStyles}>
          {(['tokens', 'collectibles', 'inventory'] as const).map((tab) => (
            <button
              key={tab}
              style={activeTab === tab ? activeTabButtonStyles : tabButtonStyles}
              onClick={() => handleTabChange(tab)}
              onMouseEnter={(e) => {
                if (activeTab !== tab) {
                  e.currentTarget.style.color = theme?.colors?.primary || '#007AFF';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab) {
                  e.currentTarget.style.color = theme?.colors?.text ? `${theme.colors.text}60` : '#666';
                }
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div style={contentContainerStyles}>
          {activeTab === 'tokens' && (
            <TokenTab
              tokens={tokens}
              isLoading={isLoading}
              onRefresh={loadTokens}
              theme={theme}
            />
          )}
          {activeTab === 'collectibles' && (
            <CollectiblesTab
              nfts={nfts}
              isLoading={isLoading}
              onRefresh={loadNFTs}
              theme={theme}
            />
          )}
          {activeTab === 'inventory' && (
            <InventoryTab
              items={inventory}
              isLoading={isLoading}
              onRefresh={loadInventory}
              fetchInventory={fetchInventory}
              theme={theme}
            />
          )}
        </div>
      </div>
    </AnimatedContainer>
  );

  return (
    <div className={`wallet-dashboard ${className}`} style={containerStyles}>
      <div style={headerStyles}>
        <h1 style={titleStyles}>D-Sports Wallet</h1>
        <p style={subtitleStyles}>
          {session?.wallet ? 'Manage your digital assets' : 'Your gateway to Web3 gaming'}
        </p>
      </div>

      {session?.wallet ? renderWalletContent() : renderNoWallet()}

      {/* Create Wallet Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Wallet"
        size="medium"
        theme={theme}
      >
        <CreateWalletFlow
          onCreateWallet={handleCreateWallet}
          onCancel={() => setShowCreateModal(false)}
          onComplete={() => setShowCreateModal(false)}
          theme={theme}
        />
      </Modal>

      {/* Import Wallet Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Import Wallet"
        size="medium"
        theme={theme}
      >
        <ImportWalletFlow
          onImportWallet={handleImportWallet}
          onCancel={() => setShowImportModal(false)}
          onComplete={() => setShowImportModal(false)}
          theme={theme}
        />
      </Modal>

      {/* Error Display */}
      {error && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#FF3B30',
            color: '#FFF',
            padding: '16px',
            borderRadius: theme?.borderRadius || '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
          }}
        >
          {error}
          <button
            onClick={() => setError(null)}
            style={{
              marginLeft: '12px',
              background: 'none',
              border: 'none',
              color: '#FFF',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
