"use client"

import { Send, Download, ChevronDown } from "lucide-react"

interface TokenCardProps {
  token: any
  index: number
  isContentReady: boolean
  expandedToken: string | null
  hoveredToken: string | null
  setHoveredToken: (token: string | null) => void
  toggleTokenExpansion: (tokenSymbol: string) => void
}

export function TokenCard({
  token,
  index,
  isContentReady,
  expandedToken,
  hoveredToken,
  setHoveredToken,
  toggleTokenExpansion,
}: TokenCardProps) {
  return (
    <div
      id={`token-${token.symbol}`}
      className={`transform transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
        isContentReady ? "translate-y-0 opacity-100 scale-100" : "translate-y-6 opacity-0 scale-95"
      }`}
      style={{ transitionDelay: `${600 + index * 100}ms` }}
      onMouseEnter={() => setHoveredToken(token.symbol)}
      onMouseLeave={() => setHoveredToken(null)}
    >
      {/* Token Header with enhanced hover effects and click animations */}
      <div
        className={`flex items-center justify-between p-4 rounded-2xl border-2 border-orange-200 bg-white cursor-pointer transition-all duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-[1.02] hover:shadow-xl hover:border-orange-300 hover:bg-gradient-to-r hover:from-white hover:to-orange-50 group ${
          hoveredToken === token.symbol ? "shadow-lg border-orange-300" : ""
        } ${expandedToken === token.symbol ? "ring-2 ring-orange-200 ring-opacity-50 shadow-lg" : ""}`}
        onClick={() => {
          // Add click animation feedback
          const element = document.getElementById(`token-${token.symbol}`)
          if (element) {
            element.style.transform = "scale(0.98)"
            setTimeout(() => {
              element.style.transform = ""
              toggleTokenExpansion(token.symbol)
            }, 100)
          } else {
            toggleTokenExpansion(token.symbol)
          }
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-full ${token.bgColor} flex items-center justify-center text-white font-bold text-lg transition-all duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110 group-hover:rotate-6 shadow-lg group-hover:shadow-xl`}
          >
            {token.icon}
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-lg transition-colors duration-200 group-hover:text-orange-600">
              {token.symbol === "ETH" && token.name === "Ethereum" ? `ETH (${token.network})` : token.name}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600 transition-colors duration-200 group-hover:text-gray-700">
                {token.value}
              </span>
              <span className="text-green-500 transition-all duration-200 group-hover:scale-105">
                {token.change.positive}
              </span>
              <span className="text-red-500 transition-all duration-200 group-hover:scale-105">
                {token.change.negative}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-semibold text-gray-900 transition-colors duration-200 group-hover:text-orange-600">
              {token.amount}
            </div>
            <div className="text-gray-600 text-sm transition-colors duration-200 group-hover:text-gray-700">
              {token.value}
            </div>
          </div>
          <div
            className={`transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              expandedToken === token.symbol
                ? "rotate-180 text-orange-500 scale-110"
                : "rotate-0 text-gray-400 group-hover:text-orange-400 group-hover:scale-105"
            }`}
          >
            <ChevronDown className="h-5 w-5 drop-shadow-sm" />
          </div>
        </div>
      </div>

      {/* Expandable Transactions with enhanced opening/closing animations */}
      <div
        className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          expandedToken === token.symbol
            ? "max-h-[500px] opacity-100 mt-4 scale-100"
            : "max-h-0 opacity-0 mt-0 scale-95"
        }`}
        style={{
          transformOrigin: "top center",
        }}
      >
        <div
          className={`bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 space-y-3 border border-gray-200 shadow-lg transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            expandedToken === token.symbol
              ? "translate-y-0 rotate-0 scale-100"
              : "translate-y-[-10px] rotate-[-1deg] scale-98"
          }`}
        >
          {/* Header with slide-in animation */}
          <div
            className={`flex items-center justify-between mb-4 transform transition-all duration-600 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              expandedToken === token.symbol ? "translate-x-0 opacity-100" : "translate-x-[-20px] opacity-0"
            }`}
            style={{ transitionDelay: expandedToken === token.symbol ? "200ms" : "0ms" }}
          >
            <h4 className="font-semibold text-gray-900 text-lg">Recent Transactions</h4>
            <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200 animate-pulse">
              {token.transactions.length} transactions
            </span>
          </div>

          {/* Transaction list with staggered entrance animations */}
          <div className="space-y-3">
            {token.transactions.map((tx: any, txIndex: number) => (
              <div
                key={txIndex}
                className={`flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm transform transition-all duration-600 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:shadow-lg hover:scale-[1.02] hover:border-orange-200 hover:bg-gradient-to-r hover:from-white hover:to-orange-50 group cursor-pointer ${
                  expandedToken === token.symbol
                    ? "translate-y-0 opacity-100 scale-100 rotate-0"
                    : "translate-y-4 opacity-0 scale-95 rotate-1"
                }`}
                style={{
                  transitionDelay: expandedToken === token.symbol ? `${300 + txIndex * 150}ms` : "0ms",
                  transformOrigin: "center center",
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-125 group-hover:rotate-12 shadow-md group-hover:shadow-lg ${
                      tx.type === "send"
                        ? "bg-gradient-to-br from-red-100 to-red-200 text-red-600 group-hover:from-red-200 group-hover:to-red-300"
                        : "bg-gradient-to-br from-green-100 to-green-200 text-green-600 group-hover:from-green-200 group-hover:to-green-300"
                    }`}
                  >
                    {tx.type === "send" ? (
                      <Send className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    ) : (
                      <Download className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold capitalize transition-colors duration-300 group-hover:text-orange-600">
                      {tx.type === "send" ? "Sent" : "Received"}
                    </div>
                    <div className="text-xs text-gray-500 transition-colors duration-200 group-hover:text-gray-600">
                      {tx.time}
                    </div>
                    <div className="text-xs text-gray-400 font-mono transition-all duration-200 group-hover:text-gray-500 group-hover:scale-105">
                      {tx.type === "send" ? `To: ${tx.to}` : `From: ${tx.from}`}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-sm font-bold transition-all duration-300 group-hover:scale-110 ${
                      tx.type === "send"
                        ? "text-red-600 group-hover:text-red-700"
                        : "text-green-600 group-hover:text-green-700"
                    }`}
                  >
                    {tx.amount}
                  </div>
                  <div className="text-xs text-gray-500 transition-colors duration-200 group-hover:text-gray-600">
                    {tx.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer with slide-up animation */}
          <div
            className={`pt-3 border-t border-gray-200 transform transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              expandedToken === token.symbol ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{
              transitionDelay: expandedToken === token.symbol ? `${400 + token.transactions.length * 150}ms` : "0ms",
            }}
          >
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Transaction History</span>
              <button
                className="text-orange-500 hover:text-orange-600 font-medium transition-colors duration-200 hover:underline"
                onClick={(e) => {
                  e.stopPropagation()
                  // Add view all transactions logic here
                }}
              >
                View All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
