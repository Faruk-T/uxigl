import type React from 'react';

export type CalendarViewMode = 'month' | 'week' | 'day' | 'agenda';

export type CalendarCategory =
  | 'work'
  | 'meeting'
  | 'focus'
  | 'personal'
  | 'deadline';

export interface CalendarTaskEvent {
  id: string;
  title: string;
  /** ISO date string (`YYYY-MM-DD`). */
  date: string;
  /** Start hour (`0..23`). */
  startHour: number;
  /** Start minute (`0 | 15 | 30 | 45`). */
  startMinute: number;
  /** Duration in minutes (e.g., `30`, `60`, `90`, `120`). */
  durationMinutes: number;
  category: CalendarCategory;
  location?: string;
  notes?: string;
  completed?: boolean;
}

export interface CalendarProps {
  /** Controlled events list. */
  events?: CalendarTaskEvent[];
  /** Controlled events updater. */
  onEventsChange?: (nextEvents: CalendarTaskEvent[]) => void;
  /** Initial events when uncontrolled. */
  initialEvents?: CalendarTaskEvent[];
  /** Initial active view (`'month' | 'week' | 'day' | 'agenda'`, default `'week'`). */
  defaultView?: CalendarViewMode;
  /** Initial reference date (`YYYY-MM-DD`, defaults to today). */
  defaultDate?: string;
  /** Display locale (`'tr' | 'en'`, default `'tr'`). */
  locale?: 'tr' | 'en';
  /** Show the live Analog + Digital Clock in the left sidebar (default `true`). */
  showClock?: boolean;
  /** Optional localStorage key for uncontrolled persistence. */
  storageKey?: string;
  /** Optional callback when an event is clicked. */
  onEventClick?: (event: CalendarTaskEvent) => void;
  className?: string;
  style?: React.CSSProperties;
}

