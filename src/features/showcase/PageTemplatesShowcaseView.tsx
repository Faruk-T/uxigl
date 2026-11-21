import React, { useState } from 'react';
import { Terminal, Copy, Maximize2, Minimize2 } from 'lucide-react';
import { Button, GoogleIcon } from '../../components/primitives';
import { useToast } from '../../providers/ToastProvider';
import { EnterpriseSettingsPage } from './EnterpriseSettingsPage';
import {
  LoginPage,
  RegisterPage,
  PricingPage,
  ProfilePage,
  InvoicePage,
  KanbanPage,
  StatusPage,
} from './pages';

export type PageTemplateId =
  | 'page-login'
  | 'page-register'
  | 'page-pricing'
  | 'page-profile'
  | 'page-invoice'
  | 'page-kanban'
  | 'page-status'
  | 'page-settings';

export interface PageTemplatesShowcaseViewProps {
  activePageId: PageTemplateId;
  onPageChange: (pageId: PageTemplateId) => void;
  onNavigateHome?: () => void;
  /** When true, displays a compact page-template switcher bar above the active page. */
  showHeader?: boolean;
}

const PAGE_TEMPLATE_META: Record<
  PageTemplateId,
  {
    label: string;
    shortLabel: string;
    icon: string;
  }
> = {
  'page-login': { label: 'Login & Kimlik Doğrulama', shortLabel: 'Login', icon: 'lock' },
  'page-register': { label: 'Kayıt, Onboarding & 2FA', shortLabel: 'Register & 2FA', icon: 'verified_user' },
  'page-pricing': { label: 'SaaS Fiyatlandırma & Paketler', shortLabel: 'Pricing', icon: 'sell' },
  'page-profile': { label: 'Kullanıcı Profili & Portfolyo', shortLabel: 'Profile', icon: 'person' },
  'page-invoice': { label: 'B2B e-Fatura & Ödeme', shortLabel: 'Invoice', icon: 'receipt_long' },
  'page-kanban': { label: 'Kanban Proje & Sprint Panosu', shortLabel: 'Kanban', icon: 'view_kanban' },
  'page-status': { label: '404 / 500 & Sistem Durumu', shortLabel: 'Status & 404', icon: 'monitoring' },
  'page-settings': { label: 'Enterprise Settings & Tercihler', shortLabel: 'Settings', icon: 'tune' },
};

const getTemplateSnippet = (id: PageTemplateId, label: string): string => {
  switch (id) {
    case 'page-login':
      return `import { LoginPage } from 'truncgil-uxigl';\n\nexport default function App() {\n  return <LoginPage />;\n}`;
    case 'page-register':
      return `import { RegisterPage } from 'truncgil-uxigl';\n\nexport default function App() {\n  return <RegisterPage />;\n}`;
    case 'page-pricing':
      return `import { PricingPage } from 'truncgil-uxigl';\n\nexport default function App() {\n  return <PricingPage />;\n}`;
    case 'page-profile':
      return `import { ProfilePage } from 'truncgil-uxigl';\n\nexport default function App() {\n  return <ProfilePage />;\n}`;
    case 'page-invoice':
      return `import { InvoicePage } from 'truncgil-uxigl';\n\nexport default function App() {\n  return <InvoicePage />;\n}`;
    case 'page-kanban':
      return `import { KanbanPage } from 'truncgil-uxigl';\n\nexport default function App() {\n  return <KanbanPage />;\n}`;
    case 'page-status':
      return `import { StatusPage } from 'truncgil-uxigl';\n\nexport default function App() {\n  return <StatusPage />;\n}`;
    case 'page-settings':
      return `import { EnterpriseSettingsPage } from 'truncgil-uxigl';\n\nexport default function App() {\n  return <EnterpriseSettingsPage />;\n}`;
    default:
      return `// ${label}`;
  }
};

