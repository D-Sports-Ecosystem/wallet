/**
 * @file tabs.tsx
 * @description A cross-platform tabbed interface component
 * @module components/ui
 * @author D-Sports Engineering Team
 * @version 1.0.0
 * @since 2024-07-23
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { isReactNative } from '../../utils/platform-detection';
import { getPlatformComponents } from '../../utils/component-factory';

/**
 * Context for sharing tab state between components
 * 
 * @type {React.Context<{value: string; onValueChange: (value: string) => void} | null>}
 */
const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
} | null>(null);

/**
 * Props for the Tabs component
 * 
 * @interface TabsProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 * @property {string} value - Currently selected tab value
 * @property {function} onValueChange - Callback when tab selection changes
 * @property {string} [className] - Additional CSS classes
 */
interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

/**
 * Tabs component for creating a tabbed interface
 * 
 * @component
 * @param {TabsProps} props - Component props
 * @param {string} props.value - Currently selected tab value
 * @param {function} props.onValueChange - Callback when tab selection changes
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Tab components (TabsList, TabsContent)
 * @param {React.Ref<HTMLDivElement>} ref - Reference to the tabs container
 * @returns {JSX.Element} - Rendered Tabs component
 * 
 * @example
 * ```tsx
 * const [activeTab, setActiveTab] = React.useState('account');
 * 
 * <Tabs value={activeTab} onValueChange={setActiveTab}>
 *   <TabsList>
 *     <TabsTrigger value="account">Account</TabsTrigger>
 *     <TabsTrigger value="password">Password</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="account">Account settings...</TabsContent>
 *   <TabsContent value="password">Password settings...</TabsContent>
 * </Tabs>
 * ```
 */
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

/**
 * TabsList component for containing tab triggers
 * 
 * @component
 * @param {React.HTMLAttributes<HTMLDivElement> & { className?: string }} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - TabsTrigger components
 * @param {React.Ref<HTMLDivElement>} ref - Reference to the tabs list container
 * @returns {JSX.Element} - Rendered TabsList component
 * 
 * @example
 * ```tsx
 * <TabsList>
 *   <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 *   <TabsTrigger value="tab2">Tab 2</TabsTrigger>
 * </TabsList>
 * 
 * // With custom styling
 * <TabsList className="grid grid-cols-2">
 *   <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 *   <TabsTrigger value="tab2">Tab 2</TabsTrigger>
 * </TabsList>
 * ```
 */
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

/**
 * Style variants for the TabsTrigger component
 * 
 * @type {import('class-variance-authority').VariantProps}
 * @property {Object} variants - Style variants for the tabs trigger
 * @property {Object} variants.variant - Visual style variants
 * @property {string} variants.variant.default - Default trigger style
 */
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

/**
 * Props for the TabsTrigger component
 * 
 * @interface TabsTriggerProps
 * @extends {React.ButtonHTMLAttributes<HTMLButtonElement>}
 * @property {string} value - Value of the tab this trigger activates
 * @property {string} [className] - Additional CSS classes
 * @property {VariantProps<typeof tabsTriggerVariants>['variant']} [variant] - Visual style variant
 */
interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  className?: string;
  variant?: VariantProps<typeof tabsTriggerVariants>['variant'];
}

/**
 * TabsTrigger component for tab selection buttons
 * 
 * @component
 * @param {TabsTriggerProps} props - Component props
 * @param {string} props.value - Value of the tab this trigger activates
 * @param {string} [props.className] - Additional CSS classes
 * @param {VariantProps<typeof tabsTriggerVariants>['variant']} [props.variant] - Visual style variant
 * @param {React.ReactNode} props.children - Content to display in the trigger
 * @param {React.Ref<HTMLButtonElement>} ref - Reference to the trigger button
 * @returns {JSX.Element} - Rendered TabsTrigger component
 * @throws {Error} When used outside of a Tabs component
 * 
 * @example
 * ```tsx
 * <TabsList>
 *   <TabsTrigger value="account">Account</TabsTrigger>
 *   <TabsTrigger value="password">Password</TabsTrigger>
 * </TabsList>
 * 
 * // With custom styling
 * <TabsTrigger value="settings" className="flex items-center gap-2">
 *   <SettingsIcon />
 *   Settings
 * </TabsTrigger>
 * 
 * // Disabled trigger
 * <TabsTrigger value="admin" disabled>
 *   Admin
 * </TabsTrigger>
 * ```
 */
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

/**
 * Props for the TabsContent component
 * 
 * @interface TabsContentProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 * @property {string} value - Value of the tab that shows this content
 * @property {string} [className] - Additional CSS classes
 */
interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  className?: string;
}

/**
 * TabsContent component for tab panel content
 * 
 * @component
 * @param {TabsContentProps} props - Component props
 * @param {string} props.value - Value of the tab that shows this content
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Content to display when tab is active
 * @param {React.Ref<HTMLDivElement>} ref - Reference to the content container
 * @returns {JSX.Element|null} - Rendered TabsContent component or null if not active
 * @throws {Error} When used outside of a Tabs component
 * 
 * @example
 * ```tsx
 * <TabsContent value="account">
 *   <h2>Account Settings</h2>
 *   <p>Manage your account preferences here.</p>
 *   <AccountForm />
 * </TabsContent>
 * 
 * // With custom styling
 * <TabsContent value="password" className="space-y-4">
 *   <h2>Change Password</h2>
 *   <PasswordForm />
 * </TabsContent>
 * ```
 */
const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    if (!context) {
      throw new Error('TabsContent must be used within a Tabs');
    }
    const { value: selectedValue } = context;
    const isSelected = selectedValue === value;
    const { View } = getPlatformComponents();

    // Only render content for the active tab
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

/**
 * Complete example of the Tabs component usage:
 * 
 * @example
 * ```tsx
 * import { useState } from 'react';
 * import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
 * 
 * function ProfileSettings() {
 *   const [activeTab, setActiveTab] = useState('account');
 *   
 *   return (
 *     <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
 *       <TabsList className="grid grid-cols-3">
 *         <TabsTrigger value="account">Account</TabsTrigger>
 *         <TabsTrigger value="password">Password</TabsTrigger>
 *         <TabsTrigger value="notifications">Notifications</TabsTrigger>
 *       </TabsList>
 *       <TabsContent value="account" className="p-4 border rounded-md mt-4">
 *         <h2 className="text-lg font-bold">Account Settings</h2>
 *         <p>Manage your account details and preferences.</p>
 *       </TabsContent>
 *       <TabsContent value="password" className="p-4 border rounded-md mt-4">
 *         <h2 className="text-lg font-bold">Change Password</h2>
 *         <p>Update your password and security settings.</p>
 *       </TabsContent>
 *       <TabsContent value="notifications" className="p-4 border rounded-md mt-4">
 *         <h2 className="text-lg font-bold">Notification Preferences</h2>
 *         <p>Control how and when you receive notifications.</p>
 *       </TabsContent>
 *     </Tabs>
 *   );
 * }
 * ```
 */
export { Tabs, TabsList, TabsTrigger, TabsContent };