/**
 * Tests for component factory dynamic imports and error handling
 */

import { 
  getPlatformComponents, 
  createPlatformComponents, 
  componentFactory,
  ComponentFactoryError,
  type PlatformComponents 
} from '../component-factory';

// Mock React Native detection
jest.mock('../platform-detection', () => ({
  isReactNative: jest.fn(() => false),
}));

describe('Component Factory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPlatformComponents', () => {
    it('should return web components when not in React Native environment', () => {
      const components = getPlatformComponents();
      
      expect(components).toBeDefined();
      expect(components.View).toBeDefined();
      expect(components.Text).toBeDefined();
      expect(components.Pressable).toBeDefined();
      expect(components.TextInput).toBeDefined();
      expect(components.ScrollView).toBeDefined();
      expect(components.Image).toBeDefined();
      expect(components.ActivityIndicator).toBeDefined();
      expect(components.FlatList).toBeDefined();
    });

    it('should return components with proper interfaces', () => {
      const components = getPlatformComponents();
      
      // All components should be React component types
      Object.values(components).forEach(component => {
        expect(typeof component).toBe('function');
      });
    });
  });

  describe('createPlatformComponents', () => {
    it('should return a promise that resolves to platform components', async () => {
      const components = await createPlatformComponents();
      
      expect(components).toBeDefined();
      expect(components.View).toBeDefined();
      expect(components.Text).toBeDefined();
    });

    it('should handle multiple concurrent calls correctly', async () => {
      const promises = [
        createPlatformComponents(),
        createPlatformComponents(),
        createPlatformComponents(),
      ];
      
      const results = await Promise.all(promises);
      
      // All results should be the same instance
      expect(results[0]).toBe(results[1]);
      expect(results[1]).toBe(results[2]);
    });
  });

  describe('ComponentFactoryError', () => {
    it('should create error with proper message and properties', () => {
      const originalError = new Error('Original error');
      const error = new ComponentFactoryError('react-native', 'View', originalError);
      
      expect(error.name).toBe('ComponentFactoryError');
      expect(error.platform).toBe('react-native');
      expect(error.componentName).toBe('View');
      expect(error.originalError).toBe(originalError);
      expect(error.message).toContain('Failed to load View for platform react-native');
    });
  });

  describe('componentFactory', () => {
    it('should provide isReactNativeAvailable method', () => {
      expect(typeof componentFactory.isReactNativeAvailable).toBe('function');
      expect(typeof componentFactory.isReactNativeAvailable()).toBe('boolean');
    });

    it('should cache components after first load', async () => {
      const components1 = await componentFactory.createComponents();
      const components2 = await componentFactory.createComponents();
      
      expect(components1).toBe(components2);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing React Native gracefully', () => {
      // This test verifies that the factory doesn't throw when RN is not available
      expect(() => getPlatformComponents()).not.toThrow();
    });

    it('should provide fallback components when React Native is unavailable', () => {
      const components = getPlatformComponents();
      
      // Should still provide all required components
      expect(Object.keys(components)).toEqual([
        'View', 'Text', 'Pressable', 'TextInput', 
        'ScrollView', 'Image', 'ActivityIndicator', 'FlatList'
      ]);
    });
  });

  describe('Individual Component Exports', () => {
    it('should export individual components', () => {
      const { 
        View, Text, Pressable, TextInput, 
        ScrollView, Image, ActivityIndicator, FlatList 
      } = require('../component-factory');
      
      expect(View).toBeDefined();
      expect(Text).toBeDefined();
      expect(Pressable).toBeDefined();
      expect(TextInput).toBeDefined();
      expect(ScrollView).toBeDefined();
      expect(Image).toBeDefined();
      expect(ActivityIndicator).toBeDefined();
      expect(FlatList).toBeDefined();
    });
  });
});