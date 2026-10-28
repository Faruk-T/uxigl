import React, { useState, useRef, useEffect } from 'react';
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
  CheckCheck,
  Plus,
} from 'lucide-react';
import type { BreadcrumbItem } from '../../../core/contracts/NavigationContract';
import { RouteService } from '../../../core/services/RouteService';
import { useTheme } from '../../../providers/ThemeProvider';
import { useToast } from '../../../providers/ToastProvider';
import { Button, Badge, Tooltip } from '../../primitives';
import { GithubIcon } from '../../brand/GithubIcon';

interface HeaderNotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  category: 'sistem' | 'finans';
  unread: boolean;
}

const INITIAL_NOTIFICATIONS: HeaderNotificationItem[] = [
  {
    id: 'n-1',
    title: 'SheetGL v1.0.21 Tema Senkronu',
    description: 'Tüm aktif grid hücreleri yeni Material You paletine bağlandı.',
    time: '2 dk önce',
    category: 'sistem',
    unread: true,
  },
  {
    id: 'n-2',
    title: 'e-Fatura #GIB-2026-8841 Onaylandı',
    description: 'Anadolu Bulut A.Ş. için ₺148.500,00 tahsilat kaydı işlendi.',
    time: '14 dk önce',
    category: 'finans',
    unread: true,
  },
  {
    id: 'n-3',
    title: 'FileManGL S3 Yedekleme Tamamlandı',
    description: '42 kurumsal dizin ve 1.280 belge başarıyla arşivlendi.',
    time: '1 saat önce',
    category: 'sistem',
    unread: false,
  },
];

/**
 * ============================================================================
 * uxiGL COMPOSITE — FULL-WIDTH DASHBOARD TOP HEADER BAR
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
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState<'all' | 'sistem' | 'finans'>('all');
  const [notifications, setNotifications] = useState<HeaderNotificationItem[]>(
    INITIAL_NOTIFICATIONS
  );
  const notifWrapperRef = useRef<HTMLDivElement | null>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;
  const filteredNotifications = notifications.filter((n) =>
    notifFilter === 'all' ? true : n.category === notifFilter
  );

  useEffect(() => {
    if (!notifOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (
        notifWrapperRef.current &&
        !notifWrapperRef.current.contains(e.target as Node)
      ) {
        setNotifOpen(false);
      }
    };
    window.addEventListener('mousedown', handleOutside);
    return () => window.removeEventListener('mousedown', handleOutside);
  }, [notifOpen]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const pushDemoNotification = () => {
    const newItem: HeaderNotificationItem = {
      id: `n-${Date.now()}`,
      title: 'Yeni Kurumsal İşlem Kaydı',
      description: 'B2B onay akışı #TR-9042 otomatik olarak tamamlandı.',
      time: 'Şimdi',
      category: 'finans',
      unread: true,
    };
    setNotifications((prev) => [newItem, ...prev]);
    notify({
      title: newItem.title,
      description: newItem.description,
      tone: 'primary',
      placement: 'top-right',
    });
  };

  const handleToggleWebgl = () => {
    const next = !preferences.webglEnabled;
    setWebglEnabled(next);
    notify({
      title: next ? 'WebGL Açık' : 'Eko Mod Aktif',
      description: next
        ? 'Hafif ambiyans arka planı açıldı.'
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

        {/* GitHub Repository Link */}
        <Tooltip content="GitHub: umitunc/uxigl">
          <a
            href="https://github.com/umitunc/uxigl"
            target="_blank"
            rel="noopener noreferrer"
            className="uxu-btn uxu-btn--glass uxu-btn--sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              textDecoration: 'none',
              height: 32,
              padding: '0 10px',
              borderRadius: 'var(--uxu-radius-sm, 8px)',
              color: 'var(--uxu-text-primary)',
            }}
            aria-label="GitHub Deposu"
          >
            <GithubIcon size={15} />
            <span className="uxu-hide-mobile" style={{ fontSize: '0.8rem', fontWeight: 600 }}>GitHub</span>
          </a>
        </Tooltip>

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

        <div className="uxu-notif-anchor" ref={notifWrapperRef}>
          <Tooltip content="Canlı Bildirim Merkezi">
            <button
              type="button"
              className="uxu-btn uxu-btn--tonal uxu-btn--sm uxu-btn--icon-only uxu-btn--pill uxu-notif-trigger"
              aria-label="Bildirim Merkezi"
              aria-expanded={notifOpen}
              onClick={() => setNotifOpen((prev) => !prev)}
            >
              <Bell size={14} />
              {unreadCount > 0 && (
                <span className="uxu-notif-trigger__badge">{unreadCount}</span>
              )}
            </button>
          </Tooltip>

          {notifOpen && (
            <div
              className="uxu-notif-popover"
              role="dialog"
              aria-label="Canlı Bildirim Merkezi"
            >
              <div className="uxu-notif-popover__header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <strong>Bildirim Merkezi</strong>
                  {unreadCount > 0 && (
                    <Badge tone="primary" size="xs">
                      {unreadCount} Yeni
                    </Badge>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <button
                    type="button"
                    className="uxu-notif-popover__action"
                    onClick={markAllRead}
                    title="Tümünü okundu işaretle"
                  >
                    <CheckCheck size={13} />
                    <span>Okundu</span>
                  </button>
                  <button
                    type="button"
                    className="uxu-notif-popover__action"
                    onClick={pushDemoNotification}
                    title="Canlı test bildirimi ekle"
                  >
                    <Plus size={13} />
                    <span>Test</span>
                  </button>
                </div>
              </div>

              <div className="uxu-notif-popover__tabs">
                {(
                  [
                    { id: 'all', label: 'Tümü' },
                    { id: 'sistem', label: 'Sistem' },
                    { id: 'finans', label: 'Finans' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`uxu-notif-popover__tab ${
                      notifFilter === tab.id ? 'uxu-notif-popover__tab--active' : ''
                    }`}
                    onClick={() => setNotifFilter(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="uxu-notif-popover__list">
                {filteredNotifications.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`uxu-notif-item ${
                      item.unread ? 'uxu-notif-item--unread' : ''
                    }`}
                    onClick={() =>
                      setNotifications((prev) =>
                        prev.map((n) =>
                          n.id === item.id ? { ...n, unread: false } : n
                        )
                      )
                    }
                  >
                    <div className="uxu-notif-item__top">
                      <strong>{item.title}</strong>
                      <small>{item.time}</small>
                    </div>
                    <p>{item.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

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
