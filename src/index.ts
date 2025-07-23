/**
 * @file src/index.ts
 * @description Universal entry point for @d-sports/wallet library
 * @overview Detects runtime environment and loads appropriate platform-specific code
 * @environment-detection [Browser, Server, React Native]
 * @exports All public APIs for cross-platform usage
 * @author D-Sports Engineering Team
 * @version 1.1.1
 * @since 2025-07-23
 */

/**
 * @section Universal Entry Point
 * @description This file serves as the universal entry point for the wallet library,
 * automatically detecting the runtime environment and loading appropriate
 * platform-specific implementations.
 * @platforms [Browser, Next.js, React Native]
 * @import-detection Handles CSS styles and platform-specific imports
 */

/**
 * @import "./index.css"
 * @description Import CSS styles handled by bundler
 * @note CSS will be processed by the platform-specific bundler
 * @platforms [Webpack, Rollup, Metro]
 */
// For browser-only usage, import from '@d-sports/wallet/browser'
// For server-only usage, import from '@d-sports/wallet/server'

// Import CSS styles (will be handled by bundler)
import "./index.css";

/**
 * @exports DSportWallet
 * @description Core wallet functionality exported from ./core/wallet
 * @class DSportsWallet
 * @overview Main wallet class providing deterministic key generation
 * @extends EventEmitter for event handling
 * @implements WalletProviderInterface for provider compatibility
 * @methods [connect, disconnect, generateKey, addConnector, removeConnector]
 */

/**
 * @exports CustomSocialLoginProvider
 * @description OAuth integration exported from ./providers/custom-social_login
 * @class CustomSocialLoginProvider
 * @overview Custom social login provider for OAuth integration
 * @supports [Google, Facebook, Twitter, Discord, GitHub, Apple]
 * @methods [authenticate, authorize, callback, tokenExchange]
 */

/**
 * @exports DSportsOAuthService
 * @description Managed OAuth service exported from ./providers/dsports_oauth_service
 * @class DSportsOAuthService
 * @overview D-Sports managed OAuth service for instant development
 * @features [Quick setup, Managed credentials, Development OAuth]
 * @methods [createQuickStartSocialLogin, validateSocialLoginConfig]
 */
export { DSportsWallet } from "./core/wallet";
export { CustomSocialLoginProvider } from "./providers/custom-social-login";
export {
  DSportsOAuthService,
  createQuickStartSocialLogin,
  validateSocialLoginConfig,
} from "./providers/dsports-oauth-service";

// Connectors
export {
  DSportsRainbowKitConnector,
  createDSportsRainbowKitConnector,
} from "./connectors/rainbow-kit";
export {
  DSportsWagmiConnector,
  createDSportsWagmiConnector,
  dsportsWagmiConnector,
} from "./connectors/wagmi";

// Platform adapters (with environment detection)
export {
  webPlatformAdapter,
  nextjsPlatformAdapter,
  reactNativePlatformAdapter,
  getDefaultPlatformAdapter,
  getDefaultPlatformAdapterAsync,
} from "./utils/platform-adapters";

// Event emitter utility
export { EventEmitter } from "./utils/event-emitter";

// Animation utilities
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
} from "./utils/animation-utils";

// Animation hooks
export {
  useAnimations,
  useAnimation,
  useFadeAnimation,
  useSlideAnimation,
  useBounceAnimation,
  useShimmerAnimation,
} from "./hooks/useAnimations";

// Animation components
export {
  AnimatedWrapper,
  FadeInWrapper,
  FadeOutWrapper,
  SlideInRightWrapper,
  SlideInLeftWrapper,
  BounceInWrapper,
  ShimmerWrapper,
  withAnimation,
} from "./components/AnimatedWrapper";

// All types
export * from "./types";

// Factory functions for easy setup
import { DSportsWallet } from "./core/wallet";
import { CustomSocialLoginProvider } from "./providers/custom-social-login";
import {
  createQuickStartSocialLogin,
  validateSocialLoginConfig,
} from "./providers/dsports-oauth-service";
import {
  DSportsRainbowKitConnector,
  createDSportsRainbowKitConnector,
} from "./connectors/rainbow-kit";
import {
  DSportsWagmiConnector,
  createDSportsWagmiConnector,
  dsportsWagmiConnector,
} from "./connectors/wagmi";
import { getDefaultPlatformAdapter } from "./utils/platform-adapters";
import {
  WalletConfig,
  DSportsWalletOptions,
  RainbowKitConnectorOptions,
  WagmiConnectorOptions,
} from "./types";

