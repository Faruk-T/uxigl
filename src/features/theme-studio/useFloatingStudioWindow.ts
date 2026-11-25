import React, { useEffect, useRef, useState } from 'react';

export function useFloatingStudioWindow(open: boolean, onClose: () => void) {
  const [size, setSize] = useState<{ width: number; height: number }>(() => ({
    width: Math.min(780, typeof window !== 'undefined' ? window.innerWidth - 32 : 780),
    height: Math.min(600, typeof window !== 'undefined' ? window.innerHeight - 64 : 600),
  }));

  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (open && position === null && typeof window !== 'undefined') {
      const defaultX = Math.max(16, Math.round((window.innerWidth - size.width) / 2));
      const defaultY = Math.max(48, Math.round((window.innerHeight - size.height) / 2));
      setPosition({ x: defaultX, y: defaultY });
    }
  }, [open, position, size.width, size.height]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ startX: 0, startY: 0, posX: 0, posY: 0 });

  const handleHeaderPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, input, select, a')) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    const curPos = position || {
      x: Math.max(16, window.innerWidth - size.width - 24),
      y: 64,
    };
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: curPos.x,
      posY: curPos.y,
    };
  };

  const handleHeaderPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;
    const maxX = Math.max(10, window.innerWidth - size.width - 10);
    const maxY = Math.max(10, window.innerHeight - 70);
    setPosition({
      x: Math.max(10, Math.min(maxX, dragStartRef.current.posX + deltaX)),
      y: Math.max(10, Math.min(maxY, dragStartRef.current.posY + deltaY)),
    });
  };

  const handleHeaderPointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const isResizingRef = useRef(false);
  const resizeStartRef = useRef({ startX: 0, startY: 0, startW: 0, startH: 0 });

  const handleResizePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    isResizingRef.current = true;
    resizeStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: size.width,
      startH: size.height,
    };
  };

  const handleResizePointerMove = (e: React.PointerEvent) => {
    if (!isResizingRef.current) return;
    const deltaX = e.clientX - resizeStartRef.current.startX;
    const deltaY = e.clientY - resizeStartRef.current.startY;
    const curX = position?.x ?? 24;
    const curY = position?.y ?? 64;
    const maxW = Math.max(520, window.innerWidth - curX - 16);
    const maxH = Math.max(420, window.innerHeight - curY - 16);
    setSize({
      width: Math.max(520, Math.min(maxW, resizeStartRef.current.startW + deltaX)),
      height: Math.max(420, Math.min(maxH, resizeStartRef.current.startH + deltaY)),
    });
  };

  const handleResizePointerUp = (e: React.PointerEvent) => {
    if (!isResizingRef.current) return;
    isResizingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleResetPosition = () => {
    const nextW = Math.min(780, window.innerWidth - 32);
    const nextH = Math.min(600, window.innerHeight - 64);
    setSize({ width: nextW, height: nextH });
    setPosition({
      x: Math.max(16, Math.round((window.innerWidth - nextW) / 2)),
      y: Math.max(48, Math.round((window.innerHeight - nextH) / 2)),
    });
  };

  return {
    size,
    position,
    handleHeaderPointerDown,
    handleHeaderPointerMove,
    handleHeaderPointerUp,
    handleResizePointerDown,
    handleResizePointerMove,
    handleResizePointerUp,
    handleResetPosition,
  };
}
