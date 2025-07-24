/**
 * @file animation-utils.ts
 * @description Cross-platform animation utilities with browser compatibility.
 * Provides a unified animation interface for React Native and web environments.
 * @module utils/animation-utils
 * @author D-Sports Engineering Team
 * @version 1.0.0
 * @since 2025-07-23
 */

import { detectPlatform } from './platform-adapter-factory';

/**
 * Configuration options for animations.
 * 
 * @interface
 * @property {number} [duration] - Animation duration in milliseconds
 * @property {number} [delay] - Animation delay in milliseconds
 * @property {('ease'|'ease-in'|'ease-out'|'ease-in-out'|'linear')} [easing] - Animation easing function
 */
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
}

/**
 * Unified animation builder interface for creating animations.
 * Provides a fluent API for configuring animations.
 * 
 * @interface
 * @property {function} duration - Sets the animation duration
 * @property {function} delay - Sets the animation delay
 * @property {function} [easing] - Sets the animation easing function
 */
export interface AnimationBuilder {
  duration(duration: number): AnimationBuilder;
  delay(delay: number): AnimationBuilder;
  easing?(easing: AnimationConfig['easing']): AnimationBuilder;
}

/**
 * CSS animation class names for browser environments.
 * Maps animation types to their corresponding CSS class names.
 * 
 * @interface
 * @property {string} fadeIn - CSS class for fade in animation
 * @property {string} fadeOut - CSS class for fade out animation
 * @property {string} slideInRight - CSS class for slide in from right animation
 * @property {string} slideInLeft - CSS class for slide in from left animation
 * @property {string} bounceIn - CSS class for bounce in animation
 * @property {string} shimmer - CSS class for shimmer animation
 */
export interface CSSAnimationClasses {
  fadeIn: string;
  fadeOut: string;
  slideInRight: string;
  slideInLeft: string;
  bounceIn: string;
  shimmer: string;
}

/**
 * Animation capabilities detection result.
 * Indicates which animation technologies are available in the current environment.
 * 
 * @interface
 * @property {boolean} hasReanimated - Whether React Native Reanimated is available
 * @property {boolean} hasCSSAnimations - Whether CSS animations are supported
 * @property {boolean} hasWebAnimations - Whether Web Animations API is supported
 * @property {boolean} hasTransitions - Whether CSS transitions are supported
 */
export interface AnimationCapabilities {
  hasReanimated: boolean;
  hasCSSAnimations: boolean;
  hasWebAnimations: boolean;
  hasTransitions: boolean;
}

/**
 * Detects animation capabilities available in the current environment.
 * Checks for React Native Reanimated, CSS animations, Web Animations API, and CSS transitions.
 * 
 * @async
 * @function
 * @returns {Promise<AnimationCapabilities>} Object indicating which animation technologies are available
 * 
 * @example
 * ```typescript
 * // Detect animation capabilities
 * const capabilities = await detectAnimationCapabilities();
 * 
 * if (capabilities.hasReanimated) {
 *   console.log('React Native Reanimated is available');
 * }
 * 
 * if (capabilities.hasCSSAnimations) {
 *   console.log('CSS animations are supported');
 * }
 * ```
 */
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

/**
 * CSS animation class names for browser environments.
 * These classes are used as fallbacks when React Native Reanimated is not available.
 * 
 * @constant
 * @type {CSSAnimationClasses}
 * 
 * @example
 * ```typescript
 * // Get the CSS class for fade in animation
 * const fadeInClass = cssAnimationClasses.fadeIn;
 * 
 * // Apply the class to an element
 * element.classList.add(fadeInClass);
 * ```
 */
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

/**
 * Unified animation interface providing access to all available animations.
 * Works across different platforms (web, Next.js, React Native) with a consistent API.
 * 
 * @interface
 * @property {AnimationBuilder} FadeIn - Fade in animation
 * @property {AnimationBuilder} FadeOut - Fade out animation
 * @property {AnimationBuilder} SlideInRight - Slide in from right animation
 * @property {AnimationBuilder} SlideInLeft - Slide in from left animation
 * @property {AnimationBuilder} BounceIn - Bounce in animation
 * @property {AnimationBuilder} Shimmer - Shimmer animation
 */
