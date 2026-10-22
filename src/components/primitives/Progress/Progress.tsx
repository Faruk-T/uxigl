import React from 'react';
import type {
  IdentifiableProps,
  SizableProps,
  TonalProps,
} from '../../../core/contracts/ComponentContracts';

/**
 * ============================================================================
 * UXU PRIMITIVE — PROGRESS (LINEAR & CIRCULAR RING)
 * ============================================================================
 * Combines Apple Watch Activity Ring SVG aesthetics with Material 3 Linear
 * progress bar & indeterminate shimmer.
 */

export type AnimationSpeedPreset = 'slow' | 'normal' | 'fast' | number;

function resolveDurationSeconds(
  speed: AnimationSpeedPreset | undefined,
  defaultSec: number
): string {
  if (typeof speed === 'number') return `${Math.max(0.4, speed)}s`;
  if (speed === 'slow') return '4.2s';
  if (speed === 'fast') return '1.2s';
  return `${defaultSec}s`;
}

export interface ProgressProps
  extends IdentifiableProps,
    SizableProps,
    TonalProps {
  value?: number;
  max?: number;
  variant?: 'linear' | 'circular';
  indeterminate?: boolean;
  /** Controls indeterminate animation duration ('slow' | 'normal' | 'fast' or seconds, default 2.6s) */
  speed?: AnimationSpeedPreset;
  label?: React.ReactNode;
  showValue?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({
  id,
  className = '',
  style,
  value = 0,
  max = 100,
  variant = 'linear',
  size = 'md',
  tone = 'primary',
  indeterminate = false,
  speed,
  label,
  showValue = true,
}) => {
  const percentage = Math.max(0, Math.min(100, Math.round((value / (max || 1)) * 100)));
  const animDuration = resolveDurationSeconds(speed, 2.6);

  if (variant === 'circular') {
    const dimension =
      size === 'xs'
        ? 38
        : size === 'sm'
        ? 48
        : size === 'lg'
        ? 86
        : 64;
    const strokeWidth =
      size === 'xs'
        ? 3.5
        : size === 'sm'
        ? 4.5
        : size === 'lg'
        ? 7.5
        : 5.5;
    const radius = (dimension - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset =
      circumference - (percentage / 100) * circumference;

    return (
      <div
        id={id}
        className={`uxu-progress-circular uxu-progress-circular--${tone} ${className}`}
        style={{ width: dimension, height: dimension, ...style }}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <svg
          width={dimension}
          height={dimension}
          viewBox={`0 0 ${dimension} ${dimension}`}
          className={indeterminate ? 'uxu-progress-circular__svg--spin' : ''}
          style={
            indeterminate
              ? ({
                  '--uxu-anim-duration': animDuration,
                  animationDuration: animDuration,
                } as React.CSSProperties)
              : undefined
          }
        >
          <circle
            className="uxu-progress-circular__track"
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            className="uxu-progress-circular__fill"
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={
              indeterminate ? circumference * 0.35 : strokeDashoffset
            }
          />
        </svg>
        {showValue && !indeterminate && (
          <span
            className="uxu-progress-circular__label"
            style={{
              fontSize:
                size === 'xs'
                  ? '0.62rem'
                  : size === 'sm'
                  ? '0.7rem'
                  : size === 'lg'
                  ? '0.92rem'
                  : '0.78rem',
            }}
          >
            {percentage}%
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      id={id}
      className={`uxu-progress-linear uxu-progress-linear--${size} uxu-progress-linear--${tone} ${className}`}
      style={style}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : percentage}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {(label || showValue) && (
        <div className="uxu-progress-linear__header">
          {label && <span className="uxu-progress-linear__label">{label}</span>}
          {showValue && !indeterminate && (
            <span className="uxu-progress-linear__value">{percentage}%</span>
          )}
        </div>
      )}
      <div className="uxu-progress-linear__track">
        <div
          className={`uxu-progress-linear__fill ${
            indeterminate ? 'uxu-progress-linear__fill--indeterminate' : ''
          }`}
          style={
            indeterminate
              ? ({
                  '--uxu-anim-duration': animDuration,
                  animationDuration: animDuration,
                } as React.CSSProperties)
              : { width: `${percentage}%` }
          }
        >
          {!indeterminate && speed !== undefined && (
            <span
              className="uxu-progress-linear__shimmer"
              style={{ animationDuration: animDuration }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
