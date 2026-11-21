import React from 'react';
import { Button, Input } from '../../../components/primitives';
import { OS_WALLPAPERS, type OSWallpaperId } from '../OSGLEngine';
import type { BgMode } from './types';

export function BackgroundSettingsSection({
  wallpaper,
  setWallpaper,
  bgMode,
  setBgMode,
  solidBgColor,
  setSolidBgColor,
  bgGradColor1,
  setBgGradColor1,
  bgGradColor2,
  setBgGradColor2,
  customBgUrl,
  setCustomBgUrl,
  uploadedBgDataUrl,
  setUploadedBgDataUrl,
}: {
  wallpaper: OSWallpaperId;
  setWallpaper: (wp: OSWallpaperId) => void;
  bgMode: BgMode;
  setBgMode: (m: BgMode) => void;
  solidBgColor: string;
  setSolidBgColor: (c: string) => void;
  bgGradColor1: string;
  setBgGradColor1: (c: string) => void;
  bgGradColor2: string;
  setBgGradColor2: (c: string) => void;
  customBgUrl: string;
  setCustomBgUrl: (url: string) => void;
  uploadedBgDataUrl: string;
  setUploadedBgDataUrl: (url: string) => void;
}) {
  return (
    <>
      <div>
        <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>Arka Plan Türü</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(
            [
              { id: 'aurora', label: 'Aurora (WebGL)' },
              { id: 'gradient', label: 'Gradyan' },
              { id: 'solid', label: 'Düz Renk' },
              { id: 'image', label: 'Görsel / Link' },
            ] as Array<{ id: BgMode; label: string }>
          ).map((m) => (
            <Button
              key={m.id}
              size="sm"
              variant={bgMode === m.id ? 'filled' : 'outlined'}
              onClick={() => setBgMode(m.id)}
            >
              {m.label}
            </Button>
          ))}
        </div>
      </div>

      {bgMode === 'aurora' && (
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>
            OS Duvar Kağıtları (6 Özel Üretim)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {(Object.keys(OS_WALLPAPERS) as OSWallpaperId[]).map((key) => {
              const item = OS_WALLPAPERS[key];
              const active = wallpaper === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setWallpaper(key)}
                  style={{
                    padding: 6,
                    borderRadius: 12,
                    border: active ? '2px solid #3b82f6' : '1px solid rgba(148,163,184,0.28)',
                    background: 'transparent',
                    color: 'inherit',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ height: 34, borderRadius: 8, background: item.preview, marginBottom: 5 }} />
                  <div style={{ fontSize: 11, fontWeight: 700 }}>{item.name}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {bgMode === 'gradient' && (
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>
            Masaüstü Gradyan İki Renk Seçimi
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600 }}>
              <span>Renk 1</span>
              <input
                type="color"
                value={bgGradColor1}
                onChange={(e) => setBgGradColor1(e.target.value)}
                style={{ width: 34, height: 28, padding: 0, border: '1px solid rgba(148,163,184,0.35)', borderRadius: 8, background: 'transparent', cursor: 'pointer' }}
              />
            </label>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600 }}>
              <span>Renk 2</span>
              <input
                type="color"
                value={bgGradColor2}
                onChange={(e) => setBgGradColor2(e.target.value)}
                style={{ width: 34, height: 28, padding: 0, border: '1px solid rgba(148,163,184,0.35)', borderRadius: 8, background: 'transparent', cursor: 'pointer' }}
              />
            </label>
          </div>
        </div>
      )}

      {bgMode === 'solid' && (
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>Düz Arka Plan Rengi</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <input
              type="color"
              aria-label="Düz Arka Plan Rengi"
              value={solidBgColor}
              onChange={(e) => setSolidBgColor(e.target.value)}
              style={{ width: 36, height: 30, padding: 0, border: '1px solid rgba(148,163,184,0.35)', borderRadius: 8, background: 'transparent', cursor: 'pointer' }}
            />
            {['#0f172a', '#1e1b4b', '#064e3b', '#3f1d2b', '#e2e8f0', '#fef3c7'].map((hex) => (
              <button
                key={hex}
                type="button"
                onClick={() => setSolidBgColor(hex)}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 999,
                  backgroundColor: hex,
                  border: solidBgColor === hex ? '2px solid #3b82f6' : '1px solid rgba(148,163,184,0.45)',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        </div>
      )}

      {bgMode === 'image' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700 }}>
            Görsel Linki veya Dosya Yükle (localStorage'da Saklanır)
          </div>
          <Input
            placeholder="https://... görsel URL yapıştırın"
            value={customBgUrl}
            onChange={(val) => setCustomBgUrl(val)}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 10,
                border: '1px solid rgba(148,163,184,0.35)',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <span>Bilgisayardan Görsel Yükle</span>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    if (typeof reader.result === 'string') setUploadedBgDataUrl(reader.result);
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </label>
            {(uploadedBgDataUrl || customBgUrl) && (
              <Button
                size="sm"
                variant="outlined"
                onClick={() => {
                  setUploadedBgDataUrl('');
                  setCustomBgUrl('');
                }}
              >
                Görseli Temizle
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

