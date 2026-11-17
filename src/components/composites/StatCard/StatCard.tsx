import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type {
  IdentifiableProps,
  SemanticTone,
} from '../../../core/contracts/ComponentContracts';

/**
 * ============================================================================
 * uxiGL COMPOSITE — STAT CARD WITH SPARKLINE
 * ============================================================================
 * Apple Health / Fitness metric card blended with Google Analytics sparkline.
 */

/**
 * Props contract for {@link StatCard}.
 */
export interface StatCardProps extends IdentifiableProps {
  /** Metric title label (e.g. `'Total Revenue'`). */
  label: string;
  /** Primary formatted metric value (e.g. `'$4,820,450'`). */
  value: string;
  /** Optional percentage or absolute delta badge string (e.g. `'+18.4%'`). */
  delta?: string;
  /** Directional trend indicator controlling delta icon and styling (defaults to `'up'`). */
  trend?: 'up' | 'down' | 'neutral';
  /** Semantic color tone applied to the card surface and sparkline (defaults to `'primary'`). */
  tone?: SemanticTone;
  /** Optional leading/top-right metric icon node. */
  icon?: React.ReactNode;
  /** Numeric series plotted as a smooth SVG sparkline (defaults to a 7-point sample series). */
  sparklineData?: number[];
  /** Optional secondary comparison or SLA subtitle text. */
  subtitle?: string;
}

const DEFAULT_SPARKLINE_DATA = [28, 42, 36, 58, 52, 74, 89];

/**
 * Enterprise KPI metric card with memoized SVG sparkline, semantic tone styling,
 * and directional trend delta indicators.
 *
 * @param props - {@link StatCardProps} configuration options.
 * @returns Rendered KPI stat card element.
 */
export const StatCard: React.FC<StatCardProps> = ({
  id,
  className = '',
  style,
  label,
  value,
  delta,
  trend = 'up',
  tone = 'primary',
  icon,
  sparklineData = DEFAULT_SPARKLINE_DATA,
  subtitle,
}) => {
  const points = useMemo(() => {
    if (sparklineData.length <= 1) return '';
    const maxVal = Math.max(...sparklineData, 1);
    const minVal = Math.min(...sparklineData, 0);
    const range = Math.max(maxVal - minVal, 1);

    return sparklineData
      .map((pt, i) => {
        const x = (i / Math.max(sparklineData.length - 1, 1)) * 120;
        const y = 34 - ((pt - minVal) / range) * 28;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [sparklineData]);

  return (
    <div
      id={id}
      className={`uxu-stat-card uxu-stat-card--${tone} ${className}`.trim()}
      style={style}
    >
      <div className="uxu-stat-card__top">
        <span className="uxu-stat-card__label">{label}</span>
        {icon && <div className="uxu-stat-card__icon">{icon}</div>}
      </div>

      <div className="uxu-stat-card__mid">
        <div className="uxu-stat-card__value">{value}</div>
        {sparklineData.length > 1 && (
          <svg
            width="120"
            height="38"
            viewBox="0 0 120 38"
            className="uxu-stat-card__sparkline"
            aria-hidden="true"
          >
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        )}
      </div>

      {(delta || subtitle) && (
        <div className="uxu-stat-card__bottom">
          {delta && (
            <span
              className={`uxu-stat-card__delta uxu-stat-card__delta--${trend}`}
            >
              {trend === 'up' && <TrendingUp size={13} />}
              {trend === 'down' && <TrendingDown size={13} />}
              {delta}
            </span>
          )}
          {subtitle && (
            <span className="uxu-stat-card__subtitle">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
};
