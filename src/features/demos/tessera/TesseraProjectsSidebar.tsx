import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Filter,
  Folder,
  Home,
  MoreHorizontal,
  PanelLeft,
  Pencil,
  Plus,
  Sparkles,
  User,
  Zap,
} from 'lucide-react';
import { TESSERA_SPACING, TESSERA_TYPOGRAPHY } from './theme';
import type { TesseraSidebarNavId, TesseraThemeTokens } from './types';
import {
  TesseraGitHubMark,
  TesseraProjectGlyph,
  TesseraSlackMark,
} from './TesseraIcons';

export interface TesseraProjectsSidebarProps {
  activeNav: TesseraSidebarNavId;
  onSelectNav: (id: TesseraSidebarNavId) => void;
  onNewWorkItem: () => void;
  onCollapseSidebar?: () => void;
  onIntegrationAction: (name: string) => void;
  onUpgradeClick: () => void;
  workItemsCount: number;
  yourWorkCount: number;
  tokens: TesseraThemeTokens;
}

const CORE_SUB_ITEMS: {
  id: TesseraSidebarNavId;
  label: string;
  glyph: 'overview' | 'work-items' | 'cycles' | 'modules' | 'views' | 'pages' | 'intake';
  countKey?: 'workItems';
}[] = [
  { id: 'core-overview', label: 'Overview', glyph: 'overview' },
  { id: 'core-work-items', label: 'Work items', glyph: 'work-items', countKey: 'workItems' },
  { id: 'core-cycles', label: 'Cycles', glyph: 'cycles' },
  { id: 'core-modules', label: 'Modules', glyph: 'modules' },
  { id: 'core-views', label: 'Views', glyph: 'views' },
  { id: 'core-pages', label: 'Pages', glyph: 'pages' },
  { id: 'core-intake', label: 'Intake', glyph: 'intake' },
];

