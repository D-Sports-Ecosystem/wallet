import React from 'react';

// Define platform-specific component interfaces with proper typing
export interface PlatformComponents {
  View: React.ComponentType<any>;
  Text: React.ComponentType<any>;
  Pressable: React.ComponentType<any>;
  TextInput: React.ComponentType<any>;
  ScrollView: React.ComponentType<any>;
  Image: React.ComponentType<any>;
  ActivityIndicator: React.ComponentType<any>;
  FlatList: React.ComponentType<any>;
}

// Component factory interface for type safety
export interface ComponentFactory {
  createComponents(): Promise<PlatformComponents>;
  getComponents(): PlatformComponents;
  isReactNativeAvailable(): boolean;
}

// Error types for component factory
export class ComponentFactoryError extends Error {
  constructor(
    public platform: string,
    public componentName: string,
    public originalError?: Error
  ) {
    super(`Failed to load ${componentName} for platform ${platform}: ${originalError?.message || 'Unknown error'}`);
    this.name = 'ComponentFactoryError';
  }
}

// Web/DOM implementations
const webComponents: PlatformComponents = {
  View: ({ children, className, style, ...props }) => 
    React.createElement('div', { className, style, ...props }, children),
  
  Text: ({ children, className, style, ...props }) => 
    React.createElement('span', { className, style, ...props }, children),
  
  Pressable: ({ children, className, style, onPress, disabled, ...props }) => 
    React.createElement('button', { 
      className, 
      style, 
      onClick: onPress, 
      disabled,
      ...props 
    }, children),
  
  TextInput: ({ className, style, placeholder, value, onChangeText, ...props }) => 
    React.createElement('input', { 
      className, 
      style, 
      placeholder, 
      value, 
      onChange: (e: any) => onChangeText?.(e.target.value),
      ...props 
    }),
  
  ScrollView: ({ children, className, style, ...props }) => 
    React.createElement('div', { 
      className: `overflow-auto ${className || ''}`, 
      style, 
      ...props 
    }, children),
  
  Image: ({ source, className, style, ...props }) => 
    React.createElement('img', { 
      src: typeof source === 'object' ? source.uri : source, 
      className, 
      style, 
      ...props 
    }),
  
  ActivityIndicator: ({ className, style, ...props }) => 
    React.createElement('div', { 
      className: `animate-spin rounded-full h-6 w-6 border-b-2 border-current ${className || ''}`, 
      style, 
      ...props 
    }),
  
  FlatList: ({ data, renderItem, keyExtractor, className, style, ...props }) => 
    React.createElement('div', { className, style, ...props }, 
      data?.map((item: any, index: number) => 
        React.createElement('div', { 
          key: keyExtractor ? keyExtractor(item, index) : index 
        }, renderItem({ item, index }))
      )
    ),
};

// React Native implementations (lazy loaded with proper error handling)
let reactNativeComponents: PlatformComponents | null = null;
let reactNativeLoadPromise: Promise<PlatformComponents> | null = null;

async function loadReactNativeComponents(): Promise<PlatformComponents> {
  try {
    // Use dynamic import instead of require for better bundling
    const RN = await import('react-native').catch(() => {
      // If dynamic import fails, try require as fallback
      return require('react-native');
    });
    
    const components: PlatformComponents = {
      View: RN.View,
      Text: RN.Text,
      Pressable: RN.Pressable,
      TextInput: RN.TextInput,
      ScrollView: RN.ScrollView,
      Image: RN.Image,
      ActivityIndicator: RN.ActivityIndicator,
      FlatList: RN.FlatList,
    };

    // Validate that all components are available
    const missingComponents = Object.entries(components)
      .filter(([_, component]) => !component)
      .map(([name]) => name);

    if (missingComponents.length > 0) {
      console.warn(`Missing React Native components: ${missingComponents.join(', ')}`);
      // Return web components for missing ones
      return { ...webComponents, ...components };
    }

    return components;
  } catch (error) {
    console.warn('React Native components not available, falling back to web components:', error);
    throw new ComponentFactoryError('react-native', 'all', error as Error);
  }
}

