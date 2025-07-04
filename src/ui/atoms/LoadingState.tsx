import React from 'react';
import { LoadingStateProps } from '../types';

/**
 * LoadingState - A versatile loading indicator component with multiple animation variants.
 * 
 * This component provides various loading animations including spinner, dots, pulse, and skeleton.
 * It supports different sizes, overlay mode, and custom text display with full theming support.
 * 
 * @example
 * ```tsx
 * // Basic spinner
 * <LoadingState variant="spinner" size="medium" text="Loading..." />
 * 
 * // Overlay loading screen
 * <LoadingState variant="dots" overlay text="Please wait..." />
 * 
 * // Skeleton loading for content placeholders
 * <LoadingState variant="skeleton" />
 * 
 * // Pulse animation with custom theme
 * <LoadingState 
 *   variant="pulse" 
 *   size="large" 
 *   theme={customTheme}
 *   text="Connecting to wallet..."
 * />
 * ```
 * 
 * @param props - Configuration props for the loading state
 * @returns A loading indicator component with specified animation
 */
const LoadingState: React.FC<LoadingStateProps> = ({
  variant = 'spinner',
  size = 'medium',
  text,
  overlay = false,
  className = '',
  theme,
}) => {
  const getContainerStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      ...(theme?.fontFamily && { fontFamily: theme.fontFamily }),
      ...(theme?.colors?.text && { color: theme.colors.text }),
    };

    if (overlay) {
      return {
        ...baseStyles,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
      };
    }

    return baseStyles;
  };

  const getSizeValue = () => {
    switch (size) {
      case 'small': return 16;
      case 'large': return 48;
      default: return 24;
    }
  };

  const renderSpinner = () => {
    const sizeValue = getSizeValue();
    const primaryColor = theme?.colors?.primary || '#007AFF';
    
    return (
      <div
        className="wallet-loading-spinner"
        style={{
          width: sizeValue,
          height: sizeValue,
          border: `2px solid transparent`,
          borderTop: `2px solid ${primaryColor}`,
          borderRadius: '50%',
          animation: 'wallet-spin 1s linear infinite',
        }}
      />
    );
  };

  const renderDots = () => {
    const sizeValue = getSizeValue() / 3;
    const primaryColor = theme?.colors?.primary || '#007AFF';
    
    return (
      <div
        className="wallet-loading-dots"
        style={{
          display: 'flex',
          gap: `${sizeValue / 2}px`,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: sizeValue,
              height: sizeValue,
              backgroundColor: primaryColor,
              borderRadius: '50%',
              animation: `wallet-pulse 1.4s ease-in-out ${i * 0.16}s infinite both`,
            }}
          />
        ))}
      </div>
    );
  };

  const renderPulse = () => {
    const sizeValue = getSizeValue();
    const primaryColor = theme?.colors?.primary || '#007AFF';
    
    return (
      <div
        className="wallet-loading-pulse"
        style={{
          width: sizeValue,
          height: sizeValue,
          backgroundColor: primaryColor,
          borderRadius: '50%',
          animation: 'wallet-pulse-scale 1s ease-in-out infinite',
        }}
      />
    );
  };

  const renderSkeleton = () => {
    const backgroundColor = theme?.colors?.border || '#E5E5E7';
    
    return (
      <div
        className="wallet-loading-skeleton"
        style={{
          width: '100%',
          maxWidth: '200px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div
          style={{
            height: '20px',
            backgroundColor,
            borderRadius: theme?.borderRadius || '8px',
            animation: 'wallet-skeleton-shimmer 1.5s ease-in-out infinite',
          }}
        />
        <div
          style={{
            height: '16px',
            backgroundColor,
            borderRadius: theme?.borderRadius || '8px',
            width: '80%',
            animation: 'wallet-skeleton-shimmer 1.5s ease-in-out infinite 0.2s',
          }}
        />
        <div
          style={{
            height: '16px',
            backgroundColor,
            borderRadius: theme?.borderRadius || '8px',
            width: '60%',
            animation: 'wallet-skeleton-shimmer 1.5s ease-in-out infinite 0.4s',
          }}
        />
      </div>
    );
  };

  const renderLoadingContent = () => {
    switch (variant) {
      case 'dots': return renderDots();
      case 'pulse': return renderPulse();
      case 'skeleton': return renderSkeleton();
      default: return renderSpinner();
    }
  };

  return (
    <>
      <style>{`
        @keyframes wallet-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes wallet-pulse {
          0%, 80%, 100% { 
            transform: scale(0.6);
            opacity: 0.5;
          }
          40% { 
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes wallet-pulse-scale {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
          }
          50% { 
            transform: scale(0.8);
            opacity: 0.5;
          }
        }
        
        @keyframes wallet-skeleton-shimmer {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
      
      <div 
        className={`wallet-loading-state ${className}`}
        style={getContainerStyles()}
      >
        {renderLoadingContent()}
        {text && (
          <span
            style={{
              fontSize: size === 'small' ? '12px' : size === 'large' ? '16px' : '14px',
              fontWeight: '500',
              color: theme?.colors?.text || '#666',
            }}
          >
            {text}
          </span>
        )}
      </div>
    </>
  );
};

export default LoadingState;
