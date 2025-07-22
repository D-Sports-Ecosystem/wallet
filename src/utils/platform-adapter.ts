// Platform adapter to handle cross-platform imports and components
// This helps avoid direct react-native imports in web builds
// Also provides platform-specific API request handling

// Import types
import { Platform } from '../types';
import { getCryptoAdapter, BrowserCryptoAdapter } from './crypto-adapter';

// Environment variables will be loaded by the build process or runtime environment

export interface PlatformComponents {
  View: any;
  Text: any;
  Pressable: any;
  TextInput: any;
  ScrollView: any;
  FlatList: any;
  Image: any;
  ActivityIndicator: any;
}

export interface PlatformTypes {
  ViewProps: any;
  TextProps: any;
  PressableProps: any;
  TextInputProps: any;
  ImageProps: any;
}

// Web implementations using HTML elements
const webComponents: PlatformComponents = {
  View: "div",
  Text: "span",
  Pressable: "button",
  TextInput: "input",
  ScrollView: "div",
  FlatList: "div",
  Image: "img",
  ActivityIndicator: "div",
};

// Mock types for web
const webTypes: PlatformTypes = {
  ViewProps: {} as React.HTMLAttributes<HTMLDivElement>,
  TextProps: {} as React.HTMLAttributes<HTMLSpanElement>,
  PressableProps: {} as React.ButtonHTMLAttributes<HTMLButtonElement>,
  TextInputProps: {} as React.InputHTMLAttributes<HTMLInputElement>,
  ImageProps: {} as React.ImgHTMLAttributes<HTMLImageElement>,
};

// Platform detection utilities
export function detectPlatform(): "web" | "nextjs" | "react-native" {
  if (typeof navigator !== "undefined" && navigator.product === "ReactNative") {
    return "react-native";
  } else if (typeof window !== "undefined") {
    // Check if we're in Next.js
    if (
      typeof (window as any).next !== "undefined" ||
      (typeof process !== "undefined" && process.env.NODE_ENV)
    ) {
      return "nextjs";
    }
    return "web";
  } else {
    return "nextjs"; // Default to Next.js for server-side
  }
}

// Detect if we're in a browser environment
export function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

// Check if we're in a React Native environment
const isReactNative = detectPlatform() === "react-native";

// Export the appropriate components and types based on platform
// Use dynamic import pattern for React Native components
async function loadReactNativeComponents(): Promise<PlatformComponents> {
  try {
    const RN = await import("react-native").catch(() => require("react-native"));
    return {
      View: RN.View,
      Text: RN.Text,
      Pressable: RN.Pressable,
      TextInput: RN.TextInput,
      ScrollView: RN.ScrollView,
      FlatList: RN.FlatList,
      Image: RN.Image,
      ActivityIndicator: RN.ActivityIndicator,
    };
  } catch (error) {
    console.warn("React Native components not available, using web fallback:", error);
    return webComponents;
  }
}

// Synchronous fallback for immediate access
function getReactNativeComponentsSync(): PlatformComponents {
  try {
    const RN = require("react-native");
    return {
      View: RN.View,
      Text: RN.Text,
      Pressable: RN.Pressable,
      TextInput: RN.TextInput,
      ScrollView: RN.ScrollView,
      FlatList: RN.FlatList,
      Image: RN.Image,
      ActivityIndicator: RN.ActivityIndicator,
    };
  } catch (error) {
    console.warn("React Native components not available synchronously, using web fallback");
    return webComponents;
  }
}

export const PlatformComponents: PlatformComponents = isReactNative
  ? getReactNativeComponentsSync()
  : webComponents;

// Use dynamic import pattern for React Native types
async function loadReactNativeTypes(): Promise<PlatformTypes> {
  try {
    const RN = await import("react-native").catch(() => require("react-native"));
    return {
      ViewProps: {} as any, // RN.ViewProps
      TextProps: {} as any, // RN.TextProps
      PressableProps: {} as any, // RN.PressableProps
      TextInputProps: {} as any, // RN.TextInputProps
      ImageProps: {} as any, // RN.ImageProps
    };
  } catch (error) {
    console.warn("React Native types not available, using web fallback:", error);
    return webTypes;
  }
}

