"use client";

import React from "react";
import { useState } from "react";
import { Send, Download, RefreshCw } from "lucide-react";

import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { TokenProvider, useTokens } from "./contexts/token-context";
import { WalletModal } from "./wallet-modal";

function WalletPageContent() {
  const { tokens, isLoading, error, refreshTokenData, lastUpdated } = useTokens();
  const [activeTab, setActiveTab] = useState("tokens");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshTokenData();
    } catch (error) {
      console.error("Failed to refresh token data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return "Never updated";
    
    const now = new Date();
    const diffMs = now.getTime() - lastUpdated.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins === 1) return "1 minute ago";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return "1 hour ago";
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-lg font-medium">Wallet Page Tokens</h1>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="text-white hover:bg-white/20"
        >
          <RefreshCw className={`h-5 w-5 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Main Content */}
      <div className="bg-white min-h-screen">
        {/* Logo and Balance Section */}
        <div className="text-center pt-8 pb-6">
          {/* Geometric Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 relative">
              <svg viewBox="0 0 64 64" className="w-full h-full">
                <path
                  d="M32 8 L48 20 L48 36 L40 42 L40 50 L24 38 L24 22 L32 16 L32 8 Z"
                  fill="none"
                  stroke="#333"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <path d="M24 22 L32 16 L40 22 L32 28 L24 22 Z" fill="#333" />
              </svg>
            </div>
          </div>

          {/* Balance */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-2"></div>
              <div className="text-gray-600">Loading balance...</div>
            </div>
          ) : error ? (
            <div className="text-red-500 mb-4">
              Error loading wallet data
              <div className="text-sm text-gray-600 mt-1">
                {error.message}
              </div>
            </div>
          ) : (
            <>
              <div className="text-5xl font-bold text-gray-900 mb-4">
                ${tokens.reduce((sum, token) => sum + parseFloat(token.balance) * (token.price || 0), 0).toFixed(2)}
              </div>
              <div className="text-gray-600 text-sm mb-1">
                Last updated: {formatLastUpdated()}
              </div>
            </>
          )}

          {/* Address */}
          <div className="text-gray-600 text-lg mb-8">0x039...823</div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <Button
                size="lg"
                className="w-16 h-16 rounded-full bg-orange-500 hover:bg-orange-600 mb-2"
                onClick={() => setIsModalOpen(true)}
              >
                <Send className="h-6 w-6" />
              </Button>
              <div className="text-gray-700 font-medium">Send</div>
            </div>
            <div className="text-center">
              <Button
                size="lg"
                variant="outline"
                className="w-16 h-16 rounded-full border-orange-500 text-orange-500 hover:bg-orange-50 mb-2 bg-transparent"
                onClick={() => setIsModalOpen(true)}
              >
                <Download className="h-6 w-6" />
              </Button>
              <div className="text-gray-700 font-medium">Receive</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4">
          <TabsList className="grid w-full grid-cols-2 bg-transparent h-auto p-0 mb-6">
            <TabsTrigger
              value="tokens"
              className="data-[state=active]:bg-transparent data-[state=active]:text-orange-500 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none pb-3 font-medium tracking-wider"
            >
              TOKENS
            </TabsTrigger>
            <TabsTrigger
              value="collectibles"
              className="data-[state=active]:bg-transparent data-[state=active]:text-orange-500 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none pb-3 font-medium tracking-wider text-gray-400"
            >
              COLLECTIBLES
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tokens" className="mt-0 space-y-3">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8 bg-red-50 rounded-lg">
                <div className="text-red-600 font-medium">Failed to load tokens</div>
                <div className="text-sm text-gray-600 mt-2">{error.message}</div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh} 
                  className="mt-4"
                  disabled={isRefreshing}
                >
                  {isRefreshing ? "Refreshing..." : "Try Again"}
                </Button>
              </div>
            ) : tokens.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-lg">No tokens found</div>
                <div className="text-sm">Add tokens to your wallet to see them here</div>
              </div>
            ) : (
              tokens.map((token, index) => (
                <div
                  key={`${token.symbol}-${token.network}-${index}`}
                  className="flex items-center justify-between p-4 rounded-2xl border-2 border-orange-200 bg-white"
                >
                  <div className="flex items-center gap-4">
                    {/* Token Icon */}
                    <div
                      className={`w-12 h-12 rounded-full ${token.bgColor} flex items-center justify-center text-white font-bold text-lg`}
                    >
                      {token.icon}
                    </div>

                    {/* Token Info */}
                    <div>
                      <div className="font-semibold text-gray-900 text-lg">
                        {token.name}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">${token.price?.toFixed(2) || '0.00'}</span>
                        <span className={token.percentChange24h >= 0 ? "text-green-500" : "text-red-500"}>
                          {token.percentChange24h >= 0 ? '+' : ''}{token.percentChange24h?.toFixed(2) || '0.00'}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {token.balance} {token.symbol}
                    </div>
                    <div className="text-gray-600 text-sm">
                      ${(parseFloat(token.balance) * (token.price || 0)).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="collectibles" className="mt-0">
            <div className="text-center py-12 text-gray-500">
              <div className="text-lg">No collectibles found</div>
              <div className="text-sm">Your NFTs will appear here</div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default function WalletPage() {
  return (
    <TokenProvider>
      <WalletPageContent />
    </TokenProvider>
  );
}