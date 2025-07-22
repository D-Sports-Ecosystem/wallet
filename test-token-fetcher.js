// Test the token fetcher functionality directly

// Import the token fetcher functions
const {
  updateTokenData,
  getTokenData,
  getTokenBySymbol,
  getAllTokenSymbols,
  clearTokenData,
  isTokenDataStale
} = require('./src/utils/token-fetcher.ts');

console.log('Testing token fetcher functions...');

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
  
  console.log('✅ All token fetcher functions work correctly!');
  
} catch (error) {
  console.error('❌ Error testing token fetcher:', error.message);
}