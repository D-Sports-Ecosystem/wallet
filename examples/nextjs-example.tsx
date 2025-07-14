// Example Next.js App with D-Sports Wallet Integration using WalletDashboard
import React from 'react';
import { createDSportsWallet } from '@d-sports/wallet/nextjs';
import { chains } from '@d-sports/wallet/chains';
import { WalletUIProvider, WalletDashboard } from '@d-sports/wallet/ui';
import { TokenBalance, NFTAsset, GameInventoryItem, WalletAccount, CreateWalletConfig, ImportWalletConfig } from '@d-sports/wallet/ui/types';

// Create wallet instance
const wallet = createDSportsWallet({
  projectId: 'your-walletconnect-project-id',
  chains: [chains.ethereum, chains.polygon],
  metadata: {
    name: 'D-Sports Example App',
    description: 'Example app showcasing D-Sports wallet integration',
    url: 'https://example.d-sports.com',
    icons: ['https://example.d-sports.com/icon.png']
  },
  socialLogin: {
    providers: ['google', 'facebook', 'apple'],
    clientIds: {
      google: 'your-google-client-id',
      facebook: 'your-facebook-app-id',
      apple: 'your-apple-client-id'
    }
  },
  theme: {
    colors: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
      background: '#FFFFFF',
      text: '#1F2937',
      border: '#E5E7EB'
    },
    borderRadius: 12,
    fontFamily: 'Inter, sans-serif'
  }
});

// Dummy data providers
const createDummyTokens = (): TokenBalance[] => [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    balance: '2.5678',
    decimals: 18,
    logoUri: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    value: '4567.89',
    price: '1780.25'
  },
  {
    symbol: 'MATIC',
    name: 'Polygon',
    balance: '1250.0',
    decimals: 18,
    contractAddress: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
    logoUri: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
    value: '987.50',
    price: '0.79'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    balance: '1000.00',
    decimals: 6,
    contractAddress: '0xa0b86a33e6cd8e6b89d8b0aafaab7d7e4d40b0a9',
    logoUri: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
    value: '1000.00',
    price: '1.00'
  }
];

const createDummyNFTs = (): NFTAsset[] => [
  {
    id: 'nft-1',
    name: 'CryptoPunk #1234',
    description: 'A rare CryptoPunk with unique attributes',
    image: 'https://via.placeholder.com/300x300/4338CA/FFFFFF?text=CryptoPunk',
    collection: 'CryptoPunks',
    contractAddress: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
    tokenId: '1234',
    attributes: [
      { trait_type: 'Type', value: 'Human' },
      { trait_type: 'Accessory', value: 'Sunglasses' },
      { trait_type: 'Hair', value: 'Messy' }
    ]
  },
  {
    id: 'nft-2',
    name: 'Bored Ape #5678',
    description: 'A member of the Bored Ape Yacht Club',
    image: 'https://via.placeholder.com/300x300/10B981/FFFFFF?text=BoredApe',
    collection: 'Bored Ape Yacht Club',
    contractAddress: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
    tokenId: '5678',
    attributes: [
      { trait_type: 'Fur', value: 'Brown' },
      { trait_type: 'Eyes', value: 'Laser Eyes' },
      { trait_type: 'Mouth', value: 'Grin' }
    ]
  },
  {
    id: 'nft-3',
    name: 'Art Blocks #9012',
    description: 'Generative art from Art Blocks',
    image: 'https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=ArtBlocks',
    collection: 'Art Blocks Curated',
    contractAddress: '0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270',
    tokenId: '9012',
    attributes: [
      { trait_type: 'Style', value: 'Abstract' },
      { trait_type: 'Color Palette', value: 'Warm' }
    ]
  }
];

