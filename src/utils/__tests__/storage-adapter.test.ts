import { 
  MemoryStorageAdapter, 
  LocalStorageAdapter, 
  AsyncStorageAdapter,
  createStorageAdapter,
  detectStorageFeatures
} from '../storage-adapter';

describe('Storage Adapters', () => {
  describe('MemoryStorageAdapter', () => {
    it('should store and retrieve values', async () => {
      const adapter = new MemoryStorageAdapter();
      
      await adapter.setItem('test-key', 'test-value');
      const value = await adapter.getItem('test-key');
      
      expect(value).toBe('test-value');
    });
    
    it('should remove values', async () => {
      const adapter = new MemoryStorageAdapter();
      
      await adapter.setItem('test-key', 'test-value');
      await adapter.removeItem('test-key');
      const value = await adapter.getItem('test-key');
      
      expect(value).toBeNull();
    });
    
    it('should return null for non-existent keys', async () => {
      const adapter = new MemoryStorageAdapter();
      const value = await adapter.getItem('non-existent');
      
      expect(value).toBeNull();
    });
  });
  
  describe('LocalStorageAdapter', () => {
    beforeEach(() => {
      // Mock localStorage
      global.localStorage = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
        length: 0,
        key: jest.fn()
      };
    });
    
    it('should use localStorage for operations', async () => {
      const adapter = new LocalStorageAdapter();
      
      await adapter.setItem('test-key', 'test-value');
      expect(localStorage.setItem).toHaveBeenCalledWith('test-key', 'test-value');
      
      await adapter.getItem('test-key');
      expect(localStorage.getItem).toHaveBeenCalledWith('test-key');
      
      await adapter.removeItem('test-key');
      expect(localStorage.removeItem).toHaveBeenCalledWith('test-key');
    });
    
    it('should handle localStorage errors gracefully', async () => {
      // Mock localStorage to throw errors
      global.localStorage = {
        getItem: jest.fn().mockImplementation(() => { throw new Error('Storage error'); }),
        setItem: jest.fn().mockImplementation(() => { throw new Error('Storage error'); }),
        removeItem: jest.fn().mockImplementation(() => { throw new Error('Storage error'); }),
        clear: jest.fn(),
        length: 0,
        key: jest.fn()
      };
      
      const adapter = new LocalStorageAdapter();
      
      // These should not throw
      await expect(adapter.setItem('test-key', 'test-value')).resolves.not.toThrow();
      await expect(adapter.getItem('test-key')).resolves.toBeNull();
      await expect(adapter.removeItem('test-key')).resolves.not.toThrow();
    });
  });
  
  describe('AsyncStorageAdapter', () => {
    const mockAsyncStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn()
    };
    
    it('should use AsyncStorage for operations', async () => {
      const adapter = new AsyncStorageAdapter(mockAsyncStorage);
      
      await adapter.setItem('test-key', 'test-value');
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('test-key', 'test-value');
      
      await adapter.getItem('test-key');
      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('test-key');
      
      await adapter.removeItem('test-key');
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('test-key');
    });
    
    it('should handle AsyncStorage errors gracefully', async () => {
      const errorAsyncStorage = {
        getItem: jest.fn().mockRejectedValue(new Error('Storage error')),
        setItem: jest.fn().mockRejectedValue(new Error('Storage error')),
        removeItem: jest.fn().mockRejectedValue(new Error('Storage error'))
      };
      
      const adapter = new AsyncStorageAdapter(errorAsyncStorage);
      
      // These should not throw
      await expect(adapter.setItem('test-key', 'test-value')).resolves.not.toThrow();
      await expect(adapter.getItem('test-key')).resolves.toBeNull();
      await expect(adapter.removeItem('test-key')).resolves.not.toThrow();
    });
  });
  
  describe('detectStorageFeatures', () => {
    it('should detect localStorage in browser environment', async () => {
      // Mock browser environment
      global.window = { localStorage: {} } as any;
      
      const features = await detectStorageFeatures();
      expect(features.hasLocalStorage).toBe(true);
    });
    
    it('should handle missing localStorage', async () => {
      // Mock browser environment without localStorage
      global.window = {} as any;
      
      const features = await detectStorageFeatures();
      expect(features.hasLocalStorage).toBe(false);
    });
    
    it('should handle localStorage access errors', async () => {
      // Mock localStorage that throws on access
      Object.defineProperty(global, 'window', {
        value: {
          get localStorage() {
            throw new Error('SecurityError');
          }
        },
        writable: true
      });
      
      const features = await detectStorageFeatures();
      expect(features.hasLocalStorage).toBe(false);
    });
  });
  
  describe('createStorageAdapter', () => {
    it('should create memory adapter as fallback', async () => {
      // Mock environment with no storage capabilities
      global.window = undefined;
      
      const adapter = await createStorageAdapter('web');
      
      // Test it's a memory adapter by checking functionality
      await adapter.setItem('test-key', 'test-value');
      const value = await adapter.getItem('test-key');
      
      expect(value).toBe('test-value');
    });
    
    it('should create localStorage adapter for web platform', async () => {
      // Mock browser environment
      global.window = { 
        localStorage: {
          getItem: jest.fn().mockReturnValue('test-value'),
          setItem: jest.fn(),
          removeItem: jest.fn()
        } 
      } as any;
      
      const adapter = await createStorageAdapter('web');
      
      await adapter.getItem('test-key');
      expect(window.localStorage.getItem).toHaveBeenCalledWith('test-key');
    });
  });
});