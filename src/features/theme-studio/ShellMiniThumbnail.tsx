import React from 'react';
import type { ConcreteWorkspaceShellId } from '../../core/contracts/ThemeContract';

export function ShellMiniThumbnail({ id }: { id: ConcreteWorkspaceShellId }) {
  const frameStyle: React.CSSProperties = {
    position: 'relative', height: 62, borderRadius: 8, overflow: 'hidden',
    border: '1px solid var(--border)', background: 'var(--canvas)', display: 'flex',
  };

  if (id === 'osgl') {
    return (
      <div
        style={{
          ...frameStyle,
          background: 'linear-gradient(135deg, var(--uxu-primary) 0%, color-mix(in srgb, var(--uxu-primary) 42%, #0f172a) 100%)',
          flexDirection: 'column', justifyContent: 'space-between', padding: 5,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 8px)', gap: 3 }}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span key={i} style={{ width: 8, height: 8, borderRadius: 2.5, background: 'rgba(255,255,255,0.82)' }} />
            ))}
          </div>
          <div
            style={{
              width: '56%', height: 32, borderRadius: 5, background: 'var(--surface)',
              border: '1px solid var(--border)', padding: 3, boxShadow: '0 4px 10px rgba(0,0,0,0.22)',
            }}
          >
            <div style={{ display: 'flex', gap: 2, marginBottom: 3 }}>
              <span style={{ width: 4, height: 4, borderRadius: 9, background: '#ff5f57' }} />
              <span style={{ width: 4, height: 4, borderRadius: 9, background: '#febc2e' }} />
              <span style={{ width: 4, height: 4, borderRadius: 9, background: '#28c840' }} />
            </div>
            <div style={{ height: 14, borderRadius: 2, background: 'var(--surface-subtle)' }} />
          </div>
        </div>
        <div
          style={{
            alignSelf: 'center', display: 'flex', gap: 3, padding: '2px 6px',
            borderRadius: 99, background: 'rgba(15,23,42,0.45)',
          }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} style={{ width: 6, height: 6, borderRadius: 2, background: 'rgba(255,255,255,0.9)' }} />
          ))}
        </div>
      </div>
    );
  }

  if (id === 'tesseragl') {
    return (
      <div style={frameStyle}>
        <div
          style={{
            width: 14, background: 'var(--surface-subtle)', borderRight: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 5, gap: 3,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              style={{
                width: 6, height: 6, borderRadius: 2,
                background: i === 0 ? 'var(--uxu-primary)' : 'var(--text-muted)',
                opacity: i === 0 ? 1 : 0.45,
              }}
            />
          ))}
        </div>
        <div
          style={{
            width: 34, background: 'var(--surface)', borderRight: '1px solid var(--border)',
            padding: 4, display: 'flex', flexDirection: 'column', gap: 3,
          }}
        >
          <span style={{ height: 4, width: '80%', borderRadius: 2, background: 'var(--uxu-primary)', opacity: 0.7 }} />
          <span style={{ height: 3, width: '90%', borderRadius: 2, background: 'var(--surface-subtle)' }} />
          <span style={{ height: 3, width: '70%', borderRadius: 2, background: 'var(--surface-subtle)' }} />
        </div>
        <div style={{ flex: 1, padding: 5, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ height: 6, width: '60%', margin: '0 auto', borderRadius: 3, background: 'var(--surface-subtle)' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, flex: 1 }}>
            <div style={{ borderRadius: 4, background: 'var(--surface)', border: '1px solid var(--border)' }} />
            <div style={{ borderRadius: 4, background: 'var(--surface)', border: '1px solid var(--border)' }} />
          </div>
        </div>
      </div>
    );
  }

  if (id === 'flowgl') {
    return (
      <div style={frameStyle}>
        <div
          style={{
            width: 30, background: 'var(--surface)', borderRight: '1px solid var(--border-subtle)',
            padding: 5, display: 'flex', flexDirection: 'column', gap: 4,
          }}
        >
          <span style={{ height: 5, width: 16, borderRadius: 99, background: 'var(--uxu-primary)' }} />
          <span style={{ height: 4, width: 20, borderRadius: 99, background: 'var(--surface-subtle)' }} />
          <span style={{ height: 4, width: 18, borderRadius: 99, background: 'var(--surface-subtle)' }} />
        </div>
        <div style={{ flex: 1, padding: 8, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 6 }}>
          <div style={{ borderRadius: 9, background: 'var(--surface)', border: '1px solid var(--border-subtle)', padding: 5 }}>
            <div style={{ height: 5, width: '55%', borderRadius: 99, background: 'var(--uxu-primary)', opacity: 0.75 }} />
          </div>
          <div style={{ borderRadius: 9, background: 'var(--surface)', border: '1px solid var(--border-subtle)' }} />
        </div>
      </div>
    );
  }

  if (id === 'cargogl') {
    return (
      <div style={frameStyle}>
        <div
          style={{
            width: 22, background: 'var(--surface)', borderRight: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 5, gap: 4,
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: 10, height: 8, borderRadius: 3,
                background: i === 0 ? 'var(--uxu-primary)' : 'var(--surface-subtle)',
              }}
            />
          ))}
        </div>
        <div style={{ flex: 1, padding: 5, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ height: 5, width: '42%', borderRadius: 99, background: 'var(--surface-subtle)' }} />
            <div style={{ display: 'flex', gap: 2 }}>
              {['#10b981', '#0ea5e9', '#6366f1', '#f59e0b'].map((c) => (
                <span key={c} style={{ width: 4.5, height: 4.5, borderRadius: 99, background: c }} />
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, flex: 1 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ borderRadius: 5, background: 'var(--surface)', border: '1px solid var(--border)' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (id === 'synthgl') {
    return (
      <div
        style={{
          ...frameStyle,
          background: 'linear-gradient(135deg, color-mix(in srgb, var(--uxu-primary) 16%, var(--canvas)), var(--canvas))',
        }}
      >
        <div
          style={{
            width: 16, background: 'var(--surface-glass)', borderRight: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 5, gap: 4,
          }}
        >
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: 7, height: 7, borderRadius: 99, background: 'var(--uxu-primary)', opacity: i === 0 ? 1 : 0.35 }} />
          ))}
        </div>
        <div style={{ flex: 1, padding: 5, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div
            style={{
              height: 14, borderRadius: 6,
              background: 'color-mix(in srgb, var(--uxu-primary) 22%, var(--surface))',
              border: '1px solid var(--border)',
            }}
          />
          <div style={{ flex: 1, borderRadius: 6, background: 'var(--surface)', border: '1px solid var(--border)' }} />
        </div>
      </div>
    );
  }

  return (
    <div style={frameStyle}>
      <div
        style={{
          width: 36, background: 'var(--surface)', borderRight: '1px solid var(--border)',
          padding: 4, display: 'flex', flexDirection: 'column', gap: 3,
        }}
      >
        <span style={{ height: 5, width: '75%', borderRadius: 2, background: 'var(--uxu-primary)' }} />
        <span style={{ height: 3.5, width: '90%', borderRadius: 2, background: 'var(--surface-subtle)' }} />
        <span style={{ height: 3.5, width: '80%', borderRadius: 2, background: 'var(--surface-subtle)' }} />
        <span style={{ height: 3.5, width: '85%', borderRadius: 2, background: 'var(--surface-subtle)' }} />
      </div>
      <div style={{ flex: 1, padding: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2.5, height: 11 }}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} style={{ borderRadius: 2.5, background: 'var(--surface)', border: '1px solid var(--border)' }} />
          ))}
        </div>
        <div
          style={{
            flex: 1, borderRadius: 3, background: 'var(--surface)', border: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column', gap: 2, padding: 3,
          }}
        >
          <span style={{ height: 4, borderRadius: 1, background: 'var(--surface-subtle)' }} />
          <span style={{ height: 3, borderRadius: 1, background: 'var(--surface-subtle)', opacity: 0.7 }} />
          <span style={{ height: 3, borderRadius: 1, background: 'var(--surface-subtle)', opacity: 0.7 }} />
        </div>
      </div>
    </div>
  );
}
