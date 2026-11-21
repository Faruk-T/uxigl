import type { MessengerConversation } from './types';

function makeStockPortrait(bg1: string, bg2: string, skin: string, hair: string, shirt: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${bg1}"/><stop offset="100%" stop-color="${bg2}"/></linearGradient></defs><rect width="80" height="80" fill="url(#g)"/><circle cx="40" cy="31" r="14" fill="${skin}"/><path d="M26 28c0-10 28-10 28 0-3-7-25-7-28 0z" fill="${hair}"/><path d="M16 74c2-15 12-22 24-22s22 7 24 22z" fill="${shirt}"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const STOCK_PROFILE_AVATARS = {
  woman1: makeStockPortrait('#dbeafe', '#93c5fd', '#f5cba7', '#2c1e16', '#2563eb'),
  man1: makeStockPortrait('#dcfce7', '#86efac', '#e5b887', '#1e293b', '#059669'),
  woman2: makeStockPortrait('#fce7f3', '#f9a8d4', '#f8d3b4', '#4a2511', '#db2777'),
};

export function buildSeedMessengerConversations(locale: 'tr' | 'en' = 'tr'): MessengerConversation[] {
  const isTR = locale === 'tr';
  return [
    {
      id: 'conv-selin',
      name: 'Selin Kaya',
      role: isTR ? 'Ürün Tasarım Lideri' : 'Product Design Lead',
      avatarUrl: STOCK_PROFILE_AVATARS.woman1,
      tone: 'primary',
      status: 'online',
      unreadCount: 2,
      pinned: true,
      messages: [
        {
          id: 'm-1',
          sender: 'them',
          text: isTR
            ? 'Merhaba! OSGL widget ızgarası ve yeni takvim tasarımı harika görünüyor.'
            : 'Hi! The OSGL widget grid and new calendar layout look super crisp.',
          timestamp: '14:12',
          status: 'read',
        },
        {
          id: 'm-2',
          sender: 'me',
          text: isTR
            ? 'Teşekkürler Selin, şimdi mobilde kaydırılabilir Dock ve canlı Zaman Akışı da eklendi.'
            : 'Thanks Selin! We also added the swipeable mobile dock and live Time Flow widget.',
          timestamp: '14:15',
          status: 'read',
        },
        {
          id: 'm-3',
          sender: 'them',
          text: isTR
            ? 'Harika! v2.9.2 sürüm notlarını akşama kadar paylaşabilir misin?'
            : 'Awesome! Could you share the v2.9.2 release notes before EOD?',
          timestamp: '14:18',
          status: 'read',
          reactions: ['👍', '🚀'],
        },
        {
          id: 'm-4',
          sender: 'them',
          text: isTR
            ? 'Ekran görüntülerini de Figma dosyasına ekledim.'
            : 'I also attached the screenshots to the Figma file.',
          timestamp: '14:19',
          status: 'read',
          attachment: {
            name: 'osgl-mobile-specs.fig',
            size: '2.4 MB',
            kind: 'file',
          },
        },
      ],
    },
    {
      id: 'conv-emre',
      name: 'Emre Demir',
      role: isTR ? 'Kıdemli Frontend Mühendisi' : 'Senior Frontend Engineer',
      tone: 'info',
      status: 'online',
      unreadCount: 1,
      pinned: true,
      messages: [
        {
          id: 'e-1',
          sender: 'me',
          text: isTR
            ? 'Emre, Vite lib build süresini kontrol ettin mi?'
            : 'Emre, did you check the Vite lib build duration?',
          timestamp: '13:40',
          status: 'read',
        },
        {
          id: 'e-2',
          sender: 'them',
          text: isTR
            ? 'Evet, 1.8 saniyede sıfır uyarıyla tamamlanıyor. Tüm 151 test geçti.'
            : 'Yes, finishes in 1.8s with zero errors. All 151 tests are green.',
          timestamp: '13:44',
          status: 'read',
        },
      ],
    },
    {
      id: 'conv-zeynep',
      name: 'Zeynep Aksoy',
      role: isTR ? 'Sistem Mimarı' : 'Systems Architect',
      avatarUrl: STOCK_PROFILE_AVATARS.woman2,
      tone: 'secondary',
      status: 'away',
      lastSeen: isTR ? 'Son görülme 12 dk önce' : 'Last seen 12m ago',
      unreadCount: 0,
      messages: [
        {
          id: 'z-1',
          sender: 'them',
          text: isTR
            ? 'SOLID katman ayrımı sayesinde yeni modüller temiz ilerliyor.'
            : 'Thanks to the SOLID layer separation, new modules stay super clean.',
          timestamp: '11:20',
          status: 'read',
        },
      ],
    },
    {
      id: 'conv-can',
      name: 'Can Yılmaz',
      role: isTR ? 'DevOps & Cloud' : 'DevOps & Cloud',
      avatarUrl: STOCK_PROFILE_AVATARS.man1,
      tone: 'success',
      status: 'busy',
      lastSeen: isTR ? 'Toplantıda' : 'In a meeting',
      unreadCount: 0,
      messages: [
        {
          id: 'c-1',
          sender: 'them',
          text: isTR
            ? 'CDN önbelleği güncellendi, yeni paket npm üzerinde yayına hazır.'
            : 'CDN cache refreshed, the new package is ready for npm publish.',
          timestamp: '10:05',
          status: 'read',
        },
      ],
    },
    {
      id: 'conv-elif',
      name: 'Elif Şahin',
      role: isTR ? 'QA & Otomasyon' : 'QA & Automation',
      tone: 'warning',
      status: 'offline',
      lastSeen: isTR ? 'Dün 19:40' : 'Yesterday 19:40',
      unreadCount: 0,
      muted: true,
      messages: [
        {
          id: 'el-1',
          sender: 'me',
          text: isTR
            ? 'E2E regresyon senaryolarını yarın sabah çalıştırabiliriz.'
            : 'We can run the E2E regression suite tomorrow morning.',
          timestamp: 'Dün',
          status: 'delivered',
        },
      ],
    },
  ];
}
