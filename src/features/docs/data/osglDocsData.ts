import type { DocPropRow } from '../types';

export const OSGL_FULL_INTEGRATION_SNIPPET = `import React, { useState } from 'react';
import {
  ThemeProvider,
  ToastProvider,
  OSWorkspaceShell,
  FocusTimerWidget,
  FOCUS_TIMER_SIZE_PRESETS,
  FOCUS_TIMER_CUSTOM_FIELDS,
  type OSWorkspaceApp,
  type OSDesktopWidgetDefinition,
} from 'truncgil-uxigl';

const MY_APPS: OSWorkspaceApp[] = [
  {
    id: 'analytics',
    label: 'Canlı Telemetri',
    shortLabel: 'Telemetri',
    googleIcon: 'monitoring',
    category: 'Operasyon',
    gradient: 'linear-gradient(135deg, #2563eb, #06b6d4)',
    description: 'Sistem metrikleri ve canlı performans panosu',
    defaultSize: { width: 920, height: 600 },
  },
  {
    id: 'files',
    label: 'FileManGL Gezgini',
    shortLabel: 'Dosyalar',
    googleIcon: 'folder_open',
    category: 'Depolama',
    gradient: 'linear-gradient(135deg, #f59e0b, #ea580c)',
    fullBleed: true,
    defaultMaximized: false,
  },
];

const MY_WIDGETS: OSDesktopWidgetDefinition[] = [
  {
    id: 'focus-timer',
    labelTr: 'Odak Sayacı',
    labelEn: 'Focus Timer',
    defaultEnabled: true,
    defaultSize: { width: 360, height: 190 },
    sizePresets: FOCUS_TIMER_SIZE_PRESETS,
    customFields: FOCUS_TIMER_CUSTOM_FIELDS,
    render: (ctx) => <FocusTimerWidget ctx={ctx} storageScopeKey="my-app-os" />,
  },
  {
    id: 'quick-kpi',
    labelTr: 'Hızlı Özet',
    labelEn: 'Quick Summary',
    defaultEnabled: true,
    defaultSize: { width: 300, height: 140 },
    render: (ctx) => (
      <div style={{ ...ctx.cardStyle, padding: 14, height: '100%' }}>
        <div style={{ fontWeight: 700, fontSize: 13 }}>
          {ctx.customPrefs?.customTitle || (ctx.locale === 'tr' ? 'Hızlı Özet' : 'Quick Summary')}
        </div>
        <button type="button" onClick={() => ctx.openSideBySide('analytics', 'files')}>
          {ctx.locale === 'tr' ? 'Yan Yana Aç' : 'Open Side-by-Side'}
        </button>
      </div>
    ),
  },
];

export function MyOSApp() {
  const [openReq, setOpenReq] = useState<{ appId: string; nonce: number } | null>(null);

  return (
    <ThemeProvider defaultMode="dark" defaultPalette="ocean">
      <ToastProvider>
        <OSWorkspaceShell
          apps={MY_APPS}
          dockAppIds={['analytics', 'files']}
          widgets={MY_WIDGETS}
          storageScopeKey="my-app-os"
          initialWallpaper="dijios-oxford"
          brandTitle="MyWorkspace"
          brandSubtitle="OSGL v2"
          externalOpenRequest={openReq}
          onSwitchToClassic={() => console.log('Switch to classic layout')}
          onOpenGlobalThemeStudio={() => setOpenReq({ appId: 'os-theme-studio', nonce: Date.now() })}
          renderWindowContent={(appId) => {
            if (appId === 'analytics') return <div>Analytics Module</div>;
            if (appId === 'files') return <div>FileManGL Module</div>;
            return null;
          }}
        />
      </ToastProvider>
    </ThemeProvider>
  );
}`;

