import React from 'react';

export function StudioFieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--uxu-text-primary)', marginBottom: 8 }}>
      {children}
    </div>
  );
}

export function StudioChoicePill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '7px 14px',
        borderRadius: 10,
        border: active ? '1px solid var(--uxu-primary)' : '1px solid var(--uxu-border-subtle)',
        background: active ? 'var(--uxu-primary)' : 'var(--uxu-bg-elevated)',
        color: active ? 'var(--uxu-on-primary)' : 'var(--uxu-text-primary)',
        fontSize: 12.5,
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'background 140ms ease, border-color 140ms ease',
      }}
    >
      {children}
    </button>
  );
}
