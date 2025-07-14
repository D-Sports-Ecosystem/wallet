import React from 'react';
import { 
  WalletUIProvider, 
  ContextDrivenDashboard,
  useAuth,
  useNavigation,
  useServerActions,
  usePlatform,
  useWalletActions,
  createAuthHook,
  createNavigationHook,
  createServerActionsHook,
  createPlatformHook,
  createWalletActionsHook,
} from '../index';
import { DSportsWallet } from '../../core/wallet';

/**
 * Example showing how to inject custom implementations for PWA-specific logic
 * Host applications can replace the default hooks with their own implementations
 */

// Example: Custom NextAuth integration
const useNextAuth = createAuthHook({
  signIn: async (credentials) => {
    // Integration with NextAuth.js
    console.log('NextAuth: Signing in with credentials:', credentials);
    
    // Example: Use NextAuth signIn function
    // const result = await signIn('credentials', { 
    //   email: credentials.email, 
    //   password: credentials.password,
    //   redirect: false 
    // });
    
    // Return session in our expected format
    return {
      user: {
        id: 'nextauth-user-123',
        email: credentials.email,
        name: 'NextAuth User',
      },
      isAuthenticated: true,
      token: 'nextauth-session-token',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
  },
  
  signOut: async () => {
    console.log('NextAuth: Signing out');
    // Example: Use NextAuth signOut function
    // await signOut({ redirect: false });
  },
});

// Example: Custom Next.js router integration
const useNextRouter = createNavigationHook({
  push: (path: string) => {
    console.log('Next.js Router: Navigating to:', path);
    // Example: Use Next.js router
    // router.push(path);
  },
  
  replace: (path: string) => {
    console.log('Next.js Router: Replacing route with:', path);
    // Example: Use Next.js router
    // router.replace(path);
  },
  
  back: () => {
    console.log('Next.js Router: Going back');
    // Example: Use Next.js router
    // router.back();
  },
});

// Example: Custom API routes integration
const useNextApiRoutes = createServerActionsHook({
  createWallet: async (config) => {
    console.log('Next.js API: Creating wallet via /api/wallet/create');
    
    // Example: Call Next.js API route
    const response = await fetch('/api/wallet/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create wallet: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  fetchTokens: async (walletAddress) => {
    console.log('Next.js API: Fetching tokens via /api/wallet/tokens');
    
    // Example: Call Next.js API route
    const response = await fetch(`/api/wallet/tokens?address=${walletAddress}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tokens: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  fetchInventory: async (userId) => {
    console.log('Next.js API: Fetching inventory via /api/game/inventory');
    
    // Example: Call Next.js API route
    const response = await fetch(`/api/game/inventory?userId=${userId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch inventory: ${response.statusText}`);
    }
    
    return response.json();
  },
});

// Example: Custom PWA platform integration
const usePWAPlatform = createPlatformHook({
  copyToClipboard: async (text: string) => {
    console.log('PWA Platform: Copying to clipboard');
    
    // Example: Enhanced PWA clipboard with fallback
    if ('clipboard' in navigator) {
      await navigator.clipboard.writeText(text);
      
      // Show PWA-specific toast notification
      if ('serviceWorker' in navigator && 'showNotification' in ServiceWorkerRegistration.prototype) {
        const registration = await navigator.serviceWorker.ready;
        registration.showNotification('Copied to clipboard', {
          body: text,
          icon: '/icon-192x192.png',
          badge: '/badge-72x72.png',
        });
      }
      
      return true;
    }
    
    return false;
  },
  
  showNotification: async (title: string, options?: NotificationOptions) => {
    console.log('PWA Platform: Showing notification');
    
    // Example: PWA notification with service worker
    if ('serviceWorker' in navigator && 'showNotification' in ServiceWorkerRegistration.prototype) {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        registration.showNotification(title, {
          ...options,
          icon: options?.icon || '/icon-192x192.png',
          badge: '/badge-72x72.png',
        });
        return true;
      }
    }
    
    return false;
  },
});

// Example: Custom wallet actions with specific provider
const useCustomWalletProvider = createWalletActionsHook({
  createUserWallet: async (args) => {
    console.log('Custom Wallet Provider: Creating wallet');
    
    // Example: Integration with specific wallet provider (e.g., Web3Auth, Magic, etc.)
    if (args.method === 'social') {
      // Example: Web3Auth social login
      console.log('Integrating with Web3Auth for social login');
      
      // Mock implementation
      return {
        id: 'web3auth-wallet-' + Date.now(),
        address: '0x' + Math.random().toString(16).substr(2, 40),
        provider: 'web3auth',
        socialProvider: args.provider,
        chainId: 1,
        isConnected: true,
      };
    }
    
    if (args.method === 'email') {
      // Example: Magic.link email login
      console.log('Integrating with Magic.link for email login');
      
      // Mock implementation
      return {
        id: 'magic-wallet-' + Date.now(),
        address: '0x' + Math.random().toString(16).substr(2, 40),
        provider: 'magic',
        email: args.email,
        chainId: 1,
        isConnected: true,
      };
    }
    
    throw new Error('Unsupported wallet creation method');
  },
});

// Example: Host application component
const CustomWalletApp: React.FC = () => {
  const wallet = new DSportsWallet({
    projectId: 'custom-project-id',
    chains: [],
    appName: 'Custom Wallet App',
    appDescription: 'App with custom hook implementations',
    appUrl: 'https://custom-app.com',
    appIcon: 'https://custom-app.com/icon.png'
  }, {} as any);

  const session = {
    user: {
      id: 'custom-user-123',
      email: 'user@custom-app.com',
      name: 'Custom User',
    },
    isAuthenticated: true,
  };

  const theme = {
    colors: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
      background: '#FFFFFF',
      text: '#1F2937',
      border: '#E5E7EB'
    },
    borderRadius: 12,
    fontFamily: 'Inter, sans-serif'
  };

  return (
    <WalletUIProvider
      wallet={wallet}
      session={session}
      theme={theme}
      
      // Inject custom hook implementations
      useCustomAuth={useNextAuth}
      useCustomNavigation={useNextRouter}
      useCustomServerActions={useNextApiRoutes}
      useCustomPlatform={usePWAPlatform}
      useCustomWalletActions={useCustomWalletProvider}
      
      // Configure hook behavior
      authConfig={{
        autoRefresh: true,
        onSessionChange: (session) => {
          console.log('Session changed:', session);
        },
      }}
      
      navigationConfig={{
        basePath: '/wallet',
        onNavigate: (path) => {
          console.log('Navigation event:', path);
        },
      }}
      
      serverActionsConfig={{
        baseURL: 'https://api.custom-app.com',
        enableCaching: true,
        cacheTimeout: 10 * 60 * 1000, // 10 minutes
        defaultHeaders: {
          'X-API-Key': 'custom-api-key',
        },
        onError: (error) => {
          console.error('API Error:', error);
        },
      }}
      
      platformConfig={{
        fallbackToMock: false,
        onFeatureUnavailable: (feature) => {
          console.warn(`Platform feature unavailable: ${feature}`);
        },
      }}
      
      walletActionsConfig={{
        defaultChainId: 1,
        supportedChains: [1, 5, 137, 80001],
        enableLocalStorage: true,
        storageKey: 'custom-wallet-storage',
        onConnect: (account) => {
          console.log('Wallet connected:', account);
        },
        onDisconnect: () => {
          console.log('Wallet disconnected');
        },
        onError: (error) => {
          console.error('Wallet error:', error);
        },
      }}
    >
      <div style={{ padding: '20px' }}>
        <h1>Custom Wallet App with Injectable Hooks</h1>
        <p>
          This example demonstrates how to inject custom implementations for 
          PWA-specific logic using the injectable hooks pattern.
        </p>
        
        <ContextDrivenDashboard />
      </div>
    </WalletUIProvider>
  );
};

// Example: Component that uses hooks directly
const HookUsageExample: React.FC = () => {
  // Use hooks directly for advanced customization
  const auth = useAuth({
    autoRefresh: true,
    onSessionChange: (session) => console.log('Auth session changed:', session),
  });
  
  const navigation = useNavigation({
    onNavigate: (path) => console.log('Navigation to:', path),
  });
  
  const serverActions = useServerActions({
    baseURL: '/api',
    enableCaching: true,
  });
  
  const platform = usePlatform({
    fallbackToMock: true,
  });
  
  const walletActions = useWalletActions({
    defaultChainId: 1,
    enableLocalStorage: true,
  });

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Direct Hook Usage</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div>
          <h4>Auth Hook</h4>
          <p>Session: {auth.session ? auth.session.user?.name : 'None'}</p>
          <p>Loading: {auth.isLoading ? 'Yes' : 'No'}</p>
          <button onClick={() => auth.actions.signIn({ email: 'test@example.com' })}>
            Sign In
          </button>
        </div>
        
        <div>
          <h4>Navigation Hook</h4>
          <p>Current: {navigation.state.pathname}</p>
          <p>Ready: {navigation.isReady ? 'Yes' : 'No'}</p>
          <button onClick={() => navigation.actions.push('/tokens')}>
            Go to Tokens
          </button>
        </div>
        
        <div>
          <h4>Server Actions</h4>
          <p>Loading: {serverActions.isLoading ? 'Yes' : 'No'}</p>
          <button onClick={() => serverActions.actions.fetchTokens('0x123...456')}>
            Fetch Tokens
          </button>
        </div>
        
        <div>
          <h4>Platform Features</h4>
          <p>Clipboard: {platform.features.clipboard ? 'Available' : 'Not available'}</p>
          <p>Notifications: {platform.features.notifications ? 'Available' : 'Not available'}</p>
          <button onClick={() => platform.actions.copyToClipboard('Hello World!')}>
            Copy Text
          </button>
        </div>
        
        <div>
          <h4>Wallet Actions</h4>
          <p>Connected: {walletActions.connectedAccount ? 'Yes' : 'No'}</p>
          <p>Loading: {walletActions.isLoading ? 'Yes' : 'No'}</p>
          <button onClick={() => walletActions.actions.createUserWallet({ method: 'social', provider: 'google' })}>
            Create Wallet
          </button>
        </div>
      </div>
    </div>
  );
};

// Complete example combining both approaches
const CompleteExample: React.FC = () => (
  <div>
    <CustomWalletApp />
    <div style={{ marginTop: '40px' }}>
      <HookUsageExample />
    </div>
  </div>
);

export default CompleteExample;
export { CustomWalletApp, HookUsageExample };
