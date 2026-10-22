import type { SemanticTone } from './ComponentContracts';

/**
 * ============================================================================
 * uxiGL DESIGN SYSTEM — NOTIFICATION / TOAST CONTRACT (DIP & ISP)
 * ============================================================================
 */

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  tone?: SemanticTone;
  durationMs?: number;
  actionLabel?: string;
  onAction?: () => void;
}

export type CreateToastInput = Omit<ToastItem, 'id'>;

/** [DIP] Abstract Notification Service Contract */
export interface INotificationService {
  toasts: ToastItem[];
  notify: (input: CreateToastInput) => string;
  dismiss: (id: string) => void;
  clearAll: () => void;
}
