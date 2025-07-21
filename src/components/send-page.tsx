import * as React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Text } from './ui/text';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card } from './ui/card';

interface SendPageProps {
  isPageTransitioning: boolean;
  selectedToken: any;
  setSelectedToken: (token: any) => void;
  tokens: any[];
  sendAmount: string;
  setSendAmount: (amount: string) => void;
  recipientAddress: string;
  setRecipientAddress: (address: string) => void;
  memo: string;
  setMemo: (memo: string) => void;
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
  const [showTokenSelect, setShowTokenSelect] = React.useState(false);

  const handleTokenSelect = (token: any) => {
    setSelectedToken(token);
    setShowTokenSelect(false);
  };

  const handleSendAmountChange = (text: string) => {
    // Only allow numeric input with a single decimal point
    if (text === '' || /^\d*\.?\d*$/.test(text)) {
      setSendAmount(text);
    }
  };

  const maxAmount = parseFloat(selectedToken.balance);
  const usdValue = sendAmount ? parseFloat(sendAmount) * 25000 : 0;

  return (
    <Animated.View
      entering={FadeIn.duration(300).delay(150)}
      exiting={isPageTransitioning ? FadeOut.duration(200) : undefined}
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
            onChangeText={setRecipientAddress}
          />
        </View>

        {/* Memo (optional) */}
        <View className="mb-8">
          <Text className="text-sm font-medium mb-2">Memo (optional)</Text>
          <Input
            placeholder="Add a note to this transaction"
            value={memo}
            onChangeText={setMemo}
          />
        </View>

        {/* Send Button */}
        <Button
          disabled={!sendAmount || !recipientAddress || parseFloat(sendAmount) <= 0 || parseFloat(sendAmount) > maxAmount}
          className="mb-4"
        >
          <Text className="text-primary-foreground font-medium">
            Send {sendAmount ? `${sendAmount} ${selectedToken.symbol}` : selectedToken.symbol}
          </Text>
        </Button>
      </ScrollView>
    </Animated.View>
  );
}