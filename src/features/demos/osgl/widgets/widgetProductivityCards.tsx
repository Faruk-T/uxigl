import React, { useEffect, useState } from 'react';
import { Clock, Pause, Play, RotateCcw, StickyNote, Trash2 } from 'lucide-react';
import type { WidgetThemeStyle } from './widgetCards';

const NOTES_STORAGE_KEY = 'uxigl_osgl_widget_notes';

export function FocusTimerWidgetCard({ theme }: { theme: WidgetThemeStyle }) {
  const [timerSec, setTimerSec] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (!timerRunning) return;
    const t = setInterval(() => {
      setTimerSec((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [timerRunning]);

  const mins = String(Math.floor(timerSec / 60)).padStart(2, '0');
  const secs = String(timerSec % 60).padStart(2, '0');
  const { isTR, primaryColor, subtleBg, subtleBorder, cardStyle } = theme;

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700 }}>
          <Clock size={14} color={primaryColor} />
          <span>{isTR ? 'Odak Sayacı' : 'Focus Timer'}</span>
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {[5, 15, 25].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setTimerRunning(false);
                setTimerSec(m * 60);
              }}
              style={{
                border: `1px solid ${subtleBorder}`,
                backgroundColor: Math.ceil(timerSec / 60) === m ? subtleBg : 'transparent',
                color: 'inherit',
                fontSize: 10.5,
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              {m}m
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
        <span style={{ fontSize: 22, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
          {mins}:{secs}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            onClick={() => setTimerRunning((v) => !v)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '5px 10px',
              borderRadius: 8,
              border: 'none',
              backgroundColor: primaryColor,
              color: '#ffffff',
              fontSize: 11.5,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {timerRunning ? <Pause size={13} /> : <Play size={13} />}
            <span>{timerRunning ? (isTR ? 'Durdur' : 'Pause') : isTR ? 'Başlat' : 'Start'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTimerRunning(false);
              setTimerSec(25 * 60);
            }}
            title={isTR ? 'Sıfırla' : 'Reset'}
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              border: `1px solid ${subtleBorder}`,
              backgroundColor: 'transparent',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function QuickNotesWidgetCard({ theme }: { theme: WidgetThemeStyle }) {
  const [noteText, setNoteText] = useState<string>(() => {
    try {
      return window.localStorage.getItem(NOTES_STORAGE_KEY) ?? '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(NOTES_STORAGE_KEY, noteText);
    } catch {
      // ignore storage errors
    }
  }, [noteText]);

  const { isTR, primaryColor, subtleBg, subtleBorder, cardStyle } = theme;

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700 }}>
          <StickyNote size={14} color={primaryColor} />
          <span>{isTR ? 'Hızlı Notlar' : 'Quick Notes'}</span>
        </span>
        {noteText && (
          <button
            type="button"
            onClick={() => setNoteText('')}
            title={isTR ? 'Notu Temizle' : 'Clear Note'}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'inherit',
              opacity: 0.6,
              cursor: 'pointer',
              padding: 2,
              display: 'flex',
            }}
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
      <textarea
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        placeholder={isTR ? 'Buraya hızlı not alabilirsiniz...' : 'Jot down a quick note...'}
        rows={3}
        style={{
          width: '100%',
          resize: 'vertical',
          minHeight: 58,
          padding: '7px 9px',
          borderRadius: 9,
          border: `1px solid ${subtleBorder}`,
          backgroundColor: subtleBg,
          color: 'inherit',
          fontSize: 11.5,
          lineHeight: 1.4,
          fontFamily: 'inherit',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}