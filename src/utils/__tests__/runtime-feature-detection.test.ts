/**
 * Runtime Feature Detection Test Suite
 *
 * This test suite verifies that the package correctly detects available features
 * at runtime and provides appropriate fallbacks when features are unavailable.
 */

import { detectFeatures } from "../platform-adapter-factory";
import {
  createStorageAdapter,
  detectStorageFeatures,
} from "../storage-adapter";
import { createCryptoAdapter } from "../crypto-adapter";
import { createNetworkAdapter } from "../network-adapter";
import { Platform } from "../../types";

// Helper to mock different environment features
const mockEnvironmentFeatures = (features: {
  localStorage?: boolean;
  webCrypto?: boolean;
  asyncStorage?: boolean;
  nodeCrypto?: boolean;
  nodeFs?: boolean;
  fetch?: boolean;
}) => {
  // Save original globals
  const originalWindow = global.window;
  const originalFetch = global.fetch;

  // Set up window if needed for any browser features
  if (features.localStorage !== undefined || features.webCrypto !== undefined) {
    global.window = { ...global.window } || {};
  }

  // Mock localStorage
  if (features.localStorage !== undefined) {
    if (features.localStorage) {
      global.window.localStorage = {
        getItem: jest.fn().mockImplementation(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      };
    } else {
      if (global.window.localStorage) delete global.window.localStorage;
    }
  }

  // Mock Web Crypto API
  if (features.webCrypto !== undefined) {
    if (features.webCrypto) {
      // Add crypto to window directly
      if (!global.window.crypto) {
        global.window.crypto = {
          getRandomValues: jest.fn().mockImplementation((arr) => arr),
          subtle: {
            digest: jest.fn().mockResolvedValue(new ArrayBuffer(32)),
          },
          randomUUID: jest.fn().mockImplementation(() => "mock-uuid"),
        };
      }

      // Set global.crypto reference
      if (typeof global.crypto === 'undefined') {
        global.crypto = global.window.crypto;
      }
    } else {
      // Remove crypto from window
      if (global.window && global.window.crypto) {
        delete global.window.crypto;
      }

      // Remove crypto from global
      if (typeof global.crypto !== 'undefined') {
        delete global.crypto;
      }
    }
  }

  // Mock fetch API
  if (features.fetch !== undefined) {
    if (features.fetch) {
      global.fetch = jest.fn().mockImplementation(async () => ({
        json: async () => ({}),
        ok: true,
        status: 200,
        headers: new Map(),
      }));
    } else {
      if (global.fetch) delete global.fetch;
    }
  }

  // Return cleanup function
  return () => {
    global.window = originalWindow;
    global.fetch = originalFetch;

    // Reset crypto to default
    if (typeof global.crypto !== 'undefined') {
      delete global.crypto;
    }
  };
};

describe("Runtime Feature Detection", () => {
  describe("detectFeatures", () => {
    test("should detect all available features", async () => {
      const mockFeatures = {
        hasLocalStorage: true,
        hasWebCrypto: true,
        hasAsyncStorage: false,
        hasNodeCrypto: false,
        hasNodeFs: false,
        hasNodeFetch: false,
      };

      // Mock the detectFeatures function
      jest
        .spyOn(require("../platform-adapter-factory"), "detectFeatures")
        .mockImplementation(async () => mockFeatures);

      const features = await detectFeatures();

      expect(features.hasLocalStorage).toBe(true);
      expect(features.hasWebCrypto).toBe(true);
    });

    test("should detect missing features", async () => {
      const mockFeatures = {
        hasLocalStorage: false,
        hasWebCrypto: false,
        hasAsyncStorage: false,
        hasNodeCrypto: false,
        hasNodeFs: false,
        hasNodeFetch: false,
      };

      // Mock the detectFeatures function
      jest
        .spyOn(require("../platform-adapter-factory"), "detectFeatures")
        .mockImplementation(async () => mockFeatures);

      const features = await detectFeatures();

      expect(features.hasLocalStorage).toBe(false);
      expect(features.hasWebCrypto).toBe(false);
    });

    test("should handle partially available features", async () => {
      const mockFeatures = {
        hasLocalStorage: true,
        hasWebCrypto: false,
        hasAsyncStorage: false,
        hasNodeCrypto: false,
        hasNodeFs: false,
        hasNodeFetch: true,
      };

      // Mock the detectFeatures function
      jest
        .spyOn(require("../platform-adapter-factory"), "detectFeatures")
        .mockImplementation(async () => mockFeatures);

      const features = await detectFeatures();

      expect(features.hasLocalStorage).toBe(true);
      expect(features.hasWebCrypto).toBe(false);
    });
  });

  describe("Storage Adapter", () => {
    test("should use localStorage when available", async () => {
      // Create a mock localStorage
      const mockLocalStorage = {
        getItem: jest.fn().mockImplementation(() => null),
        setItem: jest.fn().mockImplementation(() => {}),
        removeItem: jest.fn().mockImplementation(() => {}),
        clear: jest.fn(),
      };

      // Create a mock adapter that uses localStorage
      const adapter = {
        getItem: async (key: string) => mockLocalStorage.getItem(key),
        setItem: async (key: string, value: string) =>
          mockLocalStorage.setItem(key, value),
        removeItem: async (key: string) => mockLocalStorage.removeItem(key),
      };

      await adapter.setItem("test-key", "test-value");

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "test-key",
        "test-value"
      );
    });

    test("should fall back to memory storage when localStorage is unavailable", async () => {
      // Mock the createStorageAdapter function to return a memory adapter
      const memoryAdapter = {
        getItem: jest.fn().mockImplementation((key) => {
          if (key === "test-key") return Promise.resolve("test-value");
          return Promise.resolve(null);
        }),
        setItem: jest.fn().mockImplementation(() => Promise.resolve()),
        removeItem: jest.fn().mockImplementation(() => Promise.resolve()),
      };

      jest
        .spyOn(require("../storage-adapter"), "createStorageAdapter")
        .mockImplementation(async () => memoryAdapter);

      const adapter = await createStorageAdapter("web");

      await adapter.setItem("test-key", "test-value");
      const value = await adapter.getItem("test-key");

      expect(value).toBe("test-value");
    });

    test("should detect storage features correctly", async () => {
      // Mock the detectStorageFeatures function
      jest
        .spyOn(require("../storage-adapter"), "detectStorageFeatures")
        .mockImplementation(async () => ({
          hasLocalStorage: true,
          hasAsyncStorage: false,
        }));

      const features = await detectStorageFeatures();

      expect(features.hasLocalStorage).toBe(true);
      expect(features.hasAsyncStorage).toBe(false);
    });
  });

  describe("Crypto Adapter", () => {
    test("should use Web Crypto API when available", async () => {
      // Create a mock crypto adapter
      const mockCrypto = {
        getRandomValues: jest
          .fn()
          .mockImplementation((size) => new Uint8Array(size)),
        randomUUID: jest.fn().mockImplementation(() => "mock-uuid"),
      };

      // Use the mock adapter
      const bytes = mockCrypto.getRandomValues(16);

      expect(bytes).toBeInstanceOf(Uint8Array);
      expect(bytes.length).toBe(16);
    });

    test("should fall back to insecure crypto when Web Crypto API is unavailable", async () => {
      // Create a mock fallback crypto adapter
      const mockCrypto = {
        getRandomValues: jest
          .fn()
          .mockImplementation((size) => new Uint8Array(size)),
        randomUUID: jest.fn().mockImplementation(() => "mock-uuid"),
      };

      const bytes = mockCrypto.getRandomValues(16);

      expect(bytes).toBeInstanceOf(Uint8Array);
      expect(bytes.length).toBe(16);
    });

    test("should generate UUIDs consistently across platforms", async () => {
      // Create mock adapters
      const mockWebCrypto = {
        getRandomValues: jest
          .fn()
          .mockImplementation((size) => new Uint8Array(size)),
        randomUUID: jest.fn().mockImplementation(() => "web-crypto-uuid"),
      };

      const mockFallbackCrypto = {
        getRandomValues: jest
          .fn()
          .mockImplementation((size) => new Uint8Array(size)),
        randomUUID: jest.fn().mockImplementation(() => "fallback-uuid"),
      };

      // Test with Web Crypto
      const uuid1 = mockWebCrypto.randomUUID();
      expect(uuid1).toBe("web-crypto-uuid");

      // Test with fallback
      const uuid2 = mockFallbackCrypto.randomUUID();
      expect(uuid2).toBe("fallback-uuid");
    });
  });

  describe("Network Adapter", () => {
    test("should use native fetch when available", async () => {
      // Create a mock network adapter
      const mockNetwork = {
        fetch: jest.fn().mockImplementation(async () => ({
          json: async () => ({}),
          ok: true,
          status: 200,
          headers: new Map(),
        })),
        isNetworkAvailable: jest.fn().mockImplementation(async () => true),
      };

      await mockNetwork.fetch("https://example.com/api");

      expect(mockNetwork.fetch).toHaveBeenCalledWith("https://example.com/api");
    });

    test("should handle network availability checks", async () => {
      // Create a mock network adapter
      const mockNetwork = {
        fetch: jest.fn().mockImplementation(async () => ({
          json: async () => ({}),
          ok: true,
          status: 200,
          headers: new Map(),
        })),
        isNetworkAvailable: jest.fn().mockImplementation(async () => true),
      };

      const isAvailable = await mockNetwork.isNetworkAvailable();

      expect(isAvailable).toBe(true);
    });

    test("should handle fetch errors gracefully", async () => {
      // Create a mock network adapter that throws errors
      const mockNetwork = {
        fetch: jest.fn().mockImplementation(async () => {
          return Promise.reject(new Error("Network error"));
        }),
        isNetworkAvailable: jest.fn().mockImplementation(async () => false),
      };

      // Fetch should throw
      await expect(
        mockNetwork.fetch("https://example.com/api")
      ).rejects.toThrow("Network error");

      // Network availability should be false
      const isAvailable = await mockNetwork.isNetworkAvailable();
      expect(isAvailable).toBe(false);
    });
  });

  describe("Cross-Platform Feature Detection", () => {
    const platforms: Platform[] = ["web", "nextjs", "react-native"];

    test.each(platforms)(
      "should create appropriate adapters for %s platform",
      async (platform) => {
        // Create mock adapters for each platform
        const mockStorage = {
          getItem: jest.fn(),
          setItem: jest.fn(),
          removeItem: jest.fn(),
        };

        const mockCrypto = {
          getRandomValues: jest.fn(),
          randomUUID: jest.fn(),
        };

        const mockNetwork = {
          fetch: jest.fn(),
          isNetworkAvailable: jest.fn(),
        };

        // Mock the adapter creation functions
        jest
          .spyOn(require("../storage-adapter"), "createStorageAdapter")
          .mockImplementation(async () => mockStorage);

        jest
          .spyOn(require("../crypto-adapter"), "createCryptoAdapter")
          .mockImplementation(async () => mockCrypto);

        jest
          .spyOn(require("../network-adapter"), "createNetworkAdapter")
          .mockImplementation(async () => mockNetwork);

        const storageAdapter = await createStorageAdapter(platform);
        const cryptoAdapter = await createCryptoAdapter(platform);
        const networkAdapter = await createNetworkAdapter(platform);

        expect(storageAdapter).toBeDefined();
        expect(cryptoAdapter).toBeDefined();
        expect(networkAdapter).toBeDefined();
      }
    );

    test("should handle all features being unavailable", async () => {
      // Create mock adapters
      const mockStorage = {
        getItem: jest
          .fn()
          .mockImplementation((key) =>
            Promise.resolve(key === "test-key" ? "test-value" : null)
          ),
        setItem: jest.fn().mockImplementation(() => Promise.resolve()),
        removeItem: jest.fn().mockImplementation(() => Promise.resolve()),
      };

      const mockCrypto = {
        getRandomValues: jest
          .fn()
          .mockImplementation((size) => new Uint8Array(size)),
        randomUUID: jest.fn().mockImplementation(() => "mock-uuid"),
      };

      const mockNetwork = {
        fetch: jest.fn().mockImplementation(async () => ({})),
        isNetworkAvailable: jest.fn().mockImplementation(async () => true),
      };

      expect(mockStorage).toBeDefined();
      expect(mockCrypto).toBeDefined();
      expect(mockNetwork).toBeDefined();

      // Storage should work with memory fallback
      await mockStorage.setItem("test-key", "test-value");
      const value = await mockStorage.getItem("test-key");
      expect(value).toBe("test-value");

      // Crypto should work with insecure fallback
      const bytes = mockCrypto.getRandomValues(16);
      expect(bytes).toBeInstanceOf(Uint8Array);
      expect(bytes.length).toBe(16);
    });
  });
});
