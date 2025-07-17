"use client"

import { Send, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TokenCard } from "./token-card"

interface MainPageProps {
  isContentReady: boolean
  isPageTransitioning: boolean
  activeTab: string
  setActiveTab: (tab: string) => void
  tokens: any[]
  expandedToken: string | null
  hoveredToken: string | null
  setHoveredToken: (token: string | null) => void
  toggleTokenExpansion: (tokenSymbol: string) => void
  handleSend: () => void
  handleReceive: () => void
  sendButtonPressed: boolean
  receiveButtonPressed: boolean
}

export function MainPage({
  isContentReady,
  isPageTransitioning,
  activeTab,
  setActiveTab,
  tokens,
  expandedToken,
  hoveredToken,
  setHoveredToken,
  toggleTokenExpansion,
  handleSend,
  handleReceive,
  sendButtonPressed,
  receiveButtonPressed,
}: MainPageProps) {
  return (
    <div
      className={`transform transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
        isContentReady && !isPageTransitioning
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-8 opacity-0 scale-95"
      }`}
    >
      {/* Logo and Balance Section */}
      <div className="text-center pt-8 pb-6">
        {/* Geometric Logo with enhanced animation */}
        <div className="flex justify-center mb-8">
          <div
            className={`w-16 h-16 relative transform transition-all duration-800 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
              isContentReady ? "scale-100 opacity-100 rotate-0" : "scale-50 opacity-0 rotate-45"
            } hover:scale-110 hover:rotate-12 cursor-pointer`}
            style={{ transitionDelay: "100ms" }}
          >
            <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-lg">
              <path
                d="M32 8 L48 20 L48 36 L40 42 L40 50 L24 38 L24 22 L32 16 L32 8 Z"
                fill="none"
                stroke="#333"
                strokeWidth="3"
                strokeLinejoin="round"
                className="animate-pulse"
              />
              <path
                d="M24 22 L32 16 L40 22 L32 28 L24 22 Z"
                fill="#333"
                className="animate-pulse animation-delay-300"
              />
            </svg>
          </div>
        </div>

        {/* Balance with counter animation */}
        <div
          className={`text-5xl font-bold text-gray-900 mb-4 transform transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
            isContentReady ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          } hover:scale-105 cursor-pointer`}
          style={{ transitionDelay: "200ms" }}
        >
          <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
            $345
          </span>
        </div>

        {/* Address with typewriter effect */}
        <div
          className={`text-gray-600 text-lg mb-8 transform transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
            isContentReady ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          } hover:text-gray-800 cursor-pointer font-mono`}
          style={{ transitionDelay: "300ms" }}
        >
          0x039...823
        </div>

        {/* Action Buttons with staggered animation */}
        <div
          className={`flex justify-center gap-8 mb-8 transform transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
            isContentReady ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <div className="text-center group">
            <Button
              size="lg"
              onClick={handleSend}
              className={`w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 mb-2 transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl group-hover:shadow-orange-500/25 ${
                sendButtonPressed ? "scale-95 shadow-inner" : "hover:shadow-lg hover:shadow-orange-500/25"
              }`}
              style={{
                transform: sendButtonPressed ? "scale(0.95)" : undefined,
              }}
            >
              <Send
                className={`h-6 w-6 transition-all duration-300 ${sendButtonPressed ? "scale-90 rotate-12" : "group-hover:scale-110"}`}
              />
            </Button>
            <div className="text-gray-700 font-medium transition-colors duration-200 group-hover:text-orange-600">
              Send
            </div>
          </div>
          <div className="text-center group">
            <Button
              size="lg"
              variant="outline"
              onClick={handleReceive}
              className={`w-16 h-16 rounded-full border-2 border-orange-500 text-orange-500 hover:bg-orange-50 hover:border-orange-600 mb-2 bg-transparent transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl group-hover:shadow-orange-500/25 ${
                receiveButtonPressed
                  ? "scale-95 bg-orange-100 border-orange-600 shadow-inner"
                  : "hover:shadow-lg hover:border-orange-600"
              }`}
              style={{
                transform: receiveButtonPressed ? "scale(0.95)" : undefined,
              }}
            >
              <Download
                className={`h-6 w-6 transition-all duration-300 ${receiveButtonPressed ? "scale-90 -rotate-12" : "group-hover:scale-110"}`}
              />
            </Button>
            <div className="text-gray-700 font-medium transition-colors duration-200 group-hover:text-orange-600">
              Receive
            </div>
          </div>
        </div>
      </div>

      {/* Tabs with enhanced animations */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4 pb-6">
        <TabsList
          className={`grid w-full grid-cols-2 bg-transparent h-auto p-0 mb-6 transform transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
            isContentReady ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <TabsTrigger
            value="tokens"
            className="data-[state=active]:bg-transparent data-[state=active]:text-orange-500 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none pb-3 font-medium tracking-wider transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:text-orange-400 relative overflow-hidden group"
          >
            <span className="relative z-10">TOKENS</span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </TabsTrigger>
          <TabsTrigger
            value="collectibles"
            className="data-[state=active]:bg-transparent data-[state=active]:text-orange-500 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none pb-3 font-medium tracking-wider text-gray-400 transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:text-orange-400 relative overflow-hidden group"
          >
            <span className="relative z-10">COLLECTIBLES</span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tokens" className="mt-0 space-y-3">
          {tokens.map((token, index) => (
            <TokenCard
              key={index}
              token={token}
              index={index}
              isContentReady={isContentReady}
              expandedToken={expandedToken}
              hoveredToken={hoveredToken}
              setHoveredToken={setHoveredToken}
              toggleTokenExpansion={toggleTokenExpansion}
            />
          ))}
        </TabsContent>

        <TabsContent value="collectibles" className="mt-0">
          <div
            className={`text-center py-12 text-gray-500 transform transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
              isContentReady ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <div className="text-lg animate-pulse">No collectibles found</div>
            <div className="text-sm">Your NFTs will appear here</div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
