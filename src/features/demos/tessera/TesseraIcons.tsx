import React from 'react';
import type { TesseraAvatarPreset } from './types';

/**
 * ============================================================================
 * TESSERA GL — CRISP VECTOR BRAND MARKS, RINGS & DETERMINISTIC AVATARS
 * ============================================================================
 */

export const TesseraLogoMark: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 36 36"
    fill="none"
    aria-label="Tessera Logo"
    style={{ display: 'block', flexShrink: 0 }}
  >
    <defs>
      <linearGradient id="tesseraBrandGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#3B9BFF" />
        <stop offset="100%" stopColor="#1668E3" />
      </linearGradient>
    </defs>
    <rect width="36" height="36" rx="9.5" fill="url(#tesseraBrandGrad)" />
    {/* 6-dot circular cluster inside Tessera app icon */}
    <circle cx="18" cy="10.2" r="2.35" fill="#FFFFFF" />
    <circle cx="24.75" cy="14.1" r="2.35" fill="#FFFFFF" />
    <circle cx="24.75" cy="21.9" r="2.35" fill="#FFFFFF" />
    <circle cx="18" cy="25.8" r="2.35" fill="#FFFFFF" />
    <circle cx="11.25" cy="21.9" r="2.35" fill="#FFFFFF" />
    <circle cx="11.25" cy="14.1" r="2.35" fill="#FFFFFF" />
  </svg>
);

export const TesseraGitHubMark: React.FC<{ size?: number; color?: string }> = ({
  size = 15,
  color = '#18181B',
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
    <path d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12c0 4.64 3.01 8.58 7.18 9.97.52.1.71-.23.71-.5 0-.25-.01-.91-.01-1.78-2.92.63-3.54-1.41-3.54-1.41-.48-1.21-1.17-1.53-1.17-1.53-.95-.65.07-.64.07-.64 1.05.08 1.61 1.08 1.61 1.08.94 1.61 2.46 1.14 3.06.87.09-.68.37-1.14.67-1.4-2.33-.27-4.78-1.17-4.78-5.19 0-1.15.41-2.09 1.08-2.82-.11-.27-.47-1.33.1-2.78 0 0 .88-.28 2.89 1.08A10.05 10.05 0 0 1 12 6.58c.89 0 1.79.12 2.63.36 2.01-1.36 2.89-1.08 2.89-1.08.57 1.45.21 2.51.1 2.78.67.73 1.08 1.67 1.08 2.82 0 4.03-2.46 4.92-4.8 5.18.38.33.72.97.72 1.96 0 1.42-.01 2.56-.01 2.91 0 .28.19.61.72.5A10.51 10.51 0 0 0 22.5 12c0-5.8-4.7-10.5-10.5-10.5Z" />
  </svg>
);

export const TesseraSlackMark: React.FC<{ size?: number }> = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5.5 15a2 2 0 1 1-2-2h2v2Zm1 0a2 2 0 1 1 4 0v5a2 2 0 1 1-4 0v-5Z" fill="#E01E5A" />
    <path d="M9 5.5a2 2 0 1 1 2-2v2H9Zm0 1a2 2 0 1 1 0 4H4a2 2 0 1 1 0-4h5Z" fill="#36C5F0" />
    <path d="M18.5 9a2 2 0 1 1 2 2h-2V9Zm-1 0a2 2 0 1 1-4 0V4a2 2 0 1 1 4 0v5Z" fill="#2EB67D" />
    <path d="M15 18.5a2 2 0 1 1-2 2v-2h2Zm0-1a2 2 0 1 1 0-4h5a2 2 0 1 1 0 4h-5Z" fill="#ECB22E" />
  </svg>
);

