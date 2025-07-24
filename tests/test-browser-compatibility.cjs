// Simple test to check if the built package can be loaded in a browser-like environment

// Mock browser environment
global.window = {
  localStorage: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
  },
  crypto: {
    getRandomValues: (arr) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
    },
    subtle: {
      digest: async () => new ArrayBuffer(32)
    }
  }
};

global.document = {};
if (!global.navigator) {
  global.navigator = {};
}

// Mock fetch
global.fetch = async () => ({
  json: async () => ({}),
  ok: true,
  status: 200,
  headers: new Map()
});

try {
  console.log('Testing browser compatibility...');
  
  // Try to require the built package
  const pkg = require('../dist/index.js');
  
  console.log('✅ Package loaded successfully in browser-like environment');
  console.log('Available exports:', Object.keys(pkg));
  
  // Test token fetcher functions
  if (pkg.getTokenData) {
    const tokens = pkg.getTokenData();
    console.log('✅ Token data functions work:', tokens.length, 'tokens available');
  }
  
} catch (error) {
  console.error('❌ Browser compatibility test failed:', error.message);
  
  // Check if it's a Node.js module error
  if (error.message.includes('Cannot find module') && 
      (error.message.includes('fs') || error.message.includes('path') || error.message.includes('crypto'))) {
    console.error('❌ Node.js modules are still being required in browser build');
  }
  
  process.exit(1);
}