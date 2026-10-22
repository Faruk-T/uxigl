import React, { useId } from 'react';
import { Check, X } from 'lucide-react';
import type {
  FormControlContract,
  TonalProps,
} from '../../../core/contracts/ComponentContracts';

/**
 * ============================================================================
 * uxiGL PRIMITIVE — SWITCH (TOGGLE)
 * ============================================================================
 * Combines iOS tactile fluid spring track with Google Material 3 thumb icons.
 *
 * SOLID Principles Applied:
 * - [LSP] Implements `FormControlContract<boolean>` so it can be used
 *   interchangeably with `Checkbox` in any boolean setting row.
 */

export interface SwitchProps
  extends FormControlContract<boolean>,
    TonalProps {
  showThumbIcon?: boolean;
  description?: React.ReactNode;
}

export const Switch: React.FC<SwitchProps> = ({
  id,
  className = '',
  style,
  value,
  onChange,
  label,
  description,
  helperText,
  errorText,
  disabled = false,
  size = 'md',
  tone = 'primary',
  showThumbIcon = true,
}) => {
  const generatedId = useId();
  const switchId = id ?? generatedId;

  const rootClasses = [
    'uxu-switch-row',
    `uxu-switch-row--${size}`,
    disabled ? 'uxu-switch-row--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const trackClasses = [
    'uxu-switch',
    `uxu-switch--${size}`,
    `uxu-switch--${tone}`,
    value ? 'uxu-switch--checked' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClasses} style={style}>
      {(label || description || helperText || errorText) && (
        <div className="uxu-switch-row__text">
          {label && (
            <label htmlFor={switchId} className="uxu-switch-row__label">
              {label}
            </label>
          )}
          {(description || helperText || errorText) && (
            <span className="uxu-switch-row__desc">
              {errorText ?? description ?? helperText}
            </span>
          )}
        </div>
      )}

      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={value}
        disabled={disabled}
        className={trackClasses}
        onClick={() => !disabled && onChange(!value)}
      >
        <span className="uxu-switch__thumb">
          {showThumbIcon &&
            (value ? (
              <Check size={size === 'sm' ? 9 : 11} strokeWidth={3} />
            ) : (
              <X size={size === 'sm' ? 9 : 11} strokeWidth={2.5} />
            ))}
        </span>
      </button>
    </div>
  );
};
