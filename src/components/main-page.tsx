import { View, Pressable, ScrollView } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Text } from "./ui/text";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

interface MainPageProps {
  isContentReady: boolean;
  isPageTransitioning: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tokens: any[];
  expandedToken: string | null;
  hoveredToken: string | null;
  setHoveredToken: (token: string | null) => void;
  toggleTokenExpansion: (token: string) => void;
  handleSend: () => void;
  handleReceive: () => void;
  sendButtonPressed: boolean;
  receiveButtonPressed: boolean;
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
}: MainPageProps) {
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
            Total Balance: $2,345.67
          </Text>
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
          {tokens.map((token) => (
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
                      ${parseFloat(token.balance) * 25000}
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
                    <Text className="text-sm text-green-500">+2.4%</Text>
                  </View>
                </View>
              </Pressable>

              {expandedToken === token.symbol && (
                <CardContent className="border-t border-border pt-4">
                  <View className="mb-4">
                    <Text className="text-sm font-medium mb-2">
                      Recent Transactions
                    </Text>
                    {token.transactions.map((tx: any, i: number) => (
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
                    ))}
                  </View>
                </CardContent>
              )}
            </Card>
          ))}
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
