import React, { useRef, useState } from 'react';

export function useDockMagnification(dockAppsCount: number) {
  const dockItemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const dockRestingCenters = useRef<number[]>([]);
  const dockRafRef = useRef<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const handleMouseEnter = () => {
    dockRestingCenters.current = dockItemRefs.current.map((btn) => {
      if (!btn) return 0;
      const rect = btn.getBoundingClientRect();
      return rect.left + rect.width / 2;
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const clientX = e.clientX;
    if (dockRestingCenters.current.length === 0) handleMouseEnter();
    if (dockRafRef.current !== null) cancelAnimationFrame(dockRafRef.current);
    dockRafRef.current = requestAnimationFrame(() => {
      const maxDist = 150;
      dockItemRefs.current.forEach((btn, idx) => {
        if (!btn) return;
        const baseSize = idx >= dockAppsCount ? 44 : 46;
        const center = dockRestingCenters.current[idx] ?? 0;
        const dist = Math.abs(clientX - center);
        const factor = dist < maxDist ? Math.cos((dist / maxDist) * (Math.PI / 2)) : 0;
        const scale = 1 + factor * 0.42;
        const nextSize = Math.round(baseSize * scale);
        btn.style.transition = 'none';
        btn.style.width = `${nextSize}px`;
        btn.style.height = `${nextSize}px`;
        btn.style.borderRadius = `${Math.round(13 * scale)}px`;
        const glyph = btn.firstElementChild as HTMLElement | null;
        if (glyph) {
          glyph.style.transition = 'none';
          glyph.style.transform = `scale(${scale.toFixed(3)})`;
        }
      });
      dockRafRef.current = null;
    });
  };

  const handleMouseLeave = () => {
    if (dockRafRef.current !== null) {
      cancelAnimationFrame(dockRafRef.current);
      dockRafRef.current = null;
    }
    dockRestingCenters.current = [];
    dockItemRefs.current.forEach((btn, idx) => {
      if (!btn) return;
      const baseSize = idx >= dockAppsCount ? 44 : 46;
      btn.style.transition =
        'width 0.16s ease-out, height 0.16s ease-out, border-radius 0.16s ease-out';
      btn.style.width = `${baseSize}px`;
      btn.style.height = `${baseSize}px`;
      btn.style.borderRadius = '13px';
      const glyph = btn.firstElementChild as HTMLElement | null;
      if (glyph) {
        glyph.style.transition = 'transform 0.16s ease-out';
        glyph.style.transform = 'scale(1)';
      }
    });
  };

  return {
    dockItemRefs,
    hoveredIdx,
    setHoveredIdx,
    handleMouseEnter,
    handleMouseMove,
    handleMouseLeave,
  };
}
