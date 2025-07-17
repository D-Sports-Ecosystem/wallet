// wallet-store.ts - migrate to zustand for proper reactivity
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Wallet {
  address: string;
  label?: string; // optional label for UI
  color?: string; // optional color for UI
  icon?: string; // optional icon (emoji or SVG name)
}

interface Wallets {
  /** Currently active wallet address */
  address: string | null;
  /** List of wallets linked to the user */
  wallets: Wallet[];
  /** UI flag – whether the wallet list is in "edit" mode */
  isEditing: boolean;

  /* ===== actions ===== */
  setAddress: (newAddress: string | null) => void;
  addWallet: (wallet: Wallet) => void;
  removeWallet: (addressToRemove: string) => void;
  setIsEditing: (editing: boolean) => void;
  /** Clears the active wallet but keeps the list intact */
  disconnectWallet: () => boolean;
  updateWalletMeta: (
    address: string,
    meta: Partial<Pick<Wallet, 'label' | 'color' | 'icon'>>,
  ) => void;
}

// Helper – simple ETH address validation.
const isValidEthAddress = (addr: string) => /^0x[a-fA-F0-9]{40}$/.test(addr);

/**
 * Persistent wallet store – leverages `zustand` so components automatically
 * re-render when the underlying state changes. This fixes the issue where UI
 * didn't update immediately after switching wallets.
 */
export const useWalletStore = create<Wallets>()(
  persist(
    (set) => ({
      // Initialize with empty defaults since storage is now handled by persist middleware
      address: null,
      wallets: [],
      isEditing: false,

      /* ---------------- actions ---------------- */
      setAddress: (newAddress) => {
        if (newAddress !== null && !isValidEthAddress(newAddress)) {
          throw new Error(
            `Invalid wallet address attempted to be set in wallet store: '${newAddress}'.\n` +
            `This value does not match the Ethereum address format (0x...).\n` +
            `Do NOT use user IDs or non-address values here.`,
          );
        }

        set((state) => {
          let wallets = state.wallets;
          // Automatically append unknown wallet to the list
          if (
            newAddress &&
            !state.wallets.some(
              (w) => w.address.toLowerCase() === newAddress.toLowerCase(),
            )
          ) {
            wallets = [...state.wallets, { address: newAddress }];
          }
          return { ...state, address: newAddress, wallets };
        });
      },

      addWallet: (wallet) =>
        set((state) => {
          if (
            state.wallets.some(
              (w) => w.address.toLowerCase() === wallet.address.toLowerCase(),
            )
          ) {
            return state; // already there – no change
          }
          const wallets = [...state.wallets, wallet];
          return { ...state, wallets, address: wallet.address };
        }),

      removeWallet: (addressToRemove) =>
        set((state) => {
          const wallets = state.wallets.filter(
            (w) => w.address.toLowerCase() !== addressToRemove.toLowerCase(),
          );

          // Decide new active wallet (if any)
          const newActive =
            state.address?.toLowerCase() === addressToRemove.toLowerCase()
              ? (wallets[0]?.address ?? null)
              : state.address;

          return { ...state, wallets, address: newActive };
        }),

      setIsEditing: (editing) => set({ isEditing: editing }),

      disconnectWallet: () => {
        set((state) => ({ ...state, address: null }));
        return true;
      },

      updateWalletMeta: (address, meta) =>
        set((state) => {
          const wallets = state.wallets.map((w) =>
            w.address.toLowerCase() === address.toLowerCase()
              ? { ...w, ...meta }
              : w,
          );
          return { ...state, wallets };
        }),
    }),
    {
      name: 'wallet-storage',
      // Use regular localStorage for now to prevent hydration issues
      storage: createJSONStorage(() => localStorage),
      // Skip hydration to prevent server/client mismatch
      skipHydration: true,
      // We only need to persist `address` & `wallets`.
      partialize: (state) => ({
        address: state.address,
        wallets: state.wallets,
      }),
    },
  ),
);

// Note: If zustand persist does not support async storage, consider using a sync wrapper or a custom persist implementation.
