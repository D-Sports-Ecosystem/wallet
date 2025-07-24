# Component Factory Documentation Summary

This document provides a summary of the component factory pattern used in the @d-sports/wallet project.

## Overview

The component factory pattern is used to create platform-specific components while maintaining a consistent API across different platforms. This allows the @d-sports/wallet package to support multiple platforms (Web, Next.js, React Native) with a unified API.

## Factory Functions

### createWalletButton

```typescript
/**
 * Creates a WalletButton component for the current platform
 * 
 * @function createWalletButton
 * @param {PlatformAdapter} adapter - Platform adapter for the current environment
 * @returns {React.FC<WalletButtonProps>} WalletButton component for the current platform
 * 
 * @example
 * ```tsx
 * const WalletButton = createWalletButton(webAdapter);
 * 
 * function ConnectButton() {
 *   return <WalletButton>Connect Wallet</WalletButton>;
 * }
 * ```
 */
```

### createWalletModal

```typescript
/**
 * Creates a WalletModal component for the current platform
 * 
 * @function createWalletModal
 * @param {PlatformAdapter} adapter - Platform adapter for the current environment
 * @returns {React.FC<WalletModalProps>} WalletModal component for the current platform
 * 
 * @example
 * ```tsx
 * const WalletModal = createWalletModal(webAdapter);
 * 
 * function App() {
 *   const [isOpen, setIsOpen] = useState(false);
 *   return (
 *     <>
 *       <button onClick={() => setIsOpen(true)}>Open Wallet</button>
 *       <WalletModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
 *     </>
 *   );
 * }
 * ```
 */
```

### createWalletProvider

```typescript
/**
 * Creates a WalletProvider component for the current platform
 * 
 * @function createWalletProvider
 * @param {PlatformAdapter} adapter - Platform adapter for the current environment
 * @returns {React.FC<WalletProviderProps>} WalletProvider component for the current platform
 * 
 * @example
 * ```tsx
 * const WalletProvider = createWalletProvider(webAdapter);
 * 
 * function App() {
 *   return (
 *     <WalletProvider
 *       appName="My App"
 *       chains={[1, 137]}
 *       socialProviders={['google', 'twitter']}
 *     >
 *       <MyApp />
 *     </WalletProvider>
 *   );
 * }
 * ```
 */
```

## Platform-Specific Implementations

### Web Implementation

```typescript
/**
 * Web-specific implementation of the WalletButton component
 * 
 * @component
 * @param {WalletButtonProps} props - Component props
 * @returns {JSX.Element} Web-specific WalletButton component
 */
```

### Next.js Implementation

```typescript
/**
 * Next.js-specific implementation of the WalletButton component
 * 
 * @component
 * @param {WalletButtonProps} props - Component props
 * @returns {JSX.Element} Next.js-specific WalletButton component
 */
```

### React Native Implementation

```typescript
/**
 * React Native-specific implementation of the WalletButton component
 * 
 * @component
 * @param {WalletButtonProps} props - Component props
 * @returns {JSX.Element} React Native-specific WalletButton component
 */
```

## Usage Examples

### Web Usage

```tsx
import { createDSportsWallet, createWebPlatformAdapter } from '@d-sports/wallet';

const adapter = createWebPlatformAdapter();
const wallet = createDSportsWallet({
  appName: 'My App',
  adapter
});

const WalletButton = wallet.components.WalletButton;

function ConnectButton() {
  return <WalletButton>Connect Wallet</WalletButton>;
}
```

### Next.js Usage

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

### React Native Usage

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

## Benefits of the Component Factory Pattern

1. **Platform Abstraction**: Hides platform-specific implementation details behind a unified API
2. **Code Reuse**: Shares common logic across platforms while allowing platform-specific optimizations
3. **Maintainability**: Makes it easier to maintain and update components across platforms
4. **Extensibility**: Allows for easy addition of new platforms or components
5. **Testing**: Facilitates testing by allowing platform-specific mocks and stubs

## Implementation Details

The component factory pattern is implemented using the following approach:

1. Define common interfaces for components and their props
2. Create platform-specific implementations of each component
3. Create factory functions that return the appropriate implementation based on the platform adapter
4. Export the factory functions as part of the public API
5. Use the factory functions to create components in the application

This approach allows for a consistent API across platforms while still taking advantage of platform-specific features and optimizations.