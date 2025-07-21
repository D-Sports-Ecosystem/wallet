# Automated Token Data Updates

This document describes the automated token data update feature in the D-Sports Wallet SDK.

## Overview

The automated token data update feature provides a mechanism for keeping token price and market data up-to-date with minimal API calls. It includes:

- Periodic token data refresh mechanism
- Caching to reduce API calls and improve performance
- Background service for token data synchronization
- Configurable update intervals

## Components

### 1. Token Update Service (`TokenUpdateService`)

The core service responsible for fetching and updating token data at regular intervals.

**Key Features:**
- Configurable refresh intervals
- Cache management
- Singleton pattern for global access
- Event-based updates

### 2. Token Sync Service (`TokenSyncService`)

Extends the token update service with storage persistence capabilities.

**Key Features:**
- Local storage persistence
- Cache age management
- Platform-specific storage adapters

### 3. Token Background Service (`TokenBackgroundService`)

Manages background synchronization of token data, even when the app is not in focus.

**Key Features:**
- Web Worker support for background processing
- Visibility change detection
- Adaptive refresh rates based on app state
- Failure handling and recovery

### 4. UI Components

- `TokenUpdateStatus`: Displays the status of token updates and allows manual refresh
- `TokenUpdateConfig`: Provides a UI for configuring token update settings

## Usage

### Basic Setup

```typescript
import { TokenProvider } from '@d-sports/wallet';

function App() {
  return (
    <TokenProvider
      refreshInterval={300000} // 5 minutes
      cacheTTL={300000} // 5 minutes
      initialSymbols={['BTC', 'ETH', 'MATIC', 'USDC', 'BNB']}
      currency="USD"
      autoStart={true}
    >
      <YourApp />
    </TokenProvider>
  );
}
```

### Manual Token Refresh

```typescript
import { useTokens } from '@d-sports/wallet';

function TokenList() {
  const { tokens, refreshTokenData, isLoading, lastUpdated } = useTokens();
  
  return (
    <div>
      <button onClick={refreshTokenData} disabled={isLoading}>
        {isLoading ? 'Refreshing...' : 'Refresh Tokens'}
      </button>
      <div>Last updated: {lastUpdated?.toLocaleString()}</div>
      
      {tokens.map(token => (
        <div key={token.symbol}>
          {token.name}: ${token.price}
        </div>
      ))}
    </div>
  );
}
```

### Advanced Configuration

```typescript
import { 
  tokenUpdateService, 
  tokenSyncService, 
  tokenBackgroundService 
} from '@d-sports/wallet';

// Configure token update service
tokenUpdateService.updateConfig({
  refreshInterval: 600000, // 10 minutes
  cacheTTL: 300000, // 5 minutes
  symbols: ['BTC', 'ETH', 'MATIC', 'USDC', 'BNB', 'SOL', 'DOT'],
  currency: 'EUR',
});

// Configure token sync service
tokenSyncService.updateConfig({
  persistToStorage: true,
  maxCacheAge: 3600000, // 1 hour
});

// Configure background service
tokenBackgroundService.updateConfig({
  enabled: true,
  useWebWorkers: true,
  backgroundSync: true,
  backgroundRefreshInterval: 1800000, // 30 minutes
});
```

### Using the UI Components

```typescript
import { TokenUpdateStatus, TokenUpdateConfig } from '@d-sports/wallet';

function WalletSettings() {
  return (
    <div>
      <h2>Wallet Settings</h2>
      
      <h3>Token Update Status</h3>
      <TokenUpdateStatus 
        showLastUpdated={true}
        showRefreshButton={true}
      />
      
      <h3>Token Update Configuration</h3>
      <TokenUpdateConfig 
        onSave={() => console.log('Settings saved')}
      />
    </div>
  );
}
```

## API Reference

### TokenUpdateService

```typescript
interface TokenUpdateConfig {
  refreshInterval?: number;
  cacheTTL?: number;
  symbols?: string[];
  currency?: string;
  onUpdate?: (tokens: TokenInfo[]) => void;
  onError?: (error: Error) => void;
  autoStart?: boolean;
}

// Methods
tokenUpdateService.updateConfig(config: Partial<TokenUpdateConfig>): void;
tokenUpdateService.start(): void;
tokenUpdateService.stop(): void;
tokenUpdateService.isRunning(): boolean;
tokenUpdateService.getLastUpdated(): Date | null;
tokenUpdateService.getTokens(): TokenInfo[];
tokenUpdateService.forceUpdate(): Promise<TokenInfo[]>;
tokenUpdateService.clearCache(): void;
```

### TokenSyncService

```typescript
interface TokenSyncConfig extends TokenUpdateConfig {
  storageKey?: string;
  persistToStorage?: boolean;
  maxCacheAge?: number;
}

// Methods
tokenSyncService.updateConfig(config: Partial<TokenSyncConfig>): void;
tokenSyncService.start(): void;
tokenSyncService.stop(): void;
tokenSyncService.forceUpdate(): Promise<TokenInfo[]>;
tokenSyncService.clearCache(): void;
```

### TokenBackgroundService

```typescript
interface TokenBackgroundServiceConfig {
  enabled?: boolean;
  useWebWorkers?: boolean;
  backgroundSync?: boolean;
  backgroundRefreshInterval?: number;
  maxFailures?: number;
  updateConfig?: TokenUpdateConfig;
}

// Methods
tokenBackgroundService.updateConfig(config: Partial<TokenBackgroundServiceConfig>): void;
tokenBackgroundService.start(): void;
tokenBackgroundService.stop(): void;
tokenBackgroundService.isRunning(): boolean;
tokenBackgroundService.forceSync(): Promise<void>;
```

## Best Practices

1. **Optimize Refresh Intervals**: Balance between data freshness and API usage
2. **Use Caching**: Leverage the built-in caching to reduce API calls
3. **Handle Errors**: Implement proper error handling for network failures
4. **Test Background Sync**: Ensure background sync works correctly across platforms
5. **Monitor API Usage**: Keep track of API usage to avoid rate limits

## Troubleshooting

### Common Issues

1. **High API Usage**: Increase refresh intervals and cache TTL
2. **Memory Leaks**: Ensure services are properly stopped when not needed
3. **Background Sync Issues**: Check if web workers are supported in the environment
4. **Stale Data**: Verify cache settings and force refresh when needed

### Debugging

Enable debug logging by setting the environment variable:

```
DEBUG=dsports:token-updates
```

This will output detailed logs about token update operations.