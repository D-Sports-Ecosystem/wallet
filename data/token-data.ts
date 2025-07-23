/**
 * @file token-data.ts
 * @description Defines token data structures and provides token management functionality
 * @module data/tokens
 * @author D-Sports Engineering Team
 * @version 1.0.0
 * @since 2025-07-23
 */

/**
 * Represents a cryptocurrency token with its associated data and transaction history
 * 
 * @interface TokenData
 * @property {string} name - The full name of the token (e.g., "Bitcoin", "Ethereum")
 * @property {string} symbol - The token symbol/ticker (e.g., "BTC", "ETH")
 * @property {string} network - The blockchain network the token exists on (e.g., "Ethereum", "Polygon")
 * @property {string} amount - Formatted amount of tokens with symbol (e.g., "0.5 BTC")
 * @property {string} value - Formatted fiat value of the tokens (e.g., "$10,000")
 * @property {{ positive: string; negative: string }} change - Formatted price change percentages
 * @property {string} change.positive - Formatted positive price change (e.g., "+5.2%")
 * @property {string} change.negative - Formatted negative price change (e.g., "-3.1%")
 * @property {string} icon - Unicode or text representation of the token icon
 * @property {string} bgColor - Tailwind CSS background color class for the token
 * @property {string} balance - Raw token balance as a string (e.g., "0.5")
 * @property {string} address - Blockchain address associated with the token
 * @property {number} [price] - Current price of the token in fiat currency
 * @property {number} [percentChange24h] - 24-hour price change percentage
 * @property {number} [marketCap] - Market capitalization of the token
 * @property {string} [lastUpdated] - ISO timestamp of when the token data was last updated
 * @property {Transaction[]} transactions - Array of transactions associated with this token
 * 
 * @example
 * ```typescript
 * const bitcoin: TokenData = {
 *   name: "Bitcoin",
 *   symbol: "BTC",
 *   network: "Bitcoin",
 *   amount: "0.5 BTC",
 *   value: "$20,000",
 *   change: { positive: "+2.5%", negative: "-1.2%" },
 *   icon: "₿",
 *   bgColor: "bg-orange-500",
 *   balance: "0.5",
 *   address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
 *   price: 40000,
 *   percentChange24h: 2.5,
 *   marketCap: 800000000000,
 *   lastUpdated: "2025-07-23T12:00:00Z",
 *   transactions: []
 * };
 * ```
 */
export interface TokenData {
  name: string;
  symbol: string;
  network: string;
  amount: string;
  value: string;
  change: { positive: string; negative: string };
  icon: string;
  bgColor: string;
  balance: string;
  address: string;
  price?: number;
  percentChange24h?: number;
  marketCap?: number;
  lastUpdated?: string;
  transactions: Transaction[];
}

/**
 * Represents a token transaction with details about the transfer
 * 
 * @interface Transaction
 * @property {"send" | "receive"} type - The transaction type, either "send" (outgoing) or "receive" (incoming)
 * @property {string} amount - Formatted amount of tokens transferred with symbol (e.g., "+0.5 BTC", "-1.2 ETH")
 * @property {string} value - Formatted fiat value of the transaction (e.g., "+$20,000", "-$5,000")
 * @property {string} time - Human-readable time of the transaction (e.g., "2 hours ago", "Yesterday")
 * @property {string} [to] - Recipient address for "send" transactions
 * @property {string} [from] - Sender address for "receive" transactions
 * 
 * @example
 * ```typescript
 * const transaction: Transaction = {
 *   type: "send",
 *   amount: "-0.1 BTC",
 *   value: "-$4,000",
 *   time: "3 hours ago",
 *   to: "0x1234...5678"
 * };
 * ```
 */
export interface Transaction {
  type: "send" | "receive";
  amount: string;
  value: string;
  time: string;
  to?: string;
  from?: string;
}

/**
 * Collection of available tokens with their data and transaction history
 * 
 * This array contains sample token data for various cryptocurrencies across different
 * blockchain networks. Each token includes its basic information, current balance,
 * price data, and recent transactions. The data is structured to support multi-chain
 * tokens (e.g., ETH on Ethereum, Arbitrum, and Polygon).
 * 
 * @type {TokenData[]}
 * 
 * @example
 * ```typescript
 * // Get all Bitcoin tokens
 * const bitcoinTokens = availableTokens.filter(token => token.symbol === 'BTC');
 * 
 * // Get all tokens on Polygon network
 * const polygonTokens = availableTokens.filter(token => token.network === 'Polygon');
 * ```
 */
