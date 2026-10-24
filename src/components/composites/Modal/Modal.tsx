import React, { useEffect } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Sparkles,
} from 'lucide-react';
import type {
  IdentifiableProps,
  SemanticTone,
} from '../../../core/contracts/ComponentContracts';
import { useKeyboardShortcut } from '../../../hooks/useKeyboardShortcut';

/**
 * ============================================================================
 * uxiGL COMPOSITE — MODAL / ALERT / CONFIRMATION / SHEET DIALOG
 * ============================================================================
 * Combines macOS Sonoma sheet vibrancy with Material Design 3 Dialog structure.
 *
 * SOLID Principles Applied:
 * - [SRP] Delegates Escape key listening to `useKeyboardShortcut`.
 * - [OCP] Supports `default`, `alert`, `confirm`, `danger`, `sheet`, `glass`
 *   variants and semantic tones.
 */

export type ModalVariant =
  | 'default'
  | 'alert'
  | 'confirm'
  | 'danger'
  | 'sheet'
  | 'glass';

export interface ModalProps extends IdentifiableProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: ModalVariant;
  tone?: SemanticTone | 'glass';
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
  variant = 'default',
  tone = 'primary',
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

  const resolvedTone = variant === 'danger' ? 'danger' : tone;

  const getDefaultModalIcon = () => {
    if (icon) return icon;
    if (variant === 'default') return null;
    switch (resolvedTone) {
      case 'success':
        return <CheckCircle2 size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'danger':
        return <XCircle size={20} />;
      case 'info':
        return <Info size={20} />;
      default:
        return <Sparkles size={20} />;
    }
  };

  const modalIcon = getDefaultModalIcon();

  return (
    <div
      className={`uxu-modal-backdrop ${
        variant === 'sheet' ? 'uxu-modal-backdrop--sheet' : ''
      }`}
      onClick={onClose}
      role="presentation"
    >
      <div
        id={id}
        role={variant === 'alert' || variant === 'danger' ? 'alertdialog' : 'dialog'}
        aria-modal="true"
        className={`uxu-modal uxu-modal--${size} uxu-modal--variant-${variant} uxu-modal--tone-${resolvedTone} ${className}`}
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
            {modalIcon && (
              <div
                className={`uxu-modal__icon uxu-modal__icon--${resolvedTone}`}
              >
                {modalIcon}
              </div>
            )}
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
