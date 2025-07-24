# State Management Documentation

This document provides a comprehensive overview of the state management approach in the @d-sports/wallet project.

## Overview

The @d-sports/wallet project uses Zustand for state management, providing a simple yet powerful way to manage global state across the application. This document explains the state management architecture and provides examples of its implementation.

## State Management Architecture

### Wallet Store

The wallet store is the central state management solution for the @d-sports/wallet project. It manages all wallet-related state, including connection status, account information, and transaction history.

```typescript
import create from 'zustand';

/**
 * Wallet store interface
 * 
 * @interface WalletStore
 * @property {boolean} isConnected - Whether the wallet is connected
 * @property {string | null} account - The connected account address
 * @property {string | null} chainId - The connected chain ID
 * @property {string | null} balance - The account balance
 * @property {Function} connect - Function to connect the wallet
 * @property {Function} disconnect - Function to disconnect the wallet
 * @property {Function} switchChain - Function to switch the connected chain
 */
interface WalletStore {
  isConnected: boolean;
  isConnecting: boolean;
  account: string | null;
  chainId: string | null;
  balance: string | null;
  error: Error | null;
  connect: (connectorId: string) => Promise<void>;
  disconnect: () => void;
  switchChain: (chainId: string) => Promise<void>;
}

/**
 * Create wallet store
 * 
 * @function createWalletStore
 * @param {WalletConfig} config - Wallet configuration
 * @returns {WalletStore} Wallet store
 * 
 * @example
 * ```typescript
 * const store = createWalletStore({
 *   appName: 'My App',
 *   chains: [1, 137],
 *   socialProviders: ['google', 'twitter']
 * });
 * ```
 */
export const createWalletStore = (config: WalletConfig) => {
  return create<WalletStore>((set, get) => ({
    isConnected: false,
    isConnecting: false,
    account: null,
    chainId: null,
    balance: null,
    error: null,
    
    connect: async (connectorId: string) => {
      try {
        set({ isConnecting: true, error: null });
        
        // Connect logic
        const { account, chainId, balance } = await connectWallet(connectorId);
        
        set({
          isConnected: true,
          isConnecting: false,
          account,
          chainId,
          balance
        });
      } catch (error) {
        set({
          isConnected: false,
          isConnecting: false,
          error: error as Error
        });
        throw error;
      }
    },
    
    disconnect: () => {
      // Disconnect logic
      disconnectWallet();
      
      set({
        isConnected: false,
        account: null,
        chainId: null,
        balance: null
      });
    },
    
    switchChain: async (chainId: string) => {
      try {
        // Switch chain logic
        await switchWalletChain(chainId);
        
        set({ chainId });
      } catch (error) {
        set({ error: error as Error });
        throw error;
      }
    }
  }));
};
```

### Token Store

The token store manages token-related state, including token balances, prices, and transaction history.

```typescript
import create from 'zustand';

/**
 * Token store interface
 * 
 * @interface TokenStore
 * @property {TokenInfo[]} tokens - Array of token information
 * @property {boolean} isLoading - Whether tokens are being loaded
 * @property {Error | null} error - Error if token loading failed
 * @property {Function} fetchTokens - Function to fetch tokens
 * @property {Function} getTokenBySymbol - Function to get a token by symbol
 */
interface TokenStore {
  tokens: TokenInfo[];
  isLoading: boolean;
  error: Error | null;
  fetchTokens: () => Promise<void>;
  getTokenBySymbol: (symbol: string) => TokenInfo | undefined;
}

/**
 * Create token store
 * 
 * @function createTokenStore
 * @returns {TokenStore} Token store
 * 
 * @example
 * ```typescript
 * const store = createTokenStore();
 * ```
 */
export const createTokenStore = () => {
  return create<TokenStore>((set, get) => ({
    tokens: [],
    isLoading: false,
    error: null,
    
    fetchTokens: async () => {
      try {
        set({ isLoading: true, error: null });
        
        // Fetch tokens logic
        const tokens = await fetchTokenData();
        
        set({
          tokens,
          isLoading: false
        });
      } catch (error) {
        set({
          isLoading: false,
          error: error as Error
        });
        throw error;
      }
    },
    
    getTokenBySymbol: (symbol: string) => {
      return get().tokens.find(token => token.symbol === symbol);
    }
  }));
};
```

## State Management Hooks

### useWallet Hook

The `useWallet` hook provides access to the wallet state and methods.

