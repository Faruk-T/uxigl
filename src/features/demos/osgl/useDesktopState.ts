import { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../../../providers/ThemeProvider';
import { useToast } from '../../../providers/ToastProvider';
import {
  OS_WALLPAPERS,
  startOSWebGLWallpaper,
  type OSWallpaperId,
} from '../OSGLEngine';
import {
  DEFAULT_ENABLED_WIDGETS,
  DEFAULT_WIDGET_SIZES,
  ENTERPRISE_APPS,
  getDefaultWidgetPositions,
  loadOSGLState,
  type BgMode,
  type DesktopWidgetId,
  type EnterpriseOSApp,
  type IconBgStyle,
  type QualityMode,
  type WidgetPosition,
  type WidgetSize,
} from './types';
import { FULLBLEED_APP_IDS, useWindowManager } from './useWindowManager';
import { computeDesktopAppearance, useOSGLPersistence } from './useDesktopPersistence';

export { FULLBLEED_APP_IDS };

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
  const [widgetsVisible, setWidgetsVisible] = useState<boolean>(savedState?.widgetsVisible ?? true);
  const [enabledWidgets, setEnabledWidgets] = useState<Record<DesktopWidgetId, boolean>>(() => ({
    ...DEFAULT_ENABLED_WIDGETS,
    ...(savedState?.enabledWidgets ?? {}),
  }));
  const toggleWidgetItem = (id: DesktopWidgetId) => {
    setEnabledWidgets((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const [widgetPositions, setWidgetPositions] = useState<
    Record<DesktopWidgetId, WidgetPosition>
  >(() => ({
    ...getDefaultWidgetPositions(
      typeof window !== 'undefined' ? window.innerWidth : 1366
    ),
    ...(savedState?.widgetPositions ?? {}),
  }));
  const updateWidgetPosition = (id: DesktopWidgetId, pos: WidgetPosition) => {
    setWidgetPositions((prev) => ({ ...prev, [id]: pos }));
  };
  const [widgetSizes, setWidgetSizes] = useState<
    Record<DesktopWidgetId, WidgetSize>
  >(() => ({
    ...DEFAULT_WIDGET_SIZES,
    ...(savedState?.widgetSizes ?? {}),
  }));
  const updateWidgetSize = (id: DesktopWidgetId, size: WidgetSize) => {
    setWidgetSizes((prev) => ({ ...prev, [id]: size }));
  };
  const resetWidgetPositions = () => {
    setWidgetPositions(getDefaultWidgetPositions(viewportSize.w));
    setWidgetSizes(DEFAULT_WIDGET_SIZES);
  };
  const [windowAnimation, setWindowAnimation] = useState<boolean>(
    savedState?.windowAnimation ?? true
  );
  const [iconBgStyle, setIconBgStyle] = useState<IconBgStyle>(
    savedState?.iconBgStyle ?? 'vivid'
  );
  const [iconBgColor, setIconBgColor] = useState<string>(savedState?.iconBgColor ?? '');
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
  const [mobileOpenAppId, setMobileOpenAppId] = useState<string | null>(null);

  const showMobileLayout =
    previewDevice === 'mobile' || (previewDevice === 'auto' && isMobileViewport);

  const windowMgr = useWindowManager({
    savedState,
    showMobileLayout,
    setMobileOpenAppId,
    windowAnimation,
    qualityMode,
    notify,
  });

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

  useOSGLPersistence({
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
    widgetsVisible,
    enabledWidgets,
    widgetPositions,
    widgetSizes,
    windowAnimation,
    iconBgStyle,
    iconBgColor,
    iconGradColor1,
    iconGradColor2,
    iconColor,
    iconSizePx,
    iconSlots,
    windows: windowMgr.windows,
    windowBoundsByApp: windowMgr.windowBoundsByApp,
    topZ: windowMgr.topZ,
  });

  const useWebGLAurora = bgMode === 'aurora' && qualityMode === 'quality';

  useEffect(() => {
    if (!canvasRef.current || !useWebGLAurora) return;
    return startOSWebGLWallpaper(
      canvasRef.current,
      () => OS_WALLPAPERS[wallpaperRef.current],
      () => isDarkRef.current
    );
  }, [useWebGLAurora]);

  const appearance = computeDesktopAppearance({
    wallpaper,
    bgMode,
    solidBgColor,
    bgGradColor1,
    bgGradColor2,
    customBgUrl,
    uploadedBgDataUrl,
    useWebGLAurora,
    isDark,
    glassIntensity: preferences.glassIntensity,
    qualityMode,
  });

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
    ...appearance,
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
    widgetsVisible,
    setWidgetsVisible,
    enabledWidgets,
    toggleWidgetItem,
    widgetPositions,
    updateWidgetPosition,
    widgetSizes,
    updateWidgetSize,
    resetWidgetPositions,
    windowAnimation,
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
    mobileOpenAppId,
    setMobileOpenAppId,
    sharedStudioProps,
    ...windowMgr,
  };
}
