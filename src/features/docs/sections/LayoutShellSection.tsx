import React from 'react';
import { Code2, Layout } from 'lucide-react';
import { Card } from '../../../components/composites';
import { SidebarShowcaseView } from '../../showcase/SidebarShowcaseView';
import { DocsCodeBox } from '../components/DocsCodeBox';
import { LAYOUT_SHELL_SNIPPET } from '../data/gettingStartedSnippets';

export interface LayoutShellSectionProps {
  isTR: boolean;
}

export const LayoutShellSection: React.FC<LayoutShellSectionProps> = ({
  isTR,
}) => {
  return (
    <div className="uxu-stack-md">
      <div className="uxu-stage-grid-2" id="doc-sec-grid-classes">
        <Card
          variant="glass"
          title={
            isTR
              ? 'CSS Yerleşim & Duyarlı Izgara Sınıfları'
              : 'CSS Layout & Responsive Grid Classes'
          }
          subtitle={
            isTR
              ? 'Mobil uyumlu yerleşimler için yerleşik CSS sınıfları'
              : 'Built-in CSS utility classes for responsive layouts'
          }
          headerIcon={<Layout size={19} />}
        >
          <div className="uxu-props-table-scroll">
            <table className="uxu-props-table">
              <thead>
                <tr>
                  <th>{isTR ? 'CSS Sınıfı' : 'CSS Class'}</th>
                  <th>{isTR ? 'Davranış' : 'Behavior'}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code className="uxu-prop-name">.uxu-app-frame</code></td>
                  <td>{isTR ? 'Sidebar + TopHeader + Viewport tam ekran iskeleti.' : 'Full-screen shell with Sidebar + TopHeader + Viewport.'}</td>
                </tr>
                <tr>
                  <td><code className="uxu-prop-name">.uxu-stage-grid-2</code></td>
                  <td>{isTR ? 'Masaüstünde 2 sütunlu, mobilde tek sütunlu ızgara.' : '2-column grid on desktop, single-column on mobile.'}</td>
                </tr>
                <tr>
                  <td><code className="uxu-prop-name">.uxu-stack-md</code></td>
                  <td>{isTR ? 'Dikey bileşenler arasında 14px boşluk.' : '14px vertical stack spacing.'}</td>
                </tr>
                <tr>
                  <td><code className="uxu-prop-name">.uxu-stage-row</code></td>
                  <td>{isTR ? 'Buton ve rozetler için sarmalanan yatay satır.' : 'Wrapping flex row for buttons and badges.'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          variant="tonal"
          title={
            isTR
              ? '5 Modlu <Sidebar /> & <TopHeader /> Kodu'
              : '5-Variant <Sidebar /> & <TopHeader /> Setup'
          }
          subtitle={
            isTR
              ? 'standard • mini-rail • dual-column • drawer • stacked-vertical'
              : 'standard • mini-rail • dual-column • drawer • stacked-vertical'
          }
          headerIcon={<Code2 size={19} />}
        >
          <div id="doc-sec-sidebar-code">
            <DocsCodeBox
              title="EnterpriseLayout.tsx"
              code={LAYOUT_SHELL_SNIPPET}
              isTR={isTR}
            />
          </div>
        </Card>
      </div>

      <div id="doc-sec-sidebar-live">
        <SidebarShowcaseView />
      </div>
    </div>
  );
};
