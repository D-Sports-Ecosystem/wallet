/**
 * @fileoverview D-Sports Wallet UI Components
 *
 * This module exports a comprehensive set of React components and hooks for building
 * wallet interfaces that work across web, Next.js, and React Native platforms.
 *
 * The library is designed with dependency injection and theming in mind, allowing
 * host applications to customize behavior while maintaining consistent UI patterns.
 */
/** Main wallet dashboard component that orchestrates all wallet functionality */
export { default as Dashboard } from './components/Dashboard';
/** Context-driven dashboard component for simplified integration */
export { default as ContextDrivenDashboard } from './components/ContextDrivenDashboard';
/** Alias for ContextDrivenDashboard - recommended for most use cases */
export { default as WalletDashboard } from './components/ContextDrivenDashboard';
/** Wallet overview card displaying balance, user info, and quick stats */
export { default as WalletOverviewCard } from './components/WalletOverviewCard';
/** Tab component for displaying and managing token balances */
export { default as TokenTab } from './components/TokenTab';
/** Context-driven token tab with automatic data fetching */
export { default as ContextDrivenTokenTab } from './components/ContextDrivenTokenTab';
/** Tab component for displaying NFT collectibles */
export { default as CollectiblesTab } from './components/CollectiblesTab';
/** Tab component for managing game inventory items */
export { default as InventoryTab } from './components/InventoryTab';
/** Multi-step flow for creating new wallets */
export { default as CreateWalletFlow } from './components/CreateWalletFlow';
/** Multi-step flow for importing existing wallets */
export { default as ImportWalletFlow } from './components/ImportWalletFlow';
/** Animated container with fade, slide, scale, and bounce effects */
export { default as AnimatedContainer } from './atoms/AnimatedContainer';
/** Loading state component with spinner, dots, pulse, and skeleton variants */
export { default as LoadingState } from './atoms/LoadingState';
/** Empty state component with customizable actions and messaging */
export { default as EmptyState } from './atoms/EmptyState';
/** Modal component with keyboard support and accessibility features */
export { default as Modal } from './atoms/Modal';
/**
 * Main context provider for wallet UI functionality.
 * Provides wallet operations, theming, and injectable hooks.
 */
export { default as WalletUIProvider, 
/** Hook to access the full wallet UI context */
useWalletUI, 
/** Hook to access simplified wallet UI context interface */
useWalletUIContext, 
/** Hook for wallet-specific operations and state */
useWallet, 
/** Hook for managing wallet data with loading states */
useWalletData } from './context/WalletUIProvider';
/** Injectable auth hook for authentication and session management */
export { useAuth } from './hooks';
/** Injectable navigation hook for routing and navigation */
export { useNavigation } from './hooks';
/** Injectable server actions hook for API calls and server operations */
export { useServerActions } from './hooks';
/** Injectable platform hook for platform-specific features */
export { usePlatform } from './hooks';
/** Injectable wallet actions hook for wallet-specific operations */
export { useWalletActions } from './hooks';
/** All component and context type definitions */
export * from './types';
/** All injectable hook type definitions */
export * from './hooks/types';
export declare const defaultTheme: {
    colors: {
        primary: string;
        secondary: string;
        background: string;
        text: string;
        border: string;
    };
    borderRadius: number;
    fontFamily: string;
};
export declare const createWalletDashboard: (props: any) => import("react").FC<import("./types").DashboardProps>;
export declare const createWalletProvider: (props: any) => import("react").FC<import("./context/WalletUIProvider").WalletUIProviderProps>;
//# sourceMappingURL=index.d.ts.map