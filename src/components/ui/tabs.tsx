import * as React from 'react';
import { Pressable, View, ViewProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '~/lib/utils';

const Tabs = React.forwardRef<
  React.ElementRef<typeof View>,
  ViewProps & {
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
  }
>(({ value, onValueChange, className, ...props }, ref) => {
  return (
    <View ref={ref} className={cn('', className)} {...props} />
  );
});
Tabs.displayName = 'Tabs';

const TabsList = React.forwardRef<
  React.ElementRef<typeof View>,
  ViewProps & { className?: string }
>(({ className, ...props }, ref) => (
  <View
    ref={ref}
    className={cn(
      'bg-muted inline-flex h-10 items-center justify-center rounded-md p-1',
      className
    )}
    {...props}
  />
));
TabsList.displayName = 'TabsList';

const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-background data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  React.ComponentPropsWithoutRef<typeof Pressable> & {
    value: string;
    className?: string;
    variant?: VariantProps<typeof tabsTriggerVariants>['variant'];
  }
>(({ className, variant, value, ...props }, ref) => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs');
  }
  const { value: selectedValue, onValueChange } = context;
  const isSelected = selectedValue === value;

  return (
    <Pressable
      ref={ref}
      className={cn(
        tabsTriggerVariants({ variant }),
        isSelected ? 'bg-background shadow-sm' : 'bg-transparent',
        className
      )}
      onPress={() => onValueChange(value)}
      {...props}
    />
  );
});
TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = React.forwardRef<
  React.ElementRef<typeof View>,
  ViewProps & {
    value: string;
    className?: string;
  }
>(({ className, value, ...props }, ref) => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('TabsContent must be used within a Tabs');
  }
  const { value: selectedValue } = context;
  const isSelected = selectedValue === value;

  if (!isSelected) return null;

  return (
    <View
      ref={ref}
      className={cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      {...props}
    />
  );
});
TabsContent.displayName = 'TabsContent';

const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
} | null>(null);

export { Tabs, TabsList, TabsTrigger, TabsContent };