import React, { useMemo, useState } from 'react';
import { Card } from '../../components/composites/Card/Card';
import { SegmentedControl } from '../../components/composites/SegmentedControl/SegmentedControl';
import { StatCard } from '../../components/composites/StatCard/StatCard';
import { Badge } from '../../components/primitives/Badge/Badge';
import {
  SheetGLGridAdapter,
  SHEETGL_PRESET_META,
  type SheetGLDatasetPreset,
} from '../../components/composites/SheetGLGridAdapter/SheetGLGridAdapter';
import {
  PRESET_SEGMENT_OPTIONS,
  SCENARIO_TELEMETRY_CONFIG,
  type ScenarioTelemetryConfig,
  type TelemetryKpiConfig,
} from './analyticsTelemetryConfig';

export {
  PRESET_SEGMENT_OPTIONS,
  SCENARIO_TELEMETRY_CONFIG,
  type ScenarioTelemetryConfig,
  type TelemetryKpiConfig,
};

/** Props contract for {@link AnalyticsDashboardView}. */
export interface AnalyticsDashboardViewProps {
  /** Initial active telemetry scenario preset (defaults to `'finance-erp'`). */
  initialPreset?: SheetGLDatasetPreset;
  /** Initial row count for the embedded SheetGL DataGrid (defaults to `150`). */
  initialRowCount?: number;
  /** Optional custom CSS class name. */
  className?: string;
  /** Optional inline style overrides. */
  style?: React.CSSProperties;
}

const VIEW_STYLES = {
  root: { display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  headerTitleGroup: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  headerTitleRow: { display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' },
  heading: { margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--uxu-text-primary)' },
  subtitle: { margin: 0, fontSize: '0.875rem', color: 'var(--uxu-text-secondary)' },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '1rem',
    width: '100%',
  },
  cardFullWidth: { width: '100%' },
} satisfies Record<string, React.CSSProperties>;

/**
 * Interactive multi-scenario enterprise analytics and financial telemetry dashboard view.
 *
 * Synchronizes a 3-card KPI `<StatCard />` strip, live operational status badges, and
 * the hardware-accelerated `<SheetGLGridAdapter />` across four canonical enterprise
 * scenarios (`'finance-erp'`, `'cloud-telemetry'`, `'hr-payroll'`, and `'inventory-supply'`).
 *
 * @param props - {@link AnalyticsDashboardViewProps} configuration options.
 * @returns Rendered multi-scenario analytics and telemetry dashboard view.
 *
 * @example
 * ```tsx
 * import { AnalyticsDashboardView } from 'truncgil-uxigl';
 *
 * export function TelemetryScreen() {
 *   return <AnalyticsDashboardView initialPreset="finance-erp" initialRowCount={150} />;
 * }
 * ```
 */
export const AnalyticsDashboardView: React.FC<AnalyticsDashboardViewProps> = ({
  initialPreset = 'finance-erp',
  initialRowCount = 150,
  className = '',
  style,
}) => {
  const [activePreset, setActivePreset] =
    useState<SheetGLDatasetPreset>(initialPreset);

  const presetMeta = SHEETGL_PRESET_META[activePreset];
  const activeTelemetry = SCENARIO_TELEMETRY_CONFIG[activePreset];

  const rootStyle = useMemo<React.CSSProperties>(
    () => (style ? { ...VIEW_STYLES.root, ...style } : VIEW_STYLES.root),
    [style]
  );

  return (
    <div
      className={`uxu-analytics-dashboard-view ${className}`.trim()}
      style={rootStyle}
    >
      <header style={VIEW_STYLES.header}>
        <div style={VIEW_STYLES.headerTitleGroup}>
          <div style={VIEW_STYLES.headerTitleRow}>
            <h1 style={VIEW_STYLES.heading}>
              Analytics &amp; Financial Telemetry
            </h1>
            <Badge
              tone={activeTelemetry.badgeTone}
              variant="tonal"
              size="sm"
              pulse
            >
              {activeTelemetry.badgeLabel}
            </Badge>
          </div>
          <p style={VIEW_STYLES.subtitle}>
            {presetMeta.label} — {presetMeta.description}
          </p>
        </div>

        <SegmentedControl<SheetGLDatasetPreset>
          id="analytics-scenario-switcher"
          value={activePreset}
          onChange={setActivePreset}
          options={PRESET_SEGMENT_OPTIONS}
          size="sm"
        />
      </header>

      <div className="uxu-kpi-grid" style={VIEW_STYLES.kpiGrid}>
        {activeTelemetry.kpis.map((kpi) => (
          <StatCard
            key={kpi.id}
            id={kpi.id}
            label={kpi.label}
            value={kpi.value}
            delta={kpi.delta}
            trend={kpi.trend}
            tone={kpi.tone}
            icon={kpi.icon}
            sparklineData={kpi.sparklineData}
            subtitle={kpi.subtitle}
          />
        ))}
      </div>

      <Card
        variant="glass"
        padding="lg"
        title={`Enterprise Telemetry Grid — ${presetMeta.shortLabel}`}
        subtitle={`${presetMeta.label} (${presetMeta.description})`}
        headerAction={
          <Badge tone={activeTelemetry.badgeTone} variant="glass" size="sm">
            {activeTelemetry.complianceTag}
          </Badge>
        }
        style={VIEW_STYLES.cardFullWidth}
      >
        <SheetGLGridAdapter
          datasetPreset={activePreset}
          initialRowCount={initialRowCount}
          showControlBar
        />
      </Card>
    </div>
  );
};

export default AnalyticsDashboardView;
