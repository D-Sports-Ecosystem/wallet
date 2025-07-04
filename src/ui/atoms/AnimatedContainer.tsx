import React, { useState, useEffect } from 'react';
import { AnimatedContainerProps } from '../types';

/**
 * AnimatedContainer - A flexible container component that provides smooth animations.
 * 
 * This component wraps content with configurable animations including fade, slide, scale,
 * and bounce effects. It supports controlled visibility, timing customization, and theming.
 * 
 * @example
 * ```tsx
 * // Basic fade animation
 * <AnimatedContainer variant="fade" duration={300}>
 *   <YourContent />
 * </AnimatedContainer>
 * 
 * // Controlled visibility with callback
 * <AnimatedContainer 
 *   variant="slide" 
 *   isVisible={showContent}
 *   onAnimationComplete={() => console.log('Animation done!')}
 * >
 *   <YourContent />
 * </AnimatedContainer>
 * 
 * // Bounce effect with delay
 * <AnimatedContainer variant="bounce" delay={200} duration={500}>
 *   <YourContent />
 * </AnimatedContainer>
 * ```
 * 
 * @param props - Configuration props for the animated container
 * @returns An animated wrapper component
 */
const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  className = '',
  variant = 'fade',
  duration = 300,
  delay = 0,
  isVisible = true,
  onAnimationComplete,
  theme,
}) => {
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [animationState, setAnimationState] = useState<'entering' | 'entered' | 'exiting' | 'exited'>(
    isVisible ? 'entered' : 'exited'
  );

  useEffect(() => {
    if (isVisible && animationState === 'exited') {
      setShouldRender(true);
      setTimeout(() => setAnimationState('entering'), 10);
      setTimeout(() => {
        setAnimationState('entered');
        onAnimationComplete?.();
      }, delay + duration);
    } else if (!isVisible && animationState === 'entered') {
      setAnimationState('exiting');
      setTimeout(() => {
        setAnimationState('exited');
        setShouldRender(false);
        onAnimationComplete?.();
      }, duration);
    }
  }, [isVisible, animationState, delay, duration, onAnimationComplete]);

  if (!shouldRender) {
    return null;
  }

  const getAnimationStyles = () => {
    const baseStyles: React.CSSProperties = {
      transition: `all ${duration}ms ease-in-out`,
      transitionDelay: `${delay}ms`,
    };

    switch (variant) {
      case 'fade':
        return {
          ...baseStyles,
          opacity: animationState === 'entered' ? 1 : 0,
        };
      
      case 'slide':
        return {
          ...baseStyles,
          transform: animationState === 'entered' ? 'translateY(0)' : 'translateY(-20px)',
          opacity: animationState === 'entered' ? 1 : 0,
        };
      
      case 'scale':
        return {
          ...baseStyles,
          transform: animationState === 'entered' ? 'scale(1)' : 'scale(0.95)',
          opacity: animationState === 'entered' ? 1 : 0,
        };
      
      case 'bounce':
        return {
          ...baseStyles,
          transform: animationState === 'entered' ? 'scale(1)' : 'scale(0.8)',
          opacity: animationState === 'entered' ? 1 : 0,
          transitionTimingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        };
      
      default:
        return baseStyles;
    }
  };

  const containerStyles: React.CSSProperties = {
    ...getAnimationStyles(),
    ...(theme?.colors && {
      '--primary-color': theme.colors.primary,
      '--secondary-color': theme.colors.secondary,
      '--background-color': theme.colors.background,
      '--text-color': theme.colors.text,
      '--border-color': theme.colors.border,
    } as any),
    ...(theme?.borderRadius && {
      '--border-radius': `${theme.borderRadius}px`,
    } as any),
    ...(theme?.fontFamily && {
      fontFamily: theme.fontFamily,
    }),
  };

  return (
    <div 
      className={`wallet-animated-container ${className}`}
      style={containerStyles}
    >
      {children}
    </div>
  );
};

export default AnimatedContainer;
