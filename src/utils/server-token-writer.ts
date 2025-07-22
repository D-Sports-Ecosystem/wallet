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
 * Check if we're in a Node.js environment
 */
function isNodeEnvironment(): boolean {
  return typeof process !== 'undefined' && 
         process.versions !== undefined && 
         process.versions.node !== undefined;
}

/**
 * Check if we're in a browser environment
 */
function isBrowserEnvironment(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Write token data to file system (Node.js only)
 */
export async function writeTokenDataToFile(availableTokens: TokenInfo[]): Promise<void> {
  // This function should only be called in Node.js environments
  if (!isNodeEnvironment() || isBrowserEnvironment()) {
    console.warn('writeTokenDataToFile can only be called in Node.js environments');
    return Promise.resolve(); // Return early in browser environments
  }

  try {
    // Use dynamic imports with try/catch for better error handling
    let fs;
    let path;
    
    try {
      // Only import fs in a Node.js environment
      if (typeof process !== 'undefined' && process.versions && process.versions.node) {
        fs = await import(/* webpackIgnore: true */ 'fs').catch(error => {
          console.error('Failed to import fs module:', error);
          throw new Error('fs module not available');
        });
      } else {
        throw new Error('fs module not available in browser environment');
      }
    } catch (error) {
      throw new Error('Failed to import fs module: ' + (error.message || String(error)));
    }
    
    try {
      // Only import path in a Node.js environment
      if (typeof process !== 'undefined' && process.versions && process.versions.node) {
        path = await import(/* webpackIgnore: true */ 'path').catch(error => {
          console.error('Failed to import path module:', error);
          throw new Error('path module not available');
        });
      } else {
        throw new Error('path module not available in browser environment');
      }
    } catch (error) {
      throw new Error('Failed to import path module: ' + (error.message || String(error)));
    }
    
    // Generate the content for the token-data.ts file
    const fileContent = generateTokenDataFileContent(availableTokens);
    
    // Write the content to the token-data.ts file
    const filePath = path.resolve(process.cwd(), 'data', 'token-data.ts');
    
    // Check if directory exists, create if it doesn't
    const dirPath = path.dirname(filePath);
    
    try {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    } catch (error) {
      console.error('Failed to create directory:', error);
      throw new Error('Failed to create directory: ' + error.message);
    }
    
    // Write file
    try {
      fs.writeFileSync(filePath, fileContent);
    } catch (error) {
      console.error('Failed to write file:', error);
      throw new Error('Failed to write file: ' + error.message);
    }
    
    console.log(`Token data file updated at ${filePath}`);
  } catch (error) {
    console.error('Failed to write token data to file:', error);
    throw error;
  }
}