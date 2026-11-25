import { Monitor, Moon, Sun } from 'lucide-react';
import { SegmentedControl } from '../../components/composites';
import { Badge, Slider } from '../../components/primitives';
import type { SidebarVariant } from '../../core/contracts/NavigationContract';
import type {
  ConcreteWorkspaceShellId,
  ThemeContextContract,
  ThemeMode,
} from '../../core/contracts/ThemeContract';
import {
  getWorkspaceShellSpec,
  normalizeConcreteShellId,
} from '../../core/tokens/workspaceShellPresets';
import { WorkspaceShellGallery } from './WorkspaceShellGallery';

export function StudioShellAndAppearanceTab({
  theme,
  defaultRoleShell,
  sidebarVariant,
  onVariantChange,
}: {
  theme: ThemeContextContract;
  defaultRoleShell: ConcreteWorkspaceShellId;
  sidebarVariant: SidebarVariant;
  onVariantChange: (next: SidebarVariant) => void;
}) {
  const { preferences, resolvedMode, setMode, setWorkspaceShell, setSidebarWidth, setSidebarStackedWidth } =
    theme;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="uxu-studio-section">
        <div className="uxu-studio-section__header">
          <span>Uygulama Tasarımı &amp; Kabuk Giydirmesi (uxiGL)</span>
          <Badge tone="primary" size="xs">
            {getWorkspaceShellSpec(normalizeConcreteShellId(preferences.workspaceShell, defaultRoleShell)).name}
          </Badge>
        </div>
        <WorkspaceShellGallery
          value={preferences.workspaceShell}
          onChange={setWorkspaceShell}
          defaultRoleShell={defaultRoleShell}
        />
      </div>

      <div className="uxu-studio-section">
        <div className="uxu-studio-section__header">
          <span>Görünüm Modu (Dark / Light / System)</span>
          <Badge tone="primary" size="xs">Aktif: {resolvedMode.toUpperCase()}</Badge>
        </div>
        <SegmentedControl<ThemeMode>
          value={preferences.mode}
          onChange={setMode}
          fullWidth
          size="sm"
          options={[
            { value: 'light', label: 'Aydınlık', icon: <Sun size={14} /> },
            { value: 'dark', label: 'Karanlık', icon: <Moon size={14} /> },
            { value: 'system', label: 'Sistem', icon: <Monitor size={14} /> },
          ]}
        />
      </div>

      <div className="uxu-studio-section">
        <div className="uxu-studio-section__header">
          <span>Sidebar Navigasyon Düzeni (Klasik Kabuk)</span>
          <Badge tone="primary" size="xs">
            {sidebarVariant ? sidebarVariant.toUpperCase() : 'STANDARD'}
          </Badge>
        </div>
        <SegmentedControl<SidebarVariant>
          value={sidebarVariant}
          onChange={onVariantChange}
          fullWidth
          size="sm"
          options={[
            { value: 'stacked-vertical', label: 'Dikey' },
            { value: 'standard', label: 'Açık' },
            { value: 'mini-rail', label: 'Kapalı' },
            { value: 'dual-column', label: 'Çift Kolon' },
            { value: 'drawer', label: 'Çekmece' },
          ]}
        />

        <div
          style={{
            marginTop: 12,
            paddingTop: 10,
            borderTop: '1px solid var(--uxu-border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--uxu-text-secondary)', fontWeight: 600 }}>
              Sidebar Genişliği
            </span>
            <Badge tone="primary" size="xs">
              {sidebarVariant === 'stacked-vertical'
                ? (preferences.sidebarStackedWidth ?? 88)
                : (preferences.sidebarWidth ?? 256)}
              px
            </Badge>
          </div>

          {sidebarVariant === 'stacked-vertical' ? (
            <Slider
              min={80}
              max={160}
              step={2}
              value={preferences.sidebarStackedWidth ?? 88}
              onChange={(v) => setSidebarStackedWidth?.(v)}
            />
          ) : (
            <Slider
              min={200}
              max={380}
              step={4}
              value={preferences.sidebarWidth ?? 256}
              onChange={(v) => setSidebarWidth?.(v)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
