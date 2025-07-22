/**
 * Safe animation utilities for cross-platform compatibility
 * Provides type-safe fallbacks for React Native animations
 */

interface AnimationBuilder {
  duration(duration: number): AnimationBuilder;
  delay(delay: number): AnimationBuilder;
}

interface SafeAnimations {
  FadeIn: AnimationBuilder;
  FadeOut: AnimationBuilder;
}

// Create fallback animation objects that match the expected interface
const createFallbackAnimation = (): AnimationBuilder => ({
  duration: () => createFallbackAnimation(),
  delay: () => createFallbackAnimation(),
});

// Safe import of React Native animations with proper fallbacks using dynamic imports
export async function loadSafeAnimations(): Promise<SafeAnimations> {
  try {
    const reanimated = await import("react-native-reanimated").catch(() => 
      require("react-native-reanimated")
    );
    return {
      FadeIn: reanimated.FadeIn || createFallbackAnimation(),
      FadeOut: reanimated.FadeOut || createFallbackAnimation(),
    };
  } catch (e) {
    console.warn("React Native Reanimated not available, using fallback animations:", e);
    return {
      FadeIn: createFallbackAnimation(),
      FadeOut: createFallbackAnimation(),
    };
  }
}

// Synchronous fallback for immediate access
export function getSafeAnimations(): SafeAnimations {
  try {
    const reanimated = require("react-native-reanimated");
    return {
      FadeIn: reanimated.FadeIn || createFallbackAnimation(),
      FadeOut: reanimated.FadeOut || createFallbackAnimation(),
    };
  } catch (e) {
    // Fallback for environments where react-native-reanimated is not available
    return {
      FadeIn: createFallbackAnimation(),
      FadeOut: createFallbackAnimation(),
    };
  }
}

// Export individual animations for convenience
export const { FadeIn, FadeOut } = getSafeAnimations();