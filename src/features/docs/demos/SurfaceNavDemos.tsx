import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Alert, Button } from '../../../components/primitives';
import {
  Accordion,
  Card,
  Drawer,
  Modal,
  SegmentedControl,
  Stepper,
  Tabs,
  Timeline,
  type DrawerPlacement,
  type ModalVariant,
} from '../../../components/composites';

export const CardSurfaceLiveMiniDemo: React.FC = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 12,
      }}
    >
      {(['glass', 'tonal', 'elevated', 'outlined'] as const).map((v) => (
        <Card
          key={v}
          variant={v}
          padding="sm"
          interactive
          glowOnHover={v === 'glass'}
          eyebrow={v.toUpperCase()}
          title={`variant="${v}"`}
          subtitle="Liquid Glass × Dinamik Ton"
        >
          <div style={{ fontSize: '0.76rem', color: 'var(--uxu-text-secondary)' }}>
            Çok katmanlı yüzey kartı
          </div>
        </Card>
      ))}
    </div>
  );
};

export const SegmentedTabsAccordionLiveMiniDemo: React.FC = () => {
  const [seg, setSeg] = useState<'glass' | 'tonal' | 'hybrid'>('glass');
  const [tab, setTab] = useState('t1');

  return (
    <div className="uxu-stack-md">
      <SegmentedControl<'glass' | 'tonal' | 'hybrid'>
        value={seg}
        onChange={(v) => setSeg(v as 'glass' | 'tonal' | 'hybrid')}
        fullWidth
        options={[
          { value: 'glass', label: 'Liquid Glass', badge: '8pt' },
          { value: 'tonal', label: 'Dinamik Tonal', badge: 'Tonal' },
          { value: 'hybrid', label: 'uxiGL Hibrit Sentez' },
        ]}
      />
      <Tabs
        variant="pill"
        activeId={tab}
        onChange={setTab}
        items={[
          { id: 't1', label: 'Genel Bakış', count: 4 },
          { id: 't2', label: 'Tasarım Tokenları', count: 24 },
          { id: 't3', label: 'Güvenlik SLA', count: 2 },
        ]}
      />
      <Accordion
        variant="glass"
        defaultExpandedIds={['a1']}
        items={[
          {
            id: 'a1',
            title: 'Accordion Paneli #1 — Yay Fiziği & Çoklu Açılım',
            content:
              'allowMultiple={true} verildiğinde aynı anda birden fazla akordeon paneli açık kalabilir.',
          },
          {
            id: 'a2',
            title: 'Accordion Paneli #2 — Klavye & ARIA Desteği',
            content: 'Başlıklar otomatik aria-expanded niteliği üretir.',
          },
        ]}
      />
    </div>
  );
};

export const StepperTimelineLiveMiniDemo: React.FC = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="uxu-stage-grid-2">
      <div className="uxu-stack-md">
        <Stepper
          activeStep={step}
          onStepClick={setStep}
          steps={[
            { id: 's1', title: 'Cari Doğrulama', subtitle: 'VKN Kontrolü', meta: 'Adım 1' },
            { id: 's2', title: 'Teminat Onayı', subtitle: 'Limit Tahsisi', meta: 'Adım 2' },
            { id: 's3', title: 'GİB Aktivasyon', subtitle: 'Canlı Küme', meta: 'Adım 3' },
          ]}
        />
      </div>
      <Timeline
        items={[
          {
            id: 'tl1',
            title: 'e-Fatura Zarfı Onaylandı',
            description: 'ETTN #9482 otomatik muhasebeleşti.',
            timestamp: '10:42',
            tone: 'success',
            badge: 'GİB #200',
          },
          {
            id: 'tl2',
            title: 'SheetGL Veri Senkronizasyonu',
            description: '10.000 satırlık stok hareketi aktarıldı.',
            timestamp: '09:15',
            tone: 'primary',
          },
        ]}
      />
    </div>
  );
};

export const ModalDrawerAlertLiveMiniDemo: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState<ModalVariant>('default');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerPos, setDrawerPos] = useState<DrawerPlacement>('right');

  return (
    <div className="uxu-stack-md">
      <Alert
        tone="info"
        variant="glass"
        title="Satır İçi Bilgi Bandı (<Alert />)"
        description="primary, success, warning, danger, info ve glass tonlarında kalıcı durum mesajları sunar."
      />
      <div className="uxu-stage-row" style={{ flexWrap: 'wrap', gap: 8 }}>
        {(['default', 'confirm', 'danger', 'sheet', 'glass'] as ModalVariant[]).map((mv) => (
          <Button
            key={mv}
            variant={mv === 'danger' ? 'danger' : 'tonal'}
            size="sm"
            onClick={() => {
              setModalVariant(mv);
              setModalOpen(true);
            }}
          >
            Modal Aç: {mv.toUpperCase()}
          </Button>
        ))}
        {(['right', 'left', 'bottom'] as DrawerPlacement[]).map((dp) => (
          <Button
            key={dp}
            variant="outlined"
            size="sm"
            onClick={() => {
              setDrawerPos(dp);
              setDrawerOpen(true);
            }}
          >
            Drawer Aç: {dp.toUpperCase()}
          </Button>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        variant={modalVariant}
        showMacTrafficLights
        title={`Kurumsal Modal Diyalog (${modalVariant.toUpperCase()})`}
        subtitle="ESC tuşu veya arka plan tıklaması ile kapanır"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Vazgeç
            </Button>
            <Button
              variant={modalVariant === 'danger' ? 'danger' : 'filled'}
              size="sm"
              leadingIcon={<Send size={14} />}
              onClick={() => setModalOpen(false)}
            >
              Onayla
            </Button>
          </div>
        }
      >
        <p className="uxu-muted-p">
          Bu pencere <code>variant=&quot;{modalVariant}&quot;</code> kipinde açıldı.
        </p>
      </Modal>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement={drawerPos}
        title={`Kayar Yan Çekmece (${drawerPos.toUpperCase()})`}
        subtitle="3 yönlü (right, left, bottom) kurumsal denetçi paneli"
      >
        <p className="uxu-muted-p">
          Drawer bileşeni tablo satır detayları, filtre panelleri ve hızlı formlar için idealdir.
        </p>
      </Drawer>
    </div>
  );
};
