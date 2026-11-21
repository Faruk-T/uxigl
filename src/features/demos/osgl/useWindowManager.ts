import { useEffect, useRef, useState } from 'react';
import { osWasmEngine } from '../OSGLEngine';
import type { FloatingWindowState, PersistedOSGLState, QualityMode, WindowBounds } from './types';

export const FULLBLEED_APP_IDS = new Set([
  'analytics-telemetry',
  'datatable-statcard',
  'crm-orders',
  'filemangl-explorer',
  'file-manager',
]);

export function useWindowManager({
  savedState,
  showMobileLayout,
  setMobileOpenAppId,
  windowAnimation,
  qualityMode,
  notify,
}: {
  savedState: PersistedOSGLState | null;
  showMobileLayout: boolean;
  setMobileOpenAppId: (id: string | null) => void;
  windowAnimation: boolean;
  qualityMode: QualityMode;
  notify: (input: { title: string; description: string; tone: 'info' | 'success' | 'warning' | 'danger' }) => void;
}) {
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
  const [closingWindowIds, setClosingWindowIds] = useState<string[]>([]);
  const [highlightedWindowId, setHighlightedWindowId] = useState<string | null>(null);
  const highlightTimerRef = useRef<number | null>(null);

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

  return {
    windows,
    setWindows,
    windowBoundsByApp,
    topZ,
    closingWindowIds,
    highlightedWindowId,
    openApp,
    focusWindow,
    closeWindow,
    toggleMinimize,
    toggleMaximize,
    arrangeWindows,
  };
}