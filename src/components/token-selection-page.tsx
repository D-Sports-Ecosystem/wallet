"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface TokenSelectionPageProps {
  isPageTransitioning: boolean
  isContentReady: boolean
  searchQuery: string
  setSearchQuery: (query: string) => void
  availableTokens: any[]
  handleTokenSelect: (token: any) => void
}

export function TokenSelectionPage({
  isPageTransitioning,
  isContentReady,
  searchQuery,
  setSearchQuery,
  availableTokens,
  handleTokenSelect,
}: TokenSelectionPageProps) {
  // Filter tokens based on search query
  const filteredTokens = availableTokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.network.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div
      className={`p-6 space-y-6 transform transition-all duration-600 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
        !isPageTransitioning && isContentReady ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
      }`}
    >
      {/* Search Bar with focus animation */}
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors duration-200 group-focus-within:text-orange-500" />
        <Input
          placeholder="Search tokens or networks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all duration-300 focus:bg-white focus:shadow-lg"
        />
      </div>

      {/* Token List with staggered animations */}
      <div className="space-y-3">
        {filteredTokens.map((token, index) => (
          <div
            key={`${token.symbol}-${token.network}`}
            className={`p-4 rounded-xl border border-gray-200 bg-white cursor-pointer transition-all duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-[1.02] hover:shadow-xl hover:border-orange-300 hover:bg-gradient-to-r hover:from-white hover:to-orange-50 group transform ${
              !isPageTransitioning ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: `${index * 50}ms` }}
            onClick={() => handleTokenSelect(token)}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-full ${token.bgColor} flex items-center justify-center text-white font-bold text-lg transition-all duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110 group-hover:rotate-6 shadow-lg group-hover:shadow-xl`}
              >
                {token.icon}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-lg transition-colors duration-200 group-hover:text-orange-600">
                  {token.symbol === "ETH" && token.name === "Ethereum" ? `ETH on ${token.network}` : `${token.name}`}
                </div>
                <div className="text-sm text-gray-600 transition-colors duration-200 group-hover:text-gray-700">
                  Balance: {token.balance} {token.symbol}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 transition-colors duration-200 group-hover:text-orange-600">
                  {token.symbol}
                </div>
                <div className="text-xs text-gray-500 transition-colors duration-200 group-hover:text-gray-600">
                  {token.network}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results with animation */}
      {filteredTokens.length === 0 && (
        <div className="text-center py-12 text-gray-500 animate-fade-in">
          <div className="text-lg animate-pulse">No tokens found</div>
          <div className="text-sm">Try adjusting your search terms</div>
        </div>
      )}
    </div>
  )
}
