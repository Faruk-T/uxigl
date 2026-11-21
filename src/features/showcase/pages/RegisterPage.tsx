import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Check,
  ShieldCheck,
  Building2,
  UserCheck,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import {
  Button,
  Input,
  Badge,
  Progress,
  GoogleIcon,
} from '../../../components/primitives';
import { Card } from '../../../components/composites';
import { useToast } from '../../../providers/ToastProvider';

export interface RegisterPageProps {
  /** Optional callback when user clicks "Zaten Hesabım Var". */
  onNavigateLogin?: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigateLogin }) => {
  const { notify } = useToast();
  const [regStep, setRegStep] = useState<1 | 2 | 3>(1);
  const [regName, setRegName] = useState('Ümit Uz');
  const [regEmail, setRegEmail] = useState('umit@truncgil.com');
  const [regPass, setRegPass] = useState('Truncgil!2026');
  const [regRole, setRegRole] = useState<'architect' | 'designer' | 'devops' | 'product'>('architect');
  const [regWorkspace, setRegWorkspace] = useState('truncgil-cloud');
  const [otpDigits, setOtpDigits] = useState(['4', '8', '2', '9', '1', '6']);

  return (
    <div
      style={{
        width: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Card
        variant="glass"
        padding="lg"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Step Indicator Header */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <Badge tone="primary" size="sm">
              ADIM {regStep} / 3
            </Badge>
            <span style={{ fontSize: '0.76rem', color: 'var(--uxu-text-secondary)' }}>
              {regStep === 1 && 'Hesap Bilgileri & Güvenlik'}
              {regStep === 2 && 'Rol & Çalışma Alanı Yapılandırması'}
              {regStep === 3 && 'İki Faktörlü (2FA) Kod Doğrulaması'}
            </span>
          </div>
          <Progress value={regStep === 1 ? 33 : regStep === 2 ? 66 : 100} tone="primary" />
        </div>

        {regStep === 1 && (
          <div className="uxu-stack-md">
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0 }}>
                Kurumsal Geliştirici Hesabı Oluşturun
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--uxu-text-secondary)', marginTop: 4 }}>
                14 gün boyunca tüm kurumsal WebGL bileşenlerini ücretsiz deneyimleyin.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Input
                label="Ad Soyad"
                value={regName}
                onChange={setRegName}
                leadingIcon={<UserCheck size={15} />}
              />
              <Input
                label="İş E-Postası"
                value={regEmail}
                onChange={setRegEmail}
                leadingIcon={<Mail size={15} />}
              />
            </div>

            <Input
              label="Güçlü Parola Oluşturun"
              type="text"
              value={regPass}
              onChange={setRegPass}
              leadingIcon={<Lock size={15} />}
              helperText="En az 8 karakter, bir büyük harf ve bir özel sembol içermelidir."
            />

            {/* Password Strength Meter */}
            <div
              style={{
                padding: 12,
                borderRadius: 'var(--uxu-radius-md)',
                background: 'var(--uxu-surface-tonal)',
                border: '1px solid var(--uxu-border-subtle)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                  marginBottom: 6,
                }}
              >
                <span style={{ fontWeight: 600 }}>Parola Güvenlik Seviyesi</span>
                <span style={{ color: 'var(--uxu-success)', fontWeight: 700 }}>
                  Kurumsal Düzey (Güçlü)
                </span>
              </div>
              <Progress value={regPass.length >= 10 ? 100 : 60} tone="success" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }}>
              {onNavigateLogin ? (
                <Button variant="tonal" onClick={onNavigateLogin}>
                  Zaten Hesabım Var
                </Button>
              ) : (
                <div />
              )}
              <Button
                variant="filled"
                trailingIcon={<ChevronRight size={15} />}
                onClick={() => setRegStep(2)}
              >
                Çalışma Alanı Ayarlarına Geç
              </Button>
            </div>
          </div>
        )}

        {regStep === 2 && (
          <div className="uxu-stack-md">
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0 }}>
                Ekip Rolünüzü ve Çalışma Alanınızı Seçin
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--uxu-text-secondary)', marginTop: 4 }}>
                Panonuz seçtiğiniz role göre hazır bileşenlerle özelleştirilecektir.
              </p>
            </div>

            <Input
              label="Çalışma Alanı Adı (Workspace Slug)"
              value={regWorkspace}
              onChange={setRegWorkspace}
              leadingIcon={<Building2 size={15} />}
              helperText={`Özel erişim adresiniz: https://${regWorkspace || 'ekip'}.uxigl.truncgil.com`}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                {
                  id: 'architect',
                  title: 'System / Frontend Architect',
                  desc: 'Tasarım tokenları, SOLID mimari ve WebGL veri tabloları',
                  icon: 'architecture',
                },
                {
                  id: 'designer',
                  title: 'UI / UX Product Designer',
                  desc: 'Canlı tema stüdyosu, dinamik renk paletleri ve cam efektleri',
                  icon: 'palette',
                },
                {
                  id: 'devops',
                  title: 'Cloud & DevOps Lead',
                  desc: 'Küme telemetrisi, SLA raporları ve VFS dosya yöneticisi',
                  icon: 'dns',
                },
                {
                  id: 'product',
                  title: 'Product Manager',
                  desc: 'Analitik hunisi, CRM siparişleri ve Kanban sprint panosu',
                  icon: 'insights',
                },
              ].map((r) => {
                const active = regRole === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setRegRole(r.id as typeof regRole)}
                    style={{
                      padding: 14,
                      borderRadius: 'var(--uxu-radius-md)',
                      border: active
                        ? '1.5px solid var(--uxu-primary)'
                        : '1px solid var(--uxu-border-subtle)',
                      background: active
                        ? 'var(--uxu-primary-container)'
                        : 'var(--uxu-surface-tonal)',
                      cursor: 'pointer',
                      transition: 'all 140ms ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <GoogleIcon name={r.icon} size={20} filled={active} />
                      <strong style={{ fontSize: '0.84rem' }}>{r.title}</strong>
                    </div>
                    <p style={{ fontSize: '0.74rem', color: 'var(--uxu-text-secondary)', margin: 0 }}>
                      {r.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8 }}>
              <Button variant="tonal" leadingIcon={<ChevronLeft size={15} />} onClick={() => setRegStep(1)}>
                Geri
              </Button>
              <Button variant="filled" trailingIcon={<ChevronRight size={15} />} onClick={() => setRegStep(3)}>
                2FA Doğrulamasına Geç
              </Button>
            </div>
          </div>
        )}

        {regStep === 3 && (
          <div className="uxu-stack-md" style={{ textAlign: 'center', padding: '12px 0' }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'var(--uxu-primary-container)',
                color: 'var(--uxu-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
              }}
            >
              <ShieldCheck size={26} />
            </div>

            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0 }}>
                6 Haneli Güvenlik Kodunu Girin
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--uxu-text-secondary)', marginTop: 4 }}>
                <strong>{regEmail}</strong> adresine gönderilen tek kullanımlık doğrulama kodunu girin.
              </p>
            </div>

            {/* 6-Digit OTP Input Boxes */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '12px 0' }}>
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setOtpDigits((prev) => prev.map((d, i) => (i === idx ? val : d)));
                  }}
                  style={{
                    width: 48,
                    height: 54,
                    textAlign: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    fontFamily: 'var(--uxu-font-mono)',
                    borderRadius: 'var(--uxu-radius-md)',
                    border: '1.5px solid var(--uxu-primary)',
                    background: 'var(--uxu-surface-tonal)',
                    color: 'var(--uxu-text-primary)',
                    outline: 'none',
                  }}
                />
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12 }}>
              <Button variant="tonal" leadingIcon={<ChevronLeft size={15} />} onClick={() => setRegStep(2)}>
                Geri
              </Button>
              <Button
                variant="filled"
                leadingIcon={<Check size={15} />}
                onClick={() => {
                  notify({
                    title: 'Kurumsal Hesap Hazır!',
                    description: `${regWorkspace}.uxigl.truncgil.com çalışma alanınız oluşturuldu.`,
                    tone: 'success',
                  });
                }}
              >
                Hesabı Doğrula ve Başlat
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

