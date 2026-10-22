import type { ReactNode, CSSProperties } from 'react';

/**
 * ============================================================================
 * UXU DESIGN SYSTEM — INTERFACE SEGREGATION & LISKOV SUBSTITUTION CONTRACTS
 * ============================================================================
 * Adheres to:
 * - [I] Interface Segregation Principle (ISP): Small, role-focused interfaces
 *   instead of a single monolithic props interface.
 * - [L] Liskov Substitution Principle (LSP): Standardized contracts for Form
 *   Controls (`FormControlContract<T>`) and Surfaces (`SurfaceContract`) so any
 *   conforming component can substitute another without breaking callers.
 */

export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type SemanticTone =
  | 'primary'
  | 'secondary'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export type SurfaceVariant = 'glass' | 'tonal' | 'elevated' | 'outlined' | 'flat';

/**
 * Apple HIG Material Hierarchy:
 * - Standard Materials (Content Layer): 'ultraThin' | 'thin' | 'regular' | 'thick'
 * - Liquid Glass (Floating Control & Navigation Layer): 'liquid-regular' | 'liquid-clear'
 */
export type AppleMaterialThickness =
  | 'ultraThin'
  | 'thin'
  | 'regular'
  | 'thick'
  | 'liquid-regular'
  | 'liquid-clear';

/** [ISP] Base identification & styling contract */
export interface IdentifiableProps {
  id?: string;
  className?: string;
  style?: CSSProperties;
  'data-testid'?: string;
}

/** [ISP] Contract for components that can be disabled */
export interface DisableableProps {
  disabled?: boolean;
}

/** [ISP] Contract for components with asynchronous loading states */
export interface LoadableProps {
  loading?: boolean;
  loadingText?: string;
}

/** [ISP] Contract for components supporting standardized UXU sizing */
export interface SizableProps {
  size?: ComponentSize;
}

/** [ISP] Contract for components supporting semantic color tones */
export interface TonalProps {
  tone?: SemanticTone;
}

/** [ISP] Contract for icon composition slots (Open/Closed Principle) */
export interface IconSlotProps {
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

/** [ISP] Contract for dismissible/closable elements */
export interface DismissibleProps {
  dismissible?: boolean;
  onDismiss?: () => void;
}

/**
 * [LSP] Unified Form Control Contract
 * Any UXU form control (Input, Switch, Slider, Checkbox, SegmentedControl)
 * implements this generic contract so form containers can treat them polymorphically.
 */
export interface FormControlContract<TValue>
  extends IdentifiableProps,
    DisableableProps,
    SizableProps {
  value: TValue;
  onChange: (nextValue: TValue) => void;
  label?: ReactNode;
  helperText?: ReactNode;
  errorText?: ReactNode;
  required?: boolean;
  name?: string;
}

/**
 * [LSP] Unified Surface Container Contract
 * Any surface container (Card, GlassPanel, TonalPanel, StatCard) implements
 * this contract for consistent elevation, blur, and interactive behavior.
 */
export interface SurfaceContract extends IdentifiableProps {
  variant?: SurfaceVariant;
  material?: AppleMaterialThickness;
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: ReactNode;
  onClick?: () => void;
}

/**
 * Documentation & SOLID metadata contract for the interactive catalog
 */
export interface PropDocItem {
  name: string;
  type: string;
  defaultValue: string;
  required?: boolean;
  description: string;
}

export interface SolidPrincipleMapping {
  principle: 'SRP' | 'OCP' | 'LSP' | 'ISP' | 'DIP';
  title: string;
  explanation: string;
}
