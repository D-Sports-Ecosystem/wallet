# Animation System Documentation

This document provides a comprehensive overview of the animation system in the @d-sports/wallet project.

## Overview

The @d-sports/wallet project uses a custom animation system built on top of Framer Motion to provide smooth, consistent animations across different platforms. The animation system is designed to be:

1. **Cross-platform**: Works on Web, Next.js, and React Native
2. **Consistent**: Provides a consistent look and feel across platforms
3. **Customizable**: Allows for customization of animation parameters
4. **Performant**: Optimized for performance on all platforms
5. **Accessible**: Respects user preferences for reduced motion

## Animation Utilities

### useAnimation Hook

The `useAnimation` hook provides a simple way to create and control animations.

```typescript
/**
 * Hook for creating and controlling animations
 * 
 * @function useAnimation
 * @param {AnimationOptions} options - Animation options
 * @returns {AnimationControls} Animation controls
 * 
 * @example
 * ```tsx
 * const controls = useAnimation({
 *   initial: { opacity: 0, y: 20 },
 *   animate: { opacity: 1, y: 0 },
 *   exit: { opacity: 0, y: -20 },
 *   transition: { duration: 0.3 }
 * });
 * 
 * // Start the animation
 * controls.start();
 * 
 * // Stop the animation
 * controls.stop();
 * ```
 */
function useAnimation(options: AnimationOptions): AnimationControls {
  const controls = useMotionControls();
  
  useEffect(() => {
    if (options.autoPlay !== false) {
      controls.start(options.animate);
    }
  }, [controls, options]);
  
  return controls;
}
```

### AnimatePresence Component

The `AnimatePresence` component is used to animate components when they are added or removed from the DOM.

```typescript
/**
 * Component for animating elements when they are added or removed from the DOM
 * 
 * @component
 * @param {AnimatePresenceProps} props - Component props
 * @returns {JSX.Element} AnimatePresence component
 * 
 * @example
 * ```tsx
 * <AnimatePresence>
 *   {isVisible && (
 *     <motion.div
 *       initial={{ opacity: 0 }}
 *       animate={{ opacity: 1 }}
 *       exit={{ opacity: 0 }}
 *     >
 *       Content
 *     </motion.div>
 *   )}
 * </AnimatePresence>
 * ```
 */
function AnimatePresence({ children, ...props }: AnimatePresenceProps): JSX.Element {
  return (
    <MotionAnimatePresence {...props}>
      {children}
    </MotionAnimatePresence>
  );
}
```

### Motion Components

The animation system provides motion components for common HTML elements.

```typescript
/**
 * Motion components for animating HTML elements
 * 
 * @example
 * ```tsx
 * <motion.div
 *   initial={{ opacity: 0 }}
 *   animate={{ opacity: 1 }}
 *   exit={{ opacity: 0 }}
 *   transition={{ duration: 0.3 }}
 * >
 *   Content
 * </motion.div>
 * ```
 */
export const motion = {
  div: createMotionComponent('div'),
  span: createMotionComponent('span'),
  button: createMotionComponent('button'),
  a: createMotionComponent('a'),
  ul: createMotionComponent('ul'),
  li: createMotionComponent('li'),
  // ... other HTML elements
};
```

## Animation Presets

The animation system provides a set of presets for common animations.

```typescript
/**
 * Animation presets for common animations
 * 
 * @example
 * ```tsx
 * <motion.div
 *   {...animationPresets.fadeIn}
 *   onClick={handleClick}
 * >
 *   Content
 * </motion.div>
 * ```
 */
export const animationPresets = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3 }
  },
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 }
  },
  slideInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.3 }
  },
  slideInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.3 }
  },
  // ... other presets
};
```

## Animation Variants

Animation variants allow for coordinated animations across multiple elements.

```typescript
/**
 * Animation variants for coordinated animations
 * 
 * @example
 * ```tsx
 * const listVariants = {
 *   hidden: { opacity: 0 },
 *   visible: {
 *     opacity: 1,
 *     transition: {
 *       staggerChildren: 0.1
 *     }
 *   }
 * };
 * 
 * const itemVariants = {
 *   hidden: { opacity: 0, y: 20 },
 *   visible: { opacity: 1, y: 0 }
 * };
 * 
 * function AnimatedList({ items }) {
 *   return (
 *     <motion.ul
 *       variants={listVariants}
 *       initial="hidden"
 *       animate="visible"
 *     >
 *       {items.map(item => (
 *         <motion.li key={item.id} variants={itemVariants}>
 *           {item.name}
 *         </motion.li>
 *       ))}
 *     </motion.ul>
 *   );
 * }
 * ```
 */
```