export const availableTokens: TokenData[] = [
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
    price: 0,
    percentChange24h: 0,
    marketCap: 0,
    lastUpdated: new Date().toISOString(),
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
    price: 0,
    percentChange24h: 0,
    marketCap: 0,
    lastUpdated: new Date().toISOString(),
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
    price: 0,
    percentChange24h: 0,
    marketCap: 0,
    lastUpdated: new Date().toISOString(),
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
    price: 0,
    percentChange24h: 0,
    marketCap: 0,
    lastUpdated: new Date().toISOString(),
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
    price: 0,
    percentChange24h: 0,
    marketCap: 0,
    lastUpdated: new Date().toISOString(),
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
    price: 0,
    percentChange24h: 0,
    marketCap: 0,
    lastUpdated: new Date().toISOString(),
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
    price: 0,
    percentChange24h: 0,
    marketCap: 0,
    lastUpdated: new Date().toISOString(),
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
    price: 0,
    percentChange24h: 0,
    marketCap: 0,
    lastUpdated: new Date().toISOString(),
    transactions: [{ type: "receive", amount: "+2 BNB", value: "+$600.00", time: "1 day ago", from: "0xdddd...eeee" }],
  },
]

/**
 * Updates token data for all tokens with the specified symbol
 * 
 * This function finds all tokens with the matching symbol and updates their data
 * with the provided partial TokenData object. This is useful for updating token
 * prices, balances, or other properties across all instances of a token.
 * 
 * @function updateTokenData
 * @param {string} symbol - The token symbol to update (e.g., "BTC", "ETH")
 * @param {Partial<TokenData>} updates - Partial TokenData object with properties to update
 * @returns {void}
 * 
 * @example
 * ```typescript
 * // Update Bitcoin price and market cap
 * updateTokenData("BTC", {
 *   price: 42000,
 *   marketCap: 820000000000,
 *   lastUpdated: new Date().toISOString()
 * });
 * ```
 */
export function updateTokenData(symbol: string, updates: Partial<TokenData>): void {
  const tokenIndex = availableTokens.findIndex(token => token.symbol === symbol);
  if (tokenIndex !== -1) {
    availableTokens[tokenIndex] = { ...availableTokens[tokenIndex], ...updates };
  }
}

/**
 * Retrieves the first token with the specified symbol
 * 
 * This function returns the first token that matches the provided symbol.
 * If multiple tokens with the same symbol exist (e.g., ETH on different networks),
 * only the first one is returned.
 * 
 * @function getTokenBySymbol
 * @param {string} symbol - The token symbol to search for (e.g., "BTC", "ETH")
 * @returns {TokenData | undefined} The matching token or undefined if not found
 * 
 * @example
 * ```typescript
 * // Get Bitcoin token data
 * const bitcoin = getTokenBySymbol("BTC");
 * if (bitcoin) {
 *   console.log(`Bitcoin balance: ${bitcoin.balance} BTC`);
 * }
 * ```
 */
export function getTokenBySymbol(symbol: string): TokenData | undefined {
  return availableTokens.find(token => token.symbol === symbol);
}

/**
 * Returns a unique array of all token symbols
 * 
 * This function extracts all unique token symbols from the available tokens.
 * It's useful for getting a list of all supported tokens without duplicates.
 * 
 * @function getAllTokenSymbols
 * @returns {string[]} Array of unique token symbols
 * 
 * @example
 * ```typescript
 * // Get all unique token symbols
 * const symbols = getAllTokenSymbols();
 * console.log(`Supported tokens: ${symbols.join(', ')}`);
 * ```
 */
export function getAllTokenSymbols(): string[] {
  return Array.from(new Set(availableTokens.map(token => token.symbol)));
}

/**
 * Subset of tokens for display on the main page
 * 
 * This constant provides a smaller subset of tokens (first 4) for use on the
 * main page or in situations where a limited token selection is needed.
 * 
 * @type {TokenData[]}
 * 
 * @example
 * ```typescript
 * // Display main tokens on dashboard
 * function Dashboard() {
 *   return (
 *     <div>
 *       {tokens.map(token => (
 *         <TokenCard key={`${token.symbol}-${token.network}`} token={token} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const tokens = availableTokens.slice(0, 4);
