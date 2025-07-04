import React, { useState, useEffect } from 'react';
import { useWalletUI, useWalletUIContext } from '../context/WalletUIProvider';
import { TokenBalance } from '../types';
import LoadingState from '../atoms/LoadingState';
import EmptyState from '../atoms/EmptyState';

interface ContextDrivenTokenTabProps {
  className?: string;
  onTokenClick?: (token: TokenBalance) => void;
  onSend?: (token: TokenBalance) => void;
  onReceive?: (token: TokenBalance) => void;
  onSwap?: (token: TokenBalance) => void;
}

const ContextDrivenTokenTab: React.FC<ContextDrivenTokenTabProps> = ({
  className = '',
  onTokenClick,
  onSend,
  onReceive,
  onSwap,
}) => {
  const context = useWalletUI();
  const { walletStore } = useWalletUIContext();
  
  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTokens = async () => {
    if (!walletStore.isConnected) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const fetchedTokens = await context.fetchTokens();
      setTokens(fetchedTokens);
    } catch (err) {
      console.error('Failed to load tokens:', err);
      setError('Failed to load tokens');
    } finally {
      setIsLoading(false);
    }
  };

  // Load tokens when component mounts or wallet connects
  useEffect(() => {
    if (walletStore.isConnected) {
      loadTokens();
    } else {
      setTokens([]);
    }
  }, [walletStore.isConnected]);

  const containerStyles: React.CSSProperties = {
    padding: '24px',
    backgroundColor: context.theme?.colors?.background || '#FFF',
    borderRadius: context.theme?.borderRadius || '8px',
    border: context.theme?.colors?.border ? `1px solid ${context.theme.colors.border}` : '1px solid #E5E5E7',
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '600',
    color: context.theme?.colors?.text || '#000',
    margin: '0',
  };

  const refreshButtonStyles: React.CSSProperties = {
    padding: '8px 16px',
    border: 'none',
    borderRadius: context.theme?.borderRadius || '6px',
    backgroundColor: context.theme?.colors?.primary || '#007AFF',
    color: '#FFF',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
  };

  const tokenListStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const tokenItemStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: context.theme?.colors?.background || '#F9FAFB',
    borderRadius: context.theme?.borderRadius || '8px',
    border: context.theme?.colors?.border ? `1px solid ${context.theme.colors.border}` : '1px solid #E5E5E7',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const tokenInfoStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const tokenIconStyles: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: context.theme?.colors?.primary || '#007AFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFF',
    fontSize: '16px',
    fontWeight: '600',
  };

  const tokenDetailsStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
  };

  const tokenNameStyles: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '600',
    color: context.theme?.colors?.text || '#000',
    margin: '0 0 4px 0',
  };

  const tokenSymbolStyles: React.CSSProperties = {
    fontSize: '14px',
    color: context.theme?.colors?.text ? `${context.theme.colors.text}70` : '#666',
    margin: '0',
  };

  const tokenBalanceStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  };

  const balanceAmountStyles: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '600',
    color: context.theme?.colors?.text || '#000',
    margin: '0 0 4px 0',
  };

  const balanceValueStyles: React.CSSProperties = {
    fontSize: '14px',
    color: context.theme?.colors?.text ? `${context.theme.colors.text}70` : '#666',
    margin: '0',
  };

  const actionsStyles: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    marginLeft: '16px',
  };

  const actionButtonStyles: React.CSSProperties = {
    padding: '6px 12px',
    border: 'none',
    borderRadius: context.theme?.borderRadius || '4px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: context.theme?.colors?.secondary || '#6C757D',
    color: '#FFF',
  };

  if (!walletStore.isConnected) {
    return (
      <div className={`token-tab ${className}`} style={containerStyles}>
        <EmptyState
          title="Connect Your Wallet"
          description="Connect your wallet to view your token balances."
          variant="wallet"
          theme={context.theme}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`token-tab ${className}`} style={containerStyles}>
        <div style={headerStyles}>
          <h2 style={titleStyles}>Tokens</h2>
        </div>
        <LoadingState
          variant="spinner"
          text="Loading tokens..."
          theme={context.theme}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`token-tab ${className}`} style={containerStyles}>
        <div style={headerStyles}>
          <h2 style={titleStyles}>Tokens</h2>
          <button
            style={refreshButtonStyles}
            onClick={loadTokens}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            Retry
          </button>
        </div>
        <EmptyState
          title="Failed to Load Tokens"
          description={error}
          variant="error"
          theme={context.theme}
          action={{
            label: 'Try Again',
            onClick: loadTokens,
          }}
        />
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className={`token-tab ${className}`} style={containerStyles}>
        <div style={headerStyles}>
          <h2 style={titleStyles}>Tokens</h2>
          <button
            style={refreshButtonStyles}
            onClick={loadTokens}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            Refresh
          </button>
        </div>
        <EmptyState
          title="No Tokens Found"
          description="You don't have any tokens in your wallet yet."
          variant="default"
          theme={context.theme}
        />
      </div>
    );
  }

  return (
    <div className={`token-tab ${className}`} style={containerStyles}>
      <div style={headerStyles}>
        <h2 style={titleStyles}>Tokens ({tokens.length})</h2>
        <button
          style={refreshButtonStyles}
          onClick={loadTokens}
          disabled={isLoading}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div style={tokenListStyles}>
        {tokens.map((token, index) => (
          <div
            key={`${token.symbol}-${index}`}
            style={tokenItemStyles}
            onClick={() => onTokenClick?.(token)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = context.theme?.colors?.border ? `${context.theme.colors.border}20` : '#F0F0F0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = context.theme?.colors?.background || '#F9FAFB';
            }}
          >
            <div style={tokenInfoStyles}>
              <div style={tokenIconStyles}>
                {token.logoUri ? (
                  <img 
                    src={token.logoUri} 
                    alt={token.name} 
                    style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                  />
                ) : (
                  token.symbol.charAt(0).toUpperCase()
                )}
              </div>
              <div style={tokenDetailsStyles}>
                <h3 style={tokenNameStyles}>{token.name}</h3>
                <p style={tokenSymbolStyles}>{token.symbol}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={tokenBalanceStyles}>
                <span style={balanceAmountStyles}>
                  {parseFloat(token.balance || '0').toFixed(4)} {token.symbol}
                </span>
                {token.value && (
                  <span style={balanceValueStyles}>
                    ${parseFloat(token.value).toFixed(2)}
                  </span>
                )}
              </div>

              <div style={actionsStyles}>
                {onSend && (
                  <button
                    style={actionButtonStyles}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSend(token);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                  >
                    Send
                  </button>
                )}
                {onReceive && (
                  <button
                    style={actionButtonStyles}
                    onClick={(e) => {
                      e.stopPropagation();
                      onReceive(token);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                  >
                    Receive
                  </button>
                )}
                {onSwap && (
                  <button
                    style={actionButtonStyles}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSwap(token);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                  >
                    Swap
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContextDrivenTokenTab;
