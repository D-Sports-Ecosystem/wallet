"use client";

import React from "react";
import { useState } from "react";
import { Send, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Token data matching the screenshot
const tokens = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    amount: "0000 BTC",
    value: "$000",
    change: { positive: "+000%", negative: "-00%" },
    icon: "₿",
    bgColor: "bg-orange-500",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    amount: "0000 ETH",
    value: "$000",
    change: { positive: "+000%", negative: "-00%" },
    icon: "♦",
    bgColor: "bg-gray-700",
  },
  {
    name: "Polygon",
    symbol: "MATIC",
    amount: "000 MATIC",
    value: "$000",
    change: { positive: "+000%", negative: "-00%" },
    icon: "⬟",
    bgColor: "bg-purple-600",
  },
  {
    name: "XRP",
    symbol: "XRP",
    amount: "0000 XRP",
    value: "$000",
    change: { positive: "+000%", negative: "-00%" },
    icon: "✕",
    bgColor: "bg-black",
  },
  {
    name: "Binance",
    symbol: "BNB",
    amount: "0000 BNB",
    value: "$000",
    change: { positive: "+000%", negative: "-00%" },
    icon: "◆",
    bgColor: "bg-yellow-500",
  },
  {
    name: "Solana",
    symbol: "SOL",
    amount: "0000 SOL",
    value: "$000",
    change: { positive: "+000%", negative: "-00%" },
    icon: "◢",
    bgColor: "bg-gradient-to-r from-purple-400 to-blue-400",
  },
  {
    name: "Tether",
    symbol: "USDT",
    amount: "0000 USDT",
    value: "$000",
    change: { positive: "+000%", negative: "-00%" },
    icon: "₮",
    bgColor: "bg-green-500",
  },
  {
    name: "USDC",
    symbol: "USDC",
    amount: "0000 USDC",
    value: "$000",
    change: { positive: "+000%", negative: "-00%" },
    icon: "$",
    bgColor: "bg-blue-600",
  },
];

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState("tokens");

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4">
        <h1 className="text-lg font-medium">Wallet Page Tokens</h1>
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
          <div className="text-5xl font-bold text-gray-900 mb-4">$345</div>

          {/* Address */}
          <div className="text-gray-600 text-lg mb-8">0x039...823</div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <Button
                size="lg"
                className="w-16 h-16 rounded-full bg-orange-500 hover:bg-orange-600 mb-2"
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
            {tokens.map((token, index) => (
              <div
                key={index}
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
                      <span className="text-gray-600">{token.value}</span>
                      <span className="text-green-500">
                        {token.change.positive}
                      </span>
                      <span className="text-red-500">
                        {token.change.negative}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {token.amount}
                  </div>
                  <div className="text-gray-600 text-sm">{token.value}</div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="collectibles" className="mt-0">
            <div className="text-center py-12 text-gray-500">
              <div className="text-lg">No collectibles found</div>
              <div className="text-sm">Your NFTs will appear here</div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
