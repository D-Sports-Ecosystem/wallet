import React from 'react';
import { InventoryTabProps } from '../types';
import LoadingState from '../atoms/LoadingState';
import EmptyState from '../atoms/EmptyState';
import AnimatedContainer from '../atoms/AnimatedContainer';

const InventoryTab: React.FC<InventoryTabProps> = ({
  items,
  isLoading = false,
  onRefresh,
  onItemClick,
  onEquip,
  onUnequip,
  onTransfer,
  fetchInventory,
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

  const inventoryGridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '12px',
  };

  const itemCardStyles: React.CSSProperties = {
    backgroundColor: theme?.colors?.background || '#FFF',
    border: theme?.colors?.border ? `1px solid ${theme.colors.border}` : '1px solid #E5E5E7',
    borderRadius: theme?.borderRadius || '8px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
  };

  const itemImageStyles: React.CSSProperties = {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'cover',
    backgroundColor: '#F0F0F0',
  };

  const itemInfoStyles: React.CSSProperties = {
    padding: '12px',
  };

  const itemNameStyles: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '600',
    color: theme?.colors?.text || '#000',
    margin: '0 0 4px 0',
    lineHeight: '1.3',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const itemGameStyles: React.CSSProperties = {
    fontSize: '11px',
    color: theme?.colors?.text ? `${theme.colors.text}60` : '#666',
    margin: '0 0 4px 0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const itemCategoryStyles: React.CSSProperties = {
    fontSize: '12px',
    color: theme?.colors?.primary || '#007AFF',
    margin: '0',
    fontWeight: '500',
  };

  const rarityBadgeStyles: React.CSSProperties = {
    position: 'absolute',
    top: '8px',
    left: '8px',
    fontSize: '10px',
    fontWeight: '600',
    padding: '2px 6px',
    borderRadius: '4px',
    textTransform: 'uppercase',
  };

  const equippedBadgeStyles: React.CSSProperties = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    backgroundColor: '#4CAF50',
    color: '#FFF',
    fontSize: '10px',
    fontWeight: '600',
    padding: '2px 6px',
    borderRadius: '4px',
    textTransform: 'uppercase',
  };

  const itemActionsStyles: React.CSSProperties = {
    position: 'absolute',
    bottom: '8px',
    left: '8px',
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
    fontSize: '10px',
    padding: '4px 6px',
    transition: 'all 0.2s ease',
    flex: 1,
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity?.toLowerCase()) {
      case 'common': return { bg: '#9E9E9E', text: '#FFF' };
      case 'uncommon': return { bg: '#4CAF50', text: '#FFF' };
      case 'rare': return { bg: '#2196F3', text: '#FFF' };
      case 'epic': return { bg: '#9C27B0', text: '#FFF' };
      case 'legendary': return { bg: '#FF9800', text: '#FFF' };
      case 'mythic': return { bg: '#F44336', text: '#FFF' };
      default: return { bg: '#9E9E9E', text: '#FFF' };
    }
  };

  const renderItemCard = (item: any, index: number) => {
    const rarityColors = getRarityColor(item.rarity);
    
    return (
      <AnimatedContainer key={item.id} variant="scale" delay={index * 50}>
        <div
          style={itemCardStyles}
          onClick={() => onItemClick?.(item)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.borderColor = theme?.colors?.primary || '#007AFF';
            const actions = e.currentTarget.querySelector('.item-actions') as HTMLElement;
            if (actions) actions.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = theme?.colors?.border || '#E5E5E7';
            const actions = e.currentTarget.querySelector('.item-actions') as HTMLElement;
            if (actions) actions.style.opacity = '0';
          }}
        >
          {item.rarity && (
            <div
              style={{
                ...rarityBadgeStyles,
                backgroundColor: rarityColors.bg,
                color: rarityColors.text,
              }}
            >
              {item.rarity}
            </div>
          )}
          
          {item.isEquipped && (
            <div style={equippedBadgeStyles}>
              Equipped
            </div>
          )}

          <img
            src={item.image}
            alt={item.name}
            style={itemImageStyles}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
              if (placeholder) placeholder.style.display = 'flex';
            }}
          />
          <div
            style={{
              ...itemImageStyles,
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme?.colors?.border || '#E5E5E7',
              color: theme?.colors?.text || '#666',
              fontSize: '24px',
            }}
          >
            🎮
          </div>

          <div
            className="item-actions"
            style={itemActionsStyles}
          >
            {item.isEquipped ? (
              onUnequip && (
                <button
                  style={actionButtonStyles}
                  onClick={(e) => {
                    e.stopPropagation();
                    onUnequip(item);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FF5722';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                  }}
                >
                  Unequip
                </button>
              )
            ) : (
              onEquip && (
                <button
                  style={actionButtonStyles}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEquip(item);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme?.colors?.primary || '#007AFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                  }}
                >
                  Equip
                </button>
              )
            )}
            
            {item.isTransferable && onTransfer && (
              <button
                style={actionButtonStyles}
                onClick={(e) => {
                  e.stopPropagation();
                  onTransfer(item);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme?.colors?.secondary || '#6C757D';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                }}
              >
                Transfer
              </button>
            )}
          </div>

          <div style={itemInfoStyles}>
            <h4 style={itemNameStyles}>{item.name}</h4>
            <p style={itemGameStyles}>{item.game}</p>
            <p style={itemCategoryStyles}>{item.category}</p>
            {item.level && (
              <p style={{ 
                ...itemCategoryStyles, 
                color: theme?.colors?.text ? `${theme.colors.text}80` : '#888',
                fontSize: '11px'
              }}>
                Level {item.level}
              </p>
            )}
          </div>
        </div>
      </AnimatedContainer>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState variant="skeleton" size="medium" text="Loading inventory..." />;
    }

    if (items.length === 0) {
      return (
        <EmptyState
          title="No Items Found"
          description="Your game inventory is empty. Play games and collect items to see them here."
          variant="wallet"
          theme={theme}
          icon={<span style={{ fontSize: '48px' }}>🎮</span>}
          action={fetchInventory ? { label: 'Refresh Inventory', onClick: fetchInventory } : undefined}
        />
      );
    }

    return (
      <div style={inventoryGridStyles}>
        {items.map((item, index) => renderItemCard(item, index))}
      </div>
    );
  };

  return (
    <div className={`wallet-inventory-tab ${className}`} style={containerStyles}>
      <div style={headerStyles}>
        <h2 style={titleStyles}>Game Inventory</h2>
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

export default InventoryTab;
