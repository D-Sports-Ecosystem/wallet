import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { isReactNative } from '../../utils/platform-detection';
import { getPlatformComponents } from '../../utils/component-factory';

const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
} | null>(null);

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ value, onValueChange, className, children, ...props }, ref) => {
    const { View } = getPlatformComponents();
    
    return (
      <TabsContext.Provider value={{ value, onValueChange }}>
        {isReactNative() ? (
          <View ref={ref} className={cn('', className)} {...props}>
            {children}
          </View>
        ) : (
          <div ref={ref} className={cn('', className)} {...props}>
            {children}
          </div>
        )}
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = 'Tabs';

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { className?: string }>(
  ({ className, ...props }, ref) => {
    const { View } = getPlatformComponents();
    
    if (isReactNative()) {
      return (
        <View
          ref={ref}
          className={cn(
            'bg-muted inline-flex h-10 items-center justify-center rounded-md p-1',
            className
          )}
          {...props}
        />
      );
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
          className
        )}
        {...props}
      />
    );
  }
);
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

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  className?: string;
  variant?: VariantProps<typeof tabsTriggerVariants>['variant'];
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, variant, value, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    if (!context) {
      throw new Error('TabsTrigger must be used within a Tabs');
    }
    const { value: selectedValue, onValueChange } = context;
    const isSelected = selectedValue === value;
    const { Pressable } = getPlatformComponents();

    if (isReactNative()) {
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
    }

    return (
      <button
        ref={ref}
        className={cn(
          tabsTriggerVariants({ variant }),
          isSelected ? 'bg-background text-foreground shadow-sm' : '',
          className
        )}
        onClick={() => onValueChange(value)}
        data-state={isSelected ? 'active' : 'inactive'}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = 'TabsTrigger';

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  className?: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    if (!context) {
      throw new Error('TabsContent must be used within a Tabs');
    }
    const { value: selectedValue } = context;
    const isSelected = selectedValue === value;
    const { View } = getPlatformComponents();

    if (!isSelected) return null;

    if (isReactNative()) {
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
    }

    return (
      <div
        ref={ref}
        className={cn(
          'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
        {...props}
      />
    );
  }
);
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };