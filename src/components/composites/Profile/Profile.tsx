import React, { useCallback, useState } from 'react';
import { Activity, Shield, User } from 'lucide-react';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import { ProfileActivityTab } from './ProfileActivityTab';
import { ProfileHeader } from './ProfileHeader';
import { ProfileOverviewTab } from './ProfileOverviewTab';
import { ProfileSecurityTab } from './ProfileSecurityTab';
import { buildSeedProfileData } from './profileUtils';
import type { ProfileData, ProfileProps, ProfileTabId } from './types';

/**
 * ============================================================================
 * uxiGL COMPOSITE — MODULAR USER PROFILE & SECURITY STUDIO
 * ============================================================================
 * SOLID Architecture:
 * - profileUtils: pure seed data builder
 * - ProfileHeader: cover, avatar, identity metadata, KPI strip & Save/Share actions
 * - ProfileOverviewTab: editable identity fields, bio & interactive skill chips
 * - ProfileSecurityTab: privacy/2FA switches & active session management
 * - ProfileActivityTab: chronological audit & activity timeline
 * - Profile: state orchestration, controlled/uncontrolled sync & storageKey
 */
export const Profile: React.FC<ProfileProps> = ({
  profile: controlledProfile,
  onProfileChange,
  initialProfile,
  defaultTab = 'overview',
  locale = 'tr',
  storageKey,
  onSave,
  onShare,
  onRevokeSession,
  className = '',
  style,
}) => {
  const isTR = locale === 'tr';

  const [internalProfile, setInternalProfile] = useState<ProfileData>(() => {
    if (storageKey && typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object' && parsed.name) return parsed;
        }
      } catch {
        // ignore malformed storage
      }
    }
    return initialProfile ?? buildSeedProfileData(locale);
  });

  const profile = controlledProfile ?? internalProfile;
  const [activeTab, setActiveTab] = useState<ProfileTabId>(defaultTab);
  const [isDirty, setIsDirty] = useState(false);

  const commitProfile = useCallback(
    (updater: (prev: ProfileData) => ProfileData) => {
      setIsDirty(true);
      if (controlledProfile !== undefined) {
        onProfileChange?.(updater(controlledProfile));
        return;
      }
      setInternalProfile((prev) => {
        const next = updater(prev);
        if (storageKey && typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(storageKey, JSON.stringify(next));
          } catch {
            // ignore storage errors
          }
        }
        onProfileChange?.(next);
        return next;
      });
    },
    [controlledProfile, onProfileChange, storageKey]
  );

  const handleUpdatePatch = (patch: Partial<ProfileData>) => {
    commitProfile((prev) => ({ ...prev, ...patch }));
  };

  const handleRevokeSession = (sessionId: string) => {
    commitProfile((prev) => ({
      ...prev,
      sessions: prev.sessions.filter((s) => s.id !== sessionId),
    }));
    onRevokeSession?.(sessionId);
  };

  const handleSave = () => {
    setIsDirty(false);
    onSave?.(profile);
  };

  const handleShare = () => {
    onShare?.(profile);
  };

  return (
    <div
      className={`uxu-profile-module ${className}`.trim()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        width: '100%',
        ...style,
      }}
    >
      <ProfileHeader
        profile={profile}
        locale={locale}
        isDirty={isDirty}
        onSave={handleSave}
        onShare={handleShare}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <SegmentedControl<ProfileTabId>
          size="sm"
          value={activeTab}
          onChange={setActiveTab}
          options={[
            { value: 'overview', label: isTR ? 'Genel Bakış' : 'Overview', icon: <User size={13} /> },
            { value: 'security', label: isTR ? 'Güvenlik & Oturumlar' : 'Security & Sessions', icon: <Shield size={13} /> },
            { value: 'activity', label: isTR ? 'Aktiviteler' : 'Activity', icon: <Activity size={13} /> },
          ]}
        />
      </div>

      {activeTab === 'overview' && (
        <ProfileOverviewTab
          profile={profile}
          locale={locale}
          onUpdate={handleUpdatePatch}
        />
      )}

      {activeTab === 'security' && (
        <ProfileSecurityTab
          profile={profile}
          locale={locale}
          onUpdate={handleUpdatePatch}
          onRevokeSession={handleRevokeSession}
        />
      )}

      {activeTab === 'activity' && (
        <ProfileActivityTab activities={profile.activities} locale={locale} />
      )}
    </div>
  );
};
