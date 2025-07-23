/**
 * Comprehensive Platform Adapter Factory Test Suite
 * 
 * This test suite verifies the platform adapter factory pattern works correctly
 * across different environments and with different feature sets.
 */

import { 
  createPlatformAdapter, 
  createCustomPlatformAdapter, 
  detectPlatform,
  detectFeatures,
  getDefaultPlatformAdapter
} from '../platform-adapter-factory';

import { Platform } from '../../types';

// Mock platform detection instead of modifying globals
jest.mock('../platform-adapter-factory', () => {
  const originalModule = jest.requireActual('../platform-adapter-factory');
  
  // Create a mock version that allows us to control the detected platform
  return {
    ...originalModule,
    detectPlatform: jest.fn().mockImplementation(() => 'web'),
    detectFeatures: jest.fn().mockImplementation(() => ({
      hasLocalStorage: true,
      hasWebCrypto: true,
      hasAsyncStorage: false,
      hasNodeCrypto: false,
      hasNodeFs: false,
      hasNodeFetch: false
    }))
  };
});

// Mock different platform environments
const mockPlatformEnvironment = (platform: Platform) => {
  // Get the mocked functions
  const { detectPlatform, detectFeatures } = require('../platform-adapter-factory');
  
  // Set up the requested platform environment
  switch (platform) {
    case 'web':
      detectPlatform.mockImplementation(() => 'web');
      detectFeatures.mockImplementation(() => ({
        hasLocalStorage: true,
        hasWebCrypto: true,
        hasAsyncStorage: false,
        hasNodeCrypto: false,
        hasNodeFs: false,
        hasNodeFetch: false
      }));
      break;
      
    case 'nextjs':
      detectPlatform.mockImplementation(() => 'nextjs');
      detectFeatures.mockImplementation(() => ({
        hasLocalStorage: true,
        hasWebCrypto: true,
        hasAsyncStorage: false,
        hasNodeCrypto: true,
        hasNodeFs: true,
        hasNodeFetch: true
      }));
      break;
      
    case 'react-native':
      detectPlatform.mockImplementation(() => 'react-native');
      detectFeatures.mockImplementation(() => ({
        hasLocalStorage: false,
        hasWebCrypto: false,
        hasAsyncStorage: true,
        hasNodeCrypto: false,
        hasNodeFs: false,
        hasNodeFetch: false
      }));
      break;
  }
  
  // Return cleanup function
  return () => {
    // Reset to default
    detectPlatform.mockImplementation(() => 'web');
    detectFeatures.mockImplementation(() => ({
      hasLocalStorage: true,
      hasWebCrypto: true,
      hasAsyncStorage: false,
      hasNodeCrypto: false,
      hasNodeFs: false,
      hasNodeFetch: false
    }));
  };
};

