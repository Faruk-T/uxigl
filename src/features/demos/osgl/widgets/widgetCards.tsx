import React, { useEffect, useState } from 'react';
import { Activity, Calendar, TrendingUp } from 'lucide-react';
import type { QualityMode } from '../types';

export interface WidgetThemeStyle {
  cardStyle: React.CSSProperties;
  subtleBorder: string;
  subtleBg: string;
  primaryColor: string;
  isDark: boolean;
  isTR: boolean;
}

export function ClockWidgetCard({
  theme,
  onOpenCalendar,
}: {
  theme: WidgetThemeStyle;
  onOpenCalendar: () => void;
}) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = now.toLocaleTimeString(theme.isTR ? 'tr-TR' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const dateStr = now.toLocaleDateString(theme.isTR ? 'tr-TR' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

  return (
    <div style={theme.cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>
            {timeStr}
          </div>
          <div style={{ fontSize: 11.5, opacity: 0.72, marginTop: 4, textTransform: 'capitalize' }}>
            {dateStr}
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenCalendar}
          title={theme.isTR ? 'Takvimi Aç' : 'Open Calendar'}
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            border: 'none',
            backgroundColor: theme.subtleBg,
            color: theme.primaryColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Calendar size={17} />
        </button>
      </div>
    </div>
  );
}

export function DashboardKpiWidgetCard({
  theme,
  onOpenApp,
}: {
  theme: WidgetThemeStyle;
  onOpenApp: (id: string) => void;
}) {
  const { isTR, isDark, primaryColor, subtleBg, subtleBorder, cardStyle } = theme;
  const bars = [
    { d: isTR ? 'Pzt' : 'M', h: 48 },
    { d: isTR ? 'Sal' : 'T', h: 68 },
    { d: isTR ? 'Çar' : 'W', h: 56 },
    { d: isTR ? 'Per' : 'T', h: 86 },
    { d: isTR ? 'Cum' : 'F', h: 94 },
    { d: isTR ? 'Cmt' : 'S', h: 62 },
    { d: isTR ? 'Paz' : 'S', h: 74 },
  ];

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700 }}>
          <TrendingUp size={14} color={primaryColor} />
          <span>{isTR ? 'Gelir & KPI Özeti' : 'Revenue & KPIs'}</span>
        </span>
        <button
          type="button"
          onClick={() => onOpenApp('overview')}
          style={{
            border: 'none',
            backgroundColor: subtleBg,
            color: primaryColor,
            fontSize: 10.5,
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 999,
            cursor: 'pointer',
          }}
        >
          Dashboard
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>$4,820,450</div>
          <div style={{ fontSize: 11, color: '#10b981', fontWeight: 700, marginTop: 2 }}>
            +18.4%{' '}
            <span style={{ opacity: 0.7, color: isDark ? '#cbd5e1' : '#475569', fontWeight: 500 }}>
              {isTR ? 'bu ay' : 'this mo'}
            </span>
          </div>
        </div>
        <svg width="84" height="30" viewBox="0 0 84 30" style={{ flexShrink: 0 }}>
          <polyline
            fill="none"
            stroke={primaryColor}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points="2,24 16,20 28,22 42,12 56,15 70,7 82,4"
          />
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11 }}>
        <div style={{ padding: '5px 8px', borderRadius: 8, backgroundColor: subtleBg }}>
          <div style={{ opacity: 0.65 }}>{isTR ? 'Aktif Hesap' : 'Active Accounts'}</div>
          <div style={{ fontSize: 13.5, fontWeight: 800, marginTop: 1 }}>28,490</div>
        </div>
        <div style={{ padding: '5px 8px', borderRadius: 8, backgroundColor: subtleBg }}>
          <div style={{ opacity: 0.65 }}>{isTR ? 'SLA Uyumu' : 'SLA Uptime'}</div>
          <div style={{ fontSize: 13.5, fontWeight: 800, marginTop: 1, color: '#10b981' }}>99.99%</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 5, height: 34, paddingTop: 4 }}>
        {bars.map((bar, i) => (
          <div
            key={i}
            onClick={() => onOpenApp('analytics')}
            title={`${bar.d}: ${bar.h}%`}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '100%',
                height: `${Math.round((bar.h / 100) * 20)}px`,
                borderRadius: 4,
                backgroundColor: i === 4 ? primaryColor : subtleBg,
                border: i === 4 ? 'none' : `1px solid ${subtleBorder}`,
              }}
            />
            <span style={{ fontSize: 9.5, opacity: 0.65 }}>{bar.d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SystemStatusWidgetCard({
  theme,
  qualityMode,
  setQualityMode,
  openWindowCount,
  glassBlur,
}: {
  theme: WidgetThemeStyle;
  qualityMode: QualityMode;
  setQualityMode: (q: QualityMode) => void;
  openWindowCount: number;
  glassBlur: number;
}) {
  const { isTR, primaryColor, subtleBg, subtleBorder, cardStyle } = theme;
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700 }}>
          <Activity size={14} color={primaryColor} />
          <span>{isTR ? 'Sistem Özeti' : 'System Status'}</span>
        </span>
        <button
          type="button"
          onClick={() => setQualityMode(qualityMode === 'quality' ? 'performance' : 'quality')}
          style={{
            border: `1px solid ${subtleBorder}`,
            backgroundColor: subtleBg,
            color: 'inherit',
            fontSize: 10.5,
            fontWeight: 700,
            padding: '2px 7px',
            borderRadius: 999,
            cursor: 'pointer',
          }}
        >
          {qualityMode === 'quality' ? (isTR ? 'Kalite' : 'Quality') : isTR ? 'Hafif' : 'Lite'}
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 11 }}>
        <div style={{ padding: '6px 8px', borderRadius: 9, backgroundColor: subtleBg }}>
          <div style={{ opacity: 0.65 }}>{isTR ? 'Açık Pencere' : 'Open Windows'}</div>
          <div style={{ fontSize: 15, fontWeight: 800, marginTop: 2 }}>{openWindowCount}</div>
        </div>
        <div style={{ padding: '6px 8px', borderRadius: 9, backgroundColor: subtleBg }}>
          <div style={{ opacity: 0.65 }}>{isTR ? 'Cam Bulanıklığı' : 'Glass Blur'}</div>
          <div style={{ fontSize: 15, fontWeight: 800, marginTop: 2 }}>{glassBlur}px</div>
        </div>
      </div>
    </div>
  );
}

