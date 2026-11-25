import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, Check, RotateCcw, X } from 'lucide-react';
import { GoogleIcon } from '../../components/primitives';
import {
  resolveIconSurface,
  type IconBgStyle,
  type OSWorkspaceApp,
} from './types';

export function DockCustomizerPopover({
  open,
  allDesktopApps,
  effectiveDockIds,
  isDark,
  primaryColor,
  iconBgStyle,
  iconBgColor,
  iconGradColor1,
  iconGradColor2,
  iconColor,
  onTogglePinToDock,
  onReorderDock,
  onResetDockToDefault,
  onClose,
}: {
  open: boolean;
  allDesktopApps: OSWorkspaceApp[];
  effectiveDockIds: string[];
  isDark: boolean;
  primaryColor: string;
  iconBgStyle: IconBgStyle;
  iconBgColor: string;
  iconGradColor1: string;
  iconGradColor2: string;
  iconColor: string;
  onTogglePinToDock: (appId: string) => void;
  onReorderDock: (draggedAppId: string, targetAppId: string) => void;
  onResetDockToDefault: () => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');

  const pinnedApps = useMemo(
    () =>
      effectiveDockIds
        .map((id) => allDesktopApps.find((a) => a.id === id))
        .filter((a): a is OSWorkspaceApp => Boolean(a)),
    [effectiveDockIds, allDesktopApps]
  );

  const filteredApps = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('tr-TR');
    if (!q) return allDesktopApps;
    return allDesktopApps.filter(
      (a) =>
        a.label.toLocaleLowerCase('tr-TR').includes(q) ||
        a.category.toLocaleLowerCase('tr-TR').includes(q)
    );
  }, [allDesktopApps, query]);

  if (!open) return null;

  const moveStep = (appId: string, dir: -1 | 1) => {
    const idx = effectiveDockIds.indexOf(appId);
    const targetIdx = idx + dir;
    if (idx < 0 || targetIdx < 0 || targetIdx >= effectiveDockIds.length) return;
    onReorderDock(appId, effectiveDockIds[targetIdx]);
  };

  const modal = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Alt Dock Simgelerini Özelleştir"
      data-macos-context="true"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 2350,
        background: 'rgba(15, 23, 42, 0.38)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(620px, 94vw)', maxHeight: '82vh', borderRadius: 24,
          background: isDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.94)',
          color: isDark ? '#f8fafc' : '#0f172a',
          backdropFilter: 'blur(28px) saturate(175%)',
          border: isDark ? '1px solid rgba(255,255,255,0.16)' : '1px solid rgba(15,23,42,0.12)',
          boxShadow: '0 28px 72px rgba(0, 0, 0, 0.44)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
            padding: '14px 18px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(15,23,42,0.10)',
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>Alt Dock Simgelerini Özelleştir</div>
            <div style={{ fontSize: 12, opacity: 0.72 }}>
              Sık kullandığınız modülleri alt çubuğa sabitleyin veya sırasını değiştirin ({pinnedApps.length} sabitli).
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              onClick={onResetDockToDefault}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '6px 11px', borderRadius: 999, border: 'none',
                background: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(15,23,42,0.07)',
                color: 'inherit', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              }}
            >
              <RotateCcw size={13} /> Varsayılana Dön
            </button>
            <button
              type="button"
              aria-label="Kapat"
              onClick={onClose}
              style={{
                width: 28, height: 28, borderRadius: '50%', border: 'none',
                background: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(15,23,42,0.07)',
                color: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        <div style={{ padding: '14px 18px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {pinnedApps.length > 0 && (
            <div
              style={{
                padding: '10px 12px', borderRadius: 16, flexShrink: 0,
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.04)',
                display: 'flex', gap: 10, overflowX: 'auto', overflowY: 'hidden', alignItems: 'center',
              }}
            >
              {pinnedApps.map((app, idx) => {
                const surf = resolveIconSurface(
                  app, iconBgStyle, primaryColor, isDark, iconColor, iconBgColor, iconGradColor1, iconGradColor2
                );
                return (
                  <div key={app.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 64 }}>
                    <div
                      style={{
                        width: 40, height: 40, borderRadius: 11, background: surf.background, color: surf.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <GoogleIcon name={app.googleIcon} size={21} />
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 600, maxWidth: 68, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {app.shortLabel || app.label}
                    </span>
                    <div style={{ display: 'inline-flex', gap: 3 }}>
                      <button
                        type="button"
                        disabled={idx === 0}
                        aria-label={`${app.label} sola taşı`}
                        onClick={() => moveStep(app.id, -1)}
                        style={{
                          width: 20, height: 18, borderRadius: 5, border: 'none', cursor: idx === 0 ? 'default' : 'pointer',
                          opacity: idx === 0 ? 0.35 : 0.85, background: 'transparent', color: 'inherit', padding: 0,
                        }}
                      >
                        <ArrowLeft size={11} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === pinnedApps.length - 1}
                        aria-label={`${app.label} sağa taşı`}
                        onClick={() => moveStep(app.id, 1)}
                        style={{
                          width: 20, height: 18, borderRadius: 5, border: 'none', cursor: idx === pinnedApps.length - 1 ? 'default' : 'pointer',
                          opacity: idx === pinnedApps.length - 1 ? 0.35 : 0.85, background: 'transparent', color: 'inherit', padding: 0,
                        }}
                      >
                        <ArrowRight size={11} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <input
            type="search"
            placeholder="Modül ara..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%', padding: '8px 12px', borderRadius: 10,
              border: isDark ? '1px solid rgba(255,255,255,0.16)' : '1px solid rgba(15,23,42,0.14)',
              background: isDark ? 'rgba(255,255,255,0.06)' : '#ffffff', color: 'inherit', fontSize: 12.5, outline: 'none',
            }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
            {filteredApps.map((app) => {
              const pinned = effectiveDockIds.includes(app.id);
              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => onTogglePinToDock(app.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                    padding: '8px 11px', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                    border: pinned
                      ? `1.5px solid ${primaryColor}`
                      : isDark ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(15,23,42,0.10)',
                    background: pinned ? `color-mix(in srgb, ${primaryColor} 16%, transparent)` : 'transparent',
                    color: 'inherit',
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    <GoogleIcon name={app.googleIcon} size={17} />
                    <span style={{ fontSize: 12.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {app.label}
                    </span>
                  </span>
                  {pinned && <Check size={14} style={{ color: primaryColor, flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modal, document.body) : modal;
}
