// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { ThemeProvider } from '../../src/providers/ThemeProvider';
import { ToastProvider } from '../../src/providers/ToastProvider';
import {
  TesseraGLDemo,
  type TesseraGLDemoProps,
} from '../../src/features/demos/TesseraGLDemo';

function renderTessera(props?: TesseraGLDemoProps) {
  return render(
    <ThemeProvider>
      <ToastProvider>
        <TesseraGLDemo {...props} />
      </ToastProvider>
    </ThemeProvider>
  );
}

describe('TesseraGLDemo — Modular SOLID Workspace Template', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it('renders 1:1 labels across top bar, projects sidebar, main dashboard, and profile panel', () => {
    renderTessera();

    // Top Bar
    expect(screen.getByText('Tessera')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Search tasks, docs, people')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Invite/i })).toBeInTheDocument();

    // Projects Sidebar
    expect(screen.getByRole('button', { name: /New work item/i })).toBeInTheDocument();
    expect(screen.getAllByText('Your work').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('Tessera Core').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Connect GitHub')).toBeInTheDocument();
    expect(screen.getByText('Connect Slack')).toBeInTheDocument();
    expect(screen.getByText('Try Tessera AI')).toBeInTheDocument();
    expect(screen.getByText('Ends in 7 days')).toBeInTheDocument();

    // Overview KPI Cards
    expect(screen.getByText('Work items created')).toBeInTheDocument();
    expect(screen.getAllByText('15').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Work items assigned')).toBeInTheDocument();
    expect(screen.getAllByText('12').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Work items subscribed')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();

    // Workload Strip
    expect(screen.getByText('Backlog')).toBeInTheDocument();
    expect(screen.getByText('Not started')).toBeInTheDocument();
    expect(screen.getByText('Working on')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();

    // Analytics Charts
    expect(screen.getByText('Cycle capacity')).toBeInTheDocument();
    expect(screen.getByText('240h')).toBeInTheDocument();
    expect(screen.getByText('Team performance')).toBeInTheDocument();
    expect(screen.getByText('Target 70%')).toBeInTheDocument();
    expect(screen.getByText('Priya')).toBeInTheDocument();
    expect(screen.getByText('↑ 12%')).toBeInTheDocument();

    // Recent Activity
    expect(screen.getByText('Recent activity')).toBeInTheDocument();
    expect(screen.getByText('alexsmith')).toBeInTheDocument();
    expect(screen.getByText('Jon D.')).toBeInTheDocument();
    expect(screen.getByText('Ben K.')).toBeInTheDocument();
    expect(screen.getByText('Sara M.')).toBeInTheDocument();

    // Right Profile Panel
    expect(screen.getByText('Yasir Ahmad Noori')).toBeInTheDocument();
    expect(screen.getByText('@yasirnoori')).toBeInTheDocument();
    expect(screen.getByText('Aug 20, 2026')).toBeInTheDocument();
    expect(screen.getByText('07:20 UTC')).toBeInTheDocument();
    expect(screen.getByText('71%')).toBeInTheDocument();
    expect(screen.getByText('Sprint 14 review')).toBeInTheDocument();
    expect(screen.getByText('Client CRM demo')).toBeInTheDocument();
    expect(screen.getByText('Team standup')).toBeInTheDocument();
    expect(screen.getByText('Your week, summarized')).toBeInTheDocument();
  });

  it('filters recent activity using All, Mentions, and Comments controls', async () => {
    const user = userEvent.setup();
    renderTessera();

    await user.click(screen.getByRole('tab', { name: 'Comments' }));
    expect(screen.getByText('Jon D.')).toBeInTheDocument();
    expect(screen.queryByText('Ben K.')).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'All' }));
    expect(screen.getByText('Ben K.')).toBeInTheDocument();
  });

  it('switches to Assigned tab and creates a new work item via modal', async () => {
    const user = userEvent.setup();
    renderTessera();

    await user.click(screen.getByRole('button', { name: /New work item/i }));
    const titleInput = screen.getByLabelText('Title');
    await user.type(titleInput, 'Build SOLID unit suite');
    await user.click(screen.getByRole('button', { name: 'Create item' }));

    expect(screen.getAllByText('16').length).toBeGreaterThanOrEqual(2);

    await user.click(screen.getByRole('tab', { name: 'Created' }));
    expect(screen.getByText('Build SOLID unit suite')).toBeInTheDocument();
  });

  it('opens AI recap modal and supports light/dark surface toggling', async () => {
    const user = userEvent.setup();
    renderTessera();

    await user.click(screen.getByRole('button', { name: /Generate recap/i }));
    expect(screen.getByText('Sprint 14 Weekly Recap')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Done' }));

    const toggleBtn = screen.getByRole('button', {
      name: /Switch to Dark Mode/i,
    });
    await user.click(toggleBtn);
    expect(
      screen.getByRole('button', { name: /Switch to Light Mode/i })
    ).toBeInTheDocument();
  });
});
