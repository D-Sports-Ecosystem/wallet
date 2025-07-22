import * as React from 'react';
import { cn } from '../../lib/utils';
import { isReactNative } from '../../utils/platform-detection';
import { getPlatformComponents } from '../../utils/component-factory';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

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

export { Avatar, AvatarImage, AvatarFallback };