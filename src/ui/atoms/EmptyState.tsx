import React from 'react';
import { EmptyStateProps } from '../types';

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  variant = 'default',
  className = '',
  theme,
}) => {
  const renderIcon = () => {
    if (icon) return <div className="wallet-empty-icon">{icon}</div>;
    return null;
  };

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'search':
        return {
          color: theme?.colors?.text || '#666',
          backgroundColor: theme?.colors?.background || '#FFF',
        };
      case 'error':
        return {
          color: theme?.colors?.danger || '#E74C3C',
          backgroundColor: theme?.colors?.background || '#FFF',
        };
      case 'wallet':
        return {
          color: theme?.colors?.primary || '#007AFF',
          backgroundColor: theme?.colors?.background || '#FFF',
        };
      default:
        return {};
    }
  };

  return (
    <div 
      className={`wallet-empty-state ${className}`}
      style={{
        padding: '20px',
        textAlign: 'center',
        borderRadius: theme?.borderRadius || '8px',
        ...getVariantStyles(),
      }}
    >
      {renderIcon()}
      <h3 style={{ margin: '10px 0', fontSize: '18px' }}>{title}</h3>
      {description && <p style={{ fontSize: '14px', color: theme?.colors?.text || '#666' }}>{description}</p>}
      {action && (
        <button 
          onClick={action.onClick} 
          style={{
            marginTop: '10px',
            color: '#FFF',
            backgroundColor: theme?.colors?.primary || '#007AFF',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

