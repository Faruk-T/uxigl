// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { AnalogDigitalClock } from '../../src/components/composites/Clock/AnalogDigitalClock';
import { Calendar } from '../../src/components/composites/Calendar';
import type { CalendarTaskEvent } from '../../src/components/composites/Calendar/types';

describe('AnalogDigitalClock & Calendar Composite', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it('renders AnalogDigitalClock with SVG dial, digital readout, and 24H/12H toggle', async () => {
    const user = userEvent.setup();
    render(<AnalogDigitalClock locale="tr" showSeconds showFormatToggle />);

    expect(screen.getByRole('img', { name: /Analog clock/i })).toBeInTheDocument();
    expect(screen.getByTestId('digital-clock-time')).toBeInTheDocument();

    const toggleBtn = screen.getByRole('button', { name: '24H' });
    await user.click(toggleBtn);
    expect(screen.getByRole('button', { name: '12H (AM/PM)' })).toBeInTheDocument();
  });

  it('switches between Week, Month, Day, and Agenda views in Calendar', async () => {
    const user = userEvent.setup();
    render(<Calendar locale="tr" defaultView="week" defaultDate="2026-11-21" showClock />);

    // Clock is visible inside Calendar
    expect(screen.getByRole('img', { name: /Analog clock/i })).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Ay' }));
    expect(screen.getByText('Pzt')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Ajanda' }));
    expect(screen.getByText(/Sprint 14 Planlama/i)).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Gün' }));
    expect(screen.getByText('09:00')).toBeInTheDocument();
  });

  it('creates a new task via modal and supports Drag & Drop rescheduling to another hour', async () => {
    const user = userEvent.setup();
    const initialEvents: CalendarTaskEvent[] = [
      {
        id: 'ev-drag-1',
        title: 'Mimari İnceleme',
        date: '2026-11-18',
        startHour: 9,
        startMinute: 0,
        durationMinutes: 60,
        category: 'work',
      },
    ];

    render(
      <Calendar
        locale="tr"
        defaultView="week"
        defaultDate="2026-11-18"
        initialEvents={initialEvents}
      />
    );

    // 1. Add a new task via button & modal
    await user.click(screen.getByRole('button', { name: /Yeni Görev \/ Etkinlik/i }));
    await user.type(screen.getByLabelText('Görev Başlığı'), 'Yeni Test Görevi');
    await user.click(screen.getByRole('button', { name: 'Görevi Ekle' }));
    expect(screen.getByText('Yeni Test Görevi')).toBeInTheDocument();

    // 2. Drag 'ev-drag-1' from 09:00 to 14:00 on 2026-11-19
    const eventCard = document.querySelector('[data-calendar-event-id="ev-drag-1"]') as HTMLElement;
    const targetSlot = document.querySelector('[data-slot-key="2026-11-19__14"]') as HTMLElement;
    expect(eventCard).toBeTruthy();
    expect(targetSlot).toBeTruthy();

    const dataTransfer = {
      data: {} as Record<string, string>,
      setData(k: string, v: string) {
        this.data[k] = v;
      },
      getData(k: string) {
        return this.data[k] ?? '';
      },
      effectAllowed: 'move',
    };

    fireEvent.dragStart(eventCard, { dataTransfer });
    fireEvent.dragOver(targetSlot, { dataTransfer });
    fireEvent.drop(targetSlot, { dataTransfer });

    // Verify time range updated from 09:00 – 10:00 to 14:00 – 15:00
    expect(screen.getByText('14:00 – 15:00')).toBeInTheDocument();
  });
});

