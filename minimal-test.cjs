// Minimal test to check what's causing Node.js module imports

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
global.fetch = async () => ({
  json: async () => ({}),
  ok: true,
  status: 200,
  headers: new Map()
});

try {
  console.log('Testing minimal import...');
  
  // Try to import just the token fetcher functions
  const { getTokenData } = require('./dist/index.js');
  
  console.log('✅ Successfully imported getTokenData');
  
  // Test the function
  const tokens = getTokenData();
  console.log('✅ getTokenData works, returned:', tokens.length, 'tokens');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('Stack:', error.stack);
}