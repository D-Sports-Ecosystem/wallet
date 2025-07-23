/**
 * @file card.tsx
 * @description A set of card components for creating structured content containers
 * @module components/ui
 * @author D-Sports Engineering Team
 * @version 1.0.0
 * @since 2025-07-23
 */

import * as React from 'react';
import { cn } from '../../lib/utils';
import { isReactNative } from '../../utils/platform-detection';
import { getPlatformComponents } from '../../utils/component-factory';

/**
 * Props for Card components
 * 
 * @interface CardProps
 * @extends {React.HTMLAttributes<HTMLDivElement>} - Inherits all HTMLDivElement props
 * @property {string} [className] - Additional CSS classes
 */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Card component for creating structured content containers
 * 
 * @component
 * @param {CardProps} props - Component props
 * @param {React.Ref<HTMLDivElement>} ref - Reference to the card element
 * @returns {JSX.Element} - Rendered Card component
 * 
 * @example
 * ```tsx
 * // Basic card
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Card Description</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Card content goes here</p>
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 * 
 * // Card with custom class
 * <Card className="max-w-md">
 *   <CardContent>Content</CardContent>
 * </Card>
 * ```
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    const { View } = getPlatformComponents();
    
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

/**
 * CardHeader component for the top section of a card
 * 
 * @component
 * @param {CardProps} props - Component props
 * @param {React.Ref<HTMLDivElement>} ref - Reference to the header element
 * @returns {JSX.Element} - Rendered CardHeader component
 * 
 * @example
 * ```tsx
 * <CardHeader>
 *   <CardTitle>Card Title</CardTitle>
 *   <CardDescription>Card Description</CardDescription>
 * </CardHeader>
 * 
 * // With custom class
 * <CardHeader className="border-b pb-3">
 *   <CardTitle>Custom Header</CardTitle>
 * </CardHeader>
 * ```
 */
const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    const { View } = getPlatformComponents();
    
    if (isReactNative()) {
      return <View ref={ref} className={cn('flex gap-1.5 pb-4', className)} {...props} />;
    }
    
    return (
      <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
    );
  }
);
CardHeader.displayName = 'CardHeader';

/**
 * CardTitle component for the title of a card
 * 
 * @component
 * @param {React.HTMLAttributes<HTMLHeadingElement> & { className?: string }} props - Component props
 * @param {React.Ref<HTMLParagraphElement>} ref - Reference to the title element
 * @returns {JSX.Element} - Rendered CardTitle component
 * 
 * @example
 * ```tsx
 * <CardTitle>Card Title</CardTitle>
 * 
 * // With custom class
 * <CardTitle className="text-primary">Custom Title</CardTitle>
 * ```
 */
const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement> & { className?: string }>(
  ({ className, ...props }, ref) => {
    const { Text } = getPlatformComponents();
    
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

/**
 * CardDescription component for the description text in a card
 * 
 * @component
 * @param {React.HTMLAttributes<HTMLParagraphElement> & { className?: string }} props - Component props
 * @param {React.Ref<HTMLParagraphElement>} ref - Reference to the description element
 * @returns {JSX.Element} - Rendered CardDescription component
 * 
 * @example
 * ```tsx
 * <CardDescription>This is a description of the card content</CardDescription>
 * 
 * // With custom class
 * <CardDescription className="italic">Custom description</CardDescription>
 * ```
 */
const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement> & { className?: string }>(
  ({ className, ...props }, ref) => {
    const { Text } = getPlatformComponents();
    
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

/**
 * CardContent component for the main content area of a card
 * 
 * @component
 * @param {CardProps} props - Component props
 * @param {React.Ref<HTMLDivElement>} ref - Reference to the content element
 * @returns {JSX.Element} - Rendered CardContent component
 * 
 * @example
 * ```tsx
 * <CardContent>
 *   <p>This is the main content of the card.</p>
 * </CardContent>
 * 
 * // With custom class
 * <CardContent className="grid grid-cols-2 gap-4">
 *   <div>Column 1</div>
 *   <div>Column 2</div>
 * </CardContent>
 * ```
 */
const CardContent = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    const { View } = getPlatformComponents();
    
    if (isReactNative()) {
      return <View ref={ref} className={cn('pt-0', className)} {...props} />;
    }
    
    return <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />;
  }
);
CardContent.displayName = 'CardContent';

/**
 * CardFooter component for the bottom section of a card
 * 
 * @component
 * @param {CardProps} props - Component props
 * @param {React.Ref<HTMLDivElement>} ref - Reference to the footer element
 * @returns {JSX.Element} - Rendered CardFooter component
 * 
 * @example
 * ```tsx
 * <CardFooter>
 *   <Button>Cancel</Button>
 *   <Button variant="primary">Submit</Button>
 * </CardFooter>
 * 
 * // With custom class
 * <CardFooter className="justify-between border-t pt-3">
 *   <Button variant="outline">Back</Button>
 *   <Button>Next</Button>
 * </CardFooter>
 * ```
 */
const CardFooter = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    const { View } = getPlatformComponents();
    
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