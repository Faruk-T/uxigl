import React, { memo, useState } from 'react';
import { Badge, Input, Switch } from '../../../components/primitives';
import { SheetGLGridAdapter } from '../../../components/composites/SheetGLGridAdapter/SheetGLGridAdapter';
import { FileManGLExplorerAdapter } from '../../../components/composites/FileManGLExplorerAdapter/FileManGLExplorerAdapter';
import { AnalyticsDashboardView } from '../../showcase/AnalyticsDashboardView';
import {
  PageTemplatesShowcaseView,
  type PageTemplateId,
} from '../../showcase/PageTemplatesShowcaseView';
import { EnterpriseSettingsPage } from '../../showcase/EnterpriseSettingsPage';
import { ArchitectureDocsView } from '../../docs/ArchitectureDocsView';
import type { EnterpriseOSApp } from './types';
import { ThemeStudioPanel, type ThemeStudioPanelProps } from './ThemeStudioPanel';

export const WindowContent = memo(function WindowContent({
  app,
  contentWidth,
  renderWindowContent,
  ...studioProps
}: {
  app: EnterpriseOSApp;
  contentWidth?: number;
  renderWindowContent?: (appId: string) => React.ReactNode;
} & ThemeStudioPanelProps) {
  const [activePage, setActivePage] = useState<PageTemplateId>(() =>
    app.id.startsWith('page-') ? (app.id as PageTemplateId) : 'page-login'
  );
  const [formSwitch, setFormSwitch] = useState(true);
  const [formInput, setFormInput] = useState('');

  if (renderWindowContent) {
    const custom = renderWindowContent(app.id);
    if (custom) return <>{custom}</>;
  }

  if (app.id === 'overview' || app.id === 'analytics' || app.id === 'reports') {
    return <AnalyticsDashboardView />;
  }

  if (app.id === 'analytics-telemetry' || app.id === 'datatable-statcard' || app.id === 'crm-orders') {
    return (
      <div className="macosgl-fullbleed">
        <SheetGLGridAdapter
          datasetPreset={app.id === 'analytics-telemetry' ? 'cloud-telemetry' : 'finance-erp'}
          height="100%"
        />
      </div>
    );
  }

  if (app.id === 'filemangl-explorer' || app.id === 'file-manager') {
    const showInspector = (contentWidth ?? 720) >= 920;
    return (
      <div className="macosgl-fullbleed">
        <FileManGLExplorerAdapter
          height="100%"
          enableDetailsInspector={showInspector}
        />
      </div>
    );
  }

  if (app.id === 'settings' || app.id === 'security') {
    return <EnterpriseSettingsPage />;
  }

  if (app.id === 'docs') {
    return <ArchitectureDocsView />;
  }

  if (app.id.startsWith('page-')) {
    return (
      <PageTemplatesShowcaseView
        activePageId={activePage}
        onPageChange={setActivePage}
        onNavigateHome={() => setActivePage('page-login')}
      />
    );
  }

  if (app.id === 'os-theme-studio') {
    return <ThemeStudioPanel {...studioProps} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>{app.label}</h3>
          <p style={{ margin: '2px 0 0', fontSize: 12.5, opacity: 0.72 }}>
            uxiGL {app.category} modülü — yüzen pencere içinde tam etkileşimli içerik.
          </p>
        </div>
        {app.badge && (
          <Badge variant="tonal" tone="info">
            {app.badge}
          </Badge>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <Input
            placeholder={`${app.label} içinde hızlı işlem veya arama...`}
            value={formInput}
            onChange={(val) => setFormInput(val)}
          />
        </div>
        <Switch value={formSwitch} onChange={setFormSwitch} />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 10,
        }}
      >
        {[
          { k: 'Aktif Kayıt', v: '1.248' },
          { k: 'Canlı Senkron', v: formSwitch ? 'Açık' : 'Duraklatıldı' },
          { k: 'Yanıt Süresi', v: '14 ms' },
        ].map((item) => (
          <div
            key={item.k}
            style={{
              padding: 12,
              borderRadius: 12,
              backgroundColor: 'rgba(148, 163, 184, 0.12)',
              border: '1px solid rgba(148, 163, 184, 0.18)',
            }}
          >
            <div style={{ fontSize: 11, opacity: 0.7 }}>{item.k}</div>
            <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>{item.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
});

