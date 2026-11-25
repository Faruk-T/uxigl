import React from 'react';
import { X } from 'lucide-react';
import { GoogleIcon } from '../../components/primitives';
import {
  OS_THEME_STUDIO_APP_ID,
  resolveIconSurface,
  type IconBgStyle,
  type OSWorkspaceApp,
} from './types';

export function MobileBottomDock({
  dockApps,
  isDark,
  glassBlur,
  primaryColor,
  iconBgStyle,
  iconBgColor,
  iconGradColor1,
  iconGradColor2,
  iconColor,
  onOpenApp,
}: {
  dockApps: OSWorkspaceApp[];
  isDark: boolean;
  glassBlur: number;
  primaryColor: string;
  iconBgStyle: IconBgStyle;
  iconBgColor: string;
  iconGradColor1: string;
  iconGradColor2: string;
  iconColor: string;
  onOpenApp: (id: string) => void;
}) {
  return (
    <div
      style={{
        margin: '0 16px 14px',
        padding: '10px 16px',
        borderRadius: 24,
        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.64)' : 'rgba(255, 255, 255, 0.58)',
        backdropFilter: glassBlur > 0 ? `blur(${glassBlur}px) saturate(160%)` : undefined,
        WebkitBackdropFilter: glassBlur > 0 ? `blur(${glassBlur}px) saturate(160%)` : undefined,
        border: isDark ? '1px solid rgba(255, 255, 255, 0.14)' : '1px solid rgba(255, 255, 255, 0.56)',
        boxShadow: '0 14px 34px rgba(0, 0, 0, 0.28)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      {dockApps.slice(0, 4).map((app) => {
        const surf = resolveIconSurface(
          app, iconBgStyle, primaryColor, isDark, iconColor, iconBgColor, iconGradColor1, iconGradColor2
        );
        return (
          <button
            key={app.id}
            type="button"
            onClick={() => onOpenApp(app.id)}
            style={{
              width: 48, height: 48, borderRadius: 13,
              border: surf.border ?? 'none', background: surf.background,
              backdropFilter: surf.backdropFilter,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: surf.color,
              boxShadow: '0 8px 18px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.42)',
            }}
          >
            {app.iconNode ?? <GoogleIcon name={app.googleIcon} size={27} />}
          </button>
        );
      })}
    </div>
  );
}

export function MobileActiveSheet({
  app,
  onClose,
  renderWindowContent,
  renderThemeStudio,
}: {
  app: OSWorkspaceApp;
  onClose: () => void;
  renderWindowContent: (appId: string) => React.ReactNode;
  renderThemeStudio: () => React.ReactNode;
}) {
  return (
    <div
      style={{
        position: 'absolute', inset: 0,
        backgroundColor: 'var(--canvas)', color: 'var(--text)',
        display: 'flex', flexDirection: 'column', zIndex: 50,
      }}
    >
      <div
        style={{
          padding: '10px 14px',
          minHeight: 48,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
          backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          {app.iconNode ?? <GoogleIcon name={app.googleIcon} size={18} />}
          <strong style={{ fontSize: 14.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {app.label}
          </strong>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Kapat"
          style={{
            border: '1px solid var(--border)', width: 30, height: 30, borderRadius: 999,
            backgroundColor: 'var(--surface-muted)', color: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
          }}
        >
          <X size={15} />
        </button>
      </div>
      <div
        className="macosgl-scroll"
        style={{
          flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
          padding: app.fullBleed ? 0 : 14, overflowY: 'auto',
        }}
      >
        {app.id === OS_THEME_STUDIO_APP_ID ? renderThemeStudio() : renderWindowContent(app.id)}
      </div>
    </div>
  );
}