export interface UnifiedAnimations {
  FadeIn: AnimationBuilder;
  FadeOut: AnimationBuilder;
  SlideInRight: AnimationBuilder;
  SlideInLeft: AnimationBuilder;
  BounceIn: AnimationBuilder;
  Shimmer: AnimationBuilder;
}

/**
 * Asynchronously loads animations based on platform and capabilities.
 * Automatically selects the best animation implementation for the current environment.
 * 
 * @async
 * @function
 * @returns {Promise<UnifiedAnimations>} Object containing all available animations
 * 
 * @example
 * ```typescript
 * // Load animations
 * const animations = await loadUnifiedAnimations();
 * 
 * // Use fade in animation
 * const fadeIn = animations.FadeIn.duration(300).delay(100);
 * 
 * // Apply animation to a React component
 * return (
 *   <Animated.View style={fadeIn.getStyle()}>
 *     <Text>Hello World</Text>
 *   </Animated.View>
 * );
 * ```
 */
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

/**
 * Synchronously gets animations for immediate access.
 * Uses CSS animations by default for web environments and tries to load Reanimated synchronously for React Native.
 * 
 * @function
 * @returns {UnifiedAnimations} Object containing all available animations
 * 
 * @example
 * ```typescript
 * // Get animations synchronously
 * const animations = getUnifiedAnimations();
 * 
 * // Use fade in animation
 * const fadeIn = animations.FadeIn.duration(300);
 * 
 * // Apply animation to a React component
 * return (
 *   <div className={fadeIn.getClassName()}>
 *     Hello World
 *   </div>
 * );
 * ```
 */
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

/**
 * Legacy function for loading animations asynchronously.
 * Kept for backward compatibility.
 * 
 * @deprecated Use getUnifiedAnimations() instead
 * @async
 * @function
 * @returns {Promise<{FadeIn: AnimationBuilder, FadeOut: AnimationBuilder}>} Limited set of animations
 */
export async function loadSafeAnimations() {
  const unified = await loadUnifiedAnimations();
  return {
    FadeIn: unified.FadeIn,
    FadeOut: unified.FadeOut,
  };
}

/**
 * Legacy function for getting animations synchronously.
 * Kept for backward compatibility.
 * 
 * @deprecated Use getUnifiedAnimations() instead
 * @function
 * @returns {{FadeIn: AnimationBuilder, FadeOut: AnimationBuilder}} Limited set of animations
 */
export function getSafeAnimations() {
  const unified = getUnifiedAnimations();
  return {
    FadeIn: unified.FadeIn,
    FadeOut: unified.FadeOut,
  };
}

/**
 * Pre-loaded animations for immediate use.
 * Contains all available animations for the current environment.
 * 
 * @constant
 * @type {UnifiedAnimations}
 * 
 * @example
 * ```typescript
 * // Use pre-loaded animations
 * import { animations } from '@d-sports/wallet/utils/animation-utils';
 * 
 * // Apply fade in animation
 * return (
 *   <div className={animations.FadeIn.duration(300).getClassName()}>
 *     Hello World
 *   </div>
 * );
 * ```
 */
export const animations = getUnifiedAnimations();

/**
 * Individual animations exported for convenience.
 * These are pre-loaded and ready to use.
 * 
 * @example
 * ```typescript
 * // Import individual animations
 * import { FadeIn, SlideInRight } from '@d-sports/wallet/utils/animation-utils';
 * 
 * // Apply animations
 * return (
 *   <div className={FadeIn.duration(300).getClassName()}>
 *     <div className={SlideInRight.duration(500).delay(100).getClassName()}>
 *       Hello World
 *     </div>
 *   </div>
 * );
 * ```
 */
export const { FadeIn, FadeOut, SlideInRight, SlideInLeft, BounceIn, Shimmer } = animations;