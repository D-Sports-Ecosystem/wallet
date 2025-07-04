import { useState, useEffect, useCallback } from 'react';
import { NavigationState, NavigationActions, NavigationHookConfig } from './types';

/**
 * Injectable navigation hook that abstracts router logic.
 * Host applications can override this to use their own routing implementation
 * (e.g., Next.js router, React Router, etc.)
 */
export function useNavigation(config: NavigationHookConfig = {}): {
  state: NavigationState;
  actions: NavigationActions;
  isReady: boolean;
} {
  const [state, setState] = useState<NavigationState>(() => {
    // Default implementation uses window.location if available
    if (typeof window !== 'undefined') {
      return {
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
        isReady: true,
      };
    }
    
    // Fallback for SSR or non-browser environments
    return {
      pathname: config.basePath || '/',
      search: '',
      hash: '',
      isReady: false,
    };
  });

  // Default no-op implementations
  const defaultActions: NavigationActions = {
    push: (path: string) => {
      console.warn('useNavigation.push not implemented. Please provide your own implementation.');
      console.log('Demo: Would navigate to:', path);
      
      // Demo implementation - updates state only
      const url = new URL(path, 'http://localhost');
      setState({
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        isReady: true,
      });
      
      config.onNavigate?.(path);
    },

    replace: (path: string) => {
      console.warn('useNavigation.replace not implemented. Please provide your own implementation.');
      console.log('Demo: Would replace current route with:', path);
      
      // Demo implementation - updates state only
      const url = new URL(path, 'http://localhost');
      setState({
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        isReady: true,
      });
      
      config.onNavigate?.(path);
    },

    back: () => {
      console.warn('useNavigation.back not implemented. Please provide your own implementation.');
      console.log('Demo: Would go back in history');
      
      // Demo implementation - no-op for safety
      if (typeof window !== 'undefined' && window.history.length > 1) {
        window.history.back();
      }
    },

    forward: () => {
      console.warn('useNavigation.forward not implemented. Please provide your own implementation.');
      console.log('Demo: Would go forward in history');
      
      // Demo implementation - no-op for safety
      if (typeof window !== 'undefined') {
        window.history.forward();
      }
    },

    refresh: () => {
      console.warn('useNavigation.refresh not implemented. Please provide your own implementation.');
      console.log('Demo: Would refresh current page');
      
      // Demo implementation - no-op for safety
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    },
  };

  // Listen to browser navigation events (for default implementation)
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handlePopState = () => {
      setState({
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
        isReady: true,
      });
    };

    const handleHashChange = () => {
      setState(prevState => ({
        ...prevState,
        hash: window.location.hash,
      }));
    };

    // Update ready state
    setState(prevState => ({ ...prevState, isReady: true }));

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return {
    state,
    actions: defaultActions,
    isReady: state.isReady,
  };
}

/**
 * Factory function to create a custom useNavigation hook with host-specific implementations
 */
export function createNavigationHook(customActions: Partial<NavigationActions>) {
  return function useCustomNavigation(config: NavigationHookConfig = {}) {
    const defaultHook = useNavigation(config);
    
    // Override default actions with custom implementations
    const mergedActions: NavigationActions = {
      ...defaultHook.actions,
      ...customActions,
    };

    return {
      ...defaultHook,
      actions: mergedActions,
    };
  };
}

/**
 * Utility hook for common navigation patterns
 */
export function useNavigationHelpers() {
  const { state, actions } = useNavigation();

  const navigateToWallet = useCallback(() => {
    actions.push('/wallet');
  }, [actions]);

  const navigateToTokens = useCallback(() => {
    actions.push('/wallet/tokens');
  }, [actions]);

  const navigateToNFTs = useCallback(() => {
    actions.push('/wallet/nfts');
  }, [actions]);

  const navigateToInventory = useCallback(() => {
    actions.push('/wallet/inventory');
  }, [actions]);

  const navigateToSettings = useCallback(() => {
    actions.push('/settings');
  }, [actions]);

  const goHome = useCallback(() => {
    actions.push('/');
  }, [actions]);

  const isCurrentPath = useCallback((path: string) => {
    return state.pathname === path;
  }, [state.pathname]);

  const hasParam = useCallback((param: string) => {
    const searchParams = new URLSearchParams(state.search);
    return searchParams.has(param);
  }, [state.search]);

  const getParam = useCallback((param: string) => {
    const searchParams = new URLSearchParams(state.search);
    return searchParams.get(param);
  }, [state.search]);

  return {
    // Navigation shortcuts
    navigateToWallet,
    navigateToTokens,
    navigateToNFTs,
    navigateToInventory,
    navigateToSettings,
    goHome,
    
    // Utility functions
    isCurrentPath,
    hasParam,
    getParam,
    
    // Current state
    currentPath: state.pathname,
    searchParams: state.search,
    hash: state.hash,
  };
}
