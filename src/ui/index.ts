/**
 * @fileoverview D-Sports Wallet UI Components
 * 
 * This module exports a comprehensive set of React components and hooks for building
 * wallet interfaces that work across web, Next.js, and React Native platforms.
 * 
 * The library is designed with dependency injection and theming in mind, allowing
 * host applications to customize behavior while maintaining consistent UI patterns.
 */

// Main Dashboard component
/** Main wallet dashboard component that orchestrates all wallet functionality */
export { default as Dashboard } from './components/Dashboard';
/** Context-driven dashboard component for simplified integration */
export { default as ContextDrivenDashboard } from './components/ContextDrivenDashboard';
/** Alias for ContextDrivenDashboard - recommended for most use cases */
export { default as WalletDashboard } from './components/ContextDrivenDashboard';

// Core Components
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

// Atomic Components (Reusable UI Building Blocks)
/** Animated container with fade, slide, scale, and bounce effects */
export { default as AnimatedContainer } from './atoms/AnimatedContainer';
/** Loading state component with spinner, dots, pulse, and skeleton variants */
export { default as LoadingState } from './atoms/LoadingState';
/** Empty state component with customizable actions and messaging */
export { default as EmptyState } from './atoms/EmptyState';
/** Modal component with keyboard support and accessibility features */
export { default as Modal } from './atoms/Modal';

// Context and Providers
/** 
 * Main context provider for wallet UI functionality.
 * Provides wallet operations, theming, and injectable hooks.
 */
export { 
  default as WalletUIProvider,
  /** Hook to access the full wallet UI context */
  useWalletUI,
  /** Hook to access simplified wallet UI context interface */
  useWalletUIContext,
  /** Hook for wallet-specific operations and state */
  useWallet,
  /** Hook for managing wallet data with loading states */
  useWalletData
} from './context/WalletUIProvider';

// Injectable Hooks - for abstracting application-specific logic
/** Injectable auth hook for authentication and session management */
export { useAuth, createAuthHook } from './hooks/useAuth';
/** Injectable navigation hook for routing and navigation */
export { useNavigation, createNavigationHook } from './hooks/useNavigation';
/** Injectable server actions hook for API calls and server operations */
export { useServerActions, createServerActionsHook } from './hooks/useServerActions';
/** Injectable platform hook for platform-specific features */
export { usePlatform, createPlatformHook } from './hooks/usePlatform';
/** Injectable wallet actions hook for wallet-specific operations */
export { useWalletActions, createWalletActionsHook } from './hooks/useWalletActions';

// Type Definitions
/** All component and context type definitions */
export * from './types';
/** All injectable hook type definitions */
export * from './hooks/types';

// Default theme
export const defaultTheme = {
  colors: {
    primary: '#007AFF',
    secondary: '#6C757D',
    background: '#FFFFFF',
    text: '#000000',
    border: '#E5E5E7',
  },
  borderRadius: 8,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

// Component factory functions for easy integration
import Dashboard from './components/Dashboard';
import WalletUIProvider from './context/WalletUIProvider';
export const createWalletDashboard = (props: any) => Dashboard;
export const createWalletProvider = (props: any) => WalletUIProvider;
