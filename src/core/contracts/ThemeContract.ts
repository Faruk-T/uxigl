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

export type WebGLShaderPreset =
  | 'aurora-borealis'
  | 'spatial-nebula'
  | 'material-lava'
  | 'cyber-horizon';

export interface SeedPaletteDefinition {
  id: SeedPaletteId;
  name: string;
  inspiration: 'Apple HIG' | 'Google Material You' | 'Hybrid Fusion';
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
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  setSeedPalette: (paletteId: SeedPaletteId) => void;
  setRadiusScale: (scale: RadiusScale) => void;
  setCustomRadiusPx: (px: number) => void;
  setDensity: (density: UIDensity) => void;
  setFontScale: (scale: number) => void;
  setGlassIntensity: (intensity: number) => void;
  setReducedMotion: (reduced: boolean) => void;
  setWebglEnabled: (enabled: boolean) => void;
  setWebglPreset: (preset: WebGLShaderPreset) => void;
  setWebglSpeed: (speed: number) => void;
  setWebglIntensity: (intensity: number) => void;
  resetPreferences: () => void;
}
