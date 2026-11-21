import React from 'react';
import {
  Calendar,
  Clock,
  ExternalLink,
  MessageSquare,
  Pencil,
  PlusCircle,
  Users,
} from 'lucide-react';
import { TESSERA_SPACING, TESSERA_TYPOGRAPHY } from './theme';
import type {
  TesseraThemeTokens,
  TesseraUpcomingEvent,
  TesseraUserProfile,
} from './types';
import {
  TesseraPortraitAvatar,
  TesseraSparkleIcon,
  TesseraVerifiedBadge,
} from './TesseraIcons';

export interface TesseraProfilePanelProps {
  profile: TesseraUserProfile;
  upcomingEvents: TesseraUpcomingEvent[];
  recapDismissed: boolean;
  onEditProfile: () => void;
  onMessage: () => void;
  onAssign: () => void;
  onShareProfile: () => void;
  onGenerateRecap: () => void;
  onDismissRecap: () => void;
  onEventClick?: (event: TesseraUpcomingEvent) => void;
  tokens: TesseraThemeTokens;
}

function renderEventIcon(event: TesseraUpcomingEvent): React.ReactNode {
  switch (event.iconKind) {
    case 'clock':
      return <Clock size={14} strokeWidth={2} color={event.accentColor} />;
    case 'calendar':
      return <Calendar size={14} strokeWidth={2} color={event.accentColor} />;
    case 'team':
      return <Users size={14} strokeWidth={2} color={event.accentColor} />;
  }
}

