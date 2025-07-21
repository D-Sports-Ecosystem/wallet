"use client"

import React from "react"
import { useState } from "react"
import {
  ChevronDown,
  Copy,
  ExternalLink,
  Grid3X3,
  List,
  MoreHorizontal,
  Plus,
  Send,
  Download,
  Wallet,
  Settings,
  LogOut,
} from "lucide-react"


import { Button } from "./components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import { Badge } from "./components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar"

// Mock data
const wallets = [
  {
    id: 1,
    name: "Main Wallet",
    address: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    balance: "2.45 ETH",
    isActive: true,
  },
  {
    id: 2,
    name: "Trading Wallet",
    address: "0x8ba1f109551bD432803012645Hac189451b934",
    balance: "0.89 ETH",
    isActive: false,
  },
  {
    id: 3,
    name: "DeFi Wallet",
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    balance: "5.12 ETH",
    isActive: false,
  },
]

const chains = [
  { id: 1, name: "Ethereum", symbol: "ETH", icon: "/placeholder.svg?height=24&width=24", isActive: true },
  { id: 137, name: "Polygon", symbol: "MATIC", icon: "/placeholder.svg?height=24&width=24", isActive: false },
  { id: 56, name: "BSC", symbol: "BNB", icon: "/placeholder.svg?height=24&width=24", isActive: false },
  { id: 42161, name: "Arbitrum", symbol: "ARB", icon: "/placeholder.svg?height=24&width=24", isActive: false },
]

const tokens = [
  {
    symbol: "ETH",
    name: "Ethereum",
    balance: "2.45",
    value: "$4,890.00",
    change: "+2.4%",
    icon: "/placeholder.svg?height=32&width=32",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    balance: "1,250.00",
    value: "$1,250.00",
    change: "0.0%",
    icon: "/placeholder.svg?height=32&width=32",
  },
  {
    symbol: "UNI",
    name: "Uniswap",
    balance: "45.2",
    value: "$315.40",
    change: "+5.2%",
    icon: "/placeholder.svg?height=32&width=32",
  },
  {
    symbol: "LINK",
    name: "Chainlink",
    balance: "12.8",
    value: "$179.20",
    change: "-1.8%",
    icon: "/placeholder.svg?height=32&width=32",
  },
]

const nfts = [
  {
    id: 1,
    name: "Bored Ape #1234",
    collection: "Bored Ape Yacht Club",
    image: "/placeholder.svg?height=200&width=200",
    floor: "15.2 ETH",
  },
  {
    id: 2,
    name: "CryptoPunk #5678",
    collection: "CryptoPunks",
    image: "/placeholder.svg?height=200&width=200",
    floor: "45.8 ETH",
  },
  { id: 3, name: "Azuki #9012", collection: "Azuki", image: "/placeholder.svg?height=200&width=200", floor: "8.5 ETH" },
  {
    id: 4,
    name: "Doodle #3456",
    collection: "Doodles",
    image: "/placeholder.svg?height=200&width=200",
    floor: "3.2 ETH",
  },
]

export default function WalletDashboard() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("tokens")
  const [viewMode, setViewMode] = useState("grid")
  const [selectedWallet, setSelectedWallet] = useState(wallets[0])
  const [selectedChain, setSelectedChain] = useState(chains[0])

  const totalBalance = "$6,634.60"

  return (
    <div className="relative">
      {/* Wallet Trigger Button */}
      <Button
        variant="outline"
        className="flex items-center gap-2 px-4 py-2 bg-transparent"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <Wallet className="h-4 w-4" />
        <span className="hidden sm:inline">Wallet</span>
        <ChevronDown className="h-4 w-4" />
      </Button>

      {/* Wallet Dashboard */}
      {isOpen && (
        <Card
          className="absolute top-full right-0 mt-2 w-96 z-50 shadow-lg border"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>W</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-sm font-medium">{selectedWallet.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {selectedWallet.address.slice(0, 6)}...{selectedWallet.address.slice(-4)}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Address
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Explorer
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Balance */}
            <div className="text-center py-4">
              <div className="text-2xl font-bold">{totalBalance}</div>
              <div className="text-sm text-muted-foreground">Total Balance</div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button className="flex-1" size="sm">
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Receive
              </Button>
            </div>

            {/* Wallet & Chain Selectors */}
            <div className="flex gap-2 pt-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-1 justify-between bg-transparent" size="sm">
                    <span className="truncate">{selectedWallet.name}</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {wallets.map((wallet) => (
                    <DropdownMenuItem
                      key={wallet.id}
                      onClick={() => setSelectedWallet(wallet)}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium">{wallet.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                        </div>
                      </div>
                      <div className="text-sm">{wallet.balance}</div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Wallet
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="px-3 bg-transparent">
                    <img
                      src={selectedChain.icon || "/placeholder.svg"}
                      alt={selectedChain.name}
                      width={16}
                      height={16}
                      className="mr-2"
                    />
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {chains.map((chain) => (
                    <DropdownMenuItem
                      key={chain.id}
                      onClick={() => setSelectedChain(chain)}
                      className="flex items-center"
                    >
                      <img
                        src={chain.icon || "/placeholder.svg"}
                        alt={chain.name}
                        width={16}
                        height={16}
                        className="mr-2"
                      />
                      {chain.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tokens">Tokens</TabsTrigger>
                <TabsTrigger value="collectibles">Collectibles</TabsTrigger>
              </TabsList>

              <TabsContent value="tokens" className="mt-4 space-y-3">
                {tokens.map((token, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={token.icon || "/placeholder.svg"}
                        alt={token.symbol}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div>
                        <div className="font-medium">{token.symbol}</div>
                        <div className="text-sm text-muted-foreground">{token.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{token.balance}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        {token.value}
                        <Badge variant={token.change.startsWith("+") ? "default" : "destructive"} className="text-xs">
                          {token.change}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="collectibles" className="mt-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-medium">Your NFTs</div>
                  <div className="flex gap-1">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {viewMode === "grid" ? (
                  <div className="grid grid-cols-2 gap-3">
                    {nfts.map((nft) => (
                      <div key={nft.id} className="group cursor-pointer">
                        <div className="aspect-square rounded-lg overflow-hidden mb-2">
                          <img
                            src={nft.image || "/placeholder.svg"}
                            alt={nft.name}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="text-xs">
                          <div className="font-medium truncate">{nft.name}</div>
                          <div className="text-muted-foreground truncate">{nft.collection}</div>
                          <div className="text-muted-foreground">Floor: {nft.floor}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {nfts.map((nft) => (
                      <div
                        key={nft.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <img
                          src={nft.image || "/placeholder.svg"}
                          alt={nft.name}
                          width={40}
                          height={40}
                          className="rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{nft.name}</div>
                          <div className="text-sm text-muted-foreground truncate">{nft.collection}</div>
                        </div>
                        <div className="text-sm text-muted-foreground">{nft.floor}</div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
