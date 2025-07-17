"use client"

import { Copy, QrCode, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface ReceivePageProps {
  isPageTransitioning: boolean
  selectedReceiveToken: any
  copyAddress: () => void
  copiedAddress: boolean
}

export function ReceivePage({
  isPageTransitioning,
  selectedReceiveToken,
  copyAddress,
  copiedAddress,
}: ReceivePageProps) {
  return (
    <div
      className={`p-6 space-y-6 transform transition-all duration-600 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
        !isPageTransitioning ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
      }`}
    >
      {selectedReceiveToken && (
        <>
          {/* Selected Token Info with gradient background */}
          <div className="bg-gradient-to-r from-orange-50 via-orange-100 to-orange-50 rounded-xl p-4 border border-orange-200">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full ${selectedReceiveToken.bgColor} flex items-center justify-center text-white font-bold text-lg shadow-lg animate-pulse`}
              >
                {selectedReceiveToken.icon}
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-lg">
                  {selectedReceiveToken.name} ({selectedReceiveToken.network})
                </div>
                <div className="text-sm text-gray-600">
                  Balance: {selectedReceiveToken.balance} {selectedReceiveToken.symbol}
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Section with enhanced animation */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-48 h-48 bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <div className="w-40 h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <QrCode className="h-20 w-20 text-gray-400 animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Scan to Send {selectedReceiveToken.symbol}</h3>
              <p className="text-sm text-gray-600">
                Share this QR code to receive {selectedReceiveToken.name} payments
              </p>
            </div>
          </div>

          {/* Address Section with copy animation */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Your {selectedReceiveToken.network} Address</Label>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors duration-200">
              <code className="flex-1 text-sm font-mono text-gray-800 break-all">{selectedReceiveToken.address}</code>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyAddress}
                className={`h-8 w-8 text-gray-500 hover:text-gray-700 transition-all duration-200 ${
                  copiedAddress ? "text-green-600 scale-110" : ""
                }`}
              >
                <Copy className={`h-4 w-4 ${copiedAddress ? "animate-bounce" : ""}`} />
              </Button>
            </div>
            {copiedAddress && (
              <div className="text-sm text-green-600 animate-fade-in">Address copied to clipboard!</div>
            )}
          </div>

          {/* Network Info with enhanced styling */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-4 h-4 rounded-full ${selectedReceiveToken.bgColor} animate-pulse`}></div>
              <span className="font-medium text-gray-900">{selectedReceiveToken.network} Network</span>
            </div>
            <p className="text-sm text-gray-600">
              Only send {selectedReceiveToken.symbol} tokens on the {selectedReceiveToken.network} network to this
              address.
            </p>
          </div>

          {/* Quick Actions with enhanced animations */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 hover:scale-105"
              onClick={copyAddress}
            >
              <Copy className="h-4 w-4" />
              Copy Address
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 hover:scale-105"
            >
              <Camera className="h-4 w-4" />
              Save QR
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
