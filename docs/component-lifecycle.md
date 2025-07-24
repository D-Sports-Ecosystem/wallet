# Component Lifecycle Documentation

This document provides a comprehensive overview of the component lifecycle in the @d-sports/wallet project.

## Overview

The @d-sports/wallet project uses React components with hooks for state management and lifecycle events. This document explains the lifecycle of key components and how they interact with the wallet state.

## Component Initialization

### WalletProvider

The `WalletProvider` component is the root component that initializes the wallet and provides context to child components.

```typescript
/**
 * WalletProvider component lifecycle:
 * 
 * 1. Initialize wallet store with configuration
 * 2. Set up platform adapter
 * 3. Initialize connectors
 * 4. Set up event listeners
 * 5. Attempt to restore previous session
 * 6. Render children with context
 */
function WalletProvider({ children, ...config }: WalletProviderProps) {
  // Initialize wallet store
  const [store] = useState(() => createWalletStore(config));
  
  // Set up platform adapter
  useEffect(() => {
    store.setPlatformAdapter(config.adapter || createWebPlatformAdapter());
    
    return () => {
      // Clean up adapter resources
      store.cleanup();
    };
  }, [store]);
  
  // Initialize connectors
  useEffect(() => {
    store.initializeConnectors();
  }, [store]);
  
  // Set up event listeners
  useEffect(() => {
    const unsubscribe = store.subscribe((state) => {
      // Handle state changes
    });
    
    return () => {
      unsubscribe();
    };
  }, [store]);
  
  // Attempt to restore previous session
  useEffect(() => {
    store.restoreSession();
  }, [store]);
  
  // Render children with context
  return (
    <WalletContext.Provider value={store}>
      {children}
    </WalletContext.Provider>
  );
}
```

### WalletButton

The `WalletButton` component is used to trigger wallet connection and display connection status.

```typescript
/**
 * WalletButton component lifecycle:
 * 
 * 1. Get wallet state from context
 * 2. Handle button click to open modal or disconnect
 * 3. Update button state based on wallet connection status
 * 4. Render appropriate button state
 */
function WalletButton({ children, ...props }: WalletButtonProps) {
  // Get wallet state from context
  const { isConnected, isConnecting, openModal, disconnect } = useWallet();
  
  // Handle button click
  const handleClick = () => {
    if (isConnected) {
      disconnect();
    } else {
      openModal();
    }
  };
  
  // Render button with appropriate state
  return (
    <Button
      onClick={handleClick}
      disabled={isConnecting}
      {...props}
    >
      {isConnected ? 'Disconnect' : (children || 'Connect Wallet')}
    </Button>
  );
}
```

### WalletModal

The `WalletModal` component displays available wallet options and handles the connection process.

```typescript
/**
 * WalletModal component lifecycle:
 * 
 * 1. Get wallet state from context
 * 2. Initialize modal state
 * 3. Handle connection attempts
 * 4. Handle connection errors
 * 5. Update UI based on connection status
 * 6. Clean up on unmount
 */
function WalletModal({ isOpen, onClose, ...props }: WalletModalProps) {
  // Get wallet state from context
  const { connectors, connect, isConnecting, error } = useWallet();
  
  // Initialize modal state
  const [selectedConnector, setSelectedConnector] = useState<string | null>(null);
  
  // Handle connection attempts
  const handleConnect = async (connectorId: string) => {
    setSelectedConnector(connectorId);
    try {
      await connect(connectorId);
      onClose();
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      setSelectedConnector(null);
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      setSelectedConnector(null);
    };
  }, []);
  
  // Render modal with connectors
  return (
    <Modal isOpen={isOpen} onClose={onClose} {...props}>
      <ModalHeader>Connect Wallet</ModalHeader>
      <ModalBody>
        {connectors.map((connector) => (
          <ConnectorButton
            key={connector.id}
            connector={connector}
            onClick={() => handleConnect(connector.id)}
            isLoading={isConnecting && selectedConnector === connector.id}
          />
        ))}
        {error && <ErrorMessage error={error} />}
      </ModalBody>
    </Modal>
  );
}
```

## Component State Management

### useWallet Hook

The `useWallet` hook provides access to the wallet state and methods.

