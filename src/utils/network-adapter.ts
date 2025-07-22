import { Platform } from '../types';

/**
 * Network adapter options
 */
export interface NetworkAdapterOptions {
  /**
   * Whether to use insecure fallbacks when standard APIs are not available
   */
  useInsecureFallback?: boolean;
  
  /**
   * Custom fetch implementation (for testing or specialized environments)
   */
  customFetch?: typeof fetch;
  
  /**
   * Timeout for network requests in milliseconds (default: 30000)
   */
  timeout?: number;
}

/**
 * Network adapter interface
 */
export interface NetworkAdapter {
  /**
   * Fetch data from a URL
   * @param url The URL to fetch
   * @param options Request options
   * @returns A Promise that resolves to a Response object
   */
  fetch: (url: string, options?: RequestInit) => Promise<Response>;
  
  /**
   * Check if the network is available
   * @returns A Promise that resolves to a boolean indicating if network is available
   */
  isNetworkAvailable: () => Promise<boolean>;
}

/**
 * Creates a network adapter for the specified platform
 * @param platform The platform to create the adapter for
 * @param options Network adapter options
 * @returns A Promise that resolves to a NetworkAdapter
 */
export async function createNetworkAdapter(
  platform: Platform,
  options: NetworkAdapterOptions = {}
): Promise<NetworkAdapter> {
  const { 
    useInsecureFallback = false,
    customFetch,
    timeout = 30000 
  } = options;
  
  // Use custom fetch if provided
  if (customFetch) {
    return createCustomFetchAdapter(customFetch, timeout);
  }
  
  // Use native fetch if available (browser, modern Node.js)
  if (typeof fetch !== 'undefined') {
    return createNativeFetchAdapter(timeout);
  }
  
  // Try to load node-fetch for Node.js environments
  try {
    const nodeFetch = await import('node-fetch').catch(() => null);
    if (nodeFetch && nodeFetch.default) {
      return createNodeFetchAdapter(nodeFetch.default as any, timeout);
    }
  } catch {
    // Continue to fallback
  }
  
  // Try to load a polyfill for older browsers
  if (platform === 'web' || platform === 'nextjs') {
    try {
      // Attempt to dynamically import whatwg-fetch polyfill
      // Note: This requires the polyfill to be installed
      // @ts-ignore - Ignore missing type declaration for whatwg-fetch
      await import('whatwg-fetch').catch(() => null);
      
      // After importing the polyfill, check if fetch is now available
      if (typeof fetch !== 'undefined') {
        return createNativeFetchAdapter(timeout);
      }
    } catch {
      // Continue to fallback
    }
  }
  
  // If we've reached here, no fetch implementation is available
  if (useInsecureFallback) {
    return createFallbackAdapter();
  }
  
  // No fetch implementation available and no fallback allowed
  return createErrorAdapter(
    `Fetch API is not available in this environment (${platform}). ` +
    'Consider adding a polyfill or setting useInsecureFallback to true.'
  );
}

/**
 * Creates a network adapter using the native fetch API
 */
