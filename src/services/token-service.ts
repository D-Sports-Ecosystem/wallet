import { coinMarketCapAdapter } from '../utils/platform-adapter';

// Define types for the CoinMarketCap API responses
export interface TokenData {
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
    [symbol: string]: TokenData;
  };
}

export interface TokenInfo {
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
  price: number;
  percentChange24h: number;
  marketCap: number;
  transactions: Transaction[];
}

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

  constructor() {
    this.apiKey = process.env.COINMARKETCAP_API_KEY || '';
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
      return this.transformTokenData(data, symbols, currency);
    } catch (error) {
      console.error('Error fetching token data:', error);
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
        transactions: this.getRandomTransactions(tokenData.symbol),
      };
    });
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