import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import type { IdentifiableProps } from '../../../core/contracts/ComponentContracts';
import { useKeyboardShortcut } from '../../../hooks/useKeyboardShortcut';

/**
 * ============================================================================
 * UXU COMPOSITE — MODAL / DIALOG SHEET
 * ============================================================================
 * Combines macOS Sonoma sheet vibrancy with Material Design 3 Dialog structure.
 *
 * SOLID Principles Applied:
 * - [SRP] Delegates Escape key listening to `useKeyboardShortcut`.
 * - [OCP] Header icon, actions, and footer slots are fully composable.
 */

export interface ModalProps extends IdentifiableProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  showMacTrafficLights?: boolean;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  id,
  className = '',
  style,
  open,
  onClose,
  title,
  subtitle,
  icon,
  footer,
  size = 'md',
  showMacTrafficLights = false,
  children,
}) => {
  useKeyboardShortcut('Escape', onClose, { enabled: open });

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="uxu-modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        id={id}
        role="dialog"
        aria-modal="true"
        className={`uxu-modal uxu-modal--${size} ${className}`}
        style={style}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="uxu-modal__header">
          <div className="uxu-modal__header-left">
            {showMacTrafficLights && (
              <div className="uxu-traffic-lights" aria-hidden="true">
                <span
                  className="uxu-traffic-light uxu-traffic-light--close"
                  onClick={onClose}
                />
                <span className="uxu-traffic-light uxu-traffic-light--min" />
                <span className="uxu-traffic-light uxu-traffic-light--max" />
              </div>
            )}
            {icon && <div className="uxu-modal__icon">{icon}</div>}
            <div>
              {title && <h2 className="uxu-modal__title">{title}</h2>}
              {subtitle && <p className="uxu-modal__subtitle">{subtitle}</p>}
            </div>
          </div>

          <button
            type="button"
            className="uxu-modal__close"
            onClick={onClose}
            aria-label="Pencereyi kapat"
          >
            <X size={18} />
          </button>
        </div>

        <div className="uxu-modal__body">{children}</div>

        {footer && <div className="uxu-modal__footer">{footer}</div>}
      </div>
    </div>
  );
};
