import React, { useState } from 'react';
import { Share2, MapPin, Globe } from 'lucide-react';
import {
  Button,
  Switch,
  Badge,
  Chip,
  Avatar,
  Textarea,
} from '../../../components/primitives';
import { Card } from '../../../components/composites';
import { useToast } from '../../../providers/ToastProvider';

export const ProfilePage: React.FC = () => {
  const { notify } = useToast();
  const [profileBio, setProfileBio] = useState(
    'Modüler tasarım sistemleri, 8pt uzamsal grid mimarisi, WebGL2 veri sanallaştırma motorları (SheetGL, FileManGL) ve yüksek performanslı bulut mimarileri üzerine çalışıyorum.'
  );
  const [profilePublic, setProfilePublic] = useState(true);
  const [twoFactorActive, setTwoFactorActive] = useState(true);

  return (
    <div className="uxu-stack-lg">
      {/* Profile Cover & Avatar Header Card */}
      <Card variant="glass" padding="none" style={{ overflow: 'hidden' }}>
        <div
          style={{
            height: 130,
            background:
              'linear-gradient(120deg, var(--uxu-primary), color-mix(in srgb, var(--uxu-secondary) 70%, #0f172a))',
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
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
              <div
                style={{
                  padding: 4,
                  borderRadius: 20,
                  background: 'var(--uxu-bg-elevated)',
                  boxShadow: 'var(--uxu-shadow-elevated)',
                }}
              >
                <Avatar name="Ümit Uz" size="lg" status="online" shape="squircle" />
              </div>
              <div style={{ paddingBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                    Ümit Uz
                  </h2>
                  <Badge tone="primary" size="xs">
                    SYSTEM ARCHITECT
                  </Badge>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    fontSize: '0.78rem',
                    color: 'var(--uxu-text-secondary)',
                    marginTop: 4,
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={13} /> İstanbul, Türkiye
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Globe size={13} /> uxigl.truncgil.com
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <Button
                variant="tonal"
                size="sm"
                leadingIcon={<Share2 size={14} />}
                onClick={() =>
                  notify({
                    title: 'Profil Bağlantısı Kopyalandı',
                    description: 'https://uxigl.truncgil.com/@umituz',
                    tone: 'info',
                  })
                }
              >
                Profili Paylaş
              </Button>
              <Button
                variant="filled"
                size="sm"
                onClick={() =>
                  notify({
                    title: 'Profil Güncellendi',
                    description: 'Değişiklikleriniz bulut profilinize kaydedildi.',
                    tone: 'success',
                  })
                }
              >
                Değişiklikleri Kaydet
              </Button>
            </div>
          </div>

          {/* 4 KPI Strip inside Profile */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 12,
              paddingTop: 12,
              borderTop: '1px solid var(--uxu-border-subtle)',
            }}
          >
            {[
              { label: 'Toplam Commit (2026)', val: '4,820', delta: '+18% bu ay' },
              { label: 'Yayınlanan NPM Paketi', val: '14 Paket', delta: 'v2.8.0 aktif' },
              { label: 'Açık Kaynak Yıldızı', val: '3.4K ★', delta: 'GitHub Trending' },
              { label: 'Mimari Uyum Skoru', val: '99.4%', delta: '8pt Uzamsal Grid' },
            ].map((stat) => (
              <div
                key={stat.label}
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
                  {stat.val}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--uxu-primary)', marginTop: 2 }}>
                  {stat.delta}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 20,
        }}
      >
        {/* Left Column: Bio & Skills & Security */}
        <Card variant="glass" padding="md" title="Hakkında & Uzmanlık Alanları">
          <div className="uxu-stack-md">
            <Textarea
              label="Kısa Biyografi"
              value={profileBio}
              onChange={setProfileBio}
              rows={3}
            />

            <div>
              <div
                style={{
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  color: 'var(--uxu-text-secondary)',
                  marginBottom: 8,
                }}
              >
                Teknoloji & Mimari Etiketleri
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {[
                  'TypeScript 5.8',
                  'React 19',
                  'WebGL2 Shaders',
                  '8pt Spatial Grid',
                  'Dynamic Tonal',
                  'SheetGL',
                  'FileManGL',
                  'Zero-Trust IAM',
                ].map((skill) => (
                  <Chip key={skill} tone="primary" selected>
                    {skill}
                  </Chip>
                ))}
              </div>
            </div>

            <div
              style={{
                paddingTop: 12,
                borderTop: '1px solid var(--uxu-border-subtle)',
              }}
              className="uxu-stack-sm"
            >
              <Switch
                label="Herkese Açık Geliştirici Profili"
                helperText="Profiliniz arama motorlarında ve ekip dizininde görüntülensin"
                value={profilePublic}
                onChange={setProfilePublic}
              />
              <Switch
                label="Donanım Anahtarı (Passkey 2FA) Zorunluluğu"
                helperText="Yeni cihaz girişlerinde biyometrik onay iste"
                value={twoFactorActive}
                onChange={setTwoFactorActive}
              />
            </div>
          </div>
        </Card>

        {/* Right Column: Active Sessions & Activity Timeline */}
        <Card variant="glass" padding="md" title="Aktif Cihazlar & Son Aktiviteler">
          <div className="uxu-stack-md">
            <div className="uxu-stack-sm">
              {[
                {
                  device: 'Workstation Pro 16" (ARM64 • Masaüstü OS)',
                  loc: 'İstanbul, TR • Mevcut Oturum',
                  active: true,
                },
                {
                  device: 'Mobile Pro Max (Mobil OS • WebKit Tarayıcı)',
                  loc: 'İstanbul, TR • 14 dk önce',
                  active: false,
                },
              ].map((sess) => (
                <div
                  key={sess.device}
                  style={{
                    padding: 12,
                    borderRadius: 'var(--uxu-radius-md)',
                    background: 'var(--uxu-surface-tonal)',
                    border: '1px solid var(--uxu-border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{sess.device}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--uxu-text-secondary)' }}>
                      {sess.loc}
                    </div>
                  </div>
                  <Badge tone={sess.active ? 'success' : 'neutral'} size="xs">
                    {sess.active ? 'Aktif' : 'Mobil'}
                  </Badge>
                </div>
              ))}
            </div>

            <div
              style={{
                paddingTop: 12,
                borderTop: '1px solid var(--uxu-border-subtle)',
              }}
            >
              <div
                style={{
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  color: 'var(--uxu-text-secondary)',
                  marginBottom: 10,
                }}
              >
                Son Sistem Hareketleri
              </div>
              <div className="uxu-stack-sm">
                {[
                  {
                    time: '10 dk önce',
                    text: 'truncgil-uxigl@2.8.0 paketi NPM üzerinde yayınlandı.',
                    tone: 'primary' as const,
                  },
                  {
                    time: '1 saat önce',
                    text: '8pt uzamsal grid ve yüzey tokenları güncellendi.',
                    tone: 'success' as const,
                  },
                  {
                    time: 'Dün',
                    text: 'SheetGL finans veri kümesi (150K satır) senkronize edildi.',
                    tone: 'info' as const,
                  },
                ].map((act) => (
                  <div
                    key={act.text}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.78rem',
                      padding: '6px 0',
                    }}
                  >
                    <span>{act.text}</span>
                    <Badge tone={act.tone} size="xs">
                      {act.time}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