async function getReactNativeComponents(): Promise<PlatformComponents> {
  if (reactNativeComponents) {
    return reactNativeComponents;
  }

  // Ensure we only load once, even with concurrent calls
  if (!reactNativeLoadPromise) {
    reactNativeLoadPromise = loadReactNativeComponents();
  }

  try {
    reactNativeComponents = await reactNativeLoadPromise;
    return reactNativeComponents;
  } catch (error) {
    // Reset promise so we can retry later
    reactNativeLoadPromise = null;
    // Return web components as graceful fallback
    return webComponents;
  }
}

// Synchronous fallback for immediate access (returns web components if RN not loaded)
function getReactNativeComponentsSync(): PlatformComponents {
  if (reactNativeComponents) {
    return reactNativeComponents;
  }

  try {
    // Try synchronous require as last resort
    const RN = require('react-native');
    const components: PlatformComponents = {
      View: RN.View,
      Text: RN.Text,
      Pressable: RN.Pressable,
      TextInput: RN.TextInput,
      ScrollView: RN.ScrollView,
      Image: RN.Image,
      ActivityIndicator: RN.ActivityIndicator,
      FlatList: RN.FlatList,
    };
    
    reactNativeComponents = components;
    return components;
  } catch (error) {
    console.warn('React Native components not available synchronously, using web fallback');
    return webComponents;
  }
}

// Enhanced platform detection
function isReactNative(): boolean {
  return (
    typeof navigator !== 'undefined' && 
    navigator.product === 'ReactNative'
  ) || (
    typeof global !== 'undefined' && 
    global.navigator?.product === 'ReactNative'
  );
}

function isReactNativeAvailable(): boolean {
  try {
    require.resolve('react-native');
    return true;
  } catch {
    return false;
  }
}

// Component factory implementation
class PlatformComponentFactory implements ComponentFactory {
  private components: PlatformComponents | null = null;
  private loadingPromise: Promise<PlatformComponents> | null = null;

  async createComponents(): Promise<PlatformComponents> {
    if (this.components) {
      return this.components;
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = this.loadComponents();
    this.components = await this.loadingPromise;
    return this.components;
  }

  private async loadComponents(): Promise<PlatformComponents> {
    if (isReactNative() && this.isReactNativeAvailable()) {
      try {
        return await getReactNativeComponents();
      } catch (error) {
        console.warn('Failed to load React Native components, falling back to web:', error);
        return webComponents;
      }
    }
    return webComponents;
  }

  getComponents(): PlatformComponents {
    if (this.components) {
      return this.components;
    }

    // Synchronous fallback
    if (isReactNative() && this.isReactNativeAvailable()) {
      return getReactNativeComponentsSync();
    }
    
    return webComponents;
  }

  isReactNativeAvailable(): boolean {
    return isReactNativeAvailable();
  }
}

// Singleton factory instance
const componentFactory = new PlatformComponentFactory();

// Export async function for proper component loading
export async function createPlatformComponents(): Promise<PlatformComponents> {
  return componentFactory.createComponents();
}

// Export synchronous function for immediate access (with fallbacks)
export function getPlatformComponents(): PlatformComponents {
  return componentFactory.getComponents();
}

// Export factory instance for advanced usage
export { componentFactory };

// Export individual components for convenience (synchronous access)
export const {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
  FlatList,
} = getPlatformComponents();

// Export async individual components for proper loading
export async function getAsyncComponents() {
  const components = await createPlatformComponents();
  return {
    View: components.View,
    Text: components.Text,
    Pressable: components.Pressable,
    TextInput: components.TextInput,
    ScrollView: components.ScrollView,
    Image: components.Image,
    ActivityIndicator: components.ActivityIndicator,
    FlatList: components.FlatList,
  };
}