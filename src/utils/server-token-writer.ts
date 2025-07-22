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
        // Use a variable to prevent direct static analysis
        const fsModuleName = 'f' + 's';
        fs = await import(/* webpackIgnore: true */ fsModuleName).catch((importError: unknown) => {
          const errorMessage = importError instanceof Error ? importError.message : String(importError);
          console.error('Failed to import fs module:', errorMessage);
          throw new Error('fs module not available');
        });
      } else {
        throw new Error('fs module not available in browser environment');
      }
    } catch (catchError: unknown) {
      const errorMessage = catchError instanceof Error ? catchError.message : String(catchError);
      throw new Error('Failed to import fs module: ' + errorMessage);
    }
    
    try {
      // Only import path in a Node.js environment
      if (typeof process !== 'undefined' && process.versions && process.versions.node) {
        // Use a variable to prevent direct static analysis
        const pathModuleName = 'p' + 'ath';
        path = await import(/* webpackIgnore: true */ pathModuleName).catch((importError: unknown) => {
          const errorMessage = importError instanceof Error ? importError.message : String(importError);
          console.error('Failed to import path module:', errorMessage);
          throw new Error('path module not available');
        });
      } else {
        throw new Error('path module not available in browser environment');
      }
    } catch (catchError: unknown) {
      const errorMessage = catchError instanceof Error ? catchError.message : String(catchError);
      throw new Error('Failed to import path module: ' + errorMessage);
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
    } catch (dirError: unknown) {
      const errorMessage = dirError instanceof Error ? dirError.message : String(dirError);
      console.error('Failed to create directory:', errorMessage);
      throw new Error('Failed to create directory: ' + errorMessage);
    }
    
    // Write file
    try {
      fs.writeFileSync(filePath, fileContent);
    } catch (writeError: unknown) {
      const errorMessage = writeError instanceof Error ? writeError.message : String(writeError);
      console.error('Failed to write file:', errorMessage);
      throw new Error('Failed to write file: ' + errorMessage);
    }
    
    console.log(`Token data file updated at ${filePath}`);
  } catch (finalError: unknown) {
    const errorMessage = finalError instanceof Error ? finalError.message : String(finalError);
    console.error('Failed to write token data to file:', errorMessage);
    throw finalError instanceof Error ? finalError : new Error(String(finalError));
  }
}