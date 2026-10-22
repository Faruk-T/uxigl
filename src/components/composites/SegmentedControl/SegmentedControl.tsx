import React from 'react';
import type { FormControlContract } from '../../../core/contracts/ComponentContracts';
import { RouteService } from '../../../core/services/RouteService';

/**
 * ============================================================================
 * uxiGL COMPOSITE — SEGMENTED CONTROL
 * ============================================================================
 * Signature Apple HIG Segmented Control with tactile sliding active pill.
 *
 * SOLID Principles Applied:
 * - [LSP] Implements `FormControlContract<T>` for single-choice selection.
 */

export interface SegmentedOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string = string>
  extends FormControlContract<T> {
  options: SegmentedOption<T>[];
  fullWidth?: boolean;
}

export function SegmentedControl<T extends string = string>({
  id,
  className = '',
  style,
  value,
  onChange,
  options,
  size = 'md',
  disabled = false,
  fullWidth = false,
  label,
}: SegmentedControlProps<T>) {
  const activeIndex = Math.max(
    0,
    options.findIndex((opt) => opt.value === value)
  );

  return (
    <div
      id={id}
      className={`uxu-segmented-wrapper ${
        fullWidth ? 'uxu-segmented-wrapper--full' : ''
      } ${className}`}
      style={style}
    >
      {label && <div className="uxu-field__label">{label}</div>}
      <div
        role="tablist"
        className={`uxu-segmented uxu-segmented--${size} ${
          fullWidth ? 'uxu-segmented--full' : ''
        } ${disabled ? 'uxu-segmented--disabled' : ''}`}
        style={
          {
            '--segment-count': options.length,
            '--active-index': activeIndex,
          } as React.CSSProperties
        }
      >
        <div className="uxu-segmented__thumb" aria-hidden="true" />
        {options.map((option) => {
          const isSelected = option.value === value;
          const isOptionDisabled = disabled || option.disabled;
          const inner = (
            <>
              {option.icon && (
                <span className="uxu-segmented__icon">{option.icon}</span>
              )}
              <span className="uxu-segmented__label">{option.label}</span>
              {option.badge !== undefined && (
                <span className="uxu-segmented__badge">{option.badge}</span>
              )}
            </>
          );

          if (option.href && !isOptionDisabled) {
            return (
              <a
                key={option.value}
                href={option.href}
                title={option.href}
                role="tab"
                aria-selected={isSelected}
                className={`uxu-segmented__item ${
                  isSelected ? 'uxu-segmented__item--active' : ''
                }`}
                onClick={(e) => {
                  if (RouteService.isModifiedClick(e)) return;
                  e.preventDefault();
                  onChange(option.value);
                }}
              >
                {inner}
              </a>
            );
          }

          return (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={isSelected}
              disabled={isOptionDisabled}
              className={`uxu-segmented__item ${
                isSelected ? 'uxu-segmented__item--active' : ''
              }`}
              onClick={() => !isOptionDisabled && onChange(option.value)}
            >
              {inner}
            </button>
          );
        })}
      </div>
    </div>
  );
}
