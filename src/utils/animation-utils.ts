/**
 * Cross-platform animation utilities with browser compatibility
 * Provides unified animation interface for React Native and web environments
 */

import { detectPlatform } from './platform-adapter-factory';

// Animation configuration interface
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
}

// Unified animation builder interface
export interface AnimationBuilder {
  duration(duration: number): AnimationBuilder;
  delay(delay: number): AnimationBuilder;
  easing?(easing: AnimationConfig['easing']): AnimationBuilder;
}

// CSS animation class names for browser environments
export interface CSSAnimationClasses {
  fadeIn: string;
  fadeOut: string;
  slideInRight: string;
  slideInLeft: string;
  bounceIn: string;
  shimmer: string;
}

// Animation capabilities detection
export interface AnimationCapabilities {
  hasReanimated: boolean;
  hasCSSAnimations: boolean;
  hasWebAnimations: boolean;
  hasTransitions: boolean;
}

// Detect animation capabilities
export async function detectAnimationCapabilities(): Promise<AnimationCapabilities> {
  const capabilities: AnimationCapabilities = {
    hasReanimated: false,
    hasCSSAnimations: false,
    hasWebAnimations: false,
    hasTransitions: false,
  };

  const platform = detectPlatform();

  // Check for React Native Reanimated
  if (platform === 'react-native') {
    try {
      await import('react-native-reanimated');
      capabilities.hasReanimated = true;
    } catch {
      capabilities.hasReanimated = false;
    }
  }

  // Check for browser animation capabilities
  if (typeof window !== 'undefined') {
    // Check CSS animations support
    const testElement = document.createElement('div');
    capabilities.hasCSSAnimations = 
      'animationName' in testElement.style ||
      'webkitAnimationName' in testElement.style;

    // Check CSS transitions support
    capabilities.hasTransitions = 
      'transition' in testElement.style ||
      'webkitTransition' in testElement.style;

    // Check Web Animations API
    capabilities.hasWebAnimations = 'animate' in testElement;
  }

  return capabilities;
}

// CSS-based animation fallbacks for browser environments
export const cssAnimationClasses: CSSAnimationClasses = {
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',
  slideInRight: 'animate-slide-in-right',
  slideInLeft: 'animate-slide-in-left',
  bounceIn: 'animate-bounce-in',
  shimmer: 'animate-shimmer',
};

// Create CSS-based animation builder
function createCSSAnimationBuilder(className: string): AnimationBuilder {
  let config: AnimationConfig = {};
  
  const builder: AnimationBuilder = {
    duration: (duration: number) => {
      config.duration = duration;
      return builder;
    },
    delay: (delay: number) => {
      config.delay = delay;
      return builder;
    },
    easing: (easing: AnimationConfig['easing']) => {
      config.easing = easing;
      return builder;
    },
  };

  // Add CSS class application method
  (builder as any).getClassName = () => {
    let classes = className;
    if (config.delay) {
      if (config.delay === 150) classes += ' animation-delay-150';
      else if (config.delay === 300) classes += ' animation-delay-300';
      else if (config.delay === 450) classes += ' animation-delay-450';
    }
    return classes;
  };

  (builder as any).getStyle = () => {
    const style: React.CSSProperties = {};
    if (config.duration) {
      style.animationDuration = `${config.duration}ms`;
    }
    if (config.delay) {
      style.animationDelay = `${config.delay}ms`;
    }
    if (config.easing) {
      style.animationTimingFunction = config.easing;
    }
    return style;
  };

  return builder;
}

// Create React Native Reanimated animation builder
async function createReanimatedAnimationBuilder(animationType: string): Promise<AnimationBuilder> {
  try {
    const reanimated = await import('react-native-reanimated');
    const animation = (reanimated as any)[animationType];
    
    if (animation) {
      return animation;
    }
  } catch (error) {
    console.warn(`React Native Reanimated ${animationType} not available:`, error);
  }

  // Fallback to no-op builder
  return createFallbackAnimationBuilder();
}

// Create fallback animation builder for unsupported environments
function createFallbackAnimationBuilder(): AnimationBuilder {
  const builder: AnimationBuilder = {
    duration: () => builder,
    delay: () => builder,
    easing: () => builder,
  };

  // Add no-op methods
  (builder as any).getClassName = () => '';
  (builder as any).getStyle = () => ({});

  return builder;
}

// Unified animation interface
export interface UnifiedAnimations {
  FadeIn: AnimationBuilder;
  FadeOut: AnimationBuilder;
  SlideInRight: AnimationBuilder;
  SlideInLeft: AnimationBuilder;
  BounceIn: AnimationBuilder;
  Shimmer: AnimationBuilder;
}

