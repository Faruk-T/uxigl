import React from 'react';
import {
  Palette,
  User,
  Bell,
  Sun,
  Moon,
  Monitor,
  Save,
  RotateCcw,
  Mail,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '../../components/composites/Card/Card';
import type { TabItem } from '../../components/composites/Tabs/Tabs';
import { Switch } from '../../components/primitives/Switch/Switch';
import {
  Select,
  type SelectOptionItem,
} from '../../components/primitives/Select/Select';
import { Button } from '../../components/primitives/Button/Button';
import { Input } from '../../components/primitives/Input/Input';
import { Badge } from '../../components/primitives/Badge/Badge';
import type {
  RadiusScale,
  ResolvedThemeMode,
  SeedPaletteId,
  ThemeMode,
  ThemePreferences,
} from '../../core/contracts/ThemeContract';
import type { WorkspaceNotificationChannel } from '../../hooks/useWorkspaceSettings';

/**
 * Identifier for the active tab in `EnterpriseSettingsPage`.
 */
export type SettingsTabId = 'appearance' | 'account' | 'notifications';

/**
 * Shared static style definitions for `EnterpriseSettingsPage` and its tab panels,
 * avoiding inline style object allocations during render.
 */
export const SETTINGS_PAGE_STYLES = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    width: '100%',
    maxWidth: '960px',
    margin: '0 auto',
    padding: '1.5rem 0',
  },
  headerBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  activeProfileIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8125rem',
    color: 'var(--uxu-text-secondary)',
  },
  appearanceFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '0.75rem',
    width: '100%',
  },
  appearanceFooterMeta: {
    fontSize: '0.8125rem',
    color: 'var(--uxu-text-secondary)',
  },
  gridAutoFit: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '1.25rem',
  },
  accountForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  accountActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    paddingTop: '0.5rem',
  },
  notificationsStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  switchLabelInline: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
} satisfies Record<string, React.CSSProperties>;

/**
 * Navigation tab descriptors for `EnterpriseSettingsPage`.
 */
export const SETTINGS_TABS: TabItem[] = [
  { id: 'appearance', label: 'Appearance', icon: <Palette size={15} /> },
  { id: 'account', label: 'Account', icon: <User size={15} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={15} /> },
];

export const THEME_MODE_OPTIONS: SelectOptionItem[] = [
  {
    value: 'light',
    label: 'Light',
    description: 'High-contrast daylight surface tokens',
    icon: <Sun size={14} />,
    badge: 'Day',
    badgeTone: 'warning',
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'Deep Liquid Glass dark mode surfaces',
    icon: <Moon size={14} />,
    badge: 'Default',
    badgeTone: 'primary',
  },
  {
    value: 'system',
    label: 'System',
    description: 'Automatically follow OS color scheme preference',
    icon: <Monitor size={14} />,
    badge: 'Auto',
    badgeTone: 'info',
  },
];

export const ACCENT_COLOR_OPTIONS: SelectOptionItem[] = [
  {
    value: 'cupertino-blue',
    label: 'Sapphire Blue (Cupertino Blue)',
    description: 'Liquid Glass primary sapphire & cyan tonal palette',
    badge: '#2997FF',
    badgeTone: 'primary',
  },
  {
    value: 'material-violet',
    label: 'Royal Iris (Material Violet)',
    description: 'Material You dynamic lavender & cosmic violet',
    badge: '#D0BCFF',
    badgeTone: 'info',
  },
  {
    value: 'emerald-mint',
    label: 'Emerald Mint',
    description: 'Hybrid fusion northern lights emerald & teal',
    badge: '#10B981',
    badgeTone: 'success',
  },
  {
    value: 'sunset-coral',
    label: 'Sunset Coral',
    description: 'Warm coral & vibrant magenta accents',
    badge: '#F43F5E',
    badgeTone: 'danger',
  },
  {
    value: 'amber-gold',
    label: 'Amber Gold',
    description: 'Solar amber & executive gold highlights',
    badge: '#F59E0B',
    badgeTone: 'warning',
  },
  {
    value: 'graphite-mono',
    label: 'Graphite Mono',
    description: 'Minimalist monochrome slate & titanium neutrals',
    badge: '#94A3B8',
    badgeTone: 'neutral',
  },
];

export const CORNER_RADIUS_OPTIONS: SelectOptionItem[] = [
  {
    value: 'sharp',
    label: 'Sharp (4px)',
    description: 'Crisp technical corners for high-density data views',
    badge: '4px',
    badgeTone: 'neutral',
  },
  {
    value: 'squircle',
    label: 'Squircle (12px)',
    description: 'Balanced Apple HIG continuous corner geometry',
    badge: '12px',
    badgeTone: 'primary',
  },
  {
    value: 'pill',
    label: 'Pill (22px)',
    description: 'Expressive Material You rounded contour geometry',
    badge: '22px',
    badgeTone: 'info',
  },
];

/** Props for {@link AppearanceTab}. */
export interface AppearanceTabProps {
  preferences: ThemePreferences;
  resolvedMode: ResolvedThemeMode;
  onThemeModeChange: (nextMode: ThemeMode) => void;
  onAccentColorChange: (nextPalette: SeedPaletteId) => void;
  onCornerRadiusChange: (nextRadius: RadiusScale) => void;
  onResetDefaults: () => void;
}

/**
 * Appearance & Design Tokens tab panel for `EnterpriseSettingsPage`.
 */