## Gesture Animations

The animation system supports gesture-based animations.

```typescript
/**
 * Gesture animations for interactive elements
 * 
 * @example
 * ```tsx
 * <motion.button
 *   whileHover={{ scale: 1.05 }}
 *   whileTap={{ scale: 0.95 }}
 *   onClick={handleClick}
 * >
 *   Click me
 * </motion.button>
 * ```
 */
```

## Scroll Animations

The animation system supports scroll-based animations.

```typescript
/**
 * Scroll animations for elements that animate based on scroll position
 * 
 * @example
 * ```tsx
 * <motion.div
 *   initial={{ opacity: 0, y: 50 }}
 *   whileInView={{ opacity: 1, y: 0 }}
 *   viewport={{ once: true, margin: "-100px" }}
 *   transition={{ duration: 0.5 }}
 * >
 *   This element will animate when it enters the viewport
 * </motion.div>
 * ```
 */
```

## Accessibility

The animation system respects the user's preference for reduced motion.

```typescript
/**
 * Hook for respecting the user's preference for reduced motion
 * 
 * @function useReducedMotion
 * @returns {boolean} Whether the user prefers reduced motion
 * 
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion();
 * 
 * const animationProps = prefersReducedMotion
 *   ? { transition: { duration: 0 } }
 *   : { transition: { duration: 0.3 } };
 * 
 * return (
 *   <motion.div
 *     initial={{ opacity: 0 }}
 *     animate={{ opacity: 1 }}
 *     {...animationProps}
 *   >
 *     Content
 *   </motion.div>
 * );
 * ```
 */
function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  return prefersReducedMotion;
}
```

## Platform-Specific Adaptations

The animation system adapts to different platforms.

### Web Animations

```typescript
/**
 * Web-specific animation adaptations
 * 
 * @example
 * ```tsx
 * <motion.div
 *   initial={{ opacity: 0 }}
 *   animate={{ opacity: 1 }}
 *   transition={{ duration: 0.3 }}
 * >
 *   Content
 * </motion.div>
 * ```
 */
```

### React Native Animations

```typescript
/**
 * React Native-specific animation adaptations
 * 
 * @example
 * ```tsx
 * <MotiView
 *   from={{ opacity: 0 }}
 *   animate={{ opacity: 1 }}
 *   transition={{ type: 'timing', duration: 300 }}
 * >
 *   <Text>Content</Text>
 * </MotiView>
 * ```
 */
```

## Performance Optimization

The animation system includes performance optimizations.

```typescript
/**
 * Performance optimizations for animations
 * 
 * @example
 * ```tsx
 * <motion.div
 *   initial={{ opacity: 0 }}
 *   animate={{ opacity: 1 }}
 *   transition={{ duration: 0.3 }}
 *   // Use hardware acceleration
 *   style={{ willChange: 'opacity' }}
 * >
 *   Content
 * </motion.div>
 * ```
 */
```

## Examples

### Animated Modal

```tsx
function AnimatedModal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'black',
            }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'white',
              padding: '20px',
              borderRadius: '10px',
            }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

### Animated List

```tsx
function AnimatedList({ items }) {
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.ul
      variants={listVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map(item => (
        <motion.li key={item.id} variants={itemVariants}>
          {item.name}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

### Animated Button

```tsx
function AnimatedButton({ children, onClick }) {
  const prefersReducedMotion = useReducedMotion();
  
  const buttonVariants = {
    initial: { scale: 1 },
    hover: prefersReducedMotion ? {} : { scale: 1.05 },
    tap: prefersReducedMotion ? {} : { scale: 0.95 }
  };
  
  return (
    <motion.button
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
```

## Conclusion

The animation system in the @d-sports/wallet project provides a powerful, flexible, and accessible way to create animations across different platforms. By using the provided utilities, presets, and examples, developers can create consistent and performant animations throughout the application.