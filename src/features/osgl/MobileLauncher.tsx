import React, { useMemo } from 'react';
import { Search } from 'lucide-react';
import { GoogleIcon } from '../../components/primitives';
import { MobileActiveSheet, MobileBottomDock } from './MobileActiveSheet';
import { resolveIconSurface, type IconBgStyle, type OSWorkspaceApp } from './types';

export function MobileLauncher({
  apps,
  dockApps,
  isMobileViewport,
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
  renderThemeStudio,
}: {
  apps: OSWorkspaceApp[];
  dockApps: OSWorkspaceApp[];
  isMobileViewport: boolean;
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
  renderWindowContent: (appId: string) => React.ReactNode;
  renderThemeStudio: () => React.ReactNode;
}) {
  const filteredApps = useMemo(() => {
    const q = searchQuery.trim().toLocaleLowerCase('tr-TR');
    return apps.filter(
      (app) =>
        !q ||
        app.label.toLocaleLowerCase('tr-TR').includes(q) ||
        app.category.toLocaleLowerCase('tr-TR').includes(q)
    );
  }, [apps, searchQuery]);

  const mobileActiveApp = mobileOpenAppId ? apps.find((m) => m.id === mobileOpenAppId) : null;

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
        <div style={{ padding: '12px 16px 8px' }}>
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', borderRadius: 14,
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
              placeholder="Modül ara..."
              style={{
                border: 'none', outline: 'none', background: 'transparent',
                color: chromeText, fontSize: 13.5, width: '100%', fontWeight: 600,
              }}
            />
          </div>
        </div>

        <div
          className="macosgl-scroll"
          style={{
            flex: 1, overflowY: 'auto', padding: '10px 14px 20px',
            display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: '16px 8px', alignContent: 'start',
          }}
        >
          {filteredApps.map((app) => {
            const iconSurf = resolveIconSurface(
              app, iconBgStyle, paletteTokens.primary, isDark, iconColor, iconBgColor, iconGradColor1, iconGradColor2
            );
            return (
              <button
                key={app.id}
                type="button"
                className="macosgl-app-btn"
                onClick={() => onOpenApp(app.id)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  border: 'none', background: 'transparent', cursor: 'pointer', padding: 0,
                }}
              >
                <div
                  style={{
                    position: 'relative', width: 58, height: 58, borderRadius: 15,
                    background: iconSurf.background, border: iconSurf.border, backdropFilter: iconSurf.backdropFilter,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 10px 22px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.42)',
                    color: iconSurf.color,
                  }}
                >
                  {app.iconNode ?? <GoogleIcon name={app.googleIcon} size={32} />}
                  {app.badge && app.badge !== '0' && (
                    <span
                      style={{
                        position: 'absolute', top: -5, right: -5, minWidth: 19, height: 19, padding: '0 5px',
                        borderRadius: 999, backgroundColor: '#ef4444', color: '#ffffff',
                        fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '2px solid rgba(255,255,255,0.9)',
                      }}
                    >
                      {app.badge}
                    </span>
                  )}
                </div>
                <span
                  style={{
                    fontSize: 11, fontWeight: 600, color: barTextColor,
                    textShadow: effectiveIsLightBg ? 'none' : '0 1px 5px rgba(0,0,0,0.65)',
                    textAlign: 'center', lineHeight: 1.15,
                  }}
                >
                  {app.shortLabel}
                </span>
              </button>
            );
          })}
        </div>

        {dockVisible && dockApps.length > 0 && (
          <MobileBottomDock
            dockApps={dockApps}
            isDark={isDark}
            glassBlur={glassBlur}
            primaryColor={paletteTokens.primary}
            iconBgStyle={iconBgStyle}
            iconBgColor={iconBgColor}
            iconGradColor1={iconGradColor1}
            iconGradColor2={iconGradColor2}
            iconColor={iconColor}
            onOpenApp={onOpenApp}
          />
        )}

        {mobileActiveApp && (
          <MobileActiveSheet
            app={mobileActiveApp}
            onClose={() => setMobileOpenAppId(null)}
            renderWindowContent={renderWindowContent}
            renderThemeStudio={renderThemeStudio}
          />
        )}
      </div>
    </div>
  );
}
