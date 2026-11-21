import React, { memo, useEffect, useState } from 'react';

export function TrafficLights({
  maximized,
  onClose,
  onMinimize,
  onMaximize,
}: {
  maximized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const btnStyle = (bg: string): React.CSSProperties => ({
    width: 13,
    height: 13,
    borderRadius: 999,
    border: 'none',
    backgroundColor: bg,
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(15, 23, 42, 0.78)',
    lineHeight: 1,
    boxShadow: 'inset 0 0 0 0.5px rgba(0, 0, 0, 0.16)',
  });

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onPointerDown={(e) => e.stopPropagation()}
      style={{ display: 'flex', alignItems: 'center', gap: 7 }}
    >
      <button
        type="button"
        aria-label="Kapat"
        title="Kapat"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        style={btnStyle('#ff5f57')}
      >
        {hovered ? (
          <svg width="7" height="7" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M1.5 1.5L6.5 6.5M6.5 1.5L1.5 6.5" />
          </svg>
        ) : null}
      </button>
      <button
        type="button"
        aria-label="Küçült"
        title="Küçült"
        onClick={(e) => {
          e.stopPropagation();
          onMinimize();
        }}
        style={btnStyle('#febc2e')}
      >
        {hovered ? (
          <svg width="7" height="7" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M1.5 4H6.5" />
          </svg>
        ) : null}
      </button>
      <button
        type="button"
        aria-label="Büyüt"
        title={maximized ? 'Önceki Boyut' : 'Tam Ekran'}
        onClick={(e) => {
          e.stopPropagation();
          onMaximize();
        }}
        style={btnStyle('#28c840')}
      >
        {hovered ? (
          maximized ? (
            <svg width="7" height="7" viewBox="0 0 8 8" fill="currentColor">
              <path d="M1.5 6.5H4.8L1.5 3.2V6.5ZM6.5 1.5H3.2L6.5 4.8V1.5Z" />
            </svg>
          ) : (
            <svg width="7" height="7" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M4 1.5V6.5M1.5 4H6.5" />
            </svg>
          )
        ) : null}
      </button>
    </div>
  );
}

export function ContextMenuItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '7px 10px',
        borderRadius: 8,
        border: 'none',
        background: 'transparent',
        color: 'inherit',
        fontSize: 12.5,
        fontWeight: 600,
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.16)';
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

export const MenuBarClock = memo(function MenuBarClock() {
  const [clock, setClock] = useState(() =>
    new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  );
  useEffect(() => {
    const timer = setInterval(() => {
      setClock(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
    }, 30_000);
    return () => clearInterval(timer);
  }, []);
  return (
    <span style={{ fontSize: 12, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
      {clock}
    </span>
  );
});

