import React from 'react';
import { Code2 } from 'lucide-react';
import { Badge, Slider, Switch } from '../../../components/primitives';
import { Card, SegmentedControl } from '../../../components/composites';
import { useTheme } from '../../../providers/ThemeProvider';
import { DocsCodeBox } from '../components/DocsCodeBox';
import { THEME_HOOK_SNIPPET } from '../data/gettingStartedSnippets';
import type {
  FontFamilyPreset,
  GoogleIconStyle,
} from '../../../core/contracts/ThemeContract';

export interface ThemingTokensFontsSectionProps {
  isTR: boolean;
}

export const ThemingTokensFontsSection: React.FC<ThemingTokensFontsSectionProps> = ({
  isTR,
}) => {
  const {
    preferences,
    resolvedMode,
    activePalette,
    availableFontPresets,
    setFontFamilyPreset,
    setIconStyle,
    setIconFilled,
    setIconWeight,
  } = useTheme();

  const activeColorSet =
    resolvedMode === 'dark' ? activePalette.dark : activePalette.light;

  return (
    <div className="uxu-stack-md">
      <Card
        variant="tonal"
        title={
          isTR
            ? 'Aktif CSS Değişkenleri & useTheme() Kodu'
            : 'Active CSS Variables & useTheme() Usage'
        }
        subtitle={`${isTR ? 'Aktif palet' : 'Active palette'}: ${activePalette.name} (${resolvedMode.toUpperCase()})`}
        headerIcon={<Code2 size={19} />}
      >
        <div className="uxu-stage-grid-2" id="doc-sec-theme-tokens">
          <div className="uxu-token-swatch-grid">
            {[
              { varName: '--uxu-primary', val: activeColorSet.primary, label: 'Primary Accent' },
              { varName: '--uxu-primary-container', val: activeColorSet.primaryContainer, label: 'Primary Container' },
              { varName: '--uxu-secondary', val: activeColorSet.secondary, label: 'Secondary Accent' },
              { varName: '--uxu-accent-glow', val: activeColorSet.accentGlow, label: 'Accent Glow' },
              { varName: '--uxu-bg-canvas', val: activeColorSet.bgCanvas, label: 'Canvas Background' },
              { varName: '--uxu-bg-elevated', val: activeColorSet.surfaceElevated, label: 'Elevated Surface' },
            ].map((t) => (
              <div key={t.varName} className="uxu-token-swatch">
                <span className="uxu-token-swatch__color" style={{ background: t.val }} />
                <div style={{ minWidth: 0 }}>
                  <strong>{t.label}</strong>
                  <code>{t.varName}</code>
                  <div style={{ fontSize: '0.7rem', color: 'var(--uxu-text-muted)', fontFamily: 'var(--uxu-font-mono)' }}>
                    {t.val}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <DocsCodeBox
            title="ThemeSwitcherBar.tsx — useTheme()"
            code={THEME_HOOK_SNIPPET}
            isTR={isTR}
          />
        </div>
      </Card>

      <Card
        variant="glass"
        padding="md"
        eyebrow="TYPOGRAPHY & VARIABLE FONT ICONS"
        title={
          isTR
            ? '8 Yazı Tipi Ailesi & Değişken Vektör İkonlar'
            : '8 Font Presets & Variable Vector Icons'
        }
        subtitle={
          isTR
            ? 'Tüm Google Fonts ön ayarları ve GoogleIcon eksen (FILL, wght, Rounded/Outlined/Sharp) kontrolleri'
            : 'All 8 font presets and GoogleIcon variable axes (FILL, wght, Rounded/Outlined/Sharp)'
        }
      >
        <div className="uxu-stage-grid-2" id="doc-sec-fonts-icons">
          <div className="uxu-stack-sm">
            <div className="uxu-field__label">
              {isTR ? '1. Yazı Tipi Ailesi Seçin:' : '1. Choose Font Family:'}
            </div>
            {availableFontPresets.map((fp) => {
              const isSelected =
                (preferences.fontFamilyPreset ?? 'inter-jakarta') === fp.id;
              return (
                <button
                  key={fp.id}
                  type="button"
                  onClick={() => setFontFamilyPreset(fp.id as FontFamilyPreset)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--uxu-radius-md)',
                    border: isSelected
                      ? '1.5px solid var(--uxu-primary)'
                      : '1px solid var(--uxu-border-subtle)',
                    background: isSelected
                      ? 'var(--uxu-primary-container)'
                      : 'var(--uxu-surface-tonal)',
                    color: 'var(--uxu-text-primary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.88rem' }}>{fp.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--uxu-text-secondary)' }}>
                      {fp.badge} — {fp.description}
                    </div>
                  </div>
                  <Badge tone={isSelected ? 'primary' : 'neutral'} size="xs">
                    {isSelected ? (isTR ? 'Aktif' : 'Active') : isTR ? 'Seç' : 'Select'}
                  </Badge>
                </button>
              );
            })}
          </div>

          <div className="uxu-stack-md">
            <div className="uxu-field__label">
              {isTR ? '2. Değişken Vektör İkon Kontrolleri:' : '2. Variable Vector Icon Controls:'}
            </div>
            <SegmentedControl<GoogleIconStyle>
              size="sm"
              fullWidth
              value={preferences.iconStyle ?? 'rounded'}
              onChange={setIconStyle}
              options={[
                { value: 'rounded', label: 'Rounded' },
                { value: 'outlined', label: 'Outlined' },
                { value: 'sharp', label: 'Sharp' },
              ]}
            />
            <Switch
              size="sm"
              label={isTR ? 'İkon İç Dolgusu (FILL: 1)' : 'Icon Fill (FILL: 1)'}
              description={
                isTR
                  ? 'Değişken font ikonlarının FILL eksenini 0 ve 1 arasında değiştirir'
                  : 'Toggles the FILL axis between 0 and 1'
              }
              value={preferences.iconFilled ?? false}
              onChange={setIconFilled}
            />
            <Slider
              label={isTR ? 'İkon Çizgi Kalınlığı (wght)' : 'Icon Weight (wght)'}
              value={preferences.iconWeight ?? 400}
              min={200}
              max={700}
              step={100}
              showTicks
              onChange={(w) => setIconWeight(w as 100 | 200 | 300 | 400 | 500 | 600 | 700)}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