// Synchronous fallback for immediate access
function getReactNativeTypesSync(): PlatformTypes {
  try {
    const RN = require("react-native");
    return {
      ViewProps: {} as any, // RN.ViewProps
      TextProps: {} as any, // RN.TextProps
      PressableProps: {} as any, // RN.PressableProps
      TextInputProps: {} as any, // RN.TextInputProps
      ImageProps: {} as any, // RN.ImageProps
    };
  } catch (error) {
    console.warn("React Native types not available synchronously, using web fallback");
    return webTypes;
  }
}

export const PlatformTypes: PlatformTypes = isReactNative
  ? getReactNativeTypesSync()
  : webTypes;

// API Request Handling
export interface ApiRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body?: any;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  timeout?: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

export class PlatformApiAdapter {
  private static instance: PlatformApiAdapter;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTTL: number = 5 * 60 * 1000; // 5 minutes default TTL

  private constructor() {}

  public static getInstance(): PlatformApiAdapter {
    if (!PlatformApiAdapter.instance) {
      PlatformApiAdapter.instance = new PlatformApiAdapter();
    }
    return PlatformApiAdapter.instance;
  }

  public setCacheTTL(ttl: number): void {
    this.cacheTTL = ttl;
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public async request<T>(
    url: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const cacheKey = this.getCacheKey(url, options);

    // Check cache first if it's a GET request
    if (options.method === undefined || options.method === "GET") {
      const cachedData = this.cache.get(cacheKey);
      if (cachedData && Date.now() - cachedData.timestamp < this.cacheTTL) {
        return {
          data: cachedData.data,
          status: 200,
          headers: { "x-cache": "HIT" },
        };
      }
    }

    try {
      // Prepare fetch options
      const fetchOptions: RequestInit = {
        method: options.method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      };

      // Add body for non-GET requests
      if (options.body && options.method !== "GET") {
        fetchOptions.body = JSON.stringify(options.body);
      }

      // Add query parameters
      let requestUrl = url;
      if (options.params) {
        const queryParams = new URLSearchParams();
        Object.entries(options.params).forEach(([key, value]) => {
          queryParams.append(key, value);
        });
        requestUrl += `?${queryParams.toString()}`;
      }

      // Make the request
      if (typeof fetch === "undefined") {
        throw new Error("Fetch is not available in this environment");
      }
      const response = await fetch(requestUrl, fetchOptions);

      // Parse response
      const data = await response.json();

      // Extract headers
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      const result = {
        data,
        status: response.status,
        headers,
      };

      // Cache successful GET responses
      if (
        (options.method === undefined || options.method === "GET") &&
        response.ok
      ) {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
        });
      }

      return result as ApiResponse<T>;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  private getCacheKey(url: string, options: ApiRequestOptions): string {
    const paramsString = options.params ? JSON.stringify(options.params) : "";
    return `${url}|${paramsString}`;
  }
}

// CoinMarketCap API Adapter
export class CoinMarketCapAdapter {
  private static instance: CoinMarketCapAdapter;
  private apiKey: string;
  private baseUrl: string = "https://pro-api.coinmarketcap.com/v1";
  private apiAdapter: PlatformApiAdapter;

  private constructor() {
    // Load environment variables
    if (typeof process !== "undefined" && process.env) {
      this.apiKey = process.env.COINMARKETCAP_API_KEY || "";
    } else {
      this.apiKey = "";
      console.warn(
        "CoinMarketCap API key not found. Please set COINMARKETCAP_API_KEY environment variable."
      );
    }
    this.apiAdapter = PlatformApiAdapter.getInstance();
    // Set cache TTL to 5 minutes for crypto data
    this.apiAdapter.setCacheTTL(5 * 60 * 1000);
  }

  public static getInstance(): CoinMarketCapAdapter {
    if (!CoinMarketCapAdapter.instance) {
      CoinMarketCapAdapter.instance = new CoinMarketCapAdapter();
    }
    return CoinMarketCapAdapter.instance;
  }

