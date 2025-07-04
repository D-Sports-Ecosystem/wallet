import React, { useState } from 'react';
import { CreateWalletFlowProps, CreateWalletConfig } from '../types';
import LoadingState from '../atoms/LoadingState';
import AnimatedContainer from '../atoms/AnimatedContainer';

const CreateWalletFlow: React.FC<CreateWalletFlowProps> = ({
  onCreateWallet,
  onCancel,
  onComplete,
  supportedMethods = ['social', 'web3', 'email'],
  socialProviders = ['google', 'facebook', 'twitter', 'discord'],
  isLoading = false,
  className = '',
  theme,
}) => {
  const [currentStep, setCurrentStep] = useState<'method' | 'social' | 'email' | 'confirm'>('method');
  const [selectedMethod, setSelectedMethod] = useState<'social' | 'web3' | 'email' | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const containerStyles: React.CSSProperties = {
    maxWidth: '400px',
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

  const socialGridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '24px',
  };

  const socialButtonStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '16px',
    backgroundColor: theme?.colors?.background || '#FFF',
    border: theme?.colors?.border ? `2px solid ${theme.colors.border}` : '2px solid #E5E5E7',
    borderRadius: theme?.borderRadius || '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const socialIconStyles: React.CSSProperties = {
    fontSize: '32px',
  };

  const socialLabelStyles: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '500',
    color: theme?.colors?.text || '#000',
    textTransform: 'capitalize',
  };

  const formStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px',
  };

  const inputStyles: React.CSSProperties = {
    padding: '12px 16px',
    border: theme?.colors?.border ? `1px solid ${theme.colors.border}` : '1px solid #E5E5E7',
    borderRadius: theme?.borderRadius || '8px',
    fontSize: '16px',
    fontFamily: theme?.fontFamily,
    outline: 'none',
    transition: 'all 0.2s ease',
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

  const getSocialIcon = (provider: string) => {
    switch (provider) {
      case 'google': return '🔍';
      case 'facebook': return '📘';
      case 'twitter': return '🐦';
      case 'discord': return '🎮';
      case 'github': return '🐙';
      case 'apple': return '🍎';
      default: return '🔐';
    }
  };

  const getMethodIcon = (method: 'social' | 'web3' | 'email') => {
    switch (method) {
      case 'social': return '👥';
      case 'web3': return '🔗';
      case 'email': return '📧';
      default: return '🔐';
    }
  };

  const getMethodInfo = (method: 'social' | 'web3' | 'email') => {
    switch (method) {
      case 'social':
        return {
          title: 'Social Login',
          description: 'Sign in with your social media account'
        };
      case 'web3':
        return {
          title: 'Web3 Wallet',
          description: 'Connect with MetaMask or other wallets'
        };
      case 'email':
        return {
          title: 'Email & Password',
          description: 'Create account with email and password'
        };
    }
  };

  const handleMethodSelect = (method: 'social' | 'web3' | 'email') => {
    setSelectedMethod(method);
    if (method === 'social') {
      setCurrentStep('social');
    } else if (method === 'email') {
      setCurrentStep('email');
    } else {
      // For web3, create wallet immediately
      handleCreateWallet({
        method,
        connectorId: 'metamask', // Default connector
      });
    }
  };

  const handleSocialSelect = (provider: string) => {
    setSelectedProvider(provider);
    handleCreateWallet({
      method: 'social',
      provider: provider as any,
    });
  };

  const handleEmailSubmit = () => {
    if (password !== confirmPassword) {
      return; // Show error
    }
    handleCreateWallet({
      method: 'email',
      email,
      password,
    });
  };

  const handleCreateWallet = async (config: CreateWalletConfig) => {
    try {
      if (onCreateWallet) {
        await onCreateWallet(config);
      }
      // Assume wallet creation was successful
      onComplete?.({
        address: '0x1234...5678', // Placeholder
        isConnected: true,
        chainId: 1,
      } as any);
    } catch (error) {
      console.error('Failed to create wallet:', error);
    }
  };

  const renderMethodSelection = () => (
    <AnimatedContainer variant="fade">
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

  const renderSocialSelection = () => (
    <AnimatedContainer variant="slide">
      <div style={socialGridStyles}>
        {socialProviders.map((provider) => (
          <button
            key={provider}
            style={socialButtonStyles}
            onClick={() => handleSocialSelect(provider)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = theme?.colors?.primary || '#007AFF';
              e.currentTarget.style.backgroundColor = theme?.colors?.primary ? `${theme.colors.primary}05` : '#F8F9FA';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = theme?.colors?.border || '#E5E5E7';
              e.currentTarget.style.backgroundColor = theme?.colors?.background || '#FFF';
            }}
          >
            <div style={socialIconStyles}>{getSocialIcon(provider)}</div>
            <span style={socialLabelStyles}>{provider}</span>
          </button>
        ))}
      </div>
    </AnimatedContainer>
  );

  const renderEmailForm = () => (
    <AnimatedContainer variant="slide">
      <div style={formStyles}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyles}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = theme?.colors?.primary || '#007AFF';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = theme?.colors?.border || '#E5E5E7';
          }}
        />
        <input
          type="password"
          placeholder="Create password"
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
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={inputStyles}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = theme?.colors?.primary || '#007AFF';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = theme?.colors?.border || '#E5E5E7';
          }}
        />
      </div>
    </AnimatedContainer>
  );

  const renderCurrentStep = () => {
    if (isLoading) {
      return <LoadingState variant="spinner" size="large" text="Creating your wallet..." />;
    }

    switch (currentStep) {
      case 'method':
        return renderMethodSelection();
      case 'social':
        return renderSocialSelection();
      case 'email':
        return renderEmailForm();
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
              setSelectedProvider(null);
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
        
        {currentStep === 'email' && (
          <button
            style={primaryButtonStyles}
            onClick={handleEmailSubmit}
            disabled={!email || !password || !confirmPassword || password !== confirmPassword}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.opacity = '0.9';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            Create Wallet
          </button>
        )}
      </div>
    );
  };

  return (
    <div className={`wallet-create-flow ${className}`} style={containerStyles}>
      <div style={headerStyles}>
        <h1 style={titleStyles}>Create New Wallet</h1>
        <p style={subtitleStyles}>Choose how you'd like to create your wallet</p>
      </div>
      
      {renderCurrentStep()}
      {renderButtons()}
    </div>
  );
};

export default CreateWalletFlow;
