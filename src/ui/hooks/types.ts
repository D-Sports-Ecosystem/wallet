// Types for injectable hooks

// Auth hook types
export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
}

export interface AuthSession {
  user?: AuthUser;
  isAuthenticated: boolean;
  token?: string;
  expiresAt?: Date;
}

export interface AuthActions {
  signIn: (credentials: any) => Promise<AuthSession>;
  signOut: () => Promise<void>;
  signUp: (userData: any) => Promise<AuthSession>;
  refreshSession: () => Promise<AuthSession>;
}

export interface AuthHookConfig {
  initialSession?: AuthSession;
  autoRefresh?: boolean;
  onSessionChange?: (session: AuthSession | null) => void;
}

// Navigation hook types
export interface NavigationActions {
  push: (path: string) => void;
  replace: (path: string) => void;
  back: () => void;
  forward: () => void;
  refresh: () => void;
}

export interface NavigationState {
  pathname: string;
  search: string;
  hash: string;
  isReady: boolean;
}

export interface NavigationHookConfig {
  basePath?: string;
  onNavigate?: (path: string) => void;
}

// Server actions hook types
export interface ServerActionsConfig {
  baseURL?: string;
  defaultHeaders?: Record<string, string>;
  timeout?: number;
  onError?: (error: Error) => void;
}

export interface ServerActions {
  createWallet: (config: any) => Promise<any>;
  importWallet: (config: any) => Promise<any>;
  fetchTokens: (walletAddress: string) => Promise<any[]>;
  fetchNFTs: (walletAddress: string) => Promise<any[]>;
  fetchInventory: (userId: string) => Promise<any[]>;
  sendTransaction: (txData: any) => Promise<any>;
  getWalletBalance: (walletAddress: string) => Promise<any>;
}

export interface ServerActionsHookConfig extends ServerActionsConfig {
  enableCaching?: boolean;
  cacheTimeout?: number;
}

// Platform hook types
export interface PlatformFeatures {
  localStorage: boolean;
  sessionStorage: boolean;
  clipboard: boolean;
  notifications: boolean;
  camera: boolean;
  geolocation: boolean;
  deviceMotion: boolean;
}

export interface PlatformActions {
  copyToClipboard: (text: string) => Promise<boolean>;
  showNotification: (title: string, options?: NotificationOptions) => Promise<boolean>;
  vibrate: (pattern?: number | number[]) => boolean;
  openUrl: (url: string) => void;
  share: (data: ShareData) => Promise<boolean>;
  requestPermission: (permission: string) => Promise<PermissionState>;
}

export interface PlatformHookConfig {
  fallbackToMock?: boolean;
  onFeatureUnavailable?: (feature: string) => void;
}

// Wallet actions hook types
export interface WalletActionsConfig {
  defaultChainId?: number;
  supportedChains?: number[];
  autoConnect?: boolean;
  onConnect?: (account: any) => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

export interface WalletActionsHookConfig extends WalletActionsConfig {
  enableLocalStorage?: boolean;
  storageKey?: string;
}

// Share data interface for platform actions
export interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}
