import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, Home, CheckCircle2 } from 'lucide-react';
import { Button, Badge } from '../../../components/primitives';
import { Card, SegmentedControl } from '../../../components/composites';
import { useToast } from '../../../providers/ToastProvider';

export interface StatusPageProps {
  /** Initial status view (`'404' | '500' | 'uptime'`). */
  defaultView?: '404' | '500' | 'uptime';
  /** Optional callback for "Ana Panele Dön" button. */
  onNavigateHome?: () => void;
}

export const StatusPage: React.FC<StatusPageProps> = ({
  defaultView = '404',
  onNavigateHome,
}) => {
  const { notify } = useToast();
  const [statusTab, setStatusTab] = useState<'404' | '500' | 'uptime'>(defaultView);

  return (
    <div className="uxu-stack-md" style={{ flex: 1, width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SegmentedControl<'404' | '500' | 'uptime'>
          size="sm"
          value={statusTab}
          onChange={setStatusTab}
          options={[
            { value: '404', label: '404 Sayfa Bulunamadı' },
            { value: '500', label: '500 Bakım & Hata Ekranı' },
            { value: 'uptime', label: 'Canlı Sistem Durumu (SLA)' },
          ]}
        />
      </div>

      {statusTab === '404' && (
        <Card
          variant="glass"
          padding="lg"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '48px 24px',
          }}
        >
          <div
            style={{
              fontSize: '4.5rem',
              fontWeight: 900,
              lineHeight: 1,
              background:
                'linear-gradient(135deg, var(--uxu-primary), var(--uxu-secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 12,
            }}
          >
            404
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 8px 0' }}>
            Aradığınız Uzamsal Görünüm Bulunamadı
          </h2>
          <p
            style={{
              fontSize: '0.86rem',
              color: 'var(--uxu-text-secondary)',
              maxWidth: 460,
              margin: '0 auto 24px auto',
            }}
          >
            Taşınmış, silinmiş veya geçici olarak erişime kapatılmış bir adrese ulaştınız.
            Komut paletini (⌘K) kullanarak istediğiniz bileşene anında geçebilirsiniz.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
            {onNavigateHome && (
              <Button
                variant="filled"
                leadingIcon={<Home size={15} />}
                onClick={onNavigateHome}
              >
                Ana Panele Dön
              </Button>
            )}
            <Button
              variant="tonal"
              leadingIcon={<RefreshCw size={15} />}
              onClick={() => setStatusTab('uptime')}
            >
              Sistem Durumunu Kontrol Et
            </Button>
          </div>
        </Card>
      )}

      {statusTab === '500' && (
        <Card
          variant="glass"
          padding="lg"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '48px 24px',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'var(--uxu-warning-bg)',
              color: 'var(--uxu-warning)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <AlertTriangle size={28} />
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 8px 0' }}>
            Planlı Küme Güncellemesi & Senkronizasyon
          </h2>
          <p
            style={{
              fontSize: '0.84rem',
              color: 'var(--uxu-text-secondary)',
              maxWidth: 480,
              margin: '0 auto 16px auto',
            }}
          >
            WebGL veri düğümlerimiz v2.8.0 sürümüne yükseltiliyor. İşlemleriniz güvenli
            önbellekte korunmaktadır.
          </p>
          <code
            style={{
              display: 'inline-block',
              padding: '6px 12px',
              borderRadius: 8,
              background: 'var(--uxu-code-bg)',
              border: '1px solid var(--uxu-code-border)',
              fontFamily: 'var(--uxu-font-mono)',
              fontSize: '0.75rem',
              marginBottom: 20,
            }}
          >
            TRACE_ID: UXI_EDGE_IST_2026_99482A
          </code>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
            <Button
              variant="filled"
              leadingIcon={<RefreshCw size={15} />}
              onClick={() =>
                notify({
                  title: 'Bağlantı Yenilendi',
                  description: 'Tüm servisler aktif ve yanıt veriyor.',
                  tone: 'success',
                })
              }
            >
              Şimdi Yeniden Dene
            </Button>
          </div>
        </Card>
      )}

      {statusTab === 'uptime' && (
        <Card variant="glass" padding="lg">
          <div className="uxu-stack-md">
            <div
              style={{
                padding: 16,
                borderRadius: 'var(--uxu-radius-md)',
                background: 'var(--uxu-success-bg)',
                border: '1px solid var(--uxu-border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle2 size={22} style={{ color: 'var(--uxu-success)' }} />
                <div>
                  <strong style={{ fontSize: '0.95rem' }}>
                    Tüm Sistemler Sorunsuz Çalışıyor (All Systems Operational)
                  </strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--uxu-text-secondary)' }}>
                    Son 90 günlük ortalama kesintisizlik oranı: %99.99
                  </div>
                </div>
              </div>
              <Badge tone="success" size="sm">
                99.99% SLA
              </Badge>
            </div>

            <div className="uxu-stack-sm">
              {[
                { name: 'uxiGL CDN & Design Tokens API', latency: '4.2 ms', uptime: '100%' },
                { name: 'SheetGL Real-Time WebSocket Engine', latency: '8.1 ms', uptime: '99.99%' },
                { name: 'FileManGL Cloud VFS Storage', latency: '11.4 ms', uptime: '99.98%' },
                { name: 'Zero-Trust Passkey & OAuth SSO', latency: '6.5 ms', uptime: '100%' },
              ].map((srv) => (
                <div
                  key={srv.name}
                  style={{
                    padding: 14,
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
                    <strong style={{ fontSize: '0.84rem' }}>{srv.name}</strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '0.74rem', color: 'var(--uxu-text-secondary)' }}>
                        {srv.latency}
                      </span>
                      <Badge tone="success" size="xs">
                        {srv.uptime}
                      </Badge>
                    </div>
                  </div>
                  {/* 36-Bar Green Uptime Strip */}
                  <div style={{ display: 'flex', gap: 3 }}>
                    {Array.from({ length: 36 }).map((_, idx) => (
                      <div
                        key={idx}
                        style={{
                          flex: 1,
                          height: 16,
                          borderRadius: 3,
                          background:
                            idx === 19 && srv.uptime !== '100%'
                              ? 'var(--uxu-warning)'
                              : 'var(--uxu-success)',
                          opacity: 0.85,
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

