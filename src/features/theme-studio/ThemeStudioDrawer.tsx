import React, { useState } from 'react';
import { GripHorizontal, Palette, RotateCcw, X } from 'lucide-react';
import { Badge } from '../../components/primitives';
import { GoogleIcon } from '../../components/primitives';
import type { SidebarVariant } from '../../core/contracts/NavigationContract';
import type { ConcreteWorkspaceShellId } from '../../core/contracts/ThemeContract';
import { useTheme } from '../../providers/ThemeProvider';
import { StudioColorsAndBordersTab } from './StudioColorsAndBordersTab';
import { StudioEffectsAndExportTab } from './StudioEffectsAndExportTab';
import { StudioShellAndAppearanceTab } from './StudioShellAndAppearanceTab';
import { StudioTypographyAndIconsTab } from './StudioTypographyAndIconsTab';
import { useFloatingStudioWindow } from './useFloatingStudioWindow';

export interface ThemeStudioDrawerProps {
  open: boolean;
  onClose: () => void;
  sidebarVariant?: SidebarVariant;
  onSidebarVariantChange?: (variant: SidebarVariant) => void;
  sidebarAccent?: string;
  onSidebarAccentChange?: (accent: string) => void;
  activeUserLabel?: string;
  defaultRoleShell?: ConcreteWorkspaceShellId;
  onOpenInstitutionBranding?: () => void;
}

type StudioDrawerTabId = 'appearance' | 'colors' | 'typography' | 'effects';

const STUDIO_DRAWER_CATEGORIES: Array<{
  id: StudioDrawerTabId;
  label: string;
  googleIcon: string;
  badgeBg: string;
}> = [
  {
    id: 'appearance',
    label: 'Kabuk & Görünüm',
    googleIcon: 'space_dashboard',
    badgeBg: 'linear-gradient(135deg, #3b82f6, #2563eb)',
  },
  {
    id: 'colors',
    label: 'Renkler & Kenarlık',
    googleIcon: 'palette',
    badgeBg: 'linear-gradient(135deg, #ec4899, #db2777)',
  },
  {
    id: 'typography',
    label: 'Yazı Tipi & İkonlar',
    googleIcon: 'text_fields',
    badgeBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
  },
  {
    id: 'effects',
    label: 'Efektler & Dışa Aktar',
    googleIcon: 'tune',
    badgeBg: 'linear-gradient(135deg, #10b981, #059669)',
  },
];

export const ThemeStudioDrawer: React.FC<ThemeStudioDrawerProps> = ({
  open,
  onClose,
  sidebarVariant: propSidebarVariant,
  onSidebarVariantChange,
  activeUserLabel,
  defaultRoleShell = 'enterprisegl',
  onOpenInstitutionBranding,
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<StudioDrawerTabId>('appearance');
  const win = useFloatingStudioWindow(open, onClose);

  const sidebarVariant: SidebarVariant =
    propSidebarVariant ?? theme.preferences.sidebarVariant ?? 'standard';

  const handleVariantChange = (nextVariant: SidebarVariant) => {
    theme.setSidebarVariant?.(nextVariant);
    onSidebarVariantChange?.(nextVariant);
  };

  if (!open) return null;

  return (
    <div className="uxu-theme-studio-backdrop" onClick={onClose} role="presentation">
      <div
        className="uxu-theme-modal"
        style={{
          width: win.size.width,
          height: win.size.height,
          ...(win.position
            ? { left: win.position.x, top: win.position.y, right: 'auto', bottom: 'auto' }
            : {}),
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="uxiGL Tema & Görünüm Stüdyosu"
      >
        <div
          className="uxu-theme-modal__header"
          onPointerDown={win.handleHeaderPointerDown}
          onPointerMove={win.handleHeaderPointerMove}
          onPointerUp={win.handleHeaderPointerUp}
          onPointerCancel={win.handleHeaderPointerUp}
          title="Sürüklemek için basılı tutup kaydırın"
        >
          <div className="uxu-theme-modal__title-group">
            <div
              style={{
                width: 32, height: 32, borderRadius: 'var(--uxu-radius-sm, 8px)',
                background: 'var(--uxu-primary-container)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}
            >
              <Palette size={17} className="uxu-text-primary" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 700 }}>uxiGL Tema Stüdyosu</h3>
                {activeUserLabel && (
                  <Badge tone="success" variant="tonal" size="xs">{activeUserLabel}</Badge>
                )}
              </div>
              <span
                style={{
                  fontSize: '0.72rem', color: 'var(--uxu-text-secondary)',
                  marginTop: 2, display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                <GripHorizontal size={13} style={{ opacity: 0.7 }} />
                Apple HIG 2 Sütunlu Sistem Ayarları • Başlıktan sürükleyin
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              type="button"
              className="uxu-modal__action-btn"
              onClick={win.handleResetPosition}
              title="Konum ve Boyutu Sıfırla"
              aria-label="Konum ve Boyutu Sıfırla"
            >
              <RotateCcw size={13} />
            </button>
            <button
              type="button"
              className="uxu-modal__close"
              onClick={onClose}
              aria-label="Paneli kapat (Esc)"
              title="Kapat (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '196px minmax(0, 1fr)',
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <aside
            style={{
              padding: '12px 10px',
              borderRight: '1px solid var(--uxu-border-subtle)',
              background: 'var(--uxu-surface-tonal)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              overflowY: 'auto',
            }}
          >
            {STUDIO_DRAWER_CATEGORIES.map((cat) => {
              const active = cat.id === activeTab;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveTab(cat.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                    padding: '8px 10px', borderRadius: 10, border: 'none',
                    background: active ? 'var(--uxu-primary-container)' : 'transparent',
                    color: active ? 'var(--uxu-primary)' : 'var(--uxu-text-primary)',
                    fontWeight: active ? 700 : 600, fontSize: 12.5, cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <span
                    style={{
                      width: 25, height: 25, borderRadius: 7, background: cat.badgeBg, color: '#ffffff',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}
                  >
                    <GoogleIcon name={cat.googleIcon} size={14} />
                  </span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </aside>

          <div className="uxu-theme-modal__body" style={{ overflowY: 'auto', padding: '16px 20px' }}>
            {activeTab === 'appearance' && (
              <StudioShellAndAppearanceTab
                theme={theme}
                defaultRoleShell={defaultRoleShell}
                sidebarVariant={sidebarVariant}
                onVariantChange={handleVariantChange}
              />
            )}
            {activeTab === 'colors' && (
              <StudioColorsAndBordersTab
                theme={theme}
                onOpenInstitutionBranding={onOpenInstitutionBranding}
              />
            )}
            {activeTab === 'typography' && <StudioTypographyAndIconsTab theme={theme} />}
            {activeTab === 'effects' && <StudioEffectsAndExportTab theme={theme} />}
          </div>
        </div>

        <div
          className="uxu-theme-modal__resizer"
          onPointerDown={win.handleResizePointerDown}
          onPointerMove={win.handleResizePointerMove}
          onPointerUp={win.handleResizePointerUp}
          onPointerCancel={win.handleResizePointerUp}
          title="Boyutlandırmak için sürükleyin"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M9 1L1 9M9 5L5 9M9 9L9 9.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
};
