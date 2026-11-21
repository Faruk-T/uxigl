import React, { useMemo, useRef, useState } from 'react';
import {
  ENTERPRISE_APPS,
  type EnterpriseOSApp,
  type FloatingWindowState,
  type IconBgStyle,
} from './types';
import { DesktopIconTile } from './DesktopIconTile';
import { reorderIconSlotsOnDrop } from './desktopGridUtils';

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
    setIconSlots((prev) => reorderIconSlotsOnDrop(prev, draggedAppId, targetSlot, selectedAppIds));
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

          return (
            <DesktopIconTile
              key={app.id}
              app={app}
              slotIdx={slotIdx}
              buttonRef={(el) => {
                desktopIconRefs.current[app.id] = el;
              }}
              isOpen={windows.some((w) => w.appId === app.id)}
              isSelected={selectedAppIds.includes(app.id)}
              isDragged={draggedAppId === app.id}
              isDropHighlight={isDropHighlight && draggedAppId !== app.id}
              iconBoxSize={iconBoxSize}
              iconGlyphSize={iconGlyphSize}
              barTextColor={barTextColor}
              effectiveIsLightBg={effectiveIsLightBg}
              isDark={isDark}
              primaryColor={primaryColor}
              iconBgStyle={iconBgStyle}
              iconBgColor={iconBgColor}
              iconGradColor1={iconGradColor1}
              iconGradColor2={iconGradColor2}
              iconColor={iconColor}
              onDragStart={() => {
                if (!selectedAppIds.includes(app.id)) setSelectedAppIds([app.id]);
                setDraggedAppId(app.id);
              }}
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
            />
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
