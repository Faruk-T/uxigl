import type { IThemeStorageAdapter, ThemePreferences } from '../contracts/ThemeContract';
import { DEFAULT_THEME_PREFERENCES } from '../tokens/designTokens';

/**
 * ============================================================================
 * uxiGL DESIGN SYSTEM — PERSISTENT STORAGE ADAPTER SERVICE (DIP & SRP)
 * ============================================================================
 * [SRP] Responsible for reliably persisting and restoring user theme & layout
 * preferences across browser refreshes (F5).
 */

const STORAGE_KEY = 'uxu.theme.preferences';
const LEGACY_KEYS = [
  'uxu.design_system.theme_preferences.v3',
  'uxu.design_system.theme_preferences.v2',
  'uxu.design_system.theme_preferences.v1',
];

const NAV_STORAGE_KEY = 'uxu.nav.state';

export interface PersistedNavState {
  activeSectionId: string;
  activeSubItemId: string;
  sidebarCollapsed: boolean;
  sidebarVariant?: string;
  sidebarAccent?: string;
}

export class LocalStorageThemeAdapter implements IThemeStorageAdapter {
  public loadPreferences(): ThemePreferences | null {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return null;
      }

      let raw = window.localStorage.getItem(STORAGE_KEY);

      // Migrate from any previous version key if primary key is not yet populated
      if (!raw) {
        for (const legacyKey of LEGACY_KEYS) {
          const legacyRaw = window.localStorage.getItem(legacyKey);
          if (legacyRaw) {
            raw = legacyRaw;
            window.localStorage.setItem(STORAGE_KEY, legacyRaw);
            break;
          }
        }
      }

      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<ThemePreferences>;
      return {
        ...DEFAULT_THEME_PREFERENCES,
        ...parsed,
      };
    } catch {
      return null;
    }
  }

  public savePreferences(prefs: ThemePreferences): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // Fail gracefully in private browsing / quota exceeded
    }
  }

  public clearPreferences(): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      window.localStorage.removeItem(STORAGE_KEY);
      for (const legacyKey of LEGACY_KEYS) {
        window.localStorage.removeItem(legacyKey);
      }
    } catch {
      // Ignore
    }
  }

  public loadNavState(): PersistedNavState | null {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return null;
      }
      const raw = window.localStorage.getItem(NAV_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as PersistedNavState;
    } catch {
      return null;
    }
  }

  public saveNavState(state: PersistedNavState): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      window.localStorage.setItem(NAV_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore
    }
  }
}

export const defaultThemeStorageAdapter = new LocalStorageThemeAdapter();

/**
 * Storage key for persisted enterprise workspace account and notification preferences.
 */
export const WORKSPACE_SETTINGS_STORAGE_KEY = 'uxigl.workspace.settings.v1';

/**
 * Persisted workspace settings payload managed by {@link IWorkspaceSettingsStorageAdapter}.
 */
export interface PersistedWorkspaceSettings {
  /** Administrator display name shown across workspace headers and audit trails. */
  fullName: string;
  /** Primary contact email address for SSO and operational notifications. */
  email: string;
  /** Whether daily security digests and billing emails are enabled. */
  emailNotifications: boolean;
  /** Whether real-time browser/mobile push alerts are enabled. */
  pushNotifications: boolean;
}

/**
 * Default enterprise workspace settings fallback when storage is unpopulated or reset.
 */
export const DEFAULT_WORKSPACE_SETTINGS: PersistedWorkspaceSettings = {
  fullName: 'Kerim Demir',
  email: 'kerim.demir@enterprise.uxigl.io',
  emailNotifications: true,
  pushNotifications: false,
};

/**
 * Dependency Inversion contract ([DIP]) for loading, saving, and resetting
 * persistent enterprise workspace settings.
 */
export interface IWorkspaceSettingsStorageAdapter {
  /** Loads persisted workspace settings or falls back to {@link DEFAULT_WORKSPACE_SETTINGS}. */
  loadSettings(): PersistedWorkspaceSettings;
  /** Persists the provided workspace settings snapshot. */
  saveSettings(settings: PersistedWorkspaceSettings): void;
  /** Removes persisted workspace settings from storage. */
  clearSettings(): void;
}

/**
 * Browser `localStorage` implementation of {@link IWorkspaceSettingsStorageAdapter}.
 */
export class WorkspaceSettingsStorageAdapter
  implements IWorkspaceSettingsStorageAdapter
{
  public loadSettings(): PersistedWorkspaceSettings {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return DEFAULT_WORKSPACE_SETTINGS;
      }
      const raw = window.localStorage.getItem(WORKSPACE_SETTINGS_STORAGE_KEY);
      if (!raw) return DEFAULT_WORKSPACE_SETTINGS;
      const parsed = JSON.parse(raw) as Partial<PersistedWorkspaceSettings>;
      return {
        fullName:
          typeof parsed.fullName === 'string'
            ? parsed.fullName
            : DEFAULT_WORKSPACE_SETTINGS.fullName,
        email:
          typeof parsed.email === 'string'
            ? parsed.email
            : DEFAULT_WORKSPACE_SETTINGS.email,
        emailNotifications:
          typeof parsed.emailNotifications === 'boolean'
            ? parsed.emailNotifications
            : DEFAULT_WORKSPACE_SETTINGS.emailNotifications,
        pushNotifications:
          typeof parsed.pushNotifications === 'boolean'
            ? parsed.pushNotifications
            : DEFAULT_WORKSPACE_SETTINGS.pushNotifications,
      };
    } catch {
      return DEFAULT_WORKSPACE_SETTINGS;
    }
  }

  public saveSettings(settings: PersistedWorkspaceSettings): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      window.localStorage.setItem(
        WORKSPACE_SETTINGS_STORAGE_KEY,
        JSON.stringify(settings)
      );
    } catch {
      // Fail gracefully in private browsing / quota exceeded
    }
  }

  public clearSettings(): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      window.localStorage.removeItem(WORKSPACE_SETTINGS_STORAGE_KEY);
    } catch {
      // Ignore
    }
  }
}

/**
 * Default singleton instance of {@link WorkspaceSettingsStorageAdapter}.
 */
export const defaultWorkspaceSettingsStorageAdapter =
  new WorkspaceSettingsStorageAdapter();

/**
 * Loads persisted workspace settings via {@link defaultWorkspaceSettingsStorageAdapter}.
 */
export function loadWorkspaceSettings(): PersistedWorkspaceSettings {
  return defaultWorkspaceSettingsStorageAdapter.loadSettings();
}

/**
 * Saves workspace settings via {@link defaultWorkspaceSettingsStorageAdapter}.
 */
export function saveWorkspaceSettings(
  settings: PersistedWorkspaceSettings
): void {
  defaultWorkspaceSettingsStorageAdapter.saveSettings(settings);
}

/**
 * Clears persisted workspace settings via {@link defaultWorkspaceSettingsStorageAdapter}.
 */
export function clearWorkspaceSettings(): void {
  defaultWorkspaceSettingsStorageAdapter.clearSettings();
}
