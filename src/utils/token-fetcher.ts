import { TokenInfo } from '../services/token-service';

// Improved platform detection
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

// Dynamically import the appropriate implementation
// This ensures Node.js modules are not bundled in browser builds
let tokenModule: any = null;

// Define function types for better type safety
type UpdateTokenDataFn = () => Promise<void>;
type GetTokenDataFn = () => TokenInfo[];
type GetTokenBySymbolFn = (symbol: string) => TokenInfo | undefined;
type GetAllTokenSymbolsFn = () => string[];
type GetTokensByNetworkFn = (network: string) => TokenInfo[];
type ClearTokenDataFn = () => void;
type GetLastUpdatedFn = () => Date | null;
type IsTokenDataStaleFn = (maxAgeMinutes?: number) => boolean;

// Initialize with default implementations to avoid "used before assigned" errors
export let updateTokenData: UpdateTokenDataFn = async () => {
  await initializeTokenFetcher();
  return updateTokenData();
};

export let getTokenData: GetTokenDataFn = () => {
  if (!tokenModule) {
    console.warn('Token fetcher not initialized yet');
    return [];
  }
  return tokenModule.getTokenData();
};

export let getTokenBySymbol: GetTokenBySymbolFn = (symbol: string) => {
  if (!tokenModule) {
    console.warn('Token fetcher not initialized yet');
    return undefined;
  }
  return tokenModule.getTokenBySymbol(symbol);
};

export let getAllTokenSymbols: GetAllTokenSymbolsFn = () => {
  if (!tokenModule) {
    console.warn('Token fetcher not initialized yet');
    return [];
  }
  return tokenModule.getAllTokenSymbols();
};

export let getTokensByNetwork: GetTokensByNetworkFn = (network: string) => {
  if (!tokenModule) {
    console.warn('Token fetcher not initialized yet');
    return [];
  }
  return tokenModule.getTokensByNetwork(network);
};

export let clearTokenData: ClearTokenDataFn = () => {
  if (!tokenModule) {
    console.warn('Token fetcher not initialized yet');
    return;
  }
  return tokenModule.clearTokenData();
};

export let getLastUpdated: GetLastUpdatedFn = () => {
  if (!tokenModule) {
    console.warn('Token fetcher not initialized yet');
    return null;
  }
  return tokenModule.getLastUpdated();
};

export let isTokenDataStale: IsTokenDataStaleFn = (maxAgeMinutes: number = 5) => {
  if (!tokenModule) {
    console.warn('Token fetcher not initialized yet');
    return true;
  }
  return tokenModule.isTokenDataStale(maxAgeMinutes);
};

// Initialize the appropriate implementation based on the environment
async function initializeTokenFetcher() {
  try {
    console.log(`Token fetcher initializing for ${isBrowser() ? 'browser' : 'server'} environment`);
    
    // Dynamically import the appropriate implementation based on environment
    if (isBrowser()) {
      tokenModule = await import('./browser-token-fetcher').catch(() => null);
    } else {
      tokenModule = await import('./server-token-fetcher').catch(() => null);
    }
    
    if (!tokenModule) {
      throw new Error('Failed to load platform-specific token fetcher module');
    }
    
    // Update function references to use the loaded module
    updateTokenData = tokenModule.updateTokenData;
    getTokenData = tokenModule.getTokenData;
    getTokenBySymbol = tokenModule.getTokenBySymbol;
    getAllTokenSymbols = tokenModule.getAllTokenSymbols;
    getTokensByNetwork = tokenModule.getTokensByNetwork;
    clearTokenData = tokenModule.clearTokenData;
    getLastUpdated = tokenModule.getLastUpdated;
    isTokenDataStale = tokenModule.isTokenDataStale;
    
    console.log('Token fetcher initialized successfully');
  } catch (error) {
    console.warn('Using fallback token fetcher implementations:', (error as Error).message);
    
    // Provide fallback implementations that return empty data
    updateTokenData = async () => { 
      console.warn('Token fetcher not initialized - using fallback'); 
    };
    getTokenData = () => {
      console.warn('Token fetcher not initialized - returning empty array');
      return [];
    };
    getTokenBySymbol = () => {
      console.warn('Token fetcher not initialized - returning undefined');
      return undefined;
    };
    getAllTokenSymbols = () => {
      console.warn('Token fetcher not initialized - returning empty array');
      return [];
    };
    getTokensByNetwork = () => {
      console.warn('Token fetcher not initialized - returning empty array');
      return [];
    };
    clearTokenData = () => {
      console.warn('Token fetcher not initialized - no-op');
    };
    getLastUpdated = () => {
      console.warn('Token fetcher not initialized - returning null');
      return null;
    };
    isTokenDataStale = () => {
      console.warn('Token fetcher not initialized - returning true');
      return true;
    };
  }
}

// Initialize immediately
initializeTokenFetcher().catch((error) => console.error('Failed to initialize token fetcher:', error));