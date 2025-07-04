import { useState, useEffect, useCallback } from 'react';
import { AuthSession, AuthActions, AuthHookConfig } from './types';

/**
 * Injectable auth hook that abstracts session management logic.
 * Host applications can override this to use their own auth implementation
 * (e.g., NextAuth, Auth0, Firebase Auth, etc.)
 */
export function useAuth(config: AuthHookConfig = {}): {
  session: AuthSession | null;
  isLoading: boolean;
  error: Error | null;
  actions: AuthActions;
} {
  const [session, setSession] = useState<AuthSession | null>(
    config.initialSession || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Default no-op implementations
  const defaultActions: AuthActions = {
    signIn: async (credentials: any): Promise<AuthSession> => {
      console.warn('useAuth.signIn not implemented. Please provide your own implementation.');
      // Demo implementation - returns mock session
      const mockSession: AuthSession = {
        user: {
          id: 'demo-user-' + Date.now(),
          email: credentials.email || 'demo@example.com',
          name: 'Demo User',
        },
        isAuthenticated: true,
        token: 'demo-token-' + Date.now(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      };
      
      setSession(mockSession);
      config.onSessionChange?.(mockSession);
      return mockSession;
    },

    signOut: async (): Promise<void> => {
      console.warn('useAuth.signOut not implemented. Please provide your own implementation.');
      // Demo implementation - clears session
      setSession(null);
      config.onSessionChange?.(null);
    },

    signUp: async (userData: any): Promise<AuthSession> => {
      console.warn('useAuth.signUp not implemented. Please provide your own implementation.');
      // Demo implementation - returns mock session
      const mockSession: AuthSession = {
        user: {
          id: 'demo-user-' + Date.now(),
          email: userData.email || 'demo@example.com',
          name: userData.name || 'Demo User',
        },
        isAuthenticated: true,
        token: 'demo-token-' + Date.now(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      };
      
      setSession(mockSession);
      config.onSessionChange?.(mockSession);
      return mockSession;
    },

    refreshSession: async (): Promise<AuthSession> => {
      console.warn('useAuth.refreshSession not implemented. Please provide your own implementation.');
      
      if (!session) {
        throw new Error('No session to refresh');
      }

      // Demo implementation - extends current session
      const refreshedSession: AuthSession = {
        ...session,
        token: 'refreshed-token-' + Date.now(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      };
      
      setSession(refreshedSession);
      config.onSessionChange?.(refreshedSession);
      return refreshedSession;
    },
  };

  // Auto-refresh logic
  useEffect(() => {
    if (!config.autoRefresh || !session?.expiresAt) {
      return;
    }

    const timeUntilExpiry = session.expiresAt.getTime() - Date.now();
    const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0); // Refresh 5 minutes before expiry

    if (refreshTime <= 0) {
      // Already expired
      defaultActions.signOut();
      return;
    }

    const timer = setTimeout(() => {
      defaultActions.refreshSession().catch((err) => {
        console.error('Auto-refresh failed:', err);
        setError(err);
        defaultActions.signOut();
      });
    }, refreshTime);

    return () => clearTimeout(timer);
  }, [session, config.autoRefresh]);

  // Enhanced actions with loading and error handling
  const enhancedActions: AuthActions = {
    signIn: useCallback(async (credentials: any) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await defaultActions.signIn(credentials);
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    }, []),

    signOut: useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
        await defaultActions.signOut();
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    }, []),

    signUp: useCallback(async (userData: any) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await defaultActions.signUp(userData);
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    }, []),

    refreshSession: useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await defaultActions.refreshSession();
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    }, [session]),
  };

  return {
    session,
    isLoading,
    error,
    actions: enhancedActions,
  };
}

/**
 * Factory function to create a custom useAuth hook with host-specific implementations
 */
export function createAuthHook(customActions: Partial<AuthActions>) {
  return function useCustomAuth(config: AuthHookConfig = {}) {
    const defaultHook = useAuth(config);
    
    // Override default actions with custom implementations
    const mergedActions: AuthActions = {
      ...defaultHook.actions,
      ...customActions,
    };

    return {
      ...defaultHook,
      actions: mergedActions,
    };
  };
}
