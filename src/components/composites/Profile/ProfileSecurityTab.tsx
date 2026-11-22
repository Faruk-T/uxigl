import React from 'react';
import { LogOut, ShieldCheck } from 'lucide-react';
import { Badge } from '../../primitives/Badge/Badge';
import { Button } from '../../primitives/Button/Button';
import { Switch } from '../../primitives/Switch/Switch';
import { Card } from '../Card/Card';
import type { ProfileData } from './types';

export interface ProfileSecurityTabProps {
  profile: ProfileData;
  locale: 'tr' | 'en';
  onUpdate: (patch: Partial<ProfileData>) => void;
  onRevokeSession: (sessionId: string) => void;
}

export const ProfileSecurityTab: React.FC<ProfileSecurityTabProps> = ({
  profile,
  locale,
  onUpdate,
  onRevokeSession,
}) => {
  const isTR = locale === 'tr';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 16,
      }}
    >
      <Card
        variant="glass"
        padding="md"
        title={isTR ? 'Gizlilik & Zero-Trust Güvenlik' : 'Privacy & Zero-Trust Security'}
        headerIcon={<ShieldCheck size={17} />}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Switch
            label={isTR ? 'Herkese Açık Geliştirici Profili' : 'Public Developer Profile'}
            helperText={
              isTR
                ? 'Profiliniz arama motorlarında ve ekip dizininde görüntülensin'
                : 'Allow your profile to appear in team directories and search'
            }
            value={profile.isPublic}
            onChange={(val) => onUpdate({ isPublic: val })}
          />
          <Switch
            label={
              isTR
                ? 'Donanım Anahtarı (Passkey 2FA) Zorunluluğu'
                : 'Require Hardware Key (Passkey 2FA)'
            }
            helperText={
              isTR
                ? 'Yeni cihaz girişlerinde biyometrik onay iste'
                : 'Require biometric verification on new device logins'
            }
            value={profile.twoFactorEnabled}
            onChange={(val) => onUpdate({ twoFactorEnabled: val })}
          />
        </div>
      </Card>

      <Card
        variant="glass"
        padding="md"
        title={isTR ? 'Aktif Oturumlar & Cihazlar' : 'Active Sessions & Devices'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {profile.sessions.map((sess) => (
            <div
              key={sess.id}
              style={{
                padding: 12,
                borderRadius: 'var(--uxu-radius-md)',
                background: 'var(--uxu-surface-tonal)',
                border: '1px solid var(--uxu-border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{sess.device}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--uxu-text-secondary)' }}>
                  {sess.location}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Badge tone={sess.active ? 'success' : 'neutral'} size="xs">
                  {sess.active ? (isTR ? 'Aktif' : 'Active') : sess.lastActive ?? 'Idle'}
                </Badge>
                {!sess.active && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    leadingIcon={<LogOut size={12} />}
                    style={{ color: 'var(--uxu-danger)' }}
                    onClick={() => onRevokeSession(sess.id)}
                  >
                    {isTR ? 'Kapat' : 'Revoke'}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
