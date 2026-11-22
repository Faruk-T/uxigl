import type React from 'react';

export type ProfileTabId = 'overview' | 'security' | 'activity';

export interface ProfileStat {
  id: string;
  label: string;
  value: string;
  delta?: string;
}

export interface ProfileSession {
  id: string;
  device: string;
  location: string;
  active: boolean;
  lastActive?: string;
}

export interface ProfileActivity {
  id: string;
  time: string;
  text: string;
  tone: 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'neutral';
}

export interface ProfileData {
  name: string;
  role: string;
  location: string;
  website: string;
  email?: string;
  avatarUrl?: string;
  status?: 'online' | 'away' | 'busy' | 'offline';
  bio: string;
  skills: string[];
  isPublic: boolean;
  twoFactorEnabled: boolean;
  stats: ProfileStat[];
  sessions: ProfileSession[];
  activities: ProfileActivity[];
}

export interface ProfileProps {
  /** Controlled profile data. */
  profile?: ProfileData;
  /** Controlled profile updater. */
  onProfileChange?: (next: ProfileData) => void;
  /** Initial profile data when uncontrolled. */
  initialProfile?: ProfileData;
  /** Initial active tab (`'overview' | 'security' | 'activity'`, default `'overview'`). */
  defaultTab?: ProfileTabId;
  /** Display locale (`'tr' | 'en'`, default `'tr'`). */
  locale?: 'tr' | 'en';
  /** Optional localStorage key for uncontrolled persistence. */
  storageKey?: string;
  /** Callback when the user clicks Save. */
  onSave?: (profile: ProfileData) => void;
  /** Callback when the user clicks Share. */
  onShare?: (profile: ProfileData) => void;
  /** Callback when a session is revoked. */
  onRevokeSession?: (sessionId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}
