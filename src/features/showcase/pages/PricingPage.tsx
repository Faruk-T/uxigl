import React, { useState } from 'react';
import { Check, Star } from 'lucide-react';
import { Button, Badge, Slider } from '../../../components/primitives';
import { Card, SegmentedControl, Accordion } from '../../../components/composites';
import { useToast } from '../../../providers/ToastProvider';

export interface PricingPageProps {
  /** Optional callback when user clicks "Pro Pakete Geç". */
  onSelectProPlan?: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onSelectProPlan }) => {
  const { notify } = useToast();
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
  const [teamSeats, setTeamSeats] = useState(12);

  return (
    <div className="uxu-stack-lg">
      {/* Header & Billing Switcher */}
      <Card variant="glass" padding="lg">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div>
            <Badge tone="primary" size="sm">
              ŞEFFAF LİSANSLAMA • %20 YILLIK AVANTAJ
            </Badge>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '8px 0 4px 0' }}>
              Ekibinizin Ölçeğine Uygun Paketi Seçin
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--uxu-text-secondary)', margin: 0 }}>
              Tüm paketlerde canlı tema motoru, dinamik tonlama ve temel bileşenler dahildir.
            </p>
          </div>

          <SegmentedControl<'annual' | 'monthly'>
            size="sm"
            value={billingCycle}
            onChange={setBillingCycle}
            options={[
              { value: 'annual', label: 'Yıllık Faturalandırma (%20 İndirim)' },
              { value: 'monthly', label: 'Aylık Faturalandırma' },
            ]}
          />
        </div>

        {/* Interactive Team Seat Calculator */}
        <div
          style={{
            marginTop: 20,
            padding: 16,
            borderRadius: 'var(--uxu-radius-md)',
            background: 'var(--uxu-surface-tonal)',
            border: '1px solid var(--uxu-border-subtle)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
              Geliştirici Koltuk Sayısı (Team Seats): <strong>{teamSeats} Kişi</strong>
            </span>
            <Badge tone="success" size="sm">
              Tahmini Pro Maliyet: $
              {billingCycle === 'annual' ? teamSeats * 24 : teamSeats * 29} / ay
            </Badge>
          </div>
          <Slider
            min={1}
            max={50}
            step={1}
            value={teamSeats}
            onChange={setTeamSeats}
          />
        </div>
      </Card>

      {/* 3-Column Pricing Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
        }}
      >
        {/* Starter Plan */}
        <Card variant="glass" padding="lg">
          <div className="uxu-stack-md">
            <div>
              <Badge tone="neutral" size="xs">
                COMMUNITY
              </Badge>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '8px 0 4px 0' }}>
                Starter Open-Source
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--uxu-text-secondary)', margin: 0 }}>
                Bireysel geliştiriciler ve açık kaynak projeler için.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800 }}>$0</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--uxu-text-secondary)' }}>
                / sonsuza dek ücretsiz
              </span>
            </div>

            <Button
              variant="tonal"
              fullWidth
              onClick={() =>
                notify({
                  title: 'NPM Kurulum Komutu',
                  description: 'npm i truncgil-uxigl komutu panoya kopyalandı.',
                  tone: 'info',
                })
              }
            >
              Ücretsiz Başla ($ npm i)
            </Button>

            <div className="uxu-stack-sm" style={{ fontSize: '0.8rem', paddingTop: 8 }}>
              {[
                '36+ Modüler UI & Veri Bileşeni',
                '6 Tohum Renk Paleti & Dark/Light Mod',
                '5 Farklı Sidebar Varyantı',
                'MIT Lisansı ile Ticari Kullanım',
              ].map((feat) => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Check size={15} style={{ color: 'var(--uxu-success)', flexShrink: 0 }} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Pro Studio Plan (Highlighted) */}
        <Card
          variant="glass"
          padding="lg"
          style={{
            border: '2px solid var(--uxu-primary)',
            boxShadow: '0 0 28px var(--uxu-accent-glow)',
          }}
        >
          <div className="uxu-stack-md">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Badge tone="primary" size="xs">
                EN ÇOK TERCİH EDİLEN
              </Badge>
              <Star size={16} style={{ color: 'var(--uxu-primary)' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '4px 0' }}>
                Pro Studio
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--uxu-text-secondary)', margin: 0 }}>
                Hızlı büyüyen SaaS ekipleri ve kurumsal paneller için.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--uxu-primary)' }}>
                ${billingCycle === 'annual' ? 24 : 29}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--uxu-text-secondary)' }}>
                / kullanıcı / ay
              </span>
            </div>

            <Button
              variant="filled"
              fullWidth
              onClick={() => {
                if (onSelectProPlan) {
                  onSelectProPlan();
                } else {
                  notify({
                    title: 'Pro Studio Seçildi',
                    description: `${teamSeats} koltuklu Pro Studio paketi sepete eklendi.`,
                    tone: 'success',
                  });
                }
              }}
            >
              Pro Pakete Geç →
            </Button>

            <div className="uxu-stack-sm" style={{ fontSize: '0.8rem', paddingTop: 8 }}>
              {[
                'Starter paketteki tüm özellikler',
                'SheetGL 120 FPS WebGL DataGrid Motoru',
                'FileManGL 3D VFS Dosya Yöneticisi',
                'Hazır Sayfa Şablonları (Auth, Fatura, Kanban)',
                'Öncelikli Discord & GitHub Desteği',
              ].map((feat) => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Check size={15} style={{ color: 'var(--uxu-primary)', flexShrink: 0 }} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Enterprise Plan */}
        <Card variant="glass" padding="lg">
          <div className="uxu-stack-md">
            <div>
              <Badge tone="warning" size="xs">
                KURUMSAL SLA
              </Badge>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '8px 0 4px 0' }}>
                Enterprise Cloud
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--uxu-text-secondary)', margin: 0 }}>
                Sınırsız koltuk, özel tasarım token ve yerinde kurulum.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800 }}>
                ${billingCycle === 'annual' ? 79 : 99}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--uxu-text-secondary)' }}>
                / kullanıcı / ay
              </span>
            </div>

            <Button
              variant="tonal"
              fullWidth
              onClick={() =>
                notify({
                  title: 'Kurumsal Satış Ekibi',
                  description: 'Özel SLA teklifi için talebiniz alındı.',
                  tone: 'primary',
                })
              }
            >
              Kurumsal Teklif Alın
            </Button>

            <div className="uxu-stack-sm" style={{ fontSize: '0.8rem', paddingTop: 8 }}>
              {[
                'Sınırsız SheetGL & FileManGL Lisansı',
                'Özel Kurumsal Marka Paleti & Font Entegrasyonu',
                'SAML 2.0 / Okta / Azure AD Tek Oturum (SSO)',
                '7/24 Özel Çözüm Mimarı & %99.99 SLA Garantisi',
              ].map((feat) => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Check size={15} style={{ color: 'var(--uxu-warning)', flexShrink: 0 }} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* FAQ Accordion */}
      <Card variant="glass" padding="md" title="Sıkça Sorulan Sorular (SSS)">
        <Accordion
          items={[
            {
              id: 'faq-1',
              title: 'truncgil-uxigl paketini ticari projelerde kullanabilir miyim?',
              content:
                'Evet! Temel tasarım sistemi, uzamsal cam materyalleri ve dinamik renk token mimarisi tamamen açık kaynaklıdır ve ticari SaaS projelerinizde doğrudan kullanılabilir.',
            },
            {
              id: 'faq-2',
              title: 'Mevcut React / Vite projeme nasıl entegre edebilirim?',
              content:
                'Terminalde npm i truncgil-uxigl komutunu çalıştırdıktan sonra kök dosyanıza import "truncgil-uxigl/style.css" eklemeniz ve uygulamanızı <ThemeProvider> ile sarmalamanız yeterlidir.',
            },
            {
              id: 'faq-3',
              title: 'Fatura ve ödeme işlemlerinde e-Fatura desteği var mı?',
              content:
                'Evet, kurumsal aboneliklerde Türkiye GİB uyumlu B2B e-Fatura ve uluslararası Stripe / SWIFT faturalandırma otomatik olarak oluşturulur.',
            },
          ]}
        />
      </Card>
    </div>
  );
};
