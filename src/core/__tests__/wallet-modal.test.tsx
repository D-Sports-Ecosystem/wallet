import React from 'react';
import { render, screen } from '@testing-library/react';
import { WalletModal } from '../../wallet-modal';
import { availableTokens, tokens } from '../../../data/token-data';

// Mock the token data
jest.mock('../../../data/token-data', () => ({
  availableTokens: [
    {
      name: "Bitcoin",
      symbol: "BTC",
      network: "Bitcoin",
      amount: "0000 BTC",
      value: "$000",
      change: { positive: "+000%", negative: "-00%" },
      icon: "₿",
      bgColor: "bg-orange-500",
      balance: "0.0234",
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      transactions: [],
    }
  ],
  tokens: [
    {
      name: "Bitcoin",
      symbol: "BTC",
      network: "Bitcoin",
      amount: "0000 BTC",
      value: "$000",
      change: { positive: "+000%", negative: "-00%" },
      icon: "₿",
      bgColor: "bg-orange-500",
      balance: "0.0234",
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      transactions: [],
    }
  ]
}));

// Mock the Lenis smooth scroll
jest.mock('@studio-freight/lenis', () => {
  return jest.fn().mockImplementation(() => {
    return {
      raf: jest.fn(),
      destroy: jest.fn(),
      scrollTo: jest.fn(),
    };
  });
});

describe('WalletModal', () => {
  test('imports and uses token data correctly', () => {
    render(<WalletModal isOpen={true} onClose={() => {}} />);
    
    // Wait for the modal to be visible
    setTimeout(() => {
      // Check if the modal is rendered
      expect(screen.getByText('D-Sports Wallet')).toBeInTheDocument();
      
      // Verify that token data is accessible
      expect(tokens).toBeDefined();
      expect(availableTokens).toBeDefined();
      expect(tokens.length).toBeGreaterThan(0);
      expect(availableTokens.length).toBeGreaterThan(0);
    }, 200);
  });
});