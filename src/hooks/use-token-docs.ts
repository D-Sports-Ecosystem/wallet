import { useState, useEffect } from 'react';

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

interface UseTokenDocsOptions {
  symbol: string;
  maxTokens?: number;
}

/**
 * Hook to fetch token documentation using Context7 MCP
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
 * Parse the documentation content into a structured format
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