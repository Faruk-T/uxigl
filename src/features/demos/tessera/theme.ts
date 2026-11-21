import type { ResolvedThemeMode } from '../../../core/contracts/ThemeContract';
import type { TesseraThemeTokens } from './types';

/**
 * ============================================================================
 * TESSERA GL — EXACT TYPOGRAPHY, 4PT/8PT SPACING SCALE & SURFACE TOKENS
 * ============================================================================
 * Reference font: Inter (with cv02/cv03/cv04/cv11 alternates & tabular numerals)
 */

export const TESSERA_TYPOGRAPHY = {
  fontFamily:
    "var(--uxu-font-sans, 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif)",
  fontFeatureSettings: "'cv02', 'cv03', 'cv04', 'cv11'",
  scale: {
    heroMetric: {
      fontSize: 30,
      fontWeight: 600,
      lineHeight: 1.08,
      letterSpacing: '-0.03em',
    },
    profileName: {
      fontSize: 17,
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: '-0.02em',
    },
    sectionTitle: {
      fontSize: 14.5,
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.015em',
    },
    cardTitle: {
      fontSize: 14.5,
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.015em',
    },
    body: {
      fontSize: 13,
      fontWeight: 400,
      lineHeight: 1.45,
      letterSpacing: '-0.005em',
    },
    navItem: {
      fontSize: 13,
      fontWeight: 500,
      lineHeight: 1.35,
      letterSpacing: '-0.005em',
    },
    caption: {
      fontSize: 12,
      fontWeight: 400,
      lineHeight: 1.35,
      letterSpacing: '0em',
    },
    microLabel: {
      fontSize: 10.5,
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '0.055em',
    },
  },
} as const;

/**
 * Pixel-calibrated spacing levels measured directly from the reference layout.
 * All insets, gaps, and radii strictly map to a cohesive 4px / 8px spatial rhythm.
 */
export const TESSERA_SPACING = {
  railWidth: 56,
  railPaddingY: 12,
  railItemSize: 34,
  railGap: 6,

  sidebarWidth: 224,
  sidebarPadding: '14px 12px',
  sidebarSectionGap: 16,
  sidebarItemHeight: 32,
  sidebarItemPadding: '6px 10px',

  topBarHeight: 52,
  topBarPaddingX: 20,

  subHeaderHeight: 46,
  tabBarHeight: 40,
  workspaceHeaderPaddingX: 22,
  workspaceBodyPadding: '18px 22px 24px',
  workspaceSectionGap: 18,
  gridGap: 14,
  cardPadding: 16,
  cardRadius: 12,

  rightPanelWidth: 320,
  rightPanelPadding: 16,
  tilePadding: '10px 12px',
  tileRadius: 10,
} as const;

export function resolveTesseraThemeTokens(
  mode: ResolvedThemeMode
): TesseraThemeTokens {
  if (mode === 'dark') {
    return {
      mode: 'dark',
      railBg: '#0B0E14',
      panelBg: '#0F131B',
      sidebarBg: '#0F131B',
      cardBg: '#141923',
      surfaceSubtle: '#171D29',
      surfaceHover: 'rgba(255, 255, 255, 0.05)',
      surfaceActive: '#1E2636',
      borderSubtle: 'rgba(255, 255, 255, 0.08)',
      borderCard: 'rgba(255, 255, 255, 0.09)',
      borderControl: 'rgba(255, 255, 255, 0.12)',
      textPrimary: '#F3F4F6',
      textSecondary: '#CBD5E1',
      textMuted: '#94A3B8',
      textSubtle: '#64748B',
      accentBlue: '#3B82F6',
      accentBlueSoft: 'rgba(59, 130, 246, 0.16)',
      ctaDarkBg: '#F8FAFC',
      ctaDarkText: '#0F172A',
      hatchStripe: 'rgba(255, 255, 255, 0.065)',
      dotPattern: 'rgba(255, 255, 255, 0.08)',
      bannerGradient:
        'radial-gradient(circle at 12% 28%, rgba(251, 146, 60, 0.42) 0%, transparent 52%), radial-gradient(circle at 48% 22%, rgba(96, 165, 250, 0.45) 0%, transparent 58%), radial-gradient(circle at 86% 24%, rgba(232, 121, 249, 0.42) 0%, transparent 54%), linear-gradient(180deg, rgba(30, 41, 59, 0.9) 0%, #0F131B 100%)',
      recapGradient:
        'radial-gradient(circle at 92% 16%, rgba(99, 102, 241, 0.34) 0%, rgba(168, 85, 247, 0.16) 40%, transparent 72%), #151B26',
      cardShadow: '0 1px 2px rgba(0, 0, 0, 0.25)',
      popoverShadow: '0 14px 34px rgba(0, 0, 0, 0.48)',
    };
  }

  return {
    mode: 'light',
    railBg: '#F7F8FA',
    panelBg: '#FFFFFF',
    sidebarBg: '#FFFFFF',
    cardBg: '#FFFFFF',
    surfaceSubtle: '#F6F7F8',
    surfaceHover: '#F3F4F6',
    surfaceActive: '#F1F3F5',
    borderSubtle: '#ECEEF2',
    borderCard: '#E6E8EC',
    borderControl: '#E2E4E9',
    textPrimary: '#111827',
    textSecondary: '#374151',
    textMuted: '#6B7280',
    textSubtle: '#9CA3AF',
    accentBlue: '#2563EB',
    accentBlueSoft: '#EEF4FF',
    ctaDarkBg: '#18181B',
    ctaDarkText: '#FFFFFF',
    hatchStripe: '#ECEEF2',
    dotPattern: '#E5E7EB',
    bannerGradient:
      'radial-gradient(circle at 10% 20%, #FDD6C8 0%, transparent 52%), radial-gradient(circle at 48% 18%, #C7DFFF 0%, transparent 56%), radial-gradient(circle at 86% 22%, #F5CCF8 0%, transparent 54%), linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
    recapGradient:
      'radial-gradient(circle at 90% 18%, rgba(129, 140, 248, 0.36) 0%, rgba(196, 181, 253, 0.22) 38%, rgba(248, 250, 252, 0.92) 76%), #F7F8FA',
    cardShadow: '0 1px 2px rgba(15, 23, 42, 0.025)',
    popoverShadow: '0 12px 30px rgba(15, 23, 42, 0.09)',
  };
}

