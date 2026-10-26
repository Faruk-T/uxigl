import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Sparkles,
  Layers,
  X,
} from 'lucide-react';
import type { IdentifiableProps } from '../../../core/contracts/ComponentContracts';
import type { ToastTone } from '../../../core/contracts/NotificationContract';

/**
 * ============================================================================
 * uxiGL PRIMITIVE — ALERT BANNER (INLINE SEMANTIC & LIQUID GLASS CALLOUT)
 * ============================================================================
 * Supports `primary`, `success`, `warning`, `danger`, `info`, `neutral`, `glass`
 * tones with optional dismiss button and action slot.
 */

export interface AlertProps extends IdentifiableProps {
  tone?: ToastTone;
  variant?: 'tonal' | 'outlined' | 'filled' | 'glass';
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  id,
  className = '',
  style,
  tone = 'info',
  variant = 'tonal',
  title,
  description,
  icon,
  action,
  dismissible = false,
  onDismiss,
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const defaultIcon = () => {
    switch (tone) {
      case 'success':
        return <CheckCircle2 size={18} />;
      case 'warning':
        return <AlertTriangle size={18} />;
      case 'danger':
        return <XCircle size={18} />;
      case 'info':
        return <Info size={18} />;
      case 'glass':
        return <Layers size={18} />;
      default:
        return <Sparkles size={18} />;
    }
  };

  return (
    <div
      id={id}
      role="alert"
      className={`uxu-alert uxu-alert--${tone} uxu-alert--${variant} ${className}`}
      style={style}
    >
      <div className="uxu-alert__icon">{icon ?? defaultIcon()}</div>
      <div className="uxu-alert__body">
        <div className="uxu-alert__title">{title}</div>
        {description && <div className="uxu-alert__desc">{description}</div>}
      </div>
      {action && <div className="uxu-alert__action">{action}</div>}
      {dismissible && (
        <button
          type="button"
          className="uxu-alert__close"
          aria-label="Uyarıyı kapat"
          onClick={() => {
            setDismissed(true);
            onDismiss?.();
          }}
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
};

