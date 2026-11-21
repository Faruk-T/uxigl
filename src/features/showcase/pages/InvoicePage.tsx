import React, { useState } from 'react';
import { CreditCard, Download, Printer, CheckCircle2 } from 'lucide-react';
import { Button, Input, Badge } from '../../../components/primitives';
import { Card, SegmentedControl } from '../../../components/composites';
import { UXILogo } from '../../../components/brand/UXILogo';
import { useToast } from '../../../providers/ToastProvider';

export const InvoicePage: React.FC = () => {
  const { notify } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wire' | 'wallet'>('card');
  const [cardHolder, setCardHolder] = useState('ÜMİT UZ');
  const [cardNumber, setCardNumber] = useState('4543 8910 2234 8892');
  const [cardCvv, setCardCvv] = useState('842');
  const [invoicePaid, setInvoicePaid] = useState(false);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: 20,
        alignItems: 'start',
      }}
    >
      {/* Left: Printable E-Invoice Document */}
      <Card variant="glass" padding="lg">
        <div className="uxu-stack-md">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: 12,
              paddingBottom: 16,
              borderBottom: '1px solid var(--uxu-border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <UXILogo size={36} preserveRatio glow />
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                  TRUNÇGİL TEKNOLOJİ A.Ş.
                </h2>
                <div style={{ fontSize: '0.74rem', color: 'var(--uxu-text-secondary)' }}>
                  e-Fatura Seri: UXI2026000000842 • VKN: 8590421890
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <Badge tone={invoicePaid ? 'success' : 'warning'} size="sm">
                {invoicePaid ? 'ÖDENDİ (PAID)' : 'ÖDEME BEKLİYOR'}
              </Badge>
              <div style={{ fontSize: '0.74rem', color: 'var(--uxu-text-secondary)', marginTop: 4 }}>
                Tarih: 07 Kasım 2026
              </div>
            </div>
          </div>

          {/* Billing Parties */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: '0.8rem' }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--uxu-text-secondary)', fontSize: '0.72rem' }}>
                HİZMET SAĞLAYICI
              </div>
              <div style={{ fontWeight: 700, marginTop: 4 }}>Trunçgil Bulut Sistemleri</div>
              <div style={{ color: 'var(--uxu-text-secondary)' }}>
                Maslak Teknopark No: 42, Sarıyer / İstanbul
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--uxu-text-secondary)', fontSize: '0.72rem' }}>
                SAYIN / KURUMSAL ALICI
              </div>
              <div style={{ fontWeight: 700, marginTop: 4 }}>Global FinTech Holding A.Ş.</div>
              <div style={{ color: 'var(--uxu-text-secondary)' }}>
                Levent Büyükdere Cad. No: 194, İstanbul
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div
            style={{
              borderRadius: 'var(--uxu-radius-md)',
              border: '1px solid var(--uxu-border-subtle)',
              overflow: 'hidden',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr
                  style={{
                    background: 'var(--uxu-surface-tonal)',
                    textAlign: 'left',
                    borderBottom: '1px solid var(--uxu-border-subtle)',
                  }}
                >
                  <th style={{ padding: '10px 12px' }}>Hizmet / Lisans Kalemi</th>
                  <th style={{ padding: '10px 12px' }}>Miktar</th>
                  <th style={{ padding: '10px 12px' }}>Birim Fiyat</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Tutar</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: 'uxiGL Enterprise Design System Lisansı (Yıllık)',
                    qty: '1 Kurumsal',
                    unit: '$1,200.00',
                    total: '$1,200.00',
                  },
                  {
                    name: 'SheetGL 120 FPS WebGL DataGrid Motoru',
                    qty: '12 Koltuk',
                    unit: '$40.00',
                    total: '$480.00',
                  },
                  {
                    name: 'FileManGL 3D VFS Bulut Depolama Kümesi',
                    qty: '1 Paket',
                    unit: '$320.00',
                    total: '$320.00',
                  },
                ].map((row) => (
                  <tr
                    key={row.name}
                    style={{ borderBottom: '1px solid var(--uxu-border-subtle)' }}
                  >
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>{row.name}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--uxu-text-secondary)' }}>
                      {row.qty}
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--uxu-font-mono)' }}>
                      {row.unit}
                    </td>
                    <td
                      style={{
                        padding: '10px 12px',
                        textAlign: 'right',
                        fontWeight: 700,
                        fontFamily: 'var(--uxu-font-mono)',
                      }}
                    >
                      {row.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 6,
              fontSize: '0.84rem',
              paddingTop: 8,
            }}
          >
            <div>
              Ara Toplam: <strong style={{ fontFamily: 'var(--uxu-font-mono)' }}>$2,000.00</strong>
            </div>
            <div>
              KDV (%20): <strong style={{ fontFamily: 'var(--uxu-font-mono)' }}>$400.00</strong>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--uxu-primary)' }}>
              Genel Toplam: <span style={{ fontFamily: 'var(--uxu-font-mono)' }}>$2,400.00</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 8 }}>
            <Button
              variant="tonal"
              size="sm"
              leadingIcon={<Printer size={14} />}
              onClick={() => window.print()}
            >
              Yazdır
            </Button>
            <Button
              variant="tonal"
              size="sm"
              leadingIcon={<Download size={14} />}
              onClick={() =>
                notify({
                  title: 'e-Fatura PDF İndirildi',
                  description: 'UXI2026000000842.pdf dosyası indirildi.',
                  tone: 'info',
                })
              }
            >
              PDF İndir
            </Button>
          </div>
        </div>
      </Card>

      {/* Right: Quick Checkout & Card Payment */}
      <Card variant="glass" padding="lg" title="Hızlı Kurumsal Ödeme (Checkout)">
        <div className="uxu-stack-md">
          <SegmentedControl<'card' | 'wallet' | 'wire'>
            size="sm"
            fullWidth
            value={paymentMethod}
            onChange={setPaymentMethod}
            options={[
              { value: 'card', label: 'Kredi Kartı' },
              { value: 'wallet', label: 'Dijital Cüzdan' },
              { value: 'wire', label: 'EFT / SWIFT' },
            ]}
          />

          {/* Visual Credit Card Preview */}
          <div
            style={{
              padding: 20,
              borderRadius: 'var(--uxu-radius-lg, 16px)',
              background:
                'linear-gradient(135deg, var(--uxu-primary), color-mix(in srgb, var(--uxu-secondary) 80%, #090d16))',
              color: '#ffffff',
              boxShadow: 'var(--uxu-shadow-elevated)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 164,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, opacity: 0.9 }}>
                TRUNÇGİL CORPORATE CARD
              </span>
              <CreditCard size={20} />
            </div>
            <div
              style={{
                fontSize: '1.15rem',
                fontFamily: 'var(--uxu-font-mono)',
                letterSpacing: '0.12em',
                margin: '16px 0',
              }}
            >
              {cardNumber || '4543 •••• •••• 8892'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <span>{cardHolder || 'ÜMİT UZ'}</span>
              <span>08 / 29</span>
            </div>
          </div>

          <Input label="Kart Üzerindeki İsim" value={cardHolder} onChange={setCardHolder} />
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
            <Input label="Kart Numarası" value={cardNumber} onChange={setCardNumber} />
            <Input label="CVV" value={cardCvv} onChange={setCardCvv} />
          </div>

          <Button
            variant="filled"
            fullWidth
            leadingIcon={<CheckCircle2 size={16} />}
            disabled={invoicePaid}
            onClick={() => {
              setInvoicePaid(true);
              notify({
                title: 'Ödeme Başarıyla Alındı',
                description: '$2,400.00 tutarındaki e-Fatura ödendi olarak işaretlendi.',
                tone: 'success',
              });
            }}
          >
            {invoicePaid ? 'Fatura Ödendi ($2,400.00)' : '$2,400.00 Güvenli Öde'}
          </Button>
        </div>
      </Card>
    </div>
  );
};
