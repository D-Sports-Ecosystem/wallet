// Browser compatibility test for crypto adapter
// This file can be run in a browser environment to test the crypto adapter

// Import the crypto adapter
import { createCryptoAdapter } from './src/utils/crypto-adapter.js';

async function runTests() {
  const results = document.getElementById('results');
  
  function log(message, isSuccess = true) {
    const div = document.createElement('div');
    div.textContent = message;
    div.style.color = isSuccess ? 'green' : 'red';
    results.appendChild(div);
  }
  
  try {
    log('Starting crypto adapter tests...');
    
    // Create a crypto adapter for web platform
    const adapter = await createCryptoAdapter('web');
    log('✅ Created crypto adapter');
    
    // Test generateRandomBytes
    try {
      const randomBytes = adapter.generateRandomBytes(32);
      log(`✅ Generated random bytes: ${randomBytes.length} bytes`);
      
      // Check if bytes are actually random (basic check)
      const allZero = Array.from(randomBytes).every(byte => byte === 0);
      const allSame = Array.from(randomBytes).every(byte => byte === randomBytes[0]);
      
      if (allZero) {
        log('❌ Random bytes are all zero!', false);
      } else if (allSame) {
        log('❌ Random bytes are all the same value!', false);
      } else {
        log('✅ Random bytes appear to be random');
      }
    } catch (error) {
      log(`❌ Error generating random bytes: ${error.message}`, false);
    }
    
    // Test SHA-256
    try {
      const testData = new Uint8Array([1, 2, 3, 4, 5]);
      const hash = await adapter.sha256(testData);
      log(`✅ Generated SHA-256 hash: ${hash.length} bytes`);
      
      // Convert hash to hex string for display
      const hashHex = Array.from(hash)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      log(`Hash: ${hashHex}`);
      
      // Verify hash is correct length
      if (hash.length !== 32) {
        log(`❌ Hash length is ${hash.length}, expected 32`, false);
      }
    } catch (error) {
      log(`❌ Error generating SHA-256 hash: ${error.message}`, false);
    }
    
    // Test feature detection
    try {
      const features = window.cryptoFeatures = {
        hasWebCrypto: typeof window !== 'undefined' && 
                      window.crypto !== undefined && 
                      window.crypto.subtle !== undefined
      };
      
      log(`✅ Feature detection: Web Crypto API ${features.hasWebCrypto ? 'available' : 'not available'}`);
    } catch (error) {
      log(`❌ Error detecting features: ${error.message}`, false);
    }
    
    log('All tests completed!');
  } catch (error) {
    log(`❌ Test failed: ${error.message}`, false);
  }
}

// Run tests when DOM is loaded
document.addEventListener('DOMContentLoaded', runTests);