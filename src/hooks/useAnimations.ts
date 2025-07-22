/**
 * React hook for cross-platform animations
 * Provides unified animation interface for React Native and web environments
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
 * Hook for accessing cross-platform animations
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
 * Hook for a specific animation with automatic props generation
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
 * Hook for fade animations with presets
 */
export function useFadeAnimation(type: 'in' | 'out' = 'in') {
  return useAnimation(type === 'in' ? 'FadeIn' : 'FadeOut');
}

/**
 * Hook for slide animations with presets
 */
export function useSlideAnimation(direction: 'left' | 'right' = 'right') {
  return useAnimation(direction === 'right' ? 'SlideInRight' : 'SlideInLeft');
}

/**
 * Hook for bounce animation
 */
export function useBounceAnimation() {
  return useAnimation('BounceIn');
}

/**
 * Hook for shimmer animation (loading states)
 */
export function useShimmerAnimation() {
  return useAnimation('Shimmer');
}