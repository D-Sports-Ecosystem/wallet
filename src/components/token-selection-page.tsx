import * as React from 'react';
import { View, FlatList, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { FadeIn, FadeOut } from '../utils/animation-utils';
import { Text } from './ui/text';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { TokenInfo } from '../services/token-service';

interface TokenSelectionPageProps {
  isPageTransitioning: boolean;
  isContentReady: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  availableTokens: TokenInfo[];
  handleTokenSelect: (token: TokenInfo) => void;
  isLoading?: boolean;
  error?: Error | null;
}

export function TokenSelectionPage({
  isPageTransitioning,
  isContentReady,
  searchQuery,
  setSearchQuery,
  availableTokens,
  handleTokenSelect,
  isLoading = false,
  error = null
}: TokenSelectionPageProps) {
  const filteredTokens = React.useMemo(() => {
    if (!searchQuery) return availableTokens;
    const query = searchQuery.toLowerCase();
    return availableTokens.filter(
      (token) =>
        token.name.toLowerCase().includes(query) ||
        token.symbol.toLowerCase().includes(query) ||
        token.network.toLowerCase().includes(query)
    );
  }, [availableTokens, searchQuery]);

  return (
    <Animated.View
      entering={isContentReady ? FadeIn.duration(300).delay(150) : undefined}
      exiting={isPageTransitioning ? FadeOut.duration(200)!: undefined}
      className="flex-1"
    >
      <View className="p-6">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground mb-2">Select Token</Text>
          <Text className="text-muted-foreground">
            Choose a token to receive funds
          </Text>
        </View>

        <Input
          placeholder="Search tokens..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="mb-6"
        />

        {isLoading ? (
          <View className="items-center justify-center p-8">
            <View className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin mb-4" />
            <Text className="text-muted-foreground">Loading tokens...</Text>
          </View>
        ) : error ? (
          <View className="items-center justify-center p-8 bg-red-50 rounded-lg">
            <Text className="text-red-600 font-medium mb-2">Error loading tokens</Text>
            <Text className="text-muted-foreground text-center mb-4">
              {error.message || "Failed to load token data"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredTokens}
            keyExtractor={(item) => `${item.symbol}-${item.network}`}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleTokenSelect(item)}
                className="flex-row items-center p-4 border-b border-border"
              >
                <Avatar className={`mr-3 ${item.bgColor}`}>
                  <AvatarFallback>
                    <Text className="text-white text-lg font-bold">{item.icon}</Text>
                  </AvatarFallback>
                </Avatar>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-medium">{item.name}</Text>
                    <Text className="font-bold">{item.balance} {item.symbol}</Text>
                  </View>
                  <View className="flex-row items-center justify-between mt-1">
                    <Badge variant="outline" className="bg-muted/50">
                      <Text className="text-xs">{item.network}</Text>
                    </Badge>
                    <Text className="text-sm text-muted-foreground">
                      ${(parseFloat(item.balance) * (item.price || 0)).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </Pressable>
            )}
            ListEmptyComponent={
              <View className="items-center justify-center p-8">
                <Text className="text-muted-foreground text-center">
                  No tokens found matching "{searchQuery}"
                </Text>
              </View>
            }
          />
        )}
      </View>
    </Animated.View>
  );
}