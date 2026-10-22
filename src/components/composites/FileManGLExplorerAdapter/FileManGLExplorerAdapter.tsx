import React, { useCallback, useEffect, useState } from 'react';
import {
  FileManGL,
  I18nProvider,
  DEFAULT_FILE_MANAGER_CONFIG,
  type IFileManagerConfig,
  type ExplorerViewMode,
  type SupportedLocale,
} from 'filemangl';
import 'filemangl/style.css';
import {
  HardDrive,
  Columns,
  Sparkles,
  PieChart,
  Grid,
  List,
  Eye,
  Shield,
} from 'lucide-react';
import { useTheme } from '../../../providers/ThemeProvider';
import { Badge } from '../../primitives';

export interface FileManGLExplorerAdapterProps {
  defaultViewMode?: ExplorerViewMode;
  enableDualPane?: boolean;
  enableRibbonToolbar?: boolean;
  enableDetailsInspector?: boolean;
  locale?: SupportedLocale;
  driverType?: 'vfs_memory' | 'vfs_localstorage' | 'rest_connector';
  height?: number | string;
  showQuickToolbar?: boolean;
}

export const FileManGLExplorerAdapter: React.FC<
  FileManGLExplorerAdapterProps
> = ({
  defaultViewMode = 'large_icons',
  enableDualPane = false,
  enableRibbonToolbar = true,
  enableDetailsInspector = true,
  locale = 'tr',
  driverType = 'vfs_localstorage',
  height = 600,
  showQuickToolbar = true,
}) => {
  const { resolvedMode, preferences, activePalette } = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [config, setConfig] = useState<IFileManagerConfig>(() => ({
    ...DEFAULT_FILE_MANAGER_CONFIG,
    volumeName: 'UXU Enterprise Cloud VFS',
    mountPath: '/Volumes/UXU-Cloud',
    theme: resolvedMode,
    fontScale: preferences.fontScale,
    borderRadius: preferences.radiusScale,
    accentColor:
      resolvedMode === 'dark'
        ? activePalette.dark.primary
        : activePalette.light.primary,
    inheritHostTheme: true,
    locale,
    driverType,
    defaultViewMode,
    enableDualPane,
    enableRibbonToolbar,
    enableDetailsInspector,
    enableWebGLAcceleration:
      preferences.webglEnabled &&
      (defaultViewMode === 'webgl_spatial' ||
        defaultViewMode === 'webgl_diskmap'),
  }));

  // Keep FileManGL synchronized with UXU global Dark/Light theme, Radius, Accent Palette, Font Scale & WebGL state
  useEffect(() => {
    setConfig((prev) => ({
      ...prev,
      theme: resolvedMode,
      fontScale: preferences.fontScale,
      borderRadius: preferences.radiusScale,
      accentColor:
        resolvedMode === 'dark'
          ? activePalette.dark.primary
          : activePalette.light.primary,
      inheritHostTheme: true,
      enableWebGLAcceleration:
        preferences.webglEnabled &&
        (prev.defaultViewMode === 'webgl_spatial' ||
          prev.defaultViewMode === 'webgl_diskmap'),
    }));
  }, [
    resolvedMode,
    preferences.fontScale,
    preferences.radiusScale,
    preferences.webglEnabled,
    activePalette,
  ]);

  // Keep controlled Playground props in sync
  useEffect(() => {
    setConfig((prev) => ({
      ...prev,
      defaultViewMode,
      enableDualPane,
      enableRibbonToolbar,
      enableDetailsInspector,
      locale,
      driverType,
    }));
  }, [
    defaultViewMode,
    enableDualPane,
    enableRibbonToolbar,
    enableDetailsInspector,
    locale,
    driverType,
  ]);

  const handleUpdateConfig = useCallback(
    (patch: Partial<IFileManagerConfig>) => {
      setConfig((prev) => {
        const nextView = patch.defaultViewMode ?? prev.defaultViewMode;
        return {
          ...prev,
          ...patch,
          enableWebGLAcceleration:
            preferences.webglEnabled &&
            (nextView === 'webgl_spatial' || nextView === 'webgl_diskmap'),
        };
      });
    },
    [preferences.webglEnabled]
  );

  return (
    <div className="uxu-filemangl-wrapper">
      {showQuickToolbar && (
        <div className="uxu-sheetgl-toolbar">
          <div className="uxu-sheetgl-toolbar__left">
            <Badge tone="primary" pulse>
              <HardDrive size={11} /> FileManGL v1.0.4 WebGL2 VFS
            </Badge>
            <div className="uxu-sheetgl-pill-group">
              {(
                [
                  {
                    id: 'large_icons',
                    label: 'Grid',
                    icon: <Grid size={11} />,
                  },
                  { id: 'details', label: 'Detay', icon: <List size={11} /> },
                  {
                    id: 'webgl_spatial',
                    label: '3D Spatial WebGL',
                    icon: <Sparkles size={11} />,
                  },
                  {
                    id: 'webgl_diskmap',
                    label: 'Disk Haritası',
                    icon: <PieChart size={11} />,
                  },
                ] as const
              ).map((vm) => (
                <button
                  key={vm.id}
                  type="button"
                  className={`uxu-sheetgl-pill ${
                    config.defaultViewMode === vm.id
                      ? 'uxu-sheetgl-pill--active'
                      : ''
                  }`}
                  onClick={() =>
                    handleUpdateConfig({ defaultViewMode: vm.id })
                  }
                >
                  {vm.icon}
                  {vm.label}
                </button>
              ))}
            </div>
          </div>

          <div className="uxu-sheetgl-toolbar__right">
            <button
              type="button"
              className={`uxu-sheetgl-pill ${
                config.enableDualPane ? 'uxu-sheetgl-pill--active' : ''
              }`}
              onClick={() =>
                handleUpdateConfig({ enableDualPane: !config.enableDualPane })
              }
            >
              <Columns size={11} /> Çift Panel (Dual-Pane)
            </button>

            <button
              type="button"
              className={`uxu-sheetgl-pill ${
                config.enableDetailsInspector ? 'uxu-sheetgl-pill--active' : ''
              }`}
              onClick={() =>
                handleUpdateConfig({
                  enableDetailsInspector: !config.enableDetailsInspector,
                })
              }
            >
              <Eye size={11} /> Denetçi
            </button>

            <button
              type="button"
              className={`uxu-sheetgl-pill ${
                config.strictPermissionEnforcement
                  ? 'uxu-sheetgl-pill--active'
                  : ''
              }`}
              onClick={() =>
                handleUpdateConfig({
                  strictPermissionEnforcement:
                    !config.strictPermissionEnforcement,
                })
              }
              title="ACL + POSIX İzin Motoru"
            >
              <Shield size={11} /> ACL/POSIX
            </button>

            <div className="uxu-sheetgl-pill-group">
              {(['tr', 'en', 'de', 'ru'] as SupportedLocale[]).map((loc) => (
                <button
                  key={loc}
                  type="button"
                  className={`uxu-sheetgl-pill ${
                    config.locale === loc ? 'uxu-sheetgl-pill--active' : ''
                  }`}
                  onClick={() => handleUpdateConfig({ locale: loc })}
                >
                  {loc.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div
        className={`uxu-filemangl-host ${
          resolvedMode === 'light' ? 'theme-light' : 'theme-dark'
        }`}
        style={{
          height: typeof height === 'number' ? `${height}px` : height,
        }}
      >
        <I18nProvider
          locale={config.locale}
          onLocaleChange={(nextLocale) =>
            handleUpdateConfig({ locale: nextLocale })
          }
        >
          <FileManGL
            config={config}
            onConfigChange={handleUpdateConfig}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen((p) => !p)}
          />
        </I18nProvider>
      </div>
    </div>
  );
};
