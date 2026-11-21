import React from 'react';
import {
  AnalogDigitalClock,
  Calendar,
  Messenger,
} from '../../../components/composites';
import { WebGLAuroraLiveMiniDemo } from '../demos/DataFeedbackDemos';
import { Badge } from '../../../components/primitives';
import type { DocComponentGuideItem } from '../types';

export const RICH_MODULE_GUIDES: DocComponentGuideItem[] = [
  {
    id: 'calendar-clock',
    tag: '<Calendar /> & <AnalogDigitalClock />',
    navLabelTr: 'Takvim & Analog/Dijital Saat',
    navLabelEn: 'Calendar & Analog/Digital Clock',
    titleTr: 'Tam Teşekküllü Takvim (Ay/Hafta/Gün/Ajanda) & Hibrit Saat',
    titleEn: 'Full-Featured Calendar (Month/Week/Day/Agenda) & Hybrid Clock',
    categoryLabelTr: 'Zaman & Planlama',
    categoryLabelEn: 'Time & Scheduling',
    playgroundId: 'calendar',
    importStatement:
      "import { Calendar, AnalogDigitalClock } from 'truncgil-uxigl';",
    architectureNoteTr:
      'Calendar sürükle-bırak görev taşıma, 4 görünüm modu ve görev modalı içerir; AnalogDigitalClock 60 FPS akıcı ibre sunar.',
    architectureNoteEn:
      'Calendar supports drag-and-drop scheduling across 4 views; AnalogDigitalClock renders smooth 60 FPS hands.',
    summaryTr:
      'Ekip planlama, toplantı yönetimi ve masaüstü zaman takibi için kurumsal takvim ve saat bileşenleri.',
    summaryEn:
      'Enterprise calendar and hybrid clock components for team scheduling and time tracking.',
    code: `<AnalogDigitalClock size={180} showDigital showSeconds />
<Calendar initialView="month" />`,
    propsTable: [
      {
        name: 'initialView (Calendar)',
        type: "'month' | 'week' | 'day' | 'agenda'",
        defaultValue: "'month'",
        description: 'Başlangıç takvim görünümü.',
      },
      {
        name: 'showDigital / showSeconds',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Saat üzerinde dijital gösterge ve saniye ibresi.',
      },
    ],
    renderLiveDemo: () => (
      <div className="uxu-stack-md">
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <AnalogDigitalClock />
        </div>
        <Calendar />
      </div>
    ),
  },
  {
    id: 'messenger',
    tag: '<Messenger />',
    navLabelTr: 'Kurumsal Mesajlaşma Modülü',
    navLabelEn: 'Enterprise Messenger Module',
    titleTr: 'Kurumsal Mesajlaşma Modülü (SOLID Mimari)',
    titleEn: 'Enterprise Messenger Module (SOLID Architecture)',
    categoryLabelTr: 'İletişim',
    categoryLabelEn: 'Communication',
    playgroundId: 'messenger',
    importStatement: "import { Messenger } from 'truncgil-uxigl';",
    architectureNoteTr:
      'Kişi listesi, arama, okunmamış rozetleri, yazıyor göstergesi ve dosya/emoji ekleri ile modüler sohbet arayüzü.',
    architectureNoteEn:
      'Modular chat UI with contact sidebar, search, unread badges, typing indicator, and attachments.',
    summaryTr:
      'Uygulama içi ekip sohbeti ve müşteri destek panelleri için hazır mesajlaşma deneyimi.',
    summaryEn:
      'Ready-to-use messaging experience for in-app team chat and customer support.',
    code: `<Messenger height={520} />`,
    propsTable: [
      {
        name: 'height',
        type: 'number | string',
        defaultValue: '540',
        description: 'Mesajlaşma penceresi yüksekliği.',
      },
    ],
    renderLiveDemo: () => <Messenger />,
  },
  {
    id: 'webgl-aurora',
    tag: '<WebGLAuroraCanvas />',
    navLabelTr: 'WebGL Uzamsal Arka Plan Motoru',
    navLabelEn: 'WebGL Ambient Shader Canvas',
    titleTr: 'Düşük Güç Tüketimli WebGL Aurora & Uzamsal Arka Plan',
    titleEn: 'Ultra-Low-Power WebGL Aurora & Spatial Background',
    categoryLabelTr: 'Görsel Efekt',
    categoryLabelEn: 'Visual Effects',
    importStatement: "import { WebGLAuroraCanvas } from 'truncgil-uxigl';",
    architectureNoteTr:
      '0.15x ölçekli (maks 256×144px) donanım hızlandırmalı GLSL shader kullanır; hareketsizken %0 CPU/GPU tüketir.',
    architectureNoteEn:
      'Runs at 0.15x bilinear scale (max 256x144px) and consumes 0% CPU/GPU when idle.',
    summaryTr:
      '4 hazır shader ön ayarı (aurora-borealis, spatial-nebula, material-lava, cyber-horizon) ile cam arayüzlere derinlik katar.',
    summaryEn:
      'Adds atmospheric depth behind glass surfaces with 4 shader presets and zero idle GPU drain.',
    code: `// ThemeProvider tercihleri (webglPreset, webglSpeed, webglIntensity) ile otomatik senkronize olur
<WebGLAuroraCanvas />`,
    propsTable: [
      {
        name: 'webglPreset (useTheme)',
        type: "'aurora-borealis' | 'spatial-nebula' | 'material-lava' | 'cyber-horizon'",
        defaultValue: "'aurora-borealis'",
        description: 'ThemeProvider üzerinden aktif GLSL shader ön ayarı.',
      },
      {
        name: 'webglSpeed / webglIntensity',
        type: 'number',
        defaultValue: '60 / 38',
        description: 'Animasyon hızı (0-200) ve ışık yoğunluğu (0-100).',
      },
    ],
    renderLiveDemo: () => <WebGLAuroraLiveMiniDemo />,
  },
  {
    id: 'topheader-sidebar',
    tag: '<TopHeader /> & <Sidebar />',
    navLabelTr: 'Üst Başlık Çubuğu & Kenar Çubuğu',
    navLabelEn: 'Top Header & Sidebar Shell',
    titleTr: 'Kurumsal Üst Başlık Çubuğu (<TopHeader />) & 5 Modlu <Sidebar />',
    titleEn: 'Enterprise <TopHeader /> & 5-Variant <Sidebar />',
    categoryLabelTr: 'Uygulama Kabuğu',
    categoryLabelEn: 'App Shell',
    importStatement: "import { TopHeader, Sidebar } from 'truncgil-uxigl';",
    architectureNoteTr:
      'TopHeader içerik kırıntıları (breadcrumbs), bildirim merkezi, ⌘K arama ve Tema Stüdyosu tetikleyicilerini barındırır.',
    architectureNoteEn:
      'TopHeader hosts breadcrumbs, notification center, ⌘K search, and Theme Studio triggers.',
    summaryTr:
      '5 farklı kenar çubuğu modu (standard, mini-rail, dual-column, drawer, stacked-vertical) ile tam responsive uygulama iskeleti.',
    summaryEn:
      'Full responsive app shell pairing 5 sidebar modes with a unified top header bar.',
    code: `<TopHeader
  breadcrumbs={breadcrumbs}
  onOpenMobileMenu={() => setMobileOpen(true)}
  onOpenCommandPalette={() => setCmdOpen(true)}
  onOpenThemeStudio={() => setThemeOpen(true)}
/>`,
    propsTable: [
      {
        name: 'variant (Sidebar)',
        type: "'standard' | 'mini-rail' | 'dual-column' | 'drawer' | 'stacked-vertical'",
        defaultValue: "'standard'",
        description: 'Kenar çubuğu yerleşim modu.',
      },
      {
        name: 'breadcrumbs (TopHeader)',
        type: 'BreadcrumbItem[]',
        defaultValue: '[]',
        required: true,
        description: 'Üst çubuktaki sayfa yolu kırıntıları.',
      },
    ],
    renderLiveDemo: () => (
      <div className="uxu-stage-row" style={{ flexWrap: 'wrap', gap: 8 }}>
        <Badge tone="primary" variant="tonal">5 Sidebar Modu</Badge>
        <Badge tone="info" variant="glass">Breadcrumb + Bildirim Merkezi</Badge>
        <Badge tone="success" variant="tonal">⌘K Spotlight Entegre</Badge>
      </div>
    ),
  },
];
