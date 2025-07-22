import { TokenInfo } from '../services/token-service';

// Improved platform detection
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function isServer(): boolean {
  return typeof process !== 'undefined' && 
         process.versions !== undefined && 
         process.versions.node !== undefined;
}

// Dynamically import the appropriate implementation
// This ensures Node.js modules are not bundled in browser builds
let tokenModule: any = null;

// Export placeholder functions that will be replaced with the actual implementations
export let updateTokenData: () => Promise<void>;
export let getTokenData: () => TokenInfo[];
export let getTokenBySymbol: (symbol: string) => TokenInfo | undefined;
export let getAllTokenSymbols: () => string[];
export let getTokensByNetwork: (network: string) => TokenInfo[];
export let clearTokenData: () => void;
export let getLastUpdated: () => Date | null;
export let isTokenDataStale: (maxAgeMinutes?: number) => boolean;

// Initialize the appropriate implementation based on the environment
async function initializeTokenFetcher() {
  try {
    if (isBrowser()) {
      // Import browser implementation
      tokenModule = await import('./browser-token-fetcher');
    } else {
      // Import server implementation (with Node.js modules)
      tokenModule = await import('./server-token-fetcher');
    }
    
    // Assign the implementations to the exported functions
    updateTokenData = tokenModule.updateTokenData;
    getTokenData = tokenModule.getTokenData;
    getTokenBySymbol = tokenModule.getTokenBySymbol;
    getAllTokenSymbols = tokenModule.getAllTokenSymbols;
    getTokensByNetwork = tokenModule.getTokensByNetwork;
    clearTokenData = tokenModule.clearTokenData;
    getLastUpdated = tokenModule.getLastUpdated;
    isTokenDataStale = tokenModule.isTokenDataStale;
    
    console.log(`Token fetcher initialized for ${isBrowser() ? 'browser' : 'server'} environment`);
  } catch (error) {
    console.error('Failed to initialize token fetcher:', error);
    
    // Provide fallback implementations that return empty data
    updateTokenData = async () => { console.warn('Token fetcher not initialized'); };
    getTokenData = () => [];
    getTokenBySymbol = () => undefined;
    getAllTokenSymbols = () => [];
    getTokensByNetwork = () => [];
    clearTokenData = () => {};
    getLastUpdated = () => null;
    isTokenDataStale = () => true;
  }
}

// Initialize immediately
initializeTokenFetcher().catch(console.error);

// Provide synchronous implementations for immediate use before async initialization completes
// These will be replaced once initialization is complete
if (!updateTokenData) {
  updateTokenData = async () => {
    await initializeTokenFetcher();
    return tokenModule.updateTokenData();
  };
}

if (!getTokenData) {
  getTokenData = () => {
    if (!tokenModule) {
      console.warn('Token fetcher not initialized yet');
      return [];
    }
    return tokenModule.getTokenData();
  };
}

if (!getTokenBySymbol) {
  getTokenBySymbol = (symbol: string) => {
    if (!tokenModule) {
      console.warn('Token fetcher not initialized yet');
      return undefined;
    }
    return tokenModule.getTokenBySymbol(symbol);
  };
}

if (!getAllTokenSymbols) {
  getAllTokenSymbols = () => {
    if (!tokenModule) {
      console.warn('Token fetcher not initialized yet');
      return [];
    }
    return tokenModule.getAllTokenSymbols();
  };
}

if (!getTokensByNetwork) {
  getTokensByNetwork = (network: string) => {
    if (!tokenModule) {
      console.warn('Token fetcher not initialized yet');
      return [];
    }
    return tokenModule.getTokensByNetwork(network);
  };
}

if (!clearTokenData) {
  clearTokenData = () => {
    if (!tokenModule) {
      console.warn('Token fetcher not initialized yet');
      return;
    }
    return tokenModule.clearTokenData();
  };
}

if (!getLastUpdated) {
  getLastUpdated = () => {
    if (!tokenModule) {
      console.warn('Token fetcher not initialized yet');
      return null;
    }
    return tokenModule.getLastUpdated();
  };
}

if (!isTokenDataStale) {
  isTokenDataStale = (maxAgeMinutes: number = 5) => {
    if (!tokenModule) {
      console.warn('Token fetcher not initialized yet');
      return true;
    }
    return tokenModule.isTokenDataStale(maxAgeMinutes);
  };
}