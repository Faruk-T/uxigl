import React from 'react';
import type {
  ComponentSize,
  IdentifiableProps,
  SemanticTone,
} from '../../../core/contracts/ComponentContracts';
import type { GoogleIconStyle } from '../../../core/contracts/ThemeContract';
import { renderGoogleIconFallback } from './googleIconSvgFallback';

export interface GoogleIconProps extends IdentifiableProps {
  /** Official Google Material Symbol ligature name (e.g. 'auto_awesome', 'dashboard', 'palette', 'bolt') */
  name: string;
  /** Variable font family variant ('rounded' | 'outlined' | 'sharp'). Defaults to active theme iconStyle */
  iconStyle?: GoogleIconStyle;
  /** Variable FILL axis (true = 1, false = 0). Defaults to active theme iconFilled */
  filled?: boolean;
  /** Variable weight axis (100..700). Defaults to active theme iconWeight */
  weight?: number;
  /** Variable grade axis (-25..200). Defaults to active theme optical grade */
  grade?: number;
  /** Semantic size preset ('xs' | 'sm' | 'md' | 'lg') or exact pixel number */
  size?: ComponentSize | number;
  /** Optional semantic color tone */
  tone?: SemanticTone | 'inherit' | 'muted';
  /** Accessible title (if omitted, icon is treated as decorative aria-hidden) */
  title?: string;
}

const MATERIAL_SYMBOLS_HREF =
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap';

let stylesheetInjected = false;
let isFontLoadedGlobal = false;
const fontLoadSubscribers = new Set<() => void>();

function checkMaterialFontActuallyReady(iconStyle?: GoogleIconStyle): boolean {
  if (typeof document === 'undefined' || !('fonts' in document) || !document.fonts) {
    return false;
  }
  try {
    const wantedFamily =
      iconStyle === 'outlined'
        ? 'Material Symbols Outlined'
        : iconStyle === 'sharp'
          ? 'Material Symbols Sharp'
          : 'Material Symbols Rounded';

    for (const face of Array.from(document.fonts)) {
      const cleanFamily = String(face.family || '').replace(/['"]/g, '').trim();
      if (cleanFamily === wantedFamily && face.status === 'loaded') {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}

function ensureMaterialSymbolsStylesheet(): void {
  if (typeof document === 'undefined') return;

  if (checkMaterialFontActuallyReady()) {
    isFontLoadedGlobal = true;
    return;
  }

  if (stylesheetInjected) return;
  stylesheetInjected = true;

  const existing = document.querySelector(
    'link[href*="Material+Symbols+Outlined"], link[href*="Material+Symbols+Rounded"]'
  );
  if (!existing && document.head) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = MATERIAL_SYMBOLS_HREF;
    document.head.appendChild(link);
  }

  if ('fonts' in document && typeof document.fonts.load === 'function') {
    const notifyIfLoaded = () => {
      if (!isFontLoadedGlobal && checkMaterialFontActuallyReady()) {
        isFontLoadedGlobal = true;
        document.documentElement.classList.remove('uxu-icon-fonts-loading');
        document.documentElement.classList.add('uxu-icon-fonts-loaded');
        fontLoadSubscribers.forEach((cb) => cb());
        fontLoadSubscribers.clear();
      }
    };

    document.fonts
      .load('20px "Material Symbols Rounded"')
      .then(notifyIfLoaded)
      .catch(() => {});

    document.fonts.addEventListener?.('loadingdone', notifyIfLoaded);
  }
}

export const GoogleIcon: React.FC<GoogleIconProps> = ({
  id,
  className = '',
  style,
  name,
  iconStyle,
  filled,
  weight,
  grade,
  size = 'md',
  tone = 'inherit',
  title,
}) => {
  const [fontReady, setFontReady] = React.useState<boolean>(() =>
    checkMaterialFontActuallyReady(iconStyle)
  );

  React.useEffect(() => {
    ensureMaterialSymbolsStylesheet();
    if (checkMaterialFontActuallyReady(iconStyle)) {
      isFontLoadedGlobal = true;
      setFontReady(true);
      return;
    }
    const onReady = () => {
      if (checkMaterialFontActuallyReady(iconStyle)) {
        setFontReady(true);
      }
    };
    fontLoadSubscribers.add(onReady);
    return () => {
      fontLoadSubscribers.delete(onReady);
    };
  }, [iconStyle]);

  const pxSize =
    typeof size === 'number'
      ? size
      : size === 'xs'
      ? 16
      : size === 'sm'
      ? 18
      : size === 'lg'
      ? 24
      : 20;

  const opticalSize = Math.max(20, Math.min(48, Math.round(pxSize)));

  if (!fontReady) {
    const fallbackClasses = [
      'uxu-google-icon-svg-fallback',
      tone !== 'inherit' ? `uxu-google-icon--${tone}` : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <span
        id={id}
        className={fallbackClasses}
        role={title ? 'img' : undefined}
        aria-label={title}
        aria-hidden={title ? undefined : 'true'}
        title={title}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: `${pxSize}px`,
          height: `${pxSize}px`,
          lineHeight: 1,
          flexShrink: 0,
          ...style,
        }}
      >
        {renderGoogleIconFallback(name, pxSize)}
      </span>
    );
  }

  const fontFamilyOverride =
    iconStyle === 'outlined'
      ? "'Material Symbols Outlined'"
      : iconStyle === 'sharp'
      ? "'Material Symbols Sharp'"
      : iconStyle === 'rounded'
      ? "'Material Symbols Rounded'"
      : undefined;

  const classes = [
    'uxu-google-icon',
    'uxu-google-icon--ready',
    tone !== 'inherit' ? `uxu-google-icon--${tone}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      id={id}
      className={classes}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : 'true'}
      title={title}
      style={
        {
          fontSize: `${pxSize}px`,
          width: `${pxSize}px`,
          height: `${pxSize}px`,
          ...(fontFamilyOverride
            ? { '--uxu-icon-font-family': fontFamilyOverride }
            : {}),
          ...(typeof filled === 'boolean'
            ? { '--uxu-icon-fill': filled ? '1' : '0' }
            : {}),
          ...(typeof weight === 'number'
            ? { '--uxu-icon-weight': String(weight) }
            : {}),
          ...(typeof grade === 'number'
            ? { '--uxu-icon-grade': String(grade) }
            : {}),
          '--uxu-icon-opsz': String(opticalSize),
          ...style,
        } as React.CSSProperties
      }
    >
      {name}
    </span>
  );
};
