import { tokenService, TokenInfo } from '../services/token-service';

// Memory-based token storage for server environments
class TokenStorage {
  private static instance: TokenStorage;
  private tokenData: TokenInfo[] = [];
  private lastUpdated: Date | null = null;
  
  private constructor() {}
  
  public static getInstance(): TokenStorage {
    if (!TokenStorage.instance) {
      TokenStorage.instance = new TokenStorage();
    }
    return TokenStorage.instance;
  }
  
  public setTokenData(tokens: TokenInfo[]): void {
    this.tokenData = tokens;
    this.lastUpdated = new Date();
  }
  
  public getTokenData(): TokenInfo[] {
    return this.tokenData;
  }
  
  public getLastUpdated(): Date | null {
    return this.lastUpdated;
  }
  
  public clearTokenData(): void {
    this.tokenData = [];
    this.lastUpdated = null;
  }
}

// Export singleton instance
const tokenStorage = TokenStorage.getInstance();

/**
 * Fetch token data from CoinMarketCap API and update token storage
 */
export async function updateTokenData(): Promise<void> {
  try {
    // Define the tokens we want to fetch
    const symbols = ['BTC', 'ETH', 'MATIC', 'USDC', 'BNB'];
    
    // Fetch token data from CoinMarketCap API
    const tokens = await tokenService.fetchTokenData(symbols);
    
    // Create multiple network versions for some tokens (like ETH on different networks)
    const availableTokens = createMultiNetworkTokens(tokens);
    
    // Store in memory-based storage
    tokenStorage.setTokenData(availableTokens);
    
    // Write to file system
    try {
      const { writeTokenDataToFile } = await import('./server-token-writer');
      await writeTokenDataToFile(availableTokens);
    } catch (error) {
      console.warn('Failed to write token data to file system:', error);
    }
    
    console.log('Token data updated successfully');
  } catch (error) {
    console.error('Failed to update token data:', error);
  }
}

/**
 * Create multiple network versions for some tokens (like ETH on different networks)
 */
function createMultiNetworkTokens(tokens: TokenInfo[]): TokenInfo[] {
  const result: TokenInfo[] = [];
  
  tokens.forEach(token => {
    // Add the original token
    result.push(token);
    
    // Create network variants for ETH
    if (token.symbol === 'ETH') {
      // ETH on Arbitrum
      result.push({
        ...token,
        network: 'Arbitrum',
        bgColor: 'bg-blue-600',
        balance: (parseFloat(token.balance) / 2).toFixed(4),
        transactions: [
          {
            type: 'receive',
            amount: '+0.1 ETH',
            value: '+$250.00',
            time: '2 hours ago',
            from: '0x7777...8888',
          },
        ],
      });
      
      // ETH on Polygon
      result.push({
        ...token,
        network: 'Polygon',
        bgColor: 'bg-purple-600',
        balance: (parseFloat(token.balance) * 1.5).toFixed(4),
        transactions: [
          {
            type: 'send',
            amount: '-0.3 ETH',
            value: '-$750.00',
            time: '4 hours ago',
            to: '0x9999...0000',
          },
        ],
      });
    }
    
    // Create network variants for USDC
    if (token.symbol === 'USDC') {
      // USDC on Polygon
      result.push({
        ...token,
        network: 'Polygon',
        bgColor: 'bg-purple-600',
        balance: (parseFloat(token.balance) * 0.6).toFixed(2),
        transactions: [
          {
            type: 'send',
            amount: '-200 USDC',
            value: '-$200.00',
            time: '4 hours ago',
            to: '0xcccc...dddd',
          },
        ],
      });
    }
  });
  
  return result;
}

/**
 * Get current token data from storage
 */
export function getTokenData(): TokenInfo[] {
  return tokenStorage.getTokenData();
}

/**
 * Get token data by symbol
 */
export function getTokenBySymbol(symbol: string): TokenInfo | undefined {
  const tokens = tokenStorage.getTokenData();
  return tokens.find(token => token.symbol === symbol);
}

/**
 * Get all available token symbols
 */
export function getAllTokenSymbols(): string[] {
  const tokens = tokenStorage.getTokenData();
  return [...new Set(tokens.map(token => token.symbol))];
}

/**
 * Get tokens for a specific network
 */
export function getTokensByNetwork(network: string): TokenInfo[] {
  const tokens = tokenStorage.getTokenData();
  return tokens.filter(token => token.network === network);
}

/**
 * Clear token data from storage
 */
export function clearTokenData(): void {
  tokenStorage.clearTokenData();
}

/**
 * Get last updated timestamp
 */
export function getLastUpdated(): Date | null {
  return tokenStorage.getLastUpdated();
}

/**
 * Check if token data is stale (older than specified minutes)
 */
export function isTokenDataStale(maxAgeMinutes: number = 5): boolean {
  const lastUpdated = tokenStorage.getLastUpdated();
  if (!lastUpdated) return true;
  
  const now = new Date();
  const ageMinutes = (now.getTime() - lastUpdated.getTime()) / (1000 * 60);
  return ageMinutes > maxAgeMinutes;
}