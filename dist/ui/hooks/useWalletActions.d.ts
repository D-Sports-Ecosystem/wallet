import { WalletActionsHookConfig } from './types';
/**
 * Injectable wallet actions hook that abstracts wallet-specific operations.
 * Host applications can override this to use their own wallet implementation
 * (e.g., different wallet providers, custom wallet creation logic, etc.)
 */
export declare function useWalletActions(config?: WalletActionsHookConfig): {
    actions: {
        createUserWallet: (args: any) => Promise<any>;
        importUserWallet: (args: any) => Promise<any>;
        connectWallet: (connectorId: string, options?: any) => Promise<any>;
        disconnectWallet: () => Promise<void>;
        switchChain: (chainId: number) => Promise<void>;
        signMessage: (message: string) => Promise<string>;
        sendTransaction: (txData: any) => Promise<any>;
    };
    isLoading: boolean;
    error: Error | null;
    connectedAccount: any;
};
/**
 * Factory function to create a custom useWalletActions hook with host-specific implementations
 */
export declare function createWalletActionsHook(customActions: Partial<ReturnType<typeof useWalletActions>['actions']>): (config?: WalletActionsHookConfig) => {
    actions: {
        createUserWallet: (args: any) => Promise<any>;
        importUserWallet: (args: any) => Promise<any>;
        connectWallet: (connectorId: string, options?: any) => Promise<any>;
        disconnectWallet: () => Promise<void>;
        switchChain: (chainId: number) => Promise<void>;
        signMessage: (message: string) => Promise<string>;
        sendTransaction: (txData: any) => Promise<any>;
    };
    isLoading: boolean;
    error: Error | null;
    connectedAccount: any;
};
//# sourceMappingURL=useWalletActions.d.ts.map