export const OSGL_WIDGET_PERSISTENCE_SNIPPET = `import {
  loadOSGLState,
  saveOSGLState,
  loadOSGLWidgetData,
  saveOSGLWidgetData,
  buildScopedOSGLKey,
} from 'truncgil-uxigl';

// 1. OSGL masaüstü durumunu oku / kaydet (anahtar: uxu.osgl.state.v4.<scopeKey>)
const current = loadOSGLState('my-app-os');
saveOSGLState('my-app-os', { ...current, dockVisible: true });

// 2. Özel widget verisini oku / kaydet (anahtar: uxu.osgl.widget.v2.<scopeKey>.<widgetKey>)
const savedNotes = loadOSGLWidgetData<string[]>('sticky_notes', [], 'my-app-os');
saveOSGLWidgetData('sticky_notes', [...savedNotes, 'Yeni görev'], 'my-app-os');`;

export function getOsglShellPropsRows(isTR: boolean): DocPropRow[] {
  return [
    {
      name: 'apps',
      type: 'OSWorkspaceApp[]',
      defaultValue: '—',
      required: true,
      description: isTR
        ? 'Masaüstünde, Dock’ta, Üst Menüde ve Spotlight (⌘K) aramasında görünecek uygulama modülleri.'
        : 'Application modules displayed on the Desktop, Dock, Top Menu Bar, and Spotlight (⌘K).',
    },
    {
      name: 'renderWindowContent',
      type: '(appId: string) => React.ReactNode',
      defaultValue: '—',
      required: true,
      description: isTR
        ? 'Açık pencere veya mobil tam ekran sayfası içinde render edilecek içerik üreticisi.'
        : 'Renderer function returning the React content for each floating window or mobile sheet.',
    },
    {
      name: 'dockAppIds',
      type: 'string[]',
      defaultValue: 'İlk 6 app',
      description: isTR
        ? 'Varsayılan olarak alt Dock çubuğuna sabitlenecek uygulama kimlikleri.'
        : 'Default app IDs pinned to the bottom Dock bar.',
    },
    {
      name: 'widgets',
      type: 'OSDesktopWidgetDefinition[]',
      defaultValue: '[]',
      description: isTR
        ? 'Masaüstü sağ tarafında 20px ızgaraya oturan, sürüklenip boyutlandırılabilen widget tanımları.'
        : 'Draggable, resizable desktop widget definitions snapping to a 20px grid.',
    },
    {
      name: 'storageScopeKey',
      type: 'string',
      defaultValue: "'default'",
      description: isTR
        ? 'localStorage kalıcılığını uygulama/oturum bazında izole eden anahtar (uxu.osgl.state.v4.<scope>).'
        : 'Isolates localStorage persistence per app or tenant (uxu.osgl.state.v4.<scope>).',
    },
    {
      name: 'initialWallpaper',
      type: 'OSWallpaperId',
      defaultValue: "'dijios-oxford'",
      description: isTR
        ? "Başlangıç WebGL duvar kağıdı ('dijios-oxford' | 'sequoia' | 'sonoma' | 'ventura' | 'monterey' | 'bigsur' | 'midnight')."
        : "Initial WebGL shader wallpaper ('dijios-oxford' | 'sequoia' | 'sonoma' | 'ventura' | 'monterey' | 'bigsur' | 'midnight').",
    },
    {
      name: 'brandLogo / brandTitle / brandSubtitle',
      type: 'ReactNode / string / string',
      defaultValue: "'uxiGL'",
      description: isTR
        ? 'Üst Menü Çubuğu sol tarafındaki marka logosu, başlığı ve alt etiketi.'
        : 'Brand logo, title, and subtitle rendered on the left side of the Top Menu Bar.',
    },
    {
      name: 'headerRightSlot / topBannerSlot',
      type: 'ReactNode',
      defaultValue: 'undefined',
      description: isTR
        ? 'Üst çubuk sağ sistem tepsisi önüne veya üst çubuk altına eklenen özel slotlar.'
        : 'Custom slots injected before the top-right tray or directly below the Top Menu Bar.',
    },
    {
      name: 'onSwitchToClassic / onOpenGlobalThemeStudio',
      type: '() => void',
      defaultValue: 'undefined',
      description: isTR
        ? 'Klasik görünüme dönüş veya global Tema Stüdyosu çekmecesini açma geri çağrıları.'
        : 'Callbacks to switch back to classic shell or open the global Theme Studio drawer.',
    },
    {
      name: 'externalOpenRequest',
      type: '{ appId: string; nonce: number } | null',
      defaultValue: 'null',
      description: isTR
        ? 'Dış bileşenlerden programatik olarak bir pencere açmak/öne getirmek için tetikleyici.'
        : 'Programmatic trigger to open or focus a window from outside OSWorkspaceShell.',
    },
  ];
}

