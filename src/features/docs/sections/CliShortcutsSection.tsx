import React, { useState } from 'react';
import { Bell, Code2, Search } from 'lucide-react';
import { Button } from '../../../components/primitives';
import { Card } from '../../../components/composites';
import { useToast } from '../../../providers/ToastProvider';
import { DocsCodeBox } from '../components/DocsCodeBox';
import { TOAST_CMD_SNIPPET } from '../data/gettingStartedSnippets';
import type { ToastPlacement, ToastTone } from '../../../core/contracts/NotificationContract';

export interface CliShortcutsSectionProps {
  isTR: boolean;
  onOpenCommandPalette?: () => void;
}

const PLACEMENTS: Array<{ id: ToastPlacement; label: string }> = [
  { id: 'top-left', label: '↖ Sol Üst' },
  { id: 'top-center', label: '↑ Üst Orta' },
  { id: 'top-right', label: '↗ Sağ Üst' },
  { id: 'bottom-left', label: '↙ Sol Alt' },
  { id: 'bottom-right', label: '↘ Sağ Alt' },
];

const TONES: Array<{
  tone: ToastTone;
  label: string;
  variant: 'filled' | 'success' | 'warning' | 'danger' | 'tonal' | 'glass';
}> = [
  { tone: 'primary', label: 'Primary', variant: 'filled' },
  { tone: 'success', label: 'Success', variant: 'success' },
  { tone: 'warning', label: 'Warning', variant: 'warning' },
  { tone: 'danger', label: 'Danger', variant: 'danger' },
  { tone: 'info', label: 'Info', variant: 'tonal' },
  { tone: 'glass', label: 'Liquid Glass', variant: 'glass' },
];

export const CliShortcutsSection: React.FC<CliShortcutsSectionProps> = ({
  isTR,
  onOpenCommandPalette,
}) => {
  const { notify } = useToast();
  const [toastPlacement, setToastPlacement] = useState<ToastPlacement>('top-right');

  return (
    <div className="uxu-stack-md">
      <div className="uxu-stage-grid-2" id="doc-sec-toast-live">
        <Card
          variant="glass"
          title={
            isTR
              ? '5 Yönlü Bildirim (useToast) & Spotlight (⌘K)'
              : '5-Corner Toast (useToast) & Spotlight (⌘K)'
          }
          subtitle={
            isTR
              ? '5 ekran köşesinde ve 6 semantik/glass tonda bildirimleri canlı tetikleyin'
              : 'Trigger live notifications in 5 placements and 6 semantic/glass tones'
          }
          headerIcon={<Bell size={19} />}
        >
          <div className="uxu-stack-md">
            <div className="uxu-field__label">
              {isTR ? '1. Bildirim Ekran Yönü (placement):' : '1. Toast Placement:'}
            </div>
            <div className="uxu-stage-row" style={{ flexWrap: 'wrap', gap: 6 }}>
              {PLACEMENTS.map((pos) => (
                <Button
                  key={pos.id}
                  variant={toastPlacement === pos.id ? 'filled' : 'tonal'}
                  size="xs"
                  onClick={() => setToastPlacement(pos.id)}
                >
                  {pos.label}
                </Button>
              ))}
            </div>

            <div className="uxu-field__label">
              {isTR ? '2. Bildirim Tonlarını Tetikleyin (tone):' : '2. Trigger Toast Tones:'}
            </div>
            <div className="uxu-stage-row" style={{ flexWrap: 'wrap', gap: 6 }}>
              {TONES.map((t) => (
                <Button
                  key={t.tone}
                  variant={t.variant}
                  size="sm"
                  onClick={() =>
                    notify({
                      title: `${t.label} ${isTR ? 'Bildirimi' : 'Toast'}`,
                      description: `${isTR ? 'Konum' : 'Placement'}: ${toastPlacement}`,
                      tone: t.tone,
                      placement: toastPlacement,
                    })
                  }
                >
                  {t.label} Toast
                </Button>
              ))}
            </div>

            <div className="uxu-stage-divider" />

            <Button
              variant="glass"
              leadingIcon={<Search size={16} />}
              onClick={onOpenCommandPalette}
            >
              {isTR ? 'Spotlight Komut Paletini Aç (⌘K)' : 'Open Command Palette (⌘K)'}
            </Button>
          </div>
        </Card>

        <Card
          variant="tonal"
          title="useToast() & useKeyboardShortcut()"
          subtitle={
            isTR
              ? 'Herhangi bir bileşenden bildirim gönderme ve kısayol dinleme'
              : 'Dispatch notifications and listen to shortcuts anywhere'
          }
          headerIcon={<Code2 size={19} />}
        >
          <DocsCodeBox
            title="NotificationAndShortcutDemo.tsx"
            code={TOAST_CMD_SNIPPET}
            isTR={isTR}
          />
        </Card>
      </div>

      <Card
        variant="glass"
        padding="md"
        title={isTR ? 'Kancalar & Çekirdek Servisler' : 'Hooks & Core Services'}
        subtitle={
          isTR
            ? 'truncgil-uxigl tarafından dışa aktarılan kanca ve servisler'
            : 'Exported hooks and services from truncgil-uxigl'
        }
      >
        <div id="doc-sec-services-table" className="uxu-props-table-scroll">
          <table className="uxu-props-table">
            <thead>
              <tr>
                <th>{isTR ? 'Kanca / Servis' : 'Hook / Service'}</th>
                <th>{isTR ? 'Metodlar' : 'Methods'}</th>
                <th>{isTR ? 'Açıklama' : 'Description'}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="uxu-prop-name">useTheme()</code></td>
                <td><code>resolvedMode, preferences, setMode, setSeedPalette, setCustomPrimaryHex, setCustomRadiusPx, setDensity</code></td>
                <td>{isTR ? 'Tüm tema tercihlerini, renk paletini ve CSS tokenlarını yönetir.' : 'Manages all theme preferences, palettes, and CSS tokens.'}</td>
              </tr>
              <tr>
                <td><code className="uxu-prop-name">useToast()</code></td>
                <td><code>notify(&#123; title, description, tone, placement &#125;), dismiss(id), clearAll()</code></td>
                <td>{isTR ? '5 köşede ve 6 tonda bildirim tetikler.' : 'Triggers 5-corner toast notifications.'}</td>
              </tr>
              <tr>
                <td><code className="uxu-prop-name">useKeyboardShortcut()</code></td>
                <td><code>useKeyboardShortcut(key, callback, &#123; metaOrCtrl, shift, alt &#125;)</code></td>
                <td>{isTR ? 'Input odaklarını ezmeden global klavye kısayolları tanımlar.' : 'Registers safe global keyboard shortcuts.'}</td>
              </tr>
              <tr>
                <td><code className="uxu-prop-name">ThemeEngineService</code></td>
                <td><code>buildInheritedSheetGLTheme, generateThemeCssExport, resolveEffectiveModeTokens</code></td>
                <td>{isTR ? 'Tema CSS dışa aktarımı ve SheetGL tema kalıtımı sağlar.' : 'Provides CSS theme export and SheetGL theme inheritance.'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
