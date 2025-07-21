#!/usr/bin/env node

// This script fetches the latest token data from CoinMarketCap API
// and updates the token-data.ts file

require('dotenv').config();
const { updateTokenData } = require('../dist/utils/token-fetcher');

// Check if API key is available
if (!process.env.COINMARKETCAP_API_KEY) {
  console.error('Error: COINMARKETCAP_API_KEY is not defined in .env file');
  process.exit(1);
}

console.log('Fetching latest token data from CoinMarketCap API...');

updateTokenData()
  .then(() => {
    console.log('Token data updated successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Failed to update token data:', error);
    process.exit(1);
  });