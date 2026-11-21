import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
} from 'lucide-react';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import { AnalogDigitalClock } from '../Clock/AnalogDigitalClock';
import {
  addDays,
  buildSeedCalendarEvents,
  CATEGORY_META,
  getMonthGridDays,
  parseIsoDate,
  toIsoDate,
} from './calendarUtils';
import { CalendarMonthView } from './CalendarMonthView';
import { CalendarWeekView } from './CalendarWeekView';
import { CalendarAgendaView, CalendarDayView } from './CalendarDayAgendaViews';
import { CalendarTaskModal } from './CalendarTaskModal';
import type {
  CalendarCategory,
  CalendarProps,
  CalendarTaskEvent,
  CalendarViewMode,
} from './types';

/**
 * ============================================================================
 * uxiGL — FULL-FEATURED MODULAR CALENDAR & SCHEDULER COMPOSITE
 * ============================================================================
 * Supports Month, Week, Day, and Agenda views, live Analog & Digital Clock,
 * task creation/editing/deletion, category filtering, and HTML5 Drag & Drop
 * rescheduling across days and hours.
 */
export const Calendar: React.FC<CalendarProps> = ({
  events: controlledEvents,
  onEventsChange,
  initialEvents,
  defaultView = 'week',
  defaultDate,
  locale = 'tr',
  showClock = true,
  storageKey,
  onEventClick,
  className = '',
  style,
}) => {
  const isTR = locale === 'tr';

  const [internalEvents, setInternalEvents] = useState<CalendarTaskEvent[]>(() => {
    if (storageKey && typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch {
        // ignore malformed storage
      }
    }
    return initialEvents ?? buildSeedCalendarEvents();
  });

  const events = controlledEvents ?? internalEvents;

  const commitEvents = useCallback(
    (updater: (prev: CalendarTaskEvent[]) => CalendarTaskEvent[]) => {
      if (controlledEvents !== undefined) {
        onEventsChange?.(updater(controlledEvents));
      } else {
        setInternalEvents((prev) => {
          const next = updater(prev);
          if (storageKey && typeof window !== 'undefined') {
            try {
              window.localStorage.setItem(storageKey, JSON.stringify(next));
            } catch {
              // ignore storage quota errors
            }
          }
          onEventsChange?.(next);
          return next;
        });
      }
    },
    [controlledEvents, onEventsChange, storageKey]
  );

  const [viewMode, setViewMode] = useState<CalendarViewMode>(defaultView);
  const [anchorDate, setAnchorDate] = useState<Date>(() =>
    defaultDate ? parseIsoDate(defaultDate) : new Date()
  );
  const [selectedDateIso, setSelectedDateIso] = useState<string>(() =>
    defaultDate ?? toIsoDate(new Date())
  );
  const [activeCategory, setActiveCategory] = useState<CalendarCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [draftEvent, setDraftEvent] = useState<Partial<CalendarTaskEvent>>({});

  useEffect(() => {
    if (defaultDate) {
      setAnchorDate(parseIsoDate(defaultDate));
      setSelectedDateIso(defaultDate);
    }
  }, [defaultDate]);

  const filteredEvents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return events.filter((ev) => {
      const catOk = activeCategory === 'all' || ev.category === activeCategory;
      const queryOk =
        !q ||
        ev.title.toLowerCase().includes(q) ||
        (ev.location?.toLowerCase().includes(q) ?? false);
      return catOk && queryOk;
    });
  }, [events, activeCategory, searchQuery]);

  const handleShiftPeriod = (direction: -1 | 1) => {
    if (viewMode === 'month') {
      setAnchorDate(
        (prev) => new Date(prev.getFullYear(), prev.getMonth() + direction, 1)
      );
    } else if (viewMode === 'week') {
      setAnchorDate((prev) => addDays(prev, direction * 7));
    } else {
      const next = addDays(anchorDate, direction);
      setAnchorDate(next);
      setSelectedDateIso(toIsoDate(next));
    }
  };

  const handleGoToday = () => {
    const today = new Date();
    setAnchorDate(today);
    setSelectedDateIso(toIsoDate(today));
  };

  const handleOpenCreateModal = (dateIso = selectedDateIso, hour = 9) => {
    setEditingEventId(null);
    setDraftEvent({
      title: '',
      date: dateIso,
      startHour: hour,
      startMinute: 0,
      durationMinutes: 60,
      category: 'work',
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (ev: CalendarTaskEvent) => {
    onEventClick?.(ev);
    setEditingEventId(ev.id);
    setDraftEvent(ev);
    setModalOpen(true);
  };

  const handleSaveTask = (
    payload: Omit<CalendarTaskEvent, 'id'>,
    editingId?: string | null
  ) => {
    if (editingId) {
      commitEvents((prev) =>
        prev.map((ev) => (ev.id === editingId ? { ...payload, id: editingId } : ev))
      );
    } else {
      commitEvents((prev) => [
        ...prev,
        { ...payload, id: `cal-ev-${Date.now()}` },
      ]);
    }
  };

  const handleDeleteTask = (id: string) => {
    commitEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  const handleToggleComplete = (id: string) => {
    commitEvents((prev) =>
      prev.map((ev) =>
        ev.id === id ? { ...ev, completed: !ev.completed } : ev
      )
    );
  };

  const handleMoveEventToDate = (eventId: string, nextDateIso: string) => {
    commitEvents((prev) =>
      prev.map((ev) => (ev.id === eventId ? { ...ev, date: nextDateIso } : ev))
    );
  };

  const handleMoveEventToSlot = (
    eventId: string,
    nextDateIso: string,
    nextHour: number
  ) => {
    commitEvents((prev) =>
      prev.map((ev) =>
        ev.id === eventId
          ? { ...ev, date: nextDateIso, startHour: nextHour }
          : ev
      )
    );
  };

  const periodHeading = anchorDate.toLocaleDateString(
    isTR ? 'tr-TR' : 'en-US',
    viewMode === 'day'
      ? { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
      : { month: 'long', year: 'numeric' }
  );

  const miniDays = getMonthGridDays(anchorDate);
  const todayIso = toIsoDate(new Date());

  return (
    <div
      className={`uxu-calendar-studio ${className}`.trim()}
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(230px, 260px) minmax(0, 1fr)',
        gap: 16,
        padding: 16,
        borderRadius: 'var(--uxu-radius-lg)',
        border: '1px solid var(--uxu-border-subtle)',
        background: 'var(--uxu-surface-glass)',
        backdropFilter: 'blur(var(--uxu-glass-blur))',
        color: 'var(--uxu-text-primary)',
        fontFamily: 'var(--uxu-font-sans)',
        ...style,
      }}
    >
      <style>{`
        @media (max-width: 960px) {
          .uxu-calendar-studio {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* Left Sidebar: Live Analog + Digital Clock, Quick Add, Mini Month, Categories */}
      <aside style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {showClock && (
          <AnalogDigitalClock
            size={126}
            locale={locale}
            variant="tonal"
            showSeconds
            showDate
            showFormatToggle
          />
        )}

        <button
          type="button"
          onClick={() => handleOpenCreateModal(selectedDateIso, 9)}
          style={{
            height: 38,
            borderRadius: 'var(--uxu-radius-md)',
            border: 'none',
            backgroundColor: 'var(--uxu-primary)',
            color: 'var(--uxu-on-primary)',
            fontSize: '0.84rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            cursor: 'pointer',
          }}
        >
          <Plus size={16} />
          <span>{isTR ? 'Yeni Görev / Etkinlik' : 'New Task / Event'}</span>
        </button>

        {/* Mini Month Navigator */}
        <div
          style={{
            padding: 12,
            borderRadius: 'var(--uxu-radius-md)',
            border: '1px solid var(--uxu-border-subtle)',
            backgroundColor: 'var(--uxu-surface-tonal)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'capitalize',
            }}
          >
            <span>
              {anchorDate.toLocaleDateString(isTR ? 'tr-TR' : 'en-US', {
                month: 'short',
                year: 'numeric',
              })}
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                type="button"
                aria-label="Previous month"
                onClick={() =>
                  setAnchorDate(
                    (p) => new Date(p.getFullYear(), p.getMonth() - 1, 1)
                  )
                }
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  border: '1px solid var(--uxu-border-subtle)',
                  backgroundColor: 'var(--uxu-bg-elevated)',
                  color: 'var(--uxu-text-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <ChevronLeft size={13} />
              </button>
              <button
                type="button"
                aria-label="Next month"
                onClick={() =>
                  setAnchorDate(
                    (p) => new Date(p.getFullYear(), p.getMonth() + 1, 1)
                  )
                }
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  border: '1px solid var(--uxu-border-subtle)',
                  backgroundColor: 'var(--uxu-bg-elevated)',
                  color: 'var(--uxu-text-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 2,
              textAlign: 'center',
              fontSize: '0.66rem',
            }}
          >
            {(isTR
              ? ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz']
              : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
            ).map((d) => (
              <div
                key={d}
                style={{
                  fontWeight: 700,
                  color: 'var(--uxu-text-muted)',
                  paddingBottom: 4,
                }}
              >
                {d}
              </div>
            ))}
            {miniDays.map((d) => {
              const iso = toIsoDate(d);
              const isToday = iso === todayIso;
              const isSelected = iso === selectedDateIso;
              const inMonth = d.getMonth() === anchorDate.getMonth();
              const hasEvent = events.some((ev) => ev.date === iso);
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => {
                    setSelectedDateIso(iso);
                    setAnchorDate(d);
                  }}
                  style={{
                    height: 24,
                    borderRadius: 6,
                    border: 'none',
                    backgroundColor: isToday
                      ? 'var(--uxu-primary)'
                      : isSelected
                        ? 'var(--uxu-primary-container)'
                        : 'transparent',
                    color: isToday
                      ? 'var(--uxu-on-primary)'
                      : inMonth
                        ? 'var(--uxu-text-primary)'
                        : 'var(--uxu-text-muted)',
                    fontSize: '0.7rem',
                    fontWeight: isToday || isSelected ? 700 : 500,
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  {d.getDate()}
                  {hasEvent && !isToday && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 2,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 3,
                        height: 3,
                        borderRadius: '9999px',
                        backgroundColor: 'var(--uxu-primary)',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Filters */}
        <div
          style={{
            padding: 12,
            borderRadius: 'var(--uxu-radius-md)',
            border: '1px solid var(--uxu-border-subtle)',
            backgroundColor: 'var(--uxu-surface-tonal)',
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
          }}
        >
          <div
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--uxu-text-muted)',
              marginBottom: 2,
            }}
          >
            {isTR ? 'Kategoriler' : 'Categories'}
          </div>
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '5px 8px',
              borderRadius: 7,
              border: 'none',
              backgroundColor:
                activeCategory === 'all' ? 'var(--uxu-primary-container)' : 'transparent',
              color:
                activeCategory === 'all'
                  ? 'var(--uxu-on-primary-container)'
                  : 'var(--uxu-text-primary)',
              fontSize: '0.76rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <span>{isTR ? 'Tümü' : 'All'}</span>
            <span>{events.length}</span>
          </button>
          {(Object.keys(CATEGORY_META) as CalendarCategory[]).map((cat) => {
            const meta = CATEGORY_META[cat];
            const count = events.filter((e) => e.category === cat).length;
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '5px 8px',
                  borderRadius: 7,
                  border: 'none',
                  backgroundColor: active ? meta.softBg : 'transparent',
                  color: 'var(--uxu-text-primary)',
                  fontSize: '0.76rem',
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '9999px',
                      backgroundColor: meta.color,
                    }}
                  />
                  <span>{isTR ? meta.labelTr : meta.labelEn}</span>
                </span>
                <span style={{ color: 'var(--uxu-text-muted)', fontSize: '0.72rem' }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Calendar Stage */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
        {/* Toolbar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              onClick={handleGoToday}
              style={{
                height: 32,
                padding: '0 12px',
                borderRadius: 'var(--uxu-radius-sm)',
                border: '1px solid var(--uxu-border-subtle)',
                backgroundColor: 'var(--uxu-bg-elevated)',
                color: 'var(--uxu-text-primary)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isTR ? 'Bugün' : 'Today'}
            </button>
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                type="button"
                aria-label="Previous period"
                onClick={() => handleShiftPeriod(-1)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--uxu-radius-sm)',
                  border: '1px solid var(--uxu-border-subtle)',
                  backgroundColor: 'var(--uxu-bg-elevated)',
                  color: 'var(--uxu-text-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <ChevronLeft size={15} />
              </button>
              <button
                type="button"
                aria-label="Next period"
                onClick={() => handleShiftPeriod(1)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--uxu-radius-sm)',
                  border: '1px solid var(--uxu-border-subtle)',
                  backgroundColor: 'var(--uxu-bg-elevated)',
                  color: 'var(--uxu-text-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <ChevronRight size={15} />
              </button>
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: '1.05rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                textTransform: 'capitalize',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
              }}
            >
              <CalendarIcon size={17} color="var(--uxu-primary)" />
              <span>{periodHeading}</span>
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <div
              style={{
                height: 32,
                padding: '0 10px',
                borderRadius: 'var(--uxu-radius-sm)',
                border: '1px solid var(--uxu-border-subtle)',
                backgroundColor: 'var(--uxu-surface-tonal)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Search size={14} color="var(--uxu-text-muted)" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isTR ? 'Görev ara...' : 'Search tasks...'}
                aria-label={isTR ? 'Takvimde ara' : 'Search calendar'}
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: 'var(--uxu-text-primary)',
                  fontSize: '0.78rem',
                  width: 120,
                }}
              />
            </div>

            <SegmentedControl<CalendarViewMode>
              size="sm"
              value={viewMode}
              onChange={setViewMode}
              options={[
                { value: 'month', label: isTR ? 'Ay' : 'Month' },
                { value: 'week', label: isTR ? 'Hafta' : 'Week' },
                { value: 'day', label: isTR ? 'Gün' : 'Day' },
                { value: 'agenda', label: isTR ? 'Ajanda' : 'Agenda' },
              ]}
            />
          </div>
        </div>

        {/* Drag & Drop Hint Bar */}
        <div
          style={{
            fontSize: '0.74rem',
            color: 'var(--uxu-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <span>
            {isTR
              ? 'İpucu: Bir görevi sürükleyip başka bir saate veya güne bırakarak taşıyabilir, boş bir saat dilimine tıklayarak yeni görev ekleyebilirsiniz.'
              : 'Tip: Drag and drop any task onto another hour or day to reschedule, or click any empty slot to add a task.'}
          </span>
        </div>

        {/* Active Calendar View */}
        {viewMode === 'month' && (
          <CalendarMonthView
            anchorDate={anchorDate}
            selectedDateIso={selectedDateIso}
            events={filteredEvents}
            locale={locale}
            onSelectDay={(iso) => {
              setSelectedDateIso(iso);
              setAnchorDate(parseIsoDate(iso));
            }}
            onQuickAddDay={(iso) => handleOpenCreateModal(iso, 9)}
            onEditEvent={handleOpenEditModal}
            onMoveEvent={handleMoveEventToDate}
          />
        )}

        {viewMode === 'week' && (
          <CalendarWeekView
            anchorDate={anchorDate}
            events={filteredEvents}
            locale={locale}
            onSlotClick={(iso, hr) => handleOpenCreateModal(iso, hr)}
            onEditEvent={handleOpenEditModal}
            onMoveEventToSlot={handleMoveEventToSlot}
          />
        )}

        {viewMode === 'day' && (
          <CalendarDayView
            selectedDateIso={selectedDateIso}
            events={filteredEvents}
            locale={locale}
            onSlotClick={(iso, hr) => handleOpenCreateModal(iso, hr)}
            onEditEvent={handleOpenEditModal}
            onMoveEventToSlot={handleMoveEventToSlot}
          />
        )}

        {viewMode === 'agenda' && (
          <CalendarAgendaView
            events={filteredEvents}
            locale={locale}
            onEditEvent={handleOpenEditModal}
            onToggleComplete={handleToggleComplete}
            onDeleteEvent={handleDeleteTask}
          />
        )}
      </div>

      {/* Add / Edit Task Modal */}
      <CalendarTaskModal
        open={modalOpen}
        locale={locale}
        initialDraft={draftEvent}
        editingEventId={editingEventId}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
};

