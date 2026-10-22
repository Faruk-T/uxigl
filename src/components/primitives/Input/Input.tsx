import React, { useId } from 'react';
import { X } from 'lucide-react';
import type {
  FormControlContract,
  IconSlotProps,
} from '../../../core/contracts/ComponentContracts';

/**
 * ============================================================================
 * UXU PRIMITIVE — INPUT
 * ============================================================================
 * Hybrid of Apple Spotlight translucent input & Material M3 Outlined/Filled field.
 *
 * SOLID Principles Applied:
 * - [LSP] Implements `FormControlContract<string>`, enabling seamless swap with
 *   any other UXU text control.
 * - [OCP] Extensible via `leadingIcon`, `trailingIcon`, `prefixText`, and `clearable`.
 */

export type InputSurfaceStyle = 'glass' | 'tonal' | 'outlined';

export interface InputProps
  extends FormControlContract<string>,
    IconSlotProps {
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'search' | 'number' | 'url';
  surface?: InputSurfaceStyle;
  clearable?: boolean;
  maxLength?: number;
  showCount?: boolean;
  shortcutHint?: string;
  autoFocus?: boolean;
}

export const Input: React.FC<InputProps> = ({
  id,
  className = '',
  style,
  value,
  onChange,
  label,
  helperText,
  errorText,
  required = false,
  disabled = false,
  size = 'md',
  placeholder,
  type = 'text',
  surface = 'glass',
  leadingIcon,
  trailingIcon,
  clearable = false,
  maxLength,
  showCount = false,
  shortcutHint,
  name,
  autoFocus = false,
}) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hasError = Boolean(errorText);

  const wrapperClasses = [
    'uxu-field',
    `uxu-field--${size}`,
    disabled ? 'uxu-field--disabled' : '',
    hasError ? 'uxu-field--error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const controlClasses = [
    'uxu-input-box',
    `uxu-input-box--${surface}`,
    `uxu-input-box--${size}`,
    hasError ? 'uxu-input-box--error' : '',
    disabled ? 'uxu-input-box--disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClasses} style={style}>
      {(label || (showCount && maxLength)) && (
        <div className="uxu-field__header">
          {label && (
            <label htmlFor={inputId} className="uxu-field__label">
              {label}
              {required && <span className="uxu-field__required">*</span>}
            </label>
          )}
          {showCount && maxLength && (
            <span className="uxu-field__counter">
              {value.length}/{maxLength}
            </span>
          )}
        </div>
      )}

      <div className={controlClasses}>
        {leadingIcon && (
          <span className="uxu-input-box__icon uxu-input-box__icon--leading">
            {leadingIcon}
          </span>
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-invalid={hasError}
          onChange={(e) => onChange(e.target.value)}
          className="uxu-input-box__native"
        />

        {clearable && value.length > 0 && !disabled && (
          <button
            type="button"
            className="uxu-input-box__clear"
            onClick={() => onChange('')}
            aria-label="Metni temizle"
          >
            <X size={14} />
          </button>
        )}

        {shortcutHint && !value && (
          <kbd className="uxu-input-box__kbd">{shortcutHint}</kbd>
        )}

        {trailingIcon && (
          <span className="uxu-input-box__icon uxu-input-box__icon--trailing">
            {trailingIcon}
          </span>
        )}
      </div>

      {(errorText || helperText) && (
        <div
          className={`uxu-field__helper ${
            hasError ? 'uxu-field__helper--error' : ''
          }`}
        >
          {errorText ?? helperText}
        </div>
      )}
    </div>
  );
};
