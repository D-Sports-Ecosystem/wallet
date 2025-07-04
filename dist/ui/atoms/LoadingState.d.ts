import React from 'react';
import { LoadingStateProps } from '../types';
/**
 * LoadingState - A versatile loading indicator component with multiple animation variants.
 *
 * This component provides various loading animations including spinner, dots, pulse, and skeleton.
 * It supports different sizes, overlay mode, and custom text display with full theming support.
 *
 * @example
 * ```tsx
 * // Basic spinner
 * <LoadingState variant="spinner" size="medium" text="Loading..." />
 *
 * // Overlay loading screen
 * <LoadingState variant="dots" overlay text="Please wait..." />
 *
 * // Skeleton loading for content placeholders
 * <LoadingState variant="skeleton" />
 *
 * // Pulse animation with custom theme
 * <LoadingState
 *   variant="pulse"
 *   size="large"
 *   theme={customTheme}
 *   text="Connecting to wallet..."
 * />
 * ```
 *
 * @param props - Configuration props for the loading state
 * @returns A loading indicator component with specified animation
 */
declare const LoadingState: React.FC<LoadingStateProps>;
export default LoadingState;
//# sourceMappingURL=LoadingState.d.ts.map