export const TesseraProjectsSidebar: React.FC<TesseraProjectsSidebarProps> = ({
  activeNav,
  onSelectNav,
  onNewWorkItem,
  onCollapseSidebar,
  onIntegrationAction,
  onUpgradeClick,
  workItemsCount,
  yourWorkCount,
  tokens,
}) => {
  const [workspaceOpen, setWorkspaceOpen] = useState(true);
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [coreExpanded, setCoreExpanded] = useState(true);
  const [filterOnlyActive, setFilterOnlyActive] = useState(false);

  const navItemStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: TESSERA_SPACING.sidebarItemHeight,
    padding: TESSERA_SPACING.sidebarItemPadding,
    borderRadius: 8,
    border: 'none',
    backgroundColor: active ? tokens.surfaceActive : 'transparent',
    color: active ? tokens.textPrimary : tokens.textSecondary,
    fontSize: TESSERA_TYPOGRAPHY.scale.navItem.fontSize,
    fontWeight: active ? 600 : 500,
    letterSpacing: TESSERA_TYPOGRAPHY.scale.navItem.letterSpacing,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background-color 130ms ease, color 130ms ease',
  });

  const groupHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 6px',
    marginBottom: 6,
  };

  const groupTitleStyle: React.CSSProperties = {
    fontSize: TESSERA_TYPOGRAPHY.scale.microLabel.fontSize,
    fontWeight: TESSERA_TYPOGRAPHY.scale.microLabel.fontWeight,
    letterSpacing: TESSERA_TYPOGRAPHY.scale.microLabel.letterSpacing,
    color: tokens.textSubtle,
    textTransform: 'uppercase',
  };

  const chevronBtnStyle: React.CSSProperties = {
    width: 18,
    height: 18,
    borderRadius: 5,
    border: `1px solid ${tokens.borderSubtle}`,
    backgroundColor: tokens.cardBg,
    color: tokens.textMuted,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: 0,
  };

  const primaryItems: {
    id: TesseraSidebarNavId;
    label: string;
    icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
    count?: number;
    filledIcon?: boolean;
  }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'drafts', label: 'Drafts', icon: FileText, count: 3 },
    { id: 'your-work', label: 'Your work', icon: User, count: yourWorkCount, filledIcon: true },
    { id: 'stickies', label: 'Stickies', icon: Pencil, count: 3 },
  ];

  const visibleCoreItems = filterOnlyActive
    ? CORE_SUB_ITEMS.filter((i) => i.id === 'core-overview' || i.id === 'core-work-items')
    : CORE_SUB_ITEMS;

  return (
    <aside
      aria-label="Projects Navigation"
      className="tessera-projects-sidebar"
      style={{
        width: TESSERA_SPACING.sidebarWidth,
        flexShrink: 0,
        backgroundColor: tokens.sidebarBg,
        borderRight: `1px solid ${tokens.borderSubtle}`,
        padding: TESSERA_SPACING.sidebarPadding,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 16,
        overflowY: 'auto',
      }}
    >
      <div>
        {/* Projects Title + Utility Icons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '2px 4px 12px',
          }}
        >
          <span
            style={{
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: '-0.015em',
              color: tokens.textPrimary,
            }}
          >
            Projects
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button
              type="button"
              aria-label="Filter projects"
              title={filterOnlyActive ? 'Show all project items' : 'Filter active views'}
              onClick={() => setFilterOnlyActive((v) => !v)}
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                border: 'none',
                backgroundColor: filterOnlyActive ? tokens.accentBlueSoft : 'transparent',
                color: filterOnlyActive ? tokens.accentBlue : tokens.textMuted,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Filter size={14} strokeWidth={1.85} />
            </button>
            <button
              type="button"
              aria-label="Toggle projects sidebar"
              title="Toggle sidebar"
              onClick={onCollapseSidebar}
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                border: 'none',
                backgroundColor: 'transparent',
                color: tokens.textMuted,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <PanelLeft size={14.5} strokeWidth={1.85} />
            </button>
          </div>
        </div>

        {/* + New work item Button */}
        <button
          type="button"
          onClick={onNewWorkItem}
          style={{
            width: '100%',
            height: 34,
            borderRadius: 8,
            border: `1px solid ${tokens.borderControl}`,
            backgroundColor: tokens.cardBg,
            color: tokens.textPrimary,
            fontSize: 13,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            cursor: 'pointer',
            boxShadow: tokens.cardShadow,
            marginBottom: 12,
          }}
        >
          <Plus size={14.5} strokeWidth={2} />
          <span>New work item</span>
        </button>

        {/* Top Nav List */}
        <nav aria-label="Personal Views" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {primaryItems.map((item) => {
            const Icon = item.icon;
            const active = activeNav === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectNav(item.id)}
                style={navItemStyle(active)}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <Icon
                    size={15}
                    strokeWidth={active ? 2 : 1.75}
                    {...(item.filledIcon && active ? { fill: 'currentColor' } : {})}
                  />
                  <span>{item.label}</span>
                </span>
                {typeof item.count === 'number' && (
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: active ? 600 : 500,
                      color: active ? tokens.textPrimary : tokens.textSubtle,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* WORKSPACE Section */}
        <div style={{ marginTop: TESSERA_SPACING.sidebarSectionGap }}>
          <div style={groupHeaderStyle}>
            <span style={groupTitleStyle}>WORKSPACE</span>
            <button
              type="button"
              aria-label="Toggle workspace section"
              onClick={() => setWorkspaceOpen((v) => !v)}
              style={chevronBtnStyle}
            >
              {workspaceOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
            </button>
          </div>

          {workspaceOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <button
                type="button"
                onClick={() => onSelectNav('ws-projects')}
                style={navItemStyle(activeNav === 'ws-projects')}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <Folder size={15} strokeWidth={1.8} fill={tokens.textMuted} color={tokens.textMuted} />
                  <span>Projects</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => onSelectNav('ws-more')}
                style={navItemStyle(activeNav === 'ws-more')}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <MoreHorizontal size={15} strokeWidth={1.85} />
                  <span>More</span>
                </span>
              </button>
            </div>
          )}
        </div>

        {/* PROJECTS Section */}
        <div style={{ marginTop: TESSERA_SPACING.sidebarSectionGap }}>
          <div style={groupHeaderStyle}>
            <span style={groupTitleStyle}>PROJECTS</span>
            <button
              type="button"
              aria-label="Toggle projects tree"
              onClick={() => setProjectsOpen((v) => !v)}
              style={chevronBtnStyle}
            >
              {projectsOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
            </button>
          </div>

          {projectsOpen && (
            <div>
              <button
                type="button"
                onClick={() => setCoreExpanded((v) => !v)}
                style={{
                  ...navItemStyle(false),
                  color: tokens.textPrimary,
                  fontWeight: 600,
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {/* Pyramid / Delta Project Mark */}
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M8 2.2L14 12.8H2L8 2.2Z"
                      fill={tokens.textPrimary}
                    />
                    <circle cx="8" cy="9.6" r="1.5" fill={tokens.sidebarBg} />
                  </svg>
                  <span>Tessera Core</span>
                </span>
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 500,
                    color: tokens.textSubtle,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  3
                </span>
              </button>

              {coreExpanded && (
                <div
                  style={{
                    position: 'relative',
                    marginLeft: 16,
                    paddingLeft: 12,
                    borderLeft: `1px solid ${tokens.borderSubtle}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    marginTop: 2,
                  }}
                >
                  {visibleCoreItems.map((sub) => {
                    const active = activeNav === sub.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => onSelectNav(sub.id)}
                        style={{
                          ...navItemStyle(active),
                          height: 30,
                          padding: '4px 8px',
                          position: 'relative',
                        }}
                      >
                        <span
                          aria-hidden="true"
                          style={{
                            position: 'absolute',
                            left: -12,
                            top: '50%',
                            width: 8,
                            height: 1,
                            backgroundColor: tokens.borderSubtle,
                          }}
                        />
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <TesseraProjectGlyph kind={sub.glyph} size={14.5} />
                          <span>{sub.label}</span>
                        </span>
                        {sub.countKey === 'workItems' && (
                          <span
                            style={{
                              fontSize: 11.5,
                              fontWeight: 500,
                              color: tokens.textSubtle,
                              fontVariantNumeric: 'tabular-nums',
                            }}
                          >
                            {workItemsCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom TRY Links & Free Trial Card */}
      <div>
        <div style={{ padding: '0 6px', marginBottom: 6 }}>
          <span style={groupTitleStyle}>TRY</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <button
            type="button"
            onClick={() => onIntegrationAction('GitHub')}
            style={navItemStyle(false)}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <TesseraGitHubMark size={15} color={tokens.textPrimary} />
              <span>Connect GitHub</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => onIntegrationAction('Slack')}
            style={navItemStyle(false)}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <TesseraSlackMark size={15} />
              <span>Connect Slack</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => onIntegrationAction('Tessera AI')}
            style={navItemStyle(false)}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <Sparkles size={15} strokeWidth={1.85} color={tokens.textMuted} />
              <span>Try Tessera AI</span>
            </span>
          </button>
        </div>

        {/* Trial Progress Card */}
        <div
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 12,
            backgroundColor: tokens.surfaceSubtle,
            border: `1px solid ${tokens.borderSubtle}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 6,
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12.5,
                fontWeight: 500,
                color: tokens.textPrimary,
              }}
            >
              <Zap size={13} fill="#EF4444" color="#EF4444" />
              <span>Ends in 7 days</span>
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: tokens.textMuted,
                backgroundColor: tokens.cardBg,
                border: `1px solid ${tokens.borderControl}`,
                borderRadius: 6,
                padding: '1px 7px',
              }}
            >
              Free
            </span>
          </div>

          <div
            style={{
              margin: '10px 0 9px',
              height: 5,
              width: '100%',
              borderRadius: 9999,
              backgroundColor: tokens.borderCard,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '38%',
                height: '100%',
                borderRadius: 9999,
                backgroundColor: '#3B82F6',
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 11.5,
            }}
          >
            <span style={{ color: tokens.textSubtle }}>Local time</span>
            <button
              type="button"
              onClick={onUpgradeClick}
              style={{
                border: 'none',
                background: 'transparent',
                padding: 0,
                color: tokens.accentBlue,
                fontSize: 11.5,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

