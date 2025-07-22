import { 
  createPlatformAdapter, 
  createCustomPlatformAdapter, 
  detectPlatform,
  detectFeatures,
  getDefaultPlatformAdapter
} from '../platform-adapter-factory';

describe('Platform Adapter Factory', () => {
  // Mock window and navigator objects
  const originalWindow = global.window;
  const originalNavigator = global.navigator;
  
  beforeEach(() => {
    // Reset mocks
    global.window = originalWindow;
    global.navigator = originalNavigator;
  });
  
  afterAll(() => {
    // Restore original objects
    global.window = originalWindow;
    global.navigator = originalNavigator;
  });
  
  describe('detectPlatform', () => {
    it('should detect web platform', () => {
      // Mock browser environment
      global.window = { document: {} } as any;
      
      expect(detectPlatform()).toBe('web');
    });
    
    it('should detect Next.js platform', () => {
      // Mock Next.js environment
      global.window = { 
        document: {},
        __NEXT_DATA__: {}
      } as any;
      
      expect(detectPlatform()).toBe('nextjs');
    });
    
    it('should detect React Native platform', () => {
      // Mock React Native environment
      global.window = undefined as any;
      global.navigator = { product: 'ReactNative' } as any;
      
      expect(detectPlatform()).toBe('react-native');
    });
    
    it('should default to Next.js for server-side', () => {
      // Mock server environment
      global.window = undefined as any;
      global.navigator = undefined as any;
      
      expect(detectPlatform()).toBe('nextjs');
    });
  });
  
  describe('detectFeatures', () => {
    it('should detect browser features', async () => {
      // Mock browser environment with localStorage and Web Crypto
      global.window = { 
        document: {},
        localStorage: {
          getItem: jest.fn(),
          setItem: jest.fn(),
          removeItem: jest.fn()
        },
        crypto: {
          subtle: {
            digest: jest.fn()
          },
          getRandomValues: jest.fn()
        }
      } as any;
      
      const features = await detectFeatures();
      
      expect(features.hasLocalStorage).toBe(true);
      expect(features.hasWebCrypto).toBe(true);
    });
    
    it('should handle missing browser features', async () => {
      // Mock browser environment without localStorage or Web Crypto
      global.window = { 
        document: {}
      } as any;
      
      const features = await detectFeatures();
      
      expect(features.hasLocalStorage).toBe(false);
      expect(features.hasWebCrypto).toBe(false);
    });
  });
  
  describe('createPlatformAdapter', () => {
    it('should create a platform adapter', async () => {
      // Mock browser environment
      global.window = { 
        document: {},
        localStorage: {
          getItem: jest.fn(),
          setItem: jest.fn(),
          removeItem: jest.fn()
        },
        crypto: {
          subtle: {
            digest: jest.fn().mockResolvedValue(new ArrayBuffer(32))
          },
          getRandomValues: jest.fn((arr) => arr)
        },
        fetch: jest.fn()
      } as any;
      
      const adapter = await createPlatformAdapter();
      
      expect(adapter).toBeDefined();
      expect(adapter.platform).toBe('web');
      expect(adapter.storage).toBeDefined();
      expect(adapter.crypto).toBeDefined();
      expect(adapter.network).toBeDefined();
    });
  });
  
  describe('createCustomPlatformAdapter', () => {
    it('should create a custom platform adapter', async () => {
      const adapter = await createCustomPlatformAdapter('react-native', {
        useMemoryStorage: true,
        useInsecureCrypto: true
      });
      
      expect(adapter).toBeDefined();
      expect(adapter.platform).toBe('react-native');
      expect(adapter.storage).toBeDefined();
      expect(adapter.crypto).toBeDefined();
      expect(adapter.network).toBeDefined();
    });
  });
  
  describe('getDefaultPlatformAdapter', () => {
    it('should return a cached adapter on subsequent calls', async () => {
      // First call should create a new adapter
      const adapter1 = await getDefaultPlatformAdapter();
      
      // Second call should return the cached adapter
      const adapter2 = await getDefaultPlatformAdapter();
      
      expect(adapter1).toBe(adapter2);
    });
  });
});