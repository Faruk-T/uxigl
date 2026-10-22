import React, { useEffect, useMemo, useState } from 'react';
import {
  Sun,
  Moon,
  Palette,
  Layers,
  LayoutDashboard,
  BookOpen,
  Sliders,
  Box,
  Rocket,
  Sparkles,
  Home,
} from 'lucide-react';
import { useTheme } from './providers/ThemeProvider';
import { useToast } from './providers/ToastProvider';
import { useKeyboardShortcut } from './hooks/useKeyboardShortcut';
import { defaultThemeStorageAdapter } from './core/services/StorageService';
import { RouteService } from './core/services/RouteService';
import {
  CommandPalette,
  type CommandActionItem,
  Sidebar,
  TopHeader,
  WebGLAuroraCanvas,
} from './components/composites';
import type {
  BreadcrumbItem,
  SidebarNavGroup,
} from './core/contracts/NavigationContract';
import { COMPONENT_CATALOG } from './features/catalog/componentCatalog';
import { InteractivePlayground } from './features/playground/InteractivePlayground';
import {
  AppleGoogleAppShowcase,
  type DashboardSubView,
} from './features/showcase/AppleGoogleAppShowcase';
import {
  ArchitectureDocsView,
  type DocsTopicId,
} from './features/docs/ArchitectureDocsView';
import { ThemeStudioDrawer } from './features/theme-studio/ThemeStudioDrawer';
import { UXILandingPage } from './features/landing/UXILandingPage';

export type MainSectionId =
  | 'landing'
  | 'docs-guide'
  | 'dashboard'
  | 'components-inputs'
  | 'components-surfaces'
  | 'components-feedback';

