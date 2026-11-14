import React, { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Bell,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Download,
  FileCheck2,
  FileText,
  KeyRound,
  Layers,
  Lock,
  Moon,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  UploadCloud,
} from 'lucide-react';
import { Avatar, Badge, Button, Checkbox, Input, Switch } from '../../components/primitives';

export interface FlowPalette {
  shellBg: string;
  sidebarBg: string;
  listBg: string;
  mainBg: string;
  cardBg: string;
  cardElevated: string;
  border: string;
  borderStrong: string;
  text: string;
  muted: string;
  subtle: string;
  pillBg: string;
  activeNavBg: string;
  primary: string;
}

export interface FlowVendorSummary {
  id: string;
  name: string;
  domain: string;
  status: 'Active' | 'Pending' | 'Blocked';
  category: string;
  country: string;
  countryFlag: string;
  estimatedSpend: string;
  contractValue: string;
  ownerName: string;
  monogram: string;
  accentBg: string;
  accentText: string;
  progress: number;
}

interface FlowInnerPagesProps {
  activeNav: string;
  palette: FlowPalette;
  isDark: boolean;
  vendors: FlowVendorSummary[];
  onSelectVendor: (vendorId: string) => void;
  onSelectNav: (navId: string) => void;
  onToggleTheme: () => void;
  notify: (opts: {
    title: string;
    description?: string;
    tone?: 'info' | 'success' | 'warning' | 'danger';
  }) => void;
  unreadNotifications: number;
  onUpdateUnreadNotifications: (count: number) => void;
}

interface ReviewItem {
  id: string;
  vendorId: string;
  vendorName: string;
  category: string;
  score: number;
  risk: 'Low' | 'Medium' | 'High';
  reviewer: string;
  submittedAt: string;
  summary: string;
  status: 'Pending' | 'Approved' | 'Changes Requested';
}

interface TaskItem {
  id: string;
  title: string;
  vendor: string;
  priority: 'High' | 'Medium' | 'Low';
  due: string;
  assignee: string;
  done: boolean;
}

interface DocItem {
  id: string;
  title: string;
  vendor: string;
  category: 'Compliance' | 'Contracts' | 'Tax';
  updated: string;
  size: string;
  status: 'Verified' | 'Expiring Soon' | 'Pending';
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  tone: 'info' | 'success' | 'warning';
  unread: boolean;
  targetNav: string;
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    vendorId: 'lanternfish',
    vendorName: 'Lanternfish',
    category: 'SOC 2 Type II & Data Residency',
    score: 4.9,
    risk: 'Low',
    reviewer: 'Felix Brandt',
    submittedAt: '2 hours ago',
    summary: 'All encryption-at-rest and GDPR subprocessor disclosures verified.',
    status: 'Pending',
  },
  {
    id: 'rev-2',
    vendorId: 'pixelforge',
    vendorName: 'PixelForge',
    category: 'Annual Security Questionnaire',
    score: 4.3,
    risk: 'Medium',
    reviewer: 'Sarah Lin',
    submittedAt: 'Yesterday',
    summary: 'Awaiting updated penetration test executive summary for Q4.',
    status: 'Pending',
  },
  {
    id: 'rev-3',
    vendorId: 'bytewave',
    vendorName: 'ByteWave',
    category: 'DPA & Access Control Audit',
    score: 3.1,
    risk: 'High',
    reviewer: 'Marcus Vance',
    submittedAt: '3 days ago',
    summary: 'SSO enforcement missing on staging tenant; remediation requested.',
    status: 'Changes Requested',
  },
  {
    id: 'rev-4',
    vendorId: 'novatech',
    vendorName: 'NovaTech',
    category: 'ISO 27001 Renewal',
    score: 4.8,
    risk: 'Low',
    reviewer: 'Elena Rostova',
    submittedAt: 'Sep 24, 2026',
    summary: 'Certificate valid through Nov 2027 with zero major non-conformities.',
    status: 'Approved',
  },
];

