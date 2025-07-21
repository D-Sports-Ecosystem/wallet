import * as React from 'react';
import { cn } from '../../lib/utils';
import { isReactNative } from '../../utils/platform-detection';

// Platform-specific imports
let View: any, ViewProps: any, Text: any, TextProps: any;

if (isReactNative()) {
  const RN = require('react-native');
  View = RN.View;
  ViewProps = {};
  const TextComponent = require('./text');
  Text = TextComponent.Text;
  TextProps = TextComponent.TextProps || {};
} else {
  // Web/Next.js fallback - use div elements
  View = 'div';
  ViewProps = {};
  const TextComponent = require('./text');
  Text = TextComponent.Text || 'span';
  TextProps = {};
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    if (isReactNative()) {
      return (
        <View
          ref={ref}
          className={cn('rounded-lg border border-border bg-card p-4', className)}
          {...props}
        />
      );
    }
    
    return (
      <div
        ref={ref}
        className={cn('rounded-lg border border-border bg-card p-4 shadow-sm', className)}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    if (isReactNative()) {
      return <View ref={ref} className={cn('flex gap-1.5 pb-4', className)} {...props} />;
    }
    
    return (
      <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
    );
  }
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement> & { className?: string }>(
  ({ className, ...props }, ref) => {
    if (isReactNative()) {
      return (
        <Text
          ref={ref}
          className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
          {...props}
        />
      );
    }
    
    return (
      <h3
        ref={ref}
        className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
        {...props}
      />
    );
  }
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement> & { className?: string }>(
  ({ className, ...props }, ref) => {
    if (isReactNative()) {
      return (
        <Text
          ref={ref}
          className={cn('text-sm text-muted-foreground', className)}
          {...props}
        />
      );
    }
    
    return (
      <p
        ref={ref}
        className={cn('text-sm text-muted-foreground', className)}
        {...props}
      />
    );
  }
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    if (isReactNative()) {
      return <View ref={ref} className={cn('pt-0', className)} {...props} />;
    }
    
    return <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />;
  }
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    if (isReactNative()) {
      return <View ref={ref} className={cn('flex flex-row items-center pt-4', className)} {...props} />;
    }
    
    return (
      <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
    );
  }
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };