import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type {
  DisableableProps,
  IconSlotProps,
  IdentifiableProps,
  LoadableProps,
  SizableProps,
} from '../../../core/contracts/ComponentContracts';

/**
 * ============================================================================
 * uxiGL PRIMITIVE — BUTTON (STANDARD, SWITCH-TOGGLE, COLLAPSE, SPLIT, ICON-ONLY)
 * ============================================================================
 * Apple HIG spring-press feedback + Google Material You tonal & filled surfaces.
 *
 * SOLID Principles Applied:
 * - [ISP] Composes `IdentifiableProps`, `DisableableProps`, `LoadableProps`,
 *   `SizableProps`, and `IconSlotProps`.
 * - [OCP] Extensible via `variant` registry, `toggleable`, `collapsible`,
 *   `splitAction`, and `leadingIcon`/`trailingIcon` slots.
 */

export type ButtonVariant =
  | 'filled'
  | 'tonal'
  | 'glass'
  | 'outlined'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'warning';

export interface SplitButtonMenuItem {
  id: string;
  label: string;
  description?: string;
  shortcut?: string;
  icon?: React.ReactNode;
  danger?: boolean;
  onClick?: () => void;
}

export interface ButtonProps
  extends Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      'id' | 'style' | 'onToggle'
    >,
    IdentifiableProps,
    DisableableProps,
    LoadableProps,
    SizableProps,
    IconSlotProps {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  iconOnly?: boolean;
  pill?: boolean;
  /** Switch / Toggle Button mode (`aria-pressed`) */
  toggleable?: boolean;
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  onToggle?: (pressed: boolean) => void;
  /** Shows a live status dot inside switch/action buttons */
  statusDot?: boolean;
  /** Collapse / Expand Action Button mode (`aria-expanded` + animated chevron) */
  collapsible?: boolean;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  onExpandChange?: (expanded: boolean) => void;
  /** Split Button mode (Primary action + attached dropdown menu trigger) */
  splitAction?: boolean;
  splitItems?: SplitButtonMenuItem[];
  onSplitSelect?: (itemId: string) => void;
  /** Optional counter or status badge inside the button */
  badgeCount?: number | string;
}

