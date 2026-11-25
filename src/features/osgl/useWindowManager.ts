import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  OS_THEME_STUDIO_APP_ID,
  type FloatingWindowState,
  type OSWorkspaceApp,
  type PersistedOSGLState,
  type QualityMode,
  type WindowArrangeMode,
  type WindowBounds,
} from './types';
import { clampWindowToViewport, type SnapZone } from './windowGeometry';
import {
  applyArrangeWindows,
  applySnapWindow,
  applyToggleFullscreen,
  applyToggleMaximize,
  buildOpenedWindowList,
  buildSideBySideWindowList,
  sanitizePersistedWindows,
} from './windowStateReducers';

export { clampWindowToViewport };

function notifyWindowReflow() {
  if (typeof window === 'undefined') return;
  window.requestAnimationFrame(() => {
    window.dispatchEvent(new Event('resize'));
  });
}

export function useWindowManager({
  apps,
  savedState,
  scopeKey,
  showMobileLayout,
  setMobileOpenAppId,
  windowAnimation,
  qualityMode,
  dockVisible = true,
  notify,
}: {
  apps: OSWorkspaceApp[];
  savedState: PersistedOSGLState | null;
  scopeKey?: string;
  showMobileLayout: boolean;
  setMobileOpenAppId: (id: string | null) => void;
  windowAnimation: boolean;
  qualityMode: QualityMode;
  dockVisible?: boolean;
  notify: (input: {
    title: string;
    description: string;
    tone: 'info' | 'success' | 'warning' | 'danger';
  }) => void;
}) {
  const allowedIds = useMemo(() => {
    const next = new Set(apps.map((a) => a.id));
    next.add(OS_THEME_STUDIO_APP_ID);
    return next;
  }, [apps]);

  const sanitizeWindows = useCallback(
    (rawWindows?: FloatingWindowState[], winMaxVer?: number): FloatingWindowState[] =>
      sanitizePersistedWindows({
        rawWindows,
        allowedIds,
        winMaxVer,
        vw: typeof window !== 'undefined' ? window.innerWidth : 1280,
        vh: typeof window !== 'undefined' ? window.innerHeight : 820,
      }),
    [allowedIds]
  );

  const [windows, setWindows] = useState<FloatingWindowState[]>(() =>
    sanitizeWindows(savedState?.windows, savedState?.windowMaxVersion)
  );
  const [windowBoundsByApp, setWindowBoundsByApp] = useState<Record<string, WindowBounds>>(
    () => savedState?.windowBoundsByApp ?? {}
  );
  const initialTopZ = savedState?.topZ ?? 24;
  const [topZ, setTopZ] = useState(initialTopZ);
  const topZRef = useRef(initialTopZ);
  const [closingWindowIds, setClosingWindowIds] = useState<string[]>([]);
  const [highlightedWindowId, setHighlightedWindowId] = useState<string | null>(null);
  const highlightTimerRef = useRef<number | null>(null);

  const allocateZ = useCallback((count = 1): number => {
    const start = topZRef.current + 1;
    topZRef.current += count;
    setTopZ(topZRef.current);
    return start;
  }, []);

  const prevScopeRef = useRef(scopeKey);
  useEffect(() => {
    if (prevScopeRef.current !== scopeKey) {
      prevScopeRef.current = scopeKey;
      const resetZ = savedState?.topZ ?? 24;
      topZRef.current = resetZ;
      setWindows(sanitizeWindows(savedState?.windows, savedState?.windowMaxVersion));
      setWindowBoundsByApp(savedState?.windowBoundsByApp ?? {});
      setTopZ(resetZ);
    } else {
      setWindows((prev) => prev.filter((w) => allowedIds.has(w.appId)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeKey, allowedIds, sanitizeWindows]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleViewportResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setWindows((prev) => {
        let changed = false;
        const next = prev.map((w) => {
          const clamped = clampWindowToViewport(w, vw, vh);
          if (clamped !== w) changed = true;
          return clamped;
        });
        return changed ? next : prev;
      });
    };
    window.addEventListener('resize', handleViewportResize);
    return () => window.removeEventListener('resize', handleViewportResize);
  }, []);

  useEffect(() => {
    setWindowBoundsByApp((prev) => {
      let changed = false;
      const next = { ...prev };
      windows.forEach((w) => {
        if (w.maximized || w.fullscreen) return;
        const targetBounds = w.restoreBounds ?? { x: w.x, y: w.y, width: w.width, height: w.height };
        const cur = next[w.appId];
        if (
          !cur ||
          cur.x !== targetBounds.x ||
          cur.y !== targetBounds.y ||
          cur.width !== targetBounds.width ||
          cur.height !== targetBounds.height
        ) {
          next[w.appId] = targetBounds;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [windows]);

  const openApp = useCallback(
    (appId: string) => {
      if (!allowedIds.has(appId)) return;
      if (showMobileLayout) {
        setMobileOpenAppId(appId);
        return;
      }
      const nextZ = allocateZ(1);
      const existingWin = windows.find((w) => w.appId === appId);
      if (existingWin && !existingWin.minimized) {
        if (highlightTimerRef.current !== null) window.clearTimeout(highlightTimerRef.current);
        setHighlightedWindowId(existingWin.id);
        highlightTimerRef.current = window.setTimeout(() => {
          setHighlightedWindowId(null);
          highlightTimerRef.current = null;
        }, 600);
      }
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1366;
      const vh = typeof window !== 'undefined' ? window.innerHeight : 860;
      setWindows((prev) =>
        buildOpenedWindowList({ prev, appId, apps, windowBoundsByApp, nextZ, vw, vh })
      );
      notifyWindowReflow();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [apps, showMobileLayout, windows, windowBoundsByApp, allocateZ, setMobileOpenAppId]
  );

  const openSideBySidePair = useCallback(
    (leftAppId: string, rightAppId: string) => {
      if (!allowedIds.has(leftAppId) || !allowedIds.has(rightAppId)) return;
      if (showMobileLayout) {
        setMobileOpenAppId(leftAppId);
        return;
      }
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1366;
      const vh = typeof window !== 'undefined' ? window.innerHeight : 860;
      const z1 = allocateZ(2);
      setWindows((prev) =>
        buildSideBySideWindowList({ prev, leftAppId, rightAppId, z1, vw, vh, dockVisible })
      );
      notifyWindowReflow();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [apps, showMobileLayout, dockVisible, allocateZ, setMobileOpenAppId]
  );

  const focusWindow = (winId: string) => {
    const nextZ = allocateZ(1);
    setWindows((prev) => prev.map((w) => (w.id === winId ? { ...w, zIndex: nextZ } : w)));
  };

  const closeWindow = (winId: string) => {
    if (windowAnimation && qualityMode === 'quality') {
      setClosingWindowIds((prev) => (prev.includes(winId) ? prev : [...prev, winId]));
      window.setTimeout(() => {
        setWindows((prev) => prev.filter((w) => w.id !== winId));
        setClosingWindowIds((prev) => prev.filter((id) => id !== winId));
      }, 150);
    } else {
      setWindows((prev) => prev.filter((w) => w.id !== winId));
    }
  };

  const toggleMinimize = (winId: string) =>
    setWindows((prev) =>
      prev.map((w) => (w.id === winId ? { ...w, minimized: !w.minimized, fullscreen: false } : w))
    );

  const toggleMaximize = (winId: string) => {
    const nextZ = allocateZ(1);
    setWindows((prev) => applyToggleMaximize(prev, winId, nextZ));
    notifyWindowReflow();
  };

  const toggleFullscreen = (winId: string) => {
    const nextZ = allocateZ(1);
    setWindows((prev) => applyToggleFullscreen(prev, winId, nextZ));
    notifyWindowReflow();
  };

  const snapWindow = (winId: string, zone: Exclude<SnapZone, null>) => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1366;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 860;
    const nextZ = allocateZ(1);
    setWindows((prev) => applySnapWindow(prev, winId, zone, nextZ, vw, vh, dockVisible));
    notifyWindowReflow();
  };

  const latestRef = useRef({ windows, closingWindowIds, closeWindow, toggleFullscreen });
  latestRef.current = { windows, closingWindowIds, closeWindow, toggleFullscreen };
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      if (
        document.querySelector(
          '[role="dialog"][aria-modal="true"], [role="alertdialog"], .sheetgl-container--fullscreen'
        )
      ) {
        return;
      }
      const { windows: wins, closingWindowIds: closing, closeWindow: closeFn, toggleFullscreen: exitFullFn } =
        latestRef.current;
      const activeTop = wins
        .filter((w) => !w.minimized && !closing.includes(w.id))
        .sort((a, b) => b.zIndex - a.zIndex)[0];
      if (!activeTop) return;
      e.preventDefault();
      if (activeTop.fullscreen) exitFullFn(activeTop.id);
      else closeFn(activeTop.id);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const arrangeWindows = (mode: WindowArrangeMode) => {
    if (windows.every((w) => w.minimized)) return;
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 820;
    setWindows((prev) => applyArrangeWindows(prev, mode, vw, vh, dockVisible));
    notifyWindowReflow();
    notify({
      title: 'Pencereler Düzenlendi',
      description:
        mode === 'quadrants'
          ? '4 köşe (2×2 kadran) pencere dizilimi uygulandı.'
          : mode === 'grid'
            ? 'Izgara (Grid) dizilimi uygulandı.'
            : mode === 'side-by-side'
              ? 'Yan yana (Sol / Sağ) dizilim uygulandı.'
              : 'Kademeli (Cascade) dizilim uygulandı.',
      tone: 'info',
    });
  };

  return {
    windows, setWindows, windowBoundsByApp, topZ, closingWindowIds, highlightedWindowId,
    openApp, openSideBySidePair, focusWindow, closeWindow,
    toggleMinimize, toggleMaximize, toggleFullscreen, snapWindow, arrangeWindows,
  };
}
