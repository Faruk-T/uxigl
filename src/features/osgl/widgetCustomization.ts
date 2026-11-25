import type React from 'react';
import type { WidgetSize } from './types';

export type WidgetSurfaceStyle = 'glass' | 'solid' | 'tinted';

export interface WidgetCustomOption {
  value: string;
  label: string;
  swatch?: string;
}

export interface WidgetCustomField {
  key: string;
  label: string;
  options: ReadonlyArray<WidgetCustomOption>;
  defaultValue: string;
}

export interface WidgetSizePreset {
  id: 'small' | 'medium' | 'large';
  label: string;
  size: WidgetSize;
}

export interface WidgetUserPrefs {
  surfaceStyle?: WidgetSurfaceStyle;
  accentHex?: string;
  customTitle?: string;
  options?: Record<string, string>;
}

export const WIDGET_ACCENT_SWATCHES: ReadonlyArray<{ hex: string; label: string }> = [
  { hex: '', label: 'Tema Rengi' },
  { hex: '#0a84ff', label: 'Mavi' },
  { hex: '#10b981', label: 'Zümrüt' },
  { hex: '#f59e0b', label: 'Kehribar' },
  { hex: '#ec4899', label: 'Fuşya' },
  { hex: '#8b5cf6', label: 'Mor' },
  { hex: '#ef4444', label: 'Mercan' },
];

export function buildDefaultSizePresets(defaultSize: WidgetSize): ReadonlyArray<WidgetSizePreset> {
  return [
    { id: 'small', label: 'Küçük', size: { width: 260, height: 120 } },
    { id: 'medium', label: 'Orta', size: defaultSize },
    {
      id: 'large',
      label: 'Geniş',
      size: {
        width: Math.min(460, Math.max(380, defaultSize.width + 96)),
        height: Math.min(360, Math.max(260, defaultSize.height + 88)),
      },
    },
  ];
}

export function resolveCustomizedWidgetCardStyle({
  baseCardStyle,
  isDark,
  effectiveAccent,
  prefs,
}: {
  baseCardStyle: React.CSSProperties;
  isDark: boolean;
  effectiveAccent: string;
  prefs?: WidgetUserPrefs;
}): React.CSSProperties {
  const surface = prefs?.surfaceStyle ?? 'glass';
  if (surface === 'solid') {
    return {
      ...baseCardStyle,
      backgroundColor: isDark ? '#0f172a' : '#ffffff',
      backgroundImage: 'none',
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
      border: isDark ? '1px solid rgba(255,255,255,0.16)' : '1px solid rgba(15,23,42,0.12)',
    };
  }
  if (surface === 'tinted') {
    return {
      ...baseCardStyle,
      backgroundColor: isDark
        ? `color-mix(in srgb, ${effectiveAccent} 22%, rgba(13, 19, 34, 0.88))`
        : `color-mix(in srgb, ${effectiveAccent} 12%, rgba(255, 255, 255, 0.92))`,
      border: `1px solid color-mix(in srgb, ${effectiveAccent} 38%, transparent)`,
    };
  }
  return baseCardStyle;
}