export const TesseraVerifiedBadge: React.FC<{ size?: number }> = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-label="Verified">
    <path
      d="M10 1.5l2.22 1.44 2.63-.26.92 2.48 2.25 1.38-.52 2.59 1.13 2.38-1.78 1.94-.32 2.62-2.58.62-1.95 1.77L10 17.5l-2 1.06-1.95-1.77-2.58-.62-.32-2.62-1.78-1.94 1.13-2.38-.52-2.59 2.25-1.38.92-2.48 2.63.26L10 1.5z"
      fill="#1D9BF0"
    />
    <path
      d="M7.2 10.1l1.85 1.85 3.85-3.85"
      stroke="#FFFFFF"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const TesseraSparkleIcon: React.FC<{
  size?: number;
  color?: string;
}> = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} aria-hidden="true">
    <path d="M8 1.2L9.45 6.55L14.8 8L9.45 9.45L8 14.8L6.55 9.45L1.2 8L6.55 6.55L8 1.2Z" />
  </svg>
);

export const TesseraProjectGlyph: React.FC<{
  kind: 'overview' | 'work-items' | 'cycles' | 'modules' | 'views' | 'pages' | 'intake';
  size?: number;
}> = ({ kind, size = 15 }) => {
  switch (kind) {
    case 'overview':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="6.5" fill="#F97316" />
          <path d="M8 2.5v11M2.5 8h11" stroke="#FFFFFF" strokeWidth="1.25" />
        </svg>
      );
    case 'work-items':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="6.5" fill="#10B981" />
          <path
            d="M5.4 8.2l1.75 1.75 3.55-3.7"
            stroke="#FFFFFF"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'cycles':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle
            cx="8"
            cy="8"
            r="5.6"
            stroke="#EF4444"
            strokeWidth="2.1"
            strokeDasharray="3.2 2.2"
          />
        </svg>
      );
    case 'modules':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 4L4.2 11.2M8 4l3.8 7.2M4.2 11.2h7.6" stroke="#3B82F6" strokeWidth="1.5" />
          <circle cx="8" cy="3.6" r="2" fill="#3B82F6" />
          <circle cx="4" cy="11.4" r="2" fill="#3B82F6" />
          <circle cx="12" cy="11.4" r="2" fill="#3B82F6" />
        </svg>
      );
    case 'views':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M1.6 8C3.1 5 5.4 3.6 8 3.6S12.9 5 14.4 8C12.9 11 10.6 12.4 8 12.4S3.1 11 1.6 8Z"
            fill="#10B981"
          />
          <circle cx="8" cy="8" r="2.2" fill="#FFFFFF" />
          <circle cx="8" cy="8" r="1" fill="#065F46" />
        </svg>
      );
    case 'pages':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M3.5 2.5C3.5 1.95 3.95 1.5 4.5 1.5h4.8l3.2 3.2v8.8c0 .55-.45 1-1 1h-7c-.55 0-1-.45-1-1v-11Z"
            fill="#EC4899"
          />
          <path d="M9.2 1.6v3.1h3.1" fill="#F9A8D4" />
          <path d="M5.6 7.5h4.8M5.6 10h3.6" stroke="#FFFFFF" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
      );
    case 'intake':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8.2" r="5.6" stroke="#2563EB" strokeWidth="2.1" />
          <circle cx="8" cy="8.2" r="2.2" fill="#3B82F6" />
          <path d="M11.6 2.8l1.6 1.6" stroke="#60A5FA" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
  }
};

export const TesseraSegmentedRing: React.FC<{
  count: number;
  color: string;
  filled: number;
  dashed?: boolean;
  textColor: string;
  trackColor: string;
}> = ({ count, color, filled, dashed = false, textColor, trackColor }) => {
  const size = 30;
  const r = 11.5;
  const c = 2 * Math.PI * r;
  const segments = 4;
  const gapLen = 4.2;
  const segLen = (c - segments * gapLen) / segments;

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
        aria-hidden="true"
      >
        {Array.from({ length: segments }).map((_, idx) => {
          const isFilled = idx < filled;
          const offset = -(idx * (segLen + gapLen));
          return (
            <circle
              key={idx}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={isFilled ? color : trackColor}
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeDasharray={
                dashed
                  ? `3.2 3.2`
                  : `${segLen} ${c - segLen}`
              }
              strokeDashoffset={dashed ? 0 : offset}
              opacity={isFilled ? 1 : 0.75}
            />
          );
        })}
      </svg>
      <span
        style={{
          position: 'absolute',
          fontSize: 11.5,
          fontWeight: 600,
          color: textColor,
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1,
        }}
      >
        {count}
      </span>
    </div>
  );
};

