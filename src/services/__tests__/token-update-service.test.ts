import { TokenUpdateService, TokenUpdateConfig, createTokenUpdateService } from '../token-update-service';
import { tokenService } from '../token-service';
import { apiAdapter } from '../../utils/platform-adapter';

// Mock dependencies
jest.mock('../token-service', () => ({
  tokenService: {
    fetchTokenData: jest.fn(),
  },
}));

jest.mock('../../utils/platform-adapter', () => ({
  apiAdapter: {
    setCacheTTL: jest.fn(),
    clearCache: jest.fn(),
  },
}));

describe('TokenUpdateService', () => {
  let tokenUpdateService: any;
  let mockTokens: any[];
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock token data
    mockTokens = [
      { symbol: 'BTC', name: 'Bitcoin', price: 50000 },
      { symbol: 'ETH', name: 'Ethereum', price: 3000 },
    ];
    
    // Mock successful token fetch
    (tokenService.fetchTokenData as jest.Mock).mockResolvedValue(mockTokens);
    
    // Create a new instance for each test
    tokenUpdateService = (TokenUpdateService as any).getInstance({
      autoStart: false, // Don't start automatically for tests
    });
    
    // Clear any existing intervals
    if (tokenUpdateService.intervalId) {
      clearInterval(tokenUpdateService.intervalId);
      tokenUpdateService.intervalId = null;
    }
  });
  
  afterEach(() => {
    // Clean up any intervals
    if (tokenUpdateService.intervalId) {
      clearInterval(tokenUpdateService.intervalId);
    }
  });
  
  test('should be a singleton', () => {
    const instance1 = (TokenUpdateService as any).getInstance();
    const instance2 = (TokenUpdateService as any).getInstance();
    expect(instance1).toBe(instance2);
  });
  
  test('should initialize with default behavior', () => {
    // Test that we can start the service manually
    const testService = createTokenUpdateService({ autoStart: false });
    expect(testService.isRunning()).toBe(false);
    
    // Start it manually
    testService.start();
    expect(testService.isRunning()).toBe(true);
    
    // Clean up
    testService.stop();
    expect(testService.isRunning()).toBe(false);
  });
  
  test('should update config correctly', () => {
    const newConfig: Partial<TokenUpdateConfig> = {
      refreshInterval: 600000,
      cacheTTL: 900000,
      symbols: ['BTC', 'ETH'],
      currency: 'EUR',
    };
    
    tokenUpdateService.updateConfig(newConfig);
    
    expect(tokenUpdateService.config).toEqual({
      ...tokenUpdateService.config,
      ...newConfig,
    });
    
    // Should update API adapter cache TTL
    expect(apiAdapter.setCacheTTL).toHaveBeenCalledWith(900000);
  });
  
  test('should start and stop correctly', () => {
    // Start the service
    tokenUpdateService.start();
    expect(tokenUpdateService.isRunning()).toBe(true);
    expect(tokenUpdateService.intervalId).not.toBeNull();
    expect(tokenService.fetchTokenData).toHaveBeenCalledTimes(1);
    
    // Stop the service
    tokenUpdateService.stop();
    expect(tokenUpdateService.isRunning()).toBe(false);
    expect(tokenUpdateService.intervalId).toBeNull();
  });
  
  test('should force update correctly', async () => {
    const onUpdateMock = jest.fn();
    tokenUpdateService.config.onUpdate = onUpdateMock;
    
    await tokenUpdateService.forceUpdate();
    
    expect(tokenService.fetchTokenData).toHaveBeenCalledWith(
      tokenUpdateService.config.symbols,
      tokenUpdateService.config.currency
    );
    expect(onUpdateMock).toHaveBeenCalledWith(mockTokens);
    expect(tokenUpdateService.lastUpdated).toBeInstanceOf(Date);
    expect(tokenUpdateService.tokens).toEqual(mockTokens);
  });
  
  test('should handle errors correctly', async () => {
    const error = new Error('API error');
    (tokenService.fetchTokenData as jest.Mock).mockRejectedValue(error);
    
    const onErrorMock = jest.fn();
    tokenUpdateService.config.onError = onErrorMock;
    
    await expect(tokenUpdateService.forceUpdate()).rejects.toThrow('API error');
    expect(onErrorMock).toHaveBeenCalledWith(error);
  });
  
  test('should clear cache correctly', () => {
    tokenUpdateService.clearCache();
    expect(apiAdapter.clearCache).toHaveBeenCalled();
  });
  
  test('should prevent concurrent updates', async () => {
    // Make the fetch take some time
    (tokenService.fetchTokenData as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockTokens), 100))
    );
    
    // Start an update
    const firstUpdate = tokenUpdateService.updateTokenData();
    
    // Try to start another update while the first one is still running
    const secondUpdate = tokenUpdateService.updateTokenData();
    
    // The second update should return the cached tokens without calling fetchTokenData again
    await secondUpdate;
    expect(tokenService.fetchTokenData).toHaveBeenCalledTimes(1);
    
    // Wait for the first update to complete
    await firstUpdate;
  });
  
  test('should allow forced update even if another update is in progress', async () => {
    // Make the fetch take some time
    (tokenService.fetchTokenData as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockTokens), 100))
    );
    
    // Start an update
    const firstUpdate = tokenUpdateService.updateTokenData();
    
    // Force another update while the first one is still running
    const forcedUpdate = tokenUpdateService.updateTokenData(true);
    
    // Both updates should call fetchTokenData
    await Promise.all([firstUpdate, forcedUpdate]);
    expect(tokenService.fetchTokenData).toHaveBeenCalledTimes(2);
  });
});