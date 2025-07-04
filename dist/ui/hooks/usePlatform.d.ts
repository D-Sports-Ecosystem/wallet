import { PlatformFeatures, PlatformActions, PlatformHookConfig } from './types';
/**
 * Injectable platform hook that abstracts browser APIs and platform-specific features.
 * Host applications can override this to provide platform-specific implementations
 * (e.g., different behavior for web, mobile, desktop, PWA, etc.)
 */
export declare function usePlatform(config?: PlatformHookConfig): {
    features: PlatformFeatures;
    actions: PlatformActions;
    isReady: boolean;
};
/**
 * Factory function to create a custom usePlatform hook with host-specific implementations
 */
export declare function createPlatformHook(customActions: Partial<PlatformActions>): (config?: PlatformHookConfig) => {
    actions: PlatformActions;
    features: PlatformFeatures;
    isReady: boolean;
};
/**
 * Utility hook for PWA-specific features
 */
export declare function usePWAFeatures(): {
    isInstallable: boolean;
    isStandalone: boolean;
    installPWA: () => Promise<boolean>;
    features: PlatformFeatures;
    actions: PlatformActions;
};
/**
 * Hook for device-specific capabilities
 */
export declare function useDeviceCapabilities(): {
    features: PlatformFeatures;
    actions: PlatformActions;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    touchSupport: boolean;
    orientation: "portrait" | "landscape" | "unknown";
    connectionType: string;
};
//# sourceMappingURL=usePlatform.d.ts.map