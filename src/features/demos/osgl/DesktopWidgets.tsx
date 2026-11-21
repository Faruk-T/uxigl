import React, { useRef, useState } from 'react';
import { GripHorizontal } from 'lucide-react';
import {
  WIDGET_CARD_WIDTH,
  WIDGET_GRID_STEP,
  type DesktopWidgetId,
  type QualityMode,
  type WidgetPosition,
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
  } | null>(null);

  const theme: WidgetThemeStyle = {
    isTR: locale === 'tr',
    isDark,
    primaryColor,
    subtleBorder: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.10)',
    subtleBg: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.05)',
    cardStyle: {
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
    },
  };

  const clampPos = (rawX: number, rawY: number): WidgetPosition => {
    const maxX = Math.max(12, viewportSize.w - WIDGET_CARD_WIDTH - 12);
    const maxY = Math.max(12, viewportSize.h - 44 - 140);
    return {
      x: Math.max(12, Math.min(rawX, maxX)),
      y: Math.max(12, Math.min(rawY, maxY)),
    };
  };

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    id: DesktopWidgetId
  ) => {
    // Allow interactive controls inside widget cards to function normally
    const target = e.target as HTMLElement | null;
    if (target?.closest('button, input, textarea, select, a')) return;
    e.stopPropagation();
    const currentPos = clampPos(
      widgetPositions[id]?.x ?? 20,
      widgetPositions[id]?.y ?? 20
    );
    dragRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      origX: currentPos.x,
      origY: currentPos.y,
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
      d.origY + (e.clientY - d.startY)
    );
    setDragPreviewPos(next);
  };

  const handlePointerUp = () => {
    const d = dragRef.current;
    if (!d) return;
    const finalRaw = dragPreviewPos ?? { x: d.origX, y: d.origY };
    const snapped = clampPos(snapToGrid(finalRaw.x), snapToGrid(finalRaw.y));
    onMoveWidget(d.id, snapped);
    dragRef.current = null;
    setDraggingId(null);
    setDragPreviewPos(null);
  };

  const widgetItems: { id: DesktopWidgetId; node: React.ReactNode }[] = [
    {
      id: 'clock',
      node: <ClockWidgetCard theme={theme} onOpenCalendar={() => onOpenApp('calendar')} />,
    },
    {
      id: 'kpi',
      node: <DashboardKpiWidgetCard theme={theme} onOpenApp={onOpenApp} />,
    },
    {
      id: 'timer',
      node: <FocusTimerWidgetCard theme={theme} />,
    },
    {
      id: 'todo',
      node: <TodoWidgetCard theme={theme} />,
    },
    {
      id: 'notes',
      node: <QuickNotesWidgetCard theme={theme} />,
    },
    {
      id: 'system',
      node: (
        <SystemStatusWidgetCard
          theme={theme}
          qualityMode={qualityMode}
          setQualityMode={setQualityMode}
          openWindowCount={openWindowCount}
          glassBlur={glassBlur}
        />
      ),
    },
  ];

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
      {draggingId && dragPreviewPos && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: WIDGET_CARD_WIDTH,
            height: 96,
            borderRadius: 16,
            border: `2px dashed ${primaryColor}`,
            backgroundColor: isDark ? 'rgba(59,130,246,0.10)' : 'rgba(59,130,246,0.08)',
            transform: `translate3d(${clampPos(snapToGrid(dragPreviewPos.x), snapToGrid(dragPreviewPos.y)).x}px, ${clampPos(snapToGrid(dragPreviewPos.x), snapToGrid(dragPreviewPos.y)).y}px, 0)`,
            transition: 'transform 80ms ease-out',
            pointerEvents: 'none',
          }}
        />
      )}

      {widgetItems.map(({ id, node }) => {
        if (!enabledWidgets[id]) return null;
        const isDragging = draggingId === id;
        const pos =
          isDragging && dragPreviewPos
            ? dragPreviewPos
            : clampPos(widgetPositions[id]?.x ?? 20, widgetPositions[id]?.y ?? 20);

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
              width: WIDGET_CARD_WIDTH,
              transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
              pointerEvents: 'auto',
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: isDragging ? 'none' : undefined,
              opacity: isDragging ? 0.92 : 1,
              transition: isDragging ? 'none' : 'transform 180ms cubic-bezier(0.22, 1, 0.36, 1)',
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
            {node}
          </div>
        );
      })}
    </div>
  );
}
