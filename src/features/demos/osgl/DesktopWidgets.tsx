import React from 'react';
import type { DesktopWidgetId, QualityMode } from './types';
import {
  ClockWidgetCard,
  DashboardKpiWidgetCard,
  SystemStatusWidgetCard,
  type WidgetThemeStyle,
} from './widgets/widgetCards';
import {
  FocusTimerWidgetCard,
  QuickNotesWidgetCard,
} from './widgets/widgetProductivityCards';
import { TodoWidgetCard } from './widgets/TodoWidgetCard';

export function DesktopWidgets({
  locale,
  isDark,
  glassOpacity,
  glassBlur,
  primaryColor,
  qualityMode,
  setQualityMode,
  openWindowCount,
  enabledWidgets,
  onOpenApp,
}: {
  locale: 'tr' | 'en';
  isDark: boolean;
  glassOpacity: number;
  glassBlur: number;
  primaryColor: string;
  qualityMode: QualityMode;
  setQualityMode: (q: QualityMode) => void;
  openWindowCount: number;
  enabledWidgets: Record<DesktopWidgetId, boolean>;
  onOpenApp: (id: string) => void;
}) {
  const theme: WidgetThemeStyle = {
    isTR: locale === 'tr',
    isDark,
    primaryColor,
    subtleBorder: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.10)',
    subtleBg: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.05)',
    cardStyle: {
      borderRadius: 16,
      padding: 13,
      backgroundColor: isDark
        ? `rgba(15, 23, 42, ${glassOpacity})`
        : `rgba(255, 255, 255, ${glassOpacity})`,
      color: isDark ? '#f8fafc' : '#0f172a',
      backdropFilter: glassBlur > 0 ? `blur(${glassBlur}px) saturate(160%)` : undefined,
      WebkitBackdropFilter: glassBlur > 0 ? `blur(${glassBlur}px) saturate(160%)` : undefined,
      border: isDark ? '1px solid rgba(255, 255, 255, 0.14)' : '1px solid rgba(255, 255, 255, 0.65)',
      boxShadow: isDark ? '0 14px 34px rgba(0, 0, 0, 0.34)' : '0 14px 34px rgba(15, 23, 42, 0.14)',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    },
  };

  return (
    <aside
      className="macosgl-scroll"
      onMouseDown={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        top: 14,
        right: 16,
        bottom: 84,
        width: 274,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 11,
        zIndex: 85,
        paddingRight: 2,
      }}
    >
      {enabledWidgets.clock && (
        <ClockWidgetCard theme={theme} onOpenCalendar={() => onOpenApp('calendar')} />
      )}
      {enabledWidgets.kpi && (
        <DashboardKpiWidgetCard theme={theme} onOpenApp={onOpenApp} />
      )}
      {enabledWidgets.timer && <FocusTimerWidgetCard theme={theme} />}
      {enabledWidgets.todo && <TodoWidgetCard theme={theme} />}
      {enabledWidgets.notes && <QuickNotesWidgetCard theme={theme} />}
      {enabledWidgets.system && (
        <SystemStatusWidgetCard
          theme={theme}
          qualityMode={qualityMode}
          setQualityMode={setQualityMode}
          openWindowCount={openWindowCount}
          glassBlur={glassBlur}
        />
      )}
    </aside>
  );
}