// Universal wallet factory
export function createDSportsWallet(
  options: DSportsWalletOptions
): DSportsWallet {
  const platformAdapter = getDefaultPlatformAdapter();

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

  const wallet = new DSportsWallet(config, platformAdapter);

  // Add social login provider if configured
  if (options.socialLogin) {
    // Validate configuration if environment is specified
    const validatedConfig = options.environment
      ? validateSocialLoginConfig(options.socialLogin, options.environment)
      : options.socialLogin;

    const socialProvider = new CustomSocialLoginProvider(
      validatedConfig,
      platformAdapter
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

// Quick start wallet factory (uses D-Sports managed OAuth)
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

// Universal Rainbow Kit connector factory
export function createDSportsRainbowKitConnectorUniversal(
  options: RainbowKitConnectorOptions
) {
  const platformAdapter = getDefaultPlatformAdapter();
  const socialProvider = options.socialLogin
    ? new CustomSocialLoginProvider(options.socialLogin, platformAdapter)
    : undefined;

  return createDSportsRainbowKitConnector({
    ...options,
    customSocialLoginProvider: socialProvider,
  });
}

// Universal Wagmi connector factory
export function createDSportsWagmiConnectorUniversal(
  options: WagmiConnectorOptions
) {
  const platformAdapter = getDefaultPlatformAdapter();
  const socialProvider = options.socialLogin
    ? new CustomSocialLoginProvider(options.socialLogin, platformAdapter)
    : undefined;

  return createDSportsWagmiConnector({
    ...options,
    customSocialLoginProvider: socialProvider,
  });
}

// Universal Wagmi v2 connector
export function dsportsWagmiConnectorUniversal(options: WagmiConnectorOptions) {
  const platformAdapter = getDefaultPlatformAdapter();
  const socialProvider = options.socialLogin
    ? new CustomSocialLoginProvider(options.socialLogin, platformAdapter)
    : undefined;

  return dsportsWagmiConnector({
    ...options,
    customSocialLoginProvider: socialProvider,
  });
}

// Common chains
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

// UI Components (browser/client-side only)
// These are conditionally exported to prevent server-side rendering issues
let uiComponents: any = {};
let tokenComponents: any = {};

if (typeof window !== 'undefined') {
  // Only load UI components in browser environments
  try {
    uiComponents = require("./components/ui");
    tokenComponents = {
      TokenUpdateStatus: require("./components/token-update-status").TokenUpdateStatus,
      TokenUpdateConfigComponent: require("./components/token-update-config").TokenUpdateConfig,
    };
  } catch (error) {
    console.warn("UI components not available:", error);
  }
}

// Export UI components conditionally
export const {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} = uiComponents;

export const { TokenUpdateStatus, TokenUpdateConfigComponent } = tokenComponents;

// Token data and context
export { TokenProvider, useTokens } from "./contexts/token-context";
export {
  tokenService,
  type TokenInfo,
  type Transaction,
} from "./services/token-service";
export {
  tokenUpdateService,
  createTokenUpdateService,
  type TokenUpdateConfig,
} from "./services/token-update-service";
export {
  tokenSyncService,
  createTokenSyncService,
  type TokenSyncConfig,
} from "./utils/token-sync";
export {
  tokenBackgroundService,
  createTokenBackgroundService,
  type TokenBackgroundServiceConfig,
} from "./services/token-background-service";

// Token fetcher utilities
export {
  updateTokenData,
  getTokenData,
  getTokenBySymbol,
  getAllTokenSymbols,
  getTokensByNetwork,
  clearTokenData,
  getLastUpdated,
  isTokenDataStale,
} from "./utils/token-fetcher";
// Wallet UI components (browser/client-side only)
let walletUIComponents: any = {};

if (typeof window !== 'undefined') {
  try {
    walletUIComponents = {
      WalletModal: require("./wallet-modal").WalletModal,
      WalletPage: require("./wallet-page").default,
    };
  } catch (error) {
    console.warn("Wallet UI components not available:", error);
  }
}

export const { WalletModal, WalletPage } = walletUIComponents;

// Version
export const version = "1.0.0";
