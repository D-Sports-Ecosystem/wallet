import { coinMarketCapAdapter } from '../utils/platform-adapter';
import { TokenData, updateTokenData, getAllTokenSymbols } from '../../data/token-data';

/**
 * @file token-service.ts
 * @description Service for fetching and managing token data from CoinMarketCap API
 * @module services/token
 * @author D-Sports Engineering Team
 * @version 1.0.0
 * @since 2025-07-23
 */

/**
 * Represents a token data structure from the CoinMarketCap API
 * 
 * This interface defines the structure of token data as returned by the
 * CoinMarketCap API. It includes basic token information, supply data,
 * and price quotes in different currencies.
 * 
 * @interface CoinMarketCapTokenData
 * @property {number} id - Unique CoinMarketCap identifier for the token
 * @property {string} name - Name of the token (e.g., "Bitcoin")
 * @property {string} symbol - Symbol of the token (e.g., "BTC")
 * @property {string} slug - URL-friendly version of the token name
 * @property {number} cmc_rank - CoinMarketCap rank by market cap
 * @property {number} num_market_pairs - Number of market pairs across exchanges
 * @property {number} circulating_supply - Number of tokens in circulation
 * @property {number} total_supply - Total number of tokens created
 * @property {number} max_supply - Maximum number of tokens that will ever exist
 * @property {string} last_updated - ISO timestamp of when the data was last updated
 * @property {string} date_added - ISO timestamp of when the token was added to CoinMarketCap
 * @property {string[]} tags - Array of tags associated with the token
 * @property {any} platform - Platform on which the token exists (for tokens not native to their blockchain)
 * @property {Object} quote - Price quotes in different currencies
 * @property {Object} quote[currency] - Price data for a specific currency
 * @property {number} quote[currency].price - Current price in the specified currency
 * @property {number} quote[currency].volume_24h - 24-hour trading volume
 * @property {number} quote[currency].volume_change_24h - 24-hour volume change percentage
 * @property {number} quote[currency].percent_change_1h - 1-hour price change percentage
 * @property {number} quote[currency].percent_change_24h - 24-hour price change percentage
 * @property {number} quote[currency].percent_change_7d - 7-day price change percentage
 * @property {number} quote[currency].percent_change_30d - 30-day price change percentage
 * @property {number} quote[currency].market_cap - Market capitalization in the specified currency
 * @property {number} quote[currency].market_cap_dominance - Percentage of total market cap
 * @property {number} quote[currency].fully_diluted_market_cap - Market cap if max supply was in circulation
 * @property {string} quote[currency].last_updated - ISO timestamp of when the quote was last updated
 */
export interface CoinMarketCapTokenData {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  cmc_rank: number;
  num_market_pairs: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  last_updated: string;
  date_added: string;
  tags: string[];
  platform: any;
  quote: {
    [currency: string]: {
      price: number;
      volume_24h: number;
      volume_change_24h: number;
      percent_change_1h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      percent_change_30d: number;
      market_cap: number;
      market_cap_dominance: number;
      fully_diluted_market_cap: number;
      last_updated: string;
    };
  };
}

/**
 * Represents a response from the CoinMarketCap API
 * 
 * This interface defines the structure of responses from the CoinMarketCap API.
 * It includes a status object with metadata about the request and a data object
 * containing the requested token information.
 * 
 * @interface CoinMarketCapResponse
 * @property {Object} status - Status information about the API request
 * @property {string} status.timestamp - ISO timestamp of when the request was processed
 * @property {number} status.error_code - Error code (0 indicates success)
 * @property {string | null} status.error_message - Error message if an error occurred, null otherwise
 * @property {number} status.elapsed - Time elapsed in milliseconds for the request
 * @property {number} status.credit_count - Number of credits used for the request
 * @property {string | null} status.notice - Additional notice information, null if none
 * @property {Object} data - Object containing token data keyed by symbol
 * @property {CoinMarketCapTokenData} data[symbol] - Token data for each requested symbol
 * 
 * @example
 * ```typescript
 * // Example of a successful response
 * const response: CoinMarketCapResponse = {
 *   status: {
 *     timestamp: "2024-07-23T12:00:00.000Z",
 *     error_code: 0,
 *     error_message: null,
 *     elapsed: 10,
 *     credit_count: 1,
 *     notice: null
 *   },
 *   data: {
 *     "BTC": {
 *       id: 1,
 *       name: "Bitcoin",
 *       symbol: "BTC",
 *       // ... other properties
 *     }
 *   }
 * };
 * ```
 */
