import React from 'react';
import {
  DollarSign,
  Users,
  Activity,
  Briefcase,
  Cpu,
  Package,
  Server,
  ShieldCheck,
  TrendingUp,
  Truck,
} from 'lucide-react';
import type { SegmentedOption } from '../../components/composites/SegmentedControl/SegmentedControl';
import type { StatCardProps } from '../../components/composites/StatCard/StatCard';
import type { SheetGLDatasetPreset } from '../../components/composites/SheetGLGridAdapter/SheetGLGridAdapter';
import type { SemanticTone } from '../../core/contracts/ComponentContracts';

/**
 * ============================================================================
 * uxiGL SHOWCASE — MULTI-SCENARIO ANALYTICS & TELEMETRY DOMAIN CONFIGURATION
 * ============================================================================
 * [SRP & OCP] Decouples domain telemetry preset descriptors, KPI metric tuples,
 * and compliance badge metadata from `AnalyticsDashboardView` UI presentation.
 * New enterprise scenarios can be registered or extended here without modifying
 * the view component's rendering logic.
 */

/**
 * Strongly typed KPI metric item descriptor consumed by `<StatCard />`
 * within the `AnalyticsDashboardView` indicator strip.
 */
export type TelemetryKpiConfig = StatCardProps & {
  id: string;
};

/**
 * Complete telemetry configuration contract for a single `SheetGLDatasetPreset`
 * scenario, binding header badge metadata, compliance tags, and 3 KPI cards.
 */
export interface ScenarioTelemetryConfig {
  /** Header status badge text (e.g. `'Live Ledger · 150 Rows'`). */
  badgeLabel: string;
  /** Semantic color tone applied to the header and card badges. */
  badgeTone: SemanticTone;
  /** Regulatory or operational SLA compliance tag shown in the grid header. */
  complianceTag: string;
  /** Fixed 3-tuple of KPI `<StatCard />` configurations for the scenario. */
  kpis: [TelemetryKpiConfig, TelemetryKpiConfig, TelemetryKpiConfig];
}

/**
 * Segmented control option descriptors for switching across the 4 canonical
 * `SheetGLDatasetPreset` scenarios in `AnalyticsDashboardView`.
 */
export const PRESET_SEGMENT_OPTIONS: SegmentedOption<SheetGLDatasetPreset>[] = [
  {
    value: 'finance-erp',
    label: 'Finance & ERP',
    icon: React.createElement(Briefcase, { size: 14 }),
  },
  {
    value: 'cloud-telemetry',
    label: 'Cloud Telemetry',
    icon: React.createElement(Cpu, { size: 14 }),
  },
  {
    value: 'hr-payroll',
    label: 'HR & Payroll',
    icon: React.createElement(Users, { size: 14 }),
  },
  {
    value: 'inventory-supply',
    label: 'Supply Chain',
    icon: React.createElement(Package, { size: 14 }),
  },
];

/**
 * Canonical telemetry KPI and compliance metadata indexed by `SheetGLDatasetPreset`.
 */
export const SCENARIO_TELEMETRY_CONFIG: Record<
  SheetGLDatasetPreset,
  ScenarioTelemetryConfig
