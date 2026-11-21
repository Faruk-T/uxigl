import React from 'react';
import {
  CardSurfaceLiveMiniDemo,
  ModalDrawerAlertLiveMiniDemo,
  SegmentedTabsAccordionLiveMiniDemo,
  StepperTimelineLiveMiniDemo,
} from '../demos/SurfaceNavDemos';
import { Badge, Button } from '../../../components/primitives';
import type { DocComponentGuideItem } from '../types';

export const SURFACE_NAVIGATION_GUIDES: DocComponentGuideItem[] = [
  {
    id: 'card',
    tag: '<Card />',
    navLabelTr: 'Çok Katmanlı Yüzey Kartı',
    navLabelEn: 'Multi-Layer Surface Card',
    titleTr: 'Çok Katmanlı Yüzey Kartı (Glass, Tonal, Elevated, Outlined)',
    titleEn: 'Multi-Layer Surface Card (Glass, Tonal, Elevated, Outlined)',
    categoryLabelTr: 'Yüzey & Taşıyıcı',
    categoryLabelEn: 'Surface & Container',
    playgroundId: 'card',
    importStatement: "import { Card } from 'truncgil-uxigl';",
    architectureNoteTr:
      '4 temel tasarım yüzeyi (glass, tonal, elevated, outlined), eyebrow etiketi, başlık ikonu, footer ve hover parlama efektini destekler.',
    architectureNoteEn:
      'Supports 4 core design surfaces (glass, tonal, elevated, outlined), eyebrow, headerIcon, footer, and glowOnHover.',
    summaryTr:
      'Liquid Glass ve Material You yüzey hiyerarşisinin ana yapı taşı. Dashboard widget’ları, formlar ve dokümantasyon panelleri için kullanılır.',
    summaryEn:
      'Core building block of Liquid Glass and Material You surface hierarchy for widgets, forms, and panels.',
    code: `<Card
  variant="glass"
  interactive
  glowOnHover
  eyebrow="ANALYTICS"
  title="Bulut Kümesi"
  subtitle="Liquid Glass Yüzeyi"
>
  İçerik
</Card>`,
    propsTable: [
      {
        name: 'variant',
        type: "'glass' | 'tonal' | 'elevated' | 'outlined'",
        defaultValue: "'glass'",
        description: 'Kartın tasarım yüzey türünü belirler.',
      },
      {
        name: 'padding',
        type: "'none' | 'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: 'İç dolgu boşluğu.',
      },
      {
        name: 'interactive / glowOnHover',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Hover yükselme animasyonu ve ışık halesi.',
      },
    ],
    renderLiveDemo: () => <CardSurfaceLiveMiniDemo />,
  },
  {
    id: 'segmented-tabs-accordion',
    tag: '<SegmentedControl />, <Tabs /> & <Accordion />',
    navLabelTr: 'Kapsül Seçici, Sekme & Akordeon',
    navLabelEn: 'Segmented Control, Tabs & Accordion',
    titleTr: 'Kayan Kapsül Seçici, Sekme Çubuğu & Açılır Akordeon Paneller',
    titleEn: 'Sliding Capsule Selector, Tabs & Expandable Accordion Panels',
    categoryLabelTr: 'Gezinme & Düzen',
    categoryLabelEn: 'Navigation & Layout',
    playgroundId: 'segmented-control',
    importStatement:
      "import { SegmentedControl, Tabs, Accordion } from 'truncgil-uxigl';",
    architectureNoteTr:
      'SegmentedControl yay fizikli kayan kapsül kullanır; Tabs 3 varyant (pill, underline, glass) sunar; Accordion çoklu açılım destekler.',
    architectureNoteEn:
      'SegmentedControl uses a spring-physics sliding thumb; Tabs offers 3 variants; Accordion supports multi-expand.',
    summaryTr:
      'Görünüm modu değiştirme, alt sayfa sekmeleri ve sıkça sorulan sorular / daraltılabilir paneller için üçlü gezinme seti.',
    summaryEn:
      'Navigation trio for view switching, sub-page tabs, and collapsible content panels.',
    code: `<SegmentedControl value={seg} onChange={setSeg} options={[{ value: 'glass', label: 'Glass' }]} />
<Tabs variant="pill" activeId={tab} onChange={setTab} items={[{ id: 't1', label: 'Genel', count: 4 }]} />
<Accordion variant="glass" items={[{ id: 'a1', title: 'Detay', content: '...' }]} />`,
    propsTable: [
      {
        name: 'options / items',
        type: 'Array<{ value/id, label/title, badge/count }>',
        defaultValue: '[]',
        required: true,
        description: 'Seçenek veya sekme/akordeon öğeleri.',
      },
      {
        name: 'fullWidth / allowMultiple',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Tam genişlik (Segmented) veya çoklu panel açılımı (Accordion).',
      },
    ],
    renderLiveDemo: () => <SegmentedTabsAccordionLiveMiniDemo />,
  },
  {
    id: 'stepper-timeline',
    tag: '<Stepper /> & <Timeline />',
    navLabelTr: 'Adım Sihirbazı & Zaman Akışı',
    navLabelEn: 'Stepper Wizard & Timeline',
    titleTr: 'Çok Adımlı Süreç Sihirbazı & Zaman Damgalı Denetim Akışı',
    titleEn: 'Multi-Step Process Wizard & Timestamped Audit Timeline',
    categoryLabelTr: 'Süreç & Akış',
    categoryLabelEn: 'Process & Flow',
    importStatement: "import { Stepper, Timeline } from 'truncgil-uxigl';",
    architectureNoteTr:
      'Stepper yatay/dikey modları ve adım tıklama geçişini destekler; Timeline semantik tonlu durum noktaları çizer.',
    architectureNoteEn:
      'Stepper supports horizontal/vertical modes and clickable steps; Timeline draws tone-coded event nodes.',
    summaryTr:
      'Kayıt/onboarding sihirbazları, onay süreçleri ve denetim/aktivite geçmişi akışları için tasarlanmış iki bileşen.',
    summaryEn:
      'Designed for onboarding wizards, approval flows, and timestamped audit/activity logs.',
    code: `<Stepper activeStep={step} onStepClick={setStep} steps={steps} />
<Timeline items={[{ id: '1', title: 'Onaylandı', timestamp: '10:42', tone: 'success' }]} />`,
    propsTable: [
      {
        name: 'activeStep / steps',
        type: 'number / StepperStep[]',
        defaultValue: '0 / []',
        required: true,
        description: 'Aktif adım indeksi ve adım tanımları.',
      },
      {
        name: 'items (Timeline)',
        type: 'TimelineItem[]',
        defaultValue: '[]',
        required: true,
        description: 'Zaman damgalı olay listesi.',
      },
    ],
    renderLiveDemo: () => <StepperTimelineLiveMiniDemo />,
  },
  {
    id: 'modal-drawer-alert',
    tag: '<Modal />, <Drawer />, <Alert /> & <CommandPalette />',
    navLabelTr: 'Modal, Çekmece, Uyarı & Spotlight',
    navLabelEn: 'Modal, Drawer, Alert & Spotlight',
    titleTr: '5 Varyantlı Modal, 3 Yönlü Drawer, Uyarı Bandı & Spotlight (⌘K)',
    titleEn: '5-Variant Modal, 3-Way Drawer, Inline Alert & Spotlight (⌘K)',
    categoryLabelTr: 'Katman & Bildirim',
    categoryLabelEn: 'Overlay & Feedback',
    playgroundId: 'modal',
    importStatement:
      "import { Modal, Drawer, Alert, CommandPalette } from 'truncgil-uxigl';",
    architectureNoteTr:
      'Modal macOS trafik ışıklarını ve ESC/backdrop kapanışını destekler; CommandPalette global ⌘K araması sunar.',
    architectureNoteEn:
      'Modal supports macOS traffic lights and ESC/backdrop dismiss; CommandPalette powers global ⌘K search.',
    summaryTr:
      'Onay diyalogları, yandan açılan detay çekmeceleri, satır içi uyarı bantları ve klavye odaklı komut paleti.',
    summaryEn:
      'Confirmation dialogs, slide-over detail drawers, inline alert banners, and keyboard-first command palette.',
    code: `<Modal open={open} onClose={close} variant="glass" showMacTrafficLights title="Onay">...</Modal>
<Drawer open={drawer} onClose={closeDrawer} placement="right" title="Detaylar">...</Drawer>
<Alert tone="info" variant="glass" title="Bilgi" description="Senkronizasyon aktif." />`,
    propsTable: [
      {
        name: 'variant (Modal)',
        type: "'default' | 'confirm' | 'danger' | 'sheet' | 'glass'",
        defaultValue: "'default'",
        description: 'Modal görsel stili ve macOS sayfa/cam kipi.',
      },
      {
        name: 'placement (Drawer)',
        type: "'right' | 'left' | 'bottom'",
        defaultValue: "'right'",
        description: 'Çekmecenin açılacağı ekran kenarı.',
      },
    ],
    renderLiveDemo: () => <ModalDrawerAlertLiveMiniDemo />,
  },
  {
    id: 'enterprise-settings-template',
    tag: '<EnterpriseSettingsPage /> & <PageTemplatesShowcaseView />',
    navLabelTr: 'Kurumsal Ayarlar & Sayfa Şablonları',
    navLabelEn: 'Enterprise Settings & Page Templates',
    titleTr: '8 Hazır Kurumsal Sayfa Şablonu & Kalıcı Çalışma Alanı Ayarları',
    titleEn: '8 Ready-to-Use Enterprise Page Templates & Persistent Settings',
    categoryLabelTr: 'Hazır Şablonlar',
    categoryLabelEn: 'Page Templates',
    importStatement:
      "import { EnterpriseSettingsPage, PageTemplatesShowcaseView } from 'truncgil-uxigl';",
    architectureNoteTr:
      'useWorkspaceSettings() kancası ile tüm şirket, güvenlik ve API ayarlarını localStorage üzerinde kalıcı saklar.',
    architectureNoteEn:
      'Persists company, security, and API settings in localStorage via useWorkspaceSettings().',
    summaryTr:
      'Giriş, Kayıt/2FA, Fiyatlandırma, Profil, Fatura, Kanban, Durum ve Ayarlar sayfalarını tek pakette sunar.',
    summaryEn:
      'Delivers Login, Register/2FA, Pricing, Profile, Invoice, Kanban, Status, and Settings pages out of the box.',
    code: `<EnterpriseSettingsPage />
<PageTemplatesShowcaseView activeTemplate="page-pricing" onTemplateChange={setTpl} />`,
    propsTable: [
      {
        name: 'activeTemplate',
        type: "'page-login' | 'page-register' | 'page-pricing' | 'page-profile' | 'page-invoice' | 'page-kanban' | 'page-status' | 'page-settings'",
        defaultValue: "'page-login'",
        description: 'Gösterilecek hazır sayfa şablonu kimliği.',
      },
    ],
    renderLiveDemo: () => (
      <div className="uxu-stage-row" style={{ flexWrap: 'wrap', gap: 8 }}>
        <Badge tone="success" variant="tonal">8 Hazır Sayfa Şablonu</Badge>
        <Badge tone="primary" variant="glass">Kalıcı localStorage Ayarları</Badge>
        <Button
          variant="tonal"
          size="sm"
          onClick={() =>
            document.getElementById('doc-tpl-stage')?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          6. Bölüme Git (Canlı Şablonlar)
        </Button>
      </div>
    ),
  },
];