export const Button: React.FC<ButtonProps> = ({
  id,
  className = '',
  style,
  variant = 'filled',
  size = 'md',
  disabled = false,
  loading = false,
  loadingText,
  leadingIcon,
  trailingIcon,
  fullWidth = false,
  iconOnly = false,
  pill = false,
  toggleable = false,
  pressed: controlledPressed,
  defaultPressed = false,
  onPressedChange,
  onToggle,
  statusDot = false,
  collapsible = false,
  expanded: controlledExpanded,
  defaultExpanded = false,
  onExpandedChange,
  onExpandChange,
  splitAction = false,
  splitItems,
  onSplitSelect,
  badgeCount,
  type = 'button',
  onClick,
  children,
  ...rest
}) => {
  const [internalPressed, setInternalPressed] = useState<boolean>(defaultPressed);
  const [internalExpanded, setInternalExpanded] = useState<boolean>(defaultExpanded);
  const [splitMenuOpen, setSplitMenuOpen] = useState<boolean>(false);
  const splitContainerRef = useRef<HTMLDivElement>(null);

  const isPressed =
    controlledPressed !== undefined ? controlledPressed : internalPressed;
  const isExpanded =
    controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
  const isDisabled = disabled || loading;

  useEffect(() => {
    if (!splitMenuOpen) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        splitContainerRef.current &&
        !splitContainerRef.current.contains(event.target as Node)
      ) {
        setSplitMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [splitMenuOpen]);

  const handleMainClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) return;

    if (toggleable) {
      const nextPressed = !isPressed;
      if (controlledPressed === undefined) {
        setInternalPressed(nextPressed);
      }
      onPressedChange?.(nextPressed);
      onToggle?.(nextPressed);
    }

    if (collapsible) {
      const nextExpanded = !isExpanded;
      if (controlledExpanded === undefined) {
        setInternalExpanded(nextExpanded);
      }
      onExpandedChange?.(nextExpanded);
      onExpandChange?.(nextExpanded);
    }

    onClick?.(e);
  };

  const classes = [
    'uxu-btn',
    `uxu-btn--${variant}`,
    `uxu-btn--${size}`,
    fullWidth ? 'uxu-btn--full' : '',
    iconOnly ? 'uxu-btn--icon-only' : '',
    pill ? 'uxu-btn--pill' : '',
    loading ? 'uxu-btn--loading' : '',
    toggleable ? 'uxu-btn--toggleable' : '',
    toggleable && isPressed ? 'uxu-btn--pressed' : '',
    collapsible ? 'uxu-btn--collapsible' : '',
    collapsible && isExpanded ? 'uxu-btn--expanded' : '',
    splitAction ? 'uxu-btn--split-main' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const mainButton = (
    <button
      id={id}
      type={type}
      className={classes}
      style={splitAction ? undefined : style}
      disabled={isDisabled}
      aria-busy={loading}
      aria-pressed={toggleable ? isPressed : undefined}
      aria-expanded={collapsible ? isExpanded : undefined}
      onClick={handleMainClick}
      {...rest}
    >
      {loading && (
        <span className="uxu-btn__spinner" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" className="uxu-spinner-svg">
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="42 24"
            />
          </svg>
        </span>
      )}

      {!loading && (statusDot || toggleable) && (
        <span
          className={`uxu-btn__status-dot ${
            toggleable
              ? isPressed
                ? 'uxu-btn__status-dot--on'
                : 'uxu-btn__status-dot--off'
              : 'uxu-btn__status-dot--on'
          }`}
          aria-hidden="true"
        />
      )}

      {!loading && leadingIcon && (
        <span className="uxu-btn__icon uxu-btn__icon--leading">
          {leadingIcon}
        </span>
      )}

      {(!iconOnly || loadingText) && (
        <span className="uxu-btn__label">
          {loading && loadingText ? loadingText : children}
        </span>
      )}

      {iconOnly && !loading && !leadingIcon && children}

      {badgeCount !== undefined && !iconOnly && (
        <span className="uxu-btn__badge">{badgeCount}</span>
      )}

      {toggleable && !iconOnly && (
        <span
          className={`uxu-btn__state-pill ${
            isPressed ? 'uxu-btn__state-pill--on' : 'uxu-btn__state-pill--off'
          }`}
        >
          {isPressed ? 'AÇIK' : 'KAPALI'}
        </span>
      )}

      {!loading && trailingIcon && (
        <span className="uxu-btn__icon uxu-btn__icon--trailing">
          {trailingIcon}
        </span>
      )}

      {!loading && collapsible && !iconOnly && (
        <span
          className={`uxu-btn__chevron ${
            isExpanded ? 'uxu-btn__chevron--expanded' : ''
          }`}
          aria-hidden="true"
        >
          <ChevronDown size={size === 'xs' ? 13 : size === 'sm' ? 14 : 16} />
        </span>
      )}
    </button>
  );

  if (!splitAction) {
    return mainButton;
  }

  const resolvedSplitItems: SplitButtonMenuItem[] =
    splitItems && splitItems.length > 0
      ? splitItems
      : [
          {
            id: 'deploy-prod',
            label: 'Production Kümesine Dağıt',
            description: 'Sıfır kesintili (Blue/Green) canlı yayın',
            shortcut: '⌘↵',
          },
          {
            id: 'deploy-staging',
            label: 'Staging Ortamında Test Et',
            description: 'Ön izleme ve entegrasyon doğrulaması',
            shortcut: '⌥↵',
          },
          {
            id: 'schedule-release',
            label: 'Zamanlanmış Yayın Planla',
            description: 'Gece 03:00 bakım penceresine kuyrukla',
          },
          {
            id: 'rollback',
            label: 'Önceki Sürüme Geri Dön (Rollback)',
            danger: true,
          },
        ];

  const triggerClasses = [
    'uxu-btn',
    `uxu-btn--${variant}`,
    `uxu-btn--${size}`,
    pill ? 'uxu-btn--pill' : '',
    'uxu-btn--split-trigger',
    splitMenuOpen ? 'uxu-btn--split-trigger-open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={splitContainerRef}
      className={`uxu-btn-split-group ${
        fullWidth ? 'uxu-btn-split-group--full' : ''
      }`}
      style={style}
    >
      {mainButton}
      <button
        type="button"
        className={triggerClasses}
        disabled={isDisabled}
        aria-label="Ek aksiyon seçenekleri"
        aria-haspopup="menu"
        aria-expanded={splitMenuOpen}
        onClick={(e) => {
          e.stopPropagation();
          if (!isDisabled) {
            setSplitMenuOpen((prev) => !prev);
          }
        }}
      >
        <ChevronDown
          size={size === 'xs' ? 13 : size === 'sm' ? 14 : 16}
          className={`uxu-btn__chevron ${
            splitMenuOpen ? 'uxu-btn__chevron--expanded' : ''
          }`}
        />
      </button>

      {splitMenuOpen && (
        <div className="uxu-btn-split-menu" role="menu">
          {resolvedSplitItems.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              className={`uxu-btn-split-menu__item ${
                item.danger ? 'uxu-btn-split-menu__item--danger' : ''
              }`}
              onClick={() => {
                item.onClick?.();
                onSplitSelect?.(item.id);
                setSplitMenuOpen(false);
              }}
            >
              <div className="uxu-btn-split-menu__left">
                {item.icon && (
                  <span className="uxu-btn-split-menu__icon">{item.icon}</span>
                )}
                <div className="uxu-btn-split-menu__texts">
                  <span className="uxu-btn-split-menu__label">{item.label}</span>
                  {item.description && (
                    <span className="uxu-btn-split-menu__desc">
                      {item.description}
                    </span>
                  )}
                </div>
              </div>
              {item.shortcut && (
                <kbd className="uxu-btn-split-menu__kbd">{item.shortcut}</kbd>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
