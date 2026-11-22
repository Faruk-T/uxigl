import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Activity, Calendar, Plus, TrendingUp } from 'lucide-react';
import { AnalogDigitalClock } from '../../../../components/composites/Clock/AnalogDigitalClock';
import { CalendarTaskModal } from '../../../../components/composites/Calendar/CalendarTaskModal';
import {
  buildSeedCalendarEvents,
  CATEGORY_META,
  parseIsoDate,
  toIsoDate,
} from '../../../../components/composites/Calendar/calendarUtils';
import type { CalendarTaskEvent } from '../../../../components/composites/Calendar/types';
import type { QualityMode } from '../types';

const OSGL_CALENDAR_STORAGE_KEY = 'uxigl.osgl.calendar.v1';
const OSGL_CALENDAR_SYNC_EVENT = 'uxigl:osgl-calendar-sync';

function loadCalendarEvents(): CalendarTaskEvent[] {
  if (typeof window === 'undefined') return buildSeedCalendarEvents();
  try {
    const raw = window.localStorage.getItem(OSGL_CALENDAR_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as CalendarTaskEvent[];
    }
  } catch {
    // ignore storage errors
  }
  return buildSeedCalendarEvents();
}

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
  const [events, setEvents] = useState<CalendarTaskEvent[]>(() => loadCalendarEvents());
  const todayIso = toIsoDate(new Date());
  const [selectedIso, setSelectedIso] = useState<string>(todayIso);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [draftEvent, setDraftEvent] = useState<Partial<CalendarTaskEvent>>({
    date: todayIso,
    startHour: 9,
    startMinute: 0,
    durationMinutes: 60,
    category: 'work',
  });

  useEffect(() => {
    const sync = () => setEvents(loadCalendarEvents());
    window.addEventListener('storage', sync);
    window.addEventListener(OSGL_CALENDAR_SYNC_EVENT, sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener(OSGL_CALENDAR_SYNC_EVENT, sync);
    };
  }, []);

  const persistEvents = (updater: (prev: CalendarTaskEvent[]) => CalendarTaskEvent[]) => {
    const next = updater(loadCalendarEvents());
    setEvents(next);
    try {
      window.localStorage.setItem(OSGL_CALENDAR_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(OSGL_CALENDAR_SYNC_EVENT));
    } catch {
      // ignore storage errors
    }
  };

  const openCreateModal = (dateIso: string = selectedIso) => {
    setEditingEventId(null);
    setDraftEvent({
      title: '',
      date: dateIso,
      startHour: 10,
      startMinute: 0,
      durationMinutes: 60,
      category: 'work',
      location: '',
      notes: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (ev: CalendarTaskEvent) => {
    setEditingEventId(ev.id);
    setDraftEvent(ev);
    setModalOpen(true);
  };

  const handleSaveEvent = (
    payload: Omit<CalendarTaskEvent, 'id'>,
    editId?: string | null
  ) => {
    if (editId) {
      persistEvents((prev) =>
        prev.map((ev) => (ev.id === editId ? { ...payload, id: editId } : ev))
      );
    } else {
      persistEvents((prev) => [
        ...prev,
        { ...payload, id: `osgl-cal-${Date.now()}` },
      ]);
    }
    setSelectedIso(payload.date);
    setModalOpen(false);
  };

  const handleDeleteEvent = (id: string) => {
    persistEvents((prev) => prev.filter((ev) => ev.id !== id));
    setModalOpen(false);
  };

  const showMiniCalendar = theme.width >= 360 && theme.height >= 170;
  const showDayEvents = theme.width >= 340 && theme.height >= 260;
  const clockAreaHeight = showDayEvents ? Math.round(theme.height * 0.56) : theme.height;
  const clockColWidth = showMiniCalendar ? (theme.width - 40) * 0.46 : theme.width - 26;
  const isCompact = !showMiniCalendar && clockColWidth >= clockAreaHeight * 1.45;
  const dialSize = isCompact
    ? Math.round(Math.max(54, Math.min(clockAreaHeight - 28, clockColWidth * 0.36, 146)))
    : Math.round(
        Math.max(
          68,
          Math.min(
            clockColWidth - 24,
            clockAreaHeight * (showMiniCalendar ? 0.46 : 0.5),
            168
          )
        )
      );
  const digitalScale = Math.max(
    0.84,
    Math.min(1.45, showMiniCalendar ? theme.scale * 0.84 : theme.scale)
  );

  // Build current month calendar grid (Monday-first)
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
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

  const eventCountByIso = events.reduce<Record<string, number>>((acc, ev) => {
    acc[ev.date] = (acc[ev.date] ?? 0) + 1;
    return acc;
  }, {});

  const cells: { iso: string; day: number; inMonth: boolean; isToday: boolean }[] = [];
  for (let i = startOffset - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const iso = toIsoDate(new Date(year, month - 1, d));
    cells.push({ iso, day: d, inMonth: false, isToday: iso === todayIso });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = toIsoDate(new Date(year, month, d));
    cells.push({ iso, day: d, inMonth: true, isToday: iso === todayIso });
  }
  while (cells.length < 42) {
    const d = cells.length - (startOffset + daysInMonth) + 1;
    const iso = toIsoDate(new Date(year, month + 1, d));
    cells.push({ iso, day: d, inMonth: false, isToday: iso === todayIso });
  }

  const calScale = Math.max(0.86, Math.min(1.25, theme.scale * 0.88));
  const selectedDayEvents = events
    .filter((ev) => ev.date === selectedIso)
    .sort((a, b) => a.startHour * 60 + a.startMinute - (b.startHour * 60 + b.startMinute));
  const selectedDayLabel =
    selectedIso === todayIso
      ? theme.isTR
        ? 'Bugün'
        : 'Today'
      : parseIsoDate(selectedIso).toLocaleDateString(theme.isTR ? 'tr-TR' : 'en-US', {
          day: 'numeric',
          month: 'short',
        });

  return (
    <div style={{ ...theme.cardStyle, position: 'relative' }}>
      {!showMiniCalendar && (
        <div
          style={{
            position: 'absolute',
            top: 9,
            right: 9,
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <button
            type="button"
            onClick={onOpenCalendar}
            title={theme.isTR ? 'Takvimi Aç' : 'Open Calendar'}
            style={{
              width: Math.round(28 * Math.min(1.2, theme.scale)),
              height: Math.round(28 * Math.min(1.2, theme.scale)),
              borderRadius: 8,
              border: 'none',
              backgroundColor: theme.subtleBg,
              color: theme.primaryColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Calendar size={Math.round(14 * Math.min(1.2, theme.scale))} />
          </button>
        </div>
      )}

      {/* Top Section: Analog/Digital Clock + Optional Mini Calendar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: showMiniCalendar ? '1fr 1.15fr' : '1fr',
          alignItems: 'center',
          gap: showMiniCalendar ? 14 : 0,
          width: '100%',
          flex: showDayEvents ? '0 0 auto' : '1 1 auto',
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
              gap: Math.round((isCompact ? 14 : 7) * Math.min(1.3, theme.scale)),
              justifyContent: isCompact ? 'space-evenly' : 'center',
            }}
          />
        </div>

        {showMiniCalendar && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minWidth: 0,
              minHeight: 0,
              paddingLeft: 12,
              borderLeft: `1px solid ${theme.subtleBorder}`,
              gap: Math.round(4 * calScale),
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => openCreateModal(selectedIso)}
                  title={theme.isTR ? 'Yeni Etkinlik Ekle' : 'Add Event'}
                  style={{
                    width: Math.round(25 * calScale),
                    height: Math.round(25 * calScale),
                    borderRadius: 7,
                    border: 'none',
                    backgroundColor: theme.primaryColor,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={Math.round(13.5 * calScale)} />
                </button>
                <button
                  type="button"
                  onClick={onOpenCalendar}
                  title={theme.isTR ? 'Takvimi Aç' : 'Open Calendar'}
                  style={{
                    width: Math.round(25 * calScale),
                    height: Math.round(25 * calScale),
                    borderRadius: 7,
                    border: 'none',
                    backgroundColor: theme.subtleBg,
                    color: theme.primaryColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Calendar size={Math.round(13 * calScale)} />
                </button>
              </div>
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
              {cells.map((cell) => {
                const isSelected = cell.iso === selectedIso;
                const hasEvents = (eventCountByIso[cell.iso] ?? 0) > 0;
                return (
                  <button
                    key={cell.iso}
                    type="button"
                    onClick={() => setSelectedIso(cell.iso)}
                    style={{
                      position: 'relative',
                      border: isSelected && !cell.isToday ? `1px solid ${theme.primaryColor}` : '1px solid transparent',
                      borderRadius: 6,
                      padding: `${Math.round(2.5 * calScale)}px 0`,
                      fontSize: Math.round(10.5 * calScale),
                      fontWeight: cell.isToday || isSelected ? 800 : 500,
                      fontVariantNumeric: 'tabular-nums',
                      backgroundColor: cell.isToday
                        ? theme.primaryColor
                        : isSelected
                        ? theme.subtleBg
                        : 'transparent',
                      color: cell.isToday ? '#ffffff' : 'inherit',
                      opacity: cell.inMonth || cell.isToday || isSelected ? 1 : 0.3,
                      cursor: 'pointer',
                      lineHeight: 1.2,
                    }}
                  >
                    {cell.day}
                    {hasEvents && (
                      <span
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          bottom: 1,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 3,
                          height: 3,
                          borderRadius: '50%',
                          backgroundColor: cell.isToday ? '#ffffff' : theme.primaryColor,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section: Selected Day's Events + Add Event Action */}
      {showDayEvents && (
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            paddingTop: 8,
            borderTop: `1px solid ${theme.subtleBorder}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: Math.round(11.5 * calScale), fontWeight: 700 }}>
                {selectedDayLabel}{' '}
                <span style={{ opacity: 0.6, fontWeight: 500 }}>
                  {theme.isTR ? 'Etkinlikleri' : 'Events'}
                </span>
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: 999,
                  backgroundColor: theme.subtleBg,
                  opacity: 0.8,
                }}
              >
                {selectedDayEvents.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => openCreateModal(selectedIso)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '3px 9px',
                borderRadius: 999,
                border: 'none',
                backgroundColor: theme.subtleBg,
                color: theme.primaryColor,
                fontSize: Math.round(10.5 * calScale),
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Plus size={12} />
              <span>{theme.isTR ? 'Yeni Etkinlik' : 'New Event'}</span>
            </button>
          </div>

          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
            }}
          >
            {selectedDayEvents.length === 0 ? (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: Math.round(11 * calScale),
                  opacity: 0.6,
                  padding: '8px 0',
                }}
              >
                {theme.isTR
                  ? 'Bu gün için planlanmış etkinlik yok.'
                  : 'No events scheduled for this day.'}
              </div>
            ) : (
              selectedDayEvents.map((ev) => {
                const cat = CATEGORY_META[ev.category] ?? CATEGORY_META.work;
                const timeStr = `${String(ev.startHour).padStart(2, '0')}:${String(
                  ev.startMinute
                ).padStart(2, '0')}`;
                return (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => openEditModal(ev)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '6px 9px',
                      borderRadius: 9,
                      border: `1px solid ${theme.subtleBorder}`,
                      backgroundColor: theme.subtleBg,
                      color: 'inherit',
                      textAlign: 'left',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        backgroundColor: cat.color,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: Math.round(10.5 * calScale),
                        fontWeight: 700,
                        fontVariantNumeric: 'tabular-nums',
                        opacity: 0.78,
                        flexShrink: 0,
                      }}
                    >
                      {timeStr}
                    </span>
                    <span
                      style={{
                        flex: 1,
                        minWidth: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontSize: Math.round(11.5 * calScale),
                        fontWeight: 600,
                      }}
                    >
                      {ev.title}
                    </span>
                    {ev.location && (
                      <span
                        style={{
                          fontSize: 10,
                          opacity: 0.55,
                          flexShrink: 0,
                          maxWidth: 90,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {ev.location}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {typeof document !== 'undefined' &&
        modalOpen &&
        createPortal(
          <CalendarTaskModal
            open={modalOpen}
            locale={theme.isTR ? 'tr' : 'en'}
            initialDraft={draftEvent}
            editingEventId={editingEventId}
            onClose={() => setModalOpen(false)}
            onSave={handleSaveEvent}
            onDelete={handleDeleteEvent}
          />,
          document.body
        )}
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
                  borderRadius: 5,
                  backgroundColor: i === 4 ? primaryColor : isDark ? 'rgba(255,255,255,0.11)' : subtleBg,
                  border: 'none',
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

