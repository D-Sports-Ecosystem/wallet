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

  const getModalSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'max-w-sm w-11/12';
      case 'large':
        return 'max-w-4xl w-11/12';
      case 'fullscreen':
        return 'w-screen h-screen max-w-none rounded-none';
      default:
        return 'max-w-2xl w-11/12';
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-50"
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <AnimatedContainer variant="scale" isVisible={isOpen}>
        <div
          className={`wallet-modal bg-white rounded-xl shadow-2xl border ${getModalSizeClasses()} ${className}`}
          style={{
            backgroundColor: theme?.colors?.background,
            borderRadius: theme?.borderRadius,
            borderColor: theme?.colors?.border,
            fontFamily: theme?.fontFamily,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {(title || showCloseButton) && (
            <div className={`px-5 pt-5 flex justify-between items-center ${title ? 'pb-5 border-b' : 'pb-0'}`}
                 style={{ borderColor: theme?.colors?.border || '#E5E5E7' }}>
              {title && (
                <h2
                  className="m-0 text-lg font-semibold"
                  style={{ color: theme?.colors?.text || '#000' }}
                >
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="bg-none border-none text-2xl cursor-pointer p-0 leading-none hover:opacity-70"
                  style={{ color: theme?.colors?.text || '#666' }}
                  aria-label="Close modal"
                >
                  ×
                </button>
              )}
            </div>
          )}
          
          <div className={`p-5 overflow-y-auto ${size === 'fullscreen' ? 'max-h-[calc(100vh-120px)]' : 'max-h-[70vh]'}`}>
            {children}
          </div>
          
          {footer && (
            <div className={`px-5 pb-5 ${footer ? 'pt-5 border-t' : 'pt-0'}`}
                 style={{ borderColor: theme?.colors?.border || '#E5E5E7' }}>
              {footer}
            </div>
          )}
        </div>
      </AnimatedContainer>
    </div>
  );
};

export default Modal;
