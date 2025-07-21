import { View, Pressable, ScrollView } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Text } from "./ui/text";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { TokenInfo } from "../services/token-service";
import { TokenUpdateStatus } from "./token-update-status";

interface MainPageProps {
  isContentReady: boolean;
  isPageTransitioning: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tokens: TokenInfo[];
  expandedToken: string | null;
  hoveredToken: string | null;
  setHoveredToken: (token: string | null) => void;
  toggleTokenExpansion: (token: string) => void;
  handleSend: () => void;
  handleReceive: () => void;
  sendButtonPressed: boolean;
  receiveButtonPressed: boolean;
  isRefreshing?: boolean;
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
  isRefreshing = false,
}: MainPageProps) {
  // Calculate total portfolio value
  const totalBalance = tokens.reduce((sum, token) => {
    return sum + (parseFloat(token.balance) * (token.price || 0));
  }, 0);

  return (
    <Animated.View
      entering={isContentReady ? FadeIn.duration(300).delay(150) : undefined}
      exiting={isPageTransitioning ? FadeOut.duration(200) : undefined}
      className="flex-1"
    >
      <View className="p-6">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground">
            Your Portfolio
          </Text>
          <Text className="text-muted-foreground">
            Total Balance: ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <TokenUpdateStatus 
            showLastUpdated={true}
            showRefreshButton={false}
            className="mt-1"
          />
          {isRefreshing && (
            <Text className="text-xs text-blue-500 mt-1">
              Refreshing token data...
            </Text>
          )}
        </View>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="flex-row w-full">
            <TabsTrigger value="tokens" className="flex-1">
              <Text
                className={
                  activeTab === "tokens"
                    ? "text-foreground"
                    : "text-muted-foreground"
                }
              >
                Tokens
              </Text>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex-1">
              <Text
                className={
                  activeTab === "activity"
                    ? "text-foreground"
                    : "text-muted-foreground"
                }
              >
                Activity
              </Text>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <ScrollView className="flex-1">
          {tokens.length === 0 ? (
            <View className="py-8 px-4 text-center">
              <Text className="text-muted-foreground">No tokens found</Text>
            </View>
          ) : (
            tokens.map((token) => (
              <Card
                key={`${token.symbol}-${token.network}`}
                id={`token-${token.symbol}`}
                className={`mb-4 overflow-hidden transition-all duration-300 ${
                  expandedToken === token.symbol ? "bg-card/80" : "bg-card"
                }`}
              >
                <Pressable
                  onPress={() => toggleTokenExpansion(token.symbol)}
                  className="flex-row items-center p-4"
                >
                  <Avatar className={`mr-3 ${token.bgColor}`}>
                    <AvatarFallback>
                      <Text className="text-white text-lg font-bold">
                        {token.icon}
                      </Text>
                    </AvatarFallback>
                  </Avatar>
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between">
                      <Text className="font-medium">{token.name}</Text>
                      <Text className="font-bold">
                        ${(parseFloat(token.balance) * (token.price || 0)).toFixed(2)}
                      </Text>
                    </View>
                    <View className="flex-row items-center justify-between mt-1">
                      <View className="flex-row items-center">
                        <Text className="text-sm text-muted-foreground mr-2">
                          {token.balance} {token.symbol}
                        </Text>
                        <Badge variant="outline" className="bg-muted/50">
                          <Text className="text-xs">{token.network}</Text>
                        </Badge>
                      </View>
                      <Text 
                        className={`text-sm ${token.percentChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}
                      >
                        {token.percentChange24h >= 0 ? '+' : ''}{token.percentChange24h?.toFixed(2) || '0.00'}%
                      </Text>
                    </View>
                  </View>
                </Pressable>

                {expandedToken === token.symbol && (
                  <CardContent className="border-t border-border pt-4">
                    <View className="mb-4">
                      <View className="flex-row justify-between items-center mb-2">
                        <Text className="text-sm font-medium">Token Details</Text>
                        <Text className="text-xs text-muted-foreground">
                          Price: ${token.price?.toFixed(2) || '0.00'}
                        </Text>
                      </View>
                      
                      <Text className="text-sm font-medium mt-4 mb-2">
                        Recent Transactions
                      </Text>
                      {token.transactions && token.transactions.length > 0 ? (
                        token.transactions.map((tx, i) => (
                          <View
                            key={i}
                            className="flex-row items-center justify-between py-2 border-b border-border/50 last:border-0"
                          >
                            <View className="flex-row items-center">
                              <View
                                className={`w-2 h-2 rounded-full mr-2 ${
                                  tx.type === "receive"
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }`}
                              />
                              <Text>
                                {tx.type === "receive" ? "Received" : "Sent"}
                              </Text>
                            </View>
                            <View className="items-end">
                              <Text
                                className={
                                  tx.type === "receive"
                                    ? "text-green-500"
                                    : "text-red-500"
                                }
                              >
                                {tx.amount}
                              </Text>
                              <Text className="text-xs text-muted-foreground">
                                {tx.time}
                              </Text>
                            </View>
                          </View>
                        ))
                      ) : (
                        <Text className="text-sm text-muted-foreground py-2">
                          No recent transactions
                        </Text>
                      )}
                    </View>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </ScrollView>

        <View className="flex-row mt-6 gap-4">
          <Button
            className={`flex-1 ${sendButtonPressed ? "opacity-80 scale-95" : ""}`}
            onPress={handleSend}
          >
            <Text className="text-primary-foreground font-medium">Send</Text>
          </Button>
          <Button
            className={`flex-1 bg-secondary ${receiveButtonPressed ? "opacity-80 scale-95" : ""}`}
            onPress={handleReceive}
          >
            <Text className="text-secondary-foreground font-medium">
              Receive
            </Text>
          </Button>
        </View>
      </View>
    </Animated.View>
  );
}