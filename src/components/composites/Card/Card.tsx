import React from 'react';
import type { SurfaceContract } from '../../../core/contracts/ComponentContracts';

/**
 * ============================================================================
 * UXU COMPOSITE — CARD (SURFACE CONTAINER)
 * ============================================================================
 * Fuses Apple visionOS / macOS Sonoma glass vibrancy (`variant="glass"`) with
 * Google Material You tonal surface containers (`variant="tonal"`).
 *
 * SOLID Principles Applied:
 * - [LSP] Implements `SurfaceContract` so any surface container can substitute
 *   another seamlessly.
 * - [OCP] Open for composition via `title`, `subtitle`, `headerAction`, `media`,
 *   and `footer` slots without modifying internal layout logic.
 */

export interface CardProps extends SurfaceContract {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  eyebrow?: React.ReactNode;
  headerIcon?: React.ReactNode;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  glowOnHover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  id,
  className = '',
  style,
  variant = 'glass',
  material,
  interactive = false,
  padding = 'md',
  title,
  subtitle,
  eyebrow,
  headerIcon,
  headerAction,
  footer,
  glowOnHover = false,
  onClick,
  children,
}) => {
  const classes = [
    'uxu-card',
    `uxu-card--${variant}`,
    material ? `uxu-material--${material}` : '',
    `uxu-card--pad-${padding}`,
    interactive || Boolean(onClick) ? 'uxu-card--interactive' : '',
    glowOnHover ? 'uxu-card--glow' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const hasHeader = Boolean(
    title || subtitle || eyebrow || headerIcon || headerAction
  );

  return (
    <div
      id={id}
      style={style}
      className={classes}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {hasHeader && (
        <div className="uxu-card__header">
          <div className="uxu-card__header-main">
            {headerIcon && (
              <div className="uxu-card__header-icon">{headerIcon}</div>
            )}
            <div className="uxu-card__titles">
              {eyebrow && <div className="uxu-card__eyebrow">{eyebrow}</div>}
              {title && <h3 className="uxu-card__title">{title}</h3>}
              {subtitle && <p className="uxu-card__subtitle">{subtitle}</p>}
            </div>
          </div>
          {headerAction && (
            <div className="uxu-card__header-action">{headerAction}</div>
          )}
        </div>
      )}

      <div className="uxu-card__body">{children}</div>

      {footer && <div className="uxu-card__footer">{footer}</div>}
    </div>
  );
};
