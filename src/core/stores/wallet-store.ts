/**
 * @file wallet-store.ts
 * @description Persistent wallet store using Zustand for state management with automatic reactivity.
 * Provides wallet address management, wallet list management, and UI state control.
 * @module core/stores
 * @author D-Sports Engineering Team
 * @version 1.0.0
 * @since 2025-07-23
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Represents a wallet with its address and optional UI metadata.
 * 
 * @interface
 * @property {string} address - The wallet's Ethereum address
 * @property {string} [label] - Optional user-friendly label for the wallet
 * @property {string} [color] - Optional color for UI representation
 * @property {string} [icon] - Optional icon (emoji or SVG name) for UI representation
 */
interface Wallet {
  address: string;
  label?: string; // optional label for UI
  color?: string; // optional color for UI
  icon?: string; // optional icon (emoji or SVG name)
}

/**
 * Zustand store interface for wallet management.
 * Provides state and actions for managing wallets and their UI representation.
 * 
 * @interface
 * @property {string | null} address - Currently active wallet address
 * @property {Wallet[]} wallets - List of wallets linked to the user
 * @property {boolean} isEditing - UI flag – whether the wallet list is in "edit" mode
 * @property {function} setAddress - Sets the active wallet address
 * @property {function} addWallet - Adds a new wallet to the list
 * @property {function} removeWallet - Removes a wallet from the list
 * @property {function} setIsEditing - Sets the editing mode
 * @property {function} disconnectWallet - Clears the active wallet but keeps the list intact
 * @property {function} updateWalletMeta - Updates wallet metadata (label, color, icon)
 */
interface Wallets {
  /** Currently active wallet address */
  address: string | null;
  /** List of wallets linked to the user */
  wallets: Wallet[];
  /** UI flag – whether the wallet list is in "edit" mode */
  isEditing: boolean;

  /* ===== actions ===== */
  /**
   * Sets the active wallet address
   * @param {string | null} newAddress - The new active address or null to clear
   * @returns {void}
   */
  setAddress: (newAddress: string | null) => void;
  
  /**
   * Adds a new wallet to the list
   * @param {Wallet} wallet - The wallet to add
   * @returns {void}
   */
  addWallet: (wallet: Wallet) => void;
  
  /**
   * Removes a wallet from the list
   * @param {string} addressToRemove - The address of the wallet to remove
   * @returns {void}
   */
  removeWallet: (addressToRemove: string) => void;
  
  /**
   * Sets the editing mode
   * @param {boolean} editing - Whether the wallet list is in edit mode
   * @returns {void}
   */
  setIsEditing: (editing: boolean) => void;
  
  /**
   * Clears the active wallet but keeps the list intact
   * @returns {boolean} Success status
   */
  disconnectWallet: () => boolean;
  
  /**
   * Updates wallet metadata (label, color, icon)
   * @param {string} address - The address of the wallet to update
   * @param {Partial<Pick<Wallet, 'label' | 'color' | 'icon'>>} meta - The metadata to update
   * @returns {void}
   */
  updateWalletMeta: (
    address: string,
    meta: Partial<Pick<Wallet, 'label' | 'color' | 'icon'>>,
  ) => void;
}

/**
 * Helper function for simple Ethereum address validation.
 * Checks if the address matches the standard Ethereum address format (0x followed by 40 hex characters).
 * 
 * @function
 * @param {string} addr - The address to validate
 * @returns {boolean} True if the address is valid, false otherwise
 * 
 * @example
 * ```typescript
 * // Check if an address is valid
 * const isValid = isValidEthAddress('0x1234567890abcdef1234567890abcdef12345678');
 * console.log(isValid); // true
 * ```
 */
const isValidEthAddress = (addr: string) => /^0x[a-fA-F0-9]{40}$/.test(addr);

