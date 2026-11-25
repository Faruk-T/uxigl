import { Building2, Pipette } from 'lucide-react';
import { SegmentedControl } from '../../components/composites';
import { Badge, Button, Slider } from '../../components/primitives';
import type {
  BorderContrastPreset,
  RadiusScale,
  ThemeContextContract,
} from '../../core/contracts/ThemeContract';

const BRAND_HEX_SWATCHES = [
  { hex: '#6366F1', label: 'Indigo' },
  { hex: '#0EA5E9', label: 'Sky' },
  { hex: '#10B981', label: 'Emerald' },
  { hex: '#F59E0B', label: 'Amber' },
  { hex: '#EC4899', label: 'Pink' },
  { hex: '#8B5CF6', label: 'Violet' },
  { hex: '#EF4444', label: 'Crimson' },
  { hex: '#14B8A6', label: 'Teal' },
];

export function StudioColorsAndBordersTab({
  theme,
  onOpenInstitutionBranding,
}: {
  theme: ThemeContextContract;
  onOpenInstitutionBranding?: () => void;
}) {
  const {
    preferences,
    resolvedMode,
    availablePalettes,
    setSeedPalette,
    setCustomPrimaryHex,
    setBorderContrast,
    setBorderWidthPx,
    setRadiusScale,
    setCustomRadiusPx,
  } = theme;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="uxu-studio-section">
        <div className="uxu-studio-section__header">
          <span>Tohum Renk Paleti (Seed Color Harmony)</span>
          {preferences.customPrimaryHex && (
            <Badge tone="warning" size="xs">
              Özel HEX: {preferences.customPrimaryHex.toUpperCase()}
            </Badge>
          )}
        </div>
        <div className="uxu-palette-grid">
          {availablePalettes.map((palette) => {
            const isSelected = preferences.seedPalette === palette.id && !preferences.customPrimaryHex;
            const colors = resolvedMode === 'dark' ? palette.dark : palette.light;
            return (
              <button
                key={palette.id}
                type="button"
                onClick={() => {
                  setCustomPrimaryHex(undefined);
                  setSeedPalette(palette.id);
                }}
                className={`uxu-palette-card ${isSelected ? 'uxu-palette-card--active' : ''}`}
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

        <div className="uxu-custom-hex-box">
          <div className="uxu-custom-hex-box__top">
            <div className="uxu-custom-hex-box__label">
              <Pipette size={14} className="uxu-text-primary" />
              <div>
                <strong>Özel Marka Rengi Sentezleyici (HEX)</strong>
                <small>Tek bir marka renginden tüm uxiGL &amp; SheetGL tonlarını üretir</small>
              </div>
            </div>
            <div className="uxu-custom-hex-box__picker-wrap">
              <input
                type="color"
                aria-label="Özel marka rengi seçin"
                className="uxu-custom-hex-box__color-input"
                value={preferences.customPrimaryHex ?? '#6366F1'}
                onChange={(e) => setCustomPrimaryHex(e.target.value)}
              />
              <code className="uxu-custom-hex-box__code">
                {(preferences.customPrimaryHex ?? 'Palet').toUpperCase()}
              </code>
              {preferences.customPrimaryHex && (
                <Button variant="ghost" size="xs" onClick={() => setCustomPrimaryHex(undefined)}>
                  Temizle
                </Button>
              )}
            </div>
          </div>
          <div className="uxu-custom-hex-box__swatches">
            {BRAND_HEX_SWATCHES.map((sw) => (
              <button
                key={sw.hex}
                type="button"
                title={`${sw.label} (${sw.hex})`}
                className={`uxu-custom-hex-swatch ${
                  preferences.customPrimaryHex?.toUpperCase() === sw.hex.toUpperCase()
                    ? 'uxu-custom-hex-swatch--active'
                    : ''
                }`}
                style={{ background: sw.hex }}
                onClick={() => setCustomPrimaryHex(sw.hex)}
              />
            ))}
          </div>
        </div>

        {onOpenInstitutionBranding && (
          <Button
            variant="tonal"
            size="xs"
            fullWidth
            leadingIcon={<Building2 size={14} />}
            onClick={onOpenInstitutionBranding}
          >
            Kurum Logosu &amp; Kurumsal Kimlik Stüdyosunu Aç
          </Button>
        )}
      </div>

      <div className="uxu-studio-section">
        <div className="uxu-studio-section__header">
          <span>Border Çizgileri &amp; Tablo Kılavuzu</span>
          <Badge tone="primary" size="xs">
            {(preferences.borderContrast ?? 'standard').toUpperCase()} • {preferences.borderWidthPx ?? 1}px
          </Badge>
        </div>
        <SegmentedControl<BorderContrastPreset>
          value={preferences.borderContrast ?? 'standard'}
          onChange={setBorderContrast}
          fullWidth
          size="sm"
          options={[
            { value: 'none', label: 'Yok' },
            { value: 'subtle', label: 'Yumuşak' },
            { value: 'standard', label: 'Standart' },
            { value: 'strong', label: 'Belirgin' },
            { value: 'crisp', label: 'Keskin' },
          ]}
        />
        <Slider
          label="Border Çizgi Kalınlığı (px)"
          value={preferences.borderWidthPx ?? 1}
          onChange={setBorderWidthPx}
          min={0}
          max={2.5}
          step={0.5}
          valueSuffix="px"
        />
      </div>

      <div className="uxu-studio-section">
        <div className="uxu-studio-section__header">
          <span>Köşe Yuvarlaklığı (Border Radius)</span>
          <Badge tone="primary" size="xs">{preferences.customRadiusPx ?? 12}px</Badge>
        </div>
        <SegmentedControl<RadiusScale>
          value={preferences.radiusScale}
          onChange={setRadiusScale}
          fullWidth
          size="sm"
          options={[
            { value: 'sharp', label: 'Keskin' },
            { value: 'squircle', label: 'Squircle' },
            { value: 'pill', label: 'Kapsül' },
          ]}
        />
        <Slider
          label="Hassas Border Radius (px)"
          value={preferences.customRadiusPx ?? 12}
          onChange={setCustomRadiusPx}
          min={0}
          max={32}
          step={1}
          valueSuffix="px"
        />
      </div>
    </div>
  );
}
