interface Wallet {
    address: string;
    label?: string;
    color?: string;
    icon?: string;
}
interface Wallets {
    /** Currently active wallet address */
    address: string | null;
    /** List of wallets linked to the user */
    wallets: Wallet[];
    /** UI flag – whether the wallet list is in "edit" mode */
    isEditing: boolean;
    setAddress: (newAddress: string | null) => void;
    addWallet: (wallet: Wallet) => void;
    removeWallet: (addressToRemove: string) => void;
    setIsEditing: (editing: boolean) => void;
    /** Clears the active wallet but keeps the list intact */
    disconnectWallet: () => boolean;
    updateWalletMeta: (address: string, meta: Partial<Pick<Wallet, 'label' | 'color' | 'icon'>>) => void;
}
/**
 * Persistent wallet store – leverages `zustand` so components automatically
 * re-render when the underlying state changes. This fixes the issue where UI
 * didn't update immediately after switching wallets.
 */
export declare const useWalletStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<Wallets>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<Wallets, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: Wallets) => void) => () => void;
        onFinishHydration: (fn: (state: Wallets) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<Wallets, unknown>>;
    };
}>;
export {};
//# sourceMappingURL=wallet-store.d.ts.map