export const TesseraProfilePanel: React.FC<TesseraProfilePanelProps> = ({
  profile,
  upcomingEvents,
  recapDismissed,
  onEditProfile,
  onMessage,
  onAssign,
  onShareProfile,
  onGenerateRecap,
  onDismissRecap,
  onEventClick,
  tokens,
}) => {
  const isDark = tokens.mode === 'dark';

  const profileActionStyle: React.CSSProperties = {
    height: 32,
    borderRadius: 8,
    border: `1px solid ${tokens.borderControl}`,
    backgroundColor: tokens.cardBg,
    color: tokens.textPrimary,
    fontSize: 12,
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    cursor: 'pointer',
    boxShadow: tokens.cardShadow,
  };

  return (
    <aside
      aria-label="Member Profile and Schedule"
      className="tessera-right-panel"
      style={{
        width: TESSERA_SPACING.rightPanelWidth,
        flexShrink: 0,
        backgroundColor: tokens.panelBg,
        borderLeft: `1px solid ${tokens.borderSubtle}`,
        padding: TESSERA_SPACING.rightPanelPadding,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 16,
        overflowY: 'auto',
      }}
    >
      <div>
        {/* Watercolor Aurora Cover Banner */}
        <div
          style={{
            position: 'relative',
            height: 84,
            borderRadius: 12,
            background: tokens.bannerGradient,
            overflow: 'hidden',
          }}
        >
          <button
            type="button"
            aria-label="Edit profile"
            title="Edit profile"
            onClick={onEditProfile}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 28,
              height: 28,
              borderRadius: 7,
              border: `1px solid ${tokens.borderSubtle}`,
              backgroundColor: isDark
                ? 'rgba(15, 19, 27, 0.78)'
                : 'rgba(255, 255, 255, 0.85)',
              color: tokens.textSecondary,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Pencil size={13} strokeWidth={1.85} />
          </button>
        </div>

        {/* Overlapping 64px Avatar */}
        <div style={{ marginTop: -34, marginLeft: 14, position: 'relative', zIndex: 2 }}>
          <TesseraPortraitAvatar
            preset={profile.avatarPreset}
            size={64}
            border={`3px solid ${tokens.panelBg}`}
          />
        </div>

        {/* Identity Row */}
        <div style={{ marginTop: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <h2
              style={{
                margin: 0,
                ...TESSERA_TYPOGRAPHY.scale.profileName,
                color: tokens.textPrimary,
              }}
            >
              {profile.name}
            </h2>
            {profile.verified && <TesseraVerifiedBadge size={15} />}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 3,
            }}
          >
            <span style={{ fontSize: 12.5, color: tokens.textMuted }}>
              {profile.handle}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                padding: '1px 7px',
                borderRadius: 9999,
                backgroundColor: isDark ? 'rgba(22, 163, 74, 0.2)' : '#DCFCE7',
                color: isDark ? '#4ADE80' : '#15803D',
              }}
            >
              {profile.status}
            </span>
          </div>
        </div>

        {/* 3 Action Buttons: Message / Assign / Share */}
        <div
          style={{
            marginTop: 14,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 8,
          }}
        >
          <button type="button" onClick={onMessage} style={profileActionStyle}>
            <MessageSquare size={13} strokeWidth={1.85} color={tokens.textMuted} />
            <span>Message</span>
          </button>
          <button type="button" onClick={onAssign} style={profileActionStyle}>
            <PlusCircle size={13} strokeWidth={1.85} color={tokens.textMuted} />
            <span>Assign</span>
          </button>
          <button type="button" onClick={onShareProfile} style={profileActionStyle}>
            <ExternalLink size={13} strokeWidth={1.85} color={tokens.textMuted} />
            <span>Share</span>
          </button>
        </div>

        {/* Metadata Tiles: Joined & Timezone */}
        <div
          style={{
            marginTop: 14,
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 8,
          }}
        >
          <div
            style={{
              padding: TESSERA_SPACING.tilePadding,
              borderRadius: TESSERA_SPACING.tileRadius,
              backgroundColor: tokens.surfaceSubtle,
              border: `1px solid ${tokens.borderSubtle}`,
            }}
          >
            <div style={{ fontSize: 11.5, color: tokens.textMuted }}>Joined</div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: tokens.textPrimary,
                marginTop: 3,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {profile.joined}
            </div>
          </div>

          <div
            style={{
              padding: TESSERA_SPACING.tilePadding,
              borderRadius: TESSERA_SPACING.tileRadius,
              backgroundColor: tokens.surfaceSubtle,
              border: `1px solid ${tokens.borderSubtle}`,
            }}
          >
            <div style={{ fontSize: 11.5, color: tokens.textMuted }}>Timezone</div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: tokens.textPrimary,
                marginTop: 3,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {profile.timezone}
            </div>
          </div>
        </div>

        {/* Sprint 14 progress Card */}
        <div
          style={{
            marginTop: 8,
            padding: 12,
            borderRadius: TESSERA_SPACING.tileRadius,
            backgroundColor: tokens.surfaceSubtle,
            border: `1px solid ${tokens.borderSubtle}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 12,
            }}
          >
            <span style={{ color: tokens.textMuted }}>{profile.sprintName}</span>
            <span
              style={{
                fontWeight: 600,
                color: tokens.textPrimary,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {profile.sprintProgress}%
            </span>
          </div>

          {/* Gradient Bar + Dot Marker + Vertical Tick Remainder */}
          <div
            style={{
              marginTop: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <div
              style={{
                width: `${profile.sprintProgress}%`,
                height: 6,
                borderRadius: 9999,
                background:
                  'linear-gradient(90deg, #F87171 0%, #D946EF 45%, #3B82F6 100%)',
                flexShrink: 0,
              }}
            />
            <span
              aria-hidden="true"
              style={{
                width: 9,
                height: 9,
                borderRadius: '9999px',
                backgroundColor: tokens.cardBg,
                border: '2px solid #EF4444',
                flexShrink: 0,
              }}
            />
            <div
              aria-hidden="true"
              style={{
                flex: 1,
                height: 6,
                backgroundImage: `repeating-linear-gradient(90deg, ${
                  isDark ? 'rgba(255,255,255,0.18)' : '#D1D5DB'
                } 0px, ${
                  isDark ? 'rgba(255,255,255,0.18)' : '#D1D5DB'
                } 1.5px, transparent 1.5px, transparent 4.5px)`,
              }}
            />
          </div>
        </div>

        {/* Upcoming Events */}
        <div style={{ marginTop: 18 }}>
          <h3
            style={{
              margin: '0 0 12px',
              ...TESSERA_TYPOGRAPHY.scale.sectionTitle,
              color: tokens.textPrimary,
            }}
          >
            Upcoming
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {upcomingEvents.map((ev) => (
              <button
                key={ev.id}
                type="button"
                onClick={() => onEventClick?.(ev)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 11,
                  textAlign: 'left',
                  cursor: onEventClick ? 'pointer' : 'default',
                }}
              >
                <span
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 9,
                    border: `1px solid ${tokens.borderSubtle}`,
                    backgroundColor: isDark ? tokens.surfaceSubtle : ev.accentBg,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {renderEventIcon(ev)}
                </span>

                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: tokens.textPrimary,
                      lineHeight: 1.3,
                    }}
                  >
                    {ev.title}
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: tokens.textMuted,
                      marginTop: 1,
                    }}
                  >
                    {ev.schedule}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom AI Weekly Recap Promo Card */}
      {!recapDismissed && (
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            padding: 16,
            borderRadius: 14,
            border: `1px solid ${tokens.borderCard}`,
            background: tokens.recapGradient,
          }}
        >
          {/* Top-right white dot matrix accent */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 110,
              height: 80,
              backgroundImage:
                'radial-gradient(rgba(255, 255, 255, 0.72) 1px, transparent 1px)',
              backgroundSize: '8px 8px',
              WebkitMaskImage:
                'radial-gradient(circle at 85% 20%, rgba(0,0,0,1) 0%, transparent 72%)',
              maskImage:
                'radial-gradient(circle at 85% 20%, rgba(0,0,0,1) 0%, transparent 72%)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              width: 32,
              height: 32,
              borderRadius: 9,
              backgroundColor: tokens.cardBg,
              border: `1px solid ${tokens.borderSubtle}`,
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.06)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: tokens.textPrimary,
            }}
          >
            <TesseraSparkleIcon size={15} color={tokens.textPrimary} />
          </div>

          <h3
            style={{
              position: 'relative',
              zIndex: 1,
              margin: '12px 0 6px',
              fontSize: 14.5,
              fontWeight: 600,
              letterSpacing: '-0.015em',
              color: tokens.textPrimary,
            }}
          >
            Your week, summarized
          </h3>

          <p
            style={{
              position: 'relative',
              zIndex: 1,
              margin: 0,
              fontSize: 12.5,
              lineHeight: 1.45,
              color: tokens.textMuted,
            }}
          >
            6 items closed and 2 due today. Get a quick recap before standup.
          </p>

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              marginTop: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <button
              type="button"
              onClick={onGenerateRecap}
              style={{
                height: 32,
                padding: '0 13px',
                borderRadius: 8,
                border: 'none',
                backgroundColor: tokens.ctaDarkBg,
                color: tokens.ctaDarkText,
                fontSize: 12,
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
              }}
            >
              <TesseraSparkleIcon size={12} color={tokens.ctaDarkText} />
              <span>Generate recap</span>
            </button>

            <button
              type="button"
              onClick={onDismissRecap}
              style={{
                height: 32,
                padding: '0 13px',
                borderRadius: 8,
                border: `1px solid ${tokens.borderControl}`,
                backgroundColor: tokens.cardBg,
                color: tokens.textSecondary,
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Later
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

