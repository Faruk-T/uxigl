import React from 'react';
import type { CommandPaletteAction } from '../../components/composites';
import { GoogleIcon } from '../../components/primitives';
import type { OSWorkspaceApp, WindowArrangeMode } from './types';

export const OSGL_SHELL_CSS = `
  .macosgl-scroll { scrollbar-width: thin; scrollbar-color: transparent transparent; }
  .macosgl-scroll:hover { scrollbar-color: rgba(148, 163, 184, 0.38) transparent; }
  .macosgl-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
  .macosgl-scroll::-webkit-scrollbar-track { background: transparent; }
  .macosgl-scroll::-webkit-scrollbar-thumb { background: transparent; border-radius: 999px; }
  .macosgl-scroll:hover::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.42); }
  .macosgl-app-btn { outline: none; }
  .macosgl-app-icon-box { transition: transform 0.16s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.16s ease; }
  .macosgl-app-btn:hover .macosgl-app-icon-box { transform: translateY(-3px) scale(1.05); }
  .macosgl-app-btn:active .macosgl-app-icon-box { transform: translateY(0) scale(0.96); }
  .macosgl-resize-handle { opacity: 0.25; transition: opacity 0.15s ease; }
  .macosgl-resize-handle:hover { opacity: 0.75; }
  @keyframes macosglWinOpen {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .macosgl-win-anim-open { animation: macosglWinOpen 0.14s ease-out; }
  .macosgl-win-anim-close { opacity: 0 !important; transition: opacity 0.14s ease-out !important; }
  @keyframes osglWinPulse {
    0%, 100% { opacity: 1; }
    40% { opacity: 0.92; }
  }
  .osgl-win-highlight { animation: osglWinPulse 0.36s ease-out; }
  @keyframes osglMenuPop {
    from { opacity: 0; transform: translateY(-5px) scale(0.985); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  .osgl-menubar-dropdown {
    animation: osglMenuPop 0.15s cubic-bezier(0.22, 1, 0.36, 1);
    transform-origin: top left;
  }
  .osgl-menubar-btn {
    transition: background-color 0.14s ease, color 0.14s ease, transform 0.12s ease;
  }
  .osgl-menubar-btn:hover {
    background-color: var(--osgl-bar-pill-bg) !important;
  }
  .osgl-window-shell:has(.sheetgl-container--fullscreen) { z-index: 3200 !important; }
  .osgl-window-body:has(.sheetgl-container--fullscreen) { z-index: 20 !important; }
  .osgl-window-body:not(:has(.sheetgl-container--fullscreen)) {
    container-type: inline-size;
    container-name: osgl-win;
  }
  .osgl-window-body--expanded div:has(> .sheetgl-container:not(.sheetgl-container--fullscreen)) {
    height: max(420px, calc(var(--osgl-win-body-h, 680px) - 144px)) !important;
    min-height: max(420px, calc(var(--osgl-win-body-h, 680px) - 144px)) !important;
  }
  @container osgl-win (max-width: 650px) {
    .osgl-theme-studio {
      display: flex !important;
      flex-direction: column !important;
      margin: 0 !important;
      min-height: 0 !important;
      overflow: visible !important;
    }
    .osgl-theme-studio-aside {
      flex-direction: row !important;
      align-items: center !important;
      flex-shrink: 0 !important;
      min-height: 46px !important;
      overflow-x: auto !important;
      overflow-y: hidden !important;
      border-right: none !important;
      border-bottom: 1px solid var(--uxu-border-subtle) !important;
      padding: 8px 10px !important;
      gap: 6px !important;
    }
    .osgl-theme-studio-aside > button {
      width: auto !important;
      height: 34px !important;
      flex-shrink: 0 !important;
      padding: 5px 10px !important;
    }
    .osgl-theme-studio-main {
      padding: 14px 14px !important;
    }
  }
  @container osgl-win (max-width: 780px) and (min-width: 541px) {
    .osgl-finder-grid-host {
      grid-template-columns: 184px minmax(0, 1fr) !important;
    }
    .osgl-finder-flex-host > aside {
      width: 184px !important;
      min-width: 184px !important;
    }
  }
  @container osgl-win (max-width: 540px) {
    .osgl-finder-grid-host {
      grid-template-columns: minmax(0, 1fr) !important;
    }
    .osgl-finder-grid-host > aside {
      border-right: none !important;
      border-bottom: 1px solid var(--border) !important;
    }
    .osgl-finder-flex-host {
      flex-direction: column !important;
    }
    .osgl-finder-flex-host > aside {
      width: 100% !important;
      border-right: none !important;
      border-bottom: 1px solid var(--border) !important;
    }
  }
`;

export function buildSpotlightActions(params: {
  allApps: OSWorkspaceApp[];
  openApp: (id: string) => void;
  arrangeWindows: (mode: WindowArrangeMode) => void;
  onSwitchToClassic?: () => void;
}): CommandPaletteAction[] {
  const appActions: CommandPaletteAction[] = params.allApps.map((app) => ({
    id: `os-app-${app.id}`,
    title: app.label,
    subtitle: app.description ?? `${app.category} penceresini aç`,
    category: app.category,
    icon: app.iconNode ?? React.createElement(GoogleIcon, { name: app.googleIcon, size: 18 }),
    onSelect: () => params.openApp(app.id),
  }));

  return [
    ...appActions,
    {
      id: 'os-arrange-side-by-side',
      title: 'Pencereleri Yan Yana Diz (Sol / Sağ)',
      subtitle: 'Açık pencereleri yan yana böler',
      category: 'Pencere Yönetimi',
      onSelect: () => params.arrangeWindows('side-by-side'),
    },
    {
      id: 'os-arrange-quadrants',
      title: 'Pencereleri 4 Köşeye Böl (2×2 Kadran)',
      subtitle: 'Açık pencereleri sol üst, sağ üst, sol alt ve sağ alt 4 parçaya böler',
      category: 'Pencere Yönetimi',
      onSelect: () => params.arrangeWindows('quadrants'),
    },
    {
      id: 'os-arrange-grid',
      title: 'Pencereleri Izgara Diz',
      subtitle: 'Açık pencereleri eşit ızgaraya yerleştirir',
      category: 'Pencere Yönetimi',
      onSelect: () => params.arrangeWindows('grid'),
    },
    ...(params.onSwitchToClassic
      ? [
          {
            id: 'os-switch-classic',
            title: 'Klasik Web Görünümüne Geç',
            subtitle: 'Sol menülü klasik web uygulaması arayüzüne geçer',
            category: 'Görünüm',
            onSelect: params.onSwitchToClassic,
          },
        ]
      : []),
  ];
}
