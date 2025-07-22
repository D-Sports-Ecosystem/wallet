#!/usr/bin/env node

// This script fetches the latest token data from CoinMarketCap API
// and updates the token storage (file system in Node.js, memory in browser)

require('dotenv').config();

// Dynamic import to handle both CommonJS and ES modules
async function main() {
  try {
    // Check if API key is available
    if (!process.env.COINMARKETCAP_API_KEY) {
      console.error('Error: COINMARKETCAP_API_KEY is not defined in .env file');
      process.exit(1);
    }

    console.log('Fetching latest token data from CoinMarketCap API...');

    // Import the token fetcher utility
    const { updateTokenData } = await import('../dist/utils/token-fetcher.js');
    
    // Update token data
    await updateTokenData();
    
    console.log('Token data updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to update token data:', error);
    process.exit(1);
  }
}

main();