import React from 'react';
import {
  Bell,
  FileCode2,
  FormInput,
  Layers,
  Layout,
  Monitor,
  Palette,
  Rocket,
  Table2,
} from 'lucide-react';
import {
  DATA_FEEDBACK_WEBGL_GUIDES,
  FORM_CONTROL_GUIDES,
  SURFACE_NAVIGATION_GUIDES,
} from '../docsComponentGuides';
import type { PageTemplateId } from '../../showcase/PageTemplatesShowcaseView';
import type { DocChapterMeta } from '../types';

export function buildDocsChapters(
  onSelectPageTemplate: (tpl: PageTemplateId) => void
): DocChapterMeta[] {
  return [
    {
      id: 'getting-started',
      step: '1',
      badgeTr: 'BÖLÜM 1 • BAŞLANGIÇ',
      badgeEn: 'CHAPTER 1 • GETTING STARTED',
      titleTr: '1. Kurulum & Başlangıç',
      titleEn: '1. Setup & Quick Start',
      subtitleTr:
        'Kurulum adımları, temel yapı, tam uygulama şablonları ve son geliştirmeler.',
      subtitleEn:
        'Installation steps, core structure, full app templates, and recent updates.',
      icon: <Rocket size={15} />,
      subItems: [
        { id: 'doc-sec-install', labelTr: 'Kurulum', labelEn: 'Installation' },
        { id: 'doc-sec-live-starter', labelTr: 'İlk Bileşen Örneği', labelEn: 'Starter Example' },
        { id: 'doc-sec-osgl-features', labelTr: 'Son Geliştirmeler & OSGL', labelEn: 'Recent Updates & OSGL' },
        { id: 'doc-sec-solid', labelTr: 'Katmanlar & Modüller', labelEn: 'Layers & Modules' },
      ],
    },
    {
      id: 'form-controls',
      step: '2',
      badgeTr: 'BÖLÜM 2 • FORM BİLEŞENLERİ',
      badgeEn: 'CHAPTER 2 • FORM CONTROLS',
      titleTr: '2. Form & Eylem Bileşenleri',
      titleEn: '2. Form & Action Controls',
      subtitleTr:
        'Butonlar, maskeli girişler, para birimi, tarih/saat, etiket seçici, dosya yükleme, switch ve ikonlar.',
      subtitleEn:
        'Buttons, masked inputs, currency, date/time, tags, file upload, switch, and icons.',
      icon: <FormInput size={15} />,
      subItems: FORM_CONTROL_GUIDES.map((g) => ({
        id: `doc-comp-${g.id}`,
        labelTr: g.navLabelTr,
        labelEn: g.navLabelEn,
      })),
    },
    {
      id: 'surfaces-navigation',
      step: '3',
      badgeTr: 'BÖLÜM 3 • YÜZEY & GEZİNME',
      badgeEn: 'CHAPTER 3 • SURFACES & NAVIGATION',
      titleTr: '3. Kart, Modal & Gezinme',
      titleEn: '3. Cards, Modals & Navigation',
      subtitleTr:
        'Kart yüzeyleri, kapsül seçici, sekmeler, akordeon, adım sihirbazı, modal, çekmece ve hazır ayarlar.',
      subtitleEn:
        'Surface cards, segmented control, tabs, accordion, stepper, modal, drawer, and settings.',
      icon: <Layers size={15} />,
      subItems: SURFACE_NAVIGATION_GUIDES.map((g) => ({
        id: `doc-comp-${g.id}`,
        labelTr: g.navLabelTr,
        labelEn: g.navLabelEn,
      })),
    },
    {
      id: 'data-feedback-webgl',
      step: '4',
      badgeTr: 'BÖLÜM 4 • VERİ, MODÜL & WEBGL',
      badgeEn: 'CHAPTER 4 • DATA, MODULES & WEBGL',
      titleTr: '4. Veri, Takvim, Mesajlaşma & Motorlar',
      titleEn: '4. Data, Calendar, Messenger & Engines',
      subtitleTr:
        'Rozetler, KPI kartı, veri tablosu, SheetGL, FileManGL, Takvim, Mesajlaşma, WebGL ve Üst Çubuk.',
      subtitleEn:
        'Badges, KPI cards, DataTable, SheetGL, FileManGL, Calendar, Messenger, WebGL, and TopHeader.',
      icon: <Table2 size={15} />,
      subItems: DATA_FEEDBACK_WEBGL_GUIDES.map((g) => ({
        id: `doc-comp-${g.id}`,
        labelTr: g.navLabelTr,
        labelEn: g.navLabelEn,
      })),
    },
    {
      id: 'layout-shell',
      step: '5',
      badgeTr: 'BÖLÜM 5 • YERLEŞİM',
      badgeEn: 'CHAPTER 5 • LAYOUT',
      titleTr: '5. Kenar Çubuğu & Sayfa Yerleşimi',
      titleEn: '5. Sidebar & Page Layout',
      subtitleTr:
        '5 farklı kenar çubuğu (Sidebar) modu, Üst Başlık Çubuğu ve duyarlı ızgara sınıfları.',
      subtitleEn:
        '5 sidebar modes, TopHeader bar, and responsive grid classes.',
      icon: <Layout size={15} />,
      subItems: [
        { id: 'doc-sec-grid-classes', labelTr: 'Izgara Sınıfları', labelEn: 'Grid Classes' },
        { id: 'doc-sec-sidebar-code', labelTr: 'Yerleşim Yapılandırması', labelEn: 'Layout Configuration' },
        { id: 'doc-sec-sidebar-live', labelTr: 'Kenar Çubuğu Önizleme', labelEn: 'Sidebar Live Preview' },
      ],
    },
    {
      id: 'page-templates',
      step: '6',
      badgeTr: 'BÖLÜM 6 • HAZIR SAYFALAR',
      badgeEn: 'CHAPTER 6 • PAGE TEMPLATES',
      titleTr: '6. Hazır Sayfa & Uygulama Şablonları',
      titleEn: '6. Page & Full App Templates',
      subtitleTr:
        '8 hazır sayfa şablonu ve 6 tam kapsamlı kurumsal/masaüstü uygulama şablonu.',
      subtitleEn:
        '8 ready-made page templates and 6 full enterprise/desktop application templates.',
      icon: <FileCode2 size={15} />,
      subItems: [
        { id: 'doc-tpl-login', labelTr: 'Giriş Sayfası', labelEn: 'Login Page', onSelect: () => onSelectPageTemplate('page-login') },
        { id: 'doc-tpl-register', labelTr: 'Kayıt & Doğrulama (2FA)', labelEn: 'Register & 2FA', onSelect: () => onSelectPageTemplate('page-register') },
        { id: 'doc-tpl-pricing', labelTr: 'Fiyatlandırma', labelEn: 'Pricing', onSelect: () => onSelectPageTemplate('page-pricing') },
        { id: 'doc-tpl-profile', labelTr: 'Kullanıcı Profili', labelEn: 'User Profile', onSelect: () => onSelectPageTemplate('page-profile') },
        { id: 'doc-tpl-invoice', labelTr: 'Fatura & Ödeme', labelEn: 'Invoice & Checkout', onSelect: () => onSelectPageTemplate('page-invoice') },
        { id: 'doc-tpl-kanban', labelTr: 'Kanban Görev Panosu', labelEn: 'Kanban Board', onSelect: () => onSelectPageTemplate('page-kanban') },
        { id: 'doc-tpl-status', labelTr: 'Durum & Hata Sayfaları', labelEn: 'Status & Error Pages', onSelect: () => onSelectPageTemplate('page-status') },
        { id: 'doc-tpl-settings', labelTr: 'Hesap & Sistem Ayarları', labelEn: 'Account & System Settings', onSelect: () => onSelectPageTemplate('page-settings') },
        { id: 'doc-sec-app-templates', labelTr: 'Tam Uygulama Şablonları (6)', labelEn: 'Full App Templates (6)' },
      ],
    },
    {
      id: 'theming-tokens',
      step: '7',
      badgeTr: 'BÖLÜM 7 • TASARIM & TEMA SİSTEMİ',
      badgeEn: 'CHAPTER 7 • DESIGN & THEMING',
      titleTr: '7. Tasarım Türleri, Tema Seçimi & Ayarları',
      titleEn: '7. Design Types, Theme Selection & Settings',
      subtitleTr:
        'Tasarım türleri (Liquid Glass, Dynamic Tonal, Hybrid Fusion), tema seçimi, özel marka HEX rengi, tüm tema ayarları ve tipografi.',
      subtitleEn:
        'Design types, theme selection, custom brand HEX, all theme preferences, CSS variables, and typography.',
      icon: <Palette size={15} />,
      subItems: [
        { id: 'doc-sec-design-types', labelTr: 'Tasarım Türleri & Yüzeyler', labelEn: 'Design Types & Surfaces' },
        { id: 'doc-sec-theme-selection', labelTr: 'Tema Seçimi & Renk Paletleri', labelEn: 'Theme Selection & Palettes' },
        { id: 'doc-sec-theme-settings', labelTr: 'Gelişmiş Tema Ayarları', labelEn: 'Advanced Theme Settings' },
        { id: 'doc-sec-theme-tokens', labelTr: 'CSS Değişkenleri', labelEn: 'CSS Variables' },
        { id: 'doc-sec-fonts-icons', labelTr: 'Yazı Tipleri & İkonlar', labelEn: 'Fonts & Icons' },
      ],
    },
    {
      id: 'cli-shortcuts',
      step: '8',
      badgeTr: 'BÖLÜM 8 • BİLDİRİM & KISAYOL',
      badgeEn: 'CHAPTER 8 • TOAST & SHORTCUTS',
      titleTr: '8. Bildirimler, Kısayollar & Servisler',
      titleEn: '8. Notifications, Shortcuts & Services',
      subtitleTr:
        '5 yönlü bildirim balonları, klavye kısayolları, çekirdek servisler ve tüm bileşen dizini.',
      subtitleEn:
        '5-corner toast notifications, keyboard shortcuts, core services, and full component index.',
      icon: <Bell size={15} />,
      subItems: [
        { id: 'doc-sec-toast-live', labelTr: 'Bildirim Önizleme', labelEn: 'Toast Preview' },
        { id: 'doc-sec-services-table', labelTr: 'Kancalar & Yardımcılar', labelEn: 'Hooks & Helpers' },
        { id: 'doc-sec-all-catalog', labelTr: 'Tüm Bileşenler', labelEn: 'All Components' },
      ],
    },
    {
      id: 'osgl-workspace',
      step: '9',
      badgeTr: 'BÖLÜM 9 • OSGL MASAÜSTÜ MOTORU',
      badgeEn: 'CHAPTER 9 • OSGL DESKTOP ENGINE',
      titleTr: '9. OSGL Masaüstü Çalışma Alanı',
      titleEn: '9. OSGL Desktop Workspace Engine',
      subtitleTr:
        'OSWorkspaceShell ile yeni uygulamalara WASM pencere yöneticisi, klasörler, Dock, widget’lar, WebGL duvar kağıtları ve Tema Stüdyosu ekleyin.',
      subtitleEn:
        'Add WASM window manager, desktop folders, Dock, widgets, WebGL wallpapers, and Theme Studio to new apps via OSWorkspaceShell.',
      icon: <Monitor size={15} />,
      subItems: [
        { id: 'doc-sec-osgl-overview', labelTr: 'OSWorkspaceShell Kurulumu', labelEn: 'OSWorkspaceShell Setup' },
        { id: 'doc-sec-osgl-props', labelTr: 'Props & Uygulama Sözleşmesi', labelEn: 'Props & App Contracts' },
        { id: 'doc-sec-osgl-features-matrix', labelTr: '6 Ana OSGL Özelliği', labelEn: '6 Core OSGL Pillars' },
        { id: 'doc-sec-osgl-theming', labelTr: 'Duvar Kağıdı & Simge Stilleri', labelEn: 'Wallpapers & Icon Styles' },
        { id: 'doc-sec-osgl-storage', labelTr: 'Kalıcılık & Widget API', labelEn: 'Persistence & Widget API' },
      ],
    },
  ];
}
