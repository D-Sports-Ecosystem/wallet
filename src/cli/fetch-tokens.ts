#!/usr/bin/env node

import { config } from 'dotenv';
import { updateTokenData } from '../utils/token-fetcher';

// Load environment variables from .env file
config();

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