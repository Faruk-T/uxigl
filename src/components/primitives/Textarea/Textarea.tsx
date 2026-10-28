import React, { useId } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Sparkles,
  X,
} from 'lucide-react';
import type {
  ComponentSize,
  DisableableProps,
  IdentifiableProps,
} from '../../../core/contracts/ComponentContracts';
import type { InputSurfaceStyle, InputValidationState } from '../Input/Input';

/**
 * ============================================================================
 * uxiGL PRIMITIVE — ENTERPRISE TEXTAREA
 * ============================================================================
 * Multi-line text area with character counter, quick-insert template pills,
 * clear button, and semantic validation states.
 */

export interface TextareaProps
  extends Omit<
      React.TextareaHTMLAttributes<HTMLTextAreaElement>,
      'id' | 'style' | 'value' | 'onChange' | 'size'
    >,
    IdentifiableProps,
    DisableableProps {
  label?: React.ReactNode;
  value: string;
  onChange: (nextValue: string) => void;
  surface?: InputSurfaceStyle;
  size?: ComponentSize;
  validationState?: InputValidationState;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  successText?: React.ReactNode;
  warningText?: React.ReactNode;
  maxLength?: number;
  showCount?: boolean;
  clearable?: boolean;
  quickTemplates?: string[];
  rows?: number;
}

export const Textarea: React.FC<TextareaProps> = ({
  id,
  className = '',
  style,
  label,
  value,
  onChange,
  surface = 'glass',
  validationState = 'default',
  helperText,
  errorText,
  successText,
  warningText,
  maxLength,
  showCount = false,
  clearable = false,
  quickTemplates,
  rows = 3,
  disabled = false,
  required = false,
  placeholder,
  ...rest
}) => {
  const autoId = useId();
  const textareaId = id ?? autoId;

  const resolvedValidation: InputValidationState = errorText
    ? 'error'
    : validationState;

  const statusMessage =
    errorText ??
    (resolvedValidation === 'success'
      ? successText
      : resolvedValidation === 'warning'
      ? warningText
      : undefined) ??
    helperText;

  return (
    <div
      style={style}
      className={['uxu-field', className].filter(Boolean).join(' ')}
    >
      {(label || showCount || clearable) && (
        <div className="uxu-field__header">
          {label ? (
            <label htmlFor={textareaId} className="uxu-field__label">
              {label}
              {required && <span className="uxu-field__required">*</span>}
            </label>
          ) : (
            <span />
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {clearable && value.length > 0 && !disabled && (
              <button
                type="button"
                className="uxu-date-preset-chip"
                onClick={() => onChange('')}
              >
                <X size={11} /> Temizle
              </button>
            )}
            {showCount && (
              <span className="uxu-field__counter">
                {value.length}
                {maxLength ? `/${maxLength}` : ''}
              </span>
            )}
          </div>
        </div>
      )}

      <div
        className={[
          'uxu-textarea-box',
          `uxu-input-box--${surface}`,
          resolvedValidation !== 'default'
            ? `uxu-input-box--${resolvedValidation}`
            : '',
          disabled ? 'uxu-input-box--disabled' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <textarea
          id={textareaId}
          rows={rows}
          value={value}
          maxLength={maxLength}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="uxu-textarea-box__native"
          {...rest}
        />
      </div>

      {quickTemplates && quickTemplates.length > 0 && !disabled && (
        <div className="uxu-tag-suggestions">
          <span className="uxu-tag-suggestions__label">
            <Sparkles size={11} /> Hazır Şablon:
          </span>
          {quickTemplates.map((tpl, idx) => (
            <button
              key={idx}
              type="button"
              className="uxu-tag-suggestion-btn"
              onClick={() =>
                onChange(value ? `${value.trim()}\n${tpl}` : tpl)
              }
            >
              + {tpl.length > 34 ? `${tpl.slice(0, 34)}…` : tpl}
            </button>
          ))}
        </div>
      )}

      {statusMessage && (
        <div
          className={`uxu-field__helper ${
            resolvedValidation !== 'default'
              ? `uxu-field__helper--${resolvedValidation}`
              : ''
          }`}
        >
          {resolvedValidation === 'success' && <CheckCircle2 size={13} />}
          {resolvedValidation === 'warning' && <AlertTriangle size={13} />}
          {resolvedValidation === 'error' && <AlertCircle size={13} />}
          <span>{statusMessage}</span>
        </div>
      )}
    </div>
  );
};