export const AppearanceTab: React.FC<AppearanceTabProps> = ({
  preferences,
  resolvedMode,
  onThemeModeChange,
  onAccentColorChange,
  onCornerRadiusChange,
  onResetDefaults,
}) => (
  <Card
    variant="glass"
    padding="lg"
    title="Appearance & Design Tokens"
    subtitle="Configure theme polarity, Material You seed accent palette, and corner radius geometry."
    headerIcon={<Palette size={18} />}
    footer={
      <div style={SETTINGS_PAGE_STYLES.appearanceFooter}>
        <span style={SETTINGS_PAGE_STYLES.appearanceFooterMeta}>
          Active Tokens: <strong>{preferences.mode.toUpperCase()}</strong> (
          {resolvedMode}) · <strong>{preferences.seedPalette}</strong> ·{' '}
          <strong>{preferences.radiusScale}</strong>
        </span>
        <Button
          variant="tonal"
          size="sm"
          leadingIcon={<RotateCcw size={14} />}
          onClick={onResetDefaults}
        >
          Reset Defaults
        </Button>
      </div>
    }
  >
    <div style={SETTINGS_PAGE_STYLES.gridAutoFit}>
      <Select
        id="settings-theme-mode"
        label="Theme Mode"
        value={preferences.mode}
        onChange={(val) => onThemeModeChange(val as ThemeMode)}
        options={THEME_MODE_OPTIONS}
        searchable={false}
        helperText="Choose between Light, Dark, or OS System synchronization."
      />
      <Select
        id="settings-accent-color"
        label="Accent Color"
        value={preferences.seedPalette}
        onChange={(val) => onAccentColorChange(val as SeedPaletteId)}
        options={ACCENT_COLOR_OPTIONS}
        searchable
        searchPlaceholder="Search seed palettes..."
        helperText="Select the primary seed color palette for surfaces and highlights."
      />
      <Select
        id="settings-corner-radius"
        label="Corner Radius"
        value={preferences.radiusScale}
        onChange={(val) => onCornerRadiusChange(val as RadiusScale)}
        options={CORNER_RADIUS_OPTIONS}
        searchable={false}
        helperText="Adjust component border-radius scale across cards and controls."
      />
    </div>
  </Card>
);

/** Props for {@link AccountTab}. */
export interface AccountTabProps {
  fullName: string;
  email: string;
  accountSaved: boolean;
  onFullNameChange: (nextName: string) => void;
  onEmailChange: (nextEmail: string) => void;
  onSaveAccount: (e?: React.FormEvent | React.MouseEvent) => void;
}

/**
 * Account Profile tab panel for `EnterpriseSettingsPage`.
 */
export const AccountTab: React.FC<AccountTabProps> = ({
  fullName,
  email,
  accountSaved,
  onFullNameChange,
  onEmailChange,
  onSaveAccount,
}) => (
  <Card
    variant="glass"
    padding="lg"
    title="Account Profile"
    subtitle="Update your enterprise administrator identity and primary contact address."
    headerIcon={<User size={18} />}
    headerAction={
      accountSaved ? (
        <Badge
          tone="success"
          variant="tonal"
          leadingIcon={<CheckCircle2 size={13} />}
        >
          Changes Saved
        </Badge>
      ) : undefined
    }
  >
    <form onSubmit={onSaveAccount} style={SETTINGS_PAGE_STYLES.accountForm}>
      <div style={SETTINGS_PAGE_STYLES.gridAutoFit}>
        <Input
          id="settings-account-name"
          label="Full Name"
          value={fullName}
          onChange={onFullNameChange}
          placeholder="Enter your full name"
          leadingIcon={<User size={15} />}
          clearable
          required
          helperText="Displayed across audit logs and workspace activity."
        />
        <Input
          id="settings-account-email"
          label="Email Address"
          type="email"
          value={email}
          onChange={onEmailChange}
          placeholder="name@company.com"
          leadingIcon={<Mail size={15} />}
          clearable
          required
          helperText="Used for SSO verification and security alerts."
        />
      </div>
      <div style={SETTINGS_PAGE_STYLES.accountActions}>
        <Button
          type="button"
          variant="filled"
          size="md"
          leadingIcon={<Save size={15} />}
          onClick={onSaveAccount}
        >
          Save Changes
        </Button>
      </div>
    </form>
  </Card>
);

/** Props for {@link NotificationsTab}. */
export interface NotificationsTabProps {
  emailNotifications: boolean;
  pushNotifications: boolean;
  onUpdateNotification: (
    channel: WorkspaceNotificationChannel,
    enabled: boolean
  ) => void;
}

/**
 * Notification Preferences tab panel for `EnterpriseSettingsPage`.
 */
export const NotificationsTab: React.FC<NotificationsTabProps> = ({
  emailNotifications,
  pushNotifications,
  onUpdateNotification,
}) => (
  <Card
    variant="glass"
    padding="lg"
    title="Notification Preferences"
    subtitle="Control how and when uxiGL dispatches operational alerts and digest reports."
    headerIcon={<Bell size={18} />}
  >
    <div style={SETTINGS_PAGE_STYLES.notificationsStack}>
      <Switch
        id="settings-notify-email"
        value={emailNotifications}
        onChange={(next) => onUpdateNotification('emailNotifications', next)}
        label={
          <span style={SETTINGS_PAGE_STYLES.switchLabelInline}>
            <Mail size={15} /> Email Notifications
          </span>
        }
        description="Receive daily security digests, billing invoices, and compliance audit reports via email."
        tone="primary"
      />
      <Switch
        id="settings-notify-push"
        value={pushNotifications}
        onChange={(next) => onUpdateNotification('pushNotifications', next)}
        label={
          <span style={SETTINGS_PAGE_STYLES.switchLabelInline}>
            <Smartphone size={15} /> Push Notifications
          </span>
        }
        description="Receive instant browser and mobile push alerts for real-time cluster incidents and mentions."
        tone="primary"
      />
    </div>
  </Card>
);
