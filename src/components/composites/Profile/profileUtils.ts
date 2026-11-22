import type { ProfileData } from './types';

export function buildSeedProfileData(locale: 'tr' | 'en' = 'tr'): ProfileData {
  const isTR = locale === 'tr';
  return {
    name: 'Ümit Uz',
    role: 'SYSTEM ARCHITECT',
    location: isTR ? 'İstanbul, Türkiye' : 'Istanbul, Turkey',
    website: 'uxigl.truncgil.com',
    email: 'umit@truncgil.com',
    status: 'online',
    bio: isTR
      ? 'Modüler tasarım sistemleri, 8pt uzamsal grid mimarisi, WebGL2 veri sanallaştırma motorları (SheetGL, FileManGL) ve yüksek performanslı bulut mimarileri üzerine çalışıyorum.'
      : 'Designing modular design systems, 8pt spatial grid architectures, WebGL2 data virtualization engines (SheetGL, FileManGL), and high-throughput cloud platforms.',
    skills: [
      'TypeScript 5.8',
      'React 19',
      'WebGL2 Shaders',
      '8pt Spatial Grid',
      'Dynamic Tonal',
      'SheetGL',
      'FileManGL',
      'Zero-Trust IAM',
    ],
    isPublic: true,
    twoFactorEnabled: true,
    stats: [
      {
        id: 'commits',
        label: isTR ? 'Toplam Commit (2026)' : 'Total Commits (2026)',
        value: '4,820',
        delta: isTR ? '+18% bu ay' : '+18% this month',
      },
      {
        id: 'packages',
        label: isTR ? 'Yayınlanan NPM Paketi' : 'Published NPM Packages',
        value: isTR ? '14 Paket' : '14 Packages',
        delta: isTR ? 'v2.9.2 aktif' : 'v2.9.2 active',
      },
      {
        id: 'stars',
        label: isTR ? 'Açık Kaynak Yıldızı' : 'Open Source Stars',
        value: '3.4K ★',
        delta: 'GitHub Trending',
      },
      {
        id: 'compliance',
        label: isTR ? 'Mimari Uyum Skoru' : 'Architecture Score',
        value: '99.4%',
        delta: isTR ? '8pt Uzamsal Grid' : '8pt Spatial Grid',
      },
    ],
    sessions: [
      {
        id: 'sess-1',
        device: isTR
          ? 'Workstation Pro 16" (ARM64 • Masaüstü OS)'
          : 'Workstation Pro 16" (ARM64 • Desktop OS)',
        location: isTR
          ? 'İstanbul, TR • Mevcut Oturum'
          : 'Istanbul, TR • Current Session',
        active: true,
        lastActive: isTR ? 'Şimdi' : 'Now',
      },
      {
        id: 'sess-2',
        device: isTR
          ? 'Mobile Pro Max (Mobil OS • WebKit)'
          : 'Mobile Pro Max (Mobile OS • WebKit)',
        location: isTR
          ? 'İstanbul, TR • 14 dk önce'
          : 'Istanbul, TR • 14 mins ago',
        active: false,
        lastActive: isTR ? '14 dk önce' : '14m ago',
      },
    ],
    activities: [
      {
        id: 'act-1',
        time: isTR ? '10 dk önce' : '10m ago',
        text: isTR
          ? 'truncgil-uxigl@2.9.2 paketi NPM üzerinde yayınlandı.'
          : 'Published truncgil-uxigl@2.9.2 to NPM registry.',
        tone: 'primary',
      },
      {
        id: 'act-2',
        time: isTR ? '1 saat önce' : '1h ago',
        text: isTR
          ? '8pt uzamsal grid ve yüzey tokenları güncellendi.'
          : 'Updated 8pt spatial grid and glass surface tokens.',
        tone: 'success',
      },
      {
        id: 'act-3',
        time: isTR ? 'Dün' : 'Yesterday',
        text: isTR
          ? 'SheetGL finans veri kümesi (150K satır) senkronize edildi.'
          : 'Synced SheetGL finance dataset (150K rows).',
        tone: 'info',
      },
    ],
  };
}