export function getOsglAppModelRows(isTR: boolean): DocPropRow[] {
  return [
    {
      name: 'id / label / shortLabel',
      type: 'string',
      defaultValue: '—',
      required: true,
      description: isTR
        ? 'Benzersiz uygulama kimliği, tam pencere başlığı ve masaüstü/Dock kısa etiketi.'
        : 'Unique app ID, full window title, and compact label for Desktop/Dock.',
    },
    {
      name: 'googleIcon / iconNode',
      type: 'string / ReactNode',
      defaultValue: '—',
      required: true,
      description: isTR
        ? 'Material Symbols ikon adı veya özel React SVG/Lucide ikon düğümü.'
        : 'Google Material Symbols icon name or optional custom React icon node.',
    },
    {
      name: 'category / gradient',
      type: 'string',
      defaultValue: '—',
      required: true,
      description: isTR
        ? 'Üst menü ve Spotlight gruplama kategorisi ile varsayılan canlı simge gradyanı.'
        : 'Grouping category for Top Menu/Spotlight and default vivid icon gradient.',
    },
    {
      name: 'badge / description',
      type: 'string',
      defaultValue: 'undefined',
      description: isTR
        ? 'Simge rozeti (ör. "Yeni", "3") ve mobil/Spotlight alt açıklaması.'
        : 'Optional badge pill on the icon and subtitle in Spotlight/mobile launcher.',
    },
    {
      name: 'fullBleed',
      type: 'boolean',
      defaultValue: 'false',
      description: isTR
        ? 'true olduğunda pencere iç boşluğunu kaldırır (SheetGL, FileManGL gibi tam tuval uygulamalar için).'
        : 'Removes inner padding for edge-to-edge apps like SheetGL or FileManGL.',
    },
    {
      name: 'defaultSize / defaultMaximized',
      type: '{ width, height } / boolean',
      defaultValue: '780×540 / false',
      description: isTR
        ? 'Pencere ilk açıldığında kullanılacak başlangıç boyutu veya tam ekran başlangıç tercihi.'
        : 'Initial window dimensions or maximized state when opened for the first time.',
    },
  ];
}

export interface OsglFeatureCardItem {
  id: string;
  titleTr: string;
  titleEn: string;
  badge: string;
  summaryTr: string;
  summaryEn: string;
  bulletsTr: string[];
  bulletsEn: string[];
}

