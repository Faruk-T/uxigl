import React, { useId } from 'react';
import type {
  FormControlContract,
  IconSlotProps,
  TonalProps,
} from '../../../core/contracts/ComponentContracts';

/**
 * ============================================================================
 * UXU PRIMITIVE — SLIDER
 * ============================================================================
 * Inspired by macOS Control Center Brightness/Volume bar & Material 3 Slider.
 *
 * SOLID Principles Applied:
 * - [LSP] Implements `FormControlContract<number>` for numeric range inputs.
 */

export interface SliderProps
  extends FormControlContract<number>,
    TonalProps,
    IconSlotProps {
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  valueSuffix?: string;
  showTicks?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  id,
  className = '',
  style,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  helperText,
  disabled = false,
  size = 'md',
  tone = 'primary',
  showValue = true,
  valueSuffix = '',
  showTicks = false,
  leadingIcon,
  trailingIcon,
}) => {
  const generatedId = useId();
  const sliderId = id ?? generatedId;

  const percentage = Math.max(
    0,
    Math.min(100, ((value - min) / (max - min || 1)) * 100)
  );

  const tickCount =
    showTicks && step > 0 ? Math.min(20, Math.floor((max - min) / step) + 1) : 0;

  return (
    <div
      className={`uxu-slider-group uxu-slider-group--${size} ${
        disabled ? 'uxu-slider-group--disabled' : ''
      } ${className}`}
      style={style}
    >
      {(label || showValue) && (
        <div className="uxu-slider-group__header">
          {label && (
            <label htmlFor={sliderId} className="uxu-slider-group__label">
              {label}
            </label>
          )}
          {showValue && (
            <span className="uxu-slider-group__value">
              {value}
              {valueSuffix}
            </span>
          )}
        </div>
      )}

      <div className="uxu-slider-track-row">
        {leadingIcon && (
          <span className="uxu-slider__icon">{leadingIcon}</span>
        )}

        <div className={`uxu-slider-container uxu-slider-container--${tone}`}>
          <div className="uxu-slider-rail">
            <div
              className="uxu-slider-fill"
              style={{ width: `${percentage}%` }}
            />
            {showTicks && tickCount > 1 && (
              <div className="uxu-slider-ticks">
                {Array.from({ length: tickCount }).map((_, idx) => (
                  <span key={idx} className="uxu-slider-tick" />
                ))}
              </div>
            )}
          </div>
          <span
            className="uxu-slider-thumb"
            style={{ left: `${percentage}%` }}
            aria-hidden="true"
          />
          <input
            id={sliderId}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(Number(e.target.value))}
            className="uxu-slider-native"
          />
        </div>

        {trailingIcon && (
          <span className="uxu-slider__icon">{trailingIcon}</span>
        )}
      </div>

      {helperText && (
        <div className="uxu-slider-group__helper">{helperText}</div>
      )}
    </div>
  );
};
