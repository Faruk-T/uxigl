import React, { useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Bell,
  Bot,
  CheckCircle2,
  Cpu,
  FolderKanban,
  GitBranch,
  HelpCircle,
  Home,
  Layers,
  LayoutTemplate,
  LogIn,
  Moon,
  Palette,
  Play,
  Plug,
  Plus,
  Rocket,
  Search,
  Settings,
  Sun,
  Users,
  Workflow,
  XCircle,
  Info,
} from 'lucide-react';
import { useTheme } from '../../providers/ThemeProvider';
import { useToast } from '../../providers/ToastProvider';
import { Avatar, Badge, Button, Input, Switch } from '../../components/primitives';
import { Modal } from '../../components/composites';
import { DemoLoginView } from './DemoLoginView';

export interface SynthGLDemoProps {
  onNavigate: (sectionId: string, subItemId?: string) => void;
  onOpenThemeStudio?: () => void;
}

type SynthNavId =
  | 'dashboard'
  | 'workspaces'
  | 'library'
  | 'canvas'
  | 'templates'
  | 'analytics'
  | 'team'
  | 'integrations'
  | 'agents'
  | 'settings'
  | 'login';

interface WorkflowRow {
  id: string;
  name: string;
  trigger: string;
  status: 'Active' | 'Completed' | 'Paused';
  runs: string;
  updated: string;
}

const INITIAL_WORKFLOWS: WorkflowRow[] = [
  { id: 'wf-1', name: 'Email Support Router', trigger: 'IMAP Webhook', status: 'Active', runs: '12,480', updated: '2h ago' },
  { id: 'wf-2', name: 'Lead Scoring Pipeline', trigger: 'CRM Event', status: 'Active', runs: '8,140', updated: '3h ago' },
  { id: 'wf-3', name: 'Sales Dashboard Report', trigger: 'Cron • 09:00', status: 'Completed', runs: '4,160', updated: '4h ago' },
  { id: 'wf-4', name: 'Invoice OCR Extractor', trigger: 'S3 Upload', status: 'Active', runs: '1,920', updated: 'Yesterday' },
];

const AGENT_ROSTER = [
  { name: 'TriageBot v2', model: 'Gemini Flash', tasks: '1,420 / day', latency: '410 ms', status: 'Online' as const },
  { name: 'SQL Analyst', model: 'Gemini Pro', tasks: '380 / day', latency: '1.2 s', status: 'Online' as const },
  { name: 'DocSummarizer', model: 'Gemini Lite', tasks: '2,910 / day', latency: '290 ms', status: 'Online' as const },
  { name: 'ComplianceGuard', model: 'Gemini Pro', tasks: '145 / day', latency: '950 ms', status: 'Standby' as const },
];

const TEAM_MEMBERS = [
  { name: 'Daniel Kim', role: 'Workspace Owner', email: 'daniel@synthgl.ai', status: 'Active' as const },
  { name: 'Elena Rostova', role: 'ML Engineer', email: 'elena@synthgl.ai', status: 'Active' as const },
  { name: 'Marcus Vance', role: 'Solutions Architect', email: 'marcus@synthgl.ai', status: 'Active' as const },
  { name: 'Deniz Kaya', role: 'PromptOps Lead', email: 'deniz@synthgl.ai', status: 'Active' as const },
];

const INTEGRATIONS_LIST = [
  { name: 'HubSpot CRM', category: 'CRM & Sales', connected: true },
  { name: 'Slack Enterprise', category: 'Messaging', connected: true },
  { name: 'PostgreSQL / Neon', category: 'Database', connected: true },
  { name: 'GitHub Actions', category: 'CI/CD', connected: false },
];

const PRIMARY_NAV: {
  id: SynthNavId;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  badge?: string;
  badgeTone?: 'primary' | 'success';
}[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'workspaces', label: 'Workspaces', icon: FolderKanban },
  { id: 'library', label: 'Workflow Library', icon: Workflow, badge: '28', badgeTone: 'primary' },
  { id: 'canvas', label: 'Workflow Canvas', icon: GitBranch },
  { id: 'templates', label: 'Templates', icon: LayoutTemplate },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'team', label: 'Team Members', icon: Users, badge: '35', badgeTone: 'success' },
  { id: 'integrations', label: 'Integrations', icon: Plug },
];

