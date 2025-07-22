/**
 * Server-only token data file writer
 * This file should only be imported in Node.js environments
 */

import { TokenInfo } from '../services/token-service';

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

/**
 * Write token data to file system (Node.js only)
 */
export async function writeTokenDataToFile(availableTokens: TokenInfo[]): Promise<void> {
  // This function should only be called in Node.js environments
  if (typeof process === 'undefined' || !process.versions?.node) {
    throw new Error('writeTokenDataToFile can only be called in Node.js environments');
  }

  try {
    const fs = await import('fs');
    const path = await import('path');
    
    // Generate the content for the token-data.ts file
    const fileContent = generateTokenDataFileContent(availableTokens);
    
    // Write the content to the token-data.ts file
    const filePath = path.resolve(process.cwd(), 'data', 'token-data.ts');
    fs.writeFileSync(filePath, fileContent);
    
    console.log(`Token data file updated at ${filePath}`);
  } catch (error) {
    console.error('Failed to write token data to file:', error);
    throw error;
  }
}