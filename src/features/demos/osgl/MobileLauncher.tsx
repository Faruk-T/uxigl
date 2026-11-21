import React, { useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { GoogleIcon } from '../../../components/primitives';
import {
  DOCK_APP_IDS,
  ENTERPRISE_APPS,
  resolveIconSurface,
  type IconBgStyle,
} from './types';
import { WindowContent } from './WindowContent';
import { FULLBLEED_APP_IDS } from './useDesktopState';

export function MobileLauncher({
  isMobileViewport,
  viewportWidth,
  desktopBackground,
  isDark,
  chromePillBg,
  chromeBorder,
  chromeText,
  glassBlur,
  barTextColor,
  effectiveIsLightBg,
  paletteTokens,
  iconBgStyle,
  iconBgColor,
  iconGradColor1,
  iconGradColor2,
  iconColor,
  searchQuery,
  setSearchQuery,
  mobileOpenAppId,
  setMobileOpenAppId,
  dockVisible,
  onOpenApp,
  renderWindowContent,
  sharedStudioProps,
}: {
  isMobileViewport: boolean;
  viewportWidth: number;
  desktopBackground: string;
  isDark: boolean;
  chromePillBg: string;
  chromeBorder: string;
  chromeText: string;
  glassBlur: number;
  barTextColor: string;
  effectiveIsLightBg: boolean;
  paletteTokens: {
    primary: string;
    bgElevated: string;
    textPrimary: string;
    surfaceTonal: string;
    borderSubtle: string;
  };
  iconBgStyle: IconBgStyle;
  iconBgColor: string;
  iconGradColor1: string;
  iconGradColor2: string;
  iconColor: string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  mobileOpenAppId: string | null;
  setMobileOpenAppId: (id: string | null) => void;
  dockVisible: boolean;
  onOpenApp: (id: string) => void;
  renderWindowContent?: (appId: string) => React.ReactNode;
  sharedStudioProps: Omit<React.ComponentProps<typeof WindowContent>, 'app' | 'contentWidth' | 'renderWindowContent'>;
}) {
  const filteredApps = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ENTERPRISE_APPS.filter(
      (app) => !q || app.label.toLowerCase().includes(q) || app.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const mobileActiveApp = mobileOpenAppId
    ? ENTERPRISE_APPS.find((m) => m.id === mobileOpenAppId)
    : null;

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: isMobileViewport ? 'stretch' : 'center',
        justifyContent: 'center',
        padding: isMobileViewport ? 0 : 20,
        position: 'relative',
        zIndex: 10,
        minHeight: 0,
      }}
    >
      <div
        style={{
          width: isMobileViewport ? '100%' : 390,
          height: isMobileViewport ? '100%' : 760,
          maxHeight: isMobileViewport ? 'none' : 'calc(100vh - 76px)',
          borderRadius: isMobileViewport ? 0 : 44,
          border: isMobileViewport ? 'none' : '8px solid rgba(15, 23, 42, 0.85)',
          background: isMobileViewport ? 'transparent' : desktopBackground,
          boxShadow: isMobileViewport ? 'none' : '0 30px 80px rgba(0, 0, 0, 0.45)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div style={{ padding: '14px 16px 10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 14px',
              borderRadius: 14,
              backgroundColor: chromePillBg,
              backdropFilter: glassBlur > 0 ? `blur(${glassBlur}px) saturate(160%)` : undefined,
              WebkitBackdropFilter: glassBlur > 0 ? `blur(${glassBlur}px) saturate(160%)` : undefined,
              border: chromeBorder,
            }}
          >
            <Search size={15} color={chromeText} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Uygulama ara..."
              style={{ border: 'none', outline: 'none', background: 'transparent', color: chromeText, fontSize: 13.5, width: '100%', fontWeight: 600 }}
            />
          </div>
        </div>

        <div
          className="macosgl-scroll"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '8px 16px 16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '18px 10px',
            alignContent: 'start',
          }}
        >
          {filteredApps.map((app) => {
            const iconSurf = resolveIconSurface(app, iconBgStyle, paletteTokens.primary, isDark, iconColor, iconBgColor, iconGradColor1, iconGradColor2);
            return (
              <button
                key={app.id}
                type="button"
                className="macosgl-app-btn"
                onClick={() => onOpenApp(app.id)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: 58,
                    height: 58,
                    borderRadius: 15,
                    background: iconSurf.background,
                    border: iconSurf.border,
                    backdropFilter: iconSurf.backdropFilter,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 22px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.42)',
                    color: iconSurf.color,
                  }}
                >
                  <GoogleIcon name={app.googleIcon} size={35} />
                  {app.badge && /^\d+$/.test(app.badge) && (
                    <span style={{ position: 'absolute', top: -5, right: -5, minWidth: 19, height: 19, padding: '0 5px', borderRadius: 999, backgroundColor: '#ef4444', color: '#ffffff', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.9)' }}>
                      {app.badge}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: barTextColor, textShadow: effectiveIsLightBg ? 'none' : '0 1px 5px rgba(0,0,0,0.65)', textAlign: 'center', lineHeight: 1.15 }}>
                  {app.shortLabel}
                </span>
              </button>
            );
          })}
        </div>

        {dockVisible && (
          <div
            style={{
              margin: '0 16px 14px',
              padding: '10px 16px',
              borderRadius: 24,
              backgroundColor: isDark ? 'rgba(15, 23, 42, 0.62)' : 'rgba(255, 255, 255, 0.54)',
              backdropFilter: glassBlur > 0 ? `blur(${glassBlur}px) saturate(160%)` : undefined,
              WebkitBackdropFilter: glassBlur > 0 ? `blur(${glassBlur}px) saturate(160%)` : undefined,
              border: isDark ? '1px solid rgba(255, 255, 255, 0.14)' : '1px solid rgba(255, 255, 255, 0.56)',
              boxShadow: '0 14px 34px rgba(0, 0, 0, 0.28)',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            {DOCK_APP_IDS.slice(0, 4).map((id) => {
              const app = ENTERPRISE_APPS.find((m) => m.id === id)!;
              const surf = resolveIconSurface(app, iconBgStyle, paletteTokens.primary, isDark, iconColor, iconBgColor, iconGradColor1, iconGradColor2);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onOpenApp(id)}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 13,
                    border: surf.border ?? 'none',
                    background: surf.background,
                    backdropFilter: surf.backdropFilter,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: surf.color,
                    boxShadow: '0 8px 18px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.42)',
                  }}
                >
                  <GoogleIcon name={app.googleIcon} size={28} />
                </button>
              );
            })}
          </div>
        )}

        {mobileActiveApp && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: paletteTokens.bgElevated, color: paletteTokens.textPrimary, display: 'flex', flexDirection: 'column', zIndex: 50 }}>
            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: paletteTokens.surfaceTonal, borderBottom: `1px solid ${paletteTokens.borderSubtle}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <GoogleIcon name={mobileActiveApp.googleIcon} size={18} />
                <strong style={{ fontSize: 14.5 }}>{mobileActiveApp.label}</strong>
              </div>
              <button type="button" onClick={() => setMobileOpenAppId(null)} style={{ border: 'none', width: 28, height: 28, borderRadius: 999, backgroundColor: 'rgba(148,163,184,0.2)', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={15} />
              </button>
            </div>
            <div
              className="macosgl-scroll"
              style={{
                flex: 1,
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
                padding: FULLBLEED_APP_IDS.has(mobileActiveApp.id) ? 0 : 14,
                overflowY: 'auto',
              }}
            >
              <WindowContent
                app={mobileActiveApp}
                contentWidth={isMobileViewport ? viewportWidth : 390}
                renderWindowContent={renderWindowContent}
                {...sharedStudioProps}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
