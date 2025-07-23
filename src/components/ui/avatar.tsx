/**
 * @file avatar.tsx
 * @description A cross-platform avatar component for user profile images
 * @module components/ui
 * @author D-Sports Engineering Team
 * @version 1.0.0
 * @since 2024-07-23
 */

import * as React from 'react';
import { cn } from '../../lib/utils';
import { isReactNative } from '../../utils/platform-detection';
import { getPlatformComponents } from '../../utils/component-factory';

/**
 * Props for the Avatar component
 * 
 * @interface AvatarProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 * @property {string} [className] - Additional CSS classes
 */
interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Props for the AvatarImage component
 * 
 * @interface AvatarImageProps
 * @extends {React.ImgHTMLAttributes<HTMLImageElement>}
 * @property {string} [className] - Additional CSS classes
 */
interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

/**
 * Avatar component for displaying user profile images
 * 
 * @component
 * @param {AvatarProps} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Avatar content (AvatarImage and/or AvatarFallback)
 * @param {React.Ref<HTMLDivElement>} ref - Reference to the avatar container
 * @returns {JSX.Element} - Rendered Avatar component
 * 
 * @example
 * ```tsx
 * // Basic avatar with image and fallback
 * <Avatar>
 *   <AvatarImage src="https://example.com/avatar.jpg" alt="User" />
 *   <AvatarFallback>JD</AvatarFallback>
 * </Avatar>
 * 
 * // Custom sized avatar
 * <Avatar className="h-16 w-16">
 *   <AvatarImage src="https://example.com/avatar.jpg" alt="User" />
 *   <AvatarFallback>JD</AvatarFallback>
 * </Avatar>
 * ```
 */
const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, ...props }, ref) => {
    const { View } = getPlatformComponents();
    if (isReactNative()) {
      return (
        <View
          ref={ref}
          className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
          {...props}
        />
      );
    }
    
    return (
      <div
        ref={ref}
        className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
        {...props}
      />
    );
  }
);
Avatar.displayName = 'Avatar';

/**
 * AvatarImage component for displaying the user's image
 * 
 * @component
 * @param {AvatarImageProps} props - Component props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alternative text for the image
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.Ref<HTMLImageElement>} ref - Reference to the image element
 * @returns {JSX.Element} - Rendered AvatarImage component
 * 
 * @example
 * ```tsx
 * <Avatar>
 *   <AvatarImage src="https://example.com/avatar.jpg" alt="User profile" />
 *   <AvatarFallback>JD</AvatarFallback>
 * </Avatar>
 * 
 * // With custom styling
 * <AvatarImage 
 *   src="https://example.com/avatar.jpg" 
 *   alt="User profile"
 *   className="opacity-90 hover:opacity-100"
 * />
 * ```
 */
const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, ...props }, ref) => {
    const { Image } = getPlatformComponents();
    if (isReactNative()) {
      return (
        <Image
          ref={ref}
          className={cn('aspect-square h-full w-full', className)}
          {...props}
        />
      );
    }
    
    return (
      <img
        ref={ref}
        className={cn('aspect-square h-full w-full', className)}
        {...props}
      />
    );
  }
);
AvatarImage.displayName = 'AvatarImage';

/**
 * AvatarFallback component for displaying when the image fails to load
 * 
 * @component
 * @param {AvatarProps} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Fallback content (typically initials or icon)
 * @param {React.Ref<HTMLDivElement>} ref - Reference to the fallback container
 * @returns {JSX.Element} - Rendered AvatarFallback component
 * 
 * @example
 * ```tsx
 * <Avatar>
 *   <AvatarImage src="https://example.com/avatar.jpg" alt="User" />
 *   <AvatarFallback>JD</AvatarFallback>
 * </Avatar>
 * 
 * // With custom styling
 * <AvatarFallback className="bg-primary text-primary-foreground">
 *   JD
 * </AvatarFallback>
 * 
 * // With icon
 * <AvatarFallback>
 *   <UserIcon className="h-5 w-5" />
 * </AvatarFallback>
 * ```
 */
const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, ...props }, ref) => {
    const { View } = getPlatformComponents();
    if (isReactNative()) {
      return (
        <View
          ref={ref}
          className={cn(
            'flex h-full w-full items-center justify-center rounded-full bg-muted',
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
          'flex h-full w-full items-center justify-center rounded-full bg-muted',
          className
        )}
        {...props}
      />
    );
  }
);
AvatarFallback.displayName = 'AvatarFallback';

/**
 * Complete example of the Avatar component usage:
 * 
 * @example
 * ```tsx
 * // Basic avatar with image and text fallback
 * <Avatar>
 *   <AvatarImage src="https://example.com/avatar.jpg" alt="John Doe" />
 *   <AvatarFallback>JD</AvatarFallback>
 * </Avatar>
 * 
 * // Custom sized avatar
 * <Avatar className="h-16 w-16">
 *   <AvatarImage src="https://example.com/avatar.jpg" alt="John Doe" />
 *   <AvatarFallback>JD</AvatarFallback>
 * </Avatar>
 * 
 * // Avatar with icon fallback
 * <Avatar>
 *   <AvatarImage src="https://example.com/avatar.jpg" alt="John Doe" />
 *   <AvatarFallback>
 *     <UserIcon className="h-5 w-5" />
 *   </AvatarFallback>
 * </Avatar>
 * 
 * // Avatar with custom colors
 * <Avatar>
 *   <AvatarImage src="https://example.com/avatar.jpg" alt="John Doe" />
 *   <AvatarFallback className="bg-primary text-primary-foreground">
 *     JD
 *   </AvatarFallback>
 * </Avatar>
 * ```
 */
export { Avatar, AvatarImage, AvatarFallback };