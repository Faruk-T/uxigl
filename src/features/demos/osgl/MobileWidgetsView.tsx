import React, { useState } from 'react';
import { Eye, EyeOff, SlidersHorizontal } from 'lucide-react';
import {
  DEFAULT_WIDGET_SIZES,
  type DesktopWidgetId,
  type QualityMode,
} from './types';
import {
  createWidgetBaseTheme,
  DESKTOP_WIDGET_ORDER,
  renderWidgetCard,
  WIDGET_LABELS,
} from './widgets/renderWidgetCard';
import type { WidgetThemeStyle } from './widgets/widgetCards';

const MOBILE_WIDGET_HEIGHTS: Record<DesktopWidgetId, number> = {
  clock: 136,
  kpi: 224,
  timer: 126,
  todo: 214,
  notes: 152,
  system: 132,
  timeline: 210,
};

export function MobileWidgetsView({
  locale,
  isDark,
  glassOpacity,
  glassBlur,
  primaryColor,
  qualityMode,
  setQualityMode,
  openWindowCount,
  widgetsVisible,
  onToggleWidgets,
  enabledWidgets,
  onToggleWidgetItem,
  contentWidth,
  chromePillBg,
  chromeBorder,
  chromeText,
  onOpenApp,
}: {
  locale: 'tr' | 'en';
  isDark: boolean;
  glassOpacity: number;
  glassBlur: number;
  primaryColor: string;
  qualityMode: QualityMode;
  setQualityMode: (q: QualityMode) => void;
  openWindowCount: number;
  widgetsVisible: boolean;
  onToggleWidgets: () => void;
  enabledWidgets: Record<DesktopWidgetId, boolean>;
  onToggleWidgetItem: (id: DesktopWidgetId) => void;
  contentWidth: number;
  chromePillBg: string;
  chromeBorder: string;
  chromeText: string;
  onOpenApp: (id: string) => void;
}) {
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const isTR = locale === 'tr';
  const baseTheme = createWidgetBaseTheme({
    locale,
    isDark,
    glassOpacity,
    glassBlur,
    primaryColor,
  });

  const activeIds = DESKTOP_WIDGET_ORDER.filter((id) => enabledWidgets[id]);
  const cardWidth = Math.max(260, contentWidth - 32);

  if (!widgetsVisible) {
    return (
      <div
        className="macosgl-scroll"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            padding: 20,
            borderRadius: 18,
            backgroundColor: chromePillBg,
            backdropFilter: glassBlur > 0 ? `blur(${glassBlur}px) saturate(160%)` : undefined,
            WebkitBackdropFilter: glassBlur > 0 ? `blur(${glassBlur}px) saturate(160%)` : undefined,
            border: chromeBorder,
            color: chromeText,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            textAlign: 'center',
          }}
        >
          <EyeOff size={22} style={{ opacity: 0.75 }} />
          <div style={{ fontSize: 13.5, fontWeight: 700 }}>
            {isTR ? "Widget'lar şu anda gizli" : 'Widgets are currently hidden'}
          </div>
          <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.4 }}>
            {isTR
              ? "Saat, KPI, odak sayacı ve yapılacaklar widget'larını mobilde görüntülemek için etkinleştirin."
              : 'Enable widgets to view Clock, KPI, Focus Timer, and To-Do cards on mobile.'}
          </div>
          <button
            type="button"
            onClick={onToggleWidgets}
            style={{
              marginTop: 4,
              border: 'none',
              borderRadius: 10,
              padding: '8px 14px',
              backgroundColor: primaryColor,
              color: '#ffffff',
              fontSize: 12.5,
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <Eye size={14} />
            <span>{isTR ? "Widget'ları Göster" : 'Show Widgets'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="macosgl-scroll"
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '4px 16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
        }}
      >
        <span style={{ fontSize: 11.5, fontWeight: 700, color: chromeText, opacity: 0.85 }}>
          {isTR
            ? `${activeIds.length} aktif widget`
            : `${activeIds.length} active widget${activeIds.length === 1 ? '' : 's'}`}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            type="button"
            onClick={() => setCustomizeOpen((prev) => !prev)}
            style={{
              border: chromeBorder,
              backgroundColor: customizeOpen ? primaryColor : chromePillBg,
              color: customizeOpen ? '#ffffff' : chromeText,
              borderRadius: 999,
              padding: '4px 10px',
              fontSize: 11,
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              cursor: 'pointer',
            }}
          >
            <SlidersHorizontal size={12} />
            <span>{isTR ? 'Özelleştir' : 'Customize'}</span>
          </button>
        </div>
      </div>

      {customizeOpen && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
            padding: 10,
            borderRadius: 14,
            backgroundColor: chromePillBg,
            border: chromeBorder,
            backdropFilter: glassBlur > 0 ? `blur(${glassBlur}px) saturate(160%)` : undefined,
            WebkitBackdropFilter: glassBlur > 0 ? `blur(${glassBlur}px) saturate(160%)` : undefined,
          }}
        >
          {WIDGET_LABELS.map((w) => {
            const active = enabledWidgets[w.id];
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => onToggleWidgetItem(w.id)}
                style={{
                  border: active ? `1px solid ${primaryColor}` : chromeBorder,
                  backgroundColor: active
                    ? isDark
                      ? 'rgba(59,130,246,0.22)'
                      : 'rgba(59,130,246,0.12)'
                    : 'transparent',
                  color: chromeText,
                  borderRadius: 999,
                  padding: '4px 10px',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  opacity: active ? 1 : 0.68,
                }}
              >
                {isTR ? w.tr : w.en}
              </button>
            );
          })}
        </div>
      )}

      {activeIds.length === 0 ? (
        <div
          style={{
            padding: 18,
            borderRadius: 16,
            backgroundColor: chromePillBg,
            border: chromeBorder,
            color: chromeText,
            textAlign: 'center',
            fontSize: 12.5,
          }}
        >
          {isTR
            ? "Hiçbir widget seçili değil. Yukarıdan 'Özelleştir'e dokunarak widget ekleyin."
            : "No widgets enabled. Tap 'Customize' above to enable widgets."}
        </div>
      ) : (
        activeIds.map((id) => {
          const defSize = DEFAULT_WIDGET_SIZES[id];
          const height = MOBILE_WIDGET_HEIGHTS[id] ?? defSize.height;
          const scale = Math.max(0.92, Math.min(1.06, cardWidth / defSize.width));
          const widgetTheme: WidgetThemeStyle = {
            ...baseTheme,
            width: cardWidth,
            height,
            scale,
          };

          return (
            <div
              key={id}
              data-mobile-widget={id}
              style={{
                width: '100%',
                height,
                flexShrink: 0,
              }}
            >
              {renderWidgetCard(id, widgetTheme, {
                qualityMode,
                setQualityMode,
                openWindowCount,
                glassBlur,
                onOpenApp,
              })}
            </div>
          );
        })
      )}
    </div>
  );
}