const INITIAL_TASKS: TaskItem[] = [
  {
    id: 't-1',
    title: 'Verify SOC 2 Type II attestation for Lanternfish',
    vendor: 'Lanternfish',
    priority: 'High',
    due: 'Today',
    assignee: 'Daniel Kim',
    done: false,
  },
  {
    id: 't-2',
    title: 'Countersign Master Services Agreement (MSA)',
    vendor: 'PixelForge',
    priority: 'High',
    due: 'Tomorrow',
    assignee: 'Marcus Vance',
    done: false,
  },
  {
    id: 't-3',
    title: 'Confirm W-8BEN-E tax residency certificate',
    vendor: 'NovaTech',
    priority: 'Medium',
    due: 'Sep 30',
    assignee: 'Elena Rostova',
    done: true,
  },
  {
    id: 't-4',
    title: 'Review SSO & SAML 2.0 remediation evidence',
    vendor: 'ByteWave',
    priority: 'High',
    due: 'Oct 02',
    assignee: 'Daniel Kim',
    done: false,
  },
  {
    id: 't-5',
    title: 'Schedule Q4 quarterly business review (QBR)',
    vendor: 'DataMinds',
    priority: 'Low',
    due: 'Oct 08',
    assignee: 'Deniz Kaya',
    done: true,
  },
];

const INITIAL_DOCS: DocItem[] = [
  {
    id: 'd-1',
    title: 'SOC 2 Type II Report (2026)',
    vendor: 'Lanternfish',
    category: 'Compliance',
    updated: 'Sep 26, 2026',
    size: '4.2 MB',
    status: 'Verified',
  },
  {
    id: 'd-2',
    title: 'Master Services Agreement (MSA)',
    vendor: 'PixelForge',
    category: 'Contracts',
    updated: 'Sep 25, 2026',
    size: '1.8 MB',
    status: 'Pending',
  },
  {
    id: 'd-3',
    title: 'ISO/IEC 27001:2022 Certificate',
    vendor: 'NovaTech',
    category: 'Compliance',
    updated: 'Sep 20, 2026',
    size: '920 KB',
    status: 'Verified',
  },
  {
    id: 'd-4',
    title: 'W-8BEN-E Tax Withholding Form',
    vendor: 'CloudSync',
    category: 'Tax',
    updated: 'Aug 14, 2026',
    size: '640 KB',
    status: 'Expiring Soon',
  },
  {
    id: 'd-5',
    title: 'Data Processing Addendum (GDPR)',
    vendor: 'DataMinds',
    category: 'Contracts',
    updated: 'Sep 11, 2026',
    size: '1.1 MB',
    status: 'Verified',
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Lanternfish completed Business Details',
    description: 'Verification progress reached 66%. Ready for final document sign-off.',
    time: '14 min ago',
    tone: 'success',
    unread: true,
    targetNav: 'vendors',
  },
  {
    id: 'n-2',
    title: 'ByteWave flagged in Security Audit',
    description: 'SSO enforcement check failed on staging environment.',
    time: '1 hour ago',
    tone: 'warning',
    unread: true,
    targetNav: 'reviews',
  },
  {
    id: 'n-3',
    title: 'New MSA uploaded by PixelForge',
    description: 'Legal review requested before Oct 01 billing cycle.',
    time: '3 hours ago',
    tone: 'info',
    unread: true,
    targetNav: 'documents',
  },
  {
    id: 'n-4',
    title: 'NovaTech ISO 27001 renewal approved',
    description: 'Compliance status automatically extended for 12 months.',
    time: 'Yesterday',
    tone: 'success',
    unread: false,
    targetNav: 'reviews',
  },
];

