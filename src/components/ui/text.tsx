import * as React from 'react';
import { cn } from '../../lib/utils';

export const TextClassContext = React.createContext<string | undefined>(undefined);

export interface TextProps {
  className?: string;
  asChild?: boolean;
  children?: React.ReactNode;
  style?: any;
  numberOfLines?: number;
  ellipsizeMode?: string;
}

const Text = React.forwardRef<any, TextProps>(
  ({ className, style, children, numberOfLines, ellipsizeMode, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext);
    
    const textStyle = {
      ...style,
      ...(numberOfLines && {
        display: '-webkit-box',
        WebkitLineClamp: numberOfLines,
        WebkitBoxOrient: 'vertical' as const,
        overflow: 'hidden',
      }),
      ...(ellipsizeMode === 'middle' && {
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap' as const,
        overflow: 'hidden',
      }),
    };
    
    return (
      <span
        ref={ref}
        className={cn('text-foreground', textClass, className)}
        style={textStyle}
        {...props}
      >
        {children}
      </span>
    );
  }
);
Text.displayName = 'Text';

export { Text };