export interface CoinMarketCapResponse {
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
    elapsed: number;
    credit_count: number;
    notice: string | null;
  };
  data: {
    [symbol: string]: CoinMarketCapTokenData;
  };
}

/**
 * Extended token data interface with additional market information
 * 
 * This interface extends the base TokenData interface with additional
 * properties related to market data such as price, percent change,
 * and market capitalization.
 * 
 * @interface TokenInfo
 * @extends {TokenData}
 * @property {number} price - Current price of the token in fiat currency
 * @property {number} percentChange24h - 24-hour price change percentage
 * @property {number} marketCap - Market capitalization of the token
 * 
 * @example
 * ```typescript
 * const bitcoinInfo: TokenInfo = {
 *   ...bitcoinData,
 *   price: 42000,
 *   percentChange24h: 2.5,
 *   marketCap: 820000000000
 * };
 * ```
 */
export interface TokenInfo extends TokenData {
  price: number;
  percentChange24h: number;
  marketCap: number;
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

class TokenService {
  private apiKey: string;
  private baseUrl: string;
  private updateInterval: NodeJS.Timeout | null = null;
  private isUpdating: boolean = false;

  constructor() {
    // Load environment variables
    if (typeof process !== 'undefined' && process.env) {
      this.apiKey = process.env.COINMARKETCAP_API_KEY || '';
    } else {
      this.apiKey = '';
      console.warn('CoinMarketCap API key not found. Please set COINMARKETCAP_API_KEY environment variable.');
    }
    this.baseUrl = 'https://pro-api.coinmarketcap.com/v1';
  }

  /**
   * Fetch latest token data from CoinMarketCap API
   * @param symbols Array of token symbols to fetch (e.g., ['BTC', 'ETH'])
   * @param currency Currency for price conversion (default: 'USD')
   * @returns Promise with token data
   */
  async fetchTokenData(symbols: string[], currency: string = 'USD'): Promise<TokenInfo[]> {
    try {
      // Use the CoinMarketCap adapter to fetch data with caching
      const data = await coinMarketCapAdapter.getLatestQuotes(symbols, currency);
      
      if (data.status.error_code !== 0) {
        throw new Error(`API error: ${data.status.error_message}`);
      }

      // Transform the API response into our TokenInfo format
      const tokenInfos = this.transformTokenData(data, symbols, currency);
      
      // Update the global token data
      this.updateGlobalTokenData(tokenInfos);
      
      return tokenInfos;
    } catch (error) {
      console.error('Error fetching token data:', error);
      // Return placeholder data on error to prevent UI breaks
      return this.getPlaceholderTokenInfos(symbols);
    }
  }

  /**
   * Start automatic token data updates
   * @param intervalMs Update interval in milliseconds (default: 5 minutes)
   */
  startAutoUpdate(intervalMs: number = 5 * 60 * 1000): void {
    if (this.updateInterval) {
      this.stopAutoUpdate();
    }

    this.updateInterval = setInterval(async () => {
      if (!this.isUpdating) {
        this.isUpdating = true;
        try {
          const symbols = getAllTokenSymbols();
          await this.fetchTokenData(symbols);
          console.log('Token data updated successfully');
        } catch (error) {
          console.error('Auto-update failed:', error);
        } finally {
          this.isUpdating = false;
        }
      }
    }, intervalMs);

    console.log(`Token auto-update started with ${intervalMs}ms interval`);
  }

  /**
   * Stop automatic token data updates
   */
  stopAutoUpdate(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
      console.log('Token auto-update stopped');
    }
  }

  /**
   * Manually refresh token data
   */
  async refreshTokenData(): Promise<TokenInfo[]> {
    const symbols = getAllTokenSymbols();
    return this.fetchTokenData(symbols);
  }

