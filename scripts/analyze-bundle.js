#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * 
 * This script analyzes the bundle output to verify that Node.js modules
 * are properly excluded from browser builds.
 * 
 * Usage:
 *   node scripts/analyze-bundle.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Node.js modules to check for
const nodeModules = [
  'fs', 'path', 'crypto', 'os', 'stream', 'http', 'https', 'zlib',
  'util', 'url', 'net', 'tls', 'buffer', 'querystring', 'assert',
  'events', 'string_decoder', 'punycode', 'process', 'child_process'
];

// Files to analyze
const filesToAnalyze = [
  path.join(__dirname, '..', 'dist', 'index.js'),
  path.join(__dirname, '..', 'dist', 'index.esm.js'),
  path.join(__dirname, '..', 'dist', 'nextjs', 'index.js'),
  path.join(__dirname, '..', 'dist', 'nextjs', 'index.esm.js'),
  path.join(__dirname, '..', 'dist', 'react-native', 'index.js'),
  path.join(__dirname, '..', 'dist', 'react-native', 'index.esm.js')
];

// Patterns to check for
const patterns = [
  // Direct require statements
  ...nodeModules.map(mod => new RegExp(`require\\(['"](${mod}|node:${mod})['"]\\)`, 'g')),
  // Import statements
  ...nodeModules.map(mod => new RegExp(`import .* from ['"](${mod}|node:${mod})['"]`, 'g')),
  // Dynamic imports
  ...nodeModules.map(mod => new RegExp(`import\\(['"](${mod}|node:${mod})['"]\\)`, 'g')),
];

// Analyze each file
async function analyzeFiles() {
  console.log('Analyzing bundle files for Node.js module references...\n');
  
  let allClear = true;
  
  for (const file of filesToAnalyze) {
    try {
      if (!fs.existsSync(file)) {
        console.log(`File not found: ${file} - skipping`);
        continue;
      }
      
      const content = fs.readFileSync(file, 'utf8');
      const fileSize = (content.length / 1024).toFixed(2);
      console.log(`Analyzing ${path.relative(path.join(__dirname, '..'), file)} (${fileSize} KB):`);
      
      let fileHasNodeModules = false;
      
      for (let i = 0; i < patterns.length; i++) {
        const pattern = patterns[i];
        const matches = content.match(pattern);
        
        if (matches && matches.length > 0) {
          console.log(`  ❌ Found ${matches.length} references to ${pattern.toString()}`);
          fileHasNodeModules = true;
          allClear = false;
        }
      }
      
      if (!fileHasNodeModules) {
        console.log('  ✅ No Node.js module references found');
      }
      
      console.log('');
    } catch (error) {
      console.error(`Error analyzing ${file}:`, error);
      allClear = false;
    }
  }
  
  if (allClear) {
    console.log('✅ All bundle files are clear of Node.js module references!');
  } else {
    console.log('❌ Some bundle files contain Node.js module references. Check the output above.');
  }
}

// Run the analysis
analyzeFiles().catch(error => {
  console.error('Analysis failed:', error);
  process.exit(1);
});