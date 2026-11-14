import React, { useMemo, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Star,
  CheckSquare,
  FileText,
  BarChart3,
  Bell,
  Settings,
  User,
  HelpCircle,
  Moon,
  Plus,
  Search,
  MoreVertical,
  Calendar,
  Pencil,
  Check,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  ShieldCheck,
  Headphones,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  Layers,
  LogIn,
  Palette,
} from 'lucide-react';
import { useTheme } from '../../providers/ThemeProvider';
import { useToast } from '../../providers/ToastProvider';
import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Input,
  Switch,
} from '../../components/primitives';
import { Modal } from '../../components/composites';
import { FlowWorkspaceInnerPages } from './FlowWorkspaceInnerPages';

export interface FlowWorkspaceDemoProps {
  onNavigate: (sectionId: string, subItemId?: string) => void;
  onOpenThemeStudio?: () => void;
}

type VendorStatus = 'Active' | 'Pending' | 'Blocked';

interface VendorRecord {
  id: string;
  name: string;
  domain: string;
  status: VendorStatus;
  category: string;
  country: string;
  countryFlag: string;
  contact: string;
  estimatedSpend: string;
  contractValue: string;
  ownerName: string;
  ownerRole: string;
  monogram: string;
  accentBg: string;
  accentText: string;
  progress: number;
}

const INITIAL_VENDORS: VendorRecord[] = [
  {
    id: 'lanternfish',
    name: 'Lanternfish',
    domain: 'lanternfish.ai',
    status: 'Active',
    category: 'Software',
    country: 'Canada',
    countryFlag: '🇨🇦',
    contact: 'hello@lanternfish.ai',
    estimatedSpend: '$125,000 / year',
    contractValue: '$125,000 / year • 2 years',
    ownerName: 'Felix Brandt',
    ownerRole: 'Product',
    monogram: 'L',
    accentBg: '#93B4FF',
    accentText: '#0F172A',
    progress: 66,
  },
  {
    id: 'novatech',
    name: 'NovaTech',
    domain: 'novatech.com',
    status: 'Active',
    category: 'Cloud Infra',
    country: 'Germany',
    countryFlag: '🇩🇪',
    contact: 'ops@novatech.com',
    estimatedSpend: '$84,000 / year',
    contractValue: '$84,000 / year • 1 year',
    ownerName: 'Elena Rostova',
    ownerRole: 'Engineering',
    monogram: 'N',
    accentBg: '#38BDF8',
    accentText: '#082F49',
    progress: 100,
  },
  {
    id: 'pixelforge',
    name: 'PixelForge',
    domain: 'pixelforge.co',
    status: 'Pending',
    category: 'Design Systems',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    contact: 'team@pixelforge.co',
    estimatedSpend: '$42,000 / year',
    contractValue: '$42,000 / year • 1 year',
    ownerName: 'Maya Lin',
    ownerRole: 'Design Ops',
    monogram: 'F',
    accentBg: '#A855F7',
    accentText: '#FFFFFF',
    progress: 33,
  },
  {
    id: 'cloudsync',
    name: 'CloudSync',
    domain: 'cloudsync.io',
    status: 'Active',
    category: 'Data Pipeline',
    country: 'Netherlands',
    countryFlag: '🇳🇱',
    contact: 'billing@cloudsync.io',
    estimatedSpend: '$68,500 / year',
    contractValue: '$68,500 / year • 3 years',
    ownerName: 'Soren Lindqvist',
    ownerRole: 'Platform',
    monogram: 'C',
    accentBg: '#CBD5E1',
    accentText: '#0F172A',
    progress: 100,
  },
  {
    id: 'bytewave',
    name: 'ByteWave',
    domain: 'bytewave.com',
    status: 'Blocked',
    category: 'Security Audit',
    country: 'United States',
    countryFlag: '🇺🇸',
    contact: 'compliance@bytewave.com',
    estimatedSpend: '$31,000 / year',
    contractValue: '$31,000 / year • 1 year',
    ownerName: 'Marcus Vance',
    ownerRole: 'Legal',
    monogram: 'W',
    accentBg: '#FDA4AF',
    accentText: '#4C0519',
    progress: 33,
  },
  {
    id: 'dataminds',
    name: 'DataMinds',
    domain: 'dataminds.ai',
    status: 'Active',
    category: 'AI Analytics',
    country: 'Turkey',
    countryFlag: '🇹🇷',
    contact: 'hello@dataminds.ai',
    estimatedSpend: '$96,000 / year',
    contractValue: '$96,000 / year • 2 years',
    ownerName: 'Deniz Kaya',
    ownerRole: 'Data Science',
    monogram: 'M',
    accentBg: '#3B82F6',
    accentText: '#FFFFFF',
    progress: 66,
  },
];

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'vendors', label: 'Vendors', icon: Users },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: '12', badgeTone: 'primary' as const },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'notifications', label: 'Notifications', icon: Bell, badge: '3', badgeTone: 'danger' as const },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'account', label: 'Account', icon: User },
  { id: 'login', label: 'Login', icon: LogIn },
];

