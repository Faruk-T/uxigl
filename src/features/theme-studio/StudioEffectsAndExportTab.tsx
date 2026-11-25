import { useState } from 'react';
import { Check, Code2, Copy, RotateCcw, Sparkles } from 'lucide-react';
import { SegmentedControl } from '../../components/composites';
import { Badge, Button, Slider } from '../../components/primitives';
import { Switch } from '../../components/primitives';
import type {
  ThemeContextContract,
  WebGLShaderPreset,
} from '../../core/contracts/ThemeContract';
import { generateThemeCssExport } from '../../core/services/ThemeEngineService';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';

export function StudioEffectsAndExportTab({ theme }: { theme: ThemeContextContract }) {
  const {
    preferences,
    resolvedMode,
    setGlassIntensity,
    setWebglEnabled,
    setWebglPreset,
    setWebglIntensity,
    setReducedMotion,
    resetPreferences,
  } = theme;

  const [exportFormat, setExportFormat] = useState<'css' | 'json'>('css');
  const { copied, copy } = useCopyToClipboard();

  const exportCodeString =
    exportFormat === 'css'
      ? generateThemeCssExport(preferences, resolvedMode)
      : JSON.stringify(preferences, null, 2);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="uxu-studio-section">
        <Slider
          label="Cam Bulanıklığı (Liquid Glass Blur)"
          value={preferences.glassIntensity}
          onChange={setGlassIntensity}
          min={0}
          max={100}
          step={5}
          valueSuffix="%"
          leadingIcon={<Sparkles size={15} />}
        />
      </div>

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

      <div className="uxu-studio-section">
        <Switch
          label="Hareketi Azalt (Reduced Motion)"
          description="Yay animasyonlarını sadeleştirir (Erişilebilirlik)"
          value={preferences.reducedMotion}
          onChange={setReducedMotion}
          size="sm"
        />
      </div>

      <div className="uxu-studio-section">
        <div className="uxu-studio-section__header">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Code2 size={14} className="uxu-text-primary" />
            Tema Dışa Aktarım Stüdyosu (CSS / JSON)
          </span>
          <Badge tone="success" size="xs">Canlı Token Çıktısı</Badge>
        </div>
        <SegmentedControl<'css' | 'json'>
          value={exportFormat}
          onChange={setExportFormat}
          fullWidth
          size="sm"
          options={[
            { value: 'css', label: 'CSS Variables (:root)' },
            { value: 'json', label: 'ThemeProvider JSON' },
          ]}
        />
        <pre className="uxu-theme-export-pre">
          <code>{exportCodeString}</code>
        </pre>
        <Button
          variant={copied ? 'success' : 'tonal'}
          size="sm"
          fullWidth
          leadingIcon={copied ? <Check size={15} /> : <Copy size={15} />}
          onClick={() => copy(exportCodeString)}
        >
          {copied
            ? 'Tema Kodu Panoya Kopyalandı!'
            : exportFormat === 'css'
              ? 'CSS Token Değişkenlerini Kopyala'
              : 'ThemeProvider JSON Yapılandırmasını Kopyala'}
        </Button>
      </div>

      <Button
        variant="outlined"
        size="sm"
        fullWidth
        leadingIcon={<RotateCcw size={15} />}
        onClick={resetPreferences}
      >
        Varsayılan Ayarlara Sıfırla
      </Button>
    </div>
  );
}
