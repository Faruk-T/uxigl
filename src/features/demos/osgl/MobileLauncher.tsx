import React, { useMemo, useRef, useState } from 'react';
import { LayoutGrid, Search, Shapes, X } from 'lucide-react';
import { GoogleIcon } from '../../../components/primitives';
import {
  DOCK_APP_IDS,
  ENTERPRISE_APPS,
  resolveIconSurface,
  type DesktopWidgetId,
  type IconBgStyle,
  type QualityMode,
} from './types';
import { MobileWidgetsView } from './MobileWidgetsView';
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
  locale,
  glassOpacity,
  qualityMode,
  setQualityMode,
  openWindowCount,
  widgetsVisible,
  onToggleWidgets,
  enabledWidgets,
  onToggleWidgetItem,
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
  locale: 'tr' | 'en';
  glassOpacity: number;
  qualityMode: QualityMode;
  setQualityMode: (q: QualityMode) => void;
  openWindowCount: number;
  widgetsVisible: boolean;
  onToggleWidgets: () => void;
  enabledWidgets: Record<DesktopWidgetId, boolean>;
  onToggleWidgetItem: (id: DesktopWidgetId) => void;
}) {
  const [mobileTab, setMobileTab] = useState<'apps' | 'widgets'>('apps');
  const isTR = locale === 'tr';
  const activeWidgetCount = useMemo(
    () => Object.values(enabledWidgets).filter(Boolean).length,
    [enabledWidgets]
  );
  const mobileContentWidth = isMobileViewport ? viewportWidth : 374;
  const filteredApps = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ENTERPRISE_APPS.filter(
      (app) => !q || app.label.toLowerCase().includes(q) || app.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const mobileActiveApp = mobileOpenAppId
    ? ENTERPRISE_APPS.find((m) => m.id === mobileOpenAppId)
    : null;

  const mobileDockApps = useMemo(() => {
    const ids = Array.from(new Set([...DOCK_APP_IDS, 'calendar', 'messages', 'settings', 'docs']));
    return ids
      .map((id) => ENTERPRISE_APPS.find((m) => m.id === id))
      .filter((app): app is NonNullable<typeof app> => Boolean(app));
  }, []);

  const dockScrollRef = useRef<HTMLDivElement | null>(null);
  const dockDragRef = useRef<{
    active: boolean;
    startX: number;
    startScrollLeft: number;
    moved: boolean;
  }>({ active: false, startX: 0, startScrollLeft: 0, moved: false });

  const handleDockPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = dockScrollRef.current;
    if (!el) return;
    dockDragRef.current = {
      active: true,
      startX: e.clientX,
      startScrollLeft: el.scrollLeft,
      moved: false,
    };
  };

  const handleDockPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = dockScrollRef.current;
    const d = dockDragRef.current;
    if (!el || !d.active) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 6) d.moved = true;
    el.scrollLeft = d.startScrollLeft - dx;
  };

  const handleDockPointerEnd = () => {
    dockDragRef.current.active = false;
  };

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
        <div
          style={{
            position: 'relative',
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '14px 16px 10px', display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  if (val.trim()) setMobileTab('apps');
                }}
                placeholder={isTR ? 'Uygulama ara...' : 'Search apps...'}
                style={{ border: 'none', outline: 'none', background: 'transparent', color: chromeText, fontSize: 13.5, width: '100%', fontWeight: 600 }}
              />
            </div>

            {!searchQuery.trim() && (
              <div
                role="tablist"
                aria-label={isTR ? 'Mobil Görünüm' : 'Mobile View'}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 4,
                  padding: 3,
                  borderRadius: 12,
                  backgroundColor: chromePillBg,
                  backdropFilter: glassBlur > 0 ? `blur(${glassBlur}px) saturate(160%)` : undefined,
                  WebkitBackdropFilter: glassBlur > 0 ? `blur(${glassBlur}px) saturate(160%)` : undefined,
                  border: chromeBorder,
                }}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={mobileTab === 'apps'}
                  onClick={() => setMobileTab('apps')}
                  style={{
                    border: 'none',
                    borderRadius: 9,
                    padding: '6px 10px',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    backgroundColor: mobileTab === 'apps' ? paletteTokens.primary : 'transparent',
                    color: mobileTab === 'apps' ? '#ffffff' : chromeText,
                    transition: 'all 140ms ease',
                  }}
                >
                  <Shapes size={13} />
                  <span>{isTR ? 'Uygulamalar' : 'Apps'}</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mobileTab === 'widgets'}
                  onClick={() => setMobileTab('widgets')}
                  style={{
                    border: 'none',
                    borderRadius: 9,
                    padding: '6px 10px',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    backgroundColor: mobileTab === 'widgets' ? paletteTokens.primary : 'transparent',
                    color: mobileTab === 'widgets' ? '#ffffff' : chromeText,
                    transition: 'all 140ms ease',
                  }}
                >
                  <LayoutGrid size={13} />
                  <span>{isTR ? "Widget'lar" : 'Widgets'}</span>
                  {widgetsVisible && activeWidgetCount > 0 && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: 999,
                        backgroundColor:
                          mobileTab === 'widgets'
                            ? 'rgba(255,255,255,0.22)'
                            : isDark
                              ? 'rgba(255,255,255,0.14)'
                              : 'rgba(15,23,42,0.10)',
                      }}
                    >
                      {activeWidgetCount}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>

          {mobileTab === 'widgets' && !searchQuery.trim() ? (
            <MobileWidgetsView
              locale={locale}
              isDark={isDark}
              glassOpacity={glassOpacity}
              glassBlur={glassBlur}
              primaryColor={paletteTokens.primary}
              qualityMode={qualityMode}
              setQualityMode={setQualityMode}
              openWindowCount={openWindowCount}
              widgetsVisible={widgetsVisible}
              onToggleWidgets={onToggleWidgets}
              enabledWidgets={enabledWidgets}
              onToggleWidgetItem={onToggleWidgetItem}
              contentWidth={mobileContentWidth}
              chromePillBg={chromePillBg}
              chromeBorder={chromeBorder}
              chromeText={chromeText}
              onOpenApp={onOpenApp}
            />
          ) : (
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
          )}

          {mobileActiveApp && (
            <div style={{ position: 'absolute', inset: 0, backgroundColor: paletteTokens.bgElevated, color: paletteTokens.textPrimary, display: 'flex', flexDirection: 'column', zIndex: 50 }}>
              <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: paletteTokens.surfaceTonal, borderBottom: `1px solid ${paletteTokens.borderSubtle}`, flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <GoogleIcon name={mobileActiveApp.googleIcon} size={17} />
                  <strong style={{ fontSize: 13.5 }}>{mobileActiveApp.label}</strong>
                </div>
                <button type="button" onClick={() => setMobileOpenAppId(null)} style={{ border: 'none', width: 26, height: 26, borderRadius: 999, backgroundColor: 'rgba(148,163,184,0.2)', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              </div>
              <div
                className="macosgl-scroll osgl-mobile-compact"
                style={{
                  flex: 1,
                  minHeight: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: FULLBLEED_APP_IDS.has(mobileActiveApp.id) ? 0 : 8,
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

        {dockVisible && (
          <div
            style={{
              margin: '8px 14px 12px',
              padding: '10px 14px',
              borderRadius: 22,
              backgroundColor: isDark ? 'rgba(15, 23, 42, 0.72)' : 'rgba(255, 255, 255, 0.68)',
              backdropFilter: glassBlur > 0 ? `blur(${glassBlur}px) saturate(160%)` : undefined,
              WebkitBackdropFilter: glassBlur > 0 ? `blur(${glassBlur}px) saturate(160%)` : undefined,
              border: isDark ? '1px solid rgba(255, 255, 255, 0.14)' : '1px solid rgba(255, 255, 255, 0.56)',
              boxShadow: '0 10px 26px rgba(0, 0, 0, 0.22)',
              overflow: 'hidden',
              flexShrink: 0,
              zIndex: 60,
            }}
          >
            <div
              ref={dockScrollRef}
              onPointerDown={handleDockPointerDown}
              onPointerMove={handleDockPointerMove}
              onPointerUp={handleDockPointerEnd}
              onPointerCancel={handleDockPointerEnd}
              onPointerLeave={handleDockPointerEnd}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                overflowX: 'auto',
                scrollSnapType: 'x proximity',
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-x',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                cursor: 'grab',
                padding: '10px 2px',
                margin: '-10px -2px',
                userSelect: 'none',
              }}
            >
              {mobileDockApps.map((app) => {
                const surf = resolveIconSurface(
                  app,
                  iconBgStyle,
                  paletteTokens.primary,
                  isDark,
                  iconColor,
                  iconBgColor,
                  iconGradColor1,
                  iconGradColor2
                );
                return (
                  <button
                    key={app.id}
                    type="button"
                    aria-label={app.shortLabel}
                    onClick={() => {
                      if (dockDragRef.current.moved) {
                        dockDragRef.current.moved = false;
                        return;
                      }
                      onOpenApp(app.id);
                    }}
                    style={{
                      width: 48,
                      height: 48,
                      flexShrink: 0,
                      scrollSnapAlign: 'start',
                      borderRadius: 13,
                      border: surf.border ?? 'none',
                      background: surf.background,
                      backdropFilter: surf.backdropFilter,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: surf.color,
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.38)',
                    }}
                  >
                    <GoogleIcon name={app.googleIcon} size={28} />
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
