import React from 'react';
import { Check, X } from 'lucide-react';
import type {
  DisableableProps,
  DismissibleProps,
  IconSlotProps,
  IdentifiableProps,
  SizableProps,
  TonalProps,
} from '../../../core/contracts/ComponentContracts';

/**
 * ============================================================================
 * UXU PRIMITIVE — CHIP
 * ============================================================================
 * Google Material Design 3 Filter, Assist & Input Chips with Apple glass finish.
 *
 * SOLID Principles Applied:
 * - [ISP] Segregates `DismissibleProps`, `DisableableProps`, `IconSlotProps`.
 * - [OCP] Supports filter selection, action click, or tag dismissal without
 *   separate component classes.
 */

export interface ChipProps
  extends IdentifiableProps,
    DisableableProps,
    SizableProps,
    TonalProps,
    IconSlotProps,
    DismissibleProps {
  selected?: boolean;
  onClick?: () => void;
  variant?: 'tonal' | 'glass' | 'outlined';
  pill?: boolean;
  children: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({
  id,
  className = '',
  style,
  selected = false,
  disabled = false,
  size = 'md',
  tone = 'primary',
  variant = 'tonal',
  pill = false,
  leadingIcon,
  trailingIcon,
  dismissible = false,
  onDismiss,
  onClick,
  children,
}) => {
  const isInteractive = Boolean(onClick) && !disabled;

  const classes = [
    'uxu-chip',
    `uxu-chip--${variant}`,
    `uxu-chip--${tone}`,
    `uxu-chip--${size}`,
    pill ? 'uxu-chip--pill' : '',
    selected ? 'uxu-chip--selected' : '',
    isInteractive ? 'uxu-chip--interactive' : '',
    disabled ? 'uxu-chip--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      id={id}
      style={style}
      className={classes}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-pressed={isInteractive ? selected : undefined}
      onClick={() => isInteractive && onClick?.()}
      onKeyDown={(e) => {
        if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {selected ? (
        <span className="uxu-chip__check">
          <Check size={13} strokeWidth={2.8} />
        </span>
      ) : (
        leadingIcon && <span className="uxu-chip__icon">{leadingIcon}</span>
      )}
      <span className="uxu-chip__label">{children}</span>
      {trailingIcon && <span className="uxu-chip__icon">{trailingIcon}</span>}
      {dismissible && (
        <button
          type="button"
          className="uxu-chip__dismiss"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            onDismiss?.();
          }}
          aria-label="Etiketi kaldır"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
};
