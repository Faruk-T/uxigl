import React from 'react';
import {
  Check,
  Eye,
  EyeOff,
  Globe,
  LayoutGrid,
  Monitor,
  Palette,
  RotateCcw,
  Search,
  Smartphone,
} from 'lucide-react';
import { ContextMenuItem, MenuBarClock } from './WindowChrome';
import type { TopMenuKey } from './TopMenuDropdowns';
import type { DesktopWidgetId } from './types';

const WIDGET_LABELS: { id: DesktopWidgetId; tr: string; en: string }[] = [
  { id: 'clock', tr: 'Saat & Takvim', en: 'Clock & Calendar' },
  { id: 'kpi', tr: 'Dashboard KPI & Grafik', en: 'Dashboard KPI & Chart' },
  { id: 'timer', tr: 'Odak Sayacı', en: 'Focus Timer' },
  { id: 'todo', tr: 'Yapılacaklar', en: 'To-Do List' },
  { id: 'notes', tr: 'Hızlı Notlar', en: 'Quick Notes' },
  { id: 'system', tr: 'Sistem Özeti', en: 'System Status' },
  { id: 'timeline', tr: 'Günlük Zaman Akışı', en: 'Daily Time Flow' },
];

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
  widgetsVisible,
  onToggleWidgets,
  enabledWidgets,
  onToggleWidgetItem,
  onResetWidgetPositions,
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
  widgetsVisible?: boolean;
  onToggleWidgets?: () => void;
  enabledWidgets?: Record<DesktopWidgetId, boolean>;
  onToggleWidgetItem?: (id: DesktopWidgetId) => void;
  onResetWidgetPositions?: () => void;
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

      {/* Widget Settings Trigger Right Next to the Clock */}
      {!showMobileLayout && (
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            aria-label={isTR ? 'Widget Ayarları' : 'Widget Settings'}
            title={isTR ? 'Widget Ayarları' : 'Widget Settings'}
            onClick={(e) => toggleMenu('widgets', e)}
            style={trayIconBtnStyle(activeMenu === 'widgets')}
          >
            <LayoutGrid size={15.5} />
          </button>
          {activeMenu === 'widgets' && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                ...dropdownStyle,
                left: 'auto',
                right: 0,
                width: 236,
              }}
            >
              <div
                style={{
                  padding: '4px 8px 3px',
                  fontSize: 10.5,
                  fontWeight: 700,
                  opacity: 0.58,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {isTR ? 'Widget Ayarları' : 'Widget Settings'}
              </div>
              {onToggleWidgets && (
                <ContextMenuItem
                  icon={widgetsVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                  label={
                    widgetsVisible
                      ? isTR
                        ? "Tüm Widget'ları Gizle"
                        : 'Hide All Widgets'
                      : isTR
                        ? "Widget'ları Göster"
                        : 'Show All Widgets'
                  }
                  onClick={() => onToggleWidgets()}
                />
              )}
              <div style={{ height: 1, backgroundColor: 'rgba(148,163,184,0.2)', margin: '4px 0' }} />
              {enabledWidgets &&
                onToggleWidgetItem &&
                WIDGET_LABELS.map((w) => (
                  <ContextMenuItem
                    key={w.id}
                    icon={
                      <span
                        style={{
                          width: 14,
                          display: 'inline-flex',
                          justifyContent: 'center',
                          color: enabledWidgets[w.id] ? '#3b82f6' : 'transparent',
                        }}
                      >
                        <Check size={13} />
                      </span>
                    }
                    label={isTR ? w.tr : w.en}
                    onClick={() => onToggleWidgetItem(w.id)}
                  />
                ))}
              {onResetWidgetPositions && (
                <>
                  <div style={{ height: 1, backgroundColor: 'rgba(148,163,184,0.2)', margin: '4px 0' }} />
                  <ContextMenuItem
                    icon={<RotateCcw size={14} />}
                    label={isTR ? 'Izgara Konumlarını Sıfırla' : 'Reset Grid Positions'}
                    onClick={() => {
                      onResetWidgetPositions();
                      closeAllMenus();
                    }}
                  />
                </>
              )}
            </div>
          )}
        </div>
      )}

      <MenuBarClock />
    </div>
  );
}
