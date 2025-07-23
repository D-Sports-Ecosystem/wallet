#!/usr/bin/env node

/**
 * Enhanced Bundle Analysis Script
 * 
 * This script analyzes the bundle output to verify that Node.js modules
 * are properly excluded from browser builds and monitors bundle sizes.
 * 
 * Usage:
 *   node scripts/analyze-bundle.js [--verbose] [--threshold=SIZE_KB]
 * 
 * Options:
 *   --verbose     Show detailed analysis including all matches
 *   --threshold=N Set size threshold warning in KB (default: 500)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const verbose = args.includes('--verbose');
const thresholdArg = args.find(arg => arg.startsWith('--threshold='));
const sizeThresholdKB = thresholdArg 
  ? parseInt(thresholdArg.split('=')[1], 10) 
  : 500; // Default threshold: 500KB

// Node.js modules to check for
const nodeModules = [
  'fs', 'path', 'crypto', 'os', 'stream', 'http', 'https', 'zlib',
  'util', 'url', 'net', 'tls', 'buffer', 'querystring', 'assert',
  'events', 'string_decoder', 'punycode', 'process', 'child_process'
];

// Platform-specific modules
const reactNativeModules = [
  '@react-native-async-storage/async-storage',
  'react-native-keychain',
  'react-native-url-polyfill',
  'react-native',
  'react-native-reanimated'
];

// Files to analyze by platform
const filesToAnalyze = {
  browser: [
    path.join(__dirname, '..', 'dist', 'browser', 'index.js'),
    path.join(__dirname, '..', 'dist', 'browser', 'index.esm.js')
  ],
  server: [
    path.join(__dirname, '..', 'dist', 'server', 'index.js'),
    path.join(__dirname, '..', 'dist', 'server', 'index.esm.js')
  ],
  nextjs: [
    path.join(__dirname, '..', 'dist', 'nextjs', 'index.js'),
    path.join(__dirname, '..', 'dist', 'nextjs', 'index.esm.js')
  ],
  reactNative: [
    path.join(__dirname, '..', 'dist', 'react-native', 'index.js'),
    path.join(__dirname, '..', 'dist', 'react-native', 'index.esm.js')
  ],
  core: [
    path.join(__dirname, '..', 'dist', 'index.js'),
    path.join(__dirname, '..', 'dist', 'index.esm.js')
  ]
};

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

// Store historical bundle sizes
const HISTORY_FILE = path.join(__dirname, '..', '.kiro', 'settings', 'bundle-size-history.json');

// Load previous bundle sizes if available
function loadBundleSizeHistory() {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const data = fs.readFileSync(HISTORY_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('Could not load bundle size history:', error.message);
  }
  return { lastUpdated: null, sizes: {} };
}

// Save current bundle sizes
function saveBundleSizeHistory(history) {
  try {
    // Ensure directory exists
    const dir = path.dirname(HISTORY_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    history.lastUpdated = new Date().toISOString();
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf8');
  } catch (error) {
    console.error('Could not save bundle size history:', error.message);
  }
}

// Analyze each file
async function analyzeFiles() {
  console.log('Analyzing bundle files for compatibility and size...\n');
  
  let allClear = true;
  const bundleSizes = {};
  const history = loadBundleSizeHistory();
  
  // Analyze each platform's files
  for (const [platform, files] of Object.entries(filesToAnalyze)) {
    console.log(`\n=== ${platform.toUpperCase()} PLATFORM ===`);
    bundleSizes[platform] = {};
    
    // Determine which modules should not be in this platform
    let forbiddenModules = [];
    let patterns = [];
    
    if (platform === 'browser') {
      forbiddenModules = nodeModules;
      patterns = createPatterns(nodeModules);
    } else if (platform === 'reactNative') {
      // React Native shouldn't have browser-specific APIs
      forbiddenModules = ['document', 'window', 'localStorage'];
      patterns = createPatterns(forbiddenModules);
    }
    
    for (const file of files) {
      try {
        if (!fs.existsSync(file)) {
          console.log(`File not found: ${file} - skipping`);
          continue;
        }
        
        const content = fs.readFileSync(file, 'utf8');
        const fileSizeKB = (content.length / 1024).toFixed(2);
        const fileName = path.basename(file);
        
        // Store bundle size
        bundleSizes[platform][fileName] = parseFloat(fileSizeKB);
        
        console.log(`\nAnalyzing ${path.relative(path.join(__dirname, '..'), file)} (${fileSizeKB} KB):`);
        
        // Size warning
        if (parseFloat(fileSizeKB) > sizeThresholdKB) {
          console.log(`  ⚠️ Bundle size exceeds threshold of ${sizeThresholdKB} KB`);
        }
        
        // Compare with previous size if available
        if (history.sizes && 
            history.sizes[platform] && 
            history.sizes[platform][fileName] !== undefined) {
          
          const prevSize = history.sizes[platform][fileName];
          const diff = (parseFloat(fileSizeKB) - prevSize).toFixed(2);
          const percentChange = ((parseFloat(fileSizeKB) - prevSize) / prevSize * 100).toFixed(2);
          
          if (diff > 0) {
            console.log(`  ℹ️ Size increased by ${diff} KB (${percentChange}%) since last analysis`);
          } else if (diff < 0) {
            console.log(`  ✅ Size decreased by ${Math.abs(diff)} KB (${Math.abs(percentChange)}%) since last analysis`);
          } else {
            console.log(`  ℹ️ Size unchanged since last analysis`);
          }
        }
        
        // Skip forbidden module check if not applicable
        if (patterns.length === 0) {
          console.log('  ✅ No forbidden module checks for this platform');
          continue;
        }
        
        let fileHasForbiddenModules = false;
        
        for (let i = 0; i < patterns.length; i++) {
          const pattern = patterns[i];
          const matches = content.match(pattern);
          
          if (matches && matches.length > 0) {
            console.log(`  ❌ Found ${matches.length} references to ${pattern.toString()}`);
            
            if (verbose) {
              matches.forEach((match, index) => {
                if (index < 10) { // Limit to 10 examples in verbose mode
                  console.log(`    - ${match}`);
                }
              });
              if (matches.length > 10) {
                console.log(`    ... and ${matches.length - 10} more`);
              }
            }
            
            fileHasForbiddenModules = true;
            allClear = false;
          }
        }
        
        if (!fileHasForbiddenModules && patterns.length > 0) {
          console.log(`  ✅ No forbidden module references found`);
        }
        
      } catch (error) {
        console.error(`Error analyzing ${file}:`, error);
        allClear = false;
      }
    }
  }
  
  // Save current bundle sizes for future comparison
  saveBundleSizeHistory({ sizes: bundleSizes });
  
  console.log('\n=== SUMMARY ===');
  
  // Print bundle size summary
  console.log('\nBundle Size Summary:');
  for (const [platform, sizes] of Object.entries(bundleSizes)) {
    console.log(`\n${platform.toUpperCase()}:`);
    for (const [file, size] of Object.entries(sizes)) {
      console.log(`  ${file}: ${size} KB`);
    }
  }
  
  if (allClear) {
    console.log('\n✅ All bundle files passed compatibility checks!');
  } else {
    console.log('\n❌ Some bundle files contain forbidden module references. Check the output above.');
  }
  
  return allClear;
}

// Run the analysis
analyzeFiles()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Analysis failed:', error);
    process.exit(1);
  });