export const FlowWorkspaceInnerPages: React.FC<FlowInnerPagesProps> = ({
  activeNav,
  palette,
  isDark,
  vendors,
  onSelectVendor,
  onSelectNav,
  onToggleTheme,
  notify,
  onUpdateUnreadNotifications,
}) => {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [taskFilter, setTaskFilter] = useState<'All' | 'Open' | 'Done'>('All');
  const [docFilter, setDocFilter] = useState<'All' | 'Compliance' | 'Contracts' | 'Tax'>('All');
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [notifFilter, setNotifFilter] = useState<'All' | 'Unread'>('All');

  // Settings state
  const [workspaceName, setWorkspaceName] = useState('FlowPro Enterprise');
  const [workspaceDomain, setWorkspaceDomain] = useState('flowpro.uxigl.io');
  const [autoApproveLowRisk, setAutoApproveLowRisk] = useState(true);
  const [enforceSso, setEnforceSso] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const cardStyle: React.CSSProperties = {
    borderRadius: 20,
    backgroundColor: palette.cardBg,
    border: `1px solid ${palette.border}`,
    padding: 22,
  };

  const filteredTasks = useMemo(() => {
    if (taskFilter === 'Open') return tasks.filter((t) => !t.done);
    if (taskFilter === 'Done') return tasks.filter((t) => t.done);
    return tasks;
  }, [tasks, taskFilter]);

  const filteredDocs = useMemo(() => {
    if (docFilter === 'All') return INITIAL_DOCS;
    return INITIAL_DOCS.filter((d) => d.category === docFilter);
  }, [docFilter]);

  const filteredNotifs = useMemo(() => {
    if (notifFilter === 'Unread') return notifications.filter((n) => n.unread);
    return notifications;
  }, [notifications, notifFilter]);

  const handleReviewDecision = (id: string, status: 'Approved' | 'Changes Requested') => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    notify({
      title: status === 'Approved' ? 'Review approved' : 'Changes requested',
      description: `Vendor compliance status updated.`,
      tone: status === 'Approved' ? 'success' : 'warning',
    });
  };

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    onUpdateUnreadNotifications(0);
    notify({ title: 'All caught up', description: 'All notifications marked as read.', tone: 'info' });
  };

  const markOneRead = (id: string) => {
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, unread: false } : n));
      onUpdateUnreadNotifications(next.filter((n) => n.unread).length);
      return next;
    });
  };

  // =========================================================================
  // 1. DASHBOARD
  // =========================================================================
  if (activeNav === 'dashboard') {
    const activeCount = vendors.filter((v) => v.status === 'Active').length;
    const pendingCount = vendors.filter((v) => v.status === 'Pending').length;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em' }}>
              Workspace Overview
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: 14.5, color: palette.muted }}>
              Real-time vendor onboarding velocity, compliance health, and spend snapshot.
            </p>
          </div>
          <Button variant="filled" size="sm" onClick={() => onSelectNav('vendors')}>
            Open Vendor Pipeline →
          </Button>
        </div>

        {/* KPI Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 16 }}>
          {[
            { label: 'Active Vendors', value: String(activeCount), delta: '+2 this month', tone: 'success' as const, icon: Building2 },
            { label: 'Pending Onboarding', value: String(pendingCount), delta: 'Avg 3.2 days', tone: 'warning' as const, icon: Clock },
            { label: 'Committed Annual Spend', value: '$454,000', delta: '+8.4% YoY', tone: 'info' as const, icon: TrendingUp },
            { label: 'Compliance Score', value: '94.2%', delta: 'SOC 2 & GDPR', tone: 'success' as const, icon: ShieldCheck },
          ].map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.label} style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: palette.muted }}>{kpi.label}</span>
                  <span
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      backgroundColor: palette.pillBg,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: palette.primary,
                    }}
                  >
                    <Icon size={17} />
                  </span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>
                  {kpi.value}
                </div>
                <Badge size="sm" variant="tonal" tone={kpi.tone}>
                  {kpi.delta}
                </Badge>
              </div>
            );
          })}
        </div>

        {/* Active Vendors & Recent Activity */}
        <div className="flow-demo-detail-grid">
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Active Onboarding Pipeline</h3>
              <button
                type="button"
                onClick={() => onSelectNav('vendors')}
                style={{ border: 'none', background: 'transparent', color: '#3B82F6', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Manage all →
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {vendors.slice(0, 4).map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => onSelectVendor(v.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: '12px 14px',
                    borderRadius: 14,
                    border: `1px solid ${palette.border}`,
                    backgroundColor: palette.cardElevated,
                    color: palette.text,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        backgroundColor: v.accentBg,
                        color: v.accentText,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                      }}
                    >
                      {v.monogram}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{v.name}</div>
                      <div style={{ fontSize: 12.5, color: palette.muted }}>
                        {v.category} • {v.estimatedSpend}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: palette.muted }}>{v.progress}%</span>
                    <ArrowUpRight size={15} color={palette.muted} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Priority Actions</h3>
              <Badge size="sm" variant="tonal" tone="primary">
                {tasks.filter((t) => !t.done).length} open
              </Badge>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {tasks.slice(0, 3).map((t) => (
                <div
                  key={t.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 14,
                    backgroundColor: palette.cardElevated,
                    border: `1px solid ${palette.border}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{t.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: palette.muted }}>
                    <span>{t.vendor} • Due {t.due}</span>
                    <Badge size="sm" variant="tonal" tone={t.priority === 'High' ? 'danger' : 'info'}>
                      {t.priority}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button variant="outlined" size="sm" onClick={() => onSelectNav('tasks')} style={{ marginTop: 4 }}>
                View All Tasks
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. REVIEWS
  // =========================================================================
  if (activeNav === 'reviews') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em' }}>
              Compliance &amp; Security Reviews
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: 14.5, color: palette.muted }}>
              Evaluate vendor SOC 2, ISO 27001, and GDPR posture before contract activation.
            </p>
          </div>
          <Badge size="md" variant="tonal" tone="info">
            {reviews.filter((r) => r.status === 'Pending').length} awaiting decision
          </Badge>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
          {reviews.map((rev) => (
            <div key={rev.id} style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700 }}>{rev.vendorName}</div>
                  <div style={{ fontSize: 13, color: palette.muted }}>{rev.category}</div>
                </div>
                <Badge
                  size="sm"
                  variant="tonal"
                  tone={
                    rev.status === 'Approved'
                      ? 'success'
                      : rev.status === 'Changes Requested'
                        ? 'danger'
                        : 'warning'
                  }
                >
                  {rev.status}
                </Badge>
              </div>

              <p style={{ margin: 0, fontSize: 13.5, color: palette.muted, lineHeight: 1.55 }}>
                {rev.summary}
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 12,
                  backgroundColor: palette.cardElevated,
                  fontSize: 12.5,
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontWeight: 700 }}>
                  <Star size={14} fill="#F59E0B" color="#F59E0B" />
                  {rev.score.toFixed(1)} / 5.0
                </span>
                <span style={{ color: palette.muted }}>Risk: {rev.risk}</span>
                <span style={{ color: palette.subtle }}>{rev.submittedAt}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 'auto' }}>
                <Button variant="outlined" size="sm" onClick={() => onSelectVendor(rev.vendorId)}>
                  Inspect Vendor
                </Button>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button
                    variant="outlined"
                    size="sm"
                    onClick={() => handleReviewDecision(rev.id, 'Changes Requested')}
                  >
                    Flag
                  </Button>
                  <Button
                    variant="filled"
                    size="sm"
                    leadingIcon={<Check size={14} />}
                    onClick={() => handleReviewDecision(rev.id, 'Approved')}
                  >
                    Approve
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. TASKS
  // =========================================================================
  if (activeNav === 'tasks') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em' }}>
              Onboarding Tasks
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: 14.5, color: palette.muted }}>
              Track legal sign-offs, security checks, and tax verifications across vendors.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['All', 'Open', 'Done'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setTaskFilter(tab)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 999,
                  border: `1px solid ${taskFilter === tab ? palette.primary : palette.border}`,
                  backgroundColor: taskFilter === tab ? palette.primary : palette.cardBg,
                  color: taskFilter === tab ? '#fff' : palette.text,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredTasks.map((t) => (
            <div
              key={t.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
                padding: '14px 16px',
                borderRadius: 14,
                backgroundColor: palette.cardElevated,
                border: `1px solid ${palette.border}`,
                opacity: t.done ? 0.7 : 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Checkbox value={t.done} onChange={() => toggleTask(t.id)} />
                <div>
                  <div
                    style={{
                      fontSize: 14.5,
                      fontWeight: 600,
                      textDecoration: t.done ? 'line-through' : 'none',
                    }}
                  >
                    {t.title}
                  </div>
                  <div style={{ fontSize: 12.5, color: palette.muted }}>
                    {t.vendor} • Assigned to {t.assignee}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12.5, color: palette.muted }}>Due {t.due}</span>
                <Badge
                  size="sm"
                  variant="tonal"
                  tone={t.priority === 'High' ? 'danger' : t.priority === 'Medium' ? 'warning' : 'info'}
                >
                  {t.priority}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. DOCUMENTS
  // =========================================================================
  if (activeNav === 'documents') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em' }}>
              Document Vault
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: 14.5, color: palette.muted }}>
              Centralized repository for MSAs, SOC 2 attestations, DPAs, and tax forms.
            </p>
          </div>
          <Button
            variant="filled"
            size="sm"
            leadingIcon={<UploadCloud size={15} />}
            onClick={() =>
              notify({
                title: 'Upload ready',
                description: 'Drag & drop PDF or DOCX files into any vendor folder.',
                tone: 'info',
              })
            }
          >
            Upload Document
          </Button>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(['All', 'Compliance', 'Contracts', 'Tax'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setDocFilter(cat)}
              style={{
                padding: '7px 14px',
                borderRadius: 999,
                border: `1px solid ${docFilter === cat ? palette.primary : palette.border}`,
                backgroundColor: docFilter === cat ? palette.primary : palette.cardBg,
                color: docFilter === cat ? '#fff' : palette.text,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {filteredDocs.map((doc) => (
            <div key={doc.id} style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                <span
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: palette.cardElevated,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#3B82F6',
                  }}
                >
                  <FileCheck2 size={19} />
                </span>
                <Badge
                  size="sm"
                  variant="tonal"
                  tone={
                    doc.status === 'Verified'
                      ? 'success'
                      : doc.status === 'Expiring Soon'
                        ? 'danger'
                        : 'warning'
                  }
                >
                  {doc.status}
                </Badge>
              </div>
              <div>
                <div style={{ fontSize: 15.5, fontWeight: 700, marginBottom: 4 }}>{doc.title}</div>
                <div style={{ fontSize: 13, color: palette.muted }}>
                  {doc.vendor} • {doc.category}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: 12.5,
                  color: palette.subtle,
                  paddingTop: 10,
                  borderTop: `1px solid ${palette.border}`,
                }}
              >
                <span>{doc.updated} • {doc.size}</span>
                <button
                  type="button"
                  onClick={() =>
                    notify({ title: 'Downloading', description: `${doc.title} (${doc.size})`, tone: 'info' })
                  }
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#3B82F6',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Download size={13} />
                  PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 5. REPORTS
  // =========================================================================
  if (activeNav === 'reports') {
    const categories = [
      { name: 'Software & SaaS', spend: '$185,000', pct: 74, color: '#3B82F6' },
      { name: 'AI & Analytics', spend: '$128,000', pct: 52, color: '#8B5CF6' },
      { name: 'Cloud Infrastructure', spend: '$84,000', pct: 36, color: '#06B6D4' },
      { name: 'Security & Legal', spend: '$57,000', pct: 24, color: '#10B981' },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em' }}>
              Spend &amp; Compliance Reports
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: 14.5, color: palette.muted }}>
              Annual contract commitments and onboarding SLA breakdown by department.
            </p>
          </div>
          <Button
            variant="outlined"
            size="sm"
            leadingIcon={<Download size={15} />}
            onClick={() => notify({ title: 'Report exported', description: 'Q3-vendor-spend.csv downloaded.', tone: 'success' })}
          >
            Export CSV
          </Button>
        </div>

        <div className="flow-demo-detail-grid">
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 18px', fontSize: 17, fontWeight: 700 }}>Annual Spend by Category</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {categories.map((cat) => (
                <div key={cat.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 6 }}>
                    <span style={{ fontWeight: 600 }}>{cat.name}</span>
                    <span style={{ fontWeight: 700 }}>{cat.spend}</span>
                  </div>
                  <div
                    style={{
                      height: 10,
                      borderRadius: 999,
                      backgroundColor: palette.cardElevated,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${cat.pct}%`,
                        height: '100%',
                        borderRadius: 999,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 18px', fontSize: 17, fontWeight: 700 }}>Top Contracts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {vendors.slice(0, 4).map((v) => (
                <div
                  key={v.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 12,
                    backgroundColor: palette.cardElevated,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{v.name}</div>
                    <div style={{ fontSize: 12, color: palette.muted }}>{v.category}</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>{v.estimatedSpend}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 6. NOTIFICATIONS
  // =========================================================================
  if (activeNav === 'notifications') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em' }}>
              Notifications
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: 14.5, color: palette.muted }}>
              Real-time alerts from vendor onboarding, security reviews, and contract renewals.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['All', 'Unread'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setNotifFilter(tab)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 999,
                  border: `1px solid ${notifFilter === tab ? palette.primary : palette.border}`,
                  backgroundColor: notifFilter === tab ? palette.primary : palette.cardBg,
                  color: notifFilter === tab ? '#fff' : palette.text,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {tab}
              </button>
            ))}
            <Button variant="outlined" size="sm" onClick={markAllRead}>
              Mark all read
            </Button>
          </div>
        </div>

        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredNotifs.length === 0 ? (
            <div style={{ padding: 28, textAlign: 'center', color: palette.muted }}>
              No unread notifications. You are all caught up.
            </div>
          ) : (
            filteredNotifs.map((n) => (
              <div
                key={n.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 12,
                  padding: '14px 16px',
                  borderRadius: 16,
                  backgroundColor: n.unread ? palette.cardElevated : 'transparent',
                  border: `1px solid ${n.unread ? palette.borderStrong : palette.border}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: palette.pillBg,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: n.tone === 'warning' ? '#F59E0B' : n.tone === 'success' ? '#10B981' : '#3B82F6',
                    }}
                  >
                    {n.tone === 'warning' ? <ShieldAlert size={17} /> : n.tone === 'success' ? <CheckCircle2 size={17} /> : <Bell size={17} />}
                  </span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 14.5 }}>{n.title}</span>
                      {n.unread && <Badge size="sm" variant="filled" tone="primary">New</Badge>}
                    </div>
                    <div style={{ fontSize: 13, color: palette.muted, marginTop: 3 }}>{n.description}</div>
                    <div style={{ fontSize: 12, color: palette.subtle, marginTop: 4 }}>{n.time}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {n.unread && (
                    <Button variant="outlined" size="sm" onClick={() => markOneRead(n.id)}>
                      Mark read
                    </Button>
                  )}
                  <Button
                    variant="filled"
                    size="sm"
                    onClick={() => {
                      markOneRead(n.id);
                      onSelectNav(n.targetNav);
                    }}
                  >
                    Open →
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 7. SETTINGS
  // =========================================================================
  if (activeNav === 'settings') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em' }}>
              Workspace Settings
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: 14.5, color: palette.muted }}>
              Configure approval automation, SSO enforcement, and notification rules.
            </p>
          </div>
          <Button
            variant="filled"
            size="sm"
            onClick={() =>
              notify({ title: 'Settings saved', description: `${workspaceName} preferences updated.`, tone: 'success' })
            }
          >
            Save Changes
          </Button>
        </div>

        <div className="flow-demo-detail-grid">
          <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>General Information</h3>
            <Input label="Workspace Name" value={workspaceName} onChange={setWorkspaceName} />
            <Input label="Custom Domain" value={workspaceDomain} onChange={setWorkspaceDomain} />
          </div>

          <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Automation &amp; Security</h3>
            {[
              {
                label: 'Auto-approve low-risk renewals',
                desc: 'Skip manual review when ISO 27001 / SOC 2 is valid.',
                value: autoApproveLowRisk,
                onChange: setAutoApproveLowRisk,
              },
              {
                label: 'Enforce SAML 2.0 SSO',
                desc: 'Require corporate identity provider for all admins.',
                value: enforceSso,
                onChange: setEnforceSso,
              },
              {
                label: 'Weekly compliance digest',
                desc: 'Send Monday summary to legal & procurement leads.',
                value: weeklyDigest,
                onChange: setWeeklyDigest,
              },
            ].map((row) => (
              <div
                key={row.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '10px 12px',
                  borderRadius: 12,
                  backgroundColor: palette.cardElevated,
                }}
              >
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{row.label}</div>
                  <div style={{ fontSize: 12, color: palette.muted }}>{row.desc}</div>
                </div>
                <Switch value={row.value} onChange={row.onChange} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 8. ACCOUNT
  // =========================================================================
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em' }}>
          Account &amp; Security
        </h1>
        <p style={{ margin: '6px 0 0', fontSize: 14.5, color: palette.muted }}>
          Manage your profile, appearance preference, and API credentials.
        </p>
      </div>

      <div className="flow-demo-detail-grid">
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Avatar name="Daniel Kim" size="lg" tone="primary" />
            <div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>Daniel Kim</div>
              <div style={{ fontSize: 13.5, color: palette.muted }}>daniel.kim@flowpro.io • Workspace Admin</div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 12,
              paddingTop: 14,
              borderTop: `1px solid ${palette.border}`,
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: palette.subtle }}>Role</div>
              <div style={{ fontWeight: 700, marginTop: 4 }}>Procurement Lead</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: palette.subtle }}>2FA Status</div>
              <div style={{ fontWeight: 700, marginTop: 4, color: '#10B981' }}>Hardware Key Active</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: palette.subtle }}>Last Login</div>
              <div style={{ fontWeight: 700, marginTop: 4 }}>Toronto, CA</div>
            </div>
          </div>
        </div>

        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Quick Preferences</h3>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: 14,
              backgroundColor: palette.cardElevated,
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 600 }}>
              <Moon size={16} />
              Dark Mode
            </span>
            <Switch value={isDark} onChange={onToggleTheme} size="sm" />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: 14,
              backgroundColor: palette.cardElevated,
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5 }}>
              <KeyRound size={16} color="#3B82F6" />
              <span>uxigl_live_98a4...f12c</span>
            </span>
            <Button
              variant="outlined"
              size="sm"
              onClick={() => notify({ title: 'API key copied', description: 'Token copied to clipboard.', tone: 'info' })}
            >
              Copy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
