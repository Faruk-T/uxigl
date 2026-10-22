/**
 * ============================================================================
 * UXU DESIGN SYSTEM — THEME & OPTIONAL WEBGL CONTRACTS (DIP & OCP)
 * ============================================================================
 */

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedThemeMode = 'light' | 'dark';

export type SeedPaletteId =
  | 'cupertino-blue'
  | 'material-violet'
  | 'emerald-mint'
  | 'sunset-coral'
  | 'amber-gold'
  | 'graphite-mono';

export type RadiusScale = 'sharp' | 'squircle' | 'pill';
export type UIDensity = 'compact' | 'comfortable' | 'spacious';

export type FontFamilyPreset =
  | 'inter-jakarta'
  | 'outfit-material'
  | 'dm-sans'
  | 'space-grotesk'
  | 'system-sf';

export type GoogleIconStyle = 'rounded' | 'outlined' | 'sharp';

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

export interface SeedPaletteDefinition {
  id: SeedPaletteId;
  name: string;
  inspiration: 'Liquid Glass' | 'Google Material You' | 'Hybrid Fusion';
  description: string;
  auroraColors: {
    colorA: [number, number, number];
    colorB: [number, number, number];
    colorC: [number, number, number];
  };
  light: {
    primary: string;
    primaryHover: string;
    primaryContainer: string;
    onPrimaryContainer: string;
    secondary: string;
    accentGlow: string;
  };
  dark: {
    primary: string;
    primaryHover: string;
    primaryContainer: string;
    onPrimaryContainer: string;
    secondary: string;
    accentGlow: string;
  };
}

export interface ThemePreferences {
  mode: ThemeMode;
  seedPalette: SeedPaletteId;
  radiusScale: RadiusScale;
  /** Exact base border-radius in pixels (0 to 32, default 12) */
  customRadiusPx?: number;
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
  glassIntensity: number; // 0 to 100
  reducedMotion: boolean;
  /** WebGL shader is strictly OPTIONAL and OFF by default to save system resources */
  webglEnabled: boolean;
  webglPreset: WebGLShaderPreset;
  webglSpeed: number; // 0 to 200
  webglIntensity: number; // 0 to 100
}

/** [DIP] Abstraction for persisting user theme preferences */
export interface IThemeStorageAdapter {
  loadPreferences(): ThemePreferences | null;
  savePreferences(prefs: ThemePreferences): void;
  clearPreferences(): void;
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
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  setSeedPalette: (paletteId: SeedPaletteId) => void;
  setRadiusScale: (scale: RadiusScale) => void;
  setCustomRadiusPx: (px: number) => void;
  setDensity: (density: UIDensity) => void;
  setFontScale: (scale: number) => void;
  setFontFamilyPreset: (preset: FontFamilyPreset) => void;
  setIconStyle: (style: GoogleIconStyle) => void;
  setIconFilled: (filled: boolean) => void;
  setIconWeight: (weight: number) => void;
  setGlassIntensity: (intensity: number) => void;
  setReducedMotion: (reduced: boolean) => void;
  setWebglEnabled: (enabled: boolean) => void;
  setWebglPreset: (preset: WebGLShaderPreset) => void;
  setWebglSpeed: (speed: number) => void;
  setWebglIntensity: (intensity: number) => void;
  resetPreferences: () => void;
}
