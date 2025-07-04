import { AuthSession, AuthActions, AuthHookConfig } from './types';
/**
 * Injectable auth hook that abstracts session management logic.
 * Host applications can override this to use their own auth implementation
 * (e.g., NextAuth, Auth0, Firebase Auth, etc.)
 */
export declare function useAuth(config?: AuthHookConfig): {
    session: AuthSession | null;
    isLoading: boolean;
    error: Error | null;
    actions: AuthActions;
};
/**
 * Factory function to create a custom useAuth hook with host-specific implementations
 */
export declare function createAuthHook(customActions: Partial<AuthActions>): (config?: AuthHookConfig) => {
    actions: AuthActions;
    session: AuthSession | null;
    isLoading: boolean;
    error: Error | null;
};
//# sourceMappingURL=useAuth.d.ts.map