export const OSGL_FEATURE_PILLARS: OsglFeatureCardItem[] = [
  {
    id: 'windows',
    titleTr: 'WASM Pencere Yöneticisi & Hizalama',
    titleEn: 'WASM Window Manager & Tiling',
    badge: 'osWasmEngine',
    summaryTr:
      'WebAssembly destekli sınır hesaplayıcı ile pürüzsüz sürükleme, 8 yönlü boyutlandırma ve akıllı hizalama.',
    summaryEn:
      'WebAssembly-backed bounds solver with smooth dragging, 8-way resizing, and smart window tiling.',
    bulletsTr: [
      '8 yönlü kenar/köşe boyutlandırma (n, s, e, w, ne, nw, se, sw) ve minimum 380×220px koruma.',
      '7 Snap Bölgesi: Tam Ekran (maximize), Sol/Sağ Yarım ve 4 Köşe Kadranı.',
      '4 Düzenleme Modu: Cascade, Grid, Side-by-Side (Yan Yana) ve Quadrants (2×2).',
      'Sağ veya Sol pencere kontrol düğmeleri (Windows/Linux vs macOS trafik ışıkları).',
      'Uygulama bazlı pencere konum/boyut hafızası (windowBoundsByApp) ve viewport resize koruması.',
    ],
    bulletsEn: [
      '8-direction edge/corner resizing (n, s, e, w, ne, nw, se, sw) with 380×220px min bounds.',
      '7 Snap Zones: Maximize, Left/Right Half, and 4 Corner Quadrants.',
      '4 Arrange Modes: Cascade, Grid, Side-by-Side, and Quadrants (2×2).',
      'Switchable right or left window controls (traffic lights vs standard titlebar).',
      'Per-app persisted window bounds (windowBoundsByApp) and automatic viewport clamping.',
    ],
  },
  {
    id: 'desktop-folders',
    titleTr: 'Masaüstü Izgarası, Klasörler & Sağ Tık',
    titleEn: 'Desktop Grid, Folders & Context Menus',
    badge: 'DesktopGrid',
    summaryTr:
      'Serbest slot ızgarası, çoklu seçim kutusu (marquee), sürükle-bırak klasörleme ve bağlamsal menüler.',
    summaryEn:
      'Free-slot column grid, marquee multi-selection, drag-to-folder grouping, and context menus.',
    bulletsTr: [
      'Sütun öncelikli serbest slot yerleştirme (iconSlots) ve canlı önizlemeli sürükle-bırak.',
      'Boş alana sürükleyerek çoklu simge seçimi (Marquee Selection) ve toplu açma/klasörleme.',
      'Klasör Sistemi: Seçilenlerden klasör oluşturma, simgeyi klasör üstüne bırakma, yeniden adlandırma, 6 renk etiketi ve dağıtma.',
      'Masaüstü sağ tık menüsü + öğe bazlı (app / folder / dock-app) akıllı sağ tık menüsü.',
    ],
    bulletsEn: [
      'Column-major free-slot placement (iconSlots) with live drop preview.',
      'Marquee box multi-selection on empty desktop to batch-open or group apps.',
      'Folder System: Create from selection, drag apps into folders, inline rename, 6 color presets, and dissolve.',
      'Desktop context menu + item-aware context menu for apps, folders, and Dock items.',
    ],
  },
  {
    id: 'dock',
    titleTr: 'Akıllı Alt Dock & Büyütme Efekti',
    titleEn: 'Smart Dock & Magnification',
    badge: 'useDockMagnification',
    summaryTr:
      'İmleç yakınlığına duyarlı macOS tarzı büyüme animasyonu, sürükleyerek sabitleme ve özelleştirici.',
    summaryEn:
      'Cursor-proximity macOS magnification, drag-to-pin, and interactive Dock customizer.',
    bulletsTr: [
      'İmleç mesafesine göre dinamik ölçeklenen simgeler ve açık uygulama gösterge noktası.',
      'Masaüstünden Dock’a sürükleyerek sabitleme ve Dock içi sürükle-bırak sıralama.',
      'Sabitlenmemiş ancak açık olan uygulamaların Dock sağ bölümünde otomatik gösterimi.',
      'Dock Özelleştirici (DockCustomizerPopover) ve hızlı Yan Yana / Izgara / Tümünü Kapat kısayolları.',
    ],
    bulletsEn: [
      'Proximity-based icon magnification and active running-window indicator dots.',
      'Drag desktop icons onto the Dock to pin, and drag within Dock to reorder.',
      'Automatically surfaces running unpinned apps in a separated Dock section.',
      'Built-in DockCustomizerPopover plus quick Side-by-Side / Grid / Close All buttons.',
    ],
  },
  {
    id: 'widgets',
    titleTr: 'Masaüstü Widget Motoru & Odak Sayacı',
    titleEn: 'Desktop Widgets & Focus Timer',
    badge: 'DesktopWidgetsHost',
    summaryTr:
      '20px ızgaraya oturan, özelleştirilebilir yüzeyli ve yerleşik FocusTimerWidget içeren widget altyapısı.',
    summaryEn:
      '20px snap-to-grid widget host with customizable surfaces and built-in FocusTimerWidget.',
    bulletsTr: [
      '20px adımda sürükleme ve boyutlandırma (220–560px genişlik, 96–540px yükseklik).',
      'Widget Özelleştirici: Cam / Düz / Tonlu yüzey, 7 vurgu rengi, özel başlık, Small/Medium/Large boyut önayarları.',
      'WidgetCustomField ile her widget’a özel seçenek alanları tanımlayabilme.',
      'Hazır FocusTimerWidget: 5/15/25 dk + özel süre, SVG halka, Web Audio API bitiş zili ve otomatik döngü.',
      'Tam ekran veya çakışan pencere açıldığında widget’ların otomatik gizlenmesi.',
    ],
    bulletsEn: [
      '20px grid-snapped dragging and resizing (220–560px width, 96–540px height).',
      'WidgetCustomizePopover: Glass / Solid / Tinted surfaces, 7 accent swatches, custom title, S/M/L presets.',
      'Extensible WidgetCustomField API for widget-specific user settings.',
      'Built-in FocusTimerWidget: 5/15/25m + custom minutes, SVG ring, Web Audio API chime, and auto-loop.',
      'Auto-hides widgets when a window is maximized, fullscreen, or overlaps the widget column.',
    ],
  },
  {
    id: 'wallpapers-studio',
    titleTr: '7 WebGL Duvar Kağıdı & OS Tema Stüdyosu',
    titleEn: '7 WebGL Wallpapers & OS Theme Studio',
    badge: 'os-theme-studio',
    summaryTr:
      'GPU shader arka planları, 4 arka plan modu, 6 simge stili ve yerleşik Sistem Ayarları penceresi.',
    summaryEn:
      'GPU shader wallpapers, 4 background modes, 6 icon styles, and built-in System Settings window.',
    bulletsTr: [
      '7 WebGL Aurora sahnesi: dijios-oxford, sequoia, sonoma, ventura, monterey, bigsur, midnight.',
      '4 Arka Plan Modu: WebGL Aurora, Çift Renkli Gradyan, Düz Renk ve Özel Görsel (URL veya dosya yükleme).',
      '6 Simge Stili (IconBgStyle): vivid, gradient, soft, glass, sun, mono + 44–84px boyut ayarı.',
      'Otomatik eklenen "os-theme-studio" penceresi: 6 kategori (Görünüm, Duvar Kağıdı, Masaüstü & Dock, Simgeler, Yazı Tipi, Performans & Sıfırla).',
    ],
    bulletsEn: [
      '7 WebGL Aurora scenes: dijios-oxford, sequoia, sonoma, ventura, monterey, bigsur, midnight.',
      '4 Background Modes: WebGL Aurora, Dual-Color Gradient, Solid Color, and Custom Image (URL or file upload).',
      '6 Icon Styles (IconBgStyle): vivid, gradient, soft, glass, sun, mono + 44–84px size slider.',
      'Auto-injected "os-theme-studio" app with 6 tabs (Appearance, Wallpaper, Desktop & Dock, Icons, Typography, Performance & Reset).',
    ],
  },
  {
    id: 'menubar-mobile-storage',
    titleTr: 'Üst Menü, Spotlight (⌘K), Mobil & Kalıcılık',
    titleEn: 'Top Bar, Spotlight (⌘K), Mobile & Storage',
    badge: 'MobileLauncher',
    summaryTr:
      'Duyarlı mobil başlatıcı, klavye komut paleti, cihaz önizleme anahtarı ve kapsamlı localStorage kaydı.',
    summaryEn:
      'Responsive mobile launcher, keyboard command palette, device preview toggle, and scoped storage.',
    bulletsTr: [
      'TopMenuBar: Kategoriye göre gruplanmış Uygulamalar, Pencere, Görünüm, Widget menüleri ve canlı saat.',
      'Spotlight (Ctrl/Cmd + K): Tüm modüller ve pencere düzeni komutları için anlık arama.',
      'MobileLauncher: Mobil ekranlarda veya önizleme modunda arama çubuklu ana ekran ve tam ekran MobileActiveSheet.',
      'İzole Kalıcılık: storageScopeKey ile her uygulama için ayrı durum (v4) ve widget verisi (v2) saklama.',
    ],
    bulletsEn: [
      'TopMenuBar: Category-grouped Apps, Window, View, Widgets dropdowns, and live menu bar clock.',
      'Spotlight (Ctrl/Cmd + K): Instant search across all apps and window arrangement commands.',
      'MobileLauncher: Touch-friendly home screen with search, Dock, and full-screen MobileActiveSheet.',
      'Scoped Persistence: Isolated per-app state (v4) and widget data (v2) via storageScopeKey.',
    ],
  },
];

