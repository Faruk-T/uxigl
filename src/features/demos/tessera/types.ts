import type { ResolvedThemeMode } from '../../../core/contracts/ThemeContract';

/**
 * ============================================================================
 * TESSERA GL TEMPLATE — DOMAIN & ARCHITECTURE CONTRACTS (SRP / ISP / DIP)
 * ============================================================================
 */

export type TesseraRailNavId =
  | 'projects'
  | 'ai'
  | 'workspace'
  | 'docs'
  | 'cycles'
  | 'inbox'
  | 'settings';

export type TesseraSidebarNavId =
  | 'home'
  | 'drafts'
  | 'your-work'
  | 'stickies'
  | 'ws-projects'
  | 'ws-more'
  | 'core-overview'
  | 'core-work-items'
  | 'core-cycles'
  | 'core-modules'
  | 'core-views'
  | 'core-pages'
  | 'core-intake';

export type TesseraSummaryTabId =
  | 'summary'
  | 'assigned'
  | 'created'
  | 'subscribed'
  | 'activity';

export type TesseraActivityFilterId = 'all' | 'mentions' | 'comments';

export type TesseraTimeRangeId = '7d' | '14d' | '30d';

export type TesseraOverviewTone = 'blue' | 'red' | 'purple';

export interface TesseraOverviewMetric {
  id: string;
  label: string;
  tooltip: string;
  value: number;
  deltaLabel: string;
  deltaSuffix: string;
  tone: TesseraOverviewTone;
  iconKind: 'document' | 'briefcase' | 'users';
}

export interface TesseraMiniMember {
  id: string;
  initials: string;
  bg: string;
  color: string;
}

export interface TesseraWorkloadBucket {
  id: 'backlog' | 'not-started' | 'working-on' | 'completed';
  count: number;
  label: string;
  dueDate: string;
  ringColor: string;
  ringSegments: number;
  ringFilled: number;
  dashedRing?: boolean;
  members: TesseraMiniMember[];
}

export interface TesseraCapacitySegment {
  id: 'logged' | 'planned' | 'free';
  label: string;
  percent: number;
  hours: number;
  color: string;
  hatched?: boolean;
}

export interface TesseraTeamMemberPerf {
  id: string;
  name: string;
  initial: string;
  avatarBg: string;
  avatarColor: string;
  percent: number;
  barColor: string;
  barTextColor: string;
  deltaBadge?: string;
}

export type TesseraActivityTone = 'assigned' | 'comment' | 'done' | 'at-risk';

export type TesseraAvatarPreset =
  | 'yasir'
  | 'alex'
  | 'jon-initial'
  | 'ben'
  | 'sara'
  | 'priya'
  | 'maya';

export interface TesseraActivityEntry {
  id: string;
  actorAvatar: TesseraAvatarPreset;
  actorName: string;
  verb: string;
  targetPrimary: string;
  targetSecondary?: string;
  trailingText?: string;
  timestamp: string;
  project: string;
  badgeLabel: string;
  badgeTone: TesseraActivityTone;
  category: 'mention' | 'comment' | 'status';
}

export interface TesseraWorkItem {
  id: string;
  code: string;
  title: string;
  project: string;
  status: 'Backlog' | 'Not started' | 'Working on' | 'Completed';
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  assignee: string;
  assigneeAvatar: TesseraAvatarPreset;
  dueDate: string;
  bucket: 'assigned' | 'created' | 'subscribed';
}

export interface TesseraUpcomingEvent {
  id: string;
  title: string;
  schedule: string;
  iconKind: 'clock' | 'calendar' | 'team';
  accentColor: string;
  accentBg: string;
}

export interface TesseraUserProfile {
  name: string;
  handle: string;
  status: 'Online' | 'Focusing' | 'Away';
  verified: boolean;
  joined: string;
  timezone: string;
  sprintName: string;
  sprintProgress: number;
  avatarPreset: TesseraAvatarPreset;
}

export interface TesseraThemeTokens {
  mode: ResolvedThemeMode;
  railBg: string;
  panelBg: string;
  sidebarBg: string;
  cardBg: string;
  surfaceSubtle: string;
  surfaceHover: string;
  surfaceActive: string;
  borderSubtle: string;
  borderCard: string;
  borderControl: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textSubtle: string;
  accentBlue: string;
  accentBlueSoft: string;
  ctaDarkBg: string;
  ctaDarkText: string;
  hatchStripe: string;
  dotPattern: string;
  bannerGradient: string;
  recapGradient: string;
  cardShadow: string;
  popoverShadow: string;
}

