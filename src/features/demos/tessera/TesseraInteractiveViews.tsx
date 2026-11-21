import React, { useState } from 'react';
import { CheckCircle2, Plus, X } from 'lucide-react';
import { TESSERA_SPACING } from './theme';
import type {
  TesseraThemeTokens,
  TesseraWorkItem,
} from './types';
import { TesseraPortraitAvatar, TesseraSparkleIcon } from './TesseraIcons';

export interface TesseraWorkItemListProps {
  title: string;
  items: TesseraWorkItem[];
  onCycleStatus: (id: string) => void;
  onCreateClick: () => void;
  tokens: TesseraThemeTokens;
}

export const TesseraWorkItemList: React.FC<TesseraWorkItemListProps> = ({
  title,
  items,
  onCycleStatus,
  onCreateClick,
  tokens,
}) => {
  const statusColors: Record<
    TesseraWorkItem['status'],
    { bg: string; color: string }
  > = {
    Backlog: {
      bg: tokens.mode === 'dark' ? 'rgba(148,163,184,0.16)' : '#F3F4F6',
      color: tokens.textSecondary,
    },
    'Not started': {
      bg: tokens.mode === 'dark' ? 'rgba(249,115,22,0.18)' : '#FFF7ED',
      color: '#EA580C',
    },
    'Working on': {
      bg: tokens.mode === 'dark' ? 'rgba(37,99,235,0.2)' : '#EFF6FF',
      color: '#2563EB',
    },
    Completed: {
      bg: tokens.mode === 'dark' ? 'rgba(22,163,74,0.2)' : '#ECFDF3',
      color: '#16A34A',
    },
  };

  return (
    <div
      style={{
        borderRadius: TESSERA_SPACING.cardRadius,
        border: `1px solid ${tokens.borderCard}`,
        backgroundColor: tokens.cardBg,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '12px 16px',
          borderBottom: `1px solid ${tokens.borderSubtle}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <strong style={{ fontSize: 14, fontWeight: 600, color: tokens.textPrimary }}>
            {title}
          </strong>
          <span
            style={{
              fontSize: 11.5,
              color: tokens.textMuted,
              backgroundColor: tokens.surfaceSubtle,
              padding: '1px 7px',
              borderRadius: 9999,
            }}
          >
            {items.length}
          </span>
        </div>

        <button
          type="button"
          onClick={onCreateClick}
          style={{
            height: 28,
            padding: '0 10px',
            borderRadius: 7,
            border: `1px solid ${tokens.borderControl}`,
            backgroundColor: tokens.cardBg,
            color: tokens.textPrimary,
            fontSize: 12,
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            cursor: 'pointer',
          }}
        >
          <Plus size={13} />
          <span>New work item</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div style={{ padding: 28, textAlign: 'center', fontSize: 13, color: tokens.textMuted }}>
          No work items match the current filter.
        </div>
      ) : (
        <div>
          {items.map((item, idx) => {
            const st = statusColors[item.status];
            return (
              <div
                key={item.id}
                style={{
                  padding: '11px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  borderBottom:
                    idx < items.length - 1
                      ? `1px solid ${tokens.borderSubtle}`
                      : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <code
                    style={{
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: tokens.textMuted,
                      flexShrink: 0,
                    }}
                  >
                    {item.code}
                  </code>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: tokens.textPrimary,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.title}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <span style={{ fontSize: 11.5, color: tokens.textMuted }}>
                    {item.project} · {item.dueDate}
                  </span>
                  <button
                    type="button"
                    onClick={() => onCycleStatus(item.id)}
                    title="Click to cycle status"
                    style={{
                      padding: '3px 9px',
                      borderRadius: 9999,
                      border: 'none',
                      backgroundColor: st.bg,
                      color: st.color,
                      fontSize: 11.5,
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    {item.status}
                  </button>
                  <TesseraPortraitAvatar preset={item.assigneeAvatar} size={22} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface ModalFrameProps {
  open: boolean;
  title: string;
  onClose: () => void;
  tokens: TesseraThemeTokens;
  children: React.ReactNode;
}

const TesseraModalFrame: React.FC<ModalFrameProps> = ({
  open,
  title,
  onClose,
  tokens,
  children,
}) => {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(15, 23, 42, 0.42)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 440,
          borderRadius: 14,
          border: `1px solid ${tokens.borderCard}`,
          backgroundColor: tokens.cardBg,
          boxShadow: tokens.popoverShadow,
          padding: 18,
          color: tokens.textPrimary,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 14,
          }}
        >
          <strong style={{ fontSize: 15, fontWeight: 600 }}>{title}</strong>
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              border: 'none',
              backgroundColor: tokens.surfaceSubtle,
              color: tokens.textMuted,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={14} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export interface TesseraNewWorkItemModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (title: string, project: string, status: TesseraWorkItem['status']) => void;
  tokens: TesseraThemeTokens;
}

export const TesseraNewWorkItemModal: React.FC<TesseraNewWorkItemModalProps> = ({
  open,
  onClose,
  onCreate,
  tokens,
}) => {
  const [title, setTitle] = useState('');
  const [project, setProject] = useState('Tessera Core');
  const [status, setStatus] = useState<TesseraWorkItem['status']>('Working on');

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: 36,
    borderRadius: 8,
    border: `1px solid ${tokens.borderControl}`,
    backgroundColor: tokens.surfaceSubtle,
    color: tokens.textPrimary,
    padding: '0 10px',
    fontSize: 13,
    fontFamily: 'inherit',
    outline: 'none',
  };

  return (
    <TesseraModalFrame
      open={open}
      title="New work item"
      onClose={onClose}
      tokens={tokens}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          onCreate(title.trim(), project, status);
          setTitle('');
          onClose();
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        <div>
          <label
            htmlFor="tessera-wi-title"
            style={{ display: 'block', fontSize: 12, color: tokens.textMuted, marginBottom: 5 }}
          >
            Title
          </label>
          <input
            id="tessera-wi-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. TSR-64 Refine empty state animations"
            style={inputStyle}
            autoFocus
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label
              htmlFor="tessera-wi-project"
              style={{ display: 'block', fontSize: 12, color: tokens.textMuted, marginBottom: 5 }}
            >
              Project
            </label>
            <select
              id="tessera-wi-project"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              style={inputStyle}
            >
              <option value="Tessera Core">Tessera Core</option>
              <option value="OKRs Q4">OKRs Q4</option>
              <option value="Hiring">Hiring</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="tessera-wi-status"
              style={{ display: 'block', fontSize: 12, color: tokens.textMuted, marginBottom: 5 }}
            >
              Status
            </label>
            <select
              id="tessera-wi-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TesseraWorkItem['status'])}
              style={inputStyle}
            >
              <option value="Backlog">Backlog</option>
              <option value="Not started">Not started</option>
              <option value="Working on">Working on</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 6 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              height: 32,
              padding: '0 12px',
              borderRadius: 8,
              border: `1px solid ${tokens.borderControl}`,
              backgroundColor: tokens.cardBg,
              color: tokens.textSecondary,
              fontSize: 12.5,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              height: 32,
              padding: '0 14px',
              borderRadius: 8,
              border: 'none',
              backgroundColor: tokens.ctaDarkBg,
              color: tokens.ctaDarkText,
              fontSize: 12.5,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Create item
          </button>
        </div>
      </form>
    </TesseraModalFrame>
  );
};

export const TesseraRecapModal: React.FC<{
  open: boolean;
  onClose: () => void;
  tokens: TesseraThemeTokens;
}> = ({ open, onClose, tokens }) => (
  <TesseraModalFrame
    open={open}
    title="Sprint 14 Weekly Recap"
    onClose={onClose}
    tokens={tokens}
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div
        style={{
          padding: 12,
          borderRadius: 10,
          background: tokens.recapGradient,
          border: `1px solid ${tokens.borderSubtle}`,
          fontSize: 12.5,
          lineHeight: 1.5,
          color: tokens.textSecondary,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontWeight: 600,
            color: tokens.textPrimary,
            marginBottom: 6,
          }}
        >
          <TesseraSparkleIcon size={13} color={tokens.accentBlue} />
          <span>AI Summary · Tessera Core</span>
        </div>
        You closed 6 work items this week with 71% of Sprint 14 completed. Priya leads team throughput at 87% (+12%), while TSR-39 and TSR-41 are scheduled for review at 3:00 PM today.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5 }}>
        {[
          'Completed TSR-27 Hiring pipeline review',
          'Logged 120h of 240h Sprint 14 capacity (50%)',
          '2 items due today: TSR-39 & TSR-41',
        ].map((line) => (
          <div key={line} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={14} color="#16A34A" />
            <span>{line}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            height: 32,
            padding: '0 14px',
            borderRadius: 8,
            border: 'none',
            backgroundColor: tokens.ctaDarkBg,
            color: tokens.ctaDarkText,
            fontSize: 12.5,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Done
        </button>
      </div>
    </div>
  </TesseraModalFrame>
);

