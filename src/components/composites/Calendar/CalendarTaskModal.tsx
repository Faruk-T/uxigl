import React, { useEffect, useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { CATEGORY_META } from './calendarUtils';
import type { CalendarCategory, CalendarTaskEvent } from './types';

export interface CalendarTaskModalProps {
  open: boolean;
  locale: 'tr' | 'en';
  initialDraft: Partial<CalendarTaskEvent>;
  editingEventId?: string | null;
  onClose: () => void;
  onSave: (payload: Omit<CalendarTaskEvent, 'id'>, editingId?: string | null) => void;
  onDelete?: (id: string) => void;
}

export const CalendarTaskModal: React.FC<CalendarTaskModalProps> = ({
  open,
  locale,
  initialDraft,
  editingEventId,
  onClose,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startHour, setStartHour] = useState(9);
  const [startMinute, setStartMinute] = useState(0);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [category, setCategory] = useState<CalendarCategory>('work');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!open) return;
    setTitle(initialDraft.title ?? '');
    setDate(initialDraft.date ?? '');
    setStartHour(initialDraft.startHour ?? 9);
    setStartMinute(initialDraft.startMinute ?? 0);
    setDurationMinutes(initialDraft.durationMinutes ?? 60);
    setCategory(initialDraft.category ?? 'work');
    setLocation(initialDraft.location ?? '');
    setNotes(initialDraft.notes ?? '');
  }, [open, initialDraft]);

  if (!open) return null;
  const isTR = locale === 'tr';

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: 36,
    borderRadius: 'var(--uxu-radius-sm)',
    border: '1px solid var(--uxu-border-strong)',
    backgroundColor: 'var(--uxu-surface-tonal)',
    color: 'var(--uxu-text-primary)',
    padding: '0 10px',
    fontSize: '0.84rem',
    fontFamily: 'inherit',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={editingEventId ? (isTR ? 'Görevi Düzenle' : 'Edit Task') : (isTR ? 'Yeni Takvim Görevi' : 'New Calendar Task')}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1200,
        backgroundColor: 'rgba(6, 10, 18, 0.52)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 460,
          borderRadius: 'var(--uxu-radius-lg)',
          border: '1px solid var(--uxu-border-strong)',
          backgroundColor: 'var(--uxu-bg-elevated)',
          boxShadow: 'var(--uxu-shadow-elevated)',
          padding: 20,
          color: 'var(--uxu-text-primary)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 14,
          }}
        >
          <strong style={{ fontSize: '1rem', fontWeight: 700 }}>
            {editingEventId
              ? isTR
                ? 'Görevi Düzenle'
                : 'Edit Task'
              : isTR
                ? 'Yeni Takvim Görevi Ekle'
                : 'Add Calendar Task'}
          </strong>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              border: 'none',
              backgroundColor: 'var(--uxu-surface-tonal)',
              color: 'var(--uxu-text-secondary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={15} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!title.trim() || !date) return;
            onSave(
              {
                title: title.trim(),
                date,
                startHour,
                startMinute,
                durationMinutes,
                category,
                location: location.trim() || undefined,
                notes: notes.trim() || undefined,
                completed: initialDraft.completed,
              },
              editingEventId
            );
            onClose();
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <div>
            <label htmlFor="cal-task-title" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>
              {isTR ? 'Görev Başlığı' : 'Task Title'}
            </label>
            <input
              id="cal-task-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isTR ? 'Örn: Sprint 14 Tasarım İncelemesi' : 'e.g. Sprint 14 Design Review'}
              style={inputStyle}
              autoFocus
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label htmlFor="cal-task-date" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>
                {isTR ? 'Tarih' : 'Date'}
              </label>
              <input
                id="cal-task-date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="cal-task-category" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>
                {isTR ? 'Kategori' : 'Category'}
              </label>
              <select
                id="cal-task-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as CalendarCategory)}
                style={inputStyle}
              >
                {(Object.keys(CATEGORY_META) as CalendarCategory[]).map((cat) => (
                  <option key={cat} value={cat}>
                    {isTR ? CATEGORY_META[cat].labelTr : CATEGORY_META[cat].labelEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <div>
              <label htmlFor="cal-task-hour" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>
                {isTR ? 'Saat' : 'Hour'}
              </label>
              <select
                id="cal-task-hour"
                value={startHour}
                onChange={(e) => setStartHour(Number(e.target.value))}
                style={inputStyle}
              >
                {Array.from({ length: 16 }, (_, i) => i + 7).map((h) => (
                  <option key={h} value={h}>
                    {String(h).padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="cal-task-minute" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>
                {isTR ? 'Dakika' : 'Minute'}
              </label>
              <select
                id="cal-task-minute"
                value={startMinute}
                onChange={(e) => setStartMinute(Number(e.target.value))}
                style={inputStyle}
              >
                {[0, 15, 30, 45].map((m) => (
                  <option key={m} value={m}>
                    :{String(m).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="cal-task-duration" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>
                {isTR ? 'Süre' : 'Duration'}
              </label>
              <select
                id="cal-task-duration"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                style={inputStyle}
              >
                {[30, 45, 60, 90, 120, 180].map((d) => (
                  <option key={d} value={d}>
                    {d} dk
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="cal-task-location" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>
              {isTR ? 'Konum / Bağlantı (Opsiyonel)' : 'Location (Optional)'}
            </label>
            <input
              id="cal-task-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={isTR ? 'Örn: Meet Odası B veya Uzaktan' : 'e.g. Meet Room B'}
              style={inputStyle}
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: editingEventId && onDelete ? 'space-between' : 'flex-end',
              gap: 8,
              marginTop: 6,
            }}
          >
            {editingEventId && onDelete && (
              <button
                type="button"
                onClick={() => {
                  onDelete(editingEventId);
                  onClose();
                }}
                style={{
                  height: 34,
                  padding: '0 12px',
                  borderRadius: 'var(--uxu-radius-sm)',
                  border: '1px solid var(--uxu-danger)',
                  backgroundColor: 'var(--uxu-danger-bg)',
                  color: 'var(--uxu-danger)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                }}
              >
                <Trash2 size={14} />
                <span>{isTR ? 'Sil' : 'Delete'}</span>
              </button>
            )}

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  height: 34,
                  padding: '0 14px',
                  borderRadius: 'var(--uxu-radius-sm)',
                  border: '1px solid var(--uxu-border-subtle)',
                  backgroundColor: 'var(--uxu-surface-tonal)',
                  color: 'var(--uxu-text-primary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {isTR ? 'Vazgeç' : 'Cancel'}
              </button>
              <button
                type="submit"
                style={{
                  height: 34,
                  padding: '0 16px',
                  borderRadius: 'var(--uxu-radius-sm)',
                  border: 'none',
                  backgroundColor: 'var(--uxu-primary)',
                  color: 'var(--uxu-on-primary)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {editingEventId ? (isTR ? 'Kaydet' : 'Save') : isTR ? 'Görevi Ekle' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

