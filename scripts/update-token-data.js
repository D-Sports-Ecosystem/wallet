#!/usr/bin/env node

/**
 * @file update-token-data.js
 * @description Token Data Update Script that fetches the latest token data from CoinMarketCap API
 * @module scripts/update-token-data
 * @author D-Sports Engineering Team
 * @version 1.0.0
 * 
 * This script fetches the latest token data from CoinMarketCap API
 * and updates the token storage (file system in Node.js, memory in browser).
 * It requires a valid CoinMarketCap API key to be set in the .env file.
 * 
 * @example
 * ```bash
 * # Basic usage
 * node scripts/update-token-data.js
 * ```
 * 
 * @requires dotenv
 * @requires ../dist/utils/token-fetcher.js
 */

require('dotenv').config();

/**
 * Main function that handles the token data update process
 * 
 * This function checks for the required API key, imports the token fetcher utility,
 * and calls the updateTokenData function to fetch and update token data.
 * 
 * @async
 * @function main
 * @returns {Promise<void>} A promise that resolves when the token data is updated
 * @throws {Error} If the API key is missing or the update process fails
 * 
 * @example
 * ```javascript
 * main()
 *   .catch(error => {
 *     console.error('Failed to update token data:', error);
 *     process.exit(1);
 *   });
 * ```
 */
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