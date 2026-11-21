import React from 'react';
import {
  FileManGLExplorerAdapter,
  SheetGLGridAdapter,
} from '../../../components/composites';
import {
  BadgesChipsAvatarsLiveMiniDemo,
  StatCardNativeTableLiveMiniDemo,
} from '../demos/DataFeedbackDemos';
import type { DocComponentGuideItem } from '../types';

export const DATA_FEEDBACK_GUIDES: DocComponentGuideItem[] = [
  {
    id: 'badges-chips-avatars',
    tag: '<Badge />, <Chip />, <Avatar />, <Progress />, <Skeleton /> & <Tooltip />',
    navLabelTr: 'Rozet, Çip, Avatar & İlerleme',
    navLabelEn: 'Badge, Chip, Avatar & Progress',
    titleTr: 'Durum Rozetleri, Filtre Çipleri, Squircle Avatarlar & İlerleme',
    titleEn: 'Status Badges, Filter Chips, Squircle Avatars & Progress',
    categoryLabelTr: 'Veri & Bildirim',
    categoryLabelEn: 'Data & Feedback',
    playgroundId: 'badge',
    importStatement:
      "import { Badge, Chip, Avatar, AvatarGroup, Progress, Skeleton, Tooltip } from 'truncgil-uxigl';",
    architectureNoteTr:
      'Pulse animasyonlu rozetler, seçilebilir filtre çipleri, squircle avatar grupları, dairesel/doğrusal ilerleme ve iskelet yükleyiciler içerir.',
    architectureNoteEn:
      'Includes pulsing badges, selectable chips, squircle avatar groups, linear/circular progress, and skeleton loaders.',
    summaryTr:
      'Kullanıcı varlığı, sistem sağlığı, filtreleme etiketleri ve yükleme durumları için mikro durum bileşenleri.',
    summaryEn:
      'Micro status primitives for user presence, system health, filter tags, and loading states.',
    code: `<Badge tone="success" variant="glass" pulse>%99.99 SLA</Badge>
<Chip selected={active} onClick={toggle} tone="primary">Liquid Glass</Chip>
<AvatarGroup max={3}><Avatar name="Ümit Uz" status="online" shape="squircle" /></AvatarGroup>
<Progress variant="circular" value={84} tone="success" />`,
    propsTable: [
      {
        name: 'tone',
        type: "'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'",
        defaultValue: "'primary'",
        description: 'Semantik durum rengi.',
      },
      {
        name: 'pulse (Badge)',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Canlı nabız animasyonu ekler.',
      },
      {
        name: 'shape (Avatar)',
        type: "'circle' | 'squircle'",
        defaultValue: "'squircle'",
        description: 'Avatar köşe geometrisi.',
      },
    ],
    renderLiveDemo: () => <BadgesChipsAvatarsLiveMiniDemo />,
  },
  {
    id: 'statcard-datatable',
    tag: '<StatCard />, <DataTable /> & <Pagination />',
    navLabelTr: 'KPI Kartı, Tablo & Sayfalama',
    navLabelEn: 'KPI Card, DataTable & Pagination',
    titleTr: 'Sparkline KPI Kartı & Sıfır-WebGL Hafif Native HTML Tablo',
    titleEn: 'Sparkline KPI Card & Zero-WebGL Lightweight Native DataTable',
    categoryLabelTr: 'Veri & Tablo',
    categoryLabelEn: 'Data & Table',
    playgroundId: 'data-table',
    importStatement:
      "import { StatCard, DataTable, Pagination } from 'truncgil-uxigl';",
    architectureNoteTr:
      'DataTable sıfır WebGL yüküyle sıralama, çoklu satır seçimi, 4 tablo stili (default, striped, bordered, minimal) ve Pagination entegrasyonu sunar.',
    architectureNoteEn:
      'Zero-WebGL DataTable with sorting, multi-row selection, 4 table variants, and Pagination integration.',
    summaryTr:
      'Yönetici panelleri için mini trend grafikli KPI kartları ve kurumsal listeler için hafif HTML veri tablosu.',
    summaryEn:
      'Sparkline KPI cards for executive dashboards and lightweight HTML tables for enterprise lists.',
    code: `<StatCard label="Kapasite" value="148.6 TFLOPS" delta="+18.4%" trend="up" sparklineData={[32, 45, 72, 96]} />
<DataTable rowKey="id" variant="striped" selectable data={rows} columns={cols} />
<Pagination page={page} totalPages={5} onPageChange={setPage} />`,
    propsTable: [
      {
        name: 'sparklineData (StatCard)',
        type: 'number[]',
        defaultValue: 'undefined',
        description: 'Kart altındaki mini SVG trend grafiği verisi.',
      },
      {
        name: 'variant (DataTable)',
        type: "'default' | 'striped' | 'bordered' | 'minimal'",
        defaultValue: "'default'",
        description: 'Tablo satır ve kenarlık stili.',
      },
      {
        name: 'selectable (DataTable)',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Satır başı onay kutusu seçimi ekler.',
      },
    ],
    renderLiveDemo: () => <StatCardNativeTableLiveMiniDemo />,
  },
  {
    id: 'sheetgl-adapter',
    tag: '<SheetGLGridAdapter />',
    navLabelTr: 'SheetGL Yüksek Hızlı Veri Izgarası',
    navLabelEn: 'SheetGL High-Speed DataGrid',
    titleTr: 'SheetGL 120 FPS WebGL/Canvas Kurumsal DataGrid Motoru',
    titleEn: 'SheetGL 120 FPS WebGL/Canvas Enterprise DataGrid Engine',
    categoryLabelTr: 'Kurumsal Motor',
    categoryLabelEn: 'Enterprise Engine',
    playgroundId: 'sheetgl',
    importStatement: "import { SheetGLGridAdapter } from 'truncgil-uxigl';",
    architectureNoteTr:
      'Aktif uxiGL temasını (renk paleti, karanlık/aydınlık mod, yazı tipi) buildInheritedSheetGLTheme() üzerinden otomatik devralır.',
    architectureNoteEn:
      'Automatically inherits active uxiGL theme tokens via buildInheritedSheetGLTheme().',
    summaryTr:
      'Yüz binlerce satırı 120 FPS akıcılıkla işleyen, Excel benzeri hücre düzenleme, sıralama ve donmuş sütunlar sunan veri ızgarası.',
    summaryEn:
      'High-throughput Excel-grade DataGrid engine handling massive datasets at 120 FPS with live theme sync.',
    code: `<SheetGLGridAdapter height={420} />`,
    propsTable: [
      {
        name: 'height',
        type: 'number | string',
        defaultValue: '420',
        description: 'Izgara konteyner yüksekliği.',
      },
      {
        name: 'rows / columns',
        type: 'SheetGLRow[] / SheetGLColumn[]',
        defaultValue: 'preset',
        description: 'Özel veri satırları ve sütun şeması.',
      },
    ],
    renderLiveDemo: () => <SheetGLGridAdapter height={320} />,
  },
  {
    id: 'filemangl-adapter',
    tag: '<FileManGLExplorerAdapter />',
    navLabelTr: 'FileManGL Dosya Yöneticisi',
    navLabelEn: 'FileManGL File Explorer',
    titleTr: 'FileManGL Sanal Dosya Sistemi (VFS) & Medya Gezgini',
    titleEn: 'FileManGL Virtual File System (VFS) & Media Explorer',
    categoryLabelTr: 'Kurumsal Motor',
    categoryLabelEn: 'Enterprise Engine',
    playgroundId: 'filemangl',
    importStatement: "import { FileManGLExplorerAdapter } from 'truncgil-uxigl';",
    architectureNoteTr:
      'Klasör ağacı, sürükle-bırak taşıma, görsel/kod önizleme ve tema uyumlu cam arayüzü tek adaptörde sunar.',
    architectureNoteEn:
      'Provides folder tree, drag-and-drop file ops, preview modal, and theme-synced glass UI.',
    summaryTr:
      'Bulut depolama, belge arşivi ve varlık yönetimi ekranları için tam teşekküllü dosya gezgini.',
    summaryEn:
      'Full-featured file explorer for cloud storage, document archives, and asset management.',
    code: `<FileManGLExplorerAdapter height={420} />`,
    propsTable: [
      {
        name: 'height',
        type: 'number | string',
        defaultValue: '420',
        description: 'Dosya gezgini konteyner yüksekliği.',
      },
      {
        name: 'themeMode',
        type: "'light' | 'dark' | 'auto'",
        defaultValue: "'auto'",
        description: 'uxiGL tema modu ile otomatik eşitleme.',
      },
    ],
    renderLiveDemo: () => <FileManGLExplorerAdapter height={340} />,
  },
];
