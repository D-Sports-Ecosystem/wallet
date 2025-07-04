import React, { useState } from 'react';
import { ImportWalletFlowProps, ImportWalletConfig } from '../types';
import LoadingState from '../atoms/LoadingState';
import AnimatedContainer from '../atoms/AnimatedContainer';

const ImportWalletFlow: React.FC<ImportWalletFlowProps> = ({
  onImportWallet,
  onCancel,
  onComplete,
  supportedMethods = ['seed', 'private-key', 'keystore'],
  isLoading = false,
  className = '',
  theme,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'seed' | 'private-key' | 'keystore' | null>(null);
  const [seedPhrase, setSeedPhrase] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [keystore, setKeystore] = useState('');
  const [password, setPassword] = useState('');
  const [currentStep, setCurrentStep] = useState<'method' | 'import'>('method');

  const containerStyles: React.CSSProperties = {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '24px',
    fontFamily: theme?.fontFamily,
  };

  const headerStyles: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '32px',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: '700',
    color: theme?.colors?.text || '#000',
    margin: '0 0 8px 0',
  };

  const subtitleStyles: React.CSSProperties = {
    fontSize: '16px',
    color: theme?.colors?.text ? `${theme.colors.text}70` : '#666',
    margin: '0',
  };

  const warningStyles: React.CSSProperties = {
    padding: '16px',
    backgroundColor: '#FFF3CD',
    border: '1px solid #FFEAA7',
    borderRadius: theme?.borderRadius || '8px',
    marginBottom: '24px',
    color: '#856404',
  };

  const warningTitleStyles: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '600',
    margin: '0 0 8px 0',
  };

  const warningTextStyles: React.CSSProperties = {
    fontSize: '12px',
    margin: '0',
    lineHeight: '1.4',
  };

  const methodGridStyles: React.CSSProperties = {
    display: 'grid',
    gap: '16px',
    marginBottom: '24px',
  };

  const methodButtonStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: theme?.colors?.background || '#FFF',
    border: theme?.colors?.border ? `2px solid ${theme.colors.border}` : '2px solid #E5E5E7',
    borderRadius: theme?.borderRadius || '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
    width: '100%',
  };

  const iconStyles: React.CSSProperties = {
    fontSize: '24px',
    minWidth: '24px',
  };

  const methodInfoStyles: React.CSSProperties = {
    flex: 1,
  };

  const methodTitleStyles: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '600',
    color: theme?.colors?.text || '#000',
    margin: '0 0 4px 0',
  };

  const methodDescStyles: React.CSSProperties = {
    fontSize: '14px',
    color: theme?.colors?.text ? `${theme.colors.text}60` : '#666',
    margin: '0',
  };

  const formStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px',
  };

  const labelStyles: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '600',
    color: theme?.colors?.text || '#000',
    margin: '0 0 8px 0',
  };

  const inputStyles: React.CSSProperties = {
    padding: '12px 16px',
    border: theme?.colors?.border ? `1px solid ${theme.colors.border}` : '1px solid #E5E5E7',
    borderRadius: theme?.borderRadius || '8px',
    fontSize: '16px',
    fontFamily: theme?.fontFamily,
    outline: 'none',
    transition: 'all 0.2s ease',
    resize: 'vertical',
  };

  const textareaStyles: React.CSSProperties = {
    ...inputStyles,
    minHeight: '120px',
    fontFamily: 'monospace',
    fontSize: '14px',
  };

  const buttonGroupStyles: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
  };

  const buttonStyles: React.CSSProperties = {
    flex: 1,
    padding: '12px 24px',
    border: 'none',
    borderRadius: theme?.borderRadius || '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const primaryButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    backgroundColor: theme?.colors?.primary || '#007AFF',
    color: '#FFF',
  };

  const secondaryButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    backgroundColor: 'transparent',
    color: theme?.colors?.text || '#666',
    border: theme?.colors?.border ? `1px solid ${theme.colors.border}` : '1px solid #E5E5E7',
  };

  const getMethodIcon = (method: 'seed' | 'private-key' | 'keystore') => {
    switch (method) {
      case 'seed': return '🌱';
      case 'private-key': return '🔑';
      case 'keystore': return '📁';
      default: return '🔐';
    }
  };

  const getMethodInfo = (method: 'seed' | 'private-key' | 'keystore') => {
    switch (method) {
      case 'seed':
        return {
          title: 'Seed Phrase',
          description: 'Import using 12-24 word recovery phrase'
        };
      case 'private-key':
        return {
          title: 'Private Key',
          description: 'Import using your private key'
        };
      case 'keystore':
        return {
          title: 'Keystore File',
          description: 'Import using keystore JSON file'
        };
    }
  };

  const handleMethodSelect = (method: 'seed' | 'private-key' | 'keystore') => {
    setSelectedMethod(method);
    setCurrentStep('import');
  };

  const handleImportSubmit = async () => {
    const config: ImportWalletConfig = {
      method: selectedMethod!,
      ...(selectedMethod === 'seed' && { seedPhrase }),
      ...(selectedMethod === 'private-key' && { privateKey }),
      ...(selectedMethod === 'keystore' && { keystore, password }),
    };

    try {
      if (onImportWallet) {
        await onImportWallet(config);
      }
      // Assume wallet import was successful
      onComplete?.({
        address: '0x1234...5678', // Placeholder
        isConnected: true,
        chainId: 1,
      } as any);
    } catch (error) {
      console.error('Failed to import wallet:', error);
    }
  };

  const isFormValid = () => {
    switch (selectedMethod) {
      case 'seed':
        return seedPhrase.trim().split(' ').length >= 12;
      case 'private-key':
        return privateKey.length > 0;
      case 'keystore':
        return keystore.length > 0 && password.length > 0;
      default:
        return false;
    }
  };

  const renderMethodSelection = () => (
    <AnimatedContainer variant="fade">
      <div style={warningStyles}>
        <p style={warningTitleStyles}>⚠️ Security Warning</p>
        <p style={warningTextStyles}>
          Never share your seed phrase, private key, or keystore file with anyone. 
          Make sure you're on a secure connection and trusted device.
        </p>
      </div>
      
      <div style={methodGridStyles}>
        {supportedMethods.map((method) => {
          const info = getMethodInfo(method);
          return (
            <button
              key={method}
              style={methodButtonStyles}
              onClick={() => handleMethodSelect(method)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = theme?.colors?.primary || '#007AFF';
                e.currentTarget.style.backgroundColor = theme?.colors?.primary ? `${theme.colors.primary}05` : '#F8F9FA';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = theme?.colors?.border || '#E5E5E7';
                e.currentTarget.style.backgroundColor = theme?.colors?.background || '#FFF';
              }}
            >
              <div style={iconStyles}>{getMethodIcon(method)}</div>
              <div style={methodInfoStyles}>
                <h3 style={methodTitleStyles}>{info.title}</h3>
                <p style={methodDescStyles}>{info.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </AnimatedContainer>
  );

  const renderImportForm = () => {
    if (!selectedMethod) return null;

    return (
      <AnimatedContainer variant="slide">
        <div style={formStyles}>
          {selectedMethod === 'seed' && (
            <div>
              <label style={labelStyles}>Seed Phrase (12-24 words)</label>
              <textarea
                placeholder="Enter your seed phrase separated by spaces..."
                value={seedPhrase}
                onChange={(e) => setSeedPhrase(e.target.value)}
                style={textareaStyles}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = theme?.colors?.primary || '#007AFF';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = theme?.colors?.border || '#E5E5E7';
                }}
              />
              <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0 0' }}>
                Words: {seedPhrase.trim() ? seedPhrase.trim().split(' ').length : 0}
              </p>
            </div>
          )}

          {selectedMethod === 'private-key' && (
            <div>
              <label style={labelStyles}>Private Key</label>
              <textarea
                placeholder="Enter your private key (with or without 0x prefix)..."
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                style={textareaStyles}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = theme?.colors?.primary || '#007AFF';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = theme?.colors?.border || '#E5E5E7';
                }}
              />
            </div>
          )}

          {selectedMethod === 'keystore' && (
            <>
              <div>
                <label style={labelStyles}>Keystore JSON</label>
                <textarea
                  placeholder="Paste your keystore JSON content here..."
                  value={keystore}
                  onChange={(e) => setKeystore(e.target.value)}
                  style={textareaStyles}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = theme?.colors?.primary || '#007AFF';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = theme?.colors?.border || '#E5E5E7';
                  }}
                />
              </div>
              <div>
                <label style={labelStyles}>Keystore Password</label>
                <input
                  type="password"
                  placeholder="Enter keystore password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputStyles}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = theme?.colors?.primary || '#007AFF';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = theme?.colors?.border || '#E5E5E7';
                  }}
                />
              </div>
            </>
          )}
        </div>
      </AnimatedContainer>
    );
  };

  const renderCurrentStep = () => {
    if (isLoading) {
      return <LoadingState variant="spinner" size="large" text="Importing your wallet..." />;
    }

    switch (currentStep) {
      case 'method':
        return renderMethodSelection();
      case 'import':
        return renderImportForm();
      default:
        return renderMethodSelection();
    }
  };

  const renderButtons = () => {
    if (isLoading) return null;

    return (
      <div style={buttonGroupStyles}>
        <button
          style={secondaryButtonStyles}
          onClick={() => {
            if (currentStep === 'method') {
              onCancel?.();
            } else {
              setCurrentStep('method');
              setSelectedMethod(null);
              setSeedPhrase('');
              setPrivateKey('');
              setKeystore('');
              setPassword('');
            }
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme?.colors?.border ? `${theme.colors.border}20` : '#F0F0F0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {currentStep === 'method' ? 'Cancel' : 'Back'}
        </button>
        
        {currentStep === 'import' && (
          <button
            style={primaryButtonStyles}
            onClick={handleImportSubmit}
            disabled={!isFormValid()}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.opacity = '0.9';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            Import Wallet
          </button>
        )}
      </div>
    );
  };

  return (
    <div className={`wallet-import-flow ${className}`} style={containerStyles}>
      <div style={headerStyles}>
        <h1 style={titleStyles}>Import Existing Wallet</h1>
        <p style={subtitleStyles}>Import your wallet using one of the methods below</p>
      </div>
      
      {renderCurrentStep()}
      {renderButtons()}
    </div>
  );
};

export default ImportWalletFlow;
