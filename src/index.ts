// Import CSS styles
import "./index.css";

// Core wallet functionality
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

// Platform adapters
export {
  webPlatformAdapter,
  nextjsPlatformAdapter,
  reactNativePlatformAdapter,
  getDefaultPlatformAdapter,
} from "./utils/platform-adapters";

// Event emitter utility
export { EventEmitter } from "./utils/event-emitter";

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
  options: DSportsWalletOptions,
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
      platformAdapter,
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
  options: Omit<DSportsWalletOptions, "socialLogin">,
): DSportsWallet {
  console.log("🚀 Creating D-Sports wallet with quick start OAuth!");
  console.log(
    "📝 This uses D-Sports managed credentials - perfect for development.",
  );
  console.log(
    "🔧 For production, use createDSportsWallet() with your own OAuth apps.",
  );

  return createDSportsWallet({
    ...options,
    socialLogin: createQuickStartSocialLogin(),
    environment: "development",
  });
}

// Universal Rainbow Kit connector factory
export function createDSportsRainbowKitConnectorUniversal(
  options: RainbowKitConnectorOptions,
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
  options: WagmiConnectorOptions,
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

// UI Components (optional - only if React is available)
export * from "./ui";

// Version
export const version = "1.0.0";
