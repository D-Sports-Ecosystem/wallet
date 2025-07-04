import React, { useState, useEffect } from 'react';
import { TokenBalance, NFTAsset, GameInventoryItem } from '../types';
import { useWalletUI, useWalletUIContext } from '../context/WalletUIProvider';
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

interface ContextDrivenDashboardProps {
  className?: string;
  defaultTab?: 'tokens' | 'collectibles' | 'inventory';
  showCreateWallet?: boolean;
  showImportWallet?: boolean;
}

const ContextDrivenDashboard: React.FC<ContextDrivenDashboardProps> = ({
  className = '',
  defaultTab = 'tokens',
  showCreateWallet = true,
  showImportWallet = true,
}) => {
  // Use the context instead of props
  const context = useWalletUI();
  const { walletStore, session, createUserWallet, fetchInventory } = useWalletUIContext();
  
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
    fontFamily: context.theme?.fontFamily,
    backgroundColor: context.theme?.colors?.background || '#FFF',
    minHeight: '100vh',
  };

  const headerStyles: React.CSSProperties = {
    marginBottom: '32px',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: '700',
    color: context.theme?.colors?.text || '#000',
    margin: '0 0 8px 0',
  };

  const subtitleStyles: React.CSSProperties = {
    fontSize: '18px',
    color: context.theme?.colors?.text ? `${context.theme.colors.text}70` : '#666',
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
    borderRadius: context.theme?.borderRadius || '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const primaryButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    backgroundColor: context.theme?.colors?.primary || '#007AFF',
    color: '#FFF',
  };

  const secondaryButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    backgroundColor: 'transparent',
    color: context.theme?.colors?.text || '#666',
    border: context.theme?.colors?.border ? `1px solid ${context.theme.colors.border}` : '1px solid #E5E5E7',
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
    borderBottom: context.theme?.colors?.border ? `1px solid ${context.theme.colors.border}` : '1px solid #E5E5E7',
    marginBottom: '24px',
  };

  const tabButtonStyles: React.CSSProperties = {
    padding: '12px 24px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    color: context.theme?.colors?.text ? `${context.theme.colors.text}60` : '#666',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s ease',
  };

  const activeTabButtonStyles: React.CSSProperties = {
    ...tabButtonStyles,
    color: context.theme?.colors?.primary || '#007AFF',
    borderBottomColor: context.theme?.colors?.primary || '#007AFF',
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

  // Data fetching functions using context
  const loadTokens = async () => {
    try {
      setIsLoading(true);
      const fetchedTokens = await context.fetchTokens();
      setTokens(fetchedTokens);
    } catch (err) {
      setError('Failed to load tokens');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadNFTs = async () => {
    try {
      setIsLoading(true);
      const fetchedNFTs = await context.fetchNFTs();
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
    if (!walletStore.isConnected) return;
    
    setIsLoading(true);
    try {
      const promises = [];
      promises.push(context.fetchTokens());
      promises.push(context.fetchNFTs());
      if (fetchInventory) promises.push(fetchInventory());

      const results = await Promise.allSettled(promises);
      
      // Handle tokens
      if (results[0].status === 'fulfilled') {
        setTokens(results[0].value as TokenBalance[]);
      }
      
      // Handle NFTs
      if (results[1].status === 'fulfilled') {
        setNFTs(results[1].value as NFTAsset[]);
      }
      
      // Handle inventory if available
      if (results[2] && results[2].status === 'fulfilled') {
        setInventory(results[2].value as GameInventoryItem[]);
      }
      
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: 'tokens' | 'collectibles' | 'inventory') => {
    setActiveTab(tab);
    setError(null);

    // Load data for the selected tab if not already loaded
    switch (tab) {
      case 'tokens':
        if (tokens.length === 0) loadTokens();
        break;
      case 'collectibles':
        if (nfts.length === 0) loadNFTs();
        break;
      case 'inventory':
        if (inventory.length === 0) loadInventory();
        break;
    }
  };

  // Load initial data when wallet connects
  useEffect(() => {
    if (walletStore.isConnected) {
      loadAllData();
    }
  }, [walletStore.isConnected]);

  const handleCreateWallet = async (config: any) => {
    try {
      if (createUserWallet) {
        await createUserWallet(config);
      } else {
        await context.createWallet(config);
      }
      setShowCreateModal(false);
    } catch (err) {
      console.error('Failed to create wallet:', err);
      throw err;
    }
  };

  const handleImportWallet = async (config: any) => {
    try {
      await context.importWallet(config);
      setShowImportModal(false);
    } catch (err) {
      console.error('Failed to import wallet:', err);
      throw err;
    }
  };

  const handleDisconnect = async () => {
    try {
      await walletStore.disconnect();
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
        theme={context.theme}
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
              e.currentTarget.style.backgroundColor = context.theme?.colors?.border ? `${context.theme.colors.border}20` : '#F0F0F0';
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
        session={context.session}
        totalBalance={totalBalance}
        totalBalanceUSD={totalBalanceUSD}
        tokenCount={tokenCount}
        nftCount={nftCount}
        onViewTokens={() => handleTabChange('tokens')}
        onViewNFTs={() => handleTabChange('collectibles')}
        onViewInventory={() => handleTabChange('inventory')}
        isLoading={isLoading}
        theme={context.theme}
      />

      <div style={actionsContainerStyles}>
        <button
          style={secondaryButtonStyles}
          onClick={loadAllData}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = context.theme?.colors?.border ? `${context.theme.colors.border}20` : '#F0F0F0';
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
                  e.currentTarget.style.color = context.theme?.colors?.primary || '#007AFF';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab) {
                  e.currentTarget.style.color = context.theme?.colors?.text ? `${context.theme.colors.text}60` : '#666';
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
              theme={context.theme}
            />
          )}
          {activeTab === 'collectibles' && (
            <CollectiblesTab
              nfts={nfts}
              isLoading={isLoading}
              onRefresh={loadNFTs}
              theme={context.theme}
            />
          )}
          {activeTab === 'inventory' && (
            <InventoryTab
              items={inventory}
              isLoading={isLoading}
              onRefresh={loadInventory}
              fetchInventory={fetchInventory}
              theme={context.theme}
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
          {walletStore.isConnected ? 'Manage your digital assets' : 'Your gateway to Web3 gaming'}
        </p>
      </div>

      {walletStore.isConnected ? renderWalletContent() : renderNoWallet()}

      {/* Create Wallet Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Wallet"
        size="medium"
        theme={context.theme}
      >
        <CreateWalletFlow
          onCreateWallet={handleCreateWallet}
          onCancel={() => setShowCreateModal(false)}
          onComplete={() => setShowCreateModal(false)}
          theme={context.theme}
        />
      </Modal>

      {/* Import Wallet Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Import Wallet"
        size="medium"
        theme={context.theme}
      >
        <ImportWalletFlow
          onImportWallet={handleImportWallet}
          onCancel={() => setShowImportModal(false)}
          onComplete={() => setShowImportModal(false)}
          theme={context.theme}
        />
      </Modal>

      {/* Error Display */}
      {error && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#FF3B30',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '8px',
          zIndex: 1000,
        }}>
          {error}
          <button
            onClick={() => setError(null)}
            style={{
              marginLeft: '8px',
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default ContextDrivenDashboard;
