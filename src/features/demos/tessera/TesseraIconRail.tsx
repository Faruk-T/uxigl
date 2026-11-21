import React from 'react';
import {
  Bell,
  BookOpen,
  Briefcase,
  Flame,
  Folder,
  HelpCircle,
  Mail,
  Rocket,
  Settings,
  Sparkles,
} from 'lucide-react';
import { TESSERA_SPACING } from './theme';
import type { TesseraRailNavId, TesseraThemeTokens } from './types';
import { TesseraLogoMark, TesseraPortraitAvatar } from './TesseraIcons';

export interface TesseraIconRailProps {
  activeRail: TesseraRailNavId;
  onSelectRail: (id: TesseraRailNavId) => void;
  onToggleThemeMode: () => void;
  onOpenThemeStudio?: () => void;
  onNavigateHome?: () => void;
  onOpenNotifications?: () => void;
  onOpenHelp?: () => void;
  tokens: TesseraThemeTokens;
}

const RAIL_ITEMS: {
  id: Exclude<TesseraRailNavId, 'projects'>;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}[] = [
  { id: 'ai', label: 'Tessera AI', icon: Sparkles },
  { id: 'workspace', label: 'Workspace', icon: Briefcase },
  { id: 'docs', label: 'Pages & Docs', icon: BookOpen },
  { id: 'cycles', label: 'Active Cycles', icon: Flame },
  { id: 'inbox', label: 'Inbox', icon: Mail },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const TesseraIconRail: React.FC<TesseraIconRailProps> = ({
  activeRail,
  onSelectRail,
  onToggleThemeMode,
  onOpenThemeStudio,
  onNavigateHome,
  onOpenNotifications,
  onOpenHelp,
  tokens,
}) => {
  const iconBtnBase: React.CSSProperties = {
    width: TESSERA_SPACING.railItemSize,
    height: TESSERA_SPACING.railItemSize,
    borderRadius: 9,
    border: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background-color 140ms ease, color 140ms ease, transform 120ms ease',
    padding: 0,
  };

  return (
    <aside
      aria-label="Workspace Primary Rail"
      className="tessera-icon-rail"
      style={{
        width: TESSERA_SPACING.railWidth,
        flexShrink: 0,
        backgroundColor: tokens.railBg,
        borderRight: `1px solid ${tokens.borderSubtle}`,
        padding: `${TESSERA_SPACING.railPaddingY}px 0`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        userSelect: 'none',
      }}
    >
      {/* Top Logo & Module Icons */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          width: '100%',
        }}
      >
        <button
          type="button"
          onClick={() => (onNavigateHome ? onNavigateHome() : onSelectRail('projects'))}
          title={onNavigateHome ? 'Tessera · Return to uxiGL Home' : 'Tessera Workspace'}
          style={{
            border: 'none',
            background: 'transparent',
            padding: 0,
            cursor: 'pointer',
            borderRadius: 10,
            marginBottom: 4,
          }}
        >
          <TesseraLogoMark size={34} />
        </button>

        {/* Active Projects Folder Square */}
        <button
          type="button"
          aria-label="Projects"
          title="Projects"
          onClick={() => onSelectRail('projects')}
          style={{
            ...iconBtnBase,
            backgroundColor:
              activeRail === 'projects' ? tokens.accentBlueSoft : 'transparent',
            color: activeRail === 'projects' ? tokens.accentBlue : tokens.textMuted,
          }}
        >
          <Folder
            size={17}
            strokeWidth={2}
            fill={activeRail === 'projects' ? tokens.accentBlue : 'none'}
          />
        </button>

        {/* User Avatar Shortcut */}
        <button
          type="button"
          aria-label="Yasir Ahmad Noori Profile"
          title="Yasir Ahmad Noori (@yasirnoori)"
          onClick={() => onSelectRail('projects')}
          style={{
            border: 'none',
            background: 'transparent',
            padding: 0,
            cursor: 'pointer',
            borderRadius: '9999px',
            marginTop: 2,
          }}
        >
          <TesseraPortraitAvatar preset="yasir" size={26} />
        </button>

        <div
          aria-hidden="true"
          style={{
            width: 20,
            height: 1,
            backgroundColor: tokens.borderSubtle,
            margin: '3px 0',
          }}
        />

        {/* Secondary Workspace Icons */}
        <nav
          aria-label="Module Shortcuts"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: TESSERA_SPACING.railGap,
          }}
        >
          {RAIL_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeRail === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-label={item.label}
                title={item.label}
                onClick={() => onSelectRail(item.id)}
                style={{
                  ...iconBtnBase,
                  backgroundColor: active ? tokens.surfaceActive : 'transparent',
                  color: active ? tokens.textPrimary : tokens.textMuted,
                }}
              >
                <Icon size={16.5} strokeWidth={1.85} />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Utility & Theme Orb Controls */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          width: '100%',
        }}
      >
        <button
          type="button"
          aria-label="Help & Shortcuts"
          title="Help & Shortcuts"
          onClick={onOpenHelp}
          style={{
            ...iconBtnBase,
            backgroundColor: 'transparent',
            color: tokens.textMuted,
          }}
        >
          <HelpCircle size={17} strokeWidth={1.85} />
        </button>

        <button
          type="button"
          aria-label="Notifications"
          title="Notifications (1 unread)"
          onClick={onOpenNotifications}
          style={{
            ...iconBtnBase,
            position: 'relative',
            backgroundColor: 'transparent',
            color: tokens.textMuted,
          }}
        >
          <Bell size={17} strokeWidth={1.85} />
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 7,
              right: 8,
              width: 6,
              height: 6,
              borderRadius: '9999px',
              backgroundColor: '#EF4444',
              border: `1.5px solid ${tokens.railBg}`,
            }}
          />
        </button>

        <button
          type="button"
          aria-label="Open Theme Studio"
          title="Open uxiGL Theme Studio"
          onClick={onOpenThemeStudio}
          style={{
            ...iconBtnBase,
            backgroundColor: 'transparent',
            color: tokens.textPrimary,
          }}
        >
          <Rocket size={17} strokeWidth={1.9} />
        </button>

        {/* Bottom Dark Concentric Target / Light-Dark Surface Toggle */}
        <button
          type="button"
          aria-label={`Switch to ${tokens.mode === 'light' ? 'Dark' : 'Light'} Mode`}
          title={`Toggle Light / Dark Surface (${tokens.mode === 'light' ? 'Light' : 'Dark'})`}
          onClick={onToggleThemeMode}
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            border: 'none',
            backgroundColor: tokens.ctaDarkBg,
            color: tokens.ctaDarkText,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            marginTop: 2,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.9" />
            <circle cx="10" cy="10" r="2.7" fill="currentColor" />
          </svg>
        </button>
      </div>
    </aside>
  );
};

