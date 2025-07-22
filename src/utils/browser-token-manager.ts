/**
 * Browser-compatible token data manager
 * Provides live token data with fallback to static data
 */

import { TokenInfo } from '../services/token-service';
import { getTokenData, isTokenDataStale } from './token-fetcher';

// Import static token data as fallback
let staticTokenData: any[] = [];

// Lazy load static data to avoid circular dependencies
async function loadStaticTokenData() {
  if (staticTokenData.length === 0) {
    try {
      const { availableTokens } = await import('../../data/token-data');
      staticTokenData = availableTokens;
    } catch (error) {
      console.warn('Failed to load static token data:', error);
    }
  }
  return staticTokenData;
}

/**
 * Get live token data with fallback to static data
 */
export async function getLiveTokenData(): Promise<TokenInfo[]> {
  try {
    const liveData = getTokenData();
    if (liveData.length > 0 && !isTokenDataStale(10)) {
      return liveData;
    }
  } catch (error) {
    console.warn('Failed to get live token data, using static fallback:', error);
  }
  
  // Fallback to static data
  const staticData = await loadStaticTokenData();
  return staticData;
}

/**
 * Get token by symbol with live data fallback
 */
export async function getLiveTokenBySymbol(symbol: string): Promise<TokenInfo | undefined> {
  const tokens = await getLiveTokenData();
  return tokens.find(token => token.symbol === symbol);
}

/**
 * Get all token symbols with live data fallback
 */
export async function getLiveTokenSymbols(): Promise<string[]> {
  const tokens = await getLiveTokenData();
  return [...new Set(tokens.map(token => token.symbol))];
}

/**
 * Get tokens by network with live data fallback
 */
export async function getLiveTokensByNetwork(network: string): Promise<TokenInfo[]> {
  const tokens = await getLiveTokenData();
  return tokens.filter(token => token.network === network);
}

/**
 * Get tokens for main page (first 4 tokens)
 */
export async function getMainPageTokens(): Promise<TokenInfo[]> {
  const tokens = await getLiveTokenData();
  return tokens.slice(0, 4);
}