function statusTone(status: VendorStatus): 'success' | 'warning' | 'danger' {
  if (status === 'Active') return 'success';
  if (status === 'Pending') return 'warning';
  return 'danger';
}

export const FlowWorkspaceDemo: React.FC<FlowWorkspaceDemoProps> = ({
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

  const [vendors, setVendors] = useState<VendorRecord[]>(INITIAL_VENDORS);
  const [selectedVendorId, setSelectedVendorId] = useState<string>('lanternfish');
  const [activeNav, setActiveNav] = useState<string>('vendors');
  const [unreadNotifications, setUnreadNotifications] = useState<number>(3);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'All' | VendorStatus>('All');
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [confirmed, setConfirmed] = useState<boolean>(true);
  const [docsChecked, setDocsChecked] = useState<Record<string, boolean>>({
    soc2: true,
    w9: true,
    msa: false,
  });

  // Modals
  const [newVendorOpen, setNewVendorOpen] = useState(false);
  const [editVendorOpen, setEditVendorOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDomain, setNewDomain] = useState('');
  const [newCategory, setNewCategory] = useState('Software');
  const [newSpend, setNewSpend] = useState('$60,000 / year');
  const [editContact, setEditContact] = useState('');
  const [editCountry, setEditCountry] = useState('');

  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.domain.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [vendors, statusFilter, searchQuery]);

  const selectedVendor = useMemo(
    () => vendors.find((v) => v.id === selectedVendorId) ?? vendors[0],
    [vendors, selectedVendorId]
  );

  // Dynamic surface palette powered by uxiGL Theme Studio CSS tokens
  const palette = {
    shellBg: 'var(--uxu-bg-canvas)',
    sidebarBg: 'var(--uxu-bg-elevated)',
    listBg: isDark ? 'rgba(16, 22, 34, 0.72)' : 'var(--uxu-surface-tonal)',
    mainBg: 'var(--uxu-bg-canvas)',
    cardBg: 'var(--uxu-surface-tonal)',
    cardElevated: 'var(--uxu-surface-tonal-high)',
    border: 'var(--uxu-border-subtle)',
    borderStrong: 'var(--uxu-primary)',
    text: 'var(--uxu-text-primary)',
    muted: 'var(--uxu-text-secondary)',
    subtle: 'var(--uxu-text-muted)',
    pillBg: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(15, 23, 42, 0.05)',
    activeNavBg:
      'linear-gradient(90deg, var(--uxu-primary-container) 0%, transparent 100%)',
    primary: 'var(--uxu-primary)',
  };

  const progressPercent = activeStep === 1 ? selectedVendor.progress : activeStep === 2 ? 84 : 100;
  const ringRadius = 52;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (progressPercent / 100) * ringCircumference;

  const handleCreateVendor = () => {
    if (!newName.trim()) return;
    const cleanName = newName.trim();
    const id = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    const created: VendorRecord = {
      id,
      name: cleanName,
      domain: newDomain.trim() || `${cleanName.toLowerCase().replace(/\s+/g, '')}.io`,
      status: 'Pending',
      category: newCategory.trim() || 'Software',
      country: 'United States',
      countryFlag: '🇺🇸',
      contact: `hello@${newDomain.trim() || 'vendor.io'}`,
      estimatedSpend: newSpend.trim() || '$50,000 / year',
      contractValue: `${newSpend.trim() || '$50,000 / year'} • 1 year`,
      ownerName: 'Daniel Kim',
      ownerRole: 'Admin',
      monogram: cleanName.charAt(0).toUpperCase(),
      accentBg: '#60A5FA',
      accentText: '#0F172A',
      progress: 33,
    };
    setVendors((prev) => [created, ...prev]);
    setSelectedVendorId(id);
    setActiveStep(1);
    setNewVendorOpen(false);
    setNewName('');
    setNewDomain('');
    notify({
      title: 'Vendor added',
      description: `${created.name} is ready for onboarding.`,
      tone: 'success',
    });
  };

  const handleOpenEdit = () => {
    setEditContact(selectedVendor.contact);
    setEditCountry(selectedVendor.country);
    setEditVendorOpen(true);
  };

  const handleSaveEdit = () => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === selectedVendor.id
          ? { ...v, contact: editContact || v.contact, country: editCountry || v.country }
          : v
      )
    );
    setEditVendorOpen(false);
    notify({
      title: 'Vendor updated',
      description: `${selectedVendor.name} details saved.`,
      tone: 'success',
    });
  };

  const handleContinue = () => {
    if (activeStep === 1) {
      if (!confirmed) {
        notify({
          title: 'Confirmation required',
          description: 'Please confirm that the vendor information is accurate.',
          tone: 'warning',
        });
        return;
      }
      setActiveStep(2);
    } else if (activeStep === 2) {
      setActiveStep(3);
    } else {
      setVendors((prev) =>
        prev.map((v) =>
          v.id === selectedVendor.id ? { ...v, status: 'Active', progress: 100 } : v
        )
      );
      notify({
        title: 'Onboarding completed',
        description: `${selectedVendor.name} has been verified and activated.`,
        tone: 'success',
      });
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: palette.shellBg,
        color: palette.text,
        fontFamily: 'var(--uxu-font-sans, Inter, system-ui, sans-serif)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(0, 1fr))',
      }}
    >
      <style>{`
        .flow-demo-layout {
          display: grid;
          grid-template-columns: 236px 330px minmax(0, 1fr);
          min-height: 100vh;
          width: 100%;
        }
        .flow-demo-layout--two-col {
          grid-template-columns: 236px minmax(0, 1fr);
        }
        .flow-demo-detail-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.55fr) minmax(270px, 0.95fr);
          gap: 22px;
          align-items: start;
        }
        @media (max-width: 1180px) {
          .flow-demo-layout {
            grid-template-columns: 220px minmax(0, 1fr);
          }
          .flow-demo-list-col {
            display: none;
          }
        }
        @media (max-width: 860px) {
          .flow-demo-layout {
            grid-template-columns: 1fr;
          }
          .flow-demo-sidebar {
            display: none !important;
          }
          .flow-demo-detail-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className={`flow-demo-layout${activeNav !== 'vendors' ? ' flow-demo-layout--two-col' : ''}`}>
        {/* ================================================================
            COLUMN 1: CLEAN LEFT NAVIGATION SIDEBAR
        ================================================================ */}
        <aside
          className="flow-demo-sidebar"
          style={{
            backgroundColor: palette.sidebarBg,
            borderRight: `1px solid ${palette.border}`,
            padding: '20px 14px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 18,
          }}
        >
          <div>
            {/* Brand */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 8px 18px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
                  F
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em' }}>
                    FlowGL
                  </div>
                  <div style={{ fontSize: 11, color: palette.subtle }}>uxiGL Clean Demo</div>
                </div>
              </div>
            </div>

            {/* Primary Nav */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {NAV_ITEMS.map((item) => {
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
                      padding: '10px 12px',
                      borderRadius: 12,
                      border: 'none',
                      cursor: 'pointer',
                      background: isActive ? palette.activeNavBg : 'transparent',
                      color: isActive ? palette.text : palette.muted,
                      fontWeight: isActive ? 600 : 500,
                      fontSize: 14,
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                      <Icon size={17} style={{ opacity: isActive ? 1 : 0.78 }} />
                      <span>{item.label}</span>
                    </span>
                    {(() => {
                      const badgeText =
                        item.id === 'notifications'
                          ? unreadNotifications > 0
                            ? String(unreadNotifications)
                            : undefined
                          : item.badge;
                      return badgeText ? (
                        <Badge
                          size="sm"
                          variant="filled"
                          tone={item.badgeTone}
                        >
                          {badgeText}
                        </Badge>
                      ) : null;
                    })()}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ borderTop: `1px solid ${palette.border}`, paddingTop: 14 }}>
              <button
                type="button"
                onClick={() => onNavigate('landing', 'home')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 10,
                  border: 'none',
                  background: 'transparent',
                  color: palette.muted,
                  fontSize: 13.5,
                  cursor: 'pointer',
                }}
              >
                <HelpCircle size={16} />
                <span>Help &amp; Support</span>
              </button>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  fontSize: 13.5,
                  color: palette.muted,
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Moon size={16} />
                  <span>Dark mode</span>
                </span>
                <Switch
                  value={isDark}
                  onChange={() => toggleMode()}
                  size="sm"
                />
              </div>
            </div>

            {/* Upgrade Card */}
            <div
              style={{
                padding: 14,
                borderRadius: 16,
                background: isDark
                  ? 'linear-gradient(145deg, rgba(37, 99, 235, 0.22) 0%, rgba(124, 58, 237, 0.18) 100%)'
                  : 'linear-gradient(145deg, rgba(37, 99, 235, 0.1) 0%, rgba(124, 58, 237, 0.08) 100%)',
                border: `1px solid ${palette.border}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 13.5, marginBottom: 4 }}>
                <Sparkles size={14} color="#60A5FA" />
                <span>Upgrade to Pro</span>
              </div>
              <div style={{ fontSize: 12, color: palette.muted, lineHeight: 1.45, marginBottom: 12 }}>
                Unlock advanced vendor compliance workflows.
              </div>
              <Button
                variant="filled"
                size="sm"
                onClick={() => onNavigate('dashboard', 'overview')}
                style={{ width: '100%', borderRadius: 10 }}
              >
                EnterpriseGL →
              </Button>
            </div>

            {/* User Profile */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '6px 6px 2px',
              }}
            >
              <Avatar name="Daniel Kim" size="sm" tone="primary" />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>Daniel Kim</div>
                <div style={{ fontSize: 11.5, color: palette.subtle }}>Admin</div>
              </div>
            </div>
          </div>
        </aside>

        {/* ================================================================
            COLUMN 2: VENDORS MASTER LIST (FEWER, LARGER ITEMS)
        ================================================================ */}
        {activeNav === 'vendors' && (
        <section
          className="flow-demo-list-col"
          style={{
            backgroundColor: palette.listBg,
            borderRight: `1px solid ${palette.border}`,
            padding: '24px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>
              Vendors
            </h2>
            <Button
              variant="filled"
              size="sm"
              leadingIcon={<Plus size={15} />}
              onClick={() => setNewVendorOpen(true)}
              style={{ borderRadius: 999 }}
            >
              New vendor
            </Button>
          </div>

          {/* Search */}
          <Input
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search vendors..."
            leadingIcon={<Search size={15} />}
            size="md"
          />

          {/* Status Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {(['All', 'Active', 'Pending', 'Blocked'] as const).map((tab) => {
              const active = statusFilter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  style={{
                    padding: '6px 13px',
                    borderRadius: 999,
                    border: `1px solid ${active ? palette.primary : palette.border}`,
                    backgroundColor: active ? palette.primary : palette.pillBg,
                    color: active ? '#FFFFFF' : palette.muted,
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Vendor Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
            {filteredVendors.map((vendor) => {
              const isSelected = vendor.id === selectedVendor.id;
              return (
                <button
                  key={vendor.id}
                  type="button"
                  onClick={() => {
                    setSelectedVendorId(vendor.id);
                    setActiveStep(1);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    width: '100%',
                    padding: '14px 14px',
                    borderRadius: 16,
                    border: `1.5px solid ${isSelected ? palette.borderStrong : palette.border}`,
                    backgroundColor: isSelected ? palette.cardBg : 'transparent',
                    color: palette.text,
                    textAlign: 'left',
                    cursor: 'pointer',
                    boxShadow: isSelected
                      ? '0 8px 24px rgba(37, 99, 235, 0.12)'
                      : 'none',
                    transition: 'all 0.16s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: vendor.accentBg,
                        color: vendor.accentText,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: 16,
                        flexShrink: 0,
                      }}
                    >
                      {vendor.monogram}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 14.5,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {vendor.name}
                      </div>
                      <div style={{ fontSize: 12.5, color: palette.subtle }}>
                        {vendor.domain}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <Badge
                      size="sm"
                      variant="tonal"
                      tone={statusTone(vendor.status)}
                    >
                      {vendor.status}
                    </Badge>
                    <MoreVertical size={14} style={{ color: palette.subtle }} />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
        )}

        {/* ================================================================
            COLUMN 3: SPACIOUS MAIN ONBOARDING WORKSPACE
        ================================================================ */}
        <main
          style={{
            backgroundColor: palette.mainBg,
            padding: '24px 32px 36px',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            minWidth: 0,
          }}
        >
          {/* Top Breadcrumb + Date + Demo Switcher */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: palette.muted }}>
              <button
                type="button"
                onClick={() => onNavigate('landing', 'home')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '5px 11px',
                  borderRadius: 999,
                  border: `1px solid ${palette.border}`,
                  backgroundColor: palette.cardBg,
                  color: palette.text,
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <ArrowLeft size={13} />
                <span>uxiGL Landing</span>
              </button>
              <span>
                {activeNav === 'vendors'
                  ? 'Vendors'
                  : NAV_ITEMS.find((n) => n.id === activeNav)?.label ?? 'Workspace'}
              </span>
              {activeNav === 'vendors' && (
                <>
                  <span style={{ opacity: 0.45 }}>&gt;</span>
                  <span style={{ color: palette.text, fontWeight: 600 }}>
                    {selectedVendor.name}
                  </span>
                </>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {/* Quick Seed Palette Color Swatches */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '5px 10px',
                  borderRadius: 999,
                  border: `1px solid ${palette.border}`,
                  backgroundColor: palette.cardBg,
                }}
                title="Hızlı Renk Paleti"
              >
                {availablePalettes.slice(0, 6).map((p) => {
                  const isActiveSeed = preferences.seedPalette === p.id;
                  const swatchColor = isDark ? p.dark.primary : p.light.primary;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSeedPalette(p.id)}
                      aria-label={p.name}
                      title={p.name}
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        border: isActiveSeed
                          ? `2px solid ${palette.text}`
                          : '1px solid rgba(255,255,255,0.2)',
                        backgroundColor: swatchColor,
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
                    backgroundColor: 'var(--uxu-primary-container)',
                    color: 'var(--uxu-on-primary-container)',
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
                onClick={() => onNavigate('dashboard', 'overview')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 13px',
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
                <span>EnterpriseGL</span>
              </button>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '7px 14px',
                  borderRadius: 10,
                  border: `1px solid ${palette.border}`,
                  backgroundColor: palette.cardBg,
                  color: palette.text,
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                <Calendar size={14} style={{ color: palette.muted }} />
                <span>Sep 28, 2026</span>
              </div>
            </div>
          </div>

          {activeNav !== 'vendors' ? (
            <FlowWorkspaceInnerPages
              activeNav={activeNav}
              palette={palette}
              isDark={isDark}
              vendors={vendors}
              onSelectVendor={(vendorId) => {
                setSelectedVendorId(vendorId);
                setActiveNav('vendors');
              }}
              onSelectNav={(navId) => setActiveNav(navId)}
              onToggleTheme={toggleMode}
              notify={notify}
              unreadNotifications={unreadNotifications}
              onUpdateUnreadNotifications={setUnreadNotifications}
            />
          ) : (
            <>
          {/* Hero Onboarding Banner */}
          <div
            style={{
              borderRadius: 20,
              border: `1px solid ${palette.border}`,
              padding: '26px 28px',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 142,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              backgroundColor: palette.cardBg,
            }}
          >
            <img
              src="/demos/flowgl-hero.jpg"
              alt="FlowGL Vendor Onboarding Hub"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'right center',
                filter: isDark ? 'brightness(0.75) contrast(1.06)' : 'none',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: isDark
                  ? 'linear-gradient(90deg, rgba(11, 15, 23, 0.94) 0%, rgba(11, 15, 23, 0.78) 46%, rgba(11, 15, 23, 0.14) 100%)'
                  : 'linear-gradient(90deg, rgba(248, 250, 252, 0.96) 0%, rgba(248, 250, 252, 0.84) 44%, rgba(248, 250, 252, 0.08) 100%)',
                pointerEvents: 'none',
              }}
            />
            <div style={{ position: 'relative', zIndex: 1, maxWidth: 460 }}>
              <Badge size="sm" variant="tonal" tone="primary" style={{ marginBottom: 10 }}>
                FlowGL Partner Hub
              </Badge>
              <h1
                style={{
                  margin: '0 0 6px',
                  fontSize: 30,
                  fontWeight: 800,
                  letterSpacing: '-0.025em',
                }}
              >
                Start onboarding
              </h1>
              <p style={{ margin: 0, fontSize: 14.5, color: palette.muted }}>
                Add vendor details and complete the verification process.
              </p>
            </div>
          </div>

          {/* Clean 3-Step Horizontal Stepper */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              flexWrap: 'wrap',
              padding: '4px 0',
            }}
          >
            {[
              { step: 1 as const, label: 'Vendor Details' },
              { step: 2 as const, label: 'Documents' },
              { step: 3 as const, label: 'Review' },
            ].map((s, idx) => {
              const isCurrent = activeStep === s.step;
              const isDone = activeStep > s.step;
              return (
                <React.Fragment key={s.step}>
                  <button
                    type="button"
                    onClick={() => setActiveStep(s.step)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 10,
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      padding: 0,
                      color: isCurrent || isDone ? palette.text : palette.subtle,
                      fontWeight: isCurrent ? 700 : 500,
                      fontSize: 14,
                    }}
                  >
                    <span
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 13,
                        fontWeight: 700,
                        backgroundColor: isCurrent
                          ? palette.primary
                          : isDone
                          ? '#10B981'
                          : palette.pillBg,
                        color: isCurrent || isDone ? '#FFFFFF' : palette.muted,
                        border: `1px solid ${isCurrent || isDone ? 'transparent' : palette.border}`,
                      }}
                    >
                      {isDone ? <Check size={14} /> : s.step}
                    </span>
                    <span>{s.label}</span>
                  </button>
                  {idx < 2 && (
                    <div
                      style={{
                        flex: 1,
                        minWidth: 40,
                        height: 1,
                        backgroundColor: isDone ? '#10B981' : palette.border,
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Main 2-Column Content Grid */}
          <div className="flow-demo-detail-grid">
            {/* LEFT: LARGE CLEAN CARDS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {activeStep === 1 && (
                <>
                  {/* Card 1: Vendor Information */}
                  <div
                    style={{
                      backgroundColor: palette.cardBg,
                      border: `1px solid ${palette.border}`,
                      borderRadius: 20,
                      padding: 26,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 22,
                      }}
                    >
                      <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>
                        Vendor information
                      </h3>
                      <Button
                        variant="outlined"
                        size="sm"
                        leadingIcon={<Pencil size={13} />}
                        onClick={handleOpenEdit}
                        style={{ borderRadius: 10 }}
                      >
                        Edit
                      </Button>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 18,
                        marginBottom: 26,
                      }}
                    >
                      <div
                        style={{
                          width: 72,
                          height: 72,
                          borderRadius: 20,
                          backgroundColor: selectedVendor.accentBg,
                          color: selectedVendor.accentText,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900,
                          fontSize: 30,
                          flexShrink: 0,
                        }}
                      >
                        {selectedVendor.monogram}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                          <span style={{ fontSize: 21, fontWeight: 700 }}>
                            {selectedVendor.name}
                          </span>
                          <Badge
                            size="sm"
                            variant="tonal"
                            tone={statusTone(selectedVendor.status)}
                          >
                            {selectedVendor.status}
                          </Badge>
                        </div>
                        <div style={{ fontSize: 14, color: palette.muted }}>
                          {selectedVendor.domain}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                        gap: 16,
                        paddingTop: 18,
                        borderTop: `1px solid ${palette.border}`,
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 12.5, color: palette.subtle, marginBottom: 4 }}>
                          Category
                        </div>
                        <div style={{ fontSize: 14.5, fontWeight: 600 }}>
                          {selectedVendor.category}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12.5, color: palette.subtle, marginBottom: 4 }}>
                          Country
                        </div>
                        <div style={{ fontSize: 14.5, fontWeight: 600 }}>
                          {selectedVendor.countryFlag} {selectedVendor.country}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12.5, color: palette.subtle, marginBottom: 4 }}>
                          Contact
                        </div>
                        <div style={{ fontSize: 14.5, fontWeight: 600, wordBreak: 'break-all' }}>
                          {selectedVendor.contact}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Business Details */}
                  <div
                    style={{
                      backgroundColor: palette.cardBg,
                      border: `1px solid ${palette.border}`,
                      borderRadius: 20,
                      padding: 26,
                    }}
                  >
                    <h3 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700 }}>
                      Business details
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 14, color: palette.muted }}>Estimated spend</span>
                        <span style={{ fontSize: 15, fontWeight: 600 }}>{selectedVendor.estimatedSpend}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 14, color: palette.muted }}>Contract value</span>
                        <span style={{ fontSize: 15, fontWeight: 600 }}>{selectedVendor.contractValue}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 14, color: palette.muted }}>Business owner</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Avatar name={selectedVendor.ownerName} size="sm" tone="info" />
                          <div>
                            <div style={{ fontSize: 14.5, fontWeight: 600 }}>{selectedVendor.ownerName}</div>
                            <div style={{ fontSize: 12, color: palette.subtle }}>{selectedVendor.ownerRole}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeStep === 2 && (
                <div
                  style={{
                    backgroundColor: palette.cardBg,
                    border: `1px solid ${palette.border}`,
                    borderRadius: 20,
                    padding: 26,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>
                    Compliance &amp; Security Documents
                  </h3>
                  <p style={{ margin: 0, fontSize: 14, color: palette.muted }}>
                    Verify required legal and security artifacts for {selectedVendor.name}.
                  </p>

                  {[
                    { key: 'soc2', title: 'SOC 2 Type II Certificate', meta: 'PDF • 2.1 MB' },
                    { key: 'w9', title: 'Tax &amp; W-9 / W-8BEN Form', meta: 'PDF • 640 KB' },
                    { key: 'msa', title: 'Master Services Agreement (MSA)', meta: 'PDF • 1.8 MB' },
                  ].map((doc) => (
                    <div
                      key={doc.key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 18px',
                        borderRadius: 14,
                        backgroundColor: palette.cardElevated,
                        border: `1px solid ${palette.border}`,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <UploadCloud size={20} color="#60A5FA" />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14.5 }}>{doc.title}</div>
                          <div style={{ fontSize: 12, color: palette.subtle }}>{doc.meta}</div>
                        </div>
                      </div>
                      <Checkbox
                        value={!!docsChecked[doc.key]}
                        onChange={(val) =>
                          setDocsChecked((prev) => ({ ...prev, [doc.key]: val }))
                        }
                        label={docsChecked[doc.key] ? 'Verified' : 'Pending'}
                      />
                    </div>
                  ))}
                </div>
              )}

              {activeStep === 3 && (
                <div
                  style={{
                    backgroundColor: palette.cardBg,
                    border: `1px solid ${palette.border}`,
                    borderRadius: 20,
                    padding: 28,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 18,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <CheckCircle2 size={28} color="#10B981" />
                    <div>
                      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                        Ready for Final Activation
                      </h3>
                      <div style={{ fontSize: 13.5, color: palette.muted }}>
                        All onboarding checks for {selectedVendor.name} are complete.
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      padding: 18,
                      borderRadius: 14,
                      backgroundColor: palette.cardElevated,
                      border: `1px solid ${palette.border}`,
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: palette.muted,
                    }}
                  >
                    <div><strong style={{ color: palette.text }}>Vendor:</strong> {selectedVendor.name} ({selectedVendor.domain})</div>
                    <div><strong style={{ color: palette.text }}>Contract:</strong> {selectedVendor.contractValue}</div>
                    <div><strong style={{ color: palette.text }}>Owner:</strong> {selectedVendor.ownerName}</div>
                  </div>
                </div>
              )}

              {/* Confirmation + Full-Width Primary CTA */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 4 }}>
                <Checkbox
                  value={confirmed}
                  onChange={setConfirmed}
                  label="I confirm that the information is accurate and up to date."
                />
                <Button
                  variant="filled"
                  size="lg"
                  trailingIcon={<ArrowRight size={17} />}
                  onClick={handleContinue}
                  style={{
                    width: '100%',
                    borderRadius: 14,
                    height: 50,
                    fontSize: 15.5,
                    fontWeight: 700,
                  }}
                >
                  {activeStep < 3 ? 'Continue' : 'Complete Onboarding'}
                </Button>
              </div>
            </div>

            {/* RIGHT: PROGRESS RING + HELPFUL RESOURCES */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Verification Progress Card */}
              <div
                style={{
                  backgroundColor: palette.cardBg,
                  border: `1px solid ${palette.border}`,
                  borderRadius: 20,
                  padding: 24,
                }}
              >
                <h3 style={{ margin: '0 0 18px', fontSize: 16.5, fontWeight: 700 }}>
                  Verification progress
                </h3>

                <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 22px' }}>
                  <div style={{ position: 'relative', width: 128, height: 128 }}>
                    <svg width="128" height="128" viewBox="0 0 128 128">
                      <defs>
                        <linearGradient id="flowProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="var(--uxu-primary)" />
                          <stop offset="50%" stopColor="var(--uxu-secondary)" />
                          <stop offset="100%" stopColor="#34D399" />
                        </linearGradient>
                      </defs>
                      <circle
                        cx="64"
                        cy="64"
                        r={ringRadius}
                        fill="none"
                        stroke={palette.pillBg}
                        strokeWidth="10"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r={ringRadius}
                        fill="none"
                        stroke="url(#flowProgressGrad)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={ringCircumference}
                        strokeDashoffset={ringOffset}
                        transform="rotate(-90 64 64)"
                        style={{ transition: 'stroke-dashoffset 0.35s ease' }}
                      />
                    </svg>
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 26,
                        fontWeight: 700,
                      }}
                    >
                      {progressPercent}%
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { label: 'Vendor details', done: true, dotColor: 'var(--uxu-primary)' },
                    { label: 'Documents', done: activeStep >= 2, dotColor: '#8B5CF6' },
                    { label: 'Review', done: activeStep >= 3, dotColor: '#64748B' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: 13.5,
                        color: item.done ? palette.text : palette.muted,
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: item.dotColor,
                          }}
                        />
                        <span>{item.label}</span>
                      </span>
                      {item.done ? (
                        <Check size={15} color="#10B981" />
                      ) : (
                        <span
                          style={{
                            width: 11,
                            height: 11,
                            borderRadius: '50%',
                            border: `1.5px solid ${palette.subtle}`,
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Helpful Resources Card */}
              <div
                style={{
                  backgroundColor: palette.cardBg,
                  border: `1px solid ${palette.border}`,
                  borderRadius: 20,
                  padding: 24,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 16,
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: 16.5, fontWeight: 700 }}>
                    Helpful resources
                  </h3>
                  <button
                    type="button"
                    onClick={() => onNavigate('docs-guide', 'getting-started')}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#3B82F6',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    View all →
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    {
                      title: 'Vendor onboarding guide',
                      meta: 'PDF • 2.5 MB',
                      icon: BookOpen,
                      bg: 'rgba(59, 130, 246, 0.16)',
                      color: '#60A5FA',
                    },
                    {
                      title: 'Compliance checklist',
                      meta: 'PDF • 1.2 MB',
                      icon: ShieldCheck,
                      bg: 'rgba(16, 185, 129, 0.16)',
                      color: '#34D399',
                    },
                    {
                      title: 'Support center',
                      meta: 'Get help',
                      icon: Headphones,
                      bg: 'rgba(56, 189, 248, 0.16)',
                      color: '#38BDF8',
                    },
                  ].map((res) => {
                    const Icon = res.icon;
                    return (
                      <div
                        key={res.title}
                        onClick={() =>
                          notify({
                            title: res.title,
                            description: 'Resource preview opened.',
                            tone: 'info',
                          })
                        }
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: 12,
                          borderRadius: 14,
                          backgroundColor: palette.cardElevated,
                          border: `1px solid ${palette.border}`,
                          cursor: 'pointer',
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            backgroundColor: res.bg,
                            color: res.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Icon size={17} />
                        </div>
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: 600 }}>{res.title}</div>
                          <div style={{ fontSize: 12, color: palette.subtle }}>{res.meta}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
            </>
          )}
        </main>
      </div>

      {/* New Vendor Modal */}
      <Modal
        open={newVendorOpen}
        onClose={() => setNewVendorOpen(false)}
        title="Add New Vendor"
        subtitle="Create a clean vendor onboarding record"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button variant="outlined" onClick={() => setNewVendorOpen(false)}>
              Cancel
            </Button>
            <Button variant="filled" onClick={handleCreateVendor}>
              Create Vendor
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Vendor Name" value={newName} onChange={setNewName} placeholder="e.g. Acme Cloud" />
          <Input label="Domain" value={newDomain} onChange={setNewDomain} placeholder="e.g. acmecloud.io" />
          <Input label="Category" value={newCategory} onChange={setNewCategory} />
          <Input label="Estimated Spend" value={newSpend} onChange={setNewSpend} />
        </div>
      </Modal>

      {/* Edit Vendor Modal */}
      <Modal
        open={editVendorOpen}
        onClose={() => setEditVendorOpen(false)}
        title={`Edit ${selectedVendor.name}`}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button variant="outlined" onClick={() => setEditVendorOpen(false)}>
              Cancel
            </Button>
            <Button variant="filled" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Contact Email" value={editContact} onChange={setEditContact} />
          <Input label="Country" value={editCountry} onChange={setEditCountry} />
        </div>
      </Modal>
    </div>
  );
};
