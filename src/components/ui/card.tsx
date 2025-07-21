import * as React from 'react';
import { View, ViewProps } from 'react-native';

import { cn } from '~/lib/utils';
import { Text, TextProps } from './text';

const Card = React.forwardRef<React.ElementRef<typeof View>, ViewProps & { className?: string }>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn('rounded-lg border border-border bg-card p-4 web:shadow-sm', className)}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  React.ElementRef<typeof View>,
  ViewProps & { className?: string }
>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn('flex gap-1.5 pb-4', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  React.ElementRef<typeof Text>,
  TextProps & { className?: string }
>(({ className, ...props }, ref) => (
  <Text
    ref={ref}
    className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  React.ElementRef<typeof Text>,
  TextProps & { className?: string }
>(({ className, ...props }, ref) => (
  <Text
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  React.ElementRef<typeof View>,
  ViewProps & { className?: string }
>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn('pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  React.ElementRef<typeof View>,
  ViewProps & { className?: string }
>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn('flex flex-row items-center pt-4', className)} {...props} />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };