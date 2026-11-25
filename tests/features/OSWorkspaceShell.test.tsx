// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import {
  ThemeProvider,
  ToastProvider,
  OSWorkspaceShell,
  WorkspaceShellGallery,
  resolveWidgetOverlaps,
  WORKSPACE_SHELL_CATALOG,
  type OSWorkspaceApp,
  type OSDesktopWidgetDefinition,
} from '../../src';

const SAMPLE_APPS: OSWorkspaceApp[] = [
  {
    id: 'analytics-hub',
    label: 'Analitik Merkezi',
    shortLabel: 'Analitik',
    googleIcon: 'monitoring',
    category: 'Yönetim',
    gradient: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
  },
  {
    id: 'billing-ops',
    label: 'Finans Operasyonları',
    shortLabel: 'Finans',
    googleIcon: 'payments',
    category: 'Operasyon',
    gradient: 'linear-gradient(135deg, #10b981, #047857)',
  },
];

const SAMPLE_WIDGETS: OSDesktopWidgetDefinition[] = [
  {
    id: 'live-summary',
    labelTr: 'Canlı Özet',
    labelEn: 'Live Summary',
    defaultSize: { width: 280, height: 150 },
    render: (ctx) => (
      <div data-testid="sample-widget-body" style={{ color: ctx.primaryColor }}>
        Aktif Özet Kartı
      </div>
    ),
  },
];

describe('Parametric OSWorkspaceShell, Widget Overlap Solver & WorkspaceShellGallery', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it('resolves overlapping desktop widgets without mutating locked widget position', () => {
    const resolved = resolveWidgetOverlaps(
      [
        { id: 'w1', pos: { x: 960, y: 20 }, size: { width: 280, height: 180 }, locked: true },
        { id: 'w2', pos: { x: 960, y: 40 }, size: { width: 280, height: 160 } },
        { id: 'w3', pos: { x: 960, y: 60 }, size: { width: 280, height: 160 } },
      ],
      900
    );

    expect(resolved.w1).toEqual({ x: 960, y: 20 });
    expect(resolved.w2.y).toBeGreaterThanOrEqual(216);
    expect(resolved.w3.y).toBeGreaterThanOrEqual(resolved.w2.y + 160);
  });

  it('renders WorkspaceShellGallery with all 6 shell cards and emits selection changes', () => {
    const onChange = vi.fn();
    render(
      <ThemeProvider>
        <WorkspaceShellGallery value="osgl" onChange={onChange} defaultRoleShell="osgl" />
      </ThemeProvider>
    );

    expect(WORKSPACE_SHELL_CATALOG).toHaveLength(6);
    for (const item of WORKSPACE_SHELL_CATALOG) {
      expect(screen.getByTestId(`uxigl-shell-card-${item.id}`)).toBeInTheDocument();
    }

    fireEvent.click(screen.getByTestId('uxigl-shell-card-flowgl'));
    expect(onChange).toHaveBeenCalledWith('flowgl');
  });

  it('mounts OSWorkspaceShell from barrel export, opens app windows, and triggers inline Widgets menu customization popover', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1440 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 900 });

    render(
      <ThemeProvider initialUserScopeKey="test-osgl-user">
        <ToastProvider>
          <OSWorkspaceShell
            brandTitle="AcmeOS"
            storageScopeKey="test-osgl-user"
            apps={SAMPLE_APPS}
            widgets={SAMPLE_WIDGETS}
            renderWindowContent={(appId) => (
              <div data-testid={`win-body-${appId}`}>Pencere İçeriği: {appId}</div>
            )}
          />
        </ToastProvider>
      </ThemeProvider>
    );

    expect(screen.getByTestId('osgl-workspace-shell')).toBeInTheDocument();
    expect(screen.getByText('AcmeOS')).toBeInTheDocument();
    expect(screen.getByTestId('sample-widget-body')).toBeInTheDocument();

    const widgetsBtn = screen.getByRole('button', { name: 'Widget Ayarları' });
    fireEvent.click(widgetsBtn);

    const inlineSettingsBtn = document.querySelector(
      '[data-menu-widget-settings="live-summary"]'
    ) as HTMLButtonElement | null;
    expect(inlineSettingsBtn).not.toBeNull();
    fireEvent.click(inlineSettingsBtn!);

    const customizePopover = screen.getByTestId('osgl-widget-customize-popover');
    expect(customizePopover).toBeInTheDocument();
    expect(document.body.contains(customizePopover)).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: 'Özelleştirme panelini kapat' }));
    fireEvent.click(screen.getByTestId('osgl-menubar-apps-btn'));
    fireEvent.click(screen.getByText('Analitik Merkezi'));

    expect(screen.getByTestId('win-body-analytics-hub')).toHaveTextContent(
      'Pencere İçeriği: analytics-hub'
    );
  });
});
