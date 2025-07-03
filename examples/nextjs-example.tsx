// Example Next.js App with D-Sports Wallet Integration
import React from 'react';
import { createDSportsWallet, useDSportsWallet, useSocialLogin, mainnet, polygon } from '@d-sports/wallet/nextjs';

// Create wallet instance
const wallet = createDSportsWallet({
  projectId: 'your-walletconnect-project-id',
  chains: [mainnet, polygon],
  metadata: {
    name: 'D-Sports Example App',
    description: 'Example app showcasing D-Sports wallet integration',
    url: 'https://example.d-sports.com',
    icons: ['https://example.d-sports.com/icon.png']
  },
  socialLogin: {
    providers: ['google', 'facebook', 'apple'],
    clientIds: {
      google: 'your-google-client-id',
      facebook: 'your-facebook-app-id',
      apple: 'your-apple-client-id'
    }
  },
  theme: {
    colors: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
      background: '#FFFFFF',
      text: '#1F2937',
      border: '#E5E7EB'
    },
    borderRadius: 12,
    fontFamily: 'Inter, sans-serif'
  }
});

// Wallet Connection Component
function WalletConnection() {
  const { 
    account, 
    isConnecting, 
    isConnected, 
    isReconnecting,
    error,
    connect, 
    disconnect,
    switchChain 
  } = useDSportsWallet(wallet);

  if (isReconnecting) {
    return <div className="loading">Reconnecting wallet...</div>;
  }

  if (isConnected && account) {
    return (
      <div className="wallet-info">
        <h3>Wallet Connected</h3>
        <p><strong>Address:</strong> {account.address}</p>
        <p><strong>Chain:</strong> {account.chainId}</p>
        {account.ensName && <p><strong>ENS:</strong> {account.ensName}</p>}
        
        <div className="actions">
          <button onClick={() => switchChain(1)}>
            Switch to Mainnet
          </button>
          <button onClick={() => switchChain(137)}>
            Switch to Polygon
          </button>
          <button onClick={disconnect} className="disconnect-btn">
            Disconnect
          </button>
        </div>
        
        {error && (
          <div className="error">
            Error: {error.message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="wallet-connect">
      <h3>Connect Your Wallet</h3>
      <button 
        onClick={() => connect('dsports-wallet')} 
        disabled={isConnecting}
        className="connect-btn"
      >
        {isConnecting ? 'Connecting...' : 'Connect D-Sports Wallet'}
      </button>
      
      <button 
        onClick={() => connect('dsports-wallet', { socialLogin: true })} 
        disabled={isConnecting}
        className="social-connect-btn"
      >
        {isConnecting ? 'Connecting...' : 'Connect with Social Login'}
      </button>
      
      {error && (
        <div className="error">
          Error: {error.message}
        </div>
      )}
    </div>
  );
}

// Social Login Component
function SocialLogin() {
  const socialProvider = wallet.getConnector('dsports-wallet')?.socialLoginProvider;
  const { user, isLoading, error, login, logout } = useSocialLogin(socialProvider);

  if (user) {
    return (
      <div className="social-user">
        <h3>Social Login</h3>
        <div className="user-info">
          {user.user.avatar && (
            <img src={user.user.avatar} alt="Avatar" className="avatar" />
          )}
          <div>
            <p><strong>Name:</strong> {user.user.name}</p>
            <p><strong>Email:</strong> {user.user.email}</p>
            <p><strong>Provider:</strong> {user.provider}</p>
          </div>
        </div>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="social-login">
      <h3>Social Login</h3>
      <div className="social-buttons">
        <button 
          onClick={() => login('google')} 
          disabled={isLoading}
          className="social-btn google"
        >
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </button>
        
        <button 
          onClick={() => login('facebook')} 
          disabled={isLoading}
          className="social-btn facebook"
        >
          {isLoading ? 'Signing in...' : 'Sign in with Facebook'}
        </button>
        
        <button 
          onClick={() => login('apple')} 
          disabled={isLoading}
          className="social-btn apple"
        >
          {isLoading ? 'Signing in...' : 'Sign in with Apple'}
        </button>
      </div>
      
      {error && (
        <div className="error">
          Error: {error.message}
        </div>
      )}
    </div>
  );
}

// Transaction Example Component
function TransactionExample() {
  const { account, isConnected } = useDSportsWallet(wallet);
  const [isSigning, setIsSigning] = React.useState(false);
  const [signatureResult, setSignatureResult] = React.useState('');

  const signMessage = async () => {
    if (!isConnected) return;
    
    setIsSigning(true);
    try {
      const connector = wallet.getConnector('dsports-wallet');
      const signer = await connector?.getSigner();
      const signature = await signer?.signMessage('Hello from D-Sports Wallet!');
      setSignatureResult(signature);
    } catch (error) {
      console.error('Signing failed:', error);
      setSignatureResult('Signing failed: ' + error.message);
    } finally {
      setIsSigning(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="transaction-example">
        <h3>Transaction Example</h3>
        <p>Connect your wallet to try signing a message.</p>
      </div>
    );
  }

  return (
    <div className="transaction-example">
      <h3>Transaction Example</h3>
      <button 
        onClick={signMessage} 
        disabled={isSigning}
        className="sign-btn"
      >
        {isSigning ? 'Signing...' : 'Sign Message'}
      </button>
      
      {signatureResult && (
        <div className="signature-result">
          <h4>Signature Result:</h4>
          <pre>{signatureResult}</pre>
        </div>
      )}
    </div>
  );
}

// Main App Component
export default function App() {
  return (
    <div className="app">
      <header>
        <h1>D-Sports Wallet Example</h1>
        <p>Complete Next.js integration example</p>
      </header>
      
      <main>
        <div className="section">
          <WalletConnection />
        </div>
        
        <div className="section">
          <SocialLogin />
        </div>
        
        <div className="section">
          <TransactionExample />
        </div>
      </main>
      
      <style jsx>{`
        .app {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: Inter, sans-serif;
        }
        
        header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .section {
          background: #f9fafb;
          padding: 24px;
          border-radius: 12px;
          margin-bottom: 24px;
          border: 1px solid #e5e7eb;
        }
        
        .wallet-info, .social-user {
          text-align: center;
        }
        
        .actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-top: 16px;
        }
        
        .social-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 300px;
          margin: 0 auto;
        }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 16px;
          justify-content: center;
          margin: 16px 0;
        }
        
        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
        }
        
        button {
          padding: 12px 24px;
          border-radius: 8px;
          border: none;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .connect-btn {
          background: #6366f1;
          color: white;
        }
        
        .connect-btn:hover {
          background: #5855eb;
        }
        
        .social-connect-btn {
          background: #8b5cf6;
          color: white;
          margin-left: 12px;
        }
        
        .disconnect-btn {
          background: #ef4444;
          color: white;
        }
        
        .social-btn {
          color: white;
          font-weight: 500;
        }
        
        .google { background: #ea4335; }
        .facebook { background: #1877f2; }
        .apple { background: #000; }
        
        .sign-btn {
          background: #10b981;
          color: white;
        }
        
        .error {
          color: #ef4444;
          margin-top: 12px;
          padding: 12px;
          background: #fef2f2;
          border-radius: 8px;
          border: 1px solid #fecaca;
        }
        
        .signature-result {
          margin-top: 16px;
          padding: 16px;
          background: #f0f9ff;
          border-radius: 8px;
          border: 1px solid #bae6fd;
        }
        
        .signature-result pre {
          word-break: break-all;
          white-space: pre-wrap;
          font-size: 12px;
        }
        
        .loading {
          text-align: center;
          color: #6b7280;
        }
        
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
} 