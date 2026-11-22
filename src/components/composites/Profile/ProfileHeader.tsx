import React from 'react';
import { Globe, Mail, MapPin, Save, Share2 } from 'lucide-react';
import { Avatar } from '../../primitives/Avatar/Avatar';
import { Badge } from '../../primitives/Badge/Badge';
import { Button } from '../../primitives/Button/Button';
import { Card } from '../Card/Card';
import type { ProfileData } from './types';

export interface ProfileHeaderProps {
  profile: ProfileData;
  locale: 'tr' | 'en';
  isDirty?: boolean;
  onSave: () => void;
  onShare: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  locale,
  isDirty = false,
  onSave,
  onShare,
}) => {
  const isTR = locale === 'tr';

  return (
    <Card variant="glass" padding="none" style={{ overflow: 'hidden' }}>
      <div
        style={{
          height: 132,
          background:
            'linear-gradient(120deg, var(--uxu-primary), color-mix(in srgb, var(--uxu-secondary) 72%, #0f172a))',
          position: 'relative',
        }}
      />
      <div style={{ padding: '0 24px 24px 24px' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 16,
            marginTop: -36,
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
            <div
              style={{
                padding: 4,
                borderRadius: 20,
                background: 'var(--uxu-bg-elevated)',
                boxShadow: 'var(--uxu-shadow-elevated)',
              }}
            >
              <Avatar
                name={profile.name}
                src={profile.avatarUrl}
                size="lg"
                status={profile.status ?? 'online'}
                shape="squircle"
              />
            </div>
            <div style={{ paddingBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                  {profile.name}
                </h2>
                <Badge tone="primary" size="xs">
                  {profile.role}
                </Badge>
                {isDirty && (
                  <Badge tone="warning" variant="tonal" size="xs">
                    {isTR ? 'Kaydedilmemiş Değişiklik' : 'Unsaved Changes'}
                  </Badge>
                )}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 12,
                  fontSize: '0.78rem',
                  color: 'var(--uxu-text-secondary)',
                  marginTop: 4,
                }}
              >
                {profile.location && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={13} /> {profile.location}
                  </span>
                )}
                {profile.website && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Globe size={13} /> {profile.website}
                  </span>
                )}
                {profile.email && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Mail size={13} /> {profile.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              type="button"
              variant="tonal"
              size="sm"
              leadingIcon={<Share2 size={14} />}
              onClick={onShare}
            >
              {isTR ? 'Profili Paylaş' : 'Share Profile'}
            </Button>
            <Button
              type="button"
              variant="filled"
              size="sm"
              leadingIcon={<Save size={14} />}
              onClick={onSave}
            >
              {isTR ? 'Değişiklikleri Kaydet' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* KPI Strip */}
        {profile.stats.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 12,
              paddingTop: 12,
              borderTop: '1px solid var(--uxu-border-subtle)',
            }}
          >
            {profile.stats.map((stat) => (
              <div
                key={stat.id}
                style={{
                  padding: 12,
                  borderRadius: 'var(--uxu-radius-md)',
                  background: 'var(--uxu-surface-tonal)',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: 'var(--uxu-text-secondary)' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: 2 }}>
                  {stat.value}
                </div>
                {stat.delta && (
                  <div style={{ fontSize: '0.7rem', color: 'var(--uxu-primary)', marginTop: 2 }}>
                    {stat.delta}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
