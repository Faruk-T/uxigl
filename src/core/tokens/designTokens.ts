import type {
  SeedPaletteDefinition,
  SeedPaletteId,
  ThemePreferences,
  RadiusScale,
  UIDensity,
} from '../contracts/ThemeContract';

/**
 * ============================================================================
 * UXU DESIGN SYSTEM — APPLE HIG × GOOGLE MATERIAL YOU DESIGN TOKENS
 * ============================================================================
 */

export const DEFAULT_THEME_PREFERENCES: ThemePreferences = {
  mode: 'dark',
  seedPalette: 'cupertino-blue',
  radiusScale: 'squircle',
  customRadiusPx: 12,
  density: 'comfortable',
  fontScale: 100, // 100% = crisp 14px base UI font, adjustable 80% - 125%
  glassIntensity: 82,
  reducedMotion: false,
  webglEnabled: false, // Strictly optional & disabled by default for zero idle GPU load
  webglPreset: 'aurora-borealis',
  webglSpeed: 60,
  webglIntensity: 38,
};

export const SEED_PALETTES: Record<SeedPaletteId, SeedPaletteDefinition> = {
  'cupertino-blue': {
    id: 'cupertino-blue',
    name: 'Cupertino Blue',
    inspiration: 'Apple HIG',
    description: 'Safir mavi ve turkuaz.',
    auroraColors: {
      colorA: [0.04, 0.88, 0.72], // Arctic Aurora Emerald-Cyan
      colorB: [0.16, 0.56, 1.0],  // Cupertino Electric Sapphire
      colorC: [0.58, 0.24, 0.98], // Deep Cosmic Violet
    },
    light: {
      primary: '#0066CC',
      primaryHover: '#0052A3',
      primaryContainer: 'rgba(220, 238, 255, 0.78)',
      onPrimaryContainer: '#002855',
      secondary: '#5856D6',
      accentGlow: 'rgba(0, 102, 204, 0.28)',
    },
    dark: {
      primary: '#2997FF',
      primaryHover: '#52ADFF',
      primaryContainer: 'rgba(13, 43, 78, 0.72)',
      onPrimaryContainer: '#B8DFFF',
      secondary: '#7D7AFF',
      accentGlow: 'rgba(41, 151, 255, 0.38)',
    },
  },
  'material-violet': {
    id: 'material-violet',
    name: 'Material Iris',
    inspiration: 'Google Material You',
    description: 'Lavanta ve kozmik mor.',
    auroraColors: {
      colorA: [0.68, 0.38, 1.0],  // Iris Violet
      colorB: [0.96, 0.26, 0.68], // Neon Magenta Ribbon
      colorC: [0.22, 0.68, 0.98], // Cyan Horizon
    },
    light: {
      primary: '#6750A4',
      primaryHover: '#543E8E',
      primaryContainer: 'rgba(234, 221, 255, 0.78)',
      onPrimaryContainer: '#21005D',
      secondary: '#7D5260',
      accentGlow: 'rgba(103, 80, 164, 0.28)',
    },
    dark: {
      primary: '#D0BCFF',
      primaryHover: '#E2D4FF',
      primaryContainer: 'rgba(56, 30, 114, 0.72)',
      onPrimaryContainer: '#EADDFF',
      secondary: '#EFB8C8',
      accentGlow: 'rgba(208, 188, 255, 0.36)',
    },
  },
  'emerald-mint': {
    id: 'emerald-mint',
    name: 'Emerald Mint',
    inspiration: 'Hybrid Fusion',
    description: 'Zümrüt yeşili ve okyanus.',
    auroraColors: {
      colorA: [0.06, 0.94, 0.56], // Pure Northern Lights Green
      colorB: [0.05, 0.76, 0.88], // Glacial Teal
      colorC: [0.46, 0.32, 0.96], // Upper Atmosphere Indigo
    },
    light: {
      primary: '#059669',
      primaryHover: '#047857',
      primaryContainer: 'rgba(209, 250, 229, 0.78)',
      onPrimaryContainer: '#064E3B',
      secondary: '#0D9488',
      accentGlow: 'rgba(5, 150, 105, 0.28)',
    },
    dark: {
      primary: '#34D399',
      primaryHover: '#6EE7B7',
      primaryContainer: 'rgba(6, 78, 59, 0.72)',
      onPrimaryContainer: '#A7F3D0',
      secondary: '#2DD4BF',
      accentGlow: 'rgba(52, 211, 153, 0.38)',
    },
  },
  'sunset-coral': {
    id: 'sunset-coral',
    name: 'Solar Coral',
    inspiration: 'Apple HIG',
    description: 'Mercan kızılı ve turuncu.',
    auroraColors: {
      colorA: [0.98, 0.24, 0.44], // Crimson Aurora
      colorB: [0.98, 0.52, 0.18], // Solar Flare Orange
      colorC: [0.68, 0.22, 0.88], // Twilight Purple
    },
    light: {
      primary: '#E11D48',
      primaryHover: '#BE123C',
      primaryContainer: 'rgba(255, 228, 230, 0.78)',
      onPrimaryContainer: '#881337',
      secondary: '#F97316',
      accentGlow: 'rgba(225, 29, 72, 0.28)',
    },
    dark: {
      primary: '#FB7185',
      primaryHover: '#FDA4AF',
      primaryContainer: 'rgba(76, 5, 25, 0.72)',
      onPrimaryContainer: '#FFE4E6',
      secondary: '#FB923C',
      accentGlow: 'rgba(251, 113, 133, 0.38)',
    },
  },
  'amber-gold': {
    id: 'amber-gold',
    name: 'Amber Gold',
    inspiration: 'Google Material You',
    description: 'Kehribar sarısı ve altın.',
    auroraColors: {
      colorA: [0.98, 0.75, 0.14], // Golden Ray
      colorB: [0.96, 0.38, 0.22], // Warm Terracotta
      colorC: [0.12, 0.78, 0.68], // Turquoise Contrast
    },
    light: {
      primary: '#D97706',
      primaryHover: '#B45309',
      primaryContainer: 'rgba(254, 243, 199, 0.78)',
      onPrimaryContainer: '#78350F',
      secondary: '#EA580C',
      accentGlow: 'rgba(217, 119, 6, 0.28)',
    },
    dark: {
      primary: '#FBBF24',
      primaryHover: '#FCD34D',
      primaryContainer: 'rgba(69, 26, 3, 0.72)',
      onPrimaryContainer: '#FDE68A',
      secondary: '#FB923C',
      accentGlow: 'rgba(251, 191, 36, 0.36)',
    },
  },
  'graphite-mono': {
    id: 'graphite-mono',
    name: 'Titanium Mono',
    inspiration: 'Hybrid Fusion',
    description: 'Titanyum gri ve gümüş.',
    auroraColors: {
      colorA: [0.62, 0.78, 0.96], // Ice Silver Blue
      colorB: [0.42, 0.56, 0.78], // Brushed Titanium
      colorC: [0.24, 0.82, 0.78], // Subtle Glacial Cyan
    },
    light: {
      primary: '#18181B',
      primaryHover: '#27272A',
      primaryContainer: 'rgba(228, 228, 231, 0.78)',
      onPrimaryContainer: '#09090B',
      secondary: '#52525B',
      accentGlow: 'rgba(24, 24, 27, 0.2)',
    },
    dark: {
      primary: '#F4F4F5',
      primaryHover: '#FFFFFF',
      primaryContainer: 'rgba(39, 39, 42, 0.72)',
      onPrimaryContainer: '#FAFAFA',
      secondary: '#A1A1AA',
      accentGlow: 'rgba(244, 244, 245, 0.3)',
    },
  },
};

export const RADIUS_SCALE_TOKENS: Record<
  RadiusScale,
  { sm: string; md: string; lg: string; xl: string; full: string }
> = {
  sharp: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    full: '9999px',
  },
  squircle: {
    sm: '8px',
    md: '12px',
    lg: '18px',
    xl: '24px',
    full: '9999px',
  },
  pill: {
    sm: '12px',
    md: '18px',
    lg: '26px',
    xl: '34px',
    full: '9999px',
  },
};

export const DENSITY_SCALE_TOKENS: Record<
  UIDensity,
  { spacingUnit: string; controlHeightMd: string; cardPadding: string; fontSizeScale: string }
> = {
  compact: {
    spacingUnit: '0.85',
    controlHeightMd: '34px',
    cardPadding: '16px',
    fontSizeScale: '0.95',
  },
  comfortable: {
    spacingUnit: '1',
    controlHeightMd: '40px',
    cardPadding: '22px',
    fontSizeScale: '1',
  },
  spacious: {
    spacingUnit: '1.15',
    controlHeightMd: '46px',
    cardPadding: '28px',
    fontSizeScale: '1.03',
  },
};
