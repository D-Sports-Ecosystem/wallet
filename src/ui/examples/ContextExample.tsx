import React from 'react';
import { 
  WalletUIProvider, 
  ContextDrivenDashboard, 
  ContextDrivenTokenTab,
  useWalletUIContext 
} from '../index';
import { DSportsWallet } from '../../core/wallet';
import { InventoryItem } from '../types';

// Example of how to use the new WalletUIContext interface
const ExampleApp: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  // Create a wallet instance (this would typically be done at the app level)
  const wallet = new DSportsWallet({
    projectId: 'example-project-id',
    chains: [],
    appName: 'Example D-Sports App',
    appDescription: 'Example app showcasing context-driven wallet UI',
    appUrl: 'https://example.com',
    appIcon: 'https://example.com/icon.png'
  }, {} as any); // Platform adapter would be provided

  // Example implementation of createUserWallet
  const createUserWallet = async (args: any): Promise<void> => {
    console.log('Creating user wallet with args:', args);
    // Implement wallet creation logic here
    // This could involve:
    // - Creating a new wallet instance
    // - Storing user credentials
    // - Setting up social login
    // - Registering with a backend service
    
    try {
      // Example: Create wallet via social login
      if (args.method === 'social') {
        await wallet.connect('dsports-wallet', { 
          socialLogin: true, 
          provider: args.provider 
        });
      }
      // Example: Create wallet via email
      else if (args.method === 'email') {
        // Implement email-based wallet creation
        console.log('Creating wallet for email:', args.email);
      }
      // Example: Create wallet via web3
      else if (args.method === 'web3') {
        await wallet.connect(args.connectorId || 'dsports-wallet');
      }
    } catch (error) {
      console.error('Failed to create user wallet:', error);
      throw error;
    }
  };

  // Example implementation of fetchInventory
  const fetchInventory = async (): Promise<InventoryItem[]> => {
    console.log('Fetching inventory items...');
    // This would typically fetch from your game's backend API
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock inventory data
      return [
        {
          id: 'item-1',
          name: 'Legendary Sword',
          description: 'A powerful sword with magical properties',
          image: 'https://example.com/sword.png',
          game: 'Fantasy Quest',
          category: 'Weapon',
          rarity: 'Legendary',
          level: 50,
          attributes: {
            attack: 150,
            durability: 100,
            enchantment: 'Fire Damage'
          },
          isEquipped: true,
          isTransferable: true
        },
        {
          id: 'item-2',
          name: 'Magic Shield',
          description: 'A shield that provides magical protection',
          image: 'https://example.com/shield.png',
          game: 'Fantasy Quest',
          category: 'Armor',
          rarity: 'Epic',
          level: 45,
          attributes: {
            defense: 120,
            magic_resistance: 80
          },
          isEquipped: false,
          isTransferable: true
        },
        {
          id: 'item-3',
          name: 'Racing Car Skin',
          description: 'Limited edition racing car skin',
          image: 'https://example.com/car-skin.png',
          game: 'Speed Racer',
          category: 'Cosmetic',
          rarity: 'Rare',
          attributes: {
            speed_boost: 5,
            style_points: 100
          },
          isEquipped: false,
          isTransferable: false
        }
      ];
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      throw error;
    }
  };

  // Example session data
  const session = {
    user: {
      id: 'user-123',
      email: 'user@example.com',
      name: 'John Doe',
      avatar: 'https://example.com/avatar.png'
    },
    isAuthenticated: true,
    wallet: undefined // Will be populated when wallet connects
  };

  // Example theme
  const theme = {
    colors: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
      background: '#FFFFFF',
      text: '#1F2937',
      border: '#E5E7EB'
    },
    borderRadius: 12,
    fontFamily: 'Inter, sans-serif'
  };

  return (
    <WalletUIProvider
      wallet={wallet}
      session={session}
      theme={theme}
      createUserWallet={createUserWallet}
      fetchInventory={fetchInventory}
      // You can also override other functions
      fetchTokens={async () => {
        // Mock token data
        return [
          {
            symbol: 'ETH',
            name: 'Ethereum',
            balance: '1.5',
            decimals: 18,
            value: '2400.00',
            price: '1600.00',
            logoUri: 'https://example.com/eth-logo.png'
          },
          {
            symbol: 'USDC',
            name: 'USD Coin',
            balance: '1000.0',
            decimals: 6,
            value: '1000.00',
            price: '1.00',
            logoUri: 'https://example.com/usdc-logo.png'
          }
        ];
      }}
      fetchNFTs={async () => {
        // Mock NFT data
        return [
          {
            id: 'nft-1',
            name: 'Cool Cat #1234',
            description: 'A very cool cat NFT',
            image: 'https://example.com/cat.png',
            collection: 'Cool Cats',
            contractAddress: '0x1234...',
            tokenId: '1234',
            attributes: [
              { trait_type: 'Background', value: 'Blue' },
              { trait_type: 'Hat', value: 'Beanie' }
            ]
          }
        ];
      }}
    >
      <div style={{ padding: '20px' }}>
        <h1>Context-Driven Wallet UI Example</h1>
        
        {/* Full dashboard with context */}
        <ContextDrivenDashboard />
        
        {/* Individual components using context */}
        <div style={{ marginTop: '40px' }}>
          <h2>Individual Context-Driven Components</h2>
          <ContextDrivenTokenTab 
            onTokenClick={(token) => console.log('Token clicked:', token)}
            onSend={(token) => console.log('Send token:', token)}
            onReceive={(token) => console.log('Receive token:', token)}
            onSwap={(token) => console.log('Swap token:', token)}
          />
        </div>
        
        {/* Render children if provided */}
        {children}
      </div>
    </WalletUIProvider>
  );
};

