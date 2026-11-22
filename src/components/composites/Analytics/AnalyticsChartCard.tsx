import React, { useState } from 'react';
import { BarChart3, LineChart } from 'lucide-react';
import { Card } from '../Card/Card';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import type { AnalyticsChartType, AnalyticsSeriesPoint } from './types';

export interface AnalyticsChartCardProps {
  title: string;
  subtitle: string;
  series: AnalyticsSeriesPoint[];
  locale: 'tr' | 'en';
}

export const AnalyticsChartCard: React.FC<AnalyticsChartCardProps> = ({
  title,
  subtitle,
  series,
  locale,
}) => {
  const isTR = locale === 'tr';
  const [chartType, setChartType] = useState<AnalyticsChartType>('area');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const width = 560;
  const height = 210;
  const padX = 28;
  const padY = 20;
  const plotW = width - padX * 2;
  const plotH = height - padY * 2;

  const maxVal = Math.max(1, ...series.map((s) => s.primary)) * 1.15;

  const points = series.map((s, idx) => {
    const x =
      series.length > 1
        ? padX + (idx / (series.length - 1)) * plotW
        : padX + plotW / 2;
    const y = padY + plotH - (s.primary / maxVal) * plotH;
    return { x, y, item: s };
  });

  const linePath = points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${(padY + plotH).toFixed(1)} L ${points[0].x.toFixed(1)} ${(padY + plotH).toFixed(1)} Z`
      : '';

  const hovered = hoveredIdx !== null ? points[hoveredIdx] : null;

  return (
    <Card
      variant="glass"
      padding="md"
      title={title}
      subtitle={subtitle}
      headerAction={
        <SegmentedControl<AnalyticsChartType>
          size="sm"
          value={chartType}
          onChange={setChartType}
          options={[
            { value: 'area', label: isTR ? 'Alan' : 'Area', icon: <LineChart size={13} /> },
            { value: 'bar', label: isTR ? 'Sütun' : 'Bar', icon: <BarChart3 size={13} /> },
          ]}
        />
      }
    >
      <div style={{ position: 'relative', width: '100%' }}>
        {hovered && (
          <div
            style={{
              position: 'absolute',
              top: 6,
              right: 8,
              padding: '4px 10px',
              borderRadius: 'var(--uxu-radius-sm)',
              background: 'var(--uxu-bg-elevated)',
              border: '1px solid var(--uxu-border-subtle)',
              fontSize: '0.75rem',
              fontWeight: 700,
              pointerEvents: 'none',
            }}
          >
            {hovered.item.label}: ${hovered.item.primary.toFixed(1)}K
          </div>
        )}

        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
          role="img"
          aria-label={title}
        >
          <defs>
            <linearGradient id="uxuAnalyticsAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--uxu-primary)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--uxu-primary)" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid */}
          {[0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padY + plotH * (1 - ratio);
            return (
              <line
                key={ratio}
                x1={padX}
                y1={y}
                x2={width - padX}
                y2={y}
                stroke="var(--uxu-border-subtle)"
                strokeDasharray="3 4"
              />
            );
          })}

          {chartType === 'area' ? (
            <>
              {areaPath && <path d={areaPath} fill="url(#uxuAnalyticsAreaGrad)" />}
              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke="var(--uxu-primary)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              {points.map((p, idx) => (
                <g key={p.item.label}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hoveredIdx === idx ? 5.5 : 3.5}
                    fill="var(--uxu-primary)"
                    stroke="var(--uxu-bg-elevated)"
                    strokeWidth={2}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    style={{ cursor: 'pointer' }}
                  />
                </g>
              ))}
            </>
          ) : (
            points.map((p, idx) => {
              const barW = Math.max(18, Math.min(36, plotW / Math.max(1, series.length) - 14));
              const barH = padY + plotH - p.y;
              return (
                <rect
                  key={p.item.label}
                  x={p.x - barW / 2}
                  y={p.y}
                  width={barW}
                  height={Math.max(2, barH)}
                  rx={6}
                  fill="var(--uxu-primary)"
                  opacity={hoveredIdx === null || hoveredIdx === idx ? 0.88 : 0.45}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{ cursor: 'pointer' }}
                />
              );
            })
          )}

          {/* X Axis Labels */}
          {points.map((p) => (
            <text
              key={`lbl-${p.item.label}`}
              x={p.x}
              y={height - 2}
              textAnchor="middle"
              fontSize="11"
              fill="var(--uxu-text-secondary)"
            >
              {p.item.label}
            </text>
          ))}
        </svg>
      </div>
    </Card>
  );
};
