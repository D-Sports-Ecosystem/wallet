import * as React from 'react';
import { View, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { FadeIn, FadeOut } from '../utils/animation-utils';
import { Text } from './ui/text';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { TokenInfo } from '../services/token-service';
import { LoadingContent } from './loading-content';

interface ReceivePageProps {
  isPageTransitioning: boolean;
  selectedReceiveToken: TokenInfo | null;
  copyAddress: () => void;
  copiedAddress: boolean;
  isLoading?: boolean;
  error?: Error | null;
}

export function ReceivePage({
  isPageTransitioning,
  selectedReceiveToken,
  copyAddress,
  copiedAddress,
  isLoading = false,
  error = null
}: ReceivePageProps) {
  if (isLoading) {
    return (
      <Animated.View
        entering={FadeIn.duration(300).delay(150)}
        exiting={isPageTransitioning ? FadeOut.duration(200) : undefined}
        className="flex-1"
      >
        <LoadingContent message="Loading token information..." />
      </Animated.View>
    );
  }

  if (error) {
    return (
      <Animated.View
        entering={FadeIn.duration(300).delay(150)}
        exiting={isPageTransitioning ? FadeOut.duration(200) : undefined}
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
      </Animated.View>
    );
  }

  if (!selectedReceiveToken) {
    return (
      <Animated.View
        entering={FadeIn.duration(300).delay(150)}
        exiting={isPageTransitioning ? FadeOut.duration(200) : undefined}
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
      </Animated.View>
    );
  }

  // In a real app, this would be a QR code component
  const QRCodePlaceholder = () => (
    <View className="w-64 h-64 bg-muted border border-border rounded-lg items-center justify-center mb-6">
      <Text className="text-muted-foreground">QR Code Placeholder</Text>
      <Text className="text-xs text-muted-foreground mt-2">
        (In a real app, this would be a QR code)
      </Text>
    </View>
  );

  return (
    <Animated.View
      entering={FadeIn.duration(300).delay(150)}
      exiting={isPageTransitioning ? FadeOut.duration(200) : undefined}
      className="flex-1"
    >
      <View className="p-6 items-center">
        <View className="mb-6 items-center">
          <Text className="text-2xl font-bold text-foreground mb-2">
            Receive {selectedReceiveToken.symbol}
          </Text>
          <Text className="text-muted-foreground text-center">
            Scan the QR code or copy the address below to receive {selectedReceiveToken.name}
          </Text>
        </View>

        <Card className="w-full mb-6">
          <CardContent className="p-4 items-center">
            <View className="flex-row items-center mb-4">
              <Avatar className={`mr-3 ${selectedReceiveToken.bgColor}`}>
                <AvatarFallback>
                  <Text className="text-white text-lg font-bold">{selectedReceiveToken.icon}</Text>
                </AvatarFallback>
              </Avatar>
              <View>
                <Text className="font-medium">{selectedReceiveToken.name}</Text>
                <Badge variant="outline" className="bg-muted/50 mt-1">
                  <Text className="text-xs">{selectedReceiveToken.network}</Text>
                </Badge>
              </View>
            </View>
            
            {selectedReceiveToken.price && (
              <View className="w-full bg-muted/30 p-2 rounded-md">
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted-foreground">Current Price:</Text>
                  <Text className="text-sm font-medium">${selectedReceiveToken.price.toFixed(2)}</Text>
                </View>
                <View className="flex-row justify-between mt-1">
                  <Text className="text-sm text-muted-foreground">24h Change:</Text>
                  <Text 
                    className={`text-sm font-medium ${
                      selectedReceiveToken.percentChange24h >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {selectedReceiveToken.percentChange24h >= 0 ? '+' : ''}
                    {selectedReceiveToken.percentChange24h?.toFixed(2) || '0.00'}%
                  </Text>
                </View>
              </View>
            )}
          </CardContent>
        </Card>

        <QRCodePlaceholder />

        <View className="w-full mb-6">
          <Text className="text-sm font-medium mb-2">Your {selectedReceiveToken.symbol} Address</Text>
          <Pressable
            onPress={copyAddress}
            className="p-4 border border-input rounded-md bg-background flex-row items-center justify-between"
          >
            <Text className="text-sm flex-1" numberOfLines={1} ellipsizeMode="middle">
              {selectedReceiveToken.address}
            </Text>
            <Button variant="secondary" size="sm" onPress={copyAddress} className="ml-2">
              <Text>{copiedAddress ? 'Copied!' : 'Copy'}</Text>
            </Button>
          </Pressable>
        </View>

        <View className="w-full">
          <Text className="text-sm text-muted-foreground text-center mb-2">
            Only send {selectedReceiveToken.symbol} to this address on the {selectedReceiveToken.network} network
          </Text>
          <Text className="text-xs text-destructive text-center">
            Sending any other assets may result in permanent loss
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}