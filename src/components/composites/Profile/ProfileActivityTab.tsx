import React from 'react';
import { Activity } from 'lucide-react';
import { Badge } from '../../primitives/Badge/Badge';
import { Card } from '../Card/Card';
import type { ProfileActivity } from './types';

export interface ProfileActivityTabProps {
  activities: ProfileActivity[];
  locale: 'tr' | 'en';
}

export const ProfileActivityTab: React.FC<ProfileActivityTabProps> = ({
  activities,
  locale,
}) => {
  const isTR = locale === 'tr';

  return (
    <Card
      variant="glass"
      padding="md"
      title={isTR ? 'Son Sistem & Hesap Hareketleri' : 'Recent System & Account Activity'}
      headerIcon={<Activity size={17} />}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {activities.map((act) => (
          <div
            key={act.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 'var(--uxu-radius-md)',
              background: 'var(--uxu-surface-tonal)',
              border: '1px solid var(--uxu-border-subtle)',
              fontSize: '0.8rem',
            }}
          >
            <span style={{ fontWeight: 500 }}>{act.text}</span>
            <Badge tone={act.tone} size="xs">
              {act.time}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
};
