# Cross-Platform Animation System

The new unified animation system provides seamless animations across React Native and web environments with automatic fallbacks.

## Features

- ✅ **Conditional React Native Reanimated loading** - No more bundle errors
- ✅ **CSS-based fallbacks for browsers** - Smooth web animations
- ✅ **Feature detection** - Automatically detects animation capabilities
- ✅ **Unified interface** - Same API across all platforms
- ✅ **React hooks** - Easy integration with React components
- ✅ **Higher-order components** - Wrap any component with animations

## Basic Usage

### Using Animation Hooks

```tsx
import { useAnimations, useFadeAnimation } from '@d-sports/wallet';

function MyComponent() {
  const { animations, capabilities } = useAnimations();
  const fadeIn = useFadeAnimation('in');
  
  return (
    <div {...fadeIn.props}>
      <h1>This will fade in!</h1>
    </div>
  );
}
```

### Using AnimatedWrapper Component

```tsx
import { AnimatedWrapper, FadeInWrapper } from '@d-sports/wallet';

function MyComponent() {
  return (
    <AnimatedWrapper 
      animation="FadeIn" 
      duration={500} 
      delay={150}
    >
      <div>This content will animate in</div>
    </AnimatedWrapper>
  );
}

// Or use preset wrappers
function MyOtherComponent() {
  return (
    <FadeInWrapper duration={300}>
      <div>This will fade in with custom duration</div>
    </FadeInWrapper>
  );
}
```

### Using Higher-Order Component

```tsx
import { withAnimation } from '@d-sports/wallet';

const MyButton = ({ children, ...props }) => (
  <button {...props}>{children}</button>
);

const AnimatedButton = withAnimation(MyButton, 'BounceIn');

function App() {
  return (
    <AnimatedButton duration={600}>
      Click me!
    </AnimatedButton>
  );
}
```

### Direct Animation Usage

```tsx
import { getUnifiedAnimations } from '@d-sports/wallet';

function MyComponent() {
  const animations = getUnifiedAnimations();
  const fadeInAnimation = animations.FadeIn.duration(500).delay(150);
  
  // For web environments, get CSS props
  const animationProps = {
    className: fadeInAnimation.getClassName?.(),
    style: fadeInAnimation.getStyle?.(),
  };
  
  return (
    <div {...animationProps}>
      Animated content
    </div>
  );
}
```

## Available Animations

- `FadeIn` / `FadeOut` - Opacity transitions
- `SlideInRight` / `SlideInLeft` - Slide transitions
- `BounceIn` - Bounce effect
- `Shimmer` - Loading shimmer effect

## Platform Behavior

### React Native
- Uses React Native Reanimated when available
- Falls back to no-op animations if Reanimated is not installed
- Maintains smooth 60fps animations

### Web/Browser
- Uses CSS animations and transitions
- Leverages hardware acceleration
- Supports all modern browsers
- Graceful degradation for older browsers

### Next.js
- Server-side safe (no animation on server)
- Client-side hydration compatible
- Optimized for SSR/SSG

## Feature Detection

The system automatically detects available animation capabilities:

```tsx
import { detectAnimationCapabilities } from '@d-sports/wallet';

async function checkCapabilities() {
  const capabilities = await detectAnimationCapabilities();
  
  console.log('CSS Animations:', capabilities.hasCSSAnimations);
  console.log('CSS Transitions:', capabilities.hasTransitions);
  console.log('Web Animations API:', capabilities.hasWebAnimations);
  console.log('React Native Reanimated:', capabilities.hasReanimated);
}
```

## Migration from Old System

### Before (React Native Reanimated direct usage)
```tsx
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

<Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)}>
  <Text>Content</Text>
</Animated.View>
```

### After (Unified system)
```tsx
import { AnimatedWrapper } from '@d-sports/wallet';

<AnimatedWrapper animation="FadeIn" duration={300}>
  <Text>Content</Text>
</AnimatedWrapper>
```

## CSS Classes Available

The system provides these CSS animation classes:

- `.animate-fade-in` - Fade in animation
- `.animate-fade-out` - Fade out animation  
- `.animate-slide-in-right` - Slide in from right
- `.animate-slide-in-left` - Slide in from left
- `.animate-bounce-in` - Bounce in animation
- `.animate-shimmer` - Shimmer loading effect
- `.animation-delay-150` - 150ms delay
- `.animation-delay-300` - 300ms delay
- `.animation-delay-450` - 450ms delay

## Performance

- **Zero bundle size impact** when React Native Reanimated is not used
- **CSS-based animations** use hardware acceleration on web
- **Conditional loading** prevents unnecessary imports
- **Tree-shakeable** exports for optimal bundle size