const SECONDARY_NAV: {
  id: SynthNavId;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}[] = [
  { id: 'agents', label: 'Agent Management', icon: Bot },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'login', label: 'Login', icon: LogIn },
];

const PERFORMANCE_DATA: Record<
  'week' | 'month' | 'year',
  { day: string; completed: number; failed: number; pending: number }[]
> = {
  week: [
    { day: 'Mon', completed: 92, failed: 66, pending: 44 },
    { day: 'Tue', completed: 108, failed: 84, pending: 54 },
    { day: 'Wed', completed: 110, failed: 86, pending: 60 },
    { day: 'Thu', completed: 128, failed: 102, pending: 66 },
    { day: 'Fri', completed: 118, failed: 92, pending: 68 },
    { day: 'Sun', completed: 138, failed: 112, pending: 82 },
  ],
  month: [
    { day: 'W1', completed: 104, failed: 58, pending: 40 },
    { day: 'W2', completed: 120, failed: 72, pending: 52 },
    { day: 'W3', completed: 132, failed: 64, pending: 48 },
    { day: 'W4', completed: 145, failed: 78, pending: 56 },
  ],
  year: [
    { day: 'Q1', completed: 98, failed: 48, pending: 34 },
    { day: 'Q2', completed: 116, failed: 54, pending: 42 },
    { day: 'Q3', completed: 134, failed: 62, pending: 49 },
    { day: 'Q4', completed: 148, failed: 58, pending: 44 },
  ],
};

