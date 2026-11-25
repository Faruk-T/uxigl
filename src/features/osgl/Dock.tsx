import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { GoogleIcon } from '../../components/primitives';
import {
  resolveIconSurface,
  type FloatingWindowState,
  type IconBgStyle,
  type OSWorkspaceApp,
} from './types';
import { useDockMagnification } from './useDockMagnification';

export function Dock({
  dockApps,
  allApps = [],
  isDark,
  effectiveIsLightBg = false,
  glassBlur,
  windows,
  iconBgStyle,
  iconBgColor,
  iconGradColor1,
  iconGradColor2,
  iconColor,
  primaryColor,
  onOpenApp,
  onPinAppToDock,
  onReorderDock,
  onOpenDockCustomizer,
  onOpenDockItemContextMenu,
  onArrangeSideBySide,
  onArrangeGrid,
  onCloseAll,
}: {
  dockApps: OSWorkspaceApp[];
  allApps?: OSWorkspaceApp[];
  isDark: boolean;
  effectiveIsLightBg?: boolean;
  glassBlur: number;
  windows: FloatingWindowState[];
  iconBgStyle: IconBgStyle;
  iconBgColor: string;
  iconGradColor1: string;
  iconGradColor2: string;
  iconColor: string;
  primaryColor: string;
  onOpenApp: (id: string) => void;
  onPinAppToDock?: (appId: string) => void;
  onReorderDock?: (draggedAppId: string, targetAppId: string) => void;
  onOpenDockCustomizer?: () => void;
  onOpenDockItemContextMenu?: (e: React.MouseEvent, appId: string) => void;
  onArrangeSideBySide: () => void;
  onArrangeGrid: () => void;
  onCloseAll: () => void;
}) {
  const runningUnpinnedApps = allApps.filter(
    (app) => !dockApps.some((d) => d.id === app.id) && windows.some((w) => w.appId === app.id)
  );
  const mag = useDockMagnification(dockApps.length + runningUnpinnedApps.length);
  const [dragOverDock, setDragOverDock] = useState(false);

  const renderDockTooltip = (label: string) => (
    <span
      role="tooltip"
      style={{
        position: 'absolute', bottom: 'calc(100% + 12px)', left: 0, right: 0,
        display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 20,
      }}
    >
      <span
        style={{
          padding: '5px 10px', borderRadius: 8,
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.95)',
          color: isDark ? '#f8fafc' : '#0f172a',
          backdropFilter: glassBlur > 0 ? 'blur(16px) saturate(160%)' : undefined,
          WebkitBackdropFilter: glassBlur > 0 ? 'blur(16px) saturate(160%)' : undefined,
          border: isDark ? '1px solid rgba(255, 255, 255, 0.14)' : '1px solid rgba(15, 23, 42, 0.10)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.22)',
          fontSize: 12, fontWeight: 600, lineHeight: 1.2, whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </span>
  );

  const hasOpenWindows = windows.some((w) => !w.minimized);
  const utilityActions: Array<{
    id: string; label: string; googleIcon: string; iconNode?: React.ReactNode; danger: boolean; onClick: () => void;
  }> = [
    ...(onOpenDockCustomizer
      ? [{ id: 'dock-customize', label: 'Dock Simgelerini Özelleştir', googleIcon: 'add', iconNode: <Plus size={19} />, danger: false, onClick: onOpenDockCustomizer }]
      : []),
    { id: 'dock-side-by-side', label: 'Pencereleri Yan Yana Diz', googleIcon: 'vertical_split', danger: false, onClick: onArrangeSideBySide },
    { id: 'dock-arrange-grid', label: 'Pencereleri Izgara Diz', googleIcon: 'grid_view', danger: false, onClick: onArrangeGrid },
    ...(hasOpenWindows
      ? [{ id: 'dock-close-all', label: 'Tüm Pencereleri Kapat', googleIcon: 'close', danger: true, onClick: onCloseAll }]
      : []),
  ];

  const useDarkDockGlass = isDark || !effectiveIsLightBg;

  return (
    <div
      data-macos-dock="true"
      onMouseEnter={mag.handleMouseEnter}
      onMouseMove={mag.handleMouseMove}
      onMouseLeave={mag.handleMouseLeave}
      onDragOver={(e) => {
        e.preventDefault();
        if (!dragOverDock) setDragOverDock(true);
      }}
      onDragLeave={() => setDragOverDock(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOverDock(false);
        const draggedId = e.dataTransfer?.getData('text/osgl-app-id');
        if (draggedId && onPinAppToDock) onPinAppToDock(draggedId);
      }}
      style={{
        position: 'absolute', left: '50%', bottom: 14, transform: 'translateX(-50%)',
        padding: '9px 13px', borderRadius: 22,
        backgroundColor: useDarkDockGlass ? 'rgba(15, 23, 42, 0.56)' : 'rgba(255, 255, 255, 0.68)',
        backdropFilter: glassBlur > 0 ? `blur(${glassBlur}px) saturate(165%)` : undefined,
        WebkitBackdropFilter: glassBlur > 0 ? `blur(${glassBlur}px) saturate(165%)` : undefined,
        border: dragOverDock
          ? `1.5px dashed ${primaryColor}`
          : useDarkDockGlass
            ? '1px solid rgba(255, 255, 255, 0.18)'
            : '1px solid rgba(255, 255, 255, 0.72)',
        boxShadow: useDarkDockGlass
          ? '0 22px 54px rgba(0, 0, 0, 0.48), inset 0 1px 0 rgba(255, 255, 255, 0.12)'
          : '0 20px 50px rgba(15, 23, 42, 0.22)',
        display: 'flex', alignItems: 'flex-end', gap: 9, zIndex: 1950,
      }}
    >
      {dockApps.map((app, idx) => {
        const isRunning = windows.some((w) => w.appId === app.id);
        const dockSurf = resolveIconSurface(
          app, iconBgStyle, primaryColor, isDark, iconColor, iconBgColor, iconGradColor1, iconGradColor2
        );
        return (
          <button
            key={app.id}
            ref={(el) => { mag.dockItemRefs.current[idx] = el; }}
            type="button"
            draggable
            aria-label={app.label}
            onDragStart={(e) => e.dataTransfer?.setData('text/osgl-app-id', app.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragOverDock(false);
              const draggedId = e.dataTransfer?.getData('text/osgl-app-id');
              if (draggedId && onReorderDock) onReorderDock(draggedId, app.id);
            }}
            onContextMenu={(e) => {
              if (!onOpenDockItemContextMenu) return;
              e.preventDefault();
              e.stopPropagation();
              onOpenDockItemContextMenu(e, app.id);
            }}
            onMouseEnter={() => mag.setHoveredIdx(idx)}
            onMouseLeave={() => mag.setHoveredIdx((prev) => (prev === idx ? null : prev))}
            onFocus={() => mag.setHoveredIdx(idx)}
            onBlur={() => mag.setHoveredIdx((prev) => (prev === idx ? null : prev))}
            onClick={() => onOpenApp(app.id)}
            style={{
              position: 'relative', width: 46, height: 46, padding: 0, borderRadius: 13,
              border: dockSurf.border ?? 'none', background: dockSurf.background,
              backdropFilter: dockSurf.backdropFilter,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: dockSurf.color,
              boxShadow: '0 8px 18px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.4)',
              transition: 'width 0.1s ease-out, height 0.1s ease-out, border-radius 0.1s ease-out',
              flexShrink: 0,
            }}
          >
            {mag.hoveredIdx === idx && renderDockTooltip(app.label)}
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.1s ease-out', pointerEvents: 'none' }}>
              {app.iconNode ?? <GoogleIcon name={app.googleIcon} size={27} />}
            </span>
            {isRunning && (
              <span
                style={{
                  position: 'absolute', bottom: -7, width: 4.5, height: 4.5, borderRadius: 999,
                  backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.45)',
                }}
              />
            )}
          </button>
        );
      })}

      {runningUnpinnedApps.length > 0 && (
        <>
          <div
            style={{
              width: 1, height: 28, alignSelf: 'center', margin: '0 2px',
              backgroundColor: useDarkDockGlass ? 'rgba(255,255,255,0.20)' : 'rgba(15,23,42,0.16)',
            }}
          />
          {runningUnpinnedApps.map((app, offset) => {
            const idx = dockApps.length + offset;
            const dockSurf = resolveIconSurface(
              app, iconBgStyle, primaryColor, isDark, iconColor, iconBgColor, iconGradColor1, iconGradColor2
            );
            return (
              <button
                key={`running-${app.id}`}
                ref={(el) => { mag.dockItemRefs.current[idx] = el; }}
                type="button"
                aria-label={`${app.label} (Açık — sağ tıkla sabitle)`}
                onContextMenu={(e) => {
                  if (!onOpenDockItemContextMenu) return;
                  e.preventDefault();
                  e.stopPropagation();
                  onOpenDockItemContextMenu(e, app.id);
                }}
                onMouseEnter={() => mag.setHoveredIdx(idx)}
                onMouseLeave={() => mag.setHoveredIdx((prev) => (prev === idx ? null : prev))}
                onFocus={() => mag.setHoveredIdx(idx)}
                onBlur={() => mag.setHoveredIdx((prev) => (prev === idx ? null : prev))}
                onClick={() => onOpenApp(app.id)}
                style={{
                  position: 'relative', width: 46, height: 46, padding: 0, borderRadius: 13,
                  border: dockSurf.border ?? 'none', background: dockSurf.background,
                  backdropFilter: dockSurf.backdropFilter,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: dockSurf.color,
                  boxShadow: '0 8px 18px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.4)',
                  transition: 'width 0.1s ease-out, height 0.1s ease-out, border-radius 0.1s ease-out',
                  flexShrink: 0,
                }}
              >
                {mag.hoveredIdx === idx && renderDockTooltip(`${app.label} · Açık`)}
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.1s ease-out', pointerEvents: 'none' }}>
                  {app.iconNode ?? <GoogleIcon name={app.googleIcon} size={27} />}
                </span>
                <span
                  style={{
                    position: 'absolute', bottom: -7, width: 4.5, height: 4.5, borderRadius: 999,
                    backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.45)',
                  }}
                />
              </button>
            );
          })}
        </>
      )}

      <div
        style={{
          width: 1, height: 28, alignSelf: 'center', margin: '0 2px',
          backgroundColor: useDarkDockGlass ? 'rgba(255,255,255,0.20)' : 'rgba(15,23,42,0.16)',
        }}
      />

      {utilityActions.map((action, offsetIdx) => {
        const idx = dockApps.length + runningUnpinnedApps.length + offsetIdx;
        return (
          <button
            key={action.id}
            ref={(el) => { mag.dockItemRefs.current[idx] = el; }}
            type="button"
            aria-label={action.label}
            onMouseEnter={() => mag.setHoveredIdx(idx)}
            onMouseLeave={() => mag.setHoveredIdx((prev) => (prev === idx ? null : prev))}
            onClick={action.onClick}
            style={{
              position: 'relative', width: 40, height: 40, padding: 0, borderRadius: 11,
              border: useDarkDockGlass ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid rgba(15, 23, 42, 0.14)',
              background: action.danger ? 'rgba(239, 68, 68, 0.22)' : useDarkDockGlass ? 'rgba(255, 255, 255, 0.11)' : 'rgba(15, 23, 42, 0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: action.danger ? '#fca5a5' : useDarkDockGlass ? '#f8fafc' : '#0f172a',
              transition: 'width 0.1s ease-out, height 0.1s ease-out, border-radius 0.1s ease-out',
              flexShrink: 0,
            }}
          >
            {mag.hoveredIdx === idx && renderDockTooltip(action.label)}
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.1s ease-out', pointerEvents: 'none' }}>
              {action.iconNode ?? <GoogleIcon name={action.googleIcon} size={20} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
