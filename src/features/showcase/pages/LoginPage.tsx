import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  KeyRound,
  Fingerprint,
  Globe,
} from 'lucide-react';
import {
  Button,
  Input,
  Checkbox,
  Badge,
  Avatar,
} from '../../../components/primitives';
import { Card, SegmentedControl } from '../../../components/composites';
import { UXILogo } from '../../../components/brand/UXILogo';
import { useToast } from '../../../providers/ToastProvider';

export interface LoginPageProps {
  /** Optional callback when user clicks "Ücretsiz Çalışma Alanı Oluşturun". */
  onNavigateRegister?: () => void;
  /** Initial layout style (`'split'` or `'centered'`). */
  defaultLayout?: 'split' | 'centered';
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateRegister,
  defaultLayout = 'split',
}) => {
  const { notify } = useToast();
  const [loginStyle, setLoginStyle] = useState<'split' | 'centered'>(defaultLayout);
  const [loginEmail, setLoginEmail] = useState('umit.uz@truncgil.com');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggingIn(false);
      notify({
        title: 'Oturum Açıldı',
        description: `${loginEmail} hesabıyla güvenli çalışma alanına giriş yapıldı.`,
        tone: 'success',
      });
    }, 600);
  };

  return (
    <div className="uxu-stack-md" style={{ flex: 1, width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SegmentedControl<'split' | 'centered'>
          size="sm"
          value={loginStyle}
          onChange={setLoginStyle}
          options={[
            { value: 'split', label: 'Split-Screen Kurumsal' },
            { value: 'centered', label: 'Merkezi Yüzen Cam' },
          ]}
        />
      </div>

      {loginStyle === 'split' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            borderRadius: 'var(--uxu-radius-xl, 24px)',
            overflow: 'hidden',
            border: '1px solid var(--uxu-border-subtle)',
            background: 'var(--uxu-surface-glass)',
            boxShadow: 'var(--uxu-shadow-elevated)',
            flex: 1,
            minHeight: 460,
          }}
        >
          {/* Left Brand & Visual Showcase Panel */}
          <div
            style={{
              padding: '40px 36px',
              background:
                'linear-gradient(145deg, color-mix(in srgb, var(--uxu-primary) 22%, var(--uxu-bg-elevated)), var(--uxu-bg-canvas))',
              borderRight: '1px solid var(--uxu-border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 24,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <UXILogo size={36} preserveRatio glow />
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
                  uxiGL Enterprise
                </div>
                <div style={{ fontSize: '0.73rem', color: 'var(--uxu-text-secondary)' }}>
                  Liquid Glass × Dinamik Tonlama Sistemi
                </div>
              </div>
            </div>

            <div style={{ margin: '16px 0' }}>
              <Badge tone="primary" size="sm">
                ZERO-TRUST CLOUD AUTH v2.8
              </Badge>
              <h1
                style={{
                  fontSize: '1.85rem',
                  fontWeight: 800,
                  lineHeight: 1.2,
                  marginTop: 12,
                  marginBottom: 12,
                  letterSpacing: '-0.02em',
                }}
              >
                Yeni Nesil Arayüz ve Veri Motoruna Giriş Yapın
              </h1>
              <p
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--uxu-text-secondary)',
                  lineHeight: 1.6,
                }}
              >
                Tek oturumla SheetGL 120 FPS veri tablolarına, FileManGL 3D dosya
                uzayına ve canlı tema stüdyosuna tam erişim sağlayın.
              </p>

              {/* Mini Floating Glass KPI Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12,
                  marginTop: 24,
                }}
              >
                <div
                  style={{
                    padding: 14,
                    borderRadius: 'var(--uxu-radius-md)',
                    background: 'var(--uxu-surface-glass)',
                    border: '1px solid var(--uxu-border-subtle)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      color: 'var(--uxu-success)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    <ShieldCheck size={15} />
                    <span>Donanım Anahtarı</span>
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: 4 }}>
                    WebAuthn / FIDO2
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--uxu-text-secondary)' }}>
                    Uçtan uca biyometrik koruma
                  </div>
                </div>

                <div
                  style={{
                    padding: 14,
                    borderRadius: 'var(--uxu-radius-md)',
                    background: 'var(--uxu-surface-glass)',
                    border: '1px solid var(--uxu-border-subtle)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      color: 'var(--uxu-primary)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    <Sparkles size={15} />
                    <span>SLA Kararlılığı</span>
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: 4 }}>
                    99.99% Uptime
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--uxu-text-secondary)' }}>
                    4 küresel edge bölgesi aktif
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Footer */}
            <div
              style={{
                padding: 14,
                borderRadius: 'var(--uxu-radius-md)',
                background: 'var(--uxu-surface-tonal)',
                border: '1px solid var(--uxu-border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <Avatar name="Ümit Uz" size="sm" status="online" shape="squircle" />
              <div style={{ fontSize: '0.76rem', lineHeight: 1.4 }}>
                <div style={{ fontWeight: 600, color: 'var(--uxu-text-primary)' }}>
                  &quot;Optik cam yüzey akıcılığı ve dinamik renk uyumu tek bir kurumsal çatı altında.&quot;
                </div>
                <div style={{ color: 'var(--uxu-text-secondary)', marginTop: 2 }}>
                  Trunçgil Teknoloji • Sistem Mimarisi Ekibi
                </div>
              </div>
            </div>
          </div>

          {/* Right Login Form Panel */}
          <div
            style={{
              padding: '40px 36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              maxWidth: 460,
              width: '100%',
              margin: '0 auto',
            }}
          >
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>
                Tekrar Hoş Geldiniz
              </h2>
              <p
                style={{
                  fontSize: '0.82rem',
                  color: 'var(--uxu-text-secondary)',
                  marginTop: 6,
                }}
              >
                Kurumsal kimliğiniz veya Passkey anahtarınız ile oturum açın.
              </p>
            </div>

            {/* SSO Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
              <Button
                variant="tonal"
                size="sm"
                leadingIcon={<Fingerprint size={15} />}
                onClick={() =>
                  notify({
                    title: 'Biyometrik Passkey Doğrulaması',
                    description: 'WebAuthn biyometrik güvenlik anahtarınız doğrulandı.',
                    tone: 'info',
                  })
                }
              >
                Passkey ile Giriş
              </Button>
              <Button
                variant="tonal"
                size="sm"
                leadingIcon={<Globe size={15} />}
                onClick={() =>
                  notify({
                    title: 'Kurumsal Tek Oturum (SSO)',
                    description: 'Kurumsal OAuth 2.0 / SAML yönlendirmesi başlatıldı.',
                    tone: 'primary',
                  })
                }
              >
                Kurumsal SSO
              </Button>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 20,
                color: 'var(--uxu-text-muted)',
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              <div style={{ flex: 1, height: 1, background: 'var(--uxu-border-subtle)' }} />
              <span>veya e-posta ile</span>
              <div style={{ flex: 1, height: 1, background: 'var(--uxu-border-subtle)' }} />
            </div>

            <form onSubmit={handleLoginSubmit} className="uxu-stack-md">
              <Input
                label="Kurumsal E-Posta"
                type="email"
                value={loginEmail}
                onChange={setLoginEmail}
                leadingIcon={<Mail size={15} />}
                placeholder="ad.soyad@truncgil.com"
                required
              />

              <div>
                <Input
                  label="Parola"
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={setLoginPassword}
                  leadingIcon={<Lock size={15} />}
                  trailingIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--uxu-text-secondary)',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                      }}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                  required
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.78rem',
                }}
              >
                <Checkbox
                  label="Oturumu 30 gün açık tut"
                  value={rememberMe}
                  onChange={setRememberMe}
                />
                <button
                  type="button"
                  onClick={() =>
                    notify({
                      title: 'Parola Sıfırlama Bağlantısı',
                      description: `${loginEmail} adresine sıfırlama bağlantısı gönderildi.`,
                      tone: 'info',
                    })
                  }
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--uxu-primary)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                  }}
                >
                  Şifremi Unuttum?
                </button>
              </div>

              <Button
                type="submit"
                variant="filled"
                fullWidth
                trailingIcon={<ArrowRight size={15} />}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? 'Doğrulanıyor...' : 'Güvenli Oturum Aç'}
              </Button>
            </form>

            {onNavigateRegister && (
              <div
                style={{
                  marginTop: 24,
                  paddingTop: 16,
                  borderTop: '1px solid var(--uxu-border-subtle)',
                  textAlign: 'center',
                  fontSize: '0.78rem',
                  color: 'var(--uxu-text-secondary)',
                }}
              >
                Henüz kurumsal hesabınız yok mu?{' '}
                <button
                  type="button"
                  onClick={onNavigateRegister}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--uxu-primary)',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Ücretsiz Çalışma Alanı Oluşturun →
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Centered Lock Screen Style Floating Liquid Glass Login */
        <div
          style={{
            flex: 1,
            minHeight: 460,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px 16px',
            borderRadius: 'var(--uxu-radius-xl, 24px)',
            background:
              'radial-gradient(circle at 50% 20%, color-mix(in srgb, var(--uxu-primary) 26%, transparent), var(--uxu-bg-canvas) 75%)',
            border: '1px solid var(--uxu-border-subtle)',
          }}
        >
          <Card
            variant="glass"
            padding="lg"
            style={{
              maxWidth: 400,
              width: '100%',
              textAlign: 'center',
              boxShadow: 'var(--uxu-shadow-elevated)',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                marginBottom: 20,
              }}
            >
              <UXILogo size={42} preserveRatio glow />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '6px 0 0 0' }}>
                uxiGL ID ile Giriş
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--uxu-text-secondary)', margin: 0 }}>
                Optik Liquid Glass Kimlik Doğrulama
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="uxu-stack-md" style={{ textAlign: 'left' }}>
              <Input
                label="uxiGL ID veya E-Posta"
                value={loginEmail}
                onChange={setLoginEmail}
                leadingIcon={<Mail size={15} />}
              />
              <Input
                label="Parola"
                type={showPassword ? 'text' : 'password'}
                value={loginPassword}
                onChange={setLoginPassword}
                leadingIcon={<KeyRound size={15} />}
              />
              <Button type="submit" variant="filled" fullWidth trailingIcon={<ArrowRight size={15} />}>
                Devam Et
              </Button>
              <Button
                type="button"
                variant="tonal"
                fullWidth
                leadingIcon={<Fingerprint size={16} />}
                onClick={() =>
                  notify({
                    title: 'Biyometrik Passkey Aktif',
                    description: 'Biyometrik doğrulama başarıyla tamamlandı.',
                    tone: 'success',
                  })
                }
              >
                Biyometrik Passkey Kullan
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

