import React from 'react';
import { Columns2, Grid2x2, Layers, Palette, RotateCcw, Sparkles, Trash2 } from 'lucide-react';
import { OS_WALLPAPERS, type OSWallpaperId } from '../OSGLEngine';
import { ContextMenuItem } from './WindowChrome';

export function ContextMenu({
  position,
  isDark,
  wallpaper,
  selectedAppIds,
  dockVisible,
  onOpenApp,
  onArrange,
  onSelectWallpaper,
  onToggleDock,
  onResetIcons,
  onCloseAll,
  onCloseMenu,
}: {
  position: { x: number; y: number };
  isDark: boolean;
  wallpaper: OSWallpaperId;
  selectedAppIds: string[];
  dockVisible: boolean;
  onOpenApp: (id: string) => void;
  onArrange: (mode: 'cascade' | 'grid' | 'side-by-side') => void;
  onSelectWallpaper: (wp: OSWallpaperId) => void;
  onToggleDock: () => void;
  onResetIcons: () => void;
  onCloseAll: () => void;
  onCloseMenu: () => void;
}) {
  return (
    <div
      data-macos-context="true"
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: 232,
        padding: 6,
        borderRadius: 14,
        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.94)' : 'rgba(255, 255, 255, 0.94)',
        color: isDark ? '#f8fafc' : '#0f172a',
        backdropFilter: 'blur(26px)',
        border: isDark ? '1px solid rgba(255,255,255,0.16)' : '1px solid rgba(15,23,42,0.12)',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.36)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        zIndex: 2200,
      }}
    >
      {selectedAppIds.length > 1 && (
        <ContextMenuItem
          icon={<Sparkles size={14} />}
          label={`Seçilenleri Aç (${selectedAppIds.length})`}
          onClick={() => {
            selectedAppIds.forEach((id) => onOpenApp(id));
            onCloseMenu();
          }}
        />
      )}
      <ContextMenuItem icon={<Sparkles size={14} />} label="Yeni Pencere (Dashboard)" onClick={() => { onOpenApp('overview'); onCloseMenu(); }} />
      <ContextMenuItem icon={<Grid2x2 size={14} />} label="Pencereleri Izgara Diz" onClick={() => { onArrange('grid'); onCloseMenu(); }} />
      <ContextMenuItem icon={<Layers size={14} />} label="Kademeli Diz (Cascade)" onClick={() => { onArrange('cascade'); onCloseMenu(); }} />
      <ContextMenuItem icon={<Columns2 size={14} />} label="Yan Yana Diz" onClick={() => { onArrange('side-by-side'); onCloseMenu(); }} />
      <div style={{ height: 1, backgroundColor: 'rgba(148,163,184,0.2)', margin: '4px 0' }} />
      <div style={{ padding: '4px 8px', fontSize: 10.5, fontWeight: 700, opacity: 0.6 }}>macOS Duvar Kağıdı</div>
      <div style={{ display: 'flex', gap: 6, padding: '4px 8px 6px', flexWrap: 'wrap' }}>
        {(Object.keys(OS_WALLPAPERS) as OSWallpaperId[]).map((wpId) => (
          <button
            key={wpId}
            type="button"
            title={OS_WALLPAPERS[wpId].name}
            onClick={() => {
              onSelectWallpaper(wpId);
              onCloseMenu();
            }}
            style={{
              width: 24,
              height: 24,
              borderRadius: 999,
              border: wallpaper === wpId ? '2px solid #3b82f6' : '1px solid rgba(148,163,184,0.4)',
              background: OS_WALLPAPERS[wpId].preview,
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
      <div style={{ height: 1, backgroundColor: 'rgba(148,163,184,0.2)', margin: '4px 0' }} />
      <ContextMenuItem icon={<Palette size={14} />} label="OS Tema Stüdyosu" onClick={() => { onOpenApp('os-theme-studio'); onCloseMenu(); }} />
      <ContextMenuItem icon={<Layers size={14} />} label={dockVisible ? "Dock'u Gizle" : "Dock'u Göster"} onClick={() => { onToggleDock(); onCloseMenu(); }} />
      <ContextMenuItem icon={<RotateCcw size={14} />} label="Simge Sıralamasını Sıfırla" onClick={() => { onResetIcons(); onCloseMenu(); }} />
      <ContextMenuItem icon={<Trash2 size={14} />} label="Tüm Pencereleri Kapat" onClick={() => { onCloseAll(); onCloseMenu(); }} />
    </div>
  );
}

