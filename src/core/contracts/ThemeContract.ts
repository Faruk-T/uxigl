/**
 * ============================================================================
 * uxiGL DESIGN SYSTEM — THEME & OPTIONAL WEBGL CONTRACTS (DIP & OCP)
 * ============================================================================
 */

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedThemeMode = 'light' | 'dark';

export type BuiltinSeedPaletteId =
  | 'cupertino-blue'
  | 'material-violet'
  | 'emerald-mint'
  | 'sunset-coral'
  | 'amber-gold'
  | 'graphite-mono';

/** Built-in palette IDs plus extensible custom brand palette IDs via `extraPalettes` */
export type SeedPaletteId = BuiltinSeedPaletteId | (string & {});

export type RadiusScale = 'sharp' | 'squircle' | 'pill';
export type UIDensity = 'compact' | 'comfortable' | 'spacious';
export type BorderContrastPreset = 'none' | 'subtle' | 'standard' | 'strong' | 'crisp';

export type FontFamilyPreset =
  | 'inter-jakarta'
  | 'outfit-material'
  | 'manrope'
  | 'sora'
  | 'dm-sans'
  | 'space-grotesk'
  | 'poppins-ui'
  | 'playfair-editorial'
  | 'jetbrains-mono'
  | 'system-sf';

export type GoogleIconStyle = 'rounded' | 'outlined' | 'sharp';

export type SidebarLayoutVariant =
  | 'standard'
  | 'mini-rail'
  | 'stacked-vertical'
  | 'dual-column'
  | 'drawer';

/** Concrete uxiGL workspace shell skins */
export type ConcreteWorkspaceShellId =
  | 'osgl'
  | 'enterprisegl'
  | 'flowgl'
  | 'tesseragl'
  | 'cargogl'
  | 'synthgl';

/** Pluggable multi-shell workspace skin ('auto' picks host default; 'classic' aliases 'enterprisegl') */
export type WorkspaceShellPreset = 'auto' | ConcreteWorkspaceShellId | 'classic';

export interface FontFamilyPresetDefinition {
  id: FontFamilyPreset;
  name: string;
  badge: string;
  description: string;
  sansStack: string;
  displayStack: string;
  monoStack: string;
}

export type WebGLShaderPreset =
  | 'aurora-borealis'
  | 'spatial-nebula'
  | 'material-lava'
  | 'cyber-horizon';

export interface SeedPaletteModeTokens {
  primary: string;
  primaryHover: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  accentGlow: string;
  /** Tonal surface & background inheritance tokens (Material You × Liquid Glass) */
  bgCanvas: string;
  bgElevated: string;
  surfaceGlass: string;
  surfaceGlassHover: string;
  surfaceTonal: string;
  surfaceTonalHigh: string;
  surfaceElevated: string;
  borderSubtle: string;
  borderStrong: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
}

export interface SeedPaletteDefinition {
  id: SeedPaletteId;
  name: string;
  inspiration: 'Liquid Glass' | 'Google Material You' | 'Dynamic Tonal' | 'Hybrid Fusion';
  description: string;
  auroraColors: {
    colorA: [number, number, number];
    colorB: [number, number, number];
    colorC: [number, number, number];
  };
  light: SeedPaletteModeTokens;
  dark: SeedPaletteModeTokens;
}

