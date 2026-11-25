import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { FolderOutput, Plus, Trash2, X } from 'lucide-react';
import { GoogleIcon } from '../../components/primitives';
import { FOLDER_COLOR_PRESETS } from './desktopFoldersAndDock';
import { FolderAppCatalogEditor } from './FolderAppCatalogEditor';
import {
  resolveIconSurface,
  type DesktopFolder,
  type IconBgStyle,
  type OSWorkspaceApp,
} from './types';

export function DesktopFolderPopoverModal({
  folder, allDesktopApps, isDark, primaryColor, iconBgStyle, iconBgColor,
  iconGradColor1, iconGradColor2, iconColor, onClose, onOpenApp,
  onRenameFolder, onRecolorFolder, onSetFolderApps, onRemoveAppFromFolder, onDissolveFolder,
}: {
  folder: DesktopFolder | null; allDesktopApps: OSWorkspaceApp[]; isDark: boolean;
  primaryColor: string; iconBgStyle: IconBgStyle; iconBgColor: string;
  iconGradColor1: string; iconGradColor2: string; iconColor: string;
  onClose: () => void; onOpenApp: (appId: string) => void;
  onRenameFolder: (folderId: string, nextName: string) => void;
  onRecolorFolder: (folderId: string, color: string) => void;
  onSetFolderApps: (folderId: string, nextAppIds: string[]) => void;
  onRemoveAppFromFolder: (folderId: string, appId: string) => void;
  onDissolveFolder: (folderId: string) => void;
}) {
  const [editingApps, setEditingApps] = useState(false);
  const [titleDraft, setTitleDraft] = useState(folder?.name ?? '');
  const [filterText, setFilterText] = useState('');
  const [draggingAppId, setDraggingAppId] = useState<string | null>(null);
  const [outsideHover, setOutsideHover] = useState(false);

  useEffect(() => {
    if (folder) {
      setTitleDraft(folder.name);
      setEditingApps(folder.appIds.length === 0);
      setFilterText('');
      setDraggingAppId(null);
      setOutsideHover(false);
    }
  }, [folder]);

  const folderApps = useMemo(() => {
    if (!folder) return [];
    return folder.appIds
      .map((id) => allDesktopApps.find((a) => a.id === id))
      .filter((a): a is OSWorkspaceApp => Boolean(a));
  }, [folder, allDesktopApps]);

  const filteredCatalog = useMemo(() => {
    const q = filterText.trim().toLocaleLowerCase('tr-TR');
    if (!q) return allDesktopApps;
    return allDesktopApps.filter(
      (a) => a.label.toLocaleLowerCase('tr-TR').includes(q) || a.category.toLocaleLowerCase('tr-TR').includes(q)
    );
  }, [allDesktopApps, filterText]);

  if (!folder) return null;
  const accent = folder.color || primaryColor;

  const modal = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${folder.name} Klasörü`}
      data-macos-context="true"
      data-folder-drop-backdrop="true"
      onClick={onClose}
      onDragOver={(e) => {
        if (!draggingAppId) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (!outsideHover) setOutsideHover(true);
      }}
      onDragLeave={(e) => {
        if (e.currentTarget === e.target) setOutsideHover(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const droppedId = draggingAppId || e.dataTransfer.getData('text/osgl-folder-app');
        setDraggingAppId(null);
        setOutsideHover(false);
        if (droppedId) {
          const wasLast = folder.appIds.length <= 1;
          onRemoveAppFromFolder(folder.id, droppedId);
          if (wasLast) onClose();
        }
      }}
      style={{
        position: 'fixed', inset: 0, zIndex: 2300,
        background: outsideHover ? 'rgba(14, 165, 233, 0.16)' : 'rgba(15, 23, 42, 0.34)',
        backdropFilter: draggingAppId ? 'blur(3px)' : 'blur(8px)',
        boxShadow: outsideHover ? `inset 0 0 0 3px ${accent}` : 'none',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 12, padding: 20, transition: 'background 0.15s ease, box-shadow 0.15s ease',
      }}
    >
      {draggingAppId && (
        <div
          data-testid="folder-drag-out-banner"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '7px 16px', borderRadius: 999,
            background: outsideHover ? accent : 'rgba(15, 23, 42, 0.88)',
            color: '#ffffff', fontSize: 12.5, fontWeight: 700,
            boxShadow: '0 10px 28px rgba(0, 0, 0, 0.35)', pointerEvents: 'none',
          }}
        >
          <FolderOutput size={14} />
          <span>
            {outsideHover
              ? 'Bırakın: Masaüstüne Çıkarılacak'
              : 'Masaüstüne çıkarmak için klasör penceresinin dışına sürükleyin'}
          </span>
        </div>
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        onDragOver={(e) => {
          if (!draggingAppId) return;
          e.preventDefault();
          e.stopPropagation();
          if (outsideHover) setOutsideHover(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDraggingAppId(null);
          setOutsideHover(false);
        }}
        style={{
          width: 'min(660px, 94vw)', maxHeight: '80vh', borderRadius: 24,
          background: isDark ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 255, 255, 0.90)',
          color: isDark ? '#f8fafc' : '#0f172a',
          backdropFilter: 'blur(28px) saturate(175%)',
          border: `1.5px solid color-mix(in srgb, ${accent} 42%, rgba(255,255,255,0.28))`,
          boxShadow: '0 28px 72px rgba(0, 0, 0, 0.42)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
            padding: '14px 18px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(15,23,42,0.10)',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 200 }}>
            <input
              type="text"
              aria-label="Klasör Adını Düzenle"
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={() => onRenameFolder(folder.id, titleDraft || folder.name)}
              onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
              style={{
                fontSize: 16.5, fontWeight: 800, background: 'transparent',
                border: '1px solid transparent', borderRadius: 8, padding: '4px 8px',
                color: 'inherit', outline: 'none', flex: 1, minWidth: 185,
              }}
            />
            <div style={{ display: 'inline-flex', gap: 5 }}>
              {FOLDER_COLOR_PRESETS.map((hex) => (
                <button
                  key={hex} type="button" aria-label={`Klasör rengi ${hex}`}
                  onClick={() => onRecolorFolder(folder.id, hex)}
                  style={{
                    width: 16, height: 16, borderRadius: '50%', background: hex, padding: 0, cursor: 'pointer',
                    border: accent === hex ? '2px solid #ffffff' : '1px solid rgba(0,0,0,0.2)',
                    boxShadow: accent === hex ? `0 0 0 2px ${hex}` : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              type="button" onClick={() => setEditingApps((v) => !v)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 11px', borderRadius: 999, border: 'none',
                background: editingApps ? accent : isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.08)',
                color: editingApps ? '#ffffff' : 'inherit', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              }}
            >
              <Plus size={13} /> {editingApps ? 'Bitti' : 'Modül Ekle / Çıkar'}
            </button>
            <button
              type="button" title="Klasörü dağıt (modülleri masaüstüne geri çıkar)"
              onClick={() => onDissolveFolder(folder.id)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 999, border: 'none',
                background: 'rgba(239, 68, 68, 0.14)', color: '#ef4444', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              }}
            >
              <Trash2 size={13} /> Dağıt
            </button>
            <button
              type="button" aria-label="Klasörü Kapat" onClick={onClose}
              style={{
                width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(15,23,42,0.07)',
                color: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        <div style={{ padding: 18, overflowY: 'auto', flex: 1 }}>
          {editingApps ? (
            <FolderAppCatalogEditor
              folder={folder} filteredCatalog={filteredCatalog}
              filterText={filterText} setFilterText={setFilterText}
              isDark={isDark} accent={accent} onSetFolderApps={onSetFolderApps}
            />
          ) : folderApps.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '28px 12px', opacity: 0.78, fontSize: 13 }}>
              Bu klasörde henüz modül yok. Masaüstünden sürükleyip bırakabilir veya yukarıdan <strong>Modül Ekle / Çıkar</strong> diyebilirsiniz.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 14 }}>
                {folderApps.map((app) => {
                  const surf = resolveIconSurface(
                    app, iconBgStyle, primaryColor, isDark, iconColor, iconBgColor, iconGradColor1, iconGradColor2
                  );
                  const isBeingDragged = draggingAppId === app.id;
                  return (
                    <div
                      key={app.id} draggable data-folder-app-item={app.id}
                      onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = 'move';
                        e.dataTransfer.setData('text/osgl-folder-app', app.id);
                        setDraggingAppId(app.id);
                      }}
                      onDragEnd={() => { setDraggingAppId(null); setOutsideHover(false); }}
                      style={{
                        position: 'relative', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', gap: 6, cursor: 'grab',
                        opacity: isBeingDragged ? 0.45 : 1, transition: 'opacity 0.14s ease',
                      }}
                    >
                      <button
                        type="button" onClick={() => { onOpenApp(app.id); onClose(); }}
                        style={{
                          width: 56, height: 56, borderRadius: 15, border: surf.border ?? 'none',
                          background: surf.background, color: surf.color, cursor: 'grab',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 8px 18px rgba(0,0,0,0.24)',
                        }}
                      >
                        <GoogleIcon name={app.googleIcon} size={28} />
                      </button>
                      <button
                        type="button" title="Masaüstüne Çıkar" aria-label={`${app.label} modülünü masaüstüne çıkar`}
                        onClick={() => onRemoveAppFromFolder(folder.id, app.id)}
                        style={{
                          position: 'absolute', top: -4, right: 14, width: 20, height: 20, borderRadius: '50%',
                          border: 'none', background: 'rgba(15,23,42,0.78)', color: '#ffffff',
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        }}
                      >
                        <FolderOutput size={11} />
                      </button>
                      <span style={{ fontSize: 11.5, fontWeight: 600, textAlign: 'center', lineHeight: 1.2 }}>
                        {app.shortLabel || app.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div style={{ fontSize: 11.5, opacity: 0.62, textAlign: 'center' }}>
                İpucu: Bir modülü basılı tutup klasör dışına sürükleyerek masaüstüne çıkarabilirsiniz.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modal, document.body) : modal;
}