  /**
   * Get latest market ticker quotes and averages for cryptocurrencies
   * Uses /cryptocurrency/quotes/latest endpoint
   */
  public async getLatestQuotes(
    symbols: string[],
    currency: string = "USD"
  ): Promise<any> {
    try {
      const response = await this.apiAdapter.request(
        `${this.baseUrl}/cryptocurrency/quotes/latest`,
        {
          headers: {
            "X-CMC_PRO_API_KEY": this.apiKey,
            Accept: "application/json",
          },
          params: {
            symbol: symbols.join(","),
            convert: currency,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Failed to fetch cryptocurrency quotes:", error);
      throw error;
    }
  }

  /**
   * Get cryptocurrency metadata like block explorer URLs and logos
   * Uses /cryptocurrency/info endpoint
   */
  public async getMetadata(symbols: string[]): Promise<any> {
    try {
      const response = await this.apiAdapter.request(
        `${this.baseUrl}/cryptocurrency/info`,
        {
          headers: {
            "X-CMC_PRO_API_KEY": this.apiKey,
            Accept: "application/json",
          },
          params: {
            symbol: symbols.join(","),
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Failed to fetch cryptocurrency metadata:", error);
      throw error;
    }
  }

  /**
   * Get historical OHLCV data for cryptocurrencies
   * Uses /cryptocurrency/quotes/historical endpoint
   */
  public async getHistoricalQuotes(
    symbol: string,
    timeStart?: string,
    timeEnd?: string,
    count?: number,
    interval?:
      | "5m"
      | "10m"
      | "15m"
      | "30m"
      | "45m"
      | "1h"
      | "2h"
      | "3h"
      | "4h"
      | "6h"
      | "12h"
      | "1d"
      | "2d"
      | "3d"
      | "7d"
      | "14d"
      | "15d"
      | "30d"
      | "60d"
      | "90d"
      | "365d",
    currency: string = "USD"
  ): Promise<any> {
    try {
      const params: Record<string, string> = {
        symbol,
        convert: currency,
      };

      if (timeStart) params.time_start = timeStart;
      if (timeEnd) params.time_end = timeEnd;
      if (count) params.count = count.toString();
      if (interval) params.interval = interval;

      const response = await this.apiAdapter.request(
        `${this.baseUrl}/cryptocurrency/quotes/historical`,
        {
          headers: {
            "X-CMC_PRO_API_KEY": this.apiKey,
            Accept: "application/json",
          },
          params,
        }
      );

      return response.data;
    } catch (error) {
      console.error("Failed to fetch historical cryptocurrency quotes:", error);
      throw error;
    }
  }

  /**
   * Get ordered list of all cryptocurrencies
   * Uses /cryptocurrency/listings/latest endpoint
   */
  public async getListingsLatest(
    start: number = 1,
    limit: number = 100,
    currency: string = "USD",
    sort:
      | "market_cap"
      | "name"
      | "symbol"
      | "date_added"
      | "market_cap_strict"
      | "price"
      | "circulating_supply"
      | "total_supply"
      | "max_supply"
      | "num_market_pairs"
      | "volume_24h"
      | "percent_change_1h"
      | "percent_change_24h"
      | "percent_change_7d"
      | "market_cap_by_total_supply_strict"
      | "volume_7d"
      | "volume_30d" = "market_cap"
  ): Promise<any> {
    try {
      const response = await this.apiAdapter.request(
        `${this.baseUrl}/cryptocurrency/listings/latest`,
        {
          headers: {
            "X-CMC_PRO_API_KEY": this.apiKey,
            Accept: "application/json",
          },
          params: {
            start: start.toString(),
            limit: limit.toString(),
            convert: currency,
            sort,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Failed to fetch cryptocurrency listings:", error);
      throw error;
    }
  }

  /**
   * Get global cryptocurrency market metrics
   * Uses /global-metrics/quotes/latest endpoint
   */
  public async getGlobalMetrics(currency: string = "USD"): Promise<any> {
    try {
      const response = await this.apiAdapter.request(
        `${this.baseUrl}/global-metrics/quotes/latest`,
        {
          headers: {
            "X-CMC_PRO_API_KEY": this.apiKey,
            Accept: "application/json",
          },
          params: {
            convert: currency,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Failed to fetch global metrics:", error);
      throw error;
    }
  }

  /**
   * Convert cryptocurrency or fiat currency amounts
   * Uses /tools/price-conversion endpoint
   */
  public async convertPrice(
    amount: number,
    symbol: string,
    convert: string,
    time?: string
  ): Promise<any> {
    try {
      const params: Record<string, string> = {
        amount: amount.toString(),
        symbol,
        convert,
      };

      if (time) params.time = time;

      const response = await this.apiAdapter.request(
        `${this.baseUrl}/tools/price-conversion`,
        {
          headers: {
            "X-CMC_PRO_API_KEY": this.apiKey,
            Accept: "application/json",
          },
          params,
        }
      );

      return response.data;
    } catch (error) {
      console.error("Failed to convert price:", error);
      throw error;
    }
  }

  /**
   * Get CoinMarketCap ID map for cryptocurrencies
   * Uses /cryptocurrency/map endpoint
   */
  public async getCryptocurrencyMap(
    listingStatus: "active" | "inactive" | "untracked" = "active",
    start: number = 1,
    limit: number = 5000,
    sort: "cmc_rank" | "id" = "cmc_rank"
  ): Promise<any> {
    try {
      const response = await this.apiAdapter.request(
        `${this.baseUrl}/cryptocurrency/map`,
        {
          headers: {
            "X-CMC_PRO_API_KEY": this.apiKey,
            Accept: "application/json",
          },
          params: {
            listing_status: listingStatus,
            start: start.toString(),
            limit: limit.toString(),
            sort,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Failed to fetch cryptocurrency map:", error);
      throw error;
    }
  }
}

// Storage utilities
export interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export class PlatformStorageAdapter implements StorageAdapter {
  private static instance: PlatformStorageAdapter;
  private platform: Platform;
  private adapter: StorageAdapter | null = null;
  private initPromise: Promise<void> | null = null;

  private constructor() {
    this.platform = detectPlatform() as Platform;
    this.initPromise = this.initAdapter();
  }

  public static getInstance(): PlatformStorageAdapter {
    if (!PlatformStorageAdapter.instance) {
      PlatformStorageAdapter.instance = new PlatformStorageAdapter();
    }
    return PlatformStorageAdapter.instance;
  }

  private async initAdapter(): Promise<void> {
    try {
      // Dynamically import the storage adapter to avoid bundling issues
      const { createStorageAdapter } = await import('./storage-adapter');
      this.adapter = await createStorageAdapter(this.platform);
    } catch (error) {
      console.error('Failed to initialize storage adapter:', error);
      // Create a memory-based fallback
      const { MemoryStorageAdapter } = await import('./storage-adapter');
      this.adapter = new MemoryStorageAdapter();
    }
  }

  private async ensureAdapter(): Promise<StorageAdapter> {
    if (this.initPromise) {
      await this.initPromise;
    }
    
    if (!this.adapter) {
      throw new Error('Storage adapter not initialized');
    }
    
    return this.adapter;
  }

  async getItem(key: string): Promise<string | null> {
    try {
      const adapter = await this.ensureAdapter();
      return await adapter.getItem(key);
    } catch (error) {
      console.warn('Storage getItem failed:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      const adapter = await this.ensureAdapter();
      await adapter.setItem(key, value);
    } catch (error) {
      console.warn('Storage setItem failed:', error);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      const adapter = await this.ensureAdapter();
      await adapter.removeItem(key);
    } catch (error) {
      console.warn('Storage removeItem failed:', error);
    }
  }
}

// Export singleton instances
export const apiAdapter = PlatformApiAdapter.getInstance();
export const coinMarketCapAdapter = CoinMarketCapAdapter.getInstance();
export const storageAdapter = PlatformStorageAdapter.getInstance();
