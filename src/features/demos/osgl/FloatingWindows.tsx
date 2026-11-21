import React, { useRef } from 'react';
import { Badge, GoogleIcon } from '../../../components/primitives';
import { osWasmEngine } from '../OSGLEngine';
import { ENTERPRISE_APPS, type FloatingWindowState, type QualityMode } from './types';
import { TrafficLights } from './WindowChrome';
import { WindowContent } from './WindowContent';
import { FULLBLEED_APP_IDS } from './useDesktopState';

export function FloatingWindows({
  windows,
  setWindows,
  closingWindowIds,
  highlightedWindowId,
  windowAnimation,
  qualityMode,
  glassOpacity,
  glassBlur,
  customRadiusPx,
  paletteTokens,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  renderWindowContent,
  sharedStudioProps,
}: {
  windows: FloatingWindowState[];
  setWindows: React.Dispatch<React.SetStateAction<FloatingWindowState[]>>;
  closingWindowIds: string[];
  highlightedWindowId: string | null;
  windowAnimation: boolean;
  qualityMode: QualityMode;
  glassOpacity: number;
  glassBlur: number;
  customRadiusPx?: number;
  paletteTokens: {
    primary: string;
    bgElevated: string;
    borderStrong: string;
    borderSubtle: string;
    surfaceTonal: string;
    textPrimary: string;
  };
  onFocus: (id: string) => void;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  renderWindowContent?: (appId: string) => React.ReactNode;
  sharedStudioProps: Omit<React.ComponentProps<typeof WindowContent>, 'app' | 'contentWidth' | 'renderWindowContent'>;
}) {
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

  const handlePointerDownTitle = (e: React.PointerEvent<HTMLDivElement>, win: FloatingWindowState) => {
    if (win.maximized) return;
    onFocus(win.id);
    dragRef.current = { winId: win.id, startX: e.clientX, startY: e.clientY, origX: win.x, origY: win.y, curX: win.x, curY: win.y, rafId: null };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMoveTitle = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const maxW = typeof window !== 'undefined' ? window.innerWidth - 120 : 1400;
    const maxH = typeof window !== 'undefined' ? window.innerHeight - 100 : 900;
    drag.curX = osWasmEngine.clamp(drag.origX + (e.clientX - drag.startX), 8, maxW);
    drag.curY = osWasmEngine.clamp(drag.origY + (e.clientY - drag.startY), 44, maxH);
    if (drag.rafId === null) {
      drag.rafId = requestAnimationFrame(() => {
        const el = windowRefs.current[drag.winId];
        if (el) el.style.transform = `translate3d(${drag.curX}px, ${drag.curY}px, 0)`;
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
    setWindows((prev) => prev.map((w) => (w.id === winId ? { ...w, x: curX, y: curY } : w)));
  };

  const handlePointerDownResize = (e: React.PointerEvent<HTMLDivElement>, win: FloatingWindowState) => {
    e.stopPropagation();
    if (win.maximized) return;
    onFocus(win.id);
    resizeRef.current = { winId: win.id, startX: e.clientX, startY: e.clientY, origW: win.width, origH: win.height, curW: win.width, curH: win.height, rafId: null };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMoveResize = (e: React.PointerEvent<HTMLDivElement>) => {
    const res = resizeRef.current;
    if (!res) return;
    res.curW = osWasmEngine.clamp(res.origW + (e.clientX - res.startX), 360, 1600);
    res.curH = osWasmEngine.clamp(res.origH + (e.clientY - res.startY), 280, 1000);
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
    setWindows((prev) => prev.map((w) => (w.id === winId ? { ...w, width: curW, height: curH } : w)));
  };

  return (
    <>
      {windows
        .filter((w) => !w.minimized)
        .map((win) => {
          const app = ENTERPRISE_APPS.find((m) => m.id === win.appId);
          if (!app) return null;
          const isFullBleed = FULLBLEED_APP_IDS.has(app.id);
          const isClosing = closingWindowIds.includes(win.id);
          const isHighlighted = highlightedWindowId === win.id;
          const winAnimClass = [
            windowAnimation && qualityMode === 'quality'
              ? isClosing
                ? 'macosgl-win-anim-close'
                : 'macosgl-win-anim-open'
              : '',
            isHighlighted ? 'osgl-win-highlight' : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <div
              key={win.id}
              data-macos-window="true"
              className={winAnimClass}
              ref={(el) => { windowRefs.current[win.id] = el; }}
              onMouseDown={() => onFocus(win.id)}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                transform: win.maximized ? 'translate3d(14px, 12px, 0)' : `translate3d(${win.x}px, ${win.y}px, 0)`,
                willChange: 'transform',
                contain: 'layout style',
                width: win.maximized ? 'calc(100% - 28px)' : win.width,
                height: win.maximized ? 'calc(100% - 104px)' : win.height,
                zIndex: win.zIndex,
                borderRadius: customRadiusPx ? customRadiusPx + 6 : 18,
                backgroundColor: `color-mix(in srgb, ${paletteTokens.bgElevated} ${Math.round(glassOpacity * 100)}%, transparent)`,
                backdropFilter: glassBlur > 0 ? `blur(${glassBlur}px) saturate(160%)` : undefined,
                WebkitBackdropFilter: glassBlur > 0 ? `blur(${glassBlur}px) saturate(160%)` : undefined,
                border: isHighlighted
                  ? `2px solid ${paletteTokens.primary}`
                  : `1px solid ${paletteTokens.borderStrong}`,
                boxShadow: isHighlighted
                  ? `0 0 0 4px color-mix(in srgb, ${paletteTokens.primary} 32%, transparent), 0 28px 80px color-mix(in srgb, ${paletteTokens.primary} 45%, rgba(0,0,0,0.45))`
                  : `0 28px 70px rgba(0, 0, 0, 0.34), inset 0 1px 0 ${paletteTokens.surfaceTonal}`,
                transition: 'border-color 0.18s ease, box-shadow 0.22s ease',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                color: paletteTokens.textPrimary,
              }}
            >
              <div
                onPointerDown={(e) => handlePointerDownTitle(e, win)}
                onPointerMove={handlePointerMoveTitle}
                onPointerUp={handlePointerUpTitle}
                onDoubleClick={() => onMaximize(win.id)}
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
                  <TrafficLights
                    maximized={win.maximized}
                    onClose={() => onClose(win.id)}
                    onMinimize={() => onMinimize(win.id)}
                    onMaximize={() => onMaximize(win.id)}
                  />
                  <div style={{ marginLeft: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.85 }}>
                    <GoogleIcon name={app.googleIcon} size={16} />
                  </div>
                  <span style={{ fontSize: 13.5, fontWeight: 800 }}>{app.label}</span>
                </div>
                <Badge size="sm" variant="tonal" tone="info">{app.category}</Badge>
              </div>

              <div
                className="macosgl-scroll"
                style={{
                  flex: 1,
                  minHeight: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: isFullBleed ? 0 : 16,
                  overflowY: isFullBleed ? 'hidden' : 'auto',
                }}
              >
                <WindowContent
                  app={app}
                  contentWidth={win.maximized ? (typeof window !== 'undefined' ? window.innerWidth : 1280) - 28 : win.width}
                  renderWindowContent={renderWindowContent}
                  {...sharedStudioProps}
                />
              </div>

              {!win.maximized && (
                <div
                  className="macosgl-resize-handle"
                  onPointerDown={(e) => handlePointerDownResize(e, win)}
                  onPointerMove={handlePointerMoveResize}
                  onPointerUp={handlePointerUpResize}
                  title="Boyutlandır"
                  style={{ position: 'absolute', right: 0, bottom: 0, width: 18, height: 18, cursor: 'nwse-resize', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: 4 }}
                >
                  <div style={{ width: 8, height: 8, borderRight: '2px solid currentColor', borderBottom: '2px solid currentColor', borderRadius: 1 }} />
                </div>
              )}
            </div>
          );
        })}
    </>
  );
}

