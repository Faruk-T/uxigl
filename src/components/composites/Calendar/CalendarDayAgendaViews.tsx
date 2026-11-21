import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, MapPin, Trash2 } from 'lucide-react';
import {
  CALENDAR_HOURS,
  CATEGORY_META,
  formatHourLabel,
  formatTimeRange,
  parseIsoDate,
} from './calendarUtils';
import type { CalendarTaskEvent } from './types';

export interface CalendarDayViewProps {
  selectedDateIso: string;
  events: CalendarTaskEvent[];
  locale: 'tr' | 'en';
  onSlotClick: (dateIso: string, hour: number) => void;
  onEditEvent: (event: CalendarTaskEvent) => void;
  onMoveEventToSlot: (eventId: string, nextDateIso: string, nextHour: number) => void;
}

export const CalendarDayView: React.FC<CalendarDayViewProps> = ({
  selectedDateIso,
  events,
  locale,
  onSlotClick,
  onEditEvent,
  onMoveEventToSlot,
}) => {
  const [dragOverHour, setDragOverHour] = useState<number | null>(null);
  const dayEvents = events.filter((e) => e.date === selectedDateIso);

  return (
    <div
      style={{
        border: '1px solid var(--uxu-border-subtle)',
        borderRadius: 'var(--uxu-radius-lg)',
        backgroundColor: 'var(--uxu-bg-elevated)',
        overflowY: 'auto',
        maxHeight: 560,
        flex: 1,
      }}
    >
      {CALENDAR_HOURS.map((hour) => {
        const slotEvents = dayEvents.filter((e) => e.startHour === hour);
        const isOver = dragOverHour === hour;
        return (
          <div
            key={hour}
            onClick={() => onSlotClick(selectedDateIso, hour)}
            onDragOver={(e) => {
              e.preventDefault();
              if (dragOverHour !== hour) setDragOverHour(hour);
            }}
            onDragLeave={() => {
              if (dragOverHour === hour) setDragOverHour(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragOverHour(null);
              const eventId = e.dataTransfer.getData('text/plain');
              if (eventId) onMoveEventToSlot(eventId, selectedDateIso, hour);
            }}
            style={{
              display: 'grid',
              gridTemplateColumns: '76px minmax(0, 1fr)',
              minHeight: 54,
              borderBottom: '1px solid var(--uxu-border-subtle)',
              backgroundColor: isOver ? 'var(--uxu-primary-container)' : 'transparent',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                padding: '8px 12px',
                fontSize: '0.74rem',
                fontWeight: 600,
                color: 'var(--uxu-text-muted)',
                borderRight: '1px solid var(--uxu-border-subtle)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {formatHourLabel(hour)}
            </div>
            <div style={{ padding: '6px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {slotEvents.map((ev) => {
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
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--uxu-radius-md)',
                      backgroundColor: meta.softBg,
                      borderLeft: `3.5px solid ${meta.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                      cursor: 'grab',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '0.84rem',
                          fontWeight: 700,
                          textDecoration: ev.completed ? 'line-through' : 'none',
                        }}
                      >
                        {ev.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--uxu-text-secondary)', marginTop: 2 }}>
                        {formatTimeRange(ev.startHour, ev.startMinute, ev.durationMinutes)}
                        {ev.location ? ` · ${ev.location}` : ''}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 9999,
                        backgroundColor: 'var(--uxu-bg-elevated)',
                        color: meta.color,
                      }}
                    >
                      {locale === 'tr' ? meta.labelTr : meta.labelEn}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export interface CalendarAgendaViewProps {
  events: CalendarTaskEvent[];
  locale: 'tr' | 'en';
  onEditEvent: (event: CalendarTaskEvent) => void;
  onToggleComplete: (eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
}

export const CalendarAgendaView: React.FC<CalendarAgendaViewProps> = ({
  events,
  locale,
  onEditEvent,
  onToggleComplete,
  onDeleteEvent,
}) => {
  const sorted = [...events].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startHour * 60 + a.startMinute - (b.startHour * 60 + b.startMinute);
  });

  if (sorted.length === 0) {
    return (
      <div
        style={{
          padding: 36,
          textAlign: 'center',
          borderRadius: 'var(--uxu-radius-lg)',
          border: '1px solid var(--uxu-border-subtle)',
          backgroundColor: 'var(--uxu-surface-tonal)',
          color: 'var(--uxu-text-secondary)',
          fontSize: '0.88rem',
        }}
      >
        {locale === 'tr'
          ? 'Filtreye uygun planlanmış görev bulunmuyor.'
          : 'No scheduled tasks match the current filter.'}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
      {sorted.map((ev) => {
        const meta = CATEGORY_META[ev.category];
        const dateLabel = parseIsoDate(ev.date).toLocaleDateString(
          locale === 'tr' ? 'tr-TR' : 'en-US',
          { weekday: 'short', day: 'numeric', month: 'short' }
        );
        return (
          <div
            key={ev.id}
            onClick={() => onEditEvent(ev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              padding: '12px 14px',
              borderRadius: 'var(--uxu-radius-md)',
              border: '1px solid var(--uxu-border-subtle)',
              borderLeft: `4px solid ${meta.color}`,
              backgroundColor: 'var(--uxu-bg-elevated)',
              cursor: 'pointer',
              opacity: ev.completed ? 0.68 : 1,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <button
                type="button"
                aria-label="Toggle completed"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleComplete(ev.id);
                }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: ev.completed ? 'var(--uxu-success)' : 'var(--uxu-text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'inline-flex',
                }}
              >
                {ev.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
              </button>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    textDecoration: ev.completed ? 'line-through' : 'none',
                  }}
                >
                  {ev.title}
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: '0.74rem',
                    color: 'var(--uxu-text-secondary)',
                    marginTop: 3,
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} />
                    {dateLabel} · {formatTimeRange(ev.startHour, ev.startMinute, ev.durationMinutes)}
                  </span>
                  {ev.location && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={12} />
                      {ev.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '2px 9px',
                  borderRadius: 9999,
                  backgroundColor: meta.softBg,
                  color: meta.color,
                }}
              >
                {locale === 'tr' ? meta.labelTr : meta.labelEn}
              </span>
              <button
                type="button"
                aria-label={`Delete ${ev.title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteEvent(ev.id);
                }}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  border: '1px solid var(--uxu-border-subtle)',
                  backgroundColor: 'var(--uxu-surface-tonal)',
                  color: 'var(--uxu-danger)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