> = {
  'finance-erp': {
    badgeLabel: 'Live Ledger · 150 Rows',
    badgeTone: 'primary',
    complianceTag: 'SOC2 · GDPR · ISO27001',
    kpis: [
      {
        id: 'kpi-finance-revenue',
        label: 'Total Revenue',
        value: '$4,820,450',
        delta: '+18.4%',
        trend: 'up',
        tone: 'primary',
        icon: React.createElement(DollarSign, { size: 16 }),
        sparklineData: [38, 45, 42, 61, 68, 82, 96],
        subtitle: 'vs. previous 30-day cycle',
      },
      {
        id: 'kpi-finance-accounts',
        label: 'Active Enterprise Accounts',
        value: '28,490',
        delta: '+12.1%',
        trend: 'up',
        tone: 'info',
        icon: React.createElement(Users, { size: 16 }),
        sparklineData: [24, 31, 35, 44, 52, 63, 78],
        subtitle: 'Enterprise SSO & Passkey sessions',
      },
      {
        id: 'kpi-finance-compliance',
        label: 'Audit & SLA Compliance',
        value: '99.99%',
        delta: '+0.02%',
        trend: 'up',
        tone: 'success',
        icon: React.createElement(ShieldCheck, { size: 16 }),
        sparklineData: [98, 99, 99, 100, 99, 100, 100],
        subtitle: '90-day global edge SLA',
      },
    ],
  },
  'cloud-telemetry': {
    badgeLabel: 'K8s Cluster Stream · 150 Nodes',
    badgeTone: 'info',
    complianceTag: 'HPA Active · Zero-Trust Mesh',
    kpis: [
      {
        id: 'kpi-cloud-rps',
        label: 'Cluster Throughput (RPS)',
        value: '1.42M req/s',
        delta: '+24.6%',
        trend: 'up',
        tone: 'info',
        icon: React.createElement(Server, { size: 16 }),
        sparklineData: [52, 58, 64, 71, 79, 88, 95],
        subtitle: 'Across 5 global cloud regions',
      },
      {
        id: 'kpi-cloud-latency',
        label: 'Global P99 Latency',
        value: '8.4 ms',
        delta: '-14.2%',
        trend: 'up',
        tone: 'success',
        icon: React.createElement(Activity, { size: 16 }),
        sparklineData: [28, 25, 22, 19, 15, 11, 8],
        subtitle: 'Sub-10ms edge shader routing',
      },
      {
        id: 'kpi-cloud-uptime',
        label: 'System Uptime SLA',
        value: '99.99%',
        delta: '+0.01%',
        trend: 'up',
        tone: 'primary',
        icon: React.createElement(Cpu, { size: 16 }),
        sparklineData: [99, 99, 100, 100, 99, 100, 100],
        subtitle: 'Automated failover & HPA scaling',
      },
    ],
  },
  'hr-payroll': {
    badgeLabel: 'Workforce Matrix · 150 Staff',
    badgeTone: 'success',
    complianceTag: 'OKR Q4 · Global Payroll',
    kpis: [
      {
        id: 'kpi-hr-payroll',
        label: 'Monthly Payroll & RSU',
        value: '$2,140,800',
        delta: '+6.8%',
        trend: 'up',
        tone: 'primary',
        icon: React.createElement(DollarSign, { size: 16 }),
        sparklineData: [60, 62, 65, 68, 71, 74, 78],
        subtitle: 'Base compensation + annual RSU vest',
      },
      {
        id: 'kpi-hr-headcount',
        label: 'Active Engineering & R&D',
        value: '1,284',
        delta: '+9.4%',
        trend: 'up',
        tone: 'info',
        icon: React.createElement(Users, { size: 16 }),
        sparklineData: [40, 44, 49, 53, 58, 64, 72],
        subtitle: 'Hybrid (3+2) & Global Remote teams',
      },
      {
        id: 'kpi-hr-okr',
        label: 'Mean OKR Attainment',
        value: '91.4%',
        delta: '+5.3%',
        trend: 'up',
        tone: 'success',
        icon: React.createElement(TrendingUp, { size: 16 }),
        sparklineData: [72, 75, 79, 82, 86, 89, 91],
        subtitle: 'L4–L7 performance velocity',
      },
    ],
  },
  'inventory-supply': {
    badgeLabel: 'Live SKU Telemetry · 150 SKUs',
    badgeTone: 'warning',
    complianceTag: 'Insured · 7 Global Hubs',
    kpis: [
      {
        id: 'kpi-supply-valuation',
        label: 'Total Inventory Valuation',
        value: '$18,940,200',
        delta: '+15.2%',
        trend: 'up',
        tone: 'primary',
        icon: React.createElement(DollarSign, { size: 16 }),
        sparklineData: [45, 50, 56, 62, 70, 79, 88],
        subtitle: 'B200 GPU blades, M4 Ultra & Gen5 NVMe',
      },
      {
        id: 'kpi-supply-utilization',
        label: 'Warehouse Capacity',
        value: '84.6%',
        delta: '+4.1%',
        trend: 'up',
        tone: 'warning',
        icon: React.createElement(Package, { size: 16 }),
        sparklineData: [68, 70, 74, 76, 79, 82, 85],
        subtitle: 'Istanbul, Zurich, Tokyo & Singapore hubs',
      },
      {
        id: 'kpi-supply-fulfillment',
        label: 'On-Time Dispatch SLA',
        value: '98.7%',
        delta: '+1.9%',
        trend: 'up',
        tone: 'success',
        icon: React.createElement(Truck, { size: 16 }),
        sparklineData: [92, 94, 95, 96, 97, 98, 99],
        subtitle: '30-day hardware logistics velocity',
      },
    ],
  },
};

