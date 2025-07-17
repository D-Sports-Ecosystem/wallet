"use client"

import { QrCode, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SendPageProps {
  isPageTransitioning: boolean
  selectedToken: any
  setSelectedToken: (token: any) => void
  tokens: any[]
  sendAmount: string
  setSendAmount: (amount: string) => void
  recipientAddress: string
  setRecipientAddress: (address: string) => void
  memo: string
  setMemo: (memo: string) => void
}

export function SendPage({
  isPageTransitioning,
  selectedToken,
  setSelectedToken,
  tokens,
  sendAmount,
  setSendAmount,
  recipientAddress,
  setRecipientAddress,
  memo,
  setMemo,
}: SendPageProps) {
  return (
    <div
      className={`p-6 space-y-6 transform transition-all duration-600 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
        !isPageTransitioning ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
      }`}
    >
      {/* Token Selection with enhanced styling */}
      <div className="space-y-2">
        <Label htmlFor="token-select" className="text-sm font-medium text-gray-700">
          Select Token
        </Label>
        <Select
          value={selectedToken.symbol}
          onValueChange={(value) => {
            const token = tokens.find((t) => t.symbol === value)
            if (token) setSelectedToken(token)
          }}
        >
          <SelectTrigger className="w-full transition-all duration-200 hover:border-orange-300 focus:border-orange-500">
            <SelectValue>
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full ${selectedToken.bgColor} flex items-center justify-center text-white font-bold text-sm transition-transform duration-200 hover:scale-110`}
                >
                  {selectedToken.icon}
                </div>
                <div className="text-left">
                  <div className="font-medium">{selectedToken.name}</div>
                  <div className="text-sm text-gray-500">
                    Balance: {selectedToken.balance} {selectedToken.symbol}
                  </div>
                </div>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {tokens.map((token) => (
              <SelectItem key={token.symbol} value={token.symbol} className="hover:bg-orange-50">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full ${token.bgColor} flex items-center justify-center text-white font-bold text-sm`}
                  >
                    {token.icon}
                  </div>
                  <div>
                    <div className="font-medium">{token.name}</div>
                    <div className="text-sm text-gray-500">
                      Balance: {token.balance} {token.symbol}
                    </div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Amount Input with enhanced styling */}
      <div className="space-y-2">
        <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
          Amount
        </Label>
        <div className="relative group">
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            value={sendAmount}
            onChange={(e) => setSendAmount(e.target.value)}
            className="text-right pr-16 text-lg font-medium transition-all duration-200 focus:shadow-lg group-hover:border-orange-300"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium transition-colors duration-200 group-focus-within:text-orange-500">
            {selectedToken.symbol}
          </div>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>
            Available: {selectedToken.balance} {selectedToken.symbol}
          </span>
          <Button
            variant="link"
            className="h-auto p-0 text-orange-500 hover:text-orange-600 transition-colors duration-200"
            onClick={() => setSendAmount(selectedToken.balance)}
          >
            Max
          </Button>
        </div>
      </div>

      {/* Recipient Address with enhanced styling */}
      <div className="space-y-2">
        <Label htmlFor="recipient" className="text-sm font-medium text-gray-700">
          Recipient Address
        </Label>
        <div className="relative group">
          <Input
            id="recipient"
            placeholder="0x... or ENS name"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className="pr-20 transition-all duration-200 focus:shadow-lg group-hover:border-orange-300"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-orange-50 transition-colors duration-200">
              <QrCode className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-orange-50 transition-colors duration-200">
              <Users className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Memo with enhanced styling */}
      <div className="space-y-2">
        <Label htmlFor="memo" className="text-sm font-medium text-gray-700">
          Memo (Optional)
        </Label>
        <Textarea
          id="memo"
          placeholder="Add a note..."
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={3}
          className="transition-all duration-200 focus:shadow-lg hover:border-orange-300"
        />
      </div>

      {/* Transaction Summary with enhanced styling */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 space-y-2 border border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Network Fee</span>
          <span className="font-medium">~$2.50</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total</span>
          <span className="font-medium">
            {sendAmount || "0"} {selectedToken.symbol} + Fee
          </span>
        </div>
      </div>

      {/* Send Button with enhanced animation */}
      <Button
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!sendAmount || !recipientAddress}
      >
        Send {selectedToken.symbol}
      </Button>
    </div>
  )
}
