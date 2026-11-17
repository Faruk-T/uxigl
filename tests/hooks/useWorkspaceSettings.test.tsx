// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { renderHook, act, cleanup } from '@testing-library/react';
import { ToastProvider } from '../../src/providers/ToastProvider';
import {
  DEFAULT_WORKSPACE_SETTINGS,
  type IWorkspaceSettingsStorageAdapter,
  type PersistedWorkspaceSettings,
} from '../../src/core/services/StorageService';
import { useWorkspaceSettings } from '../../src/hooks/useWorkspaceSettings';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ToastProvider>{children}</ToastProvider>
);

function createMockStorageAdapter(
  initial: PersistedWorkspaceSettings = DEFAULT_WORKSPACE_SETTINGS
): IWorkspaceSettingsStorageAdapter & {
  loadSettings: ReturnType<typeof vi.fn>;
  saveSettings: ReturnType<typeof vi.fn>;
  clearSettings: ReturnType<typeof vi.fn>;
} {
  return {
    loadSettings: vi.fn(() => initial),
    saveSettings: vi.fn(),
    clearSettings: vi.fn(),
  };
}

describe('useWorkspaceSettings', () => {
  afterEach(() => {
    cleanup();
  });

  it('initializes state from the injected IWorkspaceSettingsStorageAdapter', () => {
    const customInitial: PersistedWorkspaceSettings = {
      fullName: 'Grace Hopper',
      email: 'grace@navy.mil',
      emailNotifications: false,
      pushNotifications: true,
    };
    const mockAdapter = createMockStorageAdapter(customInitial);

    const { result } = renderHook(() => useWorkspaceSettings(mockAdapter), {
      wrapper,
    });

    expect(mockAdapter.loadSettings).toHaveBeenCalledTimes(1);
    expect(result.current.fullName).toBe('Grace Hopper');
    expect(result.current.email).toBe('grace@navy.mil');
    expect(result.current.emailNotifications).toBe(false);
    expect(result.current.pushNotifications).toBe(true);
    expect(result.current.accountSaved).toBe(false);
  });

  it('persists account changes via handleSaveAccount and resets accountSaved when fields are edited', () => {
    const mockAdapter = createMockStorageAdapter();
    const { result } = renderHook(() => useWorkspaceSettings(mockAdapter), {
      wrapper,
    });

    act(() => {
      result.current.setFullName('Bora Öz');
      result.current.setEmail('bora.oz@truncgil.com');
    });

    expect(result.current.accountSaved).toBe(false);

    act(() => {
      result.current.handleSaveAccount();
    });

    expect(result.current.accountSaved).toBe(true);
    expect(mockAdapter.saveSettings).toHaveBeenCalledWith({
      ...DEFAULT_WORKSPACE_SETTINGS,
      fullName: 'Bora Öz',
      email: 'bora.oz@truncgil.com',
    });

    // Editing fullName or email resets accountSaved back to false
    act(() => {
      result.current.setFullName('Bora Özkan');
    });
    expect(result.current.accountSaved).toBe(false);

    act(() => {
      result.current.handleSaveAccount();
    });
    expect(result.current.accountSaved).toBe(true);

    act(() => {
      result.current.setEmail('bora.ozkan@truncgil.com');
    });
    expect(result.current.accountSaved).toBe(false);
  });

  it('updates and persists notification channels via updateNotificationPreference', () => {
    const mockAdapter = createMockStorageAdapter();
    const { result } = renderHook(() => useWorkspaceSettings(mockAdapter), {
      wrapper,
    });

    act(() => {
      result.current.updateNotificationPreference('emailNotifications', false);
    });

    expect(result.current.emailNotifications).toBe(false);
    expect(mockAdapter.saveSettings).toHaveBeenLastCalledWith({
      ...DEFAULT_WORKSPACE_SETTINGS,
      emailNotifications: false,
    });

    act(() => {
      result.current.updateNotificationPreference('pushNotifications', true);
    });

    expect(result.current.pushNotifications).toBe(true);
    expect(mockAdapter.saveSettings).toHaveBeenLastCalledWith({
      ...DEFAULT_WORKSPACE_SETTINGS,
      emailNotifications: false,
      pushNotifications: true,
    });
  });

  it('clears storage and restores DEFAULT_WORKSPACE_SETTINGS via resetWorkspaceSettings', () => {
    const mockAdapter = createMockStorageAdapter({
      fullName: 'Custom Admin',
      email: 'admin@custom.io',
      emailNotifications: false,
      pushNotifications: true,
    });

    const { result } = renderHook(() => useWorkspaceSettings(mockAdapter), {
      wrapper,
    });

    act(() => {
      result.current.handleSaveAccount();
    });
    expect(result.current.accountSaved).toBe(true);

    act(() => {
      result.current.resetWorkspaceSettings();
    });

    expect(mockAdapter.clearSettings).toHaveBeenCalledTimes(1);
    expect(result.current.fullName).toBe(DEFAULT_WORKSPACE_SETTINGS.fullName);
    expect(result.current.email).toBe(DEFAULT_WORKSPACE_SETTINGS.email);
    expect(result.current.emailNotifications).toBe(
      DEFAULT_WORKSPACE_SETTINGS.emailNotifications
    );
    expect(result.current.pushNotifications).toBe(
      DEFAULT_WORKSPACE_SETTINGS.pushNotifications
    );
    expect(result.current.accountSaved).toBe(false);
  });
});
