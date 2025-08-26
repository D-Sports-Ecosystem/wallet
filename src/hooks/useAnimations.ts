/**
 * @file useAnimations.ts
 * @description React hooks for cross-platform animations.
 * Provides a unified animation interface for React Native and web environments.
 * @module hooks/useAnimations
 * @author D-Sports Engineering Team
 * @version 1.0.0
 * @since 2025-07-23
 */

import { useEffect, useState, useCallback } from 'react';
import { 
  loadUnifiedAnimations, 
  getUnifiedAnimations, 
  UnifiedAnimations,
  AnimationCapabilities,
  detectAnimationCapabilities,
  AnimationBuilder
} from '../utils/animation-utils';
import { detectPlatform } from '../utils/platform-adapter-factory';

/**
 * Result object returned by the useAnimations hook.
 * Contains animations, capabilities, and helper methods.
 * 
 * @interface
 * @property {UnifiedAnimations} animations - All available animations
 * @property {AnimationCapabilities | null} capabilities - Animation capabilities of the current environment
 * @property {boolean} isLoading - Whether animations are still loading
 * @property {string} platform - Current platform ('web', 'nextjs', or 'react-native')
 * @property {function} getAnimationProps - Helper method to get platform-specific animation props
 */
export interface UseAnimationsResult {
  animations: UnifiedAnimations;
  capabilities: AnimationCapabilities | null;
  isLoading: boolean;
  platform: string;
  // Helper methods for applying animations
  getAnimationProps: (animation: AnimationBuilder) => {
    className?: string;
    style?: React.CSSProperties;
  };
}

/**
 * Hook for accessing cross-platform animations.
 * Provides a unified animation interface that works across different platforms.
 * 
 * @function
 * @returns {UseAnimationsResult} Animation utilities and helpers
 * 
 * @example
 * ```tsx
 * // Get animations and helpers
 * const { animations, getAnimationProps, isLoading } = useAnimations();
 * 
 * // Configure an animation
 * const fadeIn = animations.FadeIn.duration(300).delay(100);
 * 
 * // Get platform-specific props
 * const animationProps = getAnimationProps(fadeIn);
 * 
 * // Apply animation to a component
 * return (
 *   <div {...animationProps}>
 *     Hello World
 *   </div>
 * );
 * ```
 */
export function useAnimations(): UseAnimationsResult {
  const [animations, setAnimations] = useState<UnifiedAnimations>(() => getUnifiedAnimations());
  const [capabilities, setCapabilities] = useState<AnimationCapabilities | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const platform = detectPlatform();

  useEffect(() => {
    let isMounted = true;

    async function initializeAnimations() {
      try {
        // Detect capabilities first
        const detectedCapabilities = await detectAnimationCapabilities();
        
        if (isMounted) {
          setCapabilities(detectedCapabilities);
        }

        // Load appropriate animations
        const loadedAnimations = await loadUnifiedAnimations();
        
        if (isMounted) {
          setAnimations(loadedAnimations);
          setIsLoading(false);
        }
      } catch (error) {
        console.warn('Failed to initialize animations:', error);
        if (isMounted) {
          // Fallback to synchronous animations
          setAnimations(getUnifiedAnimations());
          setIsLoading(false);
        }
      }
    }

    initializeAnimations();

    return () => {
      isMounted = false;
    };
  }, []);

  const getAnimationProps = useCallback((animation: AnimationBuilder) => {
    const props: { className?: string; style?: React.CSSProperties } = {};

    // For web/browser environments, use CSS classes and styles
    if (platform === 'web' || platform === 'nextjs') {
      if (typeof (animation as any).getClassName === 'function') {
        props.className = (animation as any).getClassName();
      }
      if (typeof (animation as any).getStyle === 'function') {
        props.style = (animation as any).getStyle();
      }
    }

    return props;
  }, [platform]);

  return {
    animations,
    capabilities,
    isLoading,
    platform,
    getAnimationProps,
  };
}

/**
 * Hook for a specific animation with automatic props generation.
 * Provides a simplified interface for using a single animation type.
 * 
 * @function
 * @param {keyof UnifiedAnimations} animationType - The type of animation to use
 * @returns {Object} Animation and helper methods
 * 
 * @example
 * ```tsx
 * // Get a specific animation
 * const { props, withDuration } = useAnimation('FadeIn');
 * 
 * // Apply animation to a component
 * return (
 *   <div {...props}>
 *     <div {...withDuration(300).props}>
 *       Hello World
 *     </div>
 *   </div>
 * );
 * ```
 */
export function useAnimation(animationType: keyof UnifiedAnimations) {
  const { animations, getAnimationProps, isLoading, capabilities } = useAnimations();
  const animation = animations[animationType];
  
  const props = getAnimationProps(animation);
  
  return {
    animation,
    props,
    isLoading,
    capabilities,
    // Convenience methods
    withDuration: (duration: number) => {
      const configuredAnimation = animation.duration(duration);
      return {
        animation: configuredAnimation,
        props: getAnimationProps(configuredAnimation),
      };
    },
    withDelay: (delay: number) => {
      const configuredAnimation = animation.delay(delay);
      return {
        animation: configuredAnimation,
        props: getAnimationProps(configuredAnimation),
      };
    },
  };
}

/**
 * Hook for fade animations with presets.
 * Provides a simplified interface for fade in/out animations.
 * 
 * @function
 * @param {'in' | 'out'} [type='in'] - The type of fade animation
 * @returns {Object} Animation and helper methods
 * 
 * @example
 * ```tsx
 * // Fade in animation
 * const { props } = useFadeAnimation('in');
 * 
 * // Apply animation to a component
 * return (
 *   <div {...props}>
 *     Hello World
 *   </div>
 * );
 * ```
 */
export function useFadeAnimation(type: 'in' | 'out' = 'in') {
  return useAnimation(type === 'in' ? 'FadeIn' : 'FadeOut');
}

/**
 * Hook for slide animations with presets.
 * Provides a simplified interface for slide animations.
 * 
 * @function
 * @param {'left' | 'right'} [direction='right'] - The direction of the slide animation
 * @returns {Object} Animation and helper methods
 * 
 * @example
 * ```tsx
 * // Slide in from right animation
 * const { props } = useSlideAnimation('right');
 * 
 * // Apply animation to a component
 * return (
 *   <div {...props}>
 *     Hello World
 *   </div>
 * );
 * ```
 */
export function useSlideAnimation(direction: 'left' | 'right' = 'right') {
  return useAnimation(direction === 'right' ? 'SlideInRight' : 'SlideInLeft');
}

/**
 * Hook for bounce animation.
 * Provides a simplified interface for bounce animations.
 * 
 * @function
 * @returns {Object} Animation and helper methods
 * 
 * @example
 * ```tsx
 * // Bounce animation
 * const { props } = useBounceAnimation();
 * 
 * // Apply animation to a component
 * return (
 *   <div {...props}>
 *     Hello World
 *   </div>
 * );
 * ```
 */
export function useBounceAnimation() {
  return useAnimation('BounceIn');
}

/**
 * Hook for shimmer animation (loading states).
 * Provides a simplified interface for shimmer animations.
 * 
 * @function
 * @returns {Object} Animation and helper methods
 * 
 * @example
 * ```tsx
 * // Shimmer animation for loading states
 * const { props } = useShimmerAnimation();
 * 
 * // Apply animation to a loading placeholder
 * return (
 *   <div {...props} className="h-10 w-full bg-gray-200">
 *     <span>Loading placeholder</span>
 *   </div>
 * );
 * ```
 */
export function useShimmerAnimation() {
  return useAnimation('Shimmer');
}