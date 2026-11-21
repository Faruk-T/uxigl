import React, { useEffect, useState } from 'react';
import { CalendarClock, CheckCircle2, Plus, RotateCcw } from 'lucide-react';
import type { WidgetThemeStyle } from './widgetCards';

type FlowPresetId = 'school' | 'work' | 'daily';

interface TimeFlowSlot {
  id: string;
  titleTr: string;
  titleEn: string;
  start: string; // HH:MM
  end: string; // HH:MM
  kind: 'focus' | 'break' | 'meal';
}

const STORAGE_KEY = 'uxigl_osgl_timeflow_v1';

const PRESET_SLOTS: Record<FlowPresetId, TimeFlowSlot[]> = {
  school: [
    { id: 's1', titleTr: '1. Ders', titleEn: '1st Period', start: '08:30', end: '09:10', kind: 'focus' },
    { id: 's2', titleTr: 'Teneffüs', titleEn: 'Break', start: '09:10', end: '09:20', kind: 'break' },
    { id: 's3', titleTr: '2. Ders', titleEn: '2nd Period', start: '09:20', end: '10:00', kind: 'focus' },
    { id: 's4', titleTr: 'Teneffüs', titleEn: 'Break', start: '10:00', end: '10:10', kind: 'break' },
    { id: 's5', titleTr: '3. Ders', titleEn: '3rd Period', start: '10:10', end: '10:50', kind: 'focus' },
    { id: 's6', titleTr: 'Teneffüs', titleEn: 'Break', start: '10:50', end: '11:00', kind: 'break' },
    { id: 's7', titleTr: '4. Ders', titleEn: '4th Period', start: '11:00', end: '11:40', kind: 'focus' },
    { id: 's8', titleTr: 'Öğle Arası', titleEn: 'Lunch Break', start: '11:40', end: '12:40', kind: 'meal' },
    { id: 's9', titleTr: '5. Ders', titleEn: '5th Period', start: '12:40', end: '13:20', kind: 'focus' },
    { id: 's10', titleTr: 'Teneffüs', titleEn: 'Break', start: '13:20', end: '13:30', kind: 'break' },
    { id: 's11', titleTr: '6. Ders', titleEn: '6th Period', start: '13:30', end: '14:10', kind: 'focus' },
    { id: 's12', titleTr: 'Etüt & Kulüp', titleEn: 'Study & Club', start: '14:20', end: '15:30', kind: 'focus' },
  ],
  work: [
    { id: 'w1', titleTr: 'Sabah Stand-up', titleEn: 'Morning Stand-up', start: '09:00', end: '09:30', kind: 'focus' },
    { id: 'w2', titleTr: 'Derin Odak Bloğu I', titleEn: 'Deep Focus I', start: '09:30', end: '11:30', kind: 'focus' },
    { id: 'w3', titleTr: 'Kahve Molası', titleEn: 'Coffee Break', start: '11:30', end: '11:45', kind: 'break' },
    { id: 'w4', titleTr: 'Öğle Arası', titleEn: 'Lunch Break', start: '12:30', end: '13:30', kind: 'meal' },
    { id: 'w5', titleTr: 'Ekip & Müşteri Toplantısı', titleEn: 'Team & Client Sync', start: '13:30', end: '15:00', kind: 'focus' },
    { id: 'w6', titleTr: 'Derin Odak Bloğu II', titleEn: 'Deep Focus II', start: '15:15', end: '17:30', kind: 'focus' },
    { id: 'w7', titleTr: 'Gün Sonu Özeti', titleEn: 'Daily Wrap-up', start: '17:30', end: '18:00', kind: 'break' },
  ],
  daily: [
    { id: 'd1', titleTr: 'Sabah Rutini', titleEn: 'Morning Routine', start: '07:30', end: '08:30', kind: 'break' },
    { id: 'd2', titleTr: 'Ana Odak & Üretim', titleEn: 'Core Focus', start: '09:00', end: '12:00', kind: 'focus' },
    { id: 'd3', titleTr: 'Öğle Yemeği & Dinlenme', titleEn: 'Lunch & Rest', start: '12:00', end: '13:15', kind: 'meal' },
    { id: 'd4', titleTr: 'Öğleden Sonra Planı', titleEn: 'Afternoon Block', start: '13:15', end: '17:00', kind: 'focus' },
    { id: 'd5', titleTr: 'Spor & Yürüyüş', titleEn: 'Workout & Walk', start: '17:30', end: '18:45', kind: 'break' },
    { id: 'd6', titleTr: 'Akşam Okuma & Serbest', titleEn: 'Evening Reading', start: '20:00', end: '22:30', kind: 'meal' },
  ],
};

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function formatDuration(totalSeconds: number, isTR: boolean): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hrs = Math.floor(safe / 3600);
  const mins = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  if (hrs > 0) {
    return isTR ? `${hrs} sa ${mins} dk` : `${hrs}h ${mins}m`;
  }
  if (mins > 0) {
    return isTR ? `${mins} dk ${String(secs).padStart(2, '0')} sn` : `${mins}m ${String(secs).padStart(2, '0')}s`;
  }
  return isTR ? `${secs} sn` : `${secs}s`;
}

