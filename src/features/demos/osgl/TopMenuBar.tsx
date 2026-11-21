import React, { useState } from 'react';
import {
  BookOpen,
  Box,
  Columns2,
  FileText,
  FolderOpen,
  Globe,
  Grid2x2,
  Layers,
  LayoutDashboard,
  Monitor,
  Moon,
  Palette,
  RotateCcw,
  Search,
  Smartphone,
  Sparkles,
  Sun,
  Table2,
  Trash2,
  X,
} from 'lucide-react';
import { UXILogo } from '../../../components/brand/UXILogo';
import { ContextMenuItem, MenuBarClock } from './WindowChrome';
import type { ThemeStudioPanelProps } from './ThemeStudioPanel';

type TopMenuKey = 'apps' | 'components' | 'window' | 'view' | 'tools' | 'lang' | null;

export function TopMenuBar({
  onNavigate,
  locale,
  setLocale,
  showMobileLayout,
  isMobileViewport,
  previewDevice,
  setPreviewDevice,
  arrangeMenuOpen,
  setArrangeMenuOpen,
  arrangeWindows,
  closeAllWindows,
  dockVisible,
  onToggleDock,
  onResetIcons,
  onOpenApp,
  onOpenThemeStudio,
  onOpenSpotlight,
  sharedStudioProps,
  isDark,
  effectiveIsLightBg = false,
}: {
  onNavigate?: (sectionId: string, subItemId?: string) => void;
  locale: 'tr' | 'en';
  setLocale: (loc: 'tr' | 'en') => void;
  showMobileLayout: boolean;
  isMobileViewport: boolean;
  previewDevice: 'auto' | 'desktop' | 'mobile';
  setPreviewDevice: React.Dispatch<React.SetStateAction<'auto' | 'desktop' | 'mobile'>>;
  arrangeMenuOpen: boolean;
  setArrangeMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  arrangeWindows: (mode: 'cascade' | 'grid' | 'side-by-side') => void;
  closeAllWindows: () => void;
  dockVisible: boolean;
  onToggleDock: () => void;
  onResetIcons: () => void;
  onOpenApp: (id: string) => void;
  onOpenThemeStudio: () => void;
  onOpenSpotlight: () => void;
  sharedStudioProps: ThemeStudioPanelProps;
  isDark: boolean;
  effectiveIsLightBg?: boolean;
  chromeBarBg?: string;
  chromeText?: string;
  chromeBorder?: string;
  chromePillBg?: string;
  glassBlur?: number;
}) {
  const [openMenu, setOpenMenu] = useState<TopMenuKey>(null);

  const isTR = locale === 'tr';
  const activeMenu: TopMenuKey = arrangeMenuOpen ? 'window' : openMenu;

  const topTextColor = effectiveIsLightBg ? '#0f172a' : '#ffffff';
  const topPillBg = effectiveIsLightBg ? 'rgba(15, 23, 42, 0.12)' : 'rgba(255, 255, 255, 0.16)';
  const trayIconBtnStyle = (active = false): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    padding: 0,
    borderRadius: 7,
    border: 'none',
    backgroundColor: active ? topPillBg : 'transparent',
    color: topTextColor,
    cursor: 'pointer',
  });
  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: 34,
    left: 0,
    width: 230,
    padding: 6,
    borderRadius: 12,
    backgroundColor: isDark ? 'rgba(15, 23, 42, 0.94)' : 'rgba(255, 255, 255, 0.96)',
    color: isDark ? '#f8fafc' : '#0f172a',
    backdropFilter: 'blur(24px)',
    border: isDark ? '1px solid rgba(255,255,255,0.14)' : '1px solid rgba(15,23,42,0.12)',
    boxShadow: '0 20px 50px rgba(0,0,0,0.32)',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    zIndex: 2100,
  };

  const menuBtnStyle = (active: boolean): React.CSSProperties => ({
    border: 'none',
    background: active ? topPillBg : 'transparent',
    color: topTextColor,
    fontSize: 13,
    fontWeight: 600,
    padding: '4px 9px',
    borderRadius: 7,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  });

  const toggleMenu = (key: Exclude<TopMenuKey, null>, e: React.MouseEvent) => {
    e.stopPropagation();
    if (key === 'window') {
      setOpenMenu(null);
      setArrangeMenuOpen((v) => !v);
      return;
    }
    setArrangeMenuOpen(false);
    setOpenMenu((prev) => (prev === key ? null : key));
  };

  const closeAllMenus = () => {
    setOpenMenu(null);
    setArrangeMenuOpen(false);
  };

  return (
    <header
      onClick={() => closeAllMenus()}
      style={{
        position: 'relative',
        height: 44,
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        color: topTextColor,
        background: effectiveIsLightBg
          ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.36) 0%, rgba(255, 255, 255, 0.12) 65%, rgba(255, 255, 255, 0) 100%)'
          : 'linear-gradient(180deg, rgba(0, 0, 0, 0.22) 0%, rgba(0, 0, 0, 0.08) 65%, rgba(0, 0, 0, 0) 100%)',
        textShadow: effectiveIsLightBg
          ? '0 1px 2px rgba(255, 255, 255, 0.65)'
          : '0 1px 3px rgba(0, 0, 0, 0.28)',
        zIndex: 2000,
        flexShrink: 0,
      }}
    >
      {/* Left: Logo + 6 Top-Level Menus (6th is Documentation) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button
          type="button"
          onClick={() => onNavigate?.('landing', 'home')}
          title={onNavigate ? (isTR ? 'uxiGL Ana Sayfaya Dön' : 'Back to uxiGL Home') : 'OSGL'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            border: 'none',
            background: 'transparent',
            padding: '2px 6px 2px 2px',
            marginRight: 4,
            color: topTextColor,
            cursor: onNavigate ? 'pointer' : 'default',
          }}
        >
          <UXILogo size={24} />
          <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.02em' }}>OSGL</span>
        </button>

        {!showMobileLayout && (
          <>
            {/* 1. Uygulamalar / Apps */}
            <div style={{ position: 'relative' }}>
              <button type="button" onClick={(e) => toggleMenu('apps', e)} style={menuBtnStyle(activeMenu === 'apps')}>
                {isTR ? 'Uygulamalar' : 'Apps'}
              </button>
              {activeMenu === 'apps' && (
                <div onClick={(e) => e.stopPropagation()} style={dropdownStyle}>
                  <ContextMenuItem icon={<LayoutDashboard size={14} />} label="Dashboard" onClick={() => { onOpenApp('overview'); closeAllMenus(); }} />
                  <ContextMenuItem icon={<Sparkles size={14} />} label="Analytics" onClick={() => { onOpenApp('analytics'); closeAllMenus(); }} />
                  <ContextMenuItem icon={<Layers size={14} />} label="Kanban" onClick={() => { onOpenApp('page-kanban'); closeAllMenus(); }} />
                  <ContextMenuItem icon={<FileText size={14} />} label="Messages" onClick={() => { onOpenApp('messages'); closeAllMenus(); }} />
                </div>
              )}
            </div>

            {/* 2. Bileşenler / Components */}
            <div style={{ position: 'relative' }}>
              <button type="button" onClick={(e) => toggleMenu('components', e)} style={menuBtnStyle(activeMenu === 'components')}>
                {isTR ? 'Bileşenler' : 'Components'}
              </button>
              {activeMenu === 'components' && (
                <div onClick={(e) => e.stopPropagation()} style={dropdownStyle}>
                  <ContextMenuItem icon={<Table2 size={14} />} label="SheetGL Grid" onClick={() => { onOpenApp('datatable-statcard'); closeAllMenus(); }} />
                  <ContextMenuItem icon={<FolderOpen size={14} />} label="FileManGL Explorer" onClick={() => { onOpenApp('filemangl-explorer'); closeAllMenus(); }} />
                  <ContextMenuItem icon={<FileText size={14} />} label="Forms & Inputs" onClick={() => { onOpenApp('forms'); closeAllMenus(); }} />
                  <ContextMenuItem icon={<Box size={14} />} label="UI Components" onClick={() => { onOpenApp('elements-overview'); closeAllMenus(); }} />
                  <ContextMenuItem icon={<Layers size={14} />} label="Page Templates" onClick={() => { onOpenApp('page-login'); closeAllMenus(); }} />
                </div>
              )}
            </div>

            {/* 3. Pencere / Window */}
            <div style={{ position: 'relative' }}>
              <button type="button" onClick={(e) => toggleMenu('window', e)} style={menuBtnStyle(activeMenu === 'window')}>
                {isTR ? 'Pencere' : 'Window'}
              </button>
              {activeMenu === 'window' && (
                <div onClick={(e) => e.stopPropagation()} style={dropdownStyle}>
                  <ContextMenuItem icon={<Grid2x2 size={14} />} label={isTR ? 'Izgara Dizilimi (Grid)' : 'Tile Grid'} onClick={() => { arrangeWindows('grid'); closeAllMenus(); }} />
                  <ContextMenuItem icon={<Layers size={14} />} label={isTR ? 'Kademeli Dizilim (Cascade)' : 'Cascade'} onClick={() => { arrangeWindows('cascade'); closeAllMenus(); }} />
                  <ContextMenuItem icon={<Columns2 size={14} />} label={isTR ? 'Yan Yana Diz' : 'Side by Side'} onClick={() => { arrangeWindows('side-by-side'); closeAllMenus(); }} />
                  <div style={{ height: 1, backgroundColor: 'rgba(148,163,184,0.2)', margin: '4px 0' }} />
                  <ContextMenuItem icon={<X size={14} />} label={isTR ? 'Tüm Pencereleri Kapat' : 'Close All Windows'} onClick={() => { closeAllWindows(); closeAllMenus(); }} />
                </div>
              )}
            </div>

            {/* 4. Görünüm / View (Basit görünüm ayarları menüsü) */}
            <div style={{ position: 'relative' }}>
              <button type="button" onClick={(e) => toggleMenu('view', e)} style={menuBtnStyle(activeMenu === 'view')}>
                {isTR ? 'Görünüm' : 'View'}
              </button>
              {activeMenu === 'view' && (
                <div onClick={(e) => e.stopPropagation()} style={{ ...dropdownStyle, width: 240 }}>
                  <ContextMenuItem
                    icon={isDark ? <Sun size={14} /> : <Moon size={14} />}
                    label={
                      isDark
                        ? isTR
                          ? 'Aydınlık Moda Geç'
                          : 'Switch to Light Mode'
                        : isTR
                          ? 'Karanlık Moda Geç'
                          : 'Switch to Dark Mode'
                    }
                    onClick={() => {
                      sharedStudioProps.setMode(isDark ? 'light' : 'dark');
                      closeAllMenus();
                    }}
                  />
                  <ContextMenuItem
                    icon={<Layers size={14} />}
                    label={
                      dockVisible
                        ? isTR
                          ? "Dock'u Gizle"
                          : 'Hide Dock'
                        : isTR
                          ? "Dock'u Göster"
                          : 'Show Dock'
                    }
                    onClick={() => {
                      onToggleDock();
                      closeAllMenus();
                    }}
                  />
                  <ContextMenuItem
                    icon={<Sparkles size={14} />}
                    label={
                      sharedStudioProps.windowAnimation
                        ? isTR
                          ? 'Pencere Efektini Kapat'
                          : 'Disable Window Effects'
                        : isTR
                          ? 'Pencere Efektini Aç'
                          : 'Enable Window Effects'
                    }
                    onClick={() => {
                      sharedStudioProps.setWindowAnimation(!sharedStudioProps.windowAnimation);
                      closeAllMenus();
                    }}
                  />
                  {!isMobileViewport && (
                    <ContextMenuItem
                      icon={previewDevice === 'mobile' ? <Monitor size={14} /> : <Smartphone size={14} />}
                      label={
                        previewDevice === 'mobile'
                          ? isTR
                            ? 'Masaüstü Görünümü'
                            : 'Desktop View'
                          : isTR
                            ? 'Mobil Önizleme'
                            : 'Mobile Preview'
                      }
                      onClick={() => {
                        setPreviewDevice((prev) => (prev === 'mobile' ? 'desktop' : 'mobile'));
                        closeAllMenus();
                      }}
                    />
                  )}
                  <div style={{ height: 1, backgroundColor: 'rgba(148,163,184,0.2)', margin: '4px 0' }} />
                  <ContextMenuItem
                    icon={<Palette size={14} />}
                    label={isTR ? 'Tema Stüdyosu...' : 'Theme Studio...'}
                    onClick={() => {
                      closeAllMenus();
                      onOpenThemeStudio();
                    }}
                  />
                </div>
              )}
            </div>

            {/* 5. Araçlar / Tools */}
            <div style={{ position: 'relative' }}>
              <button type="button" onClick={(e) => toggleMenu('tools', e)} style={menuBtnStyle(activeMenu === 'tools')}>
                {isTR ? 'Araçlar' : 'Tools'}
              </button>
              {activeMenu === 'tools' && (
                <div onClick={(e) => e.stopPropagation()} style={dropdownStyle}>
                  <ContextMenuItem icon={<RotateCcw size={14} />} label={isTR ? 'Simge Sıralamasını Sıfırla' : 'Reset Icon Layout'} onClick={() => { onResetIcons(); closeAllMenus(); }} />
                  <ContextMenuItem icon={<Trash2 size={14} />} label={isTR ? 'Masaüstünü Temizle' : 'Clear Desktop'} onClick={() => { closeAllWindows(); closeAllMenus(); }} />
                </div>
              )}
            </div>

            {/* 6. Dokümantasyon / Docs */}
            <button
              type="button"
              onClick={() => {
                closeAllMenus();
                onOpenApp('docs');
              }}
              style={{
                ...menuBtnStyle(false),
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <BookOpen size={13} />
              <span>{isTR ? 'Dokümantasyon' : 'Docs'}</span>
            </button>
          </>
        )}
      </div>

      {/* Right: Clean Frameless macOS Tray Icons + Clock */}
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

        {/* Globe Language Dropdown */}
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
    </header>
  );
}
