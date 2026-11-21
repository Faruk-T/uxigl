import React from 'react';
import { Activity, Calendar, TrendingUp } from 'lucide-react';
import { AnalogDigitalClock } from '../../../../components/composites/Clock/AnalogDigitalClock';
import type { QualityMode } from '../types';

export interface WidgetThemeStyle {
  cardStyle: React.CSSProperties;
  subtleBorder: string;
  subtleBg: string;
  primaryColor: string;
  isDark: boolean;
  isTR: boolean;
  width: number;
  height: number;
  scale: number;
}

export function ClockWidgetCard({
  theme,
  onOpenCalendar,
}: {
  theme: WidgetThemeStyle;
  onOpenCalendar: () => void;
}) {
  const isCompact = theme.width >= theme.height * 1.45;
  const dialSize = isCompact
    ? Math.round(Math.max(58, Math.min(theme.height - 28, theme.width * 0.34, 156)))
    : Math.round(Math.max(76, Math.min(theme.width - 56, theme.height * 0.50, 196)));
  const digitalScale = Math.max(0.88, Math.min(1.65, theme.scale));

  return (
    <div style={theme.cardStyle}>
      <div
        style={{
          display: 'flex',
          alignItems: isCompact ? 'center' : 'flex-start',
          justifyContent: 'space-between',
          gap: 8,
          height: '100%',
          minHeight: 0,
        }}
      >
        <AnalogDigitalClock
          size={dialSize}
          compact={isCompact}
          scale={digitalScale}
          showSeconds
          showDate
          showFormatToggle
          locale={theme.isTR ? 'tr' : 'en'}
          variant="glass"
          style={{
            flex: 1,
            minWidth: 0,
            height: '100%',
            background: 'transparent',
            border: 'none',
            boxShadow: 'none',
            padding: 0,
            gap: Math.round(10 * Math.min(1.4, theme.scale)),
            justifyContent: isCompact ? 'flex-start' : 'center',
          }}
        />
        <button
          type="button"
          onClick={onOpenCalendar}
          title={theme.isTR ? 'Takvimi Aç' : 'Open Calendar'}
          style={{
            width: Math.round(32 * Math.min(1.3, theme.scale)),
            height: Math.round(32 * Math.min(1.3, theme.scale)),
            flexShrink: 0,
            borderRadius: 10,
            border: 'none',
            backgroundColor: theme.subtleBg,
            color: theme.primaryColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            alignSelf: 'flex-start',
          }}
        >
          <Calendar size={Math.round(16 * Math.min(1.3, theme.scale))} />
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
  const { isTR, isDark, primaryColor, subtleBg, subtleBorder, cardStyle, scale } = theme;
  const s = Math.max(0.88, Math.min(1.65, scale));
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: Math.round(12 * s), fontWeight: 700 }}>
          <TrendingUp size={Math.round(14 * s)} color={primaryColor} />
          <span>{isTR ? 'Gelir & KPI Özeti' : 'Revenue & KPIs'}</span>
        </span>
        <button
          type="button"
          onClick={() => onOpenApp('overview')}
          style={{
            border: 'none',
            backgroundColor: subtleBg,
            color: primaryColor,
            fontSize: Math.round(10.5 * Math.min(1.3, s)),
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 999,
            cursor: 'pointer',
          }}
        >
          Dashboard
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: Math.round(20 * s), fontWeight: 800, letterSpacing: '-0.02em' }}>$4,820,450</div>
          <div style={{ fontSize: Math.round(11 * Math.min(1.35, s)), color: '#10b981', fontWeight: 700, marginTop: 2 }}>
            +18.4%{' '}
            <span style={{ opacity: 0.7, color: isDark ? '#cbd5e1' : '#475569', fontWeight: 500 }}>
              {isTR ? 'bu ay' : 'this mo'}
            </span>
          </div>
        </div>
        <svg
          width={Math.round(84 * Math.min(1.6, s))}
          height={Math.round(30 * Math.min(1.6, s))}
          viewBox="0 0 84 30"
          style={{ flexShrink: 0 }}
        >
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: Math.round(11 * Math.min(1.3, s)), flexShrink: 0 }}>
        <div style={{ padding: '5px 8px', borderRadius: 8, backgroundColor: subtleBg }}>
          <div style={{ opacity: 0.65 }}>{isTR ? 'Aktif Hesap' : 'Active Accounts'}</div>
          <div style={{ fontSize: Math.round(13.5 * s), fontWeight: 800, marginTop: 1 }}>28,490</div>
        </div>
        <div style={{ padding: '5px 8px', borderRadius: 8, backgroundColor: subtleBg }}>
          <div style={{ opacity: 0.65 }}>{isTR ? 'SLA Uyumu' : 'SLA Uptime'}</div>
          <div style={{ fontSize: Math.round(13.5 * s), fontWeight: 800, marginTop: 1, color: '#10b981' }}>99.99%</div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 36,
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'space-between',
          gap: Math.round(5 * Math.min(1.5, s)),
          paddingTop: 4,
        }}
      >
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
              justifyContent: 'flex-end',
              gap: 3,
              cursor: 'pointer',
              minHeight: 0,
            }}
          >
            <div
              style={{
                width: '100%',
                flex: 1,
                display: 'flex',
                alignItems: 'flex-end',
                minHeight: 16,
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: `${bar.h}%`,
                  borderRadius: 4,
                  backgroundColor: i === 4 ? primaryColor : subtleBg,
                  border: i === 4 ? 'none' : `1px solid ${subtleBorder}`,
                  transition: 'height 150ms ease',
                }}
              />
            </div>
            <span style={{ fontSize: Math.round(9.5 * Math.min(1.25, s)), opacity: 0.65, flexShrink: 0 }}>
              {bar.d}
            </span>
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
  const { isTR, primaryColor, subtleBg, subtleBorder, cardStyle, scale } = theme;
  const s = Math.max(0.88, Math.min(1.65, scale));
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: Math.round(12 * s), fontWeight: 700 }}>
          <Activity size={Math.round(14 * s)} color={primaryColor} />
          <span>{isTR ? 'Sistem Özeti' : 'System Status'}</span>
        </span>
        <button
          type="button"
          onClick={() => setQualityMode(qualityMode === 'quality' ? 'performance' : 'quality')}
          style={{
            border: `1px solid ${subtleBorder}`,
            backgroundColor: subtleBg,
            color: 'inherit',
            fontSize: Math.round(10.5 * Math.min(1.3, s)),
            fontWeight: 700,
            padding: '2px 7px',
            borderRadius: 999,
            cursor: 'pointer',
          }}
        >
          {qualityMode === 'quality' ? (isTR ? 'Kalite' : 'Quality') : isTR ? 'Hafif' : 'Lite'}
        </button>
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: Math.round(11 * Math.min(1.3, s)) }}>
        <div style={{ padding: '6px 8px', borderRadius: 9, backgroundColor: subtleBg, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ opacity: 0.65 }}>{isTR ? 'Açık Pencere' : 'Open Windows'}</div>
          <div style={{ fontSize: Math.round(15 * s), fontWeight: 800, marginTop: 2 }}>{openWindowCount}</div>
        </div>
        <div style={{ padding: '6px 8px', borderRadius: 9, backgroundColor: subtleBg, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ opacity: 0.65 }}>{isTR ? 'Cam Bulanıklığı' : 'Glass Blur'}</div>
          <div style={{ fontSize: Math.round(15 * s), fontWeight: 800, marginTop: 2 }}>{glassBlur}px</div>
        </div>
      </div>
    </div>
  );
}