export function TimeFlowWidgetCard({ theme }: { theme: WidgetThemeStyle }) {
  const { isTR, isDark, primaryColor, subtleBg, subtleBorder, cardStyle, scale, height } = theme;
  const s = Math.max(0.86, Math.min(1.5, scale));

  const [preset, setPreset] = useState<FlowPresetId>(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { preset?: FlowPresetId };
        if (parsed.preset && PRESET_SLOTS[parsed.preset]) return parsed.preset;
      }
    } catch {
      // ignore storage errors
    }
    return 'school';
  });

  const [customSlotsByPreset, setCustomSlotsByPreset] = useState<Partial<Record<FlowPresetId, TimeFlowSlot[]>>>(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { customSlotsByPreset?: Partial<Record<FlowPresetId, TimeFlowSlot[]>> };
        return parsed.customSlotsByPreset ?? {};
      }
    } catch {
      // ignore storage errors
    }
    return {};
  });

  const [now, setNow] = useState(() => new Date());
  const [adding, setAdding] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftStart, setDraftStart] = useState('16:00');
  const [draftEnd, setDraftEnd] = useState('16:45');

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ preset, customSlotsByPreset })
      );
    } catch {
      // ignore storage errors
    }
  }, [preset, customSlotsByPreset]);

  const slots = [...(customSlotsByPreset[preset] ?? PRESET_SLOTS[preset])].sort(
    (a, b) => toMinutes(a.start) - toMinutes(b.start)
  );

  const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const activeIdx = slots.findIndex((sl) => {
    const st = toMinutes(sl.start) * 60;
    const en = toMinutes(sl.end) * 60;
    return nowSec >= st && nowSec < en;
  });
  const activeSlot = activeIdx >= 0 ? slots[activeIdx] : null;
  const nextSlot =
    activeIdx >= 0
      ? slots[activeIdx + 1] ?? null
      : slots.find((sl) => toMinutes(sl.start) * 60 > nowSec) ?? null;

  const slotProgress = activeSlot
    ? Math.max(
        0,
        Math.min(
          1,
          (nowSec - toMinutes(activeSlot.start) * 60) /
            Math.max(60, (toMinutes(activeSlot.end) - toMinutes(activeSlot.start)) * 60)
        )
      )
    : 0;
  const progressPct = slotProgress * 100;

  // Compute continuous 0..100% position along the day's straight timeline line
  const firstStartSec = slots.length > 0 ? toMinutes(slots[0].start) * 60 : 0;
  const lastEndSec = slots.length > 0 ? toMinutes(slots[slots.length - 1].end) * 60 : 86400;
  const dayLinearPct =
    lastEndSec > firstStartSec
      ? Math.max(0, Math.min(100, ((nowSec - firstStartSec) / (lastEndSec - firstStartSec)) * 100))
      : 0;

  let verticalMarkerPct = 2;
  if (slots.length > 0) {
    if (activeIdx >= 0) {
      verticalMarkerPct = ((activeIdx + 0.15 + slotProgress * 0.7) / slots.length) * 100;
    } else if (nowSec <= firstStartSec) {
      verticalMarkerPct = 2;
    } else if (nowSec >= lastEndSec) {
      verticalMarkerPct = 98;
    } else {
      const nextIdx = slots.findIndex((sl) => toMinutes(sl.start) * 60 > nowSec);
      verticalMarkerPct = nextIdx > 0 ? (nextIdx / slots.length) * 100 : 98;
    }
  }

  const remainingSec = activeSlot
    ? toMinutes(activeSlot.end) * 60 - nowSec
    : nextSlot
    ? toMinutes(nextSlot.start) * 60 - nowSec
    : 0;

  const kindColor = (kind: TimeFlowSlot['kind']) =>
    kind === 'meal' ? '#f59e0b' : kind === 'break' ? '#10b981' : primaryColor;

  const handleAddSlot = () => {
    const clean = draftTitle.trim();
    if (!clean || toMinutes(draftEnd) <= toMinutes(draftStart)) return;
    const newSlot: TimeFlowSlot = {
      id: `tf-${Date.now()}`,
      titleTr: clean,
      titleEn: clean,
      start: draftStart,
      end: draftEnd,
      kind: 'focus',
    };
    setCustomSlotsByPreset((prev) => ({
      ...prev,
      [preset]: [...(prev[preset] ?? PRESET_SLOTS[preset]), newSlot],
    }));
    setDraftTitle('');
    setAdding(false);
  };

  const showFullList = height >= 225;

  return (
    <div style={cardStyle}>
      {/* Header + Preset Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, flexShrink: 0 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: Math.round(12 * s), fontWeight: 700 }}>
          <CalendarClock size={Math.round(14 * s)} color={primaryColor} />
          <span>{isTR ? 'Zaman Akışı' : 'Time Flow'}</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div
            style={{
              display: 'inline-flex',
              padding: 2,
              borderRadius: 999,
              backgroundColor: subtleBg,
              border: `1px solid ${subtleBorder}`,
              gap: 1,
            }}
          >
            {(
              [
                { id: 'school', tr: 'Okul', en: 'School' },
                { id: 'work', tr: 'İş', en: 'Work' },
                { id: 'daily', tr: 'Gün', en: 'Day' },
              ] as const
            ).map((p) => {
              const isAct = preset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPreset(p.id)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    borderRadius: 999,
                    padding: '2px 7px',
                    fontSize: Math.round(10 * Math.min(1.2, s)),
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: isAct
                      ? isDark
                        ? 'rgba(59, 130, 246, 0.24)'
                        : '#ffffff'
                      : 'transparent',
                    color: isAct ? (isDark ? '#93c5fd' : primaryColor) : 'inherit',
                    opacity: isAct ? 1 : 0.7,
                  }}
                >
                  {isTR ? p.tr : p.en}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setAdding((v) => !v)}
            title={isTR ? 'Blok Ekle' : 'Add Block'}
            style={{
              width: 22,
              height: 22,
              borderRadius: 999,
              border: 'none',
              backgroundColor: adding ? primaryColor : subtleBg,
              color: adding ? '#ffffff' : primaryColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Plus size={12} />
          </button>
          {customSlotsByPreset[preset] && (
            <button
              type="button"
              onClick={() =>
                setCustomSlotsByPreset((prev) => {
                  const next = { ...prev };
                  delete next[preset];
                  return next;
                })
              }
              title={isTR ? 'Varsayılana Sıfırla' : 'Reset Preset'}
              style={{
                width: 22,
                height: 22,
                borderRadius: 999,
                border: 'none',
                backgroundColor: subtleBg,
                color: 'inherit',
                opacity: 0.7,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={11} />
            </button>
          )}
        </div>
      </div>

      {/* Optional Quick Add Form */}
      {adding && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
            padding: 7,
            borderRadius: 10,
            backgroundColor: subtleBg,
            border: `1px solid ${subtleBorder}`,
            flexShrink: 0,
          }}
        >
          <input
            type="text"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            placeholder={isTR ? 'Örn: 7. Ders veya Etüt...' : 'e.g. Study Session...'}
            style={{
              padding: '4px 7px',
              borderRadius: 6,
              border: `1px solid ${subtleBorder}`,
              backgroundColor: 'transparent',
              color: 'inherit',
              fontSize: 11,
              outline: 'none',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input
              type="time"
              value={draftStart}
              onChange={(e) => setDraftStart(e.target.value)}
              style={{
                flex: 1,
                padding: '3px 5px',
                borderRadius: 6,
                border: `1px solid ${subtleBorder}`,
                backgroundColor: 'transparent',
                color: 'inherit',
                fontSize: 10.5,
              }}
            />
            <span style={{ opacity: 0.5, fontSize: 11 }}>–</span>
            <input
              type="time"
              value={draftEnd}
              onChange={(e) => setDraftEnd(e.target.value)}
              style={{
                flex: 1,
                padding: '3px 5px',
                borderRadius: 6,
                border: `1px solid ${subtleBorder}`,
                backgroundColor: 'transparent',
                color: 'inherit',
                fontSize: 10.5,
              }}
            />
            <button
              type="button"
              onClick={handleAddSlot}
              style={{
                padding: '4px 9px',
                borderRadius: 6,
                border: 'none',
                backgroundColor: primaryColor,
                color: '#ffffff',
                fontSize: 10.5,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isTR ? 'Ekle' : 'Add'}
            </button>
          </div>
        </div>
      )}

      {/* Live Status Card */}
      <div
        style={{
          padding: '8px 10px',
          borderRadius: 11,
          backgroundColor: subtleBg,
          border: `1px solid ${subtleBorder}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
          flexShrink: 0,
        }}
      >
        {activeSlot ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: kindColor(activeSlot.kind),
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: Math.round(13.5 * s),
                    fontWeight: 800,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isTR ? activeSlot.titleTr : activeSlot.titleEn}
                </span>
              </div>
              <span style={{ fontSize: Math.round(10.5 * s), opacity: 0.72, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
                {activeSlot.start}–{activeSlot.end}
              </span>
            </div>

            <div style={{ position: 'relative', height: 6, borderRadius: 999, backgroundColor: subtleBorder, margin: '2px 0' }}>
              <div
                style={{
                  width: `${progressPct}%`,
                  height: '100%',
                  borderRadius: 999,
                  backgroundColor: kindColor(activeSlot.kind),
                  transition: 'width 1s linear',
                }}
              />
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: `${Math.max(2, Math.min(98, progressPct))}%`,
                  transform: 'translate(-50%, -50%)',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: `2.5px solid ${kindColor(activeSlot.kind)}`,
                  boxShadow: `0 0 0 3px ${isDark ? 'rgba(59,130,246,0.28)' : 'rgba(37,99,235,0.22)'}`,
                  transition: 'left 1s linear',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: Math.round(10.5 * Math.min(1.25, s)) }}>
              <span style={{ fontWeight: 700, color: kindColor(activeSlot.kind), fontVariantNumeric: 'tabular-nums' }}>
                {isTR
                  ? `Bitmesine ${formatDuration(remainingSec, true)} kaldı`
                  : `${formatDuration(remainingSec, false)} remaining`}
              </span>
              {nextSlot && (
                <span style={{ opacity: 0.68, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '48%' }}>
                  {isTR ? 'Sonraki:' : 'Next:'} {isTR ? nextSlot.titleTr : nextSlot.titleEn}
                </span>
              )}
            </div>
          </>
        ) : nextSlot ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ fontSize: Math.round(12.5 * s), fontWeight: 700 }}>
              {isTR ? `Sıradaki: ${nextSlot.titleTr}` : `Up next: ${nextSlot.titleEn}`}
            </div>
            <div style={{ fontSize: Math.round(10.5 * s), color: primaryColor, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
              {isTR
                ? `${nextSlot.start} başlangıcına ${formatDuration(remainingSec, true)} kaldı`
                : `Starts at ${nextSlot.start} (in ${formatDuration(remainingSec, false)})`}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: Math.round(12 * s), fontWeight: 700, color: '#10b981' }}>
            <CheckCircle2 size={15} />
            <span>{isTR ? 'Bugünkü zaman akışı tamamlandı' : 'Daily schedule completed'}</span>
          </div>
        )}
      </div>

      {/* Scrollable Vertical Timeline with Straight Line & Smoothly Moving Marker */}
      {showFullList && (
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            paddingRight: 2,
          }}
        >
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              paddingLeft: 20,
            }}
          >
            {/* Straight background timeline rail */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: 8,
                top: 10,
                bottom: 10,
                width: 2,
                borderRadius: 999,
                backgroundColor: subtleBorder,
              }}
            />

            {/* Filled timeline progress rail */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: 8,
                top: 10,
                height: `calc((100% - 20px) * ${Math.max(0, Math.min(100, verticalMarkerPct)) / 100})`,
                width: 2,
                borderRadius: 999,
                backgroundColor: activeSlot ? kindColor(activeSlot.kind) : primaryColor,
                transition: 'height 1s linear',
              }}
            />

            {/* Smoothly gliding live playhead dot on the straight line */}
            <div
              aria-hidden="true"
              title={`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} (${Math.round(dayLinearPct)}%)`}
              style={{
                position: 'absolute',
                left: 9,
                top: `calc(10px + (100% - 20px) * ${Math.max(0, Math.min(100, verticalMarkerPct)) / 100})`,
                transform: 'translate(-50%, -50%)',
                width: 11,
                height: 11,
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: `3px solid ${activeSlot ? kindColor(activeSlot.kind) : primaryColor}`,
                boxShadow: `0 0 0 4px ${isDark ? 'rgba(59,130,246,0.28)' : 'rgba(37,99,235,0.20)'}`,
                zIndex: 2,
                transition: 'top 1s linear',
                pointerEvents: 'none',
              }}
            />

            {slots.map((sl) => {
              const st = toMinutes(sl.start) * 60;
              const en = toMinutes(sl.end) * 60;
              const isPast = nowSec >= en;
              const isCurrent = nowSec >= st && nowSec < en;
              return (
                <div
                  key={sl.id}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    padding: '5px 8px',
                    borderRadius: 8,
                    backgroundColor: isCurrent ? subtleBg : 'transparent',
                    border: isCurrent ? `1px solid ${kindColor(sl.kind)}` : '1px solid transparent',
                    opacity: isPast ? 0.45 : 1,
                    fontSize: Math.round(11 * Math.min(1.25, s)),
                  }}
                >
                  {/* Node tick on the straight timeline rail */}
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: -15,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: isPast || isCurrent ? kindColor(sl.kind) : subtleBorder,
                      opacity: isCurrent ? 0 : 1,
                    }}
                  />
                  <span
                    style={{
                      fontWeight: isCurrent ? 800 : 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      minWidth: 0,
                    }}
                  >
                    {isTR ? sl.titleTr : sl.titleEn}
                  </span>
                  <span style={{ fontSize: 10, opacity: 0.65, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
                    {sl.start}–{sl.end}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

