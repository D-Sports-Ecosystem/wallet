/**
 * Tests for cross-platform animation utilities
 */

import {
  detectAnimationCapabilities,
  getUnifiedAnimations,
  loadUnifiedAnimations,
  cssAnimationClasses,
} from '../animation-utils';

// Mock platform detection
jest.mock('../platform-adapter-factory', () => ({
  detectPlatform: jest.fn(() => 'web'),
}));

// Mock DOM for browser environment tests
Object.defineProperty(window, 'document', {
  value: {
    createElement: jest.fn(() => ({
      style: {
        animationName: '',
        transition: '',
      },
    })),
  },
  writable: true,
});

describe('Animation Utils', () => {
  describe('detectAnimationCapabilities', () => {
    it('should detect CSS animation capabilities in browser environment', async () => {
      const capabilities = await detectAnimationCapabilities();
      
      expect(capabilities).toHaveProperty('hasCSSAnimations');
      expect(capabilities).toHaveProperty('hasTransitions');
      expect(capabilities).toHaveProperty('hasWebAnimations');
      expect(capabilities).toHaveProperty('hasReanimated');
    });
  });

  describe('getUnifiedAnimations', () => {
    it('should return animation builders for web platform', () => {
      const animations = getUnifiedAnimations();
      
      expect(animations).toHaveProperty('FadeIn');
      expect(animations).toHaveProperty('FadeOut');
      expect(animations).toHaveProperty('SlideInRight');
      expect(animations).toHaveProperty('SlideInLeft');
      expect(animations).toHaveProperty('BounceIn');
      expect(animations).toHaveProperty('Shimmer');
      
      // Test animation builder interface
      expect(typeof animations.FadeIn.duration).toBe('function');
      expect(typeof animations.FadeIn.delay).toBe('function');
    });

    it('should return animation builders with CSS class methods', () => {
      const animations = getUnifiedAnimations();
      const fadeIn = animations.FadeIn.duration(500).delay(150);
      
      // Test that CSS-based animations have the required methods
      expect(typeof (fadeIn as any).getClassName).toBe('function');
      expect(typeof (fadeIn as any).getStyle).toBe('function');
    });
  });

  describe('loadUnifiedAnimations', () => {
    it('should load animations asynchronously', async () => {
      const animations = await loadUnifiedAnimations();
      
      expect(animations).toHaveProperty('FadeIn');
      expect(animations).toHaveProperty('FadeOut');
      expect(animations).toHaveProperty('SlideInRight');
      expect(animations).toHaveProperty('SlideInLeft');
      expect(animations).toHaveProperty('BounceIn');
      expect(animations).toHaveProperty('Shimmer');
    });
  });

  describe('cssAnimationClasses', () => {
    it('should provide CSS class names for animations', () => {
      expect(cssAnimationClasses.fadeIn).toBe('animate-fade-in');
      expect(cssAnimationClasses.fadeOut).toBe('animate-fade-out');
      expect(cssAnimationClasses.slideInRight).toBe('animate-slide-in-right');
      expect(cssAnimationClasses.slideInLeft).toBe('animate-slide-in-left');
      expect(cssAnimationClasses.bounceIn).toBe('animate-bounce-in');
      expect(cssAnimationClasses.shimmer).toBe('animate-shimmer');
    });
  });

  describe('Animation Builder Configuration', () => {
    it('should allow chaining animation configuration', () => {
      const animations = getUnifiedAnimations();
      const configuredAnimation = animations.FadeIn
        .duration(1000)
        .delay(500);
      
      // Should return the same builder for chaining
      expect(configuredAnimation).toBeDefined();
      expect(typeof configuredAnimation.duration).toBe('function');
      expect(typeof configuredAnimation.delay).toBe('function');
    });

    it('should generate correct CSS styles for configured animations', () => {
      const animations = getUnifiedAnimations();
      const configuredAnimation = animations.FadeIn
        .duration(1000)
        .delay(500);
      
      const style = (configuredAnimation as any).getStyle();
      expect(style.animationDuration).toBe('1000ms');
      expect(style.animationDelay).toBe('500ms');
    });

    it('should generate correct CSS classes with delay', () => {
      const animations = getUnifiedAnimations();
      const configuredAnimation = animations.FadeIn.delay(300);
      
      const className = (configuredAnimation as any).getClassName();
      expect(className).toContain('animate-fade-in');
      expect(className).toContain('animation-delay-300');
    });
  });
});