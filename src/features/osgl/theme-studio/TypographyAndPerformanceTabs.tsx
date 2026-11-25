import { Button } from '../../../components/primitives';
import { Switch } from '../../../components/primitives';
import type { UIDensity } from '../../../core/contracts/ThemeContract';
import {
  StudioChoicePill,
  StudioFieldLabel,
  type OSThemeStudioProps,
} from './themeStudioTypes';

export function TypographyTab({ theme }: Pick<OSThemeStudioProps, 'theme'>) {
  const { preferences } = theme;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <StudioFieldLabel>Yazı Tipi Ailesi</StudioFieldLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
          {theme.availableFontPresets.map((preset) => {
            const active = preferences.fontFamilyPreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => theme.setFontFamilyPreset(preset.id)}
                style={{
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: active
                    ? '2px solid var(--uxu-primary)'
                    : '1px solid var(--uxu-border-subtle)',
                  background: active ? 'var(--uxu-primary-container)' : 'var(--uxu-bg-elevated)',
                  color: 'var(--uxu-text-primary)',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, fontFamily: preset.sansStack }}>
                  {preset.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--uxu-text-muted)', marginTop: 3 }}>
                  {preset.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <StudioFieldLabel>Arayüz Boşluk Yoğunluğu (Apple HIG 8pt Grid)</StudioFieldLabel>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(
            [
              { id: 'compact', label: 'Kompakt' },
              { id: 'comfortable', label: 'Dengeli (Önerilen)' },
              { id: 'spacious', label: 'Ferah' },
            ] as Array<{ id: UIDensity; label: string }>
          ).map((d) => (
            <StudioChoicePill
              key={d.id}
              active={preferences.density === d.id}
              onClick={() => theme.setDensity(d.id)}
            >
              {d.label}
            </StudioChoicePill>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PerformanceResetTab({
  theme,
  qualityMode,
  setQualityMode,
  onResetIcons,
  onResetWidgets,
}: Pick<
  OSThemeStudioProps,
  'theme' | 'qualityMode' | 'setQualityMode' | 'onResetIcons' | 'onResetWidgets'
>) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <StudioFieldLabel>Grafik ve Cam Efekt Modu</StudioFieldLabel>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <StudioChoicePill
            active={qualityMode === 'quality'}
            onClick={() => setQualityMode('quality')}
          >
            Kalite Modu (WebGL Aurora + Liquid Glass)
          </StudioChoicePill>
          <StudioChoicePill
            active={qualityMode === 'performance'}
            onClick={() => setQualityMode('performance')}
          >
            Performans Modu (Düşük GPU Kullanımı)
          </StudioChoicePill>
        </div>
      </div>

      <div
        style={{
          padding: 14,
          borderRadius: 12,
          background: 'var(--uxu-surface-tonal)',
          border: '1px solid var(--uxu-border-subtle)',
        }}
      >
        <Switch
          value={theme.preferences.reducedMotion}
          onChange={theme.setReducedMotion}
          label="Azaltılmış Hareket (Erişilebilirlik)"
          size="sm"
        />
      </div>

      <div>
        <StudioFieldLabel>Fabrika Ayarlarına Sıfırlama</StudioFieldLabel>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button
            size="sm"
            variant="outlined"
            onClick={() => {
              theme.resetPreferences();
              onResetIcons?.();
              onResetWidgets?.();
            }}
          >
            Tüm Tema ve Masaüstü Ayarlarını Sıfırla
          </Button>
        </div>
      </div>
    </div>
  );
}
