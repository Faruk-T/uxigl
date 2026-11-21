export const INSTALL_SNIPPET = `# 1. Tek Komutla uxiGL Kurulumu (SheetGL, FileManGL ve Simgeler Dahildir)
npm install truncgil-uxigl
# veya: pnpm add truncgil-uxigl | yarn add truncgil-uxigl | bun add truncgil-uxigl

# 2. NPX CLI ile Hazır Çalışma Alanı Bileşenini Otomatik Oluşturun
npx truncgil-uxigl init

# 3. Geliştirme Sunucusunu Başlatın
npm run dev`;

export const PROVIDER_SETUP_SNIPPET = `import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, ToastProvider } from 'truncgil-uxigl';
import 'truncgil-uxigl/styles';
import { App } from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>
);`;

export const QUICK_START_COMPONENT_SNIPPET = `import { useState } from 'react';
import { Card, Input, Switch, Button, Badge, useToast } from 'truncgil-uxigl';
import { Mail, Sparkles } from 'lucide-react';

export function QuickWorkspaceCard() {
  const { notify } = useToast();
  const [email, setEmail] = useState('mimar@uxigl.dev');
  const [rememberMe, setRememberMe] = useState(true);

  return (
    <Card
      variant="glass"
      title="uxiGL Çalışma Alanına Bağlan"
      subtitle="Liquid Glass Cam Yüzeyi × Dinamik Tonal Kontroller"
      headerAction={<Badge tone="success" pulse>Hazır</Badge>}
    >
      <div className="uxu-stack-md">
        <Input
          label="Kurumsal E-Posta"
          value={email}
          onChange={setEmail}
          leadingIcon={<Mail size={16} />}
          clearable
        />
        <Switch
          label="Oturumu Açık Tut ve Tema Tercihlerini Eşitle"
          value={rememberMe}
          onChange={setRememberMe}
          tone="primary"
        />
        <Button
          variant="filled"
          fullWidth
          leadingIcon={<Sparkles size={16} />}
          onClick={() =>
            notify({
              title: 'Bağlantı Kuruldu',
              description: \`Hoş geldiniz, \${email}\`,
              tone: 'success',
            })
          }
        >
          Çalışma Alanını Başlat
        </Button>
      </div>
    </Card>
  );
}`;

export const THEME_HOOK_SNIPPET = `import { useTheme, Button } from 'truncgil-uxigl';

export function ThemeSwitcherBar() {
  const {
    resolvedMode,
    preferences,
    availablePalettes,
    toggleMode,
    setSeedPalette,
    setCustomPrimaryHex,
    setCustomRadiusPx,
    setDensity,
  } = useTheme();

  return (
    <div className="uxu-stage-row">
      <Button variant="tonal" onClick={toggleMode}>
        Mod: {resolvedMode === 'dark' ? 'Dark' : 'Light'}
      </Button>
      {availablePalettes.map((palette) => (
        <Button
          key={palette.id}
          variant={preferences.seedPalette === palette.id ? 'filled' : 'outlined'}
          size="sm"
          onClick={() => setSeedPalette(palette.id)}
        >
          {palette.name}
        </Button>
      ))}
    </div>
  );
}`;

export const LAYOUT_SHELL_SNIPPET = `import { useState } from 'react';
import { Sidebar, TopHeader, type SidebarNavGroup } from 'truncgil-uxigl';

const SIDEBAR_GROUPS: SidebarNavGroup[] = [
  {
    id: 'grp-main',
    title: 'WORKSPACE',
    railLabel: 'DASH',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        subItems: [
          { id: 'overview', label: 'Overview' },
          { id: 'analytics', label: 'Analytics', badge: 'Live' },
        ],
      },
    ],
  },
];

export function EnterpriseLayout({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeSub, setActiveSub] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="uxu-app-frame">
      <Sidebar
        variant="stacked-vertical" // 'stacked-vertical' | 'standard' | 'mini-rail' | 'dual-column' | 'drawer'
        groups={SIDEBAR_GROUPS}
        activeItemId={activeSection}
        activeSubItemId={activeSub}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((p) => !p)}
        onSelect={(itemId, subId) => {
          setActiveSection(itemId);
          if (subId) setActiveSub(subId);
        }}
        onOpenCommandPalette={() => {}}
        onOpenThemeStudio={() => {}}
      />
      <div className="uxu-app-body">
        <main className="uxu-workspace-viewport">{children}</main>
      </div>
    </div>
  );
}`;

export const TOAST_CMD_SNIPPET = `import { useToast, useKeyboardShortcut, Button } from 'truncgil-uxigl';

export function NotificationAndShortcutDemo() {
  const { notify } = useToast();

  useKeyboardShortcut('b', () => {
    notify({
      title: 'Kısayol Tetiklendi (⌘B)',
      description: 'Arka plan derleme işlemi başlatıldı.',
      tone: 'info',
      placement: 'top-right',
    });
  }, { metaOrCtrl: true });

  return (
    <Button
      variant="filled"
      onClick={() =>
        notify({
          title: 'Kayıt Başarıyla Güncellendi',
          description: 'Değişiklikler tüm kümelere senkronize edildi.',
          tone: 'success',
          placement: 'bottom-right',
          actionLabel: 'Geri Al',
          onAction: () => console.log('Geri alındı'),
        })
      }
    >
      Bildirim Gönder
    </Button>
  );
}`;