function createNativeFetchAdapter(timeout: number): NetworkAdapter {
  return {
    fetch: async (url: string, options: RequestInit = {}) => {
      try {
        // Create an AbortController for timeout handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        // Add the signal to the options
        const fetchOptions = {
          ...options,
          signal: controller.signal
        };
        
        // Execute the fetch
        const response = await fetch(url, fetchOptions);
        
        // Clear the timeout
        clearTimeout(timeoutId);
        
        return response;
      } catch (error: any) {
        // Handle specific error types
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout after ${timeout}ms: ${url}`);
        }
        
        // Handle network errors
        if (error instanceof TypeError && error.message.includes('network')) {
          throw new Error(`Network error when fetching ${url}: ${error.message}`);
        }
        
        // Re-throw other errors
        throw error;
      }
    },
    
    isNetworkAvailable: async () => {
      try {
        // Try to fetch a small resource to check network connectivity
        // Using a data URL to avoid an actual network request
        await fetch('data:text/plain,');
        return true;
      } catch {
        return false;
      }
    }
  };
}

/**
 * Creates a network adapter using node-fetch
 */
function createNodeFetchAdapter(nodeFetch: typeof fetch, timeout: number): NetworkAdapter {
  return {
    fetch: async (url: string, options: RequestInit = {}) => {
      try {
        // Create an AbortController for timeout handling if supported
        let controller: AbortController | undefined;
        let timeoutId: NodeJS.Timeout | undefined;
        
        try {
          controller = new AbortController();
          timeoutId = setTimeout(() => {
            if (controller) controller.abort();
          }, timeout);
        } catch {
          // AbortController not supported, continue without timeout
        }
        
        // Add the signal to the options if available
        const fetchOptions = {
          ...options,
          ...(controller ? { signal: controller.signal } : {})
        };
        
        // Execute the fetch
        const response = await nodeFetch(url, fetchOptions);
        
        // Clear the timeout if it was set
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        return response as Response;
      } catch (error: any) {
        // Handle specific error types
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout after ${timeout}ms: ${url}`);
        }
        
        // Handle network errors
        if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
          throw new Error(`Network error when fetching ${url}: ${error.message}`);
        }
        
        // Re-throw other errors
        throw error;
      }
    },
    
    isNetworkAvailable: async () => {
      try {
        // Try to fetch a reliable endpoint to check network connectivity
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await nodeFetch('https://www.google.com', { 
          method: 'HEAD',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        return response.status === 200;
      } catch {
        return false;
      }
    }
  };
}

/**
 * Creates a network adapter using a custom fetch implementation
 */
function createCustomFetchAdapter(customFetch: typeof fetch, timeout: number): NetworkAdapter {
  return {
    fetch: async (url: string, options: RequestInit = {}) => {
      try {
        // Create an AbortController for timeout handling if supported
        let controller: AbortController | undefined;
        let timeoutId: any;
        
        try {
          controller = new AbortController();
          timeoutId = setTimeout(() => {
            if (controller) controller.abort();
          }, timeout);
        } catch {
          // AbortController not supported, continue without timeout
        }
        
        // Add the signal to the options if available
        const fetchOptions = {
          ...options,
          ...(controller ? { signal: controller.signal } : {})
        };
        
        // Execute the fetch
        const response = await customFetch(url, fetchOptions);
        
        // Clear the timeout if it was set
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        return response;
      } catch (error: any) {
        // Handle specific error types
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout after ${timeout}ms: ${url}`);
        }
        
        // Re-throw other errors
        throw error;
      }
    },
    
    isNetworkAvailable: async () => {
      try {
        // Try to fetch a small resource to check network connectivity
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        await customFetch('https://www.google.com', { 
          method: 'HEAD',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        return true;
      } catch {
        return false;
      }
    }
  };
}

/**
 * Creates a fallback adapter that simulates network operations
 * Note: This is insecure and should only be used for testing
 */
function createFallbackAdapter(): NetworkAdapter {
  console.warn(
    'Using insecure network fallback adapter. ' +
    'This should only be used for testing purposes.'
  );
  
  // In-memory storage for simulating requests
  const storage = new Map<string, string>();
  
  return {
    fetch: async (url: string, options: RequestInit = {}) => {
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Create a minimal Response object
      const responseInit: ResponseInit = {
        status: 200,
        statusText: 'OK',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      };
      
      // Handle different HTTP methods
      const method = options.method?.toUpperCase() || 'GET';
      
      if (method === 'GET') {
        const data = storage.get(url) || '{}';
        return new Response(data, responseInit);
      } else if (method === 'POST' || method === 'PUT') {
        const body = options.body?.toString() || '{}';
        storage.set(url, body);
        return new Response(body, responseInit);
      } else if (method === 'DELETE') {
        storage.delete(url);
        return new Response('', responseInit);
      }
      
      // Default response
      return new Response('{}', responseInit);
    },
    
    isNetworkAvailable: async () => true
  };
}

/**
 * Creates an adapter that always throws an error
 */
function createErrorAdapter(errorMessage: string): NetworkAdapter {
  return {
    fetch: async () => {
      throw new Error(errorMessage);
    },
    isNetworkAvailable: async () => false
  };
}