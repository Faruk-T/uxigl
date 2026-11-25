import { Check } from 'lucide-react';
import { GoogleIcon } from '../../components/primitives';
import type { DesktopFolder, OSWorkspaceApp } from './types';

export function FolderAppCatalogEditor({
  folder,
  filteredCatalog,
  filterText,
  setFilterText,
  isDark,
  accent,
  onSetFolderApps,
}: {
  folder: DesktopFolder;
  filteredCatalog: OSWorkspaceApp[];
  filterText: string;
  setFilterText: (v: string) => void;
  isDark: boolean;
  accent: string;
  onSetFolderApps: (folderId: string, nextAppIds: string[]) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <input
        type="search"
        placeholder="Klasöre eklenecek modülü ara..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        style={{
          width: '100%',
          padding: '8px 12px',
          borderRadius: 10,
          border: isDark ? '1px solid rgba(255,255,255,0.16)' : '1px solid rgba(15,23,42,0.14)',
          background: isDark ? 'rgba(255,255,255,0.06)' : '#ffffff',
          color: 'inherit',
          fontSize: 12.5,
          outline: 'none',
        }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
        {filteredCatalog.map((app) => {
          const checked = folder.appIds.includes(app.id);
          return (
            <button
              key={app.id}
              type="button"
              onClick={() => {
                const next = checked
                  ? folder.appIds.filter((id) => id !== app.id)
                  : [...folder.appIds, app.id];
                onSetFolderApps(folder.id, next);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
                padding: '8px 10px',
                borderRadius: 12,
                cursor: 'pointer',
                textAlign: 'left',
                border: checked
                  ? `1.5px solid ${accent}`
                  : isDark
                    ? '1px solid rgba(255,255,255,0.10)'
                    : '1px solid rgba(15,23,42,0.10)',
                background: checked ? `color-mix(in srgb, ${accent} 16%, transparent)` : 'transparent',
                color: 'inherit',
                minWidth: 0,
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <GoogleIcon name={app.googleIcon} size={17} />
                <span style={{ fontSize: 12.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {app.label}
                </span>
              </span>
              {checked && <Check size={14} style={{ color: accent, flexShrink: 0 }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
