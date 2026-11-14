import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  Bell,
  Box,
  Check,
  CheckCircle2,
  Clock,
  Headphones,
  Home,
  Layers,
  LogIn,
  MapPin,
  Moon,
  Package,
  Palette,
  Search,
  Settings,
  Sun,
  TrendingDown,
  TrendingUp,
  Truck,
  Zap,
} from 'lucide-react';
import { useTheme } from '../../providers/ThemeProvider';
import { useToast } from '../../providers/ToastProvider';
import { Avatar, Badge, Button, Input, Switch } from '../../components/primitives';
import { DemoLoginView } from './DemoLoginView';

export interface CargoGLDemoProps {
  onNavigate: (sectionId: string, subItemId?: string) => void;
  onOpenThemeStudio?: () => void;
}

type CargoNavId =
  | 'dashboard'
  | 'orders'
  | 'shipments'
  | 'inventory'
  | 'analytics'
  | 'settings'
  | 'login';

interface ShipmentRecord {
  id: string;
  origin: string;
  destination: string;
  carrier: string;
  eta: string;
  weight: string;
  status: 'In Transit' | 'Delivered' | 'Out for Delivery' | 'Pending';
  step: 1 | 2 | 3 | 4;
}

const INITIAL_SHIPMENTS: ShipmentRecord[] = [
  {
    id: 'CG-7843',
    origin: 'Newark Hub, NJ',
    destination: 'Chicago, IL',
    carrier: 'CargoGL Express',
    eta: 'Today, 05:40 PM',
    weight: '420 kg',
    status: 'In Transit',
    step: 2,
  },
  {
    id: 'CG-7842',
    origin: 'Los Angeles Port, CA',
    destination: 'Phoenix, AZ',
    carrier: 'Pacific Freight',
    eta: 'Today, 02:15 PM',
    weight: '1,180 kg',
    status: 'Out for Delivery',
    step: 3,
  },
  {
    id: 'CG-7841',
    origin: 'Dallas Depot, TX',
    destination: 'Austin, TX',
    carrier: 'CargoGL Prime',
    eta: 'Delivered',
    weight: '215 kg',
    status: 'Delivered',
    step: 4,
  },
  {
    id: 'CG-7840',
    origin: 'Seattle Terminal, WA',
    destination: 'Denver, CO',
    carrier: 'Cascade Line',
    eta: 'Tomorrow, 11:00 AM',
    weight: '690 kg',
    status: 'Pending',
    step: 1,
  },
];

const ORDERS_LIST = [
  { id: '#CG-45821', customer: 'Apex Retail Group', items: '18 pallets', total: '$14,820', city: 'New York, USA', status: 'Delivered' as const },
  { id: '#CG-45820', customer: 'Nordic Hardware Co.', items: '9 pallets', total: '$8,450', city: 'Los Angeles, USA', status: 'In Transit' as const },
  { id: '#CG-45819', customer: 'Vanguard Medical', items: '24 crates', total: '$21,300', city: 'Chicago, USA', status: 'In Transit' as const },
  { id: '#CG-45818', customer: 'Solstice Foods', items: '12 pallets', total: '$6,940', city: 'Austin, USA', status: 'Pending' as const },
];

const INVENTORY_ITEMS = [
  { sku: 'SKU-9012', name: 'Cold-Chain Insulated Crates', warehouse: 'Newark Hub A2', stock: 420, capacity: '84%', status: 'Optimal' as const },
  { sku: 'SKU-4418', name: 'Smart RFID Pallet Tags', warehouse: 'Los Angeles B4', stock: 1850, capacity: '92%', status: 'Optimal' as const },
  { sku: 'SKU-7730', name: 'Heavy-Duty Euro Pallets', warehouse: 'Chicago Central', stock: 94, capacity: '22%', status: 'Low Stock' as const },
  { sku: 'SKU-3105', name: 'Shock-Absorb Packaging Kits', warehouse: 'Dallas Depot', stock: 610, capacity: '68%', status: 'Optimal' as const },
];

const NAV_ITEMS: { id: CargoNavId; label: string; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'shipments', label: 'Shipments', icon: Truck },
  { id: 'inventory', label: 'Inventory', icon: Box },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'login', label: 'Login', icon: LogIn },
];

