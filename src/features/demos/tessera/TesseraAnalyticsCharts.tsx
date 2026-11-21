import React, { useState } from 'react';
import { ChevronDown, Clock } from 'lucide-react';
import { TESSERA_SPACING, TESSERA_TYPOGRAPHY } from './theme';
import type {
  TesseraCapacitySegment,
  TesseraTeamMemberPerf,
  TesseraThemeTokens,
} from './types';

export interface TesseraAnalyticsChartsProps {
  totalCapacityHours: number;
  sprintLabel: string;
  capacitySegments: TesseraCapacitySegment[];
  performanceByProject: Record<string, TesseraTeamMemberPerf[]>;
  selectedProject: string;
  onSelectProject: (project: string) => void;
  cycleFilterLabel?: string;
  onToggleCycleFilter?: () => void;
  tokens: TesseraThemeTokens;
}

export const TesseraAnalyticsCharts: React.FC<TesseraAnalyticsChartsProps> = ({
  totalCapacityHours,
  sprintLabel,
  capacitySegments,
  performanceByProject,
  selectedProject,
  onSelectProject,
  cycleFilterLabel = 'This cycle',
  onToggleCycleFilter,
  tokens,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const projectNames = Object.keys(performanceByProject);
  const members =
    performanceByProject[selectedProject] ??
    performanceByProject[projectNames[0]] ??
    [];

  const colTemplate = capacitySegments.map((s) => `${s.percent}fr`).join(' ');

  return (
    <section
      aria-label="Cycle Capacity and Team Performance"
      className="tessera-charts-grid"
    >
      {/* Left Card: Cycle capacity */}
      <div
        style={{
          padding: TESSERA_SPACING.cardPadding,
          borderRadius: TESSERA_SPACING.cardRadius,
          border: `1px solid ${tokens.borderCard}`,
          backgroundColor: tokens.cardBg,
          boxShadow: tokens.cardShadow,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 10,
            }}
          >
            <div>
              <h3
                style={{
                  margin: 0,
                  ...TESSERA_TYPOGRAPHY.scale.cardTitle,
                  color: tokens.textPrimary,
                }}
              >
                Cycle capacity
              </h3>
              <div
                style={{
                  fontSize: 12,
                  color: tokens.textMuted,
                  marginTop: 2,
                }}
              >
                {sprintLabel}
              </div>
            </div>

            <button
              type="button"
              onClick={onToggleCycleFilter}
              style={{
                height: 28,
                padding: '0 10px',
                borderRadius: 7,
                border: `1px solid ${tokens.borderControl}`,
                backgroundColor: tokens.cardBg,
                color: tokens.textSecondary,
                fontSize: 11.5,
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <Clock size={12.5} strokeWidth={1.9} color={tokens.textMuted} />
              <span>{cycleFilterLabel}</span>
            </button>
          </div>

          <div
            style={{
              margin: '14px 0 14px',
              display: 'flex',
              alignItems: 'baseline',
              gap: 7,
            }}
          >
            <span
              style={{
                ...TESSERA_TYPOGRAPHY.scale.heroMetric,
                color: tokens.textPrimary,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {totalCapacityHours}h
            </span>
            <span style={{ fontSize: 12.5, color: tokens.textMuted }}>
              Team capacity
            </span>
          </div>
        </div>

        {/* Proportional Vertical Guides + Segmented Capsule Bar */}
        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: colTemplate,
              gap: 3,
              alignItems: 'end',
            }}
          >
            {capacitySegments.map((seg) => (
              <div key={seg.id} style={{ minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 4,
                    marginBottom: 6,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: tokens.textPrimary,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {seg.percent}%
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: tokens.textSubtle,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {seg.hours}h
                  </span>
                </div>

                {/* Vertical Guide Hairline Dropping Down to Capsule Bar */}
                <div
                  style={{
                    height: 54,
                    borderLeft: `1px solid ${tokens.borderSubtle}`,
                  }}
                />

                {/* Horizontal Segment Pill */}
                <div
                  title={`${seg.label}: ${seg.percent}% (${seg.hours}h)`}
                  style={{
                    height: 10,
                    marginTop: 2,
                    borderRadius: 9999,
                    backgroundColor: seg.hatched
                      ? tokens.mode === 'dark'
                        ? 'rgba(255,255,255,0.08)'
                        : '#ECEEF2'
                      : seg.color,
                    backgroundImage: seg.hatched
                      ? `repeating-linear-gradient(135deg, ${
                          tokens.mode === 'dark'
                            ? 'rgba(255,255,255,0.14)'
                            : '#D8DCE3'
                        } 0px, ${
                          tokens.mode === 'dark'
                            ? 'rgba(255,255,255,0.14)'
                            : '#D8DCE3'
                        } 2px, transparent 2px, transparent 5px)`
                      : undefined,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Legend */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              marginTop: 14,
              fontSize: 12,
              color: tokens.textMuted,
            }}
          >
            {capacitySegments.map((seg) => (
              <span
                key={seg.id}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <span
                  style={{
                    width: 6.5,
                    height: 6.5,
                    borderRadius: '9999px',
                    backgroundColor: seg.hatched ? tokens.textSubtle : seg.color,
                  }}
                />
                <span>{seg.label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Card: Team performance */}
      <div
        style={{
          padding: TESSERA_SPACING.cardPadding,
          borderRadius: TESSERA_SPACING.cardRadius,
          border: `1px solid ${tokens.borderCard}`,
          backgroundColor: tokens.cardBg,
          boxShadow: tokens.cardShadow,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Header Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 10,
            position: 'relative',
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                ...TESSERA_TYPOGRAPHY.scale.cardTitle,
                color: tokens.textPrimary,
              }}
            >
              Team performance
            </h3>
            <div style={{ fontSize: 12, color: tokens.textMuted, marginTop: 2 }}>
              Items completed vs. assigned
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              aria-expanded={dropdownOpen}
              style={{
                height: 28,
                padding: '0 10px',
                borderRadius: 7,
                border: `1px solid ${tokens.borderControl}`,
                backgroundColor: tokens.cardBg,
                color: tokens.textSecondary,
                fontSize: 11.5,
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{selectedProject}</span>
              <ChevronDown size={13} color={tokens.textMuted} />
            </button>

            {dropdownOpen && (
              <div
                role="menu"
                style={{
                  position: 'absolute',
                  top: 32,
                  right: 0,
                  minWidth: 148,
                  padding: 4,
                  borderRadius: 9,
                  border: `1px solid ${tokens.borderCard}`,
                  backgroundColor: tokens.cardBg,
                  boxShadow: tokens.popoverShadow,
                  zIndex: 30,
                }}
              >
                {projectNames.map((pName) => (
                  <button
                    key={pName}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onSelectProject(pName);
                      setDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '6px 9px',
                      borderRadius: 6,
                      border: 'none',
                      backgroundColor:
                        pName === selectedProject
                          ? tokens.surfaceActive
                          : 'transparent',
                      color: tokens.textPrimary,
                      fontSize: 12,
                      fontWeight: pName === selectedProject ? 600 : 400,
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    {pName}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Hatched Column Bar Chart + Target 70% Line */}
        <div style={{ marginTop: 18 }}>
          <div style={{ position: 'relative' }}>
            {/* Horizontal Target 70% Dashed Reference Line */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: '70%',
                borderTop: `1px dashed ${
                  tokens.mode === 'dark' ? 'rgba(255,255,255,0.22)' : '#D1D5DB'
                }`,
                zIndex: 4,
                pointerEvents: 'none',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  right: 4,
                  top: 0,
                  transform: 'translateY(-50%)',
                  backgroundColor: tokens.mode === 'dark' ? tokens.cardBg : 'rgba(255,255,255,0.92)',
                  color: tokens.textMuted,
                  fontSize: 10.5,
                  fontWeight: 500,
                  padding: '1px 5px',
                  borderRadius: 4,
                }}
              >
                Target 70%
              </span>
            </div>

            {/* 4 Hatched Column Tracks */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                gap: 10,
              }}
            >
              {members.map((member) => {
                const trackBg =
                  tokens.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.025)'
                    : '#FAFAFB';
                const resolvedBarBg =
                  member.id === 'alex' && tokens.mode === 'dark'
                    ? '#334155'
                    : member.barColor;
                const resolvedBarText =
                  member.id === 'alex' && tokens.mode === 'dark'
                    ? '#F8FAFC'
                    : member.barTextColor;

                return (
                  <div
                    key={member.id}
                    style={{
                      position: 'relative',
                      height: 158,
                      borderRadius: 8,
                      backgroundColor: trackBg,
                      backgroundImage: `repeating-linear-gradient(-45deg, ${tokens.hatchStripe} 0px, ${tokens.hatchStripe} 2px, transparent 2px, transparent 6px)`,
                      overflow: 'visible',
                    }}
                  >
                    {/* Filled Bar Anchored to Bottom */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: `${member.percent}%`,
                        minHeight: 28,
                        borderRadius: 8,
                        backgroundColor: resolvedBarBg,
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: '0 0 8px 10px',
                        zIndex: 5,
                        transition: 'height 260ms cubic-bezier(0.22, 1, 0.36, 1)',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11.5,
                          fontWeight: 500,
                          color: resolvedBarText,
                          fontVariantNumeric: 'tabular-nums',
                          lineHeight: 1,
                        }}
                      >
                        {member.percent}%
                      </span>
                    </div>

                    {/* Floating Dark Delta Callout Tooltip (e.g., ↑ 12%) */}
                    {member.deltaBadge && (
                      <div
                        style={{
                          position: 'absolute',
                          left: '50%',
                          bottom: `calc(${member.percent}% + 8px)`,
                          transform: 'translateX(-50%)',
                          backgroundColor: tokens.ctaDarkBg,
                          color: tokens.ctaDarkText,
                          fontSize: 10.5,
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: 9999,
                          whiteSpace: 'nowrap',
                          zIndex: 8,
                          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.16)',
                        }}
                      >
                        {member.deltaBadge}
                        <span
                          aria-hidden="true"
                          style={{
                            position: 'absolute',
                            left: '50%',
                            bottom: -4,
                            transform: 'translateX(-50%) rotate(45deg)',
                            width: 7,
                            height: 7,
                            backgroundColor: tokens.ctaDarkBg,
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Member Avatar + Name Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: 10,
              marginTop: 10,
            }}
          >
            {members.map((member) => (
              <div
                key={member.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '9999px',
                    backgroundColor: member.avatarBg,
                    color: member.avatarColor,
                    fontSize: 9.5,
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {member.initial}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: tokens.textSecondary,
                  }}
                >
                  {member.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

