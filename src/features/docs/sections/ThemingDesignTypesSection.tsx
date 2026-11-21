import React from 'react';
import { Layers, Monitor, Moon, Palette, Pipette, RotateCcw, Sliders, Sun } from 'lucide-react';
import { Badge, Button, Slider, Switch } from '../../../components/primitives';
import { Card, SegmentedControl } from '../../../components/composites';
import { useTheme } from '../../../providers/ThemeProvider';
import type {
  RadiusScale,
  ThemeMode,
  UIDensity,
  WebGLShaderPreset,
} from '../../../core/contracts/ThemeContract';

export interface ThemingDesignTypesSectionProps {
  isTR: boolean;
}

const DESIGN_TYPES = [
  { name: 'Liquid Glass', badge: 'Apple / Spatial', variant: 'glass' as const, descTr: 'Yarı saydam buzlu cam yüzeyler, backdrop-filter blur ve yumuşak iç ışık yansımaları.', descEn: 'Translucent frosted glass surfaces, backdrop-filter blur, and subtle inner highlights.' },
  { name: 'Dynamic Tonal', badge: 'Material You / M3', variant: 'tonal' as const, descTr: 'Tohum renkten türetilen yüksek kontrastlı tonal yüzey katmanları ve net sınırlar.', descEn: 'Seed-derived high-contrast tonal surface layers with crisp elevation hierarchy.' },
  { name: 'Hybrid Fusion', badge: 'uxiGL Sentezi', variant: 'elevated' as const, descTr: 'Liquid Glass derinliği ile Material You tonal erişilebilirliğini birleştiren varsayılan yaklaşım.', descEn: 'Signature blend combining Liquid Glass depth with Material You tonal accessibility.' },
];

const BRAND_HEX_SWATCHES = ['#6366F1', '#0EA5E9', '#10B981', '#F59E0B', '#EC4899', '#EF4444'];