// Load animations based on platform and capabilities
export async function loadUnifiedAnimations(): Promise<UnifiedAnimations> {
  const capabilities = await detectAnimationCapabilities();
  const platform = detectPlatform();

  // Use React Native Reanimated if available
  if (platform === 'react-native' && capabilities.hasReanimated) {
    try {
      return {
        FadeIn: await createReanimatedAnimationBuilder('FadeIn'),
        FadeOut: await createReanimatedAnimationBuilder('FadeOut'),
        SlideInRight: await createReanimatedAnimationBuilder('SlideInRight'),
        SlideInLeft: await createReanimatedAnimationBuilder('SlideInLeft'),
        BounceIn: await createReanimatedAnimationBuilder('BounceIn'),
        Shimmer: createFallbackAnimationBuilder(), // Not available in Reanimated
      };
    } catch (error) {
      console.warn('Failed to load React Native Reanimated animations:', error);
    }
  }

  // Use CSS animations for browser environments
  if (capabilities.hasCSSAnimations || capabilities.hasTransitions) {
    return {
      FadeIn: createCSSAnimationBuilder(cssAnimationClasses.fadeIn),
      FadeOut: createCSSAnimationBuilder(cssAnimationClasses.fadeOut),
      SlideInRight: createCSSAnimationBuilder(cssAnimationClasses.slideInRight),
      SlideInLeft: createCSSAnimationBuilder(cssAnimationClasses.slideInLeft),
      BounceIn: createCSSAnimationBuilder(cssAnimationClasses.bounceIn),
      Shimmer: createCSSAnimationBuilder(cssAnimationClasses.shimmer),
    };
  }

  // Fallback for environments without animation support
  console.warn('No animation capabilities detected, using fallback animations');
  return {
    FadeIn: createFallbackAnimationBuilder(),
    FadeOut: createFallbackAnimationBuilder(),
    SlideInRight: createFallbackAnimationBuilder(),
    SlideInLeft: createFallbackAnimationBuilder(),
    BounceIn: createFallbackAnimationBuilder(),
    Shimmer: createFallbackAnimationBuilder(),
  };
}

// Synchronous version for immediate access (uses CSS animations by default)
export function getUnifiedAnimations(): UnifiedAnimations {
  const platform = detectPlatform();

  // For browser environments, return CSS-based animations immediately
  if (platform === 'web' || platform === 'nextjs') {
    return {
      FadeIn: createCSSAnimationBuilder(cssAnimationClasses.fadeIn),
      FadeOut: createCSSAnimationBuilder(cssAnimationClasses.fadeOut),
      SlideInRight: createCSSAnimationBuilder(cssAnimationClasses.slideInRight),
      SlideInLeft: createCSSAnimationBuilder(cssAnimationClasses.slideInLeft),
      BounceIn: createCSSAnimationBuilder(cssAnimationClasses.bounceIn),
      Shimmer: createCSSAnimationBuilder(cssAnimationClasses.shimmer),
    };
  }

  // For React Native, try to load Reanimated synchronously
  if (platform === 'react-native') {
    try {
      const reanimated = require('react-native-reanimated');
      return {
        FadeIn: reanimated.FadeIn || createFallbackAnimationBuilder(),
        FadeOut: reanimated.FadeOut || createFallbackAnimationBuilder(),
        SlideInRight: reanimated.SlideInRight || createFallbackAnimationBuilder(),
        SlideInLeft: reanimated.SlideInLeft || createFallbackAnimationBuilder(),
        BounceIn: reanimated.BounceIn || createFallbackAnimationBuilder(),
        Shimmer: createFallbackAnimationBuilder(),
      };
    } catch (error) {
      console.warn('React Native Reanimated not available, using fallback:', error);
    }
  }

  // Fallback animations
  return {
    FadeIn: createFallbackAnimationBuilder(),
    FadeOut: createFallbackAnimationBuilder(),
    SlideInRight: createFallbackAnimationBuilder(),
    SlideInLeft: createFallbackAnimationBuilder(),
    BounceIn: createFallbackAnimationBuilder(),
    Shimmer: createFallbackAnimationBuilder(),
  };
}

// Legacy compatibility - keep existing exports but mark as deprecated
/** @deprecated Use getUnifiedAnimations() instead */
export async function loadSafeAnimations() {
  const unified = await loadUnifiedAnimations();
  return {
    FadeIn: unified.FadeIn,
    FadeOut: unified.FadeOut,
  };
}

/** @deprecated Use getUnifiedAnimations() instead */
export function getSafeAnimations() {
  const unified = getUnifiedAnimations();
  return {
    FadeIn: unified.FadeIn,
    FadeOut: unified.FadeOut,
  };
}

// Export individual animations for convenience
export const animations = getUnifiedAnimations();
export const { FadeIn, FadeOut, SlideInRight, SlideInLeft, BounceIn, Shimmer } = animations;