# @d-sports/wallet Comprehensive API Documentation

> **Structured for MCP/Context7 Integration** - Complete documentation with docstrings, code snippets, and usage patterns for automated documentation ingestion.

## 📋 Table of Contents

<!-- TOC -->
- [📋 Table of Contents](#-table-of-contents)
- [️ Core Architecture](#️-core-architecture)
  - [Overview](#overview)
  - [Architecture Philosophy](#architecture-philosophy)
  - [Core Components](#core-components)
- [📚 Public APIs](#-public-apis)
  - [1. Core Wallet API](#1-core-wallet-api)
  - [2. Connection Methods](#2-connection-methods)
  - [3. React Hooks API](#3-react-hooks-api)
  - [4. Platform Adapters](#4-platform-adapters)
- [️ Usage Patterns](#️-usage-patterns)
  - [1. Basic Integration Pattern](#1-basic-integration-pattern)
  - [2. Next.js Pattern](#2-nextjs-pattern)
  - [3. React Native Pattern](#3-react-native-pattern)
- [🔧 Configuration Reference](#-configuration-reference)
  - [1. Wallet Configuration Schema](#1-wallet-configuration-schema)
  - [2. Social Login Providers](#2-social-login-providers)
  - [3. Platform-Specific Configurations](#3-platform-specific-configurations)
- [️ Testing Patterns](#️-testing-patterns)
  - [1. Unit Testing](#1-unit-testing)
  - [2. Integration Testing](#2-integration-testing)
- [️ Development Setup](#️-development-setup)
  - [1. Environment Setup](#1-environment-setup)
  - [2. IDE Configuration](#2-ide-configuration)
  - [3. Build Commands Reference](#3-build-commands-reference)
- [📦 Package Structure Documentation](#-package-structure-documentation)
  - [1. Directory Structure](#1-directory-structure)
  - [2. Source Code Organization](#2-source-code-organization)
- [️ MCP/Context7 Integration](#️-mcpcontext7-integration)
  - [1. Documentation Structure for Tool Ingestion](#1-documentation-structure-for-tool-ingestion)
  - [2. Code Snippet Standards](#2-code-snippet-standards)
- [📚 Complete Usage Guide](#-complete-usage-guide)
  - [1. Quick Start (5 minutes)](#1-quick-start-5-minutes)
  - [2. Production Setup](#2-production-setup)
- [🔗 Resource Links](#-resource-links)
- [️ Version Compatibility](#️-version-compatibility)
<!-- /TOC -->

---

## ️ Core Architecture

### Overview

```typescript
/**
 * @d-sports/wallet is a comprehensive multi-platform wallet SDK built on TypeScript
 * @description Provides deterministic wallet generation with social login integration
 * @author D-Sports Engineering Team
 * @version 1.1.1
 * @since 2025-07-23
 */
```

### Architecture Philosophy

```typescript
/**
 * Modular architecture with platform-specific adapters
 * @description Allows same core functionality across environments while maintaining optimal performance
 * @pattern Adapter Pattern with Factory Methods
 * @platforms ["Web", "Next.js", "React Native"]
 */
```

### Core Components

```typescript
/**
 * @class DSportsWallet
 * @description Main wallet class providing deterministic key generation
 * @extends EventEmitter
 * @implements WalletProviderInterface
 * @param {Object} options - Configuration options
 * @param {string} options.appName - Application name for branding
 * @param {string} options.appIcon - Application icon URL
 * @param {string} options.appSecret - Custom secret for security
 * @returns {DSportsWallet} Configured wallet instance
 */
```

---

## 📚 Public APIs

### 1. Core Wallet API

```typescript
/**
 * @function createDSportsWallet
 * @description Factory method for creating wallet instances
 * @param {Object} config - Configuration object
 * @param {string} [config.appName] - Application name for display
 * @param {string} [config.appIcon] - Application icon URL
 * @param {string} [config.appSecret] - Custom secret for deterministic generation
 * @param {boolean} [config.enableSocialLogin] - Enable social login integration
 * @returns {Promise<DSportsWallet>} Wallet instance with full configuration
 * @example
 * ```typescript
 * const wallet = await createDSportsWallet({
 *   appName: "My DApp",
 *   appIcon: "https://myapp.com/icon.png",
 *   appSecret: "my-custom-secret",
 *   enableSocialLogin: true
 * });
 * ```
 */
```

### 2. Connection Methods

```typescript
/**
 * @method connect
 * @description Establish wallet connection with social login
 * @param {Object} [config] - Connection configuration
 * @param {boolean} [config.socialLogin] - Enable social login flow
 * @param {string} [config.provider] - Specific OAuth provider
 * @returns {Promise<WalletAccount>} Connected wallet account
 * @throws {WalletError} When connection fails
 * @example
 * ```typescript
 * const account = await wallet.connect({
 *   socialLogin: true,
 *   provider: "google"
 * });
 * ```
 */
```

### 3. React Hooks API

```typescript
/**
 * @function useDSportsWallet
 * @description React hook for wallet state management
 * @param {Object} [config] - Hook configuration
 * @returns {Object} Hook return values
 * @property {boolean} isConnected - Connection status
 * @property {string} address - Wallet address
 * @property {function} connect - Connection method
 * @property {function} disconnect - Disconnection method
 * @property {WalletAccount} account - Full account details
 * @example
 * ```typescript
 * const { isConnected, address, connect, disconnect } = useDSportsWallet(wallet);
 * ```
 */
```

### 4. Platform Adapters

```typescript
/**
 * @function createDSportsWalletNextjs
 * @description Next.js specific wallet factory
 * @param {NextjsWalletConfig} config - Next.js specific configuration
 * @param {string} config.redirectUri - OAuth redirect URI
 * @param {string} config.appUrl - Next.js app URL
 * @returns {Promise<NextjsWallet>} Next.js optimized wallet
 */
```

```typescript
/**
 * @function createDSportsWalletReactNative
 * @description React Native specific wallet factory
 * @param {ReactNativeWalletConfig} config - React Native configuration
 * @param {string} config.bundleIdentifier - iOS/Android bundle ID
 * @param {string} config.universalLink - Universal link for deep linking
 * @returns {Promise<ReactNativeWallet>} React Native optimized wallet
 */
```

---

## ️ Usage Patterns

### 1. Basic Integration Pattern

```typescript
/**
 * @pattern BasicWalletSetup
 * @description Minimal setup for wallet integration
 * @steps
 * 1. Import the wallet factory
 * 2. Create wallet instance
 * 3. Connect to blockchain
 * 4. Handle connection events
 * @example
 * ```typescript
 * // Step 1: Import
 * import { createDSportsWallet } from '@d-sports/wallet';
 * 
 * // Step 2: Create instance
 * const wallet = await createDSportsWallet({
 *   appName: "My DApp",
 *   appIcon: "https://myapp.com/icon.png"
 * });
 * 
 * // Step 3: Connect
 * await wallet.connect();
 * 
 * // Step 4: Handle events
 * wallet.on('connect', handleConnection);
 * ```
 */
```

### 2. Next.js Pattern

```typescript
/**
 * @pattern NextjsIntegration
 * @description Complete Next.js integration pattern
 * @steps
 * 1. Configure Next.js specific adapters
 * 2. Set up OAuth redirect URIs
 * 3. Implement server-side wallet management
 * 4. Handle SSR hydration
 * @example
 * ```typescript
 * // pages/wallet.ts
 * import { createDSportsWalletNextjs } from '@d-sports/wallet/nextjs';
 * 
 * export async function getServerSideProps() {
 *   const wallet = await createDSportsWalletNextjs({
 *     appName: "Next.js DApp",
 *     redirectUri: `${process.env.NEXT_PUBLIC_URL}/auth/callback`
 *   });
 *   
 *   return { props: { wallet } };
 * }
 * ```
 */
```

### 3. React Native Pattern

```typescript
/**
 * @pattern ReactNativeIntegration
 * @description Complete React Native integration pattern
 * @steps
 * 1. Configure React Native specific adapters
 * 2. Set up deep linking
 * 3. Handle platform-specific storage
 * 4. Implement native OAuth flows
 * @example
 * ```typescript
 * // App.tsx
 * import { createDSportsWalletReactNative } from '@d-sports/wallet/react-native';
 * 
 * const wallet = await createDSportsWalletReactNative({
 *   appName: "Mobile DApp",
 *   bundleIdentifier: "org.myapp.dapp",
 *   universalLink: "https://myapp.com/auth"
 * });
 * 
 * // Handle deep linking
 * wallet.onDeepLink = handleUniversalLink;
 * ```
 */
```

---

## 🔧 Configuration Reference

### 1. Wallet Configuration Schema

```typescript
/**
 * @interface DSportsWalletOptions
 * @description Complete wallet configuration schema
 * @property {string} appName - Application display name
 * @property {string} appIcon - Application icon URL (SVG preferred)
 * @property {string} appSecret - Custom secret for deterministic generation
 * @property {boolean} enableSocialLogin - Enable OAuth integration
 * @property {Object} socialLoginConfig - Social login specific config
 * @property {string} redirectUri - OAuth redirect URI
 * @property {Array<string>} supportedChains - Supported blockchain networks
 * @property {Object} theme - UI theme configuration
 * @property {string} storageProvider - Storage backend (localStorage|AsyncStorage|Keychain)
 */
```

### 2. Social Login Providers

```typescript
/**
 * @object SocialProviders
 * @description Supported OAuth providers configuration
 * @property {GoogleProvider} google - Google OAuth 2.0
 * @property {FacebookProvider} facebook - Facebook Login
 * @property {TwitterProvider} twitter - Twitter OAuth 2.0
 * @property {DiscordProvider} discord - Discord OAuth
 * @property {GitHubProvider} github - GitHub OAuth 2.0
 * @property {AppleProvider} apple - Sign in with Apple
 */
```

### 3. Platform-Specific Configurations

```typescript
/**
 * @interface NextjsConfig
 * @description Next.js specific configuration
 * @property {string} appUrl - Next.js application URL
 * @property {string} redirectUri - OAuth redirect URI
 * @property {boolean} ssr - Enable server-side rendering
 * @property {string} sessionProvider - Session storage provider
 */
```

```typescript
/**
 * @interface ReactNativeConfig
 * @description React Native specific configuration
 * @property {string} bundleIdentifier - App bundle identifier
 * @property {string} universalLink - Universal link domain
 * @property {boolean} enableDeepLink - Enable deep linking
 * @property {string} storageProvider - Native storage provider
 */
```

---

## ️ Testing Patterns

### 1. Unit Testing

```typescript
/**
 * @pattern WalletUnitTesting
 * @description Complete unit testing pattern
 * @example
 * ```typescript
 * describe('DSportsWallet', () => {
 *   let wallet: DSportsWallet;
 *   
 *   beforeEach(async () => {
 *     wallet = await createDSportsWallet({
 *       appName: "Test App",
 *       appSecret: "test-secret"
 *     });
 *   });
 *   
 *   test('should generate deterministic keys', async () => {
 *     const key1 = await wallet.generateKey();
 *     const key2 = await wallet.generateKey();
 *     expect(key1).toEqual(key2); // Deterministic generation
 *   });
 *   
 *   test('should handle OAuth flow', async () => {
 *     await wallet.connect({ socialLogin: true });
 *     expect(wallet.isConnected).toBe(true);
 *   });
 * });
 * ```
 */
```

### 2. Integration Testing

```typescript
/**
 * @pattern PlatformIntegrationTesting
 * @description Cross-platform integration testing
 * @example
 * ```typescript
 * describe('Platform Adapters', () => {
 *   test('Next.js integration', async () => {
 *     const wallet = await createDSportsWalletNextjs({
 *       appUrl: "http://localhost:3000",
 *       redirectUri: "http://localhost:3000/auth/callback"
 *     });
 *     
 *     expect(wallet.config.appUrl).toBe("http://localhost:3000");
 *   });
 *   
 *   test('React Native integration', async () => {
 *     const wallet = await createDSportsWalletReactNative({
 *       bundleIdentifier: "com.test.app",
 *       universalLink: "https://test.app"
 *     });
 *     
 *     expect(wallet.config.bundleIdentifier).toBe("com.test.app");
 *   });
 * });
 * ```
 */
```

---

## ️ Development Setup

### 1. Environment Setup

```bash
#!/bin/bash
# @description Complete development environment setup
# @steps
# 1. Clone repository
# 2. Install dependencies
# 3. Configure development environment
# 4. Run initial tests

#!/bin/bash
git clone https://github.com/D-Sports-Ecosystem/wallet.git
cd wallet
npm install
npm run build:core
npm run test:watch
```

### 2. IDE Configuration

```typescript
/**
 * @vscode Configuration for optimal development
 * @file .vscode/settings.json
 * ```json
 * {
 *   "typescript.suggest.autoImport": true,
 *   "typescript.completion.enabled": true,
 *   "eslint.validate": ["typescript", "javascript"],
 *   "jest.autoTest": true,
 *   "npm.run": "npm run"
 * }
 * ```
 */
```

### 3. Build Commands Reference

```typescript
/**
 * @object BuildCommands
 * @description Complete build command reference
 * @property {string} dev - Start development mode with watch
 * @property {string} build - Build all packages
 * @property {string} build:core - Build core package only
 * @property {string} build:nextjs - Build Next.js package
 * @property {string} build:react-native - Build React Native package
 * @property {string} clean - Clean build artifacts
 * @property {string} lint - Run ESLint
 * @property {string} typecheck - TypeScript validation
 * @property {string} test - Run Jest tests
 * @property {string} test:watch - Run tests in watch mode
 */
```

---

## 📦 Package Structure Documentation

### 1. Directory Structure

```
@d-sports/wallet/
├── src/                    # Source code (TypeScript)
├── dist/                   # Build output (generated)
├── app/                    # Next.js demo application
├── data/                   # Static configuration data
├── .kiro/                  # AI assistant configuration
├── .github/                # GitHub workflows
├── docs/                   # Documentation (this file)
└── node_modules/           # Dependencies (generated)
```

### 2. Source Code Organization

```
src/
├── core/                   # Core wallet functionality
│   ├── wallet.ts          # Main DSportsWallet class
│   ├── stores/            # Zustand state management
│   └── __tests/           # Core functionality tests
├── types/                 # TypeScript type definitions
│   └── index.ts          # All exported types
├── utils/                 # Utility functions
│   ├── event-emitter.ts  # Custom event emitter
│   └── platform-adapters.ts # Platform-specific adapters
```

---

## ️ MCP/Context7 Integration

### 1. Documentation Structure for Tool Ingestion

```typescript
/**
 * @format Context7Compatible
 * @description Documentation structured for automated tool ingestion
 * @sections [
 *   "Core Architecture",
 *   "Public APIs",
 *   "Usage Patterns",
 *   "Platform Adapters",
 *   "Configuration Reference",
 *   "Testing Patterns"
 * ]
 * @properties [
 *   "@class",
 *   "@function",
 *   "@method",
 *   "@interface",
 *   "@pattern",
 *   "@example"
 * ]
 */
```

### 2. Code Snippet Standards

```typescript
/**
 * @standard CodeSnippetFormat
 * @description Standard format for all code examples
 * @requirements [
 *   "Complete imports",
 *   "Realistic configuration",
 *   "Error handling examples",
 *   "Platform-specific variations"
 * ]
 * @format markdown fenced blocks with language specification
 */
```

---

## 📚 Complete Usage Guide

### 1. Quick Start (5 minutes)

```typescript
/**
 * @pattern QuickStartPattern
 * @description Fast integration for prototyping
 * @steps [
 *   "1. Install package",
 *   "2. Create wallet instance",
 *   "3. Connect immediately",
 *   "4. Start development"
 * ]
 * @example
 * ```typescript
 * // Install
 * npm install @d-sports/wallet
 * 
 * // Quick setup
 * import { createDSportsWallet } from '@d-sports/wallet';
 * 
 * const wallet = await createDSportsWallet({ appName: "Quick Demo" });
 * await wallet.connect();
 * 
 * // Development ready
 * console.log("Wallet ready for development!");
 * ```
 */
```

### 2. Production Setup

```typescript
/**
 * @pattern ProductionSetup
 * @description Complete production configuration
 * @steps [
 *   "1. Configure OAuth applications",
 *   "2. Set up custom branding",
 *   "3. Implement security measures",
 *   "4. Deploy monitoring"
 * ]
 * @example
 * ```typescript
 * // Production configuration
 * const wallet = await createDSportsWallet({
 *   appName: "Production App",
 *   appIcon: "https://production.app/icon.svg",
 *   appSecret: process.env.APP_SECRET,
 *   enableSocialLogin: true,
 *   redirectUri: "https://production.app/auth/callback"
 * });
 * 
 * // Security implementation
 * wallet.on('error', handleSecurityError);
 * wallet.on('connect', logConnectionEvent);
 * ```
 */
```

---

## 🔗 Resource Links

```typescript
/**
 * @object ResourceLinks
 * @description Complete resource collection
 * @property {string} repository - https://github.com/D-Sports-Ecosystem/wallet.git
 * @property {string} documentation - https://github.com/D-Sports-Ecosystem/wallet#readme
 * @property {string} issues - https://github.com/D-Sports-Ecosystem/wallet/issues
 * @property {string} license - MIT License
 * @property {string} support - https://discord.gg/d-sports
 */
```

---

## ️ Version Compatibility

```typescript
/**
 * @object VersionCompatibility
 * @description Version compatibility matrix
 * @property {string} node - >=20.x (current requirement)
 * @property {string} typescript - >=4.x
 * @property {string} react - >=18.x
 * @property {string} ethers - >=6.x
 * @property {string} rollup - >=3.x
 * @property {string} jest - >=29.x
 */
```

**Made with ❤️ by the D-Sports team** - Complete documentation for automated tool integration and cross-project compatibility.