function MiniSparkline({ color, points }: { color: string; points: string }) {
  return (
    <svg width="78" height="30" viewBox="0 0 78 30" fill="none" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id={`grad-${color.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M0,26 ${points} L78,30 L0,30 Z`}
        fill={`url(#grad-${color.replace(/[^a-zA-Z0-9]/g, '')})`}
      />
      <polyline
        points={`0,26 ${points}`}
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const CargoGLDemo: React.FC<CargoGLDemoProps> = ({
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

  const [activeNav, setActiveNav] = useState<CargoNavId>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [chartRange, setChartRange] = useState<'7d' | '30d'>('7d');
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>('CG-7843');
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [hubName, setHubName] = useState('CargoGL North America');

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
    primaryContainer: 'var(--uxu-primary-container)',
    onPrimaryContainer: 'var(--uxu-on-primary-container)',
    pillBg: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(15, 23, 42, 0.05)',
  };

  const activeShipment = useMemo(
    () => INITIAL_SHIPMENTS.find((s) => s.id === selectedShipmentId) ?? INITIAL_SHIPMENTS[0],
    [selectedShipmentId]
  );

  const filteredOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return ORDERS_LIST;
    return ORDERS_LIST.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const cardStyle: React.CSSProperties = {
    borderRadius: 18,
    backgroundColor: palette.cardBg,
    border: `1px solid ${palette.border}`,
    padding: 20,
    boxShadow: isDark
      ? '0 10px 30px rgba(0, 0, 0, 0.25)'
      : '0 8px 24px rgba(15, 23, 42, 0.04)',
  };

  const timelineSteps = [
    { step: 1, title: 'Picked Up', time: 'May 24, 09:30 AM' },
    { step: 2, title: 'In Transit', time: 'May 24, 02:15 PM' },
    { step: 3, title: 'Out for Delivery', time: 'Scheduled 04:30 PM' },
    { step: 4, title: 'Delivered', time: 'Pending signature' },
  ];

  const chartPoints =
    chartRange === '7d'
      ? [
          { label: 'Mon', val: 420 },
          { label: 'Tue', val: 680 },
          { label: 'Wed', val: 890 },
          { label: 'Thu', val: 940 },
          { label: 'Fri', val: 760 },
          { label: 'Sat', val: 980 },
          { label: 'Sun', val: 1248 },
        ]
      : [
          { label: 'W1', val: 640 },
          { label: 'W2', val: 820 },
          { label: 'W3', val: 910 },
          { label: 'W4', val: 1120 },
          { label: 'W5', val: 1050 },
          { label: 'W6', val: 1190 },
          { label: 'W7', val: 1380 },
        ];

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
        .cargogl-layout {
          display: grid;
          grid-template-columns: 236px minmax(0, 1fr);
          min-height: 100vh;
          width: 100%;
        }
        .cargogl-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }
        .cargogl-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.65fr) minmax(290px, 0.85fr);
          gap: 20px;
          align-items: stretch;
        }
        .cargogl-bottom-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr) minmax(0, 1fr);
          gap: 18px;
        }
        @media (max-width: 1180px) {
          .cargogl-kpi-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .cargogl-hero-grid,
          .cargogl-bottom-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 860px) {
          .cargogl-layout {
            grid-template-columns: 1fr;
          }
          .cargogl-sidebar {
            display: none !important;
          }
        }
      `}</style>

      <div className="cargogl-layout">
        {/* ================================================================
            LEFT SIDEBAR
        ================================================================ */}
        <aside
          className="cargogl-sidebar"
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px 20px' }}>
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
                  boxShadow: '0 6px 18px var(--uxu-accent-glow)',
                }}
              >
                <Box size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em' }}>
                  CargoGL
                </div>
                <div style={{ fontSize: 11, color: palette.subtle }}>Smart Logistics Suite</div>
              </div>
            </div>

            {/* Navigation */}
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
                      gap: 11,
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 12,
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: isActive ? palette.primaryContainer : 'transparent',
                      color: isActive ? palette.onPrimaryContainer : palette.muted,
                      fontWeight: isActive ? 700 : 500,
                      fontSize: 14,
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Icon size={17} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Support Card + Profile */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              style={{
                padding: 16,
                borderRadius: 16,
                backgroundColor: palette.cardElevated,
                border: `1px solid ${palette.border}`,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  backgroundColor: palette.primaryContainer,
                  color: palette.onPrimaryContainer,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}
              >
                <Headphones size={17} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Need help?</div>
              <div style={{ fontSize: 12, color: palette.muted, lineHeight: 1.45, marginBottom: 12 }}>
                Our dispatch &amp; fleet support team is here 24/7.
              </div>
              <Button
                variant="filled"
                size="sm"
                onClick={() =>
                  notify({
                    title: 'Dispatch Support',
                    description: 'Connected to CargoGL Live Operations Desk.',
                    tone: 'info',
                  })
                }
                style={{ width: '100%', borderRadius: 10 }}
              >
                Contact Support
              </Button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 6px 2px' }}>
              <Avatar name="David Carter" size="sm" tone="primary" />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700 }}>David Carter</div>
                <div style={{ fontSize: 11.5, color: palette.subtle }}>Fleet Admin</div>
              </div>
            </div>
          </div>
        </aside>

        {/* ================================================================
            MAIN WORKSPACE
        ================================================================ */}
        <main
          style={{
            padding: '20px 28px 34px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            minWidth: 0,
          }}
        >
          {/* Top Header Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '1 1 320px', maxWidth: 480 }}>
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
                  placeholder="Search orders, shipments, locations..."
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    color: palette.text,
                    fontSize: 13.5,
                    width: '100%',
                  }}
                />
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
                onClick={toggleMode}
                aria-label="Toggle theme"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: `1px solid ${palette.border}`,
                  backgroundColor: palette.cardBg,
                  color: palette.text,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              <button
                type="button"
                onClick={() => onNavigate('demo-flow', 'flow-workspace')}
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
                <span>FlowGL</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  notify({
                    title: '2 Live Fleet Alerts',
                    description: 'Shipment #CG-7843 cleared Newark hub.',
                    tone: 'info',
                  })
                }
                style={{
                  position: 'relative',
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: `1px solid ${palette.border}`,
                  backgroundColor: palette.cardBg,
                  color: palette.text,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Bell size={16} />
                <span
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    width: 17,
                    height: 17,
                    borderRadius: '50%',
                    backgroundColor: '#EF4444',
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  2
                </span>
              </button>
            </div>
          </div>

          {/* ==============================================================
              TAB 1: DASHBOARD
          ============================================================== */}
          {activeNav === 'dashboard' && (
            <>
              {/* 4 KPI Sparkline Cards */}
              <div className="cargogl-kpi-grid">
                {[
                  {
                    label: 'Total Orders',
                    value: '1,248',
                    delta: '↑ 12%',
                    deltaColor: '#10B981',
                    sparkColor: '#3B82F6',
                    points: '14,22 28,24 42,14 56,18 78,6',
                    icon: Box,
                    iconBg: 'rgba(59, 130, 246, 0.14)',
                    iconColor: '#3B82F6',
                  },
                  {
                    label: 'In Transit',
                    value: '856',
                    delta: '↑ 8%',
                    deltaColor: '#10B981',
                    sparkColor: '#0EA5E9',
                    points: '14,20 28,16 42,21 56,12 78,9',
                    icon: Truck,
                    iconBg: 'rgba(14, 165, 233, 0.14)',
                    iconColor: '#0EA5E9',
                  },
                  {
                    label: 'Delivered',
                    value: '982',
                    delta: '↑ 14%',
                    deltaColor: '#10B981',
                    sparkColor: '#10B981',
                    points: '14,24 28,18 42,19 56,10 78,5',
                    icon: CheckCircle2,
                    iconBg: 'rgba(16, 185, 129, 0.14)',
                    iconColor: '#10B981',
                  },
                  {
                    label: 'Pending',
                    value: '210',
                    delta: '↓ 3%',
                    deltaColor: '#F59E0B',
                    sparkColor: '#F59E0B',
                    points: '14,18 28,22 42,15 56,16 78,8',
                    icon: Clock,
                    iconBg: 'rgba(245, 158, 11, 0.14)',
                    iconColor: '#F59E0B',
                  },
                ].map((kpi) => {
                  const Icon = kpi.icon;
                  return (
                    <div
                      key={kpi.label}
                      style={{
                        ...cardStyle,
                        padding: '16px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 10,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 12,
                            backgroundColor: kpi.iconBg,
                            color: kpi.iconColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Icon size={18} />
                        </div>
                        <div>
                          <div style={{ fontSize: 12.5, color: palette.muted, fontWeight: 500 }}>
                            {kpi.label}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginTop: 2 }}>
                            <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>
                              {kpi.value}
                            </span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: kpi.deltaColor }}>
                              {kpi.delta}
                            </span>
                          </div>
                        </div>
                      </div>
                      <MiniSparkline color={kpi.sparkColor} points={kpi.points} />
                    </div>
                  );
                })}
              </div>

              {/* Hero Logistics Banner + Floating Shipment Tracker */}
              <div className="cargogl-hero-grid">
                <div
                  style={{
                    borderRadius: 22,
                    border: `1px solid ${palette.border}`,
                    padding: '34px 32px',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minHeight: 300,
                    backgroundColor: palette.cardBg,
                  }}
                >
                  {/* 3D Isometric Logistics Hub Background */}
                  <img
                    src="/demos/cargogl-hero.jpg"
                    alt="CargoGL Smart Logistics Hub"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'right center',
                      filter: isDark ? 'brightness(0.78) contrast(1.06)' : 'none',
                      pointerEvents: 'none',
                    }}
                  />
                  {/* Adaptive Readability Gradient Scrim */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: isDark
                        ? 'linear-gradient(90deg, rgba(11, 15, 23, 0.94) 0%, rgba(11, 15, 23, 0.78) 44%, rgba(11, 15, 23, 0.12) 100%)'
                        : 'linear-gradient(90deg, rgba(248, 250, 252, 0.96) 0%, rgba(248, 250, 252, 0.82) 42%, rgba(248, 250, 252, 0.06) 100%)',
                      pointerEvents: 'none',
                    }}
                  />

                  <div style={{ position: 'relative', zIndex: 2, maxWidth: 460 }}>
                    <Badge size="sm" variant="tonal" tone="primary" style={{ marginBottom: 14 }}>
                      CargoGL Fleet Engine
                    </Badge>
                    <h1
                      style={{
                        margin: '0 0 12px',
                        fontSize: 34,
                        fontWeight: 800,
                        lineHeight: 1.15,
                        letterSpacing: '-0.03em',
                      }}
                    >
                      Smarter Logistics.
                      <br />
                      Greater Efficiency.
                    </h1>
                    <p
                      style={{
                        margin: '0 0 22px',
                        fontSize: 15,
                        color: palette.muted,
                        lineHeight: 1.6,
                      }}
                    >
                      Track, manage and deliver across global hubs with live telemetry and uxiGL adaptive themes.
                    </p>
                    <Button
                      variant="filled"
                      size="md"
                      onClick={() => setActiveNav('shipments')}
                      style={{ borderRadius: 999 }}
                    >
                      View Shipments →
                    </Button>
                  </div>
                </div>

                {/* Live Shipment Card */}
                <div
                  style={{
                    ...cardStyle,
                    borderRadius: 22,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 16,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 10,
                          backgroundColor: palette.primaryContainer,
                          color: palette.onPrimaryContainer,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Box size={17} />
                      </span>
                      <span style={{ fontWeight: 700, fontSize: 15 }}>
                        Shipment #{activeShipment.id}
                      </span>
                    </div>
                    <Badge size="sm" variant="tonal" tone="success">
                      • {activeShipment.status}
                    </Badge>
                  </div>

                  {/* 4-Step Timeline */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingLeft: 4 }}>
                    {timelineSteps.map((s, idx) => {
                      const done = s.step <= activeShipment.step;
                      return (
                        <div key={s.step} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, position: 'relative' }}>
                          {idx < timelineSteps.length - 1 && (
                            <div
                              style={{
                                position: 'absolute',
                                left: 10,
                                top: 22,
                                bottom: -12,
                                width: 2,
                                backgroundColor: done ? palette.primary : palette.border,
                              }}
                            />
                          )}
                          <div
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: '50%',
                              backgroundColor: done ? palette.primary : palette.cardElevated,
                              border: `1px solid ${done ? palette.primary : palette.border}`,
                              color: done ? '#fff' : palette.subtle,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              zIndex: 1,
                            }}
                          >
                            {done && <Check size={12} />}
                          </div>
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: done ? 700 : 500, color: done ? palette.text : palette.subtle }}>
                              {s.title}
                            </div>
                            <div style={{ fontSize: 12, color: palette.subtle }}>{s.time}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Button
                    variant="outlined"
                    size="sm"
                    onClick={() => setActiveNav('shipments')}
                    style={{ width: '100%', borderRadius: 999 }}
                  >
                    View Details →
                  </Button>
                </div>
              </div>

              {/* Bottom 3-Column Analytics & Activity Row */}
              <div className="cargogl-bottom-grid">
                {/* Shipment Progress Chart */}
                <div style={cardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 15.5 }}>
                      <BarChart3 size={17} color={palette.primary} />
                      <span>Shipment Progress</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setChartRange((r) => (r === '7d' ? '30d' : '7d'))}
                      style={{
                        padding: '5px 11px',
                        borderRadius: 8,
                        border: `1px solid ${palette.border}`,
                        backgroundColor: palette.cardElevated,
                        color: palette.muted,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {chartRange === '7d' ? 'Last 7 days ▾' : 'Last 30 days ▾'}
                    </button>
                  </div>

                  <div style={{ position: 'relative', paddingTop: 10 }}>
                    <svg width="100%" height="145" viewBox="0 0 420 145" preserveAspectRatio="none">
                      {[30, 65, 100].map((y) => (
                        <line
                          key={y}
                          x1="0"
                          y1={y}
                          x2="420"
                          y2={y}
                          stroke={palette.border}
                          strokeDasharray="4 4"
                        />
                      ))}
                      <polyline
                        fill="none"
                        stroke="var(--uxu-primary)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={chartPoints
                          .map((pt, i) => {
                            const x = 18 + (i * 384) / (chartPoints.length - 1);
                            const y = 122 - (pt.val / 1450) * 98;
                            return `${x},${y}`;
                          })
                          .join(' ')}
                      />
                      {chartPoints.map((pt, i) => {
                        const x = 18 + (i * 384) / (chartPoints.length - 1);
                        const y = 122 - (pt.val / 1450) * 98;
                        return (
                          <circle
                            key={pt.label}
                            cx={x}
                            cy={y}
                            r={i === chartPoints.length - 1 ? 5.5 : 4}
                            fill="var(--uxu-primary)"
                            stroke={isDark ? '#0F172A' : '#FFFFFF'}
                            strokeWidth="2"
                          />
                        );
                      })}
                    </svg>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: palette.subtle, padding: '4px 8px 0' }}>
                      {chartPoints.map((p) => (
                        <span key={p.label}>{p.label}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Top Locations */}
                <div style={cardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 15.5 }}>
                      <MapPin size={17} color={palette.primary} />
                      <span>Top Locations</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveNav('analytics')}
                      style={{ border: 'none', background: 'transparent', color: palette.primary, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
                    >
                      View all →
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {[
                      { city: 'New York, USA', count: '324 shipments', pct: 26 },
                      { city: 'Los Angeles, USA', count: '287 shipments', pct: 23 },
                      { city: 'Chicago, USA', count: '226 shipments', pct: 18 },
                    ].map((loc) => (
                      <div key={loc.city} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                        <div style={{ minWidth: 120 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 700 }}>{loc.city}</div>
                          <div style={{ fontSize: 12, color: palette.subtle }}>{loc.count}</div>
                        </div>
                        <div style={{ flex: 1, height: 7, borderRadius: 999, backgroundColor: palette.cardElevated, overflow: 'hidden' }}>
                          <div style={{ width: `${loc.pct * 3}%`, height: '100%', borderRadius: 999, backgroundColor: palette.primary }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{loc.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div style={cardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 15.5 }}>
                      <Zap size={17} color={palette.primary} />
                      <span>Recent Activity</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveNav('orders')}
                      style={{ border: 'none', background: 'transparent', color: palette.primary, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
                    >
                      View all →
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      { title: 'Order #CG-45821 delivered', time: '2 min ago', icon: CheckCircle2, color: '#10B981', bg: 'rgba(16,185,129,0.14)' },
                      { title: 'Order #CG-45820 in transit', time: '12 min ago', icon: Truck, color: '#3B82F6', bg: 'rgba(59,130,246,0.14)' },
                      { title: 'Order #CG-45819 shipped', time: '25 min ago', icon: Package, color: '#F59E0B', bg: 'rgba(245,158,11,0.14)' },
                    ].map((act) => {
                      const Icon = act.icon;
                      return (
                        <div key={act.title} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: '50%',
                              backgroundColor: act.bg,
                              color: act.color,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <Icon size={16} />
                          </span>
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{act.title}</div>
                            <div style={{ fontSize: 12, color: palette.subtle }}>{act.time}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ==============================================================
              TAB 2: ORDERS
          ============================================================== */}
          {activeNav === 'orders' && (
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Orders Queue</h2>
                  <p style={{ margin: '4px 0 0', fontSize: 13.5, color: palette.muted }}>
                    Live freight orders synced with CargoGL dispatchers.
                  </p>
                </div>
                <Badge size="sm" variant="tonal" tone="primary">
                  {filteredOrders.length} orders
                </Badge>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
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
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14.5 }}>
                        {order.id} • {order.customer}
                      </div>
                      <div style={{ fontSize: 12.5, color: palette.muted }}>
                        {order.items} • {order.city}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{order.total}</span>
                      <Badge
                        size="sm"
                        variant="tonal"
                        tone={order.status === 'Delivered' ? 'success' : order.status === 'In Transit' ? 'info' : 'warning'}
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==============================================================
              TAB 3: SHIPMENTS
          ============================================================== */}
          {activeNav === 'shipments' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {INITIAL_SHIPMENTS.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedShipmentId(s.id)}
                  style={{
                    ...cardStyle,
                    cursor: 'pointer',
                    borderColor: selectedShipmentId === s.id ? palette.borderStrong : palette.border,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 800, fontSize: 16 }}>#{s.id}</span>
                    <Badge
                      size="sm"
                      variant="tonal"
                      tone={s.status === 'Delivered' ? 'success' : s.status === 'In Transit' ? 'info' : 'warning'}
                    >
                      {s.status}
                    </Badge>
                  </div>
                  <div style={{ fontSize: 13.5, color: palette.muted }}>
                    {s.origin} → <strong style={{ color: palette.text }}>{s.destination}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: palette.subtle }}>
                    <span>{s.carrier}</span>
                    <span>{s.weight} • ETA: {s.eta}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ==============================================================
              TAB 4: INVENTORY
          ============================================================== */}
          {activeNav === 'inventory' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              {INVENTORY_ITEMS.map((item) => (
                <div key={item.sku} style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <code style={{ fontSize: 12, color: palette.subtle }}>{item.sku}</code>
                    <Badge size="sm" variant="tonal" tone={item.status === 'Optimal' ? 'success' : 'warning'}>
                      {item.status}
                    </Badge>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15.5 }}>{item.name}</div>
                  <div style={{ fontSize: 13, color: palette.muted }}>{item.warehouse}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginTop: 4 }}>
                    <span>{item.stock} units</span>
                    <span>{item.capacity} cap</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ==============================================================
              TAB 5: ANALYTICS
          ============================================================== */}
          {activeNav === 'analytics' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              {[
                { label: 'On-Time Delivery Rate', value: '96.8%', trend: '+2.1% vs last month', up: true },
                { label: 'Average Transit Time', value: '1.9 days', trend: '-0.4 days faster', up: true },
                { label: 'Fuel Cost per Mile', value: '$1.42', trend: '-4.2% optimized', up: false },
              ].map((m) => (
                <div key={m.label} style={cardStyle}>
                  <div style={{ fontSize: 13, color: palette.muted, fontWeight: 600 }}>{m.label}</div>
                  <div style={{ fontSize: 30, fontWeight: 800, margin: '10px 0 8px' }}>{m.value}</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12.5, fontWeight: 600, color: '#10B981' }}>
                    {m.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    <span>{m.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ==============================================================
              TAB 6: SETTINGS
          ============================================================== */}
          {activeNav === 'settings' && (
            <div style={{ ...cardStyle, maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>CargoGL Dispatch Settings</h2>
              <Input label="Hub Name" value={hubName} onChange={setHubName} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 12, backgroundColor: palette.cardElevated }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Automated Carrier Dispatch</div>
                  <div style={{ fontSize: 12, color: palette.muted }}>Assign nearest available fleet automatically.</div>
                </div>
                <Switch value={autoDispatch} onChange={setAutoDispatch} size="sm" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 12, backgroundColor: palette.cardElevated }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Real-time SMS Milestone Alerts</div>
                  <div style={{ fontSize: 12, color: palette.muted }}>Notify recipients on Out for Delivery status.</div>
                </div>
                <Switch value={smsAlerts} onChange={setSmsAlerts} size="sm" />
              </div>
              <Button
                variant="filled"
                size="sm"
                onClick={() => notify({ title: 'Settings saved', description: `${hubName} configuration updated.`, tone: 'success' })}
                style={{ alignSelf: 'flex-start' }}
              >
                Save Preferences
              </Button>
            </div>
          )}
          {/* ==============================================================
              TAB 7: LOGIN VARIETIES
          ============================================================== */}
          {activeNav === 'login' && (
            <DemoLoginView
              brandName="CargoGL"
              brandSubtitle="Smart Logistics Suite"
              brandInitial="C"
              defaultEmail="david.carter@cargogl.io"
              onSuccess={() => setActiveNav('dashboard')}
            />
          )}
        </main>
      </div>
    </div>
  );
};
