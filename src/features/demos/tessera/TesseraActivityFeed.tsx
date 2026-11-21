import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { TESSERA_TYPOGRAPHY } from './theme';
import type {
  TesseraActivityEntry,
  TesseraActivityFilterId,
  TesseraActivityTone,
  TesseraThemeTokens,
} from './types';
import { TesseraPortraitAvatar } from './TesseraIcons';

export interface TesseraActivityFeedProps {
  entries: TesseraActivityEntry[];
  filter: TesseraActivityFilterId;
  onFilterChange: (filter: TesseraActivityFilterId) => void;
  onViewAll?: () => void;
  onRowAction?: (entry: TesseraActivityEntry) => void;
  tokens: TesseraThemeTokens;
}

const FILTER_OPTIONS: { id: TesseraActivityFilterId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'mentions', label: 'Mentions' },
  { id: 'comments', label: 'Comments' },
];

function resolveBadgeStyle(
  tone: TesseraActivityTone,
  isDark: boolean
): { bg: string; color: string; dot: string } {
  switch (tone) {
    case 'assigned':
      return isDark
        ? { bg: 'rgba(37, 99, 235, 0.18)', color: '#93C5FD', dot: '#3B82F6' }
        : { bg: '#EFF6FF', color: '#2563EB', dot: '#2563EB' };
    case 'comment':
      return isDark
        ? { bg: 'rgba(148, 163, 184, 0.16)', color: '#CBD5E1', dot: '#94A3B8' }
        : { bg: '#F3F4F6', color: '#4B5563', dot: '#6B7280' };
    case 'done':
      return isDark
        ? { bg: 'rgba(22, 163, 74, 0.18)', color: '#86EFAC', dot: '#22C55E' }
        : { bg: '#ECFDF3', color: '#16A34A', dot: '#16A34A' };
    case 'at-risk':
      return isDark
        ? { bg: 'rgba(239, 68, 68, 0.18)', color: '#FCA5A5', dot: '#F87171' }
        : { bg: '#FEF2F2', color: '#DC2626', dot: '#EF4444' };
  }
}

export const TesseraActivityFeed: React.FC<TesseraActivityFeedProps> = ({
  entries,
  filter,
  onFilterChange,
  onViewAll,
  onRowAction,
  tokens,
}) => {
  const isDark = tokens.mode === 'dark';

  return (
    <section aria-labelledby="tessera-activity-heading">
      {/* Header Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
          marginBottom: 8,
        }}
      >
        <h2
          id="tessera-activity-heading"
          style={{
            margin: 0,
            ...TESSERA_TYPOGRAPHY.scale.sectionTitle,
            color: tokens.textPrimary,
          }}
        >
          Recent activity
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            role="tablist"
            aria-label="Filter recent activity"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
              padding: 2,
              borderRadius: 8,
              border: `1px solid ${tokens.borderSubtle}`,
              backgroundColor: tokens.surfaceSubtle,
            }}
          >
            {FILTER_OPTIONS.map((opt) => {
              const active = filter === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onFilterChange(opt.id)}
                  style={{
                    height: 24,
                    padding: '0 10px',
                    borderRadius: 6,
                    border: 'none',
                    backgroundColor: active ? tokens.cardBg : 'transparent',
                    color: active ? tokens.textPrimary : tokens.textMuted,
                    fontSize: 12,
                    fontWeight: active ? 500 : 400,
                    cursor: 'pointer',
                    boxShadow: active ? tokens.cardShadow : 'none',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onViewAll}
            style={{
              border: 'none',
              background: 'transparent',
              padding: 0,
              fontSize: 12,
              fontWeight: 500,
              color: tokens.textSecondary,
              cursor: 'pointer',
            }}
          >
            View all
          </button>
        </div>
      </div>

      {/* Rows */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {entries.length === 0 ? (
          <div
            style={{
              padding: '20px 0',
              fontSize: 13,
              color: tokens.textMuted,
              textAlign: 'center',
            }}
          >
            No matching activity items.
          </div>
        ) : (
          entries.map((entry, idx) => {
            const badge = resolveBadgeStyle(entry.badgeTone, isDark);
            return (
              <div
                key={entry.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '11px 0',
                  borderBottom:
                    idx < entries.length - 1
                      ? `1px solid ${tokens.borderSubtle}`
                      : 'none',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  <TesseraPortraitAvatar preset={entry.actorAvatar} size={30} />

                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        color: tokens.textSecondary,
                        lineHeight: 1.35,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      <span
                        style={{
                          fontWeight: entry.actorName === 'You' ? 400 : 600,
                          color:
                            entry.actorName === 'You'
                              ? tokens.textSecondary
                              : tokens.textPrimary,
                        }}
                      >
                        {entry.actorName}
                      </span>{' '}
                      <span>{entry.verb}</span>{' '}
                      <strong style={{ fontWeight: 600, color: tokens.textPrimary }}>
                        {entry.targetPrimary}
                      </strong>
                      {entry.trailingText && <span> {entry.trailingText}</span>}
                      {entry.targetSecondary && (
                        <>
                          {' '}
                          {entry.targetSecondary.startsWith('TSR-') ? (
                            <>
                              <strong style={{ fontWeight: 600, color: tokens.textPrimary }}>
                                {entry.targetSecondary.split(' ')[0]}
                              </strong>{' '}
                              <span>
                                {entry.targetSecondary.split(' ').slice(1).join(' ')}
                              </span>
                            </>
                          ) : (
                            <span>{entry.targetSecondary}</span>
                          )}
                        </>
                      )}
                    </div>

                    <div
                      style={{
                        fontSize: 11.5,
                        color: tokens.textSubtle,
                        marginTop: 2,
                      }}
                    >
                      {entry.timestamp} · {entry.project}
                    </div>
                  </div>
                </div>

                {/* Right Status Pill & More Menu */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '3px 10px',
                      borderRadius: 9999,
                      backgroundColor: badge.bg,
                      color: badge.color,
                      fontSize: 11.5,
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: '9999px',
                        backgroundColor: badge.dot,
                      }}
                    />
                    <span>{entry.badgeLabel}</span>
                  </span>

                  <button
                    type="button"
                    aria-label={`Actions for ${entry.targetPrimary}`}
                    onClick={() => onRowAction?.(entry)}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: tokens.textMuted,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <MoreHorizontal size={15} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