const createDummyInventory = (): GameInventoryItem[] => [
  {
    id: 'weapon-1',
    name: 'Legendary Sword of Power',
    description: 'A legendary weapon imbued with ancient magic',
    image: 'https://via.placeholder.com/150x150/EF4444/FFFFFF?text=Sword',
    game: 'Fantasy RPG',
    category: 'Weapon',
    rarity: 'Legendary',
    level: 50,
    attributes: {
      attack: 125,
      durability: 98,
      enchantment: 'Fire Damage +25'
    },
    isEquipped: true,
    isTransferable: true
  },
  {
    id: 'armor-1',
    name: 'Dragon Scale Armor',
    description: 'Armor crafted from the scales of an ancient dragon',
    image: 'https://via.placeholder.com/150x150/F59E0B/FFFFFF?text=Armor',
    game: 'Fantasy RPG',
    category: 'Armor',
    rarity: 'Epic',
    level: 45,
    attributes: {
      defense: 89,
      durability: 95,
      resistance: 'Fire Resistance +30%'
    },
    isEquipped: false,
    isTransferable: true
  },
  {
    id: 'skin-1',
    name: 'Cosmic Warrior Skin',
    description: 'Exclusive skin from the Cosmic Warriors collection',
    image: 'https://via.placeholder.com/150x150/06B6D4/FFFFFF?text=Skin',
    game: 'Battle Arena',
    category: 'Cosmetic',
    rarity: 'Rare',
    level: 1,
    attributes: {
      style: 'Cosmic',
      glow: true,
      animated: true
    },
    isEquipped: true,
    isTransferable: false
  },
  {
    id: 'consumable-1',
    name: 'Health Potion (x5)',
    description: 'Restores 100 HP when consumed',
    image: 'https://via.placeholder.com/150x150/10B981/FFFFFF?text=Potion',
    game: 'Fantasy RPG',
    category: 'Consumable',
    rarity: 'Common',
    level: 1,
    attributes: {
      quantity: 5,
      healing: 100,
      cooldown: '30s'
    },
    isEquipped: false,
    isTransferable: true
  }
];

// Dummy data fetchers
const fetchTokens = async (): Promise<TokenBalance[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return createDummyTokens();
};

const fetchNFTs = async (): Promise<NFTAsset[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  return createDummyNFTs();
};

const fetchInventory = async (): Promise<GameInventoryItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return createDummyInventory();
};

// Wallet management functions
const createWallet = async (config: CreateWalletConfig): Promise<WalletAccount> => {
  console.log('Creating wallet with config:', config);
  // Simulate wallet creation
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock wallet account
  const mockAccount: WalletAccount = {
    address: '0x742d35Cc6634C0532925a3b8D497C4F4c4b4C4A1',
    chainId: 1,
    isConnected: true,
    connector: 'dsports-wallet'
  };
  
  // Connect to the wallet
  await wallet.connect('dsports-wallet', config);
  return mockAccount;
};

const importWallet = async (config: ImportWalletConfig): Promise<WalletAccount> => {
  console.log('Importing wallet with config:', config);
  // Simulate wallet import
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock wallet account
  const mockAccount: WalletAccount = {
    address: '0x892d35Cc6634C0532925a3b8D497C4F4c4b4C4B2',
    chainId: 1,
    isConnected: true,
    connector: 'dsports-wallet'
  };
  
  // Connect to the wallet
  await wallet.connect('dsports-wallet', config);
  return mockAccount;
};

const createUserWallet = async (args: any): Promise<void> => {
  console.log('Creating user wallet with args:', args);
  await createWallet(args);
};

// Chain switching implementation
const switchChain = async (chainId: number): Promise<void> => {
  console.log('Switching to chain:', chainId);
  // Simulate chain switching
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Update wallet state to reflect new chain
  const state = wallet.getState();
  if (state.account) {
    state.account.chainId = chainId;
  }
  
  // Emit chain changed event
  wallet.emit('chainChanged', { chainId });
};

// Theme configuration
const walletTheme = {
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

// App Component
export default function App() {
  return (
    <WalletUIProvider
      wallet={wallet}
      fetchTokens={fetchTokens}
      fetchNFTs={fetchNFTs}
      fetchInventory={fetchInventory}
      createWallet={createWallet}
      importWallet={importWallet}
      createUserWallet={createUserWallet}
      theme={walletTheme}
    >
      <WalletDashboard
        showCreateWallet={true}
        showImportWallet={true}
        defaultTab={'tokens'}
      />
    </WalletUIProvider>
  );
}

