import React, { useState } from 'react';
import { BellOff, Check, CheckCheck, Pin, Search } from 'lucide-react';
import { Avatar } from '../../primitives/Avatar/Avatar';
import type { MessengerConversation } from './types';

export interface MessengerSidebarProps {
  conversations: MessengerConversation[];
  activeId: string;
  locale: 'tr' | 'en';
  onSelect: (id: string) => void;
}

export const MessengerSidebar: React.FC<MessengerSidebarProps> = ({
  conversations,
  activeId,
  locale,
  onSelect,
}) => {
  const isTR = locale === 'tr';
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'pinned'>('all');

  const sorted = [...conversations]
    .filter((c) => {
      if (filter === 'unread' && c.unreadCount === 0) return false;
      if (filter === 'pinned' && !c.pinned) return false;
      const q = search.trim().toLowerCase();
      if (!q) return true;
      const lastText = c.messages[c.messages.length - 1]?.text ?? '';
      return (
        c.name.toLowerCase().includes(q) ||
        (c.role?.toLowerCase().includes(q) ?? false) ||
        lastText.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)));

  return (
    <aside
      aria-label={isTR ? 'Sohbet Listesi' : 'Conversations'}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        backgroundColor: 'var(--uxu-surface-tonal)',
        borderRight: '1px solid var(--uxu-border-subtle)',
      }}
    >
      {/* Search & Filter Header */}
      <div
        style={{
          padding: '12px 12px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          borderBottom: '1px solid var(--uxu-border-subtle)',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 10px',
            borderRadius: 999,
            backgroundColor: 'var(--uxu-bg-elevated)',
            border: '1px solid var(--uxu-border-subtle)',
          }}
        >
          <Search size={14} style={{ color: 'var(--uxu-text-tertiary)', flexShrink: 0 }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isTR ? 'Sohbet veya kişi ara...' : 'Search chats or people...'}
            aria-label={isTR ? 'Sohbet ara' : 'Search chats'}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: 'var(--uxu-text-primary)',
              fontSize: '0.82rem',
              fontFamily: 'inherit',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 4 }}>
          {(
            [
              { id: 'all', label: isTR ? 'Tümü' : 'All' },
              { id: 'unread', label: isTR ? 'Okunmamış' : 'Unread' },
              { id: 'pinned', label: isTR ? 'Sabitlenen' : 'Pinned' },
            ] as const
          ).map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                style={{
                  border: 'none',
                  borderRadius: 999,
                  padding: '3px 10px',
                  fontSize: '0.73rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: active
                    ? 'var(--uxu-primary-container)'
                    : 'transparent',
                  color: active
                    ? 'var(--uxu-on-primary-container)'
                    : 'var(--uxu-text-secondary)',
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversations List */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {sorted.length === 0 ? (
          <div style={{ padding: 20, textAlign: 'center', fontSize: '0.8rem', color: 'var(--uxu-text-tertiary)' }}>
            {isTR ? 'Eşleşen sohbet bulunamadı.' : 'No matching conversations.'}
          </div>
        ) : (
          sorted.map((conv) => {
            const isSelected = conv.id === activeId;
            const lastMsg = conv.messages[conv.messages.length - 1];
            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => onSelect(conv.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 10px',
                  borderRadius: 'var(--uxu-radius-md)',
                  border: isSelected
                    ? '1px solid var(--uxu-border-subtle)'
                    : '1px solid transparent',
                  outline: 'none',
                  backgroundColor: isSelected
                    ? 'var(--uxu-bg-elevated)'
                    : 'transparent',
                  boxShadow: isSelected ? '0 2px 8px rgba(15, 23, 42, 0.06)' : 'none',
                  color: 'var(--uxu-text-primary)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background-color 120ms ease',
                }}
              >
                <Avatar
                  src={conv.avatarUrl}
                  name={conv.name}
                  size="sm"
                  shape="circle"
                  status={conv.status}
                  tone={conv.tone ?? 'primary'}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {conv.name}
                    </span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        color: conv.unreadCount > 0 ? 'var(--uxu-primary)' : 'var(--uxu-text-tertiary)',
                        fontWeight: conv.unreadCount > 0 ? 700 : 500,
                        flexShrink: 0,
                      }}
                    >
                      {lastMsg?.timestamp ?? ''}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginTop: 2 }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: '0.75rem',
                        color: conv.typing ? 'var(--uxu-primary)' : 'var(--uxu-text-secondary)',
                        fontWeight: conv.typing ? 600 : 400,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        minWidth: 0,
                      }}
                    >
                      {!conv.typing && lastMsg?.sender === 'me' && (
                        lastMsg.status === 'read' ? (
                          <CheckCheck size={13} color="#3b82f6" style={{ flexShrink: 0 }} />
                        ) : (
                          <Check size={13} style={{ flexShrink: 0, opacity: 0.6 }} />
                        )
                      )}
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {conv.typing
                          ? isTR
                            ? 'yazıyor...'
                            : 'typing...'
                          : lastMsg?.text ?? ''}
                      </span>
                    </span>

                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                      {conv.muted && <BellOff size={11} style={{ opacity: 0.5 }} />}
                      {conv.pinned && <Pin size={11} style={{ opacity: 0.5 }} />}
                      {conv.unreadCount > 0 && (
                        <span
                          style={{
                            minWidth: 18,
                            height: 18,
                            padding: '0 5px',
                            borderRadius: 999,
                            backgroundColor: 'var(--uxu-primary)',
                            color: 'var(--uxu-on-primary)',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {conv.unreadCount}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
};
