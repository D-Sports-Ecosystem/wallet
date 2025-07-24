/**
 * @file index.ts
 * @description Browser-specific entry point for the D-Sports wallet SDK.
 * Provides browser-optimized implementations and excludes server-side utilities.
 * @module browser
 * @author D-Sports Engineering Team
 * @version 1.0.0
 * @since 2025-07-23
 */

import "../index.css";

// Core wallet functionality (client-side only)
export { DSportsWallet } from "../core/wallet";
export { CustomSocialLoginProvider } from "../providers/custom-social-login";
export {
  DSportsOAuthService,
  createQuickStartSocialLogin,
  validateSocialLoginConfig,
} from "../providers/dsports-oauth-service";

// Connectors (client-side only)
export {
  DSportsRainbowKitConnector,
  createDSportsRainbowKitConnector,
} from "../connectors/rainbow-kit";
export {
  DSportsWagmiConnector,
  createDSportsWagmiConnector,
  dsportsWagmiConnector,
} from "../connectors/wagmi";

// Platform adapters (browser-specific)
export {
  webPlatformAdapter,
  getDefaultPlatformAdapter,
} from "../utils/platform-adapters";

// Event emitter utility
export { EventEmitter } from "../utils/event-emitter";

// Animation utilities (browser-compatible)
export {
  loadUnifiedAnimations,
  getUnifiedAnimations,
  detectAnimationCapabilities,
  cssAnimationClasses,
  animations,
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideInLeft,
  BounceIn,
  Shimmer,
  // Legacy compatibility
  loadSafeAnimations,
  getSafeAnimations,
} from "../utils/animation-utils";

// Animation hooks (browser-compatible)
export {
  useAnimations,
  useAnimation,
  useFadeAnimation,
  useSlideAnimation,
  useBounceAnimation,
  useShimmerAnimation,
} from "../hooks/useAnimations";

// Animation components (browser-compatible)
export {
  AnimatedWrapper,
  FadeInWrapper,
  FadeOutWrapper,
  SlideInRightWrapper,
  SlideInLeftWrapper,
  BounceInWrapper,
  ShimmerWrapper,
  withAnimation,
} from "../components/AnimatedWrapper";

// All types
export * from "../types";

// Factory functions for browser environment
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
import { webPlatformAdapter } from "../utils/platform-adapters";
import {
  WalletConfig,
  DSportsWalletOptions,
  RainbowKitConnectorOptions,
  WagmiConnectorOptions,
} from "../types";

/**
 * Creates a D-Sports wallet instance optimized for browser environments.
 * Configures the wallet with the appropriate platform adapter and connectors.
 * 
 * @function
 * @param {DSportsWalletOptions} options - Configuration options for the wallet
 * @returns {DSportsWallet} A configured D-Sports wallet instance
 * 
 * @example
 * ```typescript
 * // Create a wallet for browser environment
 * const wallet = createDSportsWallet({
 *   projectId: 'your-project-id',
 *   chains: [mainnet, polygon],
 *   metadata: {
 *     name: 'My D-Sports App',
 *     description: 'A D-Sports wallet integration',
 *     url: 'https://myapp.com',
 *     icons: ['https://myapp.com/icon.png']
 *   }
 * });
 * ```
 */
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

  const wallet = new DSportsWallet(config, webPlatformAdapter);

  // Add social login provider if configured
  if (options.socialLogin) {
    // Validate configuration if environment is specified
    const validatedConfig = options.environment
      ? validateSocialLoginConfig(options.socialLogin, options.environment)
      : options.socialLogin;

    const socialProvider = new CustomSocialLoginProvider(
      validatedConfig,
      webPlatformAdapter
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

/**
 * Creates a D-Sports wallet instance with quick start OAuth configuration.
 * Uses D-Sports managed OAuth credentials for rapid development and testing.
 * 
 * @function
 * @param {Omit<DSportsWalletOptions, "socialLogin">} options - Configuration options for the wallet (excluding socialLogin)
 * @returns {DSportsWallet} A configured D-Sports wallet instance with managed OAuth
 * 
 * @example
 * ```typescript
 * // Create a wallet with quick start OAuth
 * const wallet = createDSportsWalletQuickStart({
 *   projectId: 'your-project-id',
 *   chains: [mainnet, polygon]
 * });
 * 
 * // Connect with social login
 * await wallet.connect('dsports-wallet', { socialLogin: true });
 * ```
 */
export function createDSportsWalletQuickStart(
  options: Omit<DSportsWalletOptions, "socialLogin">
): DSportsWallet {
  console.log("🚀 Creating D-Sports wallet with quick start OAuth!");
  console.log(
    "📝 This uses D-Sports managed credentials - perfect for development."
  );
  console.log(
    "🔧 For production, use createDSportsWallet() with your own OAuth apps."
  );

  return createDSportsWallet({
    ...options,
    socialLogin: createQuickStartSocialLogin(),
    environment: "development",
  });
}

// Browser-specific Rainbow Kit connector factory
export function createDSportsRainbowKitConnectorForBrowser(
  options: RainbowKitConnectorOptions
) {
  const socialProvider = options.socialLogin
    ? new CustomSocialLoginProvider(options.socialLogin, webPlatformAdapter)
    : undefined;

  return createDSportsRainbowKitConnector({
    ...options,
    customSocialLoginProvider: socialProvider,
  });
}

// Browser-specific Wagmi connector factory
export function createDSportsWagmiConnectorForBrowser(
  options: WagmiConnectorOptions
) {
  const socialProvider = options.socialLogin
    ? new CustomSocialLoginProvider(options.socialLogin, webPlatformAdapter)
    : undefined;

  return createDSportsWagmiConnector({
    ...options,
    customSocialLoginProvider: socialProvider,
  });
}

// Browser-specific Wagmi v2 connector
export function dsportsWagmiConnectorForBrowser(options: WagmiConnectorOptions) {
  const socialProvider = options.socialLogin
    ? new CustomSocialLoginProvider(options.socialLogin, webPlatformAdapter)
    : undefined;

  return dsportsWagmiConnector({
    ...options,
    customSocialLoginProvider: socialProvider,
  });
}

// Common chains for browser
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

// UI Components (browser-compatible)
export * from "../components/ui";
export { TokenUpdateStatus } from "../components/token-update-status";
export { TokenUpdateConfig as TokenUpdateConfigComponent } from "../components/token-update-config";

// Token data and context (client-side only)
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

// Token fetcher utilities (client-side only)
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

export { WalletModal } from "../wallet-modal";
export { default as WalletPage } from "../wallet-page";

// Version
export const version = "1.0.0";