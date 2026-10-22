import React, { useId } from 'react';
import { Check, Minus } from 'lucide-react';
import type {
  FormControlContract,
  TonalProps,
} from '../../../core/contracts/ComponentContracts';

/**
 * ============================================================================
 * uxiGL PRIMITIVE — CHECKBOX
 * ============================================================================
 * Implements `FormControlContract<boolean>` [LSP], making it 100% interchangeable
 * with `Switch` anywhere a boolean control is required.
 */

export interface CheckboxProps
  extends FormControlContract<boolean>,
    TonalProps {
  indeterminate?: boolean;
  description?: React.ReactNode;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  className = '',
  style,
  value,
  onChange,
  indeterminate = false,
  label,
  description,
  helperText,
  disabled = false,
  size = 'md',
  tone = 'primary',
}) => {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  const isActive = value || indeterminate;

  return (
    <label
      htmlFor={checkboxId}
      className={`uxu-checkbox-row uxu-checkbox-row--${size} ${
        disabled ? 'uxu-checkbox-row--disabled' : ''
      } ${className}`}
      style={style}
    >
      <button
        id={checkboxId}
        type="button"
        role="checkbox"
        aria-checked={indeterminate ? 'mixed' : value}
        disabled={disabled}
        onClick={() => !disabled && onChange(!value)}
        className={`uxu-checkbox-box uxu-checkbox-box--${size} uxu-checkbox-box--${tone} ${
          isActive ? 'uxu-checkbox-box--checked' : ''
        }`}
      >
        {indeterminate ? (
          <Minus size={size === 'sm' ? 11 : 13} strokeWidth={3} />
        ) : value ? (
          <Check size={size === 'sm' ? 11 : 13} strokeWidth={3} />
        ) : null}
      </button>

      {(label || description || helperText) && (
        <span className="uxu-checkbox-row__content">
          {label && <span className="uxu-checkbox-row__label">{label}</span>}
          {(description || helperText) && (
            <span className="uxu-checkbox-row__desc">
              {description ?? helperText}
            </span>
          )}
        </span>
      )}
    </label>
  );
};
