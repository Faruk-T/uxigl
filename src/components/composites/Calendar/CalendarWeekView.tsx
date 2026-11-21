import React, { useState } from 'react';
import { Check, MapPin } from 'lucide-react';
import {
  CALENDAR_HOURS,
  CATEGORY_META,
  formatHourLabel,
  formatTimeRange,
  getWeekDays,
  toIsoDate,
} from './calendarUtils';
import type { CalendarTaskEvent } from './types';

export interface CalendarWeekViewProps {
  anchorDate: Date;
  events: CalendarTaskEvent[];
  locale: 'tr' | 'en';
  onSlotClick: (dateIso: string, hour: number) => void;
  onEditEvent: (event: CalendarTaskEvent) => void;
  onMoveEventToSlot: (eventId: string, nextDateIso: string, nextHour: number) => void;
}

const HOUR_ROW_HEIGHT = 54;

export const CalendarWeekView: React.FC<CalendarWeekViewProps> = ({
  anchorDate,
  events,
  locale,
  onSlotClick,
  onEditEvent,
  onMoveEventToSlot,
}) => {
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);
  const weekDays = getWeekDays(anchorDate);
  const todayIso = toIsoDate(new Date());
  const now = new Date();
  const nowMinutesFromStart = (now.getHours() - 7) * 60 + now.getMinutes();
  const showNowLine = nowMinutesFromStart >= 0 && nowMinutesFromStart <= 16 * 60;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid var(--uxu-border-subtle)',
        borderRadius: 'var(--uxu-radius-lg)',
        backgroundColor: 'var(--uxu-bg-elevated)',
        overflow: 'hidden',
        flex: 1,
      }}
    >
      {/* Sticky Day Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '64px repeat(7, minmax(0, 1fr))',
          borderBottom: '1px solid var(--uxu-border-subtle)',
          backgroundColor: 'var(--uxu-surface-tonal)',
        }}
      >
        <div
          style={{
            padding: '10px 6px',
            fontSize: '0.68rem',
            fontWeight: 700,
            color: 'var(--uxu-text-muted)',
            textAlign: 'center',
          }}
        >
          {locale === 'tr' ? 'SAAT' : 'TIME'}
        </div>
        {weekDays.map((day) => {
          const iso = toIsoDate(day);
          const isToday = iso === todayIso;
          const weekdayLabel = day.toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
            weekday: 'short',
          });
          return (
            <div
              key={iso}
              style={{
                padding: '8px 6px',
                borderLeft: '1px solid var(--uxu-border-subtle)',
                textAlign: 'center',
                backgroundColor: isToday ? 'var(--uxu-primary-container)' : 'transparent',
              }}
            >
              <div
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: isToday ? 'var(--uxu-on-primary-container)' : 'var(--uxu-text-secondary)',
                }}
              >
                {weekdayLabel}
              </div>
              <div
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: isToday ? 'var(--uxu-primary)' : 'var(--uxu-text-primary)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {day.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Scrollable Hourly Grid */}
      <div style={{ overflowY: 'auto', maxHeight: 540, position: 'relative' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '64px repeat(7, minmax(0, 1fr))',
            position: 'relative',
          }}
        >
          {/* Current Time Indicator */}
          {showNowLine && (
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: 64,
                right: 0,
                top: (nowMinutesFromStart / 60) * HOUR_ROW_HEIGHT,
                borderTop: '2px solid var(--uxu-danger)',
                zIndex: 8,
                pointerEvents: 'none',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: -5,
                  top: -5,
                  width: 8,
                  height: 8,
                  borderRadius: '9999px',
                  backgroundColor: 'var(--uxu-danger)',
                }}
              />
            </div>
          )}

          {/* Left Time Axis */}
          <div>
            {CALENDAR_HOURS.map((hour) => (
              <div
                key={hour}
                style={{
                  height: HOUR_ROW_HEIGHT,
                  padding: '4px 8px 0 0',
                  textAlign: 'right',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: 'var(--uxu-text-muted)',
                  borderBottom: '1px solid var(--uxu-border-subtle)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {formatHourLabel(hour)}
              </div>
            ))}
          </div>

          {/* 7 Day Columns */}
          {weekDays.map((day) => {
            const iso = toIsoDate(day);
            const dayEvents = events.filter((e) => e.date === iso);

            return (
              <div
                key={iso}
                style={{
                  position: 'relative',
                  borderLeft: '1px solid var(--uxu-border-subtle)',
                }}
              >
                {CALENDAR_HOURS.map((hour) => {
                  const slotKey = `${iso}__${hour}`;
                  const isDragOver = dragOverSlot === slotKey;
                  return (
                    <div
                      key={slotKey}
                      data-slot-key={slotKey}
                      onClick={() => onSlotClick(iso, hour)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (dragOverSlot !== slotKey) setDragOverSlot(slotKey);
                      }}
                      onDragLeave={() => {
                        if (dragOverSlot === slotKey) setDragOverSlot(null);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragOverSlot(null);
                        const eventId = e.dataTransfer.getData('text/plain');
                        if (eventId) onMoveEventToSlot(eventId, iso, hour);
                      }}
                      style={{
                        height: HOUR_ROW_HEIGHT,
                        borderBottom: '1px solid var(--uxu-border-subtle)',
                        backgroundColor: isDragOver
                          ? 'var(--uxu-primary-container)'
                          : 'transparent',
                        outline: isDragOver ? '1.5px dashed var(--uxu-primary)' : 'none',
                        cursor: 'pointer',
                        transition: 'background-color 120ms ease',
                      }}
                    />
                  );
                })}

                {/* Positioned Event Blocks */}
                {dayEvents.map((ev) => {
                  const meta = CATEGORY_META[ev.category];
                  const topPx =
                    ((ev.startHour - 7) * 60 + ev.startMinute) *
                    (HOUR_ROW_HEIGHT / 60);
                  const heightPx = Math.max(
                    26,
                    ev.durationMinutes * (HOUR_ROW_HEIGHT / 60) - 3
                  );

                  return (
                    <div
                      key={ev.id}
                      draggable
                      data-calendar-event-id={ev.id}
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', ev.id);
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditEvent(ev);
                      }}
                      style={{
                        position: 'absolute',
                        top: topPx + 1,
                        left: 4,
                        right: 4,
                        height: heightPx,
                        padding: '4px 7px',
                        borderRadius: 'var(--uxu-radius-sm)',
                        backgroundColor: meta.softBg,
                        borderLeft: `3px solid ${meta.color}`,
                        borderTop: '1px solid var(--uxu-border-subtle)',
                        borderRight: '1px solid var(--uxu-border-subtle)',
                        borderBottom: '1px solid var(--uxu-border-subtle)',
                        backdropFilter: 'blur(8px)',
                        color: 'var(--uxu-text-primary)',
                        cursor: 'grab',
                        overflow: 'hidden',
                        zIndex: 5,
                        opacity: ev.completed ? 0.68 : 1,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          lineHeight: 1.2,
                          textDecoration: ev.completed ? 'line-through' : 'none',
                        }}
                      >
                        {ev.completed && <Check size={11} color={meta.color} />}
                        <span
                          style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {ev.title}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: '0.64rem',
                          color: 'var(--uxu-text-secondary)',
                          marginTop: 2,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {formatTimeRange(ev.startHour, ev.startMinute, ev.durationMinutes)}
                      </div>
                      {ev.location && heightPx >= 52 && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3,
                            fontSize: '0.62rem',
                            color: 'var(--uxu-text-muted)',
                            marginTop: 2,
                          }}
                        >
                          <MapPin size={10} />
                          <span>{ev.location}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

