/**
 * Animated wrapper component for cross-platform animations
 * Provides a unified way to apply animations to any component
 */

import React, { forwardRef, useEffect, useState } from 'react';
import { useAnimations, useAnimation } from '../hooks/useAnimations';
import { UnifiedAnimations, AnimationBuilder } from '../utils/animation-utils';

export interface AnimatedWrapperProps {
  children: React.ReactNode;
  animation?: keyof UnifiedAnimations | AnimationBuilder;
  duration?: number;
  delay?: number;
  easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
  trigger?: boolean; // When true, animation plays
  className?: string;
  style?: React.CSSProperties;
  onAnimationComplete?: () => void;
}

/**
 * Wrapper component that applies animations to its children
 */
export const AnimatedWrapper = forwardRef<HTMLDivElement, AnimatedWrapperProps>(
  ({ 
    children, 
    animation = 'FadeIn', 
    duration, 
    delay, 
    easing,
    trigger = true,
    className = '',
    style = {},
    onAnimationComplete,
    ...props 
  }, ref) => {
    const { animations, getAnimationProps, platform } = useAnimations();
    const [isVisible, setIsVisible] = useState(!trigger);

    // Get the animation builder
    let animationBuilder: AnimationBuilder;
    if (typeof animation === 'string') {
      animationBuilder = animations[animation];
    } else {
      animationBuilder = animation;
    }

    // Configure animation with provided options
    if (duration) {
      animationBuilder = animationBuilder.duration(duration);
    }
    if (delay) {
      animationBuilder = animationBuilder.delay(delay);
    }
    if (easing && animationBuilder.easing) {
      animationBuilder = animationBuilder.easing(easing);
    }

    // Get animation props
    const animationProps = getAnimationProps(animationBuilder);

    // Handle animation trigger
    useEffect(() => {
      if (trigger) {
        setIsVisible(true);
        
        // Handle animation completion callback
        if (onAnimationComplete) {
          const totalDuration = (duration || 500) + (delay || 0);
          const timer = setTimeout(onAnimationComplete, totalDuration);
          return () => clearTimeout(timer);
        }
      } else {
        setIsVisible(false);
      }
    }, [trigger, duration, delay, onAnimationComplete]);

    // Combine classes and styles
    const combinedClassName = [
      className,
      animationProps.className,
      !isVisible && 'opacity-0'
    ].filter(Boolean).join(' ');

    const combinedStyle = {
      ...style,
      ...animationProps.style,
    };

    // For React Native, we might need to handle this differently
    if (platform === 'react-native') {
      // In React Native, we would use the Reanimated.View component
      // For now, we'll use a regular View with the animation applied
      const View = require('react-native').View;
      
      return (
        <View style={combinedStyle} {...props}>
          {children}
        </View>
      );
    }

    // For web environments, use a div with CSS animations
    return (
      <div
        ref={ref}
        className={combinedClassName}
        style={combinedStyle}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AnimatedWrapper.displayName = 'AnimatedWrapper';

/**
 * Preset animated components for common use cases
 */

export const FadeInWrapper: React.FC<Omit<AnimatedWrapperProps, 'animation'>> = (props) => (
  <AnimatedWrapper animation="FadeIn" {...props} />
);

export const FadeOutWrapper: React.FC<Omit<AnimatedWrapperProps, 'animation'>> = (props) => (
  <AnimatedWrapper animation="FadeOut" {...props} />
);

export const SlideInRightWrapper: React.FC<Omit<AnimatedWrapperProps, 'animation'>> = (props) => (
  <AnimatedWrapper animation="SlideInRight" {...props} />
);

export const SlideInLeftWrapper: React.FC<Omit<AnimatedWrapperProps, 'animation'>> = (props) => (
  <AnimatedWrapper animation="SlideInLeft" {...props} />
);

export const BounceInWrapper: React.FC<Omit<AnimatedWrapperProps, 'animation'>> = (props) => (
  <AnimatedWrapper animation="BounceIn" {...props} />
);

export const ShimmerWrapper: React.FC<Omit<AnimatedWrapperProps, 'animation'>> = (props) => (
  <AnimatedWrapper animation="Shimmer" {...props} />
);

/**
 * Higher-order component for adding animations to existing components
 */
export function withAnimation<P extends object>(
  Component: React.ComponentType<P>,
  defaultAnimation: keyof UnifiedAnimations = 'FadeIn'
) {
  const AnimatedComponent = forwardRef<any, P & Partial<AnimatedWrapperProps>>((props, ref) => {
    const { animation, duration, delay, easing, trigger, className, style, onAnimationComplete, ...componentProps } = props;

    return (
      <AnimatedWrapper
        animation={animation || defaultAnimation}
        duration={duration}
        delay={delay}
        easing={easing}
        trigger={trigger}
        className={className}
        style={style}
        onAnimationComplete={onAnimationComplete}
      >
        <Component ref={ref} {...(componentProps as P)} />
      </AnimatedWrapper>
    );
  });

  AnimatedComponent.displayName = `withAnimation(${Component.displayName || Component.name})`;
  return AnimatedComponent;
}