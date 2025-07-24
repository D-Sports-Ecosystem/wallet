/**
 * @file pressable.tsx
 * @description A custom Pressable component that mimics React Native's Pressable
 * @module components/ui
 * @author D-Sports Engineering Team
 * @version 1.0.0
 * @since 2025-07-23
 */

import * as React from "react";

/**
 * Props for the Pressable component
 *
 * @interface PressableProps
 */
export interface PressableProps {
  onPress?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?:
    | React.CSSProperties
    | ((state: {
        pressed: boolean;
        hovered?: boolean;
        focused?: boolean;
      }) => React.CSSProperties);
  ref?: React.Ref<HTMLButtonElement>;
  role?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  [key: string]: any; // Allow any other props that might be passed
}

/**
 * Custom Pressable component that mimics React Native's Pressable
 *
 * @component
 * @param {PressableProps} props - Component props
 * @returns {JSX.Element} - Rendered Pressable component
 */
export const Pressable = React.forwardRef<HTMLButtonElement, PressableProps>(
  ({ onPress, disabled, children, className, style, ...props }, ref) => {
    const [pressed, setPressed] = React.useState(false);
    const [hovered, setHovered] = React.useState(false);
    const [focused, setFocused] = React.useState(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onPress) {
        onPress();
      }
      if (props.onClick) {
        props.onClick(e);
      }
    };

    const computedStyle = React.useMemo(() => {
      if (typeof style === "function") {
        return style({ pressed, hovered, focused });
      }
      return style;
    }, [style, pressed, hovered, focused]);

    return (
      <button
        ref={ref}
        className={className}
        style={computedStyle}
        disabled={disabled}
        onClick={handleClick}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => {
          setPressed(false);
          setHovered(false);
        }}
        onMouseEnter={() => setHovered(true)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Pressable.displayName = "Pressable";
