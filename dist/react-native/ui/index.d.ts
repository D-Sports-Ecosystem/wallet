export { default as Dashboard } from './components/Dashboard';
export { default as ContextDrivenDashboard } from './components/ContextDrivenDashboard';
export { default as WalletOverviewCard } from './components/WalletOverviewCard';
export { default as TokenTab } from './components/TokenTab';
export { default as ContextDrivenTokenTab } from './components/ContextDrivenTokenTab';
export { default as CollectiblesTab } from './components/CollectiblesTab';
export { default as InventoryTab } from './components/InventoryTab';
export { default as CreateWalletFlow } from './components/CreateWalletFlow';
export { default as ImportWalletFlow } from './components/ImportWalletFlow';
export { default as AnimatedContainer } from './atoms/AnimatedContainer';
export { default as LoadingState } from './atoms/LoadingState';
export { default as EmptyState } from './atoms/EmptyState';
export { default as Modal } from './atoms/Modal';
export { default as WalletUIProvider, useWalletUI, useWalletUIContext, useWallet, useWalletData } from './context/WalletUIProvider';
export { useAuth, useNavigation, useServerActions, usePlatform, useWalletActions, } from './hooks';
export * from './types';
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