export const ThemingDesignTypesSection: React.FC<ThemingDesignTypesSectionProps> = ({
  isTR,
}) => {
  const {
    preferences,
    resolvedMode,
    availablePalettes,
    setMode,
    setSeedPalette,
    setCustomPrimaryHex,
    setRadiusScale,
    setCustomRadiusPx,
    setDensity,
    setFontScale,
    setGlassIntensity,
    setSidebarWidth,
    setReducedMotion,
    setWebglEnabled,
    setWebglPreset,
    setWebglIntensity,
    resetPreferences,
  } = useTheme();

  return (
    <div className="uxu-stack-md">
      <Card
        id="doc-sec-design-types"
        variant="glass"
        padding="md"
        eyebrow={isTR ? 'TASARIM TÜRLERİ & YÜZEY SİSTEMİ' : 'DESIGN TYPES & SURFACE SYSTEM'}
        title={isTR ? '3 Tasarım Türü & Bileşen Yüzey Varyantları' : '3 Design Types & Surface Variants'}
        subtitle={
          isTR
            ? 'glass • tonal • elevated • outlined — Her bileşen tasarım dilini prop ile değiştirebilir'
            : 'glass • tonal • elevated • outlined — Every component can switch surface language via props'
        }
        headerIcon={<Layers size={19} />}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {DESIGN_TYPES.map((dt) => (
            <Card key={dt.name} variant={dt.variant} padding="sm" interactive>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <strong style={{ fontSize: '0.9rem' }}>{dt.name}</strong>
                <Badge tone="primary" size="xs">{dt.badge}</Badge>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--uxu-text-secondary)', lineHeight: 1.5 }}>
                {isTR ? dt.descTr : dt.descEn}
              </p>
            </Card>
          ))}
        </div>
      </Card>

      <div className="uxu-stage-grid-2">
        <Card
          id="doc-sec-theme-selection"
          variant="glass"
          title={isTR ? 'Tema Seçimi, Mod & Özel Marka Rengi' : 'Theme Selection, Mode & Custom Brand Color'}
          subtitle={isTR ? '6 hazır palet veya özel HEX marka rengi seçin' : 'Choose from 6 seed palettes or custom brand HEX'}
          headerIcon={<Palette size={19} />}
        >
          <div className="uxu-stack-md">
            <SegmentedControl<ThemeMode>
              label={isTR ? '1. Görünüm Modu (Dark / Light / System)' : '1. Appearance Mode'}
              value={preferences.mode}
              onChange={setMode}
              fullWidth
              size="sm"
              options={[
                { value: 'dark', label: 'Dark', icon: <Moon size={14} /> },
                { value: 'light', label: 'Light', icon: <Sun size={14} /> },
                { value: 'system', label: 'System', icon: <Monitor size={14} /> },
              ]}
            />

            <div>
              <div className="uxu-field__label" style={{ marginBottom: 6 }}>
                {isTR ? '2. Tohum Renk Paleti (6 Hazır Tema):' : '2. Seed Color Palette (6 Themes):'}
              </div>
              <div className="uxu-palette-grid">
                {availablePalettes.map((p) => {
                  const isSelected = p.id === preferences.seedPalette && !preferences.customPrimaryHex;
                  const preview = resolvedMode === 'dark' ? p.dark : p.light;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      className={`uxu-palette-card ${isSelected ? 'uxu-palette-card--active' : ''}`}
                      onClick={() => {
                        setCustomPrimaryHex(undefined);
                        setSeedPalette(p.id);
                      }}
                    >
                      <div className="uxu-palette-card__swatches">
                        <span style={{ background: preview.primary }} />
                        <span style={{ background: preview.secondary }} />
                        <span style={{ background: preview.primaryContainer }} />
                      </div>
                      <div className="uxu-palette-card__info">
                        <strong>{p.name}</strong>
                        <small>{p.inspiration}</small>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="uxu-field__label" style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Pipette size={14} />
                <span>{isTR ? '3. Özel Marka HEX Rengi (Dinamik Türetme):' : '3. Custom Brand HEX:'}</span>
              </div>
              <div className="uxu-stage-row" style={{ flexWrap: 'wrap', gap: 6 }}>
                {BRAND_HEX_SWATCHES.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => setCustomPrimaryHex(hex)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: hex,
                      border: preferences.customPrimaryHex === hex ? '2px solid var(--uxu-text-primary)' : '1px solid transparent',
                      cursor: 'pointer',
                    }}
                    title={hex}
                  />
                ))}
                {preferences.customPrimaryHex && (
                  <Button variant="ghost" size="xs" onClick={() => setCustomPrimaryHex(undefined)}>
                    {isTR ? 'Temizle' : 'Clear'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card
          id="doc-sec-theme-settings"
          variant="glass"
          title={isTR ? 'Gelişmiş Tema Ayarları & WebGL' : 'Advanced Theme Settings & WebGL'}
          subtitle={isTR ? 'ThemeStudioDrawer ile aynı canlı tercih motoru' : 'Same live preferences engine as ThemeStudioDrawer'}
          headerIcon={<Sliders size={19} />}
          headerAction={
            <Button variant="ghost" size="xs" leadingIcon={<RotateCcw size={13} />} onClick={resetPreferences}>
              {isTR ? 'Sıfırla' : 'Reset'}
            </Button>
          }
        >
          <div className="uxu-stack-md">
            <div className="uxu-stage-grid-2">
              <SegmentedControl<RadiusScale>
                label={isTR ? 'Köşe Ölçeği' : 'Radius Scale'}
                value={preferences.radiusScale}
                onChange={setRadiusScale}
                size="sm"
                fullWidth
                options={[
                  { value: 'sharp', label: isTR ? 'Keskin' : 'Sharp' },
                  { value: 'squircle', label: 'Squircle' },
                  { value: 'pill', label: isTR ? 'Kapsül' : 'Pill' },
                ]}
              />
              <SegmentedControl<UIDensity>
                label={isTR ? 'Arayüz Yoğunluğu' : 'UI Density'}
                value={preferences.density}
                onChange={setDensity}
                size="sm"
                fullWidth
                options={[
                  { value: 'compact', label: isTR ? 'Kompakt' : 'Compact' },
                  { value: 'comfortable', label: isTR ? 'Standart' : 'Standard' },
                  { value: 'spacious', label: isTR ? 'Geniş' : 'Spacious' },
                ]}
              />
            </div>

            <Slider
              label={isTR ? 'Hassas Köşe Yarıçapı (customRadiusPx)' : 'Exact Radius (customRadiusPx)'}
              value={preferences.customRadiusPx ?? 12}
              min={0}
              max={32}
              step={1}
              valueSuffix="px"
              onChange={setCustomRadiusPx}
            />
            <Slider
              label={isTR ? 'Yazı Boyutu Ölçeği (fontScale)' : 'Font Scale'}
              value={preferences.fontScale ?? 100}
              min={80}
              max={125}
              step={5}
              showTicks
              valueSuffix="%"
              onChange={setFontScale}
            />
            <Slider
              label={isTR ? 'Liquid Glass Yoğunluğu' : 'Glass Intensity'}
              value={preferences.glassIntensity}
              min={15}
              max={100}
              step={5}
              valueSuffix="%"
              onChange={setGlassIntensity}
            />
            {setSidebarWidth && (
              <Slider
                label={isTR ? 'Kenar Çubuğu Genişliği (sidebarWidth)' : 'Sidebar Width'}
                value={preferences.sidebarWidth ?? 256}
                min={200}
                max={380}
                step={4}
                valueSuffix="px"
                onChange={setSidebarWidth}
              />
            )}
            <Switch
              size="sm"
              label={isTR ? 'Azaltılmış Hareket (reducedMotion)' : 'Reduced Motion'}
              value={preferences.reducedMotion}
              onChange={setReducedMotion}
            />
            <Switch
              size="sm"
              label={isTR ? 'WebGL Uzamsal Shader Arka Planı' : 'WebGL Spatial Shader'}
              value={preferences.webglEnabled ?? false}
              onChange={setWebglEnabled}
            />
            {preferences.webglEnabled && (
              <div className="uxu-stack-sm">
                <SegmentedControl<WebGLShaderPreset>
                  size="sm"
                  fullWidth
                  value={preferences.webglPreset}
                  onChange={setWebglPreset}
                  options={[
                    { value: 'aurora-borealis', label: 'Aurora' },
                    { value: 'spatial-nebula', label: 'Nebula' },
                    { value: 'material-lava', label: 'Lava' },
                    { value: 'cyber-horizon', label: 'Cyber' },
                  ]}
                />
                <Slider
                  label={isTR ? 'WebGL Parlaklık' : 'WebGL Intensity'}
                  value={preferences.webglIntensity}
                  min={15}
                  max={100}
                  step={5}
                  valueSuffix="%"
                  onChange={setWebglIntensity}
                />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