export const TesseraPortraitAvatar: React.FC<{
  preset: TesseraAvatarPreset;
  size?: number;
  border?: string;
}> = ({ preset, size = 28, border }) => {
  if (preset === 'jon-initial') {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '9999px',
          backgroundColor: '#DCFCE7',
          color: '#15803D',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: Math.round(size * 0.43),
          fontWeight: 600,
          flexShrink: 0,
          border,
        }}
      >
        J
      </div>
    );
  }

  const configs: Record<
    Exclude<TesseraAvatarPreset, 'jon-initial'>,
    {
      sky: string;
      skin: string;
      hair: string;
      shirt: string;
      glasses?: boolean;
      hat?: boolean;
      longHair?: boolean;
    }
  > = {
    yasir: {
      sky: 'linear-gradient(180deg, #DDEAF6 0%, #F1F5F9 100%)',
      skin: '#E0AC89',
      hair: '#1E2430',
      shirt: '#334155',
      glasses: true,
    },
    alex: {
      sky: 'linear-gradient(180deg, #E2E8F0 0%, #CBD5E1 100%)',
      skin: '#EAC0A2',
      hair: '#292524',
      shirt: '#475569',
      hat: true,
    },
    ben: {
      sky: 'linear-gradient(180deg, #F1F5F9 0%, #E2E8F0 100%)',
      skin: '#EBC2A8',
      hair: '#3F2E26',
      shirt: '#1E293B',
    },
    sara: {
      sky: 'linear-gradient(180deg, #DCFCE7 0%, #BBF7D0 100%)',
      skin: '#F3CBB2',
      hair: '#1E1B18',
      shirt: '#0F172A',
      longHair: true,
    },
    priya: {
      sky: 'linear-gradient(180deg, #E0E7FF 0%, #C7D2FE 100%)',
      skin: '#D69B75',
      hair: '#171717',
      shirt: '#2563EB',
      longHair: true,
    },
    maya: {
      sky: 'linear-gradient(180deg, #FEF3C7 0%, #FDE68A 100%)',
      skin: '#E5B293',
      hair: '#451A03',
      shirt: '#16A34A',
      longHair: true,
    },
  };

  const c = configs[preset];

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '9999px',
        overflow: 'hidden',
        flexShrink: 0,
        background: c.sky,
        border,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
        {c.longHair && (
          <path d="M10 18c0-6 4.5-10 10-10s10 4 10 10v14H10V18z" fill={c.hair} />
        )}
        {/* Shoulders */}
        <path d="M6 40c1.5-7.2 6.8-10.5 14-10.5S32.5 32.8 34 40H6z" fill={c.shirt} />
        {/* Neck */}
        <rect x="16.5" y="24" width="7" height="6.5" rx="3" fill={c.skin} />
        {/* Head */}
        <circle cx="20" cy="18.2" r="7.4" fill={c.skin} />
        {/* Hair */}
        {c.hat ? (
          <>
            <path d="M12.2 15.5c.8-4.5 3.9-7 7.8-7s7 2.5 7.8 7H12.2z" fill="#1E293B" />
            <rect x="9.5" y="14.5" width="21" height="2.4" rx="1.2" fill="#0F172A" />
          </>
        ) : (
          <path
            d="M12.6 17c.2-4.6 3.5-7.4 7.5-7.4 4.1 0 7.3 2.8 7.3 7.4-.9-2-2.6-3.1-5.1-3.4-2.8-.3-5.3.2-9.7 3.4z"
            fill={c.hair}
          />
        )}
        {/* Facial details */}
        {c.glasses && (
          <g stroke="#111827" strokeWidth="1.1">
            <rect x="14.5" y="16.6" width="4.5" height="3.1" rx="1" fill="rgba(255,255,255,0.18)" />
            <rect x="21" y="16.6" width="4.5" height="3.1" rx="1" fill="rgba(255,255,255,0.18)" />
            <line x1="19" y1="18" x2="21" y2="18" />
          </g>
        )}
      </svg>
    </div>
  );
};

