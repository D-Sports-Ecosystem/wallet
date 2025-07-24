// Node.js test script for crypto adapter
const { createCryptoAdapter } = require('../src/utils/crypto-adapter');

async function runTests() {
  console.log('Starting crypto adapter tests in Node.js...');
  
  try {
    // Create a crypto adapter for nextjs platform (which can run in Node.js)
    const adapter = await createCryptoAdapter('nextjs');
    console.log('✅ Created crypto adapter');
    
    // Test generateRandomBytes
    try {
      const randomBytes = adapter.generateRandomBytes(32);
      console.log(`✅ Generated random bytes: ${randomBytes.length} bytes`);
      
      // Check if bytes are actually random (basic check)
      const allZero = Array.from(randomBytes).every(byte => byte === 0);
      const allSame = Array.from(randomBytes).every(byte => byte === randomBytes[0]);
      
      if (allZero) {
        console.log('❌ Random bytes are all zero!');
      } else if (allSame) {
        console.log('❌ Random bytes are all the same value!');
      } else {
        console.log('✅ Random bytes appear to be random');
      }
    } catch (error) {
      console.log(`❌ Error generating random bytes: ${error.message}`);
    }
    
    // Test SHA-256
    try {
      const testData = new Uint8Array([1, 2, 3, 4, 5]);
      const hash = await adapter.sha256(testData);
      console.log(`✅ Generated SHA-256 hash: ${hash.length} bytes`);
      
      // Convert hash to hex string for display
      const hashHex = Array.from(hash)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      console.log(`Hash: ${hashHex}`);
      
      // Verify hash is correct length
      if (hash.length !== 32) {
        console.log(`❌ Hash length is ${hash.length}, expected 32`);
      }
    } catch (error) {
      console.log(`❌ Error generating SHA-256 hash: ${error.message}`);
    }
    
    console.log('All tests completed!');
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  }
}

// Run tests
runTests();