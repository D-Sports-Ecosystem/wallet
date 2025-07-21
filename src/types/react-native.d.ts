/**
 * Type declarations for React Native components
 * This file provides type definitions for React Native components
 * when they are not available in the build environment
 */

declare module 'react-native' {
  import * as React from 'react';

  // Basic component props
  export interface ViewProps extends React.HTMLAttributes<HTMLDivElement> {
    style?: any;
    pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';
    onLayout?: (event: { nativeEvent: { layout: { x: number; y: number; width: number; height: number } } }) => void;
  }

  export interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
    style?: any;
    numberOfLines?: number;
    ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
    selectable?: boolean;
    onPress?: () => void;
  }

  export interface PressableProps extends React.HTMLAttributes<HTMLButtonElement> {
    onPress?: () => void;
    disabled?: boolean;
    style?: any | ((state: { pressed: boolean; hovered?: boolean; focused?: boolean }) => any);
    hitSlop?: { top?: number; left?: number; bottom?: number; right?: number };
    android_ripple?: { color: string; borderless: boolean; radius: number };
  }

  export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    style?: any;
    placeholder?: string;
    placeholderTextColor?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad' | 'decimal-pad';
    secureTextEntry?: boolean;
    multiline?: boolean;
    numberOfLines?: number;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    autoCorrect?: boolean;
    autoFocus?: boolean;
    editable?: boolean;
    maxLength?: number;
    onBlur?: () => void;
    onFocus?: () => void;
    onSubmitEditing?: () => void;
    returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  }

  export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    source: { uri: string } | number;
    style?: any;
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
    onLoad?: () => void;
    onError?: () => void;
  }

  export interface ScrollViewProps extends ViewProps {
    horizontal?: boolean;
    showsHorizontalScrollIndicator?: boolean;
    showsVerticalScrollIndicator?: boolean;
    onScroll?: (event: { nativeEvent: { contentOffset: { x: number; y: number } } }) => void;
    scrollEventThrottle?: number;
    contentContainerStyle?: any;
  }

  export interface FlatListProps<T> extends ScrollViewProps {
    data: ReadonlyArray<T>;
    renderItem: ({ item, index }: { item: T; index: number }) => React.ReactElement | null;
    keyExtractor: (item: T, index: number) => string;
    ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
    ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
    ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
    ItemSeparatorComponent?: React.ComponentType<any> | null;
    onEndReached?: () => void;
    onEndReachedThreshold?: number;
    onRefresh?: () => void;
    refreshing?: boolean;
    numColumns?: number;
  }

  export interface ActivityIndicatorProps extends ViewProps {
    animating?: boolean;
    color?: string;
    size?: 'small' | 'large' | number;
  }

  // Component declarations
  export class View extends React.Component<ViewProps> {}
  export class Text extends React.Component<TextProps> {}
  export class Pressable extends React.Component<PressableProps> {}
  export class TextInput extends React.Component<TextInputProps> {}
  export class Image extends React.Component<ImageProps> {}
  export class ScrollView extends React.Component<ScrollViewProps> {}
  export class FlatList<T = any> extends React.Component<FlatListProps<T>> {}
  export class ActivityIndicator extends React.Component<ActivityIndicatorProps> {}
}

declare module 'react-native-reanimated' {
  import * as React from 'react';
  
  // Basic Animated components
  export const View: React.ComponentType<any>;
  export const Text: React.ComponentType<any>;
  export const Image: React.ComponentType<any>;
  export const ScrollView: React.ComponentType<any>;
  
  // Animation helpers
  export function useSharedValue<T>(initialValue: T): { value: T };
  export function useAnimatedStyle(updater: () => any): any;
  export function withTiming(toValue: number, config?: any): any;
  export function withSpring(toValue: number, config?: any): any;
  export function withDelay(delayMs: number, animation: any): any;
  export function withSequence(...animations: any[]): any;
  export function withRepeat(animation: any, numberOfReps?: number, reverse?: boolean): any;
  
  // Animation interface
  interface AnimationBuilder {
    duration(duration: number): AnimationBuilder;
    delay(delay: number): AnimationBuilder;
  }
  
  // Animations
  export const FadeIn: AnimationBuilder;
  export const FadeOut: AnimationBuilder;
  
  export const SlideInRight: {
    duration?: (duration: number) => any;
    delay?: (delay: number) => any;
  };
  
  export const SlideOutLeft: {
    duration?: (duration: number) => any;
    delay?: (delay: number) => any;
  };
  
  export default class Animated extends React.Component<any> {
    static View: React.ComponentType<any>;
    static Text: React.ComponentType<any>;
    static Image: React.ComponentType<any>;
    static ScrollView: React.ComponentType<any>;
  }
}