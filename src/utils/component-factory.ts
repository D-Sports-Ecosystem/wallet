import React from 'react';

// Define platform-specific component interfaces
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

// React Native implementations (lazy loaded)
let reactNativeComponents: PlatformComponents | null = null;

function getReactNativeComponents(): PlatformComponents {
  if (reactNativeComponents) {
    return reactNativeComponents;
  }

  try {
    // Dynamically import React Native components
    const RN = require('react-native');
    reactNativeComponents = {
      View: RN.View,
      Text: RN.Text,
      Pressable: RN.Pressable,
      TextInput: RN.TextInput,
      ScrollView: RN.ScrollView,
      Image: RN.Image,
      ActivityIndicator: RN.ActivityIndicator,
      FlatList: RN.FlatList,
    };
    return reactNativeComponents;
  } catch (error) {
    // Fallback to web components if React Native is not available
    return webComponents;
  }
}

// Platform detection
function isReactNative(): boolean {
  return typeof navigator !== 'undefined' && navigator.product === 'ReactNative';
}

// Export platform-specific components
export function getPlatformComponents(): PlatformComponents {
  if (isReactNative()) {
    return getReactNativeComponents();
  }
  return webComponents;
}

// Export individual components for convenience
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