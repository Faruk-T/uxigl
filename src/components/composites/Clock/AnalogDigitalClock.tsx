import React, { useEffect, useState } from 'react';

export interface AnalogDigitalClockProps {
  /** Diameter of the analog SVG dial in pixels (default `136`). */
  size?: number;
  /** Show sweeping second hand and seconds in digital readout (default `true`). */
  showSeconds?: boolean;
  /** Use 12-hour format instead of 24-hour format (default `false`). */
  hour12?: boolean;
  /** Display locale (`'tr' | 'en'`, default `'tr'`). */
  locale?: 'tr' | 'en';
  /** Surface styling variant (`'glass' | 'tonal'`, default `'glass'`). */
  variant?: 'glass' | 'tonal';
  /** Show localized date line below the digital clock (default `true`). */
  showDate?: boolean;
  /** Show interactive 24H / 12H toggle pill (default `true`). */
  showFormatToggle?: boolean;
  /** Optional compact horizontal layout. */
  compact?: boolean;
  /** Optional scale multiplier for digital typography & controls (default `1`). */
  scale?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ============================================================================
 * uxiGL — ANALOG & DIGITAL LIVE CLOCK COMPOSITE
 * ============================================================================
 * Combines a precision SVG analog dial (hour, minute, second hands + 60 ticks)
 * with a tabular-numerals digital readout and localized date badge.
 */
export const AnalogDigitalClock: React.FC<AnalogDigitalClockProps> = ({
  size = 136,
  showSeconds = true,
  hour12: initialHour12 = false,
  locale = 'tr',
  variant = 'glass',
  showDate = true,
  showFormatToggle = true,
  compact = false,
  scale = 1,
  className = '',
  style,
}) => {
  const [now, setNow] = useState<Date>(() => new Date());
  const [is12h, setIs12h] = useState<boolean>(initialHour12);

  useEffect(() => {
    setIs12h(initialHour12);
  }, [initialHour12]);

  useEffect(() => {
    const intervalMs = showSeconds ? 1000 : 15000;
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [showSeconds]);

  const hours24 = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Hand angles (degrees clockwise from 12 o'clock)
  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = ((hours24 % 12) + minutes / 60) * 30;

  const displayHours = is12h ? hours24 % 12 || 12 : hours24;
  const amPm = hours24 >= 12 ? 'PM' : 'AM';
  const hh = String(displayHours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  const dateText = now.toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const cx = 60;
  const cy = 60;

  return (
    <div
      className={`uxu-analog-digital-clock ${className}`.trim()}
      style={{
        display: 'flex',
        flexDirection: compact ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: compact ? 14 : 10,
        padding: compact ? '10px 14px' : '14px 12px',
        borderRadius: 'var(--uxu-radius-lg)',
        background:
          variant === 'glass'
            ? 'var(--uxu-surface-glass)'
            : 'var(--uxu-surface-tonal)',
        border: '1px solid var(--uxu-border-subtle)',
        boxShadow: 'var(--uxu-specular-inset)',
        color: 'var(--uxu-text-primary)',
        fontFamily: 'var(--uxu-font-sans)',
        ...style,
      }}
    >
      {/* Analog Dial SVG */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        role="img"
        aria-label={`Analog clock ${hh}:${mm}`}
        style={{ flexShrink: 0, display: 'block' }}
      >
        <defs>
          <radialGradient id="uxuClockFaceGrad" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="var(--uxu-bg-elevated)" stopOpacity="0.98" />
            <stop offset="100%" stopColor="var(--uxu-surface-tonal)" stopOpacity="0.92" />
          </radialGradient>
        </defs>

        {/* Outer Bezel & Dial */}
        <circle
          cx={cx}
          cy={cy}
          r={56}
          fill="url(#uxuClockFaceGrad)"
          stroke="var(--uxu-border-strong)"
          strokeWidth="1.6"
        />
        <circle
          cx={cx}
          cy={cy}
          r={52}
          fill="none"
          stroke="var(--uxu-border-subtle)"
          strokeWidth="0.75"
        />

        {/* 60 Minute & Hour Tick Marks */}
        {Array.from({ length: 60 }).map((_, idx) => {
          const isHour = idx % 5 === 0;
          const angleRad = ((idx * 6 - 90) * Math.PI) / 180;
          const rOuter = 49.5;
          const rInner = isHour ? 43.5 : 46.8;
          const x1 = cx + Math.cos(angleRad) * rInner;
          const y1 = cy + Math.sin(angleRad) * rInner;
          const x2 = cx + Math.cos(angleRad) * rOuter;
          const y2 = cy + Math.sin(angleRad) * rOuter;
          return (
            <line
              key={idx}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isHour ? 'var(--uxu-text-primary)' : 'var(--uxu-text-muted)'}
              strokeWidth={isHour ? '1.8' : '0.85'}
              strokeLinecap="round"
              opacity={isHour ? 0.85 : 0.45}
            />
          );
        })}

        {/* Cardinal Numerals (12, 3, 6, 9) */}
        {[
          { label: '12', x: 60, y: 24.5 },
          { label: '3', x: 96, y: 63 },
          { label: '6', x: 60, y: 101 },
          { label: '9', x: 24, y: 63 },
        ].map((n) => (
          <text
            key={n.label}
            x={n.x}
            y={n.y}
            textAnchor="middle"
            fontSize="8.5"
            fontWeight="700"
            fill="var(--uxu-text-secondary)"
            style={{ fontVariantNumeric: 'tabular-nums', userSelect: 'none' }}
          >
            {n.label}
          </text>
        ))}

        {/* Hour Hand */}
        <line
          x1={cx}
          y1={cy + 6}
          x2={cx}
          y2={cy - 28}
          stroke="var(--uxu-text-primary)"
          strokeWidth="3.2"
          strokeLinecap="round"
          transform={`rotate(${hourAngle} ${cx} ${cy})`}
        />

        {/* Minute Hand */}
        <line
          x1={cx}
          y1={cy + 8}
          x2={cx}
          y2={cy - 40}
          stroke="var(--uxu-text-primary)"
          strokeWidth="2.2"
          strokeLinecap="round"
          transform={`rotate(${minuteAngle} ${cx} ${cy})`}
        />

        {/* Second Hand */}
        {showSeconds && (
          <line
            x1={cx}
            y1={cy + 11}
            x2={cx}
            y2={cy - 45}
            stroke="var(--uxu-primary)"
            strokeWidth="1.35"
            strokeLinecap="round"
            transform={`rotate(${secondAngle} ${cx} ${cy})`}
          />
        )}

        {/* Center Cap */}
        <circle cx={cx} cy={cy} r="3.4" fill="var(--uxu-primary)" />
        <circle cx={cx} cy={cy} r="1.4" fill="var(--uxu-on-primary)" />
      </svg>

      {/* Digital Readout & Date */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: compact ? 'flex-start' : 'center',
          gap: 3,
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 5,
          }}
        >
          <span
            data-testid="digital-clock-time"
            style={{
              fontSize: `${(compact ? 1.3 : 1.45) * scale}rem`,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1.05,
              fontFamily: 'var(--uxu-font-display)',
            }}
          >
            {hh}:{mm}
            {showSeconds && (
              <span
                style={{
                  fontSize: `${0.88 * scale}rem`,
                  fontWeight: 600,
                  color: 'var(--uxu-primary)',
                  marginLeft: 2,
                }}
              >
                :{ss}
              </span>
            )}
          </span>

          {is12h && (
            <span
              style={{
                fontSize: `${0.68 * scale}rem`,
                fontWeight: 700,
                padding: '1px 5px',
                borderRadius: 5,
                backgroundColor: 'var(--uxu-primary-container)',
                color: 'var(--uxu-on-primary-container)',
              }}
            >
              {amPm}
            </span>
          )}
        </div>

        {showDate && (
          <div
            style={{
              fontSize: `${0.74 * scale}rem`,
              fontWeight: 500,
              color: 'var(--uxu-text-secondary)',
              textTransform: 'capitalize',
            }}
          >
            {dateText}
          </div>
        )}

        {showFormatToggle && (
          <button
            type="button"
            onClick={() => setIs12h((v) => !v)}
            style={{
              marginTop: 2,
              padding: '2px 8px',
              borderRadius: 9999,
              border: '1px solid var(--uxu-border-subtle)',
              backgroundColor: 'var(--uxu-surface-tonal)',
              color: 'var(--uxu-text-secondary)',
              fontSize: `${0.66 * scale}rem`,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {is12h ? '12H (AM/PM)' : '24H'}
          </button>
        )}
      </div>
    </div>
  );
};

