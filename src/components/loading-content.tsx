import * as React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from './ui/text';

export function LoadingContent() {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <ActivityIndicator size="large" color="#FF6B00" />
      <Text className="mt-4 text-center text-muted-foreground">
        Loading wallet data...
      </Text>
    </View>
  );
}