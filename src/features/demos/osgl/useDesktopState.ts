import { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../../../providers/ThemeProvider';
import { useToast } from '../../../providers/ToastProvider';
import {
  OS_WALLPAPERS,
  osWasmEngine,
  startOSWebGLWallpaper,
  type OSWallpaperId,
} from '../OSGLEngine';
import {
  ENTERPRISE_APPS,
  OSGL_STATE_KEY,
  loadOSGLState,
  type BgMode,
  type EnterpriseOSApp,
  type FloatingWindowState,
  type IconBgStyle,
  type PersistedOSGLState,
  type QualityMode,
  type WindowBounds,
} from './types';

export const FULLBLEED_APP_IDS = new Set([
  'analytics-telemetry',
  'datatable-statcard',
  'crm-orders',
  'filemangl-explorer',
  'file-manager',
]);

export function useDesktopState(initialWallpaper: OSWallpaperId) {
  const {
    preferences,
    resolvedMode,
    activePalette,
    availablePalettes,
    availableFontPresets,
    setMode,
    setSeedPalette,
    setFontFamilyPreset,
    setFontScale,
    setGlassIntensity,
    setIconStyle,
    setIconFilled,
    setCustomRadiusPx,
    resetPreferences,
  } = useTheme();
  const isDark = resolvedMode === 'dark';
  const paletteTokens = isDark ? activePalette.dark : activePalette.light;
  const { notify } = useToast();

  const savedState = useMemo(() => loadOSGLState(), []);

  const [locale, setLocale] = useState<'tr' | 'en'>(savedState?.locale ?? 'tr');
  const [wallpaper, setWallpaper] = useState<OSWallpaperId>(
    savedState?.wallpaper ?? initialWallpaper
  );
  const [bgMode, setBgMode] = useState<BgMode>(savedState?.bgMode ?? 'aurora');
  const [solidBgColor, setSolidBgColor] = useState<string>(
    savedState?.solidBgColor ?? '#0f172a'
  );
  const [bgGradColor1, setBgGradColor1] = useState<string>(
    savedState?.bgGradColor1 ?? '#0f172a'
  );
  const [bgGradColor2, setBgGradColor2] = useState<string>(
    savedState?.bgGradColor2 ?? '#4f46e5'
  );
  const [customBgUrl, setCustomBgUrl] = useState(savedState?.customBgUrl ?? '');
  const [uploadedBgDataUrl, setUploadedBgDataUrl] = useState<string>(
    savedState?.uploadedBgDataUrl ?? ''
  );
  const [qualityMode, setQualityMode] = useState<QualityMode>(
    savedState?.qualityMode ?? 'quality'
  );
  const [dockVisible, setDockVisible] = useState<boolean>(savedState?.dockVisible ?? true);
  const [windowAnimation, setWindowAnimation] = useState<boolean>(
    savedState?.windowAnimation ?? true
  );
  const [closingWindowIds, setClosingWindowIds] = useState<string[]>([]);
  const [highlightedWindowId, setHighlightedWindowId] = useState<string | null>(null);
  const highlightTimerRef = useRef<number | null>(null);
  const [iconBgStyle, setIconBgStyle] = useState<IconBgStyle>(
    savedState?.iconBgStyle ?? 'vivid'
  );
  const [iconBgColor, setIconBgColor] = useState<string>(
    savedState?.iconBgColor ?? ''
  );
  const [iconGradColor1, setIconGradColor1] = useState<string>(
    savedState?.iconGradColor1 ?? '#3b82f6'
  );
  const [iconGradColor2, setIconGradColor2] = useState<string>(
    savedState?.iconGradColor2 ?? '#ec4899'
  );
  const [iconColor, setIconColor] = useState<string>(savedState?.iconColor ?? '');
  const [iconSizePx, setIconSizePx] = useState<number>(savedState?.iconSizePx ?? 62);
  const [iconSlots, setIconSlots] = useState<Record<string, number>>(() => {
    if (savedState?.iconSlots && Object.keys(savedState.iconSlots).length > 0) {
      return savedState.iconSlots;
    }
    const initial: Record<string, number> = {};
    ENTERPRISE_APPS.forEach((app, idx) => {
      initial[app.id] = idx;
    });
    return initial;
  });

  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [viewportSize, setViewportSize] = useState<{ w: number; h: number }>({
    w: typeof window !== 'undefined' ? window.innerWidth : 1280,
    h: typeof window !== 'undefined' ? window.innerHeight : 900,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'Tümü' | EnterpriseOSApp['category']>('Tümü');
  const [previewDevice, setPreviewDevice] = useState<'auto' | 'desktop' | 'mobile'>('auto');
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [arrangeMenuOpen, setArrangeMenuOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const [windows, setWindows] = useState<FloatingWindowState[]>(() =>
    savedState?.windows ?? [
      {
        id: 'win-overview',
        appId: 'overview',
        x: 320,
        y: 62,
        width: 680,
        height: 480,
        zIndex: 20,
        minimized: false,
        maximized: false,
      },
    ]
  );
  const [windowBoundsByApp, setWindowBoundsByApp] = useState<Record<string, WindowBounds>>(
    () => savedState?.windowBoundsByApp ?? {}
  );
  const [topZ, setTopZ] = useState(savedState?.topZ ?? 21);
  const [mobileOpenAppId, setMobileOpenAppId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wallpaperRef = useRef<OSWallpaperId>(wallpaper);
  wallpaperRef.current = wallpaper;
  const isDarkRef = useRef<boolean>(isDark);
  isDarkRef.current = isDark;

  useEffect(() => {
    const onResize = () => {
      setIsMobileViewport(window.innerWidth < 768);
      setViewportSize({ w: window.innerWidth, h: window.innerHeight });
    };
    const onGlobalClick = () => {
      setContextMenu(null);
      setArrangeMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('click', onGlobalClick);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('click', onGlobalClick);
    };
  }, []);

  useEffect(() => {
    setWindowBoundsByApp((prev) => {
      let changed = false;
      const next = { ...prev };
      windows.forEach((w) => {
        if (w.maximized) return;
        const cur = next[w.appId];
        if (!cur || cur.x !== w.x || cur.y !== w.y || cur.width !== w.width || cur.height !== w.height) {
          next[w.appId] = { x: w.x, y: w.y, width: w.width, height: w.height };
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [windows]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const payload: PersistedOSGLState = {
        locale,
        wallpaper,
        bgMode,
        solidBgColor,
        bgGradColor1,
        bgGradColor2,
        customBgUrl,
        uploadedBgDataUrl,
        qualityMode,
        dockVisible,
        windowAnimation,
        iconBgStyle,
        iconBgColor,
        iconGradColor1,
        iconGradColor2,
        iconColor,
        iconSizePx,
        iconSlots,
        windows,
        windowBoundsByApp,
        topZ,
      };
      window.localStorage.setItem(OSGL_STATE_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage quota / privacy mode errors
    }
  }, [
    locale,
    wallpaper,
    bgMode,
    solidBgColor,
    bgGradColor1,
    bgGradColor2,
    customBgUrl,
    uploadedBgDataUrl,
    qualityMode,
    dockVisible,
    windowAnimation,
    iconBgStyle,
    iconBgColor,
    iconGradColor1,
    iconGradColor2,
    iconColor,
    iconSizePx,
    iconSlots,
    windows,
    windowBoundsByApp,
    topZ,
  ]);

  const useWebGLAurora = bgMode === 'aurora' && qualityMode === 'quality';

  useEffect(() => {
    if (!canvasRef.current || !useWebGLAurora) return;
    return startOSWebGLWallpaper(
      canvasRef.current,
      () => OS_WALLPAPERS[wallpaperRef.current],
      () => isDarkRef.current
    );
  }, [useWebGLAurora]);

  const showMobileLayout =
    previewDevice === 'mobile' || (previewDevice === 'auto' && isMobileViewport);

  const openApp = (appId: string) => {
    if (showMobileLayout) {
      setMobileOpenAppId(appId);
      return;
    }
    const existing = windows.find((w) => w.appId === appId);
    const nextZ = topZ + 1;
    setTopZ(nextZ);
    if (existing) {
      const wasVisible = !existing.minimized;
      setWindows((prev) =>
        prev.map((w) =>
          w.id === existing.id
            ? { ...w, minimized: false, maximized: appId === 'docs' ? true : w.maximized, zIndex: nextZ }
            : w
        )
      );
      if (wasVisible) {
        if (highlightTimerRef.current !== null) window.clearTimeout(highlightTimerRef.current);
        setHighlightedWindowId(existing.id);
        highlightTimerRef.current = window.setTimeout(() => {
          setHighlightedWindowId(null);
          highlightTimerRef.current = null;
        }, 650);
      }
      return;
    }
    const savedBounds = windowBoundsByApp[appId];
    const offset = (windows.length % 6) * 26;
    const isLargeApp =
      FULLBLEED_APP_IDS.has(appId) ||
      appId === 'overview' ||
      appId === 'analytics' ||
      appId === 'docs' ||
      appId.startsWith('page-');
    setWindows((prev) => [
      ...prev,
      {
        id: `win-${appId}-${Date.now()}`,
        appId,
        x: savedBounds?.x ?? 240 + offset,
        y: savedBounds?.y ?? 58 + offset,
        width: savedBounds?.width ?? (isLargeApp ? 720 : appId === 'os-theme-studio' ? 430 : 580),
        height: savedBounds?.height ?? (isLargeApp ? 500 : appId === 'os-theme-studio' ? 540 : 440),
        zIndex: nextZ,
        minimized: false,
        maximized: appId === 'docs',
      },
    ]);
  };

  const focusWindow = (winId: string) => {
    const nextZ = topZ + 1;
    setTopZ(nextZ);
    setWindows((prev) => prev.map((w) => (w.id === winId ? { ...w, zIndex: nextZ } : w)));
  };

  const closeWindow = (winId: string) => {
    if (windowAnimation && qualityMode === 'quality') {
      setClosingWindowIds((prev) => (prev.includes(winId) ? prev : [...prev, winId]));
      setTimeout(() => {
        setWindows((prev) => prev.filter((w) => w.id !== winId));
        setClosingWindowIds((prev) => prev.filter((id) => id !== winId));
      }, 150);
    } else {
      setWindows((prev) => prev.filter((w) => w.id !== winId));
    }
  };

  const toggleMinimize = (winId: string) =>
    setWindows((prev) => prev.map((w) => (w.id === winId ? { ...w, minimized: !w.minimized } : w)));

  const toggleMaximize = (winId: string) => {
    const nextZ = topZ + 1;
    setTopZ(nextZ);
    setWindows((prev) =>
      prev.map((w) => (w.id === winId ? { ...w, maximized: !w.maximized, zIndex: nextZ } : w))
    );
  };

  const arrangeWindows = (mode: 'cascade' | 'grid' | 'side-by-side') => {
    const visible = windows.filter((w) => !w.minimized);
    if (visible.length === 0) return;
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    const rects = osWasmEngine.computeArrangeRects(
      visible.length,
      mode,
      Math.max(640, vw - 48),
      Math.max(420, vh - 160)
    );
    setWindows((prev) =>
      prev.map((w) => {
        if (w.minimized) return w;
        const rect = rects[visible.findIndex((v) => v.id === w.id)];
        return rect ? { ...w, maximized: false, ...rect } : w;
      })
    );
    notify({
      title: 'Pencereler Düzenlendi',
      description:
        mode === 'grid'
          ? 'Izgara (Grid) dizilimi uygulandı.'
          : mode === 'side-by-side'
          ? 'Yan yana dizilim uygulandı.'
          : 'Kademeli (Cascade) dizilim uygulandı.',
      tone: 'info',
    });
  };

  const wp = OS_WALLPAPERS[wallpaper];
  const activeImageSrc = uploadedBgDataUrl || customBgUrl.trim();
  const isLightHex = (hex: string): boolean => {
    const clean = hex.replace('#', '');
    if (clean.length !== 6) return false;
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62;
  };
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

  const glassFactor = preferences.glassIntensity / 100;
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

  const sharedStudioProps = {
    wallpaper,
    setWallpaper,
    bgMode,
    setBgMode,
    solidBgColor,
    setSolidBgColor,
    bgGradColor1,
    setBgGradColor1,
    bgGradColor2,
    setBgGradColor2,
    customBgUrl,
    setCustomBgUrl,
    uploadedBgDataUrl,
    setUploadedBgDataUrl,
    qualityMode,
    setQualityMode,
    dockVisible,
    setDockVisible,
    windowAnimation,
    setWindowAnimation,
    iconBgStyle,
    setIconBgStyle,
    iconBgColor,
    setIconBgColor,
    iconGradColor1,
    setIconGradColor1,
    iconGradColor2,
    setIconGradColor2,
    iconColor,
    setIconColor,
    iconSizePx,
    setIconSizePx,
    preferences,
    availablePalettes,
    availableFontPresets,
    setMode,
    setSeedPalette,
    setFontFamilyPreset,
    setFontScale,
    setGlassIntensity,
    setIconStyle,
    setIconFilled,
    setCustomRadiusPx,
    resetPreferences,
  };

  return {
    locale,
    setLocale,
    isDark,
    paletteTokens,
    preferences,
    canvasRef,
    useWebGLAurora,
    desktopBackground,
    barTextColor,
    effectiveIsLightBg,
    chromeBarBg,
    chromeText,
    chromeBorder,
    chromePillBg,
    glassOpacity,
    glassBlur,
    showMobileLayout,
    isMobileViewport,
    previewDevice,
    setPreviewDevice,
    viewportSize,
    wallpaper,
    setWallpaper,
    setCustomBgUrl,
    qualityMode,
    dockVisible,
    setDockVisible,
    windowAnimation,
    closingWindowIds,
    highlightedWindowId,
    iconBgStyle,
    iconBgColor,
    iconGradColor1,
    iconGradColor2,
    iconColor,
    iconSizePx,
    iconSlots,
    setIconSlots,
    selectedAppIds,
    setSelectedAppIds,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    arrangeMenuOpen,
    setArrangeMenuOpen,
    contextMenu,
    setContextMenu,
    windows,
    setWindows,
    topZ,
    mobileOpenAppId,
    setMobileOpenAppId,
    openApp,
    focusWindow,
    closeWindow,
    toggleMinimize,
    toggleMaximize,
    arrangeWindows,
    sharedStudioProps,
  };
}
