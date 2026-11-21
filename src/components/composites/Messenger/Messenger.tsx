import React, { useEffect, useRef, useState } from 'react';
import { buildSeedMessengerConversations } from './messengerData';
import { MessengerSidebar } from './MessengerSidebar';
import { MessengerChatPane } from './MessengerChatPane';
import type { MessengerConversation, MessengerMessage, MessengerProps } from './types';

/**
 * ============================================================================
 * uxiGL COMPOSITE — WHATSAPP-LIKE ENTERPRISE MESSENGER
 * ============================================================================
 * Modular SOLID architecture:
 * - MessengerSidebar: conversation list, search, unread/pinned filters
 * - MessengerChatPane: bubbles, read receipts, reply quotes, reactions, composer
 * - Messenger: state orchestration, responsive split/mobile pane, storageKey sync
 */
export const Messenger: React.FC<MessengerProps> = ({
  conversations: controlledConversations,
  onConversationsChange,
  initialConversations,
  storageKey,
  locale = 'tr',
  height = 560,
  compact: forcedCompact,
  enableAutoReply = true,
  onSendMessage,
  className = '',
  style,
}) => {
  const isTR = locale === 'tr';
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [measuredCompact, setMeasuredCompact] = useState(false);

  const [internalConversations, setInternalConversations] = useState<MessengerConversation[]>(() => {
    if (storageKey && typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // ignore storage errors
      }
    }
    return initialConversations ?? buildSeedMessengerConversations(locale);
  });

  const conversations = controlledConversations ?? internalConversations;
  const [activeId, setActiveId] = useState<string>(() => conversations[0]?.id ?? '');
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  useEffect(() => {
    if (forcedCompact !== undefined) return;
    const el = hostRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const update = () => setMeasuredCompact(el.clientWidth > 0 && el.clientWidth < 620);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [forcedCompact]);

  const isCompact = forcedCompact ?? measuredCompact;

  const updateConversations = (
    updater: (prev: MessengerConversation[]) => MessengerConversation[]
  ) => {
    if (controlledConversations && onConversationsChange) {
      onConversationsChange(updater(controlledConversations));
      return;
    }
    setInternalConversations((prev) => {
      const next = updater(prev);
      if (storageKey && typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          // ignore storage errors
        }
      }
      onConversationsChange?.(next);
      return next;
    });
  };

  const activeConv =
    conversations.find((c) => c.id === activeId) ?? conversations[0];

  const handleSelectConversation = (id: string) => {
    setActiveId(id);
    if (isCompact) setMobileView('chat');
    updateConversations((prev) =>
      prev.map((c) => (c.id === id && c.unreadCount > 0 ? { ...c, unreadCount: 0 } : c))
    );
  };

  const handleSend = (text: string, replyTo?: MessengerMessage['replyTo']) => {
    if (!activeConv) return;
    const now = new Date();
    const timestamp = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;
    const newMsg: MessengerMessage = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text,
      timestamp,
      status: 'delivered',
      replyTo,
    };

    const targetId = activeConv.id;
    updateConversations((prev) =>
      prev.map((c) =>
        c.id === targetId
          ? { ...c, unreadCount: 0, messages: [...c.messages, newMsg] }
          : c
      )
    );
    onSendMessage?.(targetId, newMsg);

    if (enableAutoReply && !controlledConversations) {
      setTimeout(() => {
        updateConversations((prev) =>
          prev.map((c) => (c.id === targetId ? { ...c, typing: true } : c))
        );
      }, 280);
      setTimeout(() => {
        const replyNow = new Date();
        const replyTs = `${String(replyNow.getHours()).padStart(2, '0')}:${String(
          replyNow.getMinutes()
        ).padStart(2, '0')}`;
        const replyMsg: MessengerMessage = {
          id: `msg-reply-${Date.now()}`,
          sender: 'them',
          text: isTR
            ? 'Anlaşıldı, notumu aldım! Birazdan güncellemeyi paylaşıyorum 👍'
            : 'Got it, noted! Sharing an update shortly 👍',
          timestamp: replyTs,
          status: 'read',
        };
        updateConversations((prev) =>
          prev.map((c) =>
            c.id === targetId
              ? {
                  ...c,
                  typing: false,
                  messages: [
                    ...c.messages.map((m) =>
                      m.id === newMsg.id ? { ...m, status: 'read' as const } : m
                    ),
                    replyMsg,
                  ],
                }
              : c
          )
        );
      }, 1150);
    }
  };

  const handleTogglePin = () => {
    if (!activeConv) return;
    updateConversations((prev) =>
      prev.map((c) => (c.id === activeConv.id ? { ...c, pinned: !c.pinned } : c))
    );
  };

  const handleToggleMute = () => {
    if (!activeConv) return;
    updateConversations((prev) =>
      prev.map((c) => (c.id === activeConv.id ? { ...c, muted: !c.muted } : c))
    );
  };

  const handleReact = (messageId: string, emoji: string) => {
    if (!activeConv) return;
    updateConversations((prev) =>
      prev.map((c) =>
        c.id === activeConv.id
          ? {
              ...c,
              messages: c.messages.map((m) => {
                if (m.id !== messageId) return m;
                const existing = m.reactions ?? [];
                const next = existing.includes(emoji)
                  ? existing.filter((e) => e !== emoji)
                  : [...existing, emoji];
                return { ...m, reactions: next };
              }),
            }
          : c
      )
    );
  };

  return (
    <div
      ref={hostRef}
      className={`uxu-messenger ${className}`.trim()}
      style={{
        display: 'grid',
        gridTemplateColumns: isCompact ? '1fr' : '290px minmax(0, 1fr)',
        gridTemplateRows: 'minmax(0, 1fr)',
        height,
        minHeight: height === '100%' ? 0 : 360,
        borderRadius: 'var(--uxu-radius-lg)',
        border: '1px solid var(--uxu-border-subtle)',
        overflow: 'hidden',
        backgroundColor: 'var(--uxu-bg-elevated)',
        boxShadow: 'var(--uxu-specular-inset)',
        ...style,
      }}
    >
      {(!isCompact || mobileView === 'list') && (
        <MessengerSidebar
          conversations={conversations}
          activeId={activeConv?.id ?? ''}
          locale={locale}
          onSelect={handleSelectConversation}
        />
      )}

      {(!isCompact || mobileView === 'chat') && activeConv && (
        <MessengerChatPane
          conversation={activeConv}
          locale={locale}
          showBackButton={isCompact}
          onBack={() => setMobileView('list')}
          onSend={handleSend}
          onTogglePin={handleTogglePin}
          onToggleMute={handleToggleMute}
          onReact={handleReact}
        />
      )}
    </div>
  );
};
