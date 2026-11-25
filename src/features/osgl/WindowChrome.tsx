import React, { memo, useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';

import type { WindowControlsSide } from './types';

export function TrafficLights({
  maximized,
  fullscreen = false,
  focused = true,
  side = 'right',
  onClose,
  onMinimize,
  onMaximize,
  onFullscreen,
}: {
  maximized: boolean;
  fullscreen?: boolean;
  focused?: boolean;
  side?: WindowControlsSide;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFullscreen?: () => void;
}) {
  const [activeHint, setActiveHint] = useState<string | null>(null);

  const btnStyle = (vividBg: string, isHovered: boolean): React.CSSProperties => ({
    width: 17,
    height: 17,
    borderRadius: '50%',
    border: 'none',
    backgroundColor: vividBg,
    opacity: focused || isHovered ? 1 : 0.72,
    cursor: 'pointer',
    padding: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(15, 23, 42, 0.78)',
    lineHeight: 1,
    boxShadow: isHovered
      ? `inset 0 0 0 0.5px rgba(0, 0, 0, 0.22), 0 2px 7px color-mix(in srgb, ${vividBg} 45%, transparent)`
      : 'inset 0 0 0 0.5px rgba(0, 0, 0, 0.16)',
    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
    transition: 'transform 0.12s ease, opacity 0.14s ease, box-shadow 0.14s ease',
  });

  const isExpanded = maximized || fullscreen;
  const minHint = 'Simge Durumuna Küçült';
  const maxHint = isExpanded ? 'Önceki Boyuta Dön' : 'Ekranı Kapla';
  const fullHint = fullscreen ? 'Tam Ekrandan Çık' : 'Tam Ekran Modu';
  const closeHint = 'Pencereyi Kapat (Esc)';

  const closeBtn = (
    <button
      key="close"
      type="button"
      aria-label="Pencereyi kapat"
      title={closeHint}
      onMouseEnter={() => setActiveHint(closeHint)}
      onFocus={() => setActiveHint(closeHint)}
      onBlur={() => setActiveHint(null)}
      onClick={(e) => { e.stopPropagation(); onClose(); }}
      style={btnStyle('#ff5f57', activeHint === closeHint)}
    >
      <svg width="8.5" height="8.5" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M2.5 2.5L7.5 7.5M7.5 2.5L2.5 7.5" />
      </svg>
    </button>
  );

  const otherBtns = (
    <>
      <button
        key="min"
        type="button"
        aria-label="Küçült"
        title={minHint}
        onMouseEnter={() => setActiveHint(minHint)}
        onFocus={() => setActiveHint(minHint)}
        onBlur={() => setActiveHint(null)}
        onClick={(e) => { e.stopPropagation(); onMinimize(); }}
        style={btnStyle('#febc2e', activeHint === minHint)}
      >
        <svg width="8.5" height="8.5" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M2.2 5H7.8" />
        </svg>
      </button>

      <button
        key="max"
        type="button"
        aria-label={isExpanded ? 'Önceki boyuta dön' : 'Pencereyi büyüt'}
        title={maxHint}
        onMouseEnter={() => setActiveHint(maxHint)}
        onFocus={() => setActiveHint(maxHint)}
        onBlur={() => setActiveHint(null)}
        onClick={(e) => {
          e.stopPropagation();
          if ((fullscreen || e.altKey) && onFullscreen) onFullscreen();
          else onMaximize();
        }}
        style={btnStyle('#28c840', activeHint === maxHint)}
      >
        {isExpanded ? (
          <svg width="8.5" height="8.5" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
            <rect x="1.8" y="3.2" width="5" height="5" rx="1" />
            <path d="M3.4 3.2V2.1C3.4 1.8 3.6 1.6 3.9 1.6H7.9C8.2 1.6 8.4 1.8 8.4 2.1V6.1C8.4 6.4 8.2 6.6 7.9 6.6H6.8" />
          </svg>
        ) : (
          <svg width="8.5" height="8.5" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
            <rect x="2.2" y="2.2" width="5.6" height="5.6" rx="1.1" />
          </svg>
        )}
      </button>

      {onFullscreen && (
        <button
          key="full"
          type="button"
          aria-label={fullscreen ? 'Tam ekrandan çık' : 'Tam ekran'}
          title={fullHint}
          onMouseEnter={() => setActiveHint(fullHint)}
          onFocus={() => setActiveHint(fullHint)}
          onBlur={() => setActiveHint(null)}
          onClick={(e) => { e.stopPropagation(); onFullscreen(); }}
          style={btnStyle('#5ac8fa', activeHint === fullHint)}
        >
          <svg width="8.5" height="8.5" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6.1 1.9H8.1V3.9M3.9 8.1H1.9V6.1M8.1 1.9L5.8 4.2M1.9 8.1L4.2 5.8" />
          </svg>
        </button>
      )}
    </>
  );

  return (
    <div
      data-osgl-window-controls={side}
      onMouseLeave={() => setActiveHint(null)}
      onPointerDown={(e) => e.stopPropagation()}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 7, flexShrink: 0 }}
    >
      {side === 'left' ? <>{closeBtn}{otherBtns}</> : <>{otherBtns}{closeBtn}</>}

      {activeHint && (
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            top: 'calc(100% + 7px)',
            ...(side === 'left' ? { left: 0 } : { right: 0 }),
            padding: '4px 10px',
            borderRadius: 999,
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            color: '#f8fafc',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.24)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '-0.005em',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 40,
          }}
        >
          {activeHint}
        </div>
      )}
    </div>
  );
}

export function ContextMenuItem({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 9, padding: '6px 10px', borderRadius: 7, border: 'none',
        background: 'transparent', color: danger ? 'var(--uxu-danger)' : 'inherit',
        fontSize: 12.5, fontWeight: 500, letterSpacing: '-0.008em', cursor: 'pointer', textAlign: 'left', width: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = danger ? 'rgba(244, 63, 94, 0.14)' : 'rgba(59, 130, 246, 0.16)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export function ContextSubMenu({
  icon,
  label,
  isDark,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  isDark: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{ position: 'relative', width: '100%' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        aria-expanded={open}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 9,
          padding: '6px 10px', borderRadius: 7, border: 'none',
          backgroundColor: open ? 'rgba(59, 130, 246, 0.16)' : 'transparent',
          color: 'inherit', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', textAlign: 'left', width: '100%',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
          {icon}
          <span>{label}</span>
        </span>
        <ChevronRight size={13} style={{ opacity: 0.65, flexShrink: 0 }} />
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute', top: -4, left: 'calc(100% + 4px)', minWidth: 215, maxHeight: 340,
            overflowY: 'auto', padding: 6, borderRadius: 12,
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.99)',
            color: isDark ? '#f8fafc' : '#0f172a', backdropFilter: 'blur(24px)',
            border: isDark ? '1px solid rgba(255,255,255,0.14)' : '1px solid rgba(15,23,42,0.12)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.32)', display: 'flex', flexDirection: 'column', gap: 2, zIndex: 2250,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export const MenuBarClock = memo(function MenuBarClock() {
  const [clock, setClock] = useState(() =>
    new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  );
  useEffect(() => {
    const timer = window.setInterval(() => {
      setClock(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
    }, 20_000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <span style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' }}>
      {clock}
    </span>
  );
});
