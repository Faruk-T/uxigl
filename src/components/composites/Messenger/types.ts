export type MessengerPresence = 'online' | 'away' | 'busy' | 'offline';
export type MessengerMessageStatus = 'sent' | 'delivered' | 'read';

export interface MessengerAttachment {
  name: string;
  size: string;
  kind: 'image' | 'file';
}

export interface MessengerMessage {
  id: string;
  sender: 'me' | 'them';
  text: string;
  timestamp: string;
  status?: MessengerMessageStatus;
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
  };
  attachment?: MessengerAttachment;
  reactions?: string[];
}

export interface MessengerConversation {
  id: string;
  name: string;
  role?: string;
  avatarUrl?: string;
  tone?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  status: MessengerPresence;
  lastSeen?: string;
  unreadCount: number;
  pinned?: boolean;
  muted?: boolean;
  typing?: boolean;
  messages: MessengerMessage[];
}

export interface MessengerProps {
  /** Controlled conversations array. */
  conversations?: MessengerConversation[];
  /** Controlled change handler. */
  onConversationsChange?: (next: MessengerConversation[]) => void;
  /** Initial seed conversations for uncontrolled mode. */
  initialConversations?: MessengerConversation[];
  /** Optional localStorage key for uncontrolled persistence. */
  storageKey?: string;
  /** UI language (`'tr' | 'en'`, default `'tr'`). */
  locale?: 'tr' | 'en';
  /** Component height (default `560`). */
  height?: number | string;
  /** Force single-pane mobile layout (auto-detected below 620px if omitted). */
  compact?: boolean;
  /** Simulate realistic typing & auto-reply in uncontrolled demo mode (default `true`). */
  enableAutoReply?: boolean;
  /** Callback fired whenever the user sends a message. */
  onSendMessage?: (conversationId: string, message: MessengerMessage) => void;
  className?: string;
  style?: React.CSSProperties;
}