export interface ThemePreferences {
  mode: ThemeMode;
  seedPalette: SeedPaletteId;
  /** Optional custom brand primary HEX color (e.g. '#6366F1') that dynamically overrides the seed palette */
  customPrimaryHex?: string;
  radiusScale: RadiusScale;
  /** Exact base border-radius in pixels (0 to 32, default 12) */
  customRadiusPx?: number;
  /** Border line visibility & contrast preset across cards, inputs, sidebar and tables */
  borderContrast?: BorderContrastPreset;
  /** Border stroke width in pixels (0 to 2.5, default 1) */
  borderWidthPx?: number;
  density: UIDensity;
  /** Global font scale percentage (80 to 125, default 100) */
  fontScale: number;
  /** Google Fonts typography preset (default 'inter-jakarta') */
  fontFamilyPreset?: FontFamilyPreset;
  /** Google Material Symbols variable icon style ('rounded' | 'outlined' | 'sharp') */
  iconStyle?: GoogleIconStyle;
  /** Google Material Symbols variable FILL axis (false = 0, true = 1) */
  iconFilled?: boolean;
  /** Google Material Symbols variable weight axis (100 to 700, default 400) */
  iconWeight?: number;
  /** Sidebar width in pixels (180 to 420, default 256) controlling CSS variable --uxu-sidebar-width */
  sidebarWidth?: number;
  /** Stacked vertical sidebar width in pixels (80 to 180, default 108) controlling CSS variable --uxu-sidebar-stacked-width */
  sidebarStackedWidth?: number;
  /** Per-user persisted sidebar navigation layout variant */
  sidebarVariant?: SidebarLayoutVariant;
  /** Per-user persisted workspace shell skin */
  workspaceShell?: WorkspaceShellPreset;
  /** Per-user persisted sidebar active indicator glow color */
  sidebarAccent?: string;
  glassIntensity: number; // 0 to 100
  reducedMotion: boolean;
  /** WebGL shader is strictly OPTIONAL and OFF by default to save system resources */
  webglEnabled: boolean;
  webglPreset: WebGLShaderPreset;
  webglSpeed: number; // 0 to 200
  webglIntensity: number; // 0 to 100
  /**
   * Optional tenant/organization brand color. When set, overrides seed palette primary tones.
   * Selecting a seed palette clears this field.
   */
  tenantBrandHex?: string | null;
}

/**
 * [OCP] Plugin hook deriving additional CSS custom properties from a tenant brand HEX color.
 */
export type BrandTokenResolver = (
  brandHex: string,
  resolvedMode: ResolvedThemeMode
) => Record<string, string>;

/** [DIP] Abstraction for persisting user theme preferences */
export interface IThemeStorageAdapter {
  loadPreferences(userScopeKey?: string): ThemePreferences | null;
  savePreferences(prefs: ThemePreferences, userScopeKey?: string): void;
  clearPreferences(userScopeKey?: string): void;
}

/** [DIP] Abstraction for applying resolved theme tokens to the host environment */
export interface IThemeEngine {
  applyTheme(prefs: ThemePreferences, resolvedMode: ResolvedThemeMode): void;
}

export interface ThemeContextContract {
  preferences: ThemePreferences;
  resolvedMode: ResolvedThemeMode;
  activePalette: SeedPaletteDefinition;
  availablePalettes: SeedPaletteDefinition[];
  availableFontPresets: FontFamilyPresetDefinition[];
  userScopeKey?: string;
  setUserScopeKey: (scopeKey?: string) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  setSeedPalette: (paletteId: SeedPaletteId) => void;
  setCustomPrimaryHex: (hex?: string) => void;
  setTenantBrandHex: (hex: string | null) => void;
  setRadiusScale: (scale: RadiusScale) => void;
  setCustomRadiusPx: (px: number) => void;
  setBorderContrast: (contrast: BorderContrastPreset) => void;
  setBorderWidthPx: (px: number) => void;
  setDensity: (density: UIDensity) => void;
  setFontScale: (scale: number) => void;
  setFontFamilyPreset: (preset: FontFamilyPreset) => void;
  setIconStyle: (style: GoogleIconStyle) => void;
  setIconFilled: (filled: boolean) => void;
  setIconWeight: (weight: number) => void;
  setGlassIntensity: (intensity: number) => void;
  setSidebarWidth: (width: number) => void;
  setSidebarStackedWidth: (width: number) => void;
  setSidebarVariant: (variant: SidebarLayoutVariant) => void;
  setWorkspaceShell: (shell: WorkspaceShellPreset) => void;
  setSidebarAccent: (accent?: string) => void;
  setReducedMotion: (reduced: boolean) => void;
  setWebglEnabled: (enabled: boolean) => void;
  setWebglPreset: (preset: WebGLShaderPreset) => void;
  setWebglSpeed: (speed: number) => void;
  setWebglIntensity: (intensity: number) => void;
  resetPreferences: () => void;
}
