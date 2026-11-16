import React, { useCallback, useMemo, useState } from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { Card } from '../../components/composites/Card/Card';
import { Tabs } from '../../components/composites/Tabs/Tabs';
import { Badge } from '../../components/primitives/Badge/Badge';
import { useTheme } from '../../providers/ThemeProvider';
import { useToast } from '../../providers/ToastProvider';
import {
  clearWorkspaceSettings,
  DEFAULT_WORKSPACE_SETTINGS,
  defaultThemeStorageAdapter,
  defaultWorkspaceSettingsStorageAdapter,
  loadWorkspaceSettings,
  saveWorkspaceSettings,
  WORKSPACE_SETTINGS_STORAGE_KEY,
  type IWorkspaceSettingsStorageAdapter,
  type PersistedWorkspaceSettings,
} from '../../core/services/StorageService';
import type {
  RadiusScale,
  SeedPaletteId,
  ThemeMode,
} from '../../core/contracts/ThemeContract';
import { useWorkspaceSettings } from '../../hooks/useWorkspaceSettings';
import {
  AccountTab,
  AppearanceTab,
  NotificationsTab,
  SETTINGS_PAGE_STYLES,
  SETTINGS_TABS,
  type SettingsTabId,
} from './EnterpriseSettingsTabs';

export {
  clearWorkspaceSettings,
  DEFAULT_WORKSPACE_SETTINGS,
  loadWorkspaceSettings,
  saveWorkspaceSettings,
  WORKSPACE_SETTINGS_STORAGE_KEY,
  type IWorkspaceSettingsStorageAdapter,
  type PersistedWorkspaceSettings,
  type SettingsTabId,
};

/**
 * Props contract for {@link EnterpriseSettingsPage}.
 * Supports uncontrolled (`initialTab`) and controlled (`activeTab` + `onTabChange`)
 * tab selection and Dependency Inversion via `storageAdapter`.
 */
export interface EnterpriseSettingsPageProps {
  /** Initial active settings tab for uncontrolled usage (defaults to `'appearance'`). */
  initialTab?: SettingsTabId;
  /** Controlled active settings tab; when provided, overrides internal tab state. */
  activeTab?: SettingsTabId;
  /** Callback fired whenever the user selects a settings tab. */
  onTabChange?: (nextTab: SettingsTabId) => void;
  /** Optional custom workspace settings storage adapter ([DIP]). */
  storageAdapter?: IWorkspaceSettingsStorageAdapter;
  /** Optional CSS class name. */
  className?: string;
  /** Optional inline styles. */
  style?: React.CSSProperties;
}

/**
 * Enterprise Workspace Settings & Preferences page template (`page-settings`).
 *
 * Organizes workspace configuration into three modular sections (`Appearance`,
 * `Account`, and `Notifications`), synchronizing design tokens with `ThemeEngineService`
 * and persisting profile/notification preferences via `StorageService`.
 */
export const EnterpriseSettingsPage: React.FC<EnterpriseSettingsPageProps> = ({
  initialTab = 'appearance',
  activeTab: controlledTab,
  onTabChange,
  storageAdapter = defaultWorkspaceSettingsStorageAdapter,
  className = '',
  style,
}) => {
  const {
    preferences,
    resolvedMode,
    activePalette,
    setMode,
    setSeedPalette,
    setRadiusScale,
    resetPreferences,
  } = useTheme();
  const { notify } = useToast();

  const [uncontrolledTab, setUncontrolledTab] =
    useState<SettingsTabId>(initialTab);
  const currentTab: SettingsTabId = controlledTab ?? uncontrolledTab;

  const handleTabSelect = useCallback(
    (nextId: string) => {
      const nextTab = nextId as SettingsTabId;
      if (controlledTab === undefined) setUncontrolledTab(nextTab);
      onTabChange?.(nextTab);
    },
    [controlledTab, onTabChange]
  );

  const ws = useWorkspaceSettings(storageAdapter);

  const handleThemeModeChange = useCallback(
    (nextMode: ThemeMode) => {
      setMode(nextMode);
      defaultThemeStorageAdapter.savePreferences({ ...preferences, mode: nextMode });
    },
    [preferences, setMode]
  );

  const handleAccentColorChange = useCallback(
    (nextPalette: SeedPaletteId) => {
      setSeedPalette(nextPalette);
      defaultThemeStorageAdapter.savePreferences({
        ...preferences,
        seedPalette: nextPalette,
        customPrimaryHex: undefined,
      });
    },
    [preferences, setSeedPalette]
  );

  const handleCornerRadiusChange = useCallback(
    (nextRadius: RadiusScale) => {
      const mappedPx = nextRadius === 'sharp' ? 4 : nextRadius === 'pill' ? 22 : 12;
      setRadiusScale(nextRadius);
      defaultThemeStorageAdapter.savePreferences({
        ...preferences,
        radiusScale: nextRadius,
        customRadiusPx: mappedPx,
      });
    },
    [preferences, setRadiusScale]
  );

  const handleResetAppearance = useCallback(() => {
    resetPreferences();
    defaultThemeStorageAdapter.clearPreferences();
    ws.resetWorkspaceSettings();
    notify({
      title: 'Appearance reset to defaults',
      description: 'Theme mode, seed palette, and corner radius restored.',
      tone: 'info',
    });
  }, [notify, resetPreferences, ws]);

  const rootStyle = useMemo<React.CSSProperties>(
    () => (style ? { ...SETTINGS_PAGE_STYLES.root, ...style } : SETTINGS_PAGE_STYLES.root),
    [style]
  );

  return (
    <div
      className={`uxu-enterprise-settings-page ${className}`.trim()}
      style={rootStyle}
    >
      <Card
        variant="glass"
        padding="lg"
        eyebrow="ENTERPRISE WORKSPACE CONFIGURATION"
        title="Enterprise Settings"
        subtitle="Manage your workspace appearance tokens, account profile, and real-time notification channels."
        headerIcon={<Sparkles size={20} />}
        headerAction={
          <Badge tone="primary" variant="tonal" pulse>
            {activePalette.name} · {resolvedMode.toUpperCase()}
          </Badge>
        }
      >
        <div style={SETTINGS_PAGE_STYLES.headerBar}>
          <Tabs
            items={SETTINGS_TABS}
            activeId={currentTab}
            onChange={handleTabSelect}
            variant="pill"
            size="md"
          />
          <div style={SETTINGS_PAGE_STYLES.activeProfileIndicator}>
            <ShieldCheck size={15} />
            <span>Active Profile: {ws.fullName || 'Unassigned'}</span>
          </div>
        </div>
      </Card>

      {currentTab === 'appearance' && (
        <AppearanceTab
          preferences={preferences}
          resolvedMode={resolvedMode}
          onThemeModeChange={handleThemeModeChange}
          onAccentColorChange={handleAccentColorChange}
          onCornerRadiusChange={handleCornerRadiusChange}
          onResetDefaults={handleResetAppearance}
        />
      )}

      {currentTab === 'account' && (
        <AccountTab
          fullName={ws.fullName}
          email={ws.email}
          accountSaved={ws.accountSaved}
          onFullNameChange={ws.setFullName}
          onEmailChange={ws.setEmail}
          onSaveAccount={ws.handleSaveAccount}
        />
      )}

      {currentTab === 'notifications' && (
        <NotificationsTab
          emailNotifications={ws.emailNotifications}
          pushNotifications={ws.pushNotifications}
          onUpdateNotification={ws.updateNotificationPreference}
        />
      )}
    </div>
  );
};

export default EnterpriseSettingsPage;
