/**
 * @file token-context.tsx
 * @description React context for managing cryptocurrency token data.
 * Provides token information, loading states, and data refresh functionality.
 * @module contexts/token-context
 * @author D-Sports Engineering Team
 * @version 1.0.0
 * @since 2025-07-23
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { TokenInfo } from '../services/token-service';
import { tokenUpdateService, TokenUpdateConfig } from '../services/token-update-service';

/**
 * Token context type definition.
 * Contains token data and related functionality.
 * 
 * @interface
 * @property {TokenInfo[]} tokens - List of primary tokens to display
 * @property {TokenInfo[]} availableTokens - List of all available tokens
 * @property {boolean} isLoading - Whether token data is loading
 * @property {Error | null} error - Error that occurred during data fetching, if any
 * @property {function} refreshTokenData - Function to manually refresh token data
 * @property {Date | null} lastUpdated - Timestamp of the last data update
 */
interface TokenContextType {
  tokens: TokenInfo[];
  availableTokens: TokenInfo[];
  isLoading: boolean;
  error: Error | null;
  refreshTokenData: () => Promise<void>;
  lastUpdated: Date | null;
}

/**
 * React context for token data.
 * Provides token information throughout the component tree.
 */
const TokenContext = createContext<TokenContextType | undefined>(undefined);

/**
 * Props for the TokenProvider component.
 * 
 * @interface
 * @property {ReactNode} children - Child components
 * @property {number} [refreshInterval=300000] - Data refresh interval in milliseconds (default: 5 minutes)
 * @property {number} [cacheTTL=300000] - Cache time-to-live in milliseconds (default: 5 minutes)
 * @property {string[]} [initialSymbols=['BTC', 'ETH', 'MATIC', 'USDC', 'BNB']] - Initial token symbols to fetch
 * @property {string} [currency='USD'] - Currency for token prices
 * @property {boolean} [autoStart=true] - Whether to start fetching data automatically
 */
interface TokenProviderProps {
  children: ReactNode;
  refreshInterval?: number; // in milliseconds
  cacheTTL?: number; // in milliseconds
  initialSymbols?: string[];
  currency?: string;
  autoStart?: boolean;
}

/**
 * Provider component for token data.
 * Manages token state and provides it to child components.
 * 
 * @component
 * @param {TokenProviderProps} props - Component props
 * @returns {JSX.Element} Provider component
 * 
 * @example
 * ```tsx
 * // Wrap your app with the TokenProvider
 * return (
 *   <TokenProvider 
 *     refreshInterval={60000} 
 *     initialSymbols={['BTC', 'ETH', 'SOL']}
 *   >
 *     <App />
 *   </TokenProvider>
 * );
 * ```
 */
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

/**
 * Hook to access token data from the TokenContext.
 * Must be used within a TokenProvider component.
 * 
 * @function
 * @returns {TokenContextType} Token context value
 * @throws {Error} If used outside of a TokenProvider
 * 
 * @example
 * ```tsx
 * // Use token data in a component
 * const { tokens, isLoading, refreshTokenData } = useTokens();
 * 
 * if (isLoading) {
 *   return <div>Loading tokens...</div>;
 * }
 * 
 * return (
 *   <div>
 *     <button onClick={refreshTokenData}>Refresh</button>
 *     <ul>
 *       {tokens.map(token => (
 *         <li key={token.symbol}>
 *           {token.name}: {token.price} {token.currency}
 *         </li>
 *       ))}
 *     </ul>
 *   </div>
 * );
 * ```
 */
export const useTokens = (): TokenContextType => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useTokens must be used within a TokenProvider');
  }
  return context;
};