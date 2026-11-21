import React from 'react';
import { Button } from '../../../components/primitives';
import type { GoogleIconStyle } from '../../../core/contracts/ThemeContract';
import type { IconBgStyle } from './types';

export function IconSettingsSection({
  iconBgStyle,
  setIconBgStyle,
  iconBgColor,
  setIconBgColor,
  iconGradColor1,
  setIconGradColor1,
  iconGradColor2,
  setIconGradColor2,
  iconColor,
  setIconColor,
  iconStyle,
  setIconStyle,
  iconFilled,
  setIconFilled,
}: {
  iconBgStyle: IconBgStyle;
  setIconBgStyle: (s: IconBgStyle) => void;
  iconBgColor: string;
  setIconBgColor: (c: string) => void;
  iconGradColor1: string;
  setIconGradColor1: (c: string) => void;
  iconGradColor2: string;
  setIconGradColor2: (c: string) => void;
  iconColor: string;
  setIconColor: (c: string) => void;
  iconStyle?: GoogleIconStyle;
  setIconStyle: (s: GoogleIconStyle) => void;
  iconFilled?: boolean;
  setIconFilled: (f: boolean) => void;
}) {
  return (
    <>
      <div>
        <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>
          Simge Arka Plan Stili (Icon Efektleri)
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {(
            [
              { id: 'vivid', label: 'Çok Renkli' },
              { id: 'gradient', label: 'Gradyan (2 Renk)' },
              { id: 'soft', label: 'Soft Gradyan' },
              { id: 'glass', label: 'Liquid Glass' },
              { id: 'sun', label: 'Sun Glass' },
              { id: 'mono', label: 'Tek Renk' },
            ] as Array<{ id: IconBgStyle; label: string }>
          ).map((opt) => (
            <Button
              key={opt.id}
              size="sm"
              variant={iconBgStyle === opt.id ? 'filled' : 'outlined'}
              onClick={() => setIconBgStyle(opt.id)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {(iconBgStyle === 'mono' || iconBgStyle === 'soft') && (
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>Simge Arka Plan Rengi</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <input
              type="color"
              aria-label="Simge Arka Plan Rengi"
              value={iconBgColor || '#3b82f6'}
              onChange={(e) => setIconBgColor(e.target.value)}
              style={{ width: 34, height: 30, padding: 0, border: '1px solid rgba(148,163,184,0.35)', borderRadius: 8, background: 'transparent', cursor: 'pointer' }}
            />
            {['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#0f172a'].map((hex) => (
              <button
                key={hex}
                type="button"
                title={hex}
                onClick={() => setIconBgColor(hex)}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 999,
                  backgroundColor: hex,
                  border: iconBgColor === hex ? '2px solid #3b82f6' : '1px solid rgba(148,163,184,0.45)',
                  cursor: 'pointer',
                }}
              />
            ))}
            <Button size="sm" variant={!iconBgColor ? 'filled' : 'outlined'} onClick={() => setIconBgColor('')}>
              Tema Rengi
            </Button>
          </div>
        </div>
      )}

      {iconBgStyle === 'gradient' && (
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>
            Simge Gradyan Renkleri (2 Renk)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600 }}>
              <span>Renk 1</span>
              <input
                type="color"
                value={iconGradColor1}
                onChange={(e) => setIconGradColor1(e.target.value)}
                style={{ width: 34, height: 28, padding: 0, border: '1px solid rgba(148,163,184,0.35)', borderRadius: 8, background: 'transparent', cursor: 'pointer' }}
              />
            </label>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600 }}>
              <span>Renk 2</span>
              <input
                type="color"
                value={iconGradColor2}
                onChange={(e) => setIconGradColor2(e.target.value)}
                style={{ width: 34, height: 28, padding: 0, border: '1px solid rgba(148,163,184,0.35)', borderRadius: 8, background: 'transparent', cursor: 'pointer' }}
              />
            </label>
          </div>
        </div>
      )}

      <div>
        <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>İkon Sembol Rengi</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <input
            type="color"
            aria-label="Simge Rengi Seç"
            value={iconColor || '#ffffff'}
            onChange={(e) => setIconColor(e.target.value)}
            style={{ width: 34, height: 30, padding: 0, border: '1px solid rgba(148,163,184,0.35)', borderRadius: 8, background: 'transparent', cursor: 'pointer' }}
          />
          {['#ffffff', '#0f172a', '#38bdf8', '#fbbf24', '#34d399', '#f472b6'].map((hex) => (
            <button
              key={hex}
              type="button"
              title={hex}
              onClick={() => setIconColor(hex)}
              style={{
                width: 22,
                height: 22,
                borderRadius: 999,
                backgroundColor: hex,
                border: iconColor === hex ? '2px solid #3b82f6' : '1px solid rgba(148,163,184,0.45)',
                cursor: 'pointer',
              }}
            />
          ))}
          <Button size="sm" variant={!iconColor ? 'filled' : 'outlined'} onClick={() => setIconColor('')}>
            Otomatik
          </Button>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>İkon Stili & Dolgu Tipi</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(['rounded', 'outlined', 'sharp'] as GoogleIconStyle[]).map((st) => (
            <Button
              key={st}
              size="sm"
              variant={iconStyle === st ? 'filled' : 'outlined'}
              onClick={() => setIconStyle(st)}
            >
              {st}
            </Button>
          ))}
          <Button size="sm" variant={iconFilled ? 'filled' : 'outlined'} onClick={() => setIconFilled(true)}>
            Dolgulu
          </Button>
          <Button size="sm" variant={!iconFilled ? 'filled' : 'outlined'} onClick={() => setIconFilled(false)}>
            Boş (Outlined)
          </Button>
        </div>
      </div>
    </>
  );
}

