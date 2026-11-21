import { useEffect } from 'react';
import { OS_WALLPAPERS, type OSWallpaperId } from '../OSGLEngine';
import { OSGL_STATE_KEY, type BgMode, type PersistedOSGLState, type QualityMode } from './types';

export function isLightHex(hex: string): boolean {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return false;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62;
}

export function computeDesktopAppearance({
  wallpaper,
  bgMode,
  solidBgColor,
  bgGradColor1,
  bgGradColor2,
  customBgUrl,
  uploadedBgDataUrl,
  useWebGLAurora,
  isDark,
  glassIntensity,
  qualityMode,
}: {
  wallpaper: OSWallpaperId;
  bgMode: BgMode;
  solidBgColor: string;
  bgGradColor1: string;
  bgGradColor2: string;
  customBgUrl: string;
  uploadedBgDataUrl: string;
  useWebGLAurora: boolean;
  isDark: boolean;
  glassIntensity: number;
  qualityMode: QualityMode;
}) {
  const wp = OS_WALLPAPERS[wallpaper];
  const activeImageSrc = uploadedBgDataUrl || customBgUrl.trim();
  const effectiveIsLightBg =
    bgMode === 'solid'
      ? isLightHex(solidBgColor)
      : bgMode === 'gradient'
      ? isLightHex(bgGradColor1) && isLightHex(bgGradColor2)
      : bgMode === 'aurora'
      ? wp.isLight && (useWebGLAurora || !isDark)
      : false;
  const desktopBackground =
    bgMode === 'solid'
      ? solidBgColor
      : bgMode === 'gradient'
      ? `linear-gradient(135deg, ${bgGradColor1} 0%, ${bgGradColor2} 100%)`
      : bgMode === 'image' && activeImageSrc
      ? `url("${activeImageSrc}") center / cover no-repeat`
      : isDark
      ? 'linear-gradient(160deg, #050811 0%, #0b1222 55%, #111827 100%)'
      : wp.fallbackCss;
  const barTextColor = effectiveIsLightBg ? '#0f172a' : '#f8fafc';

  const glassFactor = glassIntensity / 100;
  const glassOpacity =
    qualityMode === 'performance'
      ? 0.94
      : Math.max(0.55, Math.min(0.96, 0.58 + glassFactor * 0.36));
  const glassBlur =
    qualityMode === 'performance' ? 0 : Math.min(20, Math.round(10 + glassFactor * 10));

  const chromeBarBg = isDark
    ? `rgba(10, 15, 28, ${(0.36 + glassFactor * 0.38).toFixed(2)})`
    : `rgba(255, 255, 255, ${(0.32 + glassFactor * 0.38).toFixed(2)})`;
  const chromeText = isDark ? '#f8fafc' : '#0f172a';
  const chromeBorder = isDark
    ? '1px solid rgba(255, 255, 255, 0.14)'
    : '1px solid rgba(255, 255, 255, 0.52)';
  const chromePillBg = isDark
    ? `rgba(15, 23, 42, ${(0.40 + glassFactor * 0.32).toFixed(2)})`
    : `rgba(255, 255, 255, ${(0.42 + glassFactor * 0.34).toFixed(2)})`;

  return {
    effectiveIsLightBg,
    desktopBackground,
    barTextColor,
    glassOpacity,
    glassBlur,
    chromeBarBg,
    chromeText,
    chromeBorder,
    chromePillBg,
  };
}

export function useOSGLPersistence(payload: PersistedOSGLState) {
  const serialized = JSON.stringify(payload);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(OSGL_STATE_KEY, serialized);
    } catch {
      // ignore storage quota / privacy mode errors
    }
  }, [serialized]);
}

