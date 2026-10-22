import React, { useState } from 'react';
import type { IdentifiableProps } from '../../../core/contracts/ComponentContracts';

/**
 * ============================================================================
 * uxiGL PRIMITIVE — TOOLTIP
 * ============================================================================
 * Apple macOS Sonoma translucent glass tooltip with optional keyboard shortcut badge.
 */

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps extends IdentifiableProps {
  content: React.ReactNode;
  shortcut?: string;
  placement?: TooltipPlacement;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({
  id,
  className = '',
  style,
  content,
  shortcut,
  placement = 'top',
  children,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <span
      id={id}
      className={`uxu-tooltip-wrapper ${className}`}
      style={style}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          className={`uxu-tooltip uxu-tooltip--${placement}`}
        >
          <span className="uxu-tooltip__text">{content}</span>
          {shortcut && <kbd className="uxu-tooltip__kbd">{shortcut}</kbd>}
        </span>
      )}
    </span>
  );
};
