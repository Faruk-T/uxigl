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
  const showMiniCalendar = theme.width >= 360 && theme.height >= 170;
  const clockColWidth = showMiniCalendar ? (theme.width - 40) * 0.46 : theme.width - 26;
  const isCompact = !showMiniCalendar && clockColWidth >= theme.height * 1.45;
  const dialSize = isCompact
    ? Math.round(Math.max(58, Math.min(theme.height - 28, clockColWidth * 0.36, 152)))
    : Math.round(Math.max(72, Math.min(clockColWidth - 24, theme.height * (showMiniCalendar ? 0.46 : 0.50), 184)));
  const digitalScale = Math.max(
    0.85,
    Math.min(1.55, showMiniCalendar ? theme.scale * 0.88 : theme.scale)
  );

  // Build current month calendar grid (Monday-first)
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const todayDate = now.getDate();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const monthLabel = now.toLocaleDateString(theme.isTR ? 'tr-TR' : 'en-US', {
    month: 'long',
    year: 'numeric',
  });
  const weekdays = theme.isTR
    ? ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pa']
    : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  const cells: { day: number; inMonth: boolean; isToday: boolean }[] = [];
  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, inMonth: false, isToday: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, inMonth: true, isToday: d === todayDate });
  }
  while (cells.length < 42) {
    cells.push({
      day: cells.length - (startOffset + daysInMonth) + 1,
      inMonth: false,
      isToday: false,
    });
  }

  const calScale = Math.max(0.9, Math.min(1.35, theme.scale * 0.92));

  return (
    <div style={{ ...theme.cardStyle, position: 'relative' }}>
      {!showMiniCalendar && (
        <button
          type="button"
          onClick={onOpenCalendar}
          title={theme.isTR ? 'Takvimi Aç' : 'Open Calendar'}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 2,
            width: Math.round(30 * Math.min(1.25, theme.scale)),
            height: Math.round(30 * Math.min(1.25, theme.scale)),
            borderRadius: 9,
            border: 'none',
            backgroundColor: theme.subtleBg,
            color: theme.primaryColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Calendar size={Math.round(15 * Math.min(1.25, theme.scale))} />
        </button>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: showMiniCalendar ? '1fr 1.15fr' : '1fr',
          alignItems: 'center',
          gap: showMiniCalendar ? 14 : 0,
          width: '100%',
          height: '100%',
          minHeight: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            minWidth: 0,
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
              width: '100%',
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
              padding: 0,
              gap: Math.round(8 * Math.min(1.35, theme.scale)),
              justifyContent: 'center',
            }}
          />
        </div>

        {showMiniCalendar && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
              minWidth: 0,
              minHeight: 0,
              paddingLeft: 12,
              borderLeft: `1px solid ${theme.subtleBorder}`,
              gap: Math.round(5 * calScale),
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 6,
              }}
            >
              <span
                style={{
                  fontSize: Math.round(12.5 * calScale),
                  fontWeight: 700,
                  textTransform: 'capitalize',
                  letterSpacing: '-0.01em',
                }}
              >
                {monthLabel}
              </span>
              <button
                type="button"
                onClick={onOpenCalendar}
                title={theme.isTR ? 'Takvimi Aç' : 'Open Calendar'}
                style={{
                  width: Math.round(26 * calScale),
                  height: Math.round(26 * calScale),
                  borderRadius: 8,
                  border: 'none',
                  backgroundColor: theme.subtleBg,
                  color: theme.primaryColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <Calendar size={Math.round(13.5 * calScale)} />
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                gap: 2,
                textAlign: 'center',
              }}
            >
              {weekdays.map((wd) => (
                <div
                  key={wd}
                  style={{
                    fontSize: Math.round(9.5 * calScale),
                    fontWeight: 700,
                    opacity: 0.55,
                    paddingBottom: 2,
                  }}
                >
                  {wd}
                </div>
              ))}
              {cells.map((cell, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={onOpenCalendar}
                  style={{
                    border: 'none',
                    borderRadius: 6,
                    padding: `${Math.round(3 * calScale)}px 0`,
                    fontSize: Math.round(10.5 * calScale),
                    fontWeight: cell.isToday ? 800 : 500,
                    fontVariantNumeric: 'tabular-nums',
                    backgroundColor: cell.isToday ? theme.primaryColor : 'transparent',
                    color: cell.isToday ? '#ffffff' : 'inherit',
                    opacity: cell.inMonth || cell.isToday ? 1 : 0.3,
                    cursor: 'pointer',
                    lineHeight: 1.2,
                  }}
                >
                  {cell.day}
                </button>
              ))}
            </div>
          </div>
        )}
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

