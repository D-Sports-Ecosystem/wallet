import React from 'react';
import { CollectiblesTabProps } from '../types';
import LoadingState from '../atoms/LoadingState';
import EmptyState from '../atoms/EmptyState';
import AnimatedContainer from '../atoms/AnimatedContainer';

const CollectiblesTab: React.FC<CollectiblesTabProps> = ({
  nfts,
  isLoading = false,
  onRefresh,
  onNFTClick,
  onSend,
  onViewDetails,
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

  const nftGridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
  };

  const nftCardStyles: React.CSSProperties = {
    backgroundColor: theme?.colors?.background || '#FFF',
    border: theme?.colors?.border ? `1px solid ${theme.colors.border}` : '1px solid #E5E5E7',
    borderRadius: theme?.borderRadius || '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
  };

  const nftImageStyles: React.CSSProperties = {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'cover',
    backgroundColor: '#F0F0F0',
  };

  const nftInfoStyles: React.CSSProperties = {
    padding: '12px',
  };

  const nftNameStyles: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '600',
    color: theme?.colors?.text || '#000',
    margin: '0 0 4px 0',
    lineHeight: '1.3',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const nftCollectionStyles: React.CSSProperties = {
    fontSize: '12px',
    color: theme?.colors?.text ? `${theme.colors.text}60` : '#666',
    margin: '0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const nftActionsStyles: React.CSSProperties = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    display: 'flex',
    gap: '4px',
    opacity: 0,
    transition: 'opacity 0.2s ease',
  };

  const actionButtonStyles: React.CSSProperties = {
    background: 'rgba(0, 0, 0, 0.8)',
    border: 'none',
    borderRadius: '4px',
    color: '#FFF',
    cursor: 'pointer',
    fontSize: '11px',
    padding: '4px 8px',
    transition: 'all 0.2s ease',
  };

  const renderNFTCard = (nft: any, index: number) => (
    <AnimatedContainer key={nft.id} variant="scale" delay={index * 100}>
      <div
        style={nftCardStyles}
        onClick={() => onNFTClick?.(nft)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
          e.currentTarget.style.borderColor = theme?.colors?.primary || '#007AFF';
          const actions = e.currentTarget.querySelector('.nft-actions') as HTMLElement;
          if (actions) actions.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = theme?.colors?.border || '#E5E5E7';
          const actions = e.currentTarget.querySelector('.nft-actions') as HTMLElement;
          if (actions) actions.style.opacity = '0';
        }}
      >
        <div
          className="nft-actions"
          style={nftActionsStyles}
        >
          {onSend && (
            <button
              style={actionButtonStyles}
              onClick={(e) => {
                e.stopPropagation();
                onSend(nft);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme?.colors?.primary || '#007AFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
              }}
            >
              Send
            </button>
          )}
          {onViewDetails && (
            <button
              style={actionButtonStyles}
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(nft);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme?.colors?.primary || '#007AFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
              }}
            >
              Details
            </button>
          )}
        </div>

        <img
          src={nft.image}
          alt={nft.name}
          style={nftImageStyles}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
            if (placeholder) placeholder.style.display = 'flex';
          }}
        />
        <div
          style={{
            ...nftImageStyles,
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme?.colors?.border || '#E5E5E7',
            color: theme?.colors?.text || '#666',
            fontSize: '24px',
          }}
        >
          🖼️
        </div>

        <div style={nftInfoStyles}>
          <h4 style={nftNameStyles}>{nft.name}</h4>
          <p style={nftCollectionStyles}>{nft.collection}</p>
        </div>
      </div>
    </AnimatedContainer>
  );

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState variant="skeleton" size="medium" text="Loading collectibles..." />;
    }

    if (nfts.length === 0) {
      return (
        <EmptyState
          title="No Collectibles Found"
          description="You don't have any NFTs yet. Collect or receive NFTs to see them here."
          variant="wallet"
          theme={theme}
          icon={<span style={{ fontSize: '48px' }}>🖼️</span>}
        />
      );
    }

    return (
      <div style={nftGridStyles}>
        {nfts.map((nft, index) => renderNFTCard(nft, index))}
      </div>
    );
  };

  return (
    <div className={`wallet-collectibles-tab ${className}`} style={containerStyles}>
      <div style={headerStyles}>
        <h2 style={titleStyles}>Collectibles</h2>
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

export default CollectiblesTab;
