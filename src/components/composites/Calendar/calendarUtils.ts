import type { CalendarCategory, CalendarTaskEvent } from './types';

export const CALENDAR_HOURS = Array.from({ length: 16 }, (_, i) => i + 7); // 07:00 - 22:00

export const CATEGORY_META: Record<
  CalendarCategory,
  {
    labelTr: string;
    labelEn: string;
    color: string;
    softBg: string;
  }
> = {
  work: {
    labelTr: 'İş & Sprint',
    labelEn: 'Work & Sprint',
    color: '#2563EB',
    softBg: 'rgba(37, 99, 235, 0.14)',
  },
  meeting: {
    labelTr: 'Toplantı',
    labelEn: 'Meeting',
    color: '#8B5CF6',
    softBg: 'rgba(139, 92, 246, 0.15)',
  },
  focus: {
    labelTr: 'Odak Bloğu',
    labelEn: 'Deep Focus',
    color: '#10B981',
    softBg: 'rgba(16, 185, 129, 0.14)',
  },
  deadline: {
    labelTr: 'Teslim / Kritik',
    labelEn: 'Deadline',
    color: '#F43F5E',
    softBg: 'rgba(244, 63, 94, 0.14)',
  },
  personal: {
    labelTr: 'Kişisel',
    labelEn: 'Personal',
    color: '#F59E0B',
    softBg: 'rgba(245, 158, 11, 0.15)',
  },
};

export function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function addDays(d: Date, days: number): Date {
  const next = new Date(d.getFullYear(), d.getMonth(), d.getDate() + days);
  return next;
}

/** Returns Monday-anchored 7 days of the week containing `refDate`. */
export function getWeekDays(refDate: Date): Date[] {
  const jsDay = refDate.getDay(); // 0=Sun, 1=Mon
  const diffToMon = jsDay === 0 ? -6 : 1 - jsDay;
  const monday = addDays(refDate, diffToMon);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

/** Returns 42 days (6 rows × 7 cols, Monday-first) for the month grid. */
export function getMonthGridDays(refDate: Date): Date[] {
  const firstOfMonth = new Date(refDate.getFullYear(), refDate.getMonth(), 1);
  const jsDay = firstOfMonth.getDay();
  const diffToMon = jsDay === 0 ? -6 : 1 - jsDay;
  const gridStart = addDays(firstOfMonth, diffToMon);
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
}

export function formatHourLabel(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`;
}

export function formatTimeRange(
  startHour: number,
  startMinute: number,
  durationMinutes: number
): string {
  const totalStart = startHour * 60 + startMinute;
  const totalEnd = Math.min(23 * 60 + 59, totalStart + durationMinutes);
  const sH = String(Math.floor(totalStart / 60)).padStart(2, '0');
  const sM = String(totalStart % 60).padStart(2, '0');
  const eH = String(Math.floor(totalEnd / 60)).padStart(2, '0');
  const eM = String(totalEnd % 60).padStart(2, '0');
  return `${sH}:${sM} – ${eH}:${eM}`;
}

export function buildSeedCalendarEvents(refDate: Date = new Date()): CalendarTaskEvent[] {
  const week = getWeekDays(refDate);
  const mon = toIsoDate(week[0]);
  const tue = toIsoDate(week[1]);
  const wed = toIsoDate(week[2]);
  const thu = toIsoDate(week[3]);
  const fri = toIsoDate(week[4]);
  const sat = toIsoDate(week[5]);

  return [
    {
      id: 'cal-ev-1',
      title: 'Sprint 14 Planlama & Backlog',
      date: mon,
      startHour: 9,
      startMinute: 0,
      durationMinutes: 90,
      category: 'meeting',
      location: 'Meet Room A',
      notes: 'Öncelikli kartların puanlanması.',
    },
    {
      id: 'cal-ev-2',
      title: 'uxiGL Tasarım Token Senkronu',
      date: tue,
      startHour: 11,
      startMinute: 0,
      durationMinutes: 60,
      category: 'work',
      location: 'Design Ops',
    },
    {
      id: 'cal-ev-3',
      title: 'Derin Kodlama: SheetGL Grid',
      date: wed,
      startHour: 10,
      startMinute: 0,
      durationMinutes: 120,
      category: 'focus',
      notes: 'WebGL performans optimizasyonu.',
    },
    {
      id: 'cal-ev-4',
      title: 'Müşteri CRM Canlı Demo',
      date: thu,
      startHour: 14,
      startMinute: 0,
      durationMinutes: 60,
      category: 'meeting',
      location: 'Zoom',
    },
    {
      id: 'cal-ev-5',
      title: 'v2.9 Sürüm Çıkış Son Tarihi',
      date: fri,
      startHour: 16,
      startMinute: 0,
      durationMinutes: 60,
      category: 'deadline',
      notes: 'NPM paketi ve release notları.',
    },
    {
      id: 'cal-ev-6',
      title: 'Haftalık Retrospektif & Özet',
      date: sat,
      startHour: 10,
      startMinute: 0,
      durationMinutes: 60,
      category: 'personal',
      completed: true,
    },
  ];
}

