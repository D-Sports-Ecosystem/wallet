import { 
  createCryptoAdapter, 
  createWebCryptoAdapter, 
  createFallbackCryptoAdapter,
  detectCryptoFeatures
} from '../crypto-adapter';

describe('Crypto Adapter', () => {
  describe('detectCryptoFeatures', () => {
    it('should detect Web Crypto API availability', () => {
      // Mock browser environment with Web Crypto
      const originalWindow = global.window;
      global.window = { 
        crypto: {
          subtle: {
            digest: jest.fn()
          },
          getRandomValues: jest.fn()
        }
      } as any;
      
      const features = detectCryptoFeatures();
      
      expect(features.hasWebCrypto).toBe(true);
      
      // Restore original window
      global.window = originalWindow;
    });
    
    it('should handle missing Web Crypto API', () => {
      // Mock browser environment without Web Crypto
      const originalWindow = global.window;
      global.window = {} as any;
      
      const features = detectCryptoFeatures();
      
      expect(features.hasWebCrypto).toBe(false);
      
      // Restore original window
      global.window = originalWindow;
    });
  });
  
  describe('createWebCryptoAdapter', () => {
    it('should create a Web Crypto adapter', () => {
      // Mock browser environment with Web Crypto
      const originalWindow = global.window;
      const mockGetRandomValues = jest.fn((array) => array);
      const mockDigest = jest.fn().mockResolvedValue(new ArrayBuffer(32));
      
      global.window = { 
        crypto: {
          subtle: {
            digest: mockDigest
          },
          getRandomValues: mockGetRandomValues
        }
      } as any;
      
      const adapter = createWebCryptoAdapter();
      
      // Test generateRandomBytes
      const randomBytes = adapter.generateRandomBytes(32);
      expect(randomBytes).toBeInstanceOf(Uint8Array);
      expect(randomBytes.length).toBe(32);
      expect(mockGetRandomValues).toHaveBeenCalledWith(expect.any(Uint8Array));
      
      // Test sha256
      const data = new Uint8Array(10);
      adapter.sha256(data).then(hash => {
        expect(hash).toBeInstanceOf(Uint8Array);
        expect(hash.length).toBe(32);
        expect(mockDigest).toHaveBeenCalledWith('SHA-256', data);
      });
      
      // Restore original window
      global.window = originalWindow;
    });
  });
  
  describe('createFallbackCryptoAdapter', () => {
    it('should create a fallback crypto adapter', () => {
      const adapter = createFallbackCryptoAdapter();
      
      // Test generateRandomBytes
      const randomBytes = adapter.generateRandomBytes(32);
      expect(randomBytes).toBeInstanceOf(Uint8Array);
      expect(randomBytes.length).toBe(32);
      
      // Test sha256
      const data = new Uint8Array(10);
      return adapter.sha256(data).then(hash => {
        expect(hash).toBeInstanceOf(Uint8Array);
        expect(hash.length).toBe(32);
      });
    });
  });
  
  describe('createCryptoAdapter', () => {
    it('should prefer Web Crypto API for web platform', async () => {
      // Mock browser environment with Web Crypto
      const originalWindow = global.window;
      const mockGetRandomValues = jest.fn((array) => array);
      const mockDigest = jest.fn().mockResolvedValue(new ArrayBuffer(32));
      
      global.window = { 
        crypto: {
          subtle: {
            digest: mockDigest
          },
          getRandomValues: mockGetRandomValues
        }
      } as any;
      
      const adapter = await createCryptoAdapter('web');
      
      // Test generateRandomBytes
      const randomBytes = adapter.generateRandomBytes(32);
      expect(randomBytes).toBeInstanceOf(Uint8Array);
      expect(randomBytes.length).toBe(32);
      
      // Test sha256
      const data = new Uint8Array(10);
      await adapter.sha256(data).then(hash => {
        expect(hash).toBeInstanceOf(Uint8Array);
        expect(hash.length).toBe(32);
      });
      
      // Restore original window
      global.window = originalWindow;
    });
    
    it('should use fallback when Web Crypto is not available', async () => {
      // Mock environment without Web Crypto
      const originalWindow = global.window;
      global.window = undefined as any;
      
      // Mock console.warn to avoid test output noise
      const originalWarn = console.warn;
      console.warn = jest.fn();
      
      const adapter = await createCryptoAdapter('web', { useInsecureCrypto: true });
      
      // Test generateRandomBytes
      const randomBytes = adapter.generateRandomBytes(32);
      expect(randomBytes).toBeInstanceOf(Uint8Array);
      expect(randomBytes.length).toBe(32);
      
      // Test sha256
      const data = new Uint8Array(10);
      await adapter.sha256(data).then(hash => {
        expect(hash).toBeInstanceOf(Uint8Array);
        expect(hash.length).toBe(32);
      });
      
      // Restore original window and console.warn
      global.window = originalWindow;
      console.warn = originalWarn;
    });
  });
});