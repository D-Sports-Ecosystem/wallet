import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { tokenService, TokenInfo } from '../services/token-service';

interface TokenContextType {
  tokens: TokenInfo[];
  availableTokens: TokenInfo[];
  isLoading: boolean;
  error: Error | null;
  refreshTokenData: () => Promise<void>;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

interface TokenProviderProps {
  children: ReactNode;
  refreshInterval?: number; // in milliseconds
  initialSymbols?: string[];
}

export const TokenProvider: React.FC<TokenProviderProps> = ({
  children,
  refreshInterval = 5 * 60 * 1000, // 5 minutes default
  initialSymbols = ['BTC', 'ETH', 'MATIC', 'USDC', 'BNB']
}) => {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [availableTokens, setAvailableTokens] = useState<TokenInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTokenData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch token data
      const fetchedTokens = await tokenService.fetchTokenData(initialSymbols);
      
      // Create multiple network versions for some tokens
      const allTokens = createMultiNetworkTokens(fetchedTokens);
      
      // Set tokens for main display (first 4)
      setTokens(allTokens.slice(0, 4));
      
      // Set all available tokens
      setAvailableTokens(allTokens);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch token data'));
      console.error('Error fetching token data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Create multiple network versions for some tokens (like ETH on different networks)
  const createMultiNetworkTokens = (tokens: TokenInfo[]): TokenInfo[] => {
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
  };

  // Fetch token data on mount and at regular intervals
  useEffect(() => {
    fetchTokenData();
    
    // Set up refresh interval
    if (refreshInterval > 0) {
      const intervalId = setInterval(fetchTokenData, refreshInterval);
      return () => clearInterval(intervalId);
    }
  }, [refreshInterval]);

  const value = {
    tokens,
    availableTokens,
    isLoading,
    error,
    refreshTokenData: fetchTokenData
  };

  return (
    <TokenContext.Provider value={value}>
      {children}
    </TokenContext.Provider>
  );
};

export const useTokens = (): TokenContextType => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useTokens must be used within a TokenProvider');
  }
  return context;
};