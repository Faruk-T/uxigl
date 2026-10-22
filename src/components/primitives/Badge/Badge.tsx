import React from 'react';
import type {
  IconSlotProps,
  IdentifiableProps,
  SizableProps,
  TonalProps,
} from '../../../core/contracts/ComponentContracts';

/**
 * ============================================================================
 * uxiGL PRIMITIVE — BADGE
 * ============================================================================
 * Status & count indicators with optional live pulsing indicator.
 */

export type BadgeVariant = 'tonal' | 'filled' | 'glass' | 'outlined';

export interface BadgeProps
  extends IdentifiableProps,
    SizableProps,
    TonalProps,
    IconSlotProps {
  variant?: BadgeVariant;
  pulse?: boolean;
  pill?: boolean;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  id,
  className = '',
  style,
  variant = 'tonal',
  tone = 'primary',
  size = 'md',
  pulse = false,
  pill = true,
  leadingIcon,
  trailingIcon,
  children,
}) => {
  const classes = [
    'uxu-badge',
    `uxu-badge--${variant}`,
    `uxu-badge--${tone}`,
    `uxu-badge--${size}`,
    pill ? 'uxu-badge--pill' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span id={id} className={classes} style={style}>
      {pulse && <span className="uxu-badge__pulse-dot" aria-hidden="true" />}
      {leadingIcon && (
        <span className="uxu-badge__icon">{leadingIcon}</span>
      )}
      <span className="uxu-badge__label">{children}</span>
      {trailingIcon && (
        <span className="uxu-badge__icon">{trailingIcon}</span>
      )}
    </span>
  );
};
