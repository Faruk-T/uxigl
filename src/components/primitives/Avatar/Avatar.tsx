import React, { useState } from 'react';
import type {
  IdentifiableProps,
  SizableProps,
  TonalProps,
} from '../../../core/contracts/ComponentContracts';

/**
 * ============================================================================
 * uxiGL PRIMITIVE — AVATAR & AVATAR GROUP
 * ============================================================================
 * Supports squircle (Apple iOS) or circle (Material You) geometry, initials
 * fallback, and live presence status ring.
 */

export type PresenceStatus = 'online' | 'busy' | 'away' | 'offline';

export interface AvatarProps
  extends IdentifiableProps,
    SizableProps,
    TonalProps {
  src?: string;
  alt?: string;
  name?: string;
  status?: PresenceStatus;
  shape?: 'circle' | 'squircle';
}

function getInitials(name?: string): string {
  if (!name) return 'UX';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export const Avatar: React.FC<AvatarProps> = ({
  id,
  className = '',
  style,
  src,
  alt,
  name,
  size = 'md',
  tone = 'primary',
  status,
  shape = 'squircle',
}) => {
  const [imgError, setImgError] = useState(false);

  const classes = [
    'uxu-avatar',
    `uxu-avatar--${size}`,
    `uxu-avatar--${tone}`,
    `uxu-avatar--${shape}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div id={id} className={classes} style={style} title={name ?? alt}>
      {src && !imgError ? (
        <img
          src={src}
          alt={alt ?? name ?? 'Avatar'}
          className="uxu-avatar__img"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="uxu-avatar__initials">{getInitials(name)}</span>
      )}
      {status && (
        <span
          className={`uxu-avatar__status uxu-avatar__status--${status}`}
          aria-label={`Durum: ${status}`}
        />
      )}
    </div>
  );
};

export interface AvatarGroupProps extends IdentifiableProps, SizableProps {
  children: React.ReactNode;
  max?: number;
  shape?: 'circle' | 'squircle';
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  id,
  className = '',
  style,
  children,
  max = 4,
  size = 'md',
  shape = 'squircle',
}) => {
  const items = React.Children.toArray(children);
  const visibleItems = items.slice(0, max);
  const overflowCount = items.length - visibleItems.length;

  return (
    <div id={id} className={`uxu-avatar-group ${className}`} style={style}>
      {visibleItems}
      {overflowCount > 0 && (
        <div
          className={`uxu-avatar uxu-avatar--${size} uxu-avatar--neutral uxu-avatar--${shape} uxu-avatar--overflow`}
        >
          <span className="uxu-avatar__initials">+{overflowCount}</span>
        </div>
      )}
    </div>
  );
};