/**
 * Persistent wallet store – leverages `zustand` so components automatically
 * re-render when the underlying state changes. This fixes the issue where UI
 * didn't update immediately after switching wallets.
 * 
 * @function
 * @returns {Wallets} The wallet store with state and actions
 * 
 * @example
 * ```typescript
 * // In a React component
 * import { useWalletStore } from '../core/stores/wallet-store';
 * 
 * function WalletComponent() {
 *   const { address, wallets, addWallet } = useWalletStore();
 *   
 *   return (
 *     <div>
 *       <p>Active wallet: {address || 'None'}</p>
 *       <p>Total wallets: {wallets.length}</p>
 *       <button onClick={() => addWallet({ address: '0x123...' })}>
 *         Add Wallet
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useWalletStore = create<Wallets>()(
  persist(
    (set) => ({
      // Initialize with empty defaults since storage is now handled by persist middleware
      address: null,
      wallets: [],
      isEditing: false,

      /* ---------------- actions ---------------- */
      /**
       * Sets the active wallet address and automatically adds it to the wallet list if it's new.
       * 
       * @param {string | null} newAddress - The new active address or null to clear
       * @throws {Error} If the address is invalid
       * @returns {void}
       * 
       * @example
       * ```typescript
       * // Set a new active wallet
       * useWalletStore.getState().setAddress('0x1234567890abcdef1234567890abcdef12345678');
       * 
       * // Clear the active wallet
       * useWalletStore.getState().setAddress(null);
       * ```
       */
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

      /**
       * Adds a new wallet to the list and sets it as the active wallet.
       * If the wallet already exists, no changes are made.
       * 
       * @param {Wallet} wallet - The wallet to add
       * @returns {void}
       * 
       * @example
       * ```typescript
       * // Add a new wallet with metadata
       * useWalletStore.getState().addWallet({
       *   address: '0x1234567890abcdef1234567890abcdef12345678',
       *   label: 'My Main Wallet',
       *   color: '#ff5500',
       *   icon: '💼'
       * });
       * ```
       */
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

      /**
       * Removes a wallet from the list.
       * If the removed wallet was the active wallet, the first wallet in the list becomes active.
       * 
       * @param {string} addressToRemove - The address of the wallet to remove
       * @returns {void}
       * 
       * @example
       * ```typescript
       * // Remove a wallet
       * useWalletStore.getState().removeWallet('0x1234567890abcdef1234567890abcdef12345678');
       * ```
       */
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

      /**
       * Sets the editing mode for the wallet list.
       * 
       * @param {boolean} editing - Whether the wallet list is in edit mode
       * @returns {void}
       * 
       * @example
       * ```typescript
       * // Enable editing mode
       * useWalletStore.getState().setIsEditing(true);
       * 
       * // Disable editing mode
       * useWalletStore.getState().setIsEditing(false);
       * ```
       */
      setIsEditing: (editing) => set({ isEditing: editing }),

      /**
       * Clears the active wallet but keeps the wallet list intact.
       * 
       * @returns {boolean} Always returns true to indicate success
       * 
       * @example
       * ```typescript
       * // Disconnect the active wallet
       * useWalletStore.getState().disconnectWallet();
       * ```
       */
      disconnectWallet: () => {
        set((state) => ({ ...state, address: null }));
        return true;
      },

      /**
       * Updates wallet metadata (label, color, icon) for a specific wallet.
       * 
       * @param {string} address - The address of the wallet to update
       * @param {Partial<Pick<Wallet, 'label' | 'color' | 'icon'>>} meta - The metadata to update
       * @returns {void}
       * 
       * @example
       * ```typescript
       * // Update wallet metadata
       * useWalletStore.getState().updateWalletMeta(
       *   '0x1234567890abcdef1234567890abcdef12345678',
       *   {
       *     label: 'My Updated Wallet',
       *     color: '#00ff00',
       *     icon: '🔑'
       *   }
       * );
       * ```
       */
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
      /**
       * Storage configuration for the wallet store.
       * Uses localStorage with specific settings to prevent hydration issues.
       */
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
