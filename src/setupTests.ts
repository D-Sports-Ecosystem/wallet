// Jest setup file
import 'jest-environment-jsdom';

// Mock crypto for tests
Object.defineProperty(globalThis, 'crypto', {
  value: {
    getRandomValues: (arr: Uint8Array) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    },
    subtle: {
      digest: async (algorithm: string, data: Uint8Array) => {
        // Simple mock implementation
        return new Uint8Array(32).fill(0);
      }
    }
  }
});

// Mock localStorage
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  }
});

// Mock window.open for social login tests
Object.defineProperty(globalThis, 'window', {
  value: {
    ...global.window,
    open: jest.fn(),
    location: {
      origin: 'http://localhost:3000'
    }
  }
});

// Mock fetch
globalThis.fetch = jest.fn(); 