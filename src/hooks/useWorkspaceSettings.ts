import React, { useCallback, useState } from 'react';
import {
  DEFAULT_WORKSPACE_SETTINGS,
  defaultWorkspaceSettingsStorageAdapter,
  type IWorkspaceSettingsStorageAdapter,
  type PersistedWorkspaceSettings,
} from '../core/services/StorageService';
import { useToast } from '../providers/ToastProvider';

/**
 * Notification preference channel keys managed by {@link useWorkspaceSettings}.
 */
export type WorkspaceNotificationChannel =
  | 'emailNotifications'
  | 'pushNotifications';

/**
 * Return contract for {@link useWorkspaceSettings}.
 */
export interface UseWorkspaceSettingsReturn {
  fullName: string;
  email: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  accountSaved: boolean;
  setFullName: (nextName: string) => void;
  setEmail: (nextEmail: string) => void;
  handleSaveAccount: (e?: React.FormEvent | React.MouseEvent) => void;
  updateNotificationPreference: (
    channel: WorkspaceNotificationChannel,
    enabled: boolean
  ) => void;
  resetWorkspaceSettings: () => void;
}

/**
 * Custom hook encapsulating enterprise workspace profile and notification state,
 * `IWorkspaceSettingsStorageAdapter` persistence ([DIP]), and toast notifications ([SRP]).
 *
 * @param storageAdapter - Optional custom storage adapter (defaults to {@link defaultWorkspaceSettingsStorageAdapter}).
 * @returns State and action handlers for enterprise workspace settings.
 */
export function useWorkspaceSettings(
  storageAdapter: IWorkspaceSettingsStorageAdapter = defaultWorkspaceSettingsStorageAdapter
): UseWorkspaceSettingsReturn {
  const { notify } = useToast();

  const [settings, setSettings] = useState<PersistedWorkspaceSettings>(() =>
    storageAdapter.loadSettings()
  );
  const [accountSaved, setAccountSaved] = useState<boolean>(false);

  const setFullName = useCallback((nextName: string) => {
    setSettings((prev) => ({ ...prev, fullName: nextName }));
    setAccountSaved(false);
  }, []);

  const setEmail = useCallback((nextEmail: string) => {
    setSettings((prev) => ({ ...prev, email: nextEmail }));
    setAccountSaved(false);
  }, []);

  const handleSaveAccount = useCallback(
    (e?: React.FormEvent | React.MouseEvent) => {
      e?.preventDefault();
      storageAdapter.saveSettings(settings);
      setAccountSaved(true);
      notify({
        title: 'Profile updated successfully',
        description: `Account settings saved for ${settings.fullName} (${settings.email}).`,
        tone: 'success',
      });
    },
    [notify, settings, storageAdapter]
  );

  const updateNotificationPreference = useCallback(
    (channel: WorkspaceNotificationChannel, enabled: boolean) => {
      setSettings((prev) => {
        const next: PersistedWorkspaceSettings = {
          ...prev,
          [channel]: enabled,
        };
        storageAdapter.saveSettings(next);
        return next;
      });

      const isEmail = channel === 'emailNotifications';
      notify({
        title: isEmail
          ? enabled
            ? 'Email notifications enabled'
            : 'Email notifications disabled'
          : enabled
          ? 'Push notifications enabled'
          : 'Push notifications disabled',
        description: isEmail
          ? 'Notification channel preferences persisted to workspace.'
          : 'Real-time push alert preferences persisted to workspace.',
        tone: 'info',
      });
    },
    [notify, storageAdapter]
  );

  const resetWorkspaceSettings = useCallback(() => {
    storageAdapter.clearSettings();
    setSettings(DEFAULT_WORKSPACE_SETTINGS);
    setAccountSaved(false);
  }, [storageAdapter]);

  return {
    fullName: settings.fullName,
    email: settings.email,
    emailNotifications: settings.emailNotifications,
    pushNotifications: settings.pushNotifications,
    accountSaved,
    setFullName,
    setEmail,
    handleSaveAccount,
    updateNotificationPreference,
    resetWorkspaceSettings,
  };
}
