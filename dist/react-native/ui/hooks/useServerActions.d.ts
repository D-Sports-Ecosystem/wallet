import { ServerActions, ServerActionsHookConfig } from './types';
/**
 * Injectable server actions hook that abstracts API routes and server interactions.
 * Host applications can override this to use their own API implementation
 * (e.g., Next.js API routes, tRPC, GraphQL, REST APIs, etc.)
 */
export declare function useServerActions(config?: ServerActionsHookConfig): {
    actions: ServerActions;
    isLoading: boolean;
    error: Error | null;
    cache: Map<string, {
        data: any;
        timestamp: number;
    }>;
    clearCache: () => void;
};
/**
 * Factory function to create a custom useServerActions hook with host-specific implementations
 */
export declare function createServerActionsHook(customActions: Partial<ServerActions>): (config?: ServerActionsHookConfig) => {
    actions: ServerActions;
    isLoading: boolean;
    error: Error | null;
    cache: Map<string, {
        data: any;
        timestamp: number;
    }>;
    clearCache: () => void;
};
//# sourceMappingURL=useServerActions.d.ts.map