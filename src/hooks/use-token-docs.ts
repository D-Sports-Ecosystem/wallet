/**
 * @file use-token-docs.ts
 * @description React hook for fetching cryptocurrency token documentation using Context7 MCP.
 * Provides structured access to token information, whitepapers, and technical details.
 * @module hooks/use-token-docs
 * @author D-Sports Engineering Team
 * @version 1.0.0
 * @since 2025-07-23
 */

import { useState, useEffect } from 'react';

/**
 * Structured token documentation information.
 * Contains comprehensive details about a cryptocurrency token.
 * 
 * @interface
 * @property {string} name - Full name of the token
 * @property {string} symbol - Token symbol (e.g., BTC, ETH)
 * @property {string} description - General description of the token
 * @property {string} website - Official website URL
 * @property {string} whitepaper - URL to the token's whitepaper
 * @property {string} technology - Technical details about the token's implementation
 * @property {string} useCase - Information about the token's use cases
 * @property {string} marketInfo - Market-related information about the token
 */
interface TokenDocumentation {
  name: string;
  symbol: string;
  description: string;
  website: string;
  whitepaper: string;
  technology: string;
  useCase: string;
  marketInfo: string;
}

/**
 * Configuration options for the useTokenDocs hook.
 * 
 * @interface
 * @property {string} symbol - Token symbol to fetch documentation for (e.g., BTC, ETH)
 * @property {number} [maxTokens=5000] - Maximum number of tokens to retrieve from the documentation
 */
interface UseTokenDocsOptions {
  symbol: string;
  maxTokens?: number;
}

/**
 * React hook to fetch cryptocurrency token documentation using Context7 MCP.
 * Provides structured access to token information, whitepapers, and technical details.
 */
/**
 * React hook to fetch cryptocurrency token documentation using Context7 MCP.
 * 
 * @function
 * @param {UseTokenDocsOptions} options - Configuration options for the hook
 * @param {string} options.symbol - Token symbol to fetch documentation for (e.g., BTC, ETH)
 * @param {number} [options.maxTokens=5000] - Maximum number of tokens to retrieve from the documentation
 * @returns {{docs: TokenDocumentation | null, isLoading: boolean, error: Error | null}} Hook result object
 * 
 * @example
 * ```tsx
 * // Fetch Bitcoin documentation
 * const { docs, isLoading, error } = useTokenDocs({ symbol: 'BTC' });
 * 
 * if (isLoading) {
 *   return <div>Loading documentation...</div>;
 * }
 * 
 * if (error) {
 *   return <div>Error: {error.message}</div>;
 * }
 * 
 * return (
 *   <div>
 *     <h1>{docs?.name} ({docs?.symbol})</h1>
 *     <p>{docs?.description}</p>
 *     <a href={docs?.website}>Official Website</a>
 *     <a href={docs?.whitepaper}>Whitepaper</a>
 *   </div>
 * );
 * ```
 */
export function useTokenDocs({ symbol, maxTokens = 5000 }: UseTokenDocsOptions): {
  docs: TokenDocumentation | null;
  isLoading: boolean;
  error: Error | null;
} {
  const [docs, setDocs] = useState<TokenDocumentation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      if (!symbol) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // First, resolve the library ID for the token
        const libraryIdResponse = await window.mcp?.Context7?.resolveLibraryId({
          libraryName: `cryptocurrency ${symbol}`
        });
        
        if (!libraryIdResponse?.libraryId) {
          throw new Error(`Could not resolve library ID for ${symbol}`);
        }
        
        // Then fetch the documentation using the resolved library ID
        const docsResponse = await window.mcp?.Context7?.getLibraryDocs({
          context7CompatibleLibraryID: libraryIdResponse.libraryId,
          tokens: maxTokens
        });
        
        if (!docsResponse?.content) {
          throw new Error(`No documentation found for ${symbol}`);
        }
        
        // Parse the documentation content
        const parsedDocs = parseDocumentation(docsResponse.content, symbol);
        setDocs(parsedDocs);
      } catch (err) {
        console.error(`Error fetching documentation for ${symbol}:`, err);
        setError(err instanceof Error ? err : new Error(`Failed to fetch documentation for ${symbol}`));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDocs();
  }, [symbol, maxTokens]);
  
  return { docs, isLoading, error };
}

/**
 * Parse the documentation content into a structured format.
 * Extracts relevant sections from the raw documentation text.
 * 
 * @private
 * @function
 * @param {string} content - Raw documentation content from Context7
 * @param {string} symbol - Token symbol for fallback values
 * @returns {TokenDocumentation} Structured token documentation
 */
function parseDocumentation(content: string, symbol: string): TokenDocumentation {
  // Default documentation structure
  const docs: TokenDocumentation = {
    name: symbol,
    symbol: symbol,
    description: '',
    website: '',
    whitepaper: '',
    technology: '',
    useCase: '',
    marketInfo: ''
  };
  
  // Extract name and symbol
  const nameMatch = content.match(new RegExp(`# (.*?)\\s*\\(${symbol}\\)`, 'i'));
  if (nameMatch && nameMatch[1]) {
    docs.name = nameMatch[1].trim();
  }
  
  // Extract description
  const descriptionMatch = content.match(/## Overview\s*([\s\S]*?)(?=##|$)/i);
  if (descriptionMatch && descriptionMatch[1]) {
    docs.description = descriptionMatch[1].trim();
  }
  
  // Extract website
  const websiteMatch = content.match(/Website:?\s*\[([^\]]+)\]\(([^)]+)\)/i);
  if (websiteMatch && websiteMatch[2]) {
    docs.website = websiteMatch[2].trim();
  }
  
  // Extract whitepaper
  const whitepaperMatch = content.match(/Whitepaper:?\s*\[([^\]]+)\]\(([^)]+)\)/i);
  if (whitepaperMatch && whitepaperMatch[2]) {
    docs.whitepaper = whitepaperMatch[2].trim();
  }
  
  // Extract technology information
  const technologyMatch = content.match(/## Technology\s*([\s\S]*?)(?=##|$)/i);
  if (technologyMatch && technologyMatch[1]) {
    docs.technology = technologyMatch[1].trim();
  }
  
  // Extract use case information
  const useCaseMatch = content.match(/## Use Cases\s*([\s\S]*?)(?=##|$)/i);
  if (useCaseMatch && useCaseMatch[1]) {
    docs.useCase = useCaseMatch[1].trim();
  }
  
  // Extract market information
  const marketMatch = content.match(/## Market\s*([\s\S]*?)(?=##|$)/i);
  if (marketMatch && marketMatch[1]) {
    docs.marketInfo = marketMatch[1].trim();
  }
  
  return docs;
}

// Add type declaration for window.mcp
declare global {
  interface Window {
    mcp?: {
      Context7?: {
        resolveLibraryId: (params: { libraryName: string }) => Promise<{ libraryId: string }>;
        getLibraryDocs: (params: { 
          context7CompatibleLibraryID: string;
          tokens?: number;
          topic?: string;
        }) => Promise<{ content: string }>;
      };
    };
  }
}