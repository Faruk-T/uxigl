import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import type { IdentifiableProps } from '../../../core/contracts/ComponentContracts';

/**
 * ============================================================================
 * uxiGL COMPOSITE — ENTERPRISE DRAWER (OFFCANVAS PANEL)
 * ============================================================================
 * Supports `right`, `left`, and `bottom` slide-over placements with Liquid
 * Glass / Material 3 surfaces, keyboard ESC dismissal, and footer actions.
 */

export type DrawerPlacement = 'right' | 'left' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl';

export interface DrawerProps extends IdentifiableProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  placement?: DrawerPlacement;
  size?: DrawerSize;
  variant?: 'glass' | 'elevated' | 'tonal';
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  id,
  className = '',
  style,
  open,
  onClose,
  title,
  subtitle,
  badge,
  icon,
  placement = 'right',
  size = 'md',
  variant = 'glass',
  footer,
  children,
}) => {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={`uxu-drawer-overlay uxu-drawer-overlay--${placement}`}
      onClick={onClose}
      role="presentation"
    >
      <aside
        id={id}
        style={style}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={[
          'uxu-drawer-panel',
          `uxu-drawer-panel--${placement}`,
          `uxu-drawer-panel--${size}`,
          `uxu-drawer-panel--${variant}`,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="uxu-drawer-panel__header">
          <div className="uxu-drawer-panel__header-left">
            {icon && <div className="uxu-modal__icon">{icon}</div>}
            <div className="uxu-drawer-panel__title-group">
              {badge && <span className="uxu-drawer-panel__badge">{badge}</span>}
              <h3 className="uxu-drawer-panel__title">{title}</h3>
              {subtitle && (
                <p className="uxu-drawer-panel__subtitle">{subtitle}</p>
              )}
            </div>
          </div>

          <button
            type="button"
            className="uxu-modal__close"
            onClick={onClose}
            aria-label="Çekmeceyi kapat"
          >
            <X size={18} />
          </button>
        </div>

        <div className="uxu-drawer-panel__body">{children}</div>

        {footer && <div className="uxu-drawer-panel__footer">{footer}</div>}
      </aside>
    </div>
  );
};
