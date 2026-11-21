import React, { useMemo, useRef, useState } from 'react';
import { GoogleIcon } from '../../../components/primitives';
import {
  ENTERPRISE_APPS,
  resolveIconSurface,
  type EnterpriseOSApp,
  type FloatingWindowState,
  type IconBgStyle,
} from './types';

export function DesktopGrid({
  isDark,
  barTextColor,
  effectiveIsLightBg,
  primaryColor,
  iconBgStyle,
  iconBgColor,
  iconGradColor1,
  iconGradColor2,
  iconColor,
  iconSizePx,
  viewportSize,
  iconSlots,
  setIconSlots,
  selectedAppIds,
  setSelectedAppIds,
  windows,
  onOpenApp,
  children,
}: {
  isDark: boolean;
  barTextColor: string;
  effectiveIsLightBg: boolean;
  primaryColor: string;
  iconBgStyle: IconBgStyle;
  iconBgColor: string;
  iconGradColor1: string;
  iconGradColor2: string;
  iconColor: string;
  iconSizePx: number;
  viewportSize: { w: number; h: number };
  iconSlots: Record<string, number>;
  setIconSlots: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  selectedAppIds: string[];
  setSelectedAppIds: React.Dispatch<React.SetStateAction<string[]>>;
  windows: FloatingWindowState[];
  onOpenApp: (id: string) => void;
  children?: React.ReactNode;
}) {
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
  const [selectionBox, setSelectionBox] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  const marqueeRef = useRef<{ startX: number; startY: number; active: boolean } | null>(null);
  const desktopIconRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const iconBoxSize = Math.max(44, Math.min(84, iconSizePx));
  const iconGlyphSize = Math.round(iconBoxSize * 0.62);
  const cellHeight = iconBoxSize + 50;
  const cellWidth = iconBoxSize + 36;
  const rowGap = 8;
  const colGap = 12;
  const availableGridHeight = Math.max(cellHeight, viewportSize.h - 156);
  const rowsPerColumn = Math.max(1, Math.floor((availableGridHeight + rowGap) / (cellHeight + rowGap)));
  const colsCount = Math.max(4, Math.floor((viewportSize.w - 48 + colGap) / (cellWidth + colGap)));
  const totalGridSlots = rowsPerColumn * colsCount;

  const slotToApp = useMemo(() => {
    const map = new Map<number, EnterpriseOSApp>();
    const overflow: EnterpriseOSApp[] = [];
    ENTERPRISE_APPS.forEach((app) => {
      const slot = iconSlots[app.id] ?? 0;
      if (slot < totalGridSlots && !map.has(slot)) {
        map.set(slot, app);
      } else {
        overflow.push(app);
      }
    });
    let freeCursor = 0;
    overflow.forEach((app) => {
      while (map.has(freeCursor) && freeCursor < totalGridSlots) freeCursor += 1;
      if (freeCursor < totalGridSlots) map.set(freeCursor, app);
    });
    return map;
  }, [iconSlots, totalGridSlots]);

  const handleDropOnSlot = (targetSlot: number) => {
    if (!draggedAppId) {
      setDragOverSlot(null);
      return;
    }
    const movingIds =
      selectedAppIds.length > 1 && selectedAppIds.includes(draggedAppId)
        ? [...selectedAppIds].sort((a, b) => (iconSlots[a] ?? 0) - (iconSlots[b] ?? 0))
        : [draggedAppId];

    setIconSlots((prev) => {
      if (movingIds.length > 1) {
        const next: Record<string, number> = { ...prev };
        const movingSet = new Set(movingIds);
        const remaining = Object.entries(prev)
          .filter(([id]) => !movingSet.has(id))
          .sort((a, b) => a[1] - b[1]);

        movingIds.forEach((id, offset) => {
          next[id] = targetSlot + offset;
        });

        const occupiedByMoving = new Set(movingIds.map((id) => next[id]));
        let cursor = 0;
        remaining.forEach(([id, oldSlot]) => {
          if (!occupiedByMoving.has(oldSlot)) {
            next[id] = oldSlot;
          } else {
            while (occupiedByMoving.has(cursor) || Object.values(next).includes(cursor)) cursor += 1;
            next[id] = cursor;
          }
        });
        return next;
      }

      const sourceSlot = prev[draggedAppId];
      if (sourceSlot === targetSlot) return prev;
      const occupantId = Object.keys(prev).find((id) => prev[id] === targetSlot);
      if (!occupantId) return { ...prev, [draggedAppId]: targetSlot };

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

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('input') ||
      target.closest('[data-macos-window="true"]') ||
      target.closest('[data-macos-dock="true"]') ||
      target.closest('[data-macos-context="true"]')
    ) {
      return;
    }
    setSelectedAppIds([]);
    marqueeRef.current = { startX: e.clientX, startY: e.clientY, active: true };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const m = marqueeRef.current;
    if (!m || !m.active) return;
    const left = Math.min(m.startX, e.clientX);
    const top = Math.min(m.startY, e.clientY);
    const width = Math.abs(e.clientX - m.startX);
    const height = Math.abs(e.clientY - m.startY);
    if (width < 4 && height < 4) return;

    const box = { left, top, width, height };
    setSelectionBox(box);

    const hits: string[] = [];
    Object.entries(desktopIconRefs.current).forEach(([id, el]) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (!(r.right < box.left || r.left > box.left + box.width || r.bottom < box.top || r.top > box.top + box.height)) {
        hits.push(id);
      }
    });
    setSelectedAppIds(hits);
  };

  const handlePointerUp = () => {
    if (marqueeRef.current) {
      marqueeRef.current.active = false;
      marqueeRef.current = null;
    }
    setSelectionBox(null);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        position: 'relative',
        flex: 1,
        padding: '14px 24px 96px',
        overflow: 'hidden',
        userSelect: selectionBox ? 'none' : undefined,
      }}
    >
      <div
        className="macosgl-scroll"
        style={{
          display: 'grid',
          gridAutoFlow: 'column',
          gridTemplateRows: `repeat(${rowsPerColumn}, ${cellHeight}px)`,
          gridTemplateColumns: `repeat(${colsCount}, ${cellWidth}px)`,
          gap: '8px 12px',
          padding: '6px 4px',
          width: '100%',
          height: availableGridHeight + 12,
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
                onDragLeave={() => { if (dragOverSlot === slotIdx) setDragOverSlot(null); }}
                onDrop={(e) => { e.preventDefault(); handleDropOnSlot(slotIdx); }}
                style={{
                  width: cellWidth,
                  height: cellHeight,
                  borderRadius: 16,
                  border: isDropHighlight ? '1.5px dashed rgba(255,255,255,0.65)' : '1.5px solid transparent',
                  backgroundColor: isDropHighlight ? 'rgba(255,255,255,0.12)' : 'transparent',
                  transition: 'background-color 0.12s ease, border-color 0.12s ease',
                }}
              />
            );
          }

          const isOpen = windows.some((w) => w.appId === app.id);
          const isSelected = selectedAppIds.includes(app.id);
          const isNumericBadge = app.badge && /^\d+$/.test(app.badge);
          const iconSurf = resolveIconSurface(app, iconBgStyle, primaryColor, isDark, iconColor, iconBgColor, iconGradColor1, iconGradColor2);

          return (
            <button
              key={app.id}
              ref={(el) => { desktopIconRefs.current[app.id] = el; }}
              type="button"
              draggable
              onDragStart={() => {
                if (!selectedAppIds.includes(app.id)) setSelectedAppIds([app.id]);
                setDraggedAppId(app.id);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                if (dragOverSlot !== slotIdx) setDragOverSlot(slotIdx);
              }}
              onDragLeave={() => { if (dragOverSlot === slotIdx) setDragOverSlot(null); }}
              onDrop={(e) => { e.preventDefault(); handleDropOnSlot(slotIdx); }}
              onDragEnd={() => { setDraggedAppId(null); setDragOverSlot(null); }}
              className="macosgl-app-btn"
              onClick={(e) => {
                if (e.ctrlKey || e.metaKey || e.shiftKey) {
                  e.stopPropagation();
                  setSelectedAppIds((prev) =>
                    prev.includes(app.id) ? prev.filter((id) => id !== app.id) : [...prev, app.id]
                  );
                  return;
                }
                setSelectedAppIds([app.id]);
                onOpenApp(app.id);
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 6,
                border: isDropHighlight && draggedAppId !== app.id
                  ? '1.5px dashed rgba(255,255,255,0.75)'
                  : isSelected
                  ? '1.5px solid rgba(96, 165, 250, 0.85)'
                  : '1.5px solid transparent',
                background: isDropHighlight && draggedAppId !== app.id
                  ? 'rgba(255,255,255,0.14)'
                  : isSelected
                  ? 'rgba(59, 130, 246, 0.24)'
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
                  background: iconSurf.background,
                  border: iconSurf.border,
                  backdropFilter: iconSurf.backdropFilter,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 12px 26px rgba(0, 0, 0, 0.32), 0 2px 6px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.42)',
                  color: iconSurf.color,
                }}
              >
                <GoogleIcon name={app.googleIcon} size={iconGlyphSize} />
                {isNumericBadge && (
                  <span style={{ position: 'absolute', top: -5, right: -5, minWidth: 19, height: 19, padding: '0 5px', borderRadius: 999, backgroundColor: '#ef4444', color: '#ffffff', fontSize: 10.5, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(239, 68, 68, 0.45)', border: '2px solid rgba(255,255,255,0.92)' }}>
                    {app.badge}
                  </span>
                )}
              </div>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: barTextColor, textShadow: effectiveIsLightBg ? 'none' : '0 1px 6px rgba(0, 0, 0, 0.65)', textAlign: 'center', lineHeight: 1.2 }}>
                {app.label}
              </span>
              {isOpen && (
                <span style={{ width: 4, height: 4, borderRadius: 999, marginTop: -3, backgroundColor: barTextColor, opacity: 0.85 }} />
              )}
            </button>
          );
        })}
      </div>

      {selectionBox && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            left: selectionBox.left,
            top: selectionBox.top,
            width: selectionBox.width,
            height: selectionBox.height,
            backgroundColor: 'rgba(59, 130, 246, 0.16)',
            border: '1px solid rgba(96, 165, 250, 0.78)',
            borderRadius: 5,
            pointerEvents: 'none',
            zIndex: 90,
          }}
        />
      )}

      {children}
    </div>
  );
}
