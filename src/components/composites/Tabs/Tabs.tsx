import React from 'react';
import type {
  IdentifiableProps,
  SizableProps,
} from '../../../core/contracts/ComponentContracts';
import { RouteService } from '../../../core/services/RouteService';

/**
 * ============================================================================
 * UXU COMPOSITE — TABS
 * ============================================================================
 * Material Design 3 Primary & Secondary Tabs with active indicator bar.
 */

export interface TabItem {
  id: string;
  label: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
  count?: number;
  disabled?: boolean;
}

export interface TabsProps extends IdentifiableProps, SizableProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  variant?: 'underline' | 'pill';
}

export const Tabs: React.FC<TabsProps> = ({
  id,
  className = '',
  style,
  items,
  activeId,
  onChange,
  size = 'md',
  variant = 'underline',
}) => {
  return (
    <div
      id={id}
      role="tablist"
      className={`uxu-tabs uxu-tabs--${variant} uxu-tabs--${size} ${className}`}
      style={style}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        const inner = (
          <>
            {item.icon && <span className="uxu-tabs__icon">{item.icon}</span>}
            <span className="uxu-tabs__label">{item.label}</span>
            {item.count !== undefined && (
              <span className="uxu-tabs__count">{item.count}</span>
            )}
            {variant === 'underline' && isActive && (
              <span className="uxu-tabs__indicator" aria-hidden="true" />
            )}
          </>
        );

        if (item.href && !item.disabled) {
          return (
            <a
              key={item.id}
              href={item.href}
              title={item.href}
              role="tab"
              aria-selected={isActive}
              onClick={(e) => {
                if (RouteService.isModifiedClick(e)) return;
                e.preventDefault();
                onChange(item.id);
              }}
              className={`uxu-tabs__tab ${
                isActive ? 'uxu-tabs__tab--active' : ''
              }`}
            >
              {inner}
            </a>
          );
        }

        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={item.disabled}
            onClick={() => !item.disabled && onChange(item.id)}
            className={`uxu-tabs__tab ${
              isActive ? 'uxu-tabs__tab--active' : ''
            }`}
          >
            {inner}
          </button>
        );
      })}
    </div>
  );
};
