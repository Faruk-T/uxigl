import React from 'react';
import { Card } from '../Card/Card';
import type { AnalyticsBreakdownItem } from './types';

export interface AnalyticsBreakdownCardProps {
  title: string;
  subtitle?: string;
  items: AnalyticsBreakdownItem[];
}

export const AnalyticsBreakdownCard: React.FC<AnalyticsBreakdownCardProps> = ({
  title,
  subtitle,
  items,
}) => {
  return (
    <Card variant="glass" padding="md" title={title} subtitle={subtitle}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((item) => (
          <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8rem',
              }}
            >
              <span style={{ fontWeight: 600 }}>{item.label}</span>
              <span style={{ color: 'var(--uxu-text-secondary)', fontWeight: 600 }}>
                {item.value} ({item.sharePct}%)
              </span>
            </div>
            <div
              style={{
                height: 7,
                borderRadius: 999,
                background: 'var(--uxu-surface-tonal)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${Math.max(0, Math.min(100, item.sharePct))}%`,
                  height: '100%',
                  borderRadius: 999,
                  background: item.color,
                  transition: 'width 220ms ease',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
