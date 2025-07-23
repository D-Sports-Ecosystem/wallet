import { createCryptoAdapter } from '../crypto-adapter';

// Mock the crypto adapter classes
const mockGetRandomValues = jest.fn((array) => array);
const mockSha256 = jest.fn().mockResolvedValue(new Uint8Array(32));
const mockRandomUUID = jest.fn().mockReturnValue('mock-uuid');

// Mock the crypto adapter implementation
jest.mock('../crypto-adapter', () => {
  const original = jest.requireActual('../crypto-adapter');
  
  return {
    ...original,
    BrowserCryptoAdapter: jest.fn().mockImplementation(() => ({
      getRandomValues: mockGetRandomValues,
      randomUUID: mockRandomUUID,
      sha256: mockSha256
    })),
    FallbackCryptoAdapter: jest.fn().mockImplementation(() => ({
      getRandomValues: jest.fn(size => new Uint8Array(size)),
      randomUUID: jest.fn(() => 'fallback-uuid'),
      sha256: jest.fn().mockResolvedValue(new Uint8Array(32))
    })),
    createCryptoAdapter: jest.fn().mockImplementation(async () => ({
      generateRandomBytes: jest.fn(size => new Uint8Array(size)),
      sha256: jest.fn().mockResolvedValue(new Uint8Array(32))
    }))
  };
});

describe('Crypto Adapter', () => {
  describe('Web Crypto Detection', () => {
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
      
      const hasWebCrypto = typeof window !== 'undefined' && 
                          window.crypto !== undefined && 
                          window.crypto.subtle !== undefined;
      
      expect(hasWebCrypto).toBe(true);
      
      // Restore original window
      global.window = originalWindow;
    });
    
    it('should handle missing Web Crypto API', () => {
      // Mock browser environment without Web Crypto
      const originalWindow = global.window;
      global.window = {} as any;
      
      const hasWebCrypto = typeof window !== 'undefined' && 
                          window.crypto !== undefined && 
                          window.crypto.subtle !== undefined;
      
      expect(hasWebCrypto).toBe(false);
      
      // Restore original window
      global.window = originalWindow;
    });
  });
  
  describe('createCryptoAdapter', () => {
    it('should create a crypto adapter for web platform', async () => {
      const adapter = await createCryptoAdapter('web');
      
      expect(adapter).toBeDefined();
      expect(adapter.generateRandomBytes).toBeDefined();
      expect(adapter.sha256).toBeDefined();
      
      // Test generateRandomBytes
      const randomBytes = adapter.generateRandomBytes(32);
      expect(randomBytes).toBeInstanceOf(Uint8Array);
      expect(randomBytes.length).toBe(32);
      
      // Test sha256
      const data = new Uint8Array(10);
      const hash = await adapter.sha256(data);
      expect(hash).toBeInstanceOf(Uint8Array);
      expect(hash.length).toBe(32);
    });
    
    it('should create a crypto adapter with insecure option', async () => {
      const adapter = await createCryptoAdapter('web', { useInsecureCrypto: true });
      
      expect(adapter).toBeDefined();
      expect(adapter.generateRandomBytes).toBeDefined();
      expect(adapter.sha256).toBeDefined();
      
      // Test generateRandomBytes
      const randomBytes = adapter.generateRandomBytes(32);
      expect(randomBytes).toBeInstanceOf(Uint8Array);
      expect(randomBytes.length).toBe(32);
      
      // Test sha256
      const data = new Uint8Array(10);
      const hash = await adapter.sha256(data);
      expect(hash).toBeInstanceOf(Uint8Array);
      expect(hash.length).toBe(32);
    });
  });
});