import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import {
  Columns2,
  Grid2x2,
  Layers,
  Monitor,
  Palette,
  RotateCcw,
  Search,
  Smartphone,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { useTheme } from '../../providers/ThemeProvider';
import { useToast } from '../../providers/ToastProvider';
import { Badge, Button, GoogleIcon, Input, Slider, Switch } from '../../components/primitives';
import { UXILogo } from '../../components/brand/UXILogo';
import { SheetGLGridAdapter } from '../../components/composites/SheetGLGridAdapter/SheetGLGridAdapter';
import { FileManGLExplorerAdapter } from '../../components/composites/FileManGLExplorerAdapter/FileManGLExplorerAdapter';
import { AnalyticsDashboardView } from '../showcase/AnalyticsDashboardView';
import {
  PageTemplatesShowcaseView,
  type PageTemplateId,
} from '../showcase/PageTemplatesShowcaseView';
import { EnterpriseSettingsPage } from '../showcase/EnterpriseSettingsPage';
import type { GoogleIconStyle, SeedPaletteId, ThemeMode } from '../../core/contracts/ThemeContract';
import {
  MACOS_WALLPAPERS,
  macOSWasmEngine,
  startMacOSWebGLWallpaper,
  type MacOSWallpaperId,
} from './MacOSGLEngine';

export type { MacOSWallpaperId };

export interface MacOSGLDemoProps {
  onNavigate?: (sectionId: string, subItemId?: string) => void;
  onOpenThemeStudio?: () => void;
  initialWallpaper?: MacOSWallpaperId;
  renderWindowContent?: (appId: string) => React.ReactNode;
}

interface EnterpriseOSApp {
  id: string;
  label: string;
  shortLabel: string;
  googleIcon: string;
  badge?: string;
  category: 'Dashboard' | 'Commerce' | 'Components' | 'Pages' | 'Apps';
  gradient: string;
}

interface FloatingWindowState {
  id: string;
  appId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
}

const ENTERPRISE_APPS: EnterpriseOSApp[] = [
  { id: 'overview', label: 'Dashboard', shortLabel: 'Dashboard', googleIcon: 'dashboard', category: 'Dashboard', gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
  { id: 'analytics', label: 'Analytics', shortLabel: 'Analytics', googleIcon: 'trending_up', category: 'Dashboard', gradient: 'linear-gradient(135deg, #0ea5e9, #0369a1)' },
  { id: 'analytics-telemetry', label: 'SheetGL Telemetry', shortLabel: 'Telemetry', googleIcon: 'query_stats', category: 'Dashboard', gradient: 'linear-gradient(135deg, #6366f1, #4338ca)' },
  { id: 'reports', label: 'Reports', shortLabel: 'Reports', googleIcon: 'bar_chart', badge: '2', category: 'Dashboard', gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' },
  { id: 'users', label: 'Users', shortLabel: 'Users', googleIcon: 'group', badge: '8', category: 'Commerce', gradient: 'linear-gradient(135deg, #14b8a6, #0f766e)' },
  { id: 'products', label: 'Products', shortLabel: 'Products', googleIcon: 'inventory_2', category: 'Commerce', gradient: 'linear-gradient(135deg, #f59e0b, #b45309)' },
  { id: 'crm-orders', label: 'Orders', shortLabel: 'Orders', googleIcon: 'receipt_long', badge: '12', category: 'Commerce', gradient: 'linear-gradient(135deg, #10b981, #047857)' },
  { id: 'forms', label: 'Forms', shortLabel: 'Forms', googleIcon: 'description', badge: '4', category: 'Components', gradient: 'linear-gradient(135deg, #22c55e, #15803d)' },
  { id: 'elements-overview', label: 'UI Components', shortLabel: 'Components', googleIcon: 'category', category: 'Components', gradient: 'linear-gradient(135deg, #ec4899, #be185d)' },
  { id: 'datatable-statcard', label: 'SheetGL Grid', shortLabel: 'SheetGL', googleIcon: 'table_chart', category: 'Components', gradient: 'linear-gradient(135deg, #0284c7, #075985)' },
  { id: 'filemangl-explorer', label: 'FileManGL', shortLabel: 'FileManGL', googleIcon: 'folder_open', category: 'Components', gradient: 'linear-gradient(135deg, #06b6d4, #0e7490)' },
  { id: 'page-login', label: 'Login', shortLabel: 'Login', googleIcon: 'lock', category: 'Pages', gradient: 'linear-gradient(135deg, #64748b, #334155)' },
  { id: 'page-register', label: 'Register', shortLabel: 'Register', googleIcon: 'verified_user', category: 'Pages', gradient: 'linear-gradient(135deg, #10b981, #065f46)' },
  { id: 'page-pricing', label: 'Pricing', shortLabel: 'Pricing', googleIcon: 'sell', category: 'Pages', gradient: 'linear-gradient(135deg, #f97316, #c2410c)' },
  { id: 'page-profile', label: 'Profile', shortLabel: 'Profile', googleIcon: 'person', category: 'Pages', gradient: 'linear-gradient(135deg, #a855f7, #7e22ce)' },
  { id: 'page-invoice', label: 'Invoice', shortLabel: 'Invoice', googleIcon: 'receipt', badge: '5', category: 'Pages', gradient: 'linear-gradient(135deg, #eab308, #a16207)' },
  { id: 'page-kanban', label: 'Kanban', shortLabel: 'Kanban', googleIcon: 'view_kanban', badge: '6', category: 'Pages', gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)' },
  { id: 'page-status', label: 'Status', shortLabel: 'Status', googleIcon: 'dns', category: 'Pages', gradient: 'linear-gradient(135deg, #f43f5e, #be123c)' },
  { id: 'messages', label: 'Messages', shortLabel: 'Messages', googleIcon: 'chat', badge: '3', category: 'Apps', gradient: 'linear-gradient(135deg, #38bdf8, #0284c7)' },
  { id: 'calendar', label: 'Calendar', shortLabel: 'Calendar', googleIcon: 'calendar_month', badge: '2', category: 'Apps', gradient: 'linear-gradient(135deg, #fb7185, #e11d48)' },
  { id: 'file-manager', label: 'Files', shortLabel: 'Files', googleIcon: 'folder', category: 'Apps', gradient: 'linear-gradient(135deg, #2563eb, #1e40af)' },
  { id: 'settings', label: 'Settings', shortLabel: 'Settings', googleIcon: 'settings', category: 'Apps', gradient: 'linear-gradient(135deg, #475569, #1e293b)' },
  { id: 'security', label: 'Security', shortLabel: 'Security', googleIcon: 'shield', badge: '1', category: 'Apps', gradient: 'linear-gradient(135deg, #0d9488, #115e59)' },
  { id: 'os-theme-studio', label: 'OS Tema Stüdyosu', shortLabel: 'Tema', googleIcon: 'palette', category: 'Apps', gradient: 'linear-gradient(135deg, #d946ef, #7c3aed)' },
];

const DOCK_APP_IDS = [
  'overview',
  'analytics-telemetry',
  'filemangl-explorer',
  'crm-orders',
  'page-kanban',
  'messages',
  'settings',
  'os-theme-studio',
];

export function MacOSGLDemo({
  onNavigate,
  initialWallpaper = 'sequoia',
  renderWindowContent,
}: MacOSGLDemoProps) {
  const {
    preferences,
    resolvedMode,
    activePalette,
    availablePalettes,
    setMode,
    setSeedPalette,
    setGlassIntensity,
    setIconStyle,
    setCustomRadiusPx,
    resetPreferences,
  } = useTheme();
  const isDark = resolvedMode === 'dark';
  const paletteTokens = isDark ? activePalette.dark : activePalette.light;
  const { notify } = useToast();

  const [wallpaper, setWallpaper] = useState<MacOSWallpaperId>(initialWallpaper);
  const [customBgUrl, setCustomBgUrl] = useState('');
  const [iconScale, setIconScale] = useState<'sm' | 'md' | 'lg'>('md');
  const [iconSlots, setIconSlots] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    ENTERPRISE_APPS.forEach((app, idx) => {
      initial[app.id] = idx;
    });
    return initial;
  });
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
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

  // Right-click context menu
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  // Floating Windows State
  const [windows, setWindows] = useState<FloatingWindowState[]>([
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
  ]);
  const [topZ, setTopZ] = useState(21);
  const [mobileOpenAppId, setMobileOpenAppId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wallpaperRef = useRef<MacOSWallpaperId>(wallpaper);
  wallpaperRef.current = wallpaper;
  const isDarkRef = useRef<boolean>(isDark);
  isDarkRef.current = isDark;

  const dockItemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const dockRestingCenters = useRef<number[]>([]);
  const dockRafRef = useRef<number | null>(null);

  const windowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const dragRef = useRef<{
    winId: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    curX: number;
    curY: number;
    rafId: number | null;
  } | null>(null);

  const resizeRef = useRef<{
    winId: string;
    startX: number;
    startY: number;
    origW: number;
    origH: number;
    curW: number;
    curH: number;
    rafId: number | null;
  } | null>(null);

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
    if (!canvasRef.current || customBgUrl.trim()) {
      return;
    }
    return startMacOSWebGLWallpaper(
      canvasRef.current,
      () => MACOS_WALLPAPERS[wallpaperRef.current],
      () => isDarkRef.current
    );
  }, [customBgUrl]);

  const showMobileLayout =
    previewDevice === 'mobile' || (previewDevice === 'auto' && isMobileViewport);

  const wp = MACOS_WALLPAPERS[wallpaper];
  const effectiveIsLightBg = wp.isLight && !isDark && !customBgUrl.trim();
  const desktopBackground = customBgUrl.trim()
    ? `url("${customBgUrl.trim()}") center / cover no-repeat`
    : isDark
    ? 'linear-gradient(160deg, #050811 0%, #0b1222 55%, #111827 100%)'
    : wp.fallbackCss;
  const barTextColor = effectiveIsLightBg ? '#0f172a' : '#f8fafc';

  const iconBoxSize = iconScale === 'sm' ? 52 : iconScale === 'lg' ? 72 : 62;
  const iconGlyphSize = Math.round(iconBoxSize * 0.62);
  const cellHeight = iconBoxSize + 44;
  const cellWidth = iconBoxSize + 36;
  const availableGridHeight = Math.max(cellHeight, viewportSize.h - 200);
  const rowsPerColumn = Math.max(1, Math.floor(availableGridHeight / cellHeight));
  const colsCount = Math.max(4, Math.floor((viewportSize.w - 48) / (cellWidth + 12)));
  const totalGridSlots = rowsPerColumn * colsCount;

  const filteredApps = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ENTERPRISE_APPS.filter((app) => {
      const matchesCat = categoryFilter === 'Tümü' || app.category === categoryFilter;
      const matchesQ =
        !q ||
        app.label.toLowerCase().includes(q) ||
        app.category.toLowerCase().includes(q);
      return matchesCat && matchesQ;
    });
  }, [searchQuery, categoryFilter]);

  const slotToApp = useMemo(() => {
    const map = new Map<number, EnterpriseOSApp>();
    const isFiltering = Boolean(searchQuery.trim()) || categoryFilter !== 'Tümü';
    if (isFiltering) {
      filteredApps.forEach((app, idx) => map.set(idx, app));
      return map;
    }
    filteredApps.forEach((app) => {
      const slot = iconSlots[app.id] ?? 0;
      map.set(slot, app);
    });
    return map;
  }, [filteredApps, iconSlots, searchQuery, categoryFilter]);

  const handleDropOnSlot = (targetSlot: number) => {
    if (!draggedAppId) {
      setDragOverSlot(null);
      return;
    }
    setIconSlots((prev) => {
      const sourceSlot = prev[draggedAppId];
      if (sourceSlot === targetSlot) return prev;

      const occupantId = Object.keys(prev).find((id) => prev[id] === targetSlot);
      if (!occupantId) {
        // Free grid placement into empty cell
        return { ...prev, [draggedAppId]: targetSlot };
      }

      // Insert-between (araya koyma): shift contiguous occupied slots forward from targetSlot
      const slotMap = new Map<number, string>();
      for (const [id, s] of Object.entries(prev)) {
        if (id !== draggedAppId) slotMap.set(s, id);
      }
      const chain: string[] = [];
      let scan = targetSlot;
      while (slotMap.has(scan)) {
        chain.push(slotMap.get(scan)!);
        scan += 1;
      }
      const result: Record<string, number> = { ...prev, [draggedAppId]: targetSlot };
      chain.forEach((id, i) => {
        result[id] = targetSlot + i + 1;
      });
      return result;
    });
    setDraggedAppId(null);
    setDragOverSlot(null);
  };

  const openApp = (appId: string) => {
    if (showMobileLayout) {
      setMobileOpenAppId(appId);
      return;
    }

    const existing = windows.find((w) => w.appId === appId);
    const nextZ = topZ + 1;
    setTopZ(nextZ);

    if (existing) {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === existing.id ? { ...w, minimized: false, zIndex: nextZ } : w
        )
      );
      return;
    }

    const offset = (windows.length % 6) * 26;
    const isLargeApp =
      appId === 'overview' ||
      appId === 'analytics' ||
      appId === 'analytics-telemetry' ||
      appId === 'datatable-statcard' ||
      appId === 'filemangl-explorer' ||
      appId === 'file-manager' ||
      appId.startsWith('page-');

    setWindows((prev) => [
      ...prev,
      {
        id: `win-${appId}-${Date.now()}`,
        appId,
        x: 240 + offset,
        y: 58 + offset,
        width: isLargeApp ? 720 : appId === 'os-theme-studio' ? 430 : 580,
        height: isLargeApp ? 500 : appId === 'os-theme-studio' ? 540 : 440,
        zIndex: nextZ,
        minimized: false,
        maximized: false,
      },
    ]);
  };

  const focusWindow = (winId: string) => {
    const nextZ = topZ + 1;
    setTopZ(nextZ);
    setWindows((prev) => prev.map((w) => (w.id === winId ? { ...w, zIndex: nextZ } : w)));
  };

  const closeWindow = (winId: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== winId));
  };

  const toggleMinimize = (winId: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === winId ? { ...w, minimized: !w.minimized } : w))
    );
  };

  const toggleMaximize = (winId: string) => {
    const nextZ = topZ + 1;
    setTopZ(nextZ);
    setWindows((prev) =>
      prev.map((w) =>
        w.id === winId ? { ...w, maximized: !w.maximized, zIndex: nextZ } : w
      )
    );
  };

  const arrangeWindows = (mode: 'cascade' | 'grid' | 'side-by-side') => {
    const visible = windows.filter((w) => !w.minimized);
    if (visible.length === 0) return;

    const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    const usableW = Math.max(640, vw - 48);
    const usableH = Math.max(420, vh - 160);
    const rects = macOSWasmEngine.computeArrangeRects(visible.length, mode, usableW, usableH);

    setWindows((prev) =>
      prev.map((w) => {
        if (w.minimized) return w;
        const idx = visible.findIndex((v) => v.id === w.id);
        const rect = rects[idx];
        if (!rect) return w;
        return { ...w, maximized: false, ...rect };
      })
    );
    notify({
      title: 'Pencereler Düzenlendi (WASM)',
      description:
        mode === 'grid'
          ? 'Izgara (Grid) dizilimi uygulandı.'
          : mode === 'side-by-side'
          ? 'Yan yana dizilim uygulandı.'
          : 'Kademeli (Cascade) dizilim uygulandı.',
      tone: 'info',
    });
  };

  // GPU-composited zero-rerender drag handlers (translate3d + rAF)
  const handlePointerDownTitle = (
    e: React.PointerEvent<HTMLDivElement>,
    win: FloatingWindowState
  ) => {
    if (win.maximized) return;
    focusWindow(win.id);
    dragRef.current = {
      winId: win.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: win.x,
      origY: win.y,
      curX: win.x,
      curY: win.y,
      rafId: null,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMoveTitle = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const maxW = typeof window !== 'undefined' ? window.innerWidth - 120 : 1400;
    const maxH = typeof window !== 'undefined' ? window.innerHeight - 100 : 900;
    drag.curX = macOSWasmEngine.clamp(drag.origX + (e.clientX - drag.startX), 8, maxW);
    drag.curY = macOSWasmEngine.clamp(drag.origY + (e.clientY - drag.startY), 44, maxH);

    if (drag.rafId === null) {
      drag.rafId = requestAnimationFrame(() => {
        const el = windowRefs.current[drag.winId];
        if (el) {
          el.style.transform = `translate3d(${drag.curX}px, ${drag.curY}px, 0)`;
        }
        drag.rafId = null;
      });
    }
  };

  const handlePointerUpTitle = () => {
    const drag = dragRef.current;
    if (!drag) return;
    if (drag.rafId !== null) cancelAnimationFrame(drag.rafId);
    const { winId, curX, curY } = drag;
    dragRef.current = null;
    setWindows((prev) =>
      prev.map((w) => (w.id === winId ? { ...w, x: curX, y: curY } : w))
    );
  };

  // GPU-composited zero-rerender resize handlers (rAF)
  const handlePointerDownResize = (
    e: React.PointerEvent<HTMLDivElement>,
    win: FloatingWindowState
  ) => {
    e.stopPropagation();
    if (win.maximized) return;
    focusWindow(win.id);
    resizeRef.current = {
      winId: win.id,
      startX: e.clientX,
      startY: e.clientY,
      origW: win.width,
      origH: win.height,
      curW: win.width,
      curH: win.height,
      rafId: null,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMoveResize = (e: React.PointerEvent<HTMLDivElement>) => {
    const res = resizeRef.current;
    if (!res) return;
    res.curW = macOSWasmEngine.clamp(res.origW + (e.clientX - res.startX), 360, 1600);
    res.curH = macOSWasmEngine.clamp(res.origH + (e.clientY - res.startY), 280, 1000);

    if (res.rafId === null) {
      res.rafId = requestAnimationFrame(() => {
        const el = windowRefs.current[res.winId];
        if (el) {
          el.style.width = `${res.curW}px`;
          el.style.height = `${res.curH}px`;
        }
        res.rafId = null;
      });
    }
  };

  const handlePointerUpResize = () => {
    const res = resizeRef.current;
    if (!res) return;
    if (res.rafId !== null) cancelAnimationFrame(res.rafId);
    const { winId, curW, curH } = res;
    resizeRef.current = null;
    setWindows((prev) =>
      prev.map((w) => (w.id === winId ? { ...w, width: curW, height: curH } : w))
    );
  };

  const activeWindow = useMemo(() => {
    const visible = windows.filter((w) => !w.minimized);
    if (visible.length === 0) return null;
    return visible.reduce((a, b) => (a.zIndex > b.zIndex ? a : b));
  }, [windows]);

  const activeApp = activeWindow
    ? ENTERPRISE_APPS.find((m) => m.id === activeWindow.appId)
    : null;

  const mobileActiveApp = mobileOpenAppId
    ? ENTERPRISE_APPS.find((m) => m.id === mobileOpenAppId)
    : null;

  const handleDockMouseEnter = () => {
    dockRestingCenters.current = dockItemRefs.current.map((btn) => {
      if (!btn) return 0;
      const rect = btn.getBoundingClientRect();
      return rect.left + rect.width / 2;
    });
  };

  const handleDockMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const clientX = e.clientX;
    if (dockRestingCenters.current.length === 0) {
      handleDockMouseEnter();
    }
    if (dockRafRef.current !== null) cancelAnimationFrame(dockRafRef.current);
    dockRafRef.current = requestAnimationFrame(() => {
      const maxDist = 150;
      dockItemRefs.current.forEach((btn, idx) => {
        if (!btn) return;
        const baseSize = idx >= DOCK_APP_IDS.length ? 44 : 46;
        const center = dockRestingCenters.current[idx] ?? 0;
        const dist = Math.abs(clientX - center);
        const factor = dist < maxDist ? Math.cos((dist / maxDist) * (Math.PI / 2)) : 0;
        const scale = 1 + factor * 0.48;
        const nextSize = Math.round(baseSize * scale);
        btn.style.transition = 'none';
        btn.style.width = `${nextSize}px`;
        btn.style.height = `${nextSize}px`;
        btn.style.borderRadius = `${Math.round(13 * scale)}px`;
        const glyph = btn.firstElementChild as HTMLElement | null;
        if (glyph) {
          glyph.style.transition = 'none';
          glyph.style.transform = `scale(${scale.toFixed(3)})`;
        }
      });
      dockRafRef.current = null;
    });
  };

  const handleDockMouseLeave = () => {
    if (dockRafRef.current !== null) {
      cancelAnimationFrame(dockRafRef.current);
      dockRafRef.current = null;
    }
    dockRestingCenters.current = [];
    dockItemRefs.current.forEach((btn, idx) => {
      if (!btn) return;
      const baseSize = idx >= DOCK_APP_IDS.length ? 44 : 46;
      btn.style.transition = 'width 0.16s ease-out, height 0.16s ease-out, border-radius 0.16s ease-out';
      btn.style.width = `${baseSize}px`;
      btn.style.height = `${baseSize}px`;
      btn.style.borderRadius = '13px';
      const glyph = btn.firstElementChild as HTMLElement | null;
      if (glyph) {
        glyph.style.transition = 'transform 0.16s ease-out';
        glyph.style.transform = 'scale(1)';
      }
    });
  };

  const glassFactor = preferences.glassIntensity / 100;
  const glassOpacity = Math.max(0.55, Math.min(0.96, 0.58 + glassFactor * 0.36));
  const glassBlur = Math.min(20, Math.round(10 + glassFactor * 10));

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

  return (
    <div
      onContextMenu={(e) => {
        if (showMobileLayout) return;
        e.preventDefault();
        setArrangeMenuOpen(false);
        setContextMenu({
          x: Math.min(e.clientX, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 240),
          y: Math.min(e.clientY, (typeof window !== 'undefined' ? window.innerHeight : 800) - 310),
        });
      }}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: desktopBackground,
        color: barTextColor,
        fontFamily: 'var(--uxu-font-sans, "Plus Jakarta Sans", system-ui, sans-serif)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Scoped GPU & Subtle Scrollbar/Resize Styles */}
      <style>{`
        .macosgl-scroll {
          scrollbar-width: thin;
          scrollbar-color: transparent transparent;
        }
        .macosgl-scroll:hover {
          scrollbar-color: rgba(148, 163, 184, 0.35) transparent;
        }
        .macosgl-scroll::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .macosgl-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .macosgl-scroll::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 999px;
        }
        .macosgl-scroll:hover::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.38);
        }
        .macosgl-app-btn {
          transition: transform 0.16s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
        }
        .macosgl-app-btn:hover {
          transform: translate3d(0, -3px, 0) scale(1.05);
        }
        .macosgl-app-btn:active {
          transform: translate3d(0, 0, 0) scale(0.96);
        }
        .macosgl-resize-handle {
          opacity: 0;
          transition: opacity 0.15s ease;
        }
        .macosgl-resize-handle:hover {
          opacity: 0.55;
        }
        .macosgl-fullbleed,
        .macosgl-fullbleed > div,
        .macosgl-fullbleed .uxu-filemangl-host,
        .macosgl-fullbleed .uxu-sheetgl-host {
          height: 100% !important;
          width: 100% !important;
          flex: 1 1 auto !important;
          min-height: 0 !important;
          display: flex !important;
          flex-direction: column !important;
        }
      `}</style>

      {/* Hardware-Accelerated WebGL Wallpaper Layer */}
      {!customBgUrl.trim() && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}
      {/* ====================================================================
          macOS TOP MENU BAR (WITH uxiGL LOGO & ARRANGE MENU)
      ==================================================================== */}
      <header
        style={{
          height: 38,
          padding: '0 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          color: chromeText,
          backgroundColor: chromeBarBg,
          backdropFilter: `blur(${glassBlur}px) saturate(180%)`,
          WebkitBackdropFilter: `blur(${glassBlur}px) saturate(180%)`,
          borderBottom: chromeBorder,
          zIndex: 120,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            onClick={() => onNavigate?.('landing', 'home')}
            title={onNavigate ? 'uxiGL Ana Sayfaya Dön' : 'MacOSGL'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              border: 'none',
              background: 'transparent',
              padding: '2px 4px',
              color: chromeText,
              cursor: onNavigate ? 'pointer' : 'default',
            }}
          >
            <UXILogo size={20} />
            <span style={{ fontWeight: 800, fontSize: 13, letterSpacing: '-0.02em' }}>
              MacOSGL
            </span>
          </button>

          {/* Arrange / Pencere Dropdown */}
          {!showMobileLayout && (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setArrangeMenuOpen((v) => !v);
                }}
                style={{
                  border: 'none',
                  background: arrangeMenuOpen
                    ? chromePillBg
                    : 'transparent',
                  color: chromeText,
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                Pencere ▾
              </button>

              {arrangeMenuOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: 'absolute',
                    top: 30,
                    left: 0,
                    width: 210,
                    padding: 6,
                    borderRadius: 12,
                    backgroundColor: isDark
                      ? 'rgba(15, 23, 42, 0.92)'
                      : 'rgba(255, 255, 255, 0.94)',
                    color: isDark ? '#f8fafc' : '#0f172a',
                    backdropFilter: 'blur(24px)',
                    border: isDark
                      ? '1px solid rgba(255,255,255,0.14)'
                      : '1px solid rgba(15,23,42,0.12)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.28)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    zIndex: 200,
                  }}
                >
                  <ContextMenuItem
                    icon={<Grid2x2 size={14} />}
                    label="Izgara Dizilimi (Grid)"
                    onClick={() => {
                      arrangeWindows('grid');
                      setArrangeMenuOpen(false);
                    }}
                  />
                  <ContextMenuItem
                    icon={<Layers size={14} />}
                    label="Kademeli Dizilim (Cascade)"
                    onClick={() => {
                      arrangeWindows('cascade');
                      setArrangeMenuOpen(false);
                    }}
                  />
                  <ContextMenuItem
                    icon={<Columns2 size={14} />}
                    label="Yan Yana Diz"
                    onClick={() => {
                      arrangeWindows('side-by-side');
                      setArrangeMenuOpen(false);
                    }}
                  />
                  <div style={{ height: 1, backgroundColor: 'rgba(148,163,184,0.2)', margin: '4px 0' }} />
                  <ContextMenuItem
                    icon={<X size={14} />}
                    label="Tüm Pencereleri Kapat"
                    onClick={() => {
                      setWindows([]);
                      setArrangeMenuOpen(false);
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Controls: Mobile/Desktop Preview + OS Theme Studio + Clock */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {!isMobileViewport && (
            <button
              type="button"
              onClick={() =>
                setPreviewDevice((prev) => (prev === 'mobile' ? 'desktop' : 'mobile'))
              }
              title="Masaüstü / Mobil Görünüm Değiştir"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '3px 10px',
                borderRadius: 999,
                border: chromeBorder,
                backgroundColor:
                  previewDevice === 'mobile'
                    ? '#2563eb'
                    : chromePillBg,
                color: previewDevice === 'mobile' ? '#ffffff' : chromeText,
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {previewDevice === 'mobile' ? <Monitor size={13} /> : <Smartphone size={13} />}
              <span>{previewDevice === 'mobile' ? 'Masaüstü' : 'Mobil'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => openApp('os-theme-studio')}
            title="OS Tema Stüdyosu"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '3px 10px',
              borderRadius: 999,
              border: chromeBorder,
              backgroundColor: chromePillBg,
              color: chromeText,
              fontSize: 11.5,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <Palette size={13} />
            <span style={{ display: isMobileViewport ? 'none' : 'inline' }}>OS Tema</span>
          </button>

          <MenuBarClock />
        </div>
      </header>

      {/* ====================================================================
          MAIN CANVAS: DESKTOP OR MOBILE OS LAUNCHER
      ==================================================================== */}
      {showMobileLayout ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobileViewport ? 12 : 24,
          }}
        >
          <div
            style={{
              width: isMobileViewport ? '100%' : 390,
              height: isMobileViewport ? 'calc(100vh - 64px)' : 760,
              maxHeight: 'calc(100vh - 72px)',
              borderRadius: isMobileViewport ? 24 : 44,
              border: isMobileViewport
                ? '1px solid rgba(255,255,255,0.22)'
                : '8px solid rgba(15, 23, 42, 0.85)',
              background: desktopBackground,
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.45)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div style={{ padding: '16px 16px 10px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 14,
                  backgroundColor: 'rgba(255, 255, 255, 0.22)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.28)',
                }}
              >
                <Search size={15} color={barTextColor} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Uygulama ara..."
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    color: barTextColor,
                    fontSize: 13,
                    width: '100%',
                    fontWeight: 600,
                  }}
                />
              </div>
            </div>

            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '8px 16px 16px',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px 10px',
                alignContent: 'start',
              }}
            >
              {filteredApps.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => openApp(app.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      background: app.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
                      color: '#ffffff',
                    }}
                  >
                    <GoogleIcon name={app.googleIcon} size={34} />
                    {app.badge && /^\d+$/.test(app.badge) && (
                      <span
                        style={{
                          position: 'absolute',
                          top: -5,
                          right: -5,
                          minWidth: 19,
                          height: 19,
                          padding: '0 5px',
                          borderRadius: 999,
                          backgroundColor: '#ef4444',
                          color: '#ffffff',
                          fontSize: 10,
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px solid rgba(255,255,255,0.9)',
                        }}
                      >
                        {app.badge}
                      </span>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: barTextColor,
                      textShadow: wp.isLight ? 'none' : '0 1px 4px rgba(0,0,0,0.55)',
                      textAlign: 'center',
                      lineHeight: 1.15,
                    }}
                  >
                    {app.shortLabel}
                  </span>
                </button>
              ))}
            </div>

            {mobileActiveApp && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: isDark ? '#0b1120' : '#f8fafc',
                  color: isDark ? '#f8fafc' : '#0f172a',
                  display: 'flex',
                  flexDirection: 'column',
                  zIndex: 50,
                }}
              >
                <div
                  style={{
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(148,163,184,0.2)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 9,
                        background: mobileActiveApp.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                      }}
                    >
                      <GoogleIcon name={mobileActiveApp.googleIcon} size={17} />
                    </div>
                    <strong style={{ fontSize: 15 }}>{mobileActiveApp.label}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileOpenAppId(null)}
                    style={{
                      border: 'none',
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      backgroundColor: 'rgba(148,163,184,0.2)',
                      color: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <X size={15} />
                  </button>
                </div>
                <div
                  style={{
                    flex: 1,
                    minHeight: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    padding:
                      mobileActiveApp.id === 'analytics-telemetry' ||
                      mobileActiveApp.id === 'datatable-statcard' ||
                      mobileActiveApp.id === 'crm-orders' ||
                      mobileActiveApp.id === 'filemangl-explorer' ||
                      mobileActiveApp.id === 'file-manager'
                        ? 0
                        : 14,
                    overflowY: 'auto',
                  }}
                >
                  <OSWindowContent
                    app={mobileActiveApp}
                    renderWindowContent={renderWindowContent}
                    wallpaper={wallpaper}
                    setWallpaper={setWallpaper}
                    customBgUrl={customBgUrl}
                    setCustomBgUrl={setCustomBgUrl}
                    iconScale={iconScale}
                    setIconScale={setIconScale}
                    preferences={preferences}
                    availablePalettes={availablePalettes}
                    setMode={setMode}
                    setSeedPalette={setSeedPalette}
                    setGlassIntensity={setGlassIntensity}
                    setIconStyle={setIconStyle}
                    setCustomRadiusPx={setCustomRadiusPx}
                    resetPreferences={resetPreferences}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ==================================================================
           DESKTOP OS VIEWPORT
        ================================================================== */
        <div style={{ position: 'relative', flex: 1, padding: '16px 24px 96px', overflow: 'hidden' }}>
          {/* Search & Category Filter Bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 8,
              marginBottom: 16,
              maxWidth: 780,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                borderRadius: 999,
                backgroundColor: chromePillBg,
                backdropFilter: `blur(${glassBlur}px) saturate(160%)`,
                border: chromeBorder,
                minWidth: 210,
              }}
            >
              <Search size={14} color={chromeText} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enterprise modüllerde ara..."
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: chromeText,
                  fontSize: 12.5,
                  fontWeight: 600,
                  width: '100%',
                }}
              />
            </div>

            {(['Tümü', 'Dashboard', 'Commerce', 'Components', 'Pages', 'Apps'] as const).map(
              (cat) => {
                const active = categoryFilter === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    style={{
                      border: active ? '1px solid transparent' : chromeBorder,
                      padding: '6px 12px',
                      borderRadius: 999,
                      fontSize: 11.5,
                      fontWeight: 700,
                      cursor: 'pointer',
                      backgroundColor: active
                        ? isDark
                          ? '#f8fafc'
                          : '#0f172a'
                        : chromePillBg,
                      color: active
                        ? isDark
                          ? '#0f172a'
                          : '#ffffff'
                        : chromeText,
                      backdropFilter: `blur(${glassBlur}px)`,
                    }}
                  >
                    {cat}
                  </button>
                );
              }
            )}
          </div>

          {/* Enterprise Desktop Icon Grid (Vertical Column Flow + Free Grid Drop) */}
          <div
            className="macosgl-scroll"
            style={{
              display: 'grid',
              gridAutoFlow: 'column',
              gridTemplateRows: `repeat(${rowsPerColumn}, ${cellHeight}px)`,
              gridTemplateColumns: `repeat(${colsCount}, ${cellWidth}px)`,
              gap: '8px 12px',
              width: '100%',
              height: availableGridHeight,
              overflow: 'hidden',
              transform: 'translateZ(0)',
            }}
          >
            {Array.from({ length: totalGridSlots }, (_, slotIdx) => {
              const app = slotToApp.get(slotIdx);
              const isDropHighlight = draggedAppId !== null && dragOverSlot === slotIdx;

              if (!app) {
                return (
                  <div
                    key={`slot-${slotIdx}`}
                    onDragOver={(e) => {
                      if (!draggedAppId) return;
                      e.preventDefault();
                      if (dragOverSlot !== slotIdx) setDragOverSlot(slotIdx);
                    }}
                    onDragLeave={() => {
                      if (dragOverSlot === slotIdx) setDragOverSlot(null);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleDropOnSlot(slotIdx);
                    }}
                    style={{
                      width: cellWidth,
                      height: cellHeight,
                      borderRadius: 16,
                      border: isDropHighlight
                        ? '1.5px dashed rgba(255,255,255,0.65)'
                        : '1.5px solid transparent',
                      backgroundColor: isDropHighlight ? 'rgba(255,255,255,0.12)' : 'transparent',
                      transition: 'background-color 0.12s ease, border-color 0.12s ease',
                    }}
                  />
                );
              }

              const isOpen = windows.some((w) => w.appId === app.id);
              const isNumericBadge = app.badge && /^\d+$/.test(app.badge);

              return (
                <button
                  key={app.id}
                  type="button"
                  draggable
                  onDragStart={() => setDraggedAppId(app.id)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (dragOverSlot !== slotIdx) setDragOverSlot(slotIdx);
                  }}
                  onDragLeave={() => {
                    if (dragOverSlot === slotIdx) setDragOverSlot(null);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleDropOnSlot(slotIdx);
                  }}
                  onDragEnd={() => {
                    setDraggedAppId(null);
                    setDragOverSlot(null);
                  }}
                  className="macosgl-app-btn"
                  onClick={() => openApp(app.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 6,
                    border: isDropHighlight && draggedAppId !== app.id
                      ? '1.5px dashed rgba(255,255,255,0.75)'
                      : '1.5px solid transparent',
                    background: isDropHighlight && draggedAppId !== app.id
                      ? 'rgba(255,255,255,0.14)'
                      : 'transparent',
                    borderRadius: 16,
                    padding: '6px 4px',
                    cursor: 'pointer',
                    opacity: draggedAppId === app.id ? 0.45 : 1,
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: iconBoxSize,
                      height: iconBoxSize,
                      borderRadius: Math.round(iconBoxSize * 0.26),
                      background: app.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow:
                        '0 12px 26px rgba(0, 0, 0, 0.32), 0 2px 6px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.42)',
                      color: '#ffffff',
                    }}
                  >
                    <GoogleIcon name={app.googleIcon} size={iconGlyphSize} />
                    {isNumericBadge && (
                      <span
                        style={{
                          position: 'absolute',
                          top: -5,
                          right: -5,
                          minWidth: 19,
                          height: 19,
                          padding: '0 5px',
                          borderRadius: 999,
                          backgroundColor: '#ef4444',
                          color: '#ffffff',
                          fontSize: 10.5,
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 6px rgba(239, 68, 68, 0.45)',
                          border: '2px solid rgba(255,255,255,0.92)',
                        }}
                      >
                        {app.badge}
                      </span>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: barTextColor,
                      textShadow:
                        wp.isLight && !customBgUrl.trim()
                          ? 'none'
                          : '0 1px 6px rgba(0, 0, 0, 0.65)',
                      textAlign: 'center',
                      lineHeight: 1.2,
                    }}
                  >
                    {app.label}
                  </span>
                  {isOpen && (
                    <span
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: 999,
                        marginTop: -3,
                        backgroundColor: barTextColor,
                        opacity: 0.85,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* ================================================================
              FLOATING GLASSMORPHIC WINDOWS (DRAG + RESIZE + CLOSE + ARRANGE)
          ================================================================ */}
          {windows
            .filter((w) => !w.minimized)
            .map((win) => {
              const app = ENTERPRISE_APPS.find((m) => m.id === win.appId);
              if (!app) return null;
              return (
                <div
                  key={win.id}
                  ref={(el) => {
                    windowRefs.current[win.id] = el;
                  }}
                  onMouseDown={() => focusWindow(win.id)}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    transform: win.maximized
                      ? 'translate3d(14px, 12px, 0)'
                      : `translate3d(${win.x}px, ${win.y}px, 0)`,
                    willChange: 'transform',
                    contain: 'layout style',
                    width: win.maximized ? 'calc(100% - 28px)' : win.width,
                    height: win.maximized ? 'calc(100% - 104px)' : win.height,
                    zIndex: win.zIndex,
                    borderRadius: preferences.customRadiusPx ? preferences.customRadiusPx + 6 : 18,
                    backgroundColor: `color-mix(in srgb, ${paletteTokens.bgElevated} ${Math.round(glassOpacity * 100)}%, transparent)`,
                    backdropFilter: `blur(${glassBlur}px) saturate(160%)`,
                    WebkitBackdropFilter: `blur(${glassBlur}px) saturate(160%)`,
                    border: `1px solid ${paletteTokens.borderStrong}`,
                    boxShadow: `0 28px 70px rgba(0, 0, 0, 0.34), inset 0 1px 0 ${paletteTokens.surfaceTonal}`,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    color: paletteTokens.textPrimary,
                  }}
                >
                  {/* Title Bar */}
                  <div
                    onPointerDown={(e) => handlePointerDownTitle(e, win)}
                    onPointerMove={handlePointerMoveTitle}
                    onPointerUp={handlePointerUpTitle}
                    onDoubleClick={() => toggleMaximize(win.id)}
                    style={{
                      height: 44,
                      padding: '0 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: `color-mix(in srgb, ${paletteTokens.surfaceTonal} 42%, transparent)`,
                      borderBottom: `1px solid ${paletteTokens.borderSubtle}`,
                      cursor: win.maximized ? 'default' : 'grab',
                      userSelect: 'none',
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <MacOSTrafficLights
                        maximized={win.maximized}
                        onClose={() => closeWindow(win.id)}
                        onMinimize={() => toggleMinimize(win.id)}
                        onMaximize={() => toggleMaximize(win.id)}
                      />
                      <div
                        style={{
                          marginLeft: 6,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0.85,
                        }}
                      >
                        <GoogleIcon name={app.googleIcon} size={16} />
                      </div>
                      <span style={{ fontSize: 13.5, fontWeight: 800 }}>{app.label}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Badge size="sm" variant="tonal" tone="info">
                        {app.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Real Interactive Page Content */}
                  <div
                    className="macosgl-scroll"
                    style={{
                      flex: 1,
                      minHeight: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      padding:
                        app.id === 'analytics-telemetry' ||
                        app.id === 'datatable-statcard' ||
                        app.id === 'crm-orders' ||
                        app.id === 'filemangl-explorer' ||
                        app.id === 'file-manager'
                          ? 0
                          : 16,
                      overflowY:
                        app.id === 'analytics-telemetry' ||
                        app.id === 'datatable-statcard' ||
                        app.id === 'crm-orders' ||
                        app.id === 'filemangl-explorer' ||
                        app.id === 'file-manager'
                          ? 'hidden'
                          : 'auto',
                    }}
                  >
                    <OSWindowContent
                      app={app}
                      contentWidth={
                        win.maximized
                          ? (typeof window !== 'undefined' ? window.innerWidth : 1280) - 28
                          : win.width
                      }
                      contentHeight={
                        win.maximized
                          ? (typeof window !== 'undefined' ? window.innerHeight : 800) - 148
                          : win.height - 44
                      }
                      renderWindowContent={renderWindowContent}
                      wallpaper={wallpaper}
                      setWallpaper={setWallpaper}
                      customBgUrl={customBgUrl}
                      setCustomBgUrl={setCustomBgUrl}
                      iconScale={iconScale}
                      setIconScale={setIconScale}
                      preferences={preferences}
                      availablePalettes={availablePalettes}
                      setMode={setMode}
                      setSeedPalette={setSeedPalette}
                      setGlassIntensity={setGlassIntensity}
                      setIconStyle={setIconStyle}
                      setCustomRadiusPx={setCustomRadiusPx}
                      resetPreferences={resetPreferences}
                    />
                  </div>

                  {/* Bottom-Right Resize Handle (visible only on hover) */}
                  {!win.maximized && (
                    <div
                      className="macosgl-resize-handle"
                      onPointerDown={(e) => handlePointerDownResize(e, win)}
                      onPointerMove={handlePointerMoveResize}
                      onPointerUp={handlePointerUpResize}
                      title="Boyutlandır"
                      style={{
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                        width: 18,
                        height: 18,
                        cursor: 'nwse-resize',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                        padding: 4,
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRight: '2px solid currentColor',
                          borderBottom: '2px solid currentColor',
                          borderRadius: 1,
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}

          {/* ================================================================
              RIGHT-CLICK CONTEXT MENU
          ================================================================ */}
          {contextMenu && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'fixed',
                left: contextMenu.x,
                top: contextMenu.y,
                width: 232,
                padding: 6,
                borderRadius: 14,
                backgroundColor: isDark
                  ? 'rgba(15, 23, 42, 0.94)'
                  : 'rgba(255, 255, 255, 0.94)',
                color: isDark ? '#f8fafc' : '#0f172a',
                backdropFilter: 'blur(26px)',
                border: isDark
                  ? '1px solid rgba(255,255,255,0.16)'
                  : '1px solid rgba(15,23,42,0.12)',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.36)',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                zIndex: 999,
              }}
            >
              <ContextMenuItem
                icon={<Sparkles size={14} />}
                label="Yeni Pencere (Dashboard)"
                onClick={() => {
                  openApp('overview');
                  setContextMenu(null);
                }}
              />
              <ContextMenuItem
                icon={<Grid2x2 size={14} />}
                label="Pencereleri Izgara Diz"
                onClick={() => {
                  arrangeWindows('grid');
                  setContextMenu(null);
                }}
              />
              <ContextMenuItem
                icon={<Layers size={14} />}
                label="Kademeli Diz (Cascade)"
                onClick={() => {
                  arrangeWindows('cascade');
                  setContextMenu(null);
                }}
              />
              <ContextMenuItem
                icon={<Columns2 size={14} />}
                label="Yan Yana Diz"
                onClick={() => {
                  arrangeWindows('side-by-side');
                  setContextMenu(null);
                }}
              />
              <div style={{ height: 1, backgroundColor: 'rgba(148,163,184,0.2)', margin: '4px 0' }} />
              <div style={{ padding: '4px 8px', fontSize: 10.5, fontWeight: 700, opacity: 0.6 }}>
                macOS Duvar Kağıdı
              </div>
              <div style={{ display: 'flex', gap: 6, padding: '4px 8px 6px', flexWrap: 'wrap' }}>
                {(Object.keys(MACOS_WALLPAPERS) as MacOSWallpaperId[]).map((wpId) => (
                  <button
                    key={wpId}
                    type="button"
                    title={MACOS_WALLPAPERS[wpId].name}
                    onClick={() => {
                      setCustomBgUrl('');
                      setWallpaper(wpId);
                      setContextMenu(null);
                    }}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 999,
                      border: wallpaper === wpId ? '2px solid #3b82f6' : '1px solid rgba(148,163,184,0.4)',
                      background: MACOS_WALLPAPERS[wpId].preview,
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
              <div style={{ height: 1, backgroundColor: 'rgba(148,163,184,0.2)', margin: '4px 0' }} />
              <ContextMenuItem
                icon={<Palette size={14} />}
                label="OS Tema Stüdyosu"
                onClick={() => {
                  openApp('os-theme-studio');
                  setContextMenu(null);
                }}
              />
              <ContextMenuItem
                icon={<RotateCcw size={14} />}
                label="Simge Sıralamasını Sıfırla"
                onClick={() => {
                  const reset: Record<string, number> = {};
                  ENTERPRISE_APPS.forEach((app, idx) => {
                    reset[app.id] = idx;
                  });
                  setIconSlots(reset);
                  setContextMenu(null);
                }}
              />
              <ContextMenuItem
                icon={<Trash2 size={14} />}
                label="Tüm Pencereleri Kapat"
                onClick={() => {
                  setWindows([]);
                  setContextMenu(null);
                }}
              />
            </div>
          )}

          {/* ================================================================
              macOS FLOATING BOTTOM DOCK (DARK MODE AWARE + FISHEYE EFFECT)
          ================================================================ */}
          <div
            onMouseEnter={handleDockMouseEnter}
            onMouseMove={handleDockMouseMove}
            onMouseLeave={handleDockMouseLeave}
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 14,
              transform: 'translateX(-50%)',
              padding: '8px 14px',
              borderRadius: 22,
              backgroundColor: isDark
                ? 'rgba(15, 23, 42, 0.62)'
                : 'rgba(255, 255, 255, 0.54)',
              backdropFilter: 'blur(24px) saturate(160%)',
              WebkitBackdropFilter: 'blur(24px) saturate(160%)',
              border: isDark
                ? '1px solid rgba(255, 255, 255, 0.14)'
                : '1px solid rgba(255, 255, 255, 0.56)',
              boxShadow: isDark
                ? '0 22px 54px rgba(0, 0, 0, 0.55)'
                : '0 20px 50px rgba(15, 23, 42, 0.22)',
              display: 'flex',
              alignItems: 'flex-end',
              height: 62,
              gap: 10,
              zIndex: 95,
            }}
          >
            {DOCK_APP_IDS.map((id, idx) => {
              const app = ENTERPRISE_APPS.find((m) => m.id === id)!;
              const isRunning = windows.some((w) => w.appId === id);
              return (
                <button
                  key={id}
                  ref={(el) => {
                    dockItemRefs.current[idx] = el;
                  }}
                  type="button"
                  title={app.label}
                  onClick={() => openApp(id)}
                  style={{
                    position: 'relative',
                    width: 46,
                    height: 46,
                    borderRadius: 13,
                    border: 'none',
                    background: app.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#ffffff',
                    boxShadow:
                      '0 8px 18px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.4)',
                    transition: 'width 0.1s ease-out, height 0.1s ease-out, border-radius 0.1s ease-out',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.1s ease-out', pointerEvents: 'none' }}>
                    <GoogleIcon name={app.googleIcon} size={28} />
                  </span>
                  {isRunning && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: -5,
                        width: 5,
                        height: 5,
                        borderRadius: 999,
                        backgroundColor: isDark ? '#f8fafc' : '#0f172a',
                      }}
                    />
                  )}
                </button>
              );
            })}

            <div
              style={{
                width: 1,
                height: 30,
                alignSelf: 'center',
                backgroundColor: isDark
                  ? 'rgba(255,255,255,0.16)'
                  : 'rgba(15,23,42,0.16)',
                margin: '0 2px',
              }}
            />

            <button
              ref={(el) => {
                dockItemRefs.current[DOCK_APP_IDS.length] = el;
              }}
              type="button"
              title="Pencereleri Izgara Diz"
              onClick={() => arrangeWindows('grid')}
              style={{
                width: 44,
                height: 44,
                borderRadius: 13,
                border: 'none',
                backgroundColor: isDark
                  ? 'rgba(255,255,255,0.10)'
                  : 'rgba(15,23,42,0.08)',
                color: isDark ? '#f8fafc' : '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'width 0.1s ease-out, height 0.1s ease-out, border-radius 0.1s ease-out',
                flexShrink: 0,
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.1s ease-out', pointerEvents: 'none' }}>
                <Grid2x2 size={18} />
              </span>
            </button>

            <button
              ref={(el) => {
                dockItemRefs.current[DOCK_APP_IDS.length + 1] = el;
              }}
              type="button"
              title="Pencereleri Sıfırla"
              onClick={() =>
                setWindows([
                  {
                    id: `win-overview-${Date.now()}`,
                    appId: 'overview',
                    x: 320,
                    y: 62,
                    width: 680,
                    height: 480,
                    zIndex: topZ + 1,
                    minimized: false,
                    maximized: false,
                  },
                ])
              }
              style={{
                width: 44,
                height: 44,
                borderRadius: 13,
                border: 'none',
                backgroundColor: isDark
                  ? 'rgba(255,255,255,0.10)'
                  : 'rgba(15,23,42,0.08)',
                color: isDark ? '#f8fafc' : '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'width 0.1s ease-out, height 0.1s ease-out, border-radius 0.1s ease-out',
                flexShrink: 0,
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.1s ease-out', pointerEvents: 'none' }}>
                <RotateCcw size={18} />
              </span>
            </button>

            <button
              ref={(el) => {
                dockItemRefs.current[DOCK_APP_IDS.length + 2] = el;
              }}
              type="button"
              title="Tüm Pencereleri Kapat"
              onClick={() => setWindows([])}
              style={{
                width: 44,
                height: 44,
                borderRadius: 13,
                border: 'none',
                backgroundColor: isDark
                  ? 'rgba(255,255,255,0.10)'
                  : 'rgba(15,23,42,0.08)',
                color: isDark ? '#f8fafc' : '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'width 0.1s ease-out, height 0.1s ease-out, border-radius 0.1s ease-out',
                flexShrink: 0,
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.1s ease-out', pointerEvents: 'none' }}>
                <Trash2 size={18} />
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MacOSTrafficLights({
  maximized,
  onClose,
  onMinimize,
  onMaximize,
}: {
  maximized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const btnStyle = (bg: string): React.CSSProperties => ({
    width: 13,
    height: 13,
    borderRadius: 999,
    border: 'none',
    backgroundColor: bg,
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(15, 23, 42, 0.78)',
    fontSize: 10,
    fontWeight: 900,
    lineHeight: 1,
    boxShadow: 'inset 0 0 0 0.5px rgba(0, 0, 0, 0.16)',
  });

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onPointerDown={(e) => e.stopPropagation()}
      style={{ display: 'flex', alignItems: 'center', gap: 7 }}
    >
      <button
        type="button"
        aria-label="Kapat"
        title="Kapat"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        style={btnStyle('#ff5f57')}
      >
        {hovered ? (
          <svg width="7" height="7" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M1.5 1.5L6.5 6.5M6.5 1.5L1.5 6.5" />
          </svg>
        ) : null}
      </button>
      <button
        type="button"
        aria-label="Küçült"
        title="Küçült"
        onClick={(e) => {
          e.stopPropagation();
          onMinimize();
        }}
        style={btnStyle('#febc2e')}
      >
        {hovered ? (
          <svg width="7" height="7" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M1.5 4H6.5" />
          </svg>
        ) : null}
      </button>
      <button
        type="button"
        aria-label="Büyüt"
        title={maximized ? 'Önceki Boyut' : 'Tam Ekran'}
        onClick={(e) => {
          e.stopPropagation();
          onMaximize();
        }}
        style={btnStyle('#28c840')}
      >
        {hovered ? (
          maximized ? (
            <svg width="7" height="7" viewBox="0 0 8 8" fill="currentColor">
              <path d="M1.5 6.5H4.8L1.5 3.2V6.5ZM6.5 1.5H3.2L6.5 4.8V1.5Z" />
            </svg>
          ) : (
            <svg width="7" height="7" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M4 1.5V6.5M1.5 4H6.5" />
            </svg>
          )
        ) : null}
      </button>
    </div>
  );
}

function ContextMenuItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '7px 10px',
        borderRadius: 8,
        border: 'none',
        background: 'transparent',
        color: 'inherit',
        fontSize: 12.5,
        fontWeight: 600,
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.16)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

const MenuBarClock = memo(function MenuBarClock() {
  const [clock, setClock] = useState(() =>
    new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  );
  useEffect(() => {
    const timer = setInterval(() => {
      setClock(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
    }, 30_000);
    return () => clearInterval(timer);
  }, []);
  return (
    <span style={{ fontSize: 12, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
      {clock}
    </span>
  );
});

const OSWindowContent = memo(function OSWindowContent({
  app,
  contentWidth,
  contentHeight,
  renderWindowContent,
  wallpaper,
  setWallpaper,
  customBgUrl,
  setCustomBgUrl,
  iconScale,
  setIconScale,
  preferences,
  availablePalettes,
  setMode,
  setSeedPalette,
  setGlassIntensity,
  setIconStyle,
  setCustomRadiusPx,
  resetPreferences,
}: {
  app: EnterpriseOSApp;
  contentWidth?: number;
  contentHeight?: number;
  renderWindowContent?: (appId: string) => React.ReactNode;
  wallpaper: MacOSWallpaperId;
  setWallpaper: (wp: MacOSWallpaperId) => void;
  customBgUrl: string;
  setCustomBgUrl: (url: string) => void;
  iconScale: 'sm' | 'md' | 'lg';
  setIconScale: (s: 'sm' | 'md' | 'lg') => void;
  preferences: ReturnType<typeof useTheme>['preferences'];
  availablePalettes: ReturnType<typeof useTheme>['availablePalettes'];
  setMode: (m: ThemeMode) => void;
  setSeedPalette: (id: SeedPaletteId) => void;
  setGlassIntensity: (v: number) => void;
  setIconStyle: (s: GoogleIconStyle) => void;
  setCustomRadiusPx: (px: number) => void;
  resetPreferences: () => void;
}) {
  const [activePage, setActivePage] = useState<PageTemplateId>(() =>
    app.id.startsWith('page-') ? (app.id as PageTemplateId) : 'page-login'
  );
  const [formSwitch, setFormSwitch] = useState(true);
  const [formInput, setFormInput] = useState('');

  if (renderWindowContent) {
    const custom = renderWindowContent(app.id);
    if (custom) return <>{custom}</>;
  }

  // Real Enterprise Page Content inside Floating Windows
  if (app.id === 'overview' || app.id === 'analytics' || app.id === 'reports') {
    return <AnalyticsDashboardView />;
  }

  if (app.id === 'analytics-telemetry' || app.id === 'datatable-statcard' || app.id === 'crm-orders') {
    return (
      <div className="macosgl-fullbleed">
        <SheetGLGridAdapter
          datasetPreset={app.id === 'analytics-telemetry' ? 'cloud-telemetry' : 'finance-erp'}
          height="100%"
        />
      </div>
    );
  }

  if (app.id === 'filemangl-explorer' || app.id === 'file-manager') {
    const showInspector = (contentWidth ?? 720) >= 920;
    return (
      <div className="macosgl-fullbleed">
        <FileManGLExplorerAdapter
          height="100%"
          enableDetailsInspector={showInspector}
        />
      </div>
    );
  }

  if (app.id === 'settings' || app.id === 'security') {
    return <EnterpriseSettingsPage />;
  }

  if (app.id.startsWith('page-')) {
    return (
      <PageTemplatesShowcaseView
        activePageId={activePage}
        onPageChange={setActivePage}
        onNavigateHome={() => setActivePage('page-login')}
      />
    );
  }

  if (app.id === 'os-theme-studio') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>
            Görünüm Modu (Dark / Light / System)
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['light', 'dark', 'system'] as ThemeMode[]).map((m) => (
              <Button
                key={m}
                size="sm"
                variant={preferences.mode === m ? 'filled' : 'outlined'}
                onClick={() => setMode(m)}
              >
                {m === 'light' ? 'Aydınlık' : m === 'dark' ? 'Karanlık' : 'Sistem'}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>
            macOS Duvar Kağıtları (6 Özel Üretim)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {(Object.keys(MACOS_WALLPAPERS) as MacOSWallpaperId[]).map((key) => {
              const item = MACOS_WALLPAPERS[key];
              const active = wallpaper === key && !customBgUrl.trim();
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setCustomBgUrl('');
                    setWallpaper(key);
                  }}
                  style={{
                    padding: 6,
                    borderRadius: 12,
                    border: active ? '2px solid #3b82f6' : '1px solid rgba(148,163,184,0.28)',
                    background: 'transparent',
                    color: 'inherit',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div
                    style={{
                      height: 36,
                      borderRadius: 8,
                      background: item.preview,
                      marginBottom: 5,
                    }}
                  />
                  <div style={{ fontSize: 11, fontWeight: 700 }}>{item.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>
            Özel Arka Plan Görsel URL
          </div>
          <Input
            placeholder="https://... (boş bırakılırsa macOS teması kullanılır)"
            value={customBgUrl}
            onChange={(val) => setCustomBgUrl(val)}
          />
        </div>

        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>
            Pencere Cam Yoğunluğu ({preferences.glassIntensity}%)
          </div>
          <Slider
            min={0}
            max={100}
            value={preferences.glassIntensity}
            onChange={setGlassIntensity}
          />
        </div>

        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>
            Pencere Köşe Yuvarlaklığı ({preferences.customRadiusPx ?? 12}px)
          </div>
          <Slider
            min={0}
            max={28}
            value={preferences.customRadiusPx ?? 12}
            onChange={setCustomRadiusPx}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>Simge Boyutu</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['sm', 'md', 'lg'] as const).map((sz) => (
                <Button
                  key={sz}
                  size="sm"
                  variant={iconScale === sz ? 'filled' : 'outlined'}
                  onClick={() => setIconScale(sz)}
                >
                  {sz === 'sm' ? 'Küçük' : sz === 'md' ? 'Orta' : 'Büyük'}
                </Button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>İkon Stili</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['rounded', 'outlined', 'sharp'] as GoogleIconStyle[]).map((st) => (
                <Button
                  key={st}
                  size="sm"
                  variant={preferences.iconStyle === st ? 'filled' : 'outlined'}
                  onClick={() => setIconStyle(st)}
                >
                  {st}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>
            Tohum Renk Paleti (Seed Palette)
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {availablePalettes.map((pal) => (
              <Button
                key={pal.id}
                size="sm"
                variant={preferences.seedPalette === pal.id ? 'filled' : 'outlined'}
                onClick={() => setSeedPalette(pal.id)}
              >
                {pal.name}
              </Button>
            ))}
          </div>
        </div>

        <Button variant="outlined" size="sm" onClick={resetPreferences}>
          Varsayılan Ayarlara Sıfırla
        </Button>
      </div>
    );
  }

  // Interactive Enterprise Module View (Users, Products, Forms, Messages, Calendar, Components)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>{app.label}</h3>
          <p style={{ margin: '2px 0 0', fontSize: 12.5, opacity: 0.72 }}>
            uxiGL {app.category} modülü — yüzen pencere içinde tam etkileşimli içerik.
          </p>
        </div>
        {app.badge && (
          <Badge variant="tonal" tone="info">
            {app.badge}
          </Badge>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <Input
            placeholder={`${app.label} içinde hızlı işlem veya arama...`}
            value={formInput}
            onChange={(val) => setFormInput(val)}
          />
        </div>
        <Switch value={formSwitch} onChange={setFormSwitch} />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 10,
        }}
      >
        {[
          { k: 'Aktif Kayıt', v: '1.248' },
          { k: 'Canlı Senkron', v: formSwitch ? 'Açık' : 'Duraklatıldı' },
          { k: 'Yanıt Süresi', v: '14 ms' },
        ].map((item) => (
          <div
            key={item.k}
            style={{
              padding: 12,
              borderRadius: 12,
              backgroundColor: 'rgba(148, 163, 184, 0.12)',
              border: '1px solid rgba(148, 163, 184, 0.18)',
            }}
          >
            <div style={{ fontSize: 11, opacity: 0.7 }}>{item.k}</div>
            <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>{item.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default MacOSGLDemo;
