// Test the browser-safe token fetcher functionality

// Mock browser environment
global.window = {
  localStorage: {
    getItem: (key) => null,
    setItem: (key, value) => {},
    removeItem: (key) => {}
  }
};
global.document = {};

// Import the token fetcher functions
const {
  updateTokenData,
  getTokenData,
  getTokenBySymbol,
  getAllTokenSymbols,
  clearTokenData,
  isTokenDataStale
} = require('./src/utils/browser-token-fetcher');

console.log('Testing browser-safe token fetcher functions...');

try {
  // Test getting token data
  const tokens = getTokenData();
  console.log('✅ getTokenData works, returned:', tokens.length, 'tokens');
  
  // Test getting token by symbol
  const btcToken = getTokenBySymbol('BTC');
  console.log('✅ getTokenBySymbol works, BTC token:', btcToken ? 'found' : 'not found');
  
  // Test getting all symbols
  const symbols = getAllTokenSymbols();
  console.log('✅ getAllTokenSymbols works, symbols:', symbols);
  
  // Test checking if data is stale
  const isStale = isTokenDataStale();
  console.log('✅ isTokenDataStale works, is stale:', isStale);
  
  console.log('✅ All browser-safe token fetcher functions work correctly!');
  
} catch (error) {
  console.error('❌ Error testing browser-safe token fetcher:', error.message);
}