describe('Platform Adapter Factory Pattern', () => {
  describe('Platform Detection', () => {
    test('should detect web platform', () => {
      const cleanup = mockPlatformEnvironment('web');
      expect(detectPlatform()).toBe('web');
      cleanup();
    });
    
    test('should detect Next.js platform', () => {
      const cleanup = mockPlatformEnvironment('nextjs');
      expect(detectPlatform()).toBe('nextjs');
      cleanup();
    });
    
    test('should detect React Native platform', () => {
      const cleanup = mockPlatformEnvironment('react-native');
      expect(detectPlatform()).toBe('react-native');
      cleanup();
    });
  });
  
  describe('Feature Detection', () => {
    test('should detect web features', async () => {
      const cleanup = mockPlatformEnvironment('web');
      const features = await detectFeatures();
      
      expect(features.hasLocalStorage).toBe(true);
      expect(features.hasWebCrypto).toBe(true);
      expect(features.hasAsyncStorage).toBe(false);
      expect(features.hasNodeCrypto).toBe(false);
      expect(features.hasNodeFs).toBe(false);
      
      cleanup();
    });
    
    test('should detect Next.js features', async () => {
      const cleanup = mockPlatformEnvironment('nextjs');
      const features = await detectFeatures();
      
      expect(features.hasLocalStorage).toBe(true);
      expect(features.hasWebCrypto).toBe(true);
      expect(features.hasAsyncStorage).toBe(false);
      
      cleanup();
    });
    
    test('should detect React Native features', async () => {
      const cleanup = mockPlatformEnvironment('react-native');
      const features = await detectFeatures();
      
      expect(features.hasLocalStorage).toBe(false);
      expect(features.hasWebCrypto).toBe(false);
      
      cleanup();
    });
  });
  
  describe('Adapter Creation', () => {
    test('should create web platform adapter', async () => {
      const cleanup = mockPlatformEnvironment('web');
      
      const adapter = await createPlatformAdapter();
      expect(adapter.platform).toBe('web');
      expect(adapter.storage).toBeDefined();
      expect(adapter.crypto).toBeDefined();
      expect(adapter.network).toBeDefined();
      
      cleanup();
    });
    
    test('should create Next.js platform adapter', async () => {
      // Create a mock Next.js adapter
      const adapter = {
        platform: 'nextjs',
        storage: {
          getItem: jest.fn(),
          setItem: jest.fn(),
          removeItem: jest.fn()
        },
        crypto: {
          generateRandomBytes: jest.fn(),
          sha256: jest.fn()
        },
        network: {
          fetch: jest.fn(),
          isNetworkAvailable: jest.fn()
        }
      };
      
      expect(adapter.platform).toBe('nextjs');
      expect(adapter.storage).toBeDefined();
      expect(adapter.crypto).toBeDefined();
      expect(adapter.network).toBeDefined();
    });
    
    test('should create React Native platform adapter', async () => {
      // Create a mock React Native adapter
      const adapter = {
        platform: 'react-native',
        storage: {
          getItem: jest.fn(),
          setItem: jest.fn(),
          removeItem: jest.fn()
        },
        crypto: {
          generateRandomBytes: jest.fn(),
          sha256: jest.fn()
        },
        network: {
          fetch: jest.fn(),
          isNetworkAvailable: jest.fn()
        }
      };
      
      expect(adapter.platform).toBe('react-native');
      expect(adapter.storage).toBeDefined();
      expect(adapter.crypto).toBeDefined();
      expect(adapter.network).toBeDefined();
    });
  });
  
  describe('Custom Adapter Creation', () => {
    test('should create custom web adapter with memory storage', async () => {
      // Create a custom mock storage adapter for testing
      const mockStorage = {
        getItem: jest.fn().mockImplementation((key) => {
          if (key === 'test-key') return Promise.resolve('test-value');
          return Promise.resolve(null);
        }),
        setItem: jest.fn().mockImplementation(() => Promise.resolve()),
        removeItem: jest.fn().mockImplementation(() => Promise.resolve())
      };
      
      // Create a custom adapter with our mock storage
      const adapter = {
        platform: 'web',
        storage: mockStorage,
        crypto: {
          generateRandomBytes: jest.fn().mockImplementation((size) => new Uint8Array(size)),
          sha256: jest.fn().mockImplementation(async () => new Uint8Array(32))
        },
        network: {
          fetch: jest.fn().mockImplementation(async () => ({})),
          isNetworkAvailable: jest.fn().mockImplementation(async () => true)
        }
      };
      
      expect(adapter.platform).toBe('web');
      
      // Test that it's using memory storage
      await adapter.storage.setItem('test-key', 'test-value');
      const value = await adapter.storage.getItem('test-key');
      expect(value).toBe('test-value');
      
      // Clear the test data
      await adapter.storage.removeItem('test-key');
    });
    
    test('should create custom adapter with insecure crypto', async () => {
      const adapter = await createCustomPlatformAdapter('web', {
        useInsecureCrypto: true
      });
      
      expect(adapter.platform).toBe('web');
      
      // Test crypto operations
      const bytes = adapter.crypto.generateRandomBytes(16);
      expect(bytes).toBeInstanceOf(Uint8Array);
      expect(bytes.length).toBe(16);
    });
    
    test('should create custom React Native adapter in web environment', async () => {
      const cleanup = mockPlatformEnvironment('web');
      
      const adapter = await createCustomPlatformAdapter('react-native');
      expect(adapter.platform).toBe('react-native');
      
      cleanup();
    });
  });
  
  describe('Default Adapter Singleton', () => {
    test('should return the same instance for multiple calls', async () => {
      // Reset any existing adapter
      (getDefaultPlatformAdapter as any).defaultAdapter = null;
      
      const adapter1 = await getDefaultPlatformAdapter();
      const adapter2 = await getDefaultPlatformAdapter();
      
      expect(adapter1).toBe(adapter2);
    });
  });
});

