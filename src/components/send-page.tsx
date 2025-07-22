import * as React from 'react';
import { PlatformComponents } from '../utils/platform-adapter';
import { AnimatedWrapper } from './AnimatedWrapper';
import { useAnimations } from '../hooks/useAnimations';

// Get platform-specific components
const { View, ScrollView, Pressable } = PlatformComponents;
import { Text } from './ui/text';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { TokenInfo } from '../services/token-service';
import { LoadingContent } from './loading-content';

interface SendPageProps {
  isPageTransitioning: boolean;
  selectedToken: TokenInfo | null;
  setSelectedToken: (token: TokenInfo) => void;
  tokens: TokenInfo[];
  sendAmount: string;
  setSendAmount: (amount: string) => void;
  recipientAddress: string;
  setRecipientAddress: (address: string) => void;
  memo: string;
  setMemo: (memo: string) => void;
  isLoading?: boolean;
  error?: Error | null;
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
  isLoading = false,
  error = null
}: SendPageProps) {
  const { animations } = useAnimations();
  const [showTokenSelect, setShowTokenSelect] = React.useState(false);
  const [estimatedGas, setEstimatedGas] = React.useState("0.0005");
  const [isEstimatingGas, setIsEstimatingGas] = React.useState(false);

  const handleTokenSelect = (token: TokenInfo) => {
    setSelectedToken(token);
    setShowTokenSelect(false);
    // Reset amount when token changes
    setSendAmount("");
    // Simulate gas estimation
    estimateGas();
  };

  const handleSendAmountChange = (text: string) => {
    // Only allow numeric input with a single decimal point
    if (text === '' || /^\d*\.?\d*$/.test(text)) {
      setSendAmount(text);
      // Simulate gas estimation when amount changes
      estimateGas();
    }
  };

  const estimateGas = () => {
    // Simulate gas estimation with a delay
    setIsEstimatingGas(true);
    setTimeout(() => {
      // Generate a random gas estimate between 0.0001 and 0.001
      const randomGas = (Math.random() * 0.0009 + 0.0001).toFixed(6);
      setEstimatedGas(randomGas);
      setIsEstimatingGas(false);
    }, 500);
  };

  // Handle recipient address change
  const handleAddressChange = (text: string) => {
    setRecipientAddress(text);
    if (text.length > 10) {
      // Simulate gas estimation when address is valid
      estimateGas();
    }
  };

  if (isLoading) {
    return (
      <AnimatedWrapper
        animation={animations.FadeIn.duration(300).delay(150)}
        className="flex-1"
      >
        <LoadingContent message="Loading token information..." />
      </AnimatedWrapper>
    );
  }

  if (error) {
    return (
      <AnimatedWrapper
        animation={animations.FadeIn.duration(300).delay(150)}
        className="flex-1"
      >
        <View className="p-6 items-center">
          <View className="w-full bg-red-50 p-4 rounded-lg mb-6">
            <Text className="text-red-600 font-medium mb-2">Error Loading Token</Text>
            <Text className="text-muted-foreground">
              {error.message || "Failed to load token information"}
            </Text>
          </View>
          <Button variant="secondary" onPress={() => window.history.back()}>
            <Text>Go Back</Text>
          </Button>
        </View>
      </AnimatedWrapper>
    );
  }

  if (!selectedToken) {
    return (
      <AnimatedWrapper
        animation={animations.FadeIn.duration(300).delay(150)}
        className="flex-1"
      >
        <View className="p-6 items-center">
          <Text className="text-lg font-medium text-muted-foreground mb-4">
            No token selected
          </Text>
          <Button variant="secondary" onPress={() => window.history.back()}>
            <Text>Go Back</Text>
          </Button>
        </View>
      </AnimatedWrapper>
    );
  }

  const maxAmount = parseFloat(selectedToken.balance);
  const usdValue = sendAmount ? parseFloat(sendAmount) * (selectedToken.price || 0) : 0;
  const totalWithGas = parseFloat(sendAmount || "0") + parseFloat(estimatedGas);
  const hasEnoughBalance = maxAmount >= totalWithGas;

  return (
    <AnimatedWrapper
      animation={animations.FadeIn.duration(300).delay(150)}
      className="flex-1"
    >
      <ScrollView className="flex-1 p-6">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground mb-2">Send {selectedToken.symbol}</Text>
          <Text className="text-muted-foreground">
            Send {selectedToken.name} to another wallet
          </Text>
        </View>

        {/* Token Selection */}
        <View className="mb-6">
          <Text className="text-sm font-medium mb-2">Token</Text>
          <Pressable onPress={() => setShowTokenSelect(!showTokenSelect)}>
            <View className="flex-row items-center p-4 border border-input rounded-md bg-background">
              <Avatar className={`mr-3 ${selectedToken.bgColor}`}>
                <AvatarFallback>
                  <Text className="text-white text-lg font-bold">{selectedToken.icon}</Text>
                </AvatarFallback>
              </Avatar>
              <View className="flex-1">
                <Text className="font-medium">{selectedToken.name}</Text>
                <View className="flex-row items-center">
                  <Text className="text-sm text-muted-foreground mr-2">
                    Balance: {selectedToken.balance} {selectedToken.symbol}
                  </Text>
                  <Badge variant="outline" className="bg-muted/50">
                    <Text className="text-xs">{selectedToken.network}</Text>
                  </Badge>
                </View>
              </View>
              <View>
                <Text className="text-sm font-medium">${selectedToken.price?.toFixed(2) || '0.00'}</Text>
                <Text 
                  className={`text-xs text-right ${
                    selectedToken.percentChange24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {selectedToken.percentChange24h >= 0 ? '+' : ''}
                  {selectedToken.percentChange24h?.toFixed(2) || '0.00'}%
                </Text>
              </View>
            </View>
          </Pressable>

          {showTokenSelect && (
            <Card className="mt-2 p-2 max-h-60">
              <ScrollView>
                {tokens.map((token) => (
                  <Pressable
                    key={`${token.symbol}-${token.network}`}
                    onPress={() => handleTokenSelect(token)}
                    className="flex-row items-center p-3 border-b border-border last:border-0"
                  >
                    <Avatar className={`mr-3 ${token.bgColor}`}>
                      <AvatarFallback>
                        <Text className="text-white text-lg font-bold">{token.icon}</Text>
                      </AvatarFallback>
                    </Avatar>
                    <View className="flex-1">
                      <Text className="font-medium">{token.name}</Text>
                      <View className="flex-row items-center">
                        <Text className="text-sm text-muted-foreground mr-2">
                          {token.balance} {token.symbol}
                        </Text>
                        <Badge variant="outline" className="bg-muted/50">
                          <Text className="text-xs">{token.network}</Text>
                        </Badge>
                      </View>
                    </View>
                    <View>
                      <Text className="text-sm font-medium">${token.price?.toFixed(2) || '0.00'}</Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </Card>
          )}
        </View>

        {/* Amount */}
        <View className="mb-6">
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm font-medium">Amount</Text>
            <Pressable onPress={() => setSendAmount(maxAmount.toString())}>
              <Text className="text-sm text-primary">Max</Text>
            </Pressable>
          </View>
          <Input
            placeholder={`0 ${selectedToken.symbol}`}
            value={sendAmount}
            onChangeText={handleSendAmountChange}
            keyboardType="decimal-pad"
            className="mb-1"
          />
          <View className="flex-row justify-between">
            <Text className="text-sm text-muted-foreground">
              Available: {selectedToken.balance} {selectedToken.symbol}
            </Text>
            <Text className="text-sm text-muted-foreground">
              ≈ ${usdValue.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Recipient */}
        <View className="mb-6">
          <Text className="text-sm font-medium mb-2">Recipient Address</Text>
          <Input
            placeholder={`Enter ${selectedToken.symbol} address`}
            value={recipientAddress}
            onChangeText={handleAddressChange}
          />
        </View>

        {/* Memo (optional) */}
        <View className="mb-6">
          <Text className="text-sm font-medium mb-2">Memo (optional)</Text>
          <Input
            placeholder="Add a note to this transaction"
            value={memo}
            onChangeText={setMemo}
          />
        </View>

        {/* Transaction Fee */}
        <View className="mb-8 p-4 bg-muted/30 rounded-lg">
          <Text className="text-sm font-medium mb-2">Transaction Fee</Text>
          {isEstimatingGas ? (
            <View className="flex-row items-center">
              <View className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mr-2" />
              <Text className="text-sm text-muted-foreground">Estimating gas fee...</Text>
            </View>
          ) : (
            <>
              <View className="flex-row justify-between mb-1">
                <Text className="text-sm text-muted-foreground">Network Fee:</Text>
                <Text className="text-sm">{estimatedGas} {selectedToken.symbol}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted-foreground">Total Amount:</Text>
                <Text className="text-sm font-medium">
                  {totalWithGas.toFixed(6)} {selectedToken.symbol}
                </Text>
              </View>
              {!hasEnoughBalance && sendAmount && (
                <View className="mt-2 p-2 bg-red-50 rounded-md">
                  <Text className="text-xs text-red-600">
                    Insufficient balance for transaction fee
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* Send Button */}
        <Button
          disabled={
            !sendAmount || 
            !recipientAddress || 
            parseFloat(sendAmount) <= 0 || 
            !hasEnoughBalance ||
            isEstimatingGas
          }
          className="mb-4"
        >
          <Text className="text-primary-foreground font-medium">
            Send {sendAmount ? `${sendAmount} ${selectedToken.symbol}` : selectedToken.symbol}
          </Text>
        </Button>
      </ScrollView>
    </AnimatedWrapper>
  );
}