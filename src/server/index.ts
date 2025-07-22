// Server-specific entry point - includes server-side utilities
// Note: This should only be used in Node.js environments

// Core wallet functionality (server-compatible)
export { DSportsWallet } from "../core/wallet";
export { CustomSocialLoginProvider } from "../providers/custom-social-login";
export {
  DSportsOAuthService,
  createQuickStartSocialLogin,
  validateSocialLoginConfig,
} from "../providers/dsports-oauth-service";

// Connectors (server-compatible)
export {
  DSportsRainbowKitConnector,
  createDSportsRainbowKitConnector,
} from "../connectors/rainbow-kit";
export {
  DSportsWagmiConnector,
  createDSportsWagmiConnector,
  dsportsWagmiConnector,
} from "../connectors/wagmi";

// Platform adapters (server-compatible)
export {
  nextjsPlatformAdapter,
  getDefaultPlatformAdapter,
  getDefaultPlatformAdapterAsync,
} from "../utils/platform-adapters";

// Event emitter utility
export { EventEmitter } from "../utils/event-emitter";

// All types
export * from "../types";

// Factory functions for server environment
import { DSportsWallet } from "../core/wallet";
import { CustomSocialLoginProvider } from "../providers/custom-social-login";
import {
  createQuickStartSocialLogin,
  validateSocialLoginConfig,
} from "../providers/dsports-oauth-service";
import {
  DSportsRainbowKitConnector,
  createDSportsRainbowKitConnector,
} from "../connectors/rainbow-kit";
import {
  DSportsWagmiConnector,
  createDSportsWagmiConnector,
  dsportsWagmiConnector,
} from "../connectors/wagmi";
import { nextjsPlatformAdapter } from "../utils/platform-adapters";
import {
  WalletConfig,
  DSportsWalletOptions,
  RainbowKitConnectorOptions,
  WagmiConnectorOptions,
} from "../types";

// Server-specific wallet factory
export function createDSportsWallet(
  options: DSportsWalletOptions
): DSportsWallet {
  const config: WalletConfig = {
    appName: options.metadata?.name || "D-Sports App",
    appUrl: options.metadata?.url,
    appIcon: options.metadata?.icons?.[0],
    appDescription: options.metadata?.description,
    projectId: options.projectId,
    chains: options.chains,
    socialLogin: options.socialLogin,
    theme: options.theme,
  };

  const wallet = new DSportsWallet(config, nextjsPlatformAdapter);

  // Add social login provider if configured
  if (options.socialLogin) {
    // Validate configuration if environment is specified
    const validatedConfig = options.environment
      ? validateSocialLoginConfig(options.socialLogin, options.environment)
      : options.socialLogin;

    const socialProvider = new CustomSocialLoginProvider(
      validatedConfig,
      nextjsPlatformAdapter
    );

    // Create connectors with social login
    const rainbowKitConnector = new DSportsRainbowKitConnector({
      chains: options.chains,
      projectId: options.projectId,
      appName: config.appName,
      appIcon: config.appIcon,
      appDescription: config.appDescription,
      appUrl: config.appUrl,
      socialLogin: validatedConfig,
      customSocialLoginProvider: socialProvider,
    });

    const wagmiConnector = new DSportsWagmiConnector({
      chains: options.chains,
      projectId: options.projectId,
      metadata: options.metadata,
      socialLogin: validatedConfig,
      customSocialLoginProvider: socialProvider,
    });

    wallet.addConnector(rainbowKitConnector);
    wallet.addConnector(wagmiConnector);
  } else {
    // Create connectors without social login
    const rainbowKitConnector = new DSportsRainbowKitConnector({
      chains: options.chains,
      projectId: options.projectId,
      appName: config.appName,
      appIcon: config.appIcon,
      appDescription: config.appDescription,
      appUrl: config.appUrl,
    });

    const wagmiConnector = new DSportsWagmiConnector({
      chains: options.chains,
      projectId: options.projectId,
      metadata: options.metadata,
    });

    wallet.addConnector(rainbowKitConnector);
    wallet.addConnector(wagmiConnector);
  }

  return wallet;
}

// Server-specific Rainbow Kit connector factory
export function createDSportsRainbowKitConnectorForServer(
  options: RainbowKitConnectorOptions
) {
  const socialProvider = options.socialLogin
    ? new CustomSocialLoginProvider(options.socialLogin, nextjsPlatformAdapter)
    : undefined;

  return createDSportsRainbowKitConnector({
    ...options,
    customSocialLoginProvider: socialProvider,
  });
}

// Server-specific Wagmi connector factory
export function createDSportsWagmiConnectorForServer(
  options: WagmiConnectorOptions
) {
  const socialProvider = options.socialLogin
    ? new CustomSocialLoginProvider(options.socialLogin, nextjsPlatformAdapter)
    : undefined;

  return createDSportsWagmiConnector({
    ...options,
    customSocialLoginProvider: socialProvider,
  });
}

// Server-specific Wagmi v2 connector
export function dsportsWagmiConnectorForServer(options: WagmiConnectorOptions) {
  const socialProvider = options.socialLogin
    ? new CustomSocialLoginProvider(options.socialLogin, nextjsPlatformAdapter)
    : undefined;

  return dsportsWagmiConnector({
    ...options,
    customSocialLoginProvider: socialProvider,
  });
}

// Common chains for server
export const mainnet = {
  id: 1,
  name: "Ethereum",
  network: "homestead",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://eth-mainnet.g.alchemy.com/v2/demo"] },
    public: { http: ["https://eth-mainnet.g.alchemy.com/v2/demo"] },
  },
  blockExplorers: {
    default: { name: "Etherscan", url: "https://etherscan.io" },
  },
};

export const goerli = {
  id: 5,
  name: "Goerli",
  network: "goerli",
  nativeCurrency: { name: "Goerli Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://eth-goerli.g.alchemy.com/v2/demo"] },
    public: { http: ["https://eth-goerli.g.alchemy.com/v2/demo"] },
  },
  blockExplorers: {
    default: { name: "Etherscan", url: "https://goerli.etherscan.io" },
  },
  testnet: true,
};

export const polygon = {
  id: 137,
  name: "Polygon",
  network: "matic",
  nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://polygon-rpc.com"] },
    public: { http: ["https://polygon-rpc.com"] },
  },
  blockExplorers: {
    default: { name: "PolygonScan", url: "https://polygonscan.com" },
  },
};

// Server-side utilities (Node.js only)
export async function getServerTokenData() {
  // This would include server-side token data fetching
  // Only available in Node.js environments
  if (typeof window !== 'undefined') {
    throw new Error('getServerTokenData is only available in server environments');
  }
  
  // Server-side token data logic would go here
  return {};
}

// Token data and context (server-compatible)
export { TokenProvider, useTokens } from "../contexts/token-context";
export {
  tokenService,
  type TokenInfo,
  type Transaction,
} from "../services/token-service";
export {
  tokenUpdateService,
  createTokenUpdateService,
  type TokenUpdateConfig,
} from "../services/token-update-service";
export {
  tokenSyncService,
  createTokenSyncService,
  type TokenSyncConfig,
} from "../utils/token-sync";
export {
  tokenBackgroundService,
  createTokenBackgroundService,
  type TokenBackgroundServiceConfig,
} from "../services/token-background-service";

// Token fetcher utilities (server-compatible)
export {
  updateTokenData,
  getTokenData,
  getTokenBySymbol,
  getAllTokenSymbols,
  getTokensByNetwork,
  clearTokenData,
  getLastUpdated,
  isTokenDataStale,
} from "../utils/token-fetcher";

// Version
export const version = "1.0.0";