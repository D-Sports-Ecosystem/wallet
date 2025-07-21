import { tokenService, TokenInfo } from '../token-service';
import { coinMarketCapAdapter } from '../../utils/platform-adapter';

// Mock the coinMarketCapAdapter
jest.mock('../../utils/platform-adapter', () => ({
  coinMarketCapAdapter: {
    getLatestQuotes: jest.fn(),
  },
}));

const mockCoinMarketCapAdapter = coinMarketCapAdapter as jest.Mocked<typeof coinMarketCapAdapter>;

describe('TokenService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchTokenData', () => {
    it('should fetch and transform token data successfully', async () => {
      // Mock API response
      const mockApiResponse = {
        status: {
          timestamp: '2024-01-01T00:00:00.000Z',
          error_code: 0,
          error_message: null,
          elapsed: 10,
          credit_count: 1,
          notice: null,
        },
        data: {
          BTC: {
            id: 1,
            name: 'Bitcoin',
            symbol: 'BTC',
            slug: 'bitcoin',
            cmc_rank: 1,
            num_market_pairs: 500,
            circulating_supply: 19000000,
            total_supply: 19000000,
            max_supply: 21000000,
            last_updated: '2024-01-01T00:00:00.000Z',
            date_added: '2013-04-28T00:00:00.000Z',
            tags: ['mineable'],
            platform: null,
            quote: {
              USD: {
                price: 50000,
                volume_24h: 1000000000,
                volume_change_24h: 5.5,
                percent_change_1h: 0.5,
                percent_change_24h: 2.5,
                percent_change_7d: 10.0,
                percent_change_30d: 15.0,
                market_cap: 950000000000,
                market_cap_dominance: 45.0,
                fully_diluted_market_cap: 1050000000000,
                last_updated: '2024-01-01T00:00:00.000Z',
              },
            },
          },
        },
      };

      mockCoinMarketCapAdapter.getLatestQuotes.mockResolvedValue(mockApiResponse);

      const result = await tokenService.fetchTokenData(['BTC']);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        name: 'Bitcoin',
        symbol: 'BTC',
        network: 'Bitcoin',
        price: 50000,
        percentChange24h: 2.5,
        marketCap: 950000000000,
        value: '$50000.00',
      });
    });

    it('should handle API errors gracefully', async () => {
      const mockErrorResponse = {
        status: {
          timestamp: '2024-01-01T00:00:00.000Z',
          error_code: 400,
          error_message: 'Invalid API key',
          elapsed: 10,
          credit_count: 1,
          notice: null,
        },
        data: {},
      };

      mockCoinMarketCapAdapter.getLatestQuotes.mockResolvedValue(mockErrorResponse);

      const result = await tokenService.fetchTokenData(['BTC']);

      // Should return placeholder data on error
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        name: 'Bitcoin',
        symbol: 'BTC',
        price: 0,
        value: '$000',
      });
    });

    it('should handle network errors gracefully', async () => {
      mockCoinMarketCapAdapter.getLatestQuotes.mockRejectedValue(new Error('Network error'));

      const result = await tokenService.fetchTokenData(['BTC']);

      // Should return placeholder data on network error
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        name: 'Bitcoin',
        symbol: 'BTC',
        price: 0,
        value: '$000',
      });
    });

    it('should handle missing token data', async () => {
      const mockApiResponse = {
        status: {
          timestamp: '2024-01-01T00:00:00.000Z',
          error_code: 0,
          error_message: null,
          elapsed: 10,
          credit_count: 1,
          notice: null,
        },
        data: {}, // Empty data - token not found
      };

      mockCoinMarketCapAdapter.getLatestQuotes.mockResolvedValue(mockApiResponse);

      const result = await tokenService.fetchTokenData(['UNKNOWN']);

      // Should return placeholder data for unknown token
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        symbol: 'UNKNOWN',
        price: 0,
        value: '$000',
      });
    });
  });

  describe('additional API methods', () => {
    it('should fetch historical data', async () => {
      const mockHistoricalData = {
        status: { error_code: 0 },
        data: { quotes: [] }
      };

      // Mock the getHistoricalQuotes method
      const mockGetHistoricalQuotes = jest.fn().mockResolvedValue(mockHistoricalData);
      (coinMarketCapAdapter as any).getHistoricalQuotes = mockGetHistoricalQuotes;

      const result = await tokenService.getHistoricalData('BTC', '2024-01-01', '2024-01-02', '1d');

      expect(mockGetHistoricalQuotes).toHaveBeenCalledWith('BTC', '2024-01-01', '2024-01-02', undefined, '1d', 'USD');
      expect(result).toEqual(mockHistoricalData);
    });

    it('should fetch global metrics', async () => {
      const mockGlobalMetrics = {
        status: { error_code: 0 },
        data: { quote: { USD: { total_market_cap: 1000000000000 } } }
      };

      // Mock the getGlobalMetrics method
      const mockGetGlobalMetrics = jest.fn().mockResolvedValue(mockGlobalMetrics);
      (coinMarketCapAdapter as any).getGlobalMetrics = mockGetGlobalMetrics;

      const result = await tokenService.getGlobalMetrics('USD');

      expect(mockGetGlobalMetrics).toHaveBeenCalledWith('USD');
      expect(result).toEqual(mockGlobalMetrics);
    });

    it('should convert prices', async () => {
      const mockConversionData = {
        status: { error_code: 0 },
        data: { quote: { ETH: { price: 0.02 } } }
      };

      // Mock the convertPrice method
      const mockConvertPrice = jest.fn().mockResolvedValue(mockConversionData);
      (coinMarketCapAdapter as any).convertPrice = mockConvertPrice;

      const result = await tokenService.convertPrice(1, 'BTC', 'ETH');

      expect(mockConvertPrice).toHaveBeenCalledWith(1, 'BTC', 'ETH');
      expect(result).toEqual(mockConversionData);
    });

    it('should fetch top cryptocurrencies', async () => {
      const mockTopCryptos = {
        status: { error_code: 0 },
        data: [{ symbol: 'BTC', name: 'Bitcoin' }]
      };

      // Mock the getListingsLatest method
      const mockGetListingsLatest = jest.fn().mockResolvedValue(mockTopCryptos);
      (coinMarketCapAdapter as any).getListingsLatest = mockGetListingsLatest;

      const result = await tokenService.getTopCryptocurrencies(50, 'USD');

      expect(mockGetListingsLatest).toHaveBeenCalledWith(1, 50, 'USD', 'market_cap');
      expect(result).toEqual(mockTopCryptos);
    });

    it('should fetch token metadata', async () => {
      const mockMetadata = {
        status: { error_code: 0 },
        data: { BTC: { logo: 'https://example.com/btc.png' } }
      };

      // Mock the getMetadata method
      const mockGetMetadata = jest.fn().mockResolvedValue(mockMetadata);
      (coinMarketCapAdapter as any).getMetadata = mockGetMetadata;

      const result = await tokenService.getTokenMetadata(['BTC']);

      expect(mockGetMetadata).toHaveBeenCalledWith(['BTC']);
      expect(result).toEqual(mockMetadata);
    });
  });

  describe('auto-update functionality', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
      tokenService.stopAutoUpdate();
    });

    it('should start and stop auto-update', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      tokenService.startAutoUpdate(1000); // 1 second for testing
      expect(consoleSpy).toHaveBeenCalledWith('Token auto-update started with 1000ms interval');

      tokenService.stopAutoUpdate();
      expect(consoleSpy).toHaveBeenCalledWith('Token auto-update stopped');

      consoleSpy.mockRestore();
    });
  });
});