import React, { useEffect } from 'react';
import { ModalProps } from '../types';
import AnimatedContainer from './AnimatedContainer';
import { usePlatform } from '../hooks/usePlatform';

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'medium',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  footer,
  children,
  className = '',
  theme,
}) => {
  const { features } = usePlatform({ fallbackToMock: true });

  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Use platform-aware approach for document access
    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [closeOnEscape, onClose]);

  useEffect(() => {
    // Use platform-aware approach for body style manipulation
    if (typeof document !== 'undefined') {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }

      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  const getModalSize = () => {
    switch (size) {
      case 'small':
        return { maxWidth: '400px', width: '90%' };
      case 'large':
        return { maxWidth: '800px', width: '90%' };
      case 'fullscreen':
        return { width: '100vw', height: '100vh', maxWidth: 'none', borderRadius: 0 };
      default:
        return { maxWidth: '600px', width: '90%' };
    }
  };

  const modalStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  };

  const contentStyles: React.CSSProperties = {
    backgroundColor: theme?.colors?.background || '#FFF',
    borderRadius: theme?.borderRadius || '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    border: theme?.colors?.border ? `1px solid ${theme.colors.border}` : 'none',
    fontFamily: theme?.fontFamily,
    ...getModalSize(),
  };

  const headerStyles: React.CSSProperties = {
    padding: '20px 20px 0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: title ? `1px solid ${theme?.colors?.border || '#E5E5E7'}` : 'none',
    paddingBottom: title ? '20px' : '0',
  };

  const bodyStyles: React.CSSProperties = {
    padding: '20px',
    maxHeight: size === 'fullscreen' ? 'calc(100vh - 120px)' : '70vh',
    overflowY: 'auto',
  };

  const footerStyles: React.CSSProperties = {
    padding: '0 20px 20px 20px',
    borderTop: footer ? `1px solid ${theme?.colors?.border || '#E5E5E7'}` : 'none',
    paddingTop: footer ? '20px' : '0',
  };

  const closeButtonStyles: React.CSSProperties = {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: theme?.colors?.text || '#666',
    padding: '0',
    lineHeight: '1',
  };

  if (!isOpen) return null;

  return (
    <div
      style={modalStyles}
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <AnimatedContainer variant="scale" isVisible={isOpen}>
        <div
          className={`wallet-modal ${className}`}
          style={contentStyles}
          onClick={(e) => e.stopPropagation()}
        >
          {(title || showCloseButton) && (
            <div style={headerStyles}>
              {title && (
                <h2
                  style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: '600',
                    color: theme?.colors?.text || '#000',
                  }}
                >
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  style={closeButtonStyles}
                  aria-label="Close modal"
                >
                  ×
                </button>
              )}
            </div>
          )}
          
          <div style={bodyStyles}>
            {children}
          </div>
          
          {footer && (
            <div style={footerStyles}>
              {footer}
            </div>
          )}
        </div>
      </AnimatedContainer>
    </div>
  );
};

export default Modal;
