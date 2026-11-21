import type { OSWallpaperId } from '../OSGLEngine';

export type IconBgStyle = 'vivid' | 'gradient' | 'soft' | 'glass' | 'sun' | 'mono';
export type BgMode = 'aurora' | 'gradient' | 'solid' | 'image';
export type QualityMode = 'quality' | 'performance';

export interface EnterpriseOSApp {
  id: string;
  label: string;
  shortLabel: string;
  googleIcon: string;
  badge?: string;
  category: 'Dashboard' | 'Commerce' | 'Components' | 'Pages' | 'Apps';
  gradient: string;
}

export interface FloatingWindowState {
  id: string;
  appId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
}

export const OSGL_STATE_KEY = 'uxu.macosgl.state.v1';

export interface WindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PersistedOSGLState {
  locale?: 'tr' | 'en';
  wallpaper?: OSWallpaperId;
  bgMode?: BgMode;
  solidBgColor?: string;
  bgGradColor1?: string;
  bgGradColor2?: string;
  customBgUrl?: string;
  uploadedBgDataUrl?: string;
  qualityMode?: QualityMode;
  dockVisible?: boolean;
  windowAnimation?: boolean;
  iconBgStyle?: IconBgStyle;
  iconBgColor?: string;
  iconGradColor1?: string;
  iconGradColor2?: string;
  iconColor?: string;
  iconSizePx?: number;
  iconSlots?: Record<string, number>;
  windows?: FloatingWindowState[];
  windowBoundsByApp?: Record<string, WindowBounds>;
  topZ?: number;
}

export function loadOSGLState(): PersistedOSGLState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(OSGL_STATE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedOSGLState;
  } catch {
    return null;
  }
}

export function resolveIconSurface(
  app: EnterpriseOSApp,
  style: IconBgStyle,
  primaryColor: string,
  isDark: boolean,
  customIconColor?: string,
  customBgColor?: string,
  gradColor1?: string,
  gradColor2?: string
): { background: string; color: string; border?: string; backdropFilter?: string } {
  const override = customIconColor?.trim() || undefined;
  const monoBg = customBgColor?.trim() || primaryColor;
  const g1 = gradColor1?.trim() || '#3b82f6';
  const g2 = gradColor2?.trim() || '#ec4899';

  switch (style) {
    case 'gradient':
      return {
        background: `linear-gradient(135deg, ${g1}, ${g2})`,
        color: override ?? '#ffffff',
      };
    case 'soft':
      return {
        background: `color-mix(in srgb, ${monoBg} 18%, ${isDark ? '#1e293b' : '#ffffff'})`,
        color: override ?? (isDark ? '#f8fafc' : monoBg),
        border: `1px solid color-mix(in srgb, ${monoBg} 32%, transparent)`,
      };
    case 'glass':
      return {
        background: isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(255, 255, 255, 0.48)',
        color: override ?? (isDark ? '#ffffff' : '#0f172a'),
        border: isDark ? '1px solid rgba(255, 255, 255, 0.28)' : '1px solid rgba(255, 255, 255, 0.72)',
        backdropFilter: 'blur(14px) saturate(160%)',
      };
    case 'sun':
      return {
        background:
          'linear-gradient(135deg, rgba(251, 191, 36, 0.92), rgba(249, 115, 22, 0.9), rgba(244, 63, 94, 0.88))',
        color: override ?? '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.36)',
      };
    case 'mono':
      return {
        background: monoBg,
        color: override ?? '#ffffff',
      };
    case 'vivid':
    default:
      return {
        background: app.gradient,
        color: override ?? '#ffffff',
      };
  }
}

