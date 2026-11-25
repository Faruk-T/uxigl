import type {
  BorderContrastPreset,
  ConcreteWorkspaceShellId,
  SeedPaletteId,
  SidebarLayoutVariant,
  ThemePreferences,
  UIDensity,
  WorkspaceShellPreset,
} from '../contracts/ThemeContract';

export interface WorkspaceShellPresetSpec {
  id: ConcreteWorkspaceShellId;
  name: string;
  badge: string;
  shortDesc: string;
  demoRoute: string;
  recommended: {
    sidebarVariant?: SidebarLayoutVariant;
    sidebarWidth?: number;
    sidebarStackedWidth?: number;
    density?: UIDensity;
    customRadiusPx?: number;
    borderContrast?: BorderContrastPreset;
    glassIntensity?: number;
    seedPalette?: SeedPaletteId;
  };
}

export const WORKSPACE_SHELL_CATALOG: ReadonlyArray<WorkspaceShellPresetSpec> = [
  {
    id: 'osgl',
    name: 'OSGL',
    badge: 'OS & Yüzen Pencere',
    shortDesc:
      'WebGL Aurora duvar kağıtları, masaüstü simgeleri, alt Dock, canlı widget ve çoklu yüzen pencereler.',
    demoRoute: '/demos/osgl',
    recommended: {
      customRadiusPx: 12,
      glassIntensity: 78,
    },
  },
  {
    id: 'enterprisegl',
    name: 'EnterpriseGL',
    badge: 'Veri Yoğun',
    shortDesc:
      'Açık sol modül ağacı, kompakt satır yoğunluğu, KPI metrik kartları ve tam genişlikli kurumsal yönetim paneli.',
    demoRoute: '/dashboard/overview',
    recommended: {
      sidebarVariant: 'standard',
      sidebarWidth: 256,
      density: 'compact',
      customRadiusPx: 8,
      borderContrast: 'standard',
      glassIntensity: 60,
      seedPalette: 'cupertino-blue',
    },
  },
  {
    id: 'flowgl',
    name: 'FlowGL',
    badge: 'Clean & Ferah UI',
    shortDesc:
      'Daha az çizgi, daha büyük yuvarlatılmış kartlar ve yüksek boşluk oranıyla yormayan sade çalışma arayüzü.',
    demoRoute: '/demos/flow-workspace',
    recommended: {
      sidebarVariant: 'standard',
      sidebarWidth: 244,
      density: 'spacious',
      customRadiusPx: 18,
      borderContrast: 'subtle',
      glassIntensity: 68,
      seedPalette: 'cupertino-blue',
    },
  },
  {
    id: 'tesseragl',
    name: 'TesseraGL',
    badge: 'İkon Rayı & Ağaç',
    shortDesc:
      'Sol dar ikon rayı + seçili grubun modül ağacı, merkez ⌘K arama barı ve çok sütunlu çalışma alanı.',
    demoRoute: '/demos/tessera',
    recommended: {
      sidebarVariant: 'dual-column',
      sidebarWidth: 276,
      density: 'comfortable',
      customRadiusPx: 8,
      borderContrast: 'standard',
      glassIntensity: 55,
      seedPalette: 'graphite-mono',
    },
  },
  {
    id: 'cargogl',
    name: 'CargoGL',
    badge: 'Operasyon & Akış',
    shortDesc:
      'Dikey ikon şeridi, üst çubukta hızlı renk noktaları + arama ve operasyonel takip için dengeli kart düzeni.',
    demoRoute: '/demos/cargogl',
    recommended: {
      sidebarVariant: 'stacked-vertical',
      sidebarStackedWidth: 96,
      density: 'comfortable',
      customRadiusPx: 14,
      borderContrast: 'subtle',
      glassIntensity: 72,
      seedPalette: 'emerald-mint',
    },
  },
  {
    id: 'synthgl',
    name: 'SynthGL',
    badge: 'Modern Stüdyo',
    shortDesc:
      'Kapalı kompakt ikon rayı, açılır kategori menüsü ve yüksek cam derinlikli modern stüdyo arayüzü.',
    demoRoute: '/demos/synthgl',
    recommended: {
      sidebarVariant: 'mini-rail',
      density: 'comfortable',
      customRadiusPx: 16,
      borderContrast: 'subtle',
      glassIntensity: 88,
      seedPalette: 'material-violet',
    },
  },
];

export function normalizeConcreteShellId(
  preset: WorkspaceShellPreset | undefined,
  roleDefault: ConcreteWorkspaceShellId = 'enterprisegl'
): ConcreteWorkspaceShellId {
  if (!preset || preset === 'auto') return roleDefault;
  if (preset === 'classic') return 'enterprisegl';
  const exists = WORKSPACE_SHELL_CATALOG.some((s) => s.id === preset);
  return exists ? preset : roleDefault;
}

export function getWorkspaceShellSpec(
  shellId: ConcreteWorkspaceShellId
): WorkspaceShellPresetSpec {
  return (
    WORKSPACE_SHELL_CATALOG.find((s) => s.id === shellId) ?? WORKSPACE_SHELL_CATALOG[1]
  );
}

export function applyWorkspaceShellPresetToPreferences(
  prev: ThemePreferences,
  nextShell: WorkspaceShellPreset
): ThemePreferences {
  if (nextShell === 'auto') {
    return { ...prev, workspaceShell: 'auto' };
  }
  const concreteId = normalizeConcreteShellId(nextShell, 'enterprisegl');
  const spec = getWorkspaceShellSpec(concreteId);
  const rec = spec.recommended;
  const hasLockedCustomBrand = Boolean(prev.customPrimaryHex || prev.tenantBrandHex);

  return {
    ...prev,
    workspaceShell: concreteId,
    ...(rec.sidebarVariant ? { sidebarVariant: rec.sidebarVariant } : {}),
    ...(typeof rec.sidebarWidth === 'number' ? { sidebarWidth: rec.sidebarWidth } : {}),
    ...(typeof rec.sidebarStackedWidth === 'number'
      ? { sidebarStackedWidth: rec.sidebarStackedWidth }
      : {}),
    ...(rec.density ? { density: rec.density } : {}),
    ...(typeof rec.customRadiusPx === 'number' ? { customRadiusPx: rec.customRadiusPx } : {}),
    ...(rec.borderContrast ? { borderContrast: rec.borderContrast } : {}),
    ...(typeof rec.glassIntensity === 'number' ? { glassIntensity: rec.glassIntensity } : {}),
    ...(!hasLockedCustomBrand && rec.seedPalette ? { seedPalette: rec.seedPalette } : {}),
  };
}
