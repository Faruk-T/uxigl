import React, { memo, useState } from 'react';
import { SheetGLGridAdapter } from '../../../components/composites/SheetGLGridAdapter/SheetGLGridAdapter';
import { FileManGLExplorerAdapter } from '../../../components/composites/FileManGLExplorerAdapter/FileManGLExplorerAdapter';
import { Calendar } from '../../../components/composites/Calendar';
import { Messenger } from '../../../components/composites/Messenger';
import { AnalyticsDashboardView } from '../../showcase/AnalyticsDashboardView';
import {
  AdminSubViews,
  type ExtendedAdminViewId,
} from '../../showcase/AdminSubViews';
import {
  LoginPage,
  RegisterPage,
  PricingPage,
  ProfilePage,
  InvoicePage,
  KanbanPage,
  StatusPage,
} from '../../showcase/pages';
import { EnterpriseSettingsPage } from '../../showcase/EnterpriseSettingsPage';
import { InteractivePlayground } from '../../playground/InteractivePlayground';
import { ArchitectureDocsView } from '../../docs/ArchitectureDocsView';
import type { EnterpriseOSApp } from './types';
import { ThemeStudioPanel, type ThemeStudioPanelProps } from './ThemeStudioPanel';

const ADMIN_VIEW_IDS = new Set<ExtendedAdminViewId>([
  'users',
  'products',
  'forms',
  'messages',
  'security',
]);

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
  const [selectedComponentId, setSelectedComponentId] = useState<string>('button');

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

  if (app.id === 'elements-overview') {
    return (
      <InteractivePlayground
        selectedComponentId={selectedComponentId}
        onSelectComponent={setSelectedComponentId}
        onOpenCommandPalette={() => {}}
      />
    );
  }

  if (app.id === 'messages') {
    return (
      <div className="macosgl-fullbleed">
        <div style={{ flex: 1, width: '100%', height: '100%', minHeight: 0 }}>
          <Messenger
            locale="tr"
            height="100%"
            storageKey="uxigl.osgl.messenger.v1"
            style={{ borderRadius: 0, border: 'none' }}
          />
        </div>
      </div>
    );
  }

  if (ADMIN_VIEW_IDS.has(app.id as ExtendedAdminViewId)) {
    return (
      <AdminSubViews
        viewId={app.id as ExtendedAdminViewId}
        onSelectElementComponent={setSelectedComponentId}
      />
    );
  }

  if (app.id === 'settings') {
    return <EnterpriseSettingsPage />;
  }

  if (app.id === 'docs') {
    return <ArchitectureDocsView />;
  }

  if (app.id === 'calendar') {
    return (
      <Calendar
        locale="tr"
        defaultView="week"
        showClock
        storageKey="uxigl.osgl.calendar.v1"
      />
    );
  }

  if (app.id === 'page-login') return <LoginPage />;
  if (app.id === 'page-register') return <RegisterPage />;
  if (app.id === 'page-pricing') return <PricingPage />;
  if (app.id === 'page-profile') return <ProfilePage />;
  if (app.id === 'page-invoice') return <InvoicePage />;
  if (app.id === 'page-kanban') return <KanbanPage />;
  if (app.id === 'page-status') return <StatusPage />;
  if (app.id === 'page-settings') return <EnterpriseSettingsPage />;

  if (app.id === 'os-theme-studio') {
    return <ThemeStudioPanel {...studioProps} />;
  }

  return <AdminSubViews viewId="forms" onSelectElementComponent={setSelectedComponentId} />;
});
