import type { ReportCategory, ReportItem, ReportStatus } from './types';

export const REPORT_CATEGORY_META: Record<
  ReportCategory,
  { labelTr: string; labelEn: string; tone: 'primary' | 'info' | 'danger' | 'success' }
> = {
  finance: { labelTr: 'Finans & ERP', labelEn: 'Finance & ERP', tone: 'primary' },
  analytics: { labelTr: 'Analitik', labelEn: 'Analytics', tone: 'info' },
  security: { labelTr: 'Güvenlik', labelEn: 'Security', tone: 'danger' },
  compliance: { labelTr: 'Uyumluluk & SLA', labelEn: 'Compliance & SLA', tone: 'success' },
};

export const REPORT_STATUS_META: Record<
  ReportStatus,
  { labelTr: string; labelEn: string; tone: 'success' | 'primary' | 'warning' }
> = {
  ready: { labelTr: 'Hazır', labelEn: 'Ready', tone: 'success' },
  signed: { labelTr: 'İmzalı', labelEn: 'Signed', tone: 'primary' },
  scheduled: { labelTr: 'Planlandı', labelEn: 'Scheduled', tone: 'warning' },
};

export function buildSeedReports(locale: 'tr' | 'en' = 'tr'): ReportItem[] {
  const isTR = locale === 'tr';
  return [
    {
      id: 'rep-1',
      title: isTR
        ? 'Q3/Q4 Kurumsal Gelir & Büyüme Raporu'
        : 'Q3/Q4 Enterprise Revenue & Growth Report',
      description: isTR
        ? 'Departman bazlı gelir dağılımı, ARR büyümesi ve nakit akışı özeti.'
        : 'Department-level revenue breakdown, ARR growth, and cash flow summary.',
      category: 'finance',
      period: isTR ? 'Ekim 2026' : 'October 2026',
      formats: ['PDF', 'XLSX'],
      size: '4.8 MB',
      status: 'ready',
      generatedAt: isTR ? 'Bugün, 09:40' : 'Today, 09:40',
      author: 'FinOps Engine',
      summaryRows: [
        { label: isTR ? 'Net ARR' : 'Net ARR', value: '$1,284,900', delta: '+34.8%' },
        { label: isTR ? 'Brüt Marj' : 'Gross Margin', value: '%81.4', delta: '+2.1%' },
        { label: isTR ? 'Operasyonel Harcama' : 'OpEx', value: '$454,000', delta: '-4.2%' },
      ],
    },
    {
      id: 'rep-2',
      title: isTR
        ? 'Küresel Trafik Kaynakları & Dönüşüm Hunisi Analizi'
        : 'Global Traffic Sources & Conversion Funnel Analysis',
      description: isTR
        ? 'Organik, doğrudan ve referans kanalları üzerinden kullanıcı edinim metrikleri.'
        : 'User acquisition metrics across organic, direct, and referral channels.',
      category: 'analytics',
      period: isTR ? 'Son 30 Gün' : 'Last 30 Days',
      formats: ['PDF', 'CSV'],
      size: '2.4 MB',
      status: 'ready',
      generatedAt: isTR ? 'Dün, 18:15' : 'Yesterday, 18:15',
      author: 'Telemetry Pipeline',
      summaryRows: [
        { label: isTR ? 'Toplam Ziyaretçi' : 'Total Visitors', value: '45,672', delta: '+8.2%' },
        { label: isTR ? 'Dönüşüm Oranı' : 'Conversion Rate', value: '3.45%', delta: '+0.4%' },
      ],
    },
    {
      id: 'rep-3',
      title: isTR
        ? 'Zero-Trust Güvenlik, SLA (%99.98) ve Uptime Denetimi'
        : 'Zero-Trust Security, SLA (99.98%) & Uptime Audit',
      description: isTR
        ? 'Passkey doğrulama kayıtları, API erişim denetimi ve kesinti süresi raporu.'
        : 'Passkey verification logs, API access audit, and uptime compliance report.',
      category: 'security',
      period: isTR ? '2026 Yıllık' : '2026 Annual',
      formats: ['CSV', 'JSON'],
      size: '8.1 MB',
      status: 'signed',
      generatedAt: isTR ? '2 gün önce' : '2 days ago',
      author: 'Security Auditor',
      summaryRows: [
        { label: 'Uptime SLA', value: '99.98%', delta: '+0.02%' },
        { label: isTR ? 'Kritik İhlal' : 'Critical Incidents', value: '0', delta: 'Clean' },
      ],
    },
    {
      id: 'rep-4',
      title: isTR
        ? 'Tedarikçi Harcama & Sözleşme Uyumluluk Özeti'
        : 'Vendor Spend & Contract Compliance Summary',
      description: isTR
        ? 'SaaS, AI altyapısı ve bulut sözleşmelerinin yıllık yenileme takvimi.'
        : 'Annual renewal schedule for SaaS, AI infrastructure, and cloud contracts.',
      category: 'compliance',
      period: 'Q4 2026',
      formats: ['PDF', 'XLSX', 'CSV'],
      size: '3.2 MB',
      status: 'scheduled',
      generatedAt: isTR ? 'Otomatik • Her Pazartesi' : 'Auto • Every Monday',
      author: 'Procurement Ops',
      summaryRows: [
        { label: isTR ? 'Toplam Sözleşme' : 'Active Contracts', value: '38', delta: '100% compliant' },
        { label: isTR ? 'Yıllık Taahhüt' : 'Annual Commitment', value: '$454,000' },
      ],
    },
  ];
}

export function filterReports(
  reports: ReportItem[],
  query: string,
  category: ReportCategory | 'all'
): ReportItem[] {
  const q = query.trim().toLowerCase();
  return reports.filter((r) => {
    const catOk = category === 'all' || r.category === category;
    const queryOk =
      !q ||
      r.title.toLowerCase().includes(q) ||
      (r.description?.toLowerCase().includes(q) ?? false) ||
      r.period.toLowerCase().includes(q) ||
      r.author.toLowerCase().includes(q);
    return catOk && queryOk;
  });
}
