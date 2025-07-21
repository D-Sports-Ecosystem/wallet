// Platform detection utility for cross-platform compatibility

export type Platform = 'web' | 'nextjs' | 'react-native';

export function detectPlatform(): Platform {
  // Check if we're in React Native
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return 'react-native';
  }
  
  // Check if we're in Next.js
  if (typeof window !== 'undefined' && (window as any).next) {
    return 'nextjs';
  }
  
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    return 'web';
  }
  
  // Default to Next.js for server-side rendering
  return 'nextjs';
}

export const isReactNative = () => detectPlatform() === 'react-native';
export const isWeb = () => detectPlatform() === 'web';
export const isNextJS = () => detectPlatform() === 'nextjs';
export const isBrowser = () => typeof window !== 'undefined';