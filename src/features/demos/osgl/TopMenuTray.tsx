import React from 'react';
import { Globe, Monitor, Palette, Search, Smartphone } from 'lucide-react';
import { ContextMenuItem, MenuBarClock } from './WindowChrome';
import type { TopMenuKey } from './TopMenuDropdowns';

export function TopMenuTray({
  isTR,
  locale,
  setLocale,
  showMobileLayout,
  isMobileViewport,
  previewDevice,
  setPreviewDevice,
  activeMenu,
  toggleMenu,
  closeAllMenus,
  onOpenSpotlight,
  onOpenThemeStudio,
  trayIconBtnStyle,
  dropdownStyle,
}: {
  isTR: boolean;
  locale: 'tr' | 'en';
  setLocale: (loc: 'tr' | 'en') => void;
  showMobileLayout: boolean;
  isMobileViewport: boolean;
  previewDevice: 'auto' | 'desktop' | 'mobile';
  setPreviewDevice: React.Dispatch<React.SetStateAction<'auto' | 'desktop' | 'mobile'>>;
  activeMenu: TopMenuKey;
  toggleMenu: (key: Exclude<TopMenuKey, null>, e: React.MouseEvent) => void;
  closeAllMenus: () => void;
  onOpenSpotlight: () => void;
  onOpenThemeStudio: () => void;
  trayIconBtnStyle: (active?: boolean) => React.CSSProperties;
  dropdownStyle: React.CSSProperties;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {!showMobileLayout && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenSpotlight();
          }}
          title={isTR ? 'Hızlı Arama (Ctrl+K)' : 'Quick Search (Ctrl+K)'}
          style={trayIconBtnStyle()}
        >
          <Search size={16} />
        </button>
      )}
      {!isMobileViewport && (
        <button
          type="button"
          onClick={() => setPreviewDevice((prev) => (prev === 'mobile' ? 'desktop' : 'mobile'))}
          title={isTR ? 'Masaüstü / Mobil Görünüm Değiştir' : 'Toggle Desktop / Mobile'}
          style={trayIconBtnStyle(previewDevice === 'mobile')}
        >
          {previewDevice === 'mobile' ? <Monitor size={16} /> : <Smartphone size={16} />}
        </button>
      )}

      <button
        type="button"
        onClick={onOpenThemeStudio}
        title={isTR ? 'OS Tema Stüdyosu' : 'OS Theme Studio'}
        style={trayIconBtnStyle()}
      >
        <Palette size={16} />
      </button>

      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={(e) => toggleMenu('lang', e)}
          title={isTR ? `Dil: ${locale.toUpperCase()}` : `Language: ${locale.toUpperCase()}`}
          style={trayIconBtnStyle(activeMenu === 'lang')}
        >
          <Globe size={16} />
        </button>
        {activeMenu === 'lang' && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              ...dropdownStyle,
              left: 'auto',
              right: 0,
              width: 140,
            }}
          >
            <ContextMenuItem
              icon={<span style={{ fontSize: 12, fontWeight: 800 }}>TR</span>}
              label="Türkçe"
              onClick={() => {
                setLocale('tr');
                closeAllMenus();
              }}
            />
            <ContextMenuItem
              icon={<span style={{ fontSize: 12, fontWeight: 800 }}>EN</span>}
              label="English"
              onClick={() => {
                setLocale('en');
                closeAllMenus();
              }}
            />
          </div>
        )}
      </div>

      <MenuBarClock />
    </div>
  );
}

