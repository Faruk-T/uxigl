import React, { useState } from 'react';
import { Code2, Lock, Mail, Sparkles, Terminal } from 'lucide-react';
import { Badge, Button, Input, Switch } from '../../../components/primitives';
import { Card } from '../../../components/composites';
import { useToast } from '../../../providers/ToastProvider';
import { DocsCodeBox } from '../components/DocsCodeBox';
import {
  INSTALL_SNIPPET,
  PROVIDER_SETUP_SNIPPET,
  QUICK_START_COMPONENT_SNIPPET,
} from '../data/gettingStartedSnippets';

export interface GettingStartedSectionProps {
  isTR: boolean;
}

export const GettingStartedSection: React.FC<GettingStartedSectionProps> = ({
  isTR,
}) => {
  const { notify } = useToast();
  const [demoEmail, setDemoEmail] = useState('mimar@uxigl.dev');
  const [demoPass, setDemoPass] = useState('••••••••••••');
  const [demoRemember, setDemoRemember] = useState(true);

  return (
    <div className="uxu-stack-md">
      <div className="uxu-stage-grid-2" id="doc-sec-install">
        <Card
          variant="glass"
          title={
            isTR
              ? 'Adım 1: Paket Kurulumu & CLI Başlatma'
              : 'Step 1: Package Install & CLI Init'
          }
          subtitle={
            isTR
              ? 'SheetGL, FileManGL ve tüm tema motoru tek pakette'
              : 'SheetGL, FileManGL, and full theme engine in one package'
          }
          headerIcon={<Terminal size={19} />}
        >
          <DocsCodeBox
            title="Terminal — npm / pnpm / yarn"
            code={INSTALL_SNIPPET}
            isTR={isTR}
          />
        </Card>

        <Card
          variant="tonal"
          title={
            isTR
              ? 'Adım 2: Provider Sarmalayıcı (main.tsx)'
              : 'Step 2: Provider Wrapper (main.tsx)'
          }
          subtitle={
            isTR
              ? 'Tema ve 5 yönlü bildirim altyapısını etkinleştirin'
              : 'Enable theme and 5-corner toast infrastructure'
          }
          headerIcon={<Code2 size={19} />}
        >
          <DocsCodeBox
            title="src/main.tsx"
            code={PROVIDER_SETUP_SNIPPET}
            isTR={isTR}
          />
        </Card>
      </div>

      <Card
        variant="glass"
        padding="md"
        eyebrow={isTR ? 'ADIM 3 • CANLI İLK ÖRNEK' : 'STEP 3 • LIVE STARTER'}
        title={
          isTR
            ? 'Canlı Başlangıç Örneği: Kodu İncele ve Sağda Dene'
            : 'Live Quick Start: Inspect Code & Test Live'
        }
        subtitle={
          isTR
            ? 'Sağdaki interaktif kart, soldaki TSX kodunun birebir çalışan çıktısıdır'
            : 'The interactive card on the right is the live output of the TSX code on the left'
        }
      >
        <div className="uxu-stage-grid-2" id="doc-sec-live-starter">
          <DocsCodeBox
            title="QuickWorkspaceCard.tsx"
            code={QUICK_START_COMPONENT_SNIPPET}
            isTR={isTR}
          />
          <Card
            variant="glass"
            title="uxiGL Çalışma Alanına Bağlan"
            subtitle="Liquid Glass Cam Yüzeyi × Dinamik Tonal Kontroller"
            headerAction={
              <Badge tone="success" pulse>
                Hazır
              </Badge>
            }
          >
            <div className="uxu-stack-md">
              <Input
                label="Kurumsal E-Posta"
                value={demoEmail}
                onChange={setDemoEmail}
                leadingIcon={<Mail size={16} />}
                clearable
              />
              <Input
                label="Erişim Anahtarı"
                type="password"
                value={demoPass}
                onChange={setDemoPass}
                leadingIcon={<Lock size={16} />}
              />
              <Switch
                label="Oturumu Açık Tut ve Tema Tercihlerini Eşitle"
                value={demoRemember}
                onChange={setDemoRemember}
                tone="primary"
              />
              <Button
                variant="filled"
                fullWidth
                leadingIcon={<Sparkles size={16} />}
                onClick={() =>
                  notify({
                    title: isTR ? 'Bağlantı Kuruldu' : 'Connected',
                    description: `${isTR ? 'Hoş geldiniz' : 'Welcome'}, ${demoEmail}`,
                    tone: 'success',
                  })
                }
              >
                {isTR ? 'Çalışma Alanını Başlat' : 'Launch Workspace'}
              </Button>
            </div>
          </Card>
        </div>
      </Card>

      <Card
        id="doc-sec-osgl-features"
        variant="glass"
        padding="md"
        eyebrow={isTR ? 'YENİ ÖZELLİKLER • SÜRÜM NOTLARI' : 'NEW FEATURES • RELEASE NOTES'}
        title={
          isTR
            ? 'Son Geliştirmeler: OSGL Masaüstü, Tema Stüdyosu & FileManGL'
            : 'Recent Updates: OSGL Desktop, Theme Studio & FileManGL'
        }
        subtitle={
          isTR
            ? 'Takvim, Mesajlaşma, OSGL masaüstü widget’ları, özelleştirilebilir tema stüdyosu ve 6 tam uygulama şablonu.'
            : 'Calendar, Messenger, OSGL desktop widgets, Theme Studio drawer, and 6 full app templates.'
        }
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 12,
          }}
        >
          {[
            {
              title: isTR ? 'OSGL Masaüstü & Widget’lar' : 'OSGL Desktop & Widgets',
              desc: isTR
                ? 'Sürüklenebilir pencereler, TimeFlow, Todo ve verimlilik widget’ları ile macOS benzeri kabuk.'
                : 'Draggable windows, TimeFlow, Todo, and productivity widgets in a desktop shell.',
            },
            {
              title: isTR ? 'Tema Stüdyosu Çekmecesi' : 'Theme Studio Drawer',
              desc: isTR
                ? 'Sürüklenebilir/boyutlandırılabilir canlı tema editörü ve tek tıkla CSS/JSON dışa aktarım.'
                : 'Draggable/resizable live theme editor with one-click CSS/JSON export.',
            },
            {
              title: isTR ? 'Takvim & Mesajlaşma' : 'Calendar & Messenger',
              desc: isTR
                ? '4 görünümlü sürükle-bırak takvim ve SOLID mimarili kurumsal sohbet modülü.'
                : '4-view drag-and-drop calendar and SOLID-architected enterprise chat module.',
            },
            {
              title: isTR ? '6 Tam Uygulama Şablonu' : '6 Full App Templates',
              desc: isTR
                ? 'EnterpriseGL, FlowGL, CargoGL, SynthGL, OSGL ve TesseraGL hazır şablonları.'
                : 'Ready-made EnterpriseGL, FlowGL, CargoGL, SynthGL, OSGL, and TesseraGL apps.',
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                padding: 12,
                borderRadius: 12,
                background: 'var(--uxu-surface-tonal)',
                border: '1px solid var(--uxu-border-subtle)',
              }}
            >
              <strong style={{ fontSize: '0.86rem' }}>{item.title}</strong>
              <p
                style={{
                  margin: '6px 0 0',
                  fontSize: '0.78rem',
                  color: 'var(--uxu-text-secondary)',
                  lineHeight: 1.5,
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card
        variant="tonal"
        padding="md"
        title={isTR ? 'Katmanlar & Modül Yapısı' : 'Layers & Module Architecture'}
        subtitle={
          isTR
            ? 'Core Contracts → Tokens & Services → Primitives → Composites → Showcases'
            : 'Core Contracts → Tokens & Services → Primitives → Composites → Showcases'
        }
      >
        <div id="doc-sec-solid" className="uxu-props-table-scroll">
          <table className="uxu-props-table">
            <thead>
              <tr>
                <th>{isTR ? 'Katman' : 'Layer'}</th>
                <th>{isTR ? 'Dizin / Dosyalar' : 'Directory / Files'}</th>
                <th>{isTR ? 'Sorumluluk' : 'Responsibility'}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="uxu-prop-name">Core Contracts</code></td>
                <td><code>src/core/contracts/*</code></td>
                <td>{isTR ? 'Tema, navigasyon, bildirim ve bileşen TypeScript sözleşmeleri.' : 'TypeScript contracts for theme, nav, toast, and components.'}</td>
              </tr>
              <tr>
                <td><code className="uxu-prop-name">Tokens &amp; Services</code></td>
                <td><code>src/core/tokens/*, services/*</code></td>
                <td>{isTR ? '6 palet, 8 yazı tipi, CSS motoru, yönlendirme ve depolama adaptörü.' : '6 palettes, 8 font presets, CSS engine, routing, and storage.'}</td>
              </tr>
              <tr>
                <td><code className="uxu-prop-name">Primitives</code></td>
                <td><code>src/components/primitives/*</code></td>
                <td>{isTR ? 'Button, Input, Select, CurrencyInput, Switch, Badge, Avatar vb. atomlar.' : 'Atomic form controls, badges, chips, avatars, and icons.'}</td>
              </tr>
              <tr>
                <td><code className="uxu-prop-name">Composites</code></td>
                <td><code>src/components/composites/*</code></td>
                <td>{isTR ? 'Card, Modal, Sidebar, TopHeader, DataTable, SheetGL, FileManGL, Calendar, Messenger.' : 'Cards, modals, shell, DataTable, SheetGL, FileManGL, Calendar, Messenger.'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
