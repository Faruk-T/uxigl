import React, { useRef, useState } from 'react';
import type { FloatingWindowState, WindowBounds } from './types';
import {
  clampWindowDragPosition,
  computeResizedWindowBounds,
  computeUnmaximizeDragOrigin,
  detectEdgeSnapZone,
  type ResizeDirection,
  type SnapZone,
} from './windowGeometry';

export function useFloatingWindowPointer({
  setWindows,
  onFocus,
  onSnapWindow,
}: {
  setWindows: React.Dispatch<React.SetStateAction<FloatingWindowState[]>>;
  onFocus: (id: string) => void;
  onSnapWindow: (id: string, zone: Exclude<SnapZone, null>) => void;
}) {
  const windowRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [snapPreview, setSnapPreview] = useState<SnapZone>(null);

  const dragRef = useRef<{
    winId: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    winW: number;
    winH: number;
    curX: number;
    curY: number;
    wasMaximized: boolean;
    restoreFallback: WindowBounds;
    moved: boolean;
    snapZone: SnapZone;
    rafId: number | null;
  } | null>(null);

  const resizeRef = useRef<{
    winId: string;
    dir: ResizeDirection;
    startX: number;
    startY: number;
    orig: WindowBounds;
    cur: WindowBounds;
    rafId: number | null;
  } | null>(null);

  const handlePointerDownTitle = (
    e: React.PointerEvent<HTMLDivElement>,
    win: FloatingWindowState
  ) => {
    if (e.button !== 0 || win.fullscreen) return;
    if ((e.target as HTMLElement).closest('button')) return;
    onFocus(win.id);
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1366;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 860;
    const fallbackBounds: WindowBounds = win.restoreBounds ?? {
      x: Math.round(vw * 0.14),
      y: 24,
      width: Math.min(1080, Math.round(vw * 0.72)),
      height: Math.min(680, Math.round((vh - 44) * 0.78)),
    };
    dragRef.current = {
      winId: win.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: win.x,
      origY: win.y,
      winW: win.width,
      winH: win.height,
      curX: win.x,
      curY: win.y,
      wasMaximized: win.maximized,
      restoreFallback: fallbackBounds,
      moved: false,
      snapZone: null,
      rafId: null,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMoveTitle = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) < 5) return;

    const vw = typeof window !== 'undefined' ? window.innerWidth : 1366;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 860;

    if (drag.wasMaximized) {
      const origin = computeUnmaximizeDragOrigin(
        e.clientX,
        e.clientY,
        drag.restoreFallback,
        vw,
        vh
      );
      drag.wasMaximized = false;
      drag.startX = e.clientX;
      drag.startY = e.clientY;
      drag.origX = origin.x;
      drag.origY = origin.y;
      drag.winW = drag.restoreFallback.width;
      drag.winH = drag.restoreFallback.height;
      drag.curX = origin.x;
      drag.curY = origin.y;
      drag.moved = true;
      setWindows((prev) =>
        prev.map((w) =>
          w.id === drag.winId
            ? {
                ...w,
                maximized: false,
                restoreBounds: undefined,
                x: origin.x,
                y: origin.y,
                width: drag.restoreFallback.width,
                height: drag.restoreFallback.height,
              }
            : w
        )
      );
      return;
    }

    drag.moved = true;
    const clamped = clampWindowDragPosition(drag.origX + dx, drag.origY + dy, drag.winW, vw, vh);
    drag.curX = clamped.x;
    drag.curY = clamped.y;

    const nextZone = detectEdgeSnapZone(e.clientX, e.clientY, vw, vh);
    if (nextZone !== drag.snapZone) {
      drag.snapZone = nextZone;
      setSnapPreview(nextZone);
    }

    if (drag.rafId === null) {
      drag.rafId = requestAnimationFrame(() => {
        const el = windowRefs.current[drag.winId];
        if (el) {
          el.style.left = `${drag.curX}px`;
          el.style.top = `${drag.curY}px`;
        }
        drag.rafId = null;
      });
    }
  };

  const finishDragTitle = () => {
    const drag = dragRef.current;
    if (!drag) return;
    if (drag.rafId !== null) cancelAnimationFrame(drag.rafId);
    const { winId, curX, curY, moved, snapZone } = drag;
    dragRef.current = null;
    setSnapPreview(null);
    if (!moved) return;
    if (snapZone) {
      onSnapWindow(winId, snapZone);
      return;
    }
    setWindows((prev) =>
      prev.map((w) => (w.id === winId ? { ...w, x: curX, y: curY, restoreBounds: undefined } : w))
    );
  };

  const handlePointerDownResize = (
    e: React.PointerEvent<HTMLDivElement>,
    win: FloatingWindowState,
    dir: ResizeDirection
  ) => {
    e.stopPropagation();
    if (e.button !== 0 || win.maximized || win.fullscreen) return;
    onFocus(win.id);
    const orig: WindowBounds = { x: win.x, y: win.y, width: win.width, height: win.height };
    resizeRef.current = {
      winId: win.id,
      dir,
      startX: e.clientX,
      startY: e.clientY,
      orig,
      cur: { ...orig },
      rafId: null,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMoveResize = (e: React.PointerEvent<HTMLDivElement>) => {
    const res = resizeRef.current;
    if (!res) return;
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1366;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 860;
    res.cur = computeResizedWindowBounds(
      res.orig,
      res.dir,
      e.clientX - res.startX,
      e.clientY - res.startY,
      vw,
      vh
    );
    if (res.rafId === null) {
      res.rafId = requestAnimationFrame(() => {
        const el = windowRefs.current[res.winId];
        if (el) {
          el.style.left = `${res.cur.x}px`;
          el.style.top = `${res.cur.y}px`;
          el.style.width = `${res.cur.width}px`;
          el.style.height = `${res.cur.height}px`;
          el.style.setProperty('--osgl-win-body-h', `${Math.max(220, res.cur.height - 38)}px`);
        }
        window.dispatchEvent(new Event('resize'));
        res.rafId = null;
      });
    }
  };

  const finishResize = () => {
    const res = resizeRef.current;
    if (!res) return;
    if (res.rafId !== null) cancelAnimationFrame(res.rafId);
    const { winId, cur } = res;
    resizeRef.current = null;
    setWindows((prev) =>
      prev.map((w) => (w.id === winId ? { ...w, ...cur, restoreBounds: undefined } : w))
    );
    if (typeof window !== 'undefined') {
      requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
    }
  };

  return {
    windowRefs,
    snapPreview,
    handlePointerDownTitle,
    handlePointerMoveTitle,
    finishDragTitle,
    handlePointerDownResize,
    handlePointerMoveResize,
    finishResize,
  };
}
