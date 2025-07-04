import { NavigationState, NavigationActions, NavigationHookConfig } from './types';
/**
 * Injectable navigation hook that abstracts router logic.
 * Host applications can override this to use their own routing implementation
 * (e.g., Next.js router, React Router, etc.)
 */
export declare function useNavigation(config?: NavigationHookConfig): {
    state: NavigationState;
    actions: NavigationActions;
    isReady: boolean;
};
/**
 * Factory function to create a custom useNavigation hook with host-specific implementations
 */
export declare function createNavigationHook(customActions: Partial<NavigationActions>): (config?: NavigationHookConfig) => {
    actions: NavigationActions;
    state: NavigationState;
    isReady: boolean;
};
/**
 * Utility hook for common navigation patterns
 */
export declare function useNavigationHelpers(): {
    navigateToWallet: () => void;
    navigateToTokens: () => void;
    navigateToNFTs: () => void;
    navigateToInventory: () => void;
    navigateToSettings: () => void;
    goHome: () => void;
    isCurrentPath: (path: string) => boolean;
    hasParam: (param: string) => boolean;
    getParam: (param: string) => string | null;
    currentPath: string;
    searchParams: string;
    hash: string;
};
//# sourceMappingURL=useNavigation.d.ts.map