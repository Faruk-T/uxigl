import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  Sparkles,
  X,
} from 'lucide-react';
import type {
  CreateToastInput,
  INotificationService,
  ToastItem,
} from '../core/contracts/NotificationContract';

/**
 * ============================================================================
 * uxiGL DESIGN SYSTEM — DYNAMIC ISLAND / MATERIAL SNACKBAR TOAST PROVIDER
 * ============================================================================
 * [DIP] Implements `INotificationService` contract.
 * [SRP] Decouples notification state queuing from visual toast rendering.
 */

const ToastContext = createContext<INotificationService | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback(
    (input: CreateToastInput): string => {
      const id = `uxu-toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const durationMs = input.durationMs ?? 4200;
      const newToast: ToastItem = {
        ...input,
        id,
        tone: input.tone ?? 'primary',
        durationMs,
      };

      setToasts((prev) => [...prev.slice(-4), newToast]);

      if (durationMs > 0) {
        window.setTimeout(() => {
          dismiss(id);
        }, durationMs);
      }

      return id;
    },
    [dismiss]
  );

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value = useMemo<INotificationService>(
    () => ({ toasts, notify, dismiss, clearAll }),
    [toasts, notify, dismiss, clearAll]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

interface ToastViewportProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

const ToastViewport: React.FC<ToastViewportProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  const getToneIcon = (tone: ToastItem['tone']) => {
    switch (tone) {
      case 'success':
        return <CheckCircle2 size={18} className="uxu-toast-icon--success" />;
      case 'warning':
        return <AlertTriangle size={18} className="uxu-toast-icon--warning" />;
      case 'danger':
        return <XCircle size={18} className="uxu-toast-icon--danger" />;
      case 'info':
        return <Info size={18} className="uxu-toast-icon--info" />;
      default:
        return <Sparkles size={18} className="uxu-toast-icon--primary" />;
    }
  };

  return (
    <div
      className="uxu-toast-viewport"
      role="region"
      aria-label="Sistem Bildirimleri"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`uxu-toast uxu-toast--${toast.tone ?? 'primary'}`}
          role="status"
        >
          <div className="uxu-toast__leading">{getToneIcon(toast.tone)}</div>
          <div className="uxu-toast__content">
            <div className="uxu-toast__title">{toast.title}</div>
            {toast.description && (
              <div className="uxu-toast__desc">{toast.description}</div>
            )}
          </div>
          {toast.actionLabel && toast.onAction && (
            <button
              type="button"
              className="uxu-toast__action"
              onClick={() => {
                toast.onAction?.();
                onDismiss(toast.id);
              }}
            >
              {toast.actionLabel}
            </button>
          )}
          <button
            type="button"
            className="uxu-toast__close"
            onClick={() => onDismiss(toast.id)}
            aria-label="Bildirimi kapat"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
};

export function useToast(): INotificationService {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider />');
  }
  return ctx;
}
