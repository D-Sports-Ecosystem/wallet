// Platform adapter to handle cross-platform imports and components
// This helps avoid direct react-native imports in web builds
// Also provides platform-specific API request handling

import { config } from 'dotenv';

// Load environment variables
config();

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
  View: 'div',
  Text: 'span',
  Pressable: 'button',
  TextInput: 'input',
  ScrollView: 'div',
  FlatList: 'div',
  Image: 'img',
  ActivityIndicator: 'div',
};

// Mock types for web
const webTypes: PlatformTypes = {
  ViewProps: {} as React.HTMLAttributes<HTMLDivElement>,
  TextProps: {} as React.HTMLAttributes<HTMLSpanElement>,
  PressableProps: {} as React.ButtonHTMLAttributes<HTMLButtonElement>,
  TextInputProps: {} as React.InputHTMLAttributes<HTMLInputElement>,
  ImageProps: {} as React.ImgHTMLAttributes<HTMLImageElement>,
};

// Check if we're in a React Native environment
const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

// Export the appropriate components and types based on platform
export const PlatformComponents: PlatformComponents = isReactNative 
  ? (() => {
      try {
        // Try to import React Native components
        const RN = require('react-native');
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
        // Fallback to web components if React Native is not available
        return webComponents;
      }
    })()
  : webComponents;

export const PlatformTypes: PlatformTypes = isReactNative
  ? (() => {
      try {
        // Try to import React Native types
        const RN = require('react-native');
        return {
          ViewProps: {} as any, // RN.ViewProps
          TextProps: {} as any, // RN.TextProps
          PressableProps: {} as any, // RN.PressableProps
          TextInputProps: {} as any, // RN.TextInputProps
          ImageProps: {} as any, // RN.ImageProps
        };
      } catch (error) {
        // Fallback to web types if React Native is not available
        return webTypes;
      }
    })()
  : webTypes;

// API Request Handling
export interface ApiRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body?: any;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
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

  public async request<T>(url: string, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
    const cacheKey = this.getCacheKey(url, options);
    
    // Check cache first if it's a GET request
    if (options.method === undefined || options.method === 'GET') {
      const cachedData = this.cache.get(cacheKey);
      if (cachedData && Date.now() - cachedData.timestamp < this.cacheTTL) {
        return {
          data: cachedData.data,
          status: 200,
          headers: { 'x-cache': 'HIT' }
        };
      }
    }

    try {
      // Prepare fetch options
      const fetchOptions: RequestInit = {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      };

      // Add body for non-GET requests
      if (options.body && options.method !== 'GET') {
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
        headers
      };
      
      // Cache successful GET responses
      if ((options.method === undefined || options.method === 'GET') && response.ok) {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
      }
      
      return result as ApiResponse<T>;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private getCacheKey(url: string, options: ApiRequestOptions): string {
    const paramsString = options.params ? JSON.stringify(options.params) : '';
    return `${url}|${paramsString}`;
  }
}

// CoinMarketCap API Adapter
export class CoinMarketCapAdapter {
  private static instance: CoinMarketCapAdapter;
  private apiKey: string;
  private baseUrl: string = 'https://pro-api.coinmarketcap.com/v1';
  private apiAdapter: PlatformApiAdapter;

  private constructor() {
    this.apiKey = process.env.COINMARKETCAP_API_KEY || '';
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

  public async getLatestQuotes(symbols: string[], currency: string = 'USD'): Promise<any> {
    try {
      const response = await this.apiAdapter.request(
        `${this.baseUrl}/cryptocurrency/quotes/latest`,
        {
          headers: {
            'X-CMC_PRO_API_KEY': this.apiKey
          },
          params: {
            symbol: symbols.join(','),
            convert: currency
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch cryptocurrency quotes:', error);
      throw error;
    }
  }

  public async getMetadata(symbols: string[]): Promise<any> {
    try {
      const response = await this.apiAdapter.request(
        `${this.baseUrl}/cryptocurrency/info`,
        {
          headers: {
            'X-CMC_PRO_API_KEY': this.apiKey
          },
          params: {
            symbol: symbols.join(',')
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch cryptocurrency metadata:', error);
      throw error;
    }
  }
}

// Export singleton instances
export const apiAdapter = PlatformApiAdapter.getInstance();
export const coinMarketCapAdapter = CoinMarketCapAdapter.getInstance();