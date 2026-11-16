// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { ThemeProvider } from '../../src/providers/ThemeProvider';
import { ToastProvider } from '../../src/providers/ToastProvider';
import {
  EnterpriseSettingsPage,
  type EnterpriseSettingsPageProps,
  WORKSPACE_SETTINGS_STORAGE_KEY,
  DEFAULT_WORKSPACE_SETTINGS,
  loadWorkspaceSettings,
  saveWorkspaceSettings,
  clearWorkspaceSettings,
} from '../../src/features/showcase/EnterpriseSettingsPage';

function renderSettingsPage(props?: EnterpriseSettingsPageProps) {
  return render(
    <ThemeProvider>
      <ToastProvider>
        <EnterpriseSettingsPage {...props} />
      </ToastProvider>
    </ThemeProvider>
  );
}

describe('EnterpriseSettingsPage & Workspace Settings Persistence', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  describe('1. Storage Adapter (WORKSPACE_SETTINGS_STORAGE_KEY)', () => {
    it('loads DEFAULT_WORKSPACE_SETTINGS when localStorage is empty', () => {
      expect(loadWorkspaceSettings()).toEqual(DEFAULT_WORKSPACE_SETTINGS);
    });

    it('saves, loads, and clears workspace settings in localStorage', () => {
      const customSettings = {
        fullName: 'Ada Lovelace',
        email: 'ada@analytical.engine',
        emailNotifications: false,
        pushNotifications: true,
      };

      saveWorkspaceSettings(customSettings);
      const raw = window.localStorage.getItem(WORKSPACE_SETTINGS_STORAGE_KEY);
      expect(raw).toBeTruthy();
      expect(loadWorkspaceSettings()).toEqual(customSettings);

      clearWorkspaceSettings();
      expect(
        window.localStorage.getItem(WORKSPACE_SETTINGS_STORAGE_KEY)
      ).toBeNull();
      expect(loadWorkspaceSettings()).toEqual(DEFAULT_WORKSPACE_SETTINGS);
    });

    it('gracefully falls back to defaults on malformed JSON or partial payloads', () => {
      window.localStorage.setItem(
        WORKSPACE_SETTINGS_STORAGE_KEY,
        '{corrupted-json'
      );
      expect(loadWorkspaceSettings()).toEqual(DEFAULT_WORKSPACE_SETTINGS);

      window.localStorage.setItem(
        WORKSPACE_SETTINGS_STORAGE_KEY,
        JSON.stringify({ fullName: 'Custom User' })
      );
      expect(loadWorkspaceSettings()).toEqual({
        ...DEFAULT_WORKSPACE_SETTINGS,
        fullName: 'Custom User',
      });
    });
  });

  describe('2. Default, Uncontrolled initialTab, and Controlled activeTab Rendering', () => {
    it('renders the Appearance tab by default with theme, accent, and radius controls', () => {
      const { container } = renderSettingsPage({
        className: 'custom-enterprise-settings',
      });

      const rootEl = container.querySelector('.uxu-enterprise-settings-page');
      expect(rootEl).toHaveClass('custom-enterprise-settings');

      expect(
        screen.getByText('Appearance & Design Tokens')
      ).toBeInTheDocument();
      expect(
        screen.getByRole('tab', { name: /Appearance/i })
      ).toHaveAttribute('aria-selected', 'true');
    });

    it('renders directly into Account or Notifications when uncontrolled initialTab is provided', () => {
      const { unmount } = renderSettingsPage({ initialTab: 'account' });
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
      unmount();

      renderSettingsPage({ initialTab: 'notifications' });
      expect(
        screen.getByRole('switch', { name: /Email Notifications/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('switch', { name: /Push Notifications/i })
      ).toBeInTheDocument();
    });

    it('supports controlled activeTab and fires onTabChange when clicking tabs', async () => {
      const user = userEvent.setup();
      const onTabChange = vi.fn();

      const { rerender } = render(
        <ThemeProvider>
          <ToastProvider>
            <EnterpriseSettingsPage
              activeTab="appearance"
              onTabChange={onTabChange}
            />
          </ToastProvider>
        </ThemeProvider>
      );

      await user.click(screen.getByRole('tab', { name: /Account/i }));
      expect(onTabChange).toHaveBeenCalledWith('account');

      rerender(
        <ThemeProvider>
          <ToastProvider>
            <EnterpriseSettingsPage
              activeTab="account"
              onTabChange={onTabChange}
            />
          </ToastProvider>
        </ThemeProvider>
      );

      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    });
  });

  describe('3. Account Tab Persistence', () => {
    it('persists updated fullName and email to localStorage and displays Changes Saved badge', async () => {
      const user = userEvent.setup();
      renderSettingsPage({ initialTab: 'account' });

      const nameInput = screen.getByLabelText(/Full Name/i);
      const emailInput = screen.getByLabelText(/Email Address/i);

      await user.clear(nameInput);
      await user.type(nameInput, 'Deniz Kaya');

      await user.clear(emailInput);
      await user.type(emailInput, 'deniz.kaya@truncgil.com');

      await user.click(screen.getByRole('button', { name: /Save Changes/i }));

      expect(screen.getByText('Changes Saved')).toBeInTheDocument();
      expect(
        screen.getByText('Active Profile: Deniz Kaya')
      ).toBeInTheDocument();

      const persisted = loadWorkspaceSettings();
      expect(persisted.fullName).toBe('Deniz Kaya');
      expect(persisted.email).toBe('deniz.kaya@truncgil.com');
    });
  });

  describe('4. Notifications Tab Persistence', () => {
    it('immediately persists emailNotifications and pushNotifications toggles to localStorage', async () => {
      const user = userEvent.setup();
      renderSettingsPage({ initialTab: 'notifications' });

      const emailSwitch = screen.getByRole('switch', {
        name: /Email Notifications/i,
      });
      const pushSwitch = screen.getByRole('switch', {
        name: /Push Notifications/i,
      });

      expect(emailSwitch).toHaveAttribute('aria-checked', 'true');
      expect(pushSwitch).toHaveAttribute('aria-checked', 'false');

      await user.click(emailSwitch);
      expect(loadWorkspaceSettings().emailNotifications).toBe(false);
      expect(emailSwitch).toHaveAttribute('aria-checked', 'false');

      await user.click(pushSwitch);
      expect(loadWorkspaceSettings().pushNotifications).toBe(true);
      expect(pushSwitch).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('5. Reset Defaults Action', () => {
    it('clears persisted workspace settings and restores DEFAULT_WORKSPACE_SETTINGS', async () => {
      const user = userEvent.setup();
      saveWorkspaceSettings({
        fullName: 'Temporary Admin',
        email: 'temp@uxigl.io',
        emailNotifications: false,
        pushNotifications: true,
      });

      renderSettingsPage({ initialTab: 'appearance' });
      expect(
        screen.getByText('Active Profile: Temporary Admin')
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole('button', { name: /Reset Defaults/i })
      );

      expect(
        window.localStorage.getItem(WORKSPACE_SETTINGS_STORAGE_KEY)
      ).toBeNull();
      expect(loadWorkspaceSettings()).toEqual(DEFAULT_WORKSPACE_SETTINGS);
      expect(
        screen.getByText(
          `Active Profile: ${DEFAULT_WORKSPACE_SETTINGS.fullName}`
        )
      ).toBeInTheDocument();
    });
  });
});