```typescript
/**
 * useWallet hook lifecycle:
 * 
 * 1. Get wallet store from context
 * 2. Subscribe to store updates
 * 3. Return wallet state and methods
 * 4. Clean up subscription on unmount
 */
function useWallet() {
  const store = useContext(WalletContext);
  
  if (!store) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  
  const [state, setState] = useState(store.getState());
  
  useEffect(() => {
    const unsubscribe = store.subscribe((newState) => {
      setState(newState);
    });
    
    return () => {
      unsubscribe();
    };
  }, [store]);
  
  return {
    ...state,
    connect: store.connect,
    disconnect: store.disconnect,
    openModal: store.openModal,
    closeModal: store.closeModal,
    signMessage: store.signMessage,
    sendTransaction: store.sendTransaction,
  };
}
```

### useWalletModal Hook

The `useWalletModal` hook provides modal state management.

```typescript
/**
 * useWalletModal hook lifecycle:
 * 
 * 1. Initialize modal state
 * 2. Provide methods to open and close the modal
 * 3. Return modal state and methods
 */
function useWalletModal() {
  const [isOpen, setIsOpen] = useState(false);
  
  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, []);
  
  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);
  
  return {
    isOpen,
    onOpen,
    onClose,
  };
}
```

## Component Rendering Patterns

### Conditional Rendering

Components use conditional rendering to display different states:

```tsx
function WalletStatus() {
  const { isConnected, account, chainId } = useWallet();
  
  if (!isConnected) {
    return <p>Not connected</p>;
  }
  
  return (
    <div>
      <p>Connected: {account}</p>
      <p>Chain ID: {chainId}</p>
    </div>
  );
}
```

### Render Props

Some components use render props for flexible rendering:

```tsx
function WalletInfo({ children }) {
  const walletState = useWallet();
  
  return children(walletState);
}

// Usage
<WalletInfo>
  {({ isConnected, account }) => (
    isConnected ? <p>Connected: {account}</p> : <p>Not connected</p>
  )}
</WalletInfo>
```

### Component Composition

Components are composed to create complex UIs:

```tsx
function WalletDashboard() {
  const { isOpen, onOpen, onClose } = useWalletModal();
  
  return (
    <div>
      <WalletButton onClick={onOpen}>Connect</WalletButton>
      <WalletModal isOpen={isOpen} onClose={onClose} />
      <WalletStatus />
      <TokenList />
    </div>
  );
}
```

## Component Lifecycle Events

### Mount Events

```typescript
useEffect(() => {
  // Initialize component
  console.log('Component mounted');
  
  return () => {
    // Clean up resources
    console.log('Component unmounted');
  };
}, []);
```

### Update Events

```typescript
useEffect(() => {
  // Handle prop or state changes
  console.log('Props or state changed:', props);
}, [props]);
```

### Connection Events

```typescript
useEffect(() => {
  // Handle connection state changes
  if (isConnected) {
    console.log('Wallet connected:', account);
  } else {
    console.log('Wallet disconnected');
  }
}, [isConnected, account]);
```

## Error Handling

Components handle errors using error boundaries and try-catch blocks:

```tsx
function WalletErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const handleError = (error: Error) => {
      console.error('Wallet error:', error);
      setHasError(true);
      setError(error);
    };
    
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);
  
  if (hasError) {
    return (
      <div>
        <h2>Something went wrong</h2>
        <p>{error?.message}</p>
        <button onClick={() => setHasError(false)}>Try again</button>
      </div>
    );
  }
  
  return children;
}
```

## Performance Optimization

Components use memoization and callback optimization:

```tsx
// Memoized component
const MemoizedWalletButton = React.memo(WalletButton);

// Optimized callbacks
const handleConnect = useCallback(() => {
  connect(selectedConnector);
}, [connect, selectedConnector]);

// Memoized values
const walletStatus = useMemo(() => {
  return isConnected ? 'Connected' : 'Disconnected';
}, [isConnected]);
```

## Conclusion

The component lifecycle in the @d-sports/wallet project follows React best practices for initialization, state management, rendering, and cleanup. Components are designed to be reusable, performant, and maintainable across different platforms.