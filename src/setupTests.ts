/ Jest setup file
import 'jest-environment-jsdom';
import '@testing-library/jest-dom';

// Extend Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string): R;
      toHaveStyle(style: string | object): R;
    }
  }
}

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

// Mock sessionStorage
Object.defineProperty(globalThis, 'sessionStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  }
});

// Mock document methods that might be missing
Object.defineProperty(document, 'activeElement', {
  value: null,
  writable: true
});

Object.defineProperty(document, 'getSelection', {
  value: () => ({
    rangeCount: 0,
    getRangeAt: () => ({
      cloneContents: () => document.createDocumentFragment()
    })
  })
});

// Mock window methods
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ''
  })
});

Object.defineProperty(window, 'matchMedia', {
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }))
});

// Mock ResizeObserver
globalThis.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
globalThis.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.open for social login tests
Object.defineProperty(globalThis, 'window', {
  value: {
    ...globalThis.window,
    open: jest.fn(),
    location: {
      origin: 'http://localhost:3000'
    }
  },
  writable: true
});

// Mock fetch
globalThis.fetch = jest.fn();

// Suppress React 18 warnings for tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
