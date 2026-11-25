import { SegmentedControl } from '../../components/composites';
import { Badge, Button, Slider } from '../../components/primitives';
import { GoogleIcon, Switch } from '../../components/primitives';
import type {
  FontFamilyPreset,
  GoogleIconStyle,
  ThemeContextContract,
  UIDensity,
} from '../../core/contracts/ThemeContract';

export function StudioTypographyAndIconsTab({ theme }: { theme: ThemeContextContract }) {
  const {
    preferences,
    availableFontPresets,
    setFontFamilyPreset,
    setFontScale,
    setDensity,
    setIconStyle,
    setIconWeight,
    setIconFilled,
  } = theme;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="uxu-studio-section">
        <div className="uxu-studio-section__header">
          <span>Tipografi &amp; Yazı Tipi Ailesi</span>
          <Badge tone="primary" size="xs">
            {availableFontPresets.find(
              (f) => f.id === (preferences.fontFamilyPreset ?? 'inter-jakarta')
            )?.name ?? 'Inter × Jakarta'}
          </Badge>
        </div>
        <div className="uxu-palette-grid">
          {availableFontPresets.map((preset) => {
            const isSelected = (preferences.fontFamilyPreset ?? 'inter-jakarta') === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setFontFamilyPreset(preset.id as FontFamilyPreset)}
                className={`uxu-palette-card ${isSelected ? 'uxu-palette-card--active' : ''}`}
                style={{ fontFamily: preset.sansStack }}
              >
                <div className="uxu-palette-card__info">
                  <strong style={{ fontFamily: preset.displayStack }}>{preset.name}</strong>
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
              variant={(preferences.fontScale ?? 100) === pct ? 'filled' : 'outlined'}
              size="xs"
              onClick={() => setFontScale(pct)}
            >
              %{pct}
            </Button>
          ))}
        </div>
      </div>

      <div className="uxu-studio-section">
        <div className="uxu-studio-section__header">
          <span>Arayüz Boşluk Yoğunluğu (Apple HIG 8pt Grid)</span>
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

      <div className="uxu-studio-section">
        <div className="uxu-studio-section__header">
          <span>Değişken Vektör Font İkonlar</span>
          <Badge tone="info" size="xs">
            {(preferences.iconStyle ?? 'rounded').toUpperCase()} • wght: {preferences.iconWeight ?? 400}
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
          description="Değişken font ikonlarının FILL eksenini 0 ile 1 arasında değiştirir"
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
          ].map((ic) => (
            <GoogleIcon key={ic.name} name={ic.name} tone={ic.tone} size={22} title={ic.name} />
          ))}
        </div>
      </div>
    </div>
  );
}