```typescript
/**
 * Hook for accessing wallet state and methods
 * 
 * @function useWallet
 * @returns {WalletStore} Wallet store state and methods
 * 
 * @example
 * ```tsx
 * function WalletStatus() {
 *   const { isConnected, account, connect, disconnect } = useWallet();
 *   
 *   return (
 *     <div>
 *       {isConnected ? (
 *         <>
 *           <p>Connected: {account}</p>
 *           <button onClick={disconnect}>Disconnect</button>
 *         </>
 *       ) : (
 *         <button onClick={() => connect('metamask')}>Connect</button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useWallet() {
  const store = useContext(WalletContext);
  
  if (!store) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  
  return useStore(store);
}
```

### useTokens Hook

The `useTokens` hook provides access to the token state and methods.

```typescript
/**
 * Hook for accessing token state and methods
 * 
 * @function useTokens
 * @returns {TokenStore} Token store state and methods
 * 
 * @example
 * ```tsx
 * function TokenList() {
 *   const { tokens, isLoading, error, fetchTokens } = useTokens();
 *   
 *   useEffect(() => {
 *     fetchTokens();
 *   }, [fetchTokens]);
 *   
 *   if (isLoading) return <p>Loading...</p>;
 *   if (error) return <p>Error: {error.message}</p>;
 *   
 *   return (
 *     <ul>
 *       {tokens.map(token => (
 *         <li key={token.symbol}>
 *           {token.name} ({token.symbol}): {token.balance}
 *         </li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export function useTokens() {
  const store = useContext(TokenContext);
  
  if (!store) {
    throw new Error('useTokens must be used within a TokenProvider');
  }
  
  return useStore(store);
}
```

## State Persistence

The wallet state is persisted to local storage to maintain the user's session across page reloads.

```typescript
import { persist } from 'zustand/middleware';

/**
 * Create persistent wallet store
 * 
 * @function createPersistentWalletStore
 * @param {WalletConfig} config - Wallet configuration
 * @returns {WalletStore} Persistent wallet store
 * 
 * @example
 * ```typescript
 * const store = createPersistentWalletStore({
 *   appName: 'My App',
 *   chains: [1, 137],
 *   socialProviders: ['google', 'twitter']
 * });
 * ```
 */
export const createPersistentWalletStore = (config: WalletConfig) => {
  return create(
    persist(
      (set, get) => ({
        // Wallet store implementation
      }),
      {
        name: 'wallet-storage',
        getStorage: () => localStorage,
        partialize: (state) => ({
          account: state.account,
          chainId: state.chainId,
          isConnected: state.isConnected
        })
      }
    )
  );
};
```

## State Selectors

State selectors are used to optimize component re-renders by selecting only the needed state.

```typescript
/**
 * Select wallet connection status
 * 
 * @function selectIsConnected
 * @param {WalletStore} state - Wallet store state
 * @returns {boolean} Whether the wallet is connected
 * 
 * @example
 * ```tsx
 * function ConnectionStatus() {
 *   const isConnected = useWallet(selectIsConnected);
 *   
 *   return <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>;
 * }
 * ```
 */
export const selectIsConnected = (state: WalletStore) => state.isConnected;

/**
 * Select wallet account
 * 
 * @function selectAccount
 * @param {WalletStore} state - Wallet store state
 * @returns {string | null} Wallet account
 * 
 * @example
 * ```tsx
 * function AccountDisplay() {
 *   const account = useWallet(selectAccount);
 *   
 *   return account ? <p>Account: {account}</p> : null;
 * }
 * ```
 */
export const selectAccount = (state: WalletStore) => state.account;
```

## State Updates

State updates are handled through actions defined in the store.

```typescript
/**
 * Update wallet balance
 * 
 * @function updateBalance
 * @param {string} balance - New balance
 * @returns {void}
 * 
 * @example
 * ```typescript
 * const { updateBalance } = useWallet();
 * updateBalance('1.5');
 * ```
 */
updateBalance: (balance: string) => {
  set({ balance });
},

/**
 * Update wallet chain
 * 
 * @function updateChain
 * @param {string} chainId - New chain ID
 * @returns {void}
 * 
 * @example
 * ```typescript
 * const { updateChain } = useWallet();
 * updateChain('1');
 * ```
 */
updateChain: (chainId: string) => {
  set({ chainId });
}
```

## State Subscriptions

State subscriptions are used to react to state changes.

```typescript
/**
 * Subscribe to wallet state changes
 * 
 * @function subscribeToWalletChanges
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 * 
 * @example
 * ```typescript
 * const unsubscribe = subscribeToWalletChanges((state) => {
 *   console.log('Wallet state changed:', state);
 * });
 * 
 * // Later
 * unsubscribe();
 * ```
 */
export function subscribeToWalletChanges(callback: (state: WalletStore) => void) {
  const store = useContext(WalletContext);
  
  if (!store) {
    throw new Error('subscribeToWalletChanges must be used within a WalletProvider');
  }
  
  return store.subscribe(callback);
}
```

## Conclusion

The state management approach in the @d-sports/wallet project provides a simple, efficient, and flexible way to manage application state. By using Zustand, the project benefits from a minimal API with maximum flexibility, allowing for easy integration with React components and hooks.