export const App: React.FC = () => {
  const {
    resolvedMode,
    availablePalettes,
    toggleMode,
    setSeedPalette,
  } = useTheme();
  const { notify } = useToast();

  // Classic Hierarchical Sidebar Navigation State (URL Route -> localStorage -> Default)
  const [activeSectionId, setActiveSectionId] = useState<MainSectionId>(() => {
    const parsedFromUrl = RouteService.parsePath(window.location.pathname);
    if (parsedFromUrl) return parsedFromUrl.sectionId;
    const saved = defaultThemeStorageAdapter.loadNavState();
    return (saved?.activeSectionId as MainSectionId) || 'dashboard';
  });
  const [activeSubItemId, setActiveSubItemId] = useState<string>(() => {
    const parsedFromUrl = RouteService.parsePath(window.location.pathname);
    if (parsedFromUrl) return parsedFromUrl.subItemId;
    const saved = defaultThemeStorageAdapter.loadNavState();
    return saved?.activeSubItemId || 'overview';
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    const saved = defaultThemeStorageAdapter.loadNavState();
    return Boolean(saved?.sidebarCollapsed);
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [themeDrawerOpen, setThemeDrawerOpen] = useState(false);

  const activeRoutePath = useMemo(
    () => RouteService.buildPath(activeSectionId, activeSubItemId),
    [activeSectionId, activeSubItemId]
  );

  // Sync URL address bar (pushState / replaceState) & localStorage whenever active route changes
  useEffect(() => {
    defaultThemeStorageAdapter.saveNavState({
      activeSectionId,
      activeSubItemId,
      sidebarCollapsed,
    });

    if (window.location.pathname !== activeRoutePath) {
      if (
        window.location.pathname === '/' ||
        window.location.pathname === ''
      ) {
        window.history.replaceState(
          { sectionId: activeSectionId, subItemId: activeSubItemId },
          '',
          activeRoutePath
        );
      } else {
        window.history.pushState(
          { sectionId: activeSectionId, subItemId: activeSubItemId },
          '',
          activeRoutePath
        );
      }
    }
  }, [activeSectionId, activeSubItemId, sidebarCollapsed, activeRoutePath]);

  // Listen to browser Back / Forward buttons (popstate)
  useEffect(() => {
    const onPopState = () => {
      const parsed = RouteService.parsePath(window.location.pathname);
      if (parsed) {
        setActiveSectionId(parsed.sectionId);
        setActiveSubItemId(parsed.subItemId);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Global Cmd/Ctrl + K shortcut for Spotlight Command Palette
  useKeyboardShortcut(
    'k',
    () => {
      setCmdPaletteOpen((prev) => !prev);
    },
    { metaOrCtrl: true }
  );

  // Hierarchical Sidebar Menu Configuration with Concise, Scannable Labels & Explicit Route URLs
  const sidebarGroups = useMemo<SidebarNavGroup[]>(
    () => [
      {
        id: 'grp-get-started',
        title: 'BAŞLANGIÇ',
        items: [
          {
            id: 'landing',
            label: 'Tanıtım Sayfası (/)',
            href: '/',
            icon: <Home size={16} />,
            badge: 'uxiGL',
            badgeTone: 'info',
          },
          {
            id: 'docs-guide',
            label: 'Başlangıç Rehberi',
            href: '/docs/getting-started',
            icon: <Rocket size={16} />,
            subItems: [
              {
                id: 'getting-started',
                label: '1. Kurulum',
                href: '/docs/getting-started',
              },
              {
                id: 'theming-tokens',
                label: '2. Tema & Font',
                href: '/docs/theming-tokens',
              },
              {
                id: 'layout-shell',
                label: '3. Yerleşim',
                href: '/docs/layout-shell',
              },
              {
                id: 'cli-shortcuts',
                label: '4. Bildirim & ⌘K',
                href: '/docs/cli-shortcuts',
              },
            ],
          },
        ],
      },
      {
        id: 'grp-workspace',
        title: 'DASHBOARD',
        items: [
          {
            id: 'dashboard',
            label: 'Komuta Merkezi',
            href: '/dashboard/overview',
            icon: <LayoutDashboard size={16} />,
            badge: 'Canlı',
            badgeTone: 'success',
            subItems: [
              {
                id: 'overview',
                label: 'Genel Bakış',
                href: '/dashboard/overview',
              },
              {
                id: 'analytics',
                label: 'Canlı Analitik',
                href: '/dashboard/analytics',
              },
              {
                id: 'crm-orders',
                label: 'SheetGL Tablo',
                href: '/dashboard/crm-orders',
              },
              {
                id: 'file-manager',
                label: 'FileManGL Dosya',
                href: '/dashboard/file-manager',
              },
              {
                id: 'smart-cluster',
                label: 'Sunucu Kümesi',
                href: '/dashboard/smart-cluster',
              },
            ],
          },
        ],
      },
      {
        id: 'grp-design-system',
        title: 'BİLEŞENLER',
        items: [
          {
            id: 'components-inputs',
            label: 'Form Kontrolleri',
            href: '/components/inputs/button',
            icon: <Sliders size={16} />,
            subItems: [
              { id: 'button', label: 'Button', href: '/components/inputs/button' },
              { id: 'input', label: 'Input', href: '/components/inputs/input' },
              { id: 'switch', label: 'Switch', href: '/components/inputs/switch' },
              { id: 'checkbox', label: 'Checkbox', href: '/components/inputs/checkbox' },
              { id: 'slider', label: 'Slider', href: '/components/inputs/slider' },
            ],
          },
          {
            id: 'components-surfaces',
            label: 'Yüzey & Gezinme',
            href: '/components/surfaces/card',
            icon: <Box size={16} />,
            subItems: [
              { id: 'card', label: 'Card', href: '/components/surfaces/card' },
              {
                id: 'segmented-control',
                label: 'Segmented',
                href: '/components/surfaces/segmented-control',
              },
              {
                id: 'tabs-accordion',
                label: 'Tabs & Accordion',
                href: '/components/surfaces/tabs-accordion',
              },
              {
                id: 'modal-command',
                label: 'Modal & ⌘K',
                href: '/components/surfaces/modal-command',
              },
            ],
          },
          {
            id: 'components-feedback',
            label: 'Veri & Durum',
            href: '/components/feedback/chips-badges',
            icon: <Sparkles size={16} />,
            subItems: [
              {
                id: 'chips-badges',
                label: 'Chip & Badge',
                href: '/components/feedback/chips-badges',
              },
              {
                id: 'progress-avatar',
                label: 'Progress & Avatar',
                href: '/components/feedback/progress-avatar',
              },
              {
                id: 'datatable-statcard',
                label: 'SheetGL & KPI',
                href: '/components/feedback/datatable-statcard',
              },
              {
                id: 'filemangl-explorer',
                label: 'FileManGL VFS',
                href: '/components/feedback/filemangl-explorer',
              },
            ],
          },
        ],
      },
    ],
    []
  );

  // Unified handler when any Sidebar parent or sub-menu item is clicked
  const handleSidebarSelect = (itemId: string, subItemId?: string) => {
    const section = itemId as MainSectionId;
    setActiveSectionId(section);

    if (subItemId) {
      setActiveSubItemId(subItemId);
      return;
    }

    // Default sub-item fallback if parent clicked directly
    if (section === 'landing') setActiveSubItemId('home');
    if (section === 'docs-guide') setActiveSubItemId('getting-started');
    if (section === 'dashboard') setActiveSubItemId('overview');
    if (section === 'components-inputs') setActiveSubItemId('button');
    if (section === 'components-surfaces') setActiveSubItemId('card');
    if (section === 'components-feedback') setActiveSubItemId('chips-badges');
  };

  // Handler when selecting a component inside the InteractivePlayground or Quick Directory
  const handlePlaygroundComponentSelect = (compId: string) => {
    const sectionId = RouteService.getSectionForComponent(compId);
    setActiveSectionId(sectionId);
    setActiveSubItemId(compId);
  };

  // Dynamic Breadcrumbs based on active Sidebar menu & sub-menu with explicit route hrefs
  const breadcrumbs = useMemo<BreadcrumbItem[]>(() => {
    const items: BreadcrumbItem[] = [
      {
        id: 'root',
        label: 'uxiGL',
        href: '/',
        onClick: () => handleSidebarSelect('landing', 'home'),
      },
    ];

    for (const grp of sidebarGroups) {
      for (const navItem of grp.items) {
        if (navItem.id === activeSectionId) {
          const parentHref =
            navItem.href ??
            RouteService.buildPath(navItem.id, navItem.subItems?.[0]?.id);
          items.push({
            id: navItem.id,
            label: navItem.label,
            href: parentHref,
            onClick: () =>
              handleSidebarSelect(navItem.id, navItem.subItems?.[0]?.id),
          });
          const sub = navItem.subItems?.find((s) => s.id === activeSubItemId);
          if (sub) {
            items.push({
              id: sub.id,
              label: sub.label,
              href: sub.href ?? RouteService.buildPath(navItem.id, sub.id),
            });
          }
        }
      }
    }

    return items;
  }, [sidebarGroups, activeSectionId, activeSubItemId]);

  // Build universal Spotlight actions
  const commandActions = useMemo<CommandActionItem[]>(() => {
    const componentActions: CommandActionItem[] = COMPONENT_CATALOG.map(
      (entry) => ({
        id: `comp-${entry.id}`,
        title: `${entry.name} — ${entry.turkishTitle}`,
        subtitle: entry.summary,
        category: 'Bileşen Dokümantasyonu',
        icon: <Layers size={16} />,
        onSelect: () => handlePlaygroundComponentSelect(entry.id),
      })
    );

    const viewActions: CommandActionItem[] = [
      {
        id: 'view-get-started',
        title: 'Get Started — Kurulum & Hızlı Başlangıç Rehberi',
        subtitle: 'Adım adım kurulum, ThemeProvider ve ilk bileşen örneği',
        category: 'Başlangıç',
        icon: <Rocket size={16} />,
        shortcut: 'G S',
        onSelect: () => handleSidebarSelect('docs-guide', 'getting-started'),
      },
      {
        id: 'view-theming',
        title: 'Tema, Dark/Light Mode & Renk Paletleri Rehberi',
        subtitle: 'useTheme() kancası ve canlı CSS değişken laboratuvarı',
        category: 'Başlangıç',
        icon: <BookOpen size={16} />,
        shortcut: 'G T',
        onSelect: () => handleSidebarSelect('docs-guide', 'theming-tokens'),
      },
      {
        id: 'view-dash-overview',
        title: 'Komuta Merkezi — Genel Bakış (Dashboard)',
        subtitle: 'KPI kartları, gelir grafiği, canlı akış ve CRM tablosu',
        category: 'Dashboard',
        icon: <LayoutDashboard size={16} />,
        shortcut: 'G D',
        onSelect: () => handleSidebarSelect('dashboard', 'overview'),
      },
    ];

    const themeActions: CommandActionItem[] = [
      {
        id: 'theme-toggle',
        title: `Tema Modunu Değiştir (${
          resolvedMode === 'dark' ? 'Aydınlık Moda Geç' : 'Karanlık Moda Geç'
        })`,
        subtitle: 'Dark / Light Mode anlık geçişi',
        category: 'Tema',
        icon: resolvedMode === 'dark' ? <Sun size={16} /> : <Moon size={16} />,
        shortcut: '⌘J',
        onSelect: () => {
          toggleMode();
          notify({
            title: 'Tema Modu Güncellendi',
            description: `Yeni mod: ${
              resolvedMode === 'dark' ? 'Light (Aydınlık)' : 'Dark (Karanlık)'
            }`,
            tone: 'info',
          });
        },
      },
      ...availablePalettes.map((p) => ({
        id: `palette-${p.id}`,
        title: `Renk Paleti: ${p.name}`,
        subtitle: `${p.inspiration} — ${p.description}`,
        category: 'Tohum Renk (Seed)',
        icon: <Palette size={16} />,
        onSelect: () => {
          setSeedPalette(p.id);
          notify({
            title: `${p.name} Etkinleştirildi`,
            description: p.description,
            tone: 'primary',
          });
        },
      })),
    ];

    return [...viewActions, ...themeActions, ...componentActions];
  }, [resolvedMode, availablePalettes, toggleMode, setSeedPalette, notify]);

  return (
    <div className="uxu-app-frame">
      {/* Hardware-Accelerated WebGL Aurora Borealis & Spatial Shader Canvas */}
      <WebGLAuroraCanvas />

      {activeSectionId === 'landing' ? (
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            height: '100vh',
            overflowY: 'auto',
          }}
        >
          <UXILandingPage
            onNavigate={handleSidebarSelect}
            onOpenCommandPalette={() => setCmdPaletteOpen(true)}
          />
        </div>
      ) : (
        <>
          {/* Left Classic Hierarchical Sidebar with Expandable Sub-Menus */}
          <Sidebar
            groups={sidebarGroups}
            activeItemId={activeSectionId}
            activeSubItemId={activeSubItemId}
            collapsed={sidebarCollapsed}
            mobileOpen={mobileSidebarOpen}
            onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
            onCloseMobile={() => setMobileSidebarOpen(false)}
            onSelect={handleSidebarSelect}
            onOpenCommandPalette={() => setCmdPaletteOpen(true)}
            onOpenThemeStudio={() => setThemeDrawerOpen(true)}
          />

          {/* Right Full-Width Content Column (Fits Viewport 100%, Not Centered!) */}
          <div className="uxu-app-body">
            <TopHeader
              breadcrumbs={breadcrumbs}
              activeRoutePath={activeRoutePath}
              onOpenMobileMenu={() => setMobileSidebarOpen(true)}
              onOpenCommandPalette={() => setCmdPaletteOpen(true)}
              onOpenThemeStudio={() => setThemeDrawerOpen(true)}
            />

            <main className="uxu-workspace-viewport">
              {activeSectionId === 'docs-guide' && (
                <ArchitectureDocsView
                  activeTopic={activeSubItemId as DocsTopicId}
                  onTopicChange={(topic) =>
                    handleSidebarSelect('docs-guide', topic)
                  }
                  onSelectComponent={handlePlaygroundComponentSelect}
                  onOpenCommandPalette={() => setCmdPaletteOpen(true)}
                />
              )}

              {activeSectionId === 'dashboard' && (
                <AppleGoogleAppShowcase
                  activeSubView={activeSubItemId as DashboardSubView}
                  onSubViewChange={(sub) =>
                    handleSidebarSelect('dashboard', sub)
                  }
                />
              )}

              {(activeSectionId === 'components-inputs' ||
                activeSectionId === 'components-surfaces' ||
                activeSectionId === 'components-feedback') && (
                <InteractivePlayground
                  selectedComponentId={activeSubItemId}
                  onSelectComponent={handlePlaygroundComponentSelect}
                  onOpenCommandPalette={() => setCmdPaletteOpen(true)}
                />
              )}

              {/* Workspace Footer with NPM Usages & Trunçgil Signature */}
              <footer
                style={{
                  marginTop: 28,
                  paddingTop: 16,
                  borderTop: '1px solid var(--uxu-border-subtle)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  fontSize: '0.78rem',
                  color: 'var(--uxu-text-secondary)',
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
                  <strong style={{ color: 'var(--uxu-text-primary)' }}>uxiGL v2.5.0</strong>
                  <span>•</span>
                  <code
                    style={{
                      padding: '2px 8px',
                      borderRadius: 'var(--uxu-radius-sm)',
                      background: 'var(--uxu-surface-tonal)',
                      border: '1px solid var(--uxu-border-subtle)',
                      fontFamily: 'var(--uxu-font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--uxu-primary)',
                    }}
                  >
                    $ npm i sheetgl filemangl lucide-react
                  </code>
                  <code
                    style={{
                      padding: '2px 8px',
                      borderRadius: 'var(--uxu-radius-sm)',
                      background: 'var(--uxu-surface-tonal)',
                      border: '1px solid var(--uxu-border-subtle)',
                      fontFamily: 'var(--uxu-font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--uxu-text-primary)',
                    }}
                  >
                    $ npx filemangl init
                  </code>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>MIT License • © {new Date().getFullYear()} Crafted with ❤️ by</span>
                  <a
                    href="https://www.truncgil.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '2px 9px',
                      borderRadius: 9999,
                      background:
                        'linear-gradient(135deg, rgba(245, 158, 11, 0.16), rgba(249, 115, 22, 0.16), rgba(244, 63, 94, 0.16))',
                      border: '1px solid rgba(249, 115, 22, 0.4)',
                      color: resolvedMode === 'dark' ? '#fdba74' : '#ea580c',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    🍊 Trunçgil Teknoloji
                  </a>
                </div>
              </footer>
            </main>
          </div>
        </>
      )}

      {/* Spotlight Command Palette Modal (⌘K) */}
      <CommandPalette
        open={cmdPaletteOpen}
        onClose={() => setCmdPaletteOpen(false)}
        actions={commandActions}
      />

      {/* Live Theme Customizer Drawer */}
      <ThemeStudioDrawer
        open={themeDrawerOpen}
        onClose={() => setThemeDrawerOpen(false)}
      />
    </div>
  );
};