  /**
   * Get historical price data for a token
   * @param symbol Token symbol (e.g., 'BTC')
   * @param timeStart Start time (ISO 8601 format)
   * @param timeEnd End time (ISO 8601 format)
   * @param interval Data interval
   * @param currency Currency for conversion (default: 'USD')
   */
  async getHistoricalData(
    symbol: string,
    timeStart?: string,
    timeEnd?: string,
    interval?: '5m' | '10m' | '15m' | '30m' | '45m' | '1h' | '2h' | '3h' | '4h' | '6h' | '12h' | '1d' | '2d' | '3d' | '7d' | '14d' | '15d' | '30d' | '60d' | '90d' | '365d',
    currency: string = 'USD'
  ): Promise<any> {
    try {
      return await coinMarketCapAdapter.getHistoricalQuotes(
        symbol,
        timeStart,
        timeEnd,
        undefined,
        interval,
        currency
      );
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  }

  /**
   * Get global cryptocurrency market metrics
   * @param currency Currency for conversion (default: 'USD')
   */
  async getGlobalMetrics(currency: string = 'USD'): Promise<any> {
    try {
      return await coinMarketCapAdapter.getGlobalMetrics(currency);
    } catch (error) {
      console.error('Error fetching global metrics:', error);
      throw error;
    }
  }

  /**
   * Convert price between cryptocurrencies or fiat
   * @param amount Amount to convert
   * @param fromSymbol Source currency symbol
   * @param toSymbol Target currency symbol
   */
  async convertPrice(amount: number, fromSymbol: string, toSymbol: string): Promise<any> {
    try {
      return await coinMarketCapAdapter.convertPrice(amount, fromSymbol, toSymbol);
    } catch (error) {
      console.error('Error converting price:', error);
      throw error;
    }
  }

  /**
   * Get top cryptocurrencies by market cap
   * @param limit Number of cryptocurrencies to return (default: 100)
   * @param currency Currency for conversion (default: 'USD')
   */
  async getTopCryptocurrencies(limit: number = 100, currency: string = 'USD'): Promise<any> {
    try {
      return await coinMarketCapAdapter.getListingsLatest(1, limit, currency, 'market_cap');
    } catch (error) {
      console.error('Error fetching top cryptocurrencies:', error);
      throw error;
    }
  }

  /**
   * Get token metadata including logos and descriptions
   * @param symbols Array of token symbols
   */
  async getTokenMetadata(symbols: string[]): Promise<any> {
    try {
      return await coinMarketCapAdapter.getMetadata(symbols);
    } catch (error) {
      console.error('Error fetching token metadata:', error);
      throw error;
    }
  }

  /**
   * Transform CoinMarketCap API data into our TokenInfo format
   */
  private transformTokenData(
    response: CoinMarketCapResponse, 
    symbols: string[], 
    currency: string
  ): TokenInfo[] {
    return symbols.map(symbol => {
      const tokenData = response.data[symbol];
      if (!tokenData) {
        // Return placeholder data if token not found
        return this.getPlaceholderTokenInfo(symbol);
      }

      const quote = tokenData.quote[currency];
      const percentChange = quote.percent_change_24h;
      
      return {
        name: tokenData.name,
        symbol: tokenData.symbol,
        network: this.getNetworkForToken(tokenData.symbol),
        amount: `${this.getRandomBalance()} ${tokenData.symbol}`,
        value: `$${quote.price.toFixed(2)}`,
        change: {
          positive: `+${Math.abs(percentChange).toFixed(2)}%`,
          negative: `-${Math.abs(percentChange).toFixed(2)}%`,
        },
        icon: this.getIconForToken(tokenData.symbol),
        bgColor: this.getBgColorForToken(tokenData.symbol),
        balance: this.getRandomBalance(),
        address: this.getAddressForToken(tokenData.symbol),
        price: quote.price,
        percentChange24h: percentChange,
        marketCap: quote.market_cap,
        lastUpdated: new Date().toISOString(),
        transactions: this.getRandomTransactions(tokenData.symbol),
      };
    });
  }

  /**
   * Update global token data with fresh API data
   */
  private updateGlobalTokenData(tokenInfos: TokenInfo[]): void {
    try {
      tokenInfos.forEach(tokenInfo => {
        if (typeof updateTokenData === 'function') {
          updateTokenData(tokenInfo.symbol, {
            value: tokenInfo.value,
            change: tokenInfo.change,
            price: tokenInfo.price,
            percentChange24h: tokenInfo.percentChange24h,
            marketCap: tokenInfo.marketCap,
            lastUpdated: tokenInfo.lastUpdated,
          });
        }
      });
    } catch (error) {
      // Silently handle the error in test environments
      console.warn('Could not update global token data:', error);
    }
  }

  /**
   * Get placeholder token infos for error cases
   */
  private getPlaceholderTokenInfos(symbols: string[]): TokenInfo[] {
    return symbols.map(symbol => this.getPlaceholderTokenInfo(symbol));
  }

  /**
   * Get a placeholder token info when API data is not available
   */
  private getPlaceholderTokenInfo(symbol: string): TokenInfo {
    return {
      name: this.getNameForSymbol(symbol),
      symbol: symbol,
      network: this.getNetworkForToken(symbol),
      amount: `0000 ${symbol}`,
      value: "$000",
      change: { positive: "+000%", negative: "-00%" },
      icon: this.getIconForToken(symbol),
      bgColor: this.getBgColorForToken(symbol),
      balance: "0.0000",
      address: this.getAddressForToken(symbol),
      price: 0,
      percentChange24h: 0,
      marketCap: 0,
      lastUpdated: new Date().toISOString(),
      transactions: this.getRandomTransactions(symbol),
    };
  }

  /**
   * Helper methods to provide consistent token information
   */
  private getNameForSymbol(symbol: string): string {
    const names: { [key: string]: string } = {
      'BTC': 'Bitcoin',
      'ETH': 'Ethereum',
      'MATIC': 'Polygon',
      'USDC': 'USD Coin',
      'BNB': 'Binance Coin',
    };
    return names[symbol] || symbol;
  }

  private getNetworkForToken(symbol: string): string {
    const networks: { [key: string]: string } = {
      'BTC': 'Bitcoin',
      'ETH': 'Ethereum',
      'MATIC': 'Polygon',
      'USDC': 'Ethereum',
      'BNB': 'BSC',
    };
    return networks[symbol] || 'Ethereum';
  }

  private getIconForToken(symbol: string): string {
    const icons: { [key: string]: string } = {
      'BTC': '₿',
      'ETH': '♦',
      'MATIC': '⬟',
      'USDC': '$',
      'BNB': '◆',
    };
    return icons[symbol] || '○';
  }

  private getBgColorForToken(symbol: string): string {
    const colors: { [key: string]: string } = {
      'BTC': 'bg-orange-500',
      'ETH': 'bg-gray-700',
      'MATIC': 'bg-purple-600',
      'USDC': 'bg-blue-600',
      'BNB': 'bg-yellow-500',
    };
    return colors[symbol] || 'bg-gray-500';
  }

  private getAddressForToken(symbol: string): string {
    if (symbol === 'BTC') {
      return 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
    }
    return '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4';
  }

  private getRandomBalance(): string {
    return (Math.random() * 10).toFixed(4);
  }

  private getRandomTransactions(symbol: string): Transaction[] {
    const transactions: Transaction[] = [];
    const count = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < count; i++) {
      const type = Math.random() > 0.5 ? 'send' : 'receive';
      const amount = (Math.random() * 5).toFixed(3);
      const value = (parseFloat(amount) * 100).toFixed(2);
      const hours = Math.floor(Math.random() * 24) + 1;
      
      transactions.push({
        type,
        amount: `${type === 'send' ? '-' : '+'}${amount} ${symbol}`,
        value: `${type === 'send' ? '-' : '+'}$${value}`,
        time: `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`,
        ...(type === 'send' ? { to: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}` } : {}),
        ...(type === 'receive' ? { from: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}` } : {}),
      });
    }
    
    return transactions;
  }
}

export const tokenService = new TokenService();