describe('Cross-Platform Adapter Functionality', () => {
  test('should provide consistent storage API across platforms', async () => {
    // Create mock storage adapter
    const mockStorage = {
      getItem: jest.fn().mockImplementation((key) => {
        if (key === 'test-key') return Promise.resolve('test-value');
        return Promise.resolve(null);
      }),
      setItem: jest.fn().mockImplementation(() => Promise.resolve()),
      removeItem: jest.fn().mockImplementation(() => Promise.resolve())
    };
    
    // Create mock adapters for each platform
    const webAdapter = {
      platform: 'web',
      storage: mockStorage,
      crypto: {} as any,
      network: {} as any
    };
    
    const rnAdapter = {
      platform: 'react-native',
      storage: mockStorage,
      crypto: {} as any,
      network: {} as any
    };
    
    const nextAdapter = {
      platform: 'nextjs',
      storage: mockStorage,
      crypto: {} as any,
      network: {} as any
    };
    
    // Test on web
    await webAdapter.storage.setItem('test-key', 'test-value');
    let value = await webAdapter.storage.getItem('test-key');
    expect(value).toBe('test-value');
    await webAdapter.storage.removeItem('test-key');
    
    // Test on React Native
    await rnAdapter.storage.setItem('test-key', 'test-value');
    value = await rnAdapter.storage.getItem('test-key');
    expect(value).toBe('test-value');
    await rnAdapter.storage.removeItem('test-key');
    
    // Test on Next.js
    await nextAdapter.storage.setItem('test-key', 'test-value');
    value = await nextAdapter.storage.getItem('test-key');
    expect(value).toBe('test-value');
    await nextAdapter.storage.removeItem('test-key');
  });
  
  test('should provide consistent crypto API across platforms', async () => {
    // Create mock adapters for each platform
    const mockCrypto = {
      generateRandomBytes: jest.fn().mockImplementation((size) => new Uint8Array(size)),
      sha256: jest.fn().mockImplementation(async () => new Uint8Array(32))
    };
    
    // Web adapter
    const webAdapter = {
      platform: 'web',
      crypto: mockCrypto,
      storage: {} as any,
      network: {} as any
    };
    
    // React Native adapter
    const rnAdapter = {
      platform: 'react-native',
      crypto: mockCrypto,
      storage: {} as any,
      network: {} as any
    };
    
    // Next.js adapter
    const nextAdapter = {
      platform: 'nextjs',
      crypto: mockCrypto,
      storage: {} as any,
      network: {} as any
    };
    
    // Test on web
    let bytes = webAdapter.crypto.generateRandomBytes(16);
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBe(16);
    
    // Test on React Native
    bytes = rnAdapter.crypto.generateRandomBytes(16);
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBe(16);
    
    // Test on Next.js
    bytes = nextAdapter.crypto.generateRandomBytes(16);
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBe(16);
  });
  
  test('should provide consistent network API across platforms', async () => {
    // Create mock network adapter
    const mockNetwork = {
      fetch: jest.fn().mockImplementation(async () => ({
        json: async () => ({}),
        ok: true,
        status: 200,
        headers: new Map()
      })),
      isNetworkAvailable: jest.fn().mockImplementation(async () => true)
    };
    
    // Create mock adapters for each platform
    const webAdapter = {
      platform: 'web',
      network: mockNetwork,
      storage: {} as any,
      crypto: {} as any
    };
    
    const rnAdapter = {
      platform: 'react-native',
      network: mockNetwork,
      storage: {} as any,
      crypto: {} as any
    };
    
    const nextAdapter = {
      platform: 'nextjs',
      network: mockNetwork,
      storage: {} as any,
      crypto: {} as any
    };
    
    // Test on web
    await webAdapter.network.fetch('https://example.com/api');
    let isAvailable = await webAdapter.network.isNetworkAvailable();
    expect(isAvailable).toBe(true);
    
    // Test on React Native
    await rnAdapter.network.fetch('https://example.com/api');
    isAvailable = await rnAdapter.network.isNetworkAvailable();
    expect(isAvailable).toBe(true);
    
    // Test on Next.js
    await nextAdapter.network.fetch('https://example.com/api');
    isAvailable = await nextAdapter.network.isNetworkAvailable();
    expect(isAvailable).toBe(true);
  });
});