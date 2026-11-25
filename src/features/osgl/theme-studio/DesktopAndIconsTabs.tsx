import { Button, Slider } from '../../../components/primitives';
import { Switch } from '../../../components/primitives';
import type { GoogleIconStyle } from '../../../core/contracts/ThemeContract';
import type { IconBgStyle } from '../types';
import {
  StudioChoicePill,
  StudioFieldLabel,
  type OSThemeStudioProps,
} from './themeStudioTypes';

const ICON_SYMBOL_PRESETS = ['#ffffff', '#0f172a', '#38bdf8', '#fbbf24', '#10b981', '#ec4899'];

export function DesktopDockTab({
  dockVisible, setDockVisible, widgetsVisible, setWidgetsVisible,
  windowAnimation, setWindowAnimation, windowControlsSide = 'right', setWindowControlsSide,
  onResetIcons, onResetWidgets, onCreateFolder, onOpenDockCustomizer, onResetDock,
}: Pick<
  OSThemeStudioProps,
  | 'dockVisible' | 'setDockVisible' | 'widgetsVisible' | 'setWidgetsVisible'
  | 'windowAnimation' | 'setWindowAnimation' | 'windowControlsSide' | 'setWindowControlsSide'
  | 'onResetIcons' | 'onResetWidgets' | 'onCreateFolder' | 'onOpenDockCustomizer' | 'onResetDock'
>) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {setWindowControlsSide && (
        <div>
          <StudioFieldLabel>Pencere Kontrol Düğmeleri Konumu</StudioFieldLabel>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <StudioChoicePill active={windowControlsSide === 'right'} onClick={() => setWindowControlsSide('right')}>
              Sağ Taraf (Varsayılan)
            </StudioChoicePill>
            <StudioChoicePill active={windowControlsSide === 'left'} onClick={() => setWindowControlsSide('left')}>
              Sol Taraf (macOS)
            </StudioChoicePill>
          </div>
        </div>
      )}
      <div
        style={{
          display: 'flex', flexDirection: 'column', gap: 12, padding: 16, borderRadius: 14,
          background: 'var(--uxu-surface-tonal)', border: '1px solid var(--uxu-border-subtle)',
        }}
      >
        <Switch value={dockVisible} onChange={setDockVisible} label="Alt Dock Çubuğunu Göster" size="sm" />
        <Switch value={widgetsVisible} onChange={setWidgetsVisible} label="Masaüstü Widget Kartlarını Göster" size="sm" />
        <Switch value={windowAnimation} onChange={setWindowAnimation} label="Pencere Açılış / Kapanış Animasyonları" size="sm" />
      </div>

      {(onOpenDockCustomizer || onCreateFolder || onResetDock) && (
        <div>
          <StudioFieldLabel>Klasörler &amp; Alt Dock Kişiselleştirme</StudioFieldLabel>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {onOpenDockCustomizer && (
              <Button size="sm" variant="filled" onClick={onOpenDockCustomizer}>
                Dock Simgelerini Seç / Sırala
              </Button>
            )}
            {onCreateFolder && (
              <Button size="sm" variant="outlined" onClick={onCreateFolder}>
                + Yeni Masaüstü Klasörü
              </Button>
            )}
            {onResetDock && (
              <Button size="sm" variant="outlined" onClick={onResetDock}>
                Dock Varsayılanına Dön
              </Button>
            )}
          </div>
        </div>
      )}

      {(onResetIcons || onResetWidgets) && (
        <div>
          <StudioFieldLabel>Masaüstü Yerleşim Sıfırlama</StudioFieldLabel>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {onResetIcons && (
              <Button size="sm" variant="outlined" onClick={onResetIcons}>
                Simge Dizilimini Sıfırla
              </Button>
            )}
            {onResetWidgets && (
              <Button size="sm" variant="outlined" onClick={onResetWidgets}>
                Widget Konumlarını Sıfırla
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function IconsTab({
  theme,
  iconBgStyle,
  setIconBgStyle,
  iconBgColor = '',
  setIconBgColor,
  iconGradColor1 = '#0284c7',
  setIconGradColor1,
  iconGradColor2 = '#4f46e5',
  setIconGradColor2,
  iconColor = '',
  setIconColor,
  iconSizePx,
  setIconSizePx,
}: Pick<
  OSThemeStudioProps,
  | 'theme'
  | 'iconBgStyle'
  | 'setIconBgStyle'
  | 'iconBgColor'
  | 'setIconBgColor'
  | 'iconGradColor1'
  | 'setIconGradColor1'
  | 'iconGradColor2'
  | 'setIconGradColor2'
  | 'iconColor'
  | 'setIconColor'
  | 'iconSizePx'
  | 'setIconSizePx'
>) {
  const rawFontScale = theme.preferences.fontScale || 100;
  const fontScalePct = rawFontScale <= 5 ? Math.round(rawFontScale * 100) : Math.round(rawFontScale);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <StudioFieldLabel>Simge Arka Plan Stili (Icon Efektleri)</StudioFieldLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
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
            <StudioChoicePill
              key={opt.id}
              active={iconBgStyle === opt.id}
              onClick={() => setIconBgStyle(opt.id)}
            >
              {opt.label}
            </StudioChoicePill>
          ))}
        </div>

        {iconBgStyle === 'gradient' && setIconGradColor1 && setIconGradColor2 && (
          <div style={{ display: 'flex', gap: 14, marginTop: 10 }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <span>Renk 1</span>
              <input
                type="color"
                value={iconGradColor1}
                onChange={(e) => setIconGradColor1(e.target.value)}
              />
            </label>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <span>Renk 2</span>
              <input
                type="color"
                value={iconGradColor2}
                onChange={(e) => setIconGradColor2(e.target.value)}
              />
            </label>
          </div>
        )}

        {iconBgStyle === 'mono' && setIconBgColor && (
          <div style={{ marginTop: 10 }}>
            <input
              type="color"
              value={iconBgColor || '#2563eb'}
              onChange={(e) => setIconBgColor(e.target.value)}
            />
          </div>
        )}
      </div>

      {setIconColor && (
        <div>
          <StudioFieldLabel>İkon Sembol Rengi</StudioFieldLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
            <input
              type="color"
              aria-label="Özel ikon sembol rengi"
              value={iconColor || '#ffffff'}
              onChange={(e) => setIconColor(e.target.value)}
              style={{ width: 32, height: 28, padding: 1, borderRadius: 6, cursor: 'pointer' }}
            />
            {ICON_SYMBOL_PRESETS.map((hex) => (
              <button
                key={hex}
                type="button"
                aria-label={hex}
                onClick={() => setIconColor(hex)}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: hex,
                  border:
                    iconColor.toLowerCase() === hex
                      ? '2px solid var(--uxu-primary)'
                      : '1px solid var(--uxu-border-strong)',
                  cursor: 'pointer',
                  padding: 0,
                }}
              />
            ))}
            <StudioChoicePill active={!iconColor} onClick={() => setIconColor('')}>
              Otomatik
            </StudioChoicePill>
          </div>
        </div>
      )}

      <div>
        <StudioFieldLabel>Simge Büyüklüğü ({iconSizePx}px)</StudioFieldLabel>
        <Slider min={46} max={80} value={iconSizePx} onChange={setIconSizePx} />
      </div>

      <div>
        <StudioFieldLabel>Simge Yazı Boyutu Ölçeği ({fontScalePct}%)</StudioFieldLabel>
        <Slider
          min={80}
          max={125}
          value={fontScalePct}
          onChange={(pct) => theme.setFontScale(Math.round(pct))}
        />
      </div>

      <div>
        <StudioFieldLabel>İkon Stili &amp; Dolgu Tipi</StudioFieldLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {(['rounded', 'outlined', 'sharp'] as GoogleIconStyle[]).map((style) => (
            <StudioChoicePill
              key={style}
              active={theme.preferences.iconStyle === style}
              onClick={() => theme.setIconStyle(style)}
            >
              {style}
            </StudioChoicePill>
          ))}
          <StudioChoicePill
            active={Boolean(theme.preferences.iconFilled)}
            onClick={() => theme.setIconFilled(true)}
          >
            Dolgulu
          </StudioChoicePill>
          <StudioChoicePill
            active={!theme.preferences.iconFilled}
            onClick={() => theme.setIconFilled(false)}
          >
            Boş (Outlined)
          </StudioChoicePill>
        </div>
      </div>
    </div>
  );
}
