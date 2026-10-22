import React from 'react';
import {
  Sun,
  Moon,
  Monitor,
  Palette,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';
import { useTheme } from '../../providers/ThemeProvider';
import {
  Button,
  Slider,
  Switch,
  Badge,
  GoogleIcon,
} from '../../components/primitives';
import { SegmentedControl } from '../../components/composites';
import type {
  FontFamilyPreset,
  GoogleIconStyle,
  RadiusScale,
  ThemeMode,
  UIDensity,
  WebGLShaderPreset,
} from '../../core/contracts/ThemeContract';

export interface ThemeStudioDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const ThemeStudioDrawer: React.FC<ThemeStudioDrawerProps> = ({
  open,
  onClose,
}) => {
  const {
    preferences,
    resolvedMode,
    availablePalettes,
    availableFontPresets,
    setMode,
    setSeedPalette,
    setRadiusScale,
    setCustomRadiusPx,
    setDensity,
    setFontScale,
    setFontFamilyPreset,
    setIconStyle,
    setIconFilled,
    setIconWeight,
    setGlassIntensity,
    setReducedMotion,
    setWebglEnabled,
    setWebglPreset,
    setWebglIntensity,
    resetPreferences,
  } = useTheme();

  if (!open) return null;

  return (
    <div
      className="uxu-drawer-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <aside
        className="uxu-theme-drawer"
        onClick={(e) => e.stopPropagation()}
        aria-label="uxiGL Tema & Görünüm Stüdyosu"
      >
        <div className="uxu-theme-drawer__header">
          <div className="uxu-theme-drawer__title-group">
            <Palette size={19} className="uxu-text-primary" />
            <div>
              <h3>uxiGL Tasarım &amp; Tema Stüdyosu</h3>
              <span>Dark/Light Mod, Renk Paletleri &amp; Border Radius</span>
            </div>
          </div>
          <button
            type="button"
            className="uxu-modal__close"
            onClick={onClose}
            aria-label="Paneli kapat"
          >
            <X size={18} />
          </button>
        </div>

        <div className="uxu-theme-drawer__body">
          {/* 1. Light / Dark / System Mode */}
          <div className="uxu-studio-section">
            <div className="uxu-studio-section__header">
              <span>Görünüm Modu (Dark / Light / System)</span>
              <Badge tone="primary" size="xs">
                Aktif: {resolvedMode.toUpperCase()}
              </Badge>
            </div>
            <SegmentedControl<ThemeMode>
              value={preferences.mode}
              onChange={setMode}
              fullWidth
              size="sm"
              options={[
                {
                  value: 'light',
                  label: 'Aydınlık',
                  icon: <Sun size={14} />,
                },
                {
                  value: 'dark',
                  label: 'Karanlık',
                  icon: <Moon size={14} />,
                },
                {
                  value: 'system',
                  label: 'Sistem',
                  icon: <Monitor size={14} />,
                },
              ]}
            />
          </div>

          {/* 2. Seed Palettes */}
          <div className="uxu-studio-section">
            <div className="uxu-studio-section__header">
              <span>Tohum Renk Paleti (Seed Color Harmony)</span>
            </div>
            <div className="uxu-palette-grid">
              {availablePalettes.map((palette) => {
                const isSelected = preferences.seedPalette === palette.id;
                const colors =
                  resolvedMode === 'dark' ? palette.dark : palette.light;
                return (
                  <button
                    key={palette.id}
                    type="button"
                    onClick={() => setSeedPalette(palette.id)}
                    className={`uxu-palette-card ${
                      isSelected ? 'uxu-palette-card--active' : ''
                    }`}
                  >
                    <div className="uxu-palette-card__swatches">
                      <span style={{ background: colors.primary }} />
                      <span style={{ background: colors.primaryContainer }} />
                      <span style={{ background: colors.secondary }} />
                    </div>
                    <div className="uxu-palette-card__info">
                      <strong>{palette.name}</strong>
                      <small>{palette.inspiration}</small>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Google Fonts Family Pairing & Global Font Size Scale */}
          <div className="uxu-studio-section">
            <div className="uxu-studio-section__header">
              <span>Google Fonts Yazı Tipi Ailesi</span>
              <Badge tone="primary" size="xs">
                {
                  availableFontPresets.find(
                    (f) => f.id === (preferences.fontFamilyPreset ?? 'inter-jakarta')
                  )?.name ?? 'Inter × Jakarta'
                }
              </Badge>
            </div>
            <div className="uxu-palette-grid">
              {availableFontPresets.map((preset) => {
                const isSelected =
                  (preferences.fontFamilyPreset ?? 'inter-jakarta') === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setFontFamilyPreset(preset.id as FontFamilyPreset)}
                    className={`uxu-palette-card ${
                      isSelected ? 'uxu-palette-card--active' : ''
                    }`}
                    style={{ fontFamily: preset.sansStack }}
                  >
                    <div className="uxu-palette-card__info">
                      <strong style={{ fontFamily: preset.displayStack }}>
                        {preset.name}
                      </strong>
                      <small>{preset.badge}</small>
                    </div>
                  </button>
                );
              })}
            </div>

            <Slider
              label="Genel Yazı Boyutu (Font Ölçeği)"
              value={preferences.fontScale ?? 100}
              onChange={setFontScale}
              min={80}
              max={125}
              step={5}
              showTicks
              valueSuffix="%"
            />
            <div className="uxu-stage-row">
              {[85, 95, 100, 110, 120].map((pct) => (
                <Button
                  key={pct}
                  variant={
                    (preferences.fontScale ?? 100) === pct
                      ? 'filled'
                      : 'outlined'
                  }
                  size="xs"
                  onClick={() => setFontScale(pct)}
                >
                  %{pct}
                </Button>
              ))}
            </div>
          </div>

          {/* 3B. Google Material Symbols Variable Font Icons */}
          <div className="uxu-studio-section">
            <div className="uxu-studio-section__header">
              <span>Google Material Symbols (Font İkonlar)</span>
              <Badge tone="info" size="xs">
                {(preferences.iconStyle ?? 'rounded').toUpperCase()} • wght:{' '}
                {preferences.iconWeight ?? 400}
              </Badge>
            </div>
            <SegmentedControl<GoogleIconStyle>
              value={preferences.iconStyle ?? 'rounded'}
              onChange={setIconStyle}
              fullWidth
              size="sm"
              options={[
                { value: 'rounded', label: 'Rounded' },
                { value: 'outlined', label: 'Outlined' },
                { value: 'sharp', label: 'Sharp' },
              ]}
            />
            <Slider
              label="İkon Çizgi Kalınlığı (wght: 100 – 700)"
              value={preferences.iconWeight ?? 400}
              onChange={setIconWeight}
              min={100}
              max={700}
              step={100}
              showTicks
            />
            <Switch
              label="Dolgulu İkon Modu (FILL: 1)"
              description="Google Material Symbols FILL eksenini 0 ile 1 arasında değiştirir"
              value={Boolean(preferences.iconFilled)}
              onChange={setIconFilled}
              size="sm"
            />
            <div
              className="uxu-stage-row"
              style={{
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: 'var(--uxu-radius-md)',
                background: 'var(--uxu-surface-tonal)',
                border: '1px solid var(--uxu-border-subtle)',
              }}
            >
              {[
                { name: 'auto_awesome', tone: 'primary' as const },
                { name: 'dashboard', tone: 'info' as const },
                { name: 'palette', tone: 'secondary' as const },
                { name: 'table_chart', tone: 'success' as const },
                { name: 'folder_open', tone: 'warning' as const },
                { name: 'bolt', tone: 'danger' as const },
                { name: 'verified', tone: 'primary' as const },
                { name: 'terminal', tone: 'info' as const },
              ].map((ic) => (
                <GoogleIcon
                  key={ic.name}
                  name={ic.name}
                  tone={ic.tone}
                  size={22}
                  title={ic.name}
                />
              ))}
            </div>
          </div>

          {/* 4. Corner Radius Scale (Border Radius) & Density */}
          <div className="uxu-studio-section">
            <div className="uxu-studio-section__header">
              <span>Köşe Yuvarlaklığı (Border Radius)</span>
              <Badge tone="primary" size="xs">
                {preferences.customRadiusPx ?? 12}px
              </Badge>
            </div>
            <SegmentedControl<RadiusScale>
              value={preferences.radiusScale}
              onChange={setRadiusScale}
              fullWidth
              size="sm"
              options={[
                { value: 'sharp', label: 'Keskin (4px)' },
                { value: 'squircle', label: 'Squircle (12px)' },
                { value: 'pill', label: 'Pill (22px)' },
              ]}
            />
            <Slider
              label="Hassas Border Radius (px)"
              value={preferences.customRadiusPx ?? 12}
              onChange={setCustomRadiusPx}
              min={0}
              max={32}
              step={1}
              showTicks
              valueSuffix="px"
            />
            <div className="uxu-stage-row">
              {[0, 6, 12, 18, 26].map((px) => (
                <Button
                  key={px}
                  variant={
                    (preferences.customRadiusPx ?? 12) === px
                      ? 'filled'
                      : 'outlined'
                  }
                  size="xs"
                  onClick={() => setCustomRadiusPx(px)}
                >
                  {px}px
                </Button>
              ))}
            </div>
          </div>

          <div className="uxu-studio-section">
            <div className="uxu-studio-section__header">
              <span>Arayüz Yoğunluğu</span>
            </div>
            <SegmentedControl<UIDensity>
              value={preferences.density}
              onChange={setDensity}
              fullWidth
              size="sm"
              options={[
                { value: 'compact', label: 'Kompakt' },
                { value: 'comfortable', label: 'Dengeli' },
                { value: 'spacious', label: 'Ferah' },
              ]}
            />
          </div>

          {/* 5. Glass Blur */}
          <div className="uxu-studio-section">
            <Slider
              label="Cam Bulanıklığı (Blur)"
              value={preferences.glassIntensity}
              onChange={setGlassIntensity}
              min={0}
              max={100}
              step={5}
              valueSuffix="%"
              leadingIcon={<Sparkles size={15} />}
            />
          </div>

          {/* 6. Optional WebGL Background Toggle */}
          <div className="uxu-studio-section">
            <Switch
              label="Opsiyonel WebGL Ambiyansı"
              description="Varsayılan kapalı (0% GPU yükü)"
              value={preferences.webglEnabled}
              onChange={setWebglEnabled}
              size="sm"
            />

            {preferences.webglEnabled && (
              <div className="uxu-stack-sm" style={{ marginTop: 8 }}>
                <SegmentedControl<WebGLShaderPreset>
                  value={preferences.webglPreset}
                  onChange={setWebglPreset}
                  fullWidth
                  size="sm"
                  options={[
                    { value: 'aurora-borealis', label: 'Aurora' },
                    { value: 'spatial-nebula', label: 'Nebula' },
                    { value: 'material-lava', label: 'Küreler' },
                  ]}
                />
                <Slider
                  label="Ambiyans Yoğunluğu"
                  value={preferences.webglIntensity}
                  onChange={setWebglIntensity}
                  min={10}
                  max={80}
                  step={5}
                  valueSuffix="%"
                />
              </div>
            )}
          </div>

          {/* 6. Accessibility Motion Toggle */}
          <div className="uxu-studio-section">
            <Switch
              label="Hareketi Azalt (Reduced Motion)"
              description="Yay animasyonlarını sadeleştirir (Erişilebilirlik)"
              value={preferences.reducedMotion}
              onChange={setReducedMotion}
              size="sm"
            />
          </div>
        </div>

        <div className="uxu-theme-drawer__footer">
          <Button
            variant="outlined"
            size="sm"
            fullWidth
            leadingIcon={<RotateCcw size={15} />}
            onClick={resetPreferences}
          >
            Varsayılan uxiGL Ayarlarına Sıfırla
          </Button>
        </div>
      </aside>
    </div>
  );
};
