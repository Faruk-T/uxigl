import React from 'react';
import type {
  DisableableProps,
  IconSlotProps,
  IdentifiableProps,
  LoadableProps,
  SizableProps,
} from '../../../core/contracts/ComponentContracts';

/**
 * ============================================================================
 * uxiGL PRIMITIVE — BUTTON
 * ============================================================================
 * Apple HIG spring-press feedback + Google Material You tonal & filled surfaces.
 *
 * SOLID Principles Applied:
 * - [ISP] Composes `IdentifiableProps`, `DisableableProps`, `LoadableProps`,
 *   `SizableProps`, and `IconSlotProps`.
 * - [OCP] Extensible via `variant` registry & `leadingIcon`/`trailingIcon` slots.
 */

export type ButtonVariant =
  | 'filled'
  | 'tonal'
  | 'glass'
  | 'outlined'
  | 'ghost'
  | 'danger';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'id' | 'style'>,
    IdentifiableProps,
    DisableableProps,
    LoadableProps,
    SizableProps,
    IconSlotProps {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  iconOnly?: boolean;
  pill?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  id,
  className = '',
  style,
  variant = 'filled',
  size = 'md',
  disabled = false,
  loading = false,
  loadingText,
  leadingIcon,
  trailingIcon,
  fullWidth = false,
  iconOnly = false,
  pill = false,
  type = 'button',
  children,
  ...rest
}) => {
  const isDisabled = disabled || loading;

  const classes = [
    'uxu-btn',
    `uxu-btn--${variant}`,
    `uxu-btn--${size}`,
    fullWidth ? 'uxu-btn--full' : '',
    iconOnly ? 'uxu-btn--icon-only' : '',
    pill ? 'uxu-btn--pill' : '',
    loading ? 'uxu-btn--loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      id={id}
      type={type}
      className={classes}
      style={style}
      disabled={isDisabled}
      aria-busy={loading}
      {...rest}
    >
      {loading && (
        <span className="uxu-btn__spinner" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" className="uxu-spinner-svg">
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="42 24"
            />
          </svg>
        </span>
      )}
      {!loading && leadingIcon && (
        <span className="uxu-btn__icon uxu-btn__icon--leading">
          {leadingIcon}
        </span>
      )}
      {(!iconOnly || loadingText) && (
        <span className="uxu-btn__label">
          {loading && loadingText ? loadingText : children}
        </span>
      )}
      {iconOnly && !loading && !leadingIcon && children}
      {!loading && trailingIcon && (
        <span className="uxu-btn__icon uxu-btn__icon--trailing">
          {trailingIcon}
        </span>
      )}
    </button>
  );
};
