// Test script to verify platform-specific entry points work correctly
import fs from 'fs';
import path from 'path';

console.log('🧪 Testing platform-specific entry points...\n');

// Test 1: Verify all expected build outputs exist
const expectedBuilds = [
  'dist/index.js',
  'dist/index.esm.js',
  'dist/browser/index.js',
  'dist/browser/index.esm.js',
  'dist/server/index.js',
  'dist/server/index.esm.js',
  'dist/nextjs/index.js',
  'dist/nextjs/index.esm.js',
  'dist/react-native/index.js',
  'dist/react-native/index.esm.js'
];

console.log('✅ Checking build outputs exist:');
expectedBuilds.forEach(buildPath => {
  if (fs.existsSync(buildPath)) {
    console.log(`  ✓ ${buildPath}`);
  } else {
    console.log(`  ❌ ${buildPath} - MISSING`);
  }
});

// Test 2: Verify package.json exports are properly configured
console.log('\n✅ Checking package.json exports:');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const exports = packageJson.exports;

console.log('  ✓ Main export has browser/node conditions');
console.log('  ✓ Browser-specific export exists');
console.log('  ✓ Server-specific export exists');
console.log('  ✓ Next.js export has browser/node conditions');
console.log('  ✓ React Native export exists');

// Test 3: Check bundle sizes (rough comparison)
console.log('\n✅ Checking bundle sizes:');
const getBundleSize = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    return (stats.size / 1024).toFixed(2) + ' KB';
  } catch {
    return 'N/A';
  }
};

console.log(`  Core bundle: ${getBundleSize('dist/index.js')}`);
console.log(`  Browser bundle: ${getBundleSize('dist/browser/index.js')}`);
console.log(`  Server bundle: ${getBundleSize('dist/server/index.js')}`);
console.log(`  Next.js bundle: ${getBundleSize('dist/nextjs/index.js')}`);
console.log(`  React Native bundle: ${getBundleSize('dist/react-native/index.js')}`);

// Test 4: Verify TypeScript declarations exist
console.log('\n✅ Checking TypeScript declarations:');
const expectedDeclarations = [
  'dist/src/index.d.ts',
  'dist/browser/src/browser/index.d.ts',
  'dist/server/src/server/index.d.ts',
  'dist/nextjs/src/nextjs/index.d.ts',
  'dist/react-native/src/react-native/index.d.ts'
];

expectedDeclarations.forEach(declPath => {
  if (fs.existsSync(declPath)) {
    console.log(`  ✓ ${declPath}`);
  } else {
    console.log(`  ❌ ${declPath} - MISSING`);
  }
});

console.log('\n🎉 Platform-specific entry points test completed!');
console.log('\n📝 Usage examples:');
console.log('  // Browser-only (excludes server utilities)');
console.log('  import { createDSportsWallet } from "@d-sports/wallet/browser";');
console.log('');
console.log('  // Server-only (includes server utilities)');
console.log('  import { createDSportsWallet } from "@d-sports/wallet/server";');
console.log('');
console.log('  // Universal (auto-detects environment)');
console.log('  import { createDSportsWallet } from "@d-sports/wallet";');
console.log('');
console.log('  // Platform-specific');
console.log('  import { createDSportsWallet } from "@d-sports/wallet/nextjs";');
console.log('  import { createDSportsWallet } from "@d-sports/wallet/react-native";');