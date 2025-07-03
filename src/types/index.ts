// Temporary Chain type until viem is installed
export interface Chain {
  id: number;
  name: string;
  network: string;
  nativeCurrency: {
    decimals: number;
    name: string;
    symbol: string;
  };
  rpcUrls: {
    default: {
      http: string[];
      webSocket?: string[];
    };
    public: {
      http: string[];
      webSocket?: string[];
    };
  };
  blockExplorers?: {
    default: {
      name: string;
      url: string;
    };
  };
  testnet?: boolean;
}

export interface WalletConfig {
  appName: string;
  appUrl?: string;
  appIcon?: string;
  appDescription?: string;
  projectId?: string;
  chains: Chain[];
  socialLogin?: SocialLoginConfig;
  theme?: WalletTheme;
}

export interface SocialLoginConfig {
  providers: SocialProvider[];
  redirectUrl?: string;
  clientIds: {
    google?: string;
    facebook?: string;
    apple?: string;
    twitter?: string;
    discord?: string;
    github?: string;
  };
}

export type SocialProvider = 'google' | 'facebook' | 'apple' | 'twitter' | 'discord' | 'github';

export interface WalletTheme {
  colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    text?: string;
    border?: string;
  };
  borderRadius?: number;
  fontFamily?: string;
}

export interface WalletAccount {
  address: string;
  balance?: string;
  chainId: number;
  isConnected: boolean;
  connector?: string;
  ensName?: string;
  ensAvatar?: string;
}

export interface WalletState {
  account?: WalletAccount;
  isConnecting: boolean;
  isReconnecting: boolean;
  isDisconnected: boolean;
  pendingConnector?: string;
  error?: Error;
}

export interface ConnectorData {
  account?: string;
  chain?: { id: number; unsupported?: boolean };
  provider?: any;
}

export interface ConnectorEvents {
  change: (data: ConnectorData) => void;
  connect: (data: ConnectorData) => void;
  disconnect: () => void;
  error: (error: Error) => void;
  message: (message: { type: string; data?: any }) => void;
}

export interface SocialLoginResult {
  provider: SocialProvider;
  user: {
    id: string;
    email?: string;
    name?: string;
    avatar?: string;
  };
  token: string;
  expiresAt: number;
}

export interface WalletConnector {
  id: string;
  name: string;
  icon?: string;
  ready: boolean;
  connect: (config?: any) => Promise<ConnectorData>;
  disconnect: () => Promise<void>;
  getAccount: () => Promise<string>;
  getChainId: () => Promise<number>;
  getProvider: () => Promise<any>;
  getSigner: () => Promise<any>;
  isAuthorized: () => Promise<boolean>;
  switchChain: (chainId: number) => Promise<void>;
  on: <K extends keyof ConnectorEvents>(
    event: K,
    listener: ConnectorEvents[K]
  ) => void;
  off: <K extends keyof ConnectorEvents>(
    event: K,
    listener: ConnectorEvents[K]
  ) => void;
}

export interface DSportsWalletOptions {
  projectId: string;
  chains: Chain[];
  socialLogin?: SocialLoginConfig;
  theme?: WalletTheme;
  metadata?: {
    name: string;
    description: string;
    url: string;
    icons: string[];
  };
}

export interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (connector: WalletConnector) => void;
  connectors: WalletConnector[];
  theme?: WalletTheme;
}

export interface RainbowKitConnectorOptions {
  chains: Chain[];
  projectId: string;
  appName: string;
  appIcon?: string;
  appDescription?: string;
  appUrl?: string;
  socialLogin?: SocialLoginConfig;
}

export interface WagmiConnectorOptions {
  chains: Chain[];
  projectId: string;
  metadata?: {
    name: string;
    description: string;
    url: string;
    icons: string[];
  };
  socialLogin?: SocialLoginConfig;
}

export type Platform = 'web' | 'react-native' | 'nextjs';

export interface PlatformAdapter {
  platform: Platform;
  storage: {
    getItem: (key: string) => Promise<string | null>;
    setItem: (key: string, value: string) => Promise<void>;
    removeItem: (key: string) => Promise<void>;
  };
  crypto: {
    generateRandomBytes: (size: number) => Uint8Array;
    sha256: (data: Uint8Array) => Promise<Uint8Array>;
  };
  network: {
    fetch: (url: string, options?: any) => Promise<Response>;
  };
}

export interface WalletError extends Error {
  code: string;
  details?: any;
}

export interface WalletEventMap {
  'connect': WalletAccount;
  'disconnect': void;
  'accountsChanged': string[];
  'chainChanged': number;
  'error': WalletError;
  'socialLogin': SocialLoginResult;
}

// Re-export for convenience
export { SocialLoginProvider } from '../providers/social-login'; 