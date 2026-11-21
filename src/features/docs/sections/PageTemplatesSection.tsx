import React from 'react';
import { FileCode2, Layers } from 'lucide-react';
import { Badge, Button } from '../../../components/primitives';
import { Card } from '../../../components/composites';
import {
  PageTemplatesShowcaseView,
  type PageTemplateId,
} from '../../showcase/PageTemplatesShowcaseView';

export interface PageTemplatesSectionProps {
  isTR: boolean;
  activeTemplate: PageTemplateId;
  onTemplateChange: (tpl: PageTemplateId) => void;
}

const TEMPLATE_ITEMS: Array<{ id: PageTemplateId; labelTr: string; labelEn: string }> = [
  { id: 'page-login', labelTr: 'Giriş (Login)', labelEn: 'Login' },
  { id: 'page-register', labelTr: 'Kayıt & 2FA', labelEn: 'Register & 2FA' },
  { id: 'page-pricing', labelTr: 'Fiyatlandırma', labelEn: 'Pricing' },
  { id: 'page-profile', labelTr: 'Kullanıcı Profili', labelEn: 'User Profile' },
  { id: 'page-invoice', labelTr: 'Fatura & Ödeme', labelEn: 'Invoice' },
  { id: 'page-kanban', labelTr: 'Kanban Panosu', labelEn: 'Kanban' },
  { id: 'page-status', labelTr: 'Durum & Hata', labelEn: 'Status & Error' },
  { id: 'page-settings', labelTr: 'Sistem Ayarları', labelEn: 'Settings' },
];

const FULL_APP_TEMPLATES = [
  {
    name: 'EnterpriseGLTemplate',
    subtitleTr: 'Kurumsal Telemetri & Analitik Panosu',
    subtitleEn: 'Enterprise Telemetry & Analytics Dashboard',
    descTr: 'AnalyticsDashboardView tabanlı canlı KPI, grafik ve tablo kokpiti.',
    descEn: 'Live KPI, chart, and table cockpit powered by AnalyticsDashboardView.',
  },
  {
    name: 'FlowGLTemplate',
    subtitleTr: 'İş Akışı & Proje Çalışma Alanı',
    subtitleEn: 'Workflow & Project Workspace',
    descTr: 'Görev akışları, ekip koordinasyonu ve zaman çizelgesi şablonu.',
    descEn: 'Task flows, team coordination, and timeline template.',
  },
  {
    name: 'CargoGLTemplate',
    subtitleTr: 'Lojistik & Filo Operasyonları',
    subtitleEn: 'Logistics & Fleet Operations',
    descTr: 'Sevkiyat takibi, rota durumu ve depo operasyon arayüzü.',
    descEn: 'Shipment tracking, route status, and warehouse ops UI.',
  },
  {
    name: 'SynthGLTemplate',
    subtitleTr: 'AI / Ses & Medya Sentez Stüdyosu',
    subtitleEn: 'AI / Audio & Media Synth Studio',
    descTr: 'Koyu cam yüzeyli yaratıcı kontrol ve dalga formu çalışma alanı.',
    descEn: 'Dark glass creative control and waveform workspace.',
  },
  {
    name: 'OSGLTemplate (MacOSGL)',
    subtitleTr: 'Tam Masaüstü İşletim Sistemi Kabuğu',
    subtitleEn: 'Full Desktop OS Shell',
    descTr: 'Pencere yöneticisi, Dock, TimeFlow/Todo widget’ları ve duvar kağıtları.',
    descEn: 'Window manager, Dock, TimeFlow/Todo widgets, and wallpapers.',
  },
  {
    name: 'TesseraGLTemplate',
    subtitleTr: 'Modern SaaS Proje Yönetim Merkezi',
    subtitleEn: 'Modern SaaS Project Hub',
    descTr: 'İkon rayı, proje kenar çubuğu, iş yükü şeridi ve aktivite akışı.',
    descEn: 'Icon rail, projects sidebar, workload strip, and activity feed.',
  },
];

export const PageTemplatesSection: React.FC<PageTemplatesSectionProps> = ({
  isTR,
  activeTemplate,
  onTemplateChange,
}) => {
  return (
    <div className="uxu-stack-md">
      <Card
        variant="glass"
        padding="md"
        eyebrow={isTR ? 'BÖLÜM 6 • HAZIR SAYFA ŞABLONLARI' : 'CHAPTER 6 • READY PAGE TEMPLATES'}
        title={
          isTR
            ? '8 Hazır Kurumsal Sayfa Şablonu (Canlı Önizleme)'
            : '8 Ready-to-Use Enterprise Page Templates (Live Preview)'
        }
        subtitle={
          isTR
            ? 'Aşağıdaki seçiciden veya sol menüden istediğiniz şablonu seçip doğrudan inceleyin'
            : 'Select any template below or from the sidebar to inspect live'
        }
        headerIcon={<FileCode2 size={19} />}
      >
        <div className="uxu-stage-row" style={{ flexWrap: 'wrap', gap: 6 }}>
          {TEMPLATE_ITEMS.map((tpl) => (
            <Button
              key={tpl.id}
              variant={activeTemplate === tpl.id ? 'filled' : 'tonal'}
              size="xs"
              onClick={() => onTemplateChange(tpl.id)}
            >
              {isTR ? tpl.labelTr : tpl.labelEn}
            </Button>
          ))}
        </div>
      </Card>

      <div id="doc-tpl-stage">
        <PageTemplatesShowcaseView
          activePageId={activeTemplate}
          onPageChange={onTemplateChange}
        />
      </div>

      <Card
        id="doc-sec-app-templates"
        variant="glass"
        padding="md"
        eyebrow={isTR ? 'TAM UYGULAMA ŞABLONLARI' : 'FULL APPLICATION TEMPLATES'}
        title={
          isTR
            ? '6 Dışa Aktarılan Tam Uygulama Şablonu'
            : '6 Exported Full Application Templates'
        }
        subtitle={
          isTR
            ? "Doğrudan `import { OSGLTemplate, TesseraGLTemplate } from 'truncgil-uxigl'` ile kullanılabilir"
            : "Directly importable via `import { OSGLTemplate, TesseraGLTemplate } from 'truncgil-uxigl'`"
        }
        headerIcon={<Layers size={19} />}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 12,
          }}
        >
          {FULL_APP_TEMPLATES.map((app) => (
            <div
              key={app.name}
              style={{
                padding: 12,
                borderRadius: 12,
                background: 'var(--uxu-surface-tonal)',
                border: '1px solid var(--uxu-border-subtle)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <code style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--uxu-primary)' }}>
                  {app.name}
                </code>
                <Badge tone="primary" size="xs">Template</Badge>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.84rem', marginTop: 6 }}>
                {isTR ? app.subtitleTr : app.subtitleEn}
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '0.76rem', color: 'var(--uxu-text-secondary)' }}>
                {isTR ? app.descTr : app.descEn}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
