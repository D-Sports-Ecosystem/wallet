#!/usr/bin/env node

/**
 * Enhanced Browser Bundle Validation Script
 * 
 * This script validates that the browser bundle does not contain any Node.js modules
 * and performs additional checks for browser compatibility.
 * 
 * Usage:
 *   node scripts/validate-browser-bundle.js [--fix] [--verbose]
 * 
 * Options:
 *   --fix       Attempt to fix simple issues automatically
 *   --verbose   Show detailed output including all matches
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const shouldFix = args.includes('--fix');
const verbose = args.includes('--verbose');

// Node.js modules to check for
const nodeModules = [
  'fs', 'path', 'crypto', 'os', 'stream', 'http', 'https', 'zlib',
  'util', 'url', 'net', 'tls', 'buffer', 'querystring', 'assert',
  'events', 'string_decoder', 'punycode', 'process', 'child_process'
];

// React Native specific modules that shouldn't be in browser bundles
const reactNativeModules = [
  '@react-native-async-storage/async-storage',
  'react-native-keychain',
  'react-native-url-polyfill',
  'react-native',
  'react-native-reanimated'
];

// Files to validate
const filesToValidate = [
  path.join(__dirname, '..', 'dist', 'browser', 'index.js'),
  path.join(__dirname, '..', 'dist', 'browser', 'index.esm.js')
];

// Patterns to check for
const createPatterns = (modules) => {
  return [
    // Direct require statements
    ...modules.map(mod => new RegExp(`require\\(['"](${mod}|node:${mod})['"]\\)`, 'g')),
    // Import statements
    ...modules.map(mod => new RegExp(`import .* from ['"](${mod}|node:${mod})['"]`, 'g')),
    // Dynamic imports
    ...modules.map(mod => new RegExp(`import\\(['"](${mod}|node:${mod})['"]\\)`, 'g')),
  ];
};

// Additional browser compatibility checks
const browserCompatibilityChecks = [
  {
    name: 'Node.js process references',
    pattern: /(?<!\w)process\.(?!env\.NODE_ENV|env\.PLATFORM)/g,
    severity: 'error',
    message: 'Direct process object access may not be available in browsers'
  },
  {
    name: 'Node.js Buffer references',
    pattern: /(?<!\w)Buffer\./g,
    severity: 'error',
    message: 'Buffer is not available in browsers'
  },
  {
    name: 'Node.js __dirname/__filename',
    pattern: /(?<!\w)(__dirname|__filename)(?!\w)/g,
    severity: 'error',
    message: '__dirname and __filename are not available in browsers'
  },
  {
    name: 'window/document check',
    pattern: /typeof\s+(window|document)\s+===\s+['"]undefined['"]/g,
    severity: 'info',
    message: 'Browser environment detection found (this is good)'
  }
];

// Validate each file
async function validateFiles() {
  console.log('Validating browser bundle files for Node.js module references...\n');
  
  let isValid = true;
  let errorCount = 0;
  let warningCount = 0;
  
  for (const file of filesToValidate) {
    try {
      if (!fs.existsSync(file)) {
        console.log(`File not found: ${file} - skipping`);
        continue;
      }
      
      let content = fs.readFileSync(file, 'utf8');
      const fileSize = (content.length / 1024).toFixed(2);
      console.log(`Validating ${path.relative(path.join(__dirname, '..'), file)} (${fileSize} KB):`);
      
      let fileHasNodeModules = false;
      let fileModified = false;
      
      // Check for Node.js modules
      const nodePatterns = createPatterns(nodeModules);
      for (let i = 0; i < nodePatterns.length; i++) {
        const pattern = nodePatterns[i];
        const matches = content.match(pattern);
        
        if (matches && matches.length > 0) {
          console.log(`  ❌ Found ${matches.length} references to ${pattern.toString()}`);
          
          if (verbose) {
            matches.forEach((match, index) => {
              if (index < 5) { // Limit to 5 examples unless verbose
                console.log(`    - ${match}`);
              }
            });
            if (matches.length > 5 && !verbose) {
              console.log(`    ... and ${matches.length - 5} more`);
            }
          }
          
          fileHasNodeModules = true;
          isValid = false;
          errorCount += matches.length;
          
          // Try to fix if requested
          if (shouldFix) {
            // Replace Node.js module imports with empty objects or appropriate shims
            const fixedContent = content.replace(pattern, (match) => {
              if (match.includes('require')) {
                return '{}';
              } else if (match.includes('import')) {
                return '// Removed by validate-browser-bundle: ' + match;
              }
              return match;
            });
            
            if (fixedContent !== content) {
              content = fixedContent;
              fileModified = true;
              console.log(`    ⚠️ Attempted to fix Node.js module references`);
            }
          }
        }
      }
      
      // Check for React Native modules
      const rnPatterns = createPatterns(reactNativeModules);
      for (let i = 0; i < rnPatterns.length; i++) {
        const pattern = rnPatterns[i];
        const matches = content.match(pattern);
        
        if (matches && matches.length > 0) {
          console.log(`  ⚠️ Found ${matches.length} references to React Native module: ${pattern.toString()}`);
          
          if (verbose) {
            matches.forEach((match, index) => {
              if (index < 3) {
                console.log(`    - ${match}`);
              }
            });
          }
          
          warningCount += matches.length;
        }
      }
      
      // Additional browser compatibility checks
      for (const check of browserCompatibilityChecks) {
        const matches = content.match(check.pattern);
        
        if (matches && matches.length > 0) {
          const icon = check.severity === 'error' ? '❌' : (check.severity === 'warning' ? '⚠️' : 'ℹ️');
          console.log(`  ${icon} ${check.name}: Found ${matches.length} instances`);
          console.log(`    ${check.message}`);
          
          if (verbose) {
            matches.forEach((match, index) => {
              if (index < 3) {
                console.log(`    - ${match}`);
              }
            });
          }
          
          if (check.severity === 'error') {
            isValid = false;
            errorCount += matches.length;
          } else if (check.severity === 'warning') {
            warningCount += matches.length;
          }
        }
      }
      
      // Save fixed content if needed
      if (shouldFix && fileModified) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`  ✏️ Fixed issues and saved changes to ${path.basename(file)}`);
      }
      
      if (!fileHasNodeModules && errorCount === 0) {
        console.log('  ✅ No Node.js module references found');
      }
      
      console.log('');
    } catch (error) {
      console.error(`Error validating ${file}:`, error);
      isValid = false;
    }
  }
  
  if (isValid) {
    console.log('✅ All browser bundle files are valid! No Node.js module references found.');
    if (warningCount > 0) {
      console.log(`⚠️ Found ${warningCount} warnings that should be reviewed.`);
    }
    return 0; // Success exit code
  } else {
    console.log(`❌ Validation failed! Found ${errorCount} Node.js module references in browser bundles.`);
    console.log('   This will cause errors when running in browser environments.');
    console.log('   Please check the platform adapter implementations and build configuration.');
    if (shouldFix) {
      console.log('   Some issues were automatically fixed, but manual review is still needed.');
    } else {
      console.log('   Run with --fix to attempt automatic fixes for simple issues.');
    }
    return 1; // Error exit code
  }
}

// Run the validation
validateFiles().then(exitCode => {
  process.exit(exitCode);
}).catch(error => {
  console.error('Validation failed with error:', error);
  process.exit(1);
});