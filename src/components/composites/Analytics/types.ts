import type React from 'react';

export type AnalyticsPeriod = '24h' | '7d' | '30d' | '1y';

export type AnalyticsChartType = 'area' | 'bar';

export interface AnalyticsKpi {
  id: string;
  label: string;
  value: string;
  delta?: string;
  trend?: 'up' | 'down' | 'neutral';
  tone?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  sparklineData?: number[];
  subtitle?: string;
}

export interface AnalyticsSeriesPoint {
  label: string;
  primary: number;
  secondary?: number;
}

export interface AnalyticsBreakdownItem {
  id: string;
  label: string;
  value: string;
  sharePct: number;
  color: string;
}

export interface AnalyticsDataset {
  kpis: AnalyticsKpi[];
  series: AnalyticsSeriesPoint[];
  channels: AnalyticsBreakdownItem[];
  devices: AnalyticsBreakdownItem[];
}

export interface AnalyticsProps {
  /** Controlled active period (`'24h' | '7d' | '30d' | '1y'`). */
  period?: AnalyticsPeriod;
  /** Controlled period change handler. */
  onPeriodChange?: (period: AnalyticsPeriod) => void;
  /** Initial period when uncontrolled (default `'30d'`). */
  defaultPeriod?: AnalyticsPeriod;
  /** Optional custom dataset overriding the built-in period seed data. */
  dataset?: AnalyticsDataset;
  /** Display locale (`'tr' | 'en'`, default `'tr'`). */
  locale?: 'tr' | 'en';
  /** Optional title override. */
  title?: string;
  /** Optional subtitle override. */
  subtitle?: string;
  /** Callback when export action is clicked. */
  onExport?: (period: AnalyticsPeriod, dataset: AnalyticsDataset) => void;
  className?: string;
  style?: React.CSSProperties;
}
