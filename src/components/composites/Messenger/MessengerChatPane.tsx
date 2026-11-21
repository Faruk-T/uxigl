import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Paperclip,
  Pin,
  Reply,
  Send,
  Smile,
  X,
} from 'lucide-react';
import { Avatar } from '../../primitives/Avatar/Avatar';
import type { MessengerConversation, MessengerMessage } from './types';

export interface MessengerChatPaneProps {
  conversation: MessengerConversation;
  locale: 'tr' | 'en';
  showBackButton?: boolean;
  onBack?: () => void;
  onSend: (text: string, replyTo?: MessengerMessage['replyTo']) => void;
  onTogglePin: () => void;
  onToggleMute: () => void;
  onReact: (messageId: string, emoji: string) => void;
}

const QUICK_EMOJIS = ['👍', '❤️', '😂', '🚀', '👏'];

export const MessengerChatPane: React.FC<MessengerChatPaneProps> = ({
  conversation,
  locale,
  showBackButton = false,
  onBack,
  onSend,
  onTogglePin,
  onToggleMute,
  onReact,
}) => {
  const isTR = locale === 'tr';
  const [draft, setDraft] = useState('');
  const [replyTarget, setReplyTarget] = useState<MessengerMessage | null>(null);
  const [emojiMenuOpen, setEmojiMenuOpen] = useState(false);
  const [hoveredMsgId, setHoveredMsgId] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ behavior: 'smooth' });
  }, [conversation.id, conversation.messages.length, conversation.typing]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const clean = draft.trim();
    if (!clean) return;
    onSend(
      clean,
      replyTarget
        ? {
            id: replyTarget.id,
            senderName: replyTarget.sender === 'me' ? (isTR ? 'Sen' : 'You') : conversation.name,
            text: replyTarget.text,
          }
        : undefined
    );
    setDraft('');
    setReplyTarget(null);
    setEmojiMenuOpen(false);
  };

  const presenceLabel = conversation.typing
    ? isTR
      ? 'yazıyor...'
      : 'typing...'
    : conversation.status === 'online'
    ? isTR
      ? 'Çevrimiçi'
      : 'Online'
    : conversation.lastSeen ?? (isTR ? 'Çevrimdışı' : 'Offline');

  return (
    <section
      aria-label={conversation.name}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        backgroundColor: 'var(--uxu-bg-elevated)',
      }}
    >
      {/* Active Chat Header */}
      <header
        style={{
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          borderBottom: '1px solid var(--uxu-border-subtle)',
          backgroundColor: 'var(--uxu-surface-tonal)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          {showBackButton && (
            <button
              type="button"
              onClick={onBack}
              aria-label={isTR ? 'Geri' : 'Back'}
              style={{
                width: 30,
                height: 30,
                borderRadius: 999,
                border: 'none',
                backgroundColor: 'var(--uxu-surface-tonal-high)',
                color: 'var(--uxu-text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <ArrowLeft size={15} />
            </button>
          )}
          <Avatar
            src={conversation.avatarUrl}
            name={conversation.name}
            size="sm"
            shape="circle"
            status={conversation.status}
            tone={conversation.tone ?? 'primary'}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--uxu-text-primary)' }}>
              {conversation.name}
            </div>
            <div
              style={{
                fontSize: '0.73rem',
                color: conversation.typing ? 'var(--uxu-primary)' : 'var(--uxu-text-secondary)',
                fontWeight: conversation.typing ? 600 : 400,
              }}
            >
              {conversation.role ? `${conversation.role} · ` : ''}
              {presenceLabel}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <button
            type="button"
            onClick={onTogglePin}
            title={isTR ? 'Sabitle / Kaldır' : 'Pin / Unpin'}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              border: 'none',
              backgroundColor: conversation.pinned ? 'var(--uxu-primary-container)' : 'transparent',
              color: conversation.pinned ? 'var(--uxu-on-primary-container)' : 'var(--uxu-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Pin size={15} />
          </button>
          <button
            type="button"
            onClick={onToggleMute}
            title={isTR ? 'Sesi Aç / Kapat' : 'Mute / Unmute'}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              border: 'none',
              backgroundColor: conversation.muted ? 'var(--uxu-primary-container)' : 'transparent',
              color: conversation.muted ? 'var(--uxu-on-primary-container)' : 'var(--uxu-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {conversation.muted ? <BellOff size={15} /> : <Bell size={15} />}
          </button>
        </div>
      </header>

      {/* Messages Thread */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          backgroundImage:
            'radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--uxu-primary) 5%, transparent) 0%, transparent 55%)',
        }}
      >
        <div style={{ alignSelf: 'center', fontSize: '0.7rem', fontWeight: 600, padding: '3px 10px', borderRadius: 999, backgroundColor: 'var(--uxu-surface-tonal)', color: 'var(--uxu-text-secondary)' }}>
          {isTR ? 'Bugün' : 'Today'}
        </div>

        {conversation.messages.map((msg) => {
          const isMe = msg.sender === 'me';
          return (
            <div
              key={msg.id}
              onMouseEnter={() => setHoveredMsgId(msg.id)}
              onMouseLeave={() => setHoveredMsgId(null)}
              style={{
                alignSelf: isMe ? 'flex-end' : 'flex-start',
                maxWidth: '78%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: isMe ? 'flex-end' : 'flex-start',
                position: 'relative',
              }}
            >
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  backgroundColor: isMe ? 'var(--uxu-primary)' : 'var(--uxu-surface-tonal)',
                  color: isMe ? 'var(--uxu-on-primary)' : 'var(--uxu-text-primary)',
                  border: isMe ? 'none' : '1px solid var(--uxu-border-subtle)',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.08)',
                  fontSize: '0.84rem',
                  lineHeight: 1.42,
                }}
              >
                {msg.replyTo && (
                  <div
                    style={{
                      padding: '4px 8px',
                      marginBottom: 6,
                      borderRadius: 6,
                      borderLeft: `3px solid ${isMe ? '#ffffff' : 'var(--uxu-primary)'}`,
                      backgroundColor: isMe ? 'rgba(255,255,255,0.16)' : 'var(--uxu-bg-elevated)',
                      fontSize: '0.73rem',
                      opacity: 0.92,
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>{msg.replyTo.senderName}</div>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>
                      {msg.replyTo.text}
                    </div>
                  </div>
                )}

                <div>{msg.text}</div>

                {msg.attachment && (
                  <div
                    style={{
                      marginTop: 6,
                      padding: '6px 9px',
                      borderRadius: 8,
                      backgroundColor: isMe ? 'rgba(255,255,255,0.16)' : 'var(--uxu-bg-elevated)',
                      border: '1px solid var(--uxu-border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 7,
                      fontSize: '0.75rem',
                    }}
                  >
                    <Paperclip size={13} />
                    <span style={{ fontWeight: 600 }}>{msg.attachment.name}</span>
                    <span style={{ opacity: 0.7 }}>{msg.attachment.size}</span>
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: 4,
                    marginTop: 3,
                    fontSize: '0.67rem',
                    opacity: isMe ? 0.85 : 0.65,
                  }}
                >
                  <span>{msg.timestamp}</span>
                  {isMe && (
                    msg.status === 'read' ? (
                      <CheckCheck size={13} color="#bae6fd" />
                    ) : (
                      <Check size={13} />
                    )
                  )}
                </div>
              </div>

              {/* Persistent Reactions Row */}
              {!!msg.reactions?.length && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                  {msg.reactions.map((em, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '0.74rem',
                        padding: '1px 6px',
                        borderRadius: 999,
                        backgroundColor: 'var(--uxu-surface-tonal)',
                        border: '1px solid var(--uxu-border-subtle)',
                      }}
                    >
                      {em}
                    </span>
                  ))}
                </div>
              )}

              {/* Floating Hover Quick Reply & Emoji Bar (zero layout shift) */}
              {hoveredMsgId === msg.id && (
                <div
                  style={{
                    position: 'absolute',
                    top: -14,
                    right: isMe ? 6 : 'auto',
                    left: isMe ? 'auto' : 6,
                    zIndex: 10,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 2,
                    padding: '2px 6px',
                    borderRadius: 999,
                    backgroundColor: 'var(--uxu-bg-elevated)',
                    border: '1px solid var(--uxu-border-subtle)',
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.14)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setReplyTarget(msg)}
                    title={isTR ? 'Yanıtla' : 'Reply'}
                    style={{ border: 'none', background: 'transparent', color: 'var(--uxu-text-secondary)', cursor: 'pointer', padding: 2, display: 'flex' }}
                  >
                    <Reply size={12} />
                  </button>
                  {QUICK_EMOJIS.slice(0, 3).map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => onReact(msg.id, em)}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0 2px', fontSize: '0.75rem' }}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {conversation.typing && (
          <div
            style={{
              alignSelf: 'flex-start',
              padding: '7px 12px',
              borderRadius: '14px 14px 14px 4px',
              backgroundColor: 'var(--uxu-surface-tonal)',
              border: '1px solid var(--uxu-border-subtle)',
              fontSize: '0.76rem',
              color: 'var(--uxu-text-secondary)',
              fontStyle: 'italic',
            }}
          >
            {conversation.name} {isTR ? 'yazıyor...' : 'is typing...'}
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Reply Preview Banner */}
      {replyTarget && (
        <div
          style={{
            padding: '6px 14px',
            backgroundColor: 'var(--uxu-surface-tonal)',
            borderTop: '1px solid var(--uxu-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            fontSize: '0.76rem',
          }}
        >
          <div style={{ borderLeft: '3px solid var(--uxu-primary)', paddingLeft: 8, minWidth: 0 }}>
            <div style={{ fontWeight: 700, color: 'var(--uxu-primary)' }}>
              {replyTarget.sender === 'me' ? (isTR ? 'Sen' : 'You') : conversation.name}
            </div>
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--uxu-text-secondary)' }}>
              {replyTarget.text}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setReplyTarget(null)}
            style={{ border: 'none', background: 'transparent', color: 'var(--uxu-text-secondary)', cursor: 'pointer', display: 'flex' }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Composer */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '10px 12px',
          borderTop: '1px solid var(--uxu-border-subtle)',
          backgroundColor: 'var(--uxu-surface-tonal)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          position: 'relative',
          flexShrink: 0,
        }}
      >
        {emojiMenuOpen && (
          <div
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 6px)',
              left: 12,
              padding: '5px 8px',
              borderRadius: 999,
              backgroundColor: 'var(--uxu-bg-elevated)',
              border: '1px solid var(--uxu-border-strong)',
              boxShadow: 'var(--uxu-shadow-elevated)',
              display: 'flex',
              gap: 6,
              zIndex: 10,
            }}
          >
            {QUICK_EMOJIS.map((em) => (
              <button
                key={em}
                type="button"
                onClick={() => {
                  setDraft((d) => `${d}${em}`);
                  setEmojiMenuOpen(false);
                }}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1rem' }}
              >
                {em}
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => setEmojiMenuOpen((v) => !v)}
          aria-label="Emoji"
          style={{
            width: 38,
            height: 38,
            borderRadius: 999,
            border: '1px solid var(--uxu-border-subtle)',
            outline: 'none',
            backgroundColor: 'var(--uxu-bg-elevated)',
            color: 'var(--uxu-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <Smile size={18} />
        </button>

        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={isTR ? 'Bir mesaj yazın...' : 'Type a message...'}
          aria-label={isTR ? 'Mesaj yazın' : 'Type a message'}
          style={{
            flex: 1,
            minWidth: 0,
            height: 38,
            boxSizing: 'border-box',
            padding: '0 16px',
            borderRadius: 999,
            border: '1px solid var(--uxu-border-subtle)',
            backgroundColor: 'var(--uxu-bg-elevated)',
            color: 'var(--uxu-text-primary)',
            fontSize: '0.84rem',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />

        <button
          type="submit"
          aria-label={isTR ? 'Gönder' : 'Send'}
          style={{
            width: 38,
            height: 38,
            borderRadius: 999,
            border: 'none',
            outline: 'none',
            backgroundColor: 'var(--uxu-primary)',
            color: 'var(--uxu-on-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px color-mix(in srgb, var(--uxu-primary) 28%, transparent)',
            flexShrink: 0,
          }}
        >
          <Send size={16} />
        </button>
      </form>
    </section>
  );
};
