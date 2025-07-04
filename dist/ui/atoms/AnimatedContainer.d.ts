import React from 'react';
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
declare const AnimatedContainer: React.FC<AnimatedContainerProps>;
export default AnimatedContainer;
//# sourceMappingURL=AnimatedContainer.d.ts.map