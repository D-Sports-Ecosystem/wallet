import { tokenService, TokenInfo } from '../services/token-service';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Fetch token data from CoinMarketCap API and update the token-data.ts file
 */
export async function updateTokenData(): Promise<void> {
  try {
    // Define the tokens we want to fetch
    const symbols = ['BTC', 'ETH', 'MATIC', 'USDC', 'BNB'];
    
    // Fetch token data from CoinMarketCap API
    const tokens = await tokenService.fetchTokenData(symbols);
    
    // Create multiple network versions for some tokens (like ETH on different networks)
    const availableTokens = createMultiNetworkTokens(tokens);
    
    // Generate the content for the token-data.ts file
    const fileContent = generateTokenDataFileContent(availableTokens);
    
    // Write the content to the token-data.ts file
    const filePath = path.resolve(process.cwd(), 'data', 'token-data.ts');
    fs.writeFileSync(filePath, fileContent);
    
    console.log(`Token data updated successfully at ${filePath}`);
  } catch (error) {
    console.error('Failed to update token data:', error);
  }
}

/**
 * Create multiple network versions for some tokens (like ETH on different networks)
 */
function createMultiNetworkTokens(tokens: TokenInfo[]): TokenInfo[] {
  const result: TokenInfo[] = [];
  
  tokens.forEach(token => {
    // Add the original token
    result.push(token);
    
    // Create network variants for ETH
    if (token.symbol === 'ETH') {
      // ETH on Arbitrum
      result.push({
        ...token,
        network: 'Arbitrum',
        bgColor: 'bg-blue-600',
        balance: (parseFloat(token.balance) / 2).toFixed(4),
        transactions: [
          {
            type: 'receive',
            amount: '+0.1 ETH',
            value: '+$250.00',
            time: '2 hours ago',
            from: '0x7777...8888',
          },
        ],
      });
      
      // ETH on Polygon
      result.push({
        ...token,
        network: 'Polygon',
        bgColor: 'bg-purple-600',
        balance: (parseFloat(token.balance) * 1.5).toFixed(4),
        transactions: [
          {
            type: 'send',
            amount: '-0.3 ETH',
            value: '-$750.00',
            time: '4 hours ago',
            to: '0x9999...0000',
          },
        ],
      });
    }
    
    // Create network variants for USDC
    if (token.symbol === 'USDC') {
      // USDC on Polygon
      result.push({
        ...token,
        network: 'Polygon',
        bgColor: 'bg-purple-600',
        balance: (parseFloat(token.balance) * 0.6).toFixed(2),
        transactions: [
          {
            type: 'send',
            amount: '-200 USDC',
            value: '-$200.00',
            time: '4 hours ago',
            to: '0xcccc...dddd',
          },
        ],
      });
    }
  });
  
  return result;
}

/**
 * Generate the content for the token-data.ts file
 */
function generateTokenDataFileContent(tokens: TokenInfo[]): string {
  // Convert tokens to a formatted string representation
  const tokensString = JSON.stringify(tokens, null, 2)
    .replace(/"([^"]+)":/g, '$1:') // Remove quotes from property names
    .replace(/"/g, "'"); // Replace double quotes with single quotes
  
  return `export const availableTokens = ${tokensString}

// Original tokens for main page (keeping existing functionality)
export const tokens = availableTokens.slice(0, 4)
`;
}

// Execute the function if this file is run directly
if (require.main === module) {
  updateTokenData().catch(console.error);
}