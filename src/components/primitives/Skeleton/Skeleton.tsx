import React from 'react';
import type { IdentifiableProps } from '../../../core/contracts/ComponentContracts';

/**
 * ============================================================================
 * uxiGL PRIMITIVE — SKELETON
 * ============================================================================
 * Shimmering loading placeholders with squircle, circular, and text line modes.
 */

export interface SkeletonProps extends IdentifiableProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'squircle';
  width?: string | number;
  height?: string | number;
  animated?: boolean;
  /** Controls shimmer animation duration ('slow' | 'normal' | 'fast' or seconds, default 2.8s) */
  speed?: 'slow' | 'normal' | 'fast' | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  id,
  className = '',
  style,
  variant = 'squircle',
  width = '100%',
  height = '18px',
  animated = true,
  speed,
}) => {
  const durationStr =
    typeof speed === 'number'
      ? `${Math.max(0.5, speed)}s`
      : speed === 'slow'
      ? '4.5s'
      : speed === 'fast'
      ? '1.4s'
      : '2.8s';

  const classes = [
    'uxu-skeleton',
    `uxu-skeleton--${variant}`,
    animated ? 'uxu-skeleton--animated' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      id={id}
      className={classes}
      style={
        {
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          '--uxu-shimmer-duration': durationStr,
          ...style,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      {animated && (
        <span
          className="uxu-skeleton__shimmer"
          style={{ animationDuration: durationStr }}
        />
      )}
    </div>
  );
};
