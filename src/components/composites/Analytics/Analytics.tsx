import React, { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '../../primitives/Button/Button';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import { StatCard } from '../StatCard/StatCard';
import { AnalyticsBreakdownCard } from './AnalyticsBreakdownCard';
import { AnalyticsChartCard } from './AnalyticsChartCard';
import { buildAnalyticsDataset } from './analyticsUtils';
import type { AnalyticsPeriod, AnalyticsProps } from './types';

/**
 * ============================================================================
 * uxiGL COMPOSITE — MODULAR ANALYTICS & TELEMETRY SUITE
 * ============================================================================
 * SOLID Architecture:
 * - analyticsUtils: pure period dataset builders
 * - AnalyticsChartCard: interactive SVG Area/Bar chart with hover tooltips
 * - AnalyticsBreakdownCard: reusable channel/device share breakdown card
 * - Analytics: period orchestration, KPI StatCard strip & export trigger
 */
export const Analytics: React.FC<AnalyticsProps> = ({
  period: controlledPeriod,
  onPeriodChange,
  defaultPeriod = '30d',
  dataset: customDataset,
  locale = 'tr',
  title,
  subtitle,
  onExport,
  className = '',
  style,
}) => {
  const isTR = locale === 'tr';
  const [internalPeriod, setInternalPeriod] = useState<AnalyticsPeriod>(defaultPeriod);

  const period = controlledPeriod ?? internalPeriod;

  const handlePeriodChange = (next: AnalyticsPeriod) => {
    if (controlledPeriod === undefined) {
      setInternalPeriod(next);
    }
    onPeriodChange?.(next);
  };

  const dataset = useMemo(
    () => customDataset ?? buildAnalyticsDataset(period, locale),
    [customDataset, period, locale]
  );

  return (
    <div
      className={`uxu-analytics-module ${className}`.trim()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        width: '100%',
        ...style,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            {title ?? (isTR ? 'Analitik & Büyüme Özeti' : 'Analytics & Growth Overview')}
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: 'var(--uxu-text-secondary)' }}>
            {subtitle ??
              (isTR
                ? 'Gelir eğilimi, ziyaretçi trafiği ve kanal dağılımı metrikleri'
                : 'Revenue trends, visitor traffic, and channel breakdown metrics')}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <SegmentedControl<AnalyticsPeriod>
            size="sm"
            value={period}
            onChange={handlePeriodChange}
            options={[
              { value: '24h', label: '24s' },
              { value: '7d', label: isTR ? '7 Gün' : '7D' },
              { value: '30d', label: isTR ? '30 Gün' : '30D' },
              { value: '1y', label: isTR ? '1 Yıl' : '1Y' },
            ]}
          />
          {onExport && (
            <Button
              type="button"
              variant="tonal"
              size="sm"
              leadingIcon={<Download size={14} />}
              onClick={() => onExport(period, dataset)}
            >
              {isTR ? 'Dışa Aktar' : 'Export'}
            </Button>
          )}
        </div>
      </div>

      {/* KPI Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: 12,
        }}
      >
        {dataset.kpis.map((kpi) => (
          <StatCard
            key={kpi.id}
            id={kpi.id}
            label={kpi.label}
            value={kpi.value}
            delta={kpi.delta}
            trend={kpi.trend}
            tone={kpi.tone}
            sparklineData={kpi.sparklineData}
            subtitle={kpi.subtitle}
          />
        ))}
      </div>

      {/* Chart + Breakdowns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 16,
        }}
      >
        <AnalyticsChartCard
          title={isTR ? 'Gelir & Trafik Eğilimi ($K)' : 'Revenue & Traffic Trend ($K)'}
          subtitle={isTR ? 'Seçili dönem performansı' : 'Selected period performance'}
          series={dataset.series}
          locale={locale}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <AnalyticsBreakdownCard
            title={isTR ? 'Trafik Kaynakları' : 'Traffic Channels'}
            items={dataset.channels}
          />
          <AnalyticsBreakdownCard
            title={isTR ? 'Cihaz Dağılımı' : 'Device Breakdown'}
            items={dataset.devices}
          />
        </div>
      </div>
    </div>
  );
};
