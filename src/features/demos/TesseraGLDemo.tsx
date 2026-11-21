import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Bookmark,
  Clock,
  FileText,
  History,
  Pencil,
  Users,
} from 'lucide-react';
import { useTheme } from '../../providers/ThemeProvider';
import { useToast } from '../../providers/ToastProvider';
import {
  INITIAL_CYCLE_CAPACITY,
  INITIAL_OVERVIEW_METRICS,
  INITIAL_RECENT_ACTIVITY,
  INITIAL_TEAM_PERFORMANCE_BY_PROJECT,
  INITIAL_UPCOMING_EVENTS,
  INITIAL_USER_PROFILE,
  INITIAL_WORKLOAD_BUCKETS,
  INITIAL_WORK_ITEMS,
} from './tessera/data';
import {
  resolveTesseraThemeTokens,
  TESSERA_SPACING,
  TESSERA_TYPOGRAPHY,
} from './tessera/theme';
import type {
  TesseraActivityEntry,
  TesseraActivityFilterId,
  TesseraOverviewMetric,
  TesseraRailNavId,
  TesseraSidebarNavId,
  TesseraSummaryTabId,
  TesseraTimeRangeId,
  TesseraUpcomingEvent,
  TesseraUserProfile,
  TesseraWorkItem,
  TesseraWorkloadBucket,
} from './tessera/types';
import { TesseraIconRail } from './tessera/TesseraIconRail';
import { TesseraProjectsSidebar } from './tessera/TesseraProjectsSidebar';
import { TesseraTopBar } from './tessera/TesseraTopBar';
import { TesseraOverviewGrid } from './tessera/TesseraOverviewGrid';
import { TesseraWorkloadStrip } from './tessera/TesseraWorkloadStrip';
import { TesseraAnalyticsCharts } from './tessera/TesseraAnalyticsCharts';
import { TesseraActivityFeed } from './tessera/TesseraActivityFeed';
import { TesseraProfilePanel } from './tessera/TesseraProfilePanel';
import { TesseraPortraitAvatar } from './tessera/TesseraIcons';
import {
  TesseraNewWorkItemModal,
  TesseraRecapModal,
  TesseraWorkItemList,
} from './tessera/TesseraInteractiveViews';

export interface TesseraGLDemoProps {
  /** Callback to navigate back to uxiGL landing page or other routes. */
  onNavigate?: (sectionId: string, subItemId?: string) => void;
  /** Callback to open the global uxiGL Theme Studio drawer. */
  onOpenThemeStudio?: () => void;
  /** Surface theme mode default ('light' preserves 1:1 visual parity on first load). */
  defaultSurfaceMode?: 'light' | 'dark' | 'inherit';
  /** Optional injected profile data (DIP). */
  initialProfile?: TesseraUserProfile;
  /** Optional injected work items list (DIP). */
  initialWorkItems?: TesseraWorkItem[];
  /** Optional injected upcoming schedule events (DIP). */
  initialEvents?: TesseraUpcomingEvent[];
}

const SummaryClusterIcon: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="4.5" r="1.9" />
    <circle cx="5" cy="11.5" r="1.9" />
    <circle cx="11.5" cy="8" r="1.9" />
  </svg>
);

const SUMMARY_TABS: {
  id: TesseraSummaryTabId;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}[] = [
  { id: 'summary', label: 'Summary', icon: SummaryClusterIcon },
  { id: 'assigned', label: 'Assigned', icon: FileText },
  { id: 'created', label: 'Created', icon: Pencil },
  { id: 'subscribed', label: 'Subscribed', icon: Bookmark },
  { id: 'activity', label: 'Activity', icon: History },
];

