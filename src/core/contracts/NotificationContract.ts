import type { SemanticTone } from './ComponentContracts';

/**
 * ============================================================================
 * uxiGL DESIGN SYSTEM — NOTIFICATION / TOAST CONTRACT (DIP & ISP)
 * ============================================================================
 */

export type ToastPlacement =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center';

export type ToastTone = SemanticTone | 'glass';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  tone?: ToastTone;
  placement?: ToastPlacement;
  durationMs?: number;
  actionLabel?: string;
  onAction?: () => void;
}

export type CreateToastInput = Omit<ToastItem, 'id'>;

/** [DIP] Abstract Notification Service Contract */
export interface INotificationService {
  toasts: ToastItem[];
  defaultPlacement: ToastPlacement;
  setDefaultPlacement: (placement: ToastPlacement) => void;
  notify: (input: CreateToastInput) => string;
  dismiss: (id: string) => void;
  clearAll: () => void;
}