// Example component that uses the context directly
const WalletStatus: React.FC = () => {
  const { walletStore, session, createUserWallet, fetchInventory } = useWalletUIContext();

  const handleConnect = async () => {
    try {
      await walletStore.connect('dsports-wallet');
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const handleCreateWallet = async () => {
    if (createUserWallet) {
      try {
        await createUserWallet({ 
          method: 'social', 
          provider: 'google' 
        });
      } catch (error) {
        console.error('Failed to create wallet:', error);
      }
    }
  };

  const handleFetchInventory = async () => {
    if (fetchInventory) {
      try {
        const items = await fetchInventory();
        console.log('Inventory items:', items);
      } catch (error) {
        console.error('Failed to fetch inventory:', error);
      }
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      marginTop: '20px'
    }}>
      <h3>Wallet Status</h3>
      <p>Connected: {walletStore.isConnected ? 'Yes' : 'No'}</p>
      <p>Connecting: {walletStore.isConnecting ? 'Yes' : 'No'}</p>
      <p>Session ID: {session?.id || 'None'}</p>
      
      <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button onClick={handleConnect} disabled={walletStore.isConnected}>
          Connect Wallet
        </button>
        <button onClick={handleCreateWallet}>
          Create User Wallet
        </button>
        <button onClick={handleFetchInventory}>
          Fetch Inventory
        </button>
        <button 
          onClick={() => walletStore.disconnect()} 
          disabled={!walletStore.isConnected}
        >
          Disconnect
        </button>
      </div>
      
      {walletStore.account && (
        <div style={{ marginTop: '12px', fontSize: '14px' }}>
          <p>Address: {walletStore.account.address}</p>
          <p>Chain ID: {walletStore.account.chainId}</p>
        </div>
      )}
    </div>
  );
};

// Combined example that shows both approaches
const FullExample: React.FC = () => (
  <ExampleApp>
    <WalletStatus />
  </ExampleApp>
);

export default FullExample;
export { ExampleApp, WalletStatus };
