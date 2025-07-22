import { createNetworkAdapter } from '../network-adapter';

describe('Network Adapter', () => {
  // Test native fetch adapter
  describe('Native fetch adapter', () => {
    beforeEach(() => {
      // Mock global fetch
      global.fetch = jest.fn().mockImplementation((url) => {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ data: 'test' }),
          text: () => Promise.resolve('test'),
        });
      });
      
      // Mock AbortController
      global.AbortController = jest.fn().mockImplementation(() => ({
        signal: {},
        abort: jest.fn(),
      }));
    });
    
    afterEach(() => {
      jest.resetAllMocks();
    });
    
    it('should use native fetch when available', async () => {
      const adapter = await createNetworkAdapter('web');
      
      await adapter.fetch('https://example.com');
      
      expect(global.fetch).toHaveBeenCalledWith('https://example.com', expect.objectContaining({
        signal: expect.anything(),
      }));
    });
    
    it('should handle fetch options correctly', async () => {
      const adapter = await createNetworkAdapter('web');
      
      await adapter.fetch('https://example.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true }),
      });
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://example.com',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ test: true }),
          signal: expect.anything(),
        })
      );
    });
    
    it('should handle timeout errors', async () => {
      // Mock AbortController to simulate timeout
      global.AbortController = jest.fn().mockImplementation(() => ({
        signal: {},
        abort: () => {
          const error = new Error('The operation was aborted');
          error.name = 'AbortError';
          throw error;
        },
      }));
      
      // Mock fetch to throw AbortError
      global.fetch = jest.fn().mockImplementation(() => {
        const error = new Error('The operation was aborted');
        error.name = 'AbortError';
        return Promise.reject(error);
      });
      
      const adapter = await createNetworkAdapter('web', { timeout: 100 });
      
      await expect(adapter.fetch('https://example.com')).rejects.toThrow(
        'Request timeout after 100ms: https://example.com'
      );
    });
    
    it('should handle network errors', async () => {
      // Mock fetch to throw network error
      global.fetch = jest.fn().mockImplementation(() => {
        const error = new TypeError('Failed to fetch');
        return Promise.reject(error);
      });
      
      const adapter = await createNetworkAdapter('web');
      
      await expect(adapter.fetch('https://example.com')).rejects.toThrow();
    });
    
    it('should check if network is available', async () => {
      const adapter = await createNetworkAdapter('web');
      
      const isAvailable = await adapter.isNetworkAvailable();
      
      expect(isAvailable).toBe(true);
      expect(global.fetch).toHaveBeenCalled();
    });
  });
  
  // Test custom fetch adapter
  describe('Custom fetch adapter', () => {
    it('should use custom fetch implementation', async () => {
      const customFetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ data: 'custom' }),
        });
      });
      
      const adapter = await createNetworkAdapter('web', { customFetch });
      
      await adapter.fetch('https://example.com');
      
      expect(customFetch).toHaveBeenCalled();
    });
  });
  
  // Test fallback adapter
  describe('Fallback adapter', () => {
    beforeEach(() => {
      // Remove global fetch to test fallback
      delete (global as any).fetch;
    });
    
    it('should use fallback adapter when fetch is not available', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const adapter = await createNetworkAdapter('web', { useInsecureFallback: true });
      
      const response = await adapter.fetch('https://example.com');
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Using insecure network fallback adapter')
      );
      expect(response).toBeDefined();
      
      consoleWarnSpy.mockRestore();
    });
    
    it('should throw error when fetch is not available and fallback is disabled', async () => {
      await expect(createNetworkAdapter('web')).resolves.toBeDefined();
      
      const adapter = await createNetworkAdapter('web');
      
      await expect(adapter.fetch('https://example.com')).rejects.toThrow(
        'Fetch API is not available in this environment (web)'
      );
    });
  });
});