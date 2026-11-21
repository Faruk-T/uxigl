import React, { useRef, useState } from 'react';
import { GripHorizontal } from 'lucide-react';
import {
  DEFAULT_WIDGET_SIZES,
  WIDGET_GRID_STEP,
  WIDGET_MAX_HEIGHT,
  WIDGET_MAX_WIDTH,
  WIDGET_MIN_HEIGHT,
  WIDGET_MIN_WIDTH,
  type DesktopWidgetId,
  type QualityMode,
  type WidgetPosition,
  type WidgetSize,
} from './types';
import {
  ClockWidgetCard,
  DashboardKpiWidgetCard,
  SystemStatusWidgetCard,
  type WidgetThemeStyle,
} from './widgets/widgetCards';
import {
  FocusTimerWidgetCard,
  QuickNotesWidgetCard,
} from './widgets/widgetProductivityCards';
import { TodoWidgetCard } from './widgets/TodoWidgetCard';

function snapToGrid(val: number): number {
  return Math.round(val / WIDGET_GRID_STEP) * WIDGET_GRID_STEP;
}

export function DesktopWidgets({
  locale,
  isDark,
  glassOpacity,
  glassBlur,
  primaryColor,
  qualityMode,
  setQualityMode,
  openWindowCount,
  enabledWidgets,
  widgetPositions,
  onMoveWidget,
  widgetSizes,
  onResizeWidget,
  viewportSize,
  onOpenApp,
}: {
  locale: 'tr' | 'en';
  isDark: boolean;
  glassOpacity: number;
  glassBlur: number;
  primaryColor: string;
  qualityMode: QualityMode;
  setQualityMode: (q: QualityMode) => void;
  openWindowCount: number;
  enabledWidgets: Record<DesktopWidgetId, boolean>;
  widgetPositions: Record<DesktopWidgetId, WidgetPosition>;
  onMoveWidget: (id: DesktopWidgetId, pos: WidgetPosition) => void;
  widgetSizes: Record<DesktopWidgetId, WidgetSize>;
  onResizeWidget: (id: DesktopWidgetId, size: WidgetSize) => void;
  viewportSize: { w: number; h: number };
  onOpenApp: (id: string) => void;
}) {
  const [draggingId, setDraggingId] = useState<DesktopWidgetId | null>(null);
  const [dragPreviewPos, setDragPreviewPos] = useState<WidgetPosition | null>(null);
  const dragRef = useRef<{
    id: DesktopWidgetId;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    width: number;
    height: number;
  } | null>(null);

  const [resizingId, setResizingId] = useState<DesktopWidgetId | null>(null);
  const [resizePreviewSize, setResizePreviewSize] = useState<WidgetSize | null>(null);
  const resizeRef = useRef<{
    id: DesktopWidgetId;
    startX: number;
    startY: number;
    origW: number;
    origH: number;
    posX: number;
    posY: number;
  } | null>(null);

  const baseCardStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    borderRadius: 16,
    padding: 13,
    backgroundColor: isDark
      ? `rgba(15, 23, 42, ${glassOpacity})`
      : `rgba(255, 255, 255, ${glassOpacity})`,
    color: isDark ? '#f8fafc' : '#0f172a',
    backdropFilter: glassBlur > 0 ? `blur(${glassBlur}px) saturate(160%)` : undefined,
    WebkitBackdropFilter: glassBlur > 0 ? `blur(${glassBlur}px) saturate(160%)` : undefined,
    border: isDark ? '1px solid rgba(255, 255, 255, 0.14)' : '1px solid rgba(255, 255, 255, 0.65)',
    boxShadow: isDark ? '0 14px 34px rgba(0, 0, 0, 0.34)' : '0 14px 34px rgba(15, 23, 42, 0.14)',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  };

  const baseTheme = {
    isTR: locale === 'tr',
    isDark,
    primaryColor,
    subtleBorder: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.10)',
    subtleBg: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.05)',
    cardStyle: baseCardStyle,
  };

  const clampSize = (rawW: number, rawH: number, posX: number, posY: number): WidgetSize => {
    const availW = Math.max(WIDGET_MIN_WIDTH, Math.min(WIDGET_MAX_WIDTH, viewportSize.w - posX - 12));
    const availH = Math.max(WIDGET_MIN_HEIGHT, Math.min(WIDGET_MAX_HEIGHT, viewportSize.h - posY - 44));
    return {
      width: Math.max(WIDGET_MIN_WIDTH, Math.min(rawW, availW)),
      height: Math.max(WIDGET_MIN_HEIGHT, Math.min(rawH, availH)),
    };
  };

  const clampPos = (rawX: number, rawY: number, width: number, height: number): WidgetPosition => {
    const maxX = Math.max(12, viewportSize.w - width - 12);
    const maxY = Math.max(12, viewportSize.h - 44 - Math.min(height, 140));
    return {
      x: Math.max(12, Math.min(rawX, maxX)),
      y: Math.max(12, Math.min(rawY, maxY)),
    };
  };

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    id: DesktopWidgetId
  ) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest('button, input, textarea, select, a, [data-widget-resize]')) return;
    e.stopPropagation();
    const size = widgetSizes[id] ?? DEFAULT_WIDGET_SIZES[id];
    const currentPos = clampPos(
      widgetPositions[id]?.x ?? 20,
      widgetPositions[id]?.y ?? 20,
      size.width,
      size.height
    );
    dragRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      origX: currentPos.x,
      origY: currentPos.y,
      width: size.width,
      height: size.height,
    };
    setDraggingId(id);
    setDragPreviewPos(currentPos);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d) return;
    const next = clampPos(
      d.origX + (e.clientX - d.startX),
      d.origY + (e.clientY - d.startY),
      d.width,
      d.height
    );
    setDragPreviewPos(next);
  };

  const handlePointerUp = () => {
    const d = dragRef.current;
    if (!d) return;
    const finalRaw = dragPreviewPos ?? { x: d.origX, y: d.origY };
    const snapped = clampPos(snapToGrid(finalRaw.x), snapToGrid(finalRaw.y), d.width, d.height);
    onMoveWidget(d.id, snapped);
    dragRef.current = null;
    setDraggingId(null);
    setDragPreviewPos(null);
  };

  const handleResizePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    id: DesktopWidgetId,
    pos: WidgetPosition,
    size: WidgetSize
  ) => {
    e.stopPropagation();
    e.preventDefault();
    resizeRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      origW: size.width,
      origH: size.height,
      posX: pos.x,
      posY: pos.y,
    };
    setResizingId(id);
    setResizePreviewSize(size);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleResizePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = resizeRef.current;
    if (!r) return;
    const next = clampSize(
      r.origW + (e.clientX - r.startX),
      r.origH + (e.clientY - r.startY),
      r.posX,
      r.posY
    );
    setResizePreviewSize(next);
  };

  const handleResizePointerUp = () => {
    const r = resizeRef.current;
    if (!r) return;
    const raw = resizePreviewSize ?? { width: r.origW, height: r.origH };
    const snapped = clampSize(snapToGrid(raw.width), snapToGrid(raw.height), r.posX, r.posY);
    onResizeWidget(r.id, snapped);
    resizeRef.current = null;
    setResizingId(null);
    setResizePreviewSize(null);
  };

  const renderWidgetNode = (id: DesktopWidgetId, theme: WidgetThemeStyle): React.ReactNode => {
    switch (id) {
      case 'clock':
        return <ClockWidgetCard theme={theme} onOpenCalendar={() => onOpenApp('calendar')} />;
      case 'kpi':
        return <DashboardKpiWidgetCard theme={theme} onOpenApp={onOpenApp} />;
      case 'timer':
        return <FocusTimerWidgetCard theme={theme} />;
      case 'todo':
        return <TodoWidgetCard theme={theme} />;
      case 'notes':
        return <QuickNotesWidgetCard theme={theme} />;
      case 'system':
        return (
          <SystemStatusWidgetCard
            theme={theme}
            qualityMode={qualityMode}
            setQualityMode={setQualityMode}
            openWindowCount={openWindowCount}
            glassBlur={glassBlur}
          />
        );
    }
  };

  const widgetIds: DesktopWidgetId[] = ['clock', 'kpi', 'timer', 'todo', 'notes', 'system'];

  return (
    <div
      aria-label="Desktop Widgets Layer"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2, // Strictly underneath FloatingWindows (zIndex >= 20)
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Subtle grid-snap target outline while dragging any widget */}
      {draggingId && dragPreviewPos && (() => {
        const dragSize = widgetSizes[draggingId] ?? DEFAULT_WIDGET_SIZES[draggingId];
        const snappedPos = clampPos(
          snapToGrid(dragPreviewPos.x),
          snapToGrid(dragPreviewPos.y),
          dragSize.width,
          dragSize.height
        );
        return (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: dragSize.width,
              height: dragSize.height,
              borderRadius: 16,
              border: `2px dashed ${primaryColor}`,
              backgroundColor: isDark ? 'rgba(59,130,246,0.10)' : 'rgba(59,130,246,0.08)',
              transform: `translate3d(${snappedPos.x}px, ${snappedPos.y}px, 0)`,
              transition: 'transform 80ms ease-out',
              pointerEvents: 'none',
            }}
          />
        );
      })()}

      {/* Subtle grid-snap target outline while resizing any widget */}
      {resizingId && resizePreviewSize && (() => {
        const rPos = clampPos(
          widgetPositions[resizingId]?.x ?? 20,
          widgetPositions[resizingId]?.y ?? 20,
          resizePreviewSize.width,
          resizePreviewSize.height
        );
        const snappedSize = clampSize(
          snapToGrid(resizePreviewSize.width),
          snapToGrid(resizePreviewSize.height),
          rPos.x,
          rPos.y
        );
        return (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: snappedSize.width,
              height: snappedSize.height,
              borderRadius: 16,
              border: `2px dashed ${primaryColor}`,
              backgroundColor: isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.06)',
              transform: `translate3d(${rPos.x}px, ${rPos.y}px, 0)`,
              transition: 'width 80ms ease-out, height 80ms ease-out',
              pointerEvents: 'none',
            }}
          />
        );
      })()}

      {widgetIds.map((id) => {
        if (!enabledWidgets[id]) return null;
        const isDragging = draggingId === id;
        const isResizing = resizingId === id;
        const defSize = DEFAULT_WIDGET_SIZES[id];
        const rawSize = isResizing && resizePreviewSize ? resizePreviewSize : (widgetSizes[id] ?? defSize);
        const basePos =
          isDragging && dragPreviewPos
            ? dragPreviewPos
            : clampPos(
                widgetPositions[id]?.x ?? 20,
                widgetPositions[id]?.y ?? 20,
                rawSize.width,
                rawSize.height
              );
        const size = clampSize(rawSize.width, rawSize.height, basePos.x, basePos.y);
        const scale = Math.max(
          0.85,
          Math.min(2.1, Math.min(size.width / defSize.width, size.height / defSize.height))
        );
        const widgetTheme: WidgetThemeStyle = {
          ...baseTheme,
          width: size.width,
          height: size.height,
          scale,
        };

        return (
          <div
            key={id}
            data-desktop-widget={id}
            onMouseDown={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.stopPropagation()}
            onPointerDown={(e) => handlePointerDown(e, id)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: size.width,
              height: size.height,
              transform: `translate3d(${basePos.x}px, ${basePos.y}px, 0)`,
              pointerEvents: 'auto',
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: isDragging || isResizing ? 'none' : undefined,
              opacity: isDragging ? 0.92 : 1,
              transition:
                isDragging || isResizing
                  ? 'none'
                  : 'transform 180ms cubic-bezier(0.22, 1, 0.36, 1), width 160ms ease, height 160ms ease',
            }}
          >
            {/* Subtle top drag grip indicator */}
            <div
              title={locale === 'tr' ? 'Izgarada taşımak için sürükleyin' : 'Drag to move on grid'}
              style={{
                position: 'absolute',
                top: 4,
                left: '50%',
                transform: 'translateX(-50%)',
                color: isDark ? 'rgba(255,255,255,0.28)' : 'rgba(15,23,42,0.25)',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            >
              <GripHorizontal size={12} />
            </div>

            {renderWidgetNode(id, widgetTheme)}

            {/* Bottom-right corner resize handle */}
            <div
              data-widget-resize={id}
              title={locale === 'tr' ? 'Boyutlandırmak için sürükleyin' : 'Drag to resize'}
              onPointerDown={(e) => handleResizePointerDown(e, id, basePos, size)}
              onPointerMove={handleResizePointerMove}
              onPointerUp={handleResizePointerUp}
              style={{
                position: 'absolute',
                right: 3,
                bottom: 3,
                width: 16,
                height: 16,
                cursor: 'nwse-resize',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                padding: 3,
                zIndex: 3,
                color: isDark ? 'rgba(255,255,255,0.34)' : 'rgba(15,23,42,0.30)',
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                <path
                  d="M9 3L3 9M9 6.5L6.5 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
