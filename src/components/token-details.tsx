import React, { useState } from 'react';
import { useTokenDocs } from '../hooks/use-token-docs';
import { TokenInfo } from '../services/token-service';

interface TokenDetailsProps {
  token: TokenInfo;
  onClose: () => void;
}

export const TokenDetails: React.FC<TokenDetailsProps> = ({ token, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'about'>('overview');
  const { docs, isLoading, error } = useTokenDocs({ symbol: token.symbol });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 ${token.bgColor} rounded-full flex items-center justify-center text-white text-2xl font-bold`}>
            {token.icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{token.name}</h2>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">{token.symbol}</span>
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                {token.network}
              </span>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Price Information */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Price</p>
            <p className="text-xl font-bold">${token.price?.toFixed(2) || '0.00'}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">24h Change</p>
            <p className={`text-xl font-bold ${token.percentChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {token.percentChange24h >= 0 ? '+' : ''}{token.percentChange24h?.toFixed(2) || '0.00'}%
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Balance</p>
            <p className="text-xl font-bold">{token.balance} {token.symbol}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Value</p>
            <p className="text-xl font-bold">${(parseFloat(token.balance) * (token.price || 0)).toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'transactions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'about'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            About
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Token Address</h3>
              <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                <p className="text-sm text-gray-600 truncate">{token.address}</p>
                <button 
                  onClick={() => navigator.clipboard.writeText(token.address)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Market Data</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-sm">Market Cap</p>
                  <p className="font-medium">${token.marketCap?.toLocaleString() || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-sm">24h Volume</p>
                  <p className="font-medium">$--</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Description</h3>
              {isLoading ? (
                <p className="text-gray-500">Loading token information...</p>
              ) : error ? (
                <p className="text-gray-500">No detailed information available.</p>
              ) : (
                <p className="text-gray-600">{docs?.description || 'No description available.'}</p>
              )}
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div>
            <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
            {token.transactions && token.transactions.length > 0 ? (
              <div className="space-y-4">
                {token.transactions.map((tx, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          tx.type === 'receive' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {tx.type === 'receive' ? '↓' : '↑'}
                        </span>
                        <span className="ml-2 font-medium">{tx.type === 'receive' ? 'Received' : 'Sent'}</span>
                      </div>
                      <span className="text-gray-500 text-sm">{tx.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">
                          {tx.type === 'receive' ? 'From: ' + tx.from : 'To: ' + tx.to}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${tx.type === 'receive' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.amount}
                        </p>
                        <p className="text-sm text-gray-500">{tx.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No transactions found.</p>
            )}
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <p className="text-gray-500">Failed to load token information. Please try again later.</p>
            ) : (
              <div className="space-y-6">
                {docs?.technology && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Technology</h3>
                    <p className="text-gray-600">{docs.technology}</p>
                  </div>
                )}
                
                {docs?.useCase && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Use Cases</h3>
                    <p className="text-gray-600">{docs.useCase}</p>
                  </div>
                )}
                
                {docs?.marketInfo && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Market Information</h3>
                    <p className="text-gray-600">{docs.marketInfo}</p>
                  </div>
                )}
                
                {(docs?.website || docs?.whitepaper) && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Resources</h3>
                    <div className="flex flex-wrap gap-2">
                      {docs?.website && (
                        <a 
                          href={docs.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100"
                        >
                          Official Website
                        </a>
                      )}
                      {docs?.whitepaper && (
                        <a 
                          href={docs.whitepaper} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100"
                        >
                          Whitepaper
                        </a>
                      )}
                    </div>
                  </div>
                )}
                
                {!docs?.technology && !docs?.useCase && !docs?.marketInfo && !docs?.website && !docs?.whitepaper && (
                  <p className="text-gray-500">No detailed information available for this token.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};