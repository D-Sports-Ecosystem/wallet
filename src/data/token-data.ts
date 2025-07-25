import { getTokenData, isTokenDataStale } from '../utils/token-fetcher';

// Function to get live token data or fallback to static data
function getLiveTokenData() {
  try {
    const liveData = getTokenData();
    if (liveData.length > 0 && !isTokenDataStale(10)) {
      return liveData;
    }
  } catch (error) {
    console.warn('Failed to get live token data, using static fallback:', error);
  }
  
  // Fallback to static data
  return staticTokenData;
}

// Static fallback token data
const staticTokenData = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    network: "Bitcoin",
    amount: "0000 BTC",
    value: "$000",
    change: { positive: "+000%", negative: "-00%" },
    icon: "₿",
    bgColor: "bg-orange-500",
    balance: "0.0234",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    transactions: [
      { type: "send", amount: "-0.005 BTC", value: "-$125.50", time: "2 hours ago", to: "0x1234...5678" },
      { type: "receive", amount: "+0.01 BTC", value: "+$251.00", time: "1 day ago", from: "0x9876...4321" },
    ],
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    network: "Ethereum",
    amount: "0000 ETH",
    value: "$000",
    change: { positive: "+000%", negative: "-00%" },
    icon: "♦",
    bgColor: "bg-gray-700",
    balance: "1.2456",
    address: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    transactions: [
      { type: "receive", amount: "+0.5 ETH", value: "+$1,250.00", time: "1 hour ago", from: "0xabcd...efgh" },
      { type: "send", amount: "-0.2 ETH", value: "-$500.00", time: "6 hours ago", to: "0x1111...2222" },
    ],
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    network: "Arbitrum",
    amount: "000 ETH",
    value: "$000",
    change: { positive: "+000%", negative: "-00%" },
    icon: "♦",
    bgColor: "bg-blue-600",
    balance: "0.5678",
    address: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    transactions: [
      { type: "receive", amount: "+0.1 ETH", value: "+$250.00", time: "2 hours ago", from: "0x7777...8888" },
    ],
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    network: "Polygon",
    amount: "000 ETH",
    value: "$000",
    change: { positive: "+000%", negative: "-00%" },
    icon: "♦",
    bgColor: "bg-purple-600",
    balance: "2.1234",
    address: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    transactions: [{ type: "send", amount: "-0.3 ETH", value: "-$750.00", time: "4 hours ago", to: "0x9999...0000" }],
  },
  {
    name: "Polygon",
    symbol: "MATIC",
    network: "Polygon",
    amount: "000 MATIC",
    value: "$000",
    change: { positive: "+000%", negative: "-00%" },
    icon: "⬟",
    bgColor: "bg-purple-600",
    balance: "245.67",
    address: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    transactions: [{ type: "send", amount: "-50 MATIC", value: "-$45.50", time: "3 hours ago", to: "0x7777...8888" }],
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    network: "Ethereum",
    amount: "0000 USDC",
    value: "$000",
    change: { positive: "+000%", negative: "-00%" },
    icon: "$",
    bgColor: "bg-blue-600",
    balance: "1250.00",
    address: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    transactions: [
      { type: "receive", amount: "+500 USDC", value: "+$500.00", time: "30 min ago", from: "0xaaaa...bbbb" },
    ],
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    network: "Polygon",
    amount: "0000 USDC",
    value: "$000",
    change: { positive: "+000%", negative: "-00%" },
    icon: "$",
    bgColor: "bg-purple-600",
    balance: "750.00",
    address: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    transactions: [{ type: "send", amount: "-200 USDC", value: "-$200.00", time: "4 hours ago", to: "0xcccc...dddd" }],
  },
  {
    name: "Binance Coin",
    symbol: "BNB",
    network: "BSC",
    amount: "0000 BNB",
    value: "$000",
    change: { positive: "+000%", negative: "-00%" },
    icon: "◆",
    bgColor: "bg-yellow-500",
    balance: "5.432",
    address: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    transactions: [{ type: "receive", amount: "+2 BNB", value: "+$600.00", time: "1 day ago", from: "0xdddd...eeee" }],
  },
];

// Export live token data with fallback to static data
export const availableTokens = getLiveTokenData();

// Original tokens for main page (keeping existing functionality)
export const tokens = getLiveTokenData().slice(0, 4);