function SparklineMini({ color, points }: { color: string; points: string }) {
  const safeId = color.replace(/[^a-zA-Z0-9]/g, '');
  return (
    <svg width="100%" height="28" viewBox="0 0 180 28" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`synth-spark-${safeId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M0,24 ${points} L180,28 L0,28 Z`} fill={`url(#synth-spark-${safeId})`} />
      <polyline
        points={`0,24 ${points}`}
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const SynthGLDemo: React.FC<SynthGLDemoProps> = ({
  onNavigate,
  onOpenThemeStudio,
}) => {
  const {
    resolvedMode,
    toggleMode,
    availablePalettes,
    preferences,
    setSeedPalette,
  } = useTheme();
  const { notify } = useToast();
  const isDark = resolvedMode === 'dark';

  const [activeNav, setActiveNav] = useState<SynthNavId>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [perfRange, setPerfRange] = useState<'week' | 'month' | 'year'>('week');
  const [workflows, setWorkflows] = useState<WorkflowRow[]>(INITIAL_WORKFLOWS);
  const [createOpen, setCreateOpen] = useState(false);
  const [newWfName, setNewWfName] = useState('');
  const [newWfTrigger, setNewWfTrigger] = useState('Webhook Trigger');
  const [autoRetry, setAutoRetry] = useState(true);
  const [streamLogs, setStreamLogs] = useState(true);

  const palette = {
    shellBg: 'var(--uxu-bg-canvas)',
    sidebarBg: 'var(--uxu-bg-elevated)',
    cardBg: 'var(--uxu-surface-tonal)',
    cardElevated: 'var(--uxu-surface-tonal-high)',
    border: 'var(--uxu-border-subtle)',
    borderStrong: 'var(--uxu-primary)',
    text: 'var(--uxu-text-primary)',
    muted: 'var(--uxu-text-secondary)',
    subtle: 'var(--uxu-text-muted)',
    primary: 'var(--uxu-primary)',
    secondary: 'var(--uxu-secondary)',
    primaryContainer: 'var(--uxu-primary-container)',
    onPrimaryContainer: 'var(--uxu-on-primary-container)',
  };

  const filteredWorkflows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return workflows;
    return workflows.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.trigger.toLowerCase().includes(q)
    );
  }, [workflows, searchQuery]);

  const cardStyle: React.CSSProperties = {
    borderRadius: 18,
    backgroundColor: palette.cardBg,
    border: `1px solid ${palette.border}`,
    padding: 20,
    boxShadow: isDark
      ? '0 10px 30px rgba(0, 0, 0, 0.25)'
      : '0 8px 24px rgba(15, 23, 42, 0.04)',
  };

  const handleCreateWorkflow = () => {
    if (!newWfName.trim()) return;
    const created: WorkflowRow = {
      id: `wf-${Date.now()}`,
      name: newWfName.trim(),
      trigger: newWfTrigger.trim() || 'Webhook Trigger',
      status: 'Active',
      runs: '1',
      updated: 'Just now',
    };
    setWorkflows((prev) => [created, ...prev]);
    setCreateOpen(false);
    setNewWfName('');
    notify({
      title: 'Workflow deployed',
      description: `${created.name} is now active on SynthGL.`,
      tone: 'success',
    });
  };

  const bars = PERFORMANCE_DATA[perfRange];

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: palette.shellBg,
        color: palette.text,
        fontFamily: 'var(--uxu-font-sans, Inter, system-ui, sans-serif)',
      }}
    >
      <style>{`
        .synthgl-layout {
          display: grid;
          grid-template-columns: 244px minmax(0, 1fr);
          min-height: 100vh;
          width: 100%;
        }
        .synthgl-main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.7fr) minmax(290px, 0.85fr);
          gap: 20px;
          align-items: start;
        }
        .synthgl-kpi-row {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }
        @media (max-width: 1180px) {
          .synthgl-main-grid {
            grid-template-columns: 1fr;
          }
          .synthgl-kpi-row {
            grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
          }
        }
        @media (max-width: 860px) {
          .synthgl-layout {
            grid-template-columns: 1fr;
          }
          .synthgl-sidebar {
            display: none !important;
          }
        }
      `}</style>

      <div className="synthgl-layout">
        {/* ================================================================
            LEFT SIDEBAR
        ================================================================ */}
        <aside
          className="synthgl-sidebar"
          style={{
            backgroundColor: palette.sidebarBg,
            borderRight: `1px solid ${palette.border}`,
            padding: '18px 14px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px 6px' }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, var(--uxu-secondary) 0%, var(--uxu-primary) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 16,
                  boxShadow: '0 6px 18px var(--uxu-accent-glow)',
                }}
              >
                S
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em' }}>
                  SynthGL
                </div>
                <div style={{ fontSize: 11, color: palette.subtle }}>AI Orchestration</div>
              </div>
            </div>

            {/* Primary Nav */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {PRIMARY_NAV.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveNav(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 11,
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: isActive ? palette.primaryContainer : 'transparent',
                      color: isActive ? palette.onPrimaryContainer : palette.muted,
                      fontWeight: isActive ? 700 : 500,
                      fontSize: 13.5,
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </span>
                    {item.badge && (
                      <Badge size="sm" variant="tonal" tone={item.badgeTone}>
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </nav>

            <div style={{ borderTop: `1px solid ${palette.border}`, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {SECONDARY_NAV.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveNav(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 11,
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: isActive ? palette.primaryContainer : 'transparent',
                      color: isActive ? palette.onPrimaryContainer : palette.muted,
                      fontWeight: isActive ? 700 : 500,
                      fontSize: 13.5,
                      textAlign: 'left',
                    }}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() =>
                  notify({ title: 'SynthGL Docs', description: 'API & SDK guides available in uxiGL Docs.', tone: 'info' })
                }
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 11,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  color: palette.muted,
                  fontWeight: 500,
                  fontSize: 13.5,
                  textAlign: 'left',
                }}
              >
                <HelpCircle size={16} />
                <span>Help &amp; Support</span>
              </button>

              <button
                type="button"
                onClick={toggleMode}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 11,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  color: palette.muted,
                  fontWeight: 500,
                  fontSize: 13.5,
                  textAlign: 'left',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {isDark ? <Moon size={16} /> : <Sun size={16} />}
                  <span>Appearance</span>
                </span>
                <span style={{ fontSize: 11.5, color: palette.subtle }}>{isDark ? 'Dark' : 'Light'}</span>
              </button>
            </div>
          </div>

          {/* Bottom Plan Usage + Profile */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              style={{
                padding: 14,
                borderRadius: 16,
                backgroundColor: palette.cardElevated,
                border: `1px solid ${palette.border}`,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 4 }}>
                Workspace Pro Plan
              </div>
              <div style={{ fontSize: 12, color: palette.muted, marginBottom: 8 }}>
                68% monthly compute used
              </div>
              <div
                style={{
                  height: 7,
                  borderRadius: 999,
                  backgroundColor: palette.cardBg,
                  overflow: 'hidden',
                  marginBottom: 12,
                }}
              >
                <div style={{ width: '68%', height: '100%', borderRadius: 999, backgroundColor: palette.primary }} />
              </div>
              <Button
                variant="outlined"
                size="sm"
                onClick={() => notify({ title: 'Pro Plan', description: 'Enterprise quota scaling is ready.', tone: 'info' })}
                style={{ width: '100%', borderRadius: 10 }}
              >
                Upgrade Plan
              </Button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 6px' }}>
              <Avatar name="Daniel Kim" size="sm" tone="primary" />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700 }}>Daniel Kim</div>
                <div style={{ fontSize: 11.5, color: palette.subtle }}>daniel@synthgl.ai</div>
              </div>
            </div>
          </div>
        </aside>

        {/* ================================================================
            MAIN WORKSPACE
        ================================================================ */}
        <main
          style={{
            padding: '18px 28px 34px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            minWidth: 0,
          }}
        >
          {/* Top Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '1 1 300px', maxWidth: 460 }}>
              <button
                type="button"
                onClick={() => onNavigate('landing', 'home')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 12px',
                  borderRadius: 999,
                  border: `1px solid ${palette.border}`,
                  backgroundColor: palette.cardBg,
                  color: palette.text,
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <ArrowLeft size={13} />
                <span>uxiGL</span>
              </button>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flex: 1,
                  padding: '8px 14px',
                  borderRadius: 999,
                  border: `1px solid ${palette.border}`,
                  backgroundColor: palette.cardBg,
                }}
              >
                <Search size={15} color={palette.subtle} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search anything..."
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    color: palette.text,
                    fontSize: 13.5,
                    width: '100%',
                  }}
                />
                <span style={{ fontSize: 11.5, color: palette.subtle, flexShrink: 0 }}>⌘ K</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {/* Quick Seed Palette Dots */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 10px',
                  borderRadius: 999,
                  border: `1px solid ${palette.border}`,
                  backgroundColor: palette.cardBg,
                }}
                title="Hızlı Renk Paleti"
              >
                {availablePalettes.slice(0, 6).map((p) => {
                  const isActiveSeed = preferences.seedPalette === p.id;
                  const swatch = isDark ? p.dark.primary : p.light.primary;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSeedPalette(p.id)}
                      aria-label={p.name}
                      title={p.name}
                      style={{
                        width: 15,
                        height: 15,
                        borderRadius: '50%',
                        border: isActiveSeed
                          ? `2px solid ${palette.text}`
                          : '1px solid rgba(128,128,128,0.28)',
                        backgroundColor: swatch,
                        cursor: 'pointer',
                        padding: 0,
                        transform: isActiveSeed ? 'scale(1.18)' : 'scale(1)',
                        transition: 'transform 0.15s ease',
                      }}
                    />
                  );
                })}
              </div>

              {onOpenThemeStudio && (
                <button
                  type="button"
                  onClick={onOpenThemeStudio}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '7px 13px',
                    borderRadius: 10,
                    border: `1px solid ${palette.borderStrong}`,
                    backgroundColor: palette.primaryContainer,
                    color: palette.onPrimaryContainer,
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Palette size={14} />
                  <span>Tema Stüdyosu</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onNavigate('demo-cargo', 'cargogl')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 12px',
                  borderRadius: 10,
                  border: `1px solid ${palette.border}`,
                  backgroundColor: palette.cardBg,
                  color: palette.muted,
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Layers size={14} />
                <span>CargoGL</span>
              </button>

              <Button
                variant="filled"
                size="sm"
                leadingIcon={<Plus size={15} />}
                onClick={() => setCreateOpen(true)}
                style={{ borderRadius: 999 }}
              >
                Create Workflow
              </Button>
            </div>
          </div>

          {/* ==============================================================
              TAB 1: DASHBOARD
          ============================================================== */}
          {activeNav === 'dashboard' && (
            <>
              <div
                style={{
                  borderRadius: 20,
                  border: `1px solid ${palette.border}`,
                  padding: '26px 28px',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 14,
                  minHeight: 148,
                  backgroundColor: palette.cardBg,
                }}
              >
                <img
                  src="/demos/synthgl-hero.jpg"
                  alt="SynthGL AI Orchestration Core"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'right center',
                    filter: isDark ? 'brightness(0.74) contrast(1.08)' : 'none',
                    pointerEvents: 'none',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: isDark
                      ? 'linear-gradient(90deg, rgba(11, 15, 23, 0.94) 0%, rgba(11, 15, 23, 0.78) 46%, rgba(11, 15, 23, 0.16) 100%)'
                      : 'linear-gradient(90deg, rgba(248, 250, 252, 0.96) 0%, rgba(248, 250, 252, 0.84) 45%, rgba(248, 250, 252, 0.08) 100%)',
                    pointerEvents: 'none',
                  }}
                />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <Badge size="sm" variant="tonal" tone="primary" style={{ marginBottom: 10 }}>
                    SynthGL Neural Engine
                  </Badge>
                  <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}>
                    Welcome back, Daniel! 👋
                  </h1>
                  <p style={{ margin: '5px 0 0', fontSize: 14.5, color: palette.muted }}>
                    Here&apos;s what&apos;s happening with your AI workflows and agents today.
                  </p>
                </div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <Badge size="md" variant="tonal" tone="primary">
                    This month
                  </Badge>
                </div>
              </div>

              <div className="synthgl-main-grid">
                {/* LEFT COLUMN */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {/* 3 KPI Cards */}
                  <div className="synthgl-kpi-row">
                    {[
                      {
                        label: 'Total Workflows',
                        value: '24,780',
                        delta: '↗ +12.5%',
                        color: '#3B82F6',
                        points: '35,20 75,18 115,21 150,12 180,6',
                        icon: Activity,
                      },
                      {
                        label: 'Successful Runs',
                        value: '98.2%',
                        delta: '↗ +0.4%',
                        color: '#10B981',
                        points: '35,22 75,14 115,17 150,11 180,8',
                        icon: Play,
                      },
                      {
                        label: 'Active Agents',
                        value: '42+',
                        delta: '↗ +6.1%',
                        color: '#8B5CF6',
                        points: '35,23 75,19 115,15 150,14 180,7',
                        icon: Cpu,
                      },
                    ].map((kpi) => {
                      const Icon = kpi.icon;
                      return (
                        <div key={kpi.label} style={{ ...cardStyle, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: 10,
                                backgroundColor: `${kpi.color}20`,
                                color: kpi.color,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Icon size={16} />
                            </span>
                            <div>
                              <div style={{ fontSize: 12.5, color: palette.muted }}>{kpi.label}</div>
                              <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
                                <span style={{ fontSize: 22, fontWeight: 800 }}>{kpi.value}</span>
                                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#10B981' }}>{kpi.delta}</span>
                              </div>
                            </div>
                          </div>
                          <SparklineMini color={kpi.color} points={kpi.points} />
                        </div>
                      );
                    })}
                  </div>

                  {/* Grouped Bar Chart: Workflow Performance */}
                  <div style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 16 }}>
                          <BarChart3 size={17} color={palette.primary} />
                          <span>Workflow Performance</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8, fontSize: 12, color: palette.muted }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: palette.primary }} />
                            Completed
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#FDBA74' }} />
                            Failed
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#C4B5FD' }} />
                            Pending
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 6 }}>
                        {(['week', 'month', 'year'] as const).map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setPerfRange(r)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 999,
                              border: `1px solid ${perfRange === r ? palette.primary : palette.border}`,
                              backgroundColor: perfRange === r ? palette.primary : palette.cardElevated,
                              color: perfRange === r ? '#fff' : palette.muted,
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            {r === 'week' ? 'This Week' : r === 'month' ? 'This Month' : 'This Year'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${bars.length}, minmax(0, 1fr))`,
                        gap: 16,
                        alignItems: 'end',
                        height: 175,
                        paddingTop: 12,
                        borderBottom: `1px solid ${palette.border}`,
                      }}
                    >
                      {bars.map((b) => (
                        <div key={b.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 145 }}>
                            <div style={{ width: 13, height: b.completed, borderRadius: '6px 6px 0 0', backgroundColor: palette.primary }} />
                            <div style={{ width: 13, height: b.failed, borderRadius: '6px 6px 0 0', backgroundColor: '#FDBA74' }} />
                            <div style={{ width: 13, height: b.pending, borderRadius: '6px 6px 0 0', backgroundColor: '#C4B5FD' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${bars.length}, minmax(0, 1fr))`,
                        gap: 16,
                        paddingTop: 8,
                        textAlign: 'center',
                        fontSize: 12,
                        color: palette.subtle,
                      }}
                    >
                      {bars.map((b) => (
                        <span key={b.day}>{b.day}</span>
                      ))}
                    </div>
                  </div>

                  {/* Recent Workflows */}
                  <div style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Recent Workflows</h3>
                      <button
                        type="button"
                        onClick={() => setActiveNav('library')}
                        style={{ border: 'none', background: 'transparent', color: palette.primary, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
                      >
                        See all →
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {filteredWorkflows.slice(0, 4).map((wf) => (
                        <div
                          key={wf.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 10,
                            padding: '11px 14px',
                            borderRadius: 12,
                            backgroundColor: palette.cardElevated,
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{wf.name}</div>
                            <div style={{ fontSize: 12, color: palette.subtle }}>{wf.trigger} • {wf.runs} runs</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <Badge size="sm" variant="tonal" tone={wf.status === 'Active' ? 'success' : 'info'}>
                              • {wf.status}
                            </Badge>
                            <span style={{ fontSize: 12, color: palette.subtle }}>{wf.updated}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: NOTIFICATIONS + PRO BANNER */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 16 }}>
                        <Bell size={16} color={palette.primary} />
                        <span>Notifications</span>
                      </div>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: palette.primary }}>Live</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {[
                        { title: 'HubSpot Sync failed', sub: 'Auth token expired', time: '15m ago', tone: 'danger' as const, badge: 'Error', icon: XCircle, color: '#EF4444' },
                        { title: 'Lead Scoring Pipeline completed', sub: '284 new leads processed', time: '1h ago', tone: 'success' as const, badge: 'Success', icon: CheckCircle2, color: '#10B981' },
                        { title: 'New template: AI Chat Router', sub: 'Now available in the library', time: '2h ago', tone: 'info' as const, badge: 'Info', icon: Info, color: '#3B82F6' },
                        { title: 'Email Support Router', sub: 'Processed 47 tickets', time: '3h ago', tone: 'success' as const, badge: 'OK', icon: CheckCircle2, color: '#10B981' },
                      ].map((n) => {
                        const Icon = n.icon;
                        return (
                          <div key={n.title} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                            <div style={{ display: 'flex', gap: 10 }}>
                              <Icon size={17} color={n.color} style={{ marginTop: 2, flexShrink: 0 }} />
                              <div>
                                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{n.title}</div>
                                <div style={{ fontSize: 12, color: palette.muted }}>{n.sub}</div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                              <span style={{ fontSize: 11, color: palette.subtle }}>{n.time}</span>
                              <Badge size="sm" variant="tonal" tone={n.tone}>{n.badge}</Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Upgrade to Pro Gradient Banner */}
                  <div
                    style={{
                      borderRadius: 20,
                      padding: 22,
                      background: 'linear-gradient(135deg, var(--uxu-primary) 0%, var(--uxu-secondary) 100%)',
                      color: '#FFFFFF',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <Rocket
                      size={74}
                      style={{
                        position: 'absolute',
                        right: -8,
                        bottom: -8,
                        opacity: 0.22,
                      }}
                    />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ fontSize: 19, fontWeight: 800, marginBottom: 6 }}>
                        Upgrade to Pro
                      </div>
                      <p style={{ margin: '0 0 16px', fontSize: 13, opacity: 0.9, lineHeight: 1.5 }}>
                        Unlock unlimited parallel agent runs and custom webhook SLAs.
                      </p>
                      <button
                        type="button"
                        onClick={() => notify({ title: 'SynthGL Pro', description: 'Pro tier features unlocked in demo mode.', tone: 'success' })}
                        style={{
                          padding: '8px 16px',
                          borderRadius: 999,
                          border: 'none',
                          backgroundColor: '#FFFFFF',
                          color: '#0F172A',
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Upgrade Now →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ==============================================================
              INNER PAGES FOR ALL SIDEBAR TABS
          ============================================================== */}
          {activeNav === 'canvas' && (
            <div style={cardStyle}>
              <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800 }}>Visual Workflow Canvas</h2>
              <p style={{ margin: '0 0 22px', fontSize: 13.5, color: palette.muted }}>
                Node-based AI agent pipeline preview.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                {['1. Webhook Trigger', '2. Gemini Triage Agent', '3. HubSpot Enrichment', '4. Slack Alert'].map((node, i) => (
                  <React.Fragment key={node}>
                    <div
                      style={{
                        padding: '14px 18px',
                        borderRadius: 14,
                        backgroundColor: palette.cardElevated,
                        border: `1px solid ${i === 1 ? palette.borderStrong : palette.border}`,
                        fontWeight: 700,
                        fontSize: 13.5,
                      }}
                    >
                      {node}
                    </div>
                    {i < 3 && <span style={{ color: palette.primary, fontWeight: 800 }}>→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {(activeNav === 'library' || activeNav === 'workspaces' || activeNav === 'templates') && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              {filteredWorkflows.map((wf) => (
                <div key={wf.id} style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: 15.5 }}>{wf.name}</span>
                    <Badge size="sm" variant="tonal" tone={wf.status === 'Active' ? 'success' : 'info'}>
                      {wf.status}
                    </Badge>
                  </div>
                  <div style={{ fontSize: 13, color: palette.muted }}>{wf.trigger}</div>
                  <div style={{ fontSize: 12.5, color: palette.subtle }}>{wf.runs} executions • {wf.updated}</div>
                </div>
              ))}
            </div>
          )}

          {activeNav === 'agents' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
              {AGENT_ROSTER.map((a) => (
                <div key={a.name} style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: 16 }}>{a.name}</span>
                    <Badge size="sm" variant="tonal" tone={a.status === 'Online' ? 'success' : 'warning'}>{a.status}</Badge>
                  </div>
                  <div style={{ fontSize: 13, color: palette.muted }}>{a.model}</div>
                  <div style={{ fontSize: 12.5, color: palette.subtle }}>{a.tasks} • {a.latency}</div>
                </div>
              ))}
            </div>
          )}

          {activeNav === 'team' && (
            <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Team Members</h2>
              {TEAM_MEMBERS.map((m) => (
                <div key={m.email} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 12, backgroundColor: palette.cardElevated }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar name={m.name} size="sm" tone="primary" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{m.name}</div>
                      <div style={{ fontSize: 12, color: palette.muted }}>{m.role} • {m.email}</div>
                    </div>
                  </div>
                  <Badge size="sm" variant="tonal" tone="success">{m.status}</Badge>
                </div>
              ))}
            </div>
          )}

          {activeNav === 'integrations' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              {INTEGRATIONS_LIST.map((intg) => (
                <div key={intg.name} style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{intg.name}</div>
                    <div style={{ fontSize: 12.5, color: palette.muted }}>{intg.category}</div>
                  </div>
                  <Badge size="sm" variant="tonal" tone={intg.connected ? 'success' : 'warning'}>
                    {intg.connected ? 'Connected' : 'Setup'}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {(activeNav === 'analytics' || activeNav === 'settings') && (
            <div style={{ ...cardStyle, maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>
                {activeNav === 'analytics' ? 'Execution Telemetry' : 'Orchestrator Settings'}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 12, backgroundColor: palette.cardElevated }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Automatic Exponential Backoff</div>
                  <div style={{ fontSize: 12, color: palette.muted }}>Retry failed webhook nodes up to 3 times.</div>
                </div>
                <Switch value={autoRetry} onChange={setAutoRetry} size="sm" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 12, backgroundColor: palette.cardElevated }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Real-time Trace Streaming</div>
                  <div style={{ fontSize: 12, color: palette.muted }}>Stream token usage and agent steps to console.</div>
                </div>
                <Switch value={streamLogs} onChange={setStreamLogs} size="sm" />
              </div>
            </div>
          )}
          {activeNav === 'login' && (
            <DemoLoginView
              brandName="SynthGL"
              brandSubtitle="AI Workflow Orchestration"
              brandInitial="S"
              defaultEmail="daniel@synthgl.ai"
              onSuccess={() => setActiveNav('dashboard')}
            />
          )}
        </main>
      </div>

      {/* Create Workflow Modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create New Workflow"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button variant="outlined" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button variant="filled" onClick={handleCreateWorkflow}>Deploy Workflow</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Workflow Name" value={newWfName} onChange={setNewWfName} placeholder="e.g. Customer Churn Predictor" />
          <Input label="Trigger Source" value={newWfTrigger} onChange={setNewWfTrigger} />
        </div>
      </Modal>
    </div>
  );
};
