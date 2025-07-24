# Wallet Usage Examples

This document provides practical examples of how to use the @d-sports/wallet package in different scenarios.

## Basic Usage

### Setting Up the Wallet Provider

```tsx
import { WalletProvider } from '@d-sports/wallet';

function App() {
  return (
    <WalletProvider
      appName="My App"
      chains={[1, 137]} // Ethereum, Polygon
      socialProviders={['google', 'twitter']}
    >
      <MyApp />
    </WalletProvider>
  );
}
```

### Connecting a Wallet

```tsx
import { useWallet } from '@d-sports/wallet';

function ConnectButton() {
  const { connect, isConnected, isConnecting, account } = useWallet();
  
  if (isConnected) {
    return <p>Connected: {account}</p>;
  }
  
  return (
    <button 
      onClick={() => connect('metamask')} 
      disabled={isConnecting}
    >
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}
```

### Displaying Wallet Information

```tsx
import { useWallet } from '@d-sports/wallet';

function WalletInfo() {
  const { isConnected, account, chainId, balance } = useWallet();
  
  if (!isConnected) {
    return <p>Not connected</p>;
  }
  
  return (
    <div>
      <h2>Wallet Information</h2>
      <p>Account: {account}</p>
      <p>Chain ID: {chainId}</p>
      <p>Balance: {balance} ETH</p>
    </div>
  );
}
```

## Advanced Usage

### Using the Wallet Modal

```tsx
import { WalletModal, useWalletModal } from '@d-sports/wallet';

function WalletConnect() {
  const { isOpen, onOpen, onClose } = useWalletModal();
  
  return (
    <>
      <button onClick={onOpen}>Connect Wallet</button>
      <WalletModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
```

### Signing Messages

```tsx
import { useWallet } from '@d-sports/wallet';
import { useState } from 'react';

function MessageSigner() {
  const { isConnected, signMessage } = useWallet();
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [error, setError] = useState('');
  
  const handleSign = async () => {
    try {
      setError('');
      const sig = await signMessage(message);
      setSignature(sig);
    } catch (err) {
      setError(err.message);
    }
  };
  
  if (!isConnected) {
    return <p>Connect your wallet to sign messages</p>;
  }
  
  return (
    <div>
      <h2>Sign Message</h2>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter message to sign"
      />
      <button onClick={handleSign}>Sign Message</button>
      {signature && (
        <div>
          <h3>Signature:</h3>
          <pre>{signature}</pre>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

### Sending Transactions

```tsx
import { useWallet } from '@d-sports/wallet';
import { useState } from 'react';

