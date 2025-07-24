// Test browser compatibility of storage adapters
// This file can be run in a browser environment to verify the storage adapters work correctly

// Mock browser environment
if (typeof window === 'undefined') {
  global.window = {
    localStorage: {
      getItem: (key) => null,
      setItem: (key, value) => {},
      removeItem: (key) => {}
    }
  };
}

// Import the storage adapter factory
import('../src/utils/storage-adapter.js').then(async (module) => {
  const { createStorageAdapter, MemoryStorageAdapter } = module;
  
  console.log('Testing storage adapters...');
  
  // Test memory adapter
  const memoryAdapter = new MemoryStorageAdapter();
  await memoryAdapter.setItem('memory-test', 'memory-value');
  const memoryValue = await memoryAdapter.getItem('memory-test');
  console.log('Memory adapter test:', memoryValue === 'memory-value' ? 'PASSED' : 'FAILED');
  
  // Test localStorage adapter
  const webAdapter = await createStorageAdapter('web');
  await webAdapter.setItem('web-test', 'web-value');
  const webValue = await webAdapter.getItem('web-test');
  console.log('Web adapter test:', webValue === 'web-value' ? 'PASSED' : 'FAILED');
  
  // Test platform detection
  const features = await module.detectStorageFeatures();
  console.log('Storage features detected:', features);
  
  console.log('All tests completed');
}).catch(error => {
  console.error('Test failed:', error);
});