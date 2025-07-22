// Simple browser test for network adapter
import { createNetworkAdapter } from './src/utils/network-adapter.js';

async function testNetworkAdapter() {
  console.log('Testing browser network adapter...');
  
  try {
    // Create network adapter for web platform
    const adapter = await createNetworkAdapter('web');
    console.log('Network adapter created successfully');
    
    // Test fetch functionality
    console.log('Testing fetch...');
    const response = await adapter.fetch('https://jsonplaceholder.typicode.com/todos/1');
    const data = await response.json();
    console.log('Fetch successful:', data);
    
    // Test network availability
    console.log('Testing network availability...');
    const isAvailable = await adapter.isNetworkAvailable();
    console.log('Network available:', isAvailable);
    
    console.log('All tests passed!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testNetworkAdapter();