const SIDEBAR_VIEW_TITLES: Record<TesseraSidebarNavId, string> = {
  home: 'Home',
  drafts: 'Drafts',
  'your-work': 'Your work',
  stickies: 'Stickies',
  'ws-projects': 'Workspace projects',
  'ws-more': 'More tools',
  'core-overview': 'Tessera Core · Overview',
  'core-work-items': 'Tessera Core · Work items',
  'core-cycles': 'Tessera Core · Cycles',
  'core-modules': 'Tessera Core · Modules',
  'core-views': 'Tessera Core · Views',
  'core-pages': 'Tessera Core · Pages',
  'core-intake': 'Tessera Core · Intake',
};

const NEXT_STATUS_MAP: Record<TesseraWorkItem['status'], TesseraWorkItem['status']> = {
  Backlog: 'Not started',
  'Not started': 'Working on',
  'Working on': 'Completed',
  Completed: 'Backlog',
};

export const TesseraGLDemo: React.FC<TesseraGLDemoProps> = ({
  onNavigate,
  onOpenThemeStudio,
  defaultSurfaceMode = 'light',
  initialProfile = INITIAL_USER_PROFILE,
  initialWorkItems = INITIAL_WORK_ITEMS,
  initialEvents = INITIAL_UPCOMING_EVENTS,
}) => {
  const { resolvedMode, setMode } = useTheme();
  const { notify } = useToast();

  // Surface mode defaults to crisp 'light' for 1:1 visual fidelity while reacting to user toggles.
  const [surfaceMode, setSurfaceMode] = useState<'light' | 'dark'>(() =>
    defaultSurfaceMode === 'inherit' ? resolvedMode : defaultSurfaceMode
  );
  const prevGlobalModeRef = useRef(resolvedMode);
  useEffect(() => {
    if (prevGlobalModeRef.current !== resolvedMode) {
      prevGlobalModeRef.current = resolvedMode;
      setSurfaceMode(resolvedMode);
    }
  }, [resolvedMode]);

  const tokens = useMemo(
    () => resolveTesseraThemeTokens(surfaceMode),
    [surfaceMode]
  );

  // Navigation & filter state
  const [activeRail, setActiveRail] = useState<TesseraRailNavId>('projects');
  const [activeSidebarNav, setActiveSidebarNav] =
    useState<TesseraSidebarNavId>('your-work');
  const [activeTab, setActiveTab] = useState<TesseraSummaryTabId>('summary');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState<TesseraTimeRangeId>('7d');
  const [selectedBucketId, setSelectedBucketId] = useState<string | null>(null);
  const [selectedPerfProject, setSelectedPerfProject] =
    useState<string>('Tessera Core');
  const [activityFilter, setActivityFilter] =
    useState<TesseraActivityFilterId>('all');
  const [cycleFilter, setCycleFilter] = useState<'This cycle' | 'Last cycle'>(
    'This cycle'
  );

  // Mutable workspace items & activity
  const [workItems, setWorkItems] = useState<TesseraWorkItem[]>(initialWorkItems);
  const [activities, setActivities] = useState<TesseraActivityEntry[]>(
    INITIAL_RECENT_ACTIVITY
  );
  const [recapDismissed, setRecapDismissed] = useState(false);
  const [newWorkModalOpen, setNewWorkModalOpen] = useState(false);
  const [recapModalOpen, setRecapModalOpen] = useState(false);

  // Dynamic metrics scaled cleanly by selected timeRange & added items
  const overviewMetrics = useMemo<TesseraOverviewMetric[]>(() => {
    const addedDelta = Math.max(0, workItems.length - INITIAL_WORK_ITEMS.length);
    const rangeMultiplier = timeRange === '7d' ? 0 : timeRange === '14d' ? 6 : 14;
    return INITIAL_OVERVIEW_METRICS.map((m) => {
      if (m.id === 'created') {
        return {
          ...m,
          value: m.value + addedDelta + rangeMultiplier,
          deltaLabel: `+${3 + addedDelta}`,
        };
      }
      if (m.id === 'assigned') {
        return {
          ...m,
          value: m.value + Math.round(rangeMultiplier * 0.5),
        };
      }
      return {
        ...m,
        value: m.value + rangeMultiplier,
      };
    });
  }, [timeRange, workItems.length]);

  const capacityState = useMemo(() => {
    if (cycleFilter === 'This cycle') {
      return {
        totalHours: 240,
        sprintLabel: 'Sprint 14 · 6 days left',
        segments: INITIAL_CYCLE_CAPACITY,
      };
    }
    return {
      totalHours: 220,
      sprintLabel: 'Sprint 13 · Completed',
      segments: [
        { id: 'logged' as const, label: 'Logged', percent: 68, hours: 150, color: '#2563EB' },
        { id: 'planned' as const, label: 'Planned', percent: 22, hours: 48, color: '#F97316' },
        { id: 'free' as const, label: 'Free', percent: 10, hours: 22, color: '#D1D5DB', hatched: true },
      ],
    };
  }, [cycleFilter]);

  const filteredActivities = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return activities.filter((entry) => {
      const matchesFilter =
        activityFilter === 'all' ||
        (activityFilter === 'mentions' && entry.category === 'mention') ||
        (activityFilter === 'comments' && entry.category === 'comment');

      const matchesSearch =
        !q ||
        entry.actorName.toLowerCase().includes(q) ||
        entry.targetPrimary.toLowerCase().includes(q) ||
        (entry.targetSecondary?.toLowerCase().includes(q) ?? false) ||
        entry.project.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [activities, activityFilter, searchQuery]);

  const filteredWorkItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return workItems.filter((item) => {
      const matchesTab =
        activeTab === 'assigned'
          ? item.bucket === 'assigned'
          : activeTab === 'created'
            ? item.bucket === 'created'
            : activeTab === 'subscribed'
              ? item.bucket === 'subscribed'
              : true;

      const matchesBucket =
        !selectedBucketId ||
        (selectedBucketId === 'backlog' && item.status === 'Backlog') ||
        (selectedBucketId === 'not-started' && item.status === 'Not started') ||
        (selectedBucketId === 'working-on' && item.status === 'Working on') ||
        (selectedBucketId === 'completed' && item.status === 'Completed');

      const matchesSearch =
        !q ||
        item.code.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.project.toLowerCase().includes(q) ||
        item.assignee.toLowerCase().includes(q);

      return matchesTab && matchesBucket && matchesSearch;
    });
  }, [workItems, activeTab, selectedBucketId, searchQuery]);

  const handleToggleThemeMode = useCallback(() => {
    const next = surfaceMode === 'light' ? 'dark' : 'light';
    setSurfaceMode(next);
    setMode(next);
    notify({
      title: `Tessera ${next === 'dark' ? 'Dark' : 'Light'} Surface`,
      description: `Switched workspace appearance to ${next} mode.`,
      tone: 'info',
    });
  }, [surfaceMode, setMode, notify]);

  const handleCreateWorkItem = useCallback(
    (title: string, project: string, status: TesseraWorkItem['status']) => {
      const nextNum = 60 + workItems.length;
      const code = `TSR-${nextNum}`;
      const newItem: TesseraWorkItem = {
        id: `wi-${Date.now()}`,
        code,
        title,
        project,
        status,
        priority: 'Medium',
        assignee: initialProfile.name,
        assigneeAvatar: initialProfile.avatarPreset,
        dueDate: 'Today',
        bucket: 'created',
      };
      setWorkItems((prev) => [newItem, ...prev]);
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          actorAvatar: initialProfile.avatarPreset,
          actorName: 'You',
          verb: 'created',
          targetPrimary: code,
          targetSecondary: title,
          timestamp: 'Just now',
          project,
          badgeLabel: status === 'Completed' ? 'Done' : 'Assigned',
          badgeTone: status === 'Completed' ? 'done' : 'assigned',
          category: 'status',
        },
        ...prev,
      ]);
      notify({
        title: `${code} created`,
        description: `${title} added to ${project}.`,
        tone: 'success',
      });
    },
    [workItems.length, initialProfile, notify]
  );

  const handleCycleWorkItemStatus = useCallback(
    (id: string) => {
      setWorkItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: NEXT_STATUS_MAP[item.status] }
            : item
        )
      );
      notify({
        title: 'Status updated',
        description: 'Work item status advanced in Sprint 14.',
        tone: 'info',
      });
    },
    [notify]
  );

  const handleCycleTimeRange = useCallback(() => {
    setTimeRange((prev) =>
      prev === '7d' ? '14d' : prev === '14d' ? '30d' : '7d'
    );
  }, []);

  const handleBucketSelect = useCallback(
    (bucket: TesseraWorkloadBucket) => {
      setSelectedBucketId((prev) => (prev === bucket.id ? null : bucket.id));
      notify({
        title: `${bucket.label} (${bucket.count})`,
        description: `${bucket.dueDate} · Click Assigned tab to inspect items.`,
        tone: 'info',
      });
    },
    [notify]
  );

  const headerPageTitle = SIDEBAR_VIEW_TITLES[activeSidebarNav] ?? 'Your work';
  const showSummaryOverview =
    activeTab === 'summary' &&
    (activeSidebarNav === 'your-work' || activeSidebarNav === 'core-overview');

  return (
    <div
      className="tessera-gl-shell"
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        backgroundColor: tokens.panelBg,
        color: tokens.textPrimary,
        fontFamily: TESSERA_TYPOGRAPHY.fontFamily,
        fontFeatureSettings: TESSERA_TYPOGRAPHY.fontFeatureSettings,
        WebkitFontSmoothing: 'antialiased',
        overflowX: 'hidden',
      }}
    >
      <style>{`
        .tessera-gl-shell * {
          box-sizing: border-box;
        }
        .tessera-mobile-menu-btn {
          display: none;
        }
        .tessera-overview-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: ${TESSERA_SPACING.gridGap}px;
        }
        .tessera-workload-strip {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
        .tessera-workload-cell--divided {
          border-right: 1px solid ${tokens.borderSubtle};
        }
        .tessera-charts-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.94fr) minmax(0, 1.06fr);
          gap: ${TESSERA_SPACING.gridGap}px;
          align-items: stretch;
        }
        .tessera-workspace-columns {
          display: flex;
          flex: 1;
          min-height: 0;
          min-width: 0;
        }
        @media (max-width: 1200px) {
          .tessera-workspace-columns {
            flex-wrap: wrap;
          }
          .tessera-right-panel {
            width: 100% !important;
            border-left: none !important;
            border-top: 1px solid ${tokens.borderSubtle} !important;
          }
        }
        @media (max-width: 920px) {
          .tessera-mobile-menu-btn {
            display: inline-flex !important;
          }
          .tessera-projects-sidebar {
            display: none !important;
          }
          .tessera-projects-sidebar--mobile-open {
            display: flex !important;
            position: fixed;
            top: ${TESSERA_SPACING.topBarHeight}px;
            left: ${TESSERA_SPACING.railWidth}px;
            bottom: 0;
            z-index: 600;
            box-shadow: ${tokens.popoverShadow};
          }
          .tessera-overview-grid {
            grid-template-columns: 1fr;
          }
          .tessera-workload-strip {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .tessera-workload-cell--divided {
            border-right: none;
            border-bottom: 1px solid ${tokens.borderSubtle};
          }
          .tessera-charts-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 640px) {
          .tessera-icon-rail {
            display: none !important;
          }
          .tessera-topbar-search-wrap {
            display: none !important;
          }
          .tessera-workload-strip {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Column 1: Leftmost 56px Vertical Icon Rail */}
      <TesseraIconRail
        activeRail={activeRail}
        onSelectRail={(id) => {
          setActiveRail(id);
          if (id === 'projects') setSidebarOpen(true);
          if (id === 'ai') setRecapModalOpen(true);
        }}
        onToggleThemeMode={handleToggleThemeMode}
        onOpenThemeStudio={onOpenThemeStudio}
        onNavigateHome={onNavigate ? () => onNavigate('landing', 'home') : undefined}
        onOpenNotifications={() =>
          notify({
            title: 'Notifications',
            description: 'TSR-39 and TSR-41 updated in Tessera Core.',
            tone: 'info',
          })
        }
        onOpenHelp={() =>
          notify({
            title: 'Tessera Shortcuts',
            description: 'Press ⌘K to search tasks, docs, and people.',
            tone: 'info',
          })
        }
        tokens={tokens}
      />

      {/* Columns 2–4 Area: Top Chrome + Inner 3 Columns */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <TesseraTopBar
          sectionTitle="Dashboard"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchShortcutClick={() =>
            notify({
              title: 'Quick Search (⌘K)',
              description: 'Type in the top search bar to filter tasks and activity.',
              tone: 'info',
            })
          }
          onExport={() =>
            notify({
              title: 'Dashboard exported',
              description: 'Sprint 14 report downloaded as CSV & JSON.',
              tone: 'success',
            })
          }
          onShare={() =>
            notify({
              title: 'Share link copied',
              description: 'Tessera / Dashboard read-only link copied.',
              tone: 'info',
            })
          }
          onInvite={() =>
            notify({
              title: 'Invite teammates',
              description: 'Workspace invitation modal ready for Tessera Core.',
              tone: 'primary',
            })
          }
          onNavigateHome={onNavigate ? () => onNavigate('landing', 'home') : undefined}
          onToggleMobileMenu={() => setMobileMenuOpen((v) => !v)}
          tokens={tokens}
        />

        <div className="tessera-workspace-columns">
          {/* Column 2: 224px Projects Navigation Sidebar */}
          {(sidebarOpen || mobileMenuOpen) && (
            <div
              className={
                mobileMenuOpen ? 'tessera-projects-sidebar--mobile-open' : undefined
              }
              style={{ display: 'flex' }}
            >
              <TesseraProjectsSidebar
                activeNav={activeSidebarNav}
                onSelectNav={(id) => {
                  setActiveSidebarNav(id);
                  setMobileMenuOpen(false);
                  if (id === 'your-work' || id === 'core-overview') {
                    setActiveTab('summary');
                  } else if (id === 'core-work-items') {
                    setActiveTab('assigned');
                  }
                }}
                onNewWorkItem={() => setNewWorkModalOpen(true)}
                onCollapseSidebar={() => {
                  setSidebarOpen((v) => !v);
                  setMobileMenuOpen(false);
                }}
                onIntegrationAction={(name) =>
                  notify({
                    title: `${name} integration`,
                    description: `${name} connector ready to link with Tessera Core.`,
                    tone: 'info',
                  })
                }
                onUpgradeClick={() =>
                  notify({
                    title: 'Tessera Pro Plan',
                    description: '7 days remaining in your Free workspace trial.',
                    tone: 'primary',
                  })
                }
                workItemsCount={15 + Math.max(0, workItems.length - INITIAL_WORK_ITEMS.length)}
                yourWorkCount={12 + Math.max(0, workItems.length - INITIAL_WORK_ITEMS.length)}
                tokens={tokens}
              />
            </div>
          )}

          {/* Column 3: Main Center Workspace */}
          <main
            style={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: tokens.panelBg,
            }}
          >
            {/* Sub-header: Your work + Live presence cluster */}
            <div
              style={{
                height: TESSERA_SPACING.subHeaderHeight,
                padding: `0 ${TESSERA_SPACING.workspaceHeaderPaddingX}px`,
                borderBottom: `1px solid ${tokens.borderSubtle}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {!sidebarOpen && (
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                    style={{
                      border: `1px solid ${tokens.borderControl}`,
                      backgroundColor: tokens.cardBg,
                      color: tokens.textMuted,
                      borderRadius: 6,
                      padding: '2px 7px',
                      fontSize: 11,
                      cursor: 'pointer',
                    }}
                  >
                    Projects
                  </button>
                )}
                <Users size={15.5} strokeWidth={1.85} color={tokens.textMuted} />
                <h1
                  style={{
                    margin: 0,
                    fontSize: 14.5,
                    fontWeight: 600,
                    letterSpacing: '-0.015em',
                    color: tokens.textPrimary,
                  }}
                >
                  {headerPageTitle}
                </h1>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: 12,
                    color: tokens.textMuted,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Clock size={13} strokeWidth={1.85} color={tokens.textSubtle} />
                  <span>Updated just now</span>
                </span>

                {/* 3 Overlapping Collaborator Avatars */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {(['alex', 'sara', 'ben'] as const).map((preset, idx) => (
                    <div
                      key={preset}
                      style={{
                        marginLeft: idx === 0 ? 0 : -6,
                        position: 'relative',
                        zIndex: 3 - idx,
                      }}
                    >
                      <TesseraPortraitAvatar
                        preset={preset}
                        size={22}
                        border={`1.5px solid ${tokens.panelBg}`}
                      />
                    </div>
                  ))}
                </div>

                {/* Live Status Pill */}
                <span
                  style={{
                    height: 26,
                    padding: '0 10px',
                    borderRadius: 9999,
                    border: `1px solid ${tokens.borderControl}`,
                    backgroundColor: tokens.cardBg,
                    color: tokens.textPrimary,
                    fontSize: 12,
                    fontWeight: 500,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '9999px',
                      backgroundColor: '#EF4444',
                    }}
                  />
                  <span>Live</span>
                </span>
              </div>
            </div>

            {/* Sub-Tabs Bar: Summary | Assigned | Created | Subscribed | Activity */}
            <div
              role="tablist"
              aria-label="Your work views"
              style={{
                height: TESSERA_SPACING.tabBarHeight,
                padding: `0 ${TESSERA_SPACING.workspaceHeaderPaddingX}px`,
                borderBottom: `1px solid ${tokens.borderSubtle}`,
                display: 'flex',
                alignItems: 'stretch',
                gap: 22,
                overflowX: 'auto',
                flexShrink: 0,
              }}
            >
              {SUMMARY_TABS.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      position: 'relative',
                      border: 'none',
                      background: 'transparent',
                      padding: '0 2px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 7,
                      fontSize: 13,
                      fontWeight: active ? 600 : 500,
                      color: active ? tokens.textPrimary : tokens.textMuted,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Icon size={14} strokeWidth={active ? 2 : 1.75} />
                    <span>{tab.label}</span>
                    {active && (
                      <span
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          bottom: 0,
                          height: 2,
                          borderRadius: '2px 2px 0 0',
                          backgroundColor: tokens.textPrimary,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Main Scrollable Content Canvas */}
            <div
              style={{
                flex: 1,
                padding: TESSERA_SPACING.workspaceBodyPadding,
                display: 'flex',
                flexDirection: 'column',
                gap: TESSERA_SPACING.workspaceSectionGap,
                overflowY: 'auto',
              }}
            >
              {showSummaryOverview ? (
                <>
                  <TesseraOverviewGrid
                    metrics={overviewMetrics}
                    timeRange={timeRange}
                    onCycleTimeRange={handleCycleTimeRange}
                    onMetricClick={(m) => {
                      if (m.id === 'assigned') setActiveTab('assigned');
                      else if (m.id === 'created') setActiveTab('created');
                      else setActiveTab('subscribed');
                    }}
                    tokens={tokens}
                  />

                  <TesseraWorkloadStrip
                    buckets={INITIAL_WORKLOAD_BUCKETS}
                    openItemsCount={12}
                    selectedBucketId={selectedBucketId}
                    onSelectBucket={handleBucketSelect}
                    tokens={tokens}
                  />

                  <TesseraAnalyticsCharts
                    totalCapacityHours={capacityState.totalHours}
                    sprintLabel={capacityState.sprintLabel}
                    capacitySegments={capacityState.segments}
                    performanceByProject={INITIAL_TEAM_PERFORMANCE_BY_PROJECT}
                    selectedProject={selectedPerfProject}
                    onSelectProject={setSelectedPerfProject}
                    cycleFilterLabel={cycleFilter}
                    onToggleCycleFilter={() =>
                      setCycleFilter((prev) =>
                        prev === 'This cycle' ? 'Last cycle' : 'This cycle'
                      )
                    }
                    tokens={tokens}
                  />

                  <TesseraActivityFeed
                    entries={filteredActivities}
                    filter={activityFilter}
                    onFilterChange={setActivityFilter}
                    onViewAll={() => setActiveTab('activity')}
                    onRowAction={(entry) =>
                      notify({
                        title: entry.targetPrimary,
                        description: `${entry.actorName} ${entry.verb} ${entry.targetPrimary} (${entry.project})`,
                        tone: 'info',
                      })
                    }
                    tokens={tokens}
                  />
                </>
              ) : activeTab === 'activity' ? (
                <TesseraActivityFeed
                  entries={filteredActivities}
                  filter={activityFilter}
                  onFilterChange={setActivityFilter}
                  onViewAll={() => setActivityFilter('all')}
                  onRowAction={(entry) =>
                    notify({
                      title: entry.targetPrimary,
                      description: `${entry.timestamp} · ${entry.project}`,
                      tone: 'info',
                    })
                  }
                  tokens={tokens}
                />
              ) : (
                <TesseraWorkItemList
                  title={
                    activeTab === 'summary'
                      ? headerPageTitle
                      : `${SUMMARY_TABS.find((t) => t.id === activeTab)?.label ?? 'Work'} items`
                  }
                  items={filteredWorkItems}
                  onCycleStatus={handleCycleWorkItemStatus}
                  onCreateClick={() => setNewWorkModalOpen(true)}
                  tokens={tokens}
                />
              )}
            </div>
          </main>

          {/* Column 4: 320px Right Profile & Schedule Panel */}
          <TesseraProfilePanel
            profile={initialProfile}
            upcomingEvents={initialEvents}
            recapDismissed={recapDismissed}
            onEditProfile={() =>
              notify({
                title: 'Edit profile',
                description: `${initialProfile.name} (${initialProfile.handle}) profile settings opened.`,
                tone: 'info',
              })
            }
            onMessage={() =>
              notify({
                title: `Direct message to ${initialProfile.name}`,
                description: 'Opening Slack / Tessera thread...',
                tone: 'info',
              })
            }
            onAssign={() => setNewWorkModalOpen(true)}
            onShareProfile={() =>
              notify({
                title: 'Profile link copied',
                description: `${initialProfile.handle} profile URL copied to clipboard.`,
                tone: 'success',
              })
            }
            onGenerateRecap={() => setRecapModalOpen(true)}
            onDismissRecap={() => {
              setRecapDismissed(true);
              notify({
                title: 'Recap snoozed',
                description: 'We will remind you before tomorrow’s standup.',
                tone: 'info',
              });
            }}
            onEventClick={(ev) =>
              notify({
                title: ev.title,
                description: ev.schedule,
                tone: 'info',
              })
            }
            tokens={tokens}
          />
        </div>
      </div>

      {/* Interactive Modals */}
      <TesseraNewWorkItemModal
        open={newWorkModalOpen}
        onClose={() => setNewWorkModalOpen(false)}
        onCreate={handleCreateWorkItem}
        tokens={tokens}
      />

      <TesseraRecapModal
        open={recapModalOpen}
        onClose={() => setRecapModalOpen(false)}
        tokens={tokens}
      />
    </div>
  );
};

export default TesseraGLDemo;
