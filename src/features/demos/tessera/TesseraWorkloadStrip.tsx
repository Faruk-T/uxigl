import React from 'react';
import { Cloud } from 'lucide-react';
import { TESSERA_TYPOGRAPHY } from './theme';
import type { TesseraThemeTokens, TesseraWorkloadBucket } from './types';
import { TesseraSegmentedRing } from './TesseraIcons';

export interface TesseraWorkloadStripProps {
  buckets: TesseraWorkloadBucket[];
  openItemsCount: number;
  selectedBucketId?: string | null;
  onSelectBucket?: (bucket: TesseraWorkloadBucket) => void;
  tokens: TesseraThemeTokens;
}

export const TesseraWorkloadStrip: React.FC<TesseraWorkloadStripProps> = ({
  buckets,
  openItemsCount,
  selectedBucketId,
  onSelectBucket,
  tokens,
}) => {
  return (
    <section aria-labelledby="tessera-workload-heading">
      {/* Section Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <h2
          id="tessera-workload-heading"
          style={{
            margin: 0,
            ...TESSERA_TYPOGRAPHY.scale.sectionTitle,
            color: tokens.textPrimary,
          }}
        >
          Workload
        </h2>

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            color: tokens.textMuted,
          }}
        >
          <Cloud size={13.5} strokeWidth={1.85} color={tokens.textSubtle} />
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>
            {openItemsCount} open items
          </span>
        </span>
      </div>

      {/* Unified 4-Cell Segmented Workload Strip */}
      <div
        className="tessera-workload-strip"
        style={{
          borderRadius: 12,
          border: `1px solid ${tokens.borderCard}`,
          backgroundColor: tokens.cardBg,
          boxShadow: tokens.cardShadow,
          overflow: 'hidden',
        }}
      >
        {buckets.map((bucket, idx) => {
          const isSelected = selectedBucketId === bucket.id;
          return (
            <button
              key={bucket.id}
              type="button"
              onClick={() => onSelectBucket?.(bucket)}
              className={idx < buckets.length - 1 ? 'tessera-workload-cell tessera-workload-cell--divided' : 'tessera-workload-cell'}
              style={{
                border: 'none',
                backgroundColor: isSelected ? tokens.surfaceSubtle : 'transparent',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
                cursor: onSelectBucket ? 'pointer' : 'default',
                textAlign: 'left',
                transition: 'background-color 130ms ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <TesseraSegmentedRing
                  count={bucket.count}
                  color={
                    bucket.id === 'backlog' && tokens.mode === 'dark'
                      ? '#94A3B8'
                      : bucket.ringColor
                  }
                  filled={bucket.ringFilled}
                  dashed={bucket.dashedRing}
                  textColor={tokens.textPrimary}
                  trackColor={tokens.borderSubtle}
                />

                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: tokens.textPrimary,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {bucket.label}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: tokens.textSubtle,
                      marginTop: 1,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {bucket.dueDate}
                  </div>
                </div>
              </div>

              {/* Overlapping Initial Member Badges */}
              <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                {bucket.members.map((member, mIdx) => (
                  <span
                    key={member.id}
                    style={{
                      width: 21,
                      height: 21,
                      borderRadius: '9999px',
                      backgroundColor: member.bg,
                      color: member.color,
                      border: `1.5px solid ${tokens.cardBg}`,
                      marginLeft: mIdx === 0 ? 0 : -6,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  >
                    {member.initials}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

