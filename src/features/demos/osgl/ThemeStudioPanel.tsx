import React from 'react';
import { Button, Slider, Switch } from '../../../components/primitives';
import type {
  FontFamilyPreset,
  FontFamilyPresetDefinition,
  GoogleIconStyle,
  SeedPaletteDefinition,
  SeedPaletteId,
  ThemeMode,
  ThemePreferences,
} from '../../../core/contracts/ThemeContract';
import type { OSWallpaperId } from '../OSGLEngine';
import type { BgMode, IconBgStyle, QualityMode } from './types';
import { BackgroundSettingsSection } from './BackgroundSettingsSection';
import { IconSettingsSection } from './IconSettingsSection';

export interface ThemeStudioPanelProps {
  wallpaper: OSWallpaperId;
  setWallpaper: (wp: OSWallpaperId) => void;
  bgMode: BgMode;
  setBgMode: (m: BgMode) => void;
  solidBgColor: string;
  setSolidBgColor: (c: string) => void;
  bgGradColor1: string;
  setBgGradColor1: (c: string) => void;
  bgGradColor2: string;
  setBgGradColor2: (c: string) => void;
  customBgUrl: string;
  setCustomBgUrl: (url: string) => void;
  uploadedBgDataUrl: string;
  setUploadedBgDataUrl: (url: string) => void;
  qualityMode: QualityMode;
  setQualityMode: (q: QualityMode) => void;
  dockVisible: boolean;
  setDockVisible: (v: boolean) => void;
  windowAnimation: boolean;
  setWindowAnimation: (v: boolean) => void;
  iconBgStyle: IconBgStyle;
  setIconBgStyle: (s: IconBgStyle) => void;
  iconBgColor: string;
  setIconBgColor: (c: string) => void;
  iconGradColor1: string;
  setIconGradColor1: (c: string) => void;
  iconGradColor2: string;
  setIconGradColor2: (c: string) => void;
  iconColor: string;
  setIconColor: (c: string) => void;
  iconSizePx: number;
  setIconSizePx: (px: number) => void;
  preferences: ThemePreferences;
  availablePalettes: SeedPaletteDefinition[];
  availableFontPresets: FontFamilyPresetDefinition[];
  setMode: (m: ThemeMode) => void;
  setSeedPalette: (id: SeedPaletteId) => void;
  setFontFamilyPreset: (preset: FontFamilyPreset) => void;
  setFontScale: (scale: number) => void;
  setGlassIntensity: (v: number) => void;
  setIconStyle: (s: GoogleIconStyle) => void;
  setIconFilled: (f: boolean) => void;
  setCustomRadiusPx: (px: number) => void;
  resetPreferences: () => void;
}

export function ThemeStudioPanel(props: ThemeStudioPanelProps) {
  const {
    qualityMode,
    setQualityMode,
    dockVisible,
    setDockVisible,
    windowAnimation,
    setWindowAnimation,
    preferences,
    availablePalettes,
    availableFontPresets,
    setMode,
    setSeedPalette,
    setFontFamilyPreset,
    setFontScale,
    setGlassIntensity,
    setCustomRadiusPx,
    resetPreferences,
  } = props;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>
          Görünüm Modu (Dark / Light / System)
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(['light', 'dark', 'system'] as ThemeMode[]).map((m) => (
            <Button
              key={m}
              size="sm"
              variant={preferences.mode === m ? 'filled' : 'outlined'}
              onClick={() => setMode(m)}
            >
              {m === 'light' ? 'Aydınlık' : m === 'dark' ? 'Karanlık' : 'Sistem'}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>
          Performans & Kalite Modu
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <Button
            size="sm"
            variant={qualityMode === 'quality' ? 'filled' : 'outlined'}
            onClick={() => setQualityMode('quality')}
          >
            Kalite Modu (Aurora + Cam)
          </Button>
          <Button
            size="sm"
            variant={qualityMode === 'performance' ? 'filled' : 'outlined'}
            onClick={() => setQualityMode('performance')}
          >
            Performans Modu (Hafif)
          </Button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Switch value={dockVisible} onChange={setDockVisible} />
          <span style={{ fontSize: 12.5, fontWeight: 700 }}>Dock Göster</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Switch value={windowAnimation} onChange={setWindowAnimation} />
          <span style={{ fontSize: 12.5, fontWeight: 700 }}>Açılma / Kapanma Efekti</span>
        </div>
      </div>

      <BackgroundSettingsSection {...props} />

      <div>
        <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>
          Pencere Cam Yoğunluğu ({preferences.glassIntensity}%)
        </div>
        <Slider min={0} max={100} value={preferences.glassIntensity} onChange={setGlassIntensity} />
      </div>

      <div>
        <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>
          Pencere Köşe Yuvarlaklığı ({preferences.customRadiusPx ?? 12}px)
        </div>
        <Slider min={0} max={28} value={preferences.customRadiusPx ?? 12} onChange={setCustomRadiusPx} />
      </div>

      <IconSettingsSection
        {...props}
        iconStyle={preferences.iconStyle}
        iconFilled={preferences.iconFilled}
      />

      <div>
        <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>
          Tohum Renk Paleti (Seed Palette)
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {availablePalettes.map((pal) => (
            <Button
              key={pal.id}
              size="sm"
              variant={preferences.seedPalette === pal.id ? 'filled' : 'outlined'}
              onClick={() => setSeedPalette(pal.id)}
            >
              {pal.name}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>
          Yazı Tipi (Font Ailesi)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(165px, 1fr))', gap: 8 }}>
          {availableFontPresets.map((font) => {
            const active = (preferences.fontFamilyPreset ?? 'inter-jakarta') === font.id;
            return (
              <button
                key={font.id}
                type="button"
                onClick={() => setFontFamilyPreset(font.id)}
                style={{
                  padding: '8px 10px',
                  borderRadius: 10,
                  border: active ? '2px solid #3b82f6' : '1px solid rgba(148,163,184,0.28)',
                  background: active ? 'rgba(59,130,246,0.12)' : 'transparent',
                  color: 'inherit',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: font.sansStack,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{font.name}</div>
                <div style={{ fontSize: 11, opacity: 0.72 }}>Aa Bb Cc • 1234 — {font.badge}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>
          Yazı Boyutu Ölçeği ({preferences.fontScale}%)
        </div>
        <Slider min={80} max={125} value={preferences.fontScale} onChange={setFontScale} />
      </div>

      <Button variant="outlined" size="sm" onClick={resetPreferences}>
        Varsayılan Ayarlara Sıfırla
      </Button>
    </div>
  );
}
