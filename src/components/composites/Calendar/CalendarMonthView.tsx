import React, { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import {
  CATEGORY_META,
  getMonthGridDays,
  toIsoDate,
} from './calendarUtils';
import type { CalendarTaskEvent } from './types';

export interface CalendarMonthViewProps {
  anchorDate: Date;
  selectedDateIso: string;
  events: CalendarTaskEvent[];
  locale: 'tr' | 'en';
  onSelectDay: (iso: string) => void;
  onQuickAddDay: (iso: string) => void;
  onEditEvent: (event: CalendarTaskEvent) => void;
  onMoveEvent: (eventId: string, nextDateIso: string) => void;
}

export const CalendarMonthView: React.FC<CalendarMonthViewProps> = ({
  anchorDate,
  selectedDateIso,
  events,
  locale,
  onSelectDay,
  onQuickAddDay,
  onEditEvent,
  onMoveEvent,
}) => {
  const [dragOverIso, setDragOverIso] = useState<string | null>(null);
  const todayIso = toIsoDate(new Date());
  const gridDays = getMonthGridDays(anchorDate);
  const activeMonth = anchorDate.getMonth();

  const weekdayNames =
    locale === 'tr'
      ? ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
      : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
      {/* Weekday Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          gap: 6,
        }}
      >
        {weekdayNames.map((dayName) => (
          <div
            key={dayName}
            style={{
              textAlign: 'center',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--uxu-text-secondary)',
              padding: '4px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* 6×7 Month Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          gap: 6,
          flex: 1,
        }}
      >
        {gridDays.map((day) => {
          const iso = toIsoDate(day);
          const isCurrentMonth = day.getMonth() === activeMonth;
          const isToday = iso === todayIso;
          const isSelected = iso === selectedDateIso;
          const isDragOver = dragOverIso === iso;
          const dayEvents = events
            .filter((e) => e.date === iso)
            .sort((a, b) => a.startHour * 60 + a.startMinute - (b.startHour * 60 + b.startMinute));

          return (
            <div
              key={iso}
              data-calendar-day={iso}
              onClick={() => onSelectDay(iso)}
              onDragOver={(e) => {
                e.preventDefault();
                if (dragOverIso !== iso) setDragOverIso(iso);
              }}
              onDragLeave={() => {
                if (dragOverIso === iso) setDragOverIso(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverIso(null);
                const eventId = e.dataTransfer.getData('text/plain');
                if (eventId) onMoveEvent(eventId, iso);
              }}
              style={{
                minHeight: 92,
                padding: '6px 7px',
                borderRadius: 'var(--uxu-radius-md)',
                border: isDragOver
                  ? '1.5px dashed var(--uxu-primary)'
                  : isSelected
                    ? '1.5px solid var(--uxu-primary)'
                    : '1px solid var(--uxu-border-subtle)',
                background: isDragOver
                  ? 'var(--uxu-primary-container)'
                  : isSelected
                    ? 'color-mix(in srgb, var(--uxu-primary) 7%, var(--uxu-surface-tonal))'
                    : isCurrentMonth
                      ? 'var(--uxu-bg-elevated)'
                      : 'var(--uxu-surface-tonal)',
                opacity: isCurrentMonth ? 1 : 0.56,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                cursor: 'pointer',
                transition: 'border-color 140ms ease, background 140ms ease',
              }}
            >
              {/* Day Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '9999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.76rem',
                    fontWeight: isToday || isSelected ? 700 : 600,
                    backgroundColor: isToday ? 'var(--uxu-primary)' : 'transparent',
                    color: isToday ? 'var(--uxu-on-primary)' : 'var(--uxu-text-primary)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {day.getDate()}
                </span>

                <button
                  type="button"
                  aria-label={`Add task on ${iso}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickAddDay(iso);
                  }}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: 'var(--uxu-text-muted)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={12} />
                </button>
              </div>

              {/* Event Pills */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {dayEvents.slice(0, 3).map((ev) => {
                  const meta = CATEGORY_META[ev.category];
                  return (
                    <div
                      key={ev.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', ev.id);
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditEvent(ev);
                      }}
                      title={`${ev.title} (${String(ev.startHour).padStart(2, '0')}:${String(ev.startMinute).padStart(2, '0')})`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '2px 6px',
                        borderRadius: 6,
                        backgroundColor: meta.softBg,
                        borderLeft: `2.5px solid ${meta.color}`,
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        color: 'var(--uxu-text-primary)',
                        cursor: 'grab',
                        overflow: 'hidden',
                        textDecoration: ev.completed ? 'line-through' : 'none',
                        opacity: ev.completed ? 0.68 : 1,
                      }}
                    >
                      {ev.completed && <Check size={10} color={meta.color} style={{ flexShrink: 0 }} />}
                      <span
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {String(ev.startHour).padStart(2, '0')}:{String(ev.startMinute).padStart(2, '0')} {ev.title}
                      </span>
                    </div>
                  );
                })}
                {dayEvents.length > 3 && (
                  <div
                    style={{
                      fontSize: '0.66rem',
                      fontWeight: 700,
                      color: 'var(--uxu-primary)',
                      paddingLeft: 4,
                    }}
                  >
                    +{dayEvents.length - 3} {locale === 'tr' ? 'daha' : 'more'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

