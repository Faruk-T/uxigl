import React from 'react';
import {
  Menu,
  Sun,
  Moon,
  Palette,
  Bell,
  Search,
  ChevronRight,
  Home,
  Sparkles,
  Link2,
} from 'lucide-react';
import type { BreadcrumbItem } from '../../../core/contracts/NavigationContract';
import { RouteService } from '../../../core/services/RouteService';
import { useTheme } from '../../../providers/ThemeProvider';
import { useToast } from '../../../providers/ToastProvider';
import { Button, Tooltip } from '../../primitives';

/**
 * ============================================================================
 * UXU COMPOSITE — FULL-WIDTH DASHBOARD TOP HEADER BAR
 * ============================================================================
 */

export interface TopHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  activeRoutePath?: string;
  onOpenMobileMenu: () => void;
  onOpenCommandPalette: () => void;
  onOpenThemeStudio: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  breadcrumbs,
  activeRoutePath,
  onOpenMobileMenu,
  onOpenCommandPalette,
  onOpenThemeStudio,
}) => {
  const {
    resolvedMode,
    preferences,
    availablePalettes,
    toggleMode,
    setSeedPalette,
    setFontScale,
    setCustomRadiusPx,
    setWebglEnabled,
  } = useTheme();
  const { notify } = useToast();

  const handleToggleWebgl = () => {
    const next = !preferences.webglEnabled;
    setWebglEnabled(next);
    notify({
      title: next ? 'WebGL Açık' : 'Eko Mod Aktif',
      description: next
        ? '30 FPS hafif arka plan açıldı.'
        : 'WebGL kapatıldı (0% GPU yükü).',
      tone: next ? 'info' : 'success',
    });
  };

  const adjustFont = (delta: number) => {
    const next = Math.max(80, Math.min(125, (preferences.fontScale ?? 100) + delta));
    setFontScale(next);
  };

  const currentRadiusPx =
    typeof preferences.customRadiusPx === 'number'
      ? preferences.customRadiusPx
      : preferences.radiusScale === 'sharp'
      ? 4
      : preferences.radiusScale === 'pill'
      ? 22
      : 12;

  const adjustRadius = (delta: number) => {
    setCustomRadiusPx(Math.max(0, Math.min(32, currentRadiusPx + delta)));
  };

  return (
    <header className="uxu-dash-header">
      {/* Left: Mobile Hamburger + Breadcrumb Navigation */}
      <div className="uxu-dash-header__left">
        <button
          type="button"
          className="uxu-dash-header__menu-btn uxu-only-mobile"
          onClick={onOpenMobileMenu}
          aria-label="Menüyü Aç"
        >
          <Menu size={20} />
        </button>

        <nav className="uxu-breadcrumbs" aria-label="Sayfa Konumu (Breadcrumb)">
          <a
            href="/dashboard/overview"
            className="uxu-breadcrumbs__home"
            title="/dashboard/overview"
            onClick={(e) => {
              if (RouteService.isModifiedClick(e)) return;
              if (breadcrumbs[0]?.onClick) {
                e.preventDefault();
                breadcrumbs[0].onClick();
              }
            }}
          >
            <Home size={14} />
          </a>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const href = crumb.href ?? '/dashboard/overview';
            return (
              <React.Fragment key={crumb.id}>
                <ChevronRight size={13} className="uxu-breadcrumbs__sep" />
                {crumb.onClick && !isLast ? (
                  <a
                    href={href}
                    title={href}
                    className="uxu-breadcrumbs__link"
                    onClick={(e) => {
                      if (RouteService.isModifiedClick(e)) return;
                      e.preventDefault();
                      crumb.onClick?.();
                    }}
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <a
                    href={href}
                    title={href}
                    aria-current={isLast ? 'page' : undefined}
                    className={`uxu-breadcrumbs__item ${
                      isLast ? 'uxu-breadcrumbs__item--current' : ''
                    }`}
                    onClick={(e) => {
                      if (RouteService.isModifiedClick(e)) return;
                      e.preventDefault();
                    }}
                  >
                    {crumb.label}
                  </a>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {activeRoutePath && (
          <Tooltip content="Aktif Route URL Adresini Kopyala">
            <button
              type="button"
              className="uxu-route-pill uxu-hide-mobile"
              onClick={() => {
                const fullUrl = `${window.location.origin}${activeRoutePath}`;
                navigator.clipboard?.writeText(fullUrl);
                notify({
                  title: 'Route URL Kopyalandı',
                  description: fullUrl,
                  tone: 'info',
                });
              }}
            >
              <Link2 size={11} />
              <code>{activeRoutePath}</code>
            </button>
          </Tooltip>
        )}
      </div>

      {/* Right: Global Font Size Control, Optional WebGL Toggle, Seed Dots, Search, Studio, Dark/Light */}
      <div className="uxu-dash-header__right">
        {/* Global Font Scale Stepper (A- / % / A+) */}
        <div
          className="uxu-font-stepper"
          role="group"
          aria-label="Genel Yazı Boyutu Ayarı"
        >
          <button
            type="button"
            className="uxu-font-stepper__btn"
            onClick={() => adjustFont(-5)}
            disabled={(preferences.fontScale ?? 100) <= 80}
            title="Yazı Boyutunu Küçült (A-)"
            aria-label="Yazı Boyutunu Küçült"
          >
            A-
          </button>
          <button
            type="button"
            className="uxu-font-stepper__val"
            onClick={() => setFontScale(100)}
            title="Varsayılan Yazı Boyutuna Sıfırla (%100)"
          >
            {preferences.fontScale ?? 100}%
          </button>
          <button
            type="button"
            className="uxu-font-stepper__btn"
            onClick={() => adjustFont(5)}
            disabled={(preferences.fontScale ?? 100) >= 125}
            title="Yazı Boyutunu Büyüt (A+)"
            aria-label="Yazı Boyutunu Büyüt"
          >
            A+
          </button>
        </div>

        {/* Global Border Radius Stepper (R- / px / R+) */}
        <div
          className="uxu-font-stepper uxu-hide-mobile"
          role="group"
          aria-label="Genel Köşe Yuvarlaklığı (Border Radius) Ayarı"
        >
          <button
            type="button"
            className="uxu-font-stepper__btn"
            onClick={() => adjustRadius(-2)}
            disabled={currentRadiusPx <= 0}
            title="Border Radius Küçült (R-)"
            aria-label="Border Radius Küçült"
          >
            R-
          </button>
          <button
            type="button"
            className="uxu-font-stepper__val"
            onClick={() => setCustomRadiusPx(12)}
            title="Border Radius Sıfırla (Varsayılan 12px Squircle)"
          >
            R:{currentRadiusPx}px
          </button>
          <button
            type="button"
            className="uxu-font-stepper__btn"
            onClick={() => adjustRadius(2)}
            disabled={currentRadiusPx >= 32}
            title="Border Radius Büyüt (R+)"
            aria-label="Border Radius Büyüt"
          >
            R+
          </button>
        </div>

        <Tooltip content="Opsiyonel WebGL Efektini Aç / Kapat">
          <Button
            variant={preferences.webglEnabled ? 'tonal' : 'outlined'}
            size="xs"
            pill
            leadingIcon={<Sparkles size={12} />}
            onClick={handleToggleWebgl}
            className="uxu-hide-mobile"
          >
            WebGL: {preferences.webglEnabled ? 'Açık' : 'Kapalı'}
          </Button>
        </Tooltip>

        {/* Quick Seed Color Swatches in Header */}
        <div
          className="uxu-header-seed-dots uxu-hide-mobile"
          role="group"
          aria-label="Hızlı Renk Paleti Seçici"
        >
          {availablePalettes.map((palette) => {
            const isSelected = preferences.seedPalette === palette.id;
            const color =
              resolvedMode === 'dark'
                ? palette.dark.primary
                : palette.light.primary;
            return (
              <button
                key={palette.id}
                type="button"
                title={palette.name}
                onClick={() => setSeedPalette(palette.id)}
                className={`uxu-seed-dot ${
                  isSelected ? 'uxu-seed-dot--active' : ''
                }`}
                style={{ backgroundColor: color }}
                aria-label={palette.name}
              />
            );
          })}
        </div>

        <button
          type="button"
          className="uxu-spotlight-trigger"
          onClick={onOpenCommandPalette}
        >
          <Search size={13} />
          <span className="uxu-hide-mobile">Ara...</span>
          <kbd className="uxu-spotlight-trigger__kbd">⌘K</kbd>
        </button>

        <Tooltip content="Tema & Font Stüdyosu">
          <Button
            variant="glass"
            size="sm"
            leadingIcon={<Palette size={14} />}
            onClick={onOpenThemeStudio}
          >
            <span className="uxu-hide-mobile">Tema</span>
          </Button>
        </Tooltip>

        <Tooltip content="Bildirim Testi">
          <Button
            variant="tonal"
            size="sm"
            iconOnly
            pill
            aria-label="Bildirimler"
            onClick={() =>
              notify({
                title: 'Sistem Bildirimi',
                description: 'Tema ve bileşenler senkronize.',
                tone: 'primary',
              })
            }
          >
            <Bell size={14} />
          </Button>
        </Tooltip>

        <Tooltip
          content={resolvedMode === 'dark' ? 'Aydınlık Mod' : 'Karanlık Mod'}
        >
          <Button
            variant="filled"
            size="sm"
            iconOnly
            pill
            onClick={toggleMode}
            aria-label="Dark / Light Modu"
          >
            {resolvedMode === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </Button>
        </Tooltip>
      </div>
    </header>
  );
};
