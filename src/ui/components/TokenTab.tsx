import React from 'react';
import { TokenTabProps } from '../types';
import LoadingState from '../atoms/LoadingState';
import EmptyState from '../atoms/EmptyState';
import AnimatedContainer from '../atoms/AnimatedContainer';

const TokenTab: React.FC<TokenTabProps> = ({
  tokens,
  isLoading = false,
  onRefresh,
  onTokenClick,
  onSend,
  onReceive,
  onSwap,
  className = '',
  theme,
}) => {
  const containerStyles: React.CSSProperties = {
    padding: '16px',
    fontFamily: theme?.fontFamily,
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '600',
    color: theme?.colors?.text || '#000',
    margin: '0',
  };

  const refreshButtonStyles: React.CSSProperties = {
    background: 'none',
    border: `1px solid ${theme?.colors?.border || '#E5E5E7'}`,
    borderRadius: theme?.borderRadius || '8px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    color: theme?.colors?.text || '#666',
    transition: 'all 0.2s ease',
  };

  const tokenListStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const tokenItemStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: theme?.colors?.background || '#FFF',
    border: theme?.colors?.border ? `1px solid ${theme.colors.border}` : '1px solid #E5E5E7',
    borderRadius: theme?.borderRadius || '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const tokenInfoStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  };

  const tokenIconStyles: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: theme?.colors?.primary || '#007AFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFF',
    fontSize: '14px',
    fontWeight: '600',
  };

  const tokenDetailsStyles: React.CSSProperties = {
    flex: 1,
  };

  const tokenNameStyles: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '600',
    color: theme?.colors?.text || '#000',
    margin: '0 0 4px 0',
  };

  const tokenSymbolStyles: React.CSSProperties = {
    fontSize: '14px',
    color: theme?.colors?.text ? `${theme.colors.text}60` : '#666',
    margin: '0',
  };

  const tokenBalanceStyles: React.CSSProperties = {
    textAlign: 'right',
  };

  const balanceAmountStyles: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '600',
    color: theme?.colors?.text || '#000',
    margin: '0 0 4px 0',
  };

  const balanceValueStyles: React.CSSProperties = {
    fontSize: '14px',
    color: theme?.colors?.text ? `${theme.colors.text}60` : '#666',
    margin: '0',
  };

  const actionsStyles: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    marginLeft: '12px',
  };

  const actionButtonStyles: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: theme?.colors?.primary || '#007AFF',
    cursor: 'pointer',
    fontSize: '12px',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
  };

  const formatBalance = (balance: string, decimals: number = 18) => {
    const num = parseFloat(balance);
    if (num === 0) return '0';
    if (num < 0.01) return '< 0.01';
    return num.toFixed(4);
  };

  const formatValue = (value?: string) => {
    if (!value) return '';
    const num = parseFloat(value);
    if (num === 0) return '$0.00';
    if (num < 0.01) return '< $0.01';
    return `$${num.toFixed(2)}`;
  };

  const renderTokenItem = (token: any, index: number) => (
    <AnimatedContainer key={token.symbol} variant="slide" delay={index * 50}>
      <div
        style={tokenItemStyles}
        onClick={() => onTokenClick?.(token)}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme?.colors?.primary ? `${theme.colors.primary}05` : '#F8F9FA';
          e.currentTarget.style.borderColor = theme?.colors?.primary || '#007AFF';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = theme?.colors?.background || '#FFF';
          e.currentTarget.style.borderColor = theme?.colors?.border || '#E5E5E7';
        }}
      >
        <div style={tokenInfoStyles}>
          <div style={tokenIconStyles}>
            {token.logoUri ? (
              <img
                src={token.logoUri}
                alt={token.symbol}
                style={{ width: '100%', height: '100%', borderRadius: '50%' }}
              />
            ) : (
              token.symbol.charAt(0).toUpperCase()
            )}
          </div>
          <div style={tokenDetailsStyles}>
            <h4 style={tokenNameStyles}>{token.name}</h4>
            <p style={tokenSymbolStyles}>{token.symbol}</p>
          </div>
        </div>

        <div style={tokenBalanceStyles}>
          <p style={balanceAmountStyles}>
            {formatBalance(token.balance, token.decimals)} {token.symbol}
          </p>
          {token.value && (
            <p style={balanceValueStyles}>
              {formatValue(token.value)}
            </p>
          )}
        </div>

        <div style={actionsStyles}>
          <button
            style={actionButtonStyles}
            onClick={(e) => {
              e.stopPropagation();
              onSend?.(token);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme?.colors?.primary ? `${theme.colors.primary}10` : '#E3F2FD';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Send
          </button>
          <button
            style={actionButtonStyles}
            onClick={(e) => {
              e.stopPropagation();
              onSwap?.(token);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme?.colors?.primary ? `${theme.colors.primary}10` : '#E3F2FD';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Swap
          </button>
        </div>
      </div>
    </AnimatedContainer>
  );

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState variant="skeleton" size="medium" text="Loading tokens..." />;
    }

    if (tokens.length === 0) {
      return (
        <EmptyState
          title="No Tokens Found"
          description="You don't have any tokens yet. Receive tokens to see them here."
          variant="wallet"
          action={onReceive ? { label: 'Receive Tokens', onClick: () => onReceive(tokens[0]) } : undefined}
          theme={theme}
        />
      );
    }

    return (
      <div style={tokenListStyles}>
        {tokens.map((token, index) => renderTokenItem(token, index))}
      </div>
    );
  };

  return (
    <div className={`wallet-token-tab ${className}`} style={containerStyles}>
      <div style={headerStyles}>
        <h2 style={titleStyles}>Tokens</h2>
        {onRefresh && (
          <button
            style={refreshButtonStyles}
            onClick={onRefresh}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme?.colors?.primary ? `${theme.colors.primary}10` : '#F0F0F0';
              e.currentTarget.style.borderColor = theme?.colors?.primary || '#007AFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = theme?.colors?.border || '#E5E5E7';
            }}
          >
            Refresh
          </button>
        )}
      </div>
      {renderContent()}
    </div>
  );
};

export default TokenTab;
