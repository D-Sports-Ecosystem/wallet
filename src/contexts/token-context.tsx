import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { TokenInfo } from '../services/token-service';
import { tokenUpdateService, TokenUpdateConfig } from '../services/token-update-service';

interface TokenContextType {
  tokens: TokenInfo[];
  availableTokens: TokenInfo[];
  isLoading: boolean;
  error: Error | null;
  refreshTokenData: () => Promise<void>;
  lastUpdated: Date | null;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

interface TokenProviderProps {
  children: ReactNode;
  refreshInterval?: number; // in milliseconds
  cacheTTL?: number; // in milliseconds
  initialSymbols?: string[];
  currency?: string;
  autoStart?: boolean;
}

export const TokenProvider: React.FC<TokenProviderProps> = ({
  children,
  refreshInterval = 5 * 60 * 1000, // 5 minutes default
  cacheTTL = 5 * 60 * 1000, // 5 minutes default
  initialSymbols = ['BTC', 'ETH', 'MATIC', 'USDC', 'BNB'],
  currency = 'USD',
  autoStart = true
}) => {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [availableTokens, setAvailableTokens] = useState<TokenInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Create multiple network versions for some tokens (like ETH on different networks)
  const createMultiNetworkTokens = useCallback((tokens: TokenInfo[]): TokenInfo[] => {
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
              value: '+$' + ((token.price || 0) * 0.1).toFixed(2),
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
              value: '-$' + ((token.price || 0) * 0.3).toFixed(2),
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
  }, []);

  const fetchTokenData = useCallback(async () => {
    // If already refreshing, don't start another refresh
    if (isRefreshing) return;
    
    try {
      setIsRefreshing(true);
      if (!lastUpdated) setIsLoading(true);
      setError(null);
      
      // Force an update using the token update service
      await tokenUpdateService.forceUpdate();
      
      // The onUpdate callback will handle updating the state
    } catch (err) {
      // The onError callback will handle error state
      console.error('Error in manual token data refresh:', err);
    }
  }, [isRefreshing, lastUpdated]);

  // Initialize token update service
  useEffect(() => {
    // Configure token update service
    const updateConfig: TokenUpdateConfig = {
      refreshInterval,
      cacheTTL,
      symbols: initialSymbols,
      currency,
      autoStart,
      onUpdate: (updatedTokens) => {
        // Create multiple network versions for some tokens
        const allTokens = createMultiNetworkTokens(updatedTokens);
        
        // Set tokens for main display (first 4)
        setTokens(allTokens.slice(0, 4));
        
        // Set all available tokens
        setAvailableTokens(allTokens);
        
        // Update last updated timestamp
        setLastUpdated(new Date());
        
        // Update loading state
        setIsLoading(false);
        setIsRefreshing(false);
      },
      onError: (err) => {
        setError(err);
        setIsLoading(false);
        setIsRefreshing(false);
        console.error('Error fetching token data:', err);
      }
    };
    
    // Update token service configuration
    tokenUpdateService.updateConfig(updateConfig);
    
    // Clean up on unmount
    return () => {
      tokenUpdateService.stop();
    };
  }, [refreshInterval, cacheTTL, initialSymbols, currency, autoStart, createMultiNetworkTokens]);

  const value = {
    tokens,
    availableTokens,
    isLoading,
    error,
    refreshTokenData: fetchTokenData,
    lastUpdated
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