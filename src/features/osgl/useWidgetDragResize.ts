import type React from 'react';
import { useRef, useState } from 'react';
import type { OSDesktopWidgetDefinition, WidgetPosition, WidgetSize } from './types';
import {
  clampWidgetPosition,
  clampWidgetSize,
  snapWidgetToGrid,
} from './widgetLayout';

/**
 * Etkileşim katmanı: masaüstü widget'ları için sürükleme (drag) ve boyutlandırma (resize) kancası.
 * Görsel bileşen içermez (SRP).
 */
export function useWidgetDragResize({
  viewportSize,
  onMoveWidget,
  onResizeWidget,
}: {
  viewportSize: { w: number; h: number };
  onMoveWidget: (id: string, pos: WidgetPosition) => void;
  onResizeWidget: (id: string, size: WidgetSize) => void;
}) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragPreviewPos, setDragPreviewPos] = useState<WidgetPosition | null>(null);
  const dragRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    width: number;
    height: number;
  } | null>(null);

  const [resizingId, setResizingId] = useState<string | null>(null);
  const [resizePreviewSize, setResizePreviewSize] = useState<WidgetSize | null>(null);
  const resizeRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    origW: number;
    origH: number;
    posX: number;
    posY: number;
  } | null>(null);

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    def: OSDesktopWidgetDefinition,
    curPos: WidgetPosition,
    curSize: WidgetSize
  ) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('input') ||
      target.closest('textarea') ||
      target.closest('select') ||
      target.closest('a') ||
      target.closest('[data-widget-resize]')
    ) {
      return;
    }
    e.stopPropagation();
    dragRef.current = {
      id: def.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: curPos.x,
      origY: curPos.y,
      width: curSize.width,
      height: curSize.height,
    };
    setDraggingId(def.id);
    setDragPreviewPos(curPos);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d) return;
    setDragPreviewPos(
      clampWidgetPosition(
        d.origX + (e.clientX - d.startX),
        d.origY + (e.clientY - d.startY),
        d.width,
        d.height,
        viewportSize.w,
        viewportSize.h
      )
    );
  };

  const handlePointerUp = () => {
    const d = dragRef.current;
    if (!d) return;
    const finalPos = dragPreviewPos
      ? clampWidgetPosition(
          snapWidgetToGrid(dragPreviewPos.x),
          snapWidgetToGrid(dragPreviewPos.y),
          d.width,
          d.height,
          viewportSize.w,
          viewportSize.h
        )
      : { x: d.origX, y: d.origY };
    dragRef.current = null;
    setDraggingId(null);
    setDragPreviewPos(null);
    onMoveWidget(d.id, finalPos);
  };

  const handleResizeDown = (
    e: React.PointerEvent<HTMLDivElement>,
    id: string,
    pos: WidgetPosition,
    size: WidgetSize
  ) => {
    e.stopPropagation();
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

  const handleResizeMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = resizeRef.current;
    if (!r) return;
    setResizePreviewSize(
      clampWidgetSize(
        r.origW + (e.clientX - r.startX),
        r.origH + (e.clientY - r.startY),
        r.posX,
        r.posY,
        viewportSize.w,
        viewportSize.h
      )
    );
  };

  const handleResizeUp = () => {
    const r = resizeRef.current;
    if (!r) return;
    const finalSize = resizePreviewSize
      ? clampWidgetSize(
          snapWidgetToGrid(resizePreviewSize.width),
          snapWidgetToGrid(resizePreviewSize.height),
          r.posX,
          r.posY,
          viewportSize.w,
          viewportSize.h
        )
      : { width: r.origW, height: r.origH };
    resizeRef.current = null;
    setResizingId(null);
    setResizePreviewSize(null);
    onResizeWidget(r.id, finalSize);
  };

  return {
    draggingId,
    dragPreviewPos,
    resizingId,
    resizePreviewSize,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleResizeDown,
    handleResizeMove,
    handleResizeUp,
  };
}
