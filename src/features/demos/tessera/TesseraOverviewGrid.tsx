import React from 'react';
import {
  ArrowUpRight,
  Briefcase,
  Clock,
  FileText,
  Info,
  Users,
} from 'lucide-react';
import { TESSERA_SPACING, TESSERA_TYPOGRAPHY } from './theme';
import type {
  TesseraOverviewMetric,
  TesseraOverviewTone,
  TesseraThemeTokens,
  TesseraTimeRangeId,
} from './types';

export interface TesseraOverviewGridProps {
  metrics: TesseraOverviewMetric[];
  timeRange: TesseraTimeRangeId;
  onCycleTimeRange: () => void;
  onMetricClick?: (metric: TesseraOverviewMetric) => void;
  tokens: TesseraThemeTokens;
}

const TONE_COLOR_MAP: Record<TesseraOverviewTone, string> = {
  blue: '#2563EB',
  red: '#DC2626',
  purple: '#7C3AED',
};

const TIME_RANGE_LABEL: Record<TesseraTimeRangeId, string> = {
  '7d': 'Last 7 days',
  '14d': 'Last 14 days',
  '30d': 'Last 30 days',
};

function renderCardIcon(
  kind: TesseraOverviewMetric['iconKind'],
  color: string
): React.ReactNode {
  switch (kind) {
    case 'document':
      return <FileText size={18} fill={color} color={color} strokeWidth={1.6} />;
    case 'briefcase':
      return <Briefcase size={18} fill={color} color={color} strokeWidth={1.6} />;
    case 'users':
      return <Users size={18} fill={color} color={color} strokeWidth={1.6} />;
  }
}

export const TesseraOverviewGrid: React.FC<TesseraOverviewGridProps> = ({
  metrics,
  timeRange,
  onCycleTimeRange,
  onMetricClick,
  tokens,
}) => {
  return (
    <section aria-labelledby="tessera-overview-heading">
      {/* Header Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <h2
          id="tessera-overview-heading"
          style={{
            margin: 0,
            ...TESSERA_TYPOGRAPHY.scale.sectionTitle,
            color: tokens.textPrimary,
          }}
        >
          Overview
        </h2>

        <button
          type="button"
          onClick={onCycleTimeRange}
          title="Switch reporting window"
          style={{
            height: 28,
            padding: '0 10px',
            borderRadius: 7,
            border: `1px solid ${tokens.borderControl}`,
            backgroundColor: tokens.cardBg,
            color: tokens.textSecondary,
            fontSize: 12,
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
          }}
        >
          <Clock size={13} strokeWidth={1.9} color={tokens.textMuted} />
          <span>{TIME_RANGE_LABEL[timeRange]}</span>
        </button>
      </div>

      {/* 3-Card Metric Grid */}
      <div className="tessera-overview-grid">
        {metrics.map((m) => {
          const accent = TONE_COLOR_MAP[m.tone];
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onMetricClick?.(m)}
              style={{
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'left',
                padding: TESSERA_SPACING.cardPadding,
                borderRadius: TESSERA_SPACING.cardRadius,
                border: `1px solid ${tokens.borderCard}`,
                backgroundColor: tokens.cardBg,
                boxShadow: tokens.cardShadow,
                cursor: onMetricClick ? 'pointer' : 'default',
                transition: 'border-color 140ms ease, transform 140ms ease',
              }}
            >
              {/* Soft right-side dot-matrix texture matching the reference UI */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: '48%',
                  backgroundImage: `radial-gradient(${tokens.dotPattern} 1px, transparent 1px)`,
                  backgroundSize: '7px 7px',
                  WebkitMaskImage:
                    'radial-gradient(circle at 75% 50%, rgba(0,0,0,0.85) 0%, transparent 78%)',
                  maskImage:
                    'radial-gradient(circle at 75% 50%, rgba(0,0,0,0.85) 0%, transparent 78%)',
                  pointerEvents: 'none',
                }}
              />

              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: 12.5,
                    fontWeight: 400,
                    color: tokens.textMuted,
                  }}
                >
                  <span>{m.label}</span>
                  <span title={m.tooltip} style={{ display: 'inline-flex', color: tokens.textSubtle }}>
                    <Info size={13} strokeWidth={1.75} />
                  </span>
                </span>

                <span style={{ flexShrink: 0, display: 'inline-flex' }}>
                  {renderCardIcon(m.iconKind, accent)}
                </span>
              </div>

              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
                  margin: '10px 0 8px',
                  ...TESSERA_TYPOGRAPHY.scale.heroMetric,
                  color: tokens.textPrimary,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {m.value}
              </div>

              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 12,
                }}
              >
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: '9999px',
                    backgroundColor:
                      tokens.mode === 'dark' ? 'rgba(22, 163, 74, 0.22)' : '#DCFCE7',
                    color: tokens.mode === 'dark' ? '#4ADE80' : '#16A34A',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <ArrowUpRight size={10.5} strokeWidth={2.5} />
                </span>
                <span
                  style={{
                    color: tokens.mode === 'dark' ? '#4ADE80' : '#16A34A',
                    fontWeight: 600,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {m.deltaLabel}
                </span>
                <span style={{ color: tokens.textMuted }}>{m.deltaSuffix}</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

