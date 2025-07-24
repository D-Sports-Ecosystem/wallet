# @d-sports/wallet API Documentation

This document provides a comprehensive overview of the @d-sports/wallet API, including components, utilities, and core functionality.

## Content Overview

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Core Components](#core-components)
- [UI Components](#ui-components)
- [Hooks](#hooks)
- [Utilities](#utilities)
- [Platform-Specific Implementations](#platform-specific-implementations)
- [Documentation Standards](#documentation-standards)
- [Documentation Coverage](#documentation-coverage)

## Table of Contents
<!-- TOC -->
- [Content Overview](#content-overview)
- [Table of Contents](#table-of-contents)
- [Introduction](#introduction)
  - [Key Features](#key-features)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Basic Usage](#basic-usage)
- [Core Components](#core-components)
  - [DSportsWallet](#dsportswallet)
  - [WalletProvider](#walletprovider)
- [UI Components](#ui-components)
  - [WalletButton](#walletbutton)
  - [WalletModal](#walletmodal)
- [Hooks](#hooks)
  - [useWallet](#usewallet)
  - [useTokens](#usetokens)
- [Utilities](#utilities)
  - [Platform Adapters](#platform-adapters)
  - [Token Utilities](#token-utilities)
- [Platform-Specific Implementations](#platform-specific-implementations)
  - [Next.js](#nextjs)
  - [React Native](#react-native)
- [Documentation Standards](#documentation-standards)
- [Documentation Coverage](#documentation-coverage)
<!-- /TOC -->


## Introduction

@d-sports/wallet is a comprehensive, multi-platform wallet SDK for React, Next.js, and React Native applications. It provides free custom social login functionality with support for Rainbow Kit and Wagmi connectors.

### Key Features

- **Multi-platform support**: Works across React, Next.js, and React Native
- **Custom social login**: FREE OAuth integration with Google, Facebook, Twitter, Discord, GitHub, and Apple
- **D-Sports branded**: Fully customizable with no vendor lock-in
- **Rainbow Kit & Wagmi compatible**: Easy integration with existing Web3 tooling
- **Zero cost**: No per-user fees or external dependencies
- **TypeScript-first**: Full TypeScript support with comprehensive type definitions

## Getting Started

### Installation

```bash
npm install @d-sports/wallet
```

### Basic Usage

```typescript
import { createDSportsWallet } from '@d-sports/wallet';

const wallet = createDSportsWallet({
  appName: 'My App',
  chains: [1, 137], // Ethereum, Polygon
  socialProviders: ['google', 'twitter']
});
```

## Core Components

### DSportsWallet

The main wallet class that provides wallet functionality.

```typescript
import { createDSportsWallet } from '@d-sports/wallet';

const wallet = createDSportsWallet({
  appName: 'My App',
  chains: [1, 137],
  socialProviders: ['google', 'twitter']
});

// Connect wallet
await wallet.connect();

// Get account
const account = wallet.getAccount();

// Sign message
const signature = await wallet.signMessage('Hello, world!');
```

### WalletProvider

React context provider for wallet functionality.

```tsx
import { WalletProvider } from '@d-sports/wallet';

function App() {
  return (
    <WalletProvider
      appName="My App"
      chains={[1, 137]}
      socialProviders={['google', 'twitter']}
    >
      <MyApp />
    </WalletProvider>
  );
}
```

## UI Components

### WalletButton

Button component for connecting wallet.

```tsx
import { WalletButton } from '@d-sports/wallet';

function ConnectButton() {
  return <WalletButton>Connect Wallet</WalletButton>;
}
```

### WalletModal

Modal component for wallet connection.

```tsx
import { WalletModal, useWalletModal } from '@d-sports/wallet';

function MyComponent() {
  const { isOpen, onOpen, onClose } = useWalletModal();
  
  return (
    <>
      <button onClick={onOpen}>Open Wallet</button>
      <WalletModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
```

## Hooks

### useWallet

Hook for accessing wallet functionality.

```tsx
import { useWallet } from '@d-sports/wallet';

function MyComponent() {
  const { 
    connect, 
    disconnect, 
    isConnected, 
    account, 
    chainId 
  } = useWallet();
  
  return (
    <div>
      {isConnected ? (
        <>
          <p>Connected: {account}</p>
          <p>Chain ID: {chainId}</p>
          <button onClick={disconnect}>Disconnect</button>
        </>
      ) : (
        <button onClick={connect}>Connect</button>
      )}
    </div>
  );
}
```

### useTokens

Hook for accessing token data.

```tsx
import { useTokens } from '@d-sports/wallet';

function TokenList() {
  const { tokens, isLoading, error } = useTokens();
  
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  return (
    <ul>
      {tokens.map(token => (
        <li key={token.address}>
          {token.symbol}: {token.balance}
        </li>
      ))}
    </ul>
  );
}
```

## Utilities

### Platform Adapters

Adapters for different platforms.

```typescript
import { createWebPlatformAdapter } from '@d-sports/wallet';

const adapter = createWebPlatformAdapter();
const wallet = createDSportsWallet({
  appName: 'My App',
  adapter
});
```

### Token Utilities

Utilities for working with tokens.

```typescript
import { formatTokenBalance, getTokenValue } from '@d-sports/wallet/utils';

const formattedBalance = formatTokenBalance(balance, decimals);
const usdValue = getTokenValue(balance, decimals, price);
```

## Platform-Specific Implementations

### Next.js

```tsx
import { NextWalletProvider } from '@d-sports/wallet/nextjs';

function MyApp({ Component, pageProps }) {
  return (
    <NextWalletProvider>
      <Component {...pageProps} />
    </NextWalletProvider>
  );
}
```

### React Native

```tsx
import { RNWalletProvider } from '@d-sports/wallet/react-native';

function App() {
  return (
    <RNWalletProvider>
      <RootNavigator />
    </RNWalletProvider>
  );
}
```

## Documentation Standards

The @d-sports/wallet project follows strict documentation standards to ensure code maintainability and developer onboarding. All code files include:

- File header comments explaining purpose and role
- JSDoc-style documentation for functions, classes, and interfaces
- Parameter and return value descriptions
- Usage examples for public APIs
- Inline comments for complex logic

For more information on documentation standards, see the [Documentation Standards](../.kiro/specs/comprehensive-documentation/documentation-standards.md) document.

## Documentation Coverage

Documentation coverage is tracked and enforced through ESLint rules and custom scripts. The project aims for at least 80% documentation coverage across all files.

To check documentation coverage:

```bash
npm run docs:check-coverage
```

To validate documentation:

```bash
npm run docs:validate
```

For more information on documentation coverage, see the [Documentation Coverage Report](../documentation-coverage-report.md) document.