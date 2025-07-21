import * as React from 'react';
import { PlatformComponents } from '../utils/platform-adapter';

// Get platform-specific components
const { View, ActivityIndicator } = PlatformComponents;
import { Text } from './ui/text';

interface LoadingContentProps {
  message?: string;
  error?: Error | null;
  onRetry?: () => void;
}

export function LoadingContent({ 
  message = "Loading wallet data...",
  error = null,
  onRetry
}: LoadingContentProps) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      {error ? (
        <View className="items-center">
          <View className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <Text className="text-red-500 text-2xl">!</Text>
          </View>
          <Text className="text-lg font-medium text-red-600 mb-2">Error Loading Data</Text>
          <Text className="text-center text-muted-foreground mb-4">
            {error.message || "Failed to load token data"}
          </Text>
          {onRetry && (
            <View 
              className="bg-blue-500 px-4 py-2 rounded-lg"
              onClick={onRetry}
            >
              <Text className="text-white font-medium">Retry</Text>
            </View>
          )}
        </View>
      ) : (
        <>
          <ActivityIndicator size="large" color="#FF6B00" />
          <Text className="mt-4 text-center text-muted-foreground">
            {message}
          </Text>
          <View className="w-full max-w-xs mt-6">
            <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <View className="h-full bg-orange-500 rounded-full animate-pulse w-3/4" />
            </View>
          </View>
        </>
      )}
    </View>
  );
}