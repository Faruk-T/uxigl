import React from 'react';
import {
  Calendar,
  ExternalLink,
  Menu,
  Search,
  UserPlus,
} from 'lucide-react';
import { TESSERA_SPACING } from './theme';
import type { TesseraThemeTokens } from './types';

export interface TesseraTopBarProps {
  sectionTitle: string;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onSearchShortcutClick?: () => void;
  onExport: () => void;
  onShare: () => void;
  onInvite: () => void;
  onNavigateHome?: () => void;
  onToggleMobileMenu?: () => void;
  tokens: TesseraThemeTokens;
}

export const TesseraTopBar: React.FC<TesseraTopBarProps> = ({
  sectionTitle,
  searchQuery,
  onSearchChange,
  onSearchShortcutClick,
  onExport,
  onShare,
  onInvite,
  onNavigateHome,
  onToggleMobileMenu,
  tokens,
}) => {
  const secondaryBtnStyle: React.CSSProperties = {
    height: 30,
    padding: '0 11px',
    borderRadius: 7,
    border: `1px solid ${tokens.borderControl}`,
    backgroundColor: tokens.cardBg,
    color: tokens.textPrimary,
    fontSize: 12.5,
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  };

  return (
    <header
      style={{
        height: TESSERA_SPACING.topBarHeight,
        flexShrink: 0,
        padding: `0 ${TESSERA_SPACING.topBarPaddingX}px`,
        borderBottom: `1px solid ${tokens.borderSubtle}`,
        backgroundColor: tokens.panelBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 14,
      }}
    >
      {/* Left: Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        {onToggleMobileMenu && (
          <button
            type="button"
            aria-label="Open navigation menu"
            className="tessera-mobile-menu-btn"
            onClick={onToggleMobileMenu}
            style={{
              width: 30,
              height: 30,
              borderRadius: 7,
              border: `1px solid ${tokens.borderControl}`,
              backgroundColor: tokens.cardBg,
              color: tokens.textPrimary,
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Menu size={15} />
          </button>
        )}

        <nav
          aria-label="Breadcrumb"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13.5,
            whiteSpace: 'nowrap',
          }}
        >
          <button
            type="button"
            onClick={onNavigateHome}
            title={onNavigateHome ? 'Back to uxiGL Home' : 'Tessera'}
            style={{
              border: 'none',
              background: 'transparent',
              padding: 0,
              color: tokens.textMuted,
              fontSize: 13.5,
              fontWeight: 500,
              cursor: onNavigateHome ? 'pointer' : 'default',
            }}
          >
            Tessera
          </button>
          <span style={{ color: tokens.textSubtle }}>/</span>
          <span
            style={{
              color: tokens.textPrimary,
              fontWeight: 600,
            }}
          >
            {sectionTitle}
          </span>
        </nav>
      </div>

      {/* Center: Global Search Input */}
      <div
        className="tessera-topbar-search-wrap"
        style={{
          flex: '0 1 368px',
          minWidth: 160,
          height: 32,
          borderRadius: 8,
          backgroundColor: tokens.surfaceSubtle,
          border: `1px solid ${tokens.borderSubtle}`,
          padding: '0 6px 0 11px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Search size={14} color={tokens.textSubtle} style={{ flexShrink: 0 }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks, docs, people"
          aria-label="Search tasks, docs, people"
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: tokens.textPrimary,
            fontSize: 12.5,
            fontFamily: 'inherit',
            width: '100%',
            minWidth: 0,
          }}
        />
        <button
          type="button"
          onClick={onSearchShortcutClick}
          title="Keyboard shortcut (⌘K)"
          style={{
            height: 20,
            padding: '0 6px',
            borderRadius: 5,
            border: `1px solid ${tokens.borderControl}`,
            backgroundColor: tokens.panelBg,
            color: tokens.textMuted,
            fontSize: 10.5,
            fontWeight: 500,
            flexShrink: 0,
            cursor: 'pointer',
          }}
        >
          ⌘K
        </button>
      </div>

      {/* Right: Export / Share / Invite */}
      <div
        className="tessera-topbar-actions"
        style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}
      >
        <button type="button" onClick={onExport} style={secondaryBtnStyle}>
          <Calendar size={13.5} strokeWidth={1.85} color={tokens.textMuted} />
          <span>Export</span>
        </button>

        <button type="button" onClick={onShare} style={secondaryBtnStyle}>
          <ExternalLink size={13.5} strokeWidth={1.85} color={tokens.textMuted} />
          <span>Share</span>
        </button>

        <button
          type="button"
          onClick={onInvite}
          style={{
            height: 30,
            padding: '0 12px',
            borderRadius: 7,
            border: 'none',
            backgroundColor: tokens.ctaDarkBg,
            color: tokens.ctaDarkText,
            fontSize: 12.5,
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          <UserPlus size={13.5} strokeWidth={1.9} />
          <span>Invite</span>
        </button>
      </div>
    </header>
  );
};

