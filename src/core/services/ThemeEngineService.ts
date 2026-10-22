import type {
  IThemeEngine,
  ResolvedThemeMode,
  ThemePreferences,
} from '../contracts/ThemeContract';
import {
  DENSITY_SCALE_TOKENS,
  RADIUS_SCALE_TOKENS,
  SEED_PALETTES,
} from '../tokens/designTokens';

/**
 * ============================================================================
 * UXU DESIGN SYSTEM — CSS VARIABLE THEME ENGINE (SRP & DIP)
 * ============================================================================
 * [SRP] Responsible solely for translating abstract `ThemePreferences` into
 * DOM CSS Custom Properties (`--uxu-*`) and data attributes on `documentElement`.
 * [DIP] Implements `IThemeEngine` contract injected into `ThemeProvider`.
 */

export class CssVariableThemeEngine implements IThemeEngine {
  public applyTheme(prefs: ThemePreferences, resolvedMode: ResolvedThemeMode): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const palette = SEED_PALETTES[prefs.seedPalette] ?? SEED_PALETTES['cupertino-blue'];
    const modeTokens = resolvedMode === 'dark' ? palette.dark : palette.light;
    const radiusTokens = RADIUS_SCALE_TOKENS[prefs.radiusScale] ?? RADIUS_SCALE_TOKENS.squircle;
    const densityTokens = DENSITY_SCALE_TOKENS[prefs.density] ?? DENSITY_SCALE_TOKENS.comfortable;

    root.setAttribute('data-theme', resolvedMode);
    root.setAttribute('data-seed', prefs.seedPalette);
    root.setAttribute('data-density', prefs.density);
    root.setAttribute('data-reduced-motion', String(prefs.reducedMotion));
    root.setAttribute('data-webgl', String(Boolean(prefs.webglEnabled)));
    root.style.colorScheme = resolvedMode;

    // Seed & Tonal Accent Tokens (Material You + Apple Vibrancy)
    root.style.setProperty('--uxu-primary', modeTokens.primary);
    root.style.setProperty('--uxu-primary-hover', modeTokens.primaryHover);
    root.style.setProperty('--uxu-primary-container', modeTokens.primaryContainer);
    root.style.setProperty('--uxu-on-primary-container', modeTokens.onPrimaryContainer);
    root.style.setProperty('--uxu-secondary', modeTokens.secondary);
    root.style.setProperty('--uxu-accent-glow', modeTokens.accentGlow);

    // Corner Radius Tokens (Supports both preset scale and exact customRadiusPx 0px-32px)
    if (typeof prefs.customRadiusPx === 'number') {
      const px = Math.max(0, Math.min(32, prefs.customRadiusPx));
      root.style.setProperty('--uxu-radius-sm', `${Math.round(px * 0.65)}px`);
      root.style.setProperty('--uxu-radius-md', `${px}px`);
      root.style.setProperty('--uxu-radius-lg', `${Math.round(px * 1.45)}px`);
      root.style.setProperty('--uxu-radius-xl', `${Math.round(px * 2)}px`);
      root.style.setProperty('--uxu-radius-full', '9999px');
    } else {
      root.style.setProperty('--uxu-radius-sm', radiusTokens.sm);
      root.style.setProperty('--uxu-radius-md', radiusTokens.md);
      root.style.setProperty('--uxu-radius-lg', radiusTokens.lg);
      root.style.setProperty('--uxu-radius-xl', radiusTokens.xl);
      root.style.setProperty('--uxu-radius-full', radiusTokens.full);
    }

    // Density, Global Font Size Scale & Spacing Tokens
    const userFontScale = (prefs.fontScale ?? 100) / 100;
    const densityFontScale = parseFloat(densityTokens.fontSizeScale || '1');
    const combinedFontScale = +(userFontScale * densityFontScale).toFixed(3);

    root.style.setProperty('--uxu-density-scale', densityTokens.spacingUnit);
    root.style.setProperty('--uxu-control-height-md', densityTokens.controlHeightMd);
    root.style.setProperty('--uxu-card-padding', densityTokens.cardPadding);
    root.style.setProperty('--uxu-font-scale', String(combinedFontScale));

    // Apple Glassmorphism Blur & Specular Intensity
    const blurPx = Math.round((prefs.glassIntensity / 100) * 32);
    const saturation = Math.round(100 + (prefs.glassIntensity / 100) * 90);
    root.style.setProperty('--uxu-glass-blur', `${blurPx}px`);
    root.style.setProperty('--uxu-glass-saturation', `${saturation}%`);
  }
}

export const defaultThemeEngine = new CssVariableThemeEngine();