function TransactionSender() {
  const { isConnected, sendTransaction } = useWallet();
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  
  const handleSend = async () => {
    try {
      setError('');
      const hash = await sendTransaction({
        to,
        value: amount
      });
      setTxHash(hash);
    } catch (err) {
      setError(err.message);
    }
  };
  
  if (!isConnected) {
    return <p>Connect your wallet to send transactions</p>;
  }
  
  return (
    <div>
      <h2>Send Transaction</h2>
      <div>
        <label>
          To Address:
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="0x..."
          />
        </label>
      </div>
      <div>
        <label>
          Amount (ETH):
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.01"
            step="0.01"
          />
        </label>
      </div>
      <button onClick={handleSend}>Send Transaction</button>
      {txHash && (
        <div>
          <h3>Transaction Hash:</h3>
          <pre>{txHash}</pre>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

### Switching Networks

```tsx
import { useWallet } from '@d-sports/wallet';

function NetworkSwitcher() {
  const { isConnected, chainId, switchChain } = useWallet();
  
  const networks = [
    { id: '1', name: 'Ethereum' },
    { id: '137', name: 'Polygon' },
    { id: '56', name: 'Binance Smart Chain' }
  ];
  
  if (!isConnected) {
    return <p>Connect your wallet to switch networks</p>;
  }
  
  return (
    <div>
      <h2>Switch Network</h2>
      <p>Current Network: {networks.find(n => n.id === chainId)?.name || chainId}</p>
      <div>
        {networks.map(network => (
          <button
            key={network.id}
            onClick={() => switchChain(network.id)}
            disabled={network.id === chainId}
          >
            Switch to {network.name}
          </button>
        ))}
      </div>
    </div>
  );
}
```

## Platform-Specific Examples

### Next.js Integration

```tsx
// pages/_app.tsx
import { NextWalletProvider } from '@d-sports/wallet/nextjs';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextWalletProvider
      appName="My Next.js App"
      chains={[1, 137]}
      socialProviders={['google', 'twitter']}
    >
      <Component {...pageProps} />
    </NextWalletProvider>
  );
}

export default MyApp;
```

### React Native Integration

```tsx
// App.tsx
import { RNWalletProvider } from '@d-sports/wallet/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function App() {
  return (
    <RNWalletProvider
      appName="My React Native App"
      chains={[1, 137]}
      socialProviders={['google', 'twitter']}
    >
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Wallet" component={WalletScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </RNWalletProvider>
  );
}

export default App;
```

## Social Login Examples

### Google Login

```tsx
import { useWallet } from '@d-sports/wallet';

function GoogleLoginButton() {
  const { connect, isConnecting } = useWallet();
  
  const handleGoogleLogin = () => {
    connect('google');
  };
  
  return (
    <button
      onClick={handleGoogleLogin}
      disabled={isConnecting}
      className="google-login-button"
    >
      {isConnecting ? 'Connecting...' : 'Continue with Google'}
    </button>
  );
}
```

### Twitter Login

```tsx
import { useWallet } from '@d-sports/wallet';

function TwitterLoginButton() {
  const { connect, isConnecting } = useWallet();
  
  const handleTwitterLogin = () => {
    connect('twitter');
  };
  
  return (
    <button
      onClick={handleTwitterLogin}
      disabled={isConnecting}
      className="twitter-login-button"
    >
      {isConnecting ? 'Connecting...' : 'Continue with Twitter'}
    </button>
  );
}
```

## Token Management Examples

### Displaying Token Balances

```tsx
import { useTokens } from '@d-sports/wallet';

function TokenBalances() {
  const { tokens, isLoading, error, refresh } = useTokens();
  
  if (isLoading) {
    return <p>Loading tokens...</p>;
  }
  
  if (error) {
    return (
      <div>
        <p>Error loading tokens: {error.message}</p>
        <button onClick={refresh}>Retry</button>
      </div>
    );
  }
  
  return (
    <div>
      <h2>Token Balances</h2>
      <button onClick={refresh}>Refresh</button>
      <table>
        <thead>
          <tr>
            <th>Token</th>
            <th>Balance</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map(token => (
            <tr key={token.symbol}>
              <td>{token.name} ({token.symbol})</td>
              <td>{token.balance}</td>
              <td>{token.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Token Price Chart

```tsx
import { useToken } from '@d-sports/wallet';
import { LineChart } from 'react-chartjs-2';
import { useState, useEffect } from 'react';

function TokenPriceChart({ symbol }) {
  const { token, isLoading } = useToken(symbol);
  const [chartData, setChartData] = useState(null);
  
  useEffect(() => {
    if (token) {
      // Fetch historical price data
      fetchHistoricalPrices(symbol).then(data => {
        setChartData({
          labels: data.map(d => d.date),
          datasets: [
            {
              label: `${token.name} Price`,
              data: data.map(d => d.price),
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }
          ]
        });
      });
    }
  }, [token, symbol]);
  
  if (isLoading) {
    return <p>Loading token data...</p>;
  }
  
  if (!token) {
    return <p>Token not found</p>;
  }
  
  return (
    <div>
      <h2>{token.name} ({token.symbol}) Price Chart</h2>
      {chartData ? (
        <LineChart data={chartData} />
      ) : (
        <p>Loading chart data...</p>
      )}
      <div className="token-info">
        <p>Current Price: {token.price}</p>
        <p>24h Change: {token.percentChange24h}%</p>
        <p>Market Cap: {token.marketCap}</p>
      </div>
    </div>
  );
}

// Helper function to fetch historical prices
async function fetchHistoricalPrices(symbol) {
  // Implementation depends on your data source
  // This is just a placeholder
  return [
    { date: '2023-01-01', price: 100 },
    { date: '2023-01-02', price: 105 },
    { date: '2023-01-03', price: 102 },
    // ...more data
  ];
}
```

## Error Handling Examples

### Error Boundary

```tsx
import React from 'react';

class WalletErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Wallet error:', error, errorInfo);
    // You can also log the error to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Something went wrong with the wallet</h2>
          <p>{this.state.error.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <WalletErrorBoundary>
      <WalletProvider>
        <MyApp />
      </WalletProvider>
    </WalletErrorBoundary>
  );
}
```

### Connection Error Handling

```tsx
import { useWallet } from '@d-sports/wallet';
import { useState } from 'react';

function WalletConnect() {
  const { connect, isConnecting } = useWallet();
  const [error, setError] = useState(null);
  
  const handleConnect = async (connector) => {
    try {
      setError(null);
      await connect(connector);
    } catch (err) {
      setError(err);
      console.error('Connection error:', err);
    }
  };
  
  return (
    <div>
      <h2>Connect Wallet</h2>
      <div className="connector-buttons">
        <button
          onClick={() => handleConnect('metamask')}
          disabled={isConnecting}
        >
          MetaMask
        </button>
        <button
          onClick={() => handleConnect('walletconnect')}
          disabled={isConnecting}
        >
          WalletConnect
        </button>
        <button
          onClick={() => handleConnect('google')}
          disabled={isConnecting}
        >
          Google
        </button>
      </div>
      {error && (
        <div className="error-message">
          <p>Error: {error.message}</p>
          <p>Please try again or use a different connection method.</p>
        </div>
      )}
    </div>
  );
}
```

## Conclusion

These examples demonstrate how to use the @d-sports/wallet package in various scenarios. For more detailed information, refer to the API documentation and other guides in this documentation set.