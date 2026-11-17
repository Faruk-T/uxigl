// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { StatCard } from '../../src/components/composites/StatCard/StatCard';

describe('StatCard', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders label, value, delta, subtitle, and custom icon', () => {
    render(
      <StatCard
        id="kpi-revenue"
        label="Total Revenue"
        value="$4,820,450"
        delta="+18.4%"
        subtitle="vs. previous 30-day cycle"
        icon={<span data-testid="custom-kpi-icon">$</span>}
      />
    );

    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('$4,820,450')).toBeInTheDocument();
    expect(screen.getByText('+18.4%')).toBeInTheDocument();
    expect(screen.getByText('vs. previous 30-day cycle')).toBeInTheDocument();
    expect(screen.getByTestId('custom-kpi-icon')).toBeInTheDocument();
  });

  it('applies semantic tone and trend delta modifier classes accurately', () => {
    const { container, rerender } = render(
      <StatCard
        label="Latency"
        value="8.4 ms"
        delta="-14.2%"
        trend="up"
        tone="success"
        className="custom-stat-card"
      />
    );

    const card = container.querySelector('.uxu-stat-card');
    const delta = container.querySelector('.uxu-stat-card__delta');
    expect(card).toHaveClass('uxu-stat-card--success', 'custom-stat-card');
    expect(delta).toHaveClass('uxu-stat-card__delta--up');

    rerender(
      <StatCard
        label="Error Rate"
        value="1.2%"
        delta="+0.4%"
        trend="down"
        tone="danger"
      />
    );
    expect(container.querySelector('.uxu-stat-card')).toHaveClass(
      'uxu-stat-card--danger'
    );
    expect(container.querySelector('.uxu-stat-card__delta')).toHaveClass(
      'uxu-stat-card__delta--down'
    );

    rerender(
      <StatCard
        label="Active Nodes"
        value="150"
        delta="0.0%"
        trend="neutral"
        tone="info"
      />
    );
    expect(container.querySelector('.uxu-stat-card')).toHaveClass(
      'uxu-stat-card--info'
    );
    expect(container.querySelector('.uxu-stat-card__delta')).toHaveClass(
      'uxu-stat-card__delta--neutral'
    );
  });

  it('renders the SVG sparkline polyline when sparklineData has > 1 points and omits it for <= 1 point', () => {
    const { container, rerender } = render(
      <StatCard
        label="Cluster RPS"
        value="1.42M"
        sparklineData={[10, 50, 100]}
      />
    );

    const svg = container.querySelector('svg.uxu-stat-card__sparkline');
    const polyline = svg?.querySelector('polyline');
    expect(svg).not.toBeNull();
    expect(polyline).not.toBeNull();
    expect(polyline?.getAttribute('points')).toBeTruthy();

    rerender(
      <StatCard label="Single Point" value="42" sparklineData={[42]} />
    );
    expect(container.querySelector('svg.uxu-stat-card__sparkline')).toBeNull();
  });
});