export const PageTemplatesShowcaseView: React.FC<PageTemplatesShowcaseViewProps> = ({
  activePageId,
  onPageChange,
  onNavigateHome,
  showHeader = false,
}) => {
  const { notify } = useToast();
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const currentMeta = PAGE_TEMPLATE_META[activePageId] || PAGE_TEMPLATE_META['page-login'];

  const wrapperStyle: React.CSSProperties = isFullscreenPreview
    ? {
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--uxu-bg-canvas)',
        overflowY: 'auto',
        padding: '24px',
      }
    : {};

  return (
    <div className="uxu-stack-lg" style={wrapperStyle}>
      {showHeader && (
        <div className="uxu-stack-sm">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 6,
                overflowX: 'auto',
                paddingBottom: 2,
                flex: 1,
              }}
            >
              {(Object.keys(PAGE_TEMPLATE_META) as PageTemplateId[]).map((id) => {
                const meta = PAGE_TEMPLATE_META[id];
                const active = activePageId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onPageChange(id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 7,
                      padding: '6px 12px',
                      borderRadius: 'var(--uxu-radius-sm, 8px)',
                      border: active
                        ? '1px solid var(--uxu-primary)'
                        : '1px solid var(--uxu-border-subtle)',
                      background: active
                        ? 'var(--uxu-primary-container)'
                        : 'var(--uxu-surface-tonal)',
                      color: active
                        ? 'var(--uxu-primary)'
                        : 'var(--uxu-text-secondary)',
                      fontSize: '0.78rem',
                      fontWeight: active ? 600 : 500,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 140ms ease',
                    }}
                  >
                    <GoogleIcon name={meta.icon} size={15} filled={active} />
                    <span>{meta.shortLabel}</span>
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Button
                variant="tonal"
                size="sm"
                leadingIcon={<Terminal size={14} />}
                onClick={() => setShowCodeModal((p) => !p)}
              >
                {showCodeModal ? 'Kodu Gizle' : 'JSX'}
              </Button>
              <Button
                variant={isFullscreenPreview ? 'filled' : 'glass'}
                size="sm"
                leadingIcon={
                  isFullscreenPreview ? <Minimize2 size={14} /> : <Maximize2 size={14} />
                }
                onClick={() => setIsFullscreenPreview((p) => !p)}
              >
                {isFullscreenPreview ? 'Küçült' : 'Tam Ekran'}
              </Button>
            </div>
          </div>

          {showCodeModal && (
            <div
              style={{
                padding: 14,
                borderRadius: 'var(--uxu-radius-md)',
                background: 'var(--uxu-code-bg)',
                border: '1px solid var(--uxu-code-border)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: 'var(--uxu-primary)',
                    fontFamily: 'var(--uxu-font-mono)',
                  }}
                >
                  {activePageId}.tsx
                </span>
                <Button
                  variant="tonal"
                  size="sm"
                  leadingIcon={<Copy size={13} />}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      getTemplateSnippet(activePageId, currentMeta.label)
                    );
                    notify({
                      title: 'Şablon Kodu Kopyalandı',
                      description: 'Sayfa bileşen kodu panoya kopyalandı.',
                      tone: 'info',
                    });
                  }}
                >
                  Kopyala
                </Button>
              </div>
              <pre
                style={{
                  margin: 0,
                  fontSize: '0.76rem',
                  fontFamily: 'var(--uxu-font-mono)',
                  color: 'var(--uxu-code-text)',
                  overflowX: 'auto',
                }}
              >
                {getTemplateSnippet(activePageId, currentMeta.label)}
              </pre>
            </div>
          )}
        </div>
      )}

      {activePageId === 'page-login' && (
        <LoginPage onNavigateRegister={() => onPageChange('page-register')} />
      )}
      {activePageId === 'page-register' && (
        <RegisterPage onNavigateLogin={() => onPageChange('page-login')} />
      )}
      {activePageId === 'page-pricing' && (
        <PricingPage onSelectProPlan={() => onPageChange('page-invoice')} />
      )}
      {activePageId === 'page-profile' && <ProfilePage />}
      {activePageId === 'page-invoice' && <InvoicePage />}
      {activePageId === 'page-kanban' && <KanbanPage />}
      {activePageId === 'page-status' && (
        <StatusPage
          onNavigateHome={() =>
            onNavigateHome ? onNavigateHome() : onPageChange('page-login')
          }
        />
      )}
      {activePageId === 'page-settings' && <EnterpriseSettingsPage />}
    </div>
  );
};