export const ENTERPRISE_APPS: EnterpriseOSApp[] = [
  { id: 'overview', label: 'Dashboard', shortLabel: 'Dashboard', googleIcon: 'dashboard', category: 'Dashboard', gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
  { id: 'analytics', label: 'Analytics', shortLabel: 'Analytics', googleIcon: 'trending_up', category: 'Dashboard', gradient: 'linear-gradient(135deg, #0ea5e9, #0369a1)' },
  { id: 'analytics-telemetry', label: 'SheetGL Telemetry', shortLabel: 'Telemetry', googleIcon: 'query_stats', category: 'Dashboard', gradient: 'linear-gradient(135deg, #6366f1, #4338ca)' },
  { id: 'reports', label: 'Reports', shortLabel: 'Reports', googleIcon: 'bar_chart', badge: '2', category: 'Dashboard', gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' },
  { id: 'users', label: 'Users', shortLabel: 'Users', googleIcon: 'group', badge: '8', category: 'Commerce', gradient: 'linear-gradient(135deg, #14b8a6, #0f766e)' },
  { id: 'products', label: 'Products', shortLabel: 'Products', googleIcon: 'inventory_2', category: 'Commerce', gradient: 'linear-gradient(135deg, #f59e0b, #b45309)' },
  { id: 'crm-orders', label: 'Orders', shortLabel: 'Orders', googleIcon: 'receipt_long', badge: '12', category: 'Commerce', gradient: 'linear-gradient(135deg, #10b981, #047857)' },
  { id: 'forms', label: 'Forms', shortLabel: 'Forms', googleIcon: 'description', badge: '4', category: 'Components', gradient: 'linear-gradient(135deg, #22c55e, #15803d)' },
  { id: 'elements-overview', label: 'UI Components', shortLabel: 'Components', googleIcon: 'category', category: 'Components', gradient: 'linear-gradient(135deg, #ec4899, #be185d)' },
  { id: 'datatable-statcard', label: 'SheetGL Grid', shortLabel: 'SheetGL', googleIcon: 'table_chart', category: 'Components', gradient: 'linear-gradient(135deg, #0284c7, #075985)' },
  { id: 'filemangl-explorer', label: 'FileManGL', shortLabel: 'FileManGL', googleIcon: 'folder_open', category: 'Components', gradient: 'linear-gradient(135deg, #06b6d4, #0e7490)' },
  { id: 'page-login', label: 'Login', shortLabel: 'Login', googleIcon: 'lock', category: 'Pages', gradient: 'linear-gradient(135deg, #64748b, #334155)' },
  { id: 'page-register', label: 'Register', shortLabel: 'Register', googleIcon: 'verified_user', category: 'Pages', gradient: 'linear-gradient(135deg, #10b981, #065f46)' },
  { id: 'page-pricing', label: 'Pricing', shortLabel: 'Pricing', googleIcon: 'sell', category: 'Pages', gradient: 'linear-gradient(135deg, #f97316, #c2410c)' },
  { id: 'page-profile', label: 'Profile', shortLabel: 'Profile', googleIcon: 'person', category: 'Pages', gradient: 'linear-gradient(135deg, #a855f7, #7e22ce)' },
  { id: 'page-invoice', label: 'Invoice', shortLabel: 'Invoice', googleIcon: 'receipt', badge: '5', category: 'Pages', gradient: 'linear-gradient(135deg, #eab308, #a16207)' },
  { id: 'page-kanban', label: 'Kanban', shortLabel: 'Kanban', googleIcon: 'view_kanban', badge: '6', category: 'Pages', gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)' },
  { id: 'page-status', label: 'Status', shortLabel: 'Status', googleIcon: 'dns', category: 'Pages', gradient: 'linear-gradient(135deg, #f43f5e, #be123c)' },
  { id: 'messages', label: 'Messages', shortLabel: 'Messages', googleIcon: 'chat', badge: '3', category: 'Apps', gradient: 'linear-gradient(135deg, #38bdf8, #0284c7)' },
  { id: 'calendar', label: 'Calendar', shortLabel: 'Calendar', googleIcon: 'calendar_month', badge: '2', category: 'Apps', gradient: 'linear-gradient(135deg, #fb7185, #e11d48)' },
  { id: 'file-manager', label: 'Files', shortLabel: 'Files', googleIcon: 'folder', category: 'Apps', gradient: 'linear-gradient(135deg, #2563eb, #1e40af)' },
  { id: 'settings', label: 'Settings', shortLabel: 'Settings', googleIcon: 'settings', category: 'Apps', gradient: 'linear-gradient(135deg, #475569, #1e293b)' },
  { id: 'security', label: 'Security', shortLabel: 'Security', googleIcon: 'shield', badge: '1', category: 'Apps', gradient: 'linear-gradient(135deg, #0d9488, #115e59)' },
  { id: 'docs', label: 'Dokümantasyon', shortLabel: 'Docs', googleIcon: 'menu_book', category: 'Apps', gradient: 'linear-gradient(135deg, #0ea5e9, #2563eb)' },
  { id: 'os-theme-studio', label: 'OS Tema Stüdyosu', shortLabel: 'Tema', googleIcon: 'palette', category: 'Apps', gradient: 'linear-gradient(135deg, #d946ef, #7c3aed)' },
];

export const DOCK_APP_IDS = [
  'overview',
  'analytics-telemetry',
  'filemangl-explorer',
  'crm-orders',
  'page-kanban',
  'messages',
  'settings',
  'os-theme-studio',
];

