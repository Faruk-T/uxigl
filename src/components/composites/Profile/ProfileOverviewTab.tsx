import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '../../primitives/Button/Button';
import { Chip } from '../../primitives/Chip/Chip';
import { Input } from '../../primitives/Input/Input';
import { Textarea } from '../../primitives/Textarea/Textarea';
import { Card } from '../Card/Card';
import type { ProfileData } from './types';

export interface ProfileOverviewTabProps {
  profile: ProfileData;
  locale: 'tr' | 'en';
  onUpdate: (patch: Partial<ProfileData>) => void;
}

export const ProfileOverviewTab: React.FC<ProfileOverviewTabProps> = ({
  profile,
  locale,
  onUpdate,
}) => {
  const isTR = locale === 'tr';
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSkill.trim();
    if (!trimmed || profile.skills.includes(trimmed)) return;
    onUpdate({ skills: [...profile.skills, trimmed] });
    setNewSkill('');
  };

  const handleRemoveSkill = (skill: string) => {
    onUpdate({ skills: profile.skills.filter((s) => s !== skill) });
  };

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
        title={isTR ? 'Kimlik & Biyografi' : 'Identity & Bio'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Input
              label={isTR ? 'Ad Soyad' : 'Full Name'}
              value={profile.name}
              onChange={(val) => onUpdate({ name: val })}
            />
            <Input
              label={isTR ? 'Ünvan / Rol' : 'Role / Title'}
              value={profile.role}
              onChange={(val) => onUpdate({ role: val })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Input
              label={isTR ? 'Konum' : 'Location'}
              value={profile.location}
              onChange={(val) => onUpdate({ location: val })}
            />
            <Input
              label={isTR ? 'Web Sitesi' : 'Website'}
              value={profile.website}
              onChange={(val) => onUpdate({ website: val })}
            />
          </div>

          <Textarea
            label={isTR ? 'Kısa Biyografi' : 'Short Biography'}
            value={profile.bio}
            onChange={(val) => onUpdate({ bio: val })}
            rows={3}
          />
        </div>
      </Card>

      <Card
        variant="glass"
        padding="md"
        title={isTR ? 'Teknoloji & Uzmanlık Etiketleri' : 'Skills & Stack Tags'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {profile.skills.map((skill) => (
              <Chip
                key={skill}
                tone="primary"
                selected
                onClick={() => handleRemoveSkill(skill)}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {skill}
                  <X size={11} />
                </span>
              </Chip>
            ))}
          </div>

          <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <Input
                label={isTR ? 'Yeni Yetenek Ekle' : 'Add New Skill'}
                placeholder={isTR ? 'Örn: Rust, GraphQL...' : 'e.g., Rust, GraphQL...'}
                value={newSkill}
                onChange={setNewSkill}
              />
            </div>
            <Button type="submit" variant="tonal" size="sm" leadingIcon={<Plus size={14} />}>
              {isTR ? 'Ekle' : 'Add'}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};
