import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type {
  IdentifiableProps,
  SemanticTone,
} from '../../../core/contracts/ComponentContracts';

/**
 * ============================================================================
 * UXU COMPOSITE — STAT CARD WITH SPARKLINE
 * ============================================================================
 * Apple Health / Fitness metric card blended with Google Analytics sparkline.
 */

export interface StatCardProps extends IdentifiableProps {
  label: string;
  value: string;
  delta?: string;
  trend?: 'up' | 'down' | 'neutral';
  tone?: SemanticTone;
  icon?: React.ReactNode;
  sparklineData?: number[];
  subtitle?: string;
}

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
  sparklineData = [28, 42, 36, 58, 52, 74, 89],
  subtitle,
}) => {
  const maxVal = Math.max(...sparklineData, 1);
  const minVal = Math.min(...sparklineData, 0);
  const range = Math.max(maxVal - minVal, 1);

  const points = sparklineData
    .map((pt, i) => {
      const x = (i / Math.max(sparklineData.length - 1, 1)) * 120;
      const y = 34 - ((pt - minVal) / range) * 28;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div
      id={id}
      className={`uxu-stat-card uxu-stat-card--${tone} ${className}`}
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
