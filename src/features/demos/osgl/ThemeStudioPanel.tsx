import React from 'react';
import { Button, Input, Slider, Switch } from '../../../components/primitives';
import type {
  FontFamilyPreset,
  FontFamilyPresetDefinition,
  GoogleIconStyle,
  SeedPaletteDefinition,
  SeedPaletteId,
  ThemeMode,
  ThemePreferences,
} from '../../../core/contracts/ThemeContract';
import { OS_WALLPAPERS, type OSWallpaperId } from '../OSGLEngine';
import type { BgMode, IconBgStyle, QualityMode } from './types';

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
    wallpaper,
    setWallpaper,
    bgMode,
    setBgMode,
    solidBgColor,
    setSolidBgColor,
    bgGradColor1,
    setBgGradColor1,
    bgGradColor2,
    setBgGradColor2,
    customBgUrl,
    setCustomBgUrl,
    uploadedBgDataUrl,
    setUploadedBgDataUrl,
    qualityMode,
    setQualityMode,
    dockVisible,
    setDockVisible,
    windowAnimation,
    setWindowAnimation,
    iconBgStyle,
    setIconBgStyle,
    iconBgColor,
    setIconBgColor,
    iconGradColor1,
    setIconGradColor1,
    iconGradColor2,
    setIconGradColor2,
    iconColor,
    setIconColor,
    iconSizePx,
    setIconSizePx,
    preferences,
    availablePalettes,
    availableFontPresets,
    setMode,
    setSeedPalette,
    setFontFamilyPreset,
    setFontScale,
    setGlassIntensity,
    setIconStyle,
    setIconFilled,
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

      <div>
        <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>
          Arka Plan Türü
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(
            [
              { id: 'aurora', label: 'Aurora (WebGL)' },
              { id: 'gradient', label: 'Gradyan' },
              { id: 'solid', label: 'Düz Renk' },
              { id: 'image', label: 'Görsel / Link' },
            ] as Array<{ id: BgMode; label: string }>
          ).map((m) => (
            <Button
              key={m.id}
              size="sm"
              variant={bgMode === m.id ? 'filled' : 'outlined'}
              onClick={() => setBgMode(m.id)}
            >
              {m.label}
            </Button>
          ))}
        </div>
      </div>

      {bgMode === 'aurora' && (
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>
            OS Duvar Kağıtları (6 Özel Üretim)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {(Object.keys(OS_WALLPAPERS) as OSWallpaperId[]).map((key) => {
              const item = OS_WALLPAPERS[key];
              const active = wallpaper === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setWallpaper(key)}
                  style={{
                    padding: 6,
                    borderRadius: 12,
                    border: active ? '2px solid #3b82f6' : '1px solid rgba(148,163,184,0.28)',
                    background: 'transparent',
                    color: 'inherit',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ height: 34, borderRadius: 8, background: item.preview, marginBottom: 5 }} />
                  <div style={{ fontSize: 11, fontWeight: 700 }}>{item.name}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {bgMode === 'gradient' && (
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>
            Masaüstü Gradyan İki Renk Seçimi
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600 }}>
              <span>Renk 1</span>
              <input
                type="color"
                value={bgGradColor1}
                onChange={(e) => setBgGradColor1(e.target.value)}
                style={{ width: 34, height: 28, padding: 0, border: '1px solid rgba(148,163,184,0.35)', borderRadius: 8, background: 'transparent', cursor: 'pointer' }}
              />
            </label>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600 }}>
              <span>Renk 2</span>
              <input
                type="color"
                value={bgGradColor2}
                onChange={(e) => setBgGradColor2(e.target.value)}
                style={{ width: 34, height: 28, padding: 0, border: '1px solid rgba(148,163,184,0.35)', borderRadius: 8, background: 'transparent', cursor: 'pointer' }}
              />
            </label>
          </div>
        </div>
      )}

      {bgMode === 'solid' && (
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>
            Düz Arka Plan Rengi
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <input
              type="color"
              aria-label="Düz Arka Plan Rengi"
              value={solidBgColor}
              onChange={(e) => setSolidBgColor(e.target.value)}
              style={{ width: 36, height: 30, padding: 0, border: '1px solid rgba(148,163,184,0.35)', borderRadius: 8, background: 'transparent', cursor: 'pointer' }}
            />
            {['#0f172a', '#1e1b4b', '#064e3b', '#3f1d2b', '#e2e8f0', '#fef3c7'].map((hex) => (
              <button
                key={hex}
                type="button"
                onClick={() => setSolidBgColor(hex)}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 999,
                  backgroundColor: hex,
                  border: solidBgColor === hex ? '2px solid #3b82f6' : '1px solid rgba(148,163,184,0.45)',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        </div>
      )}

      {bgMode === 'image' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700 }}>
            Görsel Linki veya Dosya Yükle (localStorage'da Saklanır)
          </div>
          <Input
            placeholder="https://... görsel URL yapıştırın"
            value={customBgUrl}
            onChange={(val) => setCustomBgUrl(val)}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 10,
                border: '1px solid rgba(148,163,184,0.35)',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <span>Bilgisayardan Görsel Yükle</span>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    if (typeof reader.result === 'string') setUploadedBgDataUrl(reader.result);
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </label>
            {(uploadedBgDataUrl || customBgUrl) && (
              <Button
                size="sm"
                variant="outlined"
                onClick={() => {
                  setUploadedBgDataUrl('');
                  setCustomBgUrl('');
                }}
              >
                Görseli Temizle
              </Button>
            )}
          </div>
        </div>
      )}

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

      <div>
        <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>
          Simge Arka Plan Stili (Icon Efektleri)
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {(
            [
              { id: 'vivid', label: 'Çok Renkli' },
              { id: 'gradient', label: 'Gradyan (2 Renk)' },
              { id: 'soft', label: 'Soft Gradyan' },
              { id: 'glass', label: 'Liquid Glass' },
              { id: 'sun', label: 'Sun Glass' },
              { id: 'mono', label: 'Tek Renk' },
            ] as Array<{ id: IconBgStyle; label: string }>
          ).map((opt) => (
            <Button
              key={opt.id}
              size="sm"
              variant={iconBgStyle === opt.id ? 'filled' : 'outlined'}
              onClick={() => setIconBgStyle(opt.id)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {(iconBgStyle === 'mono' || iconBgStyle === 'soft') && (
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>
            Simge Arka Plan Rengi
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <input
              type="color"
              aria-label="Simge Arka Plan Rengi"
              value={iconBgColor || '#3b82f6'}
              onChange={(e) => setIconBgColor(e.target.value)}
              style={{ width: 34, height: 30, padding: 0, border: '1px solid rgba(148,163,184,0.35)', borderRadius: 8, background: 'transparent', cursor: 'pointer' }}
            />
            {['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#0f172a'].map((hex) => (
              <button
                key={hex}
                type="button"
                title={hex}
                onClick={() => setIconBgColor(hex)}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 999,
                  backgroundColor: hex,
                  border: iconBgColor === hex ? '2px solid #3b82f6' : '1px solid rgba(148,163,184,0.45)',
                  cursor: 'pointer',
                }}
              />
            ))}
            <Button size="sm" variant={!iconBgColor ? 'filled' : 'outlined'} onClick={() => setIconBgColor('')}>
              Tema Rengi
            </Button>
          </div>
        </div>
      )}

      {iconBgStyle === 'gradient' && (
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>
            Simge Gradyan Renkleri (2 Renk)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600 }}>
              <span>Renk 1</span>
              <input
                type="color"
                value={iconGradColor1}
                onChange={(e) => setIconGradColor1(e.target.value)}
                style={{ width: 34, height: 28, padding: 0, border: '1px solid rgba(148,163,184,0.35)', borderRadius: 8, background: 'transparent', cursor: 'pointer' }}
              />
            </label>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600 }}>
              <span>Renk 2</span>
              <input
                type="color"
                value={iconGradColor2}
                onChange={(e) => setIconGradColor2(e.target.value)}
                style={{ width: 34, height: 28, padding: 0, border: '1px solid rgba(148,163,184,0.35)', borderRadius: 8, background: 'transparent', cursor: 'pointer' }}
              />
            </label>
          </div>
        </div>
      )}

      <div>
        <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>
          İkon Sembol Rengi
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <input
            type="color"
            aria-label="Simge Rengi Seç"
            value={iconColor || '#ffffff'}
            onChange={(e) => setIconColor(e.target.value)}
            style={{ width: 34, height: 30, padding: 0, border: '1px solid rgba(148,163,184,0.35)', borderRadius: 8, background: 'transparent', cursor: 'pointer' }}
          />
          {['#ffffff', '#0f172a', '#38bdf8', '#fbbf24', '#34d399', '#f472b6'].map((hex) => (
            <button
              key={hex}
              type="button"
              title={hex}
              onClick={() => setIconColor(hex)}
              style={{
                width: 22,
                height: 22,
                borderRadius: 999,
                backgroundColor: hex,
                border: iconColor === hex ? '2px solid #3b82f6' : '1px solid rgba(148,163,184,0.45)',
                cursor: 'pointer',
              }}
            />
          ))}
          <Button size="sm" variant={!iconColor ? 'filled' : 'outlined'} onClick={() => setIconColor('')}>
            Otomatik
          </Button>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>
          Simge Büyüklüğü ({iconSizePx}px)
        </div>
        <Slider min={44} max={84} value={iconSizePx} onChange={setIconSizePx} />
      </div>

      <div>
        <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>İkon Stili & Dolgu Tipi</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(['rounded', 'outlined', 'sharp'] as GoogleIconStyle[]).map((st) => (
            <Button
              key={st}
              size="sm"
              variant={preferences.iconStyle === st ? 'filled' : 'outlined'}
              onClick={() => setIconStyle(st)}
            >
              {st}
            </Button>
          ))}
          <Button size="sm" variant={preferences.iconFilled ? 'filled' : 'outlined'} onClick={() => setIconFilled(true)}>
            Dolgulu
          </Button>
          <Button size="sm" variant={!preferences.iconFilled ? 'filled' : 'outlined'} onClick={() => setIconFilled(false)}>
            Boş (Outlined)
          </Button